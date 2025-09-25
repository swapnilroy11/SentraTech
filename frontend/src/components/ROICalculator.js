import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, DollarSign, Clock, 
  Users, BarChart3, Zap, Loader2, Target, Mail, X, PhoneCall
} from 'lucide-react';
import { calculateROI } from '../utils/calculatorLogic';
import { BASE_COST, AI_COST, COUNTRIES } from '../utils/costBaselines';
import { supabase } from '../lib/supabaseClient';

const ROICalculator = () => {
  // State Management
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [selectedMetric, setSelectedMetric] = useState('agents'); // 'agents' or 'totalCalls'
  const [agentCount, setAgentCount] = useState(50);
  const [ahtMinutes, setAhtMinutes] = useState(5);
  const [totalCalls, setTotalCalls] = useState(25000);
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Real-time calculation when inputs change
  useEffect(() => {
    try {
      if (selectedMetric === 'agents') {
        if (agentCount > 0 && ahtMinutes > 0) {
          const metrics = calculateROI(selectedCountry, agentCount, ahtMinutes);
          setResults(metrics);
          setError(null);
        }
      } else {
        if (totalCalls > 0) {
          // For total calls mode, use 1 agent and calculate per-call metrics
          const metrics = calculateROI(selectedCountry, 1, 5, totalCalls);
          // Adjust costs to be total costs instead of per-agent costs
          const adjustedMetrics = {
            ...metrics,
            tradCost: totalCalls * metrics.tradPerCall,
            aiCost: totalCalls * metrics.aiPerCall,
            monthlySavings: totalCalls * (metrics.tradPerCall - metrics.aiPerCall),
            annualSavings: totalCalls * (metrics.tradPerCall - metrics.aiPerCall) * 12,
            roiPercent: metrics.tradPerCall > 0 ? parseInt(((totalCalls * (metrics.tradPerCall - metrics.aiPerCall) * 12) / (totalCalls * metrics.aiPerCall * 12) * 100).toFixed(0)) : 0,
            costReduction: metrics.tradPerCall > 0 ? parseInt(((metrics.tradPerCall - metrics.aiPerCall) / metrics.tradPerCall * 100).toFixed(0)) : 0
          };
          setResults(adjustedMetrics);
          setError(null);
        }
      }
    } catch (error) {
      console.error('Error calculating ROI:', error);
      setError('Calculation error. Please check your inputs.');
    }
  }, [selectedCountry, selectedMetric, agentCount, ahtMinutes, totalCalls]);

  // Handle country selection
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setError(null);
  };

  // Handle metric toggle
  const handleMetricToggle = (metric) => {
    setSelectedMetric(metric);
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
        agent_count: selectedMetric === 'agents' ? agentCount : Math.round(totalCalls / ((8*60)/5*22)),
        aht_minutes: selectedMetric === 'agents' ? ahtMinutes : 5,
        call_volume: selectedMetric === 'agents' ? results.callVolume : totalCalls,
        traditional_cost: results.tradCost,
        ai_cost: results.aiCost,
        monthly_savings: results.monthlySavings,
        annual_savings: results.annualSavings,
        roi_percent: results.roiPercent,
        cost_reduction: results.costReduction
      };

      const { data, error } = await supabase
        .from('roi_reports')
        .insert([roiData]);

      if (error) throw error;

      console.log('✅ ROI report saved successfully:', data);
      setReportSubmitted(true);
      setShowEmailModal(false);
      setEmail('');
      
      setTimeout(() => setReportSubmitted(false), 5000);

    } catch (err) {
      console.error('Error submitting ROI report:', err);
      setError(`Failed to submit ROI report: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmittingReport(false);
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
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            ROI Calculator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-rajdhani text-white">
            ROI Analysis – <span className="text-[#00FF41]">{selectedCountry}</span>
          </h1>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            Discover your potential savings and return on investment with SentraTech's AI-powered customer support platform. Get personalized calculations based on your current operations.
          </p>
        </div>

        {/* Country Selection */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[rgb(26,28,30)] rounded-2xl p-2 border border-[rgba(255,255,255,0.1)]">
            {COUNTRIES.map((country) => (
              <button
                key={country.name}
                onClick={() => handleCountryChange(country.name)}
                className={`px-6 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                  selectedCountry === country.name 
                    ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg' 
                    : 'text-[rgb(161,161,170)] hover:text-white hover:bg-[rgb(38,40,42)]'
                }`}
              >
                <span className="text-xl">{country.flag}</span>
                <div>
                  <div className="text-sm font-semibold">{country.name}</div>
                  <div className="text-xs opacity-75">${country.baseCost}/agent/mo</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Metric Selection */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[rgb(26,28,30)] rounded-2xl p-2 border border-[rgba(255,255,255,0.1)]">
            <button
              onClick={() => handleMetricToggle('agents')}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                selectedMetric === 'agents' 
                  ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg' 
                  : 'text-[rgb(161,161,170)] hover:text-white hover:bg-[rgb(38,40,42)]'
              }`}
            >
              <Users size={18} />
              <span>Agent Count & AHT</span>
            </button>
            <button
              onClick={() => handleMetricToggle('totalCalls')}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                selectedMetric === 'totalCalls' 
                  ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg' 
                  : 'text-[rgb(161,161,170)] hover:text-white hover:bg-[rgb(38,40,42)]'
              }`}
            >
              <PhoneCall size={18} />
              <span>Total Calls/Month</span>
            </button>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
          
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {selectedMetric === 'agents' ? (
              <>
                {/* Agent Count Input */}
                <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl text-white flex items-center space-x-3">
                      <Users size={24} className="text-[#00FF41]" />
                      <span>Agent Count</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-[#00FF41] mb-2 font-rajdhani" style={{fontSize: '48px'}}>
                        {agentCount}
                      </div>
                      <div className="text-lg text-[rgb(161,161,170)]">agents</div>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        value={agentCount}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(1000, parseInt(e.target.value) || 1));
                          setAgentCount(value);
                        }}
                        className="bg-[rgb(38,40,42)] border-[#00FF41]/50 text-white text-xl py-6 text-center font-bold rounded-xl"
                        min="1"
                        max="1000"
                        style={{fontSize: '24px'}}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* AHT Input */}
                <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl text-white flex items-center space-x-3">
                      <Clock size={24} className="text-[#00DDFF]" />
                      <span>Average Handle Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-[#00DDFF] mb-2 font-rajdhani" style={{fontSize: '48px'}}>
                        {ahtMinutes}
                      </div>
                      <div className="text-lg text-[rgb(161,161,170)]">minutes</div>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        value={ahtMinutes}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(30, parseFloat(e.target.value) || 1));
                          setAhtMinutes(value);
                        }}
                        className="bg-[rgb(38,40,42)] border-[#00DDFF]/50 text-white text-xl py-6 text-center font-bold rounded-xl"
                        min="1"
                        max="30"
                        step="0.5"
                        style={{fontSize: '24px'}}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Total Calls Input */
              <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-white flex items-center space-x-3">
                    <PhoneCall size={24} className="text-[#00FF41]" />
                    <span>Total Calls/Month</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-[#00FF41] mb-2 font-rajdhani" style={{fontSize: '48px'}}>
                      {formatNumber(totalCalls)}
                    </div>
                    <div className="text-lg text-[rgb(161,161,170)]">calls</div>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={totalCalls}
                      onChange={(e) => {
                        const value = Math.max(1000, Math.min(1000000, parseInt(e.target.value) || 1000));
                        setTotalCalls(value);
                      }}
                      className="bg-[rgb(38,40,42)] border-[#00FF41]/50 text-white text-xl py-6 text-center font-bold rounded-xl"
                      min="1000"
                      max="1000000"
                      style={{fontSize: '24px'}}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Monthly Calls Display */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <BarChart3 size={20} className="text-[#00FF41]" />
                  <span>Monthly Calls</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00FF41] mb-2 font-rajdhani" style={{fontSize: '36px'}}>
                    {formatNumber(selectedMetric === 'agents' ? results.callVolume : totalCalls)}
                  </div>
                  <div className="text-sm text-[rgb(161,161,170)]">
                    {selectedMetric === 'agents' 
                      ? `${agentCount} agents × ${ahtMinutes}min AHT × 8hrs × 22 days`
                      : 'Direct input'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - ROI Analysis Cards */}
          <div className="space-y-6">
            {/* Traditional Cost Card */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <DollarSign size={20} className="text-red-400" />
                  <span>Traditional Cost</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400 mb-2 font-rajdhani" style={{fontSize: '36px'}}>
                    {formatCurrency(results.tradCost)}
                  </div>
                  <div className="text-lg text-[rgb(161,161,170)]">
                    {formatCurrency(results.tradPerCall)}/call
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Cost Card */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <Zap size={20} className="text-[#00DDFF]" />
                  <span>AI Cost</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00DDFF] mb-2 font-rajdhani" style={{fontSize: '36px'}}>
                    {formatCurrency(results.aiCost)}
                  </div>
                  <div className="text-lg text-[rgb(161,161,170)]">
                    {formatCurrency(results.aiPerCall)}/call
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Savings Card */}
            <Card className="bg-gradient-to-br from-[#00FF41]/15 to-[#00DDFF]/15 border-2 border-[#00FF41] rounded-3xl p-6 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <TrendingUp size={20} className="text-[#00FF41]" />
                  <span>Monthly Savings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-[#00FF41] mb-3 font-rajdhani" style={{fontSize: '48px'}}>
                    {formatCurrency(results.monthlySavings)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-[rgb(161,161,170)] mb-1">✓ Cost Reduction</div>
                    <div className="text-2xl font-bold text-[#00FF41]" style={{fontSize: '24px'}}>
                      {results.costReduction || 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-[rgb(161,161,170)] mb-1">✓ ROI</div>
                    <div className="text-2xl font-bold text-[#00DDFF]" style={{fontSize: '24px'}}>
                      {results.roiPercent || 0}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Annual Savings Card */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <Calculator size={20} className="text-[#00FF41]" />
                  <span>Annual Savings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00FF41] mb-2 font-rajdhani" style={{fontSize: '36px'}}>
                    {formatCurrency(results.annualSavings)}
                  </div>
                  <div className="text-sm text-[rgb(161,161,170)]">
                    12 months projection
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <div className="text-center pt-6">
              <Button 
                size="lg"
                onClick={handleGetROIReport}
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-bold px-12 py-6 rounded-xl transform hover:scale-105 transition-all duration-200 text-xl font-rajdhani shadow-lg shadow-[#00FF41]/30"
              >
                <Target className="mr-3" size={24} />
                Get Detailed ROI Report
              </Button>
            </div>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
            <div className="bg-[rgb(26,28,30)] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#00FF41]/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-[#00FF41]" />
                  <h3 className="text-xl font-bold text-white">Get Your ROI Report</h3>
                </div>
                <button onClick={closeEmailModal} className="text-[rgb(161,161,170)] hover:text-white">
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
                    autoFocus
                  />
                </div>

                <div className="bg-[rgb(38,40,42)] rounded-xl p-4 mb-6">
                  <div className="text-sm text-[rgb(161,161,170)] mb-2">Your ROI Report Summary:</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white font-semibold">Country:</div>
                      <div className="text-[#00FF41]">{selectedCountry}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {selectedMetric === 'agents' ? 'Agents:' : 'Calls:'}
                      </div>
                      <div className="text-[#00DDFF]">
                        {selectedMetric === 'agents' ? agentCount : formatNumber(totalCalls)}
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Monthly Savings:</div>
                      <div className="text-[#00FF41] font-bold">{formatCurrency(results.monthlySavings)}</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">ROI:</div>
                      <div className="text-[#00DDFF] font-bold">{results.roiPercent || 0}%</div>
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

        {/* Success Message */}
        {reportSubmitted && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg">
            ✅ ROI report request submitted successfully!
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg max-w-md">
            ❌ {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default ROICalculator;