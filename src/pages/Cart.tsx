import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/currencyUtils';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    total, 
    subtotal,
    loading,
    error
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };
  
  const handleQuantityChange = async (productId: string, quantity: number) => {
    await updateQuantity(productId, quantity);
  };
  
  const handleCouponApply = () => {
    // Simulate coupon application - in a real app, this would verify with a backend
    if (couponCode.toUpperCase() === 'FRESH10') {
      setCouponApplied(true);
      setCouponDiscount(subtotal * 0.1);
    } else {
      alert('Invalid coupon code');
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // Calculate final prices
  const shippingFee = subtotal >= 50 ? 0 : 4.99;
  const finalTotal = subtotal + shippingFee - couponDiscount;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  // Show loading spinner when cart is being fetched or updated
  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your cart...</p>
        </div>
      </div>
    );
  }
  
  // Show error message if there was a problem
  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-heading font-medium text-neutral-700 mb-4">There was a problem with your cart</h2>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary px-6 py-3"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-heading font-medium text-neutral-700 mb-4">Your cart is empty</h2>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet. Browse our collection to find what you need.
          </p>
          <Link to="/products" className="btn btn-primary px-6 py-3">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-heading font-semibold">Cart Items ({cartItems.length})</h2>
                  <button 
                    onClick={() => clearCart()} 
                    className="text-red-500 text-sm hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-neutral-200"
              >
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    variants={itemVariants}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-neutral-100 rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <Link to={`/product/${item.productId}`} className="text-lg font-medium text-neutral-800 hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <div className="text-primary font-medium mt-1">
                        {item.discountedPrice ? (
                          <>
                            <span className="text-primary">{formatCurrency(item.discountedPrice)}</span>
                            <span className="text-neutral-400 line-through ml-2">{formatCurrency(item.price)}</span>
                          </>
                        ) : (
                          <span>{formatCurrency(item.price)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)} 
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-primary disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)} 
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-lg font-semibold text-neutral-800 min-w-[80px] text-right">
                      {formatCurrency((item.discountedPrice || item.price) * item.quantity)}
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveItem(item.productId)} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="p-6 bg-neutral-50 flex flex-wrap justify-between items-center">
                <Link to="/products" className="flex items-center text-primary hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
                
                <div className="mt-4 sm:mt-0">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="ml-2 text-xl font-semibold text-neutral-800">{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-4">
              <h2 className="text-xl font-heading font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-800 font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="text-neutral-800 font-medium">
                    {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
                  </span>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between text-success">
                    <span>Discount (FRESH10)</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                
                <div className="h-px bg-neutral-200 my-2"></div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>
              
              {!couponApplied && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Apply Coupon</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-grow px-4 py-2 border border-neutral-300 rounded-l-md focus:ring-primary focus:border-primary"
                    />
                    <button 
                      onClick={handleCouponApply}
                      className="bg-neutral-100 text-neutral-800 font-medium px-4 border border-l-0 border-neutral-300 rounded-r-md hover:bg-neutral-200"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Try "FRESH10" for 10% off your order</p>
                </div>
              )}
              
              <button 
                onClick={handleCheckout}
                className="btn btn-primary w-full py-3"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 