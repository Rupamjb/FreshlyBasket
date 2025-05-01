import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { slugify } from '../utils/slugify.js';
import { faker } from '@faker-js/faker';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use MongoDB Atlas instance
    const mongoURI = 'mongodb+srv://demo:demo123@cluster0.abcde.mongodb.net/ecommerce?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

// Generate a product for a given category
const generateProduct = (category, index) => {
  const name = faker.commerce.productName();
  const price = parseFloat(faker.commerce.price({ min: 5, max: 100 }));
  const stock = faker.number.int({ min: 5, max: 100 });
  const discount = faker.number.int({ min: 0, max: 30 });
  
  // Create image URLs
  const imageCount = faker.number.int({ min: 1, max: 4 });
  const images = [];
  
  for (let i = 0; i < imageCount; i++) {
    images.push({
      url: faker.image.url(),
      alt: `${name} image ${i + 1}`,
      isPrimary: i === 0  // First image is primary
    });
  }
  
  // Create appropriate units based on category
  let unit = 'item';
  if (category.name.toLowerCase().includes('fruit') || 
      category.name.toLowerCase().includes('vegetable')) {
    unit = faker.helpers.arrayElement(['kg', 'g', '500g', 'bunch']);
  } else if (category.name.toLowerCase().includes('meat') || 
             category.name.toLowerCase().includes('fish')) {
    unit = faker.helpers.arrayElement(['kg', '500g', '250g']);
  } else if (category.name.toLowerCase().includes('dairy')) {
    unit = faker.helpers.arrayElement(['l', 'ml', 'pack']);
  }
  
  // Generate between 1-5 tags
  const tagCount = faker.number.int({ min: 1, max: 5 });
  const tags = [];
  for (let i = 0; i < tagCount; i++) {
    tags.push(faker.word.adjective());
  }
  
  // Create product object
  return {
    name,
    slug: slugify(`${name}-${index}`),
    description: faker.commerce.productDescription(),
    shortDescription: faker.lorem.sentence(),
    price,
    discount,
    stock,
    unit,
    tags,
    category: category._id,
    images,
    nutritionInfo: category.name.toLowerCase().includes('food') ? {
      calories: faker.number.int({ min: 50, max: 500 }),
      protein: faker.number.int({ min: 0, max: 50 }),
      carbs: faker.number.int({ min: 0, max: 50 }),
      fat: faker.number.int({ min: 0, max: 30 })
    } : null,
    isActive: true,
    isFeatured: faker.datatype.boolean(0.2),  // 20% chance to be featured
    isOrganic: faker.datatype.boolean(0.3),  // 30% chance to be organic
    countryOfOrigin: faker.location.country(),
    avgRating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
    numReviews: faker.number.int({ min: 0, max: 50 })
  };
};

// Seed products
const seedProducts = async () => {
  try {
    await connectDB();
    
    // First, check if we have categories
    const categories = await Category.find({});
    
    if (categories.length === 0) {
      console.log('No categories found. Please add categories first.'.yellow);
      process.exit(0);
    }
    
    console.log(`Found ${categories.length} categories`.green);
    
    // Ask for confirmation
    console.log('This will add 10 products for each category.'.yellow);
    console.log('Existing products will remain untouched.'.yellow);
    console.log('Press CTRL+C to cancel or any key to continue...'.yellow);
    
    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
    
    // Create 10 products for each category
    for (const category of categories) {
      console.log(`Creating products for category: ${category.name}`.cyan);
      
      const productsToCreate = [];
      for (let i = 0; i < 10; i++) {
        productsToCreate.push(generateProduct(category, i+1));
      }
      
      // Insert products in batch
      await Product.insertMany(productsToCreate);
      console.log(`Added 10 products to ${category.name}`.green);
    }
    
    console.log('Products seeded successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Run the seeder
seedProducts(); 