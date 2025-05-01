import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderByNumber,
  cancelOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Debug middleware for orders
router.use((req, res, next) => {
  console.log(`Order API Request: ${req.method} ${req.originalUrl}`);
  console.log('User:', req.user ? req.user._id : 'Guest');
  if (req.body && Object.keys(req.body).length) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes that can be used by both guests and authenticated users
router.post('/', optionalAuth, createOrder);
router.get('/track', getOrderByNumber);

// Routes that require authentication
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Admin only routes
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router; 