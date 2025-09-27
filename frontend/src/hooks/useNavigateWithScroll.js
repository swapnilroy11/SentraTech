import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export const useNavigateWithScroll = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollTimeoutRef = useRef(null);

  const navigateToSection = (path) => {
    // Check if it's an anchor link
    if (path.includes('#')) {
      const [routePath, sectionId] = path.split('#');
      
      // If we're already on the right page, just scroll
      if (location.pathname === routePath) {
        scrollToSection(sectionId);
      } else {
        // Navigate to the page with the hash in the URL
        navigate(`${routePath}#${sectionId}`);
      }
    } else {
      navigate(path);
    }
  };

  const scrollToSection = (sectionId) => {
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Fast scroll attempt using requestAnimationFrame for smoothness
    const fastAttempt = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        return true;
      }
      return false;
    };

    // Try immediate scroll first
    if (fastAttempt()) return;

    // If not found immediately, try with minimal delay for dynamic content
    const attemptScroll = (attempt = 1) => {
      const element = document.getElementById(sectionId);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        });
        return;
      }
      
      // Only retry twice more with short delays
      if (attempt <= 2) {
        scrollTimeoutRef.current = setTimeout(() => attemptScroll(attempt + 1), 150);
      }
    };

    // Start with minimal delay
    scrollTimeoutRef.current = setTimeout(() => attemptScroll(), 100);
  };

  // Handle scrolling after navigation
  useEffect(() => {
    const hashFromUrl = location.hash.substring(1);
    
    if (hashFromUrl) {
      scrollToSection(hashFromUrl);
    }
  }, [location.pathname, location.hash]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return navigateToSection;
};