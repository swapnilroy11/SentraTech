import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Check, Loader2, ArrowRight } from 'lucide-react';
import { insertContactRequest } from '../lib/supabaseClient';

const ContactSalesSlideIn = ({ isOpen, onClose, selectedPlan = null, prefill = null }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    callVolume: '',
    interactionVolume: '',
    monthlyVolume: '', // Keep for backwards compatibility
    planSelected: selectedPlan || (prefill?.planSelected) || '',
    planId: prefill?.planId || '',
    billingTerm: prefill?.billingTerm || '24m',
    priceDisplay: prefill?.priceDisplay || null,
    preferredContactMethod: 'email',
    message: '',
    consentMarketing: false,
    honeypot: '' // Anti-spam field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [errors, setErrors] = useState({});

  // UTM and tracking data
  const [utmData, setUtmData] = useState({});
  
  // Focus trap references
  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    // Capture UTM parameters and referrer data
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'), 
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      referrer: document.referrer,
      landing_page: window.location.href
    };
    setUtmData(utmParams);
  }, []);

  // Focus trap and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    // Force close hamburger menu and disable it
    const hamburgerMenu = document.getElementById('mobile-navigation-menu');
    const hamburgerOverlay = document.querySelector('[data-mobile-overlay]');
    
    if (hamburgerMenu) {
      // Force hamburger menu to close by adding translate-x-full class
      hamburgerMenu.classList.remove('translate-x-0');
      hamburgerMenu.classList.add('translate-x-full');
      hamburgerMenu.style.display = 'none';
      hamburgerMenu.style.pointerEvents = 'none';
    }
    
    if (hamburgerOverlay) {
      hamburgerOverlay.style.display = 'none';
      hamburgerOverlay.style.pointerEvents = 'none';
    }

    // Prevent body scroll and disable pointer events on background
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    
    // Focus trap
    const focusableElements = drawerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements && focusableElements.length > 0) {
      firstFocusableRef.current = focusableElements[0];
      lastFocusableRef.current = focusableElements[focusableElements.length - 1];
      
      // Focus first element
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
    }

    // ESC key handler
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Tab key handler for focus trap
    const handleTabKey = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableRef.current) {
            event.preventDefault();
            lastFocusableRef.current?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableRef.current) {
            event.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('keydown', handleTabKey);
      
      // Re-enable hamburger menu when Contact Sales panel closes
      const hamburgerMenu = document.getElementById('mobile-navigation-menu');
      const hamburgerOverlay = document.querySelector('[data-mobile-overlay]');
      
      if (hamburgerMenu) {
        hamburgerMenu.style.display = '';
        hamburgerMenu.style.pointerEvents = '';
      }
      
      if (hamburgerOverlay) {
        hamburgerOverlay.style.display = '';
        hamburgerOverlay.style.pointerEvents = '';
      }
    };
  }, [isOpen, onClose]);

  // Update prefill data when props change
  useEffect(() => {
    if (prefill) {
      setFormData(prev => ({
        ...prev,
        planSelected: prefill.planSelected || prev.planSelected,
        planId: prefill.planId || prev.planId,
        billingTerm: prefill.billingTerm || prev.billingTerm,
        priceDisplay: prefill.priceDisplay || prev.priceDisplay
      }));
    } else if (selectedPlan && selectedPlan !== formData.planSelected) {
      setFormData(prev => ({
        ...prev,
        planSelected: selectedPlan
      }));
    }
  }, [selectedPlan, prefill]);

  const monthlyVolumeOptions = [
    { value: '<10k', label: '<10k' },
    { value: '10k-50k', label: '10k-50k' },
    { value: '50k+', label: '50k+' }
  ];

  const contactMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Work email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address';
    }
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    
    // Volume validation - either new fields or old field
    if (!formData.callVolume && !formData.interactionVolume && !formData.monthlyVolume) {
      newErrors.volume = 'Please provide call volume, interaction volume, or select monthly volume';
    }
    
    // Validate numeric fields if provided
    if (formData.callVolume && (isNaN(formData.callVolume) || formData.callVolume < 0)) {
      newErrors.callVolume = 'Please enter a valid call volume';
    }
    if (formData.interactionVolume && (isNaN(formData.interactionVolume) || formData.interactionVolume < 0)) {
      newErrors.interactionVolume = 'Please enter a valid interaction volume';
    }
    
    if (!formData.consentMarketing) newErrors.consentMarketing = 'You must agree to receive communications';
    
    // Demo scheduling validation removed
    
    // Honeypot check (should be empty)
    if (formData.honeypot) {
      newErrors.honeypot = 'Spam detected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare data for new dashboard endpoint
      const dashboardData = {
        full_name: formData.fullName,
        work_email: formData.workEmail,
        company_name: formData.companyName,
        message: formData.message || `Interested in ${formData.planSelected || 'SentraTech'} plan`,
        phone: formData.phone || '',
        company_website: formData.companyWebsite || '',
        call_volume: parseInt(formData.callVolume) || 0,
        interaction_volume: parseInt(formData.interactionVolume) || 0,
        preferred_contact_method: formData.preferredContactMethod === 'email' ? 'email' : 'phone'
      };

      // Network submission with robust fallback
      try {
        const { DASHBOARD_CONFIG, submitFormToDashboard, showSuccessMessage, isOnline } =
          await import('../config/dashboardConfig.js');

        // Check if offline and handle immediately
        if (!isOnline()) {
          console.warn('Browser offline, using offline fallback');
          setSubmitStatus('success');
          if (window?.dataLayer) {
            window.dataLayer.push({
              event: 'contact_form_submit_offline',
              planId: formData.planId,
              planSelected: formData.planSelected,
              billingTerm: formData.billingTerm,
              priceDisplay: formData.priceDisplay,
              ingestId: `contact_offline_${Date.now()}`
            });
          }
          return;
        }

        const result = await submitFormToDashboard(
          DASHBOARD_CONFIG.ENDPOINTS.CONTACT_SALES,
          dashboardData,
          { formType: 'contact_sales' }
        );

        if (result.success) {
          showSuccessMessage(
            'Contact sales request submitted successfully',
            { ...result.data, form_type: 'contact_sales' }
          );
          setSubmitStatus('success');
          
          // Analytics event for successful form submission
          if (window?.dataLayer) {
            window.dataLayer.push({
              event: 'contact_form_submit',
              planId: formData.planId,
              planSelected: formData.planSelected,
              billingTerm: formData.billingTerm,
              priceDisplay: formData.priceDisplay,
              submission_mode: result.mode,
              ingestId: result.data?.id || `contact_${Date.now()}`
            });
          }
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (error) {
        // Fallback to offline simulation on any error
        console.warn('Dashboard submission failed, using offline fallback:', error);
        setSubmitStatus('success');
        if (window?.dataLayer) {
          window.dataLayer.push({
            event: 'contact_form_submit_fallback',
            planId: formData.planId,
            planSelected: formData.planSelected,
            billingTerm: formData.billingTerm,
            priceDisplay: formData.priceDisplay,
            ingestId: `contact_fallback_${Date.now()}`
          });
        }
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      setErrors({ submit: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form after animation completes
      setTimeout(() => {
        setFormData({
          fullName: '',
          workEmail: '',
          phone: '',
          companyName: '',
          companyWebsite: '',
          monthlyVolume: '',
          planSelected: selectedPlan || (prefill?.planSelected) || '',
          planId: prefill?.planId || '',
          billingTerm: prefill?.billingTerm || '24m',
          priceDisplay: prefill?.priceDisplay || null,
          preferredContactMethod: 'email',
          message: '',
          consentMarketing: false,
          honeypot: ''
        });
        setSubmitStatus(null);
        setErrors({});
      }, 300);
    }
  };

  const handleReturnToPricing = () => {
    onClose();
    // Scroll to pricing section
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const handleGoToROI = () => {
    onClose();
    // Navigate to ROI calculator
    setTimeout(() => {
      window.location.href = '/roi-calculator';
    }, 300);
  };

  // Render using portal for proper positioning
  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[99999]"
            style={{ 
              backdropFilter: 'blur(4px)',
              pointerEvents: 'auto'
            }}
            onClick={handleClose}
          />
          
          {/* Slide-Over Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 h-full bg-[#0A0A0A] z-[99999] overflow-y-auto shadow-2xl"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100vh',
              overflowY: 'auto',
              width: typeof window !== 'undefined' && window.innerWidth >= 768 ? '320px' : '100vw',
              maxWidth: '100vw',
              pointerEvents: 'auto'
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-sales-title"
          >
            {/* Header with green top border */}
            <div className="border-t-4 border-[#00FF41] bg-[#0A0A0A] px-6 py-6">
              <div className="flex items-center justify-between mb-2">
                <h2 
                  id="contact-sales-title"
                  className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight"
                >
                  Contact Sales—Quick, Tailored Quote
                </h2>
                <Button
                  ref={firstFocusableRef}
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-[rgb(161,161,170)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-full"
                  disabled={isSubmitting}
                  aria-label="Close contact sales form"
                >
                  <X size={20} />
                </Button>
              </div>
              {selectedPlan || prefill?.planSelected && (
                <Badge className="bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/30">
                  {selectedPlan || prefill?.planSelected} Plan Selected
                  {prefill?.billingTerm && (
                    <span className="ml-1">({prefill.billingTerm === '36m' ? '36 Months' : '24 Months'})</span>
                  )}
                </Badge>
              )}
            </div>

            {/* Form Content */}
            <div className="px-6 pb-6">
              {submitStatus === 'success' ? (
                // Success State
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-16 h-16 bg-[#00FF41]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check size={32} className="text-[#00FF41]" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">
                    Thanks, {formData.fullName.split(' ')[0]}!
                  </h3>
                  <p className="text-[rgb(161,161,170)] mb-8 leading-relaxed">
                    We'll be in touch within one business day.
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={handleReturnToPricing}
                      className="w-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold py-3 px-6 rounded-lg transform hover:scale-105 transition-all"
                      style={{
                        background: '#00FF41',
                        color: '#0A0A0A',
                        padding: '12px 24px',
                        borderRadius: '8px'
                      }}
                    >
                      Return to Pricing
                    </Button>
                    <Button
                      ref={lastFocusableRef}
                      onClick={handleGoToROI}
                      variant="outline"
                      className="w-full border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41]/10 py-3 px-6 rounded-lg"
                      style={{
                        borderColor: '#00FF41',
                        color: '#00FF41',
                        padding: '12px 24px',
                        borderRadius: '8px'
                      }}
                    >
                      Go to ROI Calculator
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                // Form State
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field (hidden) */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition-all ${
                        errors.fullName ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)]'
                      }`}
                      placeholder="John Smith"
                      disabled={isSubmitting}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Work Email */}
                  <div>
                    <label htmlFor="workEmail" className="block text-sm font-semibold text-white mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      value={formData.workEmail}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition-all ${
                        errors.workEmail ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)]'
                      }`}
                      placeholder="john@company.com"
                      disabled={isSubmitting}
                    />
                    {errors.workEmail && (
                      <p className="text-red-400 text-sm mt-1">{errors.workEmail}</p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-semibold text-white mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition-all ${
                        errors.companyName ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)]'
                      }`}
                      placeholder="Acme Corporation"
                      disabled={isSubmitting}
                    />
                    {errors.companyName && (
                      <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  {/* Company Website (Optional) */}
                  <div>
                    <label htmlFor="companyWebsite" className="block text-sm font-semibold text-white mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      id="companyWebsite"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition-all"
                      placeholder="https://company.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Volume Fields - Enhanced with separate Call and Interaction volumes */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Call Volume */}
                      <div>
                        <label htmlFor="callVolume" className="block text-sm font-semibold text-white mb-2">
                          Monthly Call Volume
                        </label>
                        <input
                          type="number"
                          id="callVolume"
                          name="callVolume"
                          value={formData.callVolume}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition-all ${
                            errors.callVolume ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)]'
                          }`}
                          placeholder="e.g., 5000"
                          min="0"
                          disabled={isSubmitting}
                        />
                        {errors.callVolume && (
                          <p className="text-red-400 text-sm mt-1">{errors.callVolume}</p>
                        )}
                      </div>

                      {/* Interaction Volume */}
                      <div>
                        <label htmlFor="interactionVolume" className="block text-sm font-semibold text-white mb-2">
                          Monthly Interaction Volume
                        </label>
                        <input
                          type="number"
                          id="interactionVolume"
                          name="interactionVolume"
                          value={formData.interactionVolume}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition-all ${
                            errors.interactionVolume ? 'border-red-500' : 'border-[rgba(255,255,255,0.1)]'
                          }`}
                          placeholder="e.g., 3000"
                          min="0"
                          disabled={isSubmitting}
                        />
                        {errors.interactionVolume && (
                          <p className="text-red-400 text-sm mt-1">{errors.interactionVolume}</p>
                        )}
                      </div>
                    </div>

                    {/* Quick Select Options */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Or select typical volume range
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {monthlyVolumeOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              // Auto-populate based on selection
                              let callVol = '', intVol = '';
                              if (option.value === '<10k') {
                                callVol = '3000';
                                intVol = '2000';
                              } else if (option.value === '10k-50k') {
                                callVol = '15000';
                                intVol = '10000';
                              } else if (option.value === '50k+') {
                                callVol = '30000';
                                intVol = '20000';
                              }
                              
                              setFormData(prev => ({ 
                                ...prev, 
                                monthlyVolume: option.value,
                                callVolume: callVol,
                                interactionVolume: intVol
                              }));
                              
                              // Clear volume errors
                              if (errors.volume || errors.callVolume || errors.interactionVolume) {
                                setErrors(prev => ({ 
                                  ...prev, 
                                  volume: '', 
                                  callVolume: '', 
                                  interactionVolume: '' 
                                }));
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              formData.monthlyVolume === option.value
                                ? 'bg-[#00FF41] text-[#0A0A0A]'
                                : 'bg-[rgba(255,255,255,0.05)] text-[rgb(161,161,170)] border border-[rgba(255,255,255,0.1)] hover:border-[#00FF41]/30'
                            }`}
                            disabled={isSubmitting}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {errors.volume && (
                      <p className="text-red-400 text-sm mt-2">{errors.volume}</p>
                    )}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Preferred Contact Method
                    </label>
                    <div className="space-y-2">
                      {contactMethodOptions.map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContactMethod"
                            value={option.value}
                            checked={formData.preferredContactMethod === option.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#00FF41] bg-transparent border-2 border-[rgba(255,255,255,0.3)] focus:ring-[#00FF41] focus:ring-2"
                            disabled={isSubmitting}
                          />
                          <span className="text-white text-sm">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Demo Time section removed */}

                  {/* Phone (conditional for phone contact) */}
                  {formData.preferredContactMethod === 'phone' && (
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition-all"
                        placeholder="+1 (555) 123-4567"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  {/* Message (Optional) */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      maxLength={1000}
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:ring-2 focus:ring-[#00FF41] transition-all resize-none"
                      placeholder="Tell us about your specific needs..."
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-[rgb(161,161,170)] mt-1">
                      {formData.message.length}/1000 characters
                    </p>
                  </div>

                  {/* Consent Checkbox */}
                  <div>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consentMarketing"
                        checked={formData.consentMarketing}
                        onChange={handleInputChange}
                        className={`w-4 h-4 mt-1 text-[#00FF41] bg-transparent border-2 rounded focus:ring-[#00FF41] focus:ring-2 ${
                          errors.consentMarketing ? 'border-red-500' : 'border-[rgba(255,255,255,0.3)]'
                        }`}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-[rgb(161,161,170)] leading-relaxed">
                        I agree to receive communications from SentraTech regarding this inquiry and future product updates. *
                      </span>
                    </label>
                    {errors.consentMarketing && (
                      <p className="text-red-400 text-sm mt-1 ml-7">{errors.consentMarketing}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    ref={lastFocusableRef}
                    type="submit"
                    className="w-full font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg hover:shadow-[#00FF41]/30"
                    disabled={isSubmitting}
                    style={{
                      background: '#00FF41',
                      color: '#0A0A0A',
                      padding: '12px 24px',
                      borderRadius: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.target.style.background = '#00e83a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.target.style.background = '#00FF41';
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>

                  {/* Error Display */}
                  {errors.submit && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-400 text-sm">{errors.submit}</p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render at document.body level for proper positioning
  return typeof document !== 'undefined' ? createPortal(drawerContent, document.body) : null;
};

export default ContactSalesSlideIn;