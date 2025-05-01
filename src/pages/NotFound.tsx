import { Link, useLocation } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';
import { FiAlertTriangle, FiSearch, FiDatabase, FiWifiOff, FiRefreshCw } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useToast } from '../components/ui/Toast';

const NotFound = () => {
  const location = useLocation();
  const { addToast } = useToast();
  const [errorType, setErrorType] = useState<'not-found' | 'api-error' | 'network' | 'unknown'>('not-found');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Check if there's state passed with error information
    if (location.state) {
      const { type, message, status } = location.state as any;
      
      if (type === 'api-error') {
        setErrorType('api-error');
        setErrorDetails(message || `API Error (${status || 'unknown'})`);
      } else if (type === 'network') {
        setErrorType('network');
        setErrorDetails(message || 'Network connectivity issue');
      } else {
        setErrorType('unknown');
        setErrorDetails(message || null);
      }
    } else {
      // Check if the URL contains error information
      const params = new URLSearchParams(location.search);
      const errorCode = params.get('code');
      const errorMessage = params.get('message');
      
      if (errorCode) {
        if (errorCode === 'NOT_FOUND' || errorCode === '404') {
          setErrorType('not-found');
        } else if (errorCode.includes('NETWORK') || errorCode === 'OFFLINE') {
          setErrorType('network');
        } else {
          setErrorType('api-error');
        }
        
        if (errorMessage) {
          setErrorDetails(errorMessage);
        }
      }
    }
  }, [location]);

  const handleRetry = () => {
    setIsRetrying(true);
    
    // Show toast notification
    addToast('Retrying...', 'info');
    
    // Simulate retry with delay
    setTimeout(() => {
      setIsRetrying(false);
      
      // Go back or to the appropriate page based on error type
      if (document.referrer && document.referrer.includes(window.location.origin)) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }, 1500);
  };

  const getErrorIcon = () => {
    switch (errorType) {
      case 'not-found':
        return <FiSearch className="h-24 w-24 mx-auto text-neutral-300" />;
      case 'api-error':
        return <FiDatabase className="h-24 w-24 mx-auto text-neutral-300" />;
      case 'network':
        return <FiWifiOff className="h-24 w-24 mx-auto text-neutral-300" />;
      default:
        return <FiAlertTriangle className="h-24 w-24 mx-auto text-neutral-300" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'not-found':
        return 'Page Not Found';
      case 'api-error':
        return 'Server Error';
      case 'network':
        return 'Network Error';
      default:
        return 'Something Went Wrong';
    }
  };

  const getErrorMessage = () => {
    if (errorDetails) {
      return errorDetails;
    }
    
    switch (errorType) {
      case 'not-found':
        return "The page you are looking for doesn't exist or has been moved.";
      case 'api-error':
        return 'We encountered an issue while trying to retrieve data from our servers.';
      case 'network':
        return 'There seems to be an issue with your internet connection.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  };

  return (
    <PageTransition type="fade">
      <div className="container py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-9xl font-heading font-bold text-primary mb-4">
            {errorType === 'not-found' ? '404' : errorType === 'api-error' ? '500' : '!'}
          </div>
          
          <h2 className="text-3xl font-heading font-bold text-neutral-800 mb-6">
            {getErrorTitle()}
          </h2>
          
          <p className="text-neutral-600 mb-8">
            {getErrorMessage()}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary px-6 py-3"
            >
              Back to Home
            </Link>
            
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="btn bg-white text-primary border border-primary hover:bg-neutral-50 px-6 py-3 inline-flex items-center justify-center"
            >
              {isRetrying ? (
                <>
                  <FiRefreshCw className="mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-2" />
                  Try Again
                </>
              )}
            </button>
          </div>
          
          <div className="mt-12">
            {getErrorIcon()}
          </div>
          
          {/* Additional help for different error types */}
          {errorType === 'network' && (
            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Troubleshooting Tips</h3>
              <ul className="text-sm text-blue-700 text-left list-disc pl-5">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Clear your browser cache</li>
                <li>Try again in a few minutes</li>
              </ul>
            </div>
          )}
          
          {errorType === 'api-error' && (
            <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">What You Can Do</h3>
              <ul className="text-sm text-yellow-700 text-left list-disc pl-5">
                <li>Try again in a few moments</li>
                <li>Check if there's a service announcement on our home page</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound; 