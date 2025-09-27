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
      {/* Cookie Consent Modal - Centered */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-500 ease-in-out ${
          showBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Cookie consent dialog"
        aria-describedby="cookie-description"
      >
        {/* Modal Backdrop */}
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        
        {/* Modal Content */}
        <div className={`relative bg-[#161B22] border-2 border-[#00FF41]/20 rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-500 ${
          showBanner ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#00FF41]/10 border-2 border-[#00FF41]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#00FF41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Cookie Preferences</h2>
            <p className="text-[rgb(161,161,170)] text-sm">
              We value your privacy and want to be transparent about our data usage.
            </p>
          </div>

          {/* Message */}
          <div className="mb-6">
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
              className="w-full px-6 py-3 bg-[#00FF41] text-black hover:bg-[#00DD38] font-semibold text-sm 
                       rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FF41] 
                       focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50 transform hover:scale-105"
              disabled={isLoading}
              aria-label="Accept all cookies"
            >
              {isLoading ? 'Processing...' : 'Accept All Cookies'}
            </button>
            
            <button
              onClick={handleManagePreferences}
              className="w-full px-6 py-3 border-2 border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/10 
                       font-medium text-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 
                       focus:ring-[#00FF41] focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50"
              disabled={isLoading}
              aria-label="Manage cookie preferences"
            >
              Manage Preferences
            </button>
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
                <label className="relative inline-flex items-center cursor-pointer z-10">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={preferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                  />
                  <div 
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative z-20 ${
                      preferences.analytics ? 'bg-[#00FF41]' : 'bg-gray-600'
                    }`}
                    onClick={() => handlePreferenceChange('analytics')}
                  >
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
                <label className="relative inline-flex items-center cursor-pointer z-10">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={preferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                  />
                  <div 
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative z-20 ${
                      preferences.marketing ? 'bg-[#00FF41]' : 'bg-gray-600'
                    }`}
                    onClick={() => handlePreferenceChange('marketing')}
                  >
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