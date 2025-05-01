import { useEffect, FC } from 'react';
import { useToast } from './Toast';

const NetworkStatusMonitor: FC = () => {
  const { addToast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      addToast('Connection restored! You are back online.', 'success');
    };

    const handleOffline = () => {
      addToast('You are currently offline. Some features may be unavailable.', 'offline', 0);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    if (!navigator.onLine) {
      handleOffline();
    }

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  // This component doesn't render anything
  return null;
};

export default NetworkStatusMonitor; 