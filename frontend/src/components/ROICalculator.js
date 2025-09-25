import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, DollarSign, 
  Users, Zap, Loader2, Target, Mail, X, 
  ArrowDown, ArrowUp, Sparkles
} from 'lucide-react';
import { calculateROI } from '../utils/calculatorLogic';
import { COUNTRIES } from '../utils/costBaselines';
import { supabase } from '../lib/supabaseClient';

const ROICalculator = () => {
  // Simplified State Management - Only Agent Count
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [agentCount, setAgentCount] = useState(50);
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Default AHT = 7 minutes as specified
  const DEFAULT_AHT = 7;

  // Real-time calculation with fixed AHT
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setIsCalculating(true);
        if (agentCount > 0) {
          const metrics = calculateROI(selectedCountry, agentCount, DEFAULT_AHT);
          
          // Calculate real per-call costs
          const callVolume = agentCount * ((8*60)/DEFAULT_AHT) * 22;
          const tradPerCall = (metrics.tradCost / callVolume).toFixed(2);
          const aiPerCall = (metrics.aiCost / callVolume).toFixed(2);
          
          setResults({
            ...metrics,
            callVolume,
            tradPerCall: parseFloat(tradPerCall),
            aiPerCall: parseFloat(aiPerCall)
          });
          setError(null);
        }
      } catch (error) {
        console.error('Error calculating ROI:', error);
        setError('Calculation error. Please check your inputs.');
      } finally {
        setTimeout(() => setIsCalculating(false), 300);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCountry, agentCount]);

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
        aht_minutes: DEFAULT_AHT,
        call_volume: results.callVolume,
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
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            ROI Calculator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-rajdhani text-white">
            ROI Analysis – <span className="text-[#00FF41]">{selectedCountry}</span>
          </h1>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed mb-12">
            Discover your potential savings and return on investment with SentraTech's AI-powered customer support platform.
          </p>
        </div>

        {/* Country Selection */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-[rgb(26,28,30)] rounded-2xl p-2 border border-[rgba(255,255,255,0.1)] shadow-lg">
            {COUNTRIES.map((country) => (
              <button
                key={country.name}
                onClick={() => handleCountryChange(country.name)}
                className={`px-6 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 transform hover:scale-105 ${
                  selectedCountry === country.name 
                    ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg shadow-[#00FF41]/25 z-10' 
                    : 'text-[rgb(161,161,170)] hover:text-white hover:bg-[rgb(38,40,42)] hover:scale-102 hover:shadow-md'
                }`}
              >
                <span className="text-xl">{country.flag}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold leading-tight">{country.name}</div>
                  <div className="text-xs opacity-75 leading-tight">${country.baseCost}/agent</div>
                </div>
                
                {/* Active indicator */}
                {selectedCountry === country.name && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#00FF41] rounded-full shadow-lg animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Agent Count Input Section */}
          <div className="mb-12">
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl text-white flex items-center justify-center space-x-4">
                  <div className="p-3 bg-[#00FF41]/20 rounded-xl border border-[#00FF41]/50">
                    <Users size={24} className="text-[#00FF41]" />
                  </div>
                  <span>Agent Count</span>
                  {isCalculating && (
                    <div className="animate-spin">
                      <Loader2 size={24} className="text-[#00FF41]" />
                    </div>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-8">
                {/* Agent Count Display */}
                <div className="text-center">
                  <div className="text-8xl font-black text-[#00FF41] mb-4 font-rajdhani">
                    {agentCount}
                  </div>
                  <div className="text-lg text-[rgb(161,161,170)]">agents</div>
                </div>
                
                {/* Slider */}
                <div className="mb-6">
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={agentCount}
                    onChange={(e) => setAgentCount(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer slider-gradient"
                    style={{
                      background: `linear-gradient(to right, #00FF41 0%, #00FF41 ${(agentCount/500)*100}%, #374151 ${(agentCount/500)*100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-[rgb(161,161,170)] mt-2">
                    <span>1</span>
                    <span>500</span>
                  </div>
                </div>
                
                {/* Number Input */}
                <div className="max-w-md mx-auto">
                  <Input
                    type="number"
                    value={agentCount}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(500, parseInt(e.target.value) || 1));
                      setAgentCount(value);
                    }}
                    className="bg-[rgb(38,40,42)] border-[#00FF41]/50 text-white rounded-xl text-2xl py-6 text-center font-semibold focus:border-[#00FF41] focus:ring-[#00FF41]/20"
                    min="1"
                    max="500"
                  />
                </div>

                {/* Call Volume Info */}
                <div className="bg-[rgb(38,40,42)] rounded-xl p-6 border border-[rgb(63,63,63)] max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-semibold text-lg">Monthly Call Volume</div>
                    <div className="text-2xl font-bold text-[#00FF41]">
                      {formatNumber(results.callVolume || 0)}
                    </div>
                  </div>
                  <div className="text-[rgb(161,161,170)] text-sm">
                    {agentCount} agents × 7min AHT × 8hrs/day × 22 days
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Three-Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            {/* Card 1: Traditional BPO Cost */}
            <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-[#00FF41] rounded-2xl p-6 hover:scale-102 transition-all duration-300 hover:border-[#00FF41] hover:shadow-lg hover:shadow-[#00FF41]/25">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center mb-4">
                  <DollarSign size={28} className="text-red-400 mr-3" />
                  <h3 className="text-base text-[rgb(200,200,200)] font-medium">Traditional BPO Cost</h3>
                </div>
                <div className="text-4xl font-bold text-[#00FF41] mb-3 font-rajdhani">
                  {formatCurrency(results.tradCost)}
                </div>
                <div className="text-base text-[rgb(160,160,160)]">
                  ${results.tradPerCall?.toFixed(2) || '0.00'}/call
                </div>
              </CardContent>
            </Card>

            {/* Card 2: SentraTech AI Cost */}
            <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-[#00FF41] rounded-2xl p-6 hover:scale-102 transition-all duration-300 hover:border-[#00FF41] hover:shadow-lg hover:shadow-[#00FF41]/25">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Zap size={28} className="text-[#00DDFF] mr-3" />
                  <h3 className="text-base text-[rgb(200,200,200)] font-medium">SentraTech AI Cost</h3>
                </div>
                <div className="text-4xl font-bold text-[#00FF41] mb-3 font-rajdhani">
                  {formatCurrency(results.aiCost)}
                </div>
                <div className="text-base text-[rgb(160,160,160)]">
                  ${results.aiPerCall?.toFixed(2) || '0.00'}/call
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Savings & ROI */}
            <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-[#00FF41] rounded-2xl p-6 hover:scale-102 transition-all duration-300 hover:border-[#00FF41] hover:shadow-lg hover:shadow-[#00FF41]/25">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp size={28} className="text-emerald-400 mr-3" />
                  <h3 className="text-base text-[rgb(200,200,200)] font-medium">Your Savings & ROI</h3>
                </div>
                <div className="text-4xl font-bold text-[#00FF41] mb-3 font-rajdhani">
                  {formatCurrency(results.monthlySavings)}
                </div>
                <div className="space-y-1">
                  <div className="text-base text-[rgb(160,160,160)] flex items-center justify-center">
                    <ArrowDown size={16} className="mr-1 text-emerald-400" />
                    {Math.abs(results.costReduction || 0).toFixed(0)}% Cost Reduction
                  </div>
                  <div className="text-base text-[rgb(160,160,160)] flex items-center justify-center">
                    <ArrowUp size={16} className="mr-1 text-emerald-400" />
                    {results.roiPercent || 0}% ROI
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Annual Projection */}
          <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8 mb-12">
            <CardContent className="p-0 text-center">
              <div className="flex items-center justify-center mb-6">
                <Calculator size={24} className="text-[#00FF41] mr-3" />
                <h3 className="text-2xl font-bold text-white">Annual Projection</h3>
              </div>
              
              <div className="text-7xl font-black bg-gradient-to-r from-[#00FF41] to-[#00DDFF] bg-clip-text text-transparent mb-4 font-rajdhani">
                {formatCurrency(results.annualSavings)}
              </div>
              <div className="text-[rgb(161,161,170)] text-xl mb-8">Total savings over 12 months</div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[rgb(38,40,42)] rounded-2xl p-6 border border-[rgb(63,63,63)]">
                <div className="text-center">
                  <div className="text-[rgb(161,161,170)] text-sm mb-1">Market</div>
                  <div className="text-[#00FF41] font-bold text-lg">{selectedCountry}</div>
                </div>
                <div className="text-center">
                  <div className="text-[rgb(161,161,170)] text-sm mb-1">Agents</div>
                  <div className="text-[#00DDFF] font-bold text-lg">{agentCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-[rgb(161,161,170)] text-sm mb-1">AHT</div>
                  <div className="text-[#00FF41] font-bold text-lg">{DEFAULT_AHT}min</div>
                </div>
                <div className="text-center">
                  <div className="text-[rgb(161,161,170)] text-sm mb-1">Calls/Month</div>
                  <div className="text-[#00DDFF] font-bold text-lg">{formatNumber(results.callVolume)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center">
            <Button 
              size="lg"
              onClick={handleGetROIReport}
              className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-bold px-12 py-6 rounded-xl transform hover:scale-105 transition-all duration-200 text-xl font-rajdhani shadow-lg shadow-[#00FF41]/30"
            >
              <Target className="mr-3" size={24} />
              Get Detailed ROI Report
            </Button>
            <p className="text-[rgb(161,161,170)] text-sm mt-4">
              {selectedCountry} BPO vs AI automation comparison • Schedule demo for validation
            </p>
          </div>
        </div>

        {/* Email Modal */}
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

        {/* Success Message Overlay */}
        {reportSubmitted && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
              <Sparkles size={20} />
              <span>✅ ROI report request submitted successfully!</span>
            </div>
          </div>
        )}

        {error && !showEmailModal && (
          <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg max-w-md">
            ❌ {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default ROICalculator;