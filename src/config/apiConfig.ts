/**
 * API configuration for frontend
 * This allows us to easily switch between development and production endpoints
 */

// API Base URL 
// In production, we'll use the URL from environment variables
// In development, we'll use localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:5001');

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
  // Clean the path to avoid double /api segments
  const cleanPath = path.startsWith('/api') ? path : `/api${path}`;
  const baseUrl = useBackup && BACKUP_API_BASE_URL ? BACKUP_API_BASE_URL : API_BASE_URL;
  
  // If the base URL already includes /api, remove it from the path
  if (baseUrl.endsWith('/api')) {
    return `${baseUrl}${cleanPath.replace(/^\/api/, '')}`;
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
  // Base options with credentials always included
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Always include cookies
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
      errorData = await response.json();
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