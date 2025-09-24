import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, DollarSign, Clock, 
  Users, BarChart3, ArrowUp, ArrowDown, Zap, Loader2
} from 'lucide-react';
import axios from 'axios';

const ROICalculator = () => {
  const [callVolume, setCallVolume] = useState([25000]);
  const [currentCostPerCall, setCurrentCostPerCall] = useState(8.5);
  const [averageHandleTime, setAverageHandleTime] = useState(480); // seconds
  const [agentCount, setAgentCount] = useState(50);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Calculate ROI using backend API
  const calculateROI = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const inputData = {
        call_volume: callVolume[0],
        current_cost_per_call: currentCostPerCall,
        average_handle_time: averageHandleTime,
        agent_count: agentCount
      };

      const response = await axios.post(`${BACKEND_URL}/api/roi/calculate`, inputData);
      setResults(response.data);
    } catch (err) {
      console.error('Error calculating ROI:', err);
      setError('Failed to calculate ROI. Please try again.');
      // Fallback to client-side calculation
      calculateROIClientSide();
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback client-side calculation (same as original)
  const calculateROIClientSide = () => {
    const monthlyVolume = callVolume[0];
    const currentMonthlyCost = monthlyVolume * currentCostPerCall;
    const currentAnnualCost = currentMonthlyCost * 12;
    
    // SentraTech improvements
    const automationRate = 0.7; // 70% automation
    const ahtReduction = 0.35; // 35% AHT reduction
    const costReduction = 0.45; // 45% cost reduction
    
    const newCostPerCall = currentCostPerCall * (1 - costReduction);
    const newMonthlyCost = monthlyVolume * newCostPerCall;
    const newAnnualCost = newMonthlyCost * 12;
    
    const monthlySavings = currentMonthlyCost - newMonthlyCost;
    const annualSavings = currentAnnualCost - newAnnualCost;
    
    const newAHT = averageHandleTime * (1 - ahtReduction);
    const timeSavedPerCall = averageHandleTime - newAHT;
    const totalTimeSavedMonthly = (timeSavedPerCall * monthlyVolume) / 3600; // hours
    
    const automatedCalls = monthlyVolume * automationRate;
    const humanAssistedCalls = monthlyVolume * (1 - automationRate);
    
    setResults({
      current_monthly_cost: currentMonthlyCost,
      current_annual_cost: currentAnnualCost,
      new_monthly_cost: newMonthlyCost,
      new_annual_cost: newAnnualCost,
      monthly_savings: monthlySavings,
      annual_savings: annualSavings,
      cost_reduction_percent: costReduction * 100,
      new_aht: newAHT,
      time_saved_per_call: timeSavedPerCall,
      total_time_saved_monthly: totalTimeSavedMonthly,
      aht_reduction_percent: ahtReduction * 100,
      automated_calls: automatedCalls,
      human_assisted_calls: humanAssistedCalls,
      automation_rate: automationRate * 100,
      roi: (annualSavings / newAnnualCost) * 100
    });
  };

  // Save ROI calculation to database
  const saveROICalculation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSavedSuccessfully(false);

      const requestData = {
        input_data: {
          call_volume: callVolume[0],
          current_cost_per_call: currentCostPerCall,
          average_handle_time: averageHandleTime,
          agent_count: agentCount
        },
        user_info: {
          timestamp: new Date().toISOString(),
          source: 'website_calculator'
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

  // Trigger calculation when inputs change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      calculateROI();
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [callVolume, currentCostPerCall, averageHandleTime, agentCount]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(17,17,19)]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            ROI Calculator
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">Calculate Your </span>
            <span className="text-[#00FF41]">Savings</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            See the potential cost savings and efficiency gains from implementing 
            our AI-powered customer support platform.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Input Controls */}
          <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 lg:p-8">
            <CardHeader className="p-0 mb-6 lg:mb-8">
              <CardTitle className="text-xl lg:text-2xl text-white flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="p-2 lg:p-3 bg-[#DAFF01]/20 rounded-xl border border-[#DAFF01]/50">
                  <BarChart3 size={20} className="text-[#DAFF01] lg:w-6 lg:h-6" />
                </div>
                <span className="text-lg lg:text-2xl">Your Current Metrics</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-6 lg:space-y-8">
              {/* Monthly Call Volume */}
              <div>
                <Label className="text-white text-base lg:text-lg mb-3 lg:mb-4 block">
                  Monthly Call Volume: {callVolume[0].toLocaleString()} calls
                </Label>
                <Slider
                  value={callVolume}
                  onValueChange={setCallVolume}
                  max={500000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[rgb(161,161,170)] mt-2">
                  <span>1,000</span>
                  <span>500,000+</span>
                </div>
              </div>

              {/* Cost Per Call */}
              <div>
                <Label htmlFor="costPerCall" className="text-white text-base lg:text-lg mb-3 lg:mb-4 block">
                  Current Cost Per Call
                </Label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)] lg:w-5 lg:h-5" />
                  <Input
                    id="costPerCall"
                    type="number"
                    value={currentCostPerCall}
                    onChange={(e) => setCurrentCostPerCall(parseFloat(e.target.value) || 0)}
                    className="pl-10 lg:pl-12 bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white rounded-xl text-base py-3"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              {/* Average Handle Time */}
              <div>
                <Label htmlFor="aht" className="text-white text-base lg:text-lg mb-3 lg:mb-4 block">
                  Average Handle Time: {formatTime(averageHandleTime)}
                </Label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)] lg:w-5 lg:h-5" />
                  <Input
                    id="aht"
                    type="number"
                    value={averageHandleTime}
                    onChange={(e) => setAverageHandleTime(parseInt(e.target.value) || 0)}
                    className="pl-10 lg:pl-12 bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white rounded-xl text-base py-3"
                    placeholder="Seconds"
                  />
                </div>
              </div>

              {/* Agent Count */}
              <div>
                <Label htmlFor="agents" className="text-white text-base lg:text-lg mb-3 lg:mb-4 block">
                  Current Agent Count
                </Label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)] lg:w-5 lg:h-5" />
                  <Input
                    id="agents"
                    type="number"
                    value={agentCount}
                    onChange={(e) => setAgentCount(parseInt(e.target.value) || 0)}
                    className="pl-10 lg:pl-12 bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white rounded-xl text-base py-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-4 lg:space-y-6">
            {/* Cost Savings Card */}
            <Card className="bg-gradient-to-br from-[#DAFF01]/10 to-[#00DDFF]/10 border-2 border-[#DAFF01] rounded-3xl p-6 lg:p-8">
              <CardHeader className="p-0 mb-4 lg:mb-6">
                <CardTitle className="text-xl lg:text-2xl text-white flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <TrendingUp size={20} className="text-[#DAFF01] lg:w-6 lg:h-6" />
                  <span>Projected Savings</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="text-center p-4 lg:p-6 bg-[rgb(26,28,30)]/50 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                    <div className="text-2xl lg:text-3xl font-bold text-[#00FF41] mb-2 font-rajdhani">
                      {isLoading ? (
                        <Loader2 className="animate-spin mx-auto" size={32} />
                      ) : (
                        formatCurrency(results.monthly_savings || 0)
                      )}
                    </div>
                    <div className="text-[rgb(218,218,218)] text-sm">Monthly Savings</div>
                    <div className="flex items-center justify-center mt-2 text-[#00FF41]">
                      <ArrowDown size={14} className="mr-1" />
                      <span className="text-sm">{results.cost_reduction_percent?.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="text-center p-4 lg:p-6 bg-[rgb(26,28,30)]/50 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                    <div className="text-2xl lg:text-3xl font-bold text-[#00DDFF] mb-2">
                      {isLoading ? (
                        <Loader2 className="animate-spin mx-auto" size={32} />
                      ) : (
                        formatCurrency(results.annual_savings || 0)
                      )}
                    </div>
                    <div className="text-[rgb(218,218,218)] text-sm">Annual Savings</div>
                    <div className="flex items-center justify-center mt-2 text-[#00DDFF]">
                      <ArrowUp size={14} className="mr-1" />
                      <span className="text-sm">{results.roi?.toFixed(0)}% ROI</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {savedSuccessfully && (
                  <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm text-center">
                    ✅ ROI calculation saved successfully!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Improvements */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 lg:p-8">
              <CardHeader className="p-0 mb-4 lg:mb-6">
                <CardTitle className="text-lg lg:text-xl text-white flex items-center space-x-3">
                  <Zap size={18} className="text-[#00DDFF] lg:w-5 lg:h-5" />
                  <span>Performance Improvements</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-3 lg:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)] space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm lg:text-base">Average Handle Time</div>
                    <div className="text-[rgb(161,161,170)] text-xs lg:text-sm">
                      {formatTime(averageHandleTime)} → {formatTime(results.newAHT || 0)}
                    </div>
                  </div>
                  <Badge className="bg-[#DAFF01]/20 text-[#DAFF01] border-[#DAFF01]/30 w-fit">
                    -{results.ahtReductionPercent?.toFixed(0)}%
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)] space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm lg:text-base">Automated Interactions</div>
                    <div className="text-[rgb(161,161,170)] text-xs lg:text-sm">
                      {results.automatedCalls?.toLocaleString()} calls/month
                    </div>
                  </div>
                  <Badge className="bg-[#00DDFF]/20 text-[#00DDFF] border-[#00DDFF]/30 w-fit">
                    {results.automationRate?.toFixed(0)}%
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)] space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm lg:text-base">Time Saved Monthly</div>
                    <div className="text-[rgb(161,161,170)] text-xs lg:text-sm">
                      {results.totalTimeSavedMonthly?.toLocaleString()} agent hours
                    </div>
                  </div>
                  <Badge className="bg-[rgb(192,192,192)]/20 text-[rgb(192,192,192)] border-[rgb(192,192,192)]/30 w-fit">
                    Efficiency
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center pt-4">
              <Button 
                size="lg"
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto font-rajdhani"
              >
                Get Detailed ROI Report
              </Button>
              <p className="text-[rgb(161,161,170)] text-xs lg:text-sm mt-4">
                Schedule a personalized demo to see these results in action
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;