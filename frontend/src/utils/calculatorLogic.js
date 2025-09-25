// Optimized Multi-Country ROI Calculator Logic
// Simplified approach focusing on Agent Count and AHT only

import { BASE_COST, AI_COST } from './costBaselines';

/**
 * Calculate ROI for four-country comparison with optimized inputs
 * @param {string} country - Selected country (Bangladesh, India, Philippines, Vietnam)
 * @param {number} agentCount - Number of agents
 * @param {number} ahtMinutes - Average Handle Time in minutes per call
 * @returns {object} Complete ROI analysis with simplified metrics
 */
export function calculateROI(country, agentCount, ahtMinutes) {
  // Input validation
  if (!country || !BASE_COST[country]) {
    throw new Error(`Invalid country: ${country}`);
  }
  
  if (agentCount <= 0 || ahtMinutes <= 0) {
    return {
      country,
      agentCount,
      ahtMinutes,
      callVolume: 0,
      tradCost: 0,
      aiCost: 0,
      monthlySavings: 0,
      annualSavings: 0,
      roi: 0,
      reduction: 0
    };
  }
  
  // Derive monthly call volume
  // 8 hours/day × 60 minutes/hour ÷ AHT minutes/call × 22 working days/month
  const callsPerAgentPerMonth = (8 * 60) / ahtMinutes * 22;
  const callVolume = Math.round(agentCount * callsPerAgentPerMonth);
  
  // Traditional BPO cost (country baseline × agent count)
  const tradCost = agentCount * BASE_COST[country];
  
  // SentraTech AI cost (fixed cost per agent)
  const aiCost = agentCount * AI_COST;
  
  // Calculate savings and ROI
  const monthlySavings = tradCost - aiCost;
  const annualSavings = monthlySavings * 12;
  
  // Calculate percentages
  const roi = aiCost > 0 ? ((annualSavings / (aiCost * 12)) * 100) : 0;
  const reduction = tradCost > 0 ? ((monthlySavings / tradCost) * 100) : 0;
  
  return {
    country,
    agentCount,
    ahtMinutes,
    callVolume,
    
    // Cost comparison
    tradCost,
    aiCost,
    
    // Savings metrics
    monthlySavings,
    annualSavings,
    
    // Performance metrics
    roi: Math.max(0, roi),
    reduction,
    
    // Additional metrics for display
    costPerCall: callVolume > 0 ? (tradCost / callVolume) : 0,
    aiCostPerCall: callVolume > 0 ? (aiCost / callVolume) : 0,
    paybackMonths: monthlySavings > 0 ? (aiCost * 12) / monthlySavings : 0
  };
}

/**
 * Get available countries for selection
 * @returns {array} Array of country objects
 */
export function getCountries() {
  return Object.keys(BASE_COST).map(country => ({
    name: country,
    baseCost: BASE_COST[country]
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

/**
 * Calculate break-even point for AI vs Traditional BPO
 * @param {string} country - Selected country
 * @returns {number} Agent count where AI becomes cost-effective
 */
export function calculateBreakeven(country) {
  if (!isValidCountry(country)) return 0;
  
  const traditionalCostPerAgent = BASE_COST[country];
  
  // AI is cost-effective when AI_COST < traditionalCostPerAgent
  return traditionalCostPerAgent > AI_COST ? 1 : 0;
}

export default {
  calculateROI,
  getCountries,
  isValidCountry,
  calculateBreakeven,
  BASE_COST,
  AI_COST
};