import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiUrl, createFetchOptions } from '../config/apiConfig';

export interface ProductImage {
  _id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  discount: number;
  salePrice: number;
  stock: number;
  unit: string;
  tags: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  nutritionInfo?: any;
  isActive: boolean;
  isFeatured: boolean;
  isOrganic: boolean;
  countryOfOrigin: string;
  avgRating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  image?: string;
  isActive: boolean;
  subcategories?: Category[];
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  data: Product[];
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  data: Category[];
}

export interface ProductFilters {
  category?: string;
  tag?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  isFeatured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  setFilters: (filters: Partial<ProductFilters>) => void;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProduct: (idOrSlug: string) => Promise<Product | null>;
  clearFilters: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const [filters, setFiltersState] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    sort: '-createdAt'
  });

  // Update filters and reset page to 1 if other filters change
  const setFilters = (newFilters: Partial<ProductFilters>) => {
    setFiltersState(prev => {
      // Reset to page 1 if any filter other than page changes
      const resetPage = Object.keys(newFilters).some(key => key !== 'page');
      return {
        ...prev,
        ...newFilters,
        page: resetPage ? 1 : newFilters.page || prev.page
      };
    });
  };

  // Clear all filters except pagination and sorting
  const clearFilters = () => {
    setFiltersState({
      page: 1,
      limit: filters.limit,
      sort: filters.sort
    });
  };

  // Fetch products based on current filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await fetch(
        apiUrl(`/api/products?${queryParams.toString()}`),
        createFetchOptions('GET')
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: ProductsResponse = await response.json();
      
      setProducts(data.data);
      setTotalProducts(data.count);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        apiUrl('/api/categories'),
        createFetchOptions('GET')
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data: CategoriesResponse = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single product by ID or slug
  const fetchProduct = async (idOrSlug: string): Promise<Product | null> => {
    try {
      setLoading(true);
      
      const response = await fetch(
        apiUrl(`/api/products/${idOrSlug}`),
        createFetchOptions('GET')
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching product ${idOrSlug}:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch products and categories when component mounts
  useEffect(() => {
    fetchCategories();
    // We don't fetch products on mount as they will be fetched when filters change
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        filters,
        totalProducts,
        totalPages,
        currentPage,
        setFilters,
        fetchProducts,
        fetchCategories,
        fetchProduct,
        clearFilters
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 