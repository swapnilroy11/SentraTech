import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, TrendingUp, DollarSign, Clock, 
  Users, BarChart3, ArrowUp, ArrowDown, Zap, Loader2,
  Info, ToggleLeft, ToggleRight, Building2, Target
} from 'lucide-react';
import axios from 'axios';

const ROICalculator = () => {
  // Market Research Based State
  const [agentCount, setAgentCount] = useState([50]);
  const [averageHandleTime, setAverageHandleTime] = useState([8]); // minutes
  const [monthlyCallVolume, setMonthlyCallVolume] = useState(0);
  const [costPerAgent, setCostPerAgent] = useState(2800); // Market research baseline
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [viewMode, setViewMode] = useState('monthly'); // monthly or annual
  const [selectedPreset, setSelectedPreset] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Market Research Constants
  const MARKET_RESEARCH = {
    traditionalAgentCost: {
      us_dedicated: { min: 2600, max: 3400, avg: 2800 },
      offshore: { min: 1000, max: 2000, avg: 1500 }
    },
    technologyCost: 200, // per agent per month
    infrastructureCost: 150, // per agent per month (office, utilities)
    aht: {
      industry_min: 6, // minutes
      industry_max: 12, // minutes
      industry_avg: 8 // minutes
    },
    costPerCall: {
      traditional_min: 3,
      traditional_max: 15,
      traditional_avg: 8.5
    },
    ai: {
      twilioVoicePerMin: 0.018, // $0.018 per minute
      aiProcessingPerCall: 0.05, // AI inference cost per call
      platformBaseFee: 297, // Monthly Twilio infrastructure
      automationRate: 0.75, // 75% automation based on research
      costReductionRate: 0.70 // 70% cost reduction
    }
  };

  // Preset Scenarios
  const PRESETS = [
    {
      name: 'Small Team',
      description: '5-15 agents',
      agentCount: 10,
      aht: 8,
      costPerAgent: 2800
    },
    {
      name: 'Mid-size',
      description: '25-75 agents', 
      agentCount: 50,
      aht: 8,
      costPerAgent: 2800
    },
    {
      name: 'Enterprise',
      description: '100-500 agents',
      agentCount: 200,
      aht: 9,
      costPerAgent: 2900
    }
  ];

  // Auto-calculate monthly call volume based on agents and AHT
  useEffect(() => {
    const workingHoursPerMonth = 22 * 8; // 22 working days, 8 hours per day
    const callsPerAgentPerHour = 60 / averageHandleTime[0]; // calls per hour based on AHT
    const totalCallsPerMonth = agentCount[0] * workingHoursPerMonth * callsPerAgentPerHour;
    setMonthlyCallVolume(Math.round(totalCallsPerMonth));
  }, [agentCount, averageHandleTime]);

  // Market-Research-Backed Cost Calculations
  const calculateTraditionalMonthlyCost = (agents, costPerAgent) => {
    const baseLaborCost = agents * costPerAgent;
    const technologyCost = agents * MARKET_RESEARCH.technologyCost;
    const infrastructureCost = agents * MARKET_RESEARCH.infrastructureCost;
    
    return {
      laborCost: baseLaborCost,
      technologyCost: technologyCost,
      infrastructureCost: infrastructureCost,
      totalCost: baseLaborCost + technologyCost + infrastructureCost
    };
  };

  const calculateAIMonthlyCost = (callVolume) => {
    const avgCallDurationMin = averageHandleTime[0];
    const twilioVoiceCost = callVolume * avgCallDurationMin * MARKET_RESEARCH.ai.twilioVoicePerMin;
    const aiProcessingCost = callVolume * MARKET_RESEARCH.ai.aiProcessingPerCall;
    const platformFee = MARKET_RESEARCH.ai.platformBaseFee;
    
    return {
      voiceCost: twilioVoiceCost,
      aiProcessingCost: aiProcessingCost,
      platformFee: platformFee,
      totalCost: twilioVoiceCost + aiProcessingCost + platformFee
    };
  };

  const calculateROIMetrics = () => {
    const traditional = calculateTraditionalMonthlyCost(agentCount[0], costPerAgent);
    const ai = calculateAIMonthlyCost(monthlyCallVolume);
    
    const monthlySavings = traditional.totalCost - ai.totalCost;
    const annualSavings = monthlySavings * 12;
    const roiPercentage = ((annualSavings / (ai.totalCost * 12)) * 100);
    const costReductionPercentage = ((monthlySavings / traditional.totalCost) * 100);
    const paybackPeriodMonths = (ai.totalCost * 12) / monthlySavings;
    
    // Calculate per-call costs
    const traditionalCostPerCall = traditional.totalCost / monthlyCallVolume;
    const aiCostPerCall = ai.totalCost / monthlyCallVolume;
    
    return {
      traditional,
      ai,
      monthlySavings,
      annualSavings,
      roiPercentage: Math.max(0, roiPercentage),
      costReductionPercentage: Math.max(0, costReductionPercentage),
      paybackPeriodMonths: Math.max(0, paybackPeriodMonths),
      traditionalCostPerCall,
      aiCostPerCall,
      callVolumeProcessed: monthlyCallVolume,
      automatedCalls: monthlyCallVolume * MARKET_RESEARCH.ai.automationRate,
      humanAssistedCalls: monthlyCallVolume * (1 - MARKET_RESEARCH.ai.automationRate)
    };
  };

  // Real-time calculation when inputs change
  useEffect(() => {
    const metrics = calculateROIMetrics();
    setResults(metrics);
  }, [agentCount, averageHandleTime, costPerAgent, monthlyCallVolume]);

  // Apply preset scenarios
  const applyPreset = (preset) => {
    setSelectedPreset(preset.name);
    setAgentCount([preset.agentCount]);
    setAverageHandleTime([preset.aht]);
    setCostPerAgent(preset.costPerAgent);
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
          monthly_call_volume: monthlyCallVolume,
          cost_per_agent: costPerAgent
        },
        user_info: {
          timestamp: new Date().toISOString(),
          source: 'enhanced_website_calculator',
          preset_used: selectedPreset
        }
      };

      const response = await axios.post(`${BACKEND_URL}/api/roi/save`, requestData);
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
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(number));
  };
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <section id="roi-calculator" className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(17,17,19)]">
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
                      {formatTime(averageHandleTime)} → {formatTime(results.new_aht || 0)}
                    </div>
                  </div>
                  <Badge className="bg-[#DAFF01]/20 text-[#DAFF01] border-[#DAFF01]/30 w-fit">
                    -{results.aht_reduction_percent?.toFixed(0)}%
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)] space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm lg:text-base">Automated Interactions</div>
                    <div className="text-[rgb(161,161,170)] text-xs lg:text-sm">
                      {results.automated_calls?.toLocaleString()} calls/month
                    </div>
                  </div>
                  <Badge className="bg-[#00DDFF]/20 text-[#00DDFF] border-[#00DDFF]/30 w-fit">
                    {results.automation_rate?.toFixed(0)}%
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-[rgb(38,40,42)] rounded-xl border border-[rgb(63,63,63)] space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm lg:text-base">Time Saved Monthly</div>
                    <div className="text-[rgb(161,161,170)] text-xs lg:text-sm">
                      {results.total_time_saved_monthly?.toLocaleString()} agent hours
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
                onClick={saveROICalculation}
                disabled={isLoading}
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto font-rajdhani disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Calculating...
                  </>
                ) : (
                  'Get Detailed ROI Report'
                )}
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