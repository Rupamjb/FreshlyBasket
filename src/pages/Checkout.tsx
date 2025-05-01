import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/ui/CheckoutForm';
import { createOrder, OrderAddress, BillingAddress } from '../services/orderService';
import { formatCurrency } from '../utils/currencyUtils';

const Checkout = () => {
  const { cartItems, totalItems, subtotal, discount, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(!isAuthenticated);
  
  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Update showEmailInput when auth state changes
  useEffect(() => {
    setShowEmailInput(!isAuthenticated);
    if (isAuthenticated && user?.email) {
      setGuestEmail('');
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (data: {
    shippingAddress: OrderAddress;
    billingAddress: BillingAddress;
    paymentMethod: string;
    notes?: string;
  }) => {
    try {
      setIsLoading(true);
      setError('');
      
      // For guest users, email is required
      if (!isAuthenticated && !guestEmail) {
        setError('Email is required for guest checkout');
        setIsLoading(false);
        return;
      }
      
      // Create order data
      const orderData = {
        ...data,
        guestEmail: !isAuthenticated ? guestEmail : undefined
      };
      
      // Create order
      const response = await createOrder(orderData);
      
      // Clear the cart
      await clearCart();
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${response.order._id}`, { 
        state: { 
          orderNumber: response.order.orderNumber,
          isGuest: !isAuthenticated
        } 
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">Checkout</h1>
      
      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="border-b pb-4 mb-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatCurrency((item.discountedPrice || item.price) * item.quantity)}
                </p>
                {item.discountedPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal ({totalItems} items)</span>
            <span>{formatCurrency(subtotal)}</span>
            </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      
      {/* Guest Email Input */}
      {showEmailInput && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div>
            <label htmlFor="guest-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="guest-email"
              type="email"
              required
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            <p className="mt-2 text-sm text-gray-500">
              Your order details will be sent to this email address
            </p>
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Checkout Form */}
      <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default Checkout; 