// Multi-Country ROI Calculator Logic with Total Calls Support
// Updated algorithm with 30% profit margin and Total Calls input option

import { BASE_COST, AI_COST } from './costBaselines';

/**
 * Calculate ROI for four-country comparison with Agent Count and AHT inputs
 * @param {string} country - Selected country (Bangladesh, India, Philippines, Vietnam)
 * @param {number} agentCount - Number of agents
 * @param {number} ahtMinutes - Average Handle Time in minutes per call
 * @param {number|null} callVolumeOverride - Optional manual override for call volume
 * @returns {object} Complete ROI analysis with accurate per-call metrics
 */
export function calculateROI(country, agentCount, ahtMinutes, callVolumeOverride = null) {
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
  
  // Calculate monthly call volume using specified formula or use manual override
  let callVolume;
  if (callVolumeOverride !== null && callVolumeOverride > 0) {
    callVolume = callVolumeOverride;
  } else {
    const workMinutesPerMonth = 8 * 60 * 22;  // 8 hours * 60 minutes * 22 working days
    const callsPerAgent = workMinutesPerMonth / ahtMinutes;
    callVolume = Math.floor(agentCount * callsPerAgent);
  }

  // Traditional cost
  const tradCost = agentCount * BASE_COST[country];

  // AI cost (with 30% profit margin: $154×1.3 ≈ $200/agent·month)
  const aiCost = agentCount * AI_COST;

  // Per-call costs
  const tradPerCall = callVolume > 0 ? parseFloat((tradCost / callVolume).toFixed(2)) : 0;
  const aiPerCall = callVolume > 0 ? parseFloat((aiCost / callVolume).toFixed(2)) : 0;

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

export default {
  calculateROI,
  getCountries,
  isValidCountry,
  BASE_COST,
  AI_COST
};