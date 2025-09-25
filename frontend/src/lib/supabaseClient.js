import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Add helper functions for common operations
export const demoRequestsTable = () => supabase.from('demo_requests');
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
    
    // Insert into Supabase database
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([{
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || null,
        message: formData.message || null,
        created_at: new Date().toISOString()
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

export default supabase;

export default supabase;