#!/usr/bin/env python3
"""
Comprehensive ROI Calculator API Test Suite
Tests all calculation accuracy and edge cases as specified in the review request
"""

import requests
import json
import time
import math
from datetime import datetime
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://customer-flow-5.preview.emergentagent.com/api"

class ROICalculatorTester:
    """Comprehensive ROI Calculator API Testing Framework"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.calculation_results = {}
        
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
    
    def calculate_expected_values(self, agent_count: int, aht_minutes: int, country: str = "Bangladesh") -> Dict[str, Any]:
        """Calculate expected values using the same logic as backend"""
        
        # Country baselines
        BASE_COST = {
            'Bangladesh': 300,
            'India': 500,
            'Philippines': 600,
            'Vietnam': 550
        }
        
        # Constants from backend
        AI_COST_PER_AGENT = 200
        TECHNOLOGY_COST_PER_AGENT = 50
        INFRASTRUCTURE_COST_PER_AGENT = 30
        AUTOMATION_RATE = 0.70
        
        # Get base cost for country
        base_agent_cost = BASE_COST.get(country, BASE_COST['Bangladesh'])
        
        # Call volume calculation: workMinutesPerMonth = 8×60×22 = 10,560
        work_minutes_per_month = 8 * 60 * 22  # 10,560 minutes
        calls_per_agent = work_minutes_per_month / aht_minutes
        call_volume = math.floor(agent_count * calls_per_agent)
        
        # Traditional BPO costs
        traditional_labor_cost = agent_count * base_agent_cost
        traditional_technology_cost = agent_count * TECHNOLOGY_COST_PER_AGENT
        traditional_infrastructure_cost = agent_count * INFRASTRUCTURE_COST_PER_AGENT
        traditional_total_cost = traditional_labor_cost + traditional_technology_cost + traditional_infrastructure_cost
        
        # AI costs
        ai_total_cost = agent_count * AI_COST_PER_AGENT
        ai_platform_fee = ai_total_cost * 0.3
        ai_processing_cost = ai_total_cost * 0.5
        ai_voice_cost = ai_total_cost * 0.2
        
        # Savings and ROI
        monthly_savings = traditional_total_cost - ai_total_cost
        annual_savings = monthly_savings * 12
        cost_reduction_percentage = (monthly_savings / traditional_total_cost * 100) if traditional_total_cost > 0 else 0
        roi_percentage = (annual_savings / (ai_total_cost * 12) * 100) if ai_total_cost > 0 else 0
        payback_period_months = (ai_total_cost * 12) / monthly_savings if monthly_savings > 0 else float('inf')
        
        # Per-call metrics
        traditional_cost_per_call = traditional_total_cost / call_volume if call_volume > 0 else 0
        ai_cost_per_call = ai_total_cost / call_volume if call_volume > 0 else 0
        
        # Volume metrics
        automated_calls = int(call_volume * AUTOMATION_RATE)
        human_assisted_calls = call_volume - automated_calls
        
        return {
            "call_volume": call_volume,
            "traditional_labor_cost": traditional_labor_cost,
            "traditional_technology_cost": traditional_technology_cost,
            "traditional_infrastructure_cost": traditional_infrastructure_cost,
            "traditional_total_cost": traditional_total_cost,
            "ai_voice_cost": ai_voice_cost,
            "ai_processing_cost": ai_processing_cost,
            "ai_platform_fee": ai_platform_fee,
            "ai_total_cost": ai_total_cost,
            "monthly_savings": monthly_savings,
            "annual_savings": annual_savings,
            "cost_reduction_percentage": cost_reduction_percentage,
            "roi_percentage": roi_percentage,
            "payback_period_months": payback_period_months,
            "traditional_cost_per_call": traditional_cost_per_call,
            "ai_cost_per_call": ai_cost_per_call,
            "automated_calls": automated_calls,
            "human_assisted_calls": human_assisted_calls,
            "automation_rate": AUTOMATION_RATE * 100
        }
    
    def make_roi_request(self, agent_count: int, aht_minutes: int, country: str = "Bangladesh") -> Dict[str, Any]:
        """Make ROI calculation request to API"""
        
        # Calculate call volume for the request
        work_minutes_per_month = 8 * 60 * 22  # 10,560 minutes
        calls_per_agent = work_minutes_per_month / aht_minutes
        call_volume = math.floor(agent_count * calls_per_agent)
        
        # Country baselines for cost_per_agent
        BASE_COST = {
            'Bangladesh': 300,
            'India': 500,
            'Philippines': 600,
            'Vietnam': 550
        }
        
        cost_per_agent = BASE_COST.get(country, BASE_COST['Bangladesh'])
        
        request_data = {
            "agent_count": agent_count,
            "average_handle_time": aht_minutes * 60,  # Convert to seconds
            "monthly_call_volume": call_volume,
            "cost_per_agent": cost_per_agent,
            "country": country
        }
        
        try:
            start_time = time.time()
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=request_data, timeout=30)
            end_time = time.time()
            response_time = (end_time - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                result["_response_time"] = response_time
                result["_request_data"] = request_data
                return result
            else:
                return {
                    "error": f"HTTP {response.status_code}",
                    "response": response.text,
                    "_response_time": response_time,
                    "_request_data": request_data
                }
        except Exception as e:
            return {
                "error": str(e),
                "_response_time": 30000,  # Timeout
                "_request_data": request_data
            }
    
    def compare_values(self, expected: float, actual: float, tolerance: float = 0.01) -> bool:
        """Compare two values with tolerance"""
        if expected == 0 and actual == 0:
            return True
        if expected == 0:
            return abs(actual) <= tolerance
        return abs((actual - expected) / expected) <= tolerance
    
    def test_input_variation_agent_count(self):
        """Test Agent Count values: 1, 10 (default), 50, 100, 500 agents"""
        print("\n=== Testing Input Variation - Agent Count ===")
        
        agent_counts = [1, 10, 50, 100, 500]
        default_aht = 7  # minutes
        country = "Bangladesh"
        
        for agent_count in agent_counts:
            print(f"\n🧮 Testing Agent Count: {agent_count} agents")
            
            # Calculate expected values
            expected = self.calculate_expected_values(agent_count, default_aht, country)
            
            # Make API request
            actual = self.make_roi_request(agent_count, default_aht, country)
            
            if "error" in actual:
                self.log_test(f"Agent Count {agent_count} - API Call", False, 
                            f"API error: {actual['error']}")
                continue
            
            # Test call volume calculation
            expected_call_volume = expected["call_volume"]
            actual_call_volume = actual.get("call_volume_processed", 0)
            
            if self.compare_values(expected_call_volume, actual_call_volume, 0.001):
                self.log_test(f"Agent Count {agent_count} - Call Volume", True,
                            f"Expected: {expected_call_volume}, Actual: {actual_call_volume}")
            else:
                self.log_test(f"Agent Count {agent_count} - Call Volume", False,
                            f"Expected: {expected_call_volume}, Actual: {actual_call_volume}")
            
            # Test traditional cost scales linearly
            expected_traditional = expected["traditional_total_cost"]
            actual_traditional = actual.get("traditional_total_cost", 0)
            
            if self.compare_values(expected_traditional, actual_traditional, 0.01):
                self.log_test(f"Agent Count {agent_count} - Traditional Cost Linear Scaling", True,
                            f"Expected: ${expected_traditional:,.2f}, Actual: ${actual_traditional:,.2f}")
            else:
                self.log_test(f"Agent Count {agent_count} - Traditional Cost Linear Scaling", False,
                            f"Expected: ${expected_traditional:,.2f}, Actual: ${actual_traditional:,.2f}")
            
            # Test AI cost scales linearly
            expected_ai = expected["ai_total_cost"]
            actual_ai = actual.get("ai_total_cost", 0)
            
            if self.compare_values(expected_ai, actual_ai, 0.01):
                self.log_test(f"Agent Count {agent_count} - AI Cost Linear Scaling", True,
                            f"Expected: ${expected_ai:,.2f}, Actual: ${actual_ai:,.2f}")
            else:
                self.log_test(f"Agent Count {agent_count} - AI Cost Linear Scaling", False,
                            f"Expected: ${expected_ai:,.2f}, Actual: ${actual_ai:,.2f}")
            
            # Test monthly savings
            expected_savings = expected["monthly_savings"]
            actual_savings = actual.get("monthly_savings", 0)
            
            if self.compare_values(expected_savings, actual_savings, 0.01):
                self.log_test(f"Agent Count {agent_count} - Monthly Savings", True,
                            f"Expected: ${expected_savings:,.2f}, Actual: ${actual_savings:,.2f}")
            else:
                self.log_test(f"Agent Count {agent_count} - Monthly Savings", False,
                            f"Expected: ${expected_savings:,.2f}, Actual: ${actual_savings:,.2f}")
            
            # Test cost reduction percentage (should be in 30-70% range for realistic scenarios)
            actual_cost_reduction = actual.get("cost_reduction_percentage", 0)
            
            if 30 <= actual_cost_reduction <= 70:
                self.log_test(f"Agent Count {agent_count} - Cost Reduction Range", True,
                            f"Cost reduction: {actual_cost_reduction:.1f}% (within 30-70% range)")
            else:
                self.log_test(f"Agent Count {agent_count} - Cost Reduction Range", False,
                            f"Cost reduction: {actual_cost_reduction:.1f}% (outside 30-70% range)")
            
            # Store results for later analysis
            self.calculation_results[f"agent_{agent_count}"] = {
                "expected": expected,
                "actual": actual,
                "response_time": actual.get("_response_time", 0)
            }
    
    def test_input_variation_aht(self):
        """Test AHT values: 2, 6, 7 (default), 12, 20 minutes"""
        print("\n=== Testing Input Variation - Average Handle Time ===")
        
        aht_values = [2, 6, 7, 12, 20]  # minutes
        default_agent_count = 10
        country = "Bangladesh"
        
        for aht_minutes in aht_values:
            print(f"\n⏱️ Testing AHT: {aht_minutes} minutes")
            
            # Calculate expected values
            expected = self.calculate_expected_values(default_agent_count, aht_minutes, country)
            
            # Make API request
            actual = self.make_roi_request(default_agent_count, aht_minutes, country)
            
            if "error" in actual:
                self.log_test(f"AHT {aht_minutes}min - API Call", False, 
                            f"API error: {actual['error']}")
                continue
            
            # Test inverse relationship: higher AHT = lower call volume
            expected_call_volume = expected["call_volume"]
            actual_call_volume = actual.get("call_volume_processed", 0)
            
            if self.compare_values(expected_call_volume, actual_call_volume, 0.001):
                self.log_test(f"AHT {aht_minutes}min - Call Volume Inverse Relationship", True,
                            f"Call volume: {actual_call_volume:,} calls (AHT: {aht_minutes}min)")
            else:
                self.log_test(f"AHT {aht_minutes}min - Call Volume Inverse Relationship", False,
                            f"Expected: {expected_call_volume:,}, Actual: {actual_call_volume:,}")
            
            # Test per-call cost calculations
            expected_trad_per_call = expected["traditional_cost_per_call"]
            actual_trad_per_call = actual.get("traditional_cost_per_call", 0)
            
            if self.compare_values(expected_trad_per_call, actual_trad_per_call, 0.01):
                self.log_test(f"AHT {aht_minutes}min - Traditional Per-Call Cost", True,
                            f"Per-call cost: ${actual_trad_per_call:.3f}")
            else:
                self.log_test(f"AHT {aht_minutes}min - Traditional Per-Call Cost", False,
                            f"Expected: ${expected_trad_per_call:.3f}, Actual: ${actual_trad_per_call:.3f}")
            
            # Test AI per-call cost
            expected_ai_per_call = expected["ai_cost_per_call"]
            actual_ai_per_call = actual.get("ai_cost_per_call", 0)
            
            if self.compare_values(expected_ai_per_call, actual_ai_per_call, 0.01):
                self.log_test(f"AHT {aht_minutes}min - AI Per-Call Cost", True,
                            f"AI per-call cost: ${actual_ai_per_call:.3f}")
            else:
                self.log_test(f"AHT {aht_minutes}min - AI Per-Call Cost", False,
                            f"Expected: ${expected_ai_per_call:.3f}, Actual: ${actual_ai_per_call:.3f}")
            
            # Test cost reduction percentage remains realistic
            actual_cost_reduction = actual.get("cost_reduction_percentage", 0)
            
            if 30 <= actual_cost_reduction <= 70:
                self.log_test(f"AHT {aht_minutes}min - Cost Reduction Realistic", True,
                            f"Cost reduction: {actual_cost_reduction:.1f}% (realistic range)")
            else:
                self.log_test(f"AHT {aht_minutes}min - Cost Reduction Realistic", False,
                            f"Cost reduction: {actual_cost_reduction:.1f}% (outside realistic range)")
            
            # Store results
            self.calculation_results[f"aht_{aht_minutes}"] = {
                "expected": expected,
                "actual": actual,
                "response_time": actual.get("_response_time", 0)
            }
    
    def test_multi_country_baselines(self):
        """Test all countries: Bangladesh ($300), India ($500), Philippines ($600), Vietnam ($550)"""
        print("\n=== Testing Multi-Country Baseline Tests ===")
        
        countries = {
            "Bangladesh": 300,
            "India": 500,
            "Philippines": 600,
            "Vietnam": 550
        }
        
        default_agent_count = 10
        default_aht = 7  # minutes
        
        for country, expected_baseline in countries.items():
            print(f"\n🌍 Testing Country: {country} (${expected_baseline}/agent)")
            
            # Calculate expected values
            expected = self.calculate_expected_values(default_agent_count, default_aht, country)
            
            # Make API request
            actual = self.make_roi_request(default_agent_count, default_aht, country)
            
            if "error" in actual:
                self.log_test(f"{country} - API Call", False, 
                            f"API error: {actual['error']}")
                continue
            
            # Test traditional costs reflect country baselines correctly
            expected_traditional = expected["traditional_total_cost"]
            actual_traditional = actual.get("traditional_total_cost", 0)
            
            if self.compare_values(expected_traditional, actual_traditional, 0.01):
                self.log_test(f"{country} - Country Baseline Cost", True,
                            f"Traditional cost: ${actual_traditional:,.2f} (baseline: ${expected_baseline}/agent)")
            else:
                self.log_test(f"{country} - Country Baseline Cost", False,
                            f"Expected: ${expected_traditional:,.2f}, Actual: ${actual_traditional:,.2f}")
            
            # Test AI costs remain constant at $200/agent across all countries
            expected_ai = 10 * 200  # 10 agents * $200
            actual_ai = actual.get("ai_total_cost", 0)
            
            if self.compare_values(expected_ai, actual_ai, 0.01):
                self.log_test(f"{country} - AI Cost Constant", True,
                            f"AI cost: ${actual_ai:,.2f} (constant $200/agent)")
            else:
                self.log_test(f"{country} - AI Cost Constant", False,
                            f"Expected: ${expected_ai:,.2f}, Actual: ${actual_ai:,.2f}")
            
            # Test cost reduction percentages vary appropriately by country
            actual_cost_reduction = actual.get("cost_reduction_percentage", 0)
            
            # Higher baseline countries should have higher cost reduction
            if country in ["Philippines", "Vietnam", "India"]:
                if actual_cost_reduction >= 40:
                    self.log_test(f"{country} - Cost Reduction Variation", True,
                                f"Cost reduction: {actual_cost_reduction:.1f}% (appropriate for higher baseline)")
                else:
                    self.log_test(f"{country} - Cost Reduction Variation", False,
                                f"Cost reduction: {actual_cost_reduction:.1f}% (too low for higher baseline)")
            else:  # Bangladesh
                if 30 <= actual_cost_reduction <= 60:
                    self.log_test(f"{country} - Cost Reduction Variation", True,
                                f"Cost reduction: {actual_cost_reduction:.1f}% (appropriate for lower baseline)")
                else:
                    self.log_test(f"{country} - Cost Reduction Variation", False,
                                f"Cost reduction: {actual_cost_reduction:.1f}% (outside expected range)")
            
            # Store results
            self.calculation_results[f"country_{country}"] = {
                "expected": expected,
                "actual": actual,
                "response_time": actual.get("_response_time", 0)
            }
    
    def test_edge_cases(self):
        """Test edge cases: Zero agents, maximum values, minimum values"""
        print("\n=== Testing Edge Case Tests ===")
        
        edge_cases = [
            {"name": "Zero Agents", "agent_count": 0, "aht_minutes": 7, "should_fail": True},
            {"name": "Maximum Values", "agent_count": 500, "aht_minutes": 20, "should_fail": False},
            {"name": "Minimum Values", "agent_count": 1, "aht_minutes": 2, "should_fail": False},
            {"name": "High Volume Scenario", "agent_count": 100, "aht_minutes": 5, "should_fail": False}
        ]
        
        for case in edge_cases:
            print(f"\n🔍 Testing Edge Case: {case['name']}")
            
            # Make API request
            actual = self.make_roi_request(case["agent_count"], case["aht_minutes"], "Bangladesh")
            
            if case["should_fail"]:
                # Zero agents should be handled gracefully
                if "error" in actual or actual.get("traditional_total_cost", 0) == 0:
                    self.log_test(f"Edge Case - {case['name']} Handling", True,
                                f"Gracefully handled zero agents case")
                else:
                    self.log_test(f"Edge Case - {case['name']} Handling", False,
                                f"Should have failed or returned zero costs for zero agents")
            else:
                if "error" not in actual:
                    # Calculate expected values for comparison
                    expected = self.calculate_expected_values(case["agent_count"], case["aht_minutes"], "Bangladesh")
                    
                    # Test call volume calculation
                    expected_call_volume = expected["call_volume"]
                    actual_call_volume = actual.get("call_volume_processed", 0)
                    
                    if self.compare_values(expected_call_volume, actual_call_volume, 0.001):
                        self.log_test(f"Edge Case - {case['name']} Call Volume", True,
                                    f"Call volume: {actual_call_volume:,} calls")
                    else:
                        self.log_test(f"Edge Case - {case['name']} Call Volume", False,
                                    f"Expected: {expected_call_volume:,}, Actual: {actual_call_volume:,}")
                    
                    # Test cost calculations are reasonable
                    actual_traditional = actual.get("traditional_total_cost", 0)
                    actual_ai = actual.get("ai_total_cost", 0)
                    
                    if actual_traditional > 0 and actual_ai > 0:
                        self.log_test(f"Edge Case - {case['name']} Cost Calculations", True,
                                    f"Traditional: ${actual_traditional:,.2f}, AI: ${actual_ai:,.2f}")
                    else:
                        self.log_test(f"Edge Case - {case['name']} Cost Calculations", False,
                                    f"Invalid cost calculations: Traditional: ${actual_traditional:,.2f}, AI: ${actual_ai:,.2f}")
                    
                    # Test performance for high volume scenarios
                    response_time = actual.get("_response_time", 0)
                    if case["name"] == "High Volume Scenario":
                        if response_time <= 1000:  # 1 second
                            self.log_test(f"Edge Case - {case['name']} Performance", True,
                                        f"Response time: {response_time:.2f}ms (good performance)")
                        else:
                            self.log_test(f"Edge Case - {case['name']} Performance", False,
                                        f"Response time: {response_time:.2f}ms (too slow)")
                else:
                    self.log_test(f"Edge Case - {case['name']} API Call", False,
                                f"API error: {actual['error']}")
            
            # Store results
            self.calculation_results[f"edge_{case['name'].lower().replace(' ', '_')}"] = {
                "actual": actual,
                "response_time": actual.get("_response_time", 0)
            }
    
    def test_mathematical_accuracy(self):
        """Test mathematical accuracy verification"""
        print("\n=== Testing Mathematical Accuracy Verification ===")
        
        test_cases = [
            {"agent_count": 25, "aht_minutes": 8, "country": "India"},
            {"agent_count": 75, "aht_minutes": 5, "country": "Philippines"},
            {"agent_count": 15, "aht_minutes": 12, "country": "Vietnam"},
            {"agent_count": 50, "aht_minutes": 7, "country": "Bangladesh"}
        ]
        
        for i, case in enumerate(test_cases, 1):
            print(f"\n🧮 Testing Mathematical Accuracy - Case {i}")
            
            # Calculate expected values manually
            expected = self.calculate_expected_values(case["agent_count"], case["aht_minutes"], case["country"])
            
            # Make API request
            actual = self.make_roi_request(case["agent_count"], case["aht_minutes"], case["country"])
            
            if "error" in actual:
                self.log_test(f"Math Accuracy Case {i} - API Call", False, 
                            f"API error: {actual['error']}")
                continue
            
            # Test monthly savings formula: monthlySavings = traditionalCost - aiCost
            expected_monthly_savings = expected["monthly_savings"]
            actual_monthly_savings = actual.get("monthly_savings", 0)
            
            if self.compare_values(expected_monthly_savings, actual_monthly_savings, 0.01):
                self.log_test(f"Math Accuracy Case {i} - Monthly Savings Formula", True,
                            f"Monthly savings: ${actual_monthly_savings:,.2f}")
            else:
                self.log_test(f"Math Accuracy Case {i} - Monthly Savings Formula", False,
                            f"Expected: ${expected_monthly_savings:,.2f}, Actual: ${actual_monthly_savings:,.2f}")
            
            # Test annual savings: annualSavings = monthlySavings × 12
            expected_annual_savings = expected["annual_savings"]
            actual_annual_savings = actual.get("annual_savings", 0)
            
            if self.compare_values(expected_annual_savings, actual_annual_savings, 0.01):
                self.log_test(f"Math Accuracy Case {i} - Annual Savings Formula", True,
                            f"Annual savings: ${actual_annual_savings:,.2f}")
            else:
                self.log_test(f"Math Accuracy Case {i} - Annual Savings Formula", False,
                            f"Expected: ${expected_annual_savings:,.2f}, Actual: ${actual_annual_savings:,.2f}")
            
            # Test ROI calculation: roiPercent = (annualSavings / (aiCost × 12)) × 100
            expected_roi = expected["roi_percentage"]
            actual_roi = actual.get("roi_percentage", 0)
            
            if self.compare_values(expected_roi, actual_roi, 0.01):
                self.log_test(f"Math Accuracy Case {i} - ROI Calculation", True,
                            f"ROI: {actual_roi:.1f}%")
            else:
                self.log_test(f"Math Accuracy Case {i} - ROI Calculation", False,
                            f"Expected: {expected_roi:.1f}%, Actual: {actual_roi:.1f}%")
            
            # Test cost reduction: costReduction = (monthlySavings / traditionalCost) × 100
            expected_cost_reduction = expected["cost_reduction_percentage"]
            actual_cost_reduction = actual.get("cost_reduction_percentage", 0)
            
            if self.compare_values(expected_cost_reduction, actual_cost_reduction, 0.01):
                self.log_test(f"Math Accuracy Case {i} - Cost Reduction Formula", True,
                            f"Cost reduction: {actual_cost_reduction:.1f}%")
            else:
                self.log_test(f"Math Accuracy Case {i} - Cost Reduction Formula", False,
                            f"Expected: {expected_cost_reduction:.1f}%, Actual: {actual_cost_reduction:.1f}%")
    
    def test_performance_and_validation(self):
        """Test API response times and validation"""
        print("\n=== Testing Performance and Validation Tests ===")
        
        # Test 1: Response time under various load scenarios
        print("\n⚡ Testing API Response Times")
        
        response_times = []
        for i in range(10):
            actual = self.make_roi_request(10, 7, "Bangladesh")
            if "_response_time" in actual:
                response_times.append(actual["_response_time"])
        
        if response_times:
            avg_response_time = sum(response_times) / len(response_times)
            max_response_time = max(response_times)
            
            if avg_response_time <= 500:  # 500ms target
                self.log_test("Performance - Average Response Time", True,
                            f"Average: {avg_response_time:.2f}ms (target: <500ms)")
            else:
                self.log_test("Performance - Average Response Time", False,
                            f"Average: {avg_response_time:.2f}ms (too slow)")
            
            if max_response_time <= 1000:  # 1 second max
                self.log_test("Performance - Maximum Response Time", True,
                            f"Maximum: {max_response_time:.2f}ms (target: <1000ms)")
            else:
                self.log_test("Performance - Maximum Response Time", False,
                            f"Maximum: {max_response_time:.2f}ms (too slow)")
        
        # Test 2: Input validation
        print("\n🔍 Testing Input Validation")
        
        invalid_inputs = [
            {"name": "Negative Agent Count", "agent_count": -5, "aht_minutes": 7},
            {"name": "Zero AHT", "agent_count": 10, "aht_minutes": 0},
            {"name": "Extremely High Agent Count", "agent_count": 10000, "aht_minutes": 7},
            {"name": "Extremely High AHT", "agent_count": 10, "aht_minutes": 1000}
        ]
        
        for invalid_case in invalid_inputs:
            actual = self.make_roi_request(invalid_case["agent_count"], invalid_case["aht_minutes"], "Bangladesh")
            
            if "error" in actual or actual.get("traditional_total_cost", 0) <= 0:
                self.log_test(f"Validation - {invalid_case['name']}", True,
                            f"Properly rejected invalid input")
            else:
                self.log_test(f"Validation - {invalid_case['name']}", False,
                            f"Should have rejected invalid input")
        
        # Test 3: Concurrent requests stability
        print("\n🔄 Testing Concurrent Request Handling")
        
        import concurrent.futures
        import threading
        
        def make_concurrent_request(request_id):
            return self.make_roi_request(10 + request_id, 7, "Bangladesh")
        
        concurrent_results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_concurrent_request, i) for i in range(5)]
            concurrent_results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        successful_concurrent = [r for r in concurrent_results if "error" not in r]
        
        if len(successful_concurrent) >= 4:  # At least 4 out of 5 should succeed
            self.log_test("Performance - Concurrent Request Stability", True,
                        f"{len(successful_concurrent)}/5 concurrent requests successful")
        else:
            self.log_test("Performance - Concurrent Request Stability", False,
                        f"Only {len(successful_concurrent)}/5 concurrent requests successful")
    
    def generate_comprehensive_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 80)
        print("📊 ROI CALCULATOR API COMPREHENSIVE TEST REPORT")
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
        
        # Performance summary
        response_times = [result["response_time"] for result in self.calculation_results.values() 
                         if "response_time" in result and result["response_time"] > 0]
        
        if response_times:
            avg_response_time = sum(response_times) / len(response_times)
            max_response_time = max(response_times)
            min_response_time = min(response_times)
            
            print(f"\n⚡ Performance Metrics:")
            print(f"   Average Response Time: {avg_response_time:.2f}ms")
            print(f"   Maximum Response Time: {max_response_time:.2f}ms")
            print(f"   Minimum Response Time: {min_response_time:.2f}ms")
        
        # Test category breakdown
        print(f"\n📋 Test Category Breakdown:")
        
        categories = {
            "Agent Count": [t for t in self.test_results if "Agent Count" in t["test"]],
            "AHT": [t for t in self.test_results if "AHT" in t["test"]],
            "Country": [t for t in self.test_results if any(country in t["test"] for country in ["Bangladesh", "India", "Philippines", "Vietnam"])],
            "Edge Case": [t for t in self.test_results if "Edge Case" in t["test"]],
            "Math Accuracy": [t for t in self.test_results if "Math Accuracy" in t["test"]],
            "Performance": [t for t in self.test_results if "Performance" in t["test"]],
            "Validation": [t for t in self.test_results if "Validation" in t["test"]]
        }
        
        for category, tests in categories.items():
            if tests:
                passed = len([t for t in tests if t["passed"]])
                total = len(tests)
                rate = (passed / total) * 100 if total > 0 else 0
                print(f"   {category}: {passed}/{total} ({rate:.1f}%)")
        
        # Failed tests details
        if self.failed_tests:
            print(f"\n❌ Failed Tests Details:")
            for result in self.test_results:
                if not result["passed"]:
                    print(f"   • {result['test']}: {result['details']}")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if success_rate >= 95:
            print(f"   🎉 EXCELLENT - ROI Calculator API is production-ready")
        elif success_rate >= 85:
            print(f"   ✅ GOOD - ROI Calculator API is ready with minor improvements needed")
        elif success_rate >= 70:
            print(f"   ⚠️ FAIR - ROI Calculator API needs improvements before production")
        else:
            print(f"   ❌ POOR - ROI Calculator API has significant issues")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        if response_times and max(response_times) > 1000:
            print(f"   • Optimize response times for better performance")
        
        print(f"   • Consider implementing caching for frequently requested calculations")
        print(f"   • Set up monitoring for calculation accuracy and performance")
        
        return success_rate >= 85
    
    def run_comprehensive_tests(self):
        """Run all comprehensive ROI Calculator tests"""
        print("🚀 Starting Comprehensive ROI Calculator API Testing")
        print("=" * 80)
        print("Testing ROI Calculator API for all calculation accuracy and edge cases:")
        print("• Input Variation Tests - Agent Count (1, 10, 50, 100, 500 agents)")
        print("• Input Variation Tests - Average Handle Time (2, 6, 7, 12, 20 minutes)")
        print("• Multi-Country Baseline Tests (Bangladesh, India, Philippines, Vietnam)")
        print("• Edge Case Tests (Zero agents, maximum values, minimum values)")
        print("• Mathematical Accuracy Verification")
        print("• Performance and Validation Tests")
        print("=" * 80)
        
        try:
            # Execute all test suites
            self.test_input_variation_agent_count()
            self.test_input_variation_aht()
            self.test_multi_country_baselines()
            self.test_edge_cases()
            self.test_mathematical_accuracy()
            self.test_performance_and_validation()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("ROI Calculator Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        success = self.generate_comprehensive_report()
        
        return success


if __name__ == "__main__":
    # Run comprehensive ROI Calculator tests
    tester = ROICalculatorTester()
    success = tester.run_comprehensive_tests()
    
    if success:
        print(f"\n🎉 ROI Calculator API testing completed successfully!")
        exit(0)
    else:
        print(f"\n❌ ROI Calculator API testing found issues that need attention.")
        exit(1)