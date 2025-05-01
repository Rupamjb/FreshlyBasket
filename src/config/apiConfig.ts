/**
 * API configuration for frontend
 * This allows us to easily switch between development and production endpoints
 */

// API Base URL 
// In production, we'll use the URL from environment variables
// In development, we'll use localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:5001');

/**
 * Helper function to build API URLs
 */
export const apiUrl = (path: string): string => {
  // Make sure path starts with /api
  const apiPath = path.startsWith('/api') ? path : `/api${path}`;
  return `${API_BASE_URL}${apiPath}`;
};

/**
 * Create fetch options with authorization headers if token exists
 */
export const createFetchOptions = (
  method: string = 'GET', 
  body?: object, 
  includeToken: boolean = true
): RequestInit => {
  // Base options with credentials always included
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Always include cookies
  };

  // Add body if it exists
  if (body) {
    options.body = JSON.stringify(body);
  }

  // Add authorization header if token exists and includeToken is true
  if (includeToken) {
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  return options;
};

// Export a more detailed version for debugging
export const logApiRequest = async (url: string, options: RequestInit) => {
  console.log(`API Request: ${options.method} ${url}`);
  console.log('Request options:', JSON.stringify(options));
  try {
    const response = await fetch(url, options);
    console.log('Response status:', response.status);
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  apiUrl,
  createFetchOptions,
  logApiRequest,
}; 