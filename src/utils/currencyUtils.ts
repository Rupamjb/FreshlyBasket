/**
 * Currency utility functions for the application
 */

/**
 * Formats a price with the Indian Rupee symbol (₹)
 * @param price The price to format
 * @returns Formatted price with Rupee symbol
 */
export const formatCurrency = (price: number): string => {
  return `₹${price.toFixed(2)}`;
}; 
 
 