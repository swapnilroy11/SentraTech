import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.');
  console.warn('Supabase functionality will be disabled. The app will continue to work without database features.');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Optional: Add helper functions for common operations
export const demoRequestsTable = () => supabase ? supabase.from('demo_requests') : null;
export const contactRequestsTable = () => supabase ? supabase.from('contact_requests') : null;
export const subscriptionsTable = () => supabase ? supabase.from('subscriptions') : null;

// Helper function to insert a newsletter subscription
export const insertSubscription = async (email) => {
  if (!supabase) {
    console.warn('Supabase not available. Newsletter subscription will be skipped.');
    return {
      success: false,
      error: 'database_unavailable',
      message: 'Database service is currently unavailable. Please try again later.'
    };
  }
  
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
  if (!supabase) {
    console.warn('Supabase not available. Demo request will be skipped.');
    return {
      success: false,
      error: 'database_unavailable',
      message: 'Database service is currently unavailable. Please try again later.'
    };
  }
  
  try {
    console.log('Submitting demo request to Supabase...', formData);
    
    // Prepare basic required fields (core only)
    const insertData = {
      user_name: formData.name,
      email: formData.email,
      company: formData.company
    };
    
    // Only add optional fields if they exist and the schema supports them
    if (formData.phone) {
      insertData.phone = formData.phone;
    }
    if (formData.message) {
      insertData.message = formData.message;
    }
    
    // Add volume fields only if they exist in formData (schema-safe approach)
    if (formData.call_volume) {
      insertData.call_volume = formData.call_volume;
    }
    if (formData.interaction_volume) {
      insertData.interaction_volume = formData.interaction_volume;
    }
    
    console.log('Inserting data to demo_requests:', insertData);
    
    // Insert into Supabase database with volume fields (updated schema)
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([insertData], { returning: 'minimal' }); // Use minimal returning to avoid RLS SELECT issues

    if (error) {
      console.error('Supabase error details:', error);
      
      // Handle specific column missing errors gracefully
      if (error.code === 'PGRST204' && (error.message.includes('interaction_volume') || error.message.includes('call_volume'))) {
        console.log('Volume columns missing in schema, retrying with basic fields only...');
        
        // Ultra-minimal fallback: Only the most essential fields
        const basicData = {
          user_name: formData.name,
          email: formData.email,
          company: formData.company
        }
        
        const { data: retryData, error: retryError } = await supabase
          .from('demo_requests')
          .insert([basicData], { returning: 'minimal' });
          
        if (retryError) {
          throw retryError;
        }
        
        console.log('✅ Demo request saved to Supabase (basic fields only) - Schema needs volume columns');
        
        return {
          success: true,
          data: { id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` },
          message: 'Demo request submitted successfully! Note: Volume fields require schema update. You will hear from us within 24 hours.'
        };
      }
      
      throw error;
    }

    console.log('✅ Demo request saved to Supabase successfully with all fields');

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