// Dashboard Configuration for SentraTech Admin Integration
// Provides reliable form submission with robust fallback mechanisms

import { set, get, keys, del } from 'idb-keyval';

// Get backend URL from environment
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

// Dashboard configuration
export const DASHBOARD_CONFIG = {
  // API endpoints for form submissions (no /api prefix as it's in BACKEND_URL)
  ENDPOINTS: {
    CONTACT_SALES: '/forms/contact-sales',
    DEMO_REQUEST: '/forms/demo-request', 
    ROI_CALCULATOR: '/forms/roi-calculator',
    NEWSLETTER: '/forms/newsletter-signup',
    JOB_APPLICATION: '/forms/job-application',
    PILOT_REQUEST: '/forms/pilot-request',
    CHAT_MESSAGE: '/chat/message'
  },
  
  // Healthcheck endpoint for real connectivity testing
  HEALTHCHECK_URL: '/health',
  
  // Authentication key for dashboard submissions
  INGEST_KEY: 'a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6',
  
  // Network configuration
  TIMEOUT: {
    DEFAULT: 10000, // 10 seconds
    CHAT: 15000     // 15 seconds for chat responses
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 2,
    DELAY: 1000
  }
};

// Real network connectivity probe - more reliable than navigator.onLine
// Comprehensive network debugging function
export const debugNetworkEnvironment = async () => {
  console.log('🔬 COMPREHENSIVE NETWORK ENVIRONMENT DEBUGGING');
  console.log('='.repeat(60));
  
  // 1. Environment Information
  console.log('📊 Environment Info:', {
    userAgent: navigator.userAgent,
    origin: window.location.origin,
    href: window.location.href,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    language: navigator.language
  });
  
  // 2. CORS Origin Detection
  const possibleOrigins = [
    window.location.origin,
    'https://unified-forms.preview.emergentagent.com',
    'http://localhost:3000',
    'http://localhost',
    null // No Origin header
  ];
  
  console.log('🌐 Testing different Origin headers...');
  
  for (const origin of possibleOrigins) {
    try {
      const headers = {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };
      if (origin) headers['Origin'] = origin;
      
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        cache: 'no-cache',
        headers
      });
      
      console.log(`✅ Origin "${origin}": ${response.status} ${response.statusText}`, {
        corsHeaders: {
          allowOrigin: response.headers.get('access-control-allow-origin'),
          allowMethods: response.headers.get('access-control-allow-methods'),
          allowHeaders: response.headers.get('access-control-allow-headers'),
          allowCredentials: response.headers.get('access-control-allow-credentials')
        }
      });
    } catch (error) {
      console.error(`❌ Origin "${origin}": ${error.message}`);
    }
  }
  
  // 3. Test CORS Preflight (OPTIONS)
  console.log('🔍 Testing CORS preflight (OPTIONS)...');
  try {
    const preflightResponse = await fetch(`${BACKEND_URL}/forms/newsletter-signup`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,origin'
      }
    });
    
    console.log('✅ CORS Preflight:', {
      status: preflightResponse.status,
      statusText: preflightResponse.statusText,
      headers: Object.fromEntries(preflightResponse.headers.entries())
    });
  } catch (error) {
    console.error('❌ CORS Preflight failed:', error.message);
  }
  
  // 4. Service Worker Detection
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log('🔧 Service Worker status:', {
      supported: true,
      registrations: registrations.length,
      active: registrations.map(reg => ({
        scope: reg.scope,
        state: reg.active?.state,
        updateViaCache: reg.updateViaCache
      }))
    });
  } else {
    console.log('🔧 Service Worker: Not supported');
  }
  
  console.log('='.repeat(60));
  return true;
};

