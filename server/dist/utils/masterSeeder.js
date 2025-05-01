import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { additionalProducts } from './additionalProducts.js';
import { additionalProducts2 } from './additionalProducts2.js';
import { additionalProducts3 } from './additionalProducts3.js';
import { sampleProducts } from './seedProducts.js';
dotenv.config();
const allProducts = [
    ...sampleProducts,
    ...additionalProducts,
    ...additionalProducts2,
    ...additionalProducts3
];
const seedAllProducts = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('Error: MONGODB_URI is not defined in the environment variables');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        await Product.deleteMany({});
        console.log('All existing products cleared from database');
        const createdProducts = await Product.insertMany(allProducts);
        console.log(`${createdProducts.length} total products seeded successfully`);
        console.log('Seeded products by category:');
        const groupedProducts = {};
        createdProducts.forEach(product => {
            const category = product.category;
            if (!groupedProducts[category]) {
                groupedProducts[category] = [];
            }
            groupedProducts[category].push(product);
        });
        Object.keys(groupedProducts).sort().forEach(category => {
            console.log(`${category}: ${groupedProducts[category].length} items`);
        });
        await mongoose.disconnect();
        console.log('\nMongoDB disconnected');
        console.log('All products successfully seeded!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error in master seeder:', error);
        process.exit(1);
    }
};
const isMainModule = import.meta.url.endsWith('masterSeeder.js') || import.meta.url.endsWith('masterSeeder.ts');
if (isMainModule) {
    seedAllProducts();
}
export { seedAllProducts };
//# sourceMappingURL=masterSeeder.js.map