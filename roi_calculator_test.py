#!/usr/bin/env python3
"""
ROI Calculator Testing with Fixed 7-Minute AHT
Tests the updated ROI Calculator with simplified three-card layout and fixed 7-minute AHT
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://custai-metrics.preview.emergentagent.com/api"

class ROICalculatorTester:
    """Test ROI Calculator with fixed 7-minute AHT and real per-call costs"""
    
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
    
    def calculate_expected_call_volume(self, agent_count: int, aht_minutes: int = 7, working_hours: int = 8, working_days: int = 22) -> int:
        """Calculate expected call volume: agents × ((working_hours×60)/aht_minutes) × working_days"""
        calls_per_agent_per_day = (working_hours * 60) / aht_minutes
        monthly_call_volume = int(agent_count * calls_per_agent_per_day * working_days)
        return monthly_call_volume
    
    def test_bangladesh_50_agents_scenario(self):
        """Test Bangladesh - 50 agents scenario with 7-minute AHT"""
        print("\n=== Testing Bangladesh - 50 Agents Scenario ===")
        
        # Expected values from review request
        agent_count = 50
        aht_minutes = 7
        aht_seconds = 420  # 7 minutes = 420 seconds
        country = "Bangladesh"
        
        # Calculate expected call volume: 50 × ((8×60)/7) × 22 = 50 × 68.57 × 22 ≈ 75,428 calls/month
        expected_call_volume = self.calculate_expected_call_volume(agent_count, aht_minutes)
        
        # Expected costs from review request
        expected_traditional_cost = 19000  # $19,000
        expected_ai_cost = 10000  # $10,000
        expected_monthly_savings = 9000  # $9,000
        expected_cost_reduction_approx = 47  # ~47%
        
        # Expected per-call costs
        expected_traditional_per_call = expected_traditional_cost / expected_call_volume  # Should be $0.25/call
        expected_ai_per_call = expected_ai_cost / expected_call_volume  # Should be $0.13/call
        
        test_data = {
            "agent_count": agent_count,
            "average_handle_time": aht_seconds,
            "monthly_call_volume": expected_call_volume,
            "cost_per_agent": 500,  # Default value, backend should use country baseline
            "country": country
        }
        
        try:
            print(f"📊 Testing Bangladesh scenario: {agent_count} agents, {aht_minutes} min AHT, {expected_call_volume:,} calls/month")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Test 1: Call Volume Calculation
                actual_call_volume = result.get("call_volume_processed", 0)
                if abs(actual_call_volume - expected_call_volume) <= 100:  # Allow small variance
                    self.log_test("Bangladesh 50 Agents - Call Volume Calculation", True,
                                f"✅ Call volume: {actual_call_volume:,} (expected: ~{expected_call_volume:,})")
                else:
                    self.log_test("Bangladesh 50 Agents - Call Volume Calculation", False,
                                f"❌ Call volume: {actual_call_volume:,} (expected: ~{expected_call_volume:,})")
                
                # Test 2: Traditional Cost Verification
                actual_traditional_cost = result.get("traditional_total_cost", 0)
                if abs(actual_traditional_cost - expected_traditional_cost) <= 1000:  # Allow $1k variance
                    self.log_test("Bangladesh 50 Agents - Traditional Cost", True,
                                f"✅ Traditional cost: ${actual_traditional_cost:,.0f} (expected: ~${expected_traditional_cost:,})")
                else:
                    self.log_test("Bangladesh 50 Agents - Traditional Cost", False,
                                f"❌ Traditional cost: ${actual_traditional_cost:,.0f} (expected: ~${expected_traditional_cost:,})")
                
                # Test 3: AI Cost Verification
                actual_ai_cost = result.get("ai_total_cost", 0)
                if abs(actual_ai_cost - expected_ai_cost) <= 500:  # Allow $500 variance
                    self.log_test("Bangladesh 50 Agents - AI Cost", True,
                                f"✅ AI cost: ${actual_ai_cost:,.0f} (expected: ~${expected_ai_cost:,})")
                else:
                    self.log_test("Bangladesh 50 Agents - AI Cost", False,
                                f"❌ AI cost: ${actual_ai_cost:,.0f} (expected: ~${expected_ai_cost:,})")
                
                # Test 4: Monthly Savings
                actual_monthly_savings = result.get("monthly_savings", 0)
                if abs(actual_monthly_savings - expected_monthly_savings) <= 1000:  # Allow $1k variance
                    self.log_test("Bangladesh 50 Agents - Monthly Savings", True,
                                f"✅ Monthly savings: ${actual_monthly_savings:,.0f} (expected: ~${expected_monthly_savings:,})")
                else:
                    self.log_test("Bangladesh 50 Agents - Monthly Savings", False,
                                f"❌ Monthly savings: ${actual_monthly_savings:,.0f} (expected: ~${expected_monthly_savings:,})")
                
                # Test 5: Cost Reduction Percentage
                actual_cost_reduction = result.get("cost_reduction_percentage", 0)
                if abs(actual_cost_reduction - expected_cost_reduction_approx) <= 5:  # Allow 5% variance
                    self.log_test("Bangladesh 50 Agents - Cost Reduction %", True,
                                f"✅ Cost reduction: {actual_cost_reduction:.1f}% (expected: ~{expected_cost_reduction_approx}%)")
                else:
                    self.log_test("Bangladesh 50 Agents - Cost Reduction %", False,
                                f"❌ Cost reduction: {actual_cost_reduction:.1f}% (expected: ~{expected_cost_reduction_approx}%)")
                
                # Test 6: Per-Call Cost Verification
                actual_traditional_per_call = result.get("traditional_cost_per_call", 0)
                actual_ai_per_call = result.get("ai_cost_per_call", 0)
                
                if abs(actual_traditional_per_call - expected_traditional_per_call) <= 0.05:  # Allow 5 cents variance
                    self.log_test("Bangladesh 50 Agents - Traditional Per-Call Cost", True,
                                f"✅ Traditional per-call: ${actual_traditional_per_call:.2f} (expected: ~${expected_traditional_per_call:.2f})")
                else:
                    self.log_test("Bangladesh 50 Agents - Traditional Per-Call Cost", False,
                                f"❌ Traditional per-call: ${actual_traditional_per_call:.2f} (expected: ~${expected_traditional_per_call:.2f})")
                
                if abs(actual_ai_per_call - expected_ai_per_call) <= 0.05:  # Allow 5 cents variance
                    self.log_test("Bangladesh 50 Agents - AI Per-Call Cost", True,
                                f"✅ AI per-call: ${actual_ai_per_call:.2f} (expected: ~${expected_ai_per_call:.2f})")
                else:
                    self.log_test("Bangladesh 50 Agents - AI Per-Call Cost", False,
                                f"❌ AI per-call: ${actual_ai_per_call:.2f} (expected: ~${expected_ai_per_call:.2f})")
                
                # Test 7: Realistic Cost Reduction Range (30-70%)
                if 30 <= actual_cost_reduction <= 70:
                    self.log_test("Bangladesh 50 Agents - Realistic Cost Reduction Range", True,
                                f"✅ Cost reduction {actual_cost_reduction:.1f}% is within realistic 30-70% range")
                else:
                    self.log_test("Bangladesh 50 Agents - Realistic Cost Reduction Range", False,
                                f"❌ Cost reduction {actual_cost_reduction:.1f}% is outside realistic 30-70% range")
                
                print(f"📊 Bangladesh 50 Agents Results Summary:")
                print(f"   Call Volume: {actual_call_volume:,} calls/month")
                print(f"   Traditional Cost: ${actual_traditional_cost:,.0f}")
                print(f"   AI Cost: ${actual_ai_cost:,.0f}")
                print(f"   Monthly Savings: ${actual_monthly_savings:,.0f}")
                print(f"   Cost Reduction: {actual_cost_reduction:.1f}%")
                print(f"   Traditional Per-Call: ${actual_traditional_per_call:.2f}")
                print(f"   AI Per-Call: ${actual_ai_per_call:.2f}")
                
            else:
                self.log_test("Bangladesh 50 Agents - API Response", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Bangladesh 50 Agents - Exception", False, f"Exception: {str(e)}")
    
    def test_philippines_100_agents_scenario(self):
        """Test Philippines - 100 agents scenario with 7-minute AHT"""
        print("\n=== Testing Philippines - 100 Agents Scenario ===")
        
        # Expected values from review request
        agent_count = 100
        aht_minutes = 7
        aht_seconds = 420  # 7 minutes = 420 seconds
        country = "Philippines"
        
        # Calculate expected call volume: 100 × ((8×60)/7) × 22 = 100 × 68.57 × 22 ≈ 150,856 calls/month
        expected_call_volume = self.calculate_expected_call_volume(agent_count, aht_minutes)
        
        # Expected costs from review request (Philippines baseline: $600 + $80 overhead = $680/agent = $68,000)
        expected_traditional_cost_approx = 68000  # $68,000 for 100 agents
        
        test_data = {
            "agent_count": agent_count,
            "average_handle_time": aht_seconds,
            "monthly_call_volume": expected_call_volume,
            "cost_per_agent": 500,  # Default value, backend should use country baseline
            "country": country
        }
        
        try:
            print(f"📊 Testing Philippines scenario: {agent_count} agents, {aht_minutes} min AHT, {expected_call_volume:,} calls/month")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Test 1: Call Volume Calculation
                actual_call_volume = result.get("call_volume_processed", 0)
                if abs(actual_call_volume - expected_call_volume) <= 200:  # Allow small variance
                    self.log_test("Philippines 100 Agents - Call Volume Calculation", True,
                                f"✅ Call volume: {actual_call_volume:,} (expected: ~{expected_call_volume:,})")
                else:
                    self.log_test("Philippines 100 Agents - Call Volume Calculation", False,
                                f"❌ Call volume: {actual_call_volume:,} (expected: ~{expected_call_volume:,})")
                
                # Test 2: Philippines vs Bangladesh Cost Comparison
                # Philippines should have higher traditional cost than Bangladesh
                actual_traditional_cost = result.get("traditional_total_cost", 0)
                
                # Get Bangladesh cost for comparison
                bangladesh_data = {
                    "agent_count": agent_count,  # Same agent count for fair comparison
                    "average_handle_time": aht_seconds,
                    "monthly_call_volume": expected_call_volume,
                    "cost_per_agent": 500,  # Default value, backend should use country baseline
                    "country": "Bangladesh"
                }
                
                bangladesh_response = requests.post(f"{BACKEND_URL}/roi/calculate", json=bangladesh_data, timeout=30)
                if bangladesh_response.status_code == 200:
                    bangladesh_result = bangladesh_response.json()
                    bangladesh_traditional_cost = bangladesh_result.get("traditional_total_cost", 0)
                    
                    if actual_traditional_cost > bangladesh_traditional_cost:
                        self.log_test("Philippines 100 Agents - Cost Baseline Comparison", True,
                                    f"✅ Philippines cost (${actual_traditional_cost:,.0f}) > Bangladesh cost (${bangladesh_traditional_cost:,.0f})")
                    else:
                        self.log_test("Philippines 100 Agents - Cost Baseline Comparison", False,
                                    f"❌ Philippines cost (${actual_traditional_cost:,.0f}) should be > Bangladesh cost (${bangladesh_traditional_cost:,.0f})")
                
                # Test 3: Cost Reduction Percentage (should be realistic)
                actual_cost_reduction = result.get("cost_reduction_percentage", 0)
                if 30 <= actual_cost_reduction <= 70:
                    self.log_test("Philippines 100 Agents - Realistic Cost Reduction Range", True,
                                f"✅ Cost reduction {actual_cost_reduction:.1f}% is within realistic 30-70% range")
                else:
                    self.log_test("Philippines 100 Agents - Realistic Cost Reduction Range", False,
                                f"❌ Cost reduction {actual_cost_reduction:.1f}% is outside realistic 30-70% range")
                
                # Test 4: Per-Call Cost Calculation
                actual_traditional_per_call = result.get("traditional_cost_per_call", 0)
                actual_ai_per_call = result.get("ai_cost_per_call", 0)
                
                if actual_traditional_per_call > 0 and actual_ai_per_call > 0:
                    self.log_test("Philippines 100 Agents - Per-Call Cost Calculation", True,
                                f"✅ Per-call costs calculated: Traditional ${actual_traditional_per_call:.2f}, AI ${actual_ai_per_call:.2f}")
                else:
                    self.log_test("Philippines 100 Agents - Per-Call Cost Calculation", False,
                                f"❌ Invalid per-call costs: Traditional ${actual_traditional_per_call:.2f}, AI ${actual_ai_per_call:.2f}")
                
                # Test 5: Monthly Savings Calculation
                actual_monthly_savings = result.get("monthly_savings", 0)
                actual_ai_cost = result.get("ai_total_cost", 0)
                
                expected_monthly_savings = actual_traditional_cost - actual_ai_cost
                if abs(actual_monthly_savings - expected_monthly_savings) <= 10:  # Allow small rounding variance
                    self.log_test("Philippines 100 Agents - Monthly Savings Calculation", True,
                                f"✅ Monthly savings calculation correct: ${actual_monthly_savings:,.0f}")
                else:
                    self.log_test("Philippines 100 Agents - Monthly Savings Calculation", False,
                                f"❌ Monthly savings calculation error: ${actual_monthly_savings:,.0f} (expected: ${expected_monthly_savings:,.0f})")
                
                print(f"📊 Philippines 100 Agents Results Summary:")
                print(f"   Call Volume: {actual_call_volume:,} calls/month")
                print(f"   Traditional Cost: ${actual_traditional_cost:,.0f}")
                print(f"   AI Cost: ${actual_ai_cost:,.0f}")
                print(f"   Monthly Savings: ${actual_monthly_savings:,.0f}")
                print(f"   Cost Reduction: {actual_cost_reduction:.1f}%")
                print(f"   Traditional Per-Call: ${actual_traditional_per_call:.2f}")
                print(f"   AI Per-Call: ${actual_ai_per_call:.2f}")
                
            else:
                self.log_test("Philippines 100 Agents - API Response", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Philippines 100 Agents - Exception", False, f"Exception: {str(e)}")
    
    def test_fixed_aht_consistency(self):
        """Test that the backend consistently accepts and uses 7-minute AHT"""
        print("\n=== Testing Fixed 7-Minute AHT Consistency ===")
        
        # Test multiple scenarios with fixed 7-minute AHT
        test_scenarios = [
            {"agent_count": 25, "country": "Bangladesh"},
            {"agent_count": 75, "country": "India"},
            {"agent_count": 150, "country": "Philippines"},
            {"agent_count": 200, "country": "Vietnam"}
        ]
        
        aht_seconds = 420  # Fixed 7 minutes
        
        for i, scenario in enumerate(test_scenarios):
            agent_count = scenario["agent_count"]
            country = scenario["country"]
            expected_call_volume = self.calculate_expected_call_volume(agent_count, 7)
            
            test_data = {
                "agent_count": agent_count,
                "average_handle_time": aht_seconds,
                "monthly_call_volume": expected_call_volume,
                "cost_per_agent": 500,  # Default value, backend should use country baseline
                "country": country
            }
            
            try:
                print(f"🔍 Testing AHT consistency - Scenario {i+1}: {agent_count} agents, {country}")
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Verify call volume calculation is consistent with 7-minute AHT
                    actual_call_volume = result.get("call_volume_processed", 0)
                    
                    if abs(actual_call_volume - expected_call_volume) <= (expected_call_volume * 0.02):  # Allow 2% variance
                        self.log_test(f"Fixed AHT Consistency - Scenario {i+1} ({country})", True,
                                    f"✅ Call volume consistent with 7-min AHT: {actual_call_volume:,}")
                    else:
                        self.log_test(f"Fixed AHT Consistency - Scenario {i+1} ({country})", False,
                                    f"❌ Call volume inconsistent: {actual_call_volume:,} (expected: {expected_call_volume:,})")
                    
                    # Verify cost reduction is in realistic range
                    cost_reduction = result.get("cost_reduction_percentage", 0)
                    if 20 <= cost_reduction <= 80:  # Slightly wider range for different countries
                        print(f"   ✅ Cost reduction {cost_reduction:.1f}% is realistic")
                    else:
                        print(f"   ⚠️ Cost reduction {cost_reduction:.1f}% may be unrealistic")
                        
                else:
                    self.log_test(f"Fixed AHT Consistency - Scenario {i+1} ({country})", False,
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Fixed AHT Consistency - Scenario {i+1} ({country})", False,
                            f"Exception: {str(e)}")
    
    def test_mathematical_verification(self):
        """Test mathematical accuracy of ROI calculations"""
        print("\n=== Testing Mathematical Verification ===")
        
        # Test with known values for mathematical verification
        test_data = {
            "agent_count": 50,
            "average_handle_time": 420,  # 7 minutes
            "monthly_call_volume": 75428,  # Pre-calculated for 50 agents, 7-min AHT
            "cost_per_agent": 500,  # Default value, backend should use country baseline
            "country": "Bangladesh"
        }
        
        try:
            print(f"🧮 Testing mathematical accuracy with known values...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Test 1: Call Volume Formula Verification
                # Formula: agents × ((8×60)/7) × 22
                expected_calls_per_agent_per_day = (8 * 60) / 7  # 68.57
                expected_monthly_calls = int(50 * expected_calls_per_agent_per_day * 22)  # 75,428
                
                actual_call_volume = result.get("call_volume_processed", 0)
                if abs(actual_call_volume - expected_monthly_calls) <= 50:
                    self.log_test("Mathematical Verification - Call Volume Formula", True,
                                f"✅ Call volume formula correct: {actual_call_volume:,} ≈ {expected_monthly_calls:,}")
                else:
                    self.log_test("Mathematical Verification - Call Volume Formula", False,
                                f"❌ Call volume formula error: {actual_call_volume:,} ≠ {expected_monthly_calls:,}")
                
                # Test 2: Per-Call Cost Formula Verification
                traditional_total = result.get("traditional_total_cost", 0)
                ai_total = result.get("ai_total_cost", 0)
                traditional_per_call = result.get("traditional_cost_per_call", 0)
                ai_per_call = result.get("ai_cost_per_call", 0)
                
                expected_traditional_per_call = traditional_total / actual_call_volume if actual_call_volume > 0 else 0
                expected_ai_per_call = ai_total / actual_call_volume if actual_call_volume > 0 else 0
                
                if abs(traditional_per_call - expected_traditional_per_call) <= 0.01:
                    self.log_test("Mathematical Verification - Traditional Per-Call Formula", True,
                                f"✅ Traditional per-call formula correct: ${traditional_per_call:.3f}")
                else:
                    self.log_test("Mathematical Verification - Traditional Per-Call Formula", False,
                                f"❌ Traditional per-call formula error: ${traditional_per_call:.3f} ≠ ${expected_traditional_per_call:.3f}")
                
                if abs(ai_per_call - expected_ai_per_call) <= 0.01:
                    self.log_test("Mathematical Verification - AI Per-Call Formula", True,
                                f"✅ AI per-call formula correct: ${ai_per_call:.3f}")
                else:
                    self.log_test("Mathematical Verification - AI Per-Call Formula", False,
                                f"❌ AI per-call formula error: ${ai_per_call:.3f} ≠ ${expected_ai_per_call:.3f}")
                
                # Test 3: Cost Reduction Percentage Formula
                monthly_savings = result.get("monthly_savings", 0)
                cost_reduction_percentage = result.get("cost_reduction_percentage", 0)
                
                expected_cost_reduction = (monthly_savings / traditional_total * 100) if traditional_total > 0 else 0
                
                if abs(cost_reduction_percentage - expected_cost_reduction) <= 0.1:
                    self.log_test("Mathematical Verification - Cost Reduction Formula", True,
                                f"✅ Cost reduction formula correct: {cost_reduction_percentage:.1f}%")
                else:
                    self.log_test("Mathematical Verification - Cost Reduction Formula", False,
                                f"❌ Cost reduction formula error: {cost_reduction_percentage:.1f}% ≠ {expected_cost_reduction:.1f}%")
                
                # Test 4: Monthly Savings Formula
                expected_monthly_savings = traditional_total - ai_total
                
                if abs(monthly_savings - expected_monthly_savings) <= 1:
                    self.log_test("Mathematical Verification - Monthly Savings Formula", True,
                                f"✅ Monthly savings formula correct: ${monthly_savings:,.0f}")
                else:
                    self.log_test("Mathematical Verification - Monthly Savings Formula", False,
                                f"❌ Monthly savings formula error: ${monthly_savings:,.0f} ≠ ${expected_monthly_savings:,.0f}")
                
                print(f"📊 Mathematical Verification Results:")
                print(f"   Call Volume: {actual_call_volume:,} (formula: 50 × 68.57 × 22)")
                print(f"   Traditional Per-Call: ${traditional_per_call:.3f} (formula: ${traditional_total:,.0f} ÷ {actual_call_volume:,})")
                print(f"   AI Per-Call: ${ai_per_call:.3f} (formula: ${ai_total:,.0f} ÷ {actual_call_volume:,})")
                print(f"   Cost Reduction: {cost_reduction_percentage:.1f}% (formula: ${monthly_savings:,.0f} ÷ ${traditional_total:,.0f} × 100)")
                
            else:
                self.log_test("Mathematical Verification - API Response", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Mathematical Verification - Exception", False, f"Exception: {str(e)}")
    
    def test_api_validation_with_7min_aht(self):
        """Test API validation specifically with 7-minute AHT parameter"""
        print("\n=== Testing API Validation with 7-Minute AHT ===")
        
        # Test Case 1: Exact 7-minute AHT (420 seconds)
        test_data_1 = {
            "agent_count": 50,
            "average_handle_time": 420,  # Exactly 7 minutes
            "country": "Bangladesh"
        }
        
        # Calculate expected call volume for this scenario
        expected_call_volume = self.calculate_expected_call_volume(50, 7)
        test_data_1["monthly_call_volume"] = expected_call_volume
        
        try:
            print(f"🔍 Testing API with exact 7-minute AHT (420 seconds)...")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data_1, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("API Validation - 7-Minute AHT Acceptance", True,
                            f"✅ API accepts 420-second AHT successfully")
                
                # Verify the calculation uses the 7-minute AHT
                call_volume = result.get("call_volume_processed", 0)
                if abs(call_volume - expected_call_volume) <= 100:
                    self.log_test("API Validation - 7-Minute AHT Usage", True,
                                f"✅ API correctly uses 7-minute AHT in calculations")
                else:
                    self.log_test("API Validation - 7-Minute AHT Usage", False,
                                f"❌ API may not be using 7-minute AHT correctly")
                    
            else:
                self.log_test("API Validation - 7-Minute AHT Acceptance", False,
                            f"❌ API rejects 420-second AHT: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("API Validation - 7-Minute AHT Exception", False, f"Exception: {str(e)}")
        
        # Test Case 2: Verify AHT consistency across multiple requests
        print(f"🔍 Testing AHT consistency across multiple requests...")
        
        consistent_results = True
        baseline_call_volume = None
        
        for i in range(3):
            try:
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data_1, timeout=30)
                if response.status_code == 200:
                    result = response.json()
                    call_volume = result.get("call_volume_processed", 0)
                    
                    if baseline_call_volume is None:
                        baseline_call_volume = call_volume
                    elif abs(call_volume - baseline_call_volume) > 10:  # Allow minimal variance
                        consistent_results = False
                        break
                else:
                    consistent_results = False
                    break
                    
            except Exception:
                consistent_results = False
                break
        
        if consistent_results:
            self.log_test("API Validation - AHT Consistency", True,
                        f"✅ 7-minute AHT produces consistent results across multiple requests")
        else:
            self.log_test("API Validation - AHT Consistency", False,
                        f"❌ 7-minute AHT produces inconsistent results")
    
    def test_response_time_performance(self):
        """Test API response time performance"""
        print("\n=== Testing API Response Time Performance ===")
        
        test_data = {
            "agent_count": 50,
            "average_handle_time": 420,
            "monthly_call_volume": 75428,
            "country": "Bangladesh"
        }
        
        response_times = []
        successful_requests = 0
        
        for i in range(5):
            try:
                start_time = time.time()
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=30)
                end_time = time.time()
                
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                response_times.append(response_time)
                
                if response.status_code == 200:
                    successful_requests += 1
                    
            except Exception as e:
                print(f"   Request {i+1} failed: {str(e)}")
        
        if response_times:
            avg_response_time = sum(response_times) / len(response_times)
            max_response_time = max(response_times)
            min_response_time = min(response_times)
            
            # Test response time performance
            if avg_response_time <= 500:  # 500ms target
                self.log_test("Performance - Average Response Time", True,
                            f"✅ Average response time: {avg_response_time:.2f}ms (target: <500ms)")
            else:
                self.log_test("Performance - Average Response Time", False,
                            f"❌ Average response time: {avg_response_time:.2f}ms (target: <500ms)")
            
            if max_response_time <= 1000:  # 1 second max
                self.log_test("Performance - Maximum Response Time", True,
                            f"✅ Maximum response time: {max_response_time:.2f}ms (target: <1000ms)")
            else:
                self.log_test("Performance - Maximum Response Time", False,
                            f"❌ Maximum response time: {max_response_time:.2f}ms (target: <1000ms)")
            
            if successful_requests == 5:
                self.log_test("Performance - Request Success Rate", True,
                            f"✅ All 5 requests successful")
            else:
                self.log_test("Performance - Request Success Rate", False,
                            f"❌ Only {successful_requests}/5 requests successful")
            
            print(f"📊 Performance Test Results:")
            print(f"   Average Response Time: {avg_response_time:.2f}ms")
            print(f"   Min Response Time: {min_response_time:.2f}ms")
            print(f"   Max Response Time: {max_response_time:.2f}ms")
            print(f"   Successful Requests: {successful_requests}/5")
    
    def generate_test_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 ROI CALCULATOR TESTING SUMMARY - 7-MINUTE AHT VALIDATION")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📈 Overall Test Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📊 Success Rate: {success_rate:.1f}%")
        
        print(f"\n🎯 Key Test Categories:")
        
        # Categorize tests
        bangladesh_tests = [t for t in self.test_results if "Bangladesh" in t["test"]]
        philippines_tests = [t for t in self.test_results if "Philippines" in t["test"]]
        aht_tests = [t for t in self.test_results if "AHT" in t["test"]]
        math_tests = [t for t in self.test_results if "Mathematical" in t["test"]]
        performance_tests = [t for t in self.test_results if "Performance" in t["test"]]
        
        def category_summary(tests, category_name):
            if tests:
                passed = len([t for t in tests if t["passed"]])
                total = len(tests)
                rate = (passed / total) * 100
                print(f"   {category_name}: {passed}/{total} ({rate:.1f}%)")
        
        category_summary(bangladesh_tests, "Bangladesh 50 Agents Tests")
        category_summary(philippines_tests, "Philippines 100 Agents Tests")
        category_summary(aht_tests, "7-Minute AHT Tests")
        category_summary(math_tests, "Mathematical Verification Tests")
        category_summary(performance_tests, "Performance Tests")
        
        print(f"\n🔍 Failed Tests Analysis:")
        if failed_tests > 0:
            for test in self.test_results:
                if not test["passed"]:
                    print(f"   ❌ {test['test']}: {test['details']}")
        else:
            print(f"   ✅ No failed tests!")
        
        print(f"\n🏆 ROI Calculator Assessment:")
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - ROI Calculator with 7-minute AHT is working perfectly")
        elif success_rate >= 80:
            print(f"   ✅ GOOD - ROI Calculator is working well with minor issues")
        elif success_rate >= 70:
            print(f"   ⚠️ FAIR - ROI Calculator needs some improvements")
        else:
            print(f"   ❌ POOR - ROI Calculator has significant issues")
        
        return success_rate >= 80
    
    def run_comprehensive_roi_tests(self):
        """Run all ROI Calculator tests with 7-minute AHT focus"""
        print("🚀 Starting ROI Calculator Testing with Fixed 7-Minute AHT")
        print("=" * 80)
        print("Testing Requirements:")
        print("• Fixed AHT: All calculations should use 7 minutes AHT (420 seconds)")
        print("• Real Per-Call Costs: Verify accurate per-call cost calculations")
        print("• Bangladesh - 50 agents: Expected ~75,428 calls/month, $19k traditional, $10k AI")
        print("• Philippines - 100 agents: Expected ~150,856 calls/month, realistic baselines")
        print("• API Validation: Confirm backend accepts 7-minute AHT consistently")
        print("• Mathematical Verification: Confirm formulas and calculations are accurate")
        print("=" * 80)
        
        try:
            # Core test scenarios
            self.test_bangladesh_50_agents_scenario()
            self.test_philippines_100_agents_scenario()
            
            # AHT and API validation
            self.test_fixed_aht_consistency()
            self.test_api_validation_with_7min_aht()
            
            # Mathematical and performance verification
            self.test_mathematical_verification()
            self.test_response_time_performance()
            
        except Exception as e:
            print(f"❌ Critical error during ROI testing: {str(e)}")
            self.log_test("ROI Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive summary
        success = self.generate_test_summary()
        return success


def main():
    """Main function to run ROI Calculator tests"""
    print("🎯 ROI Calculator Testing with Fixed 7-Minute AHT")
    print("=" * 60)
    
    tester = ROICalculatorTester()
    success = tester.run_comprehensive_roi_tests()
    
    if success:
        print(f"\n🎉 ROI Calculator testing completed successfully!")
        return True
    else:
        print(f"\n⚠️ ROI Calculator testing completed with issues.")
        return False


if __name__ == "__main__":
    main()