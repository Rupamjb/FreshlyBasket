// Script to upload products to MongoDB Atlas
import mongoose from 'mongoose';
import { seedAllProducts } from '../../dist/utils/masterSeeder.js';

// Set MongoDB Atlas connection string
// Replace this with your actual MongoDB Atlas connection string
const MONGODB_URI = "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Set the environment variable for the seeder
process.env.MONGODB_URI = MONGODB_URI;

// Function to run the seeder
const uploadToMongoDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas!');
    
    // Run the seeder
    console.log('Starting to seed products...');
    await seedAllProducts();
    
    console.log('All products have been successfully uploaded to MongoDB Atlas!');
  } catch (error) {
    console.error('Error uploading products to MongoDB Atlas:', error);
    process.exit(1);
  }
};

// Run the upload function
uploadToMongoDB(); 