import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';
import upload, { getFileUrl, deleteFile } from '../utils/fileUpload.js';

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discount,
      stock,
      unit,
      tags,
      category,
      nutritionInfo,
      isActive,
      isFeatured,
      isOrganic,
      countryOfOrigin
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and category'
      });
    }
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Generate slug from name
    let slug = slugify(name);
    
    // Check if slug exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      // Try to generate a unique slug
      let attempt = 1;
      let uniqueSlug = generateUniqueSlug(slug, attempt);
      let slugExists = true;
      
      while (slugExists && attempt < 10) {
        const productWithSlug = await Product.findOne({ slug: uniqueSlug });
        if (productWithSlug) {
          attempt++;
          uniqueSlug = generateUniqueSlug(slug, attempt);
        } else {
          slugExists = false;
          slug = uniqueSlug;
        }
      }
      
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Unable to generate unique slug for product'
        });
      }
    }
    
    // Prepare tags array
    let tagsArray = [];
    if (tags) {
      if (typeof tags === 'string') {
        tagsArray = tags.split(',').map(tag => tag.trim());
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }
    
    // Prepare nutrition info
    let parsedNutritionInfo = null;
    if (nutritionInfo) {
      try {
        if (typeof nutritionInfo === 'string') {
          parsedNutritionInfo = JSON.parse(nutritionInfo);
        } else {
          parsedNutritionInfo = nutritionInfo;
        }
      } catch (error) {
        console.error('Error parsing nutrition info:', error);
      }
    }
    
    // Create product (without images first)
    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription: shortDescription || '',
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      stock: stock ? parseInt(stock, 10) : 0,
      unit: unit || 'item',
      tags: tagsArray,
      category,
      nutritionInfo: parsedNutritionInfo,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isOrganic: isOrganic === 'true' || isOrganic === true,
      countryOfOrigin: countryOfOrigin || 'Unknown',
      images: []
    });
    
    // Process images if uploaded
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => {
        return {
          url: getFileUrl(file.path, req),
          alt: `${name} image ${index + 1}`,
          isPrimary: index === 0 // First image is primary
        };
      });
      
      // Update product with images
      product.images = images;
      await product.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all products with pagination and filtering
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    // Destructure query parameters with defaults
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      category,
      tag,
      search,
      minPrice,
      maxPrice,
      isOrganic,
      isFeatured
    } = req.query;
    
    // Pagination
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    
    // Base query
    const query = { isActive: true };
    
    // Add filters if provided
    if (category) {
      // Find category and all its subcategories
      let categoryIds = [category];
      
      // Check if it's a slug or ID
      let categoryDoc;
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        categoryDoc = await Category.findById(category);
      } else {
        categoryDoc = await Category.findOne({ slug: category });
      }
      
      if (categoryDoc) {
        // Find all subcategories
        const subcategories = await Category.find({ parent: categoryDoc._id });
        categoryIds = [categoryDoc._id, ...subcategories.map(subCat => subCat._id)];
      }
      
      query.category = { $in: categoryIds };
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Enhanced search functionality to search by name, category or tags
    if (search) {
      // Creating a text search index is recommended for production
      // For now, we'll use a case-insensitive regex search on multiple fields
      const searchRegex = new RegExp(search, 'i');
      
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex }
      ];
      
      // If the search term matches a category name, also include products from that category
      const categoryMatch = await Category.findOne({ 
        name: searchRegex 
      });
      
      if (categoryMatch) {
        // If we already have category filter, just add to it
        if (query.category && query.category.$in) {
          query.category.$in.push(categoryMatch._id);
        } else {
          // Otherwise create a new category filter
          query.category = { $in: [categoryMatch._id] };
        }
      }
    }
    
    if (minPrice !== undefined) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }
    
    if (maxPrice !== undefined) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }
    
    if (isOrganic !== undefined) {
      query.isOrganic = isOrganic === 'true';
    }
    
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    
    // Execute query with pagination, sorting, and limiting fields
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(totalProducts / parseInt(limit, 10)),
      currentPage: parseInt(page, 10),
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get a single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    
    // Check if ID is a MongoDB ObjectId or a slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId, find by ID
      product = await Product.findById(id);
    } else {
      // It's a slug, find by slug
      product = await Product.findOne({ slug: id });
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      shortDescription,
      price,
      discount,
      stock,
      unit,
      tags,
      category,
      nutritionInfo,
      isActive,
      isFeatured,
      isOrganic,
      countryOfOrigin,
      deleteImages
    } = req.body;
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check category if updating
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
      product.category = category;
    }
    
    // Update name and slug if needed
    if (name && name !== product.name) {
      product.name = name;
      
      // Generate new slug
      let newSlug = slugify(name);
      
      // Check if the new slug already exists (and is not this product's slug)
      if (newSlug !== product.slug) {
        const existingProduct = await Product.findOne({ slug: newSlug });
        
        if (existingProduct && existingProduct._id.toString() !== id) {
          // Try to generate a unique slug
          let attempt = 1;
          let uniqueSlug = generateUniqueSlug(newSlug, attempt);
          let slugExists = true;
          
          while (slugExists && attempt < 10) {
            const productWithSlug = await Product.findOne({ slug: uniqueSlug });
            if (productWithSlug && productWithSlug._id.toString() !== id) {
              attempt++;
              uniqueSlug = generateUniqueSlug(newSlug, attempt);
            } else {
              slugExists = false;
              newSlug = uniqueSlug;
            }
          }
          
          if (slugExists) {
            return res.status(400).json({
              success: false,
              message: 'Unable to generate unique slug for product'
            });
          }
        }
        
        product.slug = newSlug;
      }
    }
    
    // Update other fields if provided
    if (description !== undefined) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (price !== undefined) product.price = parseFloat(price);
    if (discount !== undefined) product.discount = parseFloat(discount);
    if (stock !== undefined) product.stock = parseInt(stock, 10);
    if (unit !== undefined) product.unit = unit;
    
    // Update tags
    if (tags) {
      if (typeof tags === 'string') {
        product.tags = tags.split(',').map(tag => tag.trim());
      } else if (Array.isArray(tags)) {
        product.tags = tags;
      }
    }
    
    // Update nutrition info
    if (nutritionInfo) {
      try {
        if (typeof nutritionInfo === 'string') {
          product.nutritionInfo = JSON.parse(nutritionInfo);
        } else {
          product.nutritionInfo = nutritionInfo;
        }
      } catch (error) {
        console.error('Error parsing nutrition info:', error);
      }
    }
    
    // Update boolean fields
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isOrganic !== undefined) product.isOrganic = isOrganic === 'true' || isOrganic === true;
    if (countryOfOrigin !== undefined) product.countryOfOrigin = countryOfOrigin;
    
    // Handle image deletion
    if (deleteImages) {
      let imageIdsToDelete = [];
      
      if (typeof deleteImages === 'string') {
        // Single image ID
        imageIdsToDelete = [deleteImages];
      } else if (Array.isArray(deleteImages)) {
        // Multiple image IDs
        imageIdsToDelete = deleteImages;
      }
      
      // Delete images from storage
      for (const imageId of imageIdsToDelete) {
        const image = product.images.id(imageId);
        if (image) {
          // Extract file path from URL
          const imagePath = image.url.split('/uploads/')[1];
          if (imagePath) {
            deleteFile(`uploads/${imagePath}`);
          }
        }
      }
      
      // Remove images from product
      product.images = product.images.filter(
        img => !imageIdsToDelete.includes(img._id.toString())
      );
      
      // Ensure at least one image is primary
      if (product.images.length > 0 && !product.images.some(img => img.isPrimary)) {
        product.images[0].isPrimary = true;
      }
    }
    
    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => {
        return {
          url: getFileUrl(file.path, req),
          alt: `${product.name} image ${product.images.length + index + 1}`,
          isPrimary: product.images.length === 0 && index === 0 // Only set primary if no existing images
        };
      });
      
      // Merge with existing images
      product.images = [...product.images, ...newImages];
    }
    
    // Save changes
    const updatedProduct = await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Delete all product images
    for (const image of product.images) {
      // Extract file path from URL
      const imagePath = image.url.split('/uploads/')[1];
      if (imagePath) {
        deleteFile(`uploads/${imagePath}`);
      }
    }
    
    // Delete product
    await product.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update product image priority
 * @route   PATCH /api/products/:id/image-priority
 * @access  Private/Admin
 */
export const updateImagePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageId } = req.body;
    
    // Validate imageId
    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: 'Image ID is required'
      });
    }
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Find the image
    const image = product.images.id(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Update all images to non-primary
    product.images.forEach(img => {
      img.isPrimary = false;
    });
    
    // Set the selected image as primary
    image.isPrimary = true;
    
    // Save changes
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Image priority updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update image priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating image priority',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Upload product images middleware
 */
export const uploadProductImages = upload.array('images', 5); // Max 5 images per product 