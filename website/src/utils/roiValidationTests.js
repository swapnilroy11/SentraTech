/**
 * ROI Calculator Validation Tests
 * Compares current implementation against canonical calculator
 */

import { calculateROI as canonicalCalculateROI, TEST_CASES } from './canonicalROICalculator.js';
import { ROICalculatorEngine } from './roiCalculatorFixed.js';

// Country mappings
const COUNTRY_BPO_RATES = {
  'Bangladesh': 0.4,
  'India': 0.55, 
  'Philippines': 0.9,
  'Vietnam': 0.6
};

/**
 * Compare current implementation with canonical implementation
 */
export function runValidationTests() {
  console.log('\n🔍 VALIDATION TESTS: Current Implementation vs Canonical');
  console.log('=' * 80);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // Test all canonical test cases
  TEST_CASES.forEach(testCase => {
    totalTests++;
    
    console.log(`\n📊 Testing: ${testCase.name}`);
    console.log('Inputs:', testCase.inputs);
    
    // Get canonical results
    const canonicalResult = canonicalCalculateROI(testCase.inputs);
    
    // Get current implementation results
    const { calls, interactions, bpoPerMin } = testCase.inputs;
    const country = getCountryFromBpoRate(bpoPerMin);
    
    let currentResult;
    try {
      currentResult = ROICalculatorEngine.calculate(calls, interactions, country);
    } catch (error) {
      console.error(`❌ Current implementation failed: ${error.message}`);
      failedTests++;
      return;
    }
    
    // Compare key metrics with tolerance
    const tolerance = 1; // $1
    const percentageTolerance = 0.1; // 0.1%
    
    const comparisons = [
      {
        metric: 'BPO Cost',
        canonical: canonicalResult.outputs.bpoCost,
        current: currentResult.traditionalMonthlyCost,
        tolerance: tolerance
      },
      {
        metric: 'Sentra Cost', 
        canonical: canonicalResult.outputs.sentraCost,
        current: currentResult.sentraTechMonthlyCost,
        tolerance: tolerance
      },
      {
        metric: 'Monthly Savings',
        canonical: canonicalResult.outputs.savings,
        current: currentResult.monthlySavings,
        tolerance: tolerance
      },
      {
        metric: 'ROI %',
        canonical: canonicalResult.outputs.roiPct,
        current: currentResult.roi,
        tolerance: percentageTolerance
      },
      {
        metric: 'Cost Reduction %',
        canonical: canonicalResult.outputs.costReductionPct,
        current: currentResult.costReduction,
        tolerance: percentageTolerance
      }
    ];
    
    let testPassed = true;
    
    comparisons.forEach(comp => {
      const diff = Math.abs(comp.canonical - comp.current);
      const passed = diff <= comp.tolerance;
      
      if (!passed) testPassed = false;
      
      console.log(`  ${passed ? '✅' : '❌'} ${comp.metric}:`);
      console.log(`      Canonical: ${comp.canonical}`);
      console.log(`      Current:   ${comp.current}`);
      console.log(`      Diff:      ${diff.toFixed(2)} (tolerance: ${comp.tolerance})`);
    });
    
    if (testPassed) {
      console.log(`  🎉 TEST PASSED: ${testCase.name}`);
      passedTests++;
    } else {
      console.log(`  💥 TEST FAILED: ${testCase.name}`);
      failedTests++;
    }
    
    // Show bundle share breakdown for debugging
    console.log(`  📋 Bundle Share Details:`);
    console.log(`      Canonical Call Share: ${canonicalResult.bundleShares.callShare.toFixed(6)}`);
    console.log(`      Canonical Interaction Share: ${canonicalResult.bundleShares.interactionShare.toFixed(6)}`);
    console.log(`      Canonical Call $/1K: ${canonicalResult.bundleShares.callDollarPer1k.toFixed(2)}`);
    console.log(`      Canonical Interaction $/1K: ${canonicalResult.bundleShares.interactionDollarPer1k.toFixed(2)}`);
  });

  console.log('\n📈 VALIDATION SUMMARY:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`Failed: ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
  
  if (failedTests === 0) {
    console.log('🎉 ALL TESTS PASSED! Current implementation matches canonical logic.');
  } else {
    console.log('⚠️  ISSUES DETECTED! Current implementation has discrepancies.');
    logFixRecommendations();
  }
  
  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    success: failedTests === 0
  };
}

/**
 * Get country name from BPO rate
 */
function getCountryFromBpoRate(rate) {
  for (const [country, bpoRate] of Object.entries(COUNTRY_BPO_RATES)) {
    if (Math.abs(bpoRate - rate) < 0.01) {
      return country;
    }
  }
  return 'Bangladesh'; // fallback
}

/**
 * Log fix recommendations if tests fail
 */
function logFixRecommendations() {
  console.log('\n🔧 FIX RECOMMENDATIONS:');
  console.log('1. Check bundle share calculation - should use exact fractions (8000/13000, 5000/13000)');
  console.log('2. Verify CALL_COST_PER_1K and INTERACTION_COST_PER_1K constants');
  console.log('3. Ensure proper rounding is applied at the end, not in intermediate calculations');
  console.log('4. Check AHT values match canonical (8 min calls, 5 min interactions)');
}

/**
 * Test a specific scenario manually
 */
export function testSpecificScenario(calls, interactions, country) {
  console.log(`\n🎯 SPECIFIC SCENARIO TEST:`);
  console.log(`Inputs: ${calls} calls, ${interactions} interactions, ${country}`);
  
  const bpoRate = COUNTRY_BPO_RATES[country];
  
  // Canonical calculation
  const canonicalResult = canonicalCalculateROI({
    calls,
    interactions,
    callAHTMin: 8,
    interactionAHTMin: 5,
    bundlePrice: 1650,
    bpoPerMin: bpoRate
  });
  
  // Current implementation
  const currentResult = ROICalculatorEngine.calculate(calls, interactions, country);
  
  console.log('\nCANONICAL RESULTS:');
  console.log(`  BPO Cost: $${canonicalResult.outputs.bpoCost}`);
  console.log(`  Sentra Cost: $${canonicalResult.outputs.sentraCost}`);
  console.log(`  Savings: $${canonicalResult.outputs.savings}`);
  console.log(`  ROI: ${canonicalResult.outputs.roiPct}%`);
  console.log(`  Cost Reduction: ${canonicalResult.outputs.costReductionPct}%`);
  
  console.log('\nCURRENT IMPLEMENTATION:');
  console.log(`  BPO Cost: $${currentResult.traditionalMonthlyCost}`);
  console.log(`  Sentra Cost: $${currentResult.sentraTechMonthlyCost}`);
  console.log(`  Savings: $${currentResult.monthlySavings}`);
  console.log(`  ROI: ${currentResult.roi}%`);
  console.log(`  Cost Reduction: ${currentResult.costReduction}%`);
  
  return { canonical: canonicalResult, current: currentResult };
}

export default {
  runValidationTests,
  testSpecificScenario
};