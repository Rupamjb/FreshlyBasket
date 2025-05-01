import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/Product.js';
import { fileURLToPath } from 'url';
import { slugify } from '../utils/helpers.js';
colors.enable();
dotenv.config();
const generateSlug = (name) => {
    return slugify(name);
};
const products = [
    {
        name: 'Fresh Tomatoes',
        description: 'Vine-ripened fresh tomatoes, perfect for salads and cooking.',
        price: 2.99,
        category: 'Vegetables',
        stock: 100,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaad234',
        slug: generateSlug('Fresh Tomatoes')
    },
    {
        name: 'Organic Spinach',
        description: 'Fresh organic spinach leaves, washed and ready to eat.',
        price: 2.79,
        category: 'Vegetables',
        stock: 70,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
        slug: generateSlug('Organic Spinach')
    },
    {
        name: 'Organic Bananas',
        description: 'Sweet, organic bananas. Perfect for a quick snack or smoothies.',
        price: 1.29,
        category: 'Fruits',
        stock: 150,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
        slug: generateSlug('Organic Bananas')
    },
    {
        name: 'Red Apples',
        description: 'Crisp and sweet red apples, great for snacking or baking.',
        price: 3.49,
        category: 'Fruits',
        stock: 120,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a',
        slug: generateSlug('Red Apples')
    },
    {
        name: 'Whole Milk',
        description: 'Fresh whole milk from local farms.',
        price: 3.29,
        category: 'Dairy',
        stock: 80,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
        slug: generateSlug('Whole Milk')
    },
    {
        name: 'Greek Yogurt',
        description: 'Creamy Greek yogurt, high in protein and probiotics.',
        price: 4.99,
        category: 'Dairy',
        stock: 60,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
        slug: generateSlug('Greek Yogurt')
    },
    {
        name: 'Whole Grain Bread',
        description: 'Freshly baked whole grain bread, perfect for sandwiches and toast.',
        price: 3.99,
        category: 'Bakery',
        stock: 40,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
        slug: generateSlug('Whole Grain Bread')
    },
    {
        name: 'Chocolate Croissants',
        description: 'Buttery, flaky croissants filled with rich chocolate.',
        price: 5.99,
        category: 'Bakery',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
        slug: generateSlug('Chocolate Croissants')
    },
    {
        name: 'Mixed Nuts',
        description: 'Premium blend of almonds, cashews, and walnuts.',
        price: 7.99,
        category: 'Snacks',
        stock: 45,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1599042891d-9dbfbd04ae80',
        slug: generateSlug('Mixed Nuts')
    },
    {
        name: 'Potato Chips',
        description: 'Crunchy, lightly salted potato chips.',
        price: 2.99,
        category: 'Snacks',
        stock: 75,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
        slug: generateSlug('Potato Chips')
    }
];
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-ecommerce';
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        return conn;
    }
    catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};
const seedProducts = async () => {
    try {
        await Product.deleteMany({});
        console.log('Products deleted'.red.inverse);
        const createdProducts = await Product.insertMany(products);
        console.log(`${createdProducts.length} products inserted`.green.inverse);
        const categories = {};
        createdProducts.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = 0;
            }
            categories[product.category]++;
        });
        console.log('\nProduct count by category:'.yellow);
        Object.keys(categories).sort().forEach(category => {
            console.log(`${category}: ${categories[category]} items`);
        });
        return createdProducts;
    }
    catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};
export const runSeeder = async () => {
    await connectDB();
    const seededProducts = await seedProducts();
    console.log('Seeding completed!'.green.bold);
    return seededProducts;
};
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runSeeder()
        .then(() => {
        console.log('Seeder script executed successfully.'.green.bold);
        process.exit(0);
    })
        .catch(error => {
        console.error(`Error in seeder execution: ${error.message}`.red.bold);
        process.exit(1);
    });
}
//# sourceMappingURL=newProductSeeder.js.map