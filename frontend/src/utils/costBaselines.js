// Cost baselines for top BPO countries
// Traditional BPO base costs (unchanged)

export const BASE_COST = {
  Bangladesh: 300,
  India: 500,
  Philippines: 600,
  Vietnam: 550
};

// SentraTech AI infrastructure cost (30% profit margin): $154×1.3 ≈ $200/agent·month
export const AI_COST = 200;

// Country metadata for UI display
export const COUNTRIES = [
  { 
    name: 'Bangladesh', 
    baseCost: BASE_COST.Bangladesh,
    flag: '🇧🇩',
    description: 'Lowest cost market'
  },
  { 
    name: 'India', 
    baseCost: BASE_COST.India,
    flag: '🇮🇳',
    description: 'Largest BPO market'
  },
  { 
    name: 'Philippines', 
    baseCost: BASE_COST.Philippines,
    flag: '🇵🇭',
    description: 'Premium English market'
  },
  { 
    name: 'Vietnam', 
    baseCost: BASE_COST.Vietnam,
    flag: '🇻🇳',
    description: 'Emerging market'
  }
];

export default {
  BASE_COST,
  AI_COST,
  COUNTRIES
};