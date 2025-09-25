import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false
  });

  // Check if consent has already been given
  useEffect(() => {
    const consentData = localStorage.getItem('cookieConsent');
    if (!consentData) {
      // Show banner with smooth slide-up animation after a brief delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Initialize analytics based on existing consent
      try {
        const consent = JSON.parse(consentData);
        initializeAnalyticsBasedOnConsent(consent);
      } catch (error) {
        console.warn('Error parsing cookie consent data:', error);
      }
    }
  }, []);

  // Initialize Google Analytics based on consent
  const initializeAnalyticsBasedOnConsent = (consent) => {
    if (typeof window.updateGoogleAnalyticsConsent === 'function') {
      const hasAnalyticsConsent = consent === 'all' || (typeof consent === 'object' && consent.analytics);
      window.updateGoogleAnalyticsConsent(hasAnalyticsConsent);
    } else {
      console.warn('Google Analytics consent function not available');
    }
  };

  const handleAcceptAll = async () => {
    setIsLoading(true);
    
    // Save consent to localStorage
    localStorage.setItem('cookieConsent', 'all');
    
    // Initialize analytics
    initializeAnalyticsBasedOnConsent('all');
    
    // Hide banner with animation
    setTimeout(() => {
      setShowBanner(false);
      setIsLoading(false);
    }, 500);
  };

  const handleManagePreferences = () => {
    setShowPreferences(true);
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    
    // Save detailed preferences to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    
    // Initialize analytics based on preferences
    initializeAnalyticsBasedOnConsent(preferences);
    
    // Hide banner and preferences modal
    setTimeout(() => {
      setShowPreferences(false);
      setShowBanner(false);
      setIsLoading(false);
    }, 500);
  };

  const handlePreferenceChange = (type) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showPreferences) {
        handleClosePreferences();
      }
    };

    if (showPreferences) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPreferences]);

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
          showBanner ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-label="Cookie consent banner"
        aria-describedby="cookie-description"
      >
        {/* Banner Content */}
        <div className="w-full max-w-4xl mx-auto px-4 py-6 bg-[#161B22] border-t border-[rgb(63,63,63)] shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Message and Links */}
            <div className="flex-1">
              <p id="cookie-description" className="text-gray-300 text-sm mb-2">
                We use cookies to enhance your experience. By continuing, you agree to our{' '}
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-[#00FF41] underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-[#00FF41] underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
              <button
                onClick={handleManagePreferences}
                className="px-4 py-2 border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black 
                         font-medium text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 
                         focus:ring-[#00FF41] focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50"
                disabled={isLoading}
                aria-label="Manage cookie preferences"
              >
                Manage Preferences
              </button>
              
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 bg-[#00FF41] text-black hover:bg-[#00DD38] font-medium text-sm 
                         rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FF41] 
                         focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50"
                disabled={isLoading}
                aria-label="Accept all cookies"
              >
                {isLoading ? 'Processing...' : 'Accept All'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <>
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 z-60 bg-black bg-opacity-50"
            aria-hidden="true"
            onClick={handleClosePreferences}
          />
          
          {/* Modal Container */}
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preferences-title"
            aria-describedby="preferences-description"
          >
            <div
              className="bg-[#161B22] border border-[rgb(63,63,63)] rounded-lg p-6 w-full max-w-md shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 id="preferences-title" className="text-xl font-semibold text-white">
                  Cookie Preferences
                </h2>
                <button
                  onClick={handleClosePreferences}
                  className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00FF41] 
                           rounded-md p-1 transition-colors duration-200"
                  aria-label="Close preferences modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p id="preferences-description" className="text-gray-400 text-sm mb-6">
                Manage your cookie preferences below. Essential cookies are required for the website to function properly.
              </p>

            {/* Preference Options */}
            <div className="space-y-4 mb-6">
              {/* Essential Cookies - Always Enabled */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Essential Cookies</h3>
                  <p className="text-gray-400 text-sm">Required for the website to function properly</p>
                </div>
                <div className="text-[#00FF41] text-sm font-medium">Always Active</div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Analytics Cookies</h3>
                  <p className="text-gray-400 text-sm">Help us improve our website performance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={preferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    preferences.analytics ? 'bg-[#00FF41]' : 'bg-gray-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                    } mt-0.5 ml-0.5`}></div>
                  </div>
                </label>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Marketing Cookies</h3>
                  <p className="text-gray-400 text-sm">Used for personalized advertising and marketing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={preferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                    preferences.marketing ? 'bg-[#00FF41]' : 'bg-gray-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      preferences.marketing ? 'translate-x-5' : 'translate-x-0'
                    } mt-0.5 ml-0.5`}></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClosePreferences}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500
                         font-medium text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 
                         focus:ring-[#00FF41] focus:ring-offset-2 focus:ring-offset-[#161B22]"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2 bg-[#00FF41] text-black hover:bg-[#00DD38] font-medium text-sm 
                         rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FF41] 
                         focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CookieBanner;