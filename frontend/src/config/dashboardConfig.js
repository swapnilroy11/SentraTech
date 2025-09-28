/**
 * SentraTech Form Submission Config
 * Configuration for local backend API endpoints
 * 
 * Base URL: Uses REACT_APP_BACKEND_URL from environment
 * Authentication: No authentication required for local backend
 * All forms submit to local backend API endpoints
 */

// Form Submission Settings
export const FORM_CONFIG = {
  // API Base URL - use environment variable
  API_BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001',
  
  // No authentication required for local backend
  INGEST_KEY: null,
  
  // Form submission endpoints (local backend API endpoints)
  ENDPOINTS: {
    DEMO_REQUEST: '/api/demo/request',
    CONTACT_SALES: '/api/contact/sales',
    ROI_CALCULATOR: '/api/roi/submit',
    NEWSLETTER_SIGNUP: '/api/newsletter/subscribe',
    JOB_APPLICATION: '/api/job/application'
  }
};

// Data format templates for local backend API endpoints
export const DATA_FORMATS = {
  DEMO_REQUEST: {
    name: 'string (required)',
    email: 'string (required)', 
    company: 'string (required)',
    phone: 'string (optional)',
    message: 'string (optional)',
    preferredDate: 'string (optional)'
  },
  
  CONTACT_SALES: {
    fullName: 'string (required)',
    workEmail: 'string (required)',
    companyName: 'string (required)',
    message: 'string (required)',
    phone: 'string (optional)',
    companyWebsite: 'string (optional)',
    monthlyVolume: 'number (optional)',
    preferredContactMethod: 'string (optional)'
  },
  
  ROI_CALCULATOR: {
    country: 'string (required)',
    monthlyVolume: 'number (required)',
    interactionVolume: 'number (required)',
    email: 'string (optional)'
  },
  
  NEWSLETTER_SIGNUP: {
    email: 'string (required)',
    name: 'string (optional)'
  },
  
  JOB_APPLICATION: {
    fullName: 'string (required)',
    email: 'string (required)',
    position: 'string (required)',
    phone: 'string (optional)',
    location: 'string (optional)',
    experience: 'string (optional)',
    portfolio: 'string (optional)',
    preferredShifts: 'array (optional)',
    availabilityDate: 'string (optional)',
    coverNote: 'string (optional)',
    consentForStorage: 'boolean (required)'
  }
};

/**
 * Form submission helper function for local backend
 */
export const submitFormToDashboard = async (endpoint, data) => {
  const fullUrl = `${DASHBOARD_CONFIG.API_BASE_URL}${endpoint}`;
  
  console.log('🔄 Starting form submission:', {
    endpoint,
    url: fullUrl,
    dataKeys: Object.keys(data),
    timestamp: new Date().toISOString()
  });
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Only add authentication header if INGEST_KEY is provided
    if (DASHBOARD_CONFIG.INGEST_KEY) {
      headers['X-INGEST-KEY'] = DASHBOARD_CONFIG.INGEST_KEY;
    }
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      credentials: 'omit', // No cookies required
      body: JSON.stringify(data)
    });
    
    // Log response details for debugging
    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // Handle response
    if (!response.ok) {
      // Log detailed error information
      const errorText = await response.text();
      console.error('❌ HTTP Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: fullUrl
      });
      
      // Try to parse error as JSON
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText || `HTTP ${response.status}: ${response.statusText}` };
      }
      
      throw new Error(errorData.detail || errorData.message || `Server error: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('✅ Form submission successful:', {
      id: result.id || result.reference_id || result.application_id,
      created_at: result.created_at || result.timestamp,
      data: result
    });
    
    // Local backend returns different response formats
    // Success is indicated by HTTP 200 status and presence of success flag or ID
    if (result.success || result.id || result.reference_id || result.application_id) {
      return { success: true, data: result };
    } else {
      throw new Error(result.detail || result.message || 'Form submission failed');
    }
    
  } catch (error) {
    // Enhanced error logging
    console.error('💥 Form submission error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      url: fullUrl,
      timestamp: new Date().toISOString()
    });
    
    // Provide user-friendly error messages
    let userMessage = error.message;
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      userMessage = 'Network error: Please check your internet connection and try again.';
    } else if (error.message.includes('CORS')) {
      userMessage = 'Connection error: Please try again or contact support.';
    }
    
    return { success: false, error: userMessage };
  }
};

/**
 * Get full dashboard endpoint URL
 */
export const getDashboardEndpoint = (endpoint) => {
  return `${DASHBOARD_CONFIG.API_BASE_URL}${endpoint}`;
};

/**
 * Clear any cached data and force refresh
 */
export const clearFormCache = () => {
  // Clear localStorage cache if any
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('form') || key.includes('dashboard') || key.includes('sentra')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage cache if any  
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    if (key.includes('form') || key.includes('dashboard') || key.includes('sentra')) {
      sessionStorage.removeItem(key);
    }
  });
  
  console.log('🧹 Form cache cleared');
};