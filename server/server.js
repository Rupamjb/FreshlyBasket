import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-frontend-app.vercel.app', 'https://freshly-basket.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:5180', 'http://localhost:5181', 'http://localhost:5182', 'http://localhost:5183', 'http://localhost:5184', 'http://localhost:5185'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Direct debug route to diagnose products
app.get('/api/debug/products', async (req, res) => {
  try {
    // Direct query to MongoDB using mongoose
    const mongoose = await import('mongoose');
    const db = mongoose.default.connection.db;
    
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    const productsCollection = db.collection('products');
    const count = await productsCollection.countDocuments({});
    const products = await productsCollection.find({}).limit(10).toArray();
    
    res.status(200).json({
      success: true,
      count,
      message: 'Direct products query',
      data: products
    });
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in debug route',
      error: error.message
    });
  }
});

// Debug route for category filtering
app.get('/api/debug/categories', async (req, res) => {
  try {
    // Direct query to MongoDB using mongoose
    const mongoose = await import('mongoose');
    const db = mongoose.default.connection.db;
    
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    const productsCollection = db.collection('products');
    
    // Get all categories
    const allCategories = await productsCollection.distinct('category');
    
    // Get products by category
    const categoryData = {};
    for (const category of allCategories) {
      const count = await productsCollection.countDocuments({ category });
      const sampleProducts = await productsCollection.find({ category }).limit(2).toArray();
      categoryData[category] = {
        count,
        sampleProducts: sampleProducts.map(p => ({ name: p.name, category: p.category }))
      };
    }
    
    res.status(200).json({
      success: true,
      categories: allCategories,
      categoryData
    });
  } catch (error) {
    console.error('Debug categories route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in debug categories route',
      error: error.message
    });
  }
});

// Direct route for products with category filtering
app.get('/api/direct/products', async (req, res) => {
  try {
    const { category, search, limit = 10, page = 1, sort = '-createdAt' } = req.query;
    
    // Import mongoose
    const mongoose = await import('mongoose');
    const db = mongoose.default.connection.db;
    
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    const productsCollection = db.collection('products');
    
    // Build query
    const query = {};
    
    // Add category filter if provided
    if (category) {
      // Case-insensitive category matching
      query.category = new RegExp(`^${category}$`, 'i');
      console.log('Category filter:', query.category);
    }
    
    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex }
      ];
      console.log('Search filter:', search);
    }
    
    console.log('Direct query:', JSON.stringify(query));
    
    // Count total matching products
    const total = await productsCollection.countDocuments(query);
    console.log('Total matching products:', total);
    
    // Configure sorting
    const sortOption = {};
    if (sort) {
      const sortString = sort.toString();
      const sortOrder = sortString.startsWith('-') ? -1 : 1;
      const sortField = sortString.replace(/^-/, '');
      sortOption[sortField] = sortOrder;
    }
    
    // Apply pagination
    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query
    const products = await productsCollection
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .toArray();
    
    console.log(`Found ${products.length} products`);
    
    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: products
    });
  } catch (error) {
    console.error('Direct products route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in direct products route',
      error: error.message
    });
  }
});

// Mount route handlers
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // All other routes should return the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
connectDB().then((connected) => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (!connected) {
      console.log('Warning: Server running without database connection. Authentication will not work properly.');
    } else {
      console.log('MongoDB connection established successfully.');
    }
  });
}); 