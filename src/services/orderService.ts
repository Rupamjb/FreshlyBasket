import { apiUrl, createFetchOptions } from '../config/apiConfig';
import { CartItem } from '../context/CartContext';

// Define the order interfaces
export interface OrderAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface BillingAddress extends OrderAddress {
  sameAsShipping: boolean;
}

export interface OrderItem extends Omit<CartItem, 'id'> {
  _id: string;
}

export interface OrderStatus {
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
  note?: string;
}

export interface PaymentDetails {
  transactionId?: string;
  status?: string;
  timestamp?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  guestEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  discount: number;
  shippingAddress: OrderAddress;
  billingAddress: BillingAddress;
  paymentMethod: string;
  paymentDetails?: PaymentDetails;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: OrderStatus[];
  notes?: string;
  cancellationReason?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: OrderAddress;
  billingAddress?: BillingAddress;
  paymentMethod: string;
  guestEmail?: string;
  notes?: string;
}

// Create a new order from cart
export const createOrder = async (orderData: CreateOrderRequest): Promise<{ order: Order }> => {
  try {
    const response = await fetch(
      apiUrl('/api/orders'),
      createFetchOptions('POST', orderData)
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }

    return data.data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

// Get all orders for the current user
export const getMyOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(
      apiUrl('/api/orders'),
      createFetchOptions('GET')
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to retrieve orders');
    }

    return data.data;
  } catch (error) {
    console.error('Get orders error:', error);
    throw error;
  }
};

// Get order details by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await fetch(
      apiUrl(`/api/orders/${orderId}`),
      createFetchOptions('GET')
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to retrieve order details');
    }

    return data.data;
  } catch (error) {
    console.error('Get order details error:', error);
    throw error;
  }
};

// Track order by order number and email (for guest users)
export const trackOrder = async (orderNumber: string, email: string): Promise<Order> => {
  try {
    const response = await fetch(
      apiUrl(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`),
      createFetchOptions('GET', undefined, false)
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to track order');
    }

    return data.data;
  } catch (error) {
    console.error('Track order error:', error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId: string, reason: string): Promise<{ orderId: string; orderNumber: string; status: string }> => {
  try {
    const response = await fetch(
      apiUrl(`/api/orders/${orderId}/cancel`),
      createFetchOptions('PUT', { reason })
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel order');
    }

    return data.data;
  } catch (error) {
    console.error('Cancel order error:', error);
    throw error;
  }
}; 