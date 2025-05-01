import React, { Suspense, useEffect, useState, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import BackToTop from './components/ui/BackToTop';
import LoadingScreen from './components/ui/LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import AuthModalsProvider from './components/auth/AuthModals'
import ErrorBoundary from './components/ui/ErrorBoundary';
import NetworkStatusMonitor from './components/ui/NetworkStatusMonitor';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Handle React Suspense loading errors
const SuspenseWithErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary navigate={true}>
    <Suspense fallback={<LoadingScreen message="Loading page..." />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Location wrapper for AnimatePresence to work with react-router
function AnimatedRoutes() {
  const location = useLocation();
  
  // Handle 404 errors from URL
  useEffect(() => {
    // Check if we're loading a direct route and apply special handling
    if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/index.html')) {
      // Log the navigation for debugging
      console.info('Deep navigation to:', window.location.pathname);
    }
    
    // Clear any error state when navigating
    const params = new URLSearchParams(location.search);
    if (params.has('code') && params.get('code') === 'NOT_FOUND') {
      console.warn('Navigated to a 404 error page with code:', params.get('code'));
    }
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <SuspenseWithErrorBoundary>
            <Home />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/products" element={
          <SuspenseWithErrorBoundary>
            <ProductListing />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/products/:category" element={
          <SuspenseWithErrorBoundary>
            <ProductListing />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/product/:id" element={
          <SuspenseWithErrorBoundary>
            <ProductDetail />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/cart" element={
          <SuspenseWithErrorBoundary>
            <Cart />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/checkout" element={
          <SuspenseWithErrorBoundary>
            <Checkout />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/auth" element={
          <SuspenseWithErrorBoundary>
            <AuthPage />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/profile" element={
          <SuspenseWithErrorBoundary>
            <Profile />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/error" element={
          <SuspenseWithErrorBoundary>
            <NotFound />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="/404" element={
          <SuspenseWithErrorBoundary>
            <NotFound />
          </SuspenseWithErrorBoundary>
        } />
        <Route path="*" element={
          <SuspenseWithErrorBoundary>
            <NotFound />
          </SuspenseWithErrorBoundary>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust time as needed
    
    return () => clearTimeout(timer);
  }, []);

  // Global error handler for uncaught exceptions
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      
      // Handle JSON parse errors specifically
      if (event.error && event.error.message && 
          (event.error.message.includes('Unexpected token') || 
           event.error.message.includes('JSON.parse'))) {
        console.error('JSON parsing error detected:', event.error);
        // Show a user-friendly message or redirect to an error page
        // This is likely caused by receiving HTML instead of JSON from the API
      }
      
      // Optionally redirect to error page for catastrophic errors
      if (event.error && event.error.message && event.error.message.includes('catastrophic')) {
        window.location.href = '/error?type=fatal&message=' + encodeURIComponent(event.error.message);
        event.preventDefault(); // Prevent default error handling
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Getting things ready..." />;
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <AuthModalsProvider>
                <NetworkStatusMonitor />
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <AnimatedRoutes />
                  </main>
                  <Footer />
                  <BackToTop />
                </div>
              </AuthModalsProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
