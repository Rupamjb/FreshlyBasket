import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

// Additional grocery products with real image URLs
const additionalProducts = [
  // VEGETABLES
  {
    name: 'Brussels Sprouts',
    description: 'Fresh, nutrient-rich brussels sprouts perfect for roasting or sautéing.',
    price: 3.49,
    category: 'Vegetables',
    stock: 75,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83'
  },
  {
    name: 'Sweet Potatoes',
    description: 'Organic sweet potatoes, versatile for roasting, mashing, or making fries.',
    price: 2.29,
    category: 'Vegetables',
    stock: 110,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1596096380874-e66c0aebd4d3'
  },
  {
    name: 'Red Onions',
    description: 'Sweet and flavorful red onions for salads and cooking.',
    price: 1.79,
    category: 'Vegetables',
    stock: 130,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655'
  },
  {
    name: 'Cucumber',
    description: 'Crisp, fresh cucumbers perfect for salads and snacks.',
    price: 1.29,
    category: 'Vegetables',
    stock: 95,
    unit: 'item',
    imageUrl: 'https://images.unsplash.com/photo-1602600195640-fe92ca2de396'
  },
  {
    name: 'Zucchini',
    description: 'Fresh green zucchini, versatile for grilling, sautéing, or baking.',
    price: 1.99,
    category: 'Vegetables',
    stock: 80,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1583687355032-81142188c8e5'
  },
  {
    name: 'Mushrooms',
    description: 'Fresh white button mushrooms for cooking and salads.',
    price: 3.29,
    category: 'Vegetables',
    stock: 65,
    unit: 'pack',
    imageUrl: 'https://images.unsplash.com/photo-1577495550396-bcdb8d586958'
  },
  {
    name: 'Lettuce Mix',
    description: 'Fresh mixed lettuce varieties for salads and sandwiches.',
    price: 2.99,
    category: 'Vegetables',
    stock: 50,
    unit: 'pack',
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab518'
  },
  {
    name: 'Cauliflower',
    description: 'Fresh whole cauliflower, perfect for roasting or making cauliflower rice.',
    price: 3.59,
    category: 'Vegetables',
    stock: 55,
    unit: 'item',
    imageUrl: 'https://images.unsplash.com/photo-1559825603-9396ae1ed1c2'
  },
  {
    name: 'Asparagus',
    description: 'Fresh asparagus spears, perfect for roasting or grilling.',
    price: 4.99,
    category: 'Vegetables',
    stock: 45,
    unit: 'pack',
    imageUrl: 'https://images.unsplash.com/photo-1599319101573-277ff66032db'
  },
  {
    name: 'Radishes',
    description: 'Crisp, peppery radishes for salads and garnishes.',
    price: 1.89,
    category: 'Vegetables',
    stock: 70,
    unit: 'bunch',
    imageUrl: 'https://images.unsplash.com/photo-1595159232667-5a81be8c62c0'
  },

  // FRUITS
  {
    name: 'Pineapple',
    description: 'Sweet, juicy pineapple, ready to cut and enjoy.',
    price: 3.99,
    category: 'Fruits',
    stock: 40,
    unit: 'item',
    imageUrl: 'https://images.unsplash.com/photo-1496843916299-590492c751f4'
  },
  {
    name: 'Watermelon',
    description: 'Sweet, refreshing watermelon, perfect for hot days.',
    price: 5.99,
    category: 'Fruits',
    stock: 25,
    unit: 'item',
    imageUrl: 'https://images.unsplash.com/photo-1563114773-84221bd62daa'
  },
  {
    name: 'Navel Oranges',
    description: 'Sweet, juicy oranges high in vitamin C.',
    price: 1.49,
    category: 'Fruits',
    stock: 120,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1608231603591-d583a6a75b57'
  },
  {
    name: 'Mango',
    description: 'Ripe, juicy mangoes with tropical flavor.',
    price: 2.29,
    category: 'Fruits',
    stock: 60,
    unit: 'item',
    imageUrl: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed'
  },
  {
    name: 'Kiwi Fruit',
    description: 'Sweet kiwi fruit packed with vitamin C and natural fiber.',
    price: 0.99,
    category: 'Fruits',
    stock: 80,
    unit: 'item',
    imageUrl: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71'
  },
  {
    name: 'Red Grapes',
    description: 'Sweet seedless red grapes for snacking or desserts.',
    price: 3.99,
    category: 'Fruits',
    stock: 55,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f'
  },
  {
    name: 'Lemons',
    description: 'Fresh, bright lemons for cooking, baking, and beverages.',
    price: 0.89,
    category: 'Fruits',
    stock: 100,
    unit: 'item',
    imageUrl: 'https://images.unsplash.com/photo-1615487303060-7c97a3a01eb5'
  },
  {
    name: 'Peaches',
    description: 'Juicy, sweet peaches perfect for eating fresh or baking.',
    price: 2.49,
    category: 'Fruits',
    stock: 50,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1634330691697-66be92d01168'
  },
  {
    name: 'Pears',
    description: 'Sweet and juicy pears with smooth texture.',
    price: 2.29,
    category: 'Fruits',
    stock: 65,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1631160299919-6a175aa6d189'
  },
  {
    name: 'Plums',
    description: 'Sweet, juicy plums with vibrant flavor.',
    price: 2.99,
    category: 'Fruits',
    stock: 45,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1603408209093-cd3c9af497d6'
  }
];

// Seed additional products
const seedAdditionalProducts = async () => {
  try {
    // Check for MONGODB_URI in environment
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in the environment variables');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Insert sample products
    const createdProducts = await Product.insertMany(additionalProducts);
    console.log(`${createdProducts.length} additional products seeded successfully`);

    // Display the products grouped by category
    console.log('Seeded additional products by category:');
    
    // Group products by category
    const groupedProducts: Record<string, any[]> = {};
    createdProducts.forEach(product => {
      const category = product.category as string;
      if (!groupedProducts[category]) {
        groupedProducts[category] = [];
      }
      groupedProducts[category].push(product);
    });
    
    // Display products by category
    Object.keys(groupedProducts).sort().forEach(category => {
      console.log(`\n${category} (${groupedProducts[category].length} items):`);
      groupedProducts[category].forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price} (ID: ${product._id})`);
      });
    });

    // Close the connection
    await mongoose.disconnect();
    console.log('\nMongoDB disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding additional products:', error);
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
// For ES modules, check if the import.meta.url is the same as the main module
const isMainModule = import.meta.url.endsWith('additionalProducts.js') || import.meta.url.endsWith('additionalProducts.ts');
if (isMainModule) {
  seedAdditionalProducts();
}

export { additionalProducts, seedAdditionalProducts }; 
 
 