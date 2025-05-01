// Vercel serverless function to handle SPA routing
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');
    
    // Try to serve as a static file first
    const staticPath = path.join(__dirname, '../dist', req.url);
    if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
      const contentType = getContentType(staticPath);
      res.setHeader('Content-Type', contentType);
      return res.status(200).send(fs.readFileSync(staticPath));
    }
    
    // Serve the index.html for all other paths - SPA routing
    const indexPath = path.join(__dirname, '../dist/index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error in SPA handler:', error);
    return res.status(500).send('Internal Server Error');
  }
};

// Helper function to determine content type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'text/plain';
  }
} 