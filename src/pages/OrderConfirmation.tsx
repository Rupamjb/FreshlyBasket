import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { Order } from '../services/orderService';
import { formatCurrency } from '../utils/currencyUtils';

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get order number and guest status from location state
  const { orderNumber, isGuest } = location.state as { 
    orderNumber?: string; 
    isGuest?: boolean;
  } || {};

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const orderData = await getOrderById(id);
          setOrder(orderData);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Unable to load order details. Please check your order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        {/* Confirmation Header */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md inline-block">
            <p className="font-medium">
              Order Number:
              <span className="ml-2 text-primary">{orderNumber || (order?.orderNumber || 'N/A')}</span>
            </p>
          </div>
          
          {isGuest && (
            <div className="mt-4 text-sm text-gray-600">
              <p>An email with your order details has been sent to your email address.</p>
              <p className="mt-2">
                You can track your order status using your order number and email address.
              </p>
            </div>
          )}
        </div>
        
        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        ) : order ? (
          <>
            {/* Order Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Status</h2>
              <div className="flex items-center">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
                <span className="ml-4 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="border-b pb-4 mb-4">
                {order.items.map(item => (
                  <div key={item._id} className="flex items-center justify-between py-2">
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
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
            
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <address className="not-italic text-gray-600">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                    {order.shippingAddress.address1}<br />
                    {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}<br />
                    Phone: {order.shippingAddress.phone}
                  </address>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="text-gray-600">
                    {order.paymentMethod === 'credit_card'
                      ? 'Credit Card'
                      : order.paymentMethod === 'paypal'
                      ? 'PayPal'
                      : order.paymentMethod === 'cash_on_delivery'
                      ? 'Cash on Delivery'
                      : order.paymentMethod}
                  </p>
                  
                  {order.trackingNumber && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Tracking Number</h3>
                      <p className="text-gray-600">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
            Order details not available. Your order has been placed successfully.
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark"
          >
            Continue Shopping
          </Link>
          
          {!isGuest && (
            <Link
              to="/account/orders"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50"
            >
              View All Orders
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 