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
  // State initialization with India BPO baseline
  const [agentCount, setAgentCount] = useState([50]);
  const [averageHandleTime, setAverageHandleTime] = useState([8]); // minutes
  const [monthlyCallVolume, setMonthlyCallVolume] = useState(0);
  const [costPerAgent, setCostPerAgent] = useState(500); // India BPO baseline - ensure number type
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [viewMode, setViewMode] = useState('monthly'); // monthly or annual
  const [selectedPreset, setSelectedPreset] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // India Baseline BPO Cost Constants
  const INDIA_BPO_BASELINE = {
    baseAgentCost: 500,        // $ per agent per month (India BPO baseline)
    technologyCost: 50,        // software/tools estimate per agent
    infrastructureCost: 30,    // office/infrastructure estimate per agent
    ai: {
      twilioPerMin: 0.018,     // $0.018 per minute
      aiProcessPerMin: 0.05,   // $0.05 per minute  
      platformFee: 297,        // base infrastructure fee
      automationRate: 0.80     // 80% automation rate
    }
  };

  // Preset Scenarios - Updated for India BPO baseline
  const PRESETS = [
    {
      name: 'Small Team',
      description: '5-15 agents',
      agentCount: 10,
      aht: 8,
      costPerAgent: 500  // India BPO baseline
    },
    {
      name: 'Mid-size',
      description: '25-75 agents', 
      agentCount: 50,
      aht: 8,
      costPerAgent: 500  // India BPO baseline
    },
    {
      name: 'Enterprise',
      description: '100-500 agents',
      agentCount: 200,
      aht: 9,
      costPerAgent: 500  // India BPO baseline
    }
  ];

  // Auto-calculate monthly call volume based on agents and AHT
  useEffect(() => {
    const workingHoursPerMonth = 22 * 8; // 22 working days, 8 hours per day
    const callsPerAgentPerHour = 60 / averageHandleTime[0]; // calls per hour based on AHT
    const totalCallsPerMonth = agentCount[0] * workingHoursPerMonth * callsPerAgentPerHour;
    setMonthlyCallVolume(Math.round(totalCallsPerMonth));
  }, [agentCount, averageHandleTime]);

  // Traditional BPO Monthly Cost Calculation (India Baseline)
  const calculateTraditionalMonthlyCost = (agents, costPerAgent) => {
    const baseLaborCost = agents * costPerAgent;
    const technologyCost = agents * INDIA_BPO_BASELINE.technologyCost;
    const infrastructureCost = agents * INDIA_BPO_BASELINE.infrastructureCost;
    
    return {
      laborCost: baseLaborCost,
      technologyCost: technologyCost,
      infrastructureCost: infrastructureCost,
      totalCost: baseLaborCost + technologyCost + infrastructureCost
    };
  };

  const calculateAIMonthlyCost = (callVolume) => {
    const avgCallDurationMin = averageHandleTime[0];
    const twilioVoiceCost = callVolume * avgCallDurationMin * INDIA_BPO_BASELINE.ai.twilioPerMin;
    const aiProcessingCost = callVolume * avgCallDurationMin * INDIA_BPO_BASELINE.ai.aiProcessPerMin;
    const platformFee = INDIA_BPO_BASELINE.ai.platformFee;
    
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
    
    // Calculate ROI and cost reduction percentages
    const roiPercentage = ai.totalCost > 0 ? ((annualSavings / (ai.totalCost * 12)) * 100) : 0;
    const costReductionPercentage = traditional.totalCost > 0 ? ((monthlySavings / traditional.totalCost) * 100) : 0;
    const paybackPeriodMonths = monthlySavings > 0 ? ((ai.totalCost * 12) / monthlySavings) : 0;
    
    // Calculate per-call costs
    const traditionalCostPerCall = monthlyCallVolume > 0 ? (traditional.totalCost / monthlyCallVolume) : 0;
    const aiCostPerCall = monthlyCallVolume > 0 ? (ai.totalCost / monthlyCallVolume) : 0;
    
    return {
      traditional,
      ai,
      monthlySavings,
      annualSavings,
      roiPercentage: Math.max(0, roiPercentage),
      costReductionPercentage,
      paybackPeriodMonths: Math.max(0, paybackPeriodMonths),
      traditionalCostPerCall,
      aiCostPerCall,
      callVolumeProcessed: monthlyCallVolume,
      automatedCalls: monthlyCallVolume * INDIA_BPO_BASELINE.ai.automationRate,
      humanAssistedCalls: monthlyCallVolume * (1 - INDIA_BPO_BASELINE.ai.automationRate)
    };
  };

  // Real-time calculation when inputs change
  useEffect(() => {
    if (agentCount && averageHandleTime && agentCount[0] >= 0 && averageHandleTime[0] > 0) {
      const metrics = calculateROIMetrics();
      setResults(metrics);
    }
  }, [agentCount, averageHandleTime, costPerAgent, monthlyCallVolume]);

  // Trigger recalculation when monthlyCallVolume changes
  useEffect(() => {
    if (agentCount && averageHandleTime && agentCount[0] >= 0 && averageHandleTime[0] > 0) {
      const metrics = calculateROIMetrics();
      setResults(metrics);
    }
  }, [monthlyCallVolume]);

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

  const Tooltip = ({ children, content }) => (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute z-50 w-64 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </div>
  );

  return (
    <section id="roi-calculator" className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(17,17,19)]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Calculator className="mr-2" size={14} />
            Market Research-Backed ROI Calculator
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">Calculate Your </span>
            <span className="text-[#00FF41]">Real Savings</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            Accurate projections based on extensive market research of traditional BPO costs vs. AI automation.
          </p>
        </div>

        {/* Preset Scenarios */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {PRESETS.map((preset) => (
            <Button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              variant={selectedPreset === preset.name ? "default" : "outline"}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                selectedPreset === preset.name 
                  ? 'bg-[#00FF41] text-[#0A0A0A]' 
                  : 'border-[rgb(63,63,63)] text-white hover:border-[#00FF41]'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{preset.name}</div>
                <div className="text-xs opacity-70">{preset.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-[rgb(26,28,30)] rounded-xl p-1 border border-[rgb(63,63,63)]">
            <Button
              onClick={() => setViewMode('monthly')}
              variant="ghost"
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'monthly'
                  ? 'bg-[#00FF41] text-[#0A0A0A]'
                  : 'text-white hover:bg-[rgb(38,40,42)]'
              }`}
            >
              Monthly View
            </Button>
            <Button
              onClick={() => setViewMode('annual')}
              variant="ghost"
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'annual'
                  ? 'bg-[#00FF41] text-[#0A0A0A]'
                  : 'text-white hover:bg-[rgb(38,40,42)]'
              }`}
            >
              Annual View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Input Controls */}
          <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 lg:p-8">
            <CardHeader className="p-0 mb-6 lg:mb-8">
              <CardTitle className="text-xl lg:text-2xl text-white flex items-center space-x-3">
                <div className="p-2 lg:p-3 bg-[#00FF41]/20 rounded-xl border border-[#00FF41]/50">
                  <BarChart3 size={20} className="text-[#00FF41] lg:w-6 lg:h-6" />
                </div>
                <span>Your Current Setup</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-6 lg:space-y-8">
              {/* Agent Count */}
              <div>
                <div className="flex items-center mb-3">
                  <Label className="text-white text-base lg:text-lg">
                    Agent Count: {agentCount[0]} agents
                  </Label>
                  <Tooltip content="India BPO baseline: $500/agent/month + $50 technology + $30 infrastructure costs per agent">
                    <Info size={16} className="ml-2 text-[rgb(161,161,170)] cursor-help" />
                  </Tooltip>
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
                <div className="flex items-center mb-3">
                  <Label className="text-white text-base lg:text-lg">
                    Average Handle Time: {averageHandleTime[0]} minutes
                  </Label>
                  <Tooltip content="AI processing: $0.018/minute (Twilio) + $0.05/minute (AI processing) + $297 platform fee vs India BPO baseline">
                    <Info size={16} className="ml-2 text-[rgb(161,161,170)] cursor-help" />
                  </Tooltip>
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

              {/* Cost Per Agent */}
              <div>
                <div className="flex items-center mb-3">
                  <Label htmlFor="costPerAgent" className="text-white text-base lg:text-lg">
                    Cost Per Agent (Monthly)
                  </Label>
                  <Tooltip content="India BPO baseline costs: $500 base + $50 technology + $30 infrastructure per agent monthly">
                    <Info size={16} className="ml-2 text-[rgb(161,161,170)] cursor-help" />
                  </Tooltip>
                </div>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)]" />
                  <Input
                    id="costPerAgent"
                    type="number"
                    value={costPerAgent || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === '0') {
                        setCostPerAgent('');
                      } else {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue) && numValue > 0) {
                          setCostPerAgent(numValue);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      if (isNaN(value) || value < 300) {
                        setCostPerAgent(500); // Reset to baseline if invalid
                      }
                    }}
                    className="pl-10 bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white rounded-xl text-base py-3"
                    step="50"
                    min="300"
                    max="1000"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Auto-calculated Monthly Call Volume */}
              <div className="bg-[rgb(38,40,42)] rounded-xl p-4 border border-[rgb(63,63,63)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Monthly Call Volume</div>
                    <div className="text-[rgb(161,161,170)] text-sm">Auto-calculated from agents × AHT × working hours</div>
                  </div>
                  <div className="text-[#00FF41] font-bold text-xl">
                    {formatNumber(monthlyCallVolume)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-4 lg:space-y-6">
            {/* Cost Comparison */}
            <Card className="bg-gradient-to-br from-[#00FF41]/10 to-[#00DDFF]/10 border-2 border-[#00FF41] rounded-3xl p-6 lg:p-8">
              <CardHeader className="p-0 mb-4 lg:mb-6">
                <CardTitle className="text-xl lg:text-2xl text-white flex items-center space-x-3">
                  <TrendingUp size={20} className="text-[#00FF41] lg:w-6 lg:h-6" />
                  <span>{viewMode === 'monthly' ? 'Monthly' : 'Annual'} Savings</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="text-center p-4 lg:p-6 bg-[rgb(26,28,30)]/50 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                    <div className="text-sm text-[rgb(161,161,170)] mb-1">Traditional Cost</div>
                    <div className="text-2xl lg:text-3xl font-bold text-red-400 mb-2 font-rajdhani">
                      {formatCurrency(viewMode === 'monthly' 
                        ? (results.traditional?.totalCost || 0)
                        : (results.traditional?.totalCost || 0) * 12
                      )}
                    </div>
                    <div className="text-xs text-[rgb(161,161,170)]">
                      {results.traditionalCostPerCall ? formatCurrency(results.traditionalCostPerCall) : '$0'}/call
                    </div>
                  </div>

                  <div className="text-center p-4 lg:p-6 bg-[rgb(26,28,30)]/50 rounded-2xl border border-[rgba(255,255,255,0.1)]">
                    <div className="text-sm text-[rgb(161,161,170)] mb-1">AI Cost</div>
                    <div className="text-2xl lg:text-3xl font-bold text-[#00DDFF] mb-2 font-rajdhani">
                      {formatCurrency(viewMode === 'monthly' 
                        ? (results.ai?.totalCost || 0)
                        : (results.ai?.totalCost || 0) * 12
                      )}
                    </div>
                    <div className="text-xs text-[rgb(161,161,170)]">
                      {results.aiCostPerCall ? formatCurrency(results.aiCostPerCall) : '$0'}/call
                    </div>
                  </div>
                </div>

                {/* Savings Display */}
                <div className="mt-6 text-center p-6 bg-gradient-to-r from-[#00FF41]/20 to-[#00DDFF]/20 rounded-2xl border border-[#00FF41]/30">
                  <div className="text-sm text-[rgb(161,161,170)] mb-2">Your Savings</div>
                  <div className="text-4xl font-bold text-[#00FF41] mb-2 font-rajdhani">
                    {formatCurrency(viewMode === 'monthly' 
                      ? (results.monthlySavings || 0)
                      : (results.annualSavings || 0)
                    )}
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center text-[#00FF41]">
                      <ArrowDown size={14} className="mr-1" />
                      <span>{results.costReductionPercentage?.toFixed(0)}% Cost Reduction</span>
                    </div>
                    <div className="flex items-center text-[#00DDFF]">
                      <ArrowUp size={14} className="mr-1" />
                      <span>{results.roiPercentage?.toFixed(0)}% ROI</span>
                    </div>
                  </div>
                  {results.paybackPeriodMonths && results.paybackPeriodMonths < 24 && (
                    <div className="mt-2 text-xs text-[rgb(161,161,170)]">
                      Payback Period: {results.paybackPeriodMonths.toFixed(1)} months
                    </div>
                  )}
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

            {/* Cost Breakdown */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 lg:p-8">
              <CardHeader className="p-0 mb-4 lg:mb-6">
                <CardTitle className="text-lg lg:text-xl text-white flex items-center space-x-3">
                  <BarChart3 size={18} className="text-[#00DDFF] lg:w-5 lg:h-5" />
                  <span>Cost Breakdown</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center p-3 bg-[rgb(38,40,42)] rounded-xl">
                  <span className="text-white">Labor Cost</span>
                  <span className="text-[#00FF41] font-semibold">
                    {formatCurrency(results.traditional?.laborCost || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[rgb(38,40,42)] rounded-xl">
                  <span className="text-white">Technology Cost</span>
                  <span className="text-[#00DDFF] font-semibold">
                    {formatCurrency(results.traditional?.technologyCost || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[rgb(38,40,42)] rounded-xl">
                  <span className="text-white">Infrastructure Cost</span>
                  <span className="text-[rgb(192,192,192)] font-semibold">
                    {formatCurrency(results.traditional?.infrastructureCost || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 lg:p-8">
              <CardHeader className="p-0 mb-4 lg:mb-6">
                <CardTitle className="text-lg lg:text-xl text-white flex items-center space-x-3">
                  <Zap size={18} className="text-[#00DDFF] lg:w-5 lg:h-5" />
                  <span>AI Performance</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center p-3 bg-[rgb(38,40,42)] rounded-xl">
                  <div>
                    <div className="text-white font-semibold">Automated Calls</div>
                    <div className="text-[rgb(161,161,170)] text-sm">80% automation rate</div>
                  </div>
                  <Badge className="bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/30">
                    {formatNumber(results.automatedCalls || 0)}/month
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-[rgb(38,40,42)] rounded-xl">
                  <div>
                    <div className="text-white font-semibold">Human-Assisted</div>
                    <div className="text-[rgb(161,161,170)] text-sm">Complex issues only</div>
                  </div>
                  <Badge className="bg-[#00DDFF]/20 text-[#00DDFF] border-[#00DDFF]/30">
                    {formatNumber(results.humanAssistedCalls || 0)}/month
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-[rgb(38,40,42)] rounded-xl">
                  <div>
                    <div className="text-white font-semibold">India BPO Baseline</div>
                    <div className="text-[rgb(161,161,170)] text-sm">$500/agent competitive comparison</div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    ✓ Baseline Cost
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
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto font-rajdhani disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Target className="mr-2" size={20} />
                    Get Detailed ROI Report
                  </>
                )}
              </Button>
              <p className="text-[rgb(161,161,170)] text-sm mt-4">
                Based on extensive market research • Schedule demo to validate your results
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;