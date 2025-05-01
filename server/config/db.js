import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 */
const connectDB = async () => {
  try {
    // Use the database with products in it
    const MONGODB_URI = process.env.MONGODB_URI || 
      "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority&appName=Cluster0";
    
    const options = {
      // These options make the connection more reliable
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    };
    
    // Attempt connection
    const conn = await mongoose.connect(MONGODB_URI, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Failed to connect to MongoDB. Authentication will not work properly.');
    return false;
  }
};

export default connectDB; 