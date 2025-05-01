// Define product types
import { apiUrl, createFetchOptions, apiRequest, API_BASE_URL } from '../config/apiConfig';

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  image?: string;
  imageUrl?: string; // Added for MongoDB compatibility
  category: string;
  subcategory?: string;
  tags: string[];
  stockQuantity: number;
  stock?: number; // Added for MongoDB compatibility
  isOrganic: boolean;
  isVegan: boolean;
  isNew: boolean;
  discountPercentage?: number;
  averageRating?: number;
  unit?: string;
  ingredients?: string[];
  nutritionalInfo?: any;
  reviews?: ProductReview[];
  createdAt: string;
  updatedAt: string;
  slug?: string; // Added for MongoDB compatibility
}

// Add a ProductReview interface
export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  _id?: string; // Added for MongoDB compatibility
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// Mock data for fallback (in case API fails)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Spinach',
    description: 'Organic spinach freshly harvested from local farms.',
    price: 2.99,
    discountedPrice: 2.49,
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb'],
    category: 'Vegetables',
    subcategory: 'Leafy Greens',
    tags: ['Organic', 'Fresh', 'Local'],
    stockQuantity: 50,
    isOrganic: true,
    isVegan: true,
    isNew: false,
    discountPercentage: 17,
    unit: '250g',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Red Apples',
    description: 'Sweet and juicy red apples, perfect for snacking or baking.',
    price: 3.99,
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'],
    category: 'Fruits',
    tags: ['Fresh', 'Local'],
    stockQuantity: 100,
    isOrganic: false,
    isVegan: true,
    isNew: false,
    unit: '1kg',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread made with organic ingredients.',
    price: 4.49,
    images: ['https://images.unsplash.com/photo-1589367920969-ab8e050bbb04'],
    category: 'Bakery',
    tags: ['Organic', 'Fresh'],
    stockQuantity: 30,
    isOrganic: true,
    isVegan: true,
    isNew: false,
    unit: '400g',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Organic Milk',
    description: 'Organic whole milk from pasture-raised cows.',
    price: 5.99,
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b'],
    category: 'Dairy',
    tags: ['Organic'],
    stockQuantity: 40,
    isOrganic: true,
    isVegan: false,
    isNew: false,
    unit: '1L',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Fresh Carrots',
    description: 'Organic carrots freshly harvested from local farms.',
    price: 1.99,
    discountedPrice: 1.49,
    images: ['https://images.unsplash.com/photo-1447175008436-054170c2e979'],
    category: 'Vegetables',
    subcategory: 'Root Vegetables',
    tags: ['Organic', 'Fresh', 'Local'],
    stockQuantity: 75,
    isOrganic: true,
    isVegan: true,
    isNew: false,
    discountPercentage: 25,
    unit: '500g',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Organic Tomatoes',
    description: 'Juicy organic tomatoes, perfect for salads and cooking.',
    price: 3.49,
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea'],
    category: 'Vegetables',
    tags: ['Organic', 'Fresh'],
    stockQuantity: 60,
    isOrganic: true,
    isVegan: true,
    isNew: true,
    unit: '500g',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Fresh Broccoli',
    description: 'Farm-fresh broccoli with crisp texture and rich nutrients.',
    price: 2.99,
    images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'],
    category: 'Vegetables',
    tags: ['Fresh', 'Local'],
    stockQuantity: 45,
    isOrganic: false,
    isVegan: true,
    isNew: true,
    unit: 'per piece',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Bell Peppers Mix',
    description: 'Colorful mix of red, yellow, and green bell peppers.',
    price: 4.99,
    discountedPrice: 3.99,
    images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83'],
    category: 'Vegetables',
    tags: ['Fresh', 'Mix'],
    stockQuantity: 35,
    isOrganic: false,
    isVegan: true,
    isNew: false,
    discountPercentage: 20,
    unit: '500g',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Baby Potatoes',
    description: 'Small, tender potatoes perfect for roasting.',
    price: 2.49,
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655'],
    category: 'Vegetables',
    subcategory: 'Root Vegetables',
    tags: ['Fresh', 'Local'],
    stockQuantity: 80,
    isOrganic: false,
    isVegan: true,
    isNew: false,
    unit: '1kg',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Fresh Cauliflower',
    description: 'Farm-fresh cauliflower, perfect for roasting or steaming.',
    price: 3.49,
    images: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3'],
    category: 'Vegetables',
    tags: ['Fresh', 'Local'],
    stockQuantity: 40,
    isOrganic: false,
    isVegan: true,
    isNew: true,
    unit: 'per piece',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Green Beans',
    description: 'Fresh and crispy green beans from local farms.',
    price: 2.99,
    discountedPrice: 2.49,
    images: ['https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0'],
    category: 'Vegetables',
    tags: ['Fresh', 'Local'],
    stockQuantity: 55,
    isOrganic: true,
    isVegan: true,
    isNew: false,
    discountPercentage: 17,
    unit: '250g',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '12',
    name: 'Sweet Corn',
    description: 'Fresh sweet corn, perfect for grilling or boiling.',
    price: 1.99,
    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076'],
    category: 'Vegetables',
    tags: ['Fresh', 'Seasonal'],
    stockQuantity: 65,
    isOrganic: false,
    isVegan: true,
    isNew: true,
    unit: '2 pieces',
    createdAt: new Date(Date.now()).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Fresh Mushrooms',
    description: 'Mixed variety of fresh mushrooms.',
    price: 4.99,
    discountedPrice: 3.99,
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836'],
    category: 'Vegetables',
    tags: ['Fresh', 'Mix'],
    stockQuantity: 30,
    isOrganic: true,
    isVegan: true,
    isNew: false,
    discountPercentage: 20,
    unit: '200g',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '14',
    name: 'Baby Spinach',
    description: 'Tender baby spinach leaves, perfect for salads.',
    price: 3.49,
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb'],
    category: 'Vegetables',
    tags: ['Fresh', 'Organic'],
    stockQuantity: 45,
    isOrganic: true,
    isVegan: true,
    isNew: true,
    unit: '150g',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Function to transform MongoDB product format to frontend format
const transformProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct._id,
    _id: dbProduct._id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    images: [dbProduct.imageUrl], // Convert imageUrl to images array
    image: dbProduct.imageUrl, // For compatibility with existing components
    imageUrl: dbProduct.imageUrl,
    category: dbProduct.category,
    tags: [], // MongoDB products might not have tags
    stockQuantity: dbProduct.stock,
    stock: dbProduct.stock, 
    isOrganic: false, // Default values for fields not in MongoDB
    isVegan: false,
    isNew: false,
    unit: dbProduct.unit,
    createdAt: dbProduct.createdAt || new Date().toISOString(),
    updatedAt: dbProduct.updatedAt || new Date().toISOString(),
    slug: dbProduct.slug
  };
};

// Function to get API URL - now with proxy support for Render backend
const getProductApiUrl = (path: string): string => {
  // If we're using the Render backend, route through our proxy
  if (API_BASE_URL.includes('freshlybasket.onrender.com')) {
    // Use our proxy to avoid CORS issues
    return `/api/proxy/${path}`;
  }
  
  // Use the normal API URL for other cases
  return apiUrl(`/products${path}`);
};

// Get all products with filtering options
export const getProducts = async (
  category?: string,
  searchQuery?: string,
  limit?: number,
  page: number = 1,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ products: Product[], total: number }> => {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (searchQuery) queryParams.append('search', searchQuery);
    if (limit) queryParams.append('limit', limit.toString());
    if (page) queryParams.append('page', page.toString());
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    
    // Use the proxy-aware URL function
    const url = getProductApiUrl(`?${queryParams.toString()}`);
    console.log('Fetching products from URL:', url);
    
    const options = createFetchOptions('GET');
    
    // Use the enhanced apiRequest with fallback data
    return await apiRequest<{ products: Product[], total: number }>(
      url, 
      options, 
      // Fallback data in case of API failure
      { 
        products: category 
          ? mockProducts.filter(p => p.category.toLowerCase() === category.toLowerCase()) 
          : mockProducts, 
        total: mockProducts.length 
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data in case of any error
    const filteredProducts = category 
      ? mockProducts.filter(p => p.category.toLowerCase() === category.toLowerCase()) 
      : mockProducts;
    return { 
      products: filteredProducts, 
      total: filteredProducts.length 
    };
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    // Use the proxy-aware URL function
    const url = getProductApiUrl(`/${id}`);
    console.log('Fetching product by ID from URL:', url);
    
    const options = createFetchOptions('GET');
    
    // Use enhanced apiRequest with fallback to mock data
    const product = await apiRequest<Product | null>(
      url,
      options,
      // Find a matching product from mock data as fallback
      mockProducts.find(p => p.id === id) || null
    );
    
    return transformProduct(product);
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    
    // As a fallback, try to find the product in our mock data
    const mockProduct = mockProducts.find(p => p.id === id);
    if (mockProduct) {
      return mockProduct;
    }
    
    return null;
  }
};

// Get categories from the API
export const getCategories = async (): Promise<string[]> => {
  try {
    // First try to get categories from our direct API route
    const response = await fetch(
      apiUrl('/api/debug/categories'),
      createFetchOptions('GET', undefined, false)
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // If we have categories from our debug route, use them
    if (result.categories && Array.isArray(result.categories)) {
      return result.categories;
    }
    
    // Otherwise extract unique categories from products
    const productsResponse = await fetch(
      apiUrl('/api/direct/products'),
      createFetchOptions('GET', undefined, false)
    );
    
    if (!productsResponse.ok) {
      throw new Error(`API error: ${productsResponse.status}`);
    }
    
    const productsResult = await productsResponse.json();
    
    // Extract unique categories from products
    const categorySet = new Set<string>();
    
    // Safe extraction with type checking
    if (productsResult.data && Array.isArray(productsResult.data)) {
      productsResult.data.forEach((product: any) => {
        if (product && typeof product.category === 'string') {
          categorySet.add(product.category);
        }
      });
    }
    
    return Array.from(categorySet);
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Fallback to mock categories
    return [...new Set(mockProducts.map(p => p.category))];
  }
};

// Get a category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  // This is a mock implementation as the API doesn't have a dedicated categories endpoint yet
  const mockCategory = {
    id: slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug: slug,
    description: `${slug.charAt(0).toUpperCase() + slug.slice(1)} products`,
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
  };
  
  return mockCategory;
};

// Get related products
export const getRelatedProducts = async (productId: string, limit: number = 4): Promise<Product[]> => {
  try {
    // Get the product to find its category
    const product = await getProductById(productId);
    
    if (!product) {
      return [];
    }
    
    // Get products in the same category
    const { products } = await getProducts(product.category, undefined, limit + 1);
    
    // Filter out the current product and limit the results
    return products
      .filter(p => p.id !== productId)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}; 