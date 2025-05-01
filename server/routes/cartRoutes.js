import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart
} from '../controllers/cartController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add debug middleware to log requests
router.use((req, res, next) => {
  console.log(`Cart API Request: ${req.method} ${req.originalUrl}`);
  console.log('Request cookies:', req.cookies);
  console.log('Request headers:', req.headers);
  if (req.body && Object.keys(req.body).length) {
    console.log('Request body:', req.body);
  }
  next();
});

// Routes that work for both guests and authenticated users
// optionalAuth will set req.user if user is logged in, but won't require authentication
router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addToCart);
router.put('/items', optionalAuth, updateCartItem);
router.delete('/items/:itemId', optionalAuth, removeCartItem);
router.delete('/', optionalAuth, clearCart);

// Routes that require authentication
router.post('/merge', protect, mergeCart);

export default router; 