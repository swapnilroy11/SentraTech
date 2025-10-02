/**
 * SentraTech ROI Calculator - Country Baselines & Defaults
 * Updated with per-1k bundle pricing and comprehensive country data
 * 
 * Sources:
 * - Bangladesh: 30,000 BDT/month ~ $283/160hrs = $1.77 + 25% overhead = $2.25/hr
 * - Philippines: Conservative BPO midpoint for production-grade operations  
 * - India: Entry-mid BPO market rates
 * - Vietnam: Market midpoint for junior-mid agents
 * - BPO per-minute rates: Conservative region-level midpoints ($0.65-$1.2/min range)
 */

// Legacy cost baselines (kept for backward compatibility)
export const BASE_COST = {
  Bangladesh: 300,
  India: 500,
  Philippines: 600,
  Vietnam: 550
};

// Legacy AI cost (kept for backward compatibility)
export const AI_COST = 200;

// New comprehensive country data with per-bundle pricing
export const COUNTRIES = [
  { 
    name: 'Bangladesh', 
    baseCost: BASE_COST.Bangladesh, // Legacy compatibility
    flag: '🇧🇩',
    description: 'Lowest cost market',
    // New bundle-based data
    agentHourlyLoaded: 2.25, // $2.25/hour (includes 25% overhead)
    bpoPerMin: 0.40, // $0.40/minute BPO rate
    currency: 'BDT',
    laborMarketTier: 'Emerging'
  },
  { 
    name: 'India', 
    baseCost: BASE_COST.India,
    flag: '🇮🇳',
    description: 'Largest BPO market',
    // New bundle-based data  
    agentHourlyLoaded: 3.00, // $3.00/hour (entry-mid BPO market)
    bpoPerMin: 0.55, // $0.55/minute BPO rate
    currency: 'INR',
    laborMarketTier: 'Established'
  },
  { 
    name: 'Philippines', 
    baseCost: BASE_COST.Philippines,
    flag: '🇵🇭',
    description: 'Premium English market',
    // New bundle-based data
    agentHourlyLoaded: 4.50, // $4.50/hour (typical BPO fully-loaded)
    bpoPerMin: 0.90, // $0.90/minute BPO rate
    currency: 'PHP',
    laborMarketTier: 'Premium'
  },
  { 
    name: 'Vietnam', 
    baseCost: BASE_COST.Vietnam,
    flag: '🇻🇳',
    description: 'Emerging market',
    // New bundle-based data
    agentHourlyLoaded: 3.50, // $3.50/hour (market midpoint)
    bpoPerMin: 0.60, // $0.60/minute BPO rate  
    currency: 'VND',
    laborMarketTier: 'Growing'
  }
];

// SentraTech pricing defaults
export const SENTRATECH_DEFAULTS = {
  // Customer-facing pilot price (per 1k bundle)
  pilotPricePer1k: 1200,
  
  // Vendor technical defaults (for internal cost breakdown)
  sttRatePerMin: 0.0025, // AssemblyAI session pricing $0.15/hr
  ttsRatePerMin: 0.0585, // Cartesia Sonic-2 derived estimate  
  llmTokensInPerMin: 200, // Voice tokens in/out per minute
  llmTokensOutPerMin: 200,
  llmInputRatePer1M: 32, // Premium audio/real-time reference rates
  llmOutputRatePer1M: 64,
  pstnRatePerMin: 0.0085, // Twilio rate
  
  // Other operational defaults
  automationPctDefault: 0.6, // 60% automation
  employerOverheadPctDefault: 0.25, // 25% overhead
  agentHoursPerMonthDefault: 160, // Standard full-time
  monthlyBaselineBundlesDefault: 50, // For fixed cost allocation
  concurrencyFactorDefault: 0.35 // Concurrent to FTE conversion
};

// Utility functions
export function getCountryByName(countryName) {
  return COUNTRIES.find(c => c.name === countryName) || COUNTRIES[0];
}

export function getCountryDefaults(countryName) {
  const country = getCountryByName(countryName);
  return {
    agentHourlyLoaded: country.agentHourlyLoaded,
    bpoPerMin: country.bpoPerMin,
    currency: country.currency,
    laborMarketTier: country.laborMarketTier
  };
}

export function getAllCountryNames() {
  return COUNTRIES.map(c => c.name);
}

// Validation helpers
export function isValidCountry(countryName) {
  return COUNTRIES.some(c => c.name === countryName);
}

export function validateCountryDefaults(countryName) {
  const country = getCountryByName(countryName);
  const errors = [];
  
  if (!country.agentHourlyLoaded || country.agentHourlyLoaded <= 0) {
    errors.push('Agent hourly rate must be positive');
  }
  
  if (!country.bpoPerMin || country.bpoPerMin <= 0) {
    errors.push('BPO per-minute rate must be positive');
  }
  
  return errors;
}

export default {
  BASE_COST,
  AI_COST,
  COUNTRIES,
  SENTRATECH_DEFAULTS,
  getCountryByName,
  getCountryDefaults,
  getAllCountryNames,
  isValidCountry,
  validateCountryDefaults
};