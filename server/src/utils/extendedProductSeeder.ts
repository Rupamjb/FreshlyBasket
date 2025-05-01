import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/Product.js';

// Initialize colors
colors.enable();

// Load environment variables
dotenv.config();

// MongoDB connection string - use the one with products
const MONGODB_URI = process.env.MONGODB_URI || 
  "mongodb+srv://debangsu12:sunny120205@cluster0.rhnpbaa.mongodb.net/grocery-ecommerce?retryWrites=true&w=majority&appName=Cluster0";

// Product data with 10 products for each category
const vegetableProducts = [
  {
    name: "Fresh Spinach",
    slug: "fresh-spinach",
    description: "Organic spinach leaves, rich in iron and vitamins.",
    price: 2.99,
    category: "Vegetables",
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
    unit: "bunch",
    isActive: true
  },
  {
    name: "Carrots",
    slug: "carrots",
    description: "Sweet and crunchy carrots, perfect for snacking or cooking.",
    price: 1.99,
    category: "Vegetables",
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
    unit: "kg",
    isActive: true
  },
  {
    name: "Bell Peppers",
    slug: "bell-peppers",
    description: "Colorful bell peppers, great for salads and stir-fries.",
    price: 3.49,
    category: "Vegetables",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83",
    unit: "kg",
    isActive: true
  },
  {
    name: "Broccoli",
    slug: "broccoli",
    description: "Fresh broccoli florets, packed with nutrients.",
    price: 2.49,
    category: "Vegetables",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc",
    unit: "kg",
    isActive: true
  },
  {
    name: "Cucumber",
    slug: "cucumber",
    description: "Cool and refreshing cucumbers, ideal for salads.",
    price: 1.79,
    category: "Vegetables",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6",
    unit: "kg",
    isActive: true
  },
  {
    name: "Zucchini",
    slug: "zucchini",
    description: "Fresh zucchini, versatile for grilling, baking, or sautéing.",
    price: 2.29,
    category: "Vegetables",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1596636801503-c9b52adc322e",
    unit: "kg",
    isActive: true
  },
  {
    name: "Red Onions",
    slug: "red-onions",
    description: "Sweet red onions, perfect for salads and garnishing.",
    price: 1.59,
    category: "Vegetables",
    stock: 130,
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
    unit: "kg",
    isActive: true
  },
  {
    name: "Potatoes",
    slug: "potatoes",
    description: "Fresh potatoes, great for roasting, mashing, or frying.",
    price: 3.99,
    category: "Vegetables",
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
    unit: "kg",
    isActive: true
  },
  {
    name: "Cherry Tomatoes",
    slug: "cherry-tomatoes",
    description: "Sweet cherry tomatoes, perfect for salads and snacking.",
    price: 3.99,
    category: "Vegetables",
    stock: 85,
    imageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99",
    unit: "pack",
    isActive: true
  },
  {
    name: "Mushrooms",
    slug: "mushrooms",
    description: "Fresh button mushrooms, great for sautéing and adding to dishes.",
    price: 4.49,
    category: "Vegetables",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    unit: "pack",
    isActive: true
  }
];

const fruitProducts = [
  {
    name: "Red Apples",
    slug: "red-apples",
    description: "Crisp and sweet red apples, perfect for snacking.",
    price: 3.99,
    category: "Fruits",
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
    unit: "kg",
    isActive: true
  },
  {
    name: "Bananas",
    slug: "bananas",
    description: "Sweet, ripe bananas, great for smoothies or snacking.",
    price: 1.99,
    category: "Fruits",
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
    unit: "kg",
    isActive: true
  },
  {
    name: "Strawberries",
    slug: "strawberries",
    description: "Sweet and juicy strawberries, perfect for desserts.",
    price: 4.99,
    category: "Fruits",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
    unit: "pack",
    isActive: true
  },
  {
    name: "Blueberries",
    slug: "blueberries",
    description: "Fresh blueberries, packed with antioxidants.",
    price: 5.99,
    category: "Fruits",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e",
    unit: "pack",
    isActive: true
  },
  {
    name: "Oranges",
    slug: "oranges",
    description: "Juicy oranges, rich in vitamin C.",
    price: 3.49,
    category: "Fruits",
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1549888834-3ec93abae044",
    unit: "kg",
    isActive: true
  },
  {
    name: "Grapes",
    slug: "grapes",
    description: "Sweet seedless grapes, great for snacking.",
    price: 4.99,
    category: "Fruits",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f",
    unit: "kg",
    isActive: true
  },
  {
    name: "Watermelon",
    slug: "watermelon",
    description: "Sweet and refreshing watermelon, perfect for hot days.",
    price: 5.99,
    category: "Fruits",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1563114773-84221bd62daa",
    unit: "item",
    isActive: true
  },
  {
    name: "Pineapple",
    slug: "pineapple",
    description: "Sweet and tangy pineapple, great for desserts and smoothies.",
    price: 4.99,
    category: "Fruits",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba",
    unit: "item",
    isActive: true
  },
  {
    name: "Kiwi",
    slug: "kiwi",
    description: "Tangy kiwi fruits, packed with vitamin C and fiber.",
    price: 3.99,
    category: "Fruits",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71",
    unit: "kg",
    isActive: true
  },
  {
    name: "Mango",
    slug: "mango",
    description: "Sweet and juicy mangoes, perfect for smoothies and desserts.",
    price: 6.99,
    category: "Fruits",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078",
    unit: "kg",
    isActive: true
  }
];

