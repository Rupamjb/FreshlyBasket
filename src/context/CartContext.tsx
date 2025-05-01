import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { apiUrl, createFetchOptions, apiRequest } from '../config/apiConfig';

// Define cart item type
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  image: string;
  category: string;
  unit?: string;
}

// Define server cart item type (for receiving from API)
interface ServerCartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  image: string;
  category: string;
  unit?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  loading: boolean;
  error: string | null;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Calculate totals
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((total, item) => {
    if (item.discountedPrice) {
      return total + ((item.price - item.discountedPrice) * item.quantity);
    }
    return total;
  }, 0);
  const total = subtotal - discount;

  // Helper function to format server cart items
  const formatCartItems = (serverItems: ServerCartItem[]): CartItem[] => {
    return serverItems.map(item => ({
      id: item._id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      discountedPrice: item.discountedPrice,
      quantity: item.quantity,
      image: item.image,
      category: item.category,
      unit: item.unit
    }));
  };

  // Load cart from API or localStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isAuthenticated) {
          // Get cart from API
          try {
            const response = await fetch(
              apiUrl('/api/cart'),
              createFetchOptions('GET')
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                // Format the items to match our CartItem interface
                setCartItems(formatCartItems(data.data.items));
              }
            } else {
              // If API fails, try to get from localStorage as fallback
              const savedCart = localStorage.getItem(`cart-${user?.id}`);
              if (savedCart) {
                setCartItems(JSON.parse(savedCart));
              }
            }
          } catch (error) {
            console.error("Error fetching cart from API:", error);
            // Fallback to localStorage
            const savedCart = localStorage.getItem(`cart-${user?.id}`);
            if (savedCart) {
              setCartItems(JSON.parse(savedCart));
            }
          }
        } else {
          // For guest user, load from localStorage
          const guestCart = localStorage.getItem('guest-cart');
          if (guestCart) {
            setCartItems(JSON.parse(guestCart));
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('guest-cart', JSON.stringify(cartItems));
    } else if (!isAuthenticated && cartItems.length === 0) {
      localStorage.removeItem('guest-cart');
    }
  }, [cartItems, isAuthenticated]);

  // Add item to cart
  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Defensive check for productId
      if (!item.productId) {
        throw new Error('Product ID is required');
      }
      
      if (isAuthenticated) {
        console.log('Adding to cart with productId:', item.productId);
        console.log('User authenticated:', isAuthenticated);
        
        try {
          // Add to API cart using the apiRequest helper
          const options = createFetchOptions('POST', {
            productId: item.productId,
            quantity: item.quantity || 1
          });
          
          const data = await apiRequest(
            apiUrl('/api/cart/items'),
            options,
            { success: false, message: 'Server error', data: { items: [] } }
          );
          
          if (data.success) {
            // Format the items to match our CartItem interface
            setCartItems(formatCartItems(data.data.items));
          } else {
            throw new Error(data.message || 'Failed to add item to cart');
          }
        } catch (error) {
          console.error("Failed API cart update, using local fallback:", error);
          
          // Fallback - add to local cart if API fails
          setCartItems(prevItems => {
            // Check if product already exists in cart
            const existingItemIndex = prevItems.findIndex(i => i.productId === item.productId);
            
            if (existingItemIndex >= 0) {
              // Update quantity if item exists
              const updatedItems = [...prevItems];
              updatedItems[existingItemIndex].quantity += item.quantity || 1;
              return updatedItems;
            } else {
              // Add new item with generated id
              return [...prevItems, { ...item, id: Date.now().toString() }];
            }
          });
          
          // Store in localStorage as backup
          localStorage.setItem(`cart-${user?.id}`, JSON.stringify(cartItems));
        }
      } else {
        // Add to local cart for guest
        setCartItems(prevItems => {
          // Check if product already exists in cart
          const existingItemIndex = prevItems.findIndex(i => i.productId === item.productId);
          
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += item.quantity || 1;
            return updatedItems;
          } else {
            // Add new item with generated id
            const newItem = {
              ...item,
              id: Date.now().toString() // Generate a temporary ID
            };
            return [...prevItems, newItem];
          }
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      
      if (error instanceof Error) {
        setError(error.message || "Failed to add item to cart. Please try again.");
      } else {
        setError("Failed to add item to cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // First, find the item id from the productId
        const item = cartItems.find(item => item.productId === productId);
        if (!item) {
          throw new Error('Item not found in cart');
        }
        
        // Remove from API cart
        const response = await fetch(
          apiUrl(`/api/cart/items/${item.id}`),
          createFetchOptions('DELETE')
        );
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to remove item from cart');
        }
        
        if (data.success) {
          // Format the items to match our CartItem interface
          setCartItems(formatCartItems(data.data.items));
        } else {
          throw new Error(data.message || 'Failed to remove item from cart');
        }
      } else {
        // Remove from local cart for guest
        setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      
      if (error instanceof Error) {
        setError(error.message || "Failed to remove item from cart. Please try again.");
      } else {
        setError("Failed to remove item from cart. Please try again.");
      }
      
      // Fallback: Update UI by filtering local state
      setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        await removeFromCart(productId);
        return;
      }
      
      if (isAuthenticated) {
        // Find the item id from the productId
        const item = cartItems.find(item => item.productId === productId);
        if (!item) {
          throw new Error('Item not found in cart');
        }
        
        // Update API cart
        const response = await fetch(
          apiUrl('/api/cart/items'),
          createFetchOptions('PUT', {
            itemId: item.id,
            quantity
          })
        );
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update cart');
        }
        
        if (data.success) {
          // Format the items to match our CartItem interface
          setCartItems(formatCartItems(data.data.items));
        } else {
          throw new Error(data.message || 'Failed to update cart');
        }
      } else {
        // Update local cart for guest
        setCartItems(prevItems => {
          return prevItems.map(item => {
            if (item.productId === productId) {
              return { ...item, quantity };
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      
      if (error instanceof Error) {
        setError(error.message || "Failed to update cart. Please try again.");
      } else {
        setError("Failed to update cart. Please try again.");
      }
      
      // Fallback: Update UI by updating local state
      if (quantity > 0) {
        setCartItems(prevItems => {
          return prevItems.map(item => {
            if (item.productId === productId) {
              return { ...item, quantity };
            }
            return item;
          });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Clear API cart
        const response = await fetch(
          apiUrl('/api/cart'),
          createFetchOptions('DELETE')
        );
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to clear cart');
        }
        
        if (data.success) {
          setCartItems([]);
        } else {
          throw new Error(data.message || 'Failed to clear cart');
        }
      } else {
        // Clear local cart for guest
        setCartItems([]);
        localStorage.removeItem('guest-cart');
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      
      if (error instanceof Error) {
        setError(error.message || "Failed to clear cart. Please try again.");
      } else {
        setError("Failed to clear cart. Please try again.");
      }
      
      // Fallback: Clear UI by emptying local state
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Merge guest cart with user cart after login
  const mergeGuestCart = async () => {
    try {
      if (!isAuthenticated || !user) {
        return; // Only proceed if authenticated
      }
      
      const guestCart = localStorage.getItem('guest-cart');
      if (!guestCart) {
        return; // No guest cart to merge
      }
      
      setLoading(true);
      setError(null);
      
      const guestCartItems = JSON.parse(guestCart);
      if (guestCartItems.length === 0) {
        return; // Empty guest cart
      }
      
      // Call API to merge carts
      const response = await fetch(
        apiUrl('/api/cart/merge'),
        createFetchOptions('POST', {
          guestCartItems: guestCartItems.map((item: CartItem) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Format the items to match our CartItem interface
        setCartItems(formatCartItems(data.data.items));
        
        // Clear guest cart
        localStorage.removeItem('guest-cart');
        
        // Log the merge results if available
        if (data.data.mergedItems && data.data.mergedItems.length > 0) {
          console.log(`Successfully merged ${data.data.mergedItems.length} items from guest cart`);
        }
        
        if (data.data.failedItems && data.data.failedItems.length > 0) {
          console.warn(`Failed to merge ${data.data.failedItems.length} items:`, data.data.failedItems);
          setError(`Some items couldn't be merged: ${data.data.failedItems.map((item: { reason: string }) => item.reason).join(', ')}`);
        }
      } else {
        throw new Error(data.message || 'Failed to merge cart');
      }
    } catch (error) {
      console.error("Error merging carts:", error);
      
      if (error instanceof Error) {
        setError(error.message || "Failed to merge your guest cart with your account. Please try again.");
      } else {
        setError("Failed to merge your guest cart with your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Trigger cart merge when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      mergeGuestCart();
    }
  }, [isAuthenticated, user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        discount,
        total,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        mergeGuestCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 