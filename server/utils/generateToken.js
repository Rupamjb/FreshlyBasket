import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for authentication
 * @param {string} userId - The user ID to encode in the token
 * @param {Response} res - Express response object to set cookie
 * @returns {string} The generated token
 */
const generateToken = (userId, res) => {
  // Use environment variable or a strong default secret
  const JWT_SECRET = process.env.JWT_SECRET || 'freshlybasket_ecommerce_secure_jwt_token_2024';
  
  // Create token with user ID
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });

  // Set token in HTTP-only cookie
  if (res) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // use HTTPS in production
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });
  }

  return token;
};

export default generateToken; 