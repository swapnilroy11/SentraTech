import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageViews = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if user has given analytics consent before tracking
    const checkConsentAndTrack = () => {
      try {
        const consentData = localStorage.getItem('cookieConsent');
        if (!consentData) {
          console.log('No cookie consent found - skipping analytics');
          return;
        }

        let hasAnalyticsConsent = false;
        if (consentData === 'all') {
          hasAnalyticsConsent = true;
        } else {
          const consent = JSON.parse(consentData);
          hasAnalyticsConsent = consent?.analytics === true;
        }

        if (!hasAnalyticsConsent) {
          console.log('Analytics consent not granted - skipping pageview tracking');
          return;
        }

        // Only track if gtag is available and consent is granted
        if (typeof window.gtag === 'function') {
          // Send manual page_view event for Single Page Application (SPA)
          window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: location.pathname + location.search + location.hash,
            send_to: 'G-75HTVL1QME'
          });
          
          // Optional: Log for debugging (remove in production)
          console.log('GA4 Pageview tracked (with consent):', {
            page_title: document.title,
            page_path: location.pathname + location.search + location.hash,
            page_location: window.location.href
          });
        } else {
          console.warn('Google Analytics gtag not available');
        }
      } catch (error) {
        console.warn('Error checking cookie consent for analytics:', error);
      }
    };

    checkConsentAndTrack();
  }, [location]);
};

export default usePageViews;