/**
 * SentraTech ROI Calculator - Per-1,000 Bundle Pricing
 * New implementation with Agent Count, Call Volume, and Per-Bundle modes
 * Includes country selector, advanced settings, and enterprise-grade calculations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, TrendingDown, DollarSign, Clock,
  Users, Zap, Loader2, Target, Mail, X, 
  ArrowDown, ArrowUp, Sparkles, Settings, ChevronDown, ChevronUp,
  Building, PhoneCall, MessageSquare, Percent, Eye, EyeOff
} from 'lucide-react';
import { calculateROI, formatCurrency, formatNumber } from '../utils/calculatorLogic';
import { COUNTRIES, SENTRATECH_DEFAULTS } from '../utils/costBaselines';

const ROICalculatorNew = () => {
  // Core state - calculation inputs
  const [mode, setMode] = useState('call_volume'); // 'agent_count', 'call_volume', 'per_bundle'
  const [calls, setCalls] = useState(1000);
  const [interactions, setInteractions] = useState(1000);
  const [callAHT, setCallAHT] = useState(8);
  const [interactionAHT, setInteractionAHT] = useState(5);
  const [automationPct, setAutomationPct] = useState(60); // UI shows as percentage
  const [country, setCountry] = useState('Bangladesh');
  
  // Mode-specific inputs
  const [agentCount, setAgentCount] = useState(10);
  const [volumeSubMode, setVolumeSubMode] = useState('auto'); // 'auto', 'manual'
  const [manualAgentCount, setManualAgentCount] = useState(10);
  
  // Pricing & business inputs
  const [sentraPricePer1k, setSentraPricePer1k] = useState(SENTRATECH_DEFAULTS.pilotPricePer1k);
  const [bundlesPerMonth, setBundlesPerMonth] = useState(1);
  const [implCost, setImplCost] = useState(3000);
  const [periodMonths, setPeriodMonths] = useState(12);
  
  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showInternalBreakdown, setShowInternalBreakdown] = useState(false);
  const [customAgentHourly, setCustomAgentHourly] = useState(null);
  const [customBpoPerMin, setCustomBpoPerMin] = useState(null);
  
  // UI state
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [warnings, setWarnings] = useState({});

  // Email modal state (kept from original)
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Debounced calculation
  const calculateResults = useCallback(() => {
    try {
      setIsCalculating(true);
      setError(null);

      const calculationInputs = {
        calls,
        interactions,
        callAHT,
        interactionAHT,
        automationPct: automationPct / 100, // Convert from percentage
        mode,
        agentCount: mode === 'agent_count' ? agentCount : null,
        country,
        agentHourlyLoaded: customAgentHourly,
        bpoPerMin: customBpoPerMin,
        sentraPricePer1k,
        bundlesPerMonth,
        implCost,
        periodMonths,
        volumeSubMode: mode === 'call_volume' ? volumeSubMode : 'auto',
        manualAgentCount: (mode === 'call_volume' && volumeSubMode === 'manual') ? manualAgentCount : null,
        showInternalBreakdown
      };

      const result = calculateROI(calculationInputs);
      setResults(result);

      // Update warnings based on results
      const newWarnings = {};
      if (result.is_cost_increase) {
        newWarnings.cost_increase = 'Consider increasing automation, renegotiating vendor rates, or adjusting pricing';
      }
      if (result.payback_months && result.payback_months > 24) {
        newWarnings.long_payback = `Payback period of ${result.payback_months.toFixed(1)} months is quite long`;
      }
      setWarnings(newWarnings);

    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.message || 'Calculation failed. Please check your inputs.');
    } finally {
      setIsCalculating(false);
    }
  }, [
    calls, interactions, callAHT, interactionAHT, automationPct, mode, agentCount,
    country, customAgentHourly, customBpoPerMin, sentraPricePer1k, bundlesPerMonth,
    implCost, periodMonths, volumeSubMode, manualAgentCount, showInternalBreakdown
  ]);

  // Calculate on input changes with debouncing
  useEffect(() => {
    const timer = setTimeout(calculateResults, 150);
    return () => clearTimeout(timer);
  }, [calculateResults]);

  // Handle country change and reset custom values
  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setCustomAgentHourly(null);
    setCustomBpoPerMin(null);
  };

  // Handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'call_volume') {
      setVolumeSubMode('auto');
    }
  };

  // Get current country data
  const currentCountry = COUNTRIES.find(c => c.name === country) || COUNTRIES[0];
  const effectiveAgentHourly = customAgentHourly || currentCountry.agentHourlyLoaded;
  const effectiveBpoPerMin = customBpoPerMin || currentCountry.bpoPerMin;

  return (
    <div id="roi-calculator-new" className="bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            Per-1,000 Bundle ROI Calculator
          </Badge>
          <h2 className="text-3xl font-bold text-white mb-2">
            Calculate Your Savings
          </h2>
          <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto">
            Enterprise-grade ROI analysis comparing Traditional BPO vs SentraTech per-1,000 call + interaction bundles
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[rgb(26,28,30)] rounded-2xl p-2 border border-[rgba(255,255,255,0.1)]">
            {[
              { key: 'call_volume', label: 'Call Volume', icon: PhoneCall },
              { key: 'agent_count', label: 'Agent Count', icon: Users },
              { key: 'per_bundle', label: 'Per-Bundle', icon: Building }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleModeChange(key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  mode === key 
                    ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg' 
                    : 'text-[rgb(161,161,170)] hover:text-white hover:bg-[rgb(38,40,42)]'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Country Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[rgb(26,28,30)] rounded-2xl p-2 border border-[rgba(255,255,255,0.1)]">
            {COUNTRIES.map((countryData) => (
              <button
                key={countryData.name}
                onClick={() => handleCountryChange(countryData.name)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                  country === countryData.name 
                    ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg' 
                    : 'text-[rgb(161,161,170)] hover:text-white hover:bg-[rgb(38,40,42)]'
                }`}
              >
                <div className="text-xl">{countryData.flag}</div>
                <div>
                  <div className="text-sm font-bold">{countryData.name}</div>
                  <div className="text-xs opacity-75">
                    ${effectiveAgentHourly}/hr • ${effectiveBpoPerMin}/min
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Input Panel */}
        <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8 mb-8">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Bundle Configuration */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calculator size={20} className="text-[#00FF41]" />
                  <h3 className="text-xl font-bold text-white">Bundle Configuration</h3>
                </div>

                {/* Bundle Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 flex items-center space-x-2">
                      <PhoneCall size={16} className="text-[#00DDFF]" />
                      <span>Calls per Bundle</span>
                    </Label>
                    <Input
                      type="number"
                      value={calls}
                      onChange={(e) => setCalls(Math.max(1, parseInt(e.target.value) || 1000))}
                      className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 flex items-center space-x-2">
                      <MessageSquare size={16} className="text-[#FFD700]" />
                      <span>Interactions per Bundle</span>
                    </Label>
                    <Input
                      type="number"
                      value={interactions}
                      onChange={(e) => setInteractions(Math.max(1, parseInt(e.target.value) || 1000))}
                      className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white"
                      min="1"
                    />
                  </div>
                </div>

                {/* Handle Times */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 flex items-center space-x-2">
                      <Clock size={16} className="text-[#00DDFF]" />
                      <span>Call AHT (minutes)</span>
                    </Label>
                    <Input
                      type="number"
                      value={callAHT}
                      onChange={(e) => setCallAHT(Math.max(0.5, parseFloat(e.target.value) || 8))}
                      className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white"
                      min="0.5"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 flex items-center space-x-2">
                      <Clock size={16} className="text-[#FFD700]" />
                      <span>Interaction AHT (minutes)</span>
                    </Label>
                    <Input
                      type="number"
                      value={interactionAHT}
                      onChange={(e) => setInteractionAHT(Math.max(0.5, parseFloat(e.target.value) || 5))}
                      className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white"
                      min="0.5"
                      step="0.5"
                    />
                  </div>
                </div>

                {/* Automation Percentage */}
                <div>
                  <Label className="text-white mb-2 flex items-center space-x-2">
                    <Zap size={16} className="text-[#00FF41]" />
                    <span>AI Automation Level</span>
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
                </div>
              </div>

              {/* Right Column: Mode-Specific Inputs */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users size={20} className="text-[#00DDFF]" />
                  <h3 className="text-xl font-bold text-white">
                    {mode === 'agent_count' && 'Agent Count Configuration'}
                    {mode === 'call_volume' && 'Call Volume Configuration'}
                    {mode === 'per_bundle' && 'Per-Bundle Configuration'}
                  </h3>
                </div>

                {/* Agent Count Mode */}
                {mode === 'agent_count' && (
                  <div>
                    <Label className="text-white mb-2 flex items-center space-x-2">
                      <Users size={16} className="text-[#00DDFF]" />
                      <span>Agent Count (FTE)</span>
                    </Label>
                    <Input
                      type="number"
                      value={agentCount}
                      onChange={(e) => setAgentCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white text-xl py-3"
                      min="1"
                    />
                    <div className="text-xs text-[rgb(161,161,170)] mt-1">
                      Full-Time Equivalent agents (not concurrent seats)
                    </div>
                  </div>
                )}

                {/* Call Volume Mode */}
                {mode === 'call_volume' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setVolumeSubMode('auto')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          volumeSubMode === 'auto' 
                            ? 'bg-[#00FF41] text-[#0A0A0A]' 
                            : 'bg-[rgb(38,40,42)] text-white'
                        }`}
                      >
                        Auto Calculate
                      </button>
                      <button
                        onClick={() => setVolumeSubMode('manual')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          volumeSubMode === 'manual' 
                            ? 'bg-[#00FF41] text-[#0A0A0A]' 
                            : 'bg-[rgb(38,40,42)] text-white'
                        }`}
                      >
                        Manual Entry
                      </button>
                    </div>

                    {volumeSubMode === 'manual' && (
                      <div>
                        <Label className="text-white mb-2">Manual Agent Count</Label>
                        <Input
                          type="number"
                          value={manualAgentCount}
                          onChange={(e) => setManualAgentCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white"
                          min="1"
                        />
                      </div>
                    )}

                    {volumeSubMode === 'auto' && results && (
                      <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                        <div className="text-[rgb(161,161,170)] text-sm mb-1">Auto-calculated:</div>
                        <div className="text-[#00FF41] text-lg font-bold">
                          {formatNumber(results.fte_needed)} FTE Required
                        </div>
                        <div className="text-xs text-[rgb(161,161,170)]">
                          Based on {results.human_hours_needed?.toFixed(1)} human hours needed per bundle
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Business Settings */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white mb-2">Bundles per Month</Label>
                      <Input
                        type="number"
                        value={bundlesPerMonth}
                        onChange={(e) => setBundlesPerMonth(Math.max(0.1, parseFloat(e.target.value) || 1))}
                        className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white"
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
                        className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 flex items-center space-x-2">
                      <DollarSign size={16} className="text-[#00FF41]" />
                      <span>SentraTech Price per 1k Bundle</span>
                    </Label>
                    <Input
                      type="number"
                      value={sentraPricePer1k}
                      onChange={(e) => setSentraPricePer1k(Math.max(100, parseInt(e.target.value) || 1200))}
                      className="bg-[rgb(38,40,42)] border-[rgba(255,255,255,0.1)] text-white text-xl py-3"
                      min="100"
                    />
                    <div className="text-xs text-[#00FF41] mt-1">
                      Pilot pricing: $1,200 (default)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-[rgb(161,161,170)] hover:text-white transition-colors mb-4"
              >
                <Settings size={16} />
                <span>Advanced Settings</span>
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[rgb(38,40,42)] rounded-lg p-4">
                  <div>
                    <Label className="text-white mb-2">Custom Agent Hourly Rate</Label>
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
                    <Label className="text-white mb-2">Custom BPO Per-Minute Rate</Label>
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
                  <div>
                    <Label className="text-white mb-2">Analysis Period (Months)</Label>
                    <Input
                      type="number"
                      value={periodMonths}
                      onChange={(e) => setPeriodMonths(Math.max(1, Math.min(36, parseInt(e.target.value) || 12)))}
                      className="bg-[rgb(26,28,30)] border-[rgba(255,255,255,0.1)] text-white"
                      min="1"
                      max="36"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        {results && (
          <>
            {/* Cost Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Traditional BPO Cost */}
              <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-red-500/30 rounded-xl p-6">
                <CardContent className="p-0 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Building size={24} className="text-red-400 mr-3" />
                    <h3 className="text-base text-white font-medium">Traditional BPO</h3>
                  </div>
                  <div className="text-3xl font-bold text-red-400 mb-2 font-rajdhani">
                    {formatCurrency(results.traditional_bpo_cost_per_bundle)}
                  </div>
                  <div className="text-sm text-[rgb(160,160,160)]">
                    per 1,000 bundle
                  </div>
                  <div className="text-xs text-[rgb(160,160,160)] mt-1">
                    {results.total_minutes.toLocaleString()} min × ${effectiveBpoPerMin}/min
                  </div>
                </CardContent>
              </Card>

              {/* SentraTech Price */}
              <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-[#00FF41]/30 rounded-xl p-6">
                <CardContent className="p-0 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Zap size={24} className="text-[#00FF41] mr-3" />
                    <h3 className="text-base text-white font-medium">SentraTech AI</h3>
                  </div>
                  <div className="text-3xl font-bold text-[#00FF41] mb-2 font-rajdhani">
                    {formatCurrency(results.sentra_price_per_bundle)}
                  </div>
                  <div className="text-sm text-[rgb(160,160,160)]">
                    per 1,000 bundle
                  </div>
                  {showInternalBreakdown && results.internal_sentra_cost && (
                    <div className="text-xs text-[#00DDFF] mt-1">
                      Internal cost: {formatCurrency(results.internal_sentra_cost)}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Savings */}
              <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-emerald-500/30 rounded-xl p-6">
                <CardContent className="p-0 text-center">
                  <div className="flex items-center justify-center mb-4">
                    {results.is_profitable ? (
                      <TrendingUp size={24} className="text-emerald-400 mr-3" />
                    ) : (
                      <TrendingDown size={24} className="text-red-400 mr-3" />
                    )}
                    <h3 className="text-base text-white font-medium">
                      {results.is_profitable ? 'Savings' : 'Cost Increase'}
                    </h3>
                  </div>
                  <div className={`text-3xl font-bold mb-2 font-rajdhani ${
                    results.is_profitable ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {results.is_profitable ? '+' : '-'}{formatCurrency(Math.abs(results.savings_per_bundle))}
                  </div>
                  <div className="text-sm text-[rgb(160,160,160)]">
                    per 1,000 bundle
                  </div>
                  <div className="text-xs text-[rgb(160,160,160)] mt-1">
                    {Math.abs(results.percent_reduction).toFixed(1)}% {results.is_profitable ? 'reduction' : 'increase'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly & Annual Projections */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8 mb-8">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Left: Key Metrics */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                      <Target size={20} className="text-[#00FF41]" />
                      <span>Financial Impact</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                        <div className="text-sm text-[rgb(161,161,170)]">Monthly Savings</div>
                        <div className={`text-2xl font-bold ${
                          results.is_profitable ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {formatCurrency(results.monthly_savings)}
                        </div>
                        <div className="text-xs text-[rgb(161,161,170)]">
                          {bundlesPerMonth} bundle{bundlesPerMonth !== 1 ? 's' : ''} × {formatCurrency(results.savings_per_bundle)}
                        </div>
                      </div>

                      <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                        <div className="text-sm text-[rgb(161,161,170)]">Annual Impact ({periodMonths} months)</div>
                        <div className={`text-2xl font-bold ${
                          results.is_profitable ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {formatCurrency(results.annual_savings)}
                        </div>
                      </div>

                      {results.payback_exists && (
                        <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                          <div className="text-sm text-[rgb(161,161,170)]">Payback Period</div>
                          <div className="text-2xl font-bold text-[#00DDFF]">
                            {results.payback_months < 1 
                              ? '< 1 month' 
                              : `${results.payback_months.toFixed(1)} months`
                            }
                          </div>
                        </div>
                      )}

                      <div className="bg-[rgb(38,40,42)] rounded-lg p-4">
                        <div className="text-sm text-[rgb(161,161,170)]">ROI ({periodMonths} months)</div>
                        <div className={`text-2xl font-bold ${
                          results.roi_percent > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {results.roi_percent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Breakdown */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Calculator size={20} className="text-[#00DDFF]" />
                        <span>Analysis Details</span>
                      </h3>
                      <button
                        onClick={() => setShowInternalBreakdown(!showInternalBreakdown)}
                        className="text-xs text-[rgb(161,161,170)] hover:text-white flex items-center space-x-1"
                      >
                        {showInternalBreakdown ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span>Internal View</span>
                      </button>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[rgb(161,161,170)]">Bundle Size:</span>
                        <span className="text-white">{calls.toLocaleString()} calls + {interactions.toLocaleString()} interactions</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgb(161,161,170)]">Total Minutes:</span>
                        <span className="text-white">{results.total_minutes.toLocaleString()} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgb(161,161,170)]">Human Minutes ({automationPct}% automation):</span>
                        <span className="text-white">{results.human_minutes_needed.toLocaleString()} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgb(161,161,170)]">FTE Required:</span>
                        <span className="text-white">{results.fte_needed.toFixed(1)} agents</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[rgb(161,161,170)]">Country:</span>
                        <span className="text-white">{country} (${effectiveAgentHourly}/hr)</span>
                      </div>
                    </div>

                    {/* Internal Breakdown */}
                    {showInternalBreakdown && results.breakdown && (
                      <div className="mt-6 p-4 bg-[rgb(38,40,42)] rounded-lg">
                        <div className="text-sm font-medium text-[#00DDFF] mb-3">Internal Cost Breakdown</div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[rgb(161,161,170)]">STT Cost:</span>
                            <span className="text-white">{formatCurrency(results.breakdown.stt_cost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[rgb(161,161,170)]">TTS Cost:</span>
                            <span className="text-white">{formatCurrency(results.breakdown.tts_cost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[rgb(161,161,170)]">LLM Cost:</span>
                            <span className="text-white">{formatCurrency(results.breakdown.llm_cost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[rgb(161,161,170)]">PSTN Cost:</span>
                            <span className="text-white">{formatCurrency(results.breakdown.pstn_cost)}</span>
                          </div>
                          <div className="border-t border-[rgba(255,255,255,0.1)] pt-2 flex justify-between font-medium">
                            <span className="text-[rgb(161,161,170)]">Margin:</span>
                            <span className="text-[#00FF41]">{formatCurrency(results.breakdown.margin)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            {Object.keys(warnings).length > 0 && (
              <Card className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingDown size={20} className="text-red-400" />
                  <h3 className="text-lg font-bold text-red-400">Recommendations</h3>
                </div>
                {Object.values(warnings).map((warning, index) => (
                  <div key={index} className="text-red-300 text-sm mb-2">
                    • {warning}
                  </div>
                ))}
              </Card>
            )}
          </>
        )}

        {/* Calculate Button & Status */}
        <div className="text-center">
          {isCalculating && (
            <div className="flex items-center justify-center space-x-2 text-[#00FF41] mb-4">
              <Loader2 className="animate-spin" size={20} />
              <span>Calculating ROI...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300 text-center">
              {error}
            </div>
          )}

          {results && (
            <Button 
              size="lg"
              onClick={() => setShowEmailModal(true)}
              className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-bold px-12 py-6 rounded-xl transform hover:scale-105 transition-all duration-200 text-xl font-rajdhani shadow-lg shadow-[#00FF41]/30"
            >
              <Target className="mr-3" size={24} />
              Get Detailed ROI Report
            </Button>
          )}
        </div>

        {/* Email Modal - Kept from original for now */}
        {showEmailModal && results && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
            <div className="bg-[rgb(26,28,30)] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#00FF41]/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#00FF41]/20 rounded-xl">
                    <Mail size={20} className="text-[#00FF41]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Get Your ROI Report</h3>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-[rgb(161,161,170)] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                // Handle email submission here
                setReportSubmitted(true);
                setShowEmailModal(false);
              }}>
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
                      <div className="text-white font-semibold">Mode:</div>
                      <div className="text-[#00FF41] capitalize">{mode.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Country:</div>
                      <div className="text-[#00DDFF]">{country}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Bundle Size:</div>
                      <div className="text-[#FFD700]">{calls}+{interactions}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Monthly Savings:</div>
                      <div className="text-[#00FF41] font-bold">{formatCurrency(results.monthly_savings)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
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

export default ROICalculatorNew;