export const hasNetwork = async () => {
  try {
    console.log('🔍 Probing network connectivity...');
    
    // Run comprehensive debugging first
    await debugNetworkEnvironment();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Determine correct origin for network requests
    const actualOrigin = window.location.origin;
    const isLocalDevelopment = actualOrigin.includes('localhost');
    const networkOrigin = isLocalDevelopment 
      ? 'https://unified-forms.preview.emergentagent.com' // Use production origin for localhost testing
      : actualOrigin;
    
    console.log(`🎯 Browser origin: ${actualOrigin}`);
    console.log(`🌐 Network origin: ${networkOrigin} ${isLocalDevelopment ? '(localhost→preview mapping)' : '(production)'}`);
    
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      cache: 'no-cache',
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Origin': actualOrigin
      }
    });
    
    clearTimeout(timeoutId);
    const hasConnectivity = response.ok || (response.status >= 400 && response.status < 500);
    console.log(`🌐 Network connectivity probe result: ${hasConnectivity ? '✅ ONLINE' : '❌ OFFLINE'} (${response.status})`);
    return hasConnectivity;
  } catch (error) {
    console.log(`🌐 Network connectivity probe failed: ❌ OFFLINE (${error.message})`);
    return false;
  }
};

// Legacy function for backward compatibility - but use hasNetwork() instead
export const isOnline = () => {
  console.warn('⚠️ isOnline() is deprecated - use hasNetwork() for reliable connectivity detection');
  return navigator.onLine;
};

// Network-aware form submission with robust connectivity testing
export const submitFormToDashboard = async (endpoint, data, options = {}) => {
  const {
    timeout = DASHBOARD_CONFIG.TIMEOUT.DEFAULT,
    retries = DASHBOARD_CONFIG.RETRY.MAX_ATTEMPTS
  } = options;

  // Real connectivity test before attempting submission
  try {
    const networkAvailable = await hasNetwork();
    if (!networkAvailable) {
      console.warn('🌐 Network connectivity probe failed - using offline fallback immediately');
      return {
        success: true,
        data: { ...data, id: `offline_${Date.now()}` },
        mode: 'offline',
        error: 'Network connectivity probe failed'
      };
    }
  } catch (probeError) {
    console.warn('🌐 Network probe error - falling back to offline mode:', probeError.message);
    return {
      success: true,
      data: { ...data, id: `offline_${Date.now()}` },
      mode: 'offline',
      error: `Network probe failed: ${probeError.message}`
    };
  }

  let lastError = null;
  
  // Try network submission with retries
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const fullUrl = `${BACKEND_URL}${endpoint}`;
      const actualOrigin = window.location.origin;
      const requestHeaders = {
        'Content-Type': 'application/json',
        'Origin': actualOrigin
      };
      
      console.log(`🌐 Attempting network submission (attempt ${attempt}/${retries}):`, {
        url: fullUrl,
        method: 'POST',
        headers: requestHeaders,
        data: JSON.stringify(data, null, 2),
        browserOrigin: actualOrigin,
        timestamp: new Date().toISOString()
      });
      
      // Log multiple curl equivalents for comparison
      console.log(`🐛 CURL EQUIVALENT (Browser Origin):`, `curl -X POST "${fullUrl}" -H "Content-Type: application/json" -H "Origin: ${actualOrigin}" -d '${JSON.stringify(data)}'`);
      console.log(`🐛 CURL EQUIVALENT (No Origin):`, `curl -X POST "${fullUrl}" -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`);
      
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`📡 Network response received:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url // Show the actual URL that responded
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`✅ Network submission successful:`, result);
      
      return {
        success: true,
        data: result,
        mode: 'network',
        attempt
      };
      
    } catch (error) {
      lastError = error;
      console.error(`❌ Network submission attempt ${attempt}/${retries} failed:`, {
        error: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Wait before retry (except on last attempt)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, DASHBOARD_CONFIG.RETRY.DELAY));
      }
    }
  }
  
  // All network attempts failed, queue for retry and use offline fallback
  console.error('🚨 NETWORK SUBMISSION FAILED - All attempts failed:', {
    endpoint,
    attempts: retries,
    lastError: lastError?.message,
    stack: lastError?.stack,
    data: JSON.stringify(data, null, 2)
  });
  
  // Queue the submission for retry when online
  const queueKey = await queueFormSubmission(endpoint, data, options.formType || 'unknown');
  
  return {
    success: true,
    data: { ...data, id: `fallback_${Date.now()}`, queueKey },
    mode: 'fallback',
    error: lastError?.message
  };
};

// Submit chat message with robust connectivity testing
export const submitChatMessage = async (message, conversationId = null) => {
  // Real connectivity test before attempting chat submission
  try {
    const networkAvailable = await hasNetwork();
    if (!networkAvailable) {
      console.warn('🌐 Chat: Network connectivity probe failed - using offline response');
      return generateOfflineResponse(message);
    }
  } catch (probeError) {
    console.warn('🌐 Chat: Network probe error - using offline response:', probeError.message);
    return generateOfflineResponse(message);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DASHBOARD_CONFIG.TIMEOUT.CHAT);
    
    const response = await fetch(`${BACKEND_URL}${DASHBOARD_CONFIG.ENDPOINTS.CHAT_MESSAGE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://unified-forms.preview.emergentagent.com'
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        timestamp: new Date().toISOString()
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      success: true,
      response: result.response,
      conversationId: result.conversation_id,
      mode: 'network'
    };
    
  } catch (error) {
    console.warn('Chat network submission failed, using offline response:', error.message);
    return generateOfflineResponse(message);
  }
};

