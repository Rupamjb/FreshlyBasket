import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Category from '../models/Category.js';
import { slugify } from '../utils/slugify.js';

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

// Sample categories
const categories = [
  {
    name: 'Fruits & Vegetables',
    description: 'Fresh fruits and vegetables',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1470&auto=format&fit=crop'
  },
  {
    name: 'Meat & Seafood',
    description: 'Fresh meat and seafood products',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1470&auto=format&fit=crop'
  },
  {
    name: 'Dairy & Eggs',
    description: 'Milk, cheese, yogurt, and eggs',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1374&auto=format&fit=crop'
  },
  {
    name: 'Bakery',
    description: 'Fresh bread, pastries, and cakes',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1632&auto=format&fit=crop'
  },
  {
    name: 'Snacks & Sweets',
    description: 'Chips, cookies, and candies',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=1470&auto=format&fit=crop'
  },
  {
    name: 'Beverages',
    description: 'Soft drinks, juices, coffee, and tea',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=1470&auto=format&fit=crop'
  },
  {
    name: 'Pantry Staples',
    description: 'Rice, pasta, flour, and grains',
    image: 'https://images.unsplash.com/photo-1588635631677-c7be22d714dd?q=80&w=1074&auto=format&fit=crop'
  },
  {
    name: 'Organic & Health Foods',
    description: 'Organic and health food products',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1074&auto=format&fit=crop'
  }
];

// Add subcategories for Fruits & Vegetables
const fruitVegSubcategories = [
  {
    name: 'Fresh Fruits',
    description: 'Fresh and seasonal fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1470&auto=format&fit=crop'
  },
  {
    name: 'Fresh Vegetables',
    description: 'Fresh and seasonal vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1384&auto=format&fit=crop'
  },
  {
    name: 'Exotic Fruits & Vegetables',
    description: 'Imported and specialty produce',
    image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?q=80&w=1470&auto=format&fit=crop'
  }
];

// Add subcategories for Meat & Seafood
const meatSeafoodSubcategories = [
  {
    name: 'Chicken & Poultry',
    description: 'Fresh chicken and other poultry',
    image: 'https://images.unsplash.com/photo-1587270613291-b5c7042fc104?q=80&w=1374&auto=format&fit=crop'
  },
  {
    name: 'Mutton & Lamb',
    description: 'Fresh mutton and lamb',
    image: 'https://images.unsplash.com/photo-1603048896572-d28961558a86?q=80&w=1480&auto=format&fit=crop'
  },
  {
    name: 'Seafood',
    description: 'Fish and shellfish',
    image: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1470&auto=format&fit=crop'
  }
];

// Seed categories
const seedCategories = async () => {
  try {
    await connectDB();
    
    // Clear existing categories
    await Category.deleteMany({});
    
    console.log('Deleted existing categories'.yellow);
    
    // First, create main categories
    const createdCategories = [];
    
    for (const category of categories) {
      const newCategory = await Category.create({
        name: category.name,
        slug: slugify(category.name),
        description: category.description,
        image: category.image,
        isActive: true
      });
      
      createdCategories.push(newCategory);
      console.log(`Created category: ${newCategory.name}`.green);
    }
    
    // Add subcategories
    const fruitsVeggiesCat = createdCategories.find(c => c.name === 'Fruits & Vegetables');
    const meatSeafoodCat = createdCategories.find(c => c.name === 'Meat & Seafood');
    
    if (fruitsVeggiesCat) {
      for (const subCat of fruitVegSubcategories) {
        await Category.create({
          name: subCat.name,
          slug: slugify(subCat.name),
          description: subCat.description,
          image: subCat.image,
          parent: fruitsVeggiesCat._id,
          isActive: true
        });
        
        console.log(`Created subcategory: ${subCat.name}`.green);
      }
    }
    
    if (meatSeafoodCat) {
      for (const subCat of meatSeafoodSubcategories) {
        await Category.create({
          name: subCat.name,
          slug: slugify(subCat.name),
          description: subCat.description,
          image: subCat.image,
          parent: meatSeafoodCat._id,
          isActive: true
        });
        
        console.log(`Created subcategory: ${subCat.name}`.green);
      }
    }
    
    console.log('All categories seeded successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Run the seeder
seedCategories(); 