// Build script for Vercel deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to log progress
function log(message) {
  console.log(`\x1b[36m[Vercel Build]\x1b[0m ${message}`);
}

// Function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy directory
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  log('Starting enhanced build process...');

  // Run the standard build
  log('Running Vite build...');
  execSync('npm run build', { stdio: 'inherit' });

  // Ensure public directory is copied to the dist folder
  if (fs.existsSync('./public')) {
    log('Copying public assets to dist folder...');
    
    // Read all entries in public
    const entries = fs.readdirSync('./public', { withFileTypes: true });
    
    for (const entry of entries) {
      // Skip certain files (like 404.html which is handled separately)
      if (entry.name === '404.html' || entry.name === '_redirects') {
        continue;
      }
      
      const srcPath = path.join('./public', entry.name);
      const destPath = path.join('./dist', entry.name);
      
      if (entry.isDirectory()) {
        log(`Copying directory ${entry.name}...`);
        copyDir(srcPath, destPath);
      } else {
        log(`Copying file ${entry.name}...`);
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Create a Vercel config file in the public folder
  log('Creating Vercel routes config...');
  fs.writeFileSync('./dist/vercel.json', JSON.stringify({
    "routes": [
      { "handle": "filesystem" },
      { "src": "/api/(.*)", "dest": "/api/server.js" },
      { "src": "/(.*)", "dest": "/index.html" }
    ]
  }, null, 2));

  log('Build completed successfully!');
} catch (error) {
  console.error('\x1b[31m[Build Error]\x1b[0m', error.message);
  process.exit(1);
} 