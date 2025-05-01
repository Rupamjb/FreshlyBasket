import Product from '../models/Product.js';
export const getProducts = async (req, res) => {
    try {
        console.log('Request query:', req.query);
        const { category, search, sort, limit = 10, page = 1 } = req.query;
        const query = {};
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
            console.log('Using case-insensitive category filter:', query.category);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        console.log('MongoDB query:', JSON.stringify(query));
        const total = await Product.countDocuments(query);
        console.log('Total matching products:', total);
        const allProductsCount = await Product.countDocuments({});
        console.log('Total products in the database:', allProductsCount);
        const allCategories = await Product.distinct('category');
        console.log('Available categories in database:', allCategories);
        let sortOption = {};
        if (sort) {
            const sortOrder = sort.toString().startsWith('-') ? -1 : 1;
            const sortField = sort.toString().replace(/^-/, '');
            sortOption = { [sortField]: sortOrder };
        }
        else {
            sortOption = { createdAt: -1 };
        }
        const pageNum = parseInt(page.toString());
        const limitNum = parseInt(limit.toString());
        const skip = (pageNum - 1) * limitNum;
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);
        console.log(`Found ${products.length} products`);
        res.status(200).json({
            success: true,
            count: products.length,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: products
        });
    }
    catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products',
            error: error instanceof Error ? error.message : String(error),
            query: req.query
        });
    }
};
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
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
    }
    catch (error) {
        console.error('Error getting product by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    }
    catch (error) {
        console.error('Error updating product:', error);
        if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: {}
        });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
//# sourceMappingURL=productController.js.map