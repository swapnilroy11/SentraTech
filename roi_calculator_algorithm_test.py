#!/usr/bin/env python3
"""
ROI Calculator Algorithm Testing - New Two-Panel Design & Algorithm Enhancements
Tests the updated call volume formula and algorithm accuracy as specified in the review request
"""

import requests
import json
import time
import math
from datetime import datetime
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://custai-metrics.preview.emergentagent.com/api"

class ROICalculatorAlgorithmTester:
    """Test the updated ROI Calculator with new algorithm enhancements"""
    
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
    
    def calculate_expected_call_volume(self, agent_count: int, aht_minutes: int) -> int:
        """Calculate expected call volume using the new formula"""
        # New Call Volume Formula from review request:
        # workMinutesPerMonth = 8 × 60 × 22 = 10,560 minutes
        # callsPerAgent = workMinutesPerMonth / ahtMinutes
        # callVolume = Math.floor(agentCount × callsPerAgent)
        
        work_minutes_per_month = 8 * 60 * 22  # 10,560 minutes
        calls_per_agent = work_minutes_per_month / aht_minutes
        call_volume = math.floor(agent_count * calls_per_agent)
        
        return call_volume
    
    def test_new_call_volume_formula(self):
        """Test the new call volume formula implementation"""
        print("\n=== Testing New Call Volume Formula ===")
        
        # Test scenarios from review request
        test_scenarios = [
            {
                "name": "Default Scenario (Bangladesh)",
                "agent_count": 10,
                "aht_minutes": 7,
                "country": "Bangladesh",
                "expected_call_volume": self.calculate_expected_call_volume(10, 7)  # ~15,085 calls
            },
            {
                "name": "Edge Case - Minimum Values",
                "agent_count": 1,
                "aht_minutes": 2,
                "country": "Bangladesh",
                "expected_call_volume": self.calculate_expected_call_volume(1, 2)  # 5,280 calls
            },
            {
                "name": "Edge Case - Maximum Values",
                "agent_count": 500,
                "aht_minutes": 20,
                "country": "Bangladesh",
                "expected_call_volume": self.calculate_expected_call_volume(500, 20)  # 264,000 calls
            },
            {
                "name": "Philippines Comparison",
                "agent_count": 10,
                "aht_minutes": 7,
                "country": "Philippines",
                "expected_call_volume": self.calculate_expected_call_volume(10, 7)  # Same call volume, different costs
            }
        ]
        
        for scenario in test_scenarios:
            try:
                print(f"🧮 Testing: {scenario['name']}")
                
                # Prepare API request data
                request_data = {
                    "agent_count": scenario["agent_count"],
                    "average_handle_time": scenario["aht_minutes"] * 60,  # Convert to seconds for API
                    "monthly_call_volume": scenario["expected_call_volume"],  # Use calculated volume
                    "cost_per_agent": 300 if scenario["country"] == "Bangladesh" else 600,  # Country baseline
                    "country": scenario["country"]
                }
                
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=request_data, timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Verify call volume calculation matches expected
                    actual_call_volume = result.get("call_volume_processed", 0)
                    expected_call_volume = scenario["expected_call_volume"]
                    
                    # Allow small variance due to rounding
                    variance_threshold = max(1, expected_call_volume * 0.01)  # 1% or minimum 1
                    
                    if abs(actual_call_volume - expected_call_volume) <= variance_threshold:
                        self.log_test(f"Call Volume Formula - {scenario['name']}", True,
                                    f"✅ Expected: {expected_call_volume}, Actual: {actual_call_volume}")
                    else:
                        self.log_test(f"Call Volume Formula - {scenario['name']}", False,
                                    f"❌ Expected: {expected_call_volume}, Actual: {actual_call_volume}")
                    
                    # Verify mathematical consistency
                    work_minutes = 8 * 60 * 22  # 10,560
                    calls_per_agent = work_minutes / scenario["aht_minutes"]
                    expected_formula_result = math.floor(scenario["agent_count"] * calls_per_agent)
                    
                    if abs(actual_call_volume - expected_formula_result) <= 1:
                        self.log_test(f"Formula Consistency - {scenario['name']}", True,
                                    f"✅ Formula result matches: {expected_formula_result}")
                    else:
                        self.log_test(f"Formula Consistency - {scenario['name']}", False,
                                    f"❌ Formula mismatch. Expected: {expected_formula_result}, Got: {actual_call_volume}")
                    
                    # Store result for further analysis
                    scenario["api_result"] = result
                    
                else:
                    self.log_test(f"Call Volume Formula - {scenario['name']}", False,
                                f"API Error: {response.status_code} - {response.text}")
                    
            except Exception as e:
                self.log_test(f"Call Volume Formula - {scenario['name']}", False,
                            f"Exception: {str(e)}")
        
        return test_scenarios
    
    def test_default_values_validation(self):
        """Test default values: Agent Count: 10, AHT: 7 minutes"""
        print("\n=== Testing Default Values Validation ===")
        
        # Test with default values
        default_request = {
            "agent_count": 10,  # Default
            "average_handle_time": 7 * 60,  # 7 minutes in seconds
            "monthly_call_volume": self.calculate_expected_call_volume(10, 7),
            "cost_per_agent": 300,  # Bangladesh baseline
            "country": "Bangladesh"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=default_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Verify default scenario calculations
                expected_call_volume = self.calculate_expected_call_volume(10, 7)  # ~15,085
                actual_call_volume = result.get("call_volume_processed", 0)
                
                if abs(actual_call_volume - expected_call_volume) <= 10:  # Allow small variance
                    self.log_test("Default Values - Call Volume", True,
                                f"✅ Default call volume: {actual_call_volume} (expected ~{expected_call_volume})")
                else:
                    self.log_test("Default Values - Call Volume", False,
                                f"❌ Default call volume mismatch: {actual_call_volume} vs {expected_call_volume}")
                
                # Verify per-call calculations
                traditional_cost = result.get("traditional_total_cost", 0)
                ai_cost = result.get("ai_total_cost", 0)
                
                if traditional_cost > 0 and ai_cost > 0:
                    expected_trad_per_call = traditional_cost / actual_call_volume
                    expected_ai_per_call = ai_cost / actual_call_volume
                    
                    actual_trad_per_call = result.get("traditional_cost_per_call", 0)
                    actual_ai_per_call = result.get("ai_cost_per_call", 0)
                    
                    # Test traditional cost per call
                    if abs(actual_trad_per_call - expected_trad_per_call) <= 0.01:
                        self.log_test("Default Values - Traditional Cost Per Call", True,
                                    f"✅ Traditional per-call: ${actual_trad_per_call:.3f}")
                    else:
                        self.log_test("Default Values - Traditional Cost Per Call", False,
                                    f"❌ Traditional per-call mismatch: ${actual_trad_per_call:.3f} vs ${expected_trad_per_call:.3f}")
                    
                    # Test AI cost per call
                    if abs(actual_ai_per_call - expected_ai_per_call) <= 0.01:
                        self.log_test("Default Values - AI Cost Per Call", True,
                                    f"✅ AI per-call: ${actual_ai_per_call:.3f}")
                    else:
                        self.log_test("Default Values - AI Cost Per Call", False,
                                    f"❌ AI per-call mismatch: ${actual_ai_per_call:.3f} vs ${expected_ai_per_call:.3f}")
                
                # Verify cost reduction is realistic (30-70% range from review)
                cost_reduction = result.get("cost_reduction_percentage", 0)
                if 30 <= cost_reduction <= 70:
                    self.log_test("Default Values - Cost Reduction Range", True,
                                f"✅ Cost reduction: {cost_reduction:.1f}% (within 30-70% range)")
                else:
                    self.log_test("Default Values - Cost Reduction Range", False,
                                f"❌ Cost reduction: {cost_reduction:.1f}% (outside 30-70% range)")
                
            else:
                self.log_test("Default Values - API Response", False,
                            f"API Error: {response.status_code}")
                
        except Exception as e:
            self.log_test("Default Values - Exception", False, f"Exception: {str(e)}")
    
    def test_multi_country_validation(self):
        """Test multi-country validation with different cost baselines"""
        print("\n=== Testing Multi-Country Validation ===")
        
        countries = [
            {"name": "Bangladesh", "baseline": 300},
            {"name": "India", "baseline": 500},
            {"name": "Philippines", "baseline": 600},
            {"name": "Vietnam", "baseline": 550}
        ]
        
        # Use consistent parameters across countries
        test_params = {
            "agent_count": 50,
            "aht_minutes": 7,
        }
        
        country_results = {}
        
        for country in countries:
            try:
                print(f"🌍 Testing {country['name']} (baseline: ${country['baseline']}/agent)")
                
                request_data = {
                    "agent_count": test_params["agent_count"],
                    "average_handle_time": test_params["aht_minutes"] * 60,
                    "monthly_call_volume": self.calculate_expected_call_volume(test_params["agent_count"], test_params["aht_minutes"]),
                    "cost_per_agent": country["baseline"],
                    "country": country["name"]
                }
                
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=request_data, timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    country_results[country["name"]] = result
                    
                    # Verify call volume is consistent across countries (same agents, same AHT)
                    expected_call_volume = self.calculate_expected_call_volume(test_params["agent_count"], test_params["aht_minutes"])
                    actual_call_volume = result.get("call_volume_processed", 0)
                    
                    if abs(actual_call_volume - expected_call_volume) <= 10:
                        self.log_test(f"Multi-Country - {country['name']} Call Volume", True,
                                    f"✅ Consistent call volume: {actual_call_volume}")
                    else:
                        self.log_test(f"Multi-Country - {country['name']} Call Volume", False,
                                    f"❌ Inconsistent call volume: {actual_call_volume} vs {expected_call_volume}")
                    
                    # Verify traditional cost reflects country baseline
                    traditional_cost = result.get("traditional_total_cost", 0)
                    expected_labor_cost = test_params["agent_count"] * country["baseline"]
                    
                    # Traditional cost should be higher than just labor cost (includes tech + infrastructure)
                    if traditional_cost >= expected_labor_cost:
                        self.log_test(f"Multi-Country - {country['name']} Traditional Cost", True,
                                    f"✅ Traditional cost: ${traditional_cost:,.2f} (includes ${expected_labor_cost:,.2f} labor)")
                    else:
                        self.log_test(f"Multi-Country - {country['name']} Traditional Cost", False,
                                    f"❌ Traditional cost too low: ${traditional_cost:,.2f} vs expected min ${expected_labor_cost:,.2f}")
                    
                    # Verify AI cost remains constant across countries ($200/agent from review)
                    ai_cost = result.get("ai_total_cost", 0)
                    expected_ai_cost = test_params["agent_count"] * 200  # $200/agent
                    
                    if abs(ai_cost - expected_ai_cost) <= expected_ai_cost * 0.05:  # 5% tolerance
                        self.log_test(f"Multi-Country - {country['name']} AI Cost Consistency", True,
                                    f"✅ AI cost: ${ai_cost:,.2f} (expected: ${expected_ai_cost:,.2f})")
                    else:
                        self.log_test(f"Multi-Country - {country['name']} AI Cost Consistency", False,
                                    f"❌ AI cost inconsistent: ${ai_cost:,.2f} vs ${expected_ai_cost:,.2f}")
                    
                else:
                    self.log_test(f"Multi-Country - {country['name']} API", False,
                                f"API Error: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Multi-Country - {country['name']} Exception", False,
                            f"Exception: {str(e)}")
        
        # Compare countries for cost differences
        if len(country_results) >= 2:
            bangladesh_cost = country_results.get("Bangladesh", {}).get("traditional_total_cost", 0)
            philippines_cost = country_results.get("Philippines", {}).get("traditional_total_cost", 0)
            
            if bangladesh_cost > 0 and philippines_cost > 0:
                if philippines_cost > bangladesh_cost:
                    self.log_test("Multi-Country - Cost Baseline Differences", True,
                                f"✅ Philippines (${philippines_cost:,.2f}) > Bangladesh (${bangladesh_cost:,.2f})")
                else:
                    self.log_test("Multi-Country - Cost Baseline Differences", False,
                                f"❌ Cost baseline issue: Philippines ${philippines_cost:,.2f} vs Bangladesh ${bangladesh_cost:,.2f}")
        
        return country_results
    
    def test_mathematical_accuracy(self):
        """Test mathematical accuracy of all calculations"""
        print("\n=== Testing Mathematical Accuracy ===")
        
        # Test with known values for precise calculation verification
        test_case = {
            "agent_count": 25,
            "aht_minutes": 8,
            "country": "Bangladesh"
        }
        
        # Calculate expected values manually
        expected_call_volume = self.calculate_expected_call_volume(test_case["agent_count"], test_case["aht_minutes"])
        
        request_data = {
            "agent_count": test_case["agent_count"],
            "average_handle_time": test_case["aht_minutes"] * 60,
            "monthly_call_volume": expected_call_volume,
            "cost_per_agent": 300,  # Bangladesh baseline
            "country": test_case["country"]
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=request_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Test 1: Call volume calculation accuracy
                actual_call_volume = result.get("call_volume_processed", 0)
                if abs(actual_call_volume - expected_call_volume) <= 1:
                    self.log_test("Mathematical Accuracy - Call Volume", True,
                                f"✅ Call volume accurate: {actual_call_volume}")
                else:
                    self.log_test("Mathematical Accuracy - Call Volume", False,
                                f"❌ Call volume inaccurate: {actual_call_volume} vs {expected_call_volume}")
                
                # Test 2: Per-call cost calculations
                traditional_total = result.get("traditional_total_cost", 0)
                ai_total = result.get("ai_total_cost", 0)
                
                if traditional_total > 0 and actual_call_volume > 0:
                    expected_trad_per_call = traditional_total / actual_call_volume
                    actual_trad_per_call = result.get("traditional_cost_per_call", 0)
                    
                    if abs(actual_trad_per_call - expected_trad_per_call) <= 0.001:
                        self.log_test("Mathematical Accuracy - Traditional Per-Call", True,
                                    f"✅ Traditional per-call: ${actual_trad_per_call:.4f}")
                    else:
                        self.log_test("Mathematical Accuracy - Traditional Per-Call", False,
                                    f"❌ Traditional per-call: ${actual_trad_per_call:.4f} vs ${expected_trad_per_call:.4f}")
                
                if ai_total > 0 and actual_call_volume > 0:
                    expected_ai_per_call = ai_total / actual_call_volume
                    actual_ai_per_call = result.get("ai_cost_per_call", 0)
                    
                    if abs(actual_ai_per_call - expected_ai_per_call) <= 0.001:
                        self.log_test("Mathematical Accuracy - AI Per-Call", True,
                                    f"✅ AI per-call: ${actual_ai_per_call:.4f}")
                    else:
                        self.log_test("Mathematical Accuracy - AI Per-Call", False,
                                    f"❌ AI per-call: ${actual_ai_per_call:.4f} vs ${expected_ai_per_call:.4f}")
                
                # Test 3: Savings calculation
                monthly_savings = result.get("monthly_savings", 0)
                expected_savings = traditional_total - ai_total
                
                if abs(monthly_savings - expected_savings) <= 0.01:
                    self.log_test("Mathematical Accuracy - Monthly Savings", True,
                                f"✅ Monthly savings: ${monthly_savings:,.2f}")
                else:
                    self.log_test("Mathematical Accuracy - Monthly Savings", False,
                                f"❌ Monthly savings: ${monthly_savings:,.2f} vs ${expected_savings:,.2f}")
                
                # Test 4: Cost reduction percentage
                cost_reduction = result.get("cost_reduction_percentage", 0)
                expected_reduction = (expected_savings / traditional_total * 100) if traditional_total > 0 else 0
                
                if abs(cost_reduction - expected_reduction) <= 0.1:
                    self.log_test("Mathematical Accuracy - Cost Reduction %", True,
                                f"✅ Cost reduction: {cost_reduction:.2f}%")
                else:
                    self.log_test("Mathematical Accuracy - Cost Reduction %", False,
                                f"❌ Cost reduction: {cost_reduction:.2f}% vs {expected_reduction:.2f}%")
                
                # Test 5: Annual savings
                annual_savings = result.get("annual_savings", 0)
                expected_annual = monthly_savings * 12
                
                if abs(annual_savings - expected_annual) <= 0.01:
                    self.log_test("Mathematical Accuracy - Annual Savings", True,
                                f"✅ Annual savings: ${annual_savings:,.2f}")
                else:
                    self.log_test("Mathematical Accuracy - Annual Savings", False,
                                f"❌ Annual savings: ${annual_savings:,.2f} vs ${expected_annual:,.2f}")
                
            else:
                self.log_test("Mathematical Accuracy - API Response", False,
                            f"API Error: {response.status_code}")
                
        except Exception as e:
            self.log_test("Mathematical Accuracy - Exception", False, f"Exception: {str(e)}")
    
    def test_aht_changes_dynamic_updates(self):
        """Test that AHT changes dynamically affect call volume and per-call costs"""
        print("\n=== Testing AHT Changes Dynamic Updates ===")
        
        base_params = {
            "agent_count": 20,
            "country": "Bangladesh",
            "cost_per_agent": 300
        }
        
        aht_test_cases = [5, 7, 10, 15]  # Different AHT values in minutes
        aht_results = {}
        
        for aht_minutes in aht_test_cases:
            try:
                print(f"⏱️ Testing AHT: {aht_minutes} minutes")
                
                expected_call_volume = self.calculate_expected_call_volume(base_params["agent_count"], aht_minutes)
                
                request_data = {
                    "agent_count": base_params["agent_count"],
                    "average_handle_time": aht_minutes * 60,
                    "monthly_call_volume": expected_call_volume,
                    "cost_per_agent": base_params["cost_per_agent"],
                    "country": base_params["country"]
                }
                
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=request_data, timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    aht_results[aht_minutes] = result
                    
                    # Verify call volume changes with AHT
                    actual_call_volume = result.get("call_volume_processed", 0)
                    
                    if abs(actual_call_volume - expected_call_volume) <= 10:
                        self.log_test(f"AHT Dynamic Updates - {aht_minutes}min Call Volume", True,
                                    f"✅ AHT {aht_minutes}min → {actual_call_volume:,} calls")
                    else:
                        self.log_test(f"AHT Dynamic Updates - {aht_minutes}min Call Volume", False,
                                    f"❌ AHT {aht_minutes}min → {actual_call_volume:,} calls (expected {expected_call_volume:,})")
                    
                    # Verify per-call costs update correctly
                    trad_per_call = result.get("traditional_cost_per_call", 0)
                    ai_per_call = result.get("ai_cost_per_call", 0)
                    
                    if trad_per_call > 0 and ai_per_call > 0:
                        self.log_test(f"AHT Dynamic Updates - {aht_minutes}min Per-Call Costs", True,
                                    f"✅ Traditional: ${trad_per_call:.3f}, AI: ${ai_per_call:.3f}")
                    else:
                        self.log_test(f"AHT Dynamic Updates - {aht_minutes}min Per-Call Costs", False,
                                    f"❌ Invalid per-call costs: Traditional: ${trad_per_call:.3f}, AI: ${ai_per_call:.3f}")
                
                else:
                    self.log_test(f"AHT Dynamic Updates - {aht_minutes}min API", False,
                                f"API Error: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"AHT Dynamic Updates - {aht_minutes}min Exception", False,
                            f"Exception: {str(e)}")
        
        # Verify inverse relationship between AHT and call volume
        if len(aht_results) >= 2:
            aht_5_volume = aht_results.get(5, {}).get("call_volume_processed", 0)
            aht_15_volume = aht_results.get(15, {}).get("call_volume_processed", 0)
            
            if aht_5_volume > 0 and aht_15_volume > 0:
                if aht_5_volume > aht_15_volume:
                    self.log_test("AHT Dynamic Updates - Inverse Relationship", True,
                                f"✅ Lower AHT → Higher volume: 5min={aht_5_volume:,} > 15min={aht_15_volume:,}")
                else:
                    self.log_test("AHT Dynamic Updates - Inverse Relationship", False,
                                f"❌ Inverse relationship broken: 5min={aht_5_volume:,} vs 15min={aht_15_volume:,}")
        
        return aht_results
    
    def test_real_time_updates_consistency(self):
        """Test that all calculations update consistently in real-time"""
        print("\n=== Testing Real-Time Updates Consistency ===")
        
        # Test multiple rapid requests with different parameters
        consistency_tests = [
            {"agent_count": 15, "aht_minutes": 6, "country": "Bangladesh"},
            {"agent_count": 30, "aht_minutes": 8, "country": "Philippines"},
            {"agent_count": 45, "aht_minutes": 10, "country": "India"},
            {"agent_count": 60, "aht_minutes": 12, "country": "Vietnam"}
        ]
        
        consistent_results = True
        
        for i, test_case in enumerate(consistency_tests):
            try:
                print(f"🔄 Consistency test {i+1}/4: {test_case['agent_count']} agents, {test_case['aht_minutes']}min AHT")
                
                expected_call_volume = self.calculate_expected_call_volume(test_case["agent_count"], test_case["aht_minutes"])
                
                # Country baselines
                baselines = {"Bangladesh": 300, "Philippines": 600, "India": 500, "Vietnam": 550}
                
                request_data = {
                    "agent_count": test_case["agent_count"],
                    "average_handle_time": test_case["aht_minutes"] * 60,
                    "monthly_call_volume": expected_call_volume,
                    "cost_per_agent": baselines[test_case["country"]],
                    "country": test_case["country"]
                }
                
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=request_data, timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Verify all required fields are present and consistent
                    required_fields = [
                        "traditional_total_cost", "ai_total_cost", "monthly_savings",
                        "annual_savings", "cost_reduction_percentage", "roi_percentage",
                        "traditional_cost_per_call", "ai_cost_per_call", "call_volume_processed"
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in result]
                    
                    if not missing_fields:
                        # Verify mathematical consistency
                        traditional_cost = result["traditional_total_cost"]
                        ai_cost = result["ai_total_cost"]
                        monthly_savings = result["monthly_savings"]
                        call_volume = result["call_volume_processed"]
                        
                        # Check savings calculation
                        expected_savings = traditional_cost - ai_cost
                        if abs(monthly_savings - expected_savings) <= 0.01:
                            # Check per-call calculations
                            expected_trad_per_call = traditional_cost / call_volume if call_volume > 0 else 0
                            expected_ai_per_call = ai_cost / call_volume if call_volume > 0 else 0
                            
                            actual_trad_per_call = result["traditional_cost_per_call"]
                            actual_ai_per_call = result["ai_cost_per_call"]
                            
                            if (abs(actual_trad_per_call - expected_trad_per_call) <= 0.001 and
                                abs(actual_ai_per_call - expected_ai_per_call) <= 0.001):
                                
                                self.log_test(f"Real-Time Consistency - Test {i+1}", True,
                                            f"✅ All calculations consistent")
                            else:
                                consistent_results = False
                                self.log_test(f"Real-Time Consistency - Test {i+1}", False,
                                            f"❌ Per-call calculation inconsistency")
                        else:
                            consistent_results = False
                            self.log_test(f"Real-Time Consistency - Test {i+1}", False,
                                        f"❌ Savings calculation inconsistency")
                    else:
                        consistent_results = False
                        self.log_test(f"Real-Time Consistency - Test {i+1}", False,
                                    f"❌ Missing fields: {missing_fields}")
                
                else:
                    consistent_results = False
                    self.log_test(f"Real-Time Consistency - Test {i+1}", False,
                                f"API Error: {response.status_code}")
                
                # Small delay between requests
                time.sleep(0.5)
                
            except Exception as e:
                consistent_results = False
                self.log_test(f"Real-Time Consistency - Test {i+1}", False,
                            f"Exception: {str(e)}")
        
        # Overall consistency assessment
        if consistent_results:
            self.log_test("Real-Time Updates - Overall Consistency", True,
                        "✅ All real-time updates are mathematically consistent")
        else:
            self.log_test("Real-Time Updates - Overall Consistency", False,
                        "❌ Inconsistencies detected in real-time updates")
    
    def generate_algorithm_validation_report(self):
        """Generate comprehensive algorithm validation report"""
        print("\n" + "=" * 80)
        print("📊 ROI CALCULATOR ALGORITHM VALIDATION REPORT")
        print("=" * 80)
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📈 Algorithm Test Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📊 Success Rate: {success_rate:.1f}%")
        
        # Key algorithm validation results
        print(f"\n🧮 Key Algorithm Validations:")
        
        # Call volume formula validation
        call_volume_tests = [t for t in self.test_results if "Call Volume Formula" in t["test"]]
        call_volume_passed = len([t for t in call_volume_tests if t["passed"]])
        
        if call_volume_tests:
            print(f"   Call Volume Formula: {call_volume_passed}/{len(call_volume_tests)} scenarios passed")
        
        # Mathematical accuracy validation
        math_tests = [t for t in self.test_results if "Mathematical Accuracy" in t["test"]]
        math_passed = len([t for t in math_tests if t["passed"]])
        
        if math_tests:
            print(f"   Mathematical Accuracy: {math_passed}/{len(math_tests)} calculations correct")
        
        # Multi-country validation
        country_tests = [t for t in self.test_results if "Multi-Country" in t["test"]]
        country_passed = len([t for t in country_tests if t["passed"]])
        
        if country_tests:
            print(f"   Multi-Country Validation: {country_passed}/{len(country_tests)} countries validated")
        
        # Algorithm readiness assessment
        print(f"\n🎯 Algorithm Readiness Assessment:")
        
        readiness_score = 0
        max_score = 0
        
        # Criteria 1: Call Volume Formula (25 points)
        max_score += 25
        if call_volume_tests and call_volume_passed >= len(call_volume_tests) * 0.8:
            readiness_score += 25
            print(f"   ✅ Call Volume Formula: PASS")
        else:
            print(f"   ❌ Call Volume Formula: FAIL")
        
        # Criteria 2: Mathematical Accuracy (25 points)
        max_score += 25
        if math_tests and math_passed >= len(math_tests) * 0.9:
            readiness_score += 25
            print(f"   ✅ Mathematical Accuracy: PASS")
        else:
            print(f"   ❌ Mathematical Accuracy: FAIL")
        
        # Criteria 3: Multi-Country Support (25 points)
        max_score += 25
        if country_tests and country_passed >= len(country_tests) * 0.75:
            readiness_score += 25
            print(f"   ✅ Multi-Country Support: PASS")
        else:
            print(f"   ❌ Multi-Country Support: FAIL")
        
        # Criteria 4: Real-Time Consistency (25 points)
        max_score += 25
        consistency_tests = [t for t in self.test_results if "Real-Time Consistency" in t["test"] or "AHT Dynamic" in t["test"]]
        consistency_passed = len([t for t in consistency_tests if t["passed"]])
        
        if consistency_tests and consistency_passed >= len(consistency_tests) * 0.8:
            readiness_score += 25
            print(f"   ✅ Real-Time Consistency: PASS")
        else:
            print(f"   ❌ Real-Time Consistency: FAIL")
        
        # Final algorithm readiness score
        final_readiness = (readiness_score / max_score) * 100 if max_score > 0 else 0
        
        print(f"\n🏆 FINAL ALGORITHM READINESS SCORE: {final_readiness:.1f}%")
        
        if final_readiness >= 90:
            print(f"   🎉 EXCELLENT - Algorithm ready for production")
        elif final_readiness >= 75:
            print(f"   ✅ GOOD - Algorithm ready with minor optimizations")
        elif final_readiness >= 60:
            print(f"   ⚠️ FAIR - Algorithm needs improvements")
        else:
            print(f"   ❌ POOR - Significant algorithm issues need resolution")
        
        # Detailed findings
        print(f"\n💡 Key Findings:")
        
        if failed_tests > 0:
            print(f"   • {failed_tests} test cases failed - review algorithm implementation")
        
        # Check for specific issues
        cost_reduction_issues = [t for t in self.test_results if "Cost Reduction Range" in t["test"] and not t["passed"]]
        if cost_reduction_issues:
            print(f"   • Cost reduction percentages outside 30-70% range detected")
        
        call_volume_issues = [t for t in self.test_results if "Call Volume" in t["test"] and not t["passed"]]
        if call_volume_issues:
            print(f"   • Call volume formula implementation issues detected")
        
        per_call_issues = [t for t in self.test_results if "Per-Call" in t["test"] and not t["passed"]]
        if per_call_issues:
            print(f"   • Per-call cost calculation accuracy issues detected")
        
        print(f"\n📋 Recommendations:")
        print(f"   • Verify call volume formula: workMinutesPerMonth = 8 × 60 × 22 = 10,560")
        print(f"   • Ensure AHT changes dynamically update call volume and per-call costs")
        print(f"   • Validate cost reduction stays within realistic 30-70% range")
        print(f"   • Test all country baselines for accurate cost differences")
        
        return final_readiness >= 75
    
    def run_comprehensive_algorithm_tests(self):
        """Run all comprehensive algorithm validation tests"""
        print("🧮 Starting ROI Calculator Algorithm Validation Testing")
        print("=" * 80)
        print("Testing updated ROI Calculator with new two-panel design and algorithm enhancements:")
        print("• New Call Volume Formula: workMinutesPerMonth = 8 × 60 × 22 = 10,560 minutes")
        print("• Default Values: Agent Count: 10, AHT: 7 minutes")
        print("• Mathematical Accuracy: Call volume, per-call costs, cost reduction")
        print("• Multi-Country Validation: Bangladesh, India, Philippines, Vietnam")
        print("• Real-Time Updates: AHT changes affect calculations dynamically")
        print("=" * 80)
        
        try:
            # Core algorithm tests
            self.test_new_call_volume_formula()
            self.test_default_values_validation()
            self.test_mathematical_accuracy()
            
            # Advanced validation tests
            self.test_multi_country_validation()
            self.test_aht_changes_dynamic_updates()
            self.test_real_time_updates_consistency()
            
        except Exception as e:
            print(f"❌ Critical error during algorithm testing: {str(e)}")
            self.log_test("Algorithm Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        algorithm_ready = self.generate_algorithm_validation_report()
        
        return algorithm_ready


def main():
    """Main function to run ROI Calculator algorithm tests"""
    print("🚀 ROI Calculator Algorithm Testing - New Two-Panel Design & Enhancements")
    print("=" * 80)
    
    tester = ROICalculatorAlgorithmTester()
    
    # Run comprehensive algorithm validation
    algorithm_ready = tester.run_comprehensive_algorithm_tests()
    
    print("\n" + "=" * 80)
    if algorithm_ready:
        print("🎉 ROI CALCULATOR ALGORITHM VALIDATION COMPLETE - READY FOR PRODUCTION!")
    else:
        print("⚠️ ROI CALCULATOR ALGORITHM VALIDATION COMPLETE - NEEDS IMPROVEMENTS")
    print("=" * 80)
    
    return algorithm_ready


if __name__ == "__main__":
    main()