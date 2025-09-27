/**
 * SentraTech ROI Calculator - Unit Tests
 * Testing exact formulas and edge cases as specified
 */

import { calculateROI } from '../calculatorLogic';

describe('ROI Calculator - Per-1k Bundle Pricing', () => {
  
  // Test 1: Baseline bundle comparison (exact as specification)
  test('Test 1: Baseline bundle comparison - Bangladesh', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      country: 'Bangladesh',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 3000,
      periodMonths: 12
    };

    const result = calculateROI(inputs);

    // Expected calculations (rounded as specified)
    expect(result.total_minutes).toBe(13000); // 8000 + 5000
    expect(result.human_minutes_needed).toBe(5200); // 13000 * 0.4
    expect(Math.round(result.human_hours_needed * 1000) / 1000).toBe(86.667); // 5200/60

    // Traditional BPO cost: 13000 * 0.40 = 5200
    expect(result.traditional_bpo_cost_per_bundle).toBe(5200);
    
    // SentraTech price
    expect(result.sentra_price_per_bundle).toBe(1200);
    
    // Savings: 5200 - 1200 = 4000
    expect(result.savings_per_bundle).toBe(4000);
    expect(result.monthly_savings).toBe(4000); // bundlesPerMonth = 1
    
    // Payback: 3000 / 4000 = 0.75 months
    expect(result.payback_months).toBe(0.75);
    
    // ROI calculations
    const bpo_annual = 5200 * 12; // 62,400
    const sentra_annual = 1200 * 12; // 14,400
    const total_costs = sentra_annual + 3000; // 17,400
    const expected_roi = ((bpo_annual - total_costs) / total_costs) * 100;
    expect(Math.abs(result.roi_percent - expected_roi)).toBeLessThan(1); // Allow 1% tolerance

    // Status flags
    expect(result.is_profitable).toBe(true);
    expect(result.payback_exists).toBe(true);
  });

  // Test 2: Negative savings scenario (overpriced SentraTech)
  test('Test 2: Negative savings - overpriced scenario', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      country: 'Bangladesh',
      sentraPricePer1k: 7000, // Overpriced to trigger negative savings
      bundlesPerMonth: 1,
      implCost: 3000,
      periodMonths: 12
    };

    const result = calculateROI(inputs);

    // Should have negative savings
    expect(result.savings_per_bundle).toBe(-1800); // 5200 - 7000
    expect(result.monthly_savings).toBe(-1800);
    expect(result.is_profitable).toBe(false);
    expect(result.is_cost_increase).toBe(true);
    expect(result.payback_months).toBe(null); // No payback for negative savings
    expect(result.payback_exists).toBe(false);
  });

  // Test 3: Agent Count mode
  test('Test 3: Agent Count mode calculation', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      mode: 'agent_count',
      agentCount: 10,
      country: 'Bangladesh',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 0,
      periodMonths: 12
    };

    const result = calculateROI(inputs);

    // Verify agent count mode uses explicit agent count
    expect(result.inputs.agentCount).toBe(10);
    expect(result.fte_needed).toBe(10);
    
    // Labor cost should be: 10 agents * (2.25 * 160) = 10 * 360 = 3600
    expect(Math.round(result.labor_cost)).toBe(3600);
    
    // Should still calculate BPO cost from volume
    expect(result.traditional_bpo_cost_per_bundle).toBe(5200);
  });

  // Test 4: Philippines country variant
  test('Test 4: Philippines country rates', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      country: 'Philippines',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 0,
      periodMonths: 12
    };

    const result = calculateROI(inputs);

    // Philippines BPO rate: 13000 * 0.90 = 11,700
    expect(result.traditional_bpo_cost_per_bundle).toBe(11700);
    
    // Should have higher savings due to higher BPO costs
    expect(result.savings_per_bundle).toBe(10500); // 11700 - 1200
    expect(result.is_profitable).toBe(true);
  });

  // Test 5: Call Volume mode with manual sub-mode
  test('Test 5: Call Volume mode - manual sub-mode', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      mode: 'call_volume',
      volumeSubMode: 'manual',
      manualAgentCount: 15,
      country: 'Bangladesh',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 0,
      periodMonths: 12
    };

    const result = calculateROI(inputs);

    // Should use manual agent count for labor calculation
    expect(result.inputs.agentCount).toBe(15);
    expect(result.fte_needed).toBe(15);
    
    // Labor cost: 15 * (2.25 * 160) = 5400
    expect(Math.round(result.labor_cost)).toBe(5400);
  });

  // Test 6: Zero implementation cost (immediate payback)
  test('Test 6: Zero implementation cost', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      country: 'Bangladesh',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 0, // Zero implementation cost
      periodMonths: 12
    };

    const result = calculateROI(inputs);

    expect(result.payback_months).toBe(0);
    expect(result.payback_exists).toBe(false); // No payback needed
  });

  // Test 7: Edge case - very high automation
  test('Test 7: High automation percentage', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.95, // 95% automation
      country: 'Bangladesh',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 0,
      periodMonths: 12
    };

    const result = calculateROI(inputs);

    // Only 5% human minutes needed
    expect(Math.round(result.human_minutes_needed)).toBe(650); // 13000 * 0.05 (rounded for floating point)
    expect(Math.round(result.human_hours_needed * 100) / 100).toBe(10.83); // 650/60
    
    // Should still have same BPO cost (based on total minutes)
    expect(result.traditional_bpo_cost_per_bundle).toBe(5200);
  });

  // Test 8: Input validation
  test('Test 8: Input validation', () => {
    const invalidInputs = {
      calls: 0, // Invalid
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      country: 'Bangladesh'
    };

    // Should handle invalid inputs gracefully
    expect(() => calculateROI(invalidInputs)).not.toThrow();
  });

  // Test 9: Internal breakdown calculation
  test('Test 9: Internal SentraTech cost breakdown', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      country: 'Bangladesh',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 0,
      periodMonths: 12,
      showInternalBreakdown: true
    };

    const result = calculateROI(inputs);

    expect(result.internal_sentra_cost).toBeDefined();
    expect(result.internal_sentra_cost).toBeGreaterThan(0);
    expect(result.breakdown).toBeDefined();
    expect(result.breakdown.stt_cost).toBeDefined();
    expect(result.breakdown.tts_cost).toBeDefined();
    expect(result.breakdown.llm_cost).toBeDefined();
    expect(result.breakdown.pstn_cost).toBeDefined();
  });

  // Test 10: Annual projection array
  test('Test 10: Annual projection generation', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      country: 'Bangladesh',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 1000,
      periodMonths: 12
    };

    const result = calculateROI(inputs);

    expect(result.annualProjection).toHaveLength(12);
    expect(result.annualProjection[0].month).toBe(1);
    expect(result.annualProjection[0].cumulative_savings).toBe(3000); // 4000 - 1000 (impl cost)
    expect(result.annualProjection[11].month).toBe(12);
    expect(result.annualProjection[11].cumulative_savings).toBe(47000); // (4000 * 12) - 1000
  });
});

// Performance test for calculator responsiveness
describe('ROI Calculator Performance', () => {
  test('Calculator should execute in under 100ms', () => {
    const inputs = {
      calls: 1000,
      interactions: 1000,
      callAHT: 8,
      interactionAHT: 5,
      automationPct: 0.6,
      country: 'Bangladesh',
      sentraPricePer1k: 1200,
      bundlesPerMonth: 1,
      implCost: 3000,
      periodMonths: 12
    };

    const start = Date.now();
    calculateROI(inputs);
    const end = Date.now();
    
    expect(end - start).toBeLessThan(100); // Should execute in under 100ms
  });
});