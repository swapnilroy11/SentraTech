import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, DollarSign, Clock, 
  Users, BarChart3, ArrowUp, ArrowDown, Zap, Loader2, Target, Mail, X
} from 'lucide-react';
import axios from 'axios';
import { calculateROI } from '../utils/calculatorLogic';
import { COUNTRIES } from '../utils/costBaselines';
import { insertROIReport } from '../lib/supabaseClient';

const ROICalculator = () => {
  // Simplified State Management - Only Agent Count and AHT
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [agentCount, setAgentCount] = useState(50);
  const [ahtMinutes, setAhtMinutes] = useState(8);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Real-time calculation when inputs change
  useEffect(() => {
    try {
      if (agentCount > 0 && ahtMinutes > 0) {
        const metrics = calculateROI(selectedCountry, agentCount, ahtMinutes);
        setResults(metrics);
        setError(null);
      }
    } catch (error) {
      console.error('Error calculating ROI:', error);
      setError('Calculation error. Please check your inputs.');
    }
  }, [selectedCountry, agentCount, ahtMinutes]);

  // Handle country selection
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmittingReport(true);
      setError(null);

      // Submit to Supabase
      const result = await insertROIReport(email.trim(), results);
      
      if (result.success) {
        setReportSubmitted(true);
        setSavedSuccessfully(true);
        setShowEmailModal(false);
        setEmail('');
        
        // Also save to backend for analytics
        await saveToBackend();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSavedSuccessfully(false);
          setReportSubmitted(false);
        }, 5000);
      } else {
        setError(result.message || 'Failed to submit ROI report request.');
      }
    } catch (err) {
      console.error('Error submitting ROI report:', err);
      setError('Failed to submit ROI report request. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Save to backend for analytics (optional)
  const saveToBackend = async () => {
    try {
      const requestData = {
        input_data: {
          agent_count: agentCount,
          average_handle_time: ahtMinutes * 60,
          monthly_call_volume: results.callVolume || 0,
          cost_per_agent: results.tradCost ? results.tradCost / agentCount : 0
        },
        user_info: {
          timestamp: new Date().toISOString(),
          source: 'four_country_roi_report',
          country: selectedCountry,
          email_provided: true
        }
      };

      await axios.post(`${BACKEND_URL}/api/roi/save`, requestData);
    } catch (err) {
      console.error('Backend save error (non-critical):', err);
      // Don't show error to user as this is just for analytics
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(number || 0));
  };

  return (
    <section id="roi-calculator" className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(17,17,19)]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            Four-Country ROI Calculator
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-rajdhani">
            <span className="text-[#F8F9FA]">Compare AI vs </span>
            <span className="text-[#00FF41]">Traditional BPO</span>
          </h2>
          <p className="text-lg text-[rgb(218,218,218)] max-w-2xl mx-auto leading-relaxed">
            Simplified calculator with Agent Count and AHT - the metrics that matter most.
          </p>
        </div>

        {/* Improved Country Selection Buttons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[rgb(26,28,30)] rounded-2xl p-2 border border-[rgba(255,255,255,0.1)] shadow-lg">
            {COUNTRIES.map((country) => (
              <button
                key={country.name}
                onClick={() => handleCountryChange(country.name)}
                className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-300 ease-out flex items-center space-x-2 transform ${
                  selectedCountry === country.name 
                    ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg shadow-[#00FF41]/25 scale-105 z-10' 
                    : 'text-[rgb(161,161,170)] hover:text-white hover:bg-[rgb(38,40,42)] hover:scale-102 hover:shadow-md'
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold leading-tight">{country.name}</div>
                  <div className="text-xs opacity-75 leading-tight">${country.baseCost}/mo</div>
                </div>
                
                {/* Active indicator */}
                {selectedCountry === country.name && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#00FF41] rounded-full shadow-lg animate-pulse"></div>
                )}
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                  selectedCountry === country.name 
                    ? 'opacity-100 bg-gradient-to-r from-[#00FF41]/10 to-[#00DDFF]/10' 
                    : 'opacity-0 hover:opacity-100 bg-gradient-to-r from-[#00FF41]/5 to-[#00DDFF]/5'
                }`}></div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Simplified Input Controls */}
          <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl text-white flex items-center space-x-3">
                <div className="p-2 bg-[#00FF41]/20 rounded-xl border border-[#00FF41]/50">
                  <BarChart3 size={20} className="text-[#00FF41]" />
                </div>
                <span>Calculator Inputs</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-8">
              {/* Selected Country Display */}
              <div className="bg-gradient-to-r from-[#00FF41]/10 to-[#00DDFF]/10 rounded-xl p-4 border border-[#00FF41]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#00FF41] font-semibold mb-1">Selected Market</div>
                    <div className="text-white text-xl font-bold mb-1">{selectedCountry}</div>
                    <div className="text-[rgb(161,161,170)] text-sm">
                      Traditional: {formatCurrency(COUNTRIES.find(c => c.name === selectedCountry)?.baseCost)}/agent • AI: $154/agent
                    </div>
                  </div>
                  <div className="text-3xl">
                    {COUNTRIES.find(c => c.name === selectedCountry)?.flag}
                  </div>
                </div>
              </div>

              {/* Agent Count Input */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Label className="text-white text-xl font-semibold">
                    Agent Count
                  </Label>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#00FF41] mb-1">{agentCount}</div>
                    <div className="text-sm text-[rgb(161,161,170)]">agents</div>
                  </div>
                </div>
                
                {/* Slider */}
                <div className="mb-4">
                  <Slider
                    value={[agentCount]}
                    onValueChange={(value) => setAgentCount(value[0])}
                    max={500}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-[rgb(161,161,170)] mt-2">
                    <span>1</span>
                    <span>500</span>
                  </div>
                </div>
                
                {/* Number Input */}
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00FF41]" />
                  <Input
                    type="number"
                    value={agentCount}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(500, parseInt(e.target.value) || 1));
                      setAgentCount(value);
                    }}
                    className="pl-12 bg-[rgb(38,40,42)] border-[#00FF41]/50 text-white rounded-xl text-lg py-4 font-semibold"
                    min="1"
                    max="500"
                  />
                </div>
              </div>

              {/* Average Handle Time Input */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Label className="text-white text-xl font-semibold">
                    Average Handle Time
                  </Label>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#00DDFF] mb-1">{ahtMinutes}</div>
                    <div className="text-sm text-[rgb(161,161,170)]">minutes</div>
                  </div>
                </div>
                
                {/* Slider */}
                <div className="mb-4">
                  <Slider
                    value={[ahtMinutes]}
                    onValueChange={(value) => setAhtMinutes(value[0])}
                    max={20}
                    min={2}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-[rgb(161,161,170)] mt-2">
                    <span>2 min</span>
                    <span>20 min</span>
                  </div>
                </div>
                
                {/* Number Input */}
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00DDFF]" />
                  <Input
                    type="number"
                    value={ahtMinutes}
                    onChange={(e) => {
                      const value = Math.max(2, Math.min(20, parseFloat(e.target.value) || 2));
                      setAhtMinutes(value);
                    }}
                    className="pl-12 bg-[rgb(38,40,42)] border-[#00DDFF]/50 text-white rounded-xl text-lg py-4 font-semibold"
                    min="2"
                    max="20"
                    step="0.5"
                  />
                </div>
              </div>

              {/* Auto-calculated Call Volume Display */}
              <div className="bg-[rgb(38,40,42)] rounded-xl p-6 border border-[rgb(63,63,63)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-semibold text-lg">Monthly Call Volume</div>
                  <div className="text-2xl font-bold text-[#00FF41]">
                    {formatNumber(results.callVolume || 0)}
                  </div>
                </div>
                <div className="text-[rgb(161,161,170)] text-sm">
                  Auto-calculated: {agentCount} agents × {ahtMinutes}min AHT × 8hrs/day × 22 days
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-8">
            {/* Main Results Card */}
            <Card className="bg-gradient-to-br from-[#00FF41]/15 to-[#00DDFF]/15 border-2 border-[#00FF41] rounded-3xl p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl text-white flex items-center space-x-3">
                  <TrendingUp size={24} className="text-[#00FF41]" />
                  <span>ROI Analysis</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Cost Comparison Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-6 bg-[rgb(26,28,30)]/80 rounded-2xl border border-red-400/30">
                    <div className="text-sm text-[rgb(161,161,170)] mb-2">Traditional BPO</div>
                    <div className="text-3xl font-bold text-red-400 mb-2 font-rajdhani">
                      {formatCurrency(results.tradCost)}
                    </div>
                    <div className="text-xs text-[rgb(161,161,170)]">
                      {formatCurrency(results.costPerCall)}/call
                    </div>
                  </div>

                  <div className="text-center p-6 bg-[rgb(26,28,30)]/80 rounded-2xl border border-[#00DDFF]/30">
                    <div className="text-sm text-[rgb(161,161,170)] mb-2">AI Automation</div>
                    <div className="text-3xl font-bold text-[#00DDFF] mb-2 font-rajdhani">
                      {formatCurrency(results.aiCost)}
                    </div>
                    <div className="text-xs text-[rgb(161,161,170)]">
                      {formatCurrency(results.aiCostPerCall)}/call
                    </div>
                  </div>
                </div>

                {/* Savings Display */}
                <div className="text-center p-8 bg-gradient-to-r from-[#00FF41]/25 to-[#00DDFF]/25 rounded-3xl border-2 border-[#00FF41]/50 mb-8">
                  <div className="text-lg text-[rgb(161,161,170)] mb-3">Monthly Savings</div>
                  <div className={`text-6xl font-bold mb-4 font-rajdhani ${
                    (results.monthlySavings || 0) >= 0 ? 'text-[#00FF41]' : 'text-red-400'
                  }`}>
                    {formatCurrency(results.monthlySavings)}
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-lg">
                    <div className="flex items-center justify-center text-[#00FF41]">
                      {(results.reduction || 0) >= 0 ? 
                        <ArrowDown size={20} className="mr-2" /> : 
                        <ArrowUp size={20} className="mr-2" />
                      }
                      <span>{Math.abs(results.reduction || 0).toFixed(0)}% Cost {(results.reduction || 0) >= 0 ? 'Reduction' : 'Increase'}</span>
                    </div>
                    <div className="flex items-center justify-center text-[#00DDFF]">
                      <TrendingUp size={20} className="mr-2" />
                      <span>{(results.roi || 0).toFixed(0)}% ROI</span>
                    </div>
                  </div>
                  {results.paybackMonths && results.paybackMonths > 0 && results.paybackMonths < 36 && (
                    <div className="mt-4 text-sm text-[rgb(161,161,170)]">
                      Payback Period: {results.paybackMonths.toFixed(1)} months
                    </div>
                  )}
                </div>

                {/* Annual Savings */}
                <div className="text-center p-6 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)]">
                  <div className="text-sm text-[rgb(161,161,170)] mb-2">Annual Savings</div>
                  <div className={`text-4xl font-bold font-rajdhani ${
                    (results.annualSavings || 0) >= 0 ? 'text-[#00FF41]' : 'text-red-400'
                  }`}>
                    {formatCurrency(results.annualSavings)}
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <Zap size={20} className="text-[#00DDFF]" />
                  <span>Performance Summary</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                    <div className="text-white font-semibold mb-1">Market</div>
                    <div className="text-[#00FF41] font-bold text-lg">{selectedCountry}</div>
                  </div>
                  <div className="text-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                    <div className="text-white font-semibold mb-1">Agents</div>
                    <div className="text-[#00DDFF] font-bold text-lg">{agentCount}</div>
                  </div>
                  <div className="text-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                    <div className="text-white font-semibold mb-1">AHT</div>
                    <div className="text-[#00FF41] font-bold text-lg">{ahtMinutes}min</div>
                  </div>
                  <div className="text-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                    <div className="text-white font-semibold mb-1">Calls/Month</div>
                    <div className="text-[#00DDFF] font-bold text-lg">{formatNumber(results.callVolume)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <div className="text-center">
              <Button 
                size="lg"
                onClick={handleGetROIReport}
                disabled={isLoading}
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-bold px-12 py-6 rounded-xl transform hover:scale-105 transition-all duration-200 text-xl font-rajdhani disabled:opacity-50 disabled:transform-none shadow-lg shadow-[#00FF41]/30"
              >
                <Target className="mr-3" size={24} />
                Get Detailed ROI Report
              </Button>
              <p className="text-[rgb(161,161,170)] text-sm mt-4">
                {selectedCountry} BPO vs AI automation comparison • Schedule demo for validation
              </p>
            </div>
          </div>
        </div>

        {/* Email Modal for ROI Report */}
        {showEmailModal && (
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
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00FF41]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      className="pl-12 bg-[rgb(38,40,42)] border-[#00FF41]/50 text-white rounded-xl text-lg py-4 w-full"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="bg-[rgb(38,40,42)] rounded-xl p-4 mb-6 border border-[rgb(63,63,63)]">
                  <div className="text-sm text-[rgb(161,161,170)] mb-2">Your ROI Report Summary:</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white font-semibold">Country:</div>
                      <div className="text-[#00FF41]">{selectedCountry}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Agents:</div>
                      <div className="text-[#00DDFF]">{agentCount}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Monthly Savings:</div>
                      <div className="text-[#00FF41] font-bold">{formatCurrency(results.monthlySavings)}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">ROI:</div>
                      <div className="text-[#00DDFF] font-bold">{results.roi?.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

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

              <p className="text-[rgb(161,161,170)] text-xs mt-4 text-center">
                You'll receive a detailed ROI analysis within 24 hours
              </p>
            </div>
          </div>
        )}

        {/* Success Message Overlay */}
        {savedSuccessfully && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg">
            ✅ ROI report request submitted successfully!
          </div>
        )}
      </div>
    </section>
  );
};

export default ROICalculator;