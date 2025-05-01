// Vercel API handler for SPA routing
module.exports = (req, res) => {
  // Set proper headers
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  // Serve the index.html file for all paths
  const fs = require('fs');
  const path = require('path');
  
  try {
    const filePath = path.join(__dirname, '../dist/index.html');
    const content = fs.readFileSync(filePath, 'utf8');
    res.status(200).send(content);
  } catch (error) {
    console.error('Error serving SPA:', error);
    res.status(500).send('Server Error');
  }
}; 