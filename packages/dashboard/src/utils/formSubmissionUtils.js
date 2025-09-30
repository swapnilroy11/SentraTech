// Form Submission Utilities for SentraTech Dashboard
// Provides debouncing, idempotency, and robust error handling

// Track submission timestamps per form ID for debouncing
const submissionTracker = new Map();
const DEBOUNCE_DURATION = 5000; // 5 seconds

/**
 * Wraps form submission with debouncing and button state management
 */
export function debouncedFormSubmit(formId, submitFunction) {
  return async function() {
    const now = Date.now();
    const lastSubmission = submissionTracker.get(formId);
    
    // Check if debounce period has passed
    if (lastSubmission && (now - lastSubmission) < DEBOUNCE_DURATION) {
      console.warn(`Form ${formId} submitted too quickly. Please wait.`);
      return { success: false, error: 'Please wait before submitting again.' };
    }
    
    // Record this submission attempt
    submissionTracker.set(formId, now);
    
    // Find and manage submit buttons
    const buttons = document.querySelectorAll(`button[data-form-id="${formId}"]`);
    const originalStates = Array.from(buttons).map(btn => ({
      disabled: btn.disabled,
      textContent: btn.textContent,
      className: btn.className
    }));
    
    // Disable buttons and show loading state
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.textContent = 'Submitting...';
      btn.classList.add('loading');
    });
    
    try {
      const result = await submitFunction();
      
      if (result.success) {
        // Keep buttons disabled for full debounce duration on success
        setTimeout(() => restoreButtons(buttons, originalStates), DEBOUNCE_DURATION);
      } else {
        // Restore buttons immediately on failure
        restoreButtons(buttons, originalStates);
      }
      
      return result;
    } catch (error) {
      // Restore buttons immediately on error
      restoreButtons(buttons, originalStates);
      throw error;
    }
  };
}

/**
 * Restores button states after submission
 */
function restoreButtons(buttons, originalStates) {
  buttons.forEach((btn, index) => {
    const original = originalStates[index];
    btn.disabled = original.disabled;
    btn.textContent = original.textContent;
    btn.className = original.className;
  });
}

/**
 * Generates unique submission ID for idempotency
 */
export function generateSubmissionId() {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Core form submission function with debouncing and idempotency
 */
export async function sentraTechFormSubmit(formData, endpoint, options = {}) {
  const {
    formId = 'default-form',
    timeout = 30000,
    generateId = true,
    ...otherOptions
  } = options;
  
  // Prepare submission data with idempotency and client info
  const submissionData = {
    ...formData,
    ...(generateId && { id: generateSubmissionId() }),
    timestamp: new Date().toISOString(),
    client_info: {
      user_agent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    }
  };
  
  // Wrap with debouncing
  return await debouncedFormSubmit(formId, async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Client-Version': '1.0.0'
        },
        body: JSON.stringify(submissionData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before submitting again.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Form submission successful:', result);
      
      return { success: true, data: result };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Form submission failed:', error);
      throw error;
    }
  })();
}

/**
 * React hook for form submissions with state management
 */
export function useFormSubmission(formId, endpoint, options = {}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [lastSubmission, setLastSubmission] = React.useState(null);
  
  const submit = async (formData) => {
    if (isSubmitting) {
      return { success: false, error: 'Submission already in progress' };
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await sentraTechFormSubmit(formData, endpoint, { formId, ...options });
      
      if (result.success) {
        setLastSubmission(Date.now());
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      // Keep isSubmitting true for full debounce duration
      setTimeout(() => setIsSubmitting(false), DEBOUNCE_DURATION);
    }
  };
  
  const canSubmit = !isSubmitting && (
    !lastSubmission || 
    (Date.now() - lastSubmission) >= DEBOUNCE_DURATION
  );
  
  const timeRemaining = lastSubmission 
    ? Math.max(0, DEBOUNCE_DURATION - (Date.now() - lastSubmission))
    : 0;
  
  return {
    submit,
    isSubmitting,
    canSubmit,
    timeRemaining
  };
}