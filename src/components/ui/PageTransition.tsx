import React from 'react';
import { motion } from 'framer-motion';

// Variants for different transition types
const pageVariants = {
  default: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  }
};

type TransitionType = 'default' | 'slide' | 'fade' | 'scale';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  className?: string;
  duration?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'default',
  className = '',
  duration = 0.3
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants[type]}
      transition={{ duration, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 