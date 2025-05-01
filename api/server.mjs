// Vercel serverless function to handle SPA routing and API requests
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import API handlers
import authHandler from './auth.mjs';
import proxyHandler from './proxy.mjs';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight CORS request');
    return res.status(200).end();
  }
  
  // Log the request for debugging
  console.log(`Server Request: ${req.method} ${req.url}`);
  
  try {
    // Handle API requests
    if (req.url.startsWith('/api/')) {
      // Extract API path
      const apiPath = req.url.substring(5); // Remove "/api/" prefix
      console.log(`API path detected: "${apiPath}"`);
      
      // Handle proxy requests to Render backend
      if (apiPath.startsWith('proxy/')) {
        console.log('Proxying request to Render backend');
        return proxyHandler(req, res);
      }
      
      // Route to specific API handlers based on path
      if (apiPath.startsWith('users')) {
        return handleUserRequests(req, res, apiPath);
      }
      
      // Handle direct auth endpoints 
      if (apiPath.startsWith('auth')) {
        return authHandler(req, res);
      }
      
      // Default: API endpoint not found
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: apiPath
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
  // Log for debugging
  console.log(`User API request: ${req.method} ${apiPath}`);
  
  // Set proper CORS headers again for API routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Check for exact patterns to match frontend requests
  if (apiPath === 'users/login' || apiPath === 'users/login/') {
    console.log('Forwarding login request to auth handler');
    // Rewrite request URL for auth handler
    req.url = `/api/auth/login`;
    return authHandler(req, res);
  }
  
  if (apiPath === 'users/register' || apiPath === 'users/register/') {
    console.log('Forwarding register request to auth handler');
    // Rewrite request URL for auth handler
    req.url = `/api/auth/register`;
    return authHandler(req, res);
  }
  
  if (apiPath === 'users/profile' || apiPath === 'users/profile/') {
    console.log('Forwarding profile request to auth handler');
    // Rewrite request URL for auth handler
    req.url = `/api/auth/profile`;
    return authHandler(req, res);
  }
  
  if (apiPath === 'users/logout' || apiPath === 'users/logout/') {
    console.log('Handling logout request');
    // Handle logout - just return success
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
  
  // Default: endpoint not found
  console.log('User API endpoint not found');
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