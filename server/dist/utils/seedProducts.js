import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
dotenv.config();
export const sampleProducts = [
    {
        name: 'Fresh Tomatoes',
        description: 'Vine-ripened fresh tomatoes, perfect for salads and cooking.',
        price: 2.99,
        category: 'Vegetables',
        stock: 100,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaad234'
    },
    {
        name: 'Organic Spinach',
        description: 'Fresh organic spinach leaves, washed and ready to eat.',
        price: 2.79,
        category: 'Vegetables',
        stock: 70,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb'
    },
    {
        name: 'Bell Peppers Mix',
        description: 'Colorful mix of red, yellow, and green bell peppers.',
        price: 4.49,
        category: 'Vegetables',
        stock: 85,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83'
    },
    {
        name: 'Organic Carrots',
        description: 'Sweet and crunchy organic carrots, great for snacking or cooking.',
        price: 1.99,
        category: 'Vegetables',
        stock: 120,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'
    },
    {
        name: 'Broccoli Crown',
        description: 'Fresh broccoli crown, packed with nutrients and flavor.',
        price: 2.49,
        category: 'Vegetables',
        stock: 60,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'
    },
    {
        name: 'Organic Bananas',
        description: 'Sweet and nutritious organic bananas, perfect for a healthy snack.',
        price: 1.99,
        category: 'Fruits',
        stock: 150,
        unit: 'bunch',
        imageUrl: 'https://images.unsplash.com/photo-1543218024-57a70143c369'
    },
    {
        name: 'Honeycrisp Apples',
        description: 'Crisp and sweet Honeycrisp apples, great for snacking or baking.',
        price: 3.49,
        category: 'Fruits',
        stock: 100,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a'
    },
    {
        name: 'Fresh Strawberries',
        description: 'Juicy, ripe strawberries, packed with flavor and nutrients.',
        price: 4.99,
        category: 'Fruits',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1587394157349-8436c732282f'
    },
    {
        name: 'Avocados',
        description: 'Ripe avocados, ready to eat or add to your favorite recipes.',
        price: 2.50,
        category: 'Fruits',
        stock: 60,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1519162808019-7de1f919b754'
    },
    {
        name: 'Blueberries',
        description: 'Sweet organic blueberries, packed with antioxidants.',
        price: 3.99,
        category: 'Fruits',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e'
    },
    {
        name: 'Farm Fresh Milk',
        description: 'Whole milk from pasture-raised cows, pasteurized for safety.',
        price: 3.49,
        category: 'Dairy',
        stock: 50,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b'
    },
    {
        name: 'Organic Eggs',
        description: 'Free-range organic eggs from hens raised on organic feed.',
        price: 4.99,
        category: 'Dairy',
        stock: 45,
        unit: 'dozen',
        imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f'
    },
    {
        name: 'Cheddar Cheese',
        description: 'Sharp cheddar cheese, aged for extra flavor.',
        price: 5.49,
        category: 'Dairy',
        stock: 35,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d'
    },
    {
        name: 'Greek Yogurt',
        description: 'Creamy plain Greek yogurt, high in protein and probiotic cultures.',
        price: 3.99,
        category: 'Dairy',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777'
    },
    {
        name: 'Salted Butter',
        description: 'Premium European-style salted butter, perfect for cooking and baking.',
        price: 4.29,
        category: 'Dairy',
        stock: 55,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d'
    },
    {
        name: 'Whole Grain Bread',
        description: 'Freshly baked whole grain bread, rich in fiber and nutrients.',
        price: 4.25,
        category: 'Bakery',
        stock: 40,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef'
    },
    {
        name: 'Chocolate Chip Cookies',
        description: 'Freshly baked chocolate chip cookies, soft and chewy.',
        price: 3.99,
        category: 'Bakery',
        stock: 55,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e'
    },
    {
        name: 'Sourdough Bread',
        description: 'Traditional sourdough bread with a tangy flavor and chewy crust.',
        price: 5.49,
        category: 'Bakery',
        stock: 30,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1585478259789-7788d1f8919e'
    },
    {
        name: 'Croissants',
        description: 'Buttery, flaky croissants made from scratch daily.',
        price: 1.99,
        category: 'Bakery',
        stock: 45,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
    },
    {
        name: 'Cinnamon Rolls',
        description: 'Soft cinnamon rolls with cream cheese frosting.',
        price: 6.99,
        category: 'Bakery',
        stock: 25,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd'
    },
    {
        name: 'Premium Ground Beef',
        description: 'Lean ground beef from grass-fed cattle, perfect for burgers and meatballs.',
        price: 7.99,
        category: 'Meat',
        stock: 30,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f'
    },
    {
        name: 'Chicken Breast',
        description: 'Boneless, skinless chicken breasts, trimmed and ready to cook.',
        price: 6.99,
        category: 'Meat',
        stock: 40,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1'
    },
    {
        name: 'Bacon',
        description: 'Hickory-smoked bacon, thick cut and flavorful.',
        price: 5.99,
        category: 'Meat',
        stock: 35,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1529856426070-e610ede5a2fd'
    },
    {
        name: 'Pork Chops',
        description: 'Bone-in pork chops from humanely raised pigs.',
        price: 8.49,
        category: 'Meat',
        stock: 25,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1560781499-627a54234656'
    },
    {
        name: 'Atlantic Salmon Fillet',
        description: 'Fresh Atlantic salmon fillets, rich in omega-3 fatty acids.',
        price: 12.99,
        category: 'Seafood',
        stock: 25,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'
    },
    {
        name: 'Large Shrimp',
        description: 'Large, peeled and deveined shrimp, ready to cook.',
        price: 14.99,
        category: 'Seafood',
        stock: 20,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1565680018092-ebb6c7954e34'
    },
    {
        name: 'Tuna Steaks',
        description: 'Fresh tuna steaks, perfect for grilling or searing.',
        price: 15.99,
        category: 'Seafood',
        stock: 15,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1544799182-0e592a835828'
    },
    {
        name: 'Frozen Mixed Vegetables',
        description: 'Quick-frozen mixed vegetables including peas, carrots, and corn.',
        price: 3.29,
        category: 'Frozen',
        stock: 60,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7'
    },
    {
        name: 'Ice Cream Vanilla',
        description: 'Premium vanilla ice cream made with real vanilla beans.',
        price: 4.99,
        category: 'Frozen',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371'
    },
    {
        name: 'Frozen Pizza',
        description: 'Stone-baked pepperoni pizza, ready to heat and eat.',
        price: 5.99,
        category: 'Frozen',
        stock: 25,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591'
    },
    {
        name: 'Orange Juice',
        description: 'Freshly squeezed orange juice, no added sugar or preservatives.',
        price: 3.99,
        category: 'Beverages',
        stock: 40,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba'
    },
    {
        name: 'Cold Brew Coffee',
        description: 'Smooth cold brew coffee, ready to drink.',
        price: 4.49,
        category: 'Beverages',
        stock: 35,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c'
    },
    {
        name: 'Sparkling Water',
        description: 'Refreshing sparkling water with natural fruit flavors.',
        price: 1.99,
        category: 'Beverages',
        stock: 60,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44'
    },
    {
        name: 'Potato Chips',
        description: 'Crispy potato chips with sea salt, kettle cooked.',
        price: 2.99,
        category: 'Snacks',
        stock: 70,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b'
    },
    {
        name: 'Mixed Nuts',
        description: 'Premium blend of roasted almonds, cashews, and pecans.',
        price: 6.99,
        category: 'Snacks',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1536591465196-9076d1a7a7dc'
    },
    {
        name: 'Dark Chocolate',
        description: '72% dark chocolate bar made with organic cacao.',
        price: 3.49,
        category: 'Snacks',
        stock: 50,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652d26'
    },
    {
        name: 'Basmati Rice',
        description: 'Premium long-grain basmati rice, aromatic and fluffy when cooked.',
        price: 5.49,
        category: 'Grains',
        stock: 80,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1536746953245-474ec0924354'
    },
    {
        name: 'Quinoa',
        description: 'Organic white quinoa, a protein-rich ancient grain.',
        price: 6.99,
        category: 'Grains',
        stock: 45,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1564894809611-1742fc40ed80'
    },
    {
        name: 'Oatmeal',
        description: 'Steel-cut organic oats for a hearty breakfast.',
        price: 3.99,
        category: 'Grains',
        stock: 60,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1605286111428-cd34068503c7'
    },
    {
        name: 'Canned Tuna',
        description: 'Chunk light tuna in water, sustainable and dolphin-safe.',
        price: 1.99,
        category: 'Canned Goods',
        stock: 100,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1597069476387-69e588770fec'
    },
    {
        name: 'Black Beans',
        description: 'Organic black beans, ready to use in soups, salads, and more.',
        price: 1.29,
        category: 'Canned Goods',
        stock: 120,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1590286162167-775fb6c02f0b'
    },
    {
        name: 'Tomato Sauce',
        description: 'Organic tomato sauce with herbs, perfect for pasta dishes.',
        price: 2.49,
        category: 'Canned Goods',
        stock: 90,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb'
    },
    {
        name: 'Extra Virgin Olive Oil',
        description: 'Cold-pressed extra virgin olive oil, perfect for cooking and dressing.',
        price: 8.99,
        category: 'Other',
        stock: 35,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5'
    },
    {
        name: 'Honey',
        description: 'Raw, unfiltered wildflower honey from local beekeepers.',
        price: 7.99,
        category: 'Other',
        stock: 40,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924'
    },
    {
        name: 'Maple Syrup',
        description: 'Pure maple syrup harvested from Vermont maple trees.',
        price: 9.99,
        category: 'Other',
        stock: 30,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1589418681674-2492dc3c81b3'
    }
];
const seedProducts = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('Error: MONGODB_URI is not defined in the environment variables');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        await Product.deleteMany({});
        console.log('Products cleared from database');
        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`${createdProducts.length} products seeded successfully`);
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
            console.log(`\n${category} (${groupedProducts[category].length} items):`);
            groupedProducts[category].forEach((product, index) => {
                console.log(`  ${index + 1}. ${product.name} - $${product.price} (ID: ${product._id})`);
            });
        });
        await mongoose.disconnect();
        console.log('\nMongoDB disconnected');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};
const isMainModule = import.meta.url.endsWith('seedProducts.js') || import.meta.url.endsWith('seedProducts.ts');
if (isMainModule) {
    seedProducts();
}
export { seedProducts };
//# sourceMappingURL=seedProducts.js.map