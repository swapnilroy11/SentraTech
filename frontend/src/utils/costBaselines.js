// Cost baselines for top BPO countries
// Based on real market data with optimized calculations

export const BASE_COST = {
  Bangladesh: 300,
  India: 500,
  Philippines: 600,
  Vietnam: 550
};

// SentraTech AI Infrastructure Cost (with +20% buffer)
// $128 × 1.2 ≈ $154/agent·month
export const AI_COST = 154;

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