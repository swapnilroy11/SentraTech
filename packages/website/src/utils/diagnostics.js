// Comprehensive Diagnostic Tool for Dashboard Integration Issues
// This will capture everything about the submission process

export const runComprehensiveDiagnostics = async () => {
  console.log('🔬 STARTING COMPREHENSIVE DIAGNOSTIC SESSION');
  console.log('=' .repeat(80));
  
  const diagnosticData = {
    timestamp: new Date().toISOString(),
    environment: {},
    network: {},
    requests: [],
    errors: []
  };
  
  try {
    // 1. Environment Detection
    diagnosticData.environment = {
      userAgent: navigator.userAgent,
      currentURL: window.location.href,
      origin: window.location.origin,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      platform: navigator.platform,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    console.log('📊 Environment:', diagnosticData.environment);
    
    // 2. Network Configuration Check
    const { DASHBOARD_CONFIG } = await import('../config/dashboardConfig.js');
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
    
    diagnosticData.network = {
      backendURL: BACKEND_URL,
      newsletterEndpoint: DASHBOARD_CONFIG.ENDPOINTS.NEWSLETTER,
      fullURL: `${BACKEND_URL}${DASHBOARD_CONFIG.ENDPOINTS.NEWSLETTER}`,
      healthCheckURL: `${BACKEND_URL}${DASHBOARD_CONFIG.HEALTHCHECK_URL}`
    };
    
    console.log('🌐 Network Config:', diagnosticData.network);
    
    // 3. Test Actual Form Submission Process
    const testEmail = `diagnostic-${Date.now()}@example.com`;
    const testData = {
      email: testEmail,
      source: 'diagnostic_test',
      timestamp: new Date().toISOString()
    };
    
    console.log('🧪 Testing form submission with:', testData);
    
    // 4. Capture Network Request Details
    const { submitFormToDashboard } = await import('../config/dashboardConfig.js');
    
    // Override fetch temporarily to capture request details
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      
      const requestDetails = {
        url: url,
        method: options?.method || 'GET',
        headers: options?.headers || {},
        body: options?.body || null,
        timestamp: new Date().toISOString()
      };
      
      console.log('📡 CAPTURED REQUEST:', requestDetails);
      diagnosticData.requests.push(requestDetails);
      
      try {
        const response = await originalFetch(...args);
        
        const responseDetails = {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          url: response.url,
          timestamp: new Date().toISOString()
        };
        
        console.log('📥 CAPTURED RESPONSE:', responseDetails);
        requestDetails.response = responseDetails;
        
        // Clone response to read body without consuming it
        const responseClone = response.clone();
        try {
          const responseBody = await responseClone.text();
          requestDetails.responseBody = responseBody;
          console.log('📄 RESPONSE BODY:', responseBody);
        } catch (e) {
          console.log('⚠️ Could not read response body:', e.message);
        }
        
        return response;
      } catch (error) {
        console.error('❌ REQUEST FAILED:', error);
        requestDetails.error = error.message;
        diagnosticData.errors.push({
          type: 'fetch_error',
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    };
    
    // 5. Perform Actual Submission
    try {
      const result = await submitFormToDashboard(
        DASHBOARD_CONFIG.ENDPOINTS.NEWSLETTER,
        testData,
        { formType: 'diagnostic_test' }
      );
      
      console.log('✅ FORM SUBMISSION RESULT:', result);
      diagnosticData.submissionResult = result;
      
    } catch (error) {
      console.error('❌ FORM SUBMISSION FAILED:', error);
      diagnosticData.errors.push({
        type: 'submission_error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
    
    // Restore original fetch
    window.fetch = originalFetch;
    
    // 6. Generate Report
    console.log('📋 DIAGNOSTIC REPORT:');
    console.log('=' .repeat(80));
    console.log('🔍 TEST EMAIL FOR DASHBOARD VERIFICATION:', testEmail);
    console.log('📊 Total Requests Captured:', diagnosticData.requests.length);
    console.log('❌ Total Errors:', diagnosticData.errors.length);
    console.log('📄 Full Diagnostic Data:', JSON.stringify(diagnosticData, null, 2));
    console.log('=' .repeat(80));
    
    // 7. Create Dashboard Verification Instructions
    const verificationInstructions = {
      testEmail: testEmail,
      expectedID: diagnosticData.submissionResult?.data?.id,
      timestamp: diagnosticData.timestamp,
      instructions: [
        `Check dashboard for email: ${testEmail}`,
        `Expected ID: ${diagnosticData.submissionResult?.data?.id || 'N/A'}`,
        `Timestamp: ${diagnosticData.timestamp}`,
        'If this entry does NOT appear in dashboard, there is a backend/database issue',
        'If this entry DOES appear, the issue is with your specific browser/network'
      ]
    };
    
    console.log('🎯 DASHBOARD VERIFICATION:', verificationInstructions);
    
    return {
      diagnosticData,
      verificationInstructions,
      testEmail
    };
    
  } catch (error) {
    console.error('❌ DIAGNOSTIC SESSION FAILED:', error);
    diagnosticData.errors.push({
      type: 'diagnostic_error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return {
      diagnosticData,
      error: error.message
    };
  }
};

export default runComprehensiveDiagnostics;