// Multi-Country ROI Calculator Logic
// Based on real BPO market data for Bangladesh, India, Philippines, and Mexico

const BASE_COST = {
  Bangladesh: 300,
  India: 500, 
  Philippines: 600,
  Mexico: 700
};

const TECHNOLOGY_COST = 50;  // per agent per month
const INFRASTRUCTURE_COST = 30;  // per agent per month

// AI costs constants
const TWILIO_COST_PER_MIN = 0.018;  // $0.018 per minute
const AI_PROCESS_COST_PER_MIN = 0.05;  // $0.05 per minute  
const AI_PLATFORM_FEE = 297;  // base infrastructure fee

/**
 * Calculate traditional BPO cost for a specific country
 * @param {string} country - Country name (Bangladesh, India, Philippines, Mexico)
 * @param {number} agentCount - Number of agents
 * @returns {number} Total monthly traditional cost
 */
function traditionalCost(country, agentCount) {
  const baseCost = BASE_COST[country];
  if (!baseCost) {
    throw new Error(`Invalid country: ${country}`);
  }
  
  const laborCost = agentCount * baseCost;
  const technologyCost = agentCount * TECHNOLOGY_COST;
  const infrastructureCost = agentCount * INFRASTRUCTURE_COST;
  
  return {
    laborCost,
    technologyCost,
    infrastructureCost,
    totalCost: laborCost + technologyCost + infrastructureCost
  };
}

/**
 * Calculate AI-powered monthly cost
 * @param {number} callVolumeMinutes - Total call volume in minutes per month
 * @returns {number} Total monthly AI cost
 */
function aiCost(callVolumeMinutes) {
  const twilioVoiceCost = callVolumeMinutes * TWILIO_COST_PER_MIN;
  const aiProcessingCost = callVolumeMinutes * AI_PROCESS_COST_PER_MIN;
  const platformFee = AI_PLATFORM_FEE;
  
  return {
    voiceCost: twilioVoiceCost,
    processingCost: aiProcessingCost,
    platformFee: platformFee,
    totalCost: twilioVoiceCost + aiProcessingCost + platformFee
  };
}

/**
 * Main ROI calculation function for multi-country comparison
 * @param {string} country - Selected country
 * @param {number} agentCount - Number of agents
 * @param {number} callVolumeMinutes - Monthly call volume in minutes
 * @returns {object} Complete ROI analysis
 */
export function calculateROI(country, agentCount, callVolumeMinutes) {
  // Input validation
  if (!country || !BASE_COST[country]) {
    throw new Error(`Invalid country: ${country}`);
  }
  
  if (agentCount < 0 || callVolumeMinutes < 0) {
    throw new Error('Agent count and call volume must be positive numbers');
  }
  
  // Calculate costs
  const traditional = traditionalCost(country, agentCount);
  const ai = aiCost(callVolumeMinutes);
  
  // Calculate savings and ROI
  const monthlySavings = traditional.totalCost - ai.totalCost;
  const annualSavings = monthlySavings * 12;
  
  // Calculate percentages
  const roiPercent = ai.totalCost > 0 ? ((annualSavings / (ai.totalCost * 12)) * 100) : 0;
  const costReduction = traditional.totalCost > 0 ? ((monthlySavings / traditional.totalCost) * 100) : 0;
  
  // Calculate per-call metrics
  const callCount = callVolumeMinutes > 0 ? Math.round(callVolumeMinutes / 8) : 0; // Assume 8 min avg call
  const traditionalCostPerCall = callCount > 0 ? (traditional.totalCost / callCount) : 0;
  const aiCostPerCall = callCount > 0 ? (ai.totalCost / callCount) : 0;
  
  // Payback period calculation
  const paybackPeriodMonths = monthlySavings > 0 ? ((ai.totalCost * 12) / monthlySavings) : 0;
  
  return {
    country,
    agentCount,
    callVolumeMinutes,
    callCount,
    
    // Cost breakdown
    traditional,
    ai,
    
    // Savings metrics
    monthlySavings,
    annualSavings,
    
    // Performance metrics
    roiPercent: Math.max(0, roiPercent),
    costReduction,
    paybackPeriodMonths: Math.max(0, paybackPeriodMonths),
    
    // Per-call metrics
    traditionalCostPerCall,
    aiCostPerCall,
    
    // Country baseline info
    countryBaseline: BASE_COST[country],
    
    // Automation metrics (assuming 80% automation rate)
    automatedCalls: Math.round(callCount * 0.8),
    humanAssistedCalls: Math.round(callCount * 0.2)
  };
}

/**
 * Get all available countries and their baseline costs
 * @returns {object} Country information
 */
export function getCountries() {
  return Object.keys(BASE_COST).map(country => ({
    name: country,
    baseCost: BASE_COST[country],
    totalCostPerAgent: BASE_COST[country] + TECHNOLOGY_COST + INFRASTRUCTURE_COST
  }));
}

/**
 * Validate country selection
 * @param {string} country - Country to validate
 * @returns {boolean} Is valid country
 */
export function isValidCountry(country) {
  return country && BASE_COST.hasOwnProperty(country);
}

export default {
  calculateROI,
  getCountries,
  isValidCountry,
  BASE_COST
};