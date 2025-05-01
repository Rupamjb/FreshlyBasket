// Vercel serverless function to handle SPA routing
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/html');
    
    // Serve the index.html for all paths - SPA routing
    const indexPath = path.join(__dirname, '../dist/index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error in SPA handler:', error);
    return res.status(500).send('Internal Server Error');
  }
}; 