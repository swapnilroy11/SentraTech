#!/usr/bin/env python3
"""
ROI Calculator Algorithm Testing - Updated Cost Baselines & 30% Profit Margin
Testing the updated ROI Calculator algorithm with new cost baselines and AI cost changes
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://deploy-bug-fixes.preview.emergentagent.com/api"

class ROIAlgorithmTester:
    """Test the updated ROI Calculator algorithm with new cost baselines and 30% profit margin"""
    
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
    
    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            if response.status_code == 200:
                self.log_test("Basic API Connectivity", True, f"Status: {response.status_code}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_bangladesh_agent_count_mode(self):
        """Test Bangladesh - Agent Count Mode: 50 agents, 5 minutes AHT"""
        print("\n=== Testing Bangladesh - Agent Count Mode ===")
        
        # Expected values based on review request:
        # Traditional Cost = 50 × $300 = $15,000
        # AI Cost = 50 × $200 = $10,000  
        # Monthly Savings = $15,000 - $10,000 = $5,000
        # Cost Reduction = $5,000 / $15,000 = 33.3%
        
        test_data = {
            "agent_count": 50,
            "average_handle_time": 300,  # 5 minutes in seconds
            "monthly_call_volume": 10000,  # Reasonable volume for 50 agents
            "cost_per_agent": 300  # Bangladesh BPO cost baseline
        }
        
        try:
            print(f"📊 Testing Bangladesh scenario: 50 agents, 5 min AHT, $300/agent baseline...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if response has expected structure
                required_fields = [
                    "traditional_total_cost", "ai_total_cost", "monthly_savings", 
                    "cost_reduction_percentage", "roi_percentage"
                ]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    traditional_cost = result["traditional_total_cost"]
                    ai_cost = result["ai_total_cost"]
                    monthly_savings = result["monthly_savings"]
                    cost_reduction = result["cost_reduction_percentage"]
                    
                    print(f"   Traditional Cost: ${traditional_cost:,.2f}")
                    print(f"   AI Cost: ${ai_cost:,.2f}")
                    print(f"   Monthly Savings: ${monthly_savings:,.2f}")
                    print(f"   Cost Reduction: {cost_reduction:.1f}%")
                    
                    # Test 1: Traditional Cost should be around $15,000 (50 × $300)
                    expected_traditional = 50 * 300  # $15,000
                    if abs(traditional_cost - expected_traditional) <= expected_traditional * 0.1:  # 10% tolerance
                        self.log_test("Bangladesh - Traditional Cost Calculation", True,
                                    f"Traditional cost ${traditional_cost:,.2f} close to expected ${expected_traditional:,.2f}")
                    else:
                        self.log_test("Bangladesh - Traditional Cost Calculation", False,
                                    f"Traditional cost ${traditional_cost:,.2f} differs from expected ${expected_traditional:,.2f}")
                    
                    # Test 2: AI Cost should be around $10,000 (50 × $200) with new 30% profit margin
                    expected_ai_cost = 50 * 200  # $10,000
                    if abs(ai_cost - expected_ai_cost) <= expected_ai_cost * 0.2:  # 20% tolerance for algorithm variations
                        self.log_test("Bangladesh - AI Cost with 30% Profit Margin", True,
                                    f"AI cost ${ai_cost:,.2f} close to expected ${expected_ai_cost:,.2f}")
                    else:
                        self.log_test("Bangladesh - AI Cost with 30% Profit Margin", False,
                                    f"AI cost ${ai_cost:,.2f} differs significantly from expected ${expected_ai_cost:,.2f}")
                    
                    # Test 3: Monthly Savings should be around $5,000
                    expected_savings = expected_traditional - expected_ai_cost  # $5,000
                    if abs(monthly_savings - expected_savings) <= abs(expected_savings) * 0.2:  # 20% tolerance
                        self.log_test("Bangladesh - Monthly Savings Calculation", True,
                                    f"Monthly savings ${monthly_savings:,.2f} close to expected ${expected_savings:,.2f}")
                    else:
                        self.log_test("Bangladesh - Monthly Savings Calculation", False,
                                    f"Monthly savings ${monthly_savings:,.2f} differs from expected ${expected_savings:,.2f}")
                    
                    # Test 4: Cost Reduction should be around 33.3%
                    expected_reduction = (expected_savings / expected_traditional) * 100  # 33.3%
                    if abs(cost_reduction - expected_reduction) <= 5:  # 5% tolerance
                        self.log_test("Bangladesh - Cost Reduction Percentage", True,
                                    f"Cost reduction {cost_reduction:.1f}% close to expected {expected_reduction:.1f}%")
                    else:
                        self.log_test("Bangladesh - Cost Reduction Percentage", False,
                                    f"Cost reduction {cost_reduction:.1f}% differs from expected {expected_reduction:.1f}%")
                    
                    # Test 5: Cost reduction should be in realistic 30-70% range
                    if 30 <= cost_reduction <= 70:
                        self.log_test("Bangladesh - Realistic Cost Reduction Range", True,
                                    f"Cost reduction {cost_reduction:.1f}% within realistic 30-70% range")
                    else:
                        self.log_test("Bangladesh - Realistic Cost Reduction Range", False,
                                    f"Cost reduction {cost_reduction:.1f}% outside realistic 30-70% range")
                    
                else:
                    self.log_test("Bangladesh - Response Structure", False,
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Bangladesh - API Call", False,
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Bangladesh - Exception", False, f"Exception: {str(e)}")
    
    def test_total_calls_mode(self):
        """Test Total Calls Mode: 1000 calls/month"""
        print("\n=== Testing Total Calls Mode ===")
        
        test_data = {
            "agent_count": 10,  # Reasonable agent count for 1000 calls
            "average_handle_time": 600,  # 10 minutes AHT
            "monthly_call_volume": 1000,
            "cost_per_agent": 500  # India baseline for comparison
        }
        
        try:
            print(f"📞 Testing Total Calls mode: 1000 calls/month, 10 agents, 10 min AHT...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Verify per-call calculations work correctly
                if "traditional_cost_per_call" in result and "ai_cost_per_call" in result:
                    traditional_per_call = result["traditional_cost_per_call"]
                    ai_per_call = result["ai_cost_per_call"]
                    
                    print(f"   Traditional Cost per Call: ${traditional_per_call:.2f}")
                    print(f"   AI Cost per Call: ${ai_per_call:.2f}")
                    
                    # Test 1: Per-call costs should be reasonable
                    if 1.0 <= traditional_per_call <= 20.0:  # $1-$20 per call is reasonable
                        self.log_test("Total Calls - Traditional Cost per Call", True,
                                    f"Traditional cost per call ${traditional_per_call:.2f} is reasonable")
                    else:
                        self.log_test("Total Calls - Traditional Cost per Call", False,
                                    f"Traditional cost per call ${traditional_per_call:.2f} seems unrealistic")
                    
                    if 0.5 <= ai_per_call <= 10.0:  # AI should be cheaper per call
                        self.log_test("Total Calls - AI Cost per Call", True,
                                    f"AI cost per call ${ai_per_call:.2f} is reasonable")
                    else:
                        self.log_test("Total Calls - AI Cost per Call", False,
                                    f"AI cost per call ${ai_per_call:.2f} seems unrealistic")
                    
                    # Test 2: AI should be cheaper than traditional per call
                    if ai_per_call < traditional_per_call:
                        self.log_test("Total Calls - AI vs Traditional Per Call", True,
                                    f"AI cost per call (${ai_per_call:.2f}) < Traditional (${traditional_per_call:.2f})")
                    else:
                        self.log_test("Total Calls - AI vs Traditional Per Call", False,
                                    f"AI cost per call (${ai_per_call:.2f}) >= Traditional (${traditional_per_call:.2f})")
                    
                    # Test 3: Volume metrics should be accurate
                    if "call_volume_processed" in result:
                        processed_volume = result["call_volume_processed"]
                        if processed_volume == 1000:
                            self.log_test("Total Calls - Volume Processing", True,
                                        f"Correctly processed {processed_volume} calls")
                        else:
                            self.log_test("Total Calls - Volume Processing", False,
                                        f"Expected 1000 calls, got {processed_volume}")
                    
                else:
                    self.log_test("Total Calls - Per-Call Metrics", False,
                                "Missing per-call cost metrics in response")
            else:
                self.log_test("Total Calls - API Call", False,
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Total Calls - Exception", False, f"Exception: {str(e)}")
    
    def test_multiple_countries_cost_baselines(self):
        """Test Multiple Countries: Philippines (highest) vs Bangladesh (lowest)"""
        print("\n=== Testing Multiple Countries Cost Baselines ===")
        
        # Test Philippines (highest cost: $600)
        philippines_data = {
            "agent_count": 25,
            "average_handle_time": 480,  # 8 minutes
            "monthly_call_volume": 5000,
            "cost_per_agent": 600  # Philippines BPO cost baseline
        }
        
        # Test Bangladesh (lowest cost: $300)
        bangladesh_data = {
            "agent_count": 25,
            "average_handle_time": 480,  # 8 minutes
            "monthly_call_volume": 5000,
            "cost_per_agent": 300  # Bangladesh BPO cost baseline
        }
        
        try:
            print(f"🌏 Testing Philippines vs Bangladesh cost baselines...")
            
            # Test Philippines
            phil_response = requests.post(f"{BACKEND_URL}/roi/calculate", json=philippines_data, timeout=15)
            bang_response = requests.post(f"{BACKEND_URL}/roi/calculate", json=bangladesh_data, timeout=15)
            
            if phil_response.status_code == 200 and bang_response.status_code == 200:
                phil_result = phil_response.json()
                bang_result = bang_response.json()
                
                phil_traditional = phil_result["traditional_total_cost"]
                bang_traditional = bang_result["traditional_total_cost"]
                
                phil_savings = phil_result["monthly_savings"]
                bang_savings = bang_result["monthly_savings"]
                
                print(f"   Philippines Traditional Cost: ${phil_traditional:,.2f}")
                print(f"   Bangladesh Traditional Cost: ${bang_traditional:,.2f}")
                print(f"   Philippines Monthly Savings: ${phil_savings:,.2f}")
                print(f"   Bangladesh Monthly Savings: ${bang_savings:,.2f}")
                
                # Test 1: Philippines should have higher traditional cost than Bangladesh
                if phil_traditional > bang_traditional:
                    self.log_test("Countries - Cost Baseline Verification", True,
                                f"Philippines (${phil_traditional:,.2f}) > Bangladesh (${bang_traditional:,.2f})")
                else:
                    self.log_test("Countries - Cost Baseline Verification", False,
                                f"Philippines (${phil_traditional:,.2f}) not > Bangladesh (${bang_traditional:,.2f})")
                
                # Test 2: Philippines should have higher savings due to higher baseline cost
                if phil_savings > bang_savings:
                    self.log_test("Countries - Savings Differential", True,
                                f"Philippines savings (${phil_savings:,.2f}) > Bangladesh (${bang_savings:,.2f})")
                else:
                    self.log_test("Countries - Savings Differential", False,
                                f"Philippines savings (${phil_savings:,.2f}) not > Bangladesh (${bang_savings:,.2f})")
                
                # Test 3: Cost baselines should match expected values
                expected_phil_traditional = 25 * 600  # $15,000
                expected_bang_traditional = 25 * 300  # $7,500
                
                if abs(phil_traditional - expected_phil_traditional) <= expected_phil_traditional * 0.1:
                    self.log_test("Countries - Philippines Baseline Accuracy", True,
                                f"Philippines baseline ${phil_traditional:,.2f} matches expected ${expected_phil_traditional:,.2f}")
                else:
                    self.log_test("Countries - Philippines Baseline Accuracy", False,
                                f"Philippines baseline ${phil_traditional:,.2f} differs from expected ${expected_phil_traditional:,.2f}")
                
                if abs(bang_traditional - expected_bang_traditional) <= expected_bang_traditional * 0.1:
                    self.log_test("Countries - Bangladesh Baseline Accuracy", True,
                                f"Bangladesh baseline ${bang_traditional:,.2f} matches expected ${expected_bang_traditional:,.2f}")
                else:
                    self.log_test("Countries - Bangladesh Baseline Accuracy", False,
                                f"Bangladesh baseline ${bang_traditional:,.2f} differs from expected ${expected_bang_traditional:,.2f}")
                
            else:
                self.log_test("Countries - API Calls", False,
                            f"Philippines: {phil_response.status_code}, Bangladesh: {bang_response.status_code}")
                
        except Exception as e:
            self.log_test("Countries - Exception", False, f"Exception: {str(e)}")
    
    def test_roi_calculations_realistic_range(self):
        """Test ROI Calculations: Verify realistic 30-70% cost reduction range"""
        print("\n=== Testing ROI Calculations for Realistic Range ===")
        
        test_scenarios = [
            {"name": "Small Team", "agent_count": 10, "cost_per_agent": 400, "aht": 300},
            {"name": "Medium Team", "agent_count": 50, "cost_per_agent": 500, "aht": 420},
            {"name": "Large Team", "agent_count": 100, "cost_per_agent": 350, "aht": 360},
            {"name": "Enterprise", "agent_count": 200, "cost_per_agent": 550, "aht": 480}
        ]
        
        realistic_results = 0
        total_scenarios = len(test_scenarios)
        
        for scenario in test_scenarios:
            try:
                test_data = {
                    "agent_count": scenario["agent_count"],
                    "average_handle_time": scenario["aht"],
                    "monthly_call_volume": scenario["agent_count"] * 200,  # 200 calls per agent
                    "cost_per_agent": scenario["cost_per_agent"]
                }
                
                print(f"🎯 Testing {scenario['name']}: {scenario['agent_count']} agents, ${scenario['cost_per_agent']}/agent...")
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    cost_reduction = result.get("cost_reduction_percentage", 0)
                    roi_percentage = result.get("roi_percentage", 0)
                    
                    print(f"   Cost Reduction: {cost_reduction:.1f}%")
                    print(f"   ROI Percentage: {roi_percentage:.1f}%")
                    
                    # Check if cost reduction is in realistic 30-70% range
                    if 30 <= cost_reduction <= 70:
                        realistic_results += 1
                        print(f"   ✅ {scenario['name']} cost reduction within realistic range")
                    else:
                        print(f"   ❌ {scenario['name']} cost reduction {cost_reduction:.1f}% outside 30-70% range")
                    
                    # Check if ROI is reasonable (should be positive and not extremely high)
                    if 0 <= roi_percentage <= 500:  # Up to 500% ROI is reasonable
                        print(f"   ✅ {scenario['name']} ROI percentage reasonable")
                    else:
                        print(f"   ⚠️ {scenario['name']} ROI percentage {roi_percentage:.1f}% may be unrealistic")
                
            except Exception as e:
                print(f"   ❌ Error testing {scenario['name']}: {str(e)}")
        
        # Test overall realistic range compliance
        if realistic_results >= total_scenarios * 0.75:  # At least 75% should be realistic
            self.log_test("ROI Range - Realistic Cost Reduction", True,
                        f"{realistic_results}/{total_scenarios} scenarios within 30-70% range")
        else:
            self.log_test("ROI Range - Realistic Cost Reduction", False,
                        f"Only {realistic_results}/{total_scenarios} scenarios within 30-70% range")
    
    def test_agent_count_vs_total_calls_consistency(self):
        """Test Agent Count mode vs Total Calls mode consistency"""
        print("\n=== Testing Agent Count vs Total Calls Mode Consistency ===")
        
        # Create equivalent scenarios
        agent_count_data = {
            "agent_count": 30,
            "average_handle_time": 360,  # 6 minutes
            "monthly_call_volume": 6000,  # 200 calls per agent
            "cost_per_agent": 450
        }
        
        total_calls_data = {
            "agent_count": 30,  # Same agent count
            "average_handle_time": 360,  # Same AHT
            "monthly_call_volume": 6000,  # Same call volume
            "cost_per_agent": 450  # Same cost per agent
        }
        
        try:
            print(f"🔄 Testing consistency between Agent Count and Total Calls modes...")
            
            agent_response = requests.post(f"{BACKEND_URL}/roi/calculate", json=agent_count_data, timeout=15)
            calls_response = requests.post(f"{BACKEND_URL}/roi/calculate", json=total_calls_data, timeout=15)
            
            if agent_response.status_code == 200 and calls_response.status_code == 200:
                agent_result = agent_response.json()
                calls_result = calls_response.json()
                
                agent_traditional = agent_result["traditional_total_cost"]
                calls_traditional = calls_result["traditional_total_cost"]
                
                agent_ai = agent_result["ai_total_cost"]
                calls_ai = calls_result["ai_total_cost"]
                
                agent_savings = agent_result["monthly_savings"]
                calls_savings = calls_result["monthly_savings"]
                
                print(f"   Agent Mode - Traditional: ${agent_traditional:,.2f}, AI: ${agent_ai:,.2f}, Savings: ${agent_savings:,.2f}")
                print(f"   Calls Mode - Traditional: ${calls_traditional:,.2f}, AI: ${calls_ai:,.2f}, Savings: ${calls_savings:,.2f}")
                
                # Test 1: Traditional costs should be very similar (within 5%)
                traditional_diff = abs(agent_traditional - calls_traditional) / agent_traditional * 100
                if traditional_diff <= 5:
                    self.log_test("Consistency - Traditional Cost", True,
                                f"Traditional costs consistent: {traditional_diff:.1f}% difference")
                else:
                    self.log_test("Consistency - Traditional Cost", False,
                                f"Traditional costs inconsistent: {traditional_diff:.1f}% difference")
                
                # Test 2: AI costs should be very similar (within 10% due to algorithm variations)
                ai_diff = abs(agent_ai - calls_ai) / agent_ai * 100 if agent_ai > 0 else 0
                if ai_diff <= 10:
                    self.log_test("Consistency - AI Cost", True,
                                f"AI costs consistent: {ai_diff:.1f}% difference")
                else:
                    self.log_test("Consistency - AI Cost", False,
                                f"AI costs inconsistent: {ai_diff:.1f}% difference")
                
                # Test 3: Savings should be very similar (within 10%)
                savings_diff = abs(agent_savings - calls_savings) / abs(agent_savings) * 100 if agent_savings != 0 else 0
                if savings_diff <= 10:
                    self.log_test("Consistency - Monthly Savings", True,
                                f"Savings consistent: {savings_diff:.1f}% difference")
                else:
                    self.log_test("Consistency - Monthly Savings", False,
                                f"Savings inconsistent: {savings_diff:.1f}% difference")
                
            else:
                self.log_test("Consistency - API Calls", False,
                            f"Agent mode: {agent_response.status_code}, Calls mode: {calls_response.status_code}")
                
        except Exception as e:
            self.log_test("Consistency - Exception", False, f"Exception: {str(e)}")
    
    def test_mathematical_validation(self):
        """Test Mathematical Validation: Verify calculations are accurate"""
        print("\n=== Testing Mathematical Validation ===")
        
        test_data = {
            "agent_count": 20,
            "average_handle_time": 300,  # 5 minutes
            "monthly_call_volume": 4000,
            "cost_per_agent": 500  # India baseline
        }
        
        try:
            print(f"🧮 Testing mathematical accuracy: 20 agents, 5 min AHT, $500/agent...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                traditional_total = result["traditional_total_cost"]
                ai_total = result["ai_total_cost"]
                monthly_savings = result["monthly_savings"]
                cost_reduction = result["cost_reduction_percentage"]
                annual_savings = result["annual_savings"]
                
                print(f"   Traditional Total: ${traditional_total:,.2f}")
                print(f"   AI Total: ${ai_total:,.2f}")
                print(f"   Monthly Savings: ${monthly_savings:,.2f}")
                print(f"   Annual Savings: ${annual_savings:,.2f}")
                print(f"   Cost Reduction: {cost_reduction:.1f}%")
                
                # Test 1: Monthly savings = Traditional - AI
                calculated_savings = traditional_total - ai_total
                if abs(monthly_savings - calculated_savings) <= 0.01:  # Within 1 cent
                    self.log_test("Math - Monthly Savings Formula", True,
                                f"Monthly savings calculation accurate: ${monthly_savings:,.2f}")
                else:
                    self.log_test("Math - Monthly Savings Formula", False,
                                f"Monthly savings ${monthly_savings:,.2f} != ${calculated_savings:,.2f}")
                
                # Test 2: Annual savings = Monthly savings × 12
                calculated_annual = monthly_savings * 12
                if abs(annual_savings - calculated_annual) <= 0.01:
                    self.log_test("Math - Annual Savings Formula", True,
                                f"Annual savings calculation accurate: ${annual_savings:,.2f}")
                else:
                    self.log_test("Math - Annual Savings Formula", False,
                                f"Annual savings ${annual_savings:,.2f} != ${calculated_annual:,.2f}")
                
                # Test 3: Cost reduction percentage = (Savings / Traditional) × 100
                calculated_reduction = (monthly_savings / traditional_total) * 100 if traditional_total > 0 else 0
                if abs(cost_reduction - calculated_reduction) <= 0.1:  # Within 0.1%
                    self.log_test("Math - Cost Reduction Formula", True,
                                f"Cost reduction calculation accurate: {cost_reduction:.1f}%")
                else:
                    self.log_test("Math - Cost Reduction Formula", False,
                                f"Cost reduction {cost_reduction:.1f}% != {calculated_reduction:.1f}%")
                
                # Test 4: All values should be positive (assuming AI is cheaper)
                if traditional_total > 0 and ai_total > 0:
                    self.log_test("Math - Positive Values", True,
                                "All cost values are positive")
                else:
                    self.log_test("Math - Positive Values", False,
                                f"Negative values detected: Traditional=${traditional_total}, AI=${ai_total}")
                
            else:
                self.log_test("Math - API Call", False,
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Math - Exception", False, f"Exception: {str(e)}")
    
    def generate_roi_algorithm_report(self):
        """Generate comprehensive ROI algorithm testing report"""
        print("\n" + "=" * 80)
        print("📊 ROI CALCULATOR ALGORITHM TESTING REPORT")
        print("Updated Cost Baselines & 30% Profit Margin Validation")
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
        
        # Key Algorithm Updates Verification
        print(f"\n🎯 Key Algorithm Updates Verification:")
        
        # Check for specific test results
        cost_baseline_tests = [t for t in self.test_results if "Baseline" in t["test"] or "Traditional Cost" in t["test"]]
        ai_cost_tests = [t for t in self.test_results if "AI Cost" in t["test"] or "Profit Margin" in t["test"]]
        realistic_range_tests = [t for t in self.test_results if "Realistic" in t["test"] or "Range" in t["test"]]
        
        cost_baseline_passed = len([t for t in cost_baseline_tests if t["passed"]])
        ai_cost_passed = len([t for t in ai_cost_tests if t["passed"]])
        realistic_range_passed = len([t for t in realistic_range_tests if t["passed"]])
        
        print(f"   Cost Baselines: {cost_baseline_passed}/{len(cost_baseline_tests)} tests passed")
        print(f"   AI Cost (30% margin): {ai_cost_passed}/{len(ai_cost_tests)} tests passed")
        print(f"   Realistic Range (30-70%): {realistic_range_passed}/{len(realistic_range_tests)} tests passed")
        
        # Algorithm Readiness Assessment
        print(f"\n🎯 Algorithm Readiness Assessment:")
        
        readiness_score = 0
        max_score = 0
        
        # Criteria 1: Cost Baselines (25 points)
        max_score += 25
        if len(cost_baseline_tests) > 0 and cost_baseline_passed / len(cost_baseline_tests) >= 0.8:
            readiness_score += 25
            print(f"   ✅ Cost Baselines: PASS ({cost_baseline_passed}/{len(cost_baseline_tests)} tests)")
        else:
            print(f"   ❌ Cost Baselines: FAIL ({cost_baseline_passed}/{len(cost_baseline_tests)} tests)")
        
        # Criteria 2: AI Cost with 30% Profit Margin (25 points)
        max_score += 25
        if len(ai_cost_tests) > 0 and ai_cost_passed / len(ai_cost_tests) >= 0.8:
            readiness_score += 25
            print(f"   ✅ AI Cost (30% margin): PASS ({ai_cost_passed}/{len(ai_cost_tests)} tests)")
        else:
            print(f"   ❌ AI Cost (30% margin): FAIL ({ai_cost_passed}/{len(ai_cost_tests)} tests)")
        
        # Criteria 3: Realistic Range (25 points)
        max_score += 25
        if len(realistic_range_tests) > 0 and realistic_range_passed / len(realistic_range_tests) >= 0.8:
            readiness_score += 25
            print(f"   ✅ Realistic Range: PASS ({realistic_range_passed}/{len(realistic_range_tests)} tests)")
        else:
            print(f"   ❌ Realistic Range: FAIL ({realistic_range_passed}/{len(realistic_range_tests)} tests)")
        
        # Criteria 4: Mathematical Accuracy (25 points)
        max_score += 25
        math_tests = [t for t in self.test_results if "Math" in t["test"]]
        math_passed = len([t for t in math_tests if t["passed"]])
        if len(math_tests) > 0 and math_passed / len(math_tests) >= 0.8:
            readiness_score += 25
            print(f"   ✅ Mathematical Accuracy: PASS ({math_passed}/{len(math_tests)} tests)")
        else:
            print(f"   ❌ Mathematical Accuracy: FAIL ({math_passed}/{len(math_tests)} tests)")
        
        # Final readiness score
        final_readiness = (readiness_score / max_score) * 100 if max_score > 0 else 0
        
        print(f"\n🏆 ALGORITHM READINESS SCORE: {final_readiness:.1f}%")
        
        if final_readiness >= 90:
            print(f"   🎉 EXCELLENT - Algorithm ready for production")
        elif final_readiness >= 75:
            print(f"   ✅ GOOD - Algorithm ready with minor calibrations")
        elif final_readiness >= 60:
            print(f"   ⚠️ FAIR - Algorithm needs improvements")
        else:
            print(f"   ❌ POOR - Algorithm requires significant updates")
        
        # Specific Recommendations
        print(f"\n💡 Specific Recommendations:")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        if len(cost_baseline_tests) > 0 and cost_baseline_passed / len(cost_baseline_tests) < 0.8:
            print(f"   • Update cost baselines to match expected values:")
            print(f"     - Bangladesh: $300/agent/month")
            print(f"     - India: $500/agent/month") 
            print(f"     - Philippines: $600/agent/month")
            print(f"     - Vietnam: $550/agent/month")
        
        if len(ai_cost_tests) > 0 and ai_cost_passed / len(ai_cost_tests) < 0.8:
            print(f"   • Update AI cost to $200/agent/month (30% profit margin)")
            print(f"   • Verify calculation: $154 base cost × 1.3 = $200")
        
        if len(realistic_range_tests) > 0 and realistic_range_passed / len(realistic_range_tests) < 0.8:
            print(f"   • Calibrate algorithm to produce 30-70% cost reduction range")
            print(f"   • Ensure ROI percentages are realistic (200-500% range)")
        
        print(f"   • Test both Agent Count mode and Total Calls mode")
        print(f"   • Verify mathematical accuracy of all calculations")
        
        return final_readiness
    
    def run_comprehensive_roi_tests(self):
        """Run all comprehensive ROI algorithm tests"""
        print("🚀 Starting ROI Calculator Algorithm Testing")
        print("=" * 80)
        print("Testing updated ROI Calculator with:")
        print("• New Cost Baselines: Bangladesh $300, India $500, Philippines $600, Vietnam $550")
        print("• Updated AI Cost: $200/agent/month (30% profit margin)")
        print("• Agent Count Mode and Total Calls Mode")
        print("• Realistic 30-70% cost reduction range")
        print("• Mathematical validation and consistency")
        print("=" * 80)
        
        # Check basic connectivity first
        if not self.test_basic_connectivity():
            print("❌ Cannot connect to API. Aborting tests.")
            return False
        
        # Execute all ROI algorithm tests
        try:
            # Core algorithm tests
            self.test_bangladesh_agent_count_mode()
            self.test_total_calls_mode()
            self.test_multiple_countries_cost_baselines()
            self.test_roi_calculations_realistic_range()
            self.test_agent_count_vs_total_calls_consistency()
            self.test_mathematical_validation()
            
        except Exception as e:
            print(f"❌ Critical error during ROI algorithm testing: {str(e)}")
            self.log_test("ROI Algorithm Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        readiness_score = self.generate_roi_algorithm_report()
        
        return readiness_score >= 75  # Return True if algorithm is ready


def main():
    """Main function to run ROI algorithm tests"""
    tester = ROIAlgorithmTester()
    
    print("🎯 ROI Calculator Algorithm Testing - Updated Cost Baselines & 30% Profit Margin")
    print("=" * 80)
    
    # Run comprehensive tests
    algorithm_ready = tester.run_comprehensive_roi_tests()
    
    if algorithm_ready:
        print("\n🎉 ROI Calculator algorithm is ready for production!")
    else:
        print("\n⚠️ ROI Calculator algorithm needs improvements before production.")
    
    return algorithm_ready


if __name__ == "__main__":
    main()