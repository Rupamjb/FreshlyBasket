import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
dotenv.config();
const additionalProducts2 = [
    {
        name: 'Cottage Cheese',
        description: 'Creamy cottage cheese, great for breakfast or as a protein-rich snack.',
        price: 3.79,
        category: 'Dairy',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1634467524884-897d0af5e104'
    },
    {
        name: 'Mozzarella Cheese',
        description: 'Fresh mozzarella cheese, perfect for salads and pizza.',
        price: 4.29,
        category: 'Dairy',
        stock: 45,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a'
    },
    {
        name: 'Heavy Cream',
        description: 'Rich heavy cream for cooking, baking, and whipping.',
        price: 3.49,
        category: 'Dairy',
        stock: 35,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7'
    },
    {
        name: 'Cream Cheese',
        description: 'Smooth cream cheese for cooking, baking, and spreads.',
        price: 2.99,
        category: 'Dairy',
        stock: 50,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327'
    },
    {
        name: 'Parmesan Cheese',
        description: 'Aged parmesan cheese, grated and ready to use.',
        price: 5.99,
        category: 'Dairy',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2'
    },
    {
        name: 'Goat Cheese',
        description: 'Creamy goat cheese with tangy flavor, perfect for salads and appetizers.',
        price: 4.99,
        category: 'Dairy',
        stock: 25,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83'
    },
    {
        name: 'Almond Milk',
        description: 'Unsweetened almond milk, dairy-free alternative.',
        price: 3.29,
        category: 'Dairy',
        stock: 40,
        unit: 'liter',
        imageUrl: 'https://images.unsplash.com/photo-1616112674503-990a45c08953'
    },
    {
        name: 'Blue Cheese',
        description: 'Rich, tangy blue cheese for salads and cheese boards.',
        price: 6.49,
        category: 'Dairy',
        stock: 20,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1604313999946-c8de4fcd3639'
    },
    {
        name: 'Sour Cream',
        description: 'Creamy sour cream for cooking and toppings.',
        price: 2.79,
        category: 'Dairy',
        stock: 45,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1589533610925-1cffc309ebaa'
    },
    {
        name: 'Coconut Yogurt',
        description: 'Dairy-free coconut yogurt with live cultures.',
        price: 4.99,
        category: 'Dairy',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5'
    },
    {
        name: 'Bagels',
        description: 'Freshly baked bagels in various flavors.',
        price: 3.99,
        category: 'Bakery',
        stock: 40,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1585478259069-7e86f986b44f'
    },
    {
        name: 'Baguette',
        description: 'Freshly baked traditional French baguette with crispy crust.',
        price: 2.99,
        category: 'Bakery',
        stock: 35,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df'
    },
    {
        name: 'Multigrain Rolls',
        description: 'Hearty multigrain rolls, perfect for sandwiches or alongside soups.',
        price: 3.49,
        category: 'Bakery',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff'
    },
    {
        name: 'Banana Bread',
        description: 'Moist, freshly baked banana bread with real bananas.',
        price: 4.99,
        category: 'Bakery',
        stock: 25,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1605286830666-070397e9d6cb'
    },
    {
        name: 'Blueberry Muffins',
        description: 'Fresh blueberry muffins baked daily.',
        price: 4.49,
        category: 'Bakery',
        stock: 30,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa'
    },
    {
        name: 'Artisan Rye Bread',
        description: 'Flavorful artisan rye bread with caraway seeds.',
        price: 5.29,
        category: 'Bakery',
        stock: 20,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff'
    },
    {
        name: 'Focaccia',
        description: 'Italian focaccia bread with rosemary and olive oil.',
        price: 4.79,
        category: 'Bakery',
        stock: 25,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df'
    },
    {
        name: 'Brioche',
        description: 'Rich, buttery brioche, perfect for breakfast or desserts.',
        price: 5.99,
        category: 'Bakery',
        stock: 20,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1620921586333-b7564f2c28f2'
    },
    {
        name: 'Gluten-Free Bread',
        description: 'Artisan gluten-free bread with great texture and flavor.',
        price: 6.49,
        category: 'Bakery',
        stock: 15,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef'
    },
    {
        name: 'Chocolate Croissants',
        description: 'Buttery chocolate-filled croissants baked fresh daily.',
        price: 2.49,
        category: 'Bakery',
        stock: 35,
        unit: 'item',
        imageUrl: 'https://images.unsplash.com/photo-1602351447937-745cb720612f'
    },
    {
        name: 'Lamb Chops',
        description: 'Premium lamb chops from grass-fed, ethically raised lambs.',
        price: 14.99,
        category: 'Meat',
        stock: 20,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1603048297172-6286ff10d841'
    },
    {
        name: 'Ground Turkey',
        description: 'Lean ground turkey, perfect for healthier meals.',
        price: 6.49,
        category: 'Meat',
        stock: 30,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1579215967331-0c5be3500980'
    },
    {
        name: 'Beef Ribeye Steak',
        description: 'Premium ribeye steak, well-marbled for maximum flavor.',
        price: 19.99,
        category: 'Meat',
        stock: 15,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1597733153203-a54d0fbc47de'
    },
    {
        name: 'Chicken Thighs',
        description: 'Bone-in chicken thighs, great for grilling and baking.',
        price: 5.99,
        category: 'Meat',
        stock: 35,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1548691905-57c36cc8d935'
    },
    {
        name: 'Italian Sausage',
        description: 'Flavorful Italian sausage made with traditional spices.',
        price: 7.49,
        category: 'Meat',
        stock: 25,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a254b3501'
    },
    {
        name: 'Beef Filet Mignon',
        description: 'Tender beef filet mignon steaks, perfect for special occasions.',
        price: 24.99,
        category: 'Meat',
        stock: 10,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976'
    },
    {
        name: 'Beef Short Ribs',
        description: 'Flavorful beef short ribs, perfect for slow cooking.',
        price: 13.99,
        category: 'Meat',
        stock: 18,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947'
    },
    {
        name: 'Turkey Breast',
        description: 'Boneless turkey breast, perfect for roasting or sandwiches.',
        price: 9.99,
        category: 'Meat',
        stock: 22,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1606843046080-50d93542e1bc'
    },
    {
        name: 'Beef Brisket',
        description: 'Premium beef brisket, perfect for smoking or slow cooking.',
        price: 12.99,
        category: 'Meat',
        stock: 16,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1610897600804-2ad34726302f'
    },
    {
        name: 'Veal Cutlets',
        description: 'Tender veal cutlets from humanely raised calves.',
        price: 16.99,
        category: 'Meat',
        stock: 15,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1625604087024-7fb538574940'
    },
    {
        name: 'Fresh Cod Fillets',
        description: 'Wild-caught cod fillets, perfect for baking or frying.',
        price: 13.99,
        category: 'Seafood',
        stock: 20,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1573506254784-205ffe54f1b7'
    },
    {
        name: 'Sea Scallops',
        description: 'Fresh sea scallops, sweet and tender, great for searing.',
        price: 18.99,
        category: 'Seafood',
        stock: 15,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1611090285232-5d6134f3e452'
    },
    {
        name: 'Tilapia Fillets',
        description: 'Mild, fresh tilapia fillets, sustainable and versatile.',
        price: 11.99,
        category: 'Seafood',
        stock: 25,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1544914379-62e4ffa93847'
    },
    {
        name: 'Mussels',
        description: 'Fresh mussels for soups, pasta, or steaming.',
        price: 7.99,
        category: 'Seafood',
        stock: 20,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6'
    },
    {
        name: 'Lobster Tails',
        description: 'Premium cold-water lobster tails, perfect for special occasions.',
        price: 29.99,
        category: 'Seafood',
        stock: 10,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b'
    },
    {
        name: 'Smoked Salmon',
        description: 'Thinly sliced cold-smoked salmon with mild flavor.',
        price: 12.99,
        category: 'Seafood',
        stock: 22,
        unit: 'pack',
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'
    },
    {
        name: 'Crab Legs',
        description: 'Alaskan king crab legs, sweet and succulent.',
        price: 26.99,
        category: 'Seafood',
        stock: 12,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1609758662438-a87926512820'
    },
    {
        name: 'Clams',
        description: 'Fresh littleneck clams for pasta, soups, or steaming.',
        price: 8.99,
        category: 'Seafood',
        stock: 18,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1466553556096-7e2c80a27c31'
    },
    {
        name: 'Halibut Fillet',
        description: 'Premium wild-caught halibut, mild and flaky.',
        price: 19.99,
        category: 'Seafood',
        stock: 14,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1515088167831-588f6752eee3'
    },
    {
        name: 'Octopus',
        description: 'Fresh octopus, perfect for Mediterranean dishes.',
        price: 15.99,
        category: 'Seafood',
        stock: 10,
        unit: 'kg',
        imageUrl: 'https://images.unsplash.com/photo-1527515673510-8aa78ce21f9b'
    }
];
const seedAdditionalProducts2 = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('Error: MONGODB_URI is not defined in the environment variables');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        const createdProducts = await Product.insertMany(additionalProducts2);
        console.log(`${createdProducts.length} additional products (part 2) seeded successfully`);
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
const isMainModule = import.meta.url.endsWith('additionalProducts2.js') || import.meta.url.endsWith('additionalProducts2.ts');
if (isMainModule) {
    seedAdditionalProducts2();
}
export { additionalProducts2, seedAdditionalProducts2 };
//# sourceMappingURL=additionalProducts2.js.map