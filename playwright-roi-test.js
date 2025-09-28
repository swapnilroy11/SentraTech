const { chromium } = require('playwright');

// Canonical test cases as provided by user
const TEST_CASES = [
  {
    name: "Case A - Bangladesh",
    inputs: { calls: 1000, interactions: 2000, bpoPerMin: 0.4 },
    expected: {
      bpoCost: 7200, // (1000*8 + 2000*5) * 0.4 = 18000 * 0.4 = 7200
      sentraCost: 2284.62,
      savings: 4915.38,
      roiPct: 215,
      costReduction: 68,
      bundles: 1.4
    }
  },
  {
    name: "Case B - India", 
    inputs: { calls: 1000, interactions: 2000, bpoPerMin: 0.55 },
    expected: {
      bpoCost: 9900, // 18000 * 0.55
      sentraCost: 2284.62,
      savings: 7615.38,
      roiPct: 333,
      costReduction: 77
    }
  },
  {
    name: "Case C - Philippines",
    inputs: { calls: 1000, interactions: 2000, bpoPerMin: 0.9 },
    expected: {
      bpoCost: 16200, // 18000 * 0.9  
      sentraCost: 2284.62,
      savings: 13915.38,
      roiPct: 609,
      costReduction: 86
    }
  },
  {
    name: "Case D - Vietnam",
    inputs: { calls: 1000, interactions: 2000, bpoPerMin: 0.6 },
    expected: {
      bpoCost: 10800, // 18000 * 0.6
      sentraCost: 2284.62, 
      savings: 8515.38,
      roiPct: 373,
      costReduction: 79
    }
  }
];

// Country mapping
const COUNTRIES = {
  0.4: 'Bangladesh',
  0.55: 'India', 
  0.9: 'Philippines',
  0.6: 'Vietnam'
};

// Helper to parse money strings like "$7.2K" or "$7,200" -> number
function parseMoney(str) {
  if (!str) return null;
  const cleaned = str.replace(/\$/g, '').replace(/,/g, '').trim().toUpperCase();
  if (cleaned.endsWith('K')) return parseFloat(cleaned.slice(0,-1)) * 1000;
  if (cleaned.endsWith('M')) return parseFloat(cleaned.slice(0,-1)) * 1e6;
  return parseFloat(cleaned);
}

// Helper to parse percentage strings
function parsePercentage(str) {
  if (!str) return null;
  return parseFloat(str.replace('%', ''));
}

