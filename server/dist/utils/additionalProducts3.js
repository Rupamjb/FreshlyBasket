import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
dotenv.config();
const additionalProducts3 = [
    {
        name: 'Frozen Berries Mix',
        description: 'Mix of frozen strawberries, blueberries, and raspberries.',
        price: 4.99,
        category: 'Frozen',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1563746724533-d44e0357b5e5'
    },
    {
        name: 'Frozen Spinach',
        description: 'Chopped frozen spinach, perfect for smoothies and cooking.',
        price: 2.49,
        category: 'Frozen',
        stock: 55,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb'
    },
    {
        name: 'Ice Cream Chocolate',
        description: 'Rich chocolate ice cream made with real cacao.',
        price: 4.99,
        category: 'Frozen',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1629213410577-eb528ebad9ac'
    },
    {
        name: 'Frozen Waffles',
        description: 'Whole grain frozen waffles, ready to toast.',
        price: 3.99,
        category: 'Frozen',
        stock: 45,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1513267257218-ac6195670a6a'
    },
    {
        name: 'Frozen Fish Fillets',
        description: 'Flash-frozen wild-caught cod fillets, individually wrapped.',
        price: 9.99,
        category: 'Frozen',
        stock: 25,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1574652356658-e931733abcbb'
    },
    {
        name: 'Veggie Burgers',
        description: 'Plant-based veggie burgers, ready to cook from frozen.',
        price: 5.99,
        category: 'Frozen',
        stock: 35,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360'
    },
    {
        name: 'Frozen Mango Chunks',
        description: 'Sweet mango chunks, perfect for smoothies and desserts.',
        price: 4.49,
        category: 'Frozen',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1501746877-14782df58970'
    },
    {
        name: 'Frozen Chicken Tenders',
        description: 'Breaded chicken tenders, ready to bake or air fry.',
        price: 7.99,
        category: 'Frozen',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710'
    },
    {
        name: 'Frozen Peas',
        description: 'Sweet green peas, flash-frozen at peak freshness.',
        price: 1.99,
        category: 'Frozen',
        stock: 50,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4'
    },
    {
        name: 'Frozen Lasagna',
        description: 'Family-size beef lasagna, ready to bake.',
        price: 8.99,
        category: 'Frozen',
        stock: 20,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1619895092538-128341789043'
    },
    {
        name: 'Green Tea',
        description: 'Organic green tea bags, rich in antioxidants.',
        price: 4.29,
        category: 'Beverages',
        stock: 50,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b'
    },
    {
        name: 'Coconut Water',
        description: 'Pure coconut water, naturally hydrating and refreshing.',
        price: 2.99,
        category: 'Beverages',
        stock: 45,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1536591675748-31f2109df56c'
    },
    {
        name: 'Almond Milk',
        description: 'Unsweetened almond milk, dairy-free alternative.',
        price: 3.49,
        category: 'Beverages',
        stock: 40,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0'
    },
    {
        name: 'Apple Juice',
        description: '100% pure pressed apple juice, no added sugar.',
        price: 2.99,
        category: 'Beverages',
        stock: 55,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b'
    },
    {
        name: 'Kombucha',
        description: 'Organic fermented tea with probiotics, various flavors.',
        price: 3.99,
        category: 'Beverages',
        stock: 30,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1595831101147-0fac0c85be00'
    },
    {
        name: 'Iced Tea',
        description: 'Ready-to-drink black tea with lemon, unsweetened.',
        price: 2.49,
        category: 'Beverages',
        stock: 60,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c1c8c55b88b7'
    },
    {
        name: 'Energy Drink',
        description: 'Natural energy drink with B vitamins and caffeine from green tea.',
        price: 3.29,
        category: 'Beverages',
        stock: 45,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e'
    },
    {
        name: 'Hot Chocolate Mix',
        description: 'Rich hot chocolate mix made with real cocoa.',
        price: 4.49,
        category: 'Beverages',
        stock: 35,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed'
    },
    {
        name: 'Protein Shake',
        description: 'Ready-to-drink protein shake with 20g protein per serving.',
        price: 3.99,
        category: 'Beverages',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1607490048597-25b7055790a8'
    },
    {
        name: 'Coconut Milk',
        description: 'Organic coconut milk for cooking and baking.',
        price: 3.29,
        category: 'Beverages',
        stock: 35,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1610725638836-201c7c27f8fa'
    },
    {
        name: 'Trail Mix',
        description: 'Premium mix of nuts, seeds, and dried fruits.',
        price: 4.99,
        category: 'Snacks',
        stock: 55,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1558855981-75886a7c3a3f'
    },
    {
        name: 'Protein Bars',
        description: 'High-protein bars with minimal sugar, various flavors.',
        price: 2.49,
        category: 'Snacks',
        stock: 65,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1581295342897-07fa2752ead2'
    },
    {
        name: 'Dried Mango',
        description: 'Sweet dried mango slices with no added sugar.',
        price: 3.99,
        category: 'Snacks',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1605829931839-5c93c3866cb3'
    },
    {
        name: 'Rice Crackers',
        description: 'Light and crispy rice crackers, lightly salted.',
        price: 2.99,
        category: 'Snacks',
        stock: 50,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3e5a740a10a0'
    },
    {
        name: 'Popcorn',
        description: 'Lightly salted popcorn made with organic kernels.',
        price: 3.49,
        category: 'Snacks',
        stock: 60,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1578849278502-614945b3de82'
    },
    {
        name: 'Beef Jerky',
        description: 'High-protein beef jerky with minimal ingredients.',
        price: 5.99,
        category: 'Snacks',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1593001574971-0acafb56aecc'
    },
    {
        name: 'Seaweed Snacks',
        description: 'Crispy roasted seaweed snacks, lightly salted.',
        price: 2.49,
        category: 'Snacks',
        stock: 45,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1581508473241-c45db0344d0d'
    },
    {
        name: 'Veggie Chips',
        description: 'Crispy chips made from real vegetables, lightly salted.',
        price: 3.79,
        category: 'Snacks',
        stock: 50,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087'
    },
    {
        name: 'Granola Bars',
        description: 'Chewy granola bars with oats, nuts, and dried fruits.',
        price: 3.99,
        category: 'Snacks',
        stock: 60,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1620151077242-aae3bd99a188'
    },
    {
        name: 'Roasted Chickpeas',
        description: 'Crunchy roasted chickpeas, perfect high-protein snack.',
        price: 3.49,
        category: 'Snacks',
        stock: 45,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1618353482480-61ca5a9a7879'
    },
    {
        name: 'Brown Rice',
        description: 'Organic whole grain brown rice, high in fiber.',
        price: 4.29,
        category: 'Grains',
        stock: 70,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac'
    },
    {
        name: 'Couscous',
        description: 'Quick-cooking whole wheat couscous.',
        price: 3.49,
        category: 'Grains',
        stock: 50,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1622542796254-5b9c46ab0cf9'
    },
    {
        name: 'Wild Rice',
        description: 'Nutritious wild rice with nutty flavor.',
        price: 6.99,
        category: 'Grains',
        stock: 40,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1626078264938-446d7c6b0ccc'
    },
    {
        name: 'Bulgur Wheat',
        description: 'Whole grain bulgur wheat for salads and side dishes.',
        price: 3.99,
        category: 'Grains',
        stock: 45,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1612257999853-6713adf8b3f8'
    },
    {
        name: 'Farro',
        description: 'Ancient grain farro with nutty flavor and chewy texture.',
        price: 5.49,
        category: 'Grains',
        stock: 35,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1621916903420-329e4d64a1c5'
    },
    {
        name: 'Pearl Barley',
        description: 'Versatile pearl barley for soups and grain bowls.',
        price: 2.99,
        category: 'Grains',
        stock: 55,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5'
    },
    {
        name: 'Millet',
        description: 'Gluten-free millet with mild flavor.',
        price: 3.79,
        category: 'Grains',
        stock: 40,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac'
    },
    {
        name: 'Corn Grits',
        description: 'Stone-ground corn grits for Southern-style cooking.',
        price: 2.99,
        category: 'Grains',
        stock: 50,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1630399337918-ff9d4656cefa'
    },
    {
        name: 'Amaranth',
        description: 'Ancient gluten-free grain high in protein.',
        price: 4.99,
        category: 'Grains',
        stock: 30,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1609843062000-4e0340fc3274'
    },
    {
        name: 'Buckwheat',
        description: 'Gluten-free buckwheat groats with earthy flavor.',
        price: 4.29,
        category: 'Grains',
        stock: 40,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1612206505481-c7b5ce8f8b71'
    },
    {
        name: 'Chickpeas',
        description: 'Organic chickpeas, ready to use in salads, hummus, and more.',
        price: 1.49,
        category: 'Canned Goods',
        stock: 110,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1592924846801-00e82781405e'
    },
    {
        name: 'Coconut Milk',
        description: 'Organic coconut milk for curries, soups, and desserts.',
        price: 2.99,
        category: 'Canned Goods',
        stock: 80,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1584274859012-74a6d32384fc'
    },
    {
        name: 'Diced Tomatoes',
        description: 'Fire-roasted diced tomatoes for cooking.',
        price: 1.79,
        category: 'Canned Goods',
        stock: 95,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1534964002766-c448a6f79eac'
    },
    {
        name: 'Corn',
        description: 'Sweet corn kernels, no salt or sugar added.',
        price: 1.29,
        category: 'Canned Goods',
        stock: 100,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1605289555344-a5003893fe40'
    },
    {
        name: 'Green Beans',
        description: 'Organic green beans, ready to heat and serve.',
        price: 1.69,
        category: 'Canned Goods',
        stock: 85,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1567375698348-5d9490ba8799'
    },
    {
        name: 'Pineapple Chunks',
        description: 'Sweet pineapple chunks in natural juice.',
        price: 1.99,
        category: 'Canned Goods',
        stock: 70,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba'
    },
    {
        name: 'Baked Beans',
        description: 'Vegetarian baked beans in tomato sauce.',
        price: 1.89,
        category: 'Canned Goods',
        stock: 80,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1594312622828-8bf2a2623f18'
    },
    {
        name: 'Salmon',
        description: 'Wild-caught canned salmon, rich in omega-3.',
        price: 4.99,
        category: 'Canned Goods',
        stock: 65,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1578759073857-57162803239b'
    },
    {
        name: 'Mushrooms',
        description: 'Sliced mushrooms, perfect for cooking.',
        price: 1.59,
        category: 'Canned Goods',
        stock: 75,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1602006655869-c23e76d2177f'
    },
    {
        name: 'Pumpkin Puree',
        description: '100% pure pumpkin puree for cooking and baking.',
        price: 2.29,
        category: 'Canned Goods',
        stock: 60,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1604000335320-c9a469936740'
    },
    {
        name: 'Almond Butter',
        description: 'Creamy almond butter made from roasted almonds.',
        price: 6.99,
        category: 'Other',
        stock: 45,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1600024017207-6b9e09109c29'
    },
    {
        name: 'Quinoa Flour',
        description: 'Gluten-free quinoa flour for baking.',
        price: 5.99,
        category: 'Other',
        stock: 35,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df'
    },
    {
        name: 'Organic Sugar',
        description: 'Unrefined organic cane sugar for baking.',
        price: 3.99,
        category: 'Other',
        stock: 50,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1625517236224-4ab57e051f88'
    },
    {
        name: 'Coconut Oil',
        description: 'Cold-pressed virgin coconut oil for cooking and baking.',
        price: 7.49,
        category: 'Other',
        stock: 40,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1626170733248-440a485f9e67'
    },
    {
        name: 'Balsamic Vinegar',
        description: 'Aged balsamic vinegar from Modena, Italy.',
        price: 8.99,
        category: 'Other',
        stock: 30,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5'
    },
    {
        name: 'Chia Seeds',
        description: 'Organic chia seeds rich in omega-3 fatty acids.',
        price: 4.99,
        category: 'Other',
        stock: 45,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1515543904379-3d757abe63ea'
    },
    {
        name: 'Sriracha Sauce',
        description: 'Spicy sriracha hot sauce for adding heat to dishes.',
        price: 3.49,
        category: 'Other',
        stock: 55,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1602107868424-db2f2e3c1578'
    },
    {
        name: 'Tahini',
        description: 'Creamy tahini made from roasted sesame seeds.',
        price: 5.99,
        category: 'Other',
        stock: 35,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1590010207195-273004236a0b'
    },
    {
        name: 'Nutritional Yeast',
        description: 'Savory nutritional yeast with cheesy flavor, rich in B vitamins.',
        price: 4.99,
        category: 'Other',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1570275239925-4af0aa82de7e'
    },
    {
        name: 'Vanilla Extract',
        description: 'Pure vanilla extract for baking and cooking.',
        price: 7.99,
        category: 'Other',
        stock: 45,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1621886292650-520f76c747d6'
    }
];
const seedAdditionalProducts3 = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('Error: MONGODB_URI is not defined in the environment variables');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        const createdProducts = await Product.insertMany(additionalProducts3);
        console.log(`${createdProducts.length} additional products (part 3) seeded successfully`);
        console.log('Seeded additional products by category:');
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
        console.error('Error seeding additional products:', error);
        process.exit(1);
    }
};
const isMainModule = import.meta.url.endsWith('additionalProducts3.js') || import.meta.url.endsWith('additionalProducts3.ts');
if (isMainModule) {
    seedAdditionalProducts3();
}
export { additionalProducts3, seedAdditionalProducts3 };
//# sourceMappingURL=additionalProducts3.js.map