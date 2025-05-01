import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes - verifies JWT token and adds user to request
 */
export const protect = async (req, res, next) => {
  let token;

  // Get token from cookie or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  try {
    // Use environment variable or a strong default secret
    const JWT_SECRET = process.env.JWT_SECRET || 'freshlybasket_ecommerce_secure_jwt_token_2024';
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user by ID (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or token invalid'
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

/**
 * Optional authentication middleware that doesn't block unauthenticated requests
 * Sets req.user if the user is authenticated, otherwise continues without req.user
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  // Get token from cookie or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // No token provided - continue as guest
    return next();
  }

  try {
    // Use environment variable or a strong default secret
    const JWT_SECRET = process.env.JWT_SECRET || 'freshlybasket_ecommerce_secure_jwt_token_2024';
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user by ID (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      // Add user to request object if found
      req.user = user;
    }
    
    // Continue regardless of whether user was found
    next();
  } catch (error) {
    // If token verification fails, continue as guest
    console.error('Optional auth error:', error);
    next();
  }
};

/**
 * Middleware to check if user is an admin
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin'
    });
  }
}; 