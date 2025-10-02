/**
 * SentraTech ROI Calculator - Updated with Per-1,000 Bundle Logic
 * Maintains original UI design while using new calculation engine
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, TrendingDown, DollarSign, Clock,
  Users, Zap, Loader2, Target, Mail, X, 
  ArrowDown, ArrowUp, Sparkles, Settings, ChevronDown, ChevronUp
} from 'lucide-react';
import { calculateROI, formatCurrency, formatNumber } from '../utils/calculatorLogic';
import { COUNTRIES } from '../utils/costBaselines';
import { supabase } from '../lib/supabaseClient';

const ROICalculator = () => {
  // State Management - Keeping original UI inputs but mapping to new logic
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [agentCount, setAgentCount] = useState(10);
  const [ahtMinutes, setAhtMinutes] = useState(7);
  const [manualCallVolume, setManualCallVolume] = useState(null);
  const [useManualVolume, setUseManualVolume] = useState(false);
  const [automationPct, setAutomationPct] = useState(60);
  
  // Advanced settings (hidden by default to maintain UI simplicity)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sentraPricePer1k, setSentraPricePer1k] = useState(1200);
  const [bundlesPerMonth, setBundlesPerMonth] = useState(1);
  const [implCost, setImplCost] = useState(0);
  const [customAgentHourly, setCustomAgentHourly] = useState(null);
  const [customBpoPerMin, setCustomBpoPerMin] = useState(null);
  
  // UI State
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [agentWarning, setAgentWarning] = useState('');
  const [ahtWarning, setAhtWarning] = useState('');

  // Email modal state (kept from original)
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Get current country data
  const currentCountry = COUNTRIES.find(c => c.name === selectedCountry) || COUNTRIES[0];
  const effectiveAgentHourly = customAgentHourly || currentCountry.agentHourlyLoaded;
  const effectiveBpoPerMin = customBpoPerMin || currentCountry.bpoPerMin;

  // Real-time calculation with new per-1,000 bundle logic
  useEffect(() => {
    const calculateMetrics = () => {
      try {
        setIsCalculating(true);
        setError(null);

        // Map old UI inputs to new per-1,000 bundle calculation
        const calls = 1000; // Fixed for per-bundle pricing
        const interactions = 1000; // Fixed for per-bundle pricing
        const callAHT = ahtMinutes;
        const interactionAHT = Math.max(1, ahtMinutes * 0.6); // Estimate as 60% of call AHT

        const calculationInputs = {
          calls,
          interactions,
          callAHT,
          interactionAHT,
          automationPct: automationPct / 100,
          mode: useManualVolume ? 'agent_count' : 'call_volume',
          agentCount: useManualVolume ? agentCount : null,
          country: selectedCountry,
          agentHourlyLoaded: customAgentHourly,
          bpoPerMin: customBpoPerMin,
          sentraPricePer1k,
          bundlesPerMonth,
          implCost,
          periodMonths: 12,
          volumeSubMode: useManualVolume ? 'manual' : 'auto',
          manualAgentCount: useManualVolume ? agentCount : null,
          showInternalBreakdown: false
        };

        const newResults = calculateROI(calculationInputs);
        
        // Map new results to original UI format for compatibility
        const mappedResults = {
          ...newResults,
          // Legacy fields for UI compatibility
          country: selectedCountry,
          agentCount: agentCount,
          ahtMinutes: ahtMinutes,
          callVolume: Math.round(newResults.total_minutes / ahtMinutes),
          tradCost: newResults.traditional_bpo_cost_per_bundle,
          aiCost: newResults.sentra_price_per_bundle,
          tradPerCall: newResults.traditional_bpo_cost_per_bundle / calls,
          aiPerCall: newResults.sentra_price_per_bundle / calls,
          monthlySavings: newResults.monthly_savings,
          annualSavings: newResults.annual_savings,
          roiPercent: newResults.roi_percent,
          costReduction: newResults.percent_reduction,
          isSavings: newResults.is_profitable,
          isProfit: newResults.is_profitable,
          costChangePercent: Math.abs(newResults.percent_reduction),
          roiLossPercent: Math.abs(newResults.roi_percent)
        };
        
        setResults(mappedResults);

        // Input validation warnings
        setAgentWarning(agentCount < 1 || agentCount > 1000 ? 'Agent count should be between 1-1000' : '');
        setAhtWarning(ahtMinutes < 1 || ahtMinutes > 60 ? 'AHT should be between 1-60 minutes' : '');

      } catch (error) {
        console.error('Calculation error:', error);
        setError('Calculation failed. Please check your inputs.');
      } finally {
        setIsCalculating(false);
      }
    };

    // Validate inputs before calculation
    if (agentCount > 0 && ahtMinutes > 0) {
      const timer = setTimeout(calculateMetrics, 150);
      return () => clearTimeout(timer);
    }
  }, [
    agentCount, ahtMinutes, automationPct, selectedCountry, useManualVolume, manualCallVolume,
    customAgentHourly, customBpoPerMin, sentraPricePer1k, bundlesPerMonth, implCost
  ]);

  // Handle country selection
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setCustomAgentHourly(null); // Reset custom values
    setCustomBpoPerMin(null);
    setError(null);
  };

  // Handle opening email modal
  const handleGetROIReport = () => {
    if (Object.keys(results).length === 0) {
      setError('Please adjust inputs to generate calculations first.');
      return;
    }
    setShowEmailModal(true);
    setError(null);
  };

  // Handle email modal close
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmail('');
    setError(null);
  };

  // Submit ROI report to Supabase
  const submitROIReport = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmittingReport(true);
      setError(null);

      const roiData = {
        email: email.trim(),
        country: selectedCountry,
        agent_count: agentCount,
        aht_minutes: ahtMinutes,
        automation_pct: automationPct,
        call_volume: results.callVolume,
        traditional_cost: results.tradCost,
        ai_cost: results.aiCost,
        monthly_savings: results.monthlySavings,
        annual_savings: results.annualSavings,
        roi_percent: results.roiPercent,
        cost_reduction: results.costReduction,
        // New bundle-based fields
        traditional_bpo_per_bundle: results.traditional_bpo_cost_per_bundle,
        sentra_price_per_bundle: results.sentra_price_per_bundle,
        savings_per_bundle: results.savings_per_bundle,
        bundles_per_month: bundlesPerMonth,
        payback_months: results.payback_months
      };

      const { data, error } = await supabase
        .from('roi_reports')
        .insert([roiData]);

      if (error) {
        throw error;
      }

      setReportSubmitted(true);
      closeEmailModal();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setReportSubmitted(false), 3000);

    } catch (error) {
      console.error('Supabase error:', error);
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Input handlers with validation
  const handleAgentCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseInt(value) >= 0)) {
      setAgentCount(value === '' ? '' : parseInt(value));
    }
  };

  const handleAHTChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setAhtMinutes(value === '' ? '' : parseFloat(value));
    }
  };

  return (
    <div id="roi-calculator" className="bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            Per-1,000 Bundle ROI Calculator
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">Calculate Your</span>
            <br />
            <span className="text-[#00FF41]">Savings</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade ROI analysis based on per-1,000 call + interaction bundles. 
            Compare Traditional BPO vs SentraTech AI across four countries.
          </p>
        </div>

        {/* Country Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {COUNTRIES.map((country) => (
            <button
              key={country.name}
              onClick={() => handleCountryChange(country.name)}
              className={`p-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                selectedCountry === country.name
                  ? 'border-[#00FF41] bg-[#00FF41]/10 shadow-2xl shadow-[#00FF41]/20'
                  : 'border-[rgba(255,255,255,0.1)] bg-[rgb(26,28,30)] hover:border-[#00FF41]/50'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3 animate-bounce">{country.flag}</div>
                <h3 className="text-lg font-bold text-white mb-2">{country.name}</h3>
                <div className="text-xs text-[rgb(161,161,170)]">
                  <div>${effectiveAgentHourly}/hour agent</div>
                  <div>${effectiveBpoPerMin}/min BPO</div>
                </div>
                <div className="text-xs text-[#00DDFF] mt-2">{country.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Panel */}
          <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl h-fit">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Calculator className="mr-3 text-[#00FF41]" size={24} />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Agent Count */}
              <div>
                <Label className="text-white text-lg font-semibold mb-3 block">
                  <Users className="inline mr-2 text-[#00DDFF]" size={20} />
                  Agent Count
                </Label>
                <Input
                  type="number"
                  value={agentCount}
                  onChange={handleAgentCountChange}
                  className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white text-xl py-4"
                  placeholder="Enter number of agents"
                  min="1"
                  max="1000"
                />
                {agentWarning && (
                  <div className="text-amber-400 text-sm mt-2 flex items-center">
                    <ArrowUp className="mr-1" size={16} />
                    {agentWarning}
                  </div>
                )}
              </div>

              {/* AHT */}
              <div>
                <Label className="text-white text-lg font-semibold mb-3 block">
                  <Clock className="inline mr-2 text-[#FFD700]" size={20} />
                  Average Handle Time (minutes)
                </Label>
                <Input
                  type="number"
                  value={ahtMinutes}
                  onChange={handleAHTChange}
                  className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white text-xl py-4"
                  placeholder="Enter AHT in minutes"
                  min="0.5"
                  max="60"
                  step="0.5"
                />
                {ahtWarning && (
                  <div className="text-amber-400 text-sm mt-2 flex items-center">
                    <ArrowUp className="mr-1" size={16} />
                    {ahtWarning}
                  </div>
                )}
              </div>

              {/* Automation Level */}
              <div>
                <Label className="text-white text-lg font-semibold mb-3 block">
                  <Zap className="inline mr-2 text-[#00FF41]" size={20} />
                  AI Automation Level
                </Label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="95"
                    step="5"
                    value={automationPct}
                    onChange={(e) => setAutomationPct(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #00FF41 0%, #00FF41 ${(automationPct/95)*100}%, #374151 ${(automationPct/95)*100}%, #374151 100%)`
                    }}
                  />
                  <div className="text-2xl font-bold text-[#00FF41] min-w-[60px]">
                    {automationPct}%
                  </div>
                </div>
                <div className="text-sm text-[rgb(161,161,170)] mt-2">
                  Higher automation = lower human labor costs
                </div>
              </div>

              {/* Manual Call Volume Toggle */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="useManualVolume"
                    checked={useManualVolume}
                    onChange={(e) => setUseManualVolume(e.target.checked)}
                    className="w-4 h-4 text-[#00FF41] bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] rounded focus:ring-[#00FF41]"
                  />
                  <Label htmlFor="useManualVolume" className="text-white text-sm">
                    Manual Call Volume Override
                  </Label>
                </div>
                {useManualVolume && (
                  <Input
                    type="number"
                    value={manualCallVolume || ''}
                    onChange={(e) => setManualCallVolume(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Enter monthly call volume"
                    className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white"
                    min="100"
                  />
                )}
              </div>

              {/* Advanced Settings */}
              <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 text-[rgb(161,161,170)] hover:text-white transition-colors mb-4"
                >
                  <Settings size={16} />
                  <span>Advanced Settings</span>
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showAdvanced && (
                  <div className="space-y-4 bg-[rgb(38,40,42)] rounded-lg p-4">
                    <div>
                      <Label className="text-white mb-2">SentraTech Price (per 1k bundle)</Label>
                      <Input
                        type="number"
                        value={sentraPricePer1k}
                        onChange={(e) => setSentraPricePer1k(parseInt(e.target.value) || 1200)}
                        className="bg-[rgb(26,28,30)] border-[rgba(255,255,255,0.1)] text-white"
                        min="100"
                      />
                      <div className="text-xs text-[#00FF41] mt-1">Default: $1,200 (pilot pricing)</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white mb-2">Custom Agent Rate ($/hr)</Label>
                        <Input
                          type="number"
                          value={customAgentHourly || ''}
                          placeholder={`Default: $${effectiveAgentHourly}`}
                          onChange={(e) => setCustomAgentHourly(e.target.value ? parseFloat(e.target.value) : null)}
                          className="bg-[rgb(26,28,30)] border-[rgba(255,255,255,0.1)] text-white"
                          min="0.5"
                          step="0.25"
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-2">Custom BPO Rate ($/min)</Label>
                        <Input
                          type="number"
                          value={customBpoPerMin || ''}
                          placeholder={`Default: $${effectiveBpoPerMin}`}
                          onChange={(e) => setCustomBpoPerMin(e.target.value ? parseFloat(e.target.value) : null)}
                          className="bg-[rgb(26,28,30)] border-[rgba(255,255,255,0.1)] text-white"
                          min="0.1"
                          step="0.05"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white mb-2">Bundles per Month</Label>
                        <Input
                          type="number"
                          value={bundlesPerMonth}
                          onChange={(e) => setBundlesPerMonth(Math.max(0.1, parseFloat(e.target.value) || 1))}
                          className="bg-[rgb(26,28,30)] border-[rgba(255,255,255,0.1)] text-white"
                          min="0.1"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-2">Implementation Cost</Label>
                        <Input
                          type="number"
                          value={implCost}
                          onChange={(e) => setImplCost(Math.max(0, parseInt(e.target.value) || 0))}
                          className="bg-[rgb(26,28,30)] border-[rgba(255,255,255,0.1)] text-white"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6">
            
            {/* Cost Comparison Cards */}
            {Object.keys(results).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Traditional BPO Cost */}
                <Card className="bg-gradient-to-br from-[#FF4444]/20 to-[#CC0000]/10 border border-red-500/30 rounded-xl">
                  <CardContent className="p-4 text-center">
                    <div className="text-red-400 text-sm mb-1">Traditional BPO</div>
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {formatCurrency(results.tradCost)}
                    </div>
                    <div className="text-xs text-red-300">per 1k bundle</div>
                  </CardContent>
                </Card>

                {/* SentraTech Cost */}
                <Card className="bg-gradient-to-br from-[#00FF41]/20 to-[#00CC33]/10 border border-[#00FF41]/30 rounded-xl">
                  <CardContent className="p-4 text-center">
                    <div className="text-[#00FF41] text-sm mb-1">SentraTech AI</div>
                    <div className="text-2xl font-bold text-[#00FF41] mb-1">
                      {formatCurrency(results.aiCost)}
                    </div>
                    <div className="text-xs text-green-300">per 1k bundle</div>
                  </CardContent>
                </Card>

                {/* Savings */}
                <Card className={`bg-gradient-to-br ${
                  results.isSavings 
                    ? 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' 
                    : 'from-red-500/20 to-red-600/10 border-red-500/30'
                } border rounded-xl`}>
                  <CardContent className="p-4 text-center">
                    <div className={`text-sm mb-1 ${results.isSavings ? 'text-emerald-400' : 'text-red-400'}`}>
                      {results.isSavings ? 'Savings' : 'Cost Increase'}
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${results.isSavings ? 'text-emerald-400' : 'text-red-400'}`}>
                      {results.isSavings ? '+' : '-'}{formatCurrency(Math.abs(results.monthlySavings))}
                    </div>
                    <div className={`text-xs ${results.isSavings ? 'text-emerald-300' : 'text-red-300'}`}>
                      {Math.abs(results.costChangePercent)}% {results.isSavings ? 'reduction' : 'increase'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Detailed Results */}
            {Object.keys(results).length > 0 && (
              <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Target className="mr-3 text-[#00FF41]" size={24} />
                    Financial Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                      <div className="text-sm text-[rgb(161,161,170)] mb-1">Monthly Impact</div>
                      <div className={`text-2xl font-bold ${
                        results.isSavings ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {formatCurrency(results.monthlySavings)}
                      </div>
                    </div>
                    
                    <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                      <div className="text-sm text-[rgb(161,161,170)] mb-1">Annual Impact</div>
                      <div className={`text-2xl font-bold ${
                        results.isSavings ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {formatCurrency(results.annualSavings)}
                      </div>
                    </div>

                    {results.payback_months && results.payback_months > 0 && (
                      <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                        <div className="text-sm text-[rgb(161,161,170)] mb-1">Payback Period</div>
                        <div className="text-2xl font-bold text-[#00DDFF]">
                          {results.payback_months < 1 ? '< 1 month' : `${results.payback_months.toFixed(1)} months`}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                      <div className="text-sm text-[rgb(161,161,170)] mb-1">ROI (12 months)</div>
                      <div className={`text-2xl font-bold ${
                        results.roiPercent > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {results.roiPercent > 0 ? '+' : ''}{results.roiPercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Calculation Details */}
                  <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Calculation Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[rgb(161,161,170)]">Country:</span>
                          <span className="text-white">{selectedCountry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(161,161,170)]">Agents:</span>
                          <span className="text-white">{agentCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(161,161,170)]">AHT:</span>
                          <span className="text-white">{ahtMinutes} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(161,161,170)]">Automation:</span>
                          <span className="text-white">{automationPct}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[rgb(161,161,170)]">Bundle Size:</span>
                          <span className="text-white">1k calls + 1k interactions</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(161,161,170)]">Monthly Bundles:</span>
                          <span className="text-white">{bundlesPerMonth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(161,161,170)]">Agent Rate:</span>
                          <span className="text-white">${effectiveAgentHourly}/hr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[rgb(161,161,170)]">BPO Rate:</span>
                          <span className="text-white">${effectiveBpoPerMin}/min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Get Report Button */}
                  <Button 
                    onClick={handleGetROIReport}
                    size="lg"
                    className="w-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-bold py-4 text-lg font-rajdhani shadow-lg shadow-[#00FF41]/30"
                  >
                    <Target className="mr-2" size={20} />
                    Get Detailed ROI Report
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Calculation Status */}
            {isCalculating && (
              <div className="flex items-center justify-center space-x-2 text-[#00FF41] py-8">
                <Loader2 className="animate-spin" size={20} />
                <span>Calculating ROI...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-center">
                {error}
              </div>
            )}

            {reportSubmitted && (
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 text-center">
                ✅ ROI report sent successfully! Check your email.
              </div>
            )}
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[rgb(26,28,30)] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#00FF41]/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#00FF41]/20 rounded-xl">
                    <Mail size={20} className="text-[#00FF41]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Get Your ROI Report</h3>
                </div>
                <button
                  onClick={closeEmailModal}
                  className="text-[rgb(161,161,170)] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitROIReport}>
                <div className="mb-6">
                  <Label htmlFor="email" className="text-white text-lg font-semibold mb-3 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    className="bg-[rgb(38,40,42)] border-[#00FF41]/50 text-white rounded-xl text-lg py-4 w-full"
                    required
                  />
                </div>

                <div className="bg-[rgb(38,40,42)] rounded-xl p-4 mb-6">
                  <div className="text-sm text-[rgb(161,161,170)] mb-2">Your ROI Report Summary:</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white font-semibold">Country:</div>
                      <div className="text-[#00DDFF]">{selectedCountry}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Agents:</div>
                      <div className="text-[#FFD700]">{agentCount}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">AHT:</div>
                      <div className="text-[#FFD700]">{ahtMinutes} min</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Monthly Savings:</div>
                      <div className="text-[#00FF41] font-bold">{formatCurrency(results.monthlySavings)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={closeEmailModal}
                    variant="outline"
                    className="flex-1 border-[rgb(63,63,63)] text-white hover:bg-[rgb(38,40,42)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="flex-1 bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold"
                  >
                    {isSubmittingReport ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Submitting...
                      </>
                    ) : (
                      'Send ROI Report'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ROICalculator;