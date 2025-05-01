// Direct MongoDB database query script
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

// Initialize colors for console
colors.enable();

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority&appName=Cluster0";

// Direct database query
const queryDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...'.yellow);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB'.green);
    
    // Get a reference to the products collection directly
    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    
    // Count all documents
    const count = await productsCollection.countDocuments({});
    console.log(`\nTotal products in collection: ${count}`.cyan);
    
    // Find all products without using the schema
    const products = await productsCollection.find({}).limit(5).toArray();
    
    console.log('\nFirst 5 products:'.yellow);
    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`.cyan);
      console.log(JSON.stringify(product, null, 2));
    });
    
    // Check collection names
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in database:'.yellow);
    collections.forEach(collection => {
      console.log(collection.name);
    });
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB'.green);
    
  } catch (error) {
    console.error('Error querying database:', error);
    process.exit(1);
  }
};

// Run the script
queryDatabase()
  .then(() => {
    console.log('Database query completed successfully.'.green.bold);
    process.exit(0);
  })
  .catch(error => {
    console.error(`Database query failed: ${error.message}`.red.bold);
    process.exit(1);
  }); 
 
 