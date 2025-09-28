/**
 * SentraTech Dashboard Integration Config
 * Updated to use direct dashboard submission endpoints
 * 
 * Base URL: https://sentra-admin-dash.preview.emergentagent.com
 * Authentication: X-INGEST-KEY required for all form submissions
 * All forms submit directly to dashboard with proper authentication
 */

// Dashboard Integration Settings
export const DASHBOARD_CONFIG = {
  // API Base URL - confirmed correct endpoint
  API_BASE_URL: 'https://sentra-admin-dash.preview.emergentagent.com',
  
  // Dashboard ingest key for authentication
  INGEST_KEY: 'test-ingest-key-12345',
  
  // Form submission endpoints (actual dashboard endpoints with underscores)
  ENDPOINTS: {
    DEMO_REQUEST: '/api/ingest/demo_requests',
    CONTACT_SALES: '/api/ingest/contact_requests',
    ROI_CALCULATOR: '/api/ingest/roi_reports',
    NEWSLETTER_SIGNUP: '/api/ingest/subscriptions',
    JOB_APPLICATION: '/api/ingest/job_applications'
  }
};

// Data format templates for /api/ingest/* endpoints (actual dashboard schema)
export const DATA_FORMATS = {
  DEMO_REQUEST: {
    name: 'string (required)',           // NOT user_name
    email: 'string (required)', 
    company: 'string (required)',
    phone: 'string (optional)',
    message: 'string (optional)',
    call_volume: 'number (optional)',
    interaction_volume: 'number (optional)'
  },
  
  CONTACT_SALES: {
    full_name: 'string (required)',
    work_email: 'string (required)',
    company_name: 'string (required)',
    message: 'string (required)',
    phone: 'string (optional)',
    company_website: 'string (optional)',
    call_volume: 'number (optional)',
    interaction_volume: 'number (optional)',
    preferred_contact_method: 'string (optional)'
  },
  
  ROI_CALCULATOR: {
    country: 'string (required)',
    email: 'string (required)',
    monthly_volume: 'number (optional)',
    current_cost: 'number (optional)',
    company_name: 'string (optional)'
  },
  
  NEWSLETTER_SIGNUP: {
    email: 'string (required)',
    name: 'string (optional)'
  },
  
  JOB_APPLICATION: {
    full_name: 'string (required)',
    email: 'string (required)',
    position_applied: 'string (required)',
    phone: 'string (optional)',
    location: 'string (optional)',
    experience_level: 'string (optional)',
    portfolio_website: 'string (optional)',
    preferred_shifts: 'array (optional)',
    availability_date: 'string (optional)',
    motivation_text: 'string (optional)',
    resume_file: 'object (optional)',
    consent_for_storage: 'boolean (required)'
  }
};

/**
 * Enhanced form submission helper function with proper authentication and error handling
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
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-INGEST-KEY': DASHBOARD_CONFIG.INGEST_KEY
      },
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
      id: result.id || result.application_id,
      created_at: result.created_at,
      data: result
    });
    
    // /api/ingest/* endpoints return data directly, not wrapped in {success: true}
    // Success is indicated by HTTP 200 status and presence of ID
    if (result.id || result.application_id) {
      return { success: true, data: result };
    } else if (result.success) {
      // Handle job applications which still return {success: true} format
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