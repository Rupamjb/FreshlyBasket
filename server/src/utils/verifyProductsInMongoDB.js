// Script to verify products in MongoDB Atlas
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

// Initialize colors for console
colors.enable();

// Load environment variables
dotenv.config();

// Set MongoDB Atlas connection string
const MONGODB_URI = "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority&appName=Cluster0";

// Define a simple Product schema for reading
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

// Verify products in MongoDB Atlas
const verifyProducts = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...'.yellow);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas'.green);
    
    // Create a model for the products collection
    const Product = mongoose.model('Product', productSchema);
    
    // Count products
    const productCount = await Product.countDocuments();
    console.log(`Total products in database: ${productCount}`.cyan);
    
    // Count products by category
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nProducts by category:'.yellow);
    categories.forEach(category => {
      console.log(`${category._id}: ${category.count} items`);
    });
    
    // Get sample products from each category
    console.log('\nSample products from each category:'.yellow);
    for (const category of categories) {
      const products = await Product.find({ category: category._id })
        .limit(2)
        .select('name price unit slug')
        .lean();
      
      console.log(`\n${category._id} samples:`.cyan);
      products.forEach(product => {
        console.log(`- ${product.name} ($${product.price.toFixed(2)}/${product.unit}), slug: ${product.slug}`);
      });
    }
    
    console.log('\nVerification complete!'.green.bold);
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB'.green);
    
  } catch (error) {
    console.error('Error verifying products:'.red.bold, error);
    process.exit(1);
  }
};

// Run the verification function
verifyProducts()
  .then(() => {
    console.log('Verification process completed successfully.'.green.bold);
    process.exit(0);
  })
  .catch(error => {
    console.error(`Verification process failed: ${error.message}`.red.bold);
    process.exit(1);
  }); 
 
 