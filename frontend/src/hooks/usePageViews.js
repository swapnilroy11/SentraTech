import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageViews = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if gtag is available (loaded from Google Analytics script)
    if (typeof window.gtag === 'function') {
      // Send pageview event for Single Page Application (SPA)
      window.gtag('config', 'G-75HTVL1QME', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search + location.hash,
      });
      
      // Optional: Log for debugging (remove in production)
      console.log('GA4 Pageview tracked:', {
        page_title: document.title,
        page_path: location.pathname + location.search + location.hash,
        page_location: window.location.href
      });
    } else {
      console.warn('Google Analytics gtag not available');
    }
  }, [location]);
};

export default usePageViews;