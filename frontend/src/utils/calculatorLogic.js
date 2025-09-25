// Multi-Country ROI Calculator Logic with Total Calls Support
// Updated algorithm with 30% profit margin and Total Calls input option

import { BASE_COST, AI_COST } from './costBaselines';

/**
 * Calculate ROI for four-country comparison with flexible input options
 * @param {string} country - Selected country (Bangladesh, India, Philippines, Vietnam)
 * @param {number} agentCount - Number of agents
 * @param {number} ahtMinutes - Average Handle Time in minutes per call
 * @param {number} totalCalls - Optional: direct call volume input (overrides calculation)
 * @returns {object} Complete ROI analysis with accurate per-call metrics
 */
export function calculateROI(country, agentCount, ahtMinutes, totalCalls = null) {
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
      tradPerCall: 0,
      aiPerCall: 0,
      monthlySavings: 0,
      annualSavings: 0,
      roiPercent: 0,
      costReduction: 0
    };
  }
  
  // Determine callVolume
  const callVolume = totalCalls 
    ? totalCalls 
    : Math.floor(agentCount * ((8*60)/ahtMinutes) * 22);

  // Traditional cost
  const tradCost = agentCount * BASE_COST[country];

  // AI cost (with 30% profit margin: $154×1.3 ≈ $200/agent·month)
  const aiCost = agentCount * AI_COST;

  // Per-call costs
  const callsPerAgent = callVolume / agentCount;
  const tradPerCall = callsPerAgent > 0 ? parseFloat((BASE_COST[country] / callsPerAgent).toFixed(2)) : 0;
  const aiPerCall = callsPerAgent > 0 ? parseFloat((AI_COST / callsPerAgent).toFixed(2)) : 0;

  // Savings & ROI
  const monthlySavings = tradCost - aiCost;
  const annualSavings = monthlySavings * 12;
  const roiPercent = aiCost > 0 ? parseInt(((annualSavings / (aiCost * 12)) * 100).toFixed(0)) : 0;
  const costReduction = tradCost > 0 ? parseInt(((monthlySavings / tradCost) * 100).toFixed(0)) : 0;

  return { 
    country,
    agentCount,
    ahtMinutes,
    callVolume,
    tradCost, 
    aiCost, 
    tradPerCall, 
    aiPerCall, 
    monthlySavings, 
    annualSavings, 
    roiPercent, 
    costReduction 
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