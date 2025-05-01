import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, Order, cancelOrder } from '../services/orderService';
import { formatCurrency } from '../utils/currencyUtils';

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelClick = (order: Order) => {
    setSelectedOrder(order);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedOrder || !cancelReason) return;

    try {
      setCancellingOrder(selectedOrder._id);
      const result = await cancelOrder(selectedOrder._id, cancelReason);
      
      // Update order status in the list
      setOrders(orders.map(order => 
        order._id === result.orderId 
          ? { ...order, status: 'cancelled' as const } 
          : order
      ));

      setShowCancelModal(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">My Orders</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link to="/products" className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Order #{order.orderNumber}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Order items preview - show first 2 items */}
                  <div className="md:col-span-3">
                    <h3 className="font-medium mb-3">Items</h3>
                    <div className="flex flex-wrap gap-3">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item._id} className="flex items-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-14 h-14 object-cover rounded-md mr-2"
                          />
                          <div className="text-sm">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-md text-gray-500 text-sm">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Order actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/orders/${order._id}`}
                      className="px-4 py-2 text-center bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                    
                    {['pending', 'paid', 'processing'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelClick(order)}
                        disabled={cancellingOrder === order._id}
                        className="px-4 py-2 text-center bg-white border border-red-300 rounded-md text-red-700 font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Cancel Order</h3>
              <p className="mb-4">
                Are you sure you want to cancel order #{selectedOrder.orderNumber}?
                This action cannot be undone.
              </p>
              
              <div className="mb-4">
                <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Cancellation *
                </label>
                <select
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a reason</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Shipping takes too long">Shipping takes too long</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={!cancelReason || cancellingOrder === selectedOrder._id}
                  className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancellingOrder === selectedOrder._id ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders; 