import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    discountedPrice: {
      type: Number
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  { _id: true }
);

// Base schema with common fields for both user and guest carts
const baseCartSchema = {
  items: [cartItemSchema],
  lastActive: {
    type: Date,
    default: Date.now
  }
};

// User Cart Schema
const userCartSchema = new mongoose.Schema(
  {
    ...baseCartSchema,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Guest Cart Schema
const guestCartSchema = new mongoose.Schema(
  {
    ...baseCartSchema,
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // This will make MongoDB automatically delete expired documents
    }
  },
  {
    timestamps: true
  }
);

// Calculate cart totals method for both schemas
const calculateTotals = function() {
  let totalItems = 0;
  let subtotal = 0;
  let discount = 0;

  this.items.forEach(item => {
    totalItems += item.quantity;
    subtotal += item.price * item.quantity;
    
    if (item.discountedPrice) {
      discount += (item.price - item.discountedPrice) * item.quantity;
    }
  });

  return {
    totalItems,
    subtotal,
    discount,
    total: subtotal - discount
  };
};

userCartSchema.methods.calculateTotals = calculateTotals;
guestCartSchema.methods.calculateTotals = calculateTotals;

// Create model for each cart type
const UserCart = mongoose.model('UserCart', userCartSchema);
const GuestCart = mongoose.model('GuestCart', guestCartSchema);

export { UserCart, GuestCart, cartItemSchema }; 