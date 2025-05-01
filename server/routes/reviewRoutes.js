import express from 'express';
import {
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router; 