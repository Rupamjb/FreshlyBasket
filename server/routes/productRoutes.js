import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateImagePriority,
  uploadProductImages
} from '../controllers/productController.js';
import {
  createReview,
  getProductReviews
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public product routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin product routes
router.post('/', protect, admin, uploadProductImages, createProduct);
router.put('/:id', protect, admin, uploadProductImages, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/image-priority', protect, admin, updateImagePriority);

// Review routes
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, createReview);

export default router; 