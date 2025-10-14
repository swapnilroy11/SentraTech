import React, { useState } from 'react';
import { X, Upload, File, CheckCircle, AlertCircle, MapPin, Globe } from 'lucide-react';
import { FORM_CONFIG } from '../config/formConfig';

const JobApplicationModal = ({ isOpen, onClose, job }) => {
  const [formData, setFormData] = useState({
    // REQUIRED FIELDS
    full_name: '',
    email: '',
    location: '',
    work_authorization: '',
    
    // RECOMMENDED FIELDS
    phone: '',
    position_applied: '',
    experience_level: '',
    motivation: '',
    resume_url: '',
    start_date: '',
    consent_for_storage: false,
    
    // OPTIONAL FIELDS
    portfolio_website: '',
    cover_letter: '',
    work_shifts: '',
    relevant_experience: ''
  });

  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      // REQUIRED FIELDS
      full_name: '',
      email: '',
      location: '',
      work_authorization: '',
      
      // RECOMMENDED FIELDS
      phone: '',
      position_applied: '',
      experience_level: '',
      motivation: '',
      resume_url: '',
      start_date: '',
      consent_for_storage: false,
      
      // OPTIONAL FIELDS
      portfolio_website: '',
      cover_letter: '',
      work_shifts: '',
      relevant_experience: ''
    });
    setResume(null);
    setErrors({});
    setSubmitStatus(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        resume: 'Please upload a PDF or Word document'
      }));
      return;
    }
    
    // Validate file size (8MB max)
    if (file.size > 8 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        resume: 'File size must be less than 8MB'
      }));
      return;
    }
    
    setResume(file);
    setErrors(prev => ({
      ...prev,
      resume: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // REQUIRED FIELDS validation
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.work_authorization.trim()) newErrors.work_authorization = 'Work authorization status is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // RECOMMENDED FIELDS validation
    if (!formData.consent_for_storage) {
      newErrors.consent_for_storage = 'You must consent to data storage to proceed';
    }
    
    // Resume or portfolio validation
    if (!resume && !formData.portfolio_website.trim()) {
      newErrors.resume = 'Please upload a resume or provide portfolio website';
      newErrors.portfolio_website = 'Please upload a resume or provide portfolio website';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateConfig = () => {
    // Basic validation - in a real app, this would check if dashboard config is properly loaded
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitStatus(null);
    
    try {
      // Validate dashboard configuration
      if (!validateConfig()) {
        throw new Error('Dashboard configuration validation failed');
      }
      
      // Call the new submitApplication function directly with the form event
      await submitApplication(e);
      
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (submitStatus === 'submitting') {
      console.warn('⚠️ Job application submission already in progress');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get FormData from the form
      const formData = new FormData(e.target);
      const data = {};

      // Loop through all fields except file
      for (let pair of formData.entries()) {
        if (pair[0] !== 'resume_url') {
          data[pair[0]] = pair[1];
        }
      }
      
      // Handle resume file
      const resumeFile = formData.get('resume_url');
      if (resumeFile && resumeFile.size > 0) {
        const base64 = await fileToBase64(resumeFile);
        data.resume = {
          name: resumeFile.name,
          type: resumeFile.type,
          data: base64.split(',')[1] // Remove "data:application/pdf;base64," prefix
        };
      }

      // Submit to backend dashboard
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const dashboardData = {
        full_name: data.full_name,
        email: data.email,
        location: data.location,
        work_authorization: data.work_authorization,
        phone: data.phone || '',
        position_applied: data.position_applied || 'Customer Support Specialist',
        experience_level: data.experience_level || '',
        start_date: data.start_date || '',
        motivation: data.motivation || '',
        resume_url: data.resume ? `Resume file: ${data.resume.name}` : '',
        portfolio_website: data.portfolio_website || '',
        work_shifts: data.work_shifts || '',
        relevant_experience: data.relevant_experience || '',
        cover_letter: data.cover_letter || '',
        consent_for_storage: data.consent_for_storage === 'Yes',
        id: data.id,
        timestamp: new Date().toISOString(),
        source: data.source
      };

      const response = await fetch(`${backendUrl}/api/proxy/job-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(dashboardData)
      });

      const result = await response.json();

      if (response.ok && result.success !== false) {
        console.log('✅ Job application submitted successfully to Dashboard:', {
          applicant: data.full_name,
          email: data.email,
          position: data.position_applied,
          dashboard: 'submitted'
        });
        
        setSubmitStatus('success');
        setErrors({});
        
        if (window?.dataLayer) {
          window.dataLayer.push({
            event: "job_application_submit",
            position: data.position_applied,
            source: 'careers_modal',
            location: data.location
          });
        }
        
        // Auto-close after short delay
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2500);
      } else {
        console.error('❌ Job application submission failed:', result);
        setSubmitStatus('error');
        setErrors({ general: result.error || 'Submission failed. Please try again.' });
      }
      
    } catch (error) {
      console.error('💥 Job application submission error:', error);
      setSubmitStatus('error');
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgb(63,63,63)]">
          <div>
            <h2 className="text-xl font-bold text-white">Apply for Position</h2>
            {job && (
              <p className="text-[rgb(161,161,170)] text-sm mt-1">{job.title}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-[rgb(38,40,42)] rounded-lg transition-colors"
          >
            <X size={20} className="text-[rgb(161,161,170)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* REQUIRED FIELDS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Required Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Full Name *
                </label>
                <input
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.full_name ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41]`}
                  placeholder="Enter your full name"
                  required
                  disabled={isSubmitting}
                />
                {errors.full_name && (
                  <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.email ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41]`}
                  placeholder="your.email@example.com"
                  required
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)]" />
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-[rgb(38,40,42)] border ${errors.location ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41]`}
                    placeholder="City/Location"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-400 text-xs mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Work Authorization *
                </label>
                <select
                  name="work_authorization"
                  value={formData.work_authorization}
                  onChange={(e) => handleInputChange('work_authorization', e.target.value)}
                  className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.work_authorization ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white focus:outline-none focus:border-[#00FF41]`}
                  disabled={isSubmitting}
                >
                  <option value="">Select work authorization</option>
                  <option value="Bangladeshi Citizen">Bangladeshi Citizen</option>
                  <option value="Work Permit Holder">Work Permit Holder</option>
                  <option value="Student Visa">Student Visa</option>
                  <option value="Other">Other</option>
                </select>
                {errors.work_authorization && (
                  <p className="text-red-400 text-xs mt-1">{errors.work_authorization}</p>
                )}
              </div>
            </div>
          </div>

          {/* RECOMMENDED FIELDS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Professional Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41]"
                  placeholder="+880 1XXX XXXXXX"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Position Applied For
                </label>
                <input
                  name="position_applied"
                  type="text"
                  value={formData.position_applied}
                  onChange={(e) => handleInputChange('position_applied', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41]"
                  placeholder={job?.title || "Customer Support Specialist"}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Experience Level
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={(e) => handleInputChange('experience_level', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41]"
                  disabled={isSubmitting}
                >
                  <option value="">Select experience level</option>
                  <option value="Fresh Graduate">Fresh Graduate</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-3 years">2-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Available Start Date
                </label>
                <input
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41]"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                Why do you want to join SentraTech?
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41] resize-none"
                placeholder="Tell us why you're interested in working with us..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* RESUME & PORTFOLIO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resume & Portfolio</h3>
            <p className="text-sm text-[rgb(161,161,170)]">
              Please provide either a resume file OR a portfolio website (at least one is required)
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Resume/CV Upload *
                </label>
                <input
                  name="resume_url"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.resume ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00FF41] file:text-black hover:file:bg-[#00e83a]`}
                  required
                  disabled={isSubmitting}
                />
                {errors.resume && (
                  <p className="text-red-400 text-xs mt-1">{errors.resume}</p>
                )}
                <p className="text-xs text-[rgb(161,161,170)] mt-1">
                  Upload PDF, DOC, or DOCX file (max 8MB). File will be automatically uploaded to your application.
                </p>
              </div>

              {/* Portfolio Website */}
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Portfolio/Website URL
                </label>
                <div className="relative">
                  <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)]" />
                  <input
                    name="portfolio_website"
                    type="url"
                    value={formData.portfolio_website}
                    onChange={(e) => handleInputChange('portfolio_website', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-[rgb(38,40,42)] border ${errors.portfolio_website ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41]`}
                    placeholder="https://yourportfolio.com or LinkedIn profile"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.portfolio_website && (
                  <p className="text-red-400 text-xs mt-1">{errors.portfolio_website}</p>
                )}
              </div>
            </div>
          </div>

          {/* OPTIONAL FIELDS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Additional Information (Optional)</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Preferred Work Shifts
                </label>
                <select
                  name="work_shifts"
                  value={formData.work_shifts}
                  onChange={(e) => handleInputChange('work_shifts', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41]"
                  disabled={isSubmitting}
                >
                  <option value="">Select preferred shifts</option>
                  <option value="morning">Morning (6 AM - 2 PM)</option>
                  <option value="afternoon">Afternoon (2 PM - 10 PM)</option>
                  <option value="night">Night (10 PM - 6 AM)</option>
                  <option value="flexible">Flexible / Rotational</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Relevant Work Experience
                </label>
                <input
                  name="relevant_experience"
                  type="text"
                  value={formData.relevant_experience}
                  onChange={(e) => handleInputChange('relevant_experience', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41]"
                  placeholder="Brief description of relevant experience"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                Cover Letter
              </label>
              <textarea
                name="cover_letter"
                value={formData.cover_letter}
                onChange={(e) => handleInputChange('cover_letter', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41] resize-none"
                placeholder="Optional cover letter or additional notes..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* CONSENT SECTION */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Consent & Agreement</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  name="consent_for_storage"
                  type="checkbox"
                  id="consent-storage"
                  value="Yes"
                  checked={formData.consent_for_storage}
                  onChange={(e) => handleInputChange('consent_for_storage', e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#00FF41] bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded focus:ring-[#00FF41] focus:ring-2"
                  disabled={isSubmitting}
                />
                <label htmlFor="consent-storage" className="text-sm text-[rgb(218,218,218)] leading-relaxed">
                  <span className="text-red-400">*</span> I consent to SentraTech storing my personal information for recruitment purposes. 
                  I understand my data will be processed according to the privacy policy and I can request deletion at any time.
                </label>
              </div>
              {errors.consent_for_storage && (
                <p className="text-red-400 text-xs">{errors.consent_for_storage}</p>
              )}
            </div>
            
            <p className="text-xs text-[rgb(161,161,170)] mt-4">
              By submitting this application, you acknowledge that your information will be stored in our recruitment database and may be used to contact you about this position and future opportunities at SentraTech.</p>
          </div>

          {/* Hidden Fields */}
          <input name="id" type="hidden" value={`job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`} />
          <input name="source" type="hidden" value="website" />

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle size={18} className="text-green-400" />
              <p className="text-green-400 text-sm">
                Application submitted successfully to our database! We'll review your application and get back to you within 7-10 business days.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle size={18} className="text-red-400" />
              <p className="text-red-400 text-sm">
                Something went wrong. Please try again or email your application to careers@sentratech.net
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-transparent border border-[rgb(63,63,63)] text-[rgb(218,218,218)] rounded-lg hover:bg-[rgb(38,40,42)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="flex-1 px-6 py-3 bg-[#00FF41] text-black font-semibold rounded-lg hover:bg-[#00e83a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;