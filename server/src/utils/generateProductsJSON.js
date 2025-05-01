// Script to export all products to a JSON file for later MongoDB import
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the products directly instead of from compiled files
const sampleProducts = [
  // VEGETABLES
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
  }
];

// Import additionalProducts directly
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
  // Add a few more vegetables here
  
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
  }
];

// Sample from additionalProducts2
const additionalProducts2 = [
  // DAIRY
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
  
  // BAKERY
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
  }
];

// Sample from additionalProducts3
const additionalProducts3 = [
  // FROZEN
  {
    name: 'Frozen Berries Mix',
    description: 'Mix of frozen strawberries, blueberries, and raspberries.',
    price: 4.99,
    category: 'Frozen',
    stock: 40,
    unit: 'pack',
    imageUrl: 'https://images.unsplash.com/photo-1563746724533-d44e0357b5e5'
  },
  
  // SNACKS
  {
    name: 'Trail Mix',
    description: 'Premium mix of nuts, seeds, and dried fruits.',
    price: 4.99,
    category: 'Snacks',
    stock: 55,
    unit: 'pack',
    imageUrl: 'https://images.unsplash.com/photo-1558855981-75886a7c3a3f'
  }
];

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Combine all products
const allProducts = [
  ...sampleProducts,
  ...additionalProducts,
  ...additionalProducts2,
  ...additionalProducts3
];

console.log("Sample products loaded:", allProducts.length);

// Add _id field to each product for MongoDB
const productsWithId = allProducts.map((product, index) => {
  // Create a MongoDB ObjectId-like string (24 hex characters)
  const hexId = (index + 1).toString(16).padStart(24, '0');
  return {
    _id: { $oid: hexId },
    ...product,
    createdAt: { $date: new Date().toISOString() },
    updatedAt: { $date: new Date().toISOString() }
  };
});

// Write to file
const outputPath = path.join(__dirname, '..', '..', 'products-sample-export.json');
fs.writeFileSync(outputPath, JSON.stringify(productsWithId, null, 2));
console.log(`Products exported to: ${outputPath}`);
console.log(`Total of ${productsWithId.length} products exported as a sample.`);
console.log("This is a small sample of the full product catalog. The actual database contains 165 products across all categories.");

// Print summary by category
const categories = {};
allProducts.forEach(product => {
  if (!categories[product.category]) {
    categories[product.category] = 0;
  }
  categories[product.category]++;
});

console.log('\nCategory summary for sample:');
Object.keys(categories).sort().forEach(category => {
  console.log(`${category}: ${categories[category]} items`);
}); 