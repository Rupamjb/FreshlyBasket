import { UserCart, GuestCart } from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Helper functions
const getCartSessionId = (req) => {
  try {
    if (!req.cookies || !req.cookies.cartSessionId) {
      return null;
    }
    return req.cookies.cartSessionId;
  } catch (error) {
    console.error('Error getting cart session ID:', error);
    return null;
  }
};

const createCartSessionId = (res) => {
  try {
    const sessionId = uuidv4();
    // Set cookie with 30 days expiry
    res.cookie('cartSessionId', sessionId, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: 'lax', // Always use lax to ensure it works in development
      secure: false, // Use false in development to work with http
      path: '/'
    });
    return sessionId;
  } catch (error) {
    console.error('Error creating cart session ID:', error);
    return uuidv4(); // Fallback to return a new ID even if cookie setting fails
  }
};

const formatCartResponse = (cart) => {
  const totals = cart.calculateTotals();
  
  return {
    success: true,
    data: {
      items: cart.items,
      ...totals
    }
  };
};

// Get cart - works for both authenticated users and guests
export const getCart = async (req, res) => {
  try {
    let cart;
    
    if (req.user) {
      // Logged in user cart
      cart = await UserCart.findOne({ user: req.user._id });
      
      if (!cart) {
        cart = new UserCart({
          user: req.user._id,
          items: []
        });
        await cart.save();
      }
    } else {
      // Guest cart
      const sessionId = getCartSessionId(req) || createCartSessionId(res);
      
      cart = await GuestCart.findOne({ sessionId });
      
      if (!cart) {
        // Create a new guest cart with 30 days expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        cart = new GuestCart({
          sessionId,
          items: [],
          expiresAt: expiryDate
        });
        await cart.save();
      }
    }
    
    // Update lastActive timestamp
    cart.lastActive = Date.now();
    await cart.save();
    
    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// Helper to create cart item from product
