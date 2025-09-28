import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, MapPin, Clock, Users, CheckCircle, AlertCircle, Upload, File, Linkedin, Send, Award, Globe } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SEOManager from '../components/SEOManager';
import { DASHBOARD_CONFIG, validateConfig } from '../config/dashboardConfig';

const JobApplicationPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    
    // Professional Information
    linkedinProfile: '',
    portfolioWebsite: '',
    preferredShifts: '',
    availabilityStartDate: '',
    
    // Experience & Motivation
    relevantExperience: '',
    whySentraTech: '',
    coverLetter: '',
    
    // Legal
    workAuthorization: '',
    consentForStorage: false,
    consentForContact: false
  });

  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Job data - in a real app this would come from an API
  const jobData = {
    'customer-support-specialist': {
      title: 'Customer Support Specialist (English-Fluent)',
      department: 'Customer Support',
      location: 'Dhaka (Hybrid) or Remote — Bangladesh',
      type: 'Full-time',
      salary: 'Competitive',
      experience: '0-1+ years (Fresh graduates welcome)',
      education: 'Any degree/background',
      shortDescription: 'Join SentraTech as a Customer Support Specialist and become the human bridge between AI and customer satisfaction. Work with cutting-edge technology while developing your career in the AI revolution.',
      
      aboutRole: 'At SentraTech, you won\'t just be answering calls – you\'ll be training the future of AI customer support. As our Customer Support Specialist, you\'ll handle the complex cases that require human empathy and intelligence, while contributing to the evolution of our AI systems. This is a unique opportunity to be at the forefront of the AI customer experience revolution.',
      
      whatMakesUsSpecial: [
        'Work directly with AI systems and contribute to their training – rare opportunity to shape AI development',
        'Comprehensive English communication training and certification programs',
        'Career growth path from Specialist → Senior → Team Lead → Manager in 12-18 months',
        'Learning stipend for courses, certifications, and skill development',
        'Flexible hybrid work with modern office facilities in Dhaka',
        'Direct mentorship from senior tech professionals and founders',
        'Performance bonuses and fast-track promotion opportunities',
        'Exposure to enterprise clients and international business practices'
      ],
      
      requirements: {
        must_have: [
          'Fluent English communication (spoken & written) - We provide assessment and training',
          'Strong empathy and customer-focused mindset',
          'Basic computer literacy and willingness to learn new tools',
          'Reliable internet connection and quiet workspace',
          'Flexibility for rotational shifts (we provide shift premiums)'
        ],
        preferred: [
          '0-1+ years in customer service, BPO, or related field (fresh graduates encouraged)',
          'Experience with any CRM or ticketing system',
          'Interest in technology and AI applications',
          'Additional language skills (Hindi, Urdu) - bonus but not required'
        ],
        education: [
          'Any bachelor\'s degree or equivalent experience',
          'HSC/A-levels with strong English background acceptable',
          'We value attitude and communication skills over formal qualifications'
        ]
      },
      
      responsibilities: [
        'Handle escalated customer interactions that require human intelligence and empathy',
        'Resolve complex queries using SentraTech\'s AI-assisted tools and platforms',
        'Provide feedback to AI development team to improve automated responses',
        'Document customer interactions and contribute to knowledge base development',
        'Achieve customer satisfaction targets while maintaining quality standards',
        'Collaborate with international clients and internal teams',
        'Participate in training programs and skill development initiatives',
        'Support quality assurance and process improvement initiatives'
      ],
      
      growthPath: [
        'Month 1-3: Comprehensive training on SentraTech systems and AI tools',
        'Month 4-6: Handle independent cases and contribute to AI training',
        'Month 7-12: Mentor new joiners and take on specialized responsibilities',
        'Year 2+: Opportunities for team leadership, training roles, or technical specialization'
      ],
      
      workEnvironment: 'Modern, collaborative environment where your voice matters. Work alongside AI researchers, product developers, and international teams. Hybrid flexibility with state-of-the-art office facilities.'
    }
  };

  const job = jobData[jobId] || jobData['customer-support-specialist'];

  const steps = [
    { number: 1, title: 'Personal Information', description: 'Basic contact details' },
    { number: 2, title: 'Professional Background', description: 'Experience and skills' },
    { number: 3, title: 'Motivation & Fit', description: 'Why SentraTech?' },
    { number: 4, title: 'Review & Submit', description: 'Final review' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document' }));
      return;
    }
    
    if (file.size > 8 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resume: 'File size must be less than 8MB' }));
      return;
    }
    
    setResume(file);
    setErrors(prev => ({ ...prev, resume: null }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (step === 2) {
      if (!resume && !formData.linkedinProfile.trim()) {
        newErrors.resume = 'Please upload a resume or provide LinkedIn profile';
        newErrors.linkedinProfile = 'Please upload a resume or provide LinkedIn profile';
      }
    }
    
    if (step === 3) {
      if (!formData.whySentraTech.trim()) {
        newErrors.whySentraTech = 'Please tell us why you want to join SentraTech';
      }
    }
    
    if (step === 4) {
      if (!formData.consentForStorage) newErrors.consentForStorage = 'You must consent to data processing';
      if (!formData.workAuthorization) newErrors.workAuthorization = 'Work authorization status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      if (!validateConfig()) {
        throw new Error('Configuration validation failed');
      }
      
      const submissionData = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location,
        linkedinProfile: formData.linkedinProfile || null,
        portfolioWebsite: formData.portfolioWebsite || null,
        preferredShifts: formData.preferredShifts || null,
        availabilityStartDate: formData.availabilityStartDate || null,
        relevantExperience: formData.relevantExperience || null,
        whySentraTech: formData.whySentraTech,
        coverNote: formData.coverLetter || null,
        workAuthorization: formData.workAuthorization,
        position: job.title,
        source: 'careers_application_page',
        consentForStorage: formData.consentForStorage,
        consentForContact: formData.consentForContact
      };
      
      if (resume) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          submissionData.resumeFile = {
            data: reader.result.split(',')[1],
            name: resume.name,
            type: resume.type,
            size: resume.size
          };
          await submitApplication(submissionData);
        };
        reader.readAsDataURL(resume);
      } else {
        await submitApplication(submissionData);
      }
      
    } catch (error) {
      console.error('Application submission error:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const submitApplication = async (data) => {
    try {
      const response = await fetch(`${DASHBOARD_CONFIG.BACKEND_URL}/api/ingest/job_applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-INGEST-KEY': DASHBOARD_CONFIG.INGEST_KEY
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        
        if (window && window.dataLayer) {
          window.dataLayer.push({
            event: "job_application_submit",
            position: data.position,
            source: data.source,
            location: data.location,
            hasResume: !!data.resumeFile,
            hasLinkedin: !!data.linkedinProfile
          });
        }
        
        setTimeout(() => {
          navigate('/careers', { state: { applicationSubmitted: true } });
        }, 3000);
        
      } else {
        throw new Error('Application submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoData = {
    title: `Apply for ${job.title} - SentraTech Careers`,
    description: `Apply for ${job.title} position at SentraTech. Join our team building the future of AI-powered customer support.`,
    keywords: 'SentraTech job application, customer support jobs, AI startup careers',
    noIndex: true // Don't index application pages
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
              <p className="text-[rgb(161,161,170)] mb-6">Let's start with your basic contact information.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.firstName ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.lastName ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.email ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors"
                  placeholder="+880 1XXX XXXXXX"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)]" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[rgb(38,40,42)] border ${errors.location ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors`}
                  placeholder="Dhaka, Bangladesh"
                />
              </div>
              {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Professional Background</h3>
              <p className="text-[rgb(161,161,170)] mb-6">Share your professional experience and online presence.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Resume/CV
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.resume ? 'border-red-500' : 'border-[rgb(63,63,63)]'} border-dashed rounded-lg cursor-pointer hover:border-[#00FF41] transition-colors flex flex-col items-center space-y-2`}
                  >
                    {resume ? (
                      <>
                        <File size={20} className="text-[#00FF41]" />
                        <span className="text-sm text-white">{resume.name}</span>
                        <span className="text-xs text-[rgb(161,161,170)]">
                          {(resume.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} className="text-[rgb(161,161,170)]" />
                        <span className="text-sm text-[rgb(161,161,170)]">Upload Resume (PDF/Word)</span>
                        <span className="text-xs text-[rgb(161,161,170)]">Max 8MB</span>
                      </>
                    )}
                  </label>
                </div>
                {errors.resume && <p className="text-red-400 text-xs mt-1">{errors.resume}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)]" />
                  <input
                    type="url"
                    value={formData.linkedinProfile}
                    onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-[rgb(38,40,42)] border ${errors.linkedinProfile ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors`}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                {errors.linkedinProfile && <p className="text-red-400 text-xs mt-1">{errors.linkedinProfile}</p>}
                <p className="text-xs text-[rgb(161,161,170)] mt-1">
                  Provide either resume or LinkedIn profile (at least one required)
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Portfolio/Website
                </label>
                <input
                  type="url"
                  value={formData.portfolioWebsite}
                  onChange={(e) => handleInputChange('portfolioWebsite', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors"
                  placeholder="https://yourwebsite.com (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Preferred Work Shifts
                </label>
                <select
                  value={formData.preferredShifts}
                  onChange={(e) => handleInputChange('preferredShifts', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41]"
                >
                  <option value="">Select preferred shifts</option>
                  <option value="morning">Morning (6 AM - 2 PM)</option>
                  <option value="afternoon">Afternoon (2 PM - 10 PM)</option>
                  <option value="night">Night (10 PM - 6 AM)</option>
                  <option value="flexible">Flexible / Rotational</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Availability Start Date
                </label>
                <input
                  type="date"
                  value={formData.availabilityStartDate}
                  onChange={(e) => handleInputChange('availabilityStartDate', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Years of Relevant Experience
                </label>
                <select
                  value={formData.relevantExperience}
                  onChange={(e) => handleInputChange('relevantExperience', e.target.value)}
                  className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41]"
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Motivation & Fit</h3>
              <p className="text-[rgb(161,161,170)] mb-6">Help us understand why you're excited about joining SentraTech.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                Why do you want to join SentraTech? *
              </label>
              <textarea
                value={formData.whySentraTech}
                onChange={(e) => handleInputChange('whySentraTech', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.whySentraTech ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors resize-none`}
                placeholder="Tell us what excites you about our mission, technology, or culture..."
              />
              {errors.whySentraTech && <p className="text-red-400 text-xs mt-1">{errors.whySentraTech}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                Cover Letter / Additional Notes
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg text-white focus:outline-none focus:border-[#00FF41] transition-colors resize-none"
                placeholder="Share more about your English proficiency, relevant experience, achievements, or anything else you'd like us to know..."
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Review & Submit</h3>
              <p className="text-[rgb(161,161,170)] mb-6">Please review your application and complete the final requirements.</p>
            </div>
            
            {/* Application Summary */}
            <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Application Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-[rgb(161,161,170)] font-medium">Name:</span>
                  <span className="text-white break-words">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-[rgb(161,161,170)] font-medium">Email:</span>
                  <span className="text-white break-all">{formData.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-[rgb(161,161,170)] font-medium">Location:</span>
                  <span className="text-white break-words">{formData.location}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-[rgb(161,161,170)] font-medium">Resume:</span>
                  <span className="text-white break-words">{resume ? resume.name : 'Not provided'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-[rgb(161,161,170)] font-medium">LinkedIn:</span>
                  <span className="text-white break-all">{formData.linkedinProfile || 'Not provided'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-[rgb(161,161,170)] font-medium">Experience:</span>
                  <span className="text-white">{formData.relevantExperience || '0-1'}</span>
                </div>
              </div>
            </div>
            
            {/* Legal Requirements */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(218,218,218)] mb-2">
                  Work Authorization *
                </label>
                <select
                  value={formData.workAuthorization}
                  onChange={(e) => handleInputChange('workAuthorization', e.target.value)}
                  className={`w-full px-4 py-3 bg-[rgb(38,40,42)] border ${errors.workAuthorization ? 'border-red-500' : 'border-[rgb(63,63,63)]'} rounded-lg text-white focus:outline-none focus:border-[#00FF41]`}
                >
                  <option value="">Select work authorization status</option>
                  <option value="citizen">Bangladeshi Citizen</option>
                  <option value="permanent_resident">Permanent Resident</option>
                  <option value="work_permit">Work Permit Holder</option>
                  <option value="other">Other (please specify in cover letter)</option>
                </select>
                {errors.workAuthorization && <p className="text-red-400 text-xs mt-1">{errors.workAuthorization}</p>}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent-storage"
                    checked={formData.consentForStorage}
                    onChange={(e) => handleInputChange('consentForStorage', e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#00FF41] bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded focus:ring-[#00FF41] focus:ring-2 flex-shrink-0"
                  />
                  <label htmlFor="consent-storage" className="text-sm text-[rgb(218,218,218)] leading-relaxed">
                    I consent to SentraTech storing and processing my personal information for 
                    recruitment purposes. I understand my data will be handled according to the 
                    privacy policy and I can request deletion at any time. *
                  </label>
                </div>
                {errors.consentForStorage && <p className="text-red-400 text-xs ml-7">{errors.consentForStorage}</p>}
                
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent-contact"
                    checked={formData.consentForContact}
                    onChange={(e) => handleInputChange('consentForContact', e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#00FF41] bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded focus:ring-[#00FF41] focus:ring-2 flex-shrink-0"
                  />
                  <label htmlFor="consent-contact" className="text-sm text-[rgb(218,218,218)] leading-relaxed">
                    I agree to be contacted by SentraTech regarding this application and future 
                    opportunities that may be of interest.
                  </label>
                </div>
              </div>
            </div>
            
            {/* Submit Status */}
            {submitStatus === 'success' && (
              <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle size={18} className="text-green-400" />
                <div>
                  <p className="text-green-400 text-sm font-medium">Application submitted successfully!</p>
                  <p className="text-green-400 text-xs">We'll review your application and get back to you within 7-10 business days.</p>
                </div>
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
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <SEOManager {...seoData} />
      
      <div className="min-h-screen bg-[rgb(8,8,8)]">
        {/* Header */}
        <div className="border-b border-[rgb(63,63,63)] bg-[rgb(13,13,13)]">
          <div className="container mx-auto max-w-6xl px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/careers"
                  className="p-2 hover:bg-[rgb(38,40,42)] rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} className="text-[rgb(161,161,170)]" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">Apply for Position</h1>
                  <p className="text-[rgb(161,161,170)] text-sm">{job.title}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-[rgb(161,161,170)]">Step {currentStep} of {steps.length}</div>
                <div className="text-xs text-[#00FF41]">{steps[currentStep - 1]?.title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[rgb(13,13,13)] border-b border-[rgb(63,63,63)]">
          <div className="container mx-auto max-w-6xl px-6 py-4">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.number 
                      ? 'bg-[#00FF41] text-black'
                      : currentStep === step.number
                      ? 'bg-[#00FF41] text-black'
                      : 'bg-[rgb(38,40,42)] text-[rgb(161,161,170)]'
                  }`}>
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-white' : 'text-[rgb(161,161,170)]'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-[rgb(161,161,170)]">{step.description}</div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-12 h-px mx-4 ${
                      currentStep > step.number ? 'bg-[#00FF41]' : 'bg-[rgb(63,63,63)]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-[rgb(13,13,13)] to-[rgb(8,8,8)]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Job Overview */}
              <div className="lg:col-span-2 space-y-8">
                {/* About This Role */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">About This Role</h2>
                  <p className="text-[rgb(218,218,218)] text-lg leading-relaxed">{job.aboutRole}</p>
                </div>
                
                {/* What Makes Us Special */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Why Choose SentraTech?</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {job.whatMakesUsSpecial?.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-lg">
                        <CheckCircle size={20} className="text-[#00FF41] flex-shrink-0 mt-0.5" />
                        <span className="text-[rgb(218,218,218)] leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Requirements */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">What We're Looking For</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                        <CheckCircle size={18} className="text-[#00FF41]" />
                        <span>Must Have</span>
                      </h3>
                      <ul className="space-y-2">
                        {job.requirements?.must_have?.map((req, index) => (
                          <li key={index} className="text-[rgb(218,218,218)] leading-relaxed flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full mt-2 flex-shrink-0"></span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                        <Users size={18} className="text-blue-400" />
                        <span>Preferred</span>
                      </h3>
                      <ul className="space-y-2">
                        {job.requirements?.preferred?.map((req, index) => (
                          <li key={index} className="text-[rgb(161,161,170)] text-sm leading-relaxed flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                        <Award size={18} className="text-yellow-400" />
                        <span>Education</span>
                      </h3>
                      <ul className="space-y-2">
                        {job.requirements?.education?.map((req, index) => (
                          <li key={index} className="text-[rgb(161,161,170)] text-sm leading-relaxed flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Responsibilities */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Your Responsibilities</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {job.responsibilities?.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full text-xs text-[#00FF41] font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-[rgb(161,161,170)] text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Growth Path */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Your Growth Journey</h2>
                  <div className="space-y-4">
                    {job.growthPath?.map((stage, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#00FF41] text-black rounded-full text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-[rgb(218,218,218)] text-sm leading-relaxed">{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Work Environment */}
                <div className="bg-gradient-to-r from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Globe size={24} className="text-[#00FF41]" />
                    <span>Work Environment</span>
                  </h2>
                  <p className="text-[rgb(161,161,170)] leading-relaxed">{job.workEnvironment}</p>
                </div>
              </div>
              
              {/* Application CTA Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-8 sticky top-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase size={24} className="text-[#00FF41]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Apply?</h3>
                    <p className="text-[rgb(161,161,170)] text-sm">Join our team and help shape the future of AI-powered customer support.</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[rgb(161,161,170)] text-sm">Position</span>
                      <span className="text-white text-sm font-medium">Customer Support</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[rgb(161,161,170)] text-sm">Experience</span>
                      <span className="text-white text-sm font-medium">{job.experience}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[rgb(161,161,170)] text-sm">Education</span>
                      <span className="text-white text-sm font-medium">{job.education}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[rgb(161,161,170)] text-sm">Location</span>
                      <span className="text-white text-sm font-medium">Dhaka/Remote</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[rgb(161,161,170)] text-sm">Salary</span>
                      <span className="text-white text-sm font-medium">{job.salary}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const applicationSection = document.getElementById('application-form');
                      applicationSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full px-6 py-4 bg-[#00FF41] text-black font-semibold rounded-lg hover:bg-[#00e83a] transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Start Application</span>
                    <ArrowRight size={18} />
                  </button>
                  
                  <p className="text-xs text-[rgb(161,161,170)] text-center mt-4">
                    Application takes 5-10 minutes to complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div id="application-form" className="container mx-auto max-w-6xl px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Information Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6 sticky top-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase size={20} className="text-[#00FF41]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white break-words">{job.title}</h3>
                    <p className="text-sm text-[rgb(161,161,170)]">{job.department}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPin size={16} className="text-[#00FF41] flex-shrink-0 mt-0.5" />
                    <span className="text-[rgb(218,218,218)] break-words">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-[#00FF41] flex-shrink-0" />
                    <span className="text-[rgb(218,218,218)]">{job.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-[#00FF41] flex-shrink-0" />
                    <span className="text-[rgb(218,218,218)]">Salary: {job.salary}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-[rgb(63,63,63)]">
                  <p className="text-xs text-[rgb(161,161,170)] leading-relaxed">
                    {job.shortDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <div className="bg-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6 lg:p-8">
                <div className="max-w-full overflow-hidden">
                  {renderStep()}
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-[rgb(63,63,63)] mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-6 py-3 bg-transparent border border-[rgb(63,63,63)] text-[rgb(218,218,218)] rounded-lg hover:bg-[rgb(38,40,42)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {currentStep < steps.length ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-[#00FF41] text-black font-semibold rounded-lg hover:bg-[#00e83a] transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowLeft size={16} className="rotate-180" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || submitStatus === 'success'}
                      className="px-6 py-3 bg-[#00FF41] text-black font-semibold rounded-lg hover:bg-[#00e83a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Send size={16} />
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default JobApplicationPage;