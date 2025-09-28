/**
 * ROI Calculator - BULLETPROOF IMPLEMENTATION
 * Final, protected version that will never break again
 */

// PROTECTED CONSTANTS - DO NOT MODIFY
export const PROTECTED_CONSTANTS = Object.freeze({
  // Country BPO rates (per minute) - IMMUTABLE
  COUNTRIES: Object.freeze({
    'Bangladesh': Object.freeze({ bpoPerMin: 0.40 }),
    'India': Object.freeze({ bpoPerMin: 0.55 }),
    'Philippines': Object.freeze({ bpoPerMin: 0.90 }),
    'Vietnam': Object.freeze({ bpoPerMin: 0.60 })
  }),
  
  // AHT (Average Handle Time) - IMMUTABLE
  CALL_AHT: 8, // minutes per call
  INTERACTION_AHT: 5, // minutes per interaction
  
  // SentraTech pricing - IMMUTABLE
  SENTRATECH_BUNDLE_COST: 1650, // $1,650 per bundle (1000 calls + 1000 interactions)
  CALL_PERCENTAGE: 61.5, // 61.5% of bundle cost
  INTERACTION_PERCENTAGE: 38.5, // 38.5% of bundle cost
  
  // Derived costs (calculated once, immutable)
  CALL_COST_PER_1K: 1650 * 0.615, // $1,014.75
  INTERACTION_COST_PER_1K: 1650 * 0.385, // $635.25
  
  // Automation
  AUTOMATION_PERCENTAGE: 70
});

// PROTECTED CALCULATION ENGINE
export class ROICalculatorEngine {
  
  // Validate inputs
  static validateInputs(calls, interactions, country) {
    if (!calls || !interactions || calls <= 0 || interactions <= 0) {
      throw new Error('Invalid input: calls and interactions must be positive numbers');
    }
    
    if (!PROTECTED_CONSTANTS.COUNTRIES[country]) {
      throw new Error(`Invalid country: ${country}`);
    }
    
    return true;
  }
  
  // Calculate Traditional BPO cost
  static calculateTraditionalCost(calls, interactions, country) {
    const callMinutes = calls * PROTECTED_CONSTANTS.CALL_AHT;
    const interactionMinutes = interactions * PROTECTED_CONSTANTS.INTERACTION_AHT;
    const totalMinutes = callMinutes + interactionMinutes;
    const bpoRate = PROTECTED_CONSTANTS.COUNTRIES[country].bpoPerMin;
    
    return totalMinutes * bpoRate;
  }
  
  // Calculate SentraTech cost
  static calculateSentraTechCost(calls, interactions) {
    const callCost = (calls / 1000) * PROTECTED_CONSTANTS.CALL_COST_PER_1K;
    const interactionCost = (interactions / 1000) * PROTECTED_CONSTANTS.INTERACTION_COST_PER_1K;
    
    return callCost + interactionCost;
  }
  
  // Calculate bundles needed
  static calculateBundles(sentraTechCost) {
    return sentraTechCost / PROTECTED_CONSTANTS.SENTRATECH_BUNDLE_COST;
  }
  
  // Calculate ROI percentage
  static calculateROI(savings, investment) {
    if (investment <= 0) return 0;
    return (savings / investment) * 100;
  }
  
  // Calculate cost reduction percentage
  static calculateCostReduction(savings, originalCost) {
    if (originalCost <= 0) return 0;
    return (savings / originalCost) * 100;
  }
  
  // MAIN CALCULATION METHOD - BULLETPROOF
  static calculate(calls, interactions, country = 'Bangladesh') {
    try {
      // Step 1: Validate inputs
      this.validateInputs(calls, interactions, country);
      
      // Step 2: Calculate Traditional BPO cost
      const traditionalMonthlyCost = this.calculateTraditionalCost(calls, interactions, country);
      
      // Step 3: Calculate SentraTech cost
      const sentraTechMonthlyCost = this.calculateSentraTechCost(calls, interactions);
      
      // Step 4: Calculate savings
      const monthlySavings = traditionalMonthlyCost - sentraTechMonthlyCost;
      
      // Step 5: Calculate annual figures
      const yearlyTraditionalCost = traditionalMonthlyCost * 12;
      const yearlySentraTechCost = sentraTechMonthlyCost * 12;
      const yearlySavings = monthlySavings * 12;
      
      // Step 6: Calculate ROI and Cost Reduction
      const roi = this.calculateROI(monthlySavings, sentraTechMonthlyCost);
      const costReduction = this.calculateCostReduction(monthlySavings, traditionalMonthlyCost);
      
      // Step 7: Calculate bundles
      const bundlesNeeded = this.calculateBundles(sentraTechMonthlyCost);
      
      // Return protected results object
      const results = Object.freeze({
        // Inputs (for verification)
        inputs: Object.freeze({ calls, interactions, country }),
        
        // Monthly costs
        traditionalMonthlyCost,
        sentraTechMonthlyCost,
        monthlySavings,
        
        // Annual costs  
        yearlyTraditionalCost,
        yearlySentraTechCost,
        yearlySavings,
        
        // Percentages
        roi,
        costReduction,
        
        // Bundles
        bundlesNeeded,
        
        // Meta
        humanHandledPercentage: 100 - PROTECTED_CONSTANTS.AUTOMATION_PERCENTAGE,
        
        // Calculation breakdown (for debugging)
        breakdown: Object.freeze({
          callMinutes: calls * PROTECTED_CONSTANTS.CALL_AHT,
          interactionMinutes: interactions * PROTECTED_CONSTANTS.INTERACTION_AHT,
          totalMinutes: (calls * PROTECTED_CONSTANTS.CALL_AHT) + (interactions * PROTECTED_CONSTANTS.INTERACTION_AHT),
          bpoRate: PROTECTED_CONSTANTS.COUNTRIES[country].bpoPerMin,
          callCost: (calls / 1000) * PROTECTED_CONSTANTS.CALL_COST_PER_1K,
          interactionCost: (interactions / 1000) * PROTECTED_CONSTANTS.INTERACTION_COST_PER_1K
        })
      });
      
      // Validate results before returning
      this.validateResults(results);
      
      return results;
      
    } catch (error) {
      console.error('ROI Calculation Error:', error);
      throw error;
    }
  }
  