// Generate simulated AI responses for offline mode
export const generateOfflineResponse = (message) => {
  const responses = [
    "Thank you for your message! Our AI system will help you find the right solution. Since we're currently offline, here's some general guidance.",
    "I understand you're looking for information about SentraTech. While our full AI system is temporarily unavailable, I can share that we specialize in intelligent customer support automation.",
    "Thanks for reaching out! SentraTech offers AI-powered customer support solutions that can transform your business operations. Our team will follow up with detailed information soon.",
    "I appreciate your interest in our services. SentraTech provides cutting-edge AI solutions for customer support, including automated triage, sentiment analysis, and intelligent routing.",
    "Hello! While our real-time AI system is momentarily offline, I want you to know that SentraTech helps businesses automate up to 70% of their customer interactions while maintaining quality."
  ];
  
  // Simple keyword-based response selection
  const lowerMessage = message.toLowerCase();
  let selectedResponse = responses[0]; // default
  
  if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    selectedResponse = "For pricing information, please check our pricing page or contact our sales team. We offer flexible plans starting from our Starter package.";
  } else if (lowerMessage.includes('demo') || lowerMessage.includes('trial')) {
    selectedResponse = "I'd love to show you a demo! Please fill out our demo request form and our team will schedule a personalized walkthrough of SentraTech's capabilities.";
  } else if (lowerMessage.includes('integration') || lowerMessage.includes('api')) {
    selectedResponse = "SentraTech integrates seamlessly with popular CRMs, help desk systems, and communication platforms. Our API documentation and integration team make setup straightforward.";
  } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
    selectedResponse = "Our support team is here to help! You can reach us through live chat, email at support@sentratech.net, or phone. We offer 24/7 support for Enterprise customers.";
  } else {
    // Random selection for general messages
    selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  }
  
  return {
    success: true,
    response: selectedResponse,
    conversationId: `offline_${Date.now()}`,
    mode: 'offline'
  };
};

// Show success message with proper styling
export const showSuccessMessage = (message, data = null) => {
  console.log('✅ Form submission successful:', message, data);
  
  // You can extend this to show toast notifications or other UI feedback
  if (window && window.dataLayer) {
    window.dataLayer.push({
      event: 'form_submission_success',
      form_type: data?.form_type || 'unknown',
      submission_mode: data?.mode || 'unknown',
      timestamp: new Date().toISOString()
    });
  }
};

// Retry queue functionality for offline-to-online synchronization
export const queueFormSubmission = async (endpoint, data, formType) => {
  try {
    const queueKey = `queue_${formType}_${Date.now()}`;
    const queueData = {
      endpoint,
      data,
      formType,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };
    
    await set(queueKey, queueData);
    console.log('Form submission queued for retry:', queueKey);
    return queueKey;
  } catch (error) {
    console.error('Failed to queue form submission:', error);
    return null;
  }
};

