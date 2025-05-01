import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    shortDescription: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    unit: {
      type: String,
      required: [true, 'Product unit is required'],
      default: 'item', // e.g., 'kg', 'g', 'liter', 'item', etc.
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    images: [productImageSchema],
    nutritionInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isOrganic: {
      type: Boolean,
      default: false
    },
    countryOfOrigin: {
      type: String,
      trim: true,
      default: 'Unknown'
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }],
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for discounted price
productSchema.virtual('salePrice').get(function() {
  if (!this.discount || this.discount === 0) return this.price;
  return +(this.price * (1 - this.discount / 100)).toFixed(2);
});

// Populate category when querying products
productSchema.pre(/^find/, function(next) {
  this.populate('category', 'name slug');
  next();
});

// Create text index for better search performance
productSchema.index(
  { 
    name: 'text', 
    description: 'text',
    tags: 'text'
  }, 
  { 
    weights: {
      name: 10,
      tags: 5,
      description: 1
    } 
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product; 