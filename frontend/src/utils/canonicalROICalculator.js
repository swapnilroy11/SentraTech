/**
 * Canonical ROI Calculator Logic - Source of Truth
 * Based on the pure JS implementation provided for testing
 */

// calculateROI.js - pure, deterministic, copy/paste function
export function calculateROI({
  calls = 1000,
  interactions = 1000,
  callAHTMin = 8,
  interactionAHTMin = 5,
  bundlePrice = 1650,       // SentraTech bundle price per 1k
  bpoPerMin = 0.4,          // country-specific PSTN or BPO per-minute benchmark
  automationPct = 0.7       // currently fixed at 70% automation
} = {}) {
  // minutes
  const callMinutes = calls * callAHTMin;
  const interactionMinutes = interactions * interactionAHTMin;
  const totalMinutes = callMinutes + interactionMinutes;

  // workload share inside canonical bundle (1k + 1k)
  const bundleCallMinutes = 1000 * callAHTMin;
  const bundleInteractionMinutes = 1000 * interactionAHTMin;
  const bundleTotalMinutes = bundleCallMinutes + bundleInteractionMinutes;
  const callShare = bundleCallMinutes / bundleTotalMinutes;         // e.g. 8000/13000
  const interactionShare = bundleInteractionMinutes / bundleTotalMinutes;

  // dollar splits for 1x bundle
  const callDollarPer1k = bundlePrice * callShare;
  const interactionDollarPer1k = bundlePrice * interactionShare;

  // SentraTech cost scaled to volumes
  const sentraCost = (calls / 1000) * callDollarPer1k + (interactions / 1000) * interactionDollarPer1k;

  // Traditional BPO cost (simple minutes * per-minute rate)
  const bpoCost = totalMinutes * bpoPerMin;

  // Savings and metrics
  const savings = bpoCost - sentraCost;
  const costReductionPct = bpoCost > 0 ? (savings / bpoCost) * 100 : null;
  const roiPct = sentraCost > 0 ? (savings / sentraCost) * 100 : null;
  const bundlesEquivalent = sentraCost / bundlePrice;

  // round nicely for UI consumption
  const round2 = (x) => Math.round(x * 100) / 100;

  return {
    inputs: { calls, interactions, callAHTMin, interactionAHTMin, bundlePrice, bpoPerMin, automationPct },
    minutes: { callMinutes, interactionMinutes, totalMinutes },
    bundleShares: { callShare, interactionShare, callDollarPer1k, interactionDollarPer1k },
    outputs: {
      sentraCost: round2(sentraCost),
      bpoCost: round2(bpoCost),
      savings: round2(savings),
      costReductionPct: costReductionPct === null ? null : round2(costReductionPct),
      roiPct: roiPct === null ? null : round2(roiPct),
      bundlesEquivalent: Math.round(bundlesEquivalent * 10) / 10
    }
  };
}

// Test cases from the specification
export const TEST_CASES = [
  {
    name: "Case A - Bangladesh",
    inputs: { calls: 1000, interactions: 2000, callAHTMin: 8, interactionAHTMin: 5, bundlePrice: 1650, bpoPerMin: 0.4 },
    expected: {
      bpoCost: 7200, // (8000 + 10000) * 0.4
      sentraCost: 2284.62, // approx
      savings: 4915.38, // approx
      roiPct: 215, // approx
      costReductionPct: 68 // approx
    }
  },
  {
    name: "Case B - India",
    inputs: { calls: 1000, interactions: 2000, callAHTMin: 8, interactionAHTMin: 5, bundlePrice: 1650, bpoPerMin: 0.55 },
    expected: {
      bpoCost: 9900, // (8000 + 10000) * 0.55
      sentraCost: 2284.62,
      savings: 7615.38,
      roiPct: 333,
      costReductionPct: 77
    }
  },
  {
    name: "Case C - Philippines",
    inputs: { calls: 1000, interactions: 2000, callAHTMin: 8, interactionAHTMin: 5, bundlePrice: 1650, bpoPerMin: 0.9 },
    expected: {
      bpoCost: 16200, // (8000 + 10000) * 0.9
      sentraCost: 2284.62,
      savings: 13915.38,
      roiPct: 609,
      costReductionPct: 86
    }
  },
  {
    name: "Case D - Vietnam", 
    inputs: { calls: 1000, interactions: 2000, callAHTMin: 8, interactionAHTMin: 5, bundlePrice: 1650, bpoPerMin: 0.6 },
    expected: {
      bpoCost: 10800, // (8000 + 10000) * 0.6
      sentraCost: 2284.62,
      savings: 8515.38,
      roiPct: 373,
      costReductionPct: 79
    }
  }
];

// Run canonical tests
export function runCanonicalTests() {
  console.log('🧮 Running Canonical ROI Calculator Tests...');
  
  TEST_CASES.forEach(testCase => {
    const result = calculateROI(testCase.inputs);
    
    console.log(`\n📊 ${testCase.name}:`);
    console.log('Inputs:', testCase.inputs);
    console.log('Expected vs Actual:');
    console.log(`  BPO Cost: $${testCase.expected.bpoCost} vs $${result.outputs.bpoCost}`);
    console.log(`  Sentra Cost: $${testCase.expected.sentraCost} vs $${result.outputs.sentraCost}`);
    console.log(`  Savings: $${testCase.expected.savings} vs $${result.outputs.savings}`);
    console.log(`  ROI: ${testCase.expected.roiPct}% vs ${result.outputs.roiPct}%`);
    console.log(`  Cost Reduction: ${testCase.expected.costReductionPct}% vs ${result.outputs.costReductionPct}%`);
    console.log(`  Bundles: ${result.outputs.bundlesEquivalent}`);
    
    // Validate calculations
    const tolerance = 1; // $1 tolerance
    const bpoMatch = Math.abs(result.outputs.bpoCost - testCase.expected.bpoCost) <= tolerance;
    const roiTolerance = 5; // 5% tolerance
    const roiMatch = Math.abs(result.outputs.roiPct - testCase.expected.roiPct) <= roiTolerance;
    
    console.log(`  ✅ BPO: ${bpoMatch ? 'PASS' : 'FAIL'}`);
    console.log(`  ✅ ROI: ${roiMatch ? 'PASS' : 'FAIL'}`);
  });
}

// Helper to normalize money strings like "$7.2K" or "$7,200" -> number
export function parseMoney(str) {
  if (!str) return null;
  const cleaned = str.replace(/\$/g, '').replace(/,/g, '').trim().toUpperCase();
  if (cleaned.endsWith('K')) return parseFloat(cleaned.slice(0,-1)) * 1000;
  if (cleaned.endsWith('M')) return parseFloat(cleaned.slice(0,-1)) * 1e6;
  return parseFloat(cleaned);
}

export default { calculateROI, TEST_CASES, runCanonicalTests, parseMoney };