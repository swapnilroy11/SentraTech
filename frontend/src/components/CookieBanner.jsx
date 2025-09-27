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
    
    // Debug: Log consent status (remove in production)
    console.log('Cookie consent status:', consentData ? 'Already given' : 'Not given');
    
    if (!consentData) {
      // Show modal immediately for first-time visitors
      setTimeout(() => {
        setShowBanner(true);
        console.log('Showing cookie consent modal in viewport');
      }, 800); // Reduced delay - show as soon as page elements are loaded
    } else {
      // Initialize analytics based on existing consent
      try {
        const consent = JSON.parse(consentData);
        initializeAnalyticsBasedOnConsent(consent);
        console.log('Initialized analytics with existing consent:', consent);
      } catch (error) {
        console.warn('Error parsing cookie consent data:', error);
        // If parsing fails, show banner again
        setTimeout(() => setShowBanner(true), 2000);
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

  const handleRejectAll = async () => {
    setIsLoading(true);
    
    // Save minimal consent (only essential cookies)
    const essentialOnly = { analytics: false, marketing: false };
    localStorage.setItem('cookieConsent', JSON.stringify(essentialOnly));
    
    // Initialize analytics with no consent
    initializeAnalyticsBasedOnConsent(essentialOnly);
    
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
      {/* Cookie Consent Modal - Centered in Viewport */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-500 ease-in-out ${
          showBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Cookie consent dialog"
        aria-describedby="cookie-description"
        style={{ 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          position: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Modal Backdrop */}
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        
        {/* Modal Content */}
        <div 
          className={`relative bg-[#161B22] border-2 border-[#00FF41]/20 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl transform transition-all duration-500 ${
            showBanner ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}
          style={{
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-[#00FF41]/10 border-2 border-[#00FF41]/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#00FF41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Cookie Preferences</h2>
            <p className="text-[rgb(161,161,170)] text-sm">
              We value your privacy and want to be transparent about our data usage.
            </p>
          </div>

          {/* Message */}
          <div className="mb-5">
            <p id="cookie-description" className="text-[rgb(218,218,218)] text-sm leading-relaxed text-center">
              We use cookies to enhance your experience, analyze site usage, and personalize content. 
              By continuing, you agree to our{' '}
              <a
                href="/privacy-policy"
                className="text-[#00FF41] hover:text-[#00DD38] underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="/terms-of-service"
                className="text-[#00FF41] hover:text-[#00DD38] underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAcceptAll}
              className="w-full px-6 py-2.5 bg-[#00FF41] text-black hover:bg-[#00DD38] font-semibold text-sm 
                       rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FF41] 
                       focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50 transform hover:scale-105"
              disabled={isLoading}
              aria-label="Accept all cookies"
            >
              {isLoading ? 'Processing...' : 'Accept All Cookies'}
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={handleRejectAll}
                className="flex-1 px-3 py-2.5 border-2 border-[rgb(63,63,63)] text-[rgb(218,218,218)] hover:text-white hover:border-[rgb(161,161,170)]
                         font-medium text-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 
                         focus:ring-[#00FF41] focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50"
                disabled={isLoading}
                aria-label="Reject optional cookies"
              >
                Reject All
              </button>
              
              <button
                onClick={handleManagePreferences}
                className="flex-1 px-3 py-2.5 border-2 border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/10 
                         font-medium text-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 
                         focus:ring-[#00FF41] focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50"
                disabled={isLoading}
                aria-label="Manage cookie preferences"
              >
                Customize
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-[rgb(161,161,170)] text-center mt-4">
            You can change your preferences anytime in our privacy settings.
          </p>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <>
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black bg-opacity-70 backdrop-blur-sm"
            aria-hidden="true"
            onClick={handleClosePreferences}
          />
          
          {/* Modal Container */}
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preferences-title"
            aria-describedby="preferences-description"
          >
            <div
              className="bg-[#161B22] border-2 border-[#00FF41]/20 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative z-[110] transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div></div> {/* Spacer */}
                  <div className="w-12 h-12 bg-[#00FF41]/10 border-2 border-[#00FF41]/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#00FF41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <button
                    onClick={handleClosePreferences}
                    className="text-[rgb(161,161,170)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00FF41] 
                             rounded-full p-2 transition-colors duration-200 hover:bg-[rgb(63,63,63)]"
                    aria-label="Close preferences modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <h2 id="preferences-title" className="text-2xl font-bold text-white mb-2">
                  Customize Your Experience
                </h2>
                <p id="preferences-description" className="text-[rgb(161,161,170)] text-sm">
                  Choose which cookies you're comfortable with. Essential cookies are required for the website to function properly.
                </p>
              </div>

            {/* Preference Options */}
            <div className="space-y-5 mb-8">
              {/* Essential Cookies - Always Enabled */}
              <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold flex items-center">
                      <svg className="w-4 h-4 text-[#00FF41] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Essential Cookies
                    </h3>
                    <p className="text-[rgb(161,161,170)] text-sm mt-1">Required for the website to function properly</p>
                  </div>
                  <div className="text-[#00FF41] text-sm font-semibold bg-[#00FF41]/10 px-3 py-1 rounded-full">Always Active</div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <h3 className="text-white font-semibold flex items-center">
                      <svg className="w-4 h-4 text-[rgb(161,161,170)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                      </svg>
                      Analytics Cookies
                    </h3>
                    <p className="text-[rgb(161,161,170)] text-sm mt-1">Help us improve our website performance and user experience</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={preferences.analytics}
                      onChange={() => handlePreferenceChange('analytics')}
                    />
                    <div 
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        preferences.analytics ? 'bg-[#00FF41]' : 'bg-[rgb(63,63,63)]'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <h3 className="text-white font-semibold flex items-center">
                      <svg className="w-4 h-4 text-[rgb(161,161,170)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Marketing Cookies
                    </h3>
                    <p className="text-[rgb(161,161,170)] text-sm mt-1">Used for personalized advertising and targeted content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={preferences.marketing}
                      onChange={() => handlePreferenceChange('marketing')}
                    />
                    <div 
                      className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                        preferences.marketing ? 'bg-[#00FF41]' : 'bg-[rgb(63,63,63)]'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSavePreferences}
                className="w-full px-6 py-3 bg-[#00FF41] text-black hover:bg-[#00DD38] font-semibold text-sm 
                         rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FF41] 
                         focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Saving Preferences...' : 'Save My Preferences'}
              </button>
              
              <button
                onClick={handleClosePreferences}
                className="w-full px-6 py-3 border-2 border-[rgb(63,63,63)] text-[rgb(218,218,218)] hover:text-white hover:border-[rgb(161,161,170)]
                         font-medium text-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 
                         focus:ring-[#00FF41] focus:ring-offset-2 focus:ring-offset-[#161B22]"
              >
                Cancel
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