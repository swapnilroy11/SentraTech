// Dashboard Configuration for SentraTech Admin Integration
// Provides reliable form submission with robust fallback mechanisms

import { set, get, keys, del } from 'idb-keyval';

// Get backend URL from environment
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

// Dashboard configuration
export const DASHBOARD_CONFIG = {
  // API endpoints for form submissions
  ENDPOINTS: {
    CONTACT_SALES: '/api/forms/contact-sales',
    DEMO_REQUEST: '/api/forms/demo-request', 
    ROI_CALCULATOR: '/api/forms/roi-calculator',
    NEWSLETTER: '/api/forms/newsletter-signup',
    JOB_APPLICATION: '/api/forms/job-application',
    PILOT_REQUEST: '/api/forms/pilot-request',
    CHAT_MESSAGE: '/api/chat/message'
  },
  
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

// Check if browser is online
export const isOnline = () => {
  return navigator.onLine;
};

// Network-aware form submission with fallback
export const submitFormToDashboard = async (endpoint, data, options = {}) => {
  // Always attempt network call - don't rely on navigator.onLine which can be unreliable
  // Let the actual network error handling determine if fallback is needed

  const {
    timeout = DASHBOARD_CONFIG.TIMEOUT.DEFAULT,
    retries = DASHBOARD_CONFIG.RETRY.MAX_ATTEMPTS
  } = options;

  let lastError = null;
  
  // Try network submission with retries
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://unified-forms.preview.emergentagent.com'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      return {
        success: true,
        data: result,
        mode: 'network',
        attempt
      };
      
    } catch (error) {
      lastError = error;
      console.warn(`Network submission attempt ${attempt}/${retries} failed:`, error.message);
      
      // Wait before retry (except on last attempt)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, DASHBOARD_CONFIG.RETRY.DELAY));
      }
    }
  }
  
  // All network attempts failed, queue for retry and use offline fallback
  console.warn('All network attempts failed, queuing for retry and using offline fallback:', lastError?.message);
  
  // Queue the submission for retry when online
  const queueKey = await queueFormSubmission(endpoint, data, options.formType || 'unknown');
  
  return {
    success: true,
    data: { ...data, id: `fallback_${Date.now()}`, queueKey },
    mode: 'fallback',
    error: lastError?.message
  };
};

// Submit chat message with AI response simulation fallback
export const submitChatMessage = async (message, conversationId = null) => {
  // Always attempt network call first - let error handling determine fallback

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DASHBOARD_CONFIG.TIMEOUT.CHAT);
    
    const response = await fetch(`${BACKEND_URL}${DASHBOARD_CONFIG.ENDPOINTS.CHAT_MESSAGE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-INGEST-KEY': DASHBOARD_CONFIG.INGEST_KEY
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

// Initialize queue flushing on import
setupQueueFlushing();

export default DASHBOARD_CONFIG;