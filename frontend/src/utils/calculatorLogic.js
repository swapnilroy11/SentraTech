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

  // Traditional cost (labor-based: scales with call volume)
  const hourlyRate = BASE_COST[country] / (8 * 22); // Convert monthly agent cost to hourly rate
  const totalLaborHours = (callVolume * ahtMinutes) / 60; // Total hours needed for all calls
  const tradCost = totalLaborHours * hourlyRate;

  // AI cost (infrastructure-based: fixed per agent regardless of call volume)
  const aiCost = agentCount * AI_COST;

  // Per-call costs
  const tradPerCall = callVolume > 0 ? parseFloat((tradCost / callVolume).toFixed(2)) : 0;
  const aiPerCall = callVolume > 0 ? parseFloat((aiCost / callVolume).toFixed(2)) : 0;

  // Savings & ROI with proper negative handling
  const monthlySavings = tradCost - aiCost;
  const annualSavings = monthlySavings * 12;
  
  // Handle positive vs negative scenarios
  const isSavings = monthlySavings >= 0;
  const isProfit = annualSavings >= 0;
  
  // Cost change percentage (always positive, but with different meaning)
  const costChangePercent = tradCost > 0 ? Math.abs(parseInt(((monthlySavings / tradCost) * 100).toFixed(0))) : 0;
  
  // ROI/Loss percentage (always positive, but with different meaning)  
  const roiLossPercent = aiCost > 0 ? Math.abs(parseInt(((annualSavings / (aiCost * 12)) * 100).toFixed(0))) : 0;
  
  // Legacy fields for backward compatibility
  const costReduction = isSavings ? costChangePercent : -costChangePercent;
  const roiPercent = isProfit ? roiLossPercent : -roiLossPercent;

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