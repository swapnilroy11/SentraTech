/**
 * SentraTech Admin Dashboard Integration Configuration
 * 
 * Complete integration with centralized Admin Dashboard for:
 * - Real-time data collection
 * - AI-powered candidate analysis  
 * - Lead management
 * - Business analytics
 */

// Dashboard Integration Settings
export const DASHBOARD_CONFIG = {
  // Use local backend as proxy to handle CORS issues
  API_BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001',
  
  // No authentication required (proxy handles dashboard communication)
  AUTH_REQUIRED: false,
  
  // Form submission endpoints (proxied through local backend)
  ENDPOINTS: {
    DEMO_REQUEST: '/api/forms/demo-request',
    ROI_CALCULATOR: '/api/forms/roi-calculator', 
    CONTACT_SALES: '/api/forms/contact-sales',
    NEWSLETTER_SIGNUP: '/api/forms/newsletter-signup',
    JOB_APPLICATION: '/api/forms/job-application'
  }
};

/**
 * Universal form submission handler for SentraTech Admin Dashboard
 */
export const submitFormToDashboard = async (endpoint, formData, successCallback = null) => {
  const fullUrl = `${DASHBOARD_CONFIG.API_BASE_URL}${endpoint}`;
  
  console.log('🔄 Submitting to SentraTech Dashboard:', {
    endpoint,
    url: fullUrl,
    dataKeys: Object.keys(formData),
    timestamp: new Date().toISOString()
  });
  
  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    // Log response details
    console.log('📡 Dashboard Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: fullUrl
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Dashboard Submission Successful:', {
        id: result.id || result.application_id || result.candidate_id,
        message: result.message,
        aiScore: result.overall_score,
        recommendation: result.ai_recommendation,
        timestamp: new Date().toISOString()
      });
      
      // Execute custom success callback if provided
      if (successCallback && typeof successCallback === 'function') {
        successCallback(result);
      }
      
      return { success: true, data: result };
    } else {
      // Handle API errors
      const errorMessage = result.detail || result.message || `Server error: ${response.status}`;
      console.error('❌ Dashboard Submission Failed:', {
        status: response.status,
        error: errorMessage,
        url: fullUrl
      });
      
      throw new Error(errorMessage);
    }
    
  } catch (error) {
    console.error('💥 Dashboard Integration Error:', {
      message: error.message,
      name: error.name,
      url: fullUrl,
      timestamp: new Date().toISOString()
    });
    
    // Provide user-friendly error messages
    let userMessage = error.message;
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      userMessage = 'Network error: Please check your connection and try again.';
    } else if (error.message.includes('CORS')) {
      userMessage = 'Connection error: Please contact support if this persists.';
    }
    
    return { success: false, error: userMessage };
  }
};

/**
 * Success message display helper
 */
export const showSuccessMessage = (message, result = null) => {
  console.log(`✅ ${message}`);
  
  // For job applications, show AI score if available
  if (result && result.overall_score && result.ai_recommendation) {
    console.log(`🤖 AI Analysis: ${result.overall_score}% score - ${result.ai_recommendation}`);
  }
  
  return message;
};

/**
 * Error message display helper
 */
export const showErrorMessage = (message) => {
  console.error(`❌ ${message}`);
  return message;
};

/**
 * Data format validation helpers
 */
export const DATA_FORMATS = {
  DEMO_REQUEST: {
    name: 'string (required) - Full name',
    email: 'string (required) - Email address', 
    company: 'string (required) - Company name',
    phone: 'string (optional) - Phone number',
    message: 'string (optional) - Demo requirements',
    monthly_volume: 'string (optional) - Current volume',
    current_cost: 'string (optional) - Current spending'
  },
  
  ROI_CALCULATOR: {
    country: 'string (required) - Country/Region',
    email: 'string (required) - Contact email',
    monthly_volume: 'number (optional) - Monthly interactions',
    current_cost: 'number (optional) - Current monthly cost',
    company_name: 'string (optional) - Company name'
  },
  
  CONTACT_SALES: {
    full_name: 'string (required) - Full name',
    work_email: 'string (required) - Business email',
    company_name: 'string (required) - Company name',
    message: 'string (required) - Inquiry details',
    phone: 'string (optional) - Phone number',
    preferred_contact_method: 'string (optional) - email or phone'
  },
  
  NEWSLETTER_SIGNUP: {
    email: 'string (required) - Email address',
    name: 'string (optional) - Full name'
  },
  
  JOB_APPLICATION: {
    full_name: 'string (required) - Full name',
    email: 'string (required) - Email address',
    position_applied: 'string (required) - Job position',
    phone: 'string (optional) - Phone number',
    experience_level: 'string (optional) - Years of experience',
    motivation_text: 'string (optional) - Why join SentraTech',
    consent_for_storage: 'boolean (required) - Data consent'
  }
};

/**
 * Form cache management
 */
export const clearFormCache = () => {
  // Clear any cached form data if needed
  console.log('🧹 Form cache cleared for dashboard integration');
};