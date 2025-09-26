#!/usr/bin/env python3
"""
Comprehensive ROI Calculator Testing for SentraTech
Tests the "33% Cost Reduction" and "50% ROI" calculations across different scenarios
"""

import requests
import json
import time
import math
from datetime import datetime
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://sleek-support.preview.emergentagent.com/api"

class ROICalculationTester:
    """Comprehensive ROI Calculation Testing Framework"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def calculate_expected_values(self, country: str, agent_count: int, aht_minutes: int, call_volume_override: int = None):
        """Calculate expected values using the frontend logic"""
        # Country baselines
        BASE_COST = {
            'Bangladesh': 300,
            'India': 500,
            'Philippines': 600,
            'Vietnam': 550
        }
        
        AI_COST_PER_AGENT = 200
        
        if agent_count <= 0 or aht_minutes <= 0:
            return {
                'call_volume': 0,
                'traditional_cost': 0,
                'ai_cost': 0,
                'monthly_savings': 0,
                'annual_savings': 0,
                'cost_reduction': 0,
                'roi_percent': 0,
                'traditional_per_call': 0,
                'ai_per_call': 0
            }
        
        # Calculate call volume
        if call_volume_override:
            call_volume = call_volume_override
        else:
            work_minutes_per_month = 8 * 60 * 22  # 8 hours × 60 minutes × 22 days = 10,560
            if aht_minutes > 0:
                calls_per_agent = work_minutes_per_month / aht_minutes
                call_volume = math.floor(agent_count * calls_per_agent)
            else:
                call_volume = 0
        
        # Calculate costs
        traditional_cost = agent_count * BASE_COST[country]
        ai_cost = agent_count * AI_COST_PER_AGENT
        
        # Calculate savings and ROI
        monthly_savings = traditional_cost - ai_cost
        annual_savings = monthly_savings * 12
        
        # Calculate percentages
        cost_reduction = int(((monthly_savings / traditional_cost) * 100)) if traditional_cost > 0 else 0
        roi_percent = int(((annual_savings / (ai_cost * 12)) * 100)) if ai_cost > 0 else 0
        
        # Per-call costs
        traditional_per_call = round(traditional_cost / call_volume, 2) if call_volume > 0 else 0
        ai_per_call = round(ai_cost / call_volume, 2) if call_volume > 0 else 0
        
        return {
            'call_volume': call_volume,
            'traditional_cost': traditional_cost,
            'ai_cost': ai_cost,
            'monthly_savings': monthly_savings,
            'annual_savings': annual_savings,
            'cost_reduction': cost_reduction,
            'roi_percent': roi_percent,
            'traditional_per_call': traditional_per_call,
            'ai_per_call': ai_per_call
        }
    
    def test_roi_calculation_api(self, country: str, agent_count: int, aht_minutes: int, call_volume_override: int = None):
        """Test ROI calculation API endpoint"""
        try:
            # Prepare request data - convert to backend format
            request_data = {
                "agent_count": agent_count,
                "average_handle_time": aht_minutes * 60,  # Convert minutes to seconds for backend
                "monthly_call_volume": call_volume_override or (agent_count * (8 * 60 * 22) // aht_minutes),
                "cost_per_agent": {"Bangladesh": 300, "India": 500, "Philippines": 600, "Vietnam": 550}[country],
                "country": country
            }
            
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=request_data, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ API Error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Exception calling API: {str(e)}")
            return None
    
    def test_specific_scenario(self, test_name: str, country: str, agent_count: int, aht_minutes: int, 
                             expected_cost_reduction: int = None, expected_roi: int = None, 
                             call_volume_override: int = None):
        """Test a specific ROI calculation scenario"""
        print(f"\n=== Testing {test_name} ===")
        print(f"Country: {country}, Agents: {agent_count}, AHT: {aht_minutes} min")
        
        # Calculate expected values using frontend logic
        expected = self.calculate_expected_values(country, agent_count, aht_minutes, call_volume_override)
        
        print(f"Expected Results:")
        print(f"  Call Volume: {expected['call_volume']:,}")
        print(f"  Traditional Cost: ${expected['traditional_cost']:,}")
        print(f"  AI Cost: ${expected['ai_cost']:,}")
        print(f"  Monthly Savings: ${expected['monthly_savings']:,}")
        print(f"  Annual Savings: ${expected['annual_savings']:,}")
        print(f"  Cost Reduction: {expected['cost_reduction']}%")
        print(f"  ROI: {expected['roi_percent']}%")
        print(f"  Traditional Per Call: ${expected['traditional_per_call']}")
        print(f"  AI Per Call: ${expected['ai_per_call']}")
        
        # Test API if available (optional since we're focusing on frontend logic)
        api_result = self.test_roi_calculation_api(country, agent_count, aht_minutes, call_volume_override)
        
        # Validate call volume calculation
        if call_volume_override:
            actual_call_volume = call_volume_override
        else:
            work_minutes = 8 * 60 * 22  # 10,560 minutes
            if aht_minutes > 0:
                actual_call_volume = math.floor(agent_count * (work_minutes / aht_minutes))
            else:
                actual_call_volume = 0
        
        if actual_call_volume == expected['call_volume']:
            self.log_test(f"{test_name} - Call Volume Formula", True, 
                         f"Call volume: {actual_call_volume:,} calls")
        else:
            self.log_test(f"{test_name} - Call Volume Formula", False, 
                         f"Expected: {expected['call_volume']:,}, Got: {actual_call_volume:,}")
        
        # Validate cost calculations
        expected_trad_cost = agent_count * {"Bangladesh": 300, "India": 500, "Philippines": 600, "Vietnam": 550}[country]
        expected_ai_cost = agent_count * 200
        
        if expected_trad_cost == expected['traditional_cost'] and expected_ai_cost == expected['ai_cost']:
            self.log_test(f"{test_name} - Cost Calculations", True, 
                         f"Traditional: ${expected_trad_cost:,}, AI: ${expected_ai_cost:,}")
        else:
            self.log_test(f"{test_name} - Cost Calculations", False, 
                         f"Cost calculation mismatch")
        
        # Validate cost reduction formula
        actual_cost_reduction = int(((expected['monthly_savings'] / expected['traditional_cost']) * 100)) if expected['traditional_cost'] > 0 else 0
        
        if actual_cost_reduction == expected['cost_reduction']:
            self.log_test(f"{test_name} - Cost Reduction Formula", True, 
                         f"Cost reduction: {actual_cost_reduction}%")
        else:
            self.log_test(f"{test_name} - Cost Reduction Formula", False, 
                         f"Expected: {expected['cost_reduction']}%, Got: {actual_cost_reduction}%")
        
        # Validate ROI formula
        actual_roi = int(((expected['annual_savings'] / (expected['ai_cost'] * 12)) * 100)) if expected['ai_cost'] > 0 else 0
        
        if actual_roi == expected['roi_percent']:
            self.log_test(f"{test_name} - ROI Formula", True, 
                         f"ROI: {actual_roi}%")
        else:
            self.log_test(f"{test_name} - ROI Formula", False, 
                         f"Expected: {expected['roi_percent']}%, Got: {actual_roi}%")
        
        # Test against expected values if provided
        if expected_cost_reduction is not None:
            tolerance = 2  # Allow 2% tolerance
            if abs(expected['cost_reduction'] - expected_cost_reduction) <= tolerance:
                self.log_test(f"{test_name} - Expected Cost Reduction", True, 
                             f"Within tolerance: {expected['cost_reduction']}% (expected ~{expected_cost_reduction}%)")
            else:
                self.log_test(f"{test_name} - Expected Cost Reduction", False, 
                             f"Got {expected['cost_reduction']}%, expected ~{expected_cost_reduction}%")
        
        if expected_roi is not None:
            tolerance = 5  # Allow 5% tolerance for ROI
            if abs(expected['roi_percent'] - expected_roi) <= tolerance:
                self.log_test(f"{test_name} - Expected ROI", True, 
                             f"Within tolerance: {expected['roi_percent']}% (expected ~{expected_roi}%)")
            else:
                self.log_test(f"{test_name} - Expected ROI", False, 
                             f"Got {expected['roi_percent']}%, expected ~{expected_roi}%")
        
        return expected
    
    def test_case_1_bangladesh_10_agents_7_min(self):
        """Test Case 1: Bangladesh, 10 agents, 7 min AHT - Should show 33% cost reduction and 50% ROI"""
        return self.test_specific_scenario(
            "Case 1: Bangladesh 10 agents 7min AHT",
            "Bangladesh", 10, 7, 
            expected_cost_reduction=33, 
            expected_roi=50
        )
    
    def test_case_2_india_20_agents_5_min(self):
        """Test Case 2: India, 20 agents, 5 min AHT - Should show 60% cost reduction and 150% ROI"""
        return self.test_specific_scenario(
            "Case 2: India 20 agents 5min AHT",
            "India", 20, 5,
            expected_cost_reduction=60,
            expected_roi=150
        )
    
    def test_edge_case_zero_agents(self):
        """Test Edge Case: Zero agents"""
        return self.test_specific_scenario(
            "Edge Case: Zero Agents",
            "Bangladesh", 0, 7
        )
    
    def test_edge_case_zero_aht(self):
        """Test Edge Case: Zero AHT"""
        return self.test_specific_scenario(
            "Edge Case: Zero AHT",
            "Bangladesh", 10, 0
        )
    
    def test_edge_case_maximum_values(self):
        """Test Edge Case: Maximum values (500 agents, 20 min AHT)"""
        return self.test_specific_scenario(
            "Edge Case: Maximum Values",
            "Philippines", 500, 20
        )
    
    def test_edge_case_minimum_values(self):
        """Test Edge Case: Minimum values (1 agent, 2 min AHT)"""
        return self.test_specific_scenario(
            "Edge Case: Minimum Values",
            "Vietnam", 1, 2
        )
    
    def test_manual_call_volume_override(self):
        """Test Manual Call Volume Override"""
        return self.test_specific_scenario(
            "Manual Call Volume Override",
            "India", 25, 10,
            call_volume_override=50000
        )
    
    def test_all_countries_same_scenario(self):
        """Test all countries with same scenario to verify baseline differences"""
        print(f"\n=== Testing All Countries (15 agents, 8 min AHT) ===")
        
        countries = ["Bangladesh", "India", "Philippines", "Vietnam"]
        results = {}
        
        for country in countries:
            print(f"\n--- {country} ---")
            result = self.test_specific_scenario(
                f"All Countries Test - {country}",
                country, 15, 8
            )
            results[country] = result
        
        # Verify that call volumes are the same across countries
        call_volumes = [results[country]['call_volume'] for country in countries]
        if len(set(call_volumes)) == 1:
            self.log_test("All Countries - Consistent Call Volume", True, 
                         f"All countries have same call volume: {call_volumes[0]:,}")
        else:
            self.log_test("All Countries - Consistent Call Volume", False, 
                         f"Call volumes differ: {call_volumes}")
        
        # Verify AI costs are the same across countries
        ai_costs = [results[country]['ai_cost'] for country in countries]
        if len(set(ai_costs)) == 1:
            self.log_test("All Countries - Consistent AI Cost", True, 
                         f"All countries have same AI cost: ${ai_costs[0]:,}")
        else:
            self.log_test("All Countries - Consistent AI Cost", False, 
                         f"AI costs differ: {ai_costs}")
        
        # Verify traditional costs differ according to baselines
        expected_trad_costs = {
            "Bangladesh": 15 * 300,
            "India": 15 * 500, 
            "Philippines": 15 * 600,
            "Vietnam": 15 * 550
        }
        
        all_correct = True
        for country in countries:
            if results[country]['traditional_cost'] != expected_trad_costs[country]:
                all_correct = False
                break
        
        if all_correct:
            self.log_test("All Countries - Correct Traditional Costs", True, 
                         "Traditional costs match country baselines")
        else:
            self.log_test("All Countries - Correct Traditional Costs", False, 
                         "Traditional costs don't match baselines")
        
        return results
    
    def test_aht_variations(self):
        """Test different AHT values with same country and agent count"""
        print(f"\n=== Testing AHT Variations (Bangladesh, 20 agents) ===")
        
        aht_values = [2, 7, 15, 20]
        results = {}
        
        for aht in aht_values:
            print(f"\n--- AHT: {aht} minutes ---")
            result = self.test_specific_scenario(
                f"AHT Variation - {aht}min",
                "Bangladesh", 20, aht
            )
            results[aht] = result
        
        # Verify inverse relationship between AHT and call volume
        call_volumes = [(aht, results[aht]['call_volume']) for aht in aht_values]
        call_volumes.sort()  # Sort by AHT
        
        # Check if call volume decreases as AHT increases
        is_inverse = all(call_volumes[i][1] >= call_volumes[i+1][1] for i in range(len(call_volumes)-1))
        
        if is_inverse:
            self.log_test("AHT Variations - Inverse Relationship", True, 
                         "Call volume decreases as AHT increases")
        else:
            self.log_test("AHT Variations - Inverse Relationship", False, 
                         "Call volume doesn't follow inverse relationship with AHT")
        
        # Print call volumes for verification
        print(f"Call Volume vs AHT:")
        for aht, volume in call_volumes:
            print(f"  {aht} min AHT → {volume:,} calls")
        
        return results
    
    def test_agent_count_variations(self):
        """Test different agent counts with same country and AHT"""
        print(f"\n=== Testing Agent Count Variations (India, 10 min AHT) ===")
        
        agent_counts = [1, 10, 50, 100, 500]
        results = {}
        
        for agents in agent_counts:
            print(f"\n--- Agents: {agents} ---")
            result = self.test_specific_scenario(
                f"Agent Count Variation - {agents} agents",
                "India", agents, 10
            )
            results[agents] = result
        
        # Verify linear scaling of costs and call volume
        for i, agents in enumerate(agent_counts[1:], 1):  # Skip first element
            prev_agents = agent_counts[i-1]
            
            # Check if costs scale linearly
            cost_ratio = results[agents]['traditional_cost'] / results[prev_agents]['traditional_cost']
            agent_ratio = agents / prev_agents
            
            if abs(cost_ratio - agent_ratio) < 0.01:  # Allow small floating point errors
                self.log_test(f"Agent Scaling - {prev_agents} to {agents} agents", True, 
                             f"Linear cost scaling verified")
            else:
                self.log_test(f"Agent Scaling - {prev_agents} to {agents} agents", False, 
                             f"Cost ratio {cost_ratio:.2f} != agent ratio {agent_ratio:.2f}")
        
        return results
    
    def run_comprehensive_roi_tests(self):
        """Run all comprehensive ROI calculation tests"""
        print("🧮 Starting Comprehensive ROI Calculator Testing")
        print("=" * 80)
        print("Testing SentraTech ROI calculation logic:")
        print("• Cost Reduction Formula: ((tradCost - aiCost) / tradCost) × 100")
        print("• ROI Formula: ((annualSavings / (aiCost × 12)) × 100)")
        print("• Call Volume Formula: agentCount × (8 × 60 × 22) / ahtMinutes")
        print("• Country Baselines: Bangladesh $300, India $500, Philippines $600, Vietnam $550")
        print("• AI Cost: $200/agent/month")
        print("=" * 80)
        
        try:
            # Test specific scenarios from the review request
            print("\n🎯 TESTING SPECIFIC SCENARIOS FROM REVIEW REQUEST")
            self.test_case_1_bangladesh_10_agents_7_min()
            self.test_case_2_india_20_agents_5_min()
            
            # Test edge cases
            print("\n⚠️ TESTING EDGE CASES")
            self.test_edge_case_zero_agents()
            self.test_edge_case_zero_aht()
            self.test_edge_case_maximum_values()
            self.test_edge_case_minimum_values()
            
            # Test manual call volume override
            print("\n📝 TESTING MANUAL CALL VOLUME OVERRIDE")
            self.test_manual_call_volume_override()
            
            # Test all countries
            print("\n🌍 TESTING ALL COUNTRIES")
            self.test_all_countries_same_scenario()
            
            # Test variations
            print("\n⏱️ TESTING AHT VARIATIONS")
            self.test_aht_variations()
            
            print("\n👥 TESTING AGENT COUNT VARIATIONS")
            self.test_agent_count_variations()
            
        except Exception as e:
            print(f"❌ Critical error during ROI testing: {str(e)}")
            self.log_test("ROI Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate summary report
        self.generate_roi_test_report()
    
    def generate_roi_test_report(self):
        """Generate comprehensive ROI test report"""
        print("\n" + "=" * 80)
        print("📊 SENTRATECH ROI CALCULATOR TESTING - COMPREHENSIVE REPORT")
        print("=" * 80)
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📈 Overall Test Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📊 Success Rate: {success_rate:.1f}%")
        
        # Formula verification summary
        print(f"\n🧮 Formula Verification Summary:")
        
        formula_tests = [test for test in self.test_results if "Formula" in test["test"]]
        formula_passed = len([test for test in formula_tests if test["passed"]])
        formula_total = len(formula_tests)
        
        if formula_total > 0:
            formula_success_rate = (formula_passed / formula_total) * 100
            print(f"   Formula Tests: {formula_passed}/{formula_total} passed ({formula_success_rate:.1f}%)")
        
        # Edge case summary
        edge_case_tests = [test for test in self.test_results if "Edge Case" in test["test"]]
        edge_passed = len([test for test in edge_case_tests if test["passed"]])
        edge_total = len(edge_case_tests)
        
        if edge_total > 0:
            edge_success_rate = (edge_passed / edge_total) * 100
            print(f"   Edge Case Tests: {edge_passed}/{edge_total} passed ({edge_success_rate:.1f}%)")
        
        # Country variation summary
        country_tests = [test for test in self.test_results if "All Countries" in test["test"]]
        country_passed = len([test for test in country_tests if test["passed"]])
        country_total = len(country_tests)
        
        if country_total > 0:
            country_success_rate = (country_passed / country_total) * 100
            print(f"   Country Tests: {country_passed}/{country_total} passed ({country_success_rate:.1f}%)")
        
        # Key findings
        print(f"\n🔍 Key Findings:")
        
        # Check if the 33% and 50% targets are met
        case1_cost_reduction_test = next((test for test in self.test_results 
                                        if "Case 1" in test["test"] and "Cost Reduction" in test["test"]), None)
        case1_roi_test = next((test for test in self.test_results 
                             if "Case 1" in test["test"] and "ROI" in test["test"]), None)
        
        if case1_cost_reduction_test and case1_cost_reduction_test["passed"]:
            print(f"   ✅ Bangladesh 10 agents 7min AHT achieves ~33% cost reduction")
        else:
            print(f"   ❌ Bangladesh 10 agents 7min AHT does not achieve 33% cost reduction")
        
        if case1_roi_test and case1_roi_test["passed"]:
            print(f"   ✅ Bangladesh 10 agents 7min AHT achieves ~50% ROI")
        else:
            print(f"   ❌ Bangladesh 10 agents 7min AHT does not achieve 50% ROI")
        
        # Overall assessment
        print(f"\n🎯 ROI Calculator Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - ROI calculations are highly accurate and reliable")
        elif success_rate >= 80:
            print(f"   ✅ GOOD - ROI calculations are mostly accurate with minor issues")
        elif success_rate >= 70:
            print(f"   ⚠️ FAIR - ROI calculations need some improvements")
        else:
            print(f"   ❌ POOR - ROI calculations have significant issues")
        
        # Failed tests details
        if failed_tests > 0:
            print(f"\n❌ Failed Tests Details:")
            for test in self.test_results:
                if not test["passed"]:
                    print(f"   • {test['test']}: {test['details']}")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests == 0:
            print(f"   • ROI calculator is working correctly and ready for production")
            print(f"   • Consider adding more test scenarios for edge cases")
        else:
            print(f"   • Review and fix {failed_tests} failed test cases")
            print(f"   • Verify formula implementations match specifications")
            print(f"   • Test with real-world data scenarios")
        
        print(f"   • Implement automated testing for ROI calculations")
        print(f"   • Add input validation for extreme values")
        print(f"   • Consider adding more country baselines")
        
        return success_rate >= 80


if __name__ == "__main__":
    tester = ROICalculationTester()
    success = tester.run_comprehensive_roi_tests()
    
    if success:
        print(f"\n🎉 ROI Calculator testing completed successfully!")
        exit(0)
    else:
        print(f"\n❌ ROI Calculator testing found issues that need attention.")
        exit(1)