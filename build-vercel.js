// Script to run after the build on Vercel
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const distDir = path.join(__dirname, 'dist');
const indexHtml = path.join(distDir, 'index.html');

// Create an array of route paths to create HTML files for
const routes = [
  '/products',
  '/product/1',
  '/cart',
  '/checkout',
  '/auth',
  '/profile',
  '/404',
  '/error'
];

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist!');
  process.exit(1);
}

// Read the index.html file
try {
  const indexContent = fs.readFileSync(indexHtml, 'utf8');
  
  // For each route, create a corresponding HTML file with the content of index.html
  routes.forEach(route => {
    const routePath = route === '/' ? '' : route;
    const routeDir = path.join(distDir, routePath);
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    
    // Write the index.html content to the route's index.html
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent);
    console.log(`Created HTML file for route: ${route}`);
  });
  
  console.log('Successfully created HTML files for all routes!');
} catch (error) {
  console.error('Error creating route HTML files:', error);
  process.exit(1);
} 