import express from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin only routes
router.post('/', protect, admin, uploadCategoryImage, createCategory);
router.put('/:id', protect, admin, uploadCategoryImage, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router; 