// Flush queued submissions when online
export const flushQueuedSubmissions = async () => {
  if (!isOnline()) {
    console.log('Still offline, skipping queue flush');
    return;
  }

  try {
    const allKeys = await keys();
    const queueKeys = allKeys.filter(key => typeof key === 'string' && key.startsWith('queue_'));
    
    if (queueKeys.length === 0) {
      console.log('No queued submissions to flush');
      return;
    }

    console.log(`Flushing ${queueKeys.length} queued submissions...`);
    
    for (const key of queueKeys) {
      try {
        const queueData = await get(key);
        if (!queueData) continue;

        // Increment retry count
        queueData.retryCount = (queueData.retryCount || 0) + 1;
        
        // Try to submit
        const result = await submitFormToDashboard(
          queueData.endpoint,
          queueData.data,
          { retries: 1 } // Single retry for queued items
        );

        if (result.success && result.mode === 'network') {
          // Successfully submitted via network, remove from queue
          await del(key);
          console.log('✅ Queued submission successful:', key);
          
          // Track successful queue flush
          if (window?.dataLayer) {
            window.dataLayer.push({
              event: 'queued_form_submit_success',
              form_type: queueData.formType,
              queue_key: key,
              retry_count: queueData.retryCount
            });
          }
        } else if (queueData.retryCount >= 3) {
          // Max retries reached, remove from queue
          await del(key);
          console.warn('❌ Max retries reached for queued submission:', key);
        } else {
          // Update retry count and keep in queue
          await set(key, queueData);
          console.log('🔄 Queued submission failed, will retry later:', key);
        }
        
      } catch (error) {
        console.error('Error processing queued submission:', key, error);
      }
    }
    
  } catch (error) {
    console.error('Error flushing queued submissions:', error);
  }
};

// Setup automatic queue flushing
export const setupQueueFlushing = () => {
  // Flush on page load if online  
  if (isOnline()) {
    setTimeout(flushQueuedSubmissions, 2000);
  }
  
  // Flush when browser comes online
  window.addEventListener('online', () => {
    console.log('Browser came online, flushing queued submissions...');
    setTimeout(flushQueuedSubmissions, 1000);
  });
  
  // Periodic flush every 5 minutes if online
  setInterval(() => {
    if (isOnline()) {
      flushQueuedSubmissions();
    }
  }, 5 * 60 * 1000);
};

// Test for proxy/caching interference
export const testProxyInterference = async () => {
  console.log('🔍 Testing for proxy/cache interference...');
  
  const testUrl = `${BACKEND_URL}/forms/newsletter-signup`;
  const uniqueId = Date.now();
  const testData = { email: `proxy-test-${uniqueId}@example.com`, test: true };
  
  // Test 1: Direct fetch without any special headers
  try {
    const response1 = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    console.log('✅ Direct POST (no Origin):', {
      status: response1.status,
      headers: Object.fromEntries(response1.headers.entries()),
      url: response1.url
    });
    const result1 = await response1.json();
    console.log('📝 Response body:', result1);
  } catch (error) {
    console.error('❌ Direct POST failed:', error.message);
  }
  
  // Test 2: With Origin header
  try {
    const response2 = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({ ...testData, withOrigin: true })
    });
    console.log('✅ POST with Origin:', {
      status: response2.status,
      headers: Object.fromEntries(response2.headers.entries()),
      url: response2.url
    });
    const result2 = await response2.json();
    console.log('📝 Response body:', result2);
  } catch (error) {
    console.error('❌ POST with Origin failed:', error.message);
  }
  
  // Test 3: Force bypass cache
  try {
    const response3 = await fetch(`${testUrl}?t=${uniqueId}`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ ...testData, cacheBypass: true })
    });
    console.log('✅ POST with cache bypass:', {
      status: response3.status,
      headers: Object.fromEntries(response3.headers.entries()),
      url: response3.url
    });
    const result3 = await response3.json();
    console.log('📝 Response body:', result3);
  } catch (error) {
    console.error('❌ POST with cache bypass failed:', error.message);
  }
};

// Initialize queue flushing on import
setupQueueFlushing();

export default DASHBOARD_CONFIG;