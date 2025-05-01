// Utility script to check database connection and products
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Initialize colors for console
colors.enable();

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority&appName=Cluster0";

// Check database connection and products
const checkDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...'.yellow);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB'.green);
    
    // Dynamically import the Product model
    // Since we're using ESM, we need to import the compiled JS version
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const distProductPath = path.join(__dirname, '..', '..', 'dist', 'models', 'Product.js');
    const srcProductPath = path.join(__dirname, '..', 'models', 'Product.js');
    
    let Product;
    try {
      // First try the dist version
      if (fs.existsSync(distProductPath)) {
        console.log('Using compiled Product model from dist'.gray);
        const ProductModule = await import(distProductPath);
        Product = ProductModule.default;
      } else if (fs.existsSync(srcProductPath)) {
        console.log('Using Product model from src'.gray);
        const ProductModule = await import(srcProductPath);
        Product = ProductModule.default;
      } else {
        throw new Error('Product model not found in dist or src');
      }
      
      // Check we have a valid model
      if (!Product || !Product.find) {
        throw new Error('Invalid Product model imported');
      }
    } catch (error) {
      console.error('Error importing Product model:'.red, error);
      // Fallback approach - create a temporary Product model for checking
      console.log('Creating temporary Product model for diagnostic purposes'.yellow);
      const productSchema = new mongoose.Schema(
        {
          name: String,
          description: String,
          price: Number,
          category: String,
          stock: Number,
          imageUrl: String,
          unit: String,
          slug: String,
          isActive: Boolean
        },
        { timestamps: true }
      );
      Product = mongoose.model('Product', productSchema, 'products');
    }
    
    // Check products collection
    const productCount = await Product.countDocuments();
    console.log(`Total products in database: ${productCount}`.cyan);
    
    // Check products by category
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nProducts by category:'.yellow);
    if (categories.length === 0) {
      console.log('No categories found - database may be empty'.red);
    } else {
      categories.forEach(category => {
        console.log(`${category._id}: ${category.count} items`);
      });
    }
    
    // Check schema fields
    const sampleProduct = await Product.findOne().lean();
    if (sampleProduct) {
      console.log('\nSample product fields:'.yellow);
      // Safely show product fields
      Object.entries(sampleProduct).forEach(([key, value]) => {
        // Safely convert value to string
        let displayValue = '';
        
        if (value === null) {
          displayValue = 'null';
        } else if (value === undefined) {
          displayValue = 'undefined';
        } else if (typeof value === 'object') {
          // Handle objects and arrays safely
          try {
            displayValue = JSON.stringify(value);
          } catch (e) {
            displayValue = '[Complex Object]';
          }
        } else {
          // For primitive values
          displayValue = String(value);
        }
        
        console.log(`${key}: ${typeof value} (${displayValue})`.gray);
      });
    } else {
      console.log('No products found to check schema'.red);
    }
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB'.green);
    
  } catch (error) {
    console.error('Error checking database:'.red.bold, error);
    process.exit(1);
  }
};

// Run the script
checkDatabase()
  .then(() => {
    console.log('Database check completed successfully.'.green.bold);
    process.exit(0);
  })
  .catch(error => {
    console.error(`Database check failed: ${error.message}`.red.bold);
    process.exit(1);
  }); 
 
 