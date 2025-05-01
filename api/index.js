// Direct handler for all routes on Vercel
module.exports = (req, res) => {
  // Always return the index.html content
  const fs = require('fs');
  const path = require('path');
  
  try {
    const indexPath = path.join(__dirname, '../dist/index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(indexContent);
  } catch (error) {
    console.error('Error serving index.html:', error);
    return res.status(500).send('Server Error');
  }
}; 