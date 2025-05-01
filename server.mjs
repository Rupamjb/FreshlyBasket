// Express server for both development and Vercel deployment
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Define paths
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Log requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Serve static files from the dist directory with proper caching
app.use('/assets', express.static(ASSETS_DIR, {
  maxAge: '1y',
  etag: true,
  immutable: true
}));

// Serve static files from the public directory
app.use(express.static(PUBLIC_DIR));

// Serve static files from the dist directory
app.use(express.static(DIST_DIR));

// API routes - handle any /api routes here
app.use('/api', (req, res, next) => {
  // Check if it's an API call
  if (req.url.startsWith('/api') || req.path.startsWith('/api')) {
    // Use your API router here
    // For now, we'll simply return a 404 with proper JSON
    return res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve index.html for any other request (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  
  // Check if index.html exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application is not built. Run npm run build first.');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // If it's an API request, return JSON error
  if (req.url.startsWith('/api') || req.path.startsWith('/api')) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
  
  // Otherwise return HTML error
  res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Export the Express app for Vercel
export default app; 