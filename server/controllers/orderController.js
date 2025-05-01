import Order from '../models/Order.js';
import { UserCart, GuestCart } from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

/**
 * @desc    Create a new order from cart
 * @route   POST /api/orders
 * @access  Private/Public (both authenticated and guest users)
 */
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      guestEmail,
      notes
    } = req.body;

    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method are required'
      });
    }

    // For guest users, email is required
    if (!req.user && !guestEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for guest checkout'
      });
    }

    // Find cart based on authentication status
    let cart;
    if (req.user) {
      cart = await UserCart.findOne({ user: req.user._id }).session(session);
    } else {
      const sessionId = req.cookies.cartSessionId;
      if (!sessionId) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }
      cart = await GuestCart.findOne({ sessionId }).session(session);
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} no longer exists`
        });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items of ${product.name} available in stock`
        });
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // Calculate order totals
    const totals = cart.calculateTotals();

    // Create new order
    const orderData = {
      items: cart.items,
      totalAmount: totals.total,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingAddress,
      paymentMethod,
      notes
    };

    // Add user or guest email
    if (req.user) {
      orderData.user = req.user._id;
    } else {
      orderData.guestEmail = guestEmail;
    }

    // Handle billing address
    if (billingAddress && !billingAddress.sameAsShipping) {
      orderData.billingAddress = billingAddress;
    } else {
      orderData.billingAddress = {
        sameAsShipping: true
      };
    }

    const order = new Order(orderData);
    await order.save({ session });

    // Clear the cart
    cart.items = [];
    await cart.save({ session });

    // If it's a guest cart, optionally remove it
    if (!req.user && cart) {
      await GuestCart.deleteOne({ _id: cart._id }).session(session);
      res.clearCookie('cartSessionId');
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt
        }
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Get all orders for authenticated user
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Get a specific order by ID
 * @route   GET /api/orders/:id
 * @access  Private (for users, only their own orders)
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure the order belongs to the authenticated user
    if (req.user && order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // For guest orders, could implement a token-based verification here

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Get order by order number (for guest tracking)
 * @route   GET /api/orders/track/:orderNumber
 * @access  Public
 */
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber, email } = req.query;

    if (!orderNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Order number and email are required'
      });
    }

    const order = await Order.findOne({
      orderNumber: orderNumber,
      guestEmail: email
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or email does not match'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track order',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Cancel an order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private (for users, only their own orders)
 */
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Ensure the order belongs to the authenticated user
    if (req.user && order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled (only pending or paid orders can be cancelled)
    if (!['pending', 'paid', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in '${order.status}' status`
      });
    }

    // Update stock levels
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Return items to inventory
      for (const item of order.items) {
        const product = await Product.findById(item.productId).session(session);
        if (product) {
          product.stock += item.quantity;
          await product.save({ session });
        }
      }

      // Cancel the order
      await order.cancelOrder(reason);

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

/**
 * @desc    Update order status (admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Handle cancellation with stock adjustment
    if (status === 'cancelled' && order.status !== 'cancelled') {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Return items to inventory
        for (const item of order.items) {
          const product = await Product.findById(item.productId).session(session);
          if (product) {
            product.stock += item.quantity;
            await product.save({ session });
          }
        }

        // Update order status
        await order.updateStatus(status, note || 'Order cancelled by admin');

        await session.commitTransaction();
        session.endSession();
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } else {
      // Regular status update
      await order.updateStatus(status, note || `Status updated to ${status}`);
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        statusHistory: order.statusHistory
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 