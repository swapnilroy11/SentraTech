import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Add helper functions for common operations
export const demoRequestsTable = () => supabase.from('demo_requests');

// Helper function to insert a demo request
export const insertDemoRequest = async (formData) => {
  try {
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

    // Generate a temporary ID for GA4 tracking since we're using minimal returning
    const tempId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      data: { id: tempId }, // Return temporary ID for tracking
      message: 'Demo request submitted successfully!'
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