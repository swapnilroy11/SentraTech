#!/usr/bin/env python3
"""
ROI Calculator Final Validation Testing
Tests the redesigned ROI Calculator with updated cost baselines and 30% profit margin
as specified in the review request.
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://support-platform-1.preview.emergentagent.com/api"

class ROICalculatorValidationTester:
    """Final validation testing for ROI Calculator with updated cost baselines and 30% profit margin"""
    
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
    
    def test_bangladesh_scenario(self):
        """Test Bangladesh: Agent Count = 50, AHT = 5 minutes → Should show realistic cost reduction in 30-70% range"""
        print("\n=== Testing Bangladesh Scenario (50 agents, 5 min AHT) ===")
        
        test_data = {
            "agent_count": 50,
            "average_handle_time": 300,  # 5 minutes in seconds
            "monthly_call_volume": 10000,  # Reasonable call volume for 50 agents
            "cost_per_agent": 300,  # Bangladesh baseline cost
            "country": "Bangladesh"
        }
        
        try:
            print(f"📊 Testing Bangladesh scenario: {test_data}")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Extract key metrics
                cost_reduction = result.get("cost_reduction_percentage", 0)
                traditional_cost = result.get("traditional_total_cost", 0)
                ai_cost = result.get("ai_total_cost", 0)
                monthly_savings = result.get("monthly_savings", 0)
                roi_percentage = result.get("roi_percentage", 0)
                
                print(f"   Traditional Cost: ${traditional_cost:,.2f}")
                print(f"   AI Cost: ${ai_cost:,.2f}")
                print(f"   Monthly Savings: ${monthly_savings:,.2f}")
                print(f"   Cost Reduction: {cost_reduction:.1f}%")
                print(f"   ROI: {roi_percentage:.1f}%")
                
                # Test 1: Cost reduction should be in 30-70% range
                if 30 <= cost_reduction <= 70:
                    self.log_test("Bangladesh - Cost Reduction Range", True,
                                f"Cost reduction {cost_reduction:.1f}% is within 30-70% range")
                else:
                    self.log_test("Bangladesh - Cost Reduction Range", False,
                                f"Cost reduction {cost_reduction:.1f}% is outside 30-70% range")
                
                # Test 2: AI cost should be approximately $200/agent ($10,000 for 50 agents)
                expected_ai_cost = 50 * 200  # $200 per agent
                ai_cost_tolerance = expected_ai_cost * 0.1  # 10% tolerance
                
                if abs(ai_cost - expected_ai_cost) <= ai_cost_tolerance:
                    self.log_test("Bangladesh - AI Cost Validation", True,
                                f"AI cost ${ai_cost:,.2f} is close to expected ${expected_ai_cost:,.2f}")
                else:
                    self.log_test("Bangladesh - AI Cost Validation", False,
                                f"AI cost ${ai_cost:,.2f} differs significantly from expected ${expected_ai_cost:,.2f}")
                
                # Test 3: Traditional cost should use Bangladesh baseline ($300/agent)
                expected_traditional_base = 50 * (300 + 50 + 30)  # Bangladesh + tech + infra
                traditional_tolerance = expected_traditional_base * 0.1
                
                if abs(traditional_cost - expected_traditional_base) <= traditional_tolerance:
                    self.log_test("Bangladesh - Traditional Cost Baseline", True,
                                f"Traditional cost ${traditional_cost:,.2f} uses correct Bangladesh baseline")
                else:
                    self.log_test("Bangladesh - Traditional Cost Baseline", False,
                                f"Traditional cost ${traditional_cost:,.2f} doesn't match Bangladesh baseline ${expected_traditional_base:,.2f}")
                
                # Test 4: ROI should be reasonable (not excessive)
                if 100 <= roi_percentage <= 500:
                    self.log_test("Bangladesh - ROI Reasonableness", True,
                                f"ROI {roi_percentage:.1f}% is within reasonable range")
                else:
                    self.log_test("Bangladesh - ROI Reasonableness", False,
                                f"ROI {roi_percentage:.1f}% is outside reasonable 100-500% range")
                
            else:
                self.log_test("Bangladesh - API Response", False,
                            f"API returned status {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Bangladesh - Exception", False, f"Exception: {str(e)}")
    
    def test_total_calls_mode(self):
        """Test Total Calls mode with 1000 and 50,000 calls to verify calculations"""
        print("\n=== Testing Total Calls Mode (1000 and 50,000 calls) ===")
        
        # Test Case 1: 1000 calls
        test_data_1k = {
            "agent_count": 10,
            "average_handle_time": 300,  # 5 minutes
            "monthly_call_volume": 1000,
            "cost_per_agent": 500,  # India baseline
            "country": "India"
        }
        
        try:
            print(f"📊 Testing 1000 calls scenario...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data_1k, timeout=30)
            
            if response.status_code == 200:
                result_1k = response.json()
                
                cost_per_call_traditional = result_1k.get("traditional_cost_per_call", 0)
                cost_per_call_ai = result_1k.get("ai_cost_per_call", 0)
                call_volume = result_1k.get("call_volume_processed", 0)
                
                print(f"   1000 calls - Traditional cost per call: ${cost_per_call_traditional:.3f}")
                print(f"   1000 calls - AI cost per call: ${cost_per_call_ai:.3f}")
                print(f"   1000 calls - Call volume processed: {call_volume}")
                
                # Test 1: Call volume should match input
                if call_volume == 1000:
                    self.log_test("Total Calls 1K - Volume Accuracy", True,
                                f"Call volume correctly processed: {call_volume}")
                else:
                    self.log_test("Total Calls 1K - Volume Accuracy", False,
                                f"Call volume mismatch: expected 1000, got {call_volume}")
                
                # Test 2: Per-call costs should be reasonable
                if 0.5 <= cost_per_call_traditional <= 50:
                    self.log_test("Total Calls 1K - Traditional Per-Call Cost", True,
                                f"Traditional per-call cost ${cost_per_call_traditional:.3f} is reasonable")
                else:
                    self.log_test("Total Calls 1K - Traditional Per-Call Cost", False,
                                f"Traditional per-call cost ${cost_per_call_traditional:.3f} seems unreasonable")
                
                if 0.1 <= cost_per_call_ai <= 20:
                    self.log_test("Total Calls 1K - AI Per-Call Cost", True,
                                f"AI per-call cost ${cost_per_call_ai:.3f} is reasonable")
                else:
                    self.log_test("Total Calls 1K - AI Per-Call Cost", False,
                                f"AI per-call cost ${cost_per_call_ai:.3f} seems unreasonable")
                
            else:
                self.log_test("Total Calls 1K - API Response", False,
                            f"API returned status {response.status_code}")
                
        except Exception as e:
            self.log_test("Total Calls 1K - Exception", False, f"Exception: {str(e)}")
        
        # Test Case 2: 50,000 calls
        test_data_50k = {
            "agent_count": 100,
            "average_handle_time": 240,  # 4 minutes
            "monthly_call_volume": 50000,
            "cost_per_agent": 600,  # Philippines baseline
            "country": "Philippines"
        }
        
        try:
            print(f"📊 Testing 50,000 calls scenario...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data_50k, timeout=30)
            
            if response.status_code == 200:
                result_50k = response.json()
                
                cost_per_call_traditional = result_50k.get("traditional_cost_per_call", 0)
                cost_per_call_ai = result_50k.get("ai_cost_per_call", 0)
                call_volume = result_50k.get("call_volume_processed", 0)
                monthly_savings = result_50k.get("monthly_savings", 0)
                
                print(f"   50K calls - Traditional cost per call: ${cost_per_call_traditional:.3f}")
                print(f"   50K calls - AI cost per call: ${cost_per_call_ai:.3f}")
                print(f"   50K calls - Call volume processed: {call_volume}")
                print(f"   50K calls - Monthly savings: ${monthly_savings:,.2f}")
                
                # Test 3: Call volume should match input
                if call_volume == 50000:
                    self.log_test("Total Calls 50K - Volume Accuracy", True,
                                f"Call volume correctly processed: {call_volume}")
                else:
                    self.log_test("Total Calls 50K - Volume Accuracy", False,
                                f"Call volume mismatch: expected 50000, got {call_volume}")
                
                # Test 4: Higher volume should show economies of scale
                if monthly_savings > 0:
                    self.log_test("Total Calls 50K - Positive Savings", True,
                                f"High volume shows positive savings: ${monthly_savings:,.2f}")
                else:
                    self.log_test("Total Calls 50K - Positive Savings", False,
                                f"High volume should show positive savings, got: ${monthly_savings:,.2f}")
                
            else:
                self.log_test("Total Calls 50K - API Response", False,
                            f"API returned status {response.status_code}")
                
        except Exception as e:
            self.log_test("Total Calls 50K - Exception", False, f"Exception: {str(e)}")
    
    def test_multi_country_comparison(self):
        """Test Bangladesh (lowest cost) vs Philippines (highest cost) to verify cost baselines"""
        print("\n=== Testing Multi-Country Comparison (Bangladesh vs Philippines) ===")
        
        # Bangladesh test
        bangladesh_data = {
            "agent_count": 50,
            "average_handle_time": 300,
            "monthly_call_volume": 15000,
            "cost_per_agent": 300,
            "country": "Bangladesh"
        }
        
        # Philippines test
        philippines_data = {
            "agent_count": 50,
            "average_handle_time": 300,
            "monthly_call_volume": 15000,
            "cost_per_agent": 600,
            "country": "Philippines"
        }
        
        bangladesh_result = None
        philippines_result = None
        
        try:
            print(f"📊 Testing Bangladesh baseline...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=bangladesh_data, timeout=30)
            
            if response.status_code == 200:
                bangladesh_result = response.json()
                print(f"   Bangladesh - Traditional Cost: ${bangladesh_result.get('traditional_total_cost', 0):,.2f}")
                print(f"   Bangladesh - Cost Reduction: {bangladesh_result.get('cost_reduction_percentage', 0):.1f}%")
            else:
                self.log_test("Multi-Country - Bangladesh API", False,
                            f"Bangladesh API failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Multi-Country - Bangladesh Exception", False, f"Exception: {str(e)}")
        
        try:
            print(f"📊 Testing Philippines baseline...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=philippines_data, timeout=30)
            
            if response.status_code == 200:
                philippines_result = response.json()
                print(f"   Philippines - Traditional Cost: ${philippines_result.get('traditional_total_cost', 0):,.2f}")
                print(f"   Philippines - Cost Reduction: {philippines_result.get('cost_reduction_percentage', 0):.1f}%")
            else:
                self.log_test("Multi-Country - Philippines API", False,
                            f"Philippines API failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Multi-Country - Philippines Exception", False, f"Exception: {str(e)}")
        
        # Compare results
        if bangladesh_result and philippines_result:
            bangladesh_traditional = bangladesh_result.get('traditional_total_cost', 0)
            philippines_traditional = philippines_result.get('traditional_total_cost', 0)
            
            bangladesh_reduction = bangladesh_result.get('cost_reduction_percentage', 0)
            philippines_reduction = philippines_result.get('cost_reduction_percentage', 0)
            
            # Test 1: Philippines should have higher traditional cost than Bangladesh
            if philippines_traditional > bangladesh_traditional:
                cost_difference = philippines_traditional - bangladesh_traditional
                self.log_test("Multi-Country - Cost Baseline Difference", True,
                            f"Philippines (${philippines_traditional:,.2f}) > Bangladesh (${bangladesh_traditional:,.2f}) by ${cost_difference:,.2f}")
            else:
                self.log_test("Multi-Country - Cost Baseline Difference", False,
                            f"Philippines (${philippines_traditional:,.2f}) should be > Bangladesh (${bangladesh_traditional:,.2f})")
            
            # Test 2: Philippines should show higher cost reduction percentage
            if philippines_reduction > bangladesh_reduction:
                reduction_difference = philippines_reduction - bangladesh_reduction
                self.log_test("Multi-Country - Cost Reduction Difference", True,
                            f"Philippines ({philippines_reduction:.1f}%) > Bangladesh ({bangladesh_reduction:.1f}%) by {reduction_difference:.1f}%")
            else:
                self.log_test("Multi-Country - Cost Reduction Difference", False,
                            f"Philippines ({philippines_reduction:.1f}%) should be > Bangladesh ({bangladesh_reduction:.1f}%)")
            
            # Test 3: Both should be in 30-70% range
            if 30 <= bangladesh_reduction <= 70 and 30 <= philippines_reduction <= 70:
                self.log_test("Multi-Country - Both in Range", True,
                            f"Both countries in 30-70% range: Bangladesh {bangladesh_reduction:.1f}%, Philippines {philippines_reduction:.1f}%")
            else:
                self.log_test("Multi-Country - Both in Range", False,
                            f"Countries outside 30-70% range: Bangladesh {bangladesh_reduction:.1f}%, Philippines {philippines_reduction:.1f}%")
    
    def test_algorithm_accuracy(self):
        """Verify the calculations match the expected formulas"""
        print("\n=== Testing Algorithm Accuracy ===")
        
        test_data = {
            "agent_count": 25,
            "average_handle_time": 360,  # 6 minutes
            "monthly_call_volume": 8000,
            "cost_per_agent": 500,  # India baseline
            "country": "India"
        }
        
        try:
            print(f"📊 Testing algorithm accuracy with controlled data...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Extract all components
                traditional_labor = result.get("traditional_labor_cost", 0)
                traditional_tech = result.get("traditional_technology_cost", 0)
                traditional_infra = result.get("traditional_infrastructure_cost", 0)
                traditional_total = result.get("traditional_total_cost", 0)
                
                ai_total = result.get("ai_total_cost", 0)
                monthly_savings = result.get("monthly_savings", 0)
                cost_reduction = result.get("cost_reduction_percentage", 0)
                roi_percentage = result.get("roi_percentage", 0)
                
                traditional_per_call = result.get("traditional_cost_per_call", 0)
                ai_per_call = result.get("ai_cost_per_call", 0)
                
                print(f"   Traditional Labor: ${traditional_labor:,.2f}")
                print(f"   Traditional Tech: ${traditional_tech:,.2f}")
                print(f"   Traditional Infra: ${traditional_infra:,.2f}")
                print(f"   Traditional Total: ${traditional_total:,.2f}")
                print(f"   AI Total: ${ai_total:,.2f}")
                print(f"   Monthly Savings: ${monthly_savings:,.2f}")
                print(f"   Cost Reduction: {cost_reduction:.1f}%")
                print(f"   ROI: {roi_percentage:.1f}%")
                
                # Test 1: Traditional cost formula verification
                expected_traditional_labor = 25 * 500  # 25 agents * $500
                expected_traditional_tech = 25 * 50    # 25 agents * $50
                expected_traditional_infra = 25 * 30   # 25 agents * $30
                expected_traditional_total = expected_traditional_labor + expected_traditional_tech + expected_traditional_infra
                
                if abs(traditional_total - expected_traditional_total) <= 100:  # $100 tolerance
                    self.log_test("Algorithm - Traditional Cost Formula", True,
                                f"Traditional cost ${traditional_total:,.2f} matches expected ${expected_traditional_total:,.2f}")
                else:
                    self.log_test("Algorithm - Traditional Cost Formula", False,
                                f"Traditional cost ${traditional_total:,.2f} doesn't match expected ${expected_traditional_total:,.2f}")
                
                # Test 2: AI cost formula verification (should be $200/agent)
                expected_ai_total = 25 * 200  # 25 agents * $200
                
                if abs(ai_total - expected_ai_total) <= 100:  # $100 tolerance
                    self.log_test("Algorithm - AI Cost Formula", True,
                                f"AI cost ${ai_total:,.2f} matches expected ${expected_ai_total:,.2f}")
                else:
                    self.log_test("Algorithm - AI Cost Formula", False,
                                f"AI cost ${ai_total:,.2f} doesn't match expected ${expected_ai_total:,.2f}")
                
                # Test 3: Monthly savings calculation
                expected_savings = traditional_total - ai_total
                
                if abs(monthly_savings - expected_savings) <= 10:  # $10 tolerance
                    self.log_test("Algorithm - Savings Calculation", True,
                                f"Savings ${monthly_savings:,.2f} matches expected ${expected_savings:,.2f}")
                else:
                    self.log_test("Algorithm - Savings Calculation", False,
                                f"Savings ${monthly_savings:,.2f} doesn't match expected ${expected_savings:,.2f}")
                
                # Test 4: Cost reduction percentage
                expected_cost_reduction = (expected_savings / traditional_total) * 100 if traditional_total > 0 else 0
                
                if abs(cost_reduction - expected_cost_reduction) <= 1:  # 1% tolerance
                    self.log_test("Algorithm - Cost Reduction Percentage", True,
                                f"Cost reduction {cost_reduction:.1f}% matches expected {expected_cost_reduction:.1f}%")
                else:
                    self.log_test("Algorithm - Cost Reduction Percentage", False,
                                f"Cost reduction {cost_reduction:.1f}% doesn't match expected {expected_cost_reduction:.1f}%")
                
                # Test 5: Per-call costs
                expected_traditional_per_call = traditional_total / 8000
                expected_ai_per_call = ai_total / 8000
                
                if abs(traditional_per_call - expected_traditional_per_call) <= 0.01:
                    self.log_test("Algorithm - Traditional Per-Call Cost", True,
                                f"Traditional per-call ${traditional_per_call:.3f} matches expected ${expected_traditional_per_call:.3f}")
                else:
                    self.log_test("Algorithm - Traditional Per-Call Cost", False,
                                f"Traditional per-call ${traditional_per_call:.3f} doesn't match expected ${expected_traditional_per_call:.3f}")
                
                if abs(ai_per_call - expected_ai_per_call) <= 0.01:
                    self.log_test("Algorithm - AI Per-Call Cost", True,
                                f"AI per-call ${ai_per_call:.3f} matches expected ${expected_ai_per_call:.3f}")
                else:
                    self.log_test("Algorithm - AI Per-Call Cost", False,
                                f"AI per-call ${ai_per_call:.3f} doesn't match expected ${expected_ai_per_call:.3f}")
                
            else:
                self.log_test("Algorithm - API Response", False,
                            f"API returned status {response.status_code}")
                
        except Exception as e:
            self.log_test("Algorithm - Exception", False, f"Exception: {str(e)}")
    
    def test_validation_requirements(self):
        """Test specific validation requirements from the review"""
        print("\n=== Testing Validation Requirements ===")
        
        # Test 1: Bangladesh baseline at $300/agent should work
        bangladesh_validation_data = {
            "agent_count": 10,
            "average_handle_time": 300,
            "monthly_call_volume": 5000,
            "cost_per_agent": 300,
            "country": "Bangladesh"
        }
        
        try:
            print(f"📊 Testing Bangladesh $300 baseline validation...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=bangladesh_validation_data, timeout=30)
            
            if response.status_code == 200:
                self.log_test("Validation - Bangladesh $300 Baseline", True,
                            "Bangladesh $300 baseline is accepted by validation")
            elif response.status_code == 422:
                error_detail = response.json().get("detail", "Unknown validation error")
                self.log_test("Validation - Bangladesh $300 Baseline", False,
                            f"Bangladesh $300 baseline rejected: {error_detail}")
            else:
                self.log_test("Validation - Bangladesh $300 Baseline", False,
                            f"Unexpected status {response.status_code}")
                
        except Exception as e:
            self.log_test("Validation - Bangladesh Exception", False, f"Exception: {str(e)}")
        
        # Test 2: AI cost should be $200/agent with 30% profit margin
        test_data = {
            "agent_count": 20,
            "average_handle_time": 300,
            "monthly_call_volume": 6000,
            "cost_per_agent": 500,
            "country": "India"
        }
        
        try:
            print(f"📊 Testing AI cost $200/agent validation...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                ai_total = result.get("ai_total_cost", 0)
                expected_ai_total = 20 * 200  # 20 agents * $200
                
                if abs(ai_total - expected_ai_total) <= 50:  # $50 tolerance
                    self.log_test("Validation - AI Cost $200/Agent", True,
                                f"AI cost ${ai_total:,.2f} matches expected $200/agent (${expected_ai_total:,.2f})")
                else:
                    self.log_test("Validation - AI Cost $200/Agent", False,
                                f"AI cost ${ai_total:,.2f} doesn't match $200/agent (expected ${expected_ai_total:,.2f})")
            else:
                self.log_test("Validation - AI Cost API", False,
                            f"API returned status {response.status_code}")
                
        except Exception as e:
            self.log_test("Validation - AI Cost Exception", False, f"Exception: {str(e)}")
        
        # Test 3: Cost reduction should be in 30-70% range for realistic scenarios
        realistic_scenarios = [
            {"country": "Bangladesh", "cost_per_agent": 300, "agents": 30},
            {"country": "India", "cost_per_agent": 500, "agents": 40},
            {"country": "Philippines", "cost_per_agent": 600, "agents": 50},
            {"country": "Vietnam", "cost_per_agent": 550, "agents": 35}
        ]
        
        in_range_count = 0
        total_scenarios = len(realistic_scenarios)
        
        for scenario in realistic_scenarios:
            test_data = {
                "agent_count": scenario["agents"],
                "average_handle_time": 300,
                "monthly_call_volume": scenario["agents"] * 200,  # 200 calls per agent
                "cost_per_agent": scenario["cost_per_agent"],
                "country": scenario["country"]
            }
            
            try:
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    cost_reduction = result.get("cost_reduction_percentage", 0)
                    
                    print(f"   {scenario['country']}: {cost_reduction:.1f}% cost reduction")
                    
                    if 30 <= cost_reduction <= 70:
                        in_range_count += 1
                        
            except Exception as e:
                print(f"   {scenario['country']}: Exception - {str(e)}")
        
        if in_range_count >= total_scenarios * 0.75:  # At least 75% should be in range
            self.log_test("Validation - Cost Reduction Range", True,
                        f"{in_range_count}/{total_scenarios} scenarios in 30-70% range")
        else:
            self.log_test("Validation - Cost Reduction Range", False,
                        f"Only {in_range_count}/{total_scenarios} scenarios in 30-70% range")
    
    def generate_validation_report(self):
        """Generate comprehensive validation report"""
        print("\n" + "=" * 80)
        print("📊 ROI CALCULATOR FINAL VALIDATION REPORT")
        print("=" * 80)
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📈 Overall Validation Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📊 Success Rate: {success_rate:.1f}%")
        
        # Validation criteria assessment
        print(f"\n🎯 Validation Criteria Assessment:")
        
        # Check specific requirements
        bangladesh_tests = [t for t in self.test_results if "Bangladesh" in t["test"]]
        bangladesh_passed = [t for t in bangladesh_tests if t["passed"]]
        
        total_calls_tests = [t for t in self.test_results if "Total Calls" in t["test"]]
        total_calls_passed = [t for t in total_calls_tests if t["passed"]]
        
        multi_country_tests = [t for t in self.test_results if "Multi-Country" in t["test"]]
        multi_country_passed = [t for t in multi_country_tests if t["passed"]]
        
        algorithm_tests = [t for t in self.test_results if "Algorithm" in t["test"]]
        algorithm_passed = [t for t in algorithm_tests if t["passed"]]
        
        validation_tests = [t for t in self.test_results if "Validation" in t["test"]]
        validation_passed = [t for t in validation_tests if t["passed"]]
        
        print(f"   Bangladesh Scenario: {len(bangladesh_passed)}/{len(bangladesh_tests)} tests passed")
        print(f"   Total Calls Mode: {len(total_calls_passed)}/{len(total_calls_tests)} tests passed")
        print(f"   Multi-Country Comparison: {len(multi_country_passed)}/{len(multi_country_tests)} tests passed")
        print(f"   Algorithm Accuracy: {len(algorithm_passed)}/{len(algorithm_tests)} tests passed")
        print(f"   Validation Requirements: {len(validation_passed)}/{len(validation_tests)} tests passed")
        
        # Final assessment
        print(f"\n🏆 FINAL VALIDATION ASSESSMENT:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - ROI Calculator meets all validation requirements")
            validation_status = "READY FOR PRODUCTION"
        elif success_rate >= 75:
            print(f"   ✅ GOOD - ROI Calculator meets most validation requirements")
            validation_status = "READY WITH MINOR FIXES"
        elif success_rate >= 60:
            print(f"   ⚠️ FAIR - ROI Calculator needs improvements")
            validation_status = "NEEDS IMPROVEMENTS"
        else:
            print(f"   ❌ POOR - ROI Calculator has significant issues")
            validation_status = "MAJOR ISSUES FOUND"
        
        print(f"   Status: {validation_status}")
        
        # Failed tests summary
        if failed_tests > 0:
            print(f"\n❌ Failed Tests Summary:")
            for test in self.test_results:
                if not test["passed"]:
                    print(f"   • {test['test']}: {test['details']}")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if len(bangladesh_passed) < len(bangladesh_tests):
            print(f"   • Fix Bangladesh scenario issues (cost baseline and reduction range)")
        
        if len(algorithm_passed) < len(algorithm_tests):
            print(f"   • Verify algorithm formulas match specifications")
        
        if len(validation_passed) < len(validation_tests):
            print(f"   • Update validation rules to allow Bangladesh $300 baseline")
            print(f"   • Ensure AI cost is exactly $200/agent with 30% profit margin")
        
        if success_rate < 90:
            print(f"   • Calibrate algorithm to produce realistic 30-70% cost reduction")
            print(f"   • Implement country-specific cost baselines correctly")
        
        return success_rate >= 75
    
    def run_comprehensive_validation(self):
        """Run all comprehensive validation tests"""
        print("🚀 Starting ROI Calculator Final Validation Testing")
        print("=" * 80)
        print("Testing redesigned ROI Calculator with updated cost baselines and 30% profit margin:")
        print("• Bangladesh Scenario: 50 agents, 5 min AHT → 30-70% cost reduction")
        print("• Total Calls Mode: 1000 and 50,000 calls verification")
        print("• Multi-Country Comparison: Bangladesh vs Philippines baselines")
        print("• Algorithm Accuracy: Formula verification and mathematical accuracy")
        print("• Validation Requirements: $300 Bangladesh baseline, $200/agent AI cost")
        print("=" * 80)
        
        # Execute all validation tests
        try:
            self.test_bangladesh_scenario()
            self.test_total_calls_mode()
            self.test_multi_country_comparison()
            self.test_algorithm_accuracy()
            self.test_validation_requirements()
            
        except Exception as e:
            print(f"❌ Critical error during validation testing: {str(e)}")
            self.log_test("Validation Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        validation_passed = self.generate_validation_report()
        
        return validation_passed


def main():
    """Main function to run ROI Calculator validation tests"""
    tester = ROICalculatorValidationTester()
    
    print("🎯 ROI CALCULATOR FINAL VALIDATION TESTING")
    print("Testing updated cost baselines and 30% profit margin implementation")
    print("=" * 80)
    
    # Run comprehensive validation
    validation_passed = tester.run_comprehensive_validation()
    
    if validation_passed:
        print("\n🎉 ROI CALCULATOR VALIDATION COMPLETED SUCCESSFULLY!")
        print("The redesigned ROI Calculator meets the validation requirements.")
    else:
        print("\n⚠️ ROI CALCULATOR VALIDATION FOUND ISSUES!")
        print("The ROI Calculator needs fixes before production deployment.")
    
    return validation_passed


if __name__ == "__main__":
    main()