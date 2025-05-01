// A simple script to count and print all products by category
import { sampleProducts } from './seedProducts.js';
import { additionalProducts } from './additionalProducts.js';
import { additionalProducts2 } from './additionalProducts2.js';
import { additionalProducts3 } from './additionalProducts3.js';

// Combine all products
const allProducts = [
  ...sampleProducts,
  ...additionalProducts,
  ...additionalProducts2,
  ...additionalProducts3
];

// Count products by category
const groupedProducts: Record<string, any[]> = {};
allProducts.forEach(product => {
  const category = product.category;
  if (!groupedProducts[category]) {
    groupedProducts[category] = [];
  }
  groupedProducts[category].push(product);
});

// Print total count
console.log(`Total products: ${allProducts.length}`);
console.log(`\nProducts by category:`);

// Print products by category
Object.keys(groupedProducts).sort().forEach(category => {
  console.log(`${category}: ${groupedProducts[category].length} items`);
});

// Print a sample product from each category
console.log(`\nSample product from each category:`);
Object.keys(groupedProducts).sort().forEach(category => {
  const sample = groupedProducts[category][0];
  console.log(`\n${category}:`);
  console.log(`  Name: ${sample.name}`);
  console.log(`  Price: $${sample.price}`);
  console.log(`  Unit: ${sample.unit}`);
  console.log(`  Image: ${sample.imageUrl}`);
}); 
 
 