/**
 * API configuration for frontend
 * This allows us to easily switch between development and production endpoints
 */

// API Base URL 
// In production, we'll use the URL from environment variables
// In development, we'll use localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://freshlybasket.onrender.com' : 'http://localhost:5001');

// Backup API URL if primary fails
export const BACKUP_API_BASE_URL = import.meta.env.VITE_BACKUP_API_BASE_URL || '';

// Default timeout in milliseconds
export const DEFAULT_TIMEOUT = 15000;

// Maximum number of retries for failed requests
export const MAX_RETRIES = 3;

/**
 * Helper function to build API URLs
 */
export const apiUrl = (path: string, useBackup: boolean = false): string => {
  // Clean the path to ensure it works with the backend
  let cleanPath = path;
  
  // If we're using the Render backend, we might need to adjust the path
  // based on how your backend routes are set up
  const baseUrl = useBackup && BACKUP_API_BASE_URL ? BACKUP_API_BASE_URL : API_BASE_URL;
  
  // Check if we're using the Render backend
  if (baseUrl.includes('freshlybasket.onrender.com')) {
    // Remove /api prefix if needed - adjust based on your actual backend API route structure
    if (cleanPath.startsWith('/api/')) {
      cleanPath = cleanPath.substring(4); // Remove "/api"
    }
    
    // Log the final URL for debugging
    const finalUrl = `${baseUrl}${cleanPath}`;
    console.log('Final API URL:', finalUrl);
    return finalUrl;
  }
  
  // Handle the default case (local development)
  // Clean the path to avoid double /api segments
  if (!cleanPath.startsWith('/api')) {
    cleanPath = `/api${cleanPath}`;
  }
  
  // If the base URL already includes /api, remove it from the path
  if (baseUrl.endsWith('/api')) {
    cleanPath = cleanPath.replace(/^\/api/, '');
  }
  
  return `${baseUrl}${cleanPath}`;
};

/**
 * Create fetch options with authorization headers if token exists
 */
export const createFetchOptions = (
  method: string = 'GET', 
  body?: object, 
  includeToken: boolean = true,
  timeout: number = DEFAULT_TIMEOUT
): RequestInit => {
  // Base options with credentials
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Use 'include' for same-origin cookies, 'omit' for cross-origin requests without cookies
    credentials: import.meta.env.PROD ? 'omit' : 'include',
    signal: AbortSignal.timeout(timeout), // Add timeout
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

/**
 * Check if the device is offline
 */
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data: any;
  isRetryable: boolean;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isRetryable = status >= 500 || status === 408 || status === 429;
  }
}

/**
 * Wrapper for fetch with retry logic and better error handling
 */
export const fetchWithRetry = async (
  url: string, 
  options: RequestInit,
  retries: number = MAX_RETRIES
): Promise<Response> => {
  try {
    // Check if device is offline
    if (isOffline()) {
      throw new ApiError('You appear to be offline. Please check your internet connection.', 0);
    }

    const response = await fetch(url, options);
    
    // If response is successful, return it
    if (response.ok) {
      // Check content type for successful responses too
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json') && 
          // Only do this check for API endpoints that should return JSON
          (url.includes('/api/') || 
          (options.headers && 
           typeof options.headers === 'object' && 
           'Accept' in options.headers && 
           options.headers['Accept'] === 'application/json'))) {
        // Clone the response because we need to check its content
        const clonedResponse = response.clone();
        const textContent = await clonedResponse.text();
        console.warn('Received non-JSON response from API:', textContent.substring(0, 100));
        
        // If this looks like HTML, it might be a 404 page from Vercel
        if (textContent.includes('<!DOCTYPE html>') || textContent.includes('<html>')) {
          throw new ApiError('Received HTML instead of JSON. The API endpoint might be unavailable.', 503);
        }
      }
      return response;
    }
    
    // If response is not ok but we have retries left
    if (retries > 0 && (response.status >= 500 || response.status === 408 || response.status === 429)) {
      console.warn(`API request failed with status ${response.status}. Retrying... (${retries} retries left)`);
      
      // Calculate delay using exponential backoff
      const delay = Math.min(1000 * (MAX_RETRIES - retries + 1), 5000);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Try with backup URL if available
      const useBackup = retries === MAX_RETRIES - 1 && BACKUP_API_BASE_URL && url.includes(API_BASE_URL);
      const newUrl = useBackup ? url.replace(API_BASE_URL, BACKUP_API_BASE_URL) : url;
      
      // Retry with one less retry count
      return fetchWithRetry(newUrl, options, retries - 1);
    }
    
    // If we're out of retries or it's a client error, parse the error response
    let errorData;
    try {
      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        // If not JSON, get the raw text for debugging
        const textContent = await response.text();
        errorData = { 
          message: 'Server returned an unexpected response format',
          rawContent: textContent.substring(0, 100) 
        };
        console.error('Non-JSON error response:', textContent.substring(0, 100));
      }
    } catch (e) {
      errorData = { message: 'An unknown error occurred' };
    }
    
    // Create a descriptive error message
    let errorMessage = errorData.message || `Request failed with status ${response.status}`;
    if (response.status === 404) {
      errorMessage = 'The requested resource was not found. It may have been removed or is temporarily unavailable.';
    } else if (response.status === 401) {
      errorMessage = 'You are not authorized to access this resource. Please log in and try again.';
    } else if (response.status === 403) {
      errorMessage = 'You do not have permission to access this resource.';
    } else if (response.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    }
    
    throw new ApiError(errorMessage, response.status, errorData);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', 408);
    }
    
    // For other errors like network failures
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
      ? error.message as string
      : 'A network error occurred. Please check your connection and try again.';
      
    throw new ApiError(errorMessage, 0);
  }
};

/**
 * Main API request function with enhanced error handling
 */
export const apiRequest = async <T>(
  url: string,
  options: RequestInit,
  fallbackData?: T
): Promise<T> => {
  try {
    const response = await fetchWithRetry(url, options);
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    
    // Show error to user
    if (error instanceof ApiError) {
      // You can dispatch to a toast notification system here
      console.error(`API Error (${error.status}): ${error.message}`);
    }
    
    // If fallback data was provided, return it
    if (fallbackData !== undefined) {
      console.info('Using fallback data due to API error');
      return fallbackData;
    }
    
    // Otherwise, rethrow the error
    throw error;
  }
};

export default {
  API_BASE_URL,
  BACKUP_API_BASE_URL,
  apiUrl,
  createFetchOptions,
  apiRequest,
  isOffline,
  ApiError,
}; 