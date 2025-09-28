import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Rocket, ArrowRight, CheckCircle, Clock, 
  Users, Zap, Calendar, Send, Sparkles, Loader2
} from 'lucide-react';
import { flushSync } from 'react-dom';
import { trackDemoBooking, trackFormErrors, trackFormInteraction } from '../utils/analytics';
import { insertDemoRequest } from '../lib/supabaseClient';

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    call_volume: '',
    interaction_volume: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [contactId, setContactId] = useState('');

  const handleInputChange = (field, value) => {
    // Update form data
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
    
    // Clear field error when user starts typing (real-time feedback)
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
    
    // Optional: Validate field on blur for better UX
    // You can enable this for immediate feedback
    /*
    const errorMessage = validateField(field, value);
    if (errorMessage) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: errorMessage
      }));
    }
    */
  };

  const validateField = (field, value) => {
    // Handle undefined or null values
    const fieldValue = value || '';
    console.log(`validateField called for ${field} with value: "${fieldValue}" (type: ${typeof fieldValue})`); // Debug log
    
    switch (field) {
      case 'name':
        if (!fieldValue.trim()) {
          console.log(`Name validation failed: empty value`); // Debug log
          return 'Full name is required';
        }
        if (fieldValue.trim().length < 2) {
          console.log(`Name validation failed: too short`); // Debug log
          return 'Name must be at least 2 characters';
        }
        return '';
      
      case 'email':
        if (!fieldValue.trim()) {
          console.log(`Email validation failed: empty value`); // Debug log
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
          console.log(`Email validation failed: invalid format`); // Debug log
          return 'Please enter a valid email address';
        }
        return '';
      
      case 'company':
        if (!fieldValue.trim()) {
          console.log(`Company validation failed: empty value`); // Debug log
          return 'Company name is required';
        }
        return '';
      
      case 'phone':
        if (fieldValue && fieldValue.trim()) {
          const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
          if (!phoneRegex.test(fieldValue.trim())) {
            console.log(`Phone validation failed: invalid format`); // Debug log
            return 'Please enter a valid phone number';
          }
        }
        return '';
      
      default:
        return '';
    }
  };

  const validateAllFields = () => {
    const newErrors = {};
    let hasErrors = false;
    
    console.log('validateAllFields called with formData:', formData); // Debug log
    
    // Validate ONLY required fields (phone is optional)
    ['name', 'email', 'company'].forEach(field => {
      const fieldValue = formData[field];
      console.log(`Validating required field ${field} with value: "${fieldValue}"`); // Debug log
      
      const errorMessage = validateField(field, fieldValue);
      console.log(`Validation result for ${field}: "${errorMessage}"`); // Debug log
      
      if (errorMessage) {
        newErrors[field] = errorMessage;
        hasErrors = true;
        console.log(`Error found for required field ${field}: ${errorMessage}`); // Debug log
      }
    });
    
    // Validate optional phone field separately (only if it has a value)
    if (formData.phone && formData.phone.trim()) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
        hasErrors = true;
        console.log(`Error found for optional phone field: ${phoneError}`); // Debug log
      }
    }
    
    console.log('Final validation - hasErrors:', hasErrors, 'newErrors:', newErrors); // Debug log
    
    // Use flushSync to force immediate state updates and re-render
    if (hasErrors) {
      flushSync(() => {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          ...newErrors
        }));
        setError('Please fix the highlighted fields below');
      });
      
      // Track form validation errors in GA4
      trackFormErrors(newErrors);
      
      console.log('Validation failed, returning false'); // Debug log
      return false;
    } else {
      flushSync(() => {
        // Clear any previous errors if validation passes
        setError(null);
        setFieldErrors({});
      });
      console.log('Validation passed, returning true'); // Debug log
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Always prevent default submission first
    
    console.log('Form submission started...'); // Debug log
    console.log('Current form data:', formData); // Debug log
    
    // Perform validation BEFORE attempting submission
    const isValid = validateAllFields();
    console.log('Validation result:', isValid); // Debug log
    console.log('Field errors after validation:', fieldErrors); // Debug log
    
    if (!isValid) {
      console.log('Form validation failed, stopping submission'); // Debug log
      return; // Stop submission if validation fails
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Submitting to ingest endpoint...'); // Debug log
      
      // Use enhanced dashboard config with proper authentication
      const { FORM_CONFIG, submitForm, clearFormCache } = await import('../config/formConfig.js');
      
      // Clear any cached data
      clearFormCache();
      
      // Prepare data for /api/ingest/demo_requests endpoint
      const dashboardData = {
        name: formData.name,                              // Correct field name
        email: formData.email,
        company: formData.company,
        phone: formData.phone || '',
        message: formData.message || '',
        call_volume: parseInt(formData.call_volume) || 0,    // Convert to number
        interaction_volume: parseInt(formData.interaction_volume) || 0
      };
      
      // Submit using enhanced helper function with authentication and error handling
      const result = await submitFormToDashboard(FORM_CONFIG.ENDPOINTS.DEMO_REQUEST, dashboardData);
      
      if (result.success) {
        console.log('✅ Demo request submitted successfully:', result.data);
        
        // Track successful demo booking conversion in GA4
        trackDemoBooking(formData, result.data.id || `demo_${Date.now()}`);
        
        setContactId(result.data.id || `demo_${Date.now()}`);
        setIsSubmitted(true);
        
        // Clear form data after successful submission
        setFormData({
          name: '', email: '', company: '', phone: '', 
          message: '', call_volume: '', interaction_volume: ''
        });
        setFieldErrors({}); // Clear any field errors
      } else {
        throw new Error(result.error || 'Form submission failed');
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Failed to submit demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#00FF41]/5 to-[#00DDFF]/5">
        <div className="container mx-auto px-6">
          <Card className="max-w-2xl mx-auto bg-[rgb(26,28,30)] border-2 border-[#00FF41] rounded-3xl p-12 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#00FF41]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00FF41]/50">
                <CheckCircle size={40} className="text-[#00FF41]" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Demo Request Confirmed!
              </h3>
              <p className="text-[rgb(218,218,218)] text-lg leading-relaxed mb-4">
                Thank you for your interest in SentraTech! We've received your demo request 
                and our team will contact you within 1-2 business days to schedule your personalized demonstration.
              </p>
              {contactId && (
                <div className="bg-[rgb(38,40,42)] rounded-xl p-4 mb-4">
                  <p className="text-[rgb(161,161,170)] text-sm mb-1">Your Reference ID:</p>
                  <p className="text-[#00FF41] font-mono text-lg">{contactId}</p>
                </div>
              )}
              <p className="text-[rgb(161,161,170)] text-sm">
                Check your email for confirmation details and next steps.
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setContactId('');
                setError(null);
                setFieldErrors({});
                setFormData({
                  name: '', email: '', company: '', phone: '', 
                  message: '', call_volume: '', interaction_volume: ''
                });
              }}
              className="bg-[#00FF41] text-[rgb(17,17,19)] hover:bg-[#00e83a] rounded-xl px-6"
            >
              Submit Another Request
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(38,40,42)] pb-0">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Rocket className="mr-2" size={14} />
            Get Started Today
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">Ready to Transform</span>
            <br />
            <span className="text-[#00FF41]">Your Customer Support?</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            Join industry leaders who trust SentraTech to deliver exceptional customer experiences 
            while reducing costs and improving efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left Side - Benefits & Social Proof */}
          <div className="space-y-8">
            {/* Key Benefits */}
            <Card className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(38,40,42)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl text-white flex items-center space-x-3">
                  <Sparkles size={24} className="text-[#00FF41]" />
                  <span>What You'll Get</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-[rgb(17,17,19)]/50 rounded-xl border border-[rgb(63,63,63)]">
                  <div className="p-2 bg-[#00FF41]/20 rounded-lg border border-[#00FF41]/50 flex-shrink-0">
                    <Zap size={20} className="text-[#00FF41]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Sub-50ms AI Routing</h4>
                    <p className="text-[rgb(218,218,218)] text-sm">
                      Lightning-fast decision engine that optimizes every customer interaction in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[rgb(17,17,19)]/50 rounded-xl border border-[rgb(63,63,63)]">
                  <div className="p-2 bg-[#00DDFF]/20 rounded-lg border border-[#00DDFF]/50 flex-shrink-0">
                    <Users size={20} className="text-[#00DDFF]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">70% Automation Rate</h4>
                    <p className="text-[rgb(218,218,218)] text-sm">
                      Intelligent automation handles routine inquiries while humans focus on complex issues.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[rgb(17,17,19)]/50 rounded-xl border border-[rgb(63,63,63)]">
                  <div className="p-2 bg-[rgb(192,192,192)]/20 rounded-lg border border-[rgb(192,192,192)]/50 flex-shrink-0">
                    <CheckCircle size={20} className="text-[rgb(192,192,192)]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Full Compliance Suite</h4>
                    <p className="text-[rgb(218,218,218)] text-sm">
                      Built-in GDPR, HIPAA, and PCI compliance with immutable audit trails.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Process */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <Calendar size={20} className="text-[#00DDFF]" />
                  <span>What Happens Next?</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-[#00FF41] text-[rgb(17,17,19)] rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="text-white font-semibold">Schedule Your Demo</div>
                    <div className="text-[rgb(161,161,170)] text-sm">30-minute personalized walkthrough</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-[#00DDFF] text-[rgb(17,17,19)] rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="text-white font-semibold">Custom ROI Analysis</div>
                    <div className="text-[rgb(161,161,170)] text-sm">Tailored cost-benefit assessment</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-[rgb(192,192,192)] text-[rgb(17,17,19)] rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="text-white font-semibold">Implementation Plan</div>
                    <div className="text-[rgb(161,161,170)] text-sm">Step-by-step integration roadmap</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Contact Form */}
          <Card className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(38,40,42)] border-2 border-[#00FF41] rounded-3xl p-8">
            <CardHeader className="p-0 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00FF41]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00FF41]/50">
                  <Rocket size={32} className="text-[#00FF41]" />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  Request Your Demo
                </CardTitle>
                <p className="text-[rgb(218,218,218)]">
                  See our platform in action with your data
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                aria-label="Demo Request Form"
                noValidate
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="demo-name" className="sr-only">Full Name (required)</label>
                    <Input
                      id="demo-name"
                      name="name"
                      type="text"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={(e) => {
                        // Track form interaction
                        trackFormInteraction('name', 'blur');
                        
                        // Validate on blur for immediate feedback
                        const errorMessage = validateField('name', e.target.value);
                        if (errorMessage) {
                          setFieldErrors(prev => ({ ...prev, name: errorMessage }));
                        }
                      }}
                      required
                      aria-required="true"
                      aria-invalid={fieldErrors.name ? 'true' : 'false'}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      className={`bg-[rgb(38,40,42)] border text-white placeholder-[rgb(161,161,170)] rounded-xl ${
                        fieldErrors.name 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[rgb(63,63,63)] focus:border-[#00FF41]'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p 
                        id="name-error" 
                        className="text-red-400 text-xs mt-1 ml-1"
                        role="alert"
                        aria-live="polite"
                      >
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="demo-email" className="sr-only">Work Email (required)</label>
                    <Input
                      id="demo-email"
                      name="email"
                      type="email"
                      placeholder="Work Email *"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={(e) => {
                        // Track form interaction
                        trackFormInteraction('email', 'blur');
                        
                        // Validate on blur for immediate feedback
                        const errorMessage = validateField('email', e.target.value);
                        if (errorMessage) {
                          setFieldErrors(prev => ({ ...prev, email: errorMessage }));
                        }
                      }}
                      required
                      aria-required="true"
                      aria-invalid={fieldErrors.email ? 'true' : 'false'}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      className={`bg-[rgb(38,40,42)] border text-white placeholder-[rgb(161,161,170)] rounded-xl ${
                        fieldErrors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[rgb(63,63,63)] focus:border-[#00FF41]'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p 
                        id="email-error"
                        className="text-red-400 text-xs mt-1 ml-1"
                        role="alert"
                        aria-live="polite"
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Company Name *"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      onBlur={(e) => {
                        // Track form interaction
                        trackFormInteraction('company', 'blur');
                        
                        // Validate on blur for immediate feedback
                        const errorMessage = validateField('company', e.target.value);
                        if (errorMessage) {
                          setFieldErrors(prev => ({ ...prev, company: errorMessage }));
                        }
                      }}
                      required
                      className={`bg-[rgb(38,40,42)] border text-white placeholder-[rgb(161,161,170)] rounded-xl ${
                        fieldErrors.company 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[rgb(63,63,63)] focus:border-[#00FF41]'
                      }`}
                    />
                    {fieldErrors.company && (
                      <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.company}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={(e) => {
                        // Track form interaction
                        trackFormInteraction('phone', 'blur');
                        
                        // Validate on blur for immediate feedback (only if not empty)
                        if (e.target.value.trim()) {
                          const errorMessage = validateField('phone', e.target.value);
                          if (errorMessage) {
                            setFieldErrors(prev => ({ ...prev, phone: errorMessage }));
                          }
                        }
                      }}
                      className={`bg-[rgb(38,40,42)] border text-white placeholder-[rgb(161,161,170)] rounded-xl ${
                        fieldErrors.phone 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-[rgb(63,63,63)] focus:border-[#00FF41]'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Volume Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Monthly Call Volume
                    </label>
                    <Input
                      placeholder="e.g., 50,000 or <10k"
                      value={formData.call_volume}
                      onChange={(e) => handleInputChange('call_volume', e.target.value)}
                      className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl focus:border-[#00FF41]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Monthly Interaction Volume
                      <span className="text-xs text-gray-400 block font-normal">Chat/SMS/Email/Social</span>
                    </label>
                    <Input
                      placeholder="e.g., 75,000 or 10k-50k"
                      value={formData.interaction_volume}
                      onChange={(e) => handleInputChange('interaction_volume', e.target.value)}
                      className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl focus:border-[#00FF41]"
                    />
                  </div>
                </div>

                <div>
                  <Textarea
                    placeholder="Tell us about your current customer support challenges..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-xl resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold py-4 rounded-xl transform hover:scale-105 transition-all duration-200 font-rajdhani disabled:opacity-70 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 size={20} className="animate-spin" />
                      <span>Scheduling Demo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send size={20} />
                      <span>Schedule My Demo</span>
                      <ArrowRight size={20} />
                    </div>
                  )}
                </Button>

                <p className="text-[rgb(161,161,170)] text-xs text-center">
                  By submitting this form, you agree to our privacy policy. 
                  No spam, unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators - No bottom spacing */}
        <div className="mt-16 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-3 bg-[rgb(17,17,19)] rounded-lg border border-[rgb(63,63,63)]">
              <div className="text-lg font-bold text-[#00FF41] font-rajdhani">24hrs</div>
              <div className="text-[rgb(161,161,170)] text-sm">Response Time</div>
            </div>
            <div className="text-center p-3 bg-[rgb(17,17,19)] rounded-lg border border-[rgb(63,63,63)]">
              <div className="text-2xl font-bold text-[#00DDFF] mb-1">99.9%</div>
              <div className="text-[rgb(161,161,170)] text-sm">Platform Uptime</div>
            </div>
            <div className="text-center p-3 bg-[rgb(17,17,19)] rounded-lg border border-[rgb(63,63,63)]">
              <div className="text-2xl font-bold text-[rgb(192,192,192)] mb-1">SOC2</div>
              <div className="text-[rgb(161,161,170)] text-sm">Compliant</div>
            </div>
            <div className="text-center p-3 bg-[rgb(17,17,19)] rounded-lg border border-[rgb(63,63,63)]">
              <div className="text-2xl font-bold text-[#00FF41] mb-1 font-rajdhani">30-day</div>
              <div className="text-[rgb(161,161,170)] text-sm">Free Trial</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;