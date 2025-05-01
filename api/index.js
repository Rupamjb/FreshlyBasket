// Simple server-side SPA routing handler for Vercel
const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  // Handle API requests
  if (req.url.startsWith('/api/')) {
    // In a real app, you'd handle API requests here
    // For now, we'll just return a 404 for any API route
    return res.status(404).send('API not found');
  }

  // Fallback to client-side routing for all other routes
  const indexPath = path.join(__dirname, '../dist/index.html');
  
  try {
    const html = fs.readFileSync(indexPath, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Internal Server Error');
  }
}; 