// Vercel Serverless Function to handle all routes
import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  // Path to the built index.html
  const indexPath = join(process.cwd(), 'dist', 'index.html');
  
  try {
    // Read the HTML file
    const html = readFileSync(indexPath, 'utf8');
    
    // Set the content type header
    res.setHeader('Content-Type', 'text/html');
    
    // Send the HTML content
    res.status(200).send(html);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Internal Server Error');
  }
} 