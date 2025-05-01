/**
 * Converts a string to a URL-friendly slug
 * @param {string} text - The text to convert to a slug
 * @returns {string} The slug
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')          // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')        // Remove all non-word characters
    .replace(/\-\-+/g, '-')          // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start of text
    .replace(/-+$/, '');             // Trim - from end of text
};

/**
 * Generates a unique slug based on the original slug
 * @param {string} originalSlug - The original slug
 * @param {number} attempt - The attempt number for generating unique slug
 * @returns {string} The unique slug
 */
export const generateUniqueSlug = (originalSlug, attempt = 0) => {
  if (attempt === 0) return originalSlug;
  return `${originalSlug}-${attempt}`;
};

export default { slugify, generateUniqueSlug }; 