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
const SENTRATECH_COST_PER_1K = 1650; // Updated SentraTech pricing per bundle
const CALL_COST_PER_1K = 1014.75; // 61.5% of $1,650 bundle cost
const INTERACTION_COST_PER_1K = 635.25; // 38.5% of $1,650 bundle cost

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

  // Validation states
  const [callVolumeError, setCallVolumeError] = useState('');
  const [interactionVolumeError, setInteractionVolumeError] = useState('');

  // Real-time calculation effect - triggers on any input change
  useEffect(() => {
    calculateROI();
  }, [selectedCountry, callVolume, interactionVolume]);

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

  // Protected calculation validation function
  const validateCalculation = (calls, interactions, results) => {
    const { traditionalMonthlyCost, sentraTechMonthlyCost, monthlySavings, roi, costReduction } = results;
    
    // Validate basic math
    const expectedSavings = traditionalMonthlyCost - sentraTechMonthlyCost;
    const expectedROI = sentraTechMonthlyCost > 0 ? (expectedSavings / sentraTechMonthlyCost) * 100 : 0;
    const expectedCostReduction = traditionalMonthlyCost > 0 ? (expectedSavings / traditionalMonthlyCost) * 100 : 0;
    
    // Check for precision errors (tolerance of 0.01)
    const tolerance = 0.01;
    
    if (Math.abs(monthlySavings - expectedSavings) > tolerance) {
      console.error('❌ Savings calculation error:', { expected: expectedSavings, actual: monthlySavings });
    }
    
    if (Math.abs(roi - expectedROI) > tolerance) {
      console.error('❌ ROI calculation error:', { expected: expectedROI, actual: roi });
    }
    
    if (Math.abs(costReduction - expectedCostReduction) > tolerance) {
      console.error('❌ Cost reduction calculation error:', { expected: expectedCostReduction, actual: costReduction });
    }
    
    return {
      savingsValid: Math.abs(monthlySavings - expectedSavings) <= tolerance,
      roiValid: Math.abs(roi - expectedROI) <= tolerance,
      costReductionValid: Math.abs(costReduction - expectedCostReduction) <= tolerance
    };
  };

  // Real-time ROI calculation with precision protection
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

    const country = COUNTRIES[selectedCountry];
    
    // Different AHT for calls vs interactions
    const callAHT = 8; // minutes per call
    const interactionAHT = 5; // minutes per interaction
    
    // Traditional BPO Cost Calculation with separate AHT (PRECISION: Use exact calculations)
    const callMinutes = calls * callAHT;
    const interactionMinutes = interactions * interactionAHT;
    const totalMinutes = callMinutes + interactionMinutes;
    const traditionalMonthlyCost = Math.round((totalMinutes * country.bpoPerMin) * 100) / 100; // Round to 2 decimals
    
    // SentraTech Cost Calculation with proportional pricing (PRECISION: Exact proportions)
    const callCost = Math.round(((calls / 1000) * CALL_COST_PER_1K) * 100) / 100;
    const interactionCost = Math.round(((interactions / 1000) * INTERACTION_COST_PER_1K) * 100) / 100;
    const sentraTechPlatformCost = Math.round((callCost + interactionCost) * 100) / 100;
    
    // Calculate equivalent bundles (for display purposes)
    const bundlesNeeded = Math.round((sentraTechPlatformCost / SENTRATECH_COST_PER_1K) * 1000) / 1000; // 3 decimal precision
    
    // Final costs (PRECISION: All calculations use exact math)
    const sentraTechTotalCost = sentraTechPlatformCost;
    
    // Calculate savings and ROI (PRECISION: Exact calculations)
    const monthlySavings = Math.round((traditionalMonthlyCost - sentraTechTotalCost) * 100) / 100;
    const yearlySavings = Math.round((monthlySavings * 12) * 100) / 100;
    const yearlyTraditionalCost = Math.round((traditionalMonthlyCost * 12) * 100) / 100;
    const yearlySentraTechCost = Math.round((sentraTechTotalCost * 12) * 100) / 100;
    
    // ROI Calculation: (Savings / Investment) * 100 (PRECISION: Exact formula)
    const roi = sentraTechTotalCost > 0 ? Math.round(((monthlySavings / sentraTechTotalCost) * 100) * 10) / 10 : 0; // 1 decimal
    
    // Cost reduction percentage (PRECISION: Exact formula)
    const costReduction = traditionalMonthlyCost > 0 ? Math.round(((monthlySavings / traditionalMonthlyCost) * 100) * 10) / 10 : 0; // 1 decimal

    const calculationResults = {
      traditionalMonthlyCost,
      sentraTechMonthlyCost: sentraTechTotalCost,
      monthlySavings,
      yearlyTraditionalCost,
      yearlySentraTechCost,
      yearlySavings,
      roi,
      costReduction,
      bundlesNeeded,
      humanHandledPercentage: 100 - AUTOMATION_PERCENTAGE
    };
    
    // Validate calculations for protection against future errors
    const validation = validateCalculation(calls, interactions, calculationResults);
    
    if (!validation.savingsValid || !validation.roiValid || !validation.costReductionValid) {
      console.warn('⚠️ Calculation validation failed - check precision');
    }

    setResults(calculationResults);
  };

  // Format currency with exact precision
  const formatCurrency = (amount) => {
    if (amount === 0) return '$0';
    if (amount < 1000) return `$${Math.round(amount)}`;
    if (amount < 1000000) return `$${(Math.round(amount / 100) / 10).toFixed(1)}K`; // Exact rounding to 1 decimal
    return `$${(Math.round(amount / 100000) / 10).toFixed(1)}M`;
  };
  
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

  // Format percentage
  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  // Handle email report submission
  const handleEmailSubmission = async () => {
    if (!email || !results) return;

    setIsSubmittingReport(true);
    
    try {
      // Save ROI report to database
      const reportData = {
        email,
        country: selectedCountry,
        call_volume: parseFloat(callVolume),
        interaction_volume: parseFloat(interactionVolume),
        traditional_cost: results.traditionalMonthlyCost,
        sentratech_cost: results.sentraTechMonthlyCost,
        monthly_savings: results.monthlySavings,
        annual_savings: results.yearlySavings,
        roi_percent: results.roi,
        cost_reduction: results.costReduction
      };

      const { error } = await supabase
        .from('roi_reports')
        .insert([reportData]);

      if (error) throw error;

      setReportSubmitted(true);
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowEmailModal(false);
        setReportSubmitted(false);
        setEmail('');
      }, 3000);

    } catch (error) {
      console.error('Error saving ROI report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Main Calculator Card with Glassmorphism Design */}
      <Card className="bg-gradient-to-br from-[rgba(26,28,30,0.95)] to-[rgba(38,40,42,0.95)] backdrop-blur-xl border border-[rgba(0,255,65,0.2)] rounded-2xl shadow-2xl">
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
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
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
                      <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-[rgba(26,28,30,0.95)] border border-[rgba(0,255,65,0.3)] rounded-lg shadow-xl backdrop-blur-sm">
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

            {/* Call Volume Input */}
            <div>
              <Label className="text-white text-lg font-semibold mb-3 block">Monthly Call Volume</Label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={callVolume}
                onChange={handleCallVolumeChange}
                className={`bg-[rgba(26,28,30,0.8)] border-2 text-white text-lg p-4 rounded-xl transition-all duration-200 ${
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
            <div>
              <Label className="text-white text-lg font-semibold mb-3 block">Monthly Interaction Volume</Label>
              <Input
                type="number"
                placeholder="e.g., 1500"
                value={interactionVolume}
                onChange={handleInteractionVolumeChange}
                className={`bg-[rgba(26,28,30,0.8)] border-2 text-white text-lg p-4 rounded-xl transition-all duration-200 ${
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

          {/* Real-time Results Display */}
          {results && (
            <div className="space-y-6">
              
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Traditional BPO Cost */}
                <Card className="bg-gradient-to-br from-[rgba(255,68,68,0.2)] to-[rgba(204,0,0,0.1)] border border-red-500/30 rounded-xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-red-400 text-sm font-medium mb-2">Traditional BPO</div>
                    <div className="text-3xl font-bold text-red-400 mb-1">
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
                    <div className="text-3xl font-bold text-[#00FF41] mb-1">
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
                    <div className="text-3xl font-bold text-blue-400 mb-1">
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
                    <div className="text-5xl font-bold text-[#00FF41] mb-2">
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
                    <div className="text-5xl font-bold text-blue-400 mb-2">
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
                  className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
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
                    onClick={() => setShowEmailModal(false)}
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