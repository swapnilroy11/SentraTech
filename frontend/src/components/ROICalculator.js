import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, TrendingDown, DollarSign, Clock,
  Users, Zap, Loader2, Target, Mail, X, 
  ArrowDown, ArrowUp, Sparkles
} from 'lucide-react';
import { calculateROI } from '../utils/calculatorLogic';
import { COUNTRIES } from '../utils/costBaselines';
import { supabase } from '../lib/supabaseClient';

const ROICalculator = () => {
  // State Management - Agent Count and AHT
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [agentCount, setAgentCount] = useState(10);     // Default 10 agents
  const [ahtMinutes, setAhtMinutes] = useState(7);   // Default 7 as specified
  const [manualCallVolume, setManualCallVolume] = useState(null); // Manual override for call volume
  const [useManualVolume, setUseManualVolume] = useState(false);  // Toggle for manual vs auto calculation
  
  // Validation warnings
  const [agentWarning, setAgentWarning] = useState('');
  const [ahtWarning, setAhtWarning] = useState('');
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initial calculation on component mount
  useEffect(() => {
    if (agentCount > 0 && ahtMinutes > 0) {
      const initialMetrics = calculateROI(selectedCountry, agentCount, ahtMinutes);
      setResults(initialMetrics);
    }
  }, []); // Run once on mount
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Real-time calculation with immediate updates
  useEffect(() => {
    const calculateMetrics = () => {
      try {
        setIsCalculating(true);
        if (agentCount > 0 && ahtMinutes > 0) {
          const callVolumeOverride = useManualVolume && manualCallVolume ? manualCallVolume : null;
          const metrics = calculateROI(selectedCountry, agentCount, ahtMinutes, callVolumeOverride);
          
          console.log('ROI Results:', {
            country: metrics.country,
            costReduction: metrics.costReduction,
            roiPercent: metrics.roiPercent,
            tradCost: metrics.tradCost,
            aiCost: metrics.aiCost,
            monthlySavings: metrics.monthlySavings
          });
          setResults(metrics);
          setError(null);
        } else {
          // Reset to empty results if invalid inputs
          setResults({});
        }
      } catch (error) {
        console.error('Error calculating ROI:', error);
        setError('Calculation error. Please check your inputs.');
      } finally {
        setTimeout(() => setIsCalculating(false), 100);
      }
    };

    // Calculate immediately, no debouncing
    calculateMetrics();
  }, [selectedCountry, agentCount, ahtMinutes, useManualVolume, manualCallVolume]);

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
        aht_minutes: ahtMinutes,
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
      
      // Auto-close confirmation after 10 seconds (longer for better UX)
      setTimeout(() => setReportSubmitted(false), 10000);

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
    <div id="roi-calculator" className="bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Country Badge */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            ROI Analysis – <span className="text-[#00FF41]">{selectedCountry}</span>
          </Badge>
        </div>

        {/* Country Selection */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-[rgb(26,28,30)] rounded-2xl p-2 border border-[rgba(255,255,255,0.1)] shadow-lg">
            {COUNTRIES.map((country) => (
              <button
                key={country.name}
                onClick={() => handleCountryChange(country.name)}
                className={`px-6 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-4 transform hover:scale-105 relative overflow-hidden ${
                  selectedCountry === country.name 
                    ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg shadow-[#00FF41]/25 z-10' 
                    : 'text-[rgb(161,161,170)] hover:text-white hover:bg-[rgb(38,40,42)] hover:scale-102 hover:shadow-md'
                }`}
              >
                {/* Animated 3D Flag replacing country initials */}
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  selectedCountry === country.name 
                    ? 'bg-[#0A0A0A]/20 shadow-lg' 
                    : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]'
                }`}>
                  {/* Main 3D Flag with flying animation */}
                  <div 
                    className={`text-2xl filter transition-all duration-500 ${
                      selectedCountry === country.name 
                        ? 'drop-shadow-xl scale-125 brightness-125 animate-bounce' 
                        : 'drop-shadow-lg hover:scale-110 hover:brightness-110'
                    }`}
                    style={{
                      textShadow: selectedCountry === country.name 
                        ? '3px 3px 6px rgba(0,0,0,0.6), 0 0 15px rgba(0,255,65,0.4)' 
                        : '2px 2px 4px rgba(0,0,0,0.4)',
                      transform: selectedCountry === country.name 
                        ? 'perspective(150px) rotateY(-10deg) rotateX(10deg)' 
                        : 'perspective(150px) rotateY(0deg) rotateX(0deg)',
                      animation: selectedCountry === country.name 
                        ? 'flagFly 2s ease-in-out infinite alternate' 
                        : 'none'
                    }}
                  >
                    {country.flag}
                  </div>
                  
                  {/* 3D depth shadow effect */}
                  <div 
                    className={`absolute inset-0 text-2xl opacity-20 transition-all duration-500 ${
                      selectedCountry === country.name ? 'block' : 'hidden'
                    }`}
                    style={{
                      transform: 'perspective(150px) rotateY(-10deg) rotateX(10deg) translateZ(-3px)',
                      filter: 'blur(1.5px)',
                      color: '#00FF41'
                    }}
                  >
                    {country.flag}
                  </div>
                  
                  {/* Glowing ring effect for active state */}
                  {selectedCountry === country.name && (
                    <div className="absolute inset-0 rounded-full border-2 border-[#00FF41] opacity-50 animate-ping"></div>
                  )}
                </div>

                <div className="text-left flex-1">
                  <div className="flex items-center space-x-2">
                    <div className={`text-sm font-bold leading-tight ${
                      selectedCountry === country.name ? 'text-[#0A0A0A]' : 'text-white'
                    }`}>
                      {country.name}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedCountry === country.name 
                        ? 'bg-[#0A0A0A]/20 text-[#0A0A0A]' 
                        : 'bg-[#00FF41]/20 text-[#00FF41]'
                    }`}>
                      ${country.baseCost}/agent
                    </div>
                  </div>
                  <div className={`text-xs opacity-75 leading-tight mt-1 ${
                    selectedCountry === country.name ? 'text-[#0A0A0A]/70' : 'text-[rgb(161,161,170)]'
                  }`}>
                    {country.description}
                  </div>
                </div>
                
                {/* Active indicator with enhanced effect */}
                {selectedCountry === country.name && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#0A0A0A] rounded-full shadow-lg animate-pulse border-2 border-[#00FF41]"></div>
                )}
                
                {/* Subtle background glow for active state */}
                {selectedCountry === country.name && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00FF41]/10 via-[#00FF41]/5 to-[#00FF41]/10 rounded-xl pointer-events-none"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Two-Panel Input Section */}
          <div className="mb-12">
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl text-white flex items-center justify-center space-x-4">
                  <div className="p-3 bg-[#00FF41]/20 rounded-xl border border-[#00FF41]/50">
                    <Calculator size={24} className="text-[#00FF41]" />
                  </div>
                  <span>Input Parameters</span>
                  {isCalculating && (
                    <div className="animate-spin">
                      <Loader2 size={24} className="text-[#00FF41]" />
                    </div>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Three Side-by-Side Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* First Panel: Agent Count */}
                  <div className="bg-[rgb(38,40,42)] rounded-xl p-3 border border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-1.5 bg-[#00FF41]/20 rounded-lg border border-[#00FF41]/50 mr-2">
                        <Users size={16} className="text-[#00FF41]" />
                      </div>
                      <h3 className="text-base font-semibold text-white">Agent Count</h3>
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className="text-4xl font-black text-[#00FF41] mb-1 font-rajdhani">
                        {agentCount}
                      </div>
                      <div className="text-xs text-[rgb(161,161,170)]">agents</div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Slider */}
                      <div>
                        <input
                          type="range"
                          min="1"
                          max="500"
                          value={Math.min(Math.max(agentCount, 1), 500)}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setAgentCount(value);
                            setAgentWarning(''); // Clear warning when using slider
                          }}
                          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer slider-gradient"
                          style={{
                            background: `linear-gradient(to right, #00FF41 0%, #00FF41 ${(Math.min(Math.max(agentCount, 1), 500)/500)*100}%, #374151 ${(Math.min(Math.max(agentCount, 1), 500)/500)*100}%, #374151 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-[rgb(161,161,170)] mt-1">
                          <span>1</span>
                          <span>500</span>
                        </div>
                      </div>
                      
                      {/* Number Input */}
                      <div>
                        <Input
                          type="number"
                          value={agentCount}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numValue = parseInt(inputValue) || 0;
                            
                            // Always allow the input
                            setAgentCount(numValue);
                            
                            // Show warnings for out-of-range values
                            if (numValue < 1) {
                              setAgentWarning('⚠️ Minimum 1 agent required for calculations');
                            } else if (numValue > 500) {
                              setAgentWarning('⚠️ Values above 500 agents may not be accurate');
                            } else {
                              setAgentWarning('');
                            }
                          }}
                          className={`bg-[rgb(26,28,30)] text-white rounded-lg text-lg py-3 text-center font-semibold focus:ring-[#00FF41]/20 ${
                            agentWarning ? 'border-yellow-500 focus:border-yellow-500' : 'border-[#00FF41]/50 focus:border-[#00FF41]'
                          }`}
                          placeholder="Enter agent count"
                        />
                        {agentWarning && (
                          <div className="text-yellow-400 text-xs mt-1 text-center">{agentWarning}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Second Panel: Average Handle Time */}
                  <div className="bg-[rgb(38,40,42)] rounded-xl p-3 border border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-1.5 bg-[#00DDFF]/20 rounded-lg border border-[#00DDFF]/50 mr-2">
                        <Clock size={16} className="text-[#00DDFF]" />
                      </div>
                      <h3 className="text-base font-semibold text-white">Handle Time</h3>
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className="text-4xl font-black text-[#00DDFF] mb-1 font-rajdhani">
                        {ahtMinutes}
                      </div>
                      <div className="text-xs text-[rgb(161,161,170)]">minutes</div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Slider */}
                      <div>
                        <input
                          type="range"
                          min="1"
                          max="60"
                          step="1"
                          value={Math.min(Math.max(ahtMinutes, 1), 60)}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setAhtMinutes(value);
                            setAhtWarning(''); // Clear warning when using slider
                          }}
                          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #00DDFF 0%, #00DDFF ${((Math.min(Math.max(ahtMinutes, 1), 60)-1)/(60-1))*100}%, #374151 ${((Math.min(Math.max(ahtMinutes, 1), 60)-1)/(60-1))*100}%, #374151 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-[rgb(161,161,170)] mt-1">
                          <span>1min</span>
                          <span>60min</span>
                        </div>
                      </div>
                      
                      {/* Number Input */}
                      <div>
                        <Input
                          type="number"
                          value={ahtMinutes}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numValue = parseInt(inputValue) || 0;
                            
                            // Always allow the input
                            setAhtMinutes(numValue);
                            
                            // Show warnings for out-of-range values
                            if (numValue < 1) {
                              setAhtWarning('⚠️ Minimum 1 minute required for calculations');
                            } else if (numValue > 60) {
                              setAhtWarning('⚠️ Values above 60 minutes may not be realistic');
                            } else {
                              setAhtWarning('');
                            }
                          }}
                          className={`bg-[rgb(26,28,30)] text-white rounded-lg text-lg py-3 text-center font-semibold focus:ring-[#00DDFF]/20 ${
                            ahtWarning ? 'border-yellow-500 focus:border-yellow-500' : 'border-[#00DDFF]/50 focus:border-[#00DDFF]'
                          }`}
                          placeholder="Enter minutes"
                        />
                        {ahtWarning && (
                          <div className="text-yellow-400 text-xs mt-1 text-center">{ahtWarning}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Third Panel: Call Volume */}
                  <div className="bg-[rgb(38,40,42)] rounded-xl p-3 border border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-1.5 bg-[#FFD700]/20 rounded-lg border border-[#FFD700]/50 mr-2">
                        <Calculator size={16} className="text-[#FFD700]" />
                      </div>
                      <h3 className="text-base font-semibold text-white">Call Volume</h3>
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className="text-4xl font-black text-[#FFD700] mb-1 font-rajdhani">
                        {formatNumber(useManualVolume && manualCallVolume ? manualCallVolume : (results.callVolume || 0))}
                      </div>
                      <div className="text-xs text-[rgb(161,161,170)]">monthly calls</div>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Manual/Auto Toggle */}
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <button
                          onClick={() => setUseManualVolume(!useManualVolume)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            useManualVolume 
                              ? 'bg-[#FFD700] text-[#0A0A0A]' 
                              : 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50'
                          }`}
                        >
                          {useManualVolume ? 'Manual' : 'Auto'}
                        </button>
                      </div>
                      
                      {useManualVolume ? (
                        <>
                          {/* Manual Slider */}
                          <div>
                            <input
                              type="range"
                              min="1000"
                              max="100000"
                              step="1000"
                              value={manualCallVolume || 10000}
                              onChange={(e) => setManualCallVolume(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${((manualCallVolume || 10000)/100000)*100}%, #374151 ${((manualCallVolume || 10000)/100000)*100}%, #374151 100%)`
                              }}
                            />
                            <div className="flex justify-between text-xs text-[rgb(161,161,170)] mt-1">
                              <span>1k</span>
                              <span>100k</span>
                            </div>
                          </div>
                          
                          {/* Manual Number Input */}
                          <Input
                            type="number"
                            value={manualCallVolume || ''}
                            placeholder="Enter call volume"
                            onChange={(e) => {
                              const value = Math.max(1000, Math.min(100000, parseInt(e.target.value) || 10000));
                              setManualCallVolume(value);
                            }}
                            className="bg-[rgb(26,28,30)] border-[#FFD700]/50 text-white rounded-lg text-sm py-2 text-center font-semibold focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                            min="1000"
                            max="100000"
                          />
                        </>
                      ) : (
                        <div className="text-center py-2">
                          <div className="text-xs text-[rgb(161,161,170)] leading-tight">
                            Auto: {agentCount} agents × {Math.floor((8 * 60 * 22) / ahtMinutes)} calls
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Three-Card Result Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            {/* Card 1: Traditional BPO Cost */}
            <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-[#00FF41] rounded-xl p-6 hover:scale-102 transition-all duration-300 hover:shadow-lg hover:shadow-[#00FF41]/25">
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
            <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-[#00FF41] rounded-xl p-6 hover:scale-102 transition-all duration-300 hover:shadow-lg hover:shadow-[#00FF41]/25">
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
            <Card className="bg-gradient-to-br from-[#0F1113] to-[#161B22] border border-[#00FF41] rounded-xl p-6 hover:scale-102 transition-all duration-300 hover:shadow-lg hover:shadow-[#00FF41]/25">
              <CardContent className="p-0 text-center">
                <div className="flex items-center justify-center mb-4">
                  {results.isSavings ? (
                    <TrendingUp size={28} className="text-emerald-400 mr-3" />
                  ) : (
                    <TrendingDown size={28} className="text-red-400 mr-3" />
                  )}
                  <h3 className="text-base text-[rgb(200,200,200)] font-medium">
                    {results.isSavings ? 'Your Savings & ROI' : 'Additional Cost & Loss'}
                  </h3>
                </div>
                <div className={`text-4xl font-bold mb-3 font-rajdhani ${
                  results.isSavings ? 'text-[#00FF41]' : 'text-red-400'
                }`}>
                  {results.isSavings ? '+' : '-'}{formatCurrency(Math.abs(results.monthlySavings || 0))}
                </div>
                <div className="space-y-1">
                  <div className="text-base text-[rgb(160,160,160)] flex items-center justify-center">
                    {results.isSavings ? (
                      <ArrowDown size={16} className="mr-1 text-emerald-400" />
                    ) : (
                      <ArrowUp size={16} className="mr-1 text-red-400" />
                    )}
                    {(results.costChangePercent || 0)}% {results.isSavings ? 'Cost Reduction' : 'Cost Increase'}
                  </div>
                  <div className="text-base text-[rgb(160,160,160)] flex items-center justify-center">
                    {results.isProfit ? (
                      <ArrowUp size={16} className="mr-1 text-emerald-400" />
                    ) : (
                      <ArrowDown size={16} className="mr-1 text-red-400" />
                    )}
                    {(results.roiLossPercent || 0)}% {results.isProfit ? 'ROI' : 'Loss'}
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
              
              <div className={`text-7xl font-black mb-4 font-rajdhani ${
                results.isProfit 
                  ? 'bg-gradient-to-r from-[#00FF41] to-[#00DDFF] bg-clip-text text-transparent' 
                  : 'text-red-400'
              }`}>
                {results.isProfit ? '+' : ''}{formatCurrency(Math.abs(results.annualSavings || 0))}
              </div>
              <div className="text-[rgb(161,161,170)] text-xl mb-8">
                {results.isProfit ? 'Total savings over 12 months' : 'Additional cost over 12 months'}
              </div>

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
                  <div className="text-[#FFD700] font-bold text-lg">{ahtMinutes}min</div>
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
                      <div className="text-white font-semibold">AHT:</div>
                      <div className="text-[#FFD700]">{ahtMinutes} min</div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Monthly Savings:</div>
                      <div className="text-[#00FF41] font-bold">{formatCurrency(results.monthlySavings)}</div>
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

        {/* Enhanced Success Confirmation Modal */}
        {reportSubmitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
            <div className="bg-[rgb(26,28,30)] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#00FF41]/50 shadow-2xl">
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-[#00FF41]/20 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-[#00FF41]" />
                </div>
                
                {/* Success Message */}
                <h3 className="text-2xl font-bold text-white mb-3 font-rajdhani">
                  Report Submitted Successfully!
                </h3>
                
                <p className="text-[rgb(161,161,170)] text-lg mb-6 leading-relaxed">
                  Your ROI analysis request has been submitted to <span className="text-[#00FF41] font-semibold">{email}</span>
                </p>
                
                {/* Report Details Summary */}
                <div className="bg-[rgb(38,40,42)] rounded-xl p-4 mb-6 border border-[#00FF41]/20">
                  <div className="text-sm text-[rgb(161,161,170)] mb-2">Report Details:</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-left">
                      <div className="text-[#00FF41] font-semibold">Country:</div>
                      <div className="text-white">{selectedCountry}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-[#00DDFF] font-semibold">Agents:</div>
                      <div className="text-white">{agentCount}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-[#FFD700] font-semibold">AHT:</div>
                      <div className="text-white">{ahtMinutes} min</div>
                    </div>
                    <div className="text-left">
                      <div className="text-[#00FF41] font-semibold">Savings:</div>
                      <div className="text-white font-bold">{formatCurrency(results.monthlySavings)}/mo</div>
                    </div>
                  </div>
                </div>
                
                {/* Next Steps */}
                <div className="bg-[#00FF41]/10 rounded-xl p-4 mb-6 border border-[#00FF41]/30">
                  <div className="text-[#00FF41] font-semibold text-sm mb-2">📧 What's Next?</div>
                  <div className="text-white text-sm text-left space-y-1">
                    <div>• Detailed ROI report will be sent to your email</div>
                    <div>• Includes cost breakdown and implementation roadmap</div>
                    <div>• Our team will follow up within 24 hours</div>
                  </div>
                </div>
                
                {/* Action Button */}
                <Button
                  onClick={() => setReportSubmitted(false)}
                  className="w-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold py-3 text-lg"
                >
                  Continue Exploring
                </Button>
                
                {/* Close Button */}
                <button
                  onClick={() => setReportSubmitted(false)}
                  className="absolute top-4 right-4 text-[rgb(161,161,170)] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {error && !showEmailModal && (
          <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg max-w-md">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ROICalculator;