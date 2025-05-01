// Vercel serverless function to handle SPA routing and API requests
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import API handlers
import authHandler from './auth.mjs';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  // Log the request for debugging
  console.log(`Server Request: ${req.method} ${req.url}`);
  
  try {
    // Handle API requests
    if (req.url.startsWith('/api/')) {
      // Extract API path
      const apiPath = req.url.substring(5); // Remove "/api/" prefix
      
      // Route to specific API handlers based on path
      if (apiPath.startsWith('users/')) {
        return handleUserRequests(req, res, apiPath);
      }
      
      // Default: API endpoint not found
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({
        success: false,
        message: 'API endpoint not found'
      });
    }
    
    // Set appropriate headers for static assets
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    
    // Try to serve as a static file first
    const staticPath = path.join(__dirname, '../dist', req.url);
    if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
      const contentType = getContentType(staticPath);
      res.setHeader('Content-Type', contentType);
      return res.status(200).send(fs.readFileSync(staticPath));
    }
    
    // Check for image in public folder as fallback
    const publicPath = path.join(__dirname, '../public', req.url);
    if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
      const contentType = getContentType(publicPath);
      res.setHeader('Content-Type', contentType);
      return res.status(200).send(fs.readFileSync(publicPath));
    }
    
    // Serve the index.html for all other paths - SPA routing
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Content-Type', 'text/html');
      const html = fs.readFileSync(indexPath, 'utf8');
      return res.status(200).send(html);
    } else {
      // Fallback if index.html doesn't exist
      return res.status(404).send(JSON.stringify({
        success: false,
        message: 'Application not found. Please build the app first.'
      }));
    }
  } catch (error) {
    console.error('Error in server handler:', error);
    
    // Return JSON for API errors
    if (req.url.startsWith('/api/')) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Return HTML for other errors
    return res.status(500).send('Internal Server Error');
  }
}

// Handle user API requests
function handleUserRequests(req, res, apiPath) {
  // Route different user API endpoints
  const path = apiPath.substring(6); // Remove "users/" prefix
  
  if (path === 'login') {
    // Rewrite request URL for auth handler
    req.url = `/api/auth/login`;
    return authHandler(req, res);
  }
  
  if (path === 'register') {
    // Rewrite request URL for auth handler
    req.url = `/api/auth/register`;
    return authHandler(req, res);
  }
  
  if (path === 'profile') {
    // Rewrite request URL for auth handler
    req.url = `/api/auth/profile`;
    return authHandler(req, res);
  }
  
  // Default: endpoint not found
  res.setHeader('Content-Type', 'application/json');
  return res.status(404).json({
    success: false,
    message: 'User API endpoint not found'
  });
}

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
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.ico': return 'image/x-icon';
    case '.ttf': return 'font/ttf';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    default: return 'text/plain';
  }
} 