  // Validate calculation results
  static validateResults(results) {
    const { traditionalMonthlyCost, sentraTechMonthlyCost, monthlySavings, roi, costReduction } = results;
    
    // Validate basic math
    const expectedSavings = traditionalMonthlyCost - sentraTechMonthlyCost;
    const expectedROI = (expectedSavings / sentraTechMonthlyCost) * 100;
    const expectedCostReduction = (expectedSavings / traditionalMonthlyCost) * 100;
    
    const tolerance = 0.01;
    
    if (Math.abs(monthlySavings - expectedSavings) > tolerance) {
      throw new Error(`Savings validation failed: Expected ${expectedSavings}, got ${monthlySavings}`);
    }
    
    if (Math.abs(roi - expectedROI) > tolerance) {
      throw new Error(`ROI validation failed: Expected ${expectedROI}, got ${roi}`);
    }
    
    if (Math.abs(costReduction - expectedCostReduction) > tolerance) {
      throw new Error(`Cost reduction validation failed: Expected ${expectedCostReduction}, got ${costReduction}`);
    }
    
    return true;
  }
}

// PROTECTED FORMATTING FUNCTIONS
export const formatCurrencyProtected = (amount) => {
  if (amount === 0) return '$0';
  if (amount < 1000) return `$${Math.round(amount)}`;
  if (amount < 1000000) {
    // Use precise truncation to avoid rounding errors
    const thousands = Math.floor((amount / 1000) * 10) / 10;
    return `$${thousands.toFixed(1)}K`;
  }
  return `$${(Math.floor(amount / 100000) * 10 / 100).toFixed(1)}M`;
};

export const formatPercentageProtected = (value) => {
  return `${(Math.round(value * 10) / 10).toFixed(1)}%`;
};

// TEST SUITE FOR VERIFICATION
export const runProtectedTests = () => {
  console.log('🧮 Running Protected ROI Calculator Tests...');
  
  const testCases = [
    {
      name: '1000 calls + 1000 interactions (Bangladesh)',
      inputs: { calls: 1000, interactions: 1000, country: 'Bangladesh' },
      expected: {
        traditionalMonthlyCost: 5200, // (1000×8 + 1000×5) × 0.40
        sentraTechMonthlyCost: 1650, // 1014.75 + 635.25
        monthlySavings: 3550, // 5200 - 1650
        roi: 215.15, // (3550 / 1650) × 100
        costReduction: 68.27 // (3550 / 5200) × 100
      }
    },
    {
      name: '2000 calls + 1500 interactions (Bangladesh)',
      inputs: { calls: 2000, interactions: 1500, country: 'Bangladesh' },
      expected: {
        traditionalMonthlyCost: 9400, // (2000×8 + 1500×5) × 0.40
        sentraTechMonthlyCost: 2982.25, // (2×1014.75) + (1.5×635.25)
        monthlySavings: 6417.75, // 9400 - 2982.25
        roi: 215.15, // Should be consistent
        costReduction: 68.27 // Should be consistent
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach(testCase => {
    try {
      const { calls, interactions, country } = testCase.inputs;
      const results = ROICalculatorEngine.calculate(calls, interactions, country);
      
      // Check each expected value
      Object.entries(testCase.expected).forEach(([key, expectedValue]) => {
        const actualValue = results[key];
        const tolerance = 0.1;
        
        if (Math.abs(actualValue - expectedValue) > tolerance) {
          console.error(`❌ Test Failed: ${testCase.name} - ${key}`);
          console.error(`   Expected: ${expectedValue}, Got: ${actualValue}`);
          failed++;
        } else {
          console.log(`✅ Test Passed: ${testCase.name} - ${key}`);
          passed++;
        }
      });
      
    } catch (error) {
      console.error(`❌ Test Error: ${testCase.name} - ${error.message}`);
      failed++;
    }
  });
  
  console.log(`\n🧮 Test Results: ${passed} passed, ${failed} failed`);
  return { passed, failed, success: failed === 0 };
};

// Export protected implementation
export default {
  ROICalculatorEngine,
  PROTECTED_CONSTANTS,
  formatCurrencyProtected,
  formatPercentageProtected,
  runProtectedTests
};