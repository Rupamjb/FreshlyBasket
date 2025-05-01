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

// Product data with 10 products for each category with Indian pricing (in Rupees) and descriptions
const vegetableProducts = [
  {
    name: "Fresh Palak",
    slug: "fresh-palak",
    description: "Organic palak (spinach) leaves, rich in iron and vitamins. Grown locally.",
    price: 40,
    category: "Vegetables",
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
    unit: "bunch",
    isActive: true
  },
  {
    name: "Gajar",
    slug: "gajar",
    description: "Sweet and crunchy carrots from Himachal, perfect for making halwa or sabzi.",
    price: 60,
    category: "Vegetables",
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
    unit: "kg",
    isActive: true
  },
  {
    name: "Shimla Mirch",
    slug: "shimla-mirch",
    description: "Colorful bell peppers from Shimla, great for stuffing or making sabzi.",
    price: 80,
    category: "Vegetables",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83",
    unit: "kg",
    isActive: true
  },
  {
    name: "Broccoli",
    slug: "broccoli-premium",
    description: "Fresh broccoli florets, perfect for healthy stir-fries and continental dishes.",
    price: 120,
    category: "Vegetables",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc",
    unit: "kg",
    isActive: true
  },
  {
    name: "Kheera",
    slug: "kheera",
    description: "Cool and refreshing cucumbers, perfect for raita and salads.",
    price: 40,
    category: "Vegetables",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6",
    unit: "kg",
    isActive: true
  },
  {
    name: "Turai",
    slug: "turai",
    description: "Fresh ridge gourd, excellent for making nutritious sabzi.",
    price: 50,
    category: "Vegetables",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1596636801503-c9b52adc322e",
    unit: "kg",
    isActive: true
  },
  {
    name: "Pyaaz",
    slug: "pyaaz",
    description: "Red onions, essential for Indian cooking and chutneys.",
    price: 35,
    category: "Vegetables",
    stock: 130,
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
    unit: "kg",
    isActive: true
  },
  {
    name: "Aloo",
    slug: "aloo",
    description: "Fresh potatoes from Punjab, perfect for aloo paratha, sabzi, or biryani.",
    price: 30,
    category: "Vegetables",
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655",
    unit: "kg",
    isActive: true
  },
  {
    name: "Cherry Tamatar",
    slug: "cherry-tamatar",
    description: "Sweet cherry tomatoes, perfect for garnishing and salads.",
    price: 60,
    category: "Vegetables",
    stock: 85,
    imageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99",
    unit: "pack",
    isActive: true
  },
  {
    name: "Button Mushroom",
    slug: "button-mushroom",
    description: "Fresh button mushrooms, great for making mushroom curry or pulao.",
    price: 80,
    category: "Vegetables",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    unit: "pack",
    isActive: true
  }
];

const fruitProducts = [
  {
    name: "Kashmiri Seb",
    slug: "kashmiri-seb",
    description: "Crisp and sweet Kashmiri apples, perfect for healthy snacking.",
    price: 180,
    category: "Fruits",
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
    unit: "kg",
    isActive: true
  },
  {
    name: "Kela",
    slug: "kela",
    description: "Sweet Robusta bananas, great for making shakes or eating directly.",
    price: 60,
    category: "Fruits",
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
    unit: "dozen",
    isActive: true
  },
  {
    name: "Strawberry Premium",
    slug: "strawberry-premium",
    description: "Sweet and juicy strawberries from Mahabaleshwar, perfect for desserts and milkshakes.",
    price: 250,
    category: "Fruits",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
    unit: "pack",
    isActive: true
  },
  {
    name: "Blueberry Imported",
    slug: "blueberry-imported",
    description: "Imported blueberries, packed with antioxidants and flavor.",
    price: 350,
    category: "Fruits",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e",
    unit: "pack",
    isActive: true
  },
  {
    name: "Nagpur Santra",
    slug: "nagpur-santra",
    description: "Juicy Nagpur oranges, rich in vitamin C and perfect for fresh juice.",
    price: 120,
    category: "Fruits",
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1549888834-3ec93abae044",
    unit: "kg",
    isActive: true
  },
  {
    name: "Angoor",
    slug: "angoor",
    description: "Sweet seedless grapes from Nasik, great for snacking and desserts.",
    price: 100,
    category: "Fruits",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f",
    unit: "kg",
    isActive: true
  },
  {
    name: "Tarbuj",
    slug: "tarbuj",
    description: "Sweet and refreshing watermelon, perfect for summer days.",
    price: 80,
    category: "Fruits",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1563114773-84221bd62daa",
    unit: "item",
    isActive: true
  },
  {
    name: "Ananas",
    slug: "ananas",
    description: "Sweet and tangy pineapple from Kerala, perfect for fruit chaat and desserts.",
    price: 90,
    category: "Fruits",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba",
    unit: "item",
    isActive: true
  },
  {
    name: "Kiwi Premium",
    slug: "kiwi-premium",
    description: "Tangy kiwi fruits, packed with vitamin C and fiber.",
    price: 180,
    category: "Fruits",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71",
    unit: "pack",
    isActive: true
  },
  {
    name: "Alphonso Aam",
    slug: "alphonso-aam",
    description: "Sweet and juicy Alphonso mangoes from Ratnagiri, the king of fruits.",
    price: 450,
    category: "Fruits",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078",
    unit: "dozen",
    isActive: true
  }
];

