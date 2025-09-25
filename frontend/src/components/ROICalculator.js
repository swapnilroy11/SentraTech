import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, DollarSign, Clock, 
  Users, BarChart3, Zap, Loader2, Target, Mail, X, PhoneCall,
  ArrowRight, Sparkles, TrendingDown, ChevronDown, ChevronUp
} from 'lucide-react';
import { calculateROI } from '../utils/calculatorLogic';
import { BASE_COST, AI_COST, COUNTRIES } from '../utils/costBaselines';
import { supabase } from '../lib/supabaseClient';

const ROICalculator = () => {
  // State Management
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [selectedMetric, setSelectedMetric] = useState('agents');
  const [agentCount, setAgentCount] = useState(50);
  const [ahtMinutes, setAhtMinutes] = useState(5);
  const [totalCalls, setTotalCalls] = useState(25000);
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Animation states
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Refs for animations
  const resultsRef = useRef(null);

  // Real-time calculation with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setIsCalculating(true);
        if (selectedMetric === 'agents') {
          if (agentCount > 0 && ahtMinutes > 0) {
            const metrics = calculateROI(selectedCountry, agentCount, ahtMinutes);
            setResults(metrics);
            setAnimateResults(true);
            setTimeout(() => setAnimateResults(false), 600);
            setError(null);
          }
        } else {
          if (totalCalls > 0) {
            const metrics = calculateROI(selectedCountry, 1, 5, totalCalls);
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
            setAnimateResults(true);
            setTimeout(() => setAnimateResults(false), 600);
            setError(null);
          }
        }
      } catch (error) {
        console.error('Error calculating ROI:', error);
        setError('Calculation error. Please check your inputs.');
      } finally {
        setTimeout(() => setIsCalculating(false), 300);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCountry, selectedMetric, agentCount, ahtMinutes, totalCalls]);

  // Handle country selection with animation
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setError(null);
  };

  // Handle metric toggle with smooth transition
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

  const getSavingsColor = (savings) => {
    if (savings >= 10000) return 'from-emerald-500 to-green-400';
    if (savings >= 5000) return 'from-blue-500 to-cyan-400';
    if (savings >= 1000) return 'from-purple-500 to-indigo-400';
    return 'from-gray-500 to-slate-400';
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Ultra-Modern Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <Badge className="px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-xl rounded-full text-lg font-medium">
              <Sparkles className="mr-3" size={20} />
              AI-Powered ROI Analysis
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            ROI Calculator
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Discover your potential savings with SentraTech's next-generation AI customer support platform. 
            <span className="text-emerald-400 font-semibold"> Real calculations, real results.</span>
          </p>

          {/* Country Selection - Glassmorphism Style */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/5 backdrop-blur-xl rounded-3xl p-2 border border-white/10 shadow-2xl">
              {COUNTRIES.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountryChange(country.name)}
                  className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-500 flex items-center space-x-3 transform hover:scale-105 ${
                    selectedCountry === country.name 
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-2xl shadow-emerald-500/25' 
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div className="text-left">
                    <div className="text-sm font-bold">{country.name}</div>
                    <div className="text-xs opacity-75">${country.baseCost}/agent</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Metric Toggle - Neumorphism Style */}
          <div className="flex justify-center">
            <div className="inline-flex bg-slate-800/50 backdrop-blur-xl rounded-3xl p-2 border border-slate-700/50 shadow-inner">
              <button
                onClick={() => handleMetricToggle('agents')}
                className={`px-10 py-5 rounded-2xl font-semibold transition-all duration-500 flex items-center space-x-3 ${
                  selectedMetric === 'agents' 
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-2xl shadow-emerald-500/25' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Users size={20} />
                <span>Agent Count & AHT</span>
              </button>
              <button
                onClick={() => handleMetricToggle('totalCalls')}
                className={`px-10 py-5 rounded-2xl font-semibold transition-all duration-500 flex items-center space-x-3 ${
                  selectedMetric === 'totalCalls' 
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-2xl shadow-emerald-500/25' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <PhoneCall size={20} />
                <span>Total Calls/Month</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* Input Section - Left Side */}
          <div className="xl:col-span-5 space-y-8">
            {selectedMetric === 'agents' ? (
              <>
                {/* Agent Count Card */}
                <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl">
                          <Users size={28} className="text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">Agent Count</h3>
                          <p className="text-slate-400">Current support team size</p>
                        </div>
                      </div>
                      {isCalculating && (
                        <div className="animate-spin">
                          <Loader2 size={24} className="text-emerald-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center mb-8">
                      <div className={`text-7xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-3 transition-all duration-500 ${animateResults ? 'scale-110' : ''}`}>
                        {agentCount}
                      </div>
                      <div className="text-lg text-slate-400 font-medium">agents</div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="1000"
                          value={agentCount}
                          onChange={(e) => setAgentCount(parseInt(e.target.value))}
                          className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer slider-gradient"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${(agentCount/1000)*100}%, #374151 ${(agentCount/1000)*100}%, #374151 100%)`
                          }}
                        />
                        <div className="flex justify-between text-sm text-slate-500 mt-2">
                          <span>1</span>
                          <span>1000</span>
                        </div>
                      </div>
                      
                      <Input
                        type="number"
                        value={agentCount}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(1000, parseInt(e.target.value) || 1));
                          setAgentCount(value);
                        }}
                        className="bg-slate-800/50 border-slate-600 text-white text-2xl py-6 text-center font-bold rounded-2xl focus:border-emerald-500 focus:ring-emerald-500/20"
                        min="1"
                        max="1000"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* AHT Card */}
                <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
                          <Clock size={28} className="text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">Handle Time</h3>
                          <p className="text-slate-400">Average per call duration</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mb-8">
                      <div className={`text-7xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3 transition-all duration-500 ${animateResults ? 'scale-110' : ''}`}>
                        {ahtMinutes}
                      </div>
                      <div className="text-lg text-slate-400 font-medium">minutes</div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="0.5"
                          value={ahtMinutes}
                          onChange={(e) => setAhtMinutes(parseFloat(e.target.value))}
                          className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(ahtMinutes/30)*100}%, #374151 ${(ahtMinutes/30)*100}%, #374151 100%)`
                          }}
                        />
                        <div className="flex justify-between text-sm text-slate-500 mt-2">
                          <span>1m</span>
                          <span>30m</span>
                        </div>
                      </div>
                      
                      <Input
                        type="number"
                        value={ahtMinutes}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(30, parseFloat(e.target.value) || 1));
                          setAhtMinutes(value);
                        }}
                        className="bg-slate-800/50 border-slate-600 text-white text-2xl py-6 text-center font-bold rounded-2xl focus:border-blue-500 focus:ring-blue-500/20"
                        min="1"
                        max="30"
                        step="0.5"
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Total Calls Card */
              <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl">
                        <PhoneCall size={28} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Monthly Calls</h3>
                        <p className="text-slate-400">Total call volume per month</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <div className={`text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3 transition-all duration-500 ${animateResults ? 'scale-110' : ''}`}>
                      {formatNumber(totalCalls)}
                    </div>
                    <div className="text-lg text-slate-400 font-medium">calls</div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="range"
                        min="1000"
                        max="1000000"
                        step="1000"
                        value={totalCalls}
                        onChange={(e) => setTotalCalls(parseInt(e.target.value))}
                        className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${((totalCalls-1000)/(1000000-1000))*100}%, #374151 ${((totalCalls-1000)/(1000000-1000))*100}%, #374151 100%)`
                        }}
                      />
                      <div className="flex justify-between text-sm text-slate-500 mt-2">
                        <span>1K</span>
                        <span>1M</span>
                      </div>
                    </div>
                    
                    <Input
                      type="number"
                      value={totalCalls}
                      onChange={(e) => {
                        const value = Math.max(1000, Math.min(1000000, parseInt(e.target.value) || 1000));
                        setTotalCalls(value);
                      }}
                      className="bg-slate-800/50 border-slate-600 text-white text-2xl py-6 text-center font-bold rounded-2xl focus:border-emerald-500 focus:ring-emerald-500/20"
                      min="1000"
                      max="1000000"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call Volume Display */}
            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-slate-600/50 rounded-3xl shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 size={24} className="text-emerald-400" />
                    <div>
                      <div className="text-white font-semibold text-lg">Monthly Volume</div>
                      <div className="text-slate-400 text-sm">
                        {selectedMetric === 'agents' 
                          ? `${agentCount} agents × ${ahtMinutes}min × 8hrs × 22 days`
                          : 'Direct input'
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-400">
                    {formatNumber(selectedMetric === 'agents' ? results.callVolume : totalCalls)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section - Right Side */}
          <div className="xl:col-span-7 space-y-8" ref={resultsRef}>
            
            {/* Main Savings Hero Card */}
            <Card className={`relative overflow-hidden rounded-3xl border-0 shadow-2xl transition-all duration-700 hover:scale-105 ${animateResults ? 'animate-pulse' : ''}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${getSavingsColor(results.monthlySavings)} opacity-90`}></div>
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
              <CardContent className="relative z-10 p-12">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles size={32} className="text-white mr-3" />
                    <h2 className="text-3xl font-bold text-white">Monthly Savings</h2>
                  </div>
                  
                  <div className={`text-8xl md:text-9xl font-black text-white mb-6 transition-all duration-500 ${animateResults ? 'scale-110' : ''}`}>
                    {formatCurrency(results.monthlySavings)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mt-8">
                    <div className="text-center">
                      <div className="text-white/80 text-lg mb-2">Cost Reduction</div>
                      <div className="text-4xl font-black text-white flex items-center justify-center">
                        <TrendingDown size={32} className="mr-2" />
                        {results.costReduction || 0}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white/80 text-lg mb-2">ROI</div>
                      <div className="text-4xl font-black text-white flex items-center justify-center">
                        <TrendingUp size={32} className="mr-2" />
                        {results.roiPercent || 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traditional Cost */}
              <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl shadow-xl hover:shadow-red-500/10 transition-all duration-500 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <DollarSign size={28} className="text-red-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">Traditional BPO</h3>
                  </div>
                  <div className="text-5xl font-black text-red-400 mb-4">
                    {formatCurrency(results.tradCost)}
                  </div>
                  <div className="text-lg text-red-300/80">
                    {formatCurrency(results.tradPerCall)}/call
                  </div>
                </CardContent>
              </Card>

              {/* AI Cost */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Zap size={28} className="text-blue-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">SentraTech AI</h3>
                  </div>
                  <div className="text-5xl font-black text-blue-400 mb-4">
                    {formatCurrency(results.aiCost)}
                  </div>
                  <div className="text-lg text-blue-300/80">
                    {formatCurrency(results.aiPerCall)}/call
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Annual Projection */}
            <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Calculator size={24} className="text-emerald-400" />
                    <h3 className="text-2xl font-bold text-white">Annual Projection</h3>
                  </div>
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {showBreakdown ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    {formatCurrency(results.annualSavings)}
                  </div>
                  <div className="text-slate-400 text-lg">Total savings over 12 months</div>
                </div>

                {/* Expandable Breakdown */}
                {showBreakdown && (
                  <div className="mt-8 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/30 transition-all duration-500">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-slate-400 text-sm mb-1">Market</div>
                        <div className="text-emerald-400 font-bold text-lg">{selectedCountry}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm mb-1">
                          {selectedMetric === 'agents' ? 'Agents' : 'Calls/Month'}
                        </div>
                        <div className="text-blue-400 font-bold text-lg">
                          {selectedMetric === 'agents' ? agentCount : formatNumber(totalCalls)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center pt-8">
              <Button 
                size="lg"
                onClick={handleGetROIReport}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold px-16 py-6 rounded-3xl transform hover:scale-110 transition-all duration-300 text-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/50"
              >
                <Target className="mr-4" size={28} />
                Get Detailed ROI Report
                <ArrowRight className="ml-4" size={28} />
              </Button>
              <p className="text-slate-400 text-lg mt-6">
                Receive your personalized analysis within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Ultra-Modern Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 max-w-lg w-full mx-4 border border-white/20 shadow-2xl transform animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl">
                    <Mail size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Get Your ROI Report</h3>
                </div>
                <button
                  onClick={closeEmailModal}
                  className="text-slate-400 hover:text-white transition-colors hover:bg-white/10 rounded-xl p-2"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={submitROIReport} className="space-y-8">
                <div>
                  <Label htmlFor="email" className="text-white text-xl font-semibold mb-4 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    className="bg-white/10 border-white/20 text-white rounded-2xl text-lg py-4 w-full focus:border-emerald-500 focus:ring-emerald-500/20 backdrop-blur-xl"
                    required
                    autoFocus
                  />
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="text-slate-300 text-lg mb-4 font-semibold">Your ROI Summary:</div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-slate-400 text-sm mb-1">Market</div>
                      <div className="text-emerald-400 font-bold text-lg">{selectedCountry}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm mb-1">
                        {selectedMetric === 'agents' ? 'Agents' : 'Monthly Calls'}
                      </div>
                      <div className="text-blue-400 font-bold text-lg">
                        {selectedMetric === 'agents' ? agentCount : formatNumber(totalCalls)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm mb-1">Monthly Savings</div>
                      <div className="text-emerald-400 font-bold text-lg">{formatCurrency(results.monthlySavings)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm mb-1">ROI</div>
                      <div className="text-blue-400 font-bold text-lg">{results.roiPercent || 0}%</div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400 text-sm backdrop-blur-xl">
                    {error}
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={closeEmailModal}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-2xl py-3 backdrop-blur-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-2xl py-3 transform hover:scale-105 transition-all duration-300"
                  >
                    {isSubmittingReport ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2" size={18} />
                        Send ROI Report
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="text-slate-400 text-sm mt-6 text-center">
                You'll receive a comprehensive ROI analysis within 24 hours
              </p>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {reportSubmitted && (
          <div className="fixed top-8 right-8 z-50 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl transform animate-in slide-in-from-right duration-500 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <Sparkles size={20} />
              <span className="font-semibold">ROI report request submitted successfully!</span>
            </div>
          </div>
        )}

        {error && !showEmailModal && (
          <div className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-2xl max-w-md transform animate-in slide-in-from-bottom duration-500 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <X size={20} />
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ROICalculator;