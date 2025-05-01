import { createContext, useState, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { CartItem } from './CartContext';

// Define order types
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT'
}

export interface OrderAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId?: string; // Optional for guest checkout
  items: CartItem[];
  totalAmount: number;
  subTotal: number;
  discount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentId?: string;
  address: OrderAddress;
  createdAt: string;
  updatedAt: string;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  createOrder: (
    items: CartItem[],
    address: OrderAddress,
    paymentMethod: PaymentMethod
  ) => Promise<Order>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  getUserOrders: () => Promise<Order[]>;
  cancelOrder: (orderId: string) => Promise<void>;
  processPayment: (orderId: string, paymentId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new order
  const createOrder = async (
    items: CartItem[],
    address: OrderAddress,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // This is just a simulation for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate totals
      const subTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const discount = items.reduce((total, item) => {
        if (item.discountedPrice) {
          return total + ((item.price - item.discountedPrice) * item.quantity);
        }
        return total;
      }, 0);
      const totalAmount = subTotal - discount;

      // Create new order
      const newOrder: Order = {
        id: Date.now().toString(), // Generate a temporary ID
        userId: user?.id,
        items: [...items],
        totalAmount,
        subTotal,
        discount,
        status: OrderStatus.PENDING,
        paymentMethod,
        paymentStatus: 'PENDING',
        address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage to simulate persistence
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = [...savedOrders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      // Update state
      setOrders(updatedOrders);
      setCurrentOrder(newOrder);

      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get a single order by ID
  const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // This is just a simulation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const order = savedOrders.find((o: Order) => o.id === orderId) || null;

      if (order) {
        setCurrentOrder(order);
      }

      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get order';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get all orders for the current user
  const getUserOrders = async (): Promise<Order[]> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // This is just a simulation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Filter orders by current user
      const userOrders = user?.id 
        ? savedOrders.filter((o: Order) => o.userId === user.id)
        : [];

      setOrders(userOrders);
      return userOrders;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user orders';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // This is just a simulation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Update the order status
      const updatedOrders = savedOrders.map((o: Order) => {
        if (o.id === orderId) {
          return { ...o, status: OrderStatus.CANCELLED, updatedAt: new Date().toISOString() };
        }
        return o;
      });

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Update state
      setOrders(updatedOrders);
      
      // Update current order if it's the one being canceled
      if (currentOrder?.id === orderId) {
        setCurrentOrder({ ...currentOrder, status: OrderStatus.CANCELLED, updatedAt: new Date().toISOString() });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Process payment for an order
  const processPayment = async (orderId: string, paymentId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // This is just a simulation for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Update the order payment status
      const updatedOrders = savedOrders.map((o: Order) => {
        if (o.id === orderId) {
          return { 
            ...o, 
            status: OrderStatus.PAID, 
            paymentStatus: 'COMPLETED', 
            paymentId,
            updatedAt: new Date().toISOString() 
          };
        }
        return o;
      });

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Update state
      setOrders(updatedOrders);
      
      // Update current order if it's the one being processed
      if (currentOrder?.id === orderId) {
        setCurrentOrder({ 
          ...currentOrder, 
          status: OrderStatus.PAID, 
          paymentStatus: 'COMPLETED', 
          paymentId,
          updatedAt: new Date().toISOString() 
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        isLoading,
        error,
        createOrder,
        getOrderById,
        getUserOrders,
        cancelOrder,
        processPayment
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 