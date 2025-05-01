import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo, FiAlertCircle, FiCheckCircle, FiWifi, FiWifiOff } from 'react-icons/fi';
import { createPortal } from 'react-dom';

// Types for toast data
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'offline';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  timestamp: number;
}

// Context for toast functionality
interface ToastContextProps {
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Toast component showing a single notification
const Toast: React.FC<Toast & { onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  // Different styles based on toast type
  const typeStyles = {
    success: 'bg-green-50 text-green-800 border-green-500',
    error: 'bg-red-50 text-red-800 border-red-500',
    info: 'bg-blue-50 text-blue-800 border-blue-500',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-500',
    offline: 'bg-neutral-50 text-neutral-800 border-neutral-200'
  };

  const icons = {
    success: (
      <FiCheckCircle className="w-5 h-5" />
    ),
    error: (
      <FiAlertCircle className="w-5 h-5" />
    ),
    info: (
      <FiInfo className="w-5 h-5" />
    ),
    warning: (
      <FiInfo className="w-5 h-5" />
    ),
    offline: (
      <FiWifiOff className="w-5 h-5" />
    )
  };

  return (
    <motion.div 
      className={`p-4 border-l-4 rounded shadow-md mb-2 flex items-start ${typeStyles[type]}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon based on type */}
      <div className="mr-3">
        {icons[type]}
      </div>
      
      {/* Message */}
      <div className="flex-grow text-sm">{message}</div>
      
      {/* Close button */}
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Provider component that manages all toasts
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      addToast('You are back online', 'success');
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      addToast('You are offline. Some features may be unavailable.', 'offline', 0); // 0 means it won't auto-dismiss
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial state
    if (!navigator.onLine) {
      handleOffline();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Generate a unique ID for each toast
  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };
  
  // Add a new toast
  const addToast = (message: string, type: ToastType, duration = 5000) => {
    const newToast: Toast = {
      id: generateUniqueId(),
      message,
      type,
      duration,
      timestamp: Date.now()
    };
    
    // Remove any duplicate offline messages if this is an offline message
    if (type === 'offline') {
      setToasts(prev => [...prev.filter(t => t.type !== 'offline'), newToast]);
    } else {
      setToasts(prev => [...prev, newToast]);
    }
    
    // Auto-remove toast after duration (if not 0)
    if (duration > 0) {
      setTimeout(() => {
        removeToast(newToast.id);
      }, duration);
    }
  };
  
  // Remove a toast by ID
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Clear all toasts
  const clearToasts = () => {
    setToasts([]);
  };
  
  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      {createPortal(
        <ToastContainer toasts={toasts} removeToast={removeToast} />,
        document.body
      )}
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer: React.FC<{ 
  toasts: Toast[]; 
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 max-h-screen overflow-hidden flex flex-col-reverse space-y-reverse space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Item Component
const ToastItem: React.FC<{ 
  toast: Toast; 
  onClose: () => void;
}> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'warning':
        return <FiInfo className="w-5 h-5" />;
      case 'offline':
        return <FiWifiOff className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };
  
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'offline':
        return 'bg-neutral-50 border-neutral-200 text-neutral-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`pointer-events-auto w-72 md:w-96 rounded-lg shadow-lg border px-4 py-3 flex items-start ${getToastStyles()}`}
    >
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1 mr-2">
        <p className="text-sm">{toast.message}</p>
      </div>
      <div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 focus:outline-none"
          aria-label="Close"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Hook to use the toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider; 