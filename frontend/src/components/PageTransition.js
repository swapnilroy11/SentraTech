import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -10  // Reduced movement for smoother performance
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: 10  // Reduced movement for smoother performance
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',  // Simpler easing
  duration: 0.15    // Reduced duration for snappier feel
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Simplified transition logic - remove loading state for better performance
    setShowContent(false);
    
    // Use single requestAnimationFrame instead of double
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 50); // Minimal delay for smooth transition

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full min-h-screen"
        style={{ 
          backgroundColor: '#0A0A0A', 
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          // Performance optimizations
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        {showContent && children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;