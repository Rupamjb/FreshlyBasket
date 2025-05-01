import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiUrl, createFetchOptions } from '../config/apiConfig';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: Address[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Make an API call to verify the token and get the user profile
          const response = await fetch(apiUrl('/api/users/profile'), 
            createFetchOptions('GET')
          );
          
          if (response.ok) {
            const data = await response.json();
            setUser({
              id: data.data._id,
              name: data.data.name,
              email: data.data.email,
              phone: data.data.phone,
              addresses: data.data.addresses
            });
          } else {
            // If token is invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Make API call to login endpoint
      const response = await fetch(apiUrl('/api/users/login'), 
        createFetchOptions('POST', { email, password }, false)
      );
      
      // Check for non-JSON responses before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, try to get text content for debugging
        const textContent = await response.text();
        console.error('Received non-JSON response:', textContent.substring(0, 100) + '...');
        throw new Error('Server returned an invalid response. Please try again later.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
      }
      
      // Set user in state
      setUser({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        addresses: data.data.addresses || []
      });
      
      return data;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Make API call to register endpoint
      const response = await fetch(apiUrl('/api/users/register'), 
        createFetchOptions('POST', { name, email, password }, false)
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      // Store token
      if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      }
      
      // Set user in state
      setUser({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        addresses: data.data.addresses || []
      });
      
      return data;
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call the logout API endpoint
      await fetch(apiUrl('/api/users/logout'), createFetchOptions('GET'));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Make API call to update profile
      const response = await fetch(apiUrl('/api/users/profile'), 
        createFetchOptions('PUT', data)
      );
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Profile update failed');
      }
      
      // Update user in state and storage
      if (user) {
        const updatedUser = { ...user, ...responseData.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Update token if it was renewed (email changed)
        if (responseData.data.token) {
          localStorage.setItem('token', responseData.data.token);
        }
      }
    } catch (error) {
      console.error('Profile update failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add address
  const addAddress = async (address: Omit<Address, 'id'>) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const newAddress = {
          ...address,
          id: Date.now().toString() // Generate a temporary ID
        };
        
        const updatedAddresses = [...(user.addresses || [])];
        
        // If this is the default address, remove default from others
        if (newAddress.isDefault) {
          updatedAddresses.forEach(addr => addr.isDefault = false);
        }
        
        // If this is the first address, make it default
        if (updatedAddresses.length === 0) {
          newAddress.isDefault = true;
        }
        
        updatedAddresses.push(newAddress);
        
        const updatedUser = { ...user, addresses: updatedAddresses };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Add address failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update address
  const updateAddress = async (address: Address) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user && user.addresses) {
        const updatedAddresses = [...user.addresses];
        
        // If this is being set as default, remove default from others
        if (address.isDefault) {
          updatedAddresses.forEach(addr => addr.isDefault = false);
        }
        
        const index = updatedAddresses.findIndex(addr => addr.id === address.id);
        if (index !== -1) {
          updatedAddresses[index] = address;
        }
        
        const updatedUser = { ...user, addresses: updatedAddresses };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Update address failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove address
  const removeAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user && user.addresses) {
        let updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
        
        // If we removed the default address and there are other addresses, make the first one default
        if (user.addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }
        
        const updatedUser = { ...user, addresses: updatedAddresses };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Remove address failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 