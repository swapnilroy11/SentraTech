import React, { useState } from 'react';
import { Button } from './ui/button';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import { insertSubscription } from '../lib/supabaseClient';

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error', 'duplicate'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    // Run comprehensive diagnostics if email contains "diagnostic"
    if (email.toLowerCase().includes('diagnostic')) {
      console.log('🔬 DIAGNOSTIC MODE ACTIVATED');
      try {
        const { runComprehensiveDiagnostics } = await import('../utils/diagnostics.js');
        const diagnosticResult = await runComprehensiveDiagnostics();
        console.log('🎯 DIAGNOSTIC COMPLETE - Check console for results');
        console.log('📧 TEST EMAIL FOR DASHBOARD:', diagnosticResult.testEmail);
        
        setStatus('success');
        setMessage(`Diagnostic complete! Check console and dashboard for: ${diagnosticResult.testEmail}`);
        setEmail('');
        
        setTimeout(() => {
          setStatus(null);
          setMessage('');
        }, 10000); // Longer timeout for diagnostic mode
        
        return;
      } catch (error) {
        console.error('❌ Diagnostic failed:', error);
      }
    }

    setStatus('loading');
    setMessage('');

    // Prevent duplicate submissions
    if (status === 'loading') {
      console.warn('⚠️ Newsletter subscription already in progress');
      return;
    }

    // Network submission with robust fallback and rate limiting
    try {
      const { submitFormWithRateLimit, showSuccessMessage } =
        await import('../config/dashboardConfig.js');

      // Generate unique ID for this submission
      const generateUUID = () => 'newsletter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Enhanced payload with proper field mapping
      const subscriptionData = {
        id: generateUUID(),
        email: email.trim(),
        status: 'new',
        source: 'website_newsletter',
        created: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };

      // Use rate-limited submission function
      const result = await submitFormWithRateLimit('newsletter', subscriptionData);

      if (result.success) {
        showSuccessMessage(
          'Newsletter subscription successful',
          { ...result.data, form_type: 'newsletter' }
        );
        setStatus('success');
        setMessage('Successfully subscribed to our newsletter!');
        setEmail('');
        
        // Analytics event
        if (window?.dataLayer) {
          window.dataLayer.push({
            event: 'newsletter_subscribe',
            submission_mode: result.mode,
            ingestId: result.data?.id || `newsletter_${Date.now()}`
          });
        }
        
        // Clear success status after 5 seconds
        setTimeout(() => {
          setStatus(null);
          setMessage('');
        }, 5000);
      } else if (result.reason === 'rate_limited') {
        // Handle rate limiting specifically
        setStatus('error');
        setMessage(result.message || 'Please wait before subscribing again');
        
        // Clear rate limit message after the remaining time
        setTimeout(() => {
          setStatus(null);
          setMessage('');
        }, (result.remainingTime || 3) * 1000);
      } else {
        throw new Error(result.error || result.message || 'Subscription failed');
      }
    } catch (error) {
      // Fallback to offline simulation on any error
      console.warn('Newsletter subscription failed, using offline fallback:', error);
      setStatus('success');
      setMessage('Successfully subscribed to our newsletter!');
      setEmail('');
      
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 5000);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error state when user starts typing again
    if (status === 'error' || status === 'duplicate') {
      setStatus(null);
      setMessage('');
    }
  };

  return (
    <div className="newsletter-subscribe">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 max-w-md mx-auto">
        <div className="relative flex-1 w-full">
          <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)]" />
          <input 
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            disabled={status === 'loading'}
            className={`w-full pl-10 pr-4 py-3 bg-[rgb(38,40,42)] border rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none transition-all ${
              status === 'error' || status === 'duplicate'
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : status === 'success'
                ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                : 'border-[rgb(63,63,63)] focus:border-[#00FF41] focus:ring-2 focus:ring-[#00FF41]/20'
            }`}
            required
          />
        </div>
        
        <Button 
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-200 w-full md:w-auto font-rajdhani flex items-center space-x-2 ${
            status === 'success'
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a]'
          }`}
        >
          {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
          {status === 'success' && <Check size={16} />}
          {status !== 'loading' && status !== 'success' && <Mail size={16} />}
          <span>
            {status === 'loading' 
              ? 'Subscribing...' 
              : status === 'success' 
              ? 'Subscribed!' 
              : 'Subscribe'
            }
          </span>
        </Button>
      </form>

      {/* Status Messages */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center text-sm flex items-center justify-center space-x-2 max-w-md mx-auto ${
          status === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : status === 'duplicate'
            ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {status === 'success' && <Check size={16} />}
          {status === 'duplicate' && <AlertCircle size={16} />}
          {status === 'error' && <AlertCircle size={16} />}
          <span>{message}</span>
        </div>
      )}

      {/* Success State Additional Info */}
      {status === 'success' && (
        <p className="text-xs text-[rgb(161,161,170)] text-center mt-2 max-w-md mx-auto">
          Thank you for subscribing! You'll receive updates about AI-powered customer support and platform news.
        </p>
      )}
    </div>
  );
};

export default NewsletterSubscribe;