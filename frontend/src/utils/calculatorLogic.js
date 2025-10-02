/**
 * SentraTech ROI Calculator - Per-1,000 Bundle Pricing Logic
 * Enterprise-grade ROI calculations with country baselines, multiple modes, and comprehensive outputs
 * 
 * @version 2.0.0 - Bundle-based pricing with Agent Count, Call Volume, and Per-Bundle modes
 */

import { COUNTRIES } from './costBaselines';

// Core calculation function - implements exact formulas from specification
export function calculateROI({
  calls = 1000,
  interactions = 1000,
  callAHT = 8,
  interactionAHT = 5,
  automationPct = 0.6,
  mode = 'call_volume', // 'agent_count', 'call_volume', 'per_bundle'
  agentCount = null,
  country = 'Bangladesh',
  agentHourlyLoaded = null,
  bpoPerMin = null,
  sentraPricePer1k = 1200,
  bundlesPerMonth = 1,
  implCost = 0,
  periodMonths = 12,
  // Volume sub-mode
  volumeSubMode = 'auto', // 'auto', 'manual'
  manualAgentCount = null,
  // Internal SentraTech costs (for admin breakdown)
  showInternalBreakdown = false,
  sttRatePerMin = 0.0025,
  ttsRatePerMin = 0.0585,
  llmTokensInPerMin = 200,
  llmTokensOutPerMin = 200,
  llmInputRatePer1M = 32,
  llmOutputRatePer1M = 64,
  pstnRatePerMin = 0.0085,
  monthlyFixedCost = 50000,
  monthlyBaselineBundles = 50,
  // Other defaults
  employerOverheadPct = 0.25,
  agentHoursPerMonth = 160,
  concurrencyFactor = 0.35
}) {
  
  // Get country defaults
  const countryData = COUNTRIES.find(c => c.name === country) || COUNTRIES[0];
  const effectiveAgentHourlyLoaded = agentHourlyLoaded || countryData.agentHourlyLoaded;
  const effectiveBpoPerMin = bpoPerMin || countryData.bpoPerMin;

  // Core derived variables (exact as specification)
  const total_call_minutes = calls * callAHT;
  const total_interaction_minutes = interactions * interactionAHT;
  const total_minutes = total_call_minutes + total_interaction_minutes;
  const human_pct = 1 - automationPct;
  const human_minutes_needed = total_minutes * human_pct;
  const human_hours_needed = human_minutes_needed / 60;
  const baseline_hours_no_ai = total_minutes / 60;

  // Scale factor for per-1k bundle calculations
  const scaleFactor = calls / 1000;

  let labor_cost = 0;
  let fte_needed = 0;

  // Calculate labor cost based on mode
  if (mode === 'agent_count') {
    // Agent Count Mode: explicit FTE provided
    const effectiveAgentCount = agentCount || 1;
    const agent_monthly_salary_loaded = effectiveAgentHourlyLoaded * agentHoursPerMonth;
    labor_cost = effectiveAgentCount * agent_monthly_salary_loaded;
    fte_needed = effectiveAgentCount;
  } else if (mode === 'call_volume') {
    if (volumeSubMode === 'manual' && manualAgentCount) {
      // Manual sub-mode: use provided agent count
      const agent_monthly_salary_loaded = effectiveAgentHourlyLoaded * agentHoursPerMonth;
      labor_cost = manualAgentCount * agent_monthly_salary_loaded;
      fte_needed = manualAgentCount;
    } else {
      // Auto sub-mode: compute FTEs from volume
      fte_needed = human_hours_needed / agentHoursPerMonth;
      labor_cost = human_hours_needed * effectiveAgentHourlyLoaded;
    }
  } else {
    // Per-Bundle mode: use volume-driven calculation as default
    fte_needed = human_hours_needed / agentHoursPerMonth;
    labor_cost = human_hours_needed * effectiveAgentHourlyLoaded;
  }

  // Traditional BPO cost (per bundle) - Option 1: per-minute BPO rate
  const traditional_bpo_cost = total_minutes * effectiveBpoPerMin;
  const bpo_cost_per_1k_bundle = traditional_bpo_cost * (1000 / calls);

  // SentraTech Cost Calculation
  let sentra_cost_per_1k_bundle = sentraPricePer1k;
  let internal_sentra_cost = null;

  if (showInternalBreakdown) {
    // Internal cost breakdown calculation
    const stt_cost = calls * (callAHT * sttRatePerMin);
    const tts_cost = calls * (callAHT * ttsRatePerMin);
    
    const stt_minutes = calls * callAHT;
    const tts_minutes = calls * callAHT;
    const llm_audio_cost = (stt_minutes * llmTokensInPerMin / 1e6) * llmInputRatePer1M + 
                          (tts_minutes * llmTokensOutPerMin / 1e6) * llmOutputRatePer1M;
    
    const inter_in_tokens = 150; // Average tokens per interaction
    const inter_out_tokens = 100;
    const llm_text_cost = interactions * ((inter_in_tokens + inter_out_tokens) / 1e6) * 
                         ((llmInputRatePer1M + llmOutputRatePer1M) / 2);
    
    const pstn_cost = total_call_minutes * pstnRatePerMin;
    const variable_ai_cost = stt_cost + tts_cost + llm_audio_cost + llm_text_cost + pstn_cost;
    
    const fixed_allocation_per_bundle = monthlyFixedCost / monthlyBaselineBundles;
    const labor_cost_for_escalations = labor_cost * 0.1; // 10% escalation rate
    
    internal_sentra_cost = variable_ai_cost + labor_cost_for_escalations + fixed_allocation_per_bundle;
  }

  // Savings & ROI Calculations (exact as specification)
  const savings_per_bundle = bpo_cost_per_1k_bundle - sentra_cost_per_1k_bundle;
  const percent_reduction = bpo_cost_per_1k_bundle > 0 ? 
    (savings_per_bundle / bpo_cost_per_1k_bundle) * 100 : 0;

  // Monthly and annual projections
  const monthly_savings = savings_per_bundle * bundlesPerMonth;
  const bundles_per_year = bundlesPerMonth * 12;
  
  const annual_bpo_cost = bpo_cost_per_1k_bundle * bundles_per_year;
  const annual_sentra_cost = sentra_cost_per_1k_bundle * bundles_per_year;
  const total_benefit = annual_bpo_cost - annual_sentra_cost;

  // Payback calculation
  let payback_months = null;
  if (monthly_savings > 0 && implCost > 0) {
    payback_months = implCost / monthly_savings;
  } else if (implCost === 0) {
    payback_months = 0;
  }

  // ROI calculation over period
  const total_costs_T = annual_sentra_cost * (periodMonths / 12) + implCost;
  const total_benefits_T = annual_bpo_cost * (periodMonths / 12);
  const roi_T = total_costs_T > 0 ? 
    ((total_benefits_T - total_costs_T) / total_costs_T) * 100 : 0;

  // Generate annual projection array for charting
  const annualProjection = [];
  for (let month = 1; month <= Math.min(periodMonths, 36); month++) {
    const cumulative_savings = monthly_savings * month - (month === 1 ? implCost : 0);
    annualProjection.push({
      month,
      cumulative_savings,
      monthly_savings: monthly_savings
    });
  }

  return {
    // Input summary
    inputs: {
      calls,
      interactions,
      callAHT,
      interactionAHT,
      automationPct,
      mode,
      country,
      agentCount: mode === 'agent_count' ? agentCount : fte_needed,
      bundlesPerMonth,
      implCost,
      periodMonths
    },
    
    // Derived metrics
    total_minutes,
    human_minutes_needed,
    human_hours_needed,
    fte_needed,
    labor_cost,
    
    // Core costs (per 1k bundle)
    traditional_bpo_cost_per_bundle: Math.round(bpo_cost_per_1k_bundle),
    sentra_price_per_bundle: sentra_cost_per_1k_bundle,
    internal_sentra_cost: internal_sentra_cost ? Math.round(internal_sentra_cost) : null,
    
    // Savings metrics
    savings_per_bundle: Math.round(savings_per_bundle),
    percent_reduction: Math.round(percent_reduction * 100) / 100,
    monthly_savings: Math.round(monthly_savings),
    annual_savings: Math.round(total_benefit),
    
    // ROI metrics
    payback_months: payback_months !== null ? Math.round(payback_months * 100) / 100 : null,
    roi_percent: Math.round(roi_T * 100) / 100,
    
    // Projections
    annualProjection,
    
    // Status flags
    payback_exists: payback_months !== null && payback_months > 0,
    is_profitable: savings_per_bundle > 0,
    is_cost_increase: savings_per_bundle < 0,
    
    // Breakdown (if requested)
    breakdown: showInternalBreakdown ? {
      stt_cost: internal_sentra_cost ? calls * (callAHT * sttRatePerMin) : null,
      tts_cost: internal_sentra_cost ? calls * (callAHT * ttsRatePerMin) : null,
      llm_cost: internal_sentra_cost ? 
        ((calls * callAHT * llmTokensInPerMin / 1e6) * llmInputRatePer1M + 
         (calls * callAHT * llmTokensOutPerMin / 1e6) * llmOutputRatePer1M +
         interactions * ((150 + 100) / 1e6) * ((llmInputRatePer1M + llmOutputRatePer1M) / 2)) : null,
      pstn_cost: internal_sentra_cost ? total_call_minutes * pstnRatePerMin : null,
      labor_cost_escalations: internal_sentra_cost ? labor_cost * 0.1 : null,
      fixed_allocation: internal_sentra_cost ? monthlyFixedCost / monthlyBaselineBundles : null,
      margin: sentra_cost_per_1k_bundle - (internal_sentra_cost || 0)
    } : null
  };
}

// Utility functions
export function getCountryDefaults(country) {
  return COUNTRIES.find(c => c.name === country) || COUNTRIES[0];
}

export function validateInputs({ calls, interactions, callAHT, interactionAHT, automationPct }) {
  const errors = [];
  
  if (!calls || calls <= 0) errors.push('Calls must be greater than 0');
  if (!interactions || interactions <= 0) errors.push('Interactions must be greater than 0');
  if (!callAHT || callAHT <= 0) errors.push('Call AHT must be greater than 0');
  if (!interactionAHT || interactionAHT <= 0) errors.push('Interaction AHT must be greater than 0');
  if (automationPct < 0 || automationPct > 1) errors.push('Automation percentage must be between 0 and 100');
  
  return errors;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatNumber(number) {
  return new Intl.NumberFormat('en-US').format(Math.round(number || 0));
}

// Export default object for backward compatibility
export default {
  calculateROI,
  getCountryDefaults,
  validateInputs,
  formatCurrency,
  formatNumber
};