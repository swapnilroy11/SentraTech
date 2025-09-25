import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, DollarSign, Clock, 
  Users, BarChart3, ArrowUp, ArrowDown, Zap, Loader2, Target
} from 'lucide-react';
import axios from 'axios';
import { calculateROI, getCountries } from '../utils/calculatorLogic';

const ROICalculator = () => {
  // Multi-Country State Management
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [agentCount, setAgentCount] = useState([50]);
  const [averageHandleTime, setAverageHandleTime] = useState([8]); // minutes
  const [monthlyCallVolume, setMonthlyCallVolume] = useState(0);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Country Configuration
  const COUNTRIES = [
    { name: 'Bangladesh', baseCost: 300, flag: '🇧🇩' },
    { name: 'India', baseCost: 500, flag: '🇮🇳' },
    { name: 'Philippines', baseCost: 600, flag: '🇵🇭' },
    { name: 'Mexico', baseCost: 700, flag: '🇲🇽' }
  ];

  // Auto-calculate monthly call volume based on agents and AHT
  useEffect(() => {
    const workingHoursPerMonth = 22 * 8; // 22 working days, 8 hours per day
    const callsPerAgentPerHour = 60 / averageHandleTime[0]; // calls per hour based on AHT
    const totalCallsPerMonth = agentCount[0] * workingHoursPerMonth * callsPerAgentPerHour;
    const callVolumeInMinutes = totalCallsPerMonth * averageHandleTime[0]; // Convert to minutes
    setMonthlyCallVolume(Math.round(callVolumeInMinutes));
  }, [agentCount, averageHandleTime]);

  // Real-time calculation when inputs change
  useEffect(() => {
    try {
      if (agentCount[0] > 0 && monthlyCallVolume > 0) {
        const metrics = calculateROI(selectedCountry, agentCount[0], monthlyCallVolume);
        setResults(metrics);
      }
    } catch (error) {
      console.error('Error calculating ROI:', error);
      setError('Calculation error. Please check your inputs.');
    }
  }, [selectedCountry, agentCount, averageHandleTime, monthlyCallVolume]);

  // Handle country selection
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setError(null);
  };

  // Save ROI calculation to backend
  const saveROICalculation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSavedSuccessfully(false);

      const requestData = {
        input_data: {
          agent_count: agentCount[0],
          average_handle_time: averageHandleTime[0] * 60, // convert to seconds
          monthly_call_volume: Math.round(monthlyCallVolume / averageHandleTime[0]), // convert back to call count
          cost_per_agent: results.countryBaseline || 500
        },
        user_info: {
          timestamp: new Date().toISOString(),
          source: 'multi_country_calculator',
          country: selectedCountry
        }
      };

      await axios.post(`${BACKEND_URL}/api/roi/save`, requestData);
      setSavedSuccessfully(true);
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (err) {
      console.error('Error saving ROI calculation:', err);
      setError('Failed to save calculation. Please try again.');
    } finally {
      setIsLoading(false);
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
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            Multi-Country ROI Calculator
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">Calculate Your </span>
            <span className="text-[#00FF41]">Global Savings</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            Compare AI automation savings across different countries with real BPO market baselines.
          </p>
        </div>

        {/* Country Selection Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {COUNTRIES.map((country) => (
            <Button
              key={country.name}
              onClick={() => handleCountryChange(country.name)}
              variant={selectedCountry === country.name ? "default" : "outline"}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedCountry === country.name 
                  ? 'bg-[#00FF41] text-[#0A0A0A] shadow-lg shadow-[#00FF41]/30' 
                  : 'border-[rgb(63,63,63)] text-white hover:border-[#00FF41] hover:bg-[#00FF41]/10'
              }`}
            >
              <span className="mr-2 text-lg">{country.flag}</span>
              <div className="text-left">
                <div className="font-bold">{country.name}</div>
                <div className="text-xs opacity-80">${country.baseCost}/agent/month</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Input Controls */}
          <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-2xl text-white flex items-center space-x-3">
                <div className="p-3 bg-[#00FF41]/20 rounded-xl border border-[#00FF41]/50">
                  <BarChart3 size={24} className="text-[#00FF41]" />
                </div>
                <span>Calculator Inputs</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-8">
              {/* Selected Country Info */}
              <div className="bg-gradient-to-r from-[#00FF41]/10 to-[#00DDFF]/10 rounded-2xl p-6 border border-[#00FF41]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#00FF41] font-semibold text-lg">Selected Country</div>
                    <div className="text-white text-xl font-bold">{selectedCountry}</div>
                    <div className="text-[rgb(161,161,170)] text-sm">
                      Base cost: {formatCurrency(results.countryBaseline || COUNTRIES.find(c => c.name === selectedCountry)?.baseCost)}/agent/month
                    </div>
                  </div>
                  <div className="text-4xl">
                    {COUNTRIES.find(c => c.name === selectedCountry)?.flag}
                  </div>
                </div>
              </div>

              {/* Agent Count */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-white text-lg font-semibold">
                    Agent Count
                  </Label>
                  <div className="text-2xl font-bold text-[#00FF41]">{agentCount[0]}</div>
                </div>
                <Slider
                  value={agentCount}
                  onValueChange={setAgentCount}
                  max={500}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[rgb(161,161,170)] mt-2">
                  <span>1</span>
                  <span>500+</span>
                </div>
              </div>

              {/* Average Handle Time */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-white text-lg font-semibold">
                    Average Handle Time
                  </Label>
                  <div className="text-2xl font-bold text-[#00DDFF]">{averageHandleTime[0]} min</div>
                </div>
                <Slider
                  value={averageHandleTime}
                  onValueChange={setAverageHandleTime}
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

              {/* Auto-calculated Call Volume */}
              <div className="bg-[rgb(38,40,42)] rounded-xl p-6 border border-[rgb(63,63,63)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold text-lg">Monthly Call Volume</div>
                  <div className="text-2xl font-bold text-[#00FF41]">
                    {formatNumber(monthlyCallVolume)} min
                  </div>
                </div>
                <div className="text-[rgb(161,161,170)] text-sm">
                  Auto-calculated: {formatNumber(results.callCount || 0)} calls × {averageHandleTime[0]} min avg
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-6">
            {/* Cost Comparison */}
            <Card className="bg-gradient-to-br from-[#00FF41]/10 to-[#00DDFF]/10 border-2 border-[#00FF41] rounded-3xl p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl text-white flex items-center space-x-3">
                  <TrendingUp size={24} className="text-[#00FF41]" />
                  <span>Cost Analysis</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-6 bg-[rgb(26,28,30)]/70 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                    <div className="text-sm text-[rgb(161,161,170)] mb-2">Traditional BPO Cost</div>
                    <div className="text-3xl font-bold text-red-400 mb-2 font-rajdhani">
                      {formatCurrency(results.traditional?.totalCost)}
                    </div>
                    <div className="text-xs text-[rgb(161,161,170)]">
                      {formatCurrency(results.traditionalCostPerCall)}/call
                    </div>
                  </div>

                  <div className="text-center p-6 bg-[rgb(26,28,30)]/70 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                    <div className="text-sm text-[rgb(161,161,170)] mb-2">AI Automation Cost</div>
                    <div className="text-3xl font-bold text-[#00DDFF] mb-2 font-rajdhani">
                      {formatCurrency(results.ai?.totalCost)}
                    </div>
                    <div className="text-xs text-[rgb(161,161,170)]">
                      {formatCurrency(results.aiCostPerCall)}/call
                    </div>
                  </div>
                </div>

                {/* Savings Display */}
                <div className="text-center p-8 bg-gradient-to-r from-[#00FF41]/20 to-[#00DDFF]/20 rounded-2xl border border-[#00FF41]/30">
                  <div className="text-sm text-[rgb(161,161,170)] mb-2">Monthly Savings</div>
                  <div className="text-5xl font-bold text-[#00FF41] mb-4 font-rajdhani">
                    {formatCurrency(results.monthlySavings)}
                  </div>
                  <div className="flex items-center justify-center space-x-6 text-lg">
                    <div className="flex items-center text-[#00FF41]">
                      <ArrowDown size={20} className="mr-2" />
                      <span>{results.costReduction?.toFixed(0)}% Cost Reduction</span>
                    </div>
                    <div className="flex items-center text-[#00DDFF]">
                      <ArrowUp size={20} className="mr-2" />
                      <span>{results.roiPercent?.toFixed(0)}% ROI</span>
                    </div>
                  </div>
                  {results.paybackPeriodMonths && results.paybackPeriodMonths < 24 && (
                    <div className="mt-4 text-sm text-[rgb(161,161,170)]">
                      Payback Period: {results.paybackPeriodMonths?.toFixed(1)} months
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {savedSuccessfully && (
                  <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm text-center">
                    ✅ ROI calculation saved successfully!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <BarChart3 size={20} className="text-[#00DDFF]" />
                  <span>Cost Breakdown</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="flex justify-between items-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                  <span className="text-white font-medium">Labor Cost ({selectedCountry})</span>
                  <span className="text-[#00FF41] font-bold text-lg">
                    {formatCurrency(results.traditional?.laborCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                  <span className="text-white font-medium">Technology & Infrastructure</span>
                  <span className="text-[#00DDFF] font-bold text-lg">
                    {formatCurrency((results.traditional?.technologyCost || 0) + (results.traditional?.infrastructureCost || 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                  <span className="text-white font-medium">AI Platform & Processing</span>
                  <span className="text-[rgb(192,192,192)] font-bold text-lg">
                    {formatCurrency(results.ai?.totalCost)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl text-white flex items-center space-x-3">
                  <Zap size={20} className="text-[#00DDFF]" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <div className="flex justify-between items-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                  <div>
                    <div className="text-white font-semibold">Automated Calls</div>
                    <div className="text-[rgb(161,161,170)] text-sm">80% automation rate</div>
                  </div>
                  <Badge className="bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/30 text-lg px-4 py-2">
                    {formatNumber(results.automatedCalls)}/month
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                  <div>
                    <div className="text-white font-semibold">Human-Assisted</div>
                    <div className="text-[rgb(161,161,170)] text-sm">Complex issues only</div>
                  </div>
                  <Badge className="bg-[#00DDFF]/20 text-[#00DDFF] border-[#00DDFF]/30 text-lg px-4 py-2">
                    {formatNumber(results.humanAssistedCalls)}/month
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-4 bg-[rgb(38,40,42)] rounded-xl">
                  <div>
                    <div className="text-white font-semibold">Annual Savings</div>
                    <div className="text-[rgb(161,161,170)] text-sm">Total yearly cost reduction</div>
                  </div>
                  <div className="text-[#00FF41] font-bold text-xl">
                    {formatCurrency(results.annualSavings)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center pt-6">
              <Button 
                size="lg"
                onClick={saveROICalculation}
                disabled={isLoading}
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto font-rajdhani disabled:opacity-50 disabled:transform-none text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-3" size={24} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Target className="mr-3" size={24} />
                    Get Detailed ROI Report
                  </>
                )}
              </Button>
              <p className="text-[rgb(161,161,170)] text-sm mt-4">
                Compare {selectedCountry} BPO costs vs. AI automation • Schedule demo for validation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;