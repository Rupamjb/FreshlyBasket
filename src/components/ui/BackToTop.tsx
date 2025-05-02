import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Threshold in pixels for when the button should appear
const SCROLL_THRESHOLD = 400;

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > SCROLL_THRESHOLD);
        setIsScrolling(false);
      });
      setIsScrolling(true);
    }
  }, [isScrolling]);
  
  useEffect(() => {
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check on mount in case page is already scrolled
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  const scrollToTop = () => {
    // Smoothly scroll to top of page using our utility
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Add a class to body during scrolling to prevent expensive animations
    document.body.classList.add('is-scrolling');
    
    // Remove the class after scrolling finishes
    setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 1000);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-8 right-8 bg-primary text-white w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-[#0D4328] focus:outline-none"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          aria-label="Back to top"
          style={{
            willChange: 'transform',
            contain: 'layout'
          }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 md:h-6 md:w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop; 