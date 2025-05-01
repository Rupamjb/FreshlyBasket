import mongoose from 'mongoose';
import { cartItemSchema } from './Cart.js';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function() {
        return !this.guestEmail;
      }
    },
    guestEmail: {
      type: String,
      required: function() {
        return !this.user;
      },
      validate: {
        validator: function(email) {
          return this.user || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: 'Please enter a valid email address'
      }
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address1: { type: String, required: true },
      address2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true }
    },
    billingAddress: {
      sameAsShipping: { type: Boolean, default: true },
      firstName: { type: String },
      lastName: { type: String },
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
      phone: { type: String }
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['credit_card', 'paypal', 'stripe', 'cash_on_delivery']
    },
    paymentDetails: {
      transactionId: { type: String },
      status: { type: String },
      timestamp: { type: Date }
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    statusHistory: [{
      status: {
        type: String,
        enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: {
        type: String
      }
    }],
    notes: {
      type: String
    },
    cancellationReason: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    estimatedDelivery: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Generate a unique order number when creating a new order
orderSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  // Generate order number: Current year + month + day + random 4 digits
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  
  // Add the initial status to the history
  this.statusHistory = [{
    status: this.status,
    timestamp: new Date(),
    note: 'Order created'
  }];
  
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note
  });
  
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: `Order cancelled: ${reason}`
  });
  
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

export default Order; 