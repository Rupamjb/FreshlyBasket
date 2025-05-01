/**
 * Error handling middleware
 * This middleware logs detailed errors and returns appropriate responses
 */

// Not found middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  // Log full error details in development
  console.error('\x1b[31m%s\x1b[0m', 'ERROR DETAILS:');
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('Request Headers:', req.headers);
  console.error('Request Body:', req.body);
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  // Send error response
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
}; 