import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useNavigateWithScroll = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToSection = (path) => {
    console.log('Navigating to:', path);
    
    // Check if it's an anchor link
    if (path.includes('#')) {
      const [routePath, sectionId] = path.split('#');
      console.log('Anchor navigation - Route:', routePath, 'Section:', sectionId);
      
      // If we're already on the right page, just scroll
      if (location.pathname === routePath) {
        console.log('Already on correct page, scrolling to:', sectionId);
        scrollToSection(sectionId);
      } else {
        console.log('Navigating to page then scrolling');
        // Navigate to the page with the hash in the URL and store scroll target
        navigate(`${routePath}#${sectionId}`, { state: { scrollTo: sectionId } });
      }
    } else {
      console.log('Regular navigation to:', path);
      navigate(path);
    }
  };

  const scrollToSection = (sectionId) => {
    // Try multiple attempts with different delays
    const attemptScroll = (attempt = 1) => {
      const element = document.getElementById(sectionId);
      if (element) {
        console.log(`Found element with ID: ${sectionId} on attempt ${attempt}`);
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.log(`Element not found with ID: ${sectionId} on attempt ${attempt}`);
        if (attempt <= 5) {
          // Try again with increasing delays to handle dynamic content
          setTimeout(() => attemptScroll(attempt + 1), attempt * 200);
        }
      }
    };

    // Start first attempt after a small delay
    setTimeout(() => attemptScroll(), 300);
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