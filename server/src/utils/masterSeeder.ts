import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { additionalProducts } from './additionalProducts.js';
import { additionalProducts2 } from './additionalProducts2.js';
import { additionalProducts3 } from './additionalProducts3.js';
import { sampleProducts } from './seedProducts.js';

// Load environment variables
dotenv.config();

// Combine all products
const allProducts = [
  ...sampleProducts,
  ...additionalProducts,
  ...additionalProducts2,
  ...additionalProducts3
];

// Master seeder function
const seedAllProducts = async () => {
  try {
    // Check for MONGODB_URI in environment
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in the environment variables');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // First, clear existing products
    await Product.deleteMany({});
    console.log('All existing products cleared from database');

    // Insert all products
    const createdProducts = await Product.insertMany(allProducts);
    console.log(`${createdProducts.length} total products seeded successfully`);

    // Display the products grouped by category
    console.log('Seeded products by category:');
    
    // Group products by category
    const groupedProducts: Record<string, any[]> = {};
    createdProducts.forEach(product => {
      const category = product.category as string;
      if (!groupedProducts[category]) {
        groupedProducts[category] = [];
      }
      groupedProducts[category].push(product);
    });
    
    // Display product counts by category
    Object.keys(groupedProducts).sort().forEach(category => {
      console.log(`${category}: ${groupedProducts[category].length} items`);
    });

    // Close the connection
    await mongoose.disconnect();
    console.log('\nMongoDB disconnected');
    console.log('All products successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error in master seeder:', error);
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
// For ES modules, check if the import.meta.url is the same as the main module
const isMainModule = import.meta.url.endsWith('masterSeeder.js') || import.meta.url.endsWith('masterSeeder.ts');
if (isMainModule) {
  seedAllProducts();
}

export { seedAllProducts }; 