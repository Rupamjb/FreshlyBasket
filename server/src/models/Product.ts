import mongoose from 'mongoose';
import { slugify } from '../utils/helpers.js';

// Define Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: [
          'Fruits',
          'Vegetables',
          'Dairy',
          'Bakery',
          'Meat',
          'Seafood',
          'Frozen',
          'Beverages',
          'Snacks',
          'Grains',
          'Canned Goods',
          'Other'
        ],
        message: 'Please select a valid category'
      }
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image URL is required']
    },
    unit: {
      type: String,
      required: [true, 'Product unit is required'],
      default: 'item', // e.g., 'kg', 'g', 'liter', 'item', etc.
      enum: {
        values: ['kg', 'g', 'lb', 'oz', 'liter', 'ml', 'item', 'pack', 'bunch', 'dozen'],
        message: 'Please select a valid unit'
      }
    },
    tags: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isOrganic: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

// Create text index for better search performance
productSchema.index(
  { 
    name: 'text', 
    description: 'text', 
    category: 'text', 
    tags: 'text' 
  }, 
  { 
    weights: {
      name: 10, 
      tags: 5, 
      category: 3, 
      description: 1
    } 
  }
);

// Virtual for discounted price if needed later
productSchema.virtual('discountedPrice').get(function() {
  // This can be implemented when adding discount functionality
  return this.price;
});

const Product = mongoose.model('Product', productSchema);

export default Product; 