const dairyProducts = [
  {
    name: "Amul Milk",
    slug: "amul-milk",
    description: "Fresh toned milk from Amul, the taste of India.",
    price: 68,
    category: "Dairy",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "liter",
    isActive: true
  },
  {
    name: "Amul Cheese",
    slug: "amul-cheese",
    description: "Processed cheese from Amul, perfect for sandwiches and cooking.",
    price: 120,
    category: "Dairy",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
    unit: "pack",
    isActive: true
  },
  {
    name: "Mother Dairy Dahi",
    slug: "mother-dairy-dahi",
    description: "Creamy dahi (yogurt) from Mother Dairy, perfect for raita and kadhi.",
    price: 80,
    category: "Dairy",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
    unit: "pack",
    isActive: true
  },
  {
    name: "Amul Butter",
    slug: "amul-butter",
    description: "Delicious Amul butter, perfect for parathas and making makhani dishes.",
    price: 55,
    category: "Dairy",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1589985270958-afde11999555",
    unit: "pack",
    isActive: true
  },
  {
    name: "Britannia Cream Cheese",
    slug: "britannia-cream-cheese",
    description: "Smooth cream cheese from Britannia, ideal for spreads and cheesecakes.",
    price: 150,
    category: "Dairy",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "pack",
    isActive: true
  },
  {
    name: "Mother Dairy Chaach",
    slug: "mother-dairy-chaach",
    description: "Refreshing spiced buttermilk, perfect for hot summer days.",
    price: 30,
    category: "Dairy",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "pack",
    isActive: true
  },
  {
    name: "Go Cheese Mozzarella",
    slug: "go-cheese-mozzarella",
    description: "Stretchy mozzarella cheese, perfect for pizzas and pastas.",
    price: 230,
    category: "Dairy",
    stock: 65,
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
    unit: "pack",
    isActive: true
  },
  {
    name: "Sofit Soya Milk",
    slug: "sofit-soya-milk",
    description: "Nutritious soya milk, dairy-free alternative packed with protein.",
    price: 120,
    category: "Dairy",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "liter",
    isActive: true
  },
  {
    name: "Amul Fresh Cream",
    slug: "amul-fresh-cream",
    description: "Rich fresh cream, perfect for desserts and creamy curries.",
    price: 75,
    category: "Dairy",
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    unit: "pack",
    isActive: true
  },
  {
    name: "Go Cheese Parmesan",
    slug: "go-cheese-parmesan",
    description: "Aged Parmesan cheese, great for pasta and continental dishes.",
    price: 280,
    category: "Dairy",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
    unit: "pack",
    isActive: true
  }
];

const bakeryProducts = [
  {
    name: "Britannia Brown Bread",
    slug: "britannia-brown-bread",
    description: "Healthy whole wheat bread, perfect for breakfast and sandwiches.",
    price: 45,
    category: "Bakery",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    unit: "pack",
    isActive: true
  },
  {
    name: "French Baguette",
    slug: "french-baguette",
    description: "Crispy French baguette, freshly baked daily, perfect with soup.",
    price: 80,
    category: "Bakery",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c",
    unit: "item",
    isActive: true
  },
  {
    name: "Butter Croissants",
    slug: "butter-croissants",
    description: "Buttery and flaky croissants, perfect for breakfast with chai.",
    price: 60,
    category: "Bakery",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
    unit: "item",
    isActive: true
  },
  {
    name: "Chocolate Muffins",
    slug: "chocolate-muffins-premium",
    description: "Moist chocolate muffins with chocolate chips, freshly baked.",
    price: 45,
    category: "Bakery",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1604882406385-6df5106748b4",
    unit: "pack",
    isActive: true
  },
  {
    name: "Sourdough Bread",
    slug: "sourdough-bread-artisanal",
    description: "Artisanal sourdough bread with a crispy crust, made from natural yeast.",
    price: 120,
    category: "Bakery",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1585478259715-2a08a5f98f3a",
    unit: "item",
    isActive: true
  },
  {
    name: "Cinnamon Rolls",
    slug: "cinnamon-rolls-fresh",
    description: "Sweet cinnamon rolls with cream cheese frosting, perfect with evening chai.",
    price: 55,
    category: "Bakery",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1566650554919-44ec6bbe2518",
    unit: "pack",
    isActive: true
  },
  {
    name: "Multi-Grain Bagels",
    slug: "multi-grain-bagels",
    description: "Freshly baked multi-grain bagels, nutritious breakfast option.",
    price: 80,
    category: "Bakery",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1585535570611-31b74583falle",
    unit: "pack",
    isActive: true
  },
  {
    name: "Blueberry Muffins",
    slug: "blueberry-muffins-premium",
    description: "Moist muffins filled with imported blueberries, a perfect treat.",
    price: 60,
    category: "Bakery",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1587668178277-295251f900ce",
    unit: "pack",
    isActive: true
  },
  {
    name: "Garlic Naan",
    slug: "garlic-naan",
    description: "Warm, buttery garlic naan, perfect with butter chicken or dal makhani.",
    price: 40,
    category: "Bakery",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1619535860434-da73348d5ae6",
    unit: "pack",
    isActive: true
  },
  {
    name: "Pav Bread",
    slug: "pav-bread",
    description: "Soft pav bread, essential for pav bhaji and vada pav.",
    price: 30,
    category: "Bakery",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1623334044303-241021727882",
    unit: "pack",
    isActive: true
  }
];

