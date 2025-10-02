// Google Analytics 4 Event Tracking Utilities

/**
 * Check if analytics consent has been granted
 * @returns {boolean} True if analytics consent is granted
 */
const hasAnalyticsConsent = () => {
  try {
    const consentData = localStorage.getItem('cookieConsent');
    if (!consentData) {
      return false; // No consent given yet
    }

    if (consentData === 'all') {
      return true; // All cookies accepted
    }

    const consent = JSON.parse(consentData);
    return consent?.analytics === true;
  } catch (error) {
    console.warn('Error checking analytics consent:', error);
    return false; // Default to no consent on error
  }
};

/**
 * Track a custom GA4 event (only if consent is granted)
 * @param {string} eventName - The name of the event
 * @param {Object} eventParameters - Event parameters (optional)
 */
export const trackEvent = (eventName, eventParameters = {}) => {
  // Check consent before tracking
  if (!hasAnalyticsConsent()) {
    console.log(`GA4 event "${eventName}" not tracked - no analytics consent`);
    return;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      send_to: 'G-75HTVL1QME',
      ...eventParameters,
      // Add timestamp for better tracking
      timestamp: new Date().toISOString(),
    });
    
    // Optional: Log for debugging (remove in production)
    console.log('GA4 Event tracked (with consent):', eventName, eventParameters);
  } else {
    console.warn('Google Analytics gtag not available for event:', eventName);
  }
};

/**
 * Track demo request conversion
 * @param {Object} requestData - Demo request form data
 * @param {string} referenceId - Reference ID from successful submission
 */
export const trackDemoBooking = (requestData, referenceId) => {
  trackEvent('demo_request_submitted', {
    // Standard GA4 conversion parameters
    event_category: 'conversion',
    event_label: 'demo_booking',
    value: 1, // You can assign a monetary value to the conversion
    currency: 'USD',
    
    // Custom parameters for better analysis
    company_name: requestData.company,
    reference_id: referenceId,
    has_phone: requestData.phone ? 'yes' : 'no',
    has_call_volume: requestData.call_volume ? 'yes' : 'no',
    has_message: requestData.message ? 'yes' : 'no',
    form_completion_rate: calculateFormCompletionRate(requestData),
    
    // Useful for funnel analysis
    page_path: window.location.pathname,
    page_title: document.title,
  });
};

/**
 * Track form field interactions for better UX analysis
 * @param {string} fieldName - Name of the form field
 * @param {string} action - Action performed (focus, blur, error, etc.)
 */
export const trackFormInteraction = (fieldName, action) => {
  trackEvent('form_interaction', {
    event_category: 'engagement',
    field_name: fieldName,
    interaction_type: action,
    page_path: window.location.pathname,
  });
};

/**
 * Track form validation errors
 * @param {Object} errors - Validation errors object
 */
export const trackFormErrors = (errors) => {
  const errorFields = Object.keys(errors).filter(field => errors[field]);
  
  if (errorFields.length > 0) {
    trackEvent('form_validation_error', {
      event_category: 'form_error',
      error_fields: errorFields.join(','),
      error_count: errorFields.length,
      page_path: window.location.pathname,
    });
  }
};

/**
 * Calculate form completion rate based on filled fields
 * @param {Object} formData - Form data object
 * @returns {number} Completion rate as percentage
 */
const calculateFormCompletionRate = (formData) => {
  const totalFields = ['name', 'email', 'company', 'phone', 'call_volume', 'message'];
  const filledFields = totalFields.filter(field => 
    formData[field] && formData[field].trim().length > 0
  );
  
  return Math.round((filledFields.length / totalFields.length) * 100);
};

/**
 * Track page engagement metrics
 * @param {string} section - Section name (hero, features, pricing, etc.)
 * @param {string} action - Action performed (scroll, click, hover, etc.)
 * @param {string} element - Element identifier (optional)
 */
export const trackEngagement = (section, action, element = '') => {
  trackEvent('page_engagement', {
    event_category: 'engagement',
    section_name: section,
    engagement_action: action,
    element_id: element,
    page_path: window.location.pathname,
  });
};

/**
 * Track button clicks for CTA analysis
 * @param {string} buttonText - Text on the button
 * @param {string} buttonLocation - Where the button is located
 * @param {string} destination - Where the button leads (optional)
 */
export const trackButtonClick = (buttonText, buttonLocation, destination = '') => {
  trackEvent('button_click', {
    event_category: 'interaction',
    button_text: buttonText,
    button_location: buttonLocation,
    button_destination: destination,
    page_path: window.location.pathname,
  });
};

export default {
  trackEvent,
  trackDemoBooking,
  trackFormInteraction,
  trackFormErrors,
  trackEngagement,
  trackButtonClick,
};