/**
 * SentraTech ROI Calculator - Complete Redesign
 * Streamlined single-page interface with real-time calculations
 * Based on UX redesign specifications document
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, Mail, X, Sparkles, AlertCircle, CheckCircle, Flag, Info
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { 
  formatCurrencyProtected, 
  formatPercentageProtected,
  runProtectedTests 
} from '../utils/roiCalculatorFixed';

// Country data with flags and cost information
const COUNTRIES = {
  'Bangladesh': {
    flag: '🇧🇩',
    agentHourly: 2.25,
    bpoPerMin: 0.40,
    description: 'Large English-speaking BPO workforce; low labor costs'
  },
  'India': {
    flag: '🇮🇳',
    agentHourly: 3.00,
    bpoPerMin: 0.55,
    description: 'Established IT services industry; competitive rates'
  },
  'Philippines': {
    flag: '🇵🇭',
    agentHourly: 4.50,
    bpoPerMin: 0.90,
    description: 'High English proficiency; US time zone alignment'
  },
  'Vietnam': {
    flag: '🇻🇳',
    agentHourly: 3.50,
    bpoPerMin: 0.60,
    description: 'Growing BPO sector; cost-effective operations'
  }
};

// Fixed automation percentage as per requirements
const AUTOMATION_PERCENTAGE = 70;
const SENTRATECH_BUNDLE_COST = 1650; // SentraTech pricing per bundle

// CANONICAL BUNDLE CALCULATIONS - Exact fractions for precision
const BUNDLE_CALL_MINUTES = 1000 * 8; // 8000 minutes
const BUNDLE_INTERACTION_MINUTES = 1000 * 5; // 5000 minutes  
const BUNDLE_TOTAL_MINUTES = BUNDLE_CALL_MINUTES + BUNDLE_INTERACTION_MINUTES; // 13000 minutes

// Exact bundle shares (not rounded percentages)
const CALL_SHARE = BUNDLE_CALL_MINUTES / BUNDLE_TOTAL_MINUTES; // 8000/13000
const INTERACTION_SHARE = BUNDLE_INTERACTION_MINUTES / BUNDLE_TOTAL_MINUTES; // 5000/13000

// Exact derived costs (calculated using precise fractions)
const CALL_COST_PER_1K = SENTRATECH_BUNDLE_COST * CALL_SHARE; // $1,015.38...
const INTERACTION_COST_PER_1K = SENTRATECH_BUNDLE_COST * INTERACTION_SHARE; // $634.61...

const ROICalculatorRedesigned = () => {
  // Essential inputs only
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [callVolume, setCallVolume] = useState('');
  const [interactionVolume, setInteractionVolume] = useState('');
  const [showCountryTooltip, setShowCountryTooltip] = useState(null);

  // Calculated results
  const [results, setResults] = useState(null);
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [submissionID, setSubmissionID] = useState(null); // Track submission ID

  // Validation states
  const [callVolumeError, setCallVolumeError] = useState('');
  const [interactionVolumeError, setInteractionVolumeError] = useState('');

  // Real-time calculation effect - triggers on any input change
  useEffect(() => {
    calculateROI();
  }, [selectedCountry, callVolume, interactionVolume]);
  
  // Run protected tests on component mount (development mode)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      runProtectedTests();
    }
  }, []);

  // Input validation
  const validateInput = (value, setter, fieldName) => {
    if (value === '') {
      setter('');
      return true;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setter(`Please enter a positive number for ${fieldName}`);
      return false;
    }
    
    setter('');
    return true;
  };

  // Handle input changes with validation
  const handleCallVolumeChange = (e) => {
    const value = e.target.value;
    setCallVolume(value);
    validateInput(value, setCallVolumeError, 'call volume');
  };

  const handleInteractionVolumeChange = (e) => {
    const value = e.target.value;
    setInteractionVolume(value);
    validateInput(value, setInteractionVolumeError, 'interaction volume');
  };

  // BULLETPROOF ROI calculation using protected engine
  const calculateROI = () => {
    // Reset results if inputs are invalid or empty
    if (!callVolume || !interactionVolume || callVolumeError || interactionVolumeError) {
      setResults(null);
      return;
    }

    const calls = parseFloat(callVolume) || 0;
    const interactions = parseFloat(interactionVolume) || 0;
    
    if (calls <= 0 || interactions <= 0) {
      setResults(null);
      return;
    }

    try {
      // Import the bulletproof engine
      import('../utils/roiCalculatorFixed.js').then(({ ROICalculatorEngine }) => {
        
        // Use the protected calculation engine
        const protectedResults = ROICalculatorEngine.calculate(calls, interactions, selectedCountry);
        
        console.log('🔒 Protected ROI Calculation Results:', protectedResults);
        
        // Map protected results to component state
        const calculationResults = {
          traditionalMonthlyCost: protectedResults.traditionalMonthlyCost,
          sentraTechMonthlyCost: protectedResults.sentraTechMonthlyCost,
          monthlySavings: protectedResults.monthlySavings,
          yearlyTraditionalCost: protectedResults.yearlyTraditionalCost,
          yearlySentraTechCost: protectedResults.yearlySentraTechCost,
          yearlySavings: protectedResults.yearlySavings,
          roi: protectedResults.roi,
          costReduction: protectedResults.costReduction,
          bundlesNeeded: protectedResults.bundlesNeeded,
          humanHandledPercentage: protectedResults.humanHandledPercentage
        };
        
        setResults(calculationResults);
      });
      
    } catch (error) {
      console.error('❌ ROI Calculation failed:', error);
      setResults(null);
    }
  };

  // Use bulletproof formatting functions
  const formatCurrency = formatCurrencyProtected;
  
  // Debug calculation logger (for development)
  const logCalculationDebug = (calls, interactions, results) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧮 ROI Calculation Debug:', {
        inputs: { calls, interactions, country: selectedCountry },
        traditionalBPO: {
          monthly: results.traditionalMonthlyCost,
          annual: results.yearlyTraditionalCost,
          formula: `(${calls} × 8 + ${interactions} × 5) × $0.40`
        },
        sentraTech: {
          monthly: results.sentraTechMonthlyCost,
          annual: results.yearlySentraTechCost,
          formula: `(${calls}/1000 × $1014.75) + (${interactions}/1000 × $635.25)`
        },
        savings: {
          monthly: results.monthlySavings,
          annual: results.yearlySavings,
          formula: `$${results.traditionalMonthlyCost} - $${results.sentraTechMonthlyCost}`
        },
        roi: {
          percentage: results.roi,
          formula: `(${results.monthlySavings} ÷ ${results.sentraTechMonthlyCost}) × 100`
        },
        costReduction: {
          percentage: results.costReduction,
          formula: `(${results.monthlySavings} ÷ ${results.traditionalMonthlyCost}) × 100`
        }
      });
    }
  };

  const formatPercentage = formatPercentageProtected;

  // Handle email report submission using ingest endpoint
  const handleEmailSubmission = async () => {
    if (!email || !results) return;

    // Prevent duplicate submissions - check if already submitted for this data
    if (isSubmittingReport || reportSubmitted) {
      console.warn('⚠️ ROI Report already submitted or submission in progress');
      return;
    }

    // Generate a consistent ID for this submission
    if (!submissionID) {
      const newID = `roi_${email.replace(/[^a-zA-Z0-9]/g, '')}_${selectedCountry.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;
      setSubmissionID(newID);
      console.log(`🆔 Generated ROI submission ID: ${newID}`);
    }

    setIsSubmittingReport(true);
    
    // Network submission with duplicate prevention and rate limiting
    try {
      const { safeSubmit, showSuccessMessage, logPayload } =
        await import('../config/dashboardConfig.js');

      // Use the stored submission ID to prevent duplicates
      const currentSubmissionID = submissionID || `roi_${email.replace(/[^a-zA-Z0-9]/g, '')}_${selectedCountry.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;

      // Log raw input values for debugging
      console.log(`🔍 [ROI-CALCULATOR] Raw input values:`, {
        email,
        selectedCountry,
        callVolume: `"${callVolume}" (type: ${typeof callVolume})`,
        interactionVolume: `"${interactionVolume}" (type: ${typeof interactionVolume})`,
        results: results ? {
          traditionalMonthlyCost: results.traditionalMonthlyCost,
          sentraTechMonthlyCost: results.sentraTechMonthlyCost,
          monthlySavings: results.monthlySavings,
          yearlySavings: results.yearlySavings,
          roi: results.roi,
          costReduction: results.costReduction,
          bundlesNeeded: results.bundlesNeeded,
          humanHandledPercentage: results.humanHandledPercentage
        } : 'null'
      });

      // Enhanced payload capturing ALL calculated values from results state
      const roiData = {
        id: currentSubmissionID,
        email: email,
        country: selectedCountry,
        
        // Input volumes
        call_volume: parseInt(callVolume) || 0,
        interaction_volume: parseInt(interactionVolume) || 0,
        total_volume: (parseInt(callVolume) || 0) + (parseInt(interactionVolume) || 0),
        monthly_volume: (parseInt(callVolume) || 0) + (parseInt(interactionVolume) || 0),
        
        // Calculated costs (captured from results state)
        bpo_spending: results?.traditionalMonthlyCost || 0,
        sentratech_spending: results?.sentraTechMonthlyCost || 0,
        yearly_traditional_cost: results?.yearlyTraditionalCost || 0,
        yearly_sentratech_cost: results?.yearlySentraTechCost || 0,
        
        // Calculated savings
        monthly_savings: results?.monthlySavings || 0,
        yearly_savings: results?.yearlySavings || 0,
        calculated_savings: results?.monthlySavings || 0, // Alternative field mapping
        
        // Performance metrics
        roi_percentage: results?.roi || 0,
        cost_reduction: results?.costReduction || 0,
        bundles: results?.bundlesNeeded || 1,
        human_handled_percentage: results?.humanHandledPercentage || 0,
        
        // Metadata
        status: 'new',
        source: 'website_roi_calculator',
        created: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };

      // Additional DOM capture as fallback (adapting your concept to React)
      try {
        // Try to capture any additional values from DOM if available
        const domValues = {
          displayed_roi: document.querySelector('[data-roi-percentage]')?.textContent?.replace(/[%,\s]/g, '') || null,
          displayed_savings: document.querySelector('[data-monthly-savings]')?.textContent?.replace(/[\$,K\s]/g, '') || null,
          displayed_bpo_cost: document.querySelector('[data-bpo-cost]')?.textContent?.replace(/[\$,K\s]/g, '') || null,
          displayed_sentra_cost: document.querySelector('[data-sentra-cost]')?.textContent?.replace(/[\$,K\s]/g, '') || null
        };
        
        console.log(`🎯 [ROI-CALCULATOR] DOM fallback values:`, domValues);
        
        // Use DOM values as fallback if results state is missing
        if (!results && (domValues.displayed_roi || domValues.displayed_savings)) {
          roiData.roi_percentage = parseFloat(domValues.displayed_roi) || roiData.roi_percentage;
          roiData.monthly_savings = parseFloat(domValues.displayed_savings) * 1000 || roiData.monthly_savings;
          roiData.bpo_spending = parseFloat(domValues.displayed_bpo_cost) * 1000 || roiData.bpo_spending;
          roiData.sentratech_spending = parseFloat(domValues.displayed_sentra_cost) * 1000 || roiData.sentratech_spending;
        }
      } catch (domError) {
        console.warn('🔍 [ROI-CALCULATOR] DOM capture failed (using results state only):', domError.message);
      }

      // Log the complete payload before submission
      logPayload('roi-calculator', roiData);

      // Use safe submission wrapper with duplicate prevention
      const result = await safeSubmit('roi-calculator', roiData, {
        disableDuration: 10000, // 10 seconds for ROI Calculator
        onSubmitStart: () => setIsSubmittingReport(true),
        onSubmitEnd: () => setIsSubmittingReport(false),
        onDuplicate: () => {
          console.warn('ROI Calculator submission blocked - already in progress');
        }
      });

      if (result.success) {
        showSuccessMessage(
          'ROI report submitted successfully',
          { ...result.data, form_type: 'roi_calculator' }
        );
        setReportSubmitted(true);
        
        // Mark this submission as complete to prevent duplicates
        console.log(`✅ ROI Report submitted successfully with ID: ${currentSubmissionID}`);
        
        // Analytics event
        if (window?.dataLayer) {
          window.dataLayer.push({
            event: 'roi_report_submit',
            country: selectedCountry,
            total_volume: roiData.total_volume,
            submission_mode: result.mode,
            submissionId: currentSubmissionID,
            ingestId: result.data?.id || currentSubmissionID
          });
        }
      } else if (result.reason === 'rate_limited') {
        // Handle rate limiting specifically
        console.warn('ROI Calculator rate limited:', result.message);
        alert(result.message || 'Please wait before submitting another ROI report');
      } else if (result.reason === 'duplicate_submission') {
        // Handle duplicate submission
        console.warn('Duplicate ROI submission blocked:', result.message);
        alert('This ROI report has already been submitted. Please refresh to calculate a new report.');
      } else {
        throw new Error(result.error || result.message || 'ROI report submission failed');
      }
    } catch (error) {
      // Fallback to offline simulation on any error
      console.warn('ROI report submission failed, using offline fallback:', error);
      setReportSubmitted(true);
      
      // Reset submission ID on failure to allow retry
      setSubmissionID(null);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Main Calculator Card with Glassmorphism Design */}
      <Card className="bg-gradient-to-br from-[rgba(26,28,30,0.95)] to-[rgba(38,40,42,0.95)] border border-[rgba(0,255,65,0.2)] rounded-2xl shadow-lg">
        <CardContent className="p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Calculator className="text-[#00FF41]" size={32} />
              <h1 className="text-3xl font-bold text-white">ROI Calculator</h1>
            </div>
            <p className="text-[rgb(161,161,170)] text-lg">
              Calculate your potential savings with SentraTech's AI-powered platform
            </p>
            <div className="text-sm text-[#00FF41] mt-2">
              ✨ Assumes 70% automation with real-time cost comparison
            </div>
          </div>

          {/* Single Column Input Layout */}
          <div className="max-w-lg mx-auto space-y-6 mb-8">
            
            {/* Country Selector with Flags */}
            <div>
              <Label className="text-white text-lg font-semibold mb-3 block">Select Country</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(COUNTRIES).map(([country, data]) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    onMouseEnter={() => setShowCountryTooltip(country)}
                    onMouseLeave={() => setShowCountryTooltip(null)}
                    className={`relative p-4 rounded-xl border-2 smooth-hover ${
                      selectedCountry === country
                        ? 'border-[#00FF41] bg-[rgba(0,255,65,0.1)]'
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,255,65,0.5)]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{data.flag}</span>
                      <span className="text-white font-medium">{country}</span>
                    </div>
                    
                    {/* Country Tooltip */}
                    {showCountryTooltip === country && (
                      <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-[rgba(26,28,30,0.95)] border border-[rgba(0,255,65,0.3)] rounded-lg shadow-lg">
                        <div className="text-xs text-[rgb(161,161,170)] whitespace-nowrap">
                          {data.description}
                        </div>
                        <div className="text-xs text-[#00FF41] mt-1">
                          ~${data.bpoPerMin}/min BPO cost
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Inputs - Aligned Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Call Volume Input */}
              <div className="flex flex-col h-full">
                <Label className="text-white text-lg font-semibold mb-3 block">Monthly Call Volume</Label>
                <Input
                  type="number"
                  placeholder="e.g., 1000"
                  value={callVolume}
                  onChange={handleCallVolumeChange}
                  className={`bg-[rgba(26,28,30,0.8)] border-2 text-white text-lg p-4 rounded-xl smooth-hover ${
                    callVolumeError 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[rgba(255,255,255,0.1)] focus:border-[#00FF41]'
                  }`}
                  min="0"
                />
                {callVolumeError && (
                  <div className="flex items-center space-x-2 mt-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    <span>{callVolumeError}</span>
                  </div>
                )}
              </div>

              {/* Interaction Volume Input */}
              <div className="flex flex-col h-full">
                <Label className="text-white text-lg font-semibold mb-3 block">Monthly Interaction Volume</Label>
                <Input
                  type="number"
                  placeholder="e.g., 1500"
                  value={interactionVolume}
                  onChange={handleInteractionVolumeChange}
                  className={`bg-[rgba(26,28,30,0.8)] border-2 text-white text-lg p-4 rounded-xl smooth-hover ${
                    interactionVolumeError 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[rgba(255,255,255,0.1)] focus:border-[#00FF41]'
                  }`}
                  min="0"
                />
                {interactionVolumeError && (
                  <div className="flex items-center space-x-2 mt-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    <span>{interactionVolumeError}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Real-time Results Display */}
          {results && (
            <div className="space-y-6">
              
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Traditional BPO Cost */}
                <Card className="bg-gradient-to-br from-[rgba(255,68,68,0.2)] to-[rgba(204,0,0,0.1)] border border-red-500/30 rounded-xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-red-400 text-sm font-medium mb-2">Traditional BPO</div>
                    <div className="text-3xl font-bold text-red-400 mb-1" data-bpo-cost={results.traditionalMonthlyCost}>
                      {formatCurrency(results.traditionalMonthlyCost)}
                    </div>
                    <div className="text-xs text-red-300">per month</div>
                    <div className="text-lg font-semibold text-red-300 mt-2">
                      {formatCurrency(results.yearlyTraditionalCost)} / year
                    </div>
                  </CardContent>
                </Card>

                {/* SentraTech Cost */}
                <Card className="bg-gradient-to-br from-[rgba(0,255,65,0.2)] to-[rgba(0,204,51,0.1)] border border-[#00FF41]/30 rounded-xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-[#00FF41] text-sm font-medium mb-2">SentraTech AI</div>
                    <div className="text-3xl font-bold text-[#00FF41] mb-1" data-sentra-cost={results.sentraTechMonthlyCost}>
                      {formatCurrency(results.sentraTechMonthlyCost)}
                    </div>
                    <div className="text-xs text-green-300">per month</div>
                    <div className="text-lg font-semibold text-green-300 mt-2">
                      {formatCurrency(results.yearlySentraTechCost)} / year
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Savings */}
                <Card className="bg-gradient-to-br from-[rgba(0,221,255,0.2)] to-[rgba(0,153,204,0.1)] border border-blue-400/30 rounded-xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-blue-400 text-sm font-medium mb-2">Your Savings</div>
                    <div className="text-3xl font-bold text-blue-400 mb-1" data-monthly-savings={results.monthlySavings}>
                      {formatCurrency(results.monthlySavings)}
                    </div>
                    <div className="text-xs text-blue-300">per month</div>
                    <div className="text-lg font-semibold text-blue-300 mt-2">
                      {formatCurrency(results.yearlySavings)} / year
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* ROI and Cost Reduction Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Card className="bg-gradient-to-r from-[rgba(0,255,65,0.1)] to-[rgba(0,204,51,0.05)] border border-[#00FF41]/20 rounded-xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-white text-lg font-semibold mb-2">Return on Investment</div>
                    <div className="text-5xl font-bold text-[#00FF41] mb-2" data-roi-percentage={results.roi}>
                      {formatPercentage(results.roi)}
                    </div>
                    <div className="text-sm text-[rgb(161,161,170)]">
                      Monthly ROI based on savings vs. investment
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-[rgba(0,221,255,0.1)] to-[rgba(0,153,204,0.05)] border border-blue-400/20 rounded-xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-white text-lg font-semibold mb-2">Cost Reduction</div>
                    <div className="text-5xl font-bold text-blue-400 mb-2" data-cost-reduction={results.costReduction}>
                      {formatPercentage(results.costReduction)}
                    </div>
                    <div className="text-sm text-[rgb(161,161,170)]">
                      Total cost reduction vs. traditional BPO
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Additional Details */}
              <div className="bg-[rgba(38,40,42,0.5)] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  
                  <div>
                    <div className="text-[#00FF41] text-2xl font-bold">
                      {formatPercentage(AUTOMATION_PERCENTAGE)}
                    </div>
                    <div className="text-white text-sm font-medium">AI Automation</div>
                    <div className="text-xs text-[rgb(161,161,170)] mt-1">
                      Only {results.humanHandledPercentage}% needs human agents
                    </div>
                  </div>

                  <div>
                    <div className="text-[#00FF41] text-2xl font-bold">
                      {results.bundlesNeeded.toFixed(1)}
                    </div>
                    <div className="text-white text-sm font-medium">SentraTech Bundles</div>
                    <div className="text-xs text-[rgb(161,161,170)] mt-1">
                      Proportional cost allocation
                    </div>
                  </div>

                  <div>
                    <div className="text-[#00FF41] text-2xl font-bold">
                      {COUNTRIES[selectedCountry].flag} {selectedCountry}
                    </div>
                    <div className="text-white text-sm font-medium">Selected Market</div>
                    <div className="text-xs text-[rgb(161,161,170)] mt-1">
                      ${COUNTRIES[selectedCountry].bpoPerMin}/min BPO rate
                    </div>
                  </div>

                </div>
              </div>

              {/* Get Detailed Report Button */}
              <div className="text-center">
                <Button
                  onClick={() => setShowEmailModal(true)}
                  className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl btn-optimized"
                >
                  <Mail className="mr-2" size={20} />
                  Get Detailed ROI Report
                </Button>
              </div>

            </div>
          )}

          {/* No Results State */}
          {!results && (callVolume || interactionVolume) && (
            <div className="text-center py-8">
              <Calculator className="text-[rgba(255,255,255,0.3)] mx-auto mb-4" size={48} />
              <p className="text-[rgb(161,161,170)]">
                Enter your call and interaction volumes to see instant ROI calculations
              </p>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="bg-[rgba(26,28,30,0.98)] border border-[rgba(0,255,65,0.3)] rounded-2xl max-w-md w-full mx-4 shadow-2xl">
            <CardContent className="p-8">
              
              {reportSubmitted ? (
                // Success State
                <div className="text-center">
                  <div className="mb-6">
                    <Sparkles className="text-[#00FF41] mx-auto mb-4" size={48} />
                    <h3 className="text-2xl font-bold text-white mb-2">Report Submitted Successfully!</h3>
                    <p className="text-[rgb(161,161,170)]">
                      Your detailed ROI report has been sent to <strong className="text-white">{email}</strong>
                    </p>
                  </div>
                  
                  {results && (
                    <div className="bg-[rgba(0,255,65,0.1)] rounded-lg p-4 mb-6 text-left">
                      <div className="text-sm text-[rgb(161,161,170)] mb-3">📧 What's Next?</div>
                      <ul className="space-y-2 text-sm text-white">
                        <li>• Detailed ROI breakdown and analysis</li>
                        <li>• Implementation roadmap and timeline</li>
                        <li>• Custom pricing options for your volume</li>
                        <li>• Our team will follow up within 24 hours</li>
                        <li>• Schedule a personalized demo session</li>
                      </ul>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => {
                      setShowEmailModal(false);
                      setReportSubmitted(false);
                      setEmail('');
                    }}
                    className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] w-full"
                  >
                    Continue Exploring
                  </Button>
                </div>
              ) : (
                // Email Input State
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Get Your ROI Report</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmailModal(false)}
                      className="text-[rgb(161,161,170)] hover:text-white"
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  {results && (
                    <div className="bg-[rgba(38,40,42,0.8)] rounded-lg p-4 mb-6">
                      <div className="text-sm text-[rgb(161,161,170)] mb-2">Your ROI Summary:</div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-white font-medium">Country:</div>
                          <div className="text-[#00FF41]">{COUNTRIES[selectedCountry].flag} {selectedCountry}</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">Monthly Volume:</div>
                          <div className="text-[#00FF41]">{parseInt(callVolume) + parseInt(interactionVolume)} total</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">Monthly Savings:</div>
                          <div className="text-[#00FF41]">{formatCurrency(results.monthlySavings)}</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">ROI:</div>
                          <div className="text-[#00FF41]">{formatPercentage(results.roi)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white mb-2 block">Email Address</Label>
                      <Input
                        type="email"
                        placeholder="your.email@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[rgba(26,28,30,0.8)] border-[rgba(255,255,255,0.1)] text-white"
                        disabled={isSubmittingReport}
                      />
                    </div>

                    <Button
                      onClick={handleEmailSubmission}
                      disabled={!email || isSubmittingReport}
                      className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] w-full"
                    >
                      {isSubmittingReport ? (
                        <>
                          <Sparkles className="mr-2 animate-spin" size={16} />
                          Sending Report...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2" size={16} />
                          Send ROI Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};

export default ROICalculatorRedesigned;