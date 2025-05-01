import Category from '../models/Category.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';
import upload, { getFileUrl, deleteFile } from '../utils/fileUpload.js';
import Product from '../models/Product.js';

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, parent, order } = req.body;
    
    // Validate input
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Generate slug from name
    let slug = slugify(name);
    
    // Check if slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      // Try to generate a unique slug
      let attempt = 1;
      let uniqueSlug = generateUniqueSlug(slug, attempt);
      let slugExists = true;
      
      while (slugExists && attempt < 10) {
        const categoryWithSlug = await Category.findOne({ slug: uniqueSlug });
        if (categoryWithSlug) {
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
          message: 'Unable to generate unique slug for category'
        });
      }
    }
    
    // Process image upload if file was included
    let imageUrl = null;
    if (req.file) {
      imageUrl = getFileUrl(req.file.path, req);
    }
    
    // Create new category
    const category = await Category.create({
      name,
      slug,
      description,
      parent: parent || null,
      image: imageUrl,
      order: order || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    // Get only parent categories (with their subcategories populated)
    const categories = await Category.find({ parent: null });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get a single category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let category;
    
    // Check if ID is a MongoDB ObjectId or a slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId, find by ID
      category = await Category.findById(id);
    } else {
      // It's a slug, find by slug
      category = await Category.findOne({ slug: id });
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent, order, isActive } = req.body;
    
    // Find category
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Update fields
    if (name) {
      category.name = name;
      
      // Update slug if name changed
      let newSlug = slugify(name);
      
      // Check if the new slug already exists (and is not this category's slug)
      if (newSlug !== category.slug) {
        const existingCategory = await Category.findOne({ slug: newSlug });
        
        if (existingCategory && existingCategory._id.toString() !== id) {
          // Try to generate a unique slug
          let attempt = 1;
          let uniqueSlug = generateUniqueSlug(newSlug, attempt);
          let slugExists = true;
          
          while (slugExists && attempt < 10) {
            const categoryWithSlug = await Category.findOne({ slug: uniqueSlug });
            if (categoryWithSlug && categoryWithSlug._id.toString() !== id) {
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
              message: 'Unable to generate unique slug for category'
            });
          }
        }
        
        category.slug = newSlug;
      }
    }
    
    if (description !== undefined) category.description = description;
    if (parent !== undefined) category.parent = parent || null;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;
    
    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (category.image) {
        // Extract file path from URL
        const imagePath = category.image.split('/uploads/')[1];
        if (imagePath) {
          deleteFile(`uploads/${imagePath}`);
        }
      }
      
      // Set new image URL
      category.image = getFileUrl(req.file.path, req);
    }
    
    // Save changes
    const updatedCategory = await category.save();
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find category
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has subcategories
    const subcategories = await Category.find({ parent: id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Remove or reassign subcategories first.'
      });
    }
    
    // Check if category is used in products
    const products = await Product.find({ category: id });
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category used by products. Update or remove products first.'
      });
    }
    
    // Delete image if exists
    if (category.image) {
      // Extract file path from URL
      const imagePath = category.image.split('/uploads/')[1];
      if (imagePath) {
        deleteFile(`uploads/${imagePath}`);
      }
    }
    
    // Delete category
    await category.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Upload category image middleware
 */
export const uploadCategoryImage = upload.single('image'); 