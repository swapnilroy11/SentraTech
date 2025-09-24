import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.2
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    console.log('PageTransition: Navigating to', location.pathname);
    
    // Show loading state
    setIsLoading(true);
    setShowContent(false);
    
    // Use requestAnimationFrame to ensure smooth transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsLoading(false);
        setShowContent(true);
      });
    });

    // Cleanup function
    return () => {
      setIsLoading(false);
      setShowContent(false);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isLoading ? (
        <LoadingScreen key="loading" />
      ) : (
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
            zIndex: 1
          }}
          onAnimationComplete={() => {
            console.log('PageTransition: Animation complete for', location.pathname);
          }}
        >
          {showContent && children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;