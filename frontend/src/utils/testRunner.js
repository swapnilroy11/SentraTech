/**
 * Test Runner for ROI Calculator Validation
 * Can be run directly in browser console or as a module
 */

import { runValidationTests, testSpecificScenario } from './roiValidationTests.js';
import { runCanonicalTests } from './canonicalROICalculator.js';
import { runProtectedTests } from './roiCalculatorFixed.js';

/**
 * Run all ROI calculator tests
 */
export function runAllTests() {
  console.clear();
  console.log('🧪 ROI CALCULATOR COMPREHENSIVE TEST SUITE');
  console.log('=' * 60);
  
  try {
    // 1. Run canonical tests first to ensure canonical logic works
    console.log('\n1️⃣ CANONICAL CALCULATOR TESTS');
    runCanonicalTests();
    
    // 2. Run protected tests to ensure current implementation works
    console.log('\n\n2️⃣ CURRENT IMPLEMENTATION TESTS');
    runProtectedTests();
    
    // 3. Run validation tests to compare implementations
    console.log('\n\n3️⃣ VALIDATION TESTS (Current vs Canonical)');
    const validationResults = runValidationTests();
    
    // 4. Run specific test case from user requirements
    console.log('\n\n4️⃣ USER-SPECIFIED TEST CASE');
    testSpecificScenario(1000, 2000, 'Bangladesh');
    
    return validationResults;
    
  } catch (error) {
    console.error('❌ Test runner failed:', error);
    return { total: 0, passed: 0, failed: 1, success: false };
  }
}

/**
 * Quick test for browser console
 */
export function quickTest() {
  console.log('🚀 QUICK ROI CALCULATOR TEST');
  console.log('Testing: 1000 calls + 2000 interactions, Bangladesh');
  
  const result = testSpecificScenario(1000, 2000, 'Bangladesh');
  
  // Expected from user specification:
  const expected = {
    bpoCost: 7200, // (1000×8 + 2000×5) × 0.4 = 18000 × 0.4 = 7200
    sentraCost: 2284.62,
    savings: 4915.38,
    roiPct: 215,
    costReductionPct: 68
  };
  
  console.log('\n🎯 EXPECTED (from user specification):');
  console.log(`  BPO Cost: $${expected.bpoCost}`);
  console.log(`  Sentra Cost: $${expected.sentraCost}`);
  console.log(`  Savings: $${expected.savings}`);
  console.log(`  ROI: ${expected.roiPct}%`);
  console.log(`  Cost Reduction: ${expected.costReductionPct}%`);
  
  return result;
}

// Auto-run if in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Make functions available globally for console testing
  window.runAllTests = runAllTests;
  window.quickTest = quickTest;
  window.testROI = testSpecificScenario;
}

export default {
  runAllTests,
  quickTest,
  testSpecificScenario
};