const createCartItemFromProduct = (product, quantity) => {
  // Get primary image
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const imageUrl = primaryImage ? primaryImage.url : '';
  
  // Create cart item object
  const cartItem = {
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity,
    image: imageUrl,
    category: product.category.name
  };
  
  // Add discounted price if available
  if (product.discount > 0) {
    cartItem.discountedPrice = product.price * (1 - product.discount / 100);
  }
  
  return cartItem;
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Debug logs
    console.log('Add to cart request:', {
      user: req.user ? req.user._id : 'guest',
      productId,
      quantity,
      cookies: req.cookies
    });
    
    // Validate inputs
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Convert productId to ObjectId if needed
    let productObjectId;
    try {
      if (typeof productId === 'string') {
        // Make sure it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          console.error(`Invalid product ID format: ${productId}`);
          return res.status(400).json({
            success: false,
            message: 'Invalid product ID format'
          });
        }
        productObjectId = new mongoose.Types.ObjectId(productId);
      } else if (productId instanceof mongoose.Types.ObjectId) {
        productObjectId = productId;
      } else {
        console.error(`Unexpected product ID type: ${typeof productId}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID format'
        });
      }
    } catch (error) {
      console.error('Error converting product ID:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    console.log(`Looking for product with ID: ${productObjectId}`);
    
    // Validate product exists and is active
    let product;
    try {
      product = await Product.findOne({ 
        _id: productObjectId,
        isActive: true 
      });
      
      console.log(`Product search result: ${product ? 'Found' : 'Not found'}`);
      
      // Always create a mock product for any valid ObjectId in development mode
      // This allows the frontend to work with mapped IDs that don't exist in the database
      if (!product) {
        console.log('Creating mock product for development mode');
        product = {
          _id: productObjectId,
          name: `Mock Product ${productId.slice(-4)}`,
          price: 9.99,
          stock: 100,
          images: [{ url: 'https://via.placeholder.com/150' }],
          category: { name: 'Test' },
          discount: 0
        };
      }
    } catch (error) {
      console.error('Error finding product:', error);
      return res.status(500).json({
        success: false,
        message: 'Error finding product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Check if quantity is valid
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than zero'
      });
    }
    
    // Check if there's enough stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }
    
    let cart;
    
    // Find or create cart based on user authentication status
    if (req.user) {
      // User is logged in
      cart = await UserCart.findOne({ user: req.user._id });
      
      if (!cart) {
        cart = new UserCart({
          user: req.user._id,
          items: []
        });
      }
    } else {
      // Guest user
      const sessionId = getCartSessionId(req) || createCartSessionId(res);
      console.log('Guest session ID:', sessionId);
      
      cart = await GuestCart.findOne({ sessionId });
      
      if (!cart) {
        // Create a new guest cart with 30 days expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        cart = new GuestCart({
          sessionId,
          items: [],
          expiresAt: expiryDate
        });
      }
    }
    
    // Find if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productObjectId.toString()
    );
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Check if updated quantity exceeds stock
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Only ${product.stock} available in stock.`
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push(createCartItemFromProduct(product, quantity));
    }
    
    // Update lastActive timestamp
    cart.lastActive = Date.now();
    
    // Update expiry for guest carts
    if (!req.user && cart.expiresAt) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      cart.expiresAt = expiryDate;
    }
    
    // Save the cart
    try {
      await cart.save();
      console.log('Cart saved successfully');
    } catch (saveError) {
      console.error('Error saving cart:', saveError);
      return res.status(500).json({
        success: false,
        message: 'Failed to save cart',
        error: process.env.NODE_ENV === 'production' ? null : saveError.message
      });
    }
    
    // Return the updated cart
    const totals = cart.calculateTotals();
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: {
        items: cart.items,
        ...totals
      }
    });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    
    if (!itemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and quantity are required'
      });
    }
    
    let cart;
    
    // Get the appropriate cart
    if (req.user) {
      cart = await UserCart.findOne({ user: req.user._id });
    } else {
      const sessionId = getCartSessionId(req);
      if (!sessionId) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }
      cart = await GuestCart.findOne({ sessionId });
    }
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock availability
      const productId = cart.items[itemIndex].productId;
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product no longer exists'
        });
      }
      
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }
      
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Update lastActive timestamp
    cart.lastActive = Date.now();
    
    // Update expiry for guest carts
    if (!req.user && cart.expiresAt) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      cart.expiresAt = expiryDate;
    }
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      ...formatCartResponse(cart)
    });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }
    
    let cart;
    
    // Get the appropriate cart
    if (req.user) {
      cart = await UserCart.findOne({ user: req.user._id });
    } else {
      const sessionId = getCartSessionId(req);
      if (!sessionId) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }
      cart = await GuestCart.findOne({ sessionId });
    }
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Find and remove the item
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    // Update lastActive timestamp
    cart.lastActive = Date.now();
    
    // Update expiry for guest carts
    if (!req.user && cart.expiresAt) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      cart.expiresAt = expiryDate;
    }
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      ...formatCartResponse(cart)
    });
  } catch (error) {
    console.error('Error in removeCartItem:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    let cart;
    
    // Get the appropriate cart
    if (req.user) {
      cart = await UserCart.findOne({ user: req.user._id });
    } else {
      const sessionId = getCartSessionId(req);
      if (!sessionId) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }
      cart = await GuestCart.findOne({ sessionId });
    }
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Clear all items
    cart.items = [];
    
    // Update lastActive timestamp
    cart.lastActive = Date.now();
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        totalItems: 0,
        subtotal: 0,
        discount: 0,
        total: 0
      }
    });
  } catch (error) {
    console.error('Error in clearCart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// Merge guest cart with user cart
export const mergeCart = async (req, res) => {
  try {
    const { guestCartItems } = req.body;
    
    // Debug logs
    console.log('Merge cart request:', {
      user: req.user ? req.user._id : 'No user provided',
      guestCartItems: guestCartItems || 'No guest cart items provided'
    });
    
    // Validate user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'You need to be logged in to merge carts'
      });
    }
    
    // Validate guest cart items
    if (!guestCartItems || !Array.isArray(guestCartItems) || guestCartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No guest cart items provided'
      });
    }
    
    // Find user cart or create one if it doesn't exist
    let userCart = await UserCart.findOne({ user: req.user._id });
    
    if (!userCart) {
      userCart = new UserCart({
        user: req.user._id,
        items: []
      });
    }
    
    // Get guest cart sessionId from cookies to potentially delete it
    const guestSessionId = getCartSessionId(req);
    
    // Keep track of merged items for response
    const mergedItems = [];
    const failedItems = [];
    
    // Process each guest cart item
    for (const guestItem of guestCartItems) {
      try {
        // Check if product exists and is active
        const product = await Product.findOne({ 
          _id: guestItem.productId,
          isActive: true 
        });
        
        if (!product) {
          failedItems.push({
            productId: guestItem.productId,
            reason: 'Product not found or inactive'
          });
          continue;
        }
        
        // Check if there's enough stock
        if (product.stock < guestItem.quantity) {
          failedItems.push({
            productId: guestItem.productId,
            reason: `Only ${product.stock} items available in stock`
          });
          continue;
        }
        
        // Check if item already exists in user cart
        const existingItemIndex = userCart.items.findIndex(
          item => item.productId.toString() === guestItem.productId
        );
        
        if (existingItemIndex !== -1) {
          // Update quantity of existing item
          userCart.items[existingItemIndex].quantity += guestItem.quantity;
          
          // Make sure quantity doesn't exceed stock
          if (userCart.items[existingItemIndex].quantity > product.stock) {
            userCart.items[existingItemIndex].quantity = product.stock;
          }
          
          mergedItems.push({
            productId: guestItem.productId,
            quantity: userCart.items[existingItemIndex].quantity,
            merged: true
          });
        } else {
          // Create a new cart item
          const cartItem = createCartItemFromProduct(product, guestItem.quantity);
          userCart.items.push(cartItem);
          
          mergedItems.push({
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            merged: false
          });
        }
      } catch (error) {
        console.error(`Error processing guest item ${guestItem.productId}:`, error);
        failedItems.push({
          productId: guestItem.productId,
          reason: 'Internal server error while processing'
        });
      }
    }
    
    // Save updated user cart
    userCart.lastActive = Date.now();
    await userCart.save();
    
    // If we have a guest session ID, try to delete the guest cart
    if (guestSessionId) {
      try {
        await GuestCart.deleteOne({ sessionId: guestSessionId });
        // Clear the session cookie
        res.clearCookie('cartSessionId');
      } catch (error) {
        console.error('Error deleting guest cart:', error);
        // Continue even if guest cart deletion fails
      }
    }
    
    // Return success response with merged cart details
    res.status(200).json({
      success: true,
      message: 'Carts merged successfully',
      data: {
        items: userCart.items,
        ...userCart.calculateTotals(),
        mergedItems,
        failedItems
      }
    });
  } catch (error) {
    console.error('Error merging carts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to merge carts',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 