const dairyProducts = [
  {
    name: "Whole Milk",
    slug: "whole-milk",
    description: "Fresh whole milk from grass-fed cows.",
    price: 3.99,
    category: "Dairy",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "liter",
    isActive: true
  },
  {
    name: "Cheddar Cheese",
    slug: "cheddar-cheese",
    description: "Aged cheddar cheese, perfect for sandwiches and cooking.",
    price: 5.99,
    category: "Dairy",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
    unit: "pack",
    isActive: true
  },
  {
    name: "Greek Yogurt",
    slug: "greek-yogurt",
    description: "Creamy Greek yogurt, high in protein and probiotics.",
    price: 4.49,
    category: "Dairy",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
    unit: "pack",
    isActive: true
  },
  {
    name: "Butter",
    slug: "butter",
    description: "Premium unsalted butter, perfect for baking and cooking.",
    price: 3.99,
    category: "Dairy",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1589985270958-afde11999555",
    unit: "pack",
    isActive: true
  },
  {
    name: "Cream Cheese",
    slug: "cream-cheese",
    description: "Smooth cream cheese, ideal for spreads and baking.",
    price: 3.49,
    category: "Dairy",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "pack",
    isActive: true
  },
  {
    name: "Sour Cream",
    slug: "sour-cream",
    description: "Tangy sour cream, perfect for toppings and dips.",
    price: 2.99,
    category: "Dairy",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "pack",
    isActive: true
  },
  {
    name: "Mozzarella Cheese",
    slug: "mozzarella-cheese",
    description: "Fresh mozzarella cheese, perfect for pizzas and salads.",
    price: 4.99,
    category: "Dairy",
    stock: 65,
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
    unit: "pack",
    isActive: true
  },
  {
    name: "Almond Milk",
    slug: "almond-milk",
    description: "Creamy almond milk, dairy-free alternative.",
    price: 4.49,
    category: "Dairy",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "liter",
    isActive: true
  },
  {
    name: "Heavy Cream",
    slug: "heavy-cream",
    description: "Rich heavy cream, perfect for desserts and sauces.",
    price: 4.29,
    category: "Dairy",
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "pack",
    isActive: true
  },
  {
    name: "Parmesan Cheese",
    slug: "parmesan-cheese",
    description: "Aged Parmesan cheese, great for pasta and salads.",
    price: 6.99,
    category: "Dairy",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
    unit: "pack",
    isActive: true
  }
];

const bakeryProducts = [
  {
    name: "Whole Wheat Bread",
    slug: "whole-wheat-bread",
    description: "Freshly baked whole wheat bread, perfect for sandwiches.",
    price: 3.99,
    category: "Bakery",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    unit: "item",
    isActive: true
  },
  {
    name: "Baguette",
    slug: "baguette",
    description: "Crispy French baguette, freshly baked daily.",
    price: 2.99,
    category: "Bakery",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c",
    unit: "item",
    isActive: true
  },
  {
    name: "Croissants",
    slug: "croissants",
    description: "Buttery and flaky croissants, perfect for breakfast.",
    price: 1.99,
    category: "Bakery",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
    unit: "item",
    isActive: true
  },
  {
    name: "Chocolate Muffins",
    slug: "chocolate-muffins",
    description: "Moist chocolate muffins with chocolate chips.",
    price: 2.49,
    category: "Bakery",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1604882406385-6df5106748b4",
    unit: "pack",
    isActive: true
  },
  {
    name: "Sourdough Bread",
    slug: "sourdough-bread",
    description: "Artisanal sourdough bread with a crispy crust.",
    price: 4.99,
    category: "Bakery",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1585478259715-2a08a5f98f3a",
    unit: "item",
    isActive: true
  },
  {
    name: "Cinnamon Rolls",
    slug: "cinnamon-rolls",
    description: "Sweet cinnamon rolls with cream cheese frosting.",
    price: 3.49,
    category: "Bakery",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1566650554919-44ec6bbe2518",
    unit: "pack",
    isActive: true
  },
  {
    name: "Bagels",
    slug: "bagels",
    description: "Freshly baked bagels, perfect for breakfast or sandwiches.",
    price: 3.99,
    category: "Bakery",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1585535570611-31b74583falle",
    unit: "pack",
    isActive: true
  },
  {
    name: "Blueberry Muffins",
    slug: "blueberry-muffins",
    description: "Moist muffins filled with fresh blueberries.",
    price: 2.49,
    category: "Bakery",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1587668178277-295251f900ce",
    unit: "pack",
    isActive: true
  },
  {
    name: "Garlic Bread",
    slug: "garlic-bread",
    description: "Warm, buttery garlic bread, perfect as a side dish.",
    price: 3.49,
    category: "Bakery",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1619535860434-da73348d5ae6",
    unit: "item",
    isActive: true
  },
  {
    name: "Danish Pastries",
    slug: "danish-pastries",
    description: "Flaky Danish pastries with various sweet fillings.",
    price: 2.99,
    category: "Bakery",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1623334044303-241021727882",
    unit: "pack",
    isActive: true
  }
];

