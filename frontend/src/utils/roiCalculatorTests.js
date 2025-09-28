/**
 * ROI Calculator Test Suite & Protection
 * Ensures mathematical accuracy and prevents future calculation errors
 */

// Test cases for validation
export const ROI_TEST_CASES = [
  {
    name: "Base Case - 1000 calls + 1000 interactions",
    inputs: {
      calls: 1000,
      interactions: 1000,
      country: "Bangladesh" // $0.40/min
    },
    expected: {
      traditionalMonthlyCost: 5200, // (1000×8 + 1000×5) × 0.40 = 13000 × 0.40
      sentraTechMonthlyCost: 1650, // 1000/1000 × 1014.75 + 1000/1000 × 635.25
      monthlySavings: 3550, // 5200 - 1650
      yearlySavings: 42600, // 3550 × 12
      roi: 215.2, // (3550 / 1650) × 100 = 215.15%
      costReduction: 68.3 // (3550 / 5200) × 100 = 68.27%
    }
  },
  {
    name: "Double Interactions - 1000 calls + 2000 interactions",
    inputs: {
      calls: 1000,
      interactions: 2000,
      country: "Bangladesh"
    },
    expected: {
      traditionalMonthlyCost: 7200, // (1000×8 + 2000×5) × 0.40 = 18000 × 0.40
      sentraTechMonthlyCost: 2285.25, // 1000/1000 × 1014.75 + 2000/1000 × 635.25
      monthlySavings: 4914.75, // 7200 - 2285.25
      yearlySavings: 58977, // 4914.75 × 12
      roi: 215.0, // (4914.75 / 2285.25) × 100 ≈ 215.0%
      costReduction: 68.3 // (4914.75 / 7200) × 100 ≈ 68.3%
    }
  },
  {
    name: "High Volume - 5000 calls + 3000 interactions",
    inputs: {
      calls: 5000,
      interactions: 3000,
      country: "Bangladesh"
    },
    expected: {
      traditionalMonthlyCost: 22000, // (5000×8 + 3000×5) × 0.40 = 55000 × 0.40
      sentraTechMonthlyCost: 6979.5, // 5000/1000 × 1014.75 + 3000/1000 × 635.25
      monthlySavings: 15020.5, // 22000 - 6979.5
      yearlySavings: 180246, // 15020.5 × 12
      roi: 215.2, // (15020.5 / 6979.5) × 100
      costReduction: 68.3 // (15020.5 / 22000) × 100
    }
  }
];

// Constants for calculation validation
export const CALCULATION_CONSTANTS = {
  // Country BPO rates (per minute)
  COUNTRIES: {
    'Bangladesh': { bpoPerMin: 0.40 },
    'India': { bpoPerMin: 0.55 },
    'Philippines': { bpoPerMin: 0.90 },
    'Vietnam': { bpoPerMin: 0.60 }
  },
  
  // AHT (Average Handle Time) in minutes
  CALL_AHT: 8,
  INTERACTION_AHT: 5,
  
  // SentraTech pricing (per 1000)
  SENTRATECH_BUNDLE_COST: 1650,
  CALL_COST_PER_1K: 1014.75, // 61.5% of 1650
  INTERACTION_COST_PER_1K: 635.25, // 38.5% of 1650
  
  // Automation
  AUTOMATION_PERCENTAGE: 70
};

