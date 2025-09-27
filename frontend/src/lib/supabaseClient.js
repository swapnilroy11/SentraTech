import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Add helper functions for common operations
export const demoRequestsTable = () => supabase.from('demo_requests');
export const contactRequestsTable = () => supabase.from('contact_requests');
export const subscriptionsTable = () => supabase.from('subscriptions');

// Helper function to insert a newsletter subscription
export const insertSubscription = async (email) => {
  try {
    console.log('Subscribing email to newsletter:', email);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        email: email.toLowerCase().trim(), // Normalize email
        created_at: new Date().toISOString()
      }], { returning: 'minimal' });

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505' || error.message.includes('unique constraint')) {
        return {
          success: false,
          error: 'duplicate',
          message: 'This email is already subscribed to our newsletter.'
        };
      }
      throw error;
    }

    console.log('✅ Email subscribed successfully');

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!'
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to subscribe. Please try again later.'
    };
  }
};

// Helper function to insert a demo request
export const insertDemoRequest = async (formData) => {
  try {
    console.log('Submitting demo request to Supabase...', formData);
    
    // Insert into Supabase database with volume fields
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([{
        "User Name": formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || null,
        call_volume: formData.call_volume || null,
        interaction_volume: formData.interaction_volume || null
      }], { returning: 'minimal' }); // Use minimal returning to avoid RLS SELECT issues

    if (error) {
      throw error;
    }

    console.log('✅ Demo request saved to Supabase successfully');

    // Generate a temporary ID for GA4 tracking since we're using minimal returning
    const tempId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      data: { id: tempId }, // Return temporary ID for tracking
      message: 'Demo request submitted successfully! You will hear from us within 24 hours.'
    };
  } catch (error) {
    console.error('Supabase insertion error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to submit demo request. Please try again.'
    };
  }
};

// Helper function to insert ROI report request
export const insertROIReport = async (email, roiData) => {
  try {
    console.log('Saving ROI report request:', email, roiData);
    
    const { data, error } = await supabase
      .from('roi_reports')
      .insert([{
        email: email.toLowerCase().trim(),
        country: roiData.country,
        agent_count: roiData.agentCount,
        aht_minutes: roiData.ahtMinutes,
        call_volume: roiData.callVolume,
        traditional_cost: roiData.tradCost,
        ai_cost: roiData.aiCost,
        monthly_savings: roiData.monthlySavings,
        annual_savings: roiData.annualSavings,
        roi_percentage: roiData.roi,
        cost_reduction: roiData.reduction,
        created_at: new Date().toISOString()
      }], { returning: 'minimal' });

    if (error) {
      throw error;
    }

    console.log('✅ ROI report request saved to Supabase successfully');

    return {
      success: true,
      message: 'ROI report request submitted successfully! You will receive the detailed report via email within 24 hours.'
    };
  } catch (error) {
    console.error('Supabase ROI report insertion error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to submit ROI report request. Please try again.'
    };
  }
};

// Helper function to insert a contact request
export const insertContactRequest = async (formData) => {
  try {
    console.log('🔍 Submitting contact request to Supabase...', formData);
    console.log('🔍 Form data fields:', Object.keys(formData));
    
    // Get client IP and other metadata
    const clientMetadata = {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      source: 'pricing_page',
      widget: 'slide_in'
    };
    
    const insertData = {
      full_name: formData.fullName,
      work_email: formData.workEmail?.toLowerCase().trim(),
      phone: formData.phone || null,
      company_name: formData.companyName,
      company_website: formData.companyWebsite || null,
      monthly_volume: formData.monthlyVolume,
      plan_selected: formData.planSelected || null,
      preferred_contact_method: formData.preferredContactMethod || 'email',
      message: formData.message || null,
      utm_data: formData.utmData || {},
      metadata: {
        ...clientMetadata,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      },
      consent_marketing: formData.consentMarketing || false
    };

    console.log('🔍 Inserting data to Contract Sale Request table:', insertData);

    // Insert into Supabase database with new plan metadata fields
    const { data, error } = await supabase
      .from('Contract Sale Request')
      .insert([insertData], { returning: 'minimal' });

    if (error) {
      console.error('🚨 Supabase insertion error:', error);
      console.error('🚨 Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('✅ Contact request saved to Supabase successfully:', data);

    return {
      success: true,
      message: 'Contact request submitted successfully! Our sales team will reach out within one business day.',
      data: data
    };
  } catch (error) {
    console.error('🚨 Supabase contact request insertion error:', error);
    console.error('🚨 Full error object:', JSON.stringify(error, null, 2));
    return {
      success: false,
      error: error.message,
      message: 'Failed to submit contact request. Please try again.'
    };
  }
};

export default supabase;