const snacksProducts = [
  {
    name: "Lay's Magic Masala",
    slug: "lays-magic-masala",
    description: "Crispy potato chips with the iconic Magic Masala flavor, India's favorite.",
    price: 30,
    category: "Snacks",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b",
    unit: "pack",
    isActive: true
  },
  {
    name: "Dry Fruit Mixture",
    slug: "dry-fruit-mixture",
    description: "Premium blend of cashews, almonds, raisins, and pistachios, perfect for festive gifting.",
    price: 450,
    category: "Snacks",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1525053870217-aaee19c15e96",
    unit: "pack",
    isActive: true
  },
  {
    name: "Parle-G Gold Biscuits",
    slug: "parle-g-gold",
    description: "India's favorite tea-time companion, the iconic glucose biscuits.",
    price: 25,
    category: "Snacks",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
    unit: "pack",
    isActive: true
  },
  {
    name: "Act II Popcorn",
    slug: "act-ii-popcorn",
    description: "Light and fluffy microwave popcorn, perfect for movie nights.",
    price: 40,
    category: "Snacks",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1578849278619-e73a158e47e9",
    unit: "pack",
    isActive: true
  },
  {
    name: "Lijjat Papad",
    slug: "lijjat-papad",
    description: "Crunchy papad made by women's cooperative, a perfect accompaniment to any meal.",
    price: 45,
    category: "Snacks",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1592401807554-e0f25ceef5b5",
    unit: "pack",
    isActive: true
  },
  {
    name: "Haldiram's Bhujia",
    slug: "haldirams-bhujia",
    description: "Spicy and crunchy sev bhujia from Haldiram's, a classic Indian snack.",
    price: 55,
    category: "Snacks",
    stock: 85,
    imageUrl: "https://images.unsplash.com/photo-1631256572618-8c3e8a3b07d0",
    unit: "pack",
    isActive: true
  },
  {
    name: "Monaco Cheese Crackers",
    slug: "monaco-cheese-crackers",
    description: "Crispy salty crackers with cheese flavor, great with evening chai.",
    price: 35,
    category: "Snacks",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60",
    unit: "pack",
    isActive: true
  },
  {
    name: "Cadbury Dairy Milk",
    slug: "cadbury-dairy-milk",
    description: "India's favorite milk chocolate, perfect for sweet cravings.",
    price: 60,
    category: "Snacks",
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834",
    unit: "pack",
    isActive: true
  },
  {
    name: "Haldiram's Aloo Bhujia",
    slug: "haldirams-aloo-bhujia",
    description: "Crunchy potato sev, a popular Indian tea-time snack.",
    price: 60,
    category: "Snacks",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1621939512433-702e908e0cd9",
    unit: "pack",
    isActive: true
  },
  {
    name: "Chana Chor Garam",
    slug: "chana-chor-garam",
    description: "Spicy roasted chickpeas with masala, a healthy protein-rich snack.",
    price: 50,
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

    // Clear all existing products before adding new Indian products
    console.log('Clearing existing products...'.yellow);
    await Product.deleteMany({});
    console.log('All existing products cleared'.cyan);

    // Insert products
    console.log(`Seeding ${productsToAdd.length} Indian products...`.yellow);

    // Insert products in batches to avoid overwhelming the database
    const BATCH_SIZE = 10;
    for (let i = 0; i < productsToAdd.length; i += BATCH_SIZE) {
      const batch = productsToAdd.slice(i, i + BATCH_SIZE);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(productsToAdd.length / BATCH_SIZE)}`.green);
    }

    console.log(`Successfully seeded ${productsToAdd.length} Indian products`.green);

    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB'.green);

    console.log('Indian product seeding completed successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:'.red.bold, error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts(); 
 
 