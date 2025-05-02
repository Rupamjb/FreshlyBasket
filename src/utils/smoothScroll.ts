/**
 * Smooth scroll utility 
 * Implements performance-optimized smooth scrolling behavior
 */

// Set scroll behavior in CSS
export const initSmoothScroll = (): void => {
  // Apply smooth scroll to the document
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Check if the browser supports Intersection Observer for optimized loading
  if ('IntersectionObserver' in window) {
    // CSS variables for controlling scroll speed
    document.documentElement.style.setProperty('--scroll-transition', '0.6s cubic-bezier(0.22, 1, 0.36, 1)');
  }
};

// Smooth scroll to element 
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Calculate position with offset
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;
  
  // Use requestAnimationFrame for smoother animation
  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
};

// Prevent scroll jank by disabling intensive animations during scroll
export const preventScrollJank = (): (() => void) => {
  let scrollTimeout: ReturnType<typeof setTimeout>;
  let isScrolling = false;
  
  const scrollHandler = () => {
    if (!isScrolling) {
      isScrolling = true;
      // Add class to body when scrolling starts
      document.body.classList.add('is-scrolling');
    }
    
    clearTimeout(scrollTimeout);
    
    // Reset after scrolling stops
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      document.body.classList.remove('is-scrolling');
    }, 100);
  };
  
  // Add scroll event listener
  window.addEventListener('scroll', scrollHandler, { passive: true });
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', scrollHandler);
    clearTimeout(scrollTimeout);
  };
};

// Lazy load images and components that are off-screen
export const setupLazyLoading = (): void => {
  if (!('IntersectionObserver' in window)) return;
  
  // Set up lazy loading for images
  const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target as HTMLImageElement;
        
        if (lazyImage.dataset.src) {
          lazyImage.src = lazyImage.dataset.src;
        }
        
        if (lazyImage.dataset.srcset) {
          lazyImage.srcset = lazyImage.dataset.srcset;
        }
        
        lazyImage.classList.remove('lazy');
        imageObserver.unobserve(lazyImage);
      }
    });
  }, {
    rootMargin: '200px 0px' // Start loading before the image is visible
  });
  
  lazyImages.forEach(image => {
    imageObserver.observe(image);
  });
};

export default {
  initSmoothScroll,
  scrollToElement,
  preventScrollJank,
  setupLazyLoading
}; 