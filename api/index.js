// Direct handler for all routes on Vercel
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  // Always return the index.html content
  try {
    const indexPath = path.join(__dirname, '../dist/index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(indexContent);
  } catch (error) {
    console.error('Error serving index.html:', error);
    return res.status(500).send('Server Error');
  }
} 