const snacksProducts = [
  {
    name: "Potato Chips",
    slug: "potato-chips",
    description: "Crispy potato chips, lightly salted for perfect snacking.",
    price: 3.49,
    category: "Snacks",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b",
    unit: "pack",
    isActive: true
  },
  {
    name: "Mixed Nuts",
    slug: "mixed-nuts",
    description: "Premium blend of roasted nuts, perfect for healthy snacking.",
    price: 6.99,
    category: "Snacks",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1525053870217-aaee19c15e96",
    unit: "pack",
    isActive: true
  },
  {
    name: "Chocolate Cookies",
    slug: "chocolate-cookies",
    description: "Soft chocolate cookies with chocolate chips.",
    price: 4.49,
    category: "Snacks",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
    unit: "pack",
    isActive: true
  },
  {
    name: "Popcorn",
    slug: "popcorn",
    description: "Light and fluffy popcorn, perfect for movie nights.",
    price: 2.99,
    category: "Snacks",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1578849278619-e73a158e47e9",
    unit: "pack",
    isActive: true
  },
  {
    name: "Beef Jerky",
    slug: "beef-jerky",
    description: "Savory beef jerky, high in protein and flavor.",
    price: 7.99,
    category: "Snacks",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1592401807554-e0f25ceef5b5",
    unit: "pack",
    isActive: true
  },
  {
    name: "Granola Bars",
    slug: "granola-bars",
    description: "Nutritious granola bars with nuts and dried fruits.",
    price: 4.99,
    category: "Snacks",
    stock: 85,
    imageUrl: "https://images.unsplash.com/photo-1631256572618-8c3e8a3b07d0",
    unit: "pack",
    isActive: true
  },
  {
    name: "Cheese Crackers",
    slug: "cheese-crackers",
    description: "Crispy crackers with real cheese flavor.",
    price: 3.49,
    category: "Snacks",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60",
    unit: "pack",
    isActive: true
  },
  {
    name: "Chocolate Bars",
    slug: "chocolate-bars",
    description: "Premium chocolate bars, perfect for sweet cravings.",
    price: 2.99,
    category: "Snacks",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834",
    unit: "pack",
    isActive: true
  },
  {
    name: "Pretzels",
    slug: "pretzels",
    description: "Crunchy pretzels, lightly salted for perfect snacking.",
    price: 3.29,
    category: "Snacks",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1621939512433-702e908e0cd9",
    unit: "pack",
    isActive: true
  },
  {
    name: "Trail Mix",
    slug: "trail-mix",
    description: "Nutritious blend of nuts, seeds, and dried fruits.",
    price: 5.99,
    category: "Snacks",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea",
    unit: "pack",
    isActive: true
  }
];

// Combine all products
const products = [
  ...vegetableProducts,
  ...fruitProducts,
  ...dairyProducts,
  ...bakeryProducts,
  ...snacksProducts
];

// Seed products to database
const seedProducts = async () => {
  try {
    console.log('Connecting to MongoDB...'.yellow);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB'.green);

    // Get existing slugs to avoid duplicates
    const existingSlugs = await Product.distinct('slug');
    console.log(`Found ${existingSlugs.length} existing products with unique slugs`.cyan);

    // Filter out products with existing slugs
    const newProducts = products.filter(product => !existingSlugs.includes(product.slug));
    console.log(`After filtering, ${newProducts.length} new products will be added`.cyan);

    // Add a unique suffix to each product that exists already
    const productsToAdd = [];
    for (const product of products) {
      if (existingSlugs.includes(product.slug)) {
        // Create a unique version by adding a timestamp to the slug
        const timestamp = Date.now();
        const uniqueProduct = {
          ...product,
          name: `${product.name} (New)`,
          slug: `${product.slug}-${timestamp}`
        };
        productsToAdd.push(uniqueProduct);
      } else {
        productsToAdd.push(product);
      }
    }

    if (productsToAdd.length === 0) {
      console.log('No new products to add'.yellow);
      await mongoose.disconnect();
      return;
    }

    // Insert products
    console.log(`Seeding ${productsToAdd.length} products...`.yellow);

    // Insert products in batches to avoid overwhelming the database
    const BATCH_SIZE = 10;
    for (let i = 0; i < productsToAdd.length; i += BATCH_SIZE) {
      const batch = productsToAdd.slice(i, i + BATCH_SIZE);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(productsToAdd.length / BATCH_SIZE)}`.green);
    }

    console.log(`Successfully seeded ${productsToAdd.length} products`.green);

    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB'.green);

    console.log('Product seeding completed successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:'.red.bold, error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts(); 
 
 