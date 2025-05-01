// Script to upload products to MongoDB Atlas
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Initialize colors for console
colors.enable();

// Load environment variables
dotenv.config();

// Set MongoDB Atlas connection string
const MONGODB_URI = "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority&appName=Cluster0";

// Path to the compiled newProductSeeder.js file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seederPath = path.join(__dirname, '..', '..', 'dist', 'utils', 'newProductSeeder.js');

// Check if the file exists
if (!fs.existsSync(seederPath)) {
  console.error(`Error: Seeder file not found at ${seederPath}`.red.bold);
  process.exit(1);
}

// Import the seeder dynamically
async function importSeeder() {
  try {
    // Import the compiled JS module
    const seederModule = await import('../../dist/utils/newProductSeeder.js');
    return seederModule.runSeeder;
  } catch (error) {
    console.error('Error importing seeder module:'.red.bold, error);
    process.exit(1);
  }
}

// Function to run the seeder
const uploadToMongoDB = async () => {
  try {
    console.log('Importing the seeder module...'.yellow);
    const runSeeder = await importSeeder();
    
    console.log('Attempting to connect to MongoDB Atlas...'.yellow);
    
    // Override the environment variable
    process.env.MONGODB_URI = MONGODB_URI;
    
    // Run the seeder
    console.log('Starting to seed products...'.yellow);
    const products = await runSeeder();
    
    if (!products) {
      throw new Error('No products were returned from the seeder');
    }
    
    console.log(`Successfully uploaded ${products.length} products to MongoDB Atlas!`.green.bold);
    console.log('Disconnecting from MongoDB...'.yellow);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB'.green);
    
    return products;
  } catch (error) {
    console.error('Error uploading products to MongoDB:'.red.bold, error);
    process.exit(1);
  }
};

// Run the upload function
uploadToMongoDB()
  .then((products) => {
    console.log('Upload process completed successfully.'.green.bold);
    console.log(`${products ? products.length : 0} products were added to your MongoDB Atlas database`.green);
    process.exit(0);
  })
  .catch(error => {
    console.error(`Upload process failed: ${error.message}`.red.bold);
    process.exit(1);
  }); 
 
 