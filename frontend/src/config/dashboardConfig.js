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
  
  // Form submission endpoints
  ENDPOINTS: {
    DEMO_REQUEST: '/api/forms/demo-request',
    CONTACT_SALES: '/api/forms/contact-sales',
    ROI_CALCULATOR: '/api/forms/roi-calculator',
    NEWSLETTER_SIGNUP: '/api/forms/newsletter-signup',
    JOB_APPLICATION: '/api/forms/job-application'
  }
};

// Data format templates for new endpoints
export const DATA_FORMATS = {
  DEMO_REQUEST: {
    name: 'string (required)',
    email: 'string (required)',
    company: 'string (required)',
    phone: 'string (optional)',
    message: 'string (optional)',
    monthly_volume: 'string (optional)',
    current_cost: 'string (optional)'
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
 * Form submission helper function
 */
export const submitFormToDashboard = async (endpoint, data) => {
  try {
    const response = await fetch(`${DASHBOARD_CONFIG.DASHBOARD_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      return { success: true, data: result };
    } else {
      throw new Error(result.detail || 'Form submission failed');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get full dashboard endpoint URL
 */
export const getDashboardEndpoint = (endpoint) => {
  return `${DASHBOARD_CONFIG.DASHBOARD_URL}${endpoint}`;
};