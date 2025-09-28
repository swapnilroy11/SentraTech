/**
 * 🔒 PROTECTED DASHBOARD INTEGRATION CONFIG 🔒
 * 
 * ⚠️ ⚠️ ⚠️ CRITICAL WARNING - DO NOT MODIFY ⚠️ ⚠️ ⚠️
 * 
 * This configuration is essential for dashboard data synchronization.
 * Any changes to these values will break form submissions and data flow
 * to the admin dashboard (dashboard-central-5).
 * 
 * MODIFICATION REQUIRES:
 * - Senior developer approval
 * - Full testing on staging environment
 * - Verification that dashboard-central-5 receives data
 * 
 * Last verified working: 2025-09-28
 * Configuration owner: System Administrator
 */

// 🔒 PROTECTED - Dashboard Integration Settings
export const DASHBOARD_CONFIG = {
  // Backend URL - UPDATED to customer-flow-5 to fix CORS issues
  BACKEND_URL: 'https://customer-flow-5.preview.emergentagent.com',
  
  // Authentication key for customer-flow-5 backend
  INGEST_KEY: 'a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6',
  
  // Target dashboard URL (used by backend for forwarding)
  DASHBOARD_URL: 'dashboard-central-5.preview.emergentagent.com',
  
  // Endpoints
  ENDPOINTS: {
    DEMO_REQUESTS: '/api/ingest/demo_requests',
    CONTACT_REQUESTS: '/api/ingest/contact_requests', 
    ROI_REPORTS: '/api/ingest/roi_reports',
    SUBSCRIPTIONS: '/api/ingest/subscriptions'
  }
};

// 🔒 PROTECTED - Data Format Templates
export const DATA_FORMATS = {
  DEMO_REQUEST: {
    user_name: 'string',      // NOT company_name - backend expects user_name
    email: 'string',          // NOT contact_email - backend expects email
    company: 'string',        // NOT company_name - backend expects company
    phone: 'string',
    call_volume: 'number',
    interaction_volume: 'number', 
    message: 'string'
  },
  
  CONTACT_REQUEST: {
    full_name: 'string',
    work_email: 'string',
    company_name: 'string',
    company_website: 'string|null',
    phone: 'string|null',
    call_volume: 'number',
    interaction_volume: 'number',
    preferred_contact_method: 'string',
    message: 'string',
    status: 'string'
  },
  
  ROI_REPORT: {
    company_size: 'string',
    call_volume: 'number',
    interaction_volume: 'number',
    current_cost: 'number',
    sentra_cost: 'number',
    cost_reduction: 'number',
    contact_email: 'string'
  },
  
  SUBSCRIPTION: {
    email: 'string'
  }
};

/**
 * 🛡️ Configuration Validation Function
 * Call this to verify critical settings are correct
 */
export const validateConfig = () => {
  const errors = [];
  
  // Check backend URL
  if (!DASHBOARD_CONFIG.BACKEND_URL.includes('customer-flow-5')) {
    errors.push('❌ BACKEND_URL must point to customer-flow-5 to avoid CORS issues');
  }
  
  // Check ingest key format
  if (!DASHBOARD_CONFIG.INGEST_KEY || DASHBOARD_CONFIG.INGEST_KEY.length < 32) {
    errors.push('❌ INGEST_KEY appears invalid or missing');
  }
  
  // Check dashboard target
  if (!DASHBOARD_CONFIG.DASHBOARD_URL.includes('dashboard-central-5')) {
    errors.push('❌ DASHBOARD_URL should reference dashboard-central-5');
  }
  
  if (errors.length > 0) {
    console.error('🚨 DASHBOARD CONFIG VALIDATION FAILED:');
    errors.forEach(error => console.error(error));
    return false;
  }
  
  console.log('✅ Dashboard configuration validation passed');
  return true;
};

// 🔒 PROTECTED - Auto-validation on import
if (typeof window !== 'undefined') {
  validateConfig();
}

/**
 * 🔒 PROTECTED USAGE INSTRUCTIONS:
 * 
 * Import this config instead of hardcoding values:
 * 
 * ❌ Wrong:
 * const url = 'https://tech-careers-3.preview.emergentagent.com';
 * const key = 'a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6';
 * 
 * ✅ Correct:
 * import { DASHBOARD_CONFIG } from '../config/dashboardConfig.js';
 * const url = DASHBOARD_CONFIG.BACKEND_URL;
 * const key = DASHBOARD_CONFIG.INGEST_KEY;
 */