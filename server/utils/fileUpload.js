import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Create subdirectories based on content type
    let subDir = 'misc';
    
    if (req.originalUrl.includes('/products')) {
      subDir = 'products';
    } else if (req.originalUrl.includes('/categories')) {
      subDir = 'categories';
    } else if (req.originalUrl.includes('/users')) {
      subDir = 'users';
    }
    
    const finalDir = path.join(uploadDir, subDir);
    
    // Create subdirectory if it doesn't exist
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    
    cb(null, finalDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP images are allowed.'));
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter
});

// Function to convert local path to URL path
export const getFileUrl = (filePath, req) => {
  if (!filePath) return null;
  
  // Replace backslashes with forward slashes for Windows compatibility
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Extract the relative path from the uploads directory
  const uploadsIndex = normalizedPath.indexOf('uploads/');
  
  if (uploadsIndex === -1) return null;
  
  const relativePath = normalizedPath.substring(uploadsIndex);
  
  // Construct base URL from request
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  return `${baseUrl}/${relativePath}`;
};

// Helper to delete file
export const deleteFile = (filePath) => {
  if (!filePath) return;
  
  // Only delete if file exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export default upload; 