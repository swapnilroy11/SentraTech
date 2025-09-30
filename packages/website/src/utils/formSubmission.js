/**
 * Unified form submission utility for SentraTech
 * Routes all form submissions through /api/collect same-origin proxy
 */

// Generate a unique trace ID for request tracking
export function generateTraceId() {
  return 'trace-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Submit form data through the collect proxy
export async function submitForm(formData, formType = null) {
  const trace_id = formData.trace_id || generateTraceId();
  
  const payload = {
    ...formData,
    trace_id,
    ...(formType && { form_type: formType })
  };

  try {
    const response = await fetch('/api/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok && result.ok) {
      return {
        success: true,
        trace_id: result.trace_id,
        data: result
      };
    } else {
      return {
        success: false,
        error: result.error || 'Submission failed',
        trace_id: result.trace_id || trace_id
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error: ' + error.message,
      trace_id
    };
  }
}

// Specific form submission helpers
export const FormSubmissionHelpers = {
  // Newsletter subscription
  async newsletter(email) {
    return submitForm({ email }, 'newsletter-signup');
  },

  // Contact sales inquiry  
  async contactSales(data) {
    const payload = {
      full_name: data.name || data.full_name,
      work_email: data.email || data.work_email,
      company_name: data.company || data.company_name,
      message: data.message
    };
    return submitForm(payload, 'contact-sales');
  },

  // Demo request
  async demoRequest(data) {
    const payload = {
      name: data.name,
      email: data.email,
      company: data.company,
      company_name: data.company // Dashboard might expect company_name
    };
    return submitForm(payload, 'demo-request');
  },

  // ROI Calculator
  async roiCalculator(data) {
    return submitForm(data, 'roi-calculator');
  },

  // Job application
  async jobApplication(data) {
    return submitForm(data, 'job-application');
  }
};

export default {
  submit: submitForm,
  generateTraceId,
  ...FormSubmissionHelpers
};