(async () => {
  console.log('🧮 ROI Calculator Validation Testing with Playwright');
  console.log('=' * 60);
  
  const browser = await chromium.launch({ headless: true }); // Headless mode for server environment
  const page = await browser.newPage();
  
  try {
    // Navigate to ROI calculator
    await page.goto('http://localhost:3000/roi-calculator', { waitUntil: 'networkidle' });
    
    // Accept cookies if present
    try {
      await page.click('text=Accept All Cookies', { timeout: 3000 });
      await page.waitForTimeout(1000);
      console.log("✅ Cookies accepted");
    } catch (e) {
      console.log("ℹ️  No cookie banner found");
    }
    
    // Wait for calculator to load
    await page.waitForSelector('[data-testid="roi-calculator"], .roi-calculator, #roi-calculator, input[placeholder*="1000"]', { timeout: 10000 });
    console.log("✅ ROI Calculator loaded");
    
    let totalTests = 0;
    let passedTests = 0;
    
    // Test each case
    for (const testCase of TEST_CASES) {
      totalTests++;
      
      console.log(`\n📊 Testing: ${testCase.name}`);
      console.log(`   Inputs: ${testCase.inputs.calls} calls, ${testCase.inputs.interactions} interactions, ${COUNTRIES[testCase.inputs.bpoPerMin]}`);
      
      try {
        // Select country first (based on BPO rate)
        const countryName = COUNTRIES[testCase.inputs.bpoPerMin];
        const countryButton = page.locator(`text="${countryName}"`).first();
        await countryButton.click();
        await page.waitForTimeout(500);
        console.log(`   ✅ Selected country: ${countryName}`);
        
        // Fill in call volume
        const callInput = page.locator('input[placeholder*="1000"], input[placeholder*="call"], input[type="number"]').first();
        await callInput.fill('');
        await callInput.fill(testCase.inputs.calls.toString());
        await page.waitForTimeout(200);
        
        // Fill in interaction volume  
        const interactionInput = page.locator('input[placeholder*="1500"], input[placeholder*="interaction"], input[type="number"]').nth(1);
        await interactionInput.fill('');
        await interactionInput.fill(testCase.inputs.interactions.toString());
        await page.waitForTimeout(500);
        
        console.log(`   ✅ Filled volumes: ${testCase.inputs.calls} calls, ${testCase.inputs.interactions} interactions`);
        
        // Wait for calculations to update
        await page.waitForTimeout(1000);
        
        // Extract results - try multiple selectors
        let bpoUIValue, sentraUIValue, savingsUIValue, roiUIValue, costRedUIValue;
        
        // Try to find BPO cost display
        try {
          const bpoSelectors = [
            'text=/Traditional BPO/i ~ div:has-text("$")',
            'text=/BPO.*Cost/i ~ div:has-text("$")',
            'text=/Traditional/i ~ * >> text=/\\$[\\d,\\.KM]+/',
            '[class*="red"] >> text=/\\$[\\d,\\.KM]+/',
            'text=/\\$[\\d,]+\\.?\\d*[KM]?/ >> nth=0'
          ];
          
          for (const selector of bpoSelectors) {
            try {
              const element = await page.locator(selector).first();
              if (await element.isVisible()) {
                bpoUIValue = await element.textContent();
                break;
              }
            } catch (e) {}
          }
        } catch (e) {}
        
        // Try to find Sentra cost
        try {
          const sentraSelectors = [
            'text=/SentraTech/i ~ div:has-text("$")', 
            'text=/AI.*Cost/i ~ div:has-text("$")',
            'text=/SentraTech/i ~ * >> text=/\\$[\\d,\\.KM]+/',
            '[class*="green"] >> text=/\\$[\\d,\\.KM]+/',
            'text=/\\$[\\d,]+\\.?\\d*[KM]?/ >> nth=1'
          ];
          
          for (const selector of sentraSelectors) {
            try {
              const element = await page.locator(selector).first();
              if (await element.isVisible()) {
                sentraUIValue = await element.textContent();
                break;
              }
            } catch (e) {}
          }
        } catch (e) {}
        
        // Try to find savings
        try {
          const savingsSelectors = [
            'text=/Savings/i ~ div:has-text("$")',
            'text=/Your Savings/i ~ * >> text=/\\$[\\d,\\.KM]+/',
            '[class*="blue"] >> text=/\\$[\\d,\\.KM]+/',
            'text=/\\$[\\d,]+\\.?\\d*[KM]?/ >> nth=2'
          ];
          
          for (const selector of savingsSelectors) {
            try {
              const element = await page.locator(selector).first();
              if (await element.isVisible()) {
                savingsUIValue = await element.textContent();
                break;
              }
            } catch (e) {}
          }
        } catch (e) {}
        
        // Try to find ROI percentage
        try {
          const roiSelectors = [
            'text=/ROI/i ~ div:has-text("%")',
            'text=/Return.*Investment/i ~ * >> text=/\\d+.*%/',
            'text=/\\d+\\.?\\d*%/ >> nth=0'
          ];
          
          for (const selector of roiSelectors) {
            try {
              const element = await page.locator(selector).first();
              if (await element.isVisible()) {
                roiUIValue = await element.textContent();
                break;
              }
            } catch (e) {}
          }
        } catch (e) {}
        
        console.log(`   📊 UI Values Found:`);
        console.log(`      BPO: ${bpoUIValue || 'NOT FOUND'}`);
        console.log(`      Sentra: ${sentraUIValue || 'NOT FOUND'}`);
        console.log(`      Savings: ${savingsUIValue || 'NOT FOUND'}`);
        console.log(`      ROI: ${roiUIValue || 'NOT FOUND'}`);
        
        // Convert UI values to numbers for comparison
        const uiBpo = parseMoney(bpoUIValue);
        const uiSentra = parseMoney(sentraUIValue);
        const uiSavings = parseMoney(savingsUIValue);
        const uiRoi = parsePercentage(roiUIValue);
        
        console.log(`   🔢 Parsed Values:`);
        console.log(`      BPO: ${uiBpo}`);
        console.log(`      Sentra: ${uiSentra}`);
        console.log(`      Savings: ${uiSavings}`);
        console.log(`      ROI: ${uiRoi}%`);
        
        // Compare with expected (with tolerance)
        const tolerance = 50; // $50 tolerance for money
        const percentageTolerance = 10; // 10% tolerance for percentages
        
        let testPassed = true;
        const results = [];
        
        if (uiBpo !== null) {
          const bpoMatch = Math.abs(uiBpo - testCase.expected.bpoCost) <= tolerance;
          results.push(`BPO: ${bpoMatch ? '✅ PASS' : '❌ FAIL'} (Expected: $${testCase.expected.bpoCost}, Got: $${uiBpo})`);
          if (!bpoMatch) testPassed = false;
        }
        
        if (uiSentra !== null) {
          const sentraMatch = Math.abs(uiSentra - testCase.expected.sentraCost) <= tolerance;
          results.push(`Sentra: ${sentraMatch ? '✅ PASS' : '❌ FAIL'} (Expected: $${testCase.expected.sentraCost}, Got: $${uiSentra})`);
          if (!sentraMatch) testPassed = false;
        }
        
        if (uiSavings !== null) {
          const savingsMatch = Math.abs(uiSavings - testCase.expected.savings) <= tolerance;
          results.push(`Savings: ${savingsMatch ? '✅ PASS' : '❌ FAIL'} (Expected: $${testCase.expected.savings}, Got: $${uiSavings})`);
          if (!savingsMatch) testPassed = false;
        }
        
        if (uiRoi !== null) {
          const roiMatch = Math.abs(uiRoi - testCase.expected.roiPct) <= percentageTolerance;
          results.push(`ROI: ${roiMatch ? '✅ PASS' : '❌ FAIL'} (Expected: ${testCase.expected.roiPct}%, Got: ${uiRoi}%)`);
          if (!roiMatch) testPassed = false;
        }
        
        console.log(`   📋 Validation Results:`);
        results.forEach(result => console.log(`      ${result}`));
        
        if (testPassed) {
          console.log(`   🎉 ${testCase.name}: PASSED`);
          passedTests++;
        } else {
          console.log(`   💥 ${testCase.name}: FAILED`);
        }
        
      } catch (error) {
        console.error(`   ❌ ${testCase.name}: ERROR - ${error.message}`);
      }
      
      // Wait between tests
      await page.waitForTimeout(1000);
    }
    
    // Final results
    console.log(`\n📈 FINAL RESULTS:`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`Failed: ${totalTests - passedTests} (${(((totalTests - passedTests)/totalTests)*100).toFixed(1)}%)`);
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED! ROI Calculator matches canonical logic.');
    } else {
      console.log('⚠️  SOME TESTS FAILED! ROI Calculator has discrepancies from canonical logic.');
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  } finally {
    await browser.close();
  }
})();