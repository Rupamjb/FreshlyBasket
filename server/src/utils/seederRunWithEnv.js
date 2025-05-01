// Set environment variables first, then run the seeder
import { seedAllProducts } from '../../dist/utils/masterSeeder.js';

// Set required environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/grocery-ecommerce';

// Run the seeder
console.log('Running seeder with MongoDB URI:', process.env.MONGODB_URI);
seedAllProducts(); 
 
 