// Validate calculation function
export const validateROICalculation = (inputs, results, tolerance = 0.1) => {
  const { calls, interactions, country } = inputs;
  const countryData = CALCULATION_CONSTANTS.COUNTRIES[country];
  
  if (!countryData) {
    throw new Error(`Invalid country: ${country}`);
  }
  
  // Calculate expected values
  const callMinutes = calls * CALCULATION_CONSTANTS.CALL_AHT;
  const interactionMinutes = interactions * CALCULATION_CONSTANTS.INTERACTION_AHT;
  const totalMinutes = callMinutes + interactionMinutes;
  const expectedTraditionalCost = totalMinutes * countryData.bpoPerMin;
  
  const expectedCallCost = (calls / 1000) * CALCULATION_CONSTANTS.CALL_COST_PER_1K;
  const expectedInteractionCost = (interactions / 1000) * CALCULATION_CONSTANTS.INTERACTION_COST_PER_1K;
  const expectedSentraTechCost = expectedCallCost + expectedInteractionCost;
  
  const expectedSavings = expectedTraditionalCost - expectedSentraTechCost;
  const expectedROI = (expectedSavings / expectedSentraTechCost) * 100;
  const expectedCostReduction = (expectedSavings / expectedTraditionalCost) * 100;
  
  // Validation results
  const validations = {
    traditionalCost: {
      expected: expectedTraditionalCost,
      actual: results.traditionalMonthlyCost,
      valid: Math.abs(results.traditionalMonthlyCost - expectedTraditionalCost) <= tolerance
    },
    sentraTechCost: {
      expected: expectedSentraTechCost,
      actual: results.sentraTechMonthlyCost,
      valid: Math.abs(results.sentraTechMonthlyCost - expectedSentraTechCost) <= tolerance
    },
    savings: {
      expected: expectedSavings,
      actual: results.monthlySavings,
      valid: Math.abs(results.monthlySavings - expectedSavings) <= tolerance
    },
    roi: {
      expected: expectedROI,
      actual: results.roi,
      valid: Math.abs(results.roi - expectedROI) <= tolerance
    },
    costReduction: {
      expected: expectedCostReduction,
      actual: results.costReduction,
      valid: Math.abs(results.costReduction - expectedCostReduction) <= tolerance
    }
  };
  
  // Check if all validations pass
  const allValid = Object.values(validations).every(v => v.valid);
  
  if (!allValid) {
    console.error('❌ ROI Calculation Validation Failed:', validations);
  }
  
  return {
    valid: allValid,
    validations,
    summary: {
      inputs,
      expected: {
        traditionalCost: expectedTraditionalCost,
        sentraTechCost: expectedSentraTechCost,
        savings: expectedSavings,
        roi: expectedROI,
        costReduction: expectedCostReduction
      },
      actual: {
        traditionalCost: results.traditionalMonthlyCost,
        sentraTechCost: results.sentraTechMonthlyCost,
        savings: results.monthlySavings,
        roi: results.roi,
        costReduction: results.costReduction
      }
    }
  };
};

// Run all test cases
export const runROITestSuite = (calculationFunction) => {
  console.log('🧮 Running ROI Calculator Test Suite...');
  
  const results = ROI_TEST_CASES.map(testCase => {
    const { name, inputs, expected } = testCase;
    
    try {
      const calculatedResults = calculationFunction(inputs);
      const validation = validateROICalculation(inputs, calculatedResults);
      
      return {
        name,
        passed: validation.valid,
        validation: validation.validations,
        summary: validation.summary
      };
    } catch (error) {
      return {
        name,
        passed: false,
        error: error.message
      };
    }
  });
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  console.log(`✅ ROI Test Suite Complete: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests !== totalTests) {
    console.error('❌ Some tests failed:', results.filter(r => !r.passed));
  }
  
  return {
    passed: passedTests === totalTests,
    results,
    summary: `${passedTests}/${totalTests} tests passed`
  };
};

// Precision formatting utilities
export const formatCurrencyPrecise = (amount) => {
  if (amount === 0) return '$0';
  if (amount < 1000) return `$${Math.round(amount)}`;
  if (amount < 1000000) {
    // Use Math.floor instead of Math.round for more accurate representation
    // $3,550 should show as $3.5K, not $3.6K
    const thousands = Math.floor((amount / 1000) * 10) / 10;
    return `$${thousands.toFixed(1)}K`;
  }
  return `$${(Math.floor(amount / 100000) * 10) / 100}.toFixed(1)}M`;
};

export const formatPercentagePrecise = (value) => {
  return `${Math.round(value * 10) / 10}%`;
};

// Export protection functions
export default {
  ROI_TEST_CASES,
  CALCULATION_CONSTANTS,
  validateROICalculation,
  runROITestSuite,
  formatCurrencyPrecise,
  formatPercentagePrecise
};