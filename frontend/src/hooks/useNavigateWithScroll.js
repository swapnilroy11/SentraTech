import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useNavigateWithScroll = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToSection = (path) => {
    // Check if it's an anchor link
    if (path.includes('#')) {
      const [routePath, sectionId] = path.split('#');
      
      // If we're already on the right page, just scroll
      if (location.pathname === routePath) {
        scrollToSection(sectionId);
      } else {
        // Navigate to the page first, then scroll after navigation
        navigate(routePath, { state: { scrollTo: sectionId } });
      }
    } else {
      navigate(path);
    }
  };

  const scrollToSection = (sectionId) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Handle scrolling after navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return navigateToSection;
};