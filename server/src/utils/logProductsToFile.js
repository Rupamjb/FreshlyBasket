// Import the sample product data from all seeder files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sampleProducts } from './seedProducts.ts';
import { additionalProducts } from './additionalProducts.ts';
import { additionalProducts2 } from './additionalProducts2.ts';
import { additionalProducts3 } from './additionalProducts3.ts';

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

// Count products by category
const groupedProducts = {};
allProducts.forEach(product => {
  const category = product.category;
  if (!groupedProducts[category]) {
    groupedProducts[category] = [];
  }
  groupedProducts[category].push(product);
});

// Create output string
let output = `# Grocery E-commerce Products\n\n`;
output += `Total products: ${allProducts.length}\n\n`;
output += `## Products by Category\n\n`;

// Add products by category
Object.keys(groupedProducts).sort().forEach(category => {
  output += `### ${category} (${groupedProducts[category].length} items)\n\n`;
  
  groupedProducts[category].forEach((product, index) => {
    output += `${index + 1}. **${product.name}** - $${product.price} (${product.unit})\n`;
    output += `   - ${product.description}\n`;
    output += `   - Stock: ${product.stock}\n`;
    output += `   - Image: ${product.imageUrl}\n\n`;
  });
});

// Write to file
const outputPath = path.join(__dirname, '..', '..', 'product-catalog.md');
fs.writeFileSync(outputPath, output);
console.log(`Product catalog has been written to: ${outputPath}`);
console.log(`Total of ${allProducts.length} products across ${Object.keys(groupedProducts).length} categories.`);

// Print summary
console.log('\nCategory summary:');
Object.keys(groupedProducts).sort().forEach(category => {
  console.log(`${category}: ${groupedProducts[category].length} items`);
}); 