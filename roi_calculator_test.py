#!/usr/bin/env python3
"""
Enhanced Market-Research-Backed ROI Calculator API Testing
Comprehensive validation of the new calculation algorithm and data models
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import statistics

# Backend URL from environment
BACKEND_URL = "https://sentra-performance.preview.emergentagent.com/api"

class ROICalculatorTester:
    """Comprehensive ROI Calculator API Testing Framework"""
    
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
    
    def test_market_research_algorithm_validation(self):
        """Test Market Research Algorithm with specific presets"""
        print("\n=== Testing Market Research Algorithm Validation ===")
        
        # Market Research Constants (from review request)
        EXPECTED_CONSTANTS = {
            "technology_cost": 200,  # per agent per month
            "infrastructure_cost": 150,  # per agent per month
            "twilio_voice": 0.018,  # per minute
            "ai_processing": 0.05,  # per call
            "platform_fee": 297,  # monthly
            "automation_rate": 75  # 75%
        }
        
        # Test presets from review request
        test_presets = [
            {
                "name": "Small Team",
                "agent_count": 10,
                "average_handle_time": 480,  # 8 minutes in seconds
                "monthly_call_volume": 5000,  # estimated for small team
                "cost_per_agent": 2800
            },
            {
                "name": "Mid-size",
                "agent_count": 50,
                "average_handle_time": 480,  # 8 minutes in seconds
                "monthly_call_volume": 25000,  # estimated for mid-size
                "cost_per_agent": 2800
            },
            {
                "name": "Enterprise",
                "agent_count": 200,
                "average_handle_time": 540,  # 9 minutes in seconds
                "monthly_call_volume": 100000,  # estimated for enterprise
                "cost_per_agent": 2900
            }
        ]
        
        for preset in test_presets:
            print(f"\n🧪 Testing {preset['name']} preset...")
            
            try:
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=preset, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Verify response structure
                    required_fields = [
                        "traditional_labor_cost", "traditional_technology_cost", 
                        "traditional_infrastructure_cost", "traditional_total_cost",
                        "ai_voice_cost", "ai_processing_cost", "ai_platform_fee", "ai_total_cost",
                        "monthly_savings", "annual_savings", "cost_reduction_percentage",
                        "roi_percentage", "payback_period_months",
                        "traditional_cost_per_call", "ai_cost_per_call",
                        "call_volume_processed", "automated_calls", "human_assisted_calls",
                        "automation_rate"
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in result]
                    
                    if not missing_fields:
                        # Validate calculations against market research constants
                        expected_traditional_total = (
                            preset["agent_count"] * preset["cost_per_agent"] +  # labor
                            preset["agent_count"] * EXPECTED_CONSTANTS["technology_cost"] +  # technology
                            preset["agent_count"] * EXPECTED_CONSTANTS["infrastructure_cost"]  # infrastructure
                        )
                        
                        # Calculate expected AI costs
                        avg_call_duration_min = preset["average_handle_time"] / 60
                        expected_ai_voice = preset["monthly_call_volume"] * avg_call_duration_min * EXPECTED_CONSTANTS["twilio_voice"]
                        expected_ai_processing = preset["monthly_call_volume"] * EXPECTED_CONSTANTS["ai_processing"]
                        expected_ai_total = expected_ai_voice + expected_ai_processing + EXPECTED_CONSTANTS["platform_fee"]
                        
                        # Validate traditional cost calculation
                        if abs(result["traditional_total_cost"] - expected_traditional_total) < 1:
                            self.log_test(f"{preset['name']} - Traditional Cost Calculation", True,
                                        f"Traditional cost: ${result['traditional_total_cost']:,.2f} (expected: ${expected_traditional_total:,.2f})")
                        else:
                            self.log_test(f"{preset['name']} - Traditional Cost Calculation", False,
                                        f"Traditional cost: ${result['traditional_total_cost']:,.2f} vs expected: ${expected_traditional_total:,.2f}")
                        
                        # Validate AI cost calculation
                        if abs(result["ai_total_cost"] - expected_ai_total) < 1:
                            self.log_test(f"{preset['name']} - AI Cost Calculation", True,
                                        f"AI cost: ${result['ai_total_cost']:,.2f} (expected: ${expected_ai_total:,.2f})")
                        else:
                            self.log_test(f"{preset['name']} - AI Cost Calculation", False,
                                        f"AI cost: ${result['ai_total_cost']:,.2f} vs expected: ${expected_ai_total:,.2f}")
                        
                        # Validate automation rate
                        if result["automation_rate"] == EXPECTED_CONSTANTS["automation_rate"]:
                            self.log_test(f"{preset['name']} - Automation Rate", True,
                                        f"Automation rate: {result['automation_rate']}% (expected: {EXPECTED_CONSTANTS['automation_rate']}%)")
                        else:
                            self.log_test(f"{preset['name']} - Automation Rate", False,
                                        f"Automation rate: {result['automation_rate']}% vs expected: {EXPECTED_CONSTANTS['automation_rate']}%")
                        
                        # Validate savings calculation
                        expected_savings = expected_traditional_total - expected_ai_total
                        if abs(result["monthly_savings"] - expected_savings) < 1:
                            self.log_test(f"{preset['name']} - Savings Calculation", True,
                                        f"Monthly savings: ${result['monthly_savings']:,.2f} (expected: ${expected_savings:,.2f})")
                        else:
                            self.log_test(f"{preset['name']} - Savings Calculation", False,
                                        f"Monthly savings: ${result['monthly_savings']:,.2f} vs expected: ${expected_savings:,.2f}")
                        
                        # Validate ROI percentage
                        expected_roi = (expected_savings * 12) / (expected_ai_total * 12) * 100 if expected_ai_total > 0 else 0
                        if abs(result["roi_percentage"] - expected_roi) < 5:  # Allow 5% tolerance
                            self.log_test(f"{preset['name']} - ROI Percentage", True,
                                        f"ROI: {result['roi_percentage']:.1f}% (expected: {expected_roi:.1f}%)")
                        else:
                            self.log_test(f"{preset['name']} - ROI Percentage", False,
                                        f"ROI: {result['roi_percentage']:.1f}% vs expected: {expected_roi:.1f}%")
                        
                        # Validate payback period
                        expected_payback = (expected_ai_total * 12) / expected_savings if expected_savings > 0 else float('inf')
                        if expected_payback != float('inf') and abs(result["payback_period_months"] - expected_payback) < 1:
                            self.log_test(f"{preset['name']} - Payback Period", True,
                                        f"Payback: {result['payback_period_months']:.1f} months (expected: {expected_payback:.1f})")
                        else:
                            self.log_test(f"{preset['name']} - Payback Period", False,
                                        f"Payback: {result['payback_period_months']:.1f} months vs expected: {expected_payback:.1f}")
                        
                        # Validate realistic savings (30-70% cost reduction as per review)
                        cost_reduction = result["cost_reduction_percentage"]
                        if 30 <= cost_reduction <= 70:
                            self.log_test(f"{preset['name']} - Realistic Savings Range", True,
                                        f"Cost reduction: {cost_reduction:.1f}% (within 30-70% range)")
                        else:
                            self.log_test(f"{preset['name']} - Realistic Savings Range", False,
                                        f"Cost reduction: {cost_reduction:.1f}% (outside 30-70% range)")
                        
                        # Validate Enterprise ROI expectations (200-500% for enterprise)
                        if preset["name"] == "Enterprise":
                            if 200 <= result["roi_percentage"] <= 500:
                                self.log_test(f"{preset['name']} - Enterprise ROI Range", True,
                                            f"Enterprise ROI: {result['roi_percentage']:.1f}% (within 200-500% range)")
                            else:
                                self.log_test(f"{preset['name']} - Enterprise ROI Range", False,
                                            f"Enterprise ROI: {result['roi_percentage']:.1f}% (outside 200-500% range)")
                        
                        # Validate reasonable payback period (6-24 months)
                        if 6 <= result["payback_period_months"] <= 24:
                            self.log_test(f"{preset['name']} - Reasonable Payback Period", True,
                                        f"Payback period: {result['payback_period_months']:.1f} months (within 6-24 month range)")
                        else:
                            self.log_test(f"{preset['name']} - Reasonable Payback Period", False,
                                        f"Payback period: {result['payback_period_months']:.1f} months (outside 6-24 month range)")
                        
                    else:
                        self.log_test(f"{preset['name']} - Response Structure", False,
                                    f"Missing fields: {missing_fields}")
                else:
                    self.log_test(f"{preset['name']} - API Response", False,
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"{preset['name']} - Exception", False, f"Exception: {str(e)}")
    
    def test_input_validation_edge_cases(self):
        """Test input validation and edge cases"""
        print("\n=== Testing Input Validation & Edge Cases ===")
        
        edge_cases = [
            {
                "name": "Minimum Values",
                "data": {
                    "agent_count": 1,
                    "average_handle_time": 120,  # 2 minutes
                    "monthly_call_volume": 100,
                    "cost_per_agent": 1000
                },
                "should_pass": True
            },
            {
                "name": "Maximum Values",
                "data": {
                    "agent_count": 500,
                    "average_handle_time": 1200,  # 20 minutes
                    "monthly_call_volume": 1000000,
                    "cost_per_agent": 5000
                },
                "should_pass": True
            },
            {
                "name": "Zero Agent Count",
                "data": {
                    "agent_count": 0,
                    "average_handle_time": 480,
                    "monthly_call_volume": 5000,
                    "cost_per_agent": 2800
                },
                "should_pass": False
            },
            {
                "name": "Negative Values",
                "data": {
                    "agent_count": -10,
                    "average_handle_time": 480,
                    "monthly_call_volume": 5000,
                    "cost_per_agent": 2800
                },
                "should_pass": False
            },
            {
                "name": "Missing Required Fields",
                "data": {
                    "agent_count": 10,
                    "average_handle_time": 480
                    # Missing monthly_call_volume and cost_per_agent
                },
                "should_pass": False
            },
            {
                "name": "Very High AHT",
                "data": {
                    "agent_count": 10,
                    "average_handle_time": 3600,  # 1 hour
                    "monthly_call_volume": 1000,
                    "cost_per_agent": 2800
                },
                "should_pass": True
            },
            {
                "name": "Very Low Cost Per Agent",
                "data": {
                    "agent_count": 10,
                    "average_handle_time": 480,
                    "monthly_call_volume": 5000,
                    "cost_per_agent": 500
                },
                "should_pass": True
            }
        ]
        
        for case in edge_cases:
            print(f"\n🧪 Testing {case['name']}...")
            
            try:
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=case["data"], timeout=10)
                
                if case["should_pass"]:
                    if response.status_code == 200:
                        result = response.json()
                        # Verify basic calculation logic
                        if all(key in result for key in ["traditional_total_cost", "ai_total_cost", "monthly_savings"]):
                            self.log_test(f"Edge Case - {case['name']}", True,
                                        f"Valid calculation: Traditional=${result['traditional_total_cost']:,.2f}, AI=${result['ai_total_cost']:,.2f}")
                        else:
                            self.log_test(f"Edge Case - {case['name']}", False,
                                        f"Missing calculation fields in response")
                    else:
                        self.log_test(f"Edge Case - {case['name']}", False,
                                    f"Expected success but got HTTP {response.status_code}")
                else:
                    if response.status_code != 200:
                        self.log_test(f"Edge Case - {case['name']}", True,
                                    f"Correctly rejected invalid input: HTTP {response.status_code}")
                    else:
                        self.log_test(f"Edge Case - {case['name']}", False,
                                    f"Should have rejected invalid input but returned HTTP 200")
                        
            except Exception as e:
                if case["should_pass"]:
                    self.log_test(f"Edge Case - {case['name']}", False, f"Unexpected exception: {str(e)}")
                else:
                    self.log_test(f"Edge Case - {case['name']}", True, f"Correctly handled with exception: {str(e)}")
    
    def test_api_endpoints(self):
        """Test all ROI Calculator API endpoints"""
        print("\n=== Testing API Endpoints ===")
        
        # Test data for endpoint testing
        test_input = {
            "agent_count": 25,
            "average_handle_time": 420,  # 7 minutes
            "monthly_call_volume": 12000,
            "cost_per_agent": 2750
        }
        
        # Test 1: POST /api/roi/calculate
        print("\n🧪 Testing POST /api/roi/calculate...")
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_input, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("API Endpoint - Calculate", True,
                            f"Calculate endpoint working: ${result.get('monthly_savings', 0):,.2f} monthly savings")
                
                # Store result for save test
                self.test_calculation_result = result
            else:
                self.log_test("API Endpoint - Calculate", False,
                            f"Calculate endpoint failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("API Endpoint - Calculate", False, f"Calculate endpoint exception: {str(e)}")
        
        # Test 2: POST /api/roi/save
        print("\n🧪 Testing POST /api/roi/save...")
        try:
            save_request = {
                "input_data": test_input,
                "user_info": {
                    "user_id": "test_user_123",
                    "company": "Test Company",
                    "preset_used": "Custom"
                }
            }
            
            response = requests.post(f"{BACKEND_URL}/roi/save", json=save_request, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if "id" in result and "timestamp" in result:
                    self.log_test("API Endpoint - Save", True,
                                f"Save endpoint working: ID {result['id']}")
                    self.test_saved_calculation_id = result["id"]
                else:
                    self.log_test("API Endpoint - Save", False,
                                f"Save endpoint missing required fields")
            else:
                self.log_test("API Endpoint - Save", False,
                            f"Save endpoint failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("API Endpoint - Save", False, f"Save endpoint exception: {str(e)}")
        
        # Test 3: GET /api/roi/calculations
        print("\n🧪 Testing GET /api/roi/calculations...")
        try:
            response = requests.get(f"{BACKEND_URL}/roi/calculations?limit=10", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list):
                    self.log_test("API Endpoint - Retrieve", True,
                                f"Retrieve endpoint working: {len(result)} calculations found")
                    
                    # Verify data persistence if we saved a calculation
                    if hasattr(self, 'test_saved_calculation_id'):
                        found_saved = any(calc.get("id") == self.test_saved_calculation_id for calc in result)
                        if found_saved:
                            self.log_test("API Endpoint - Data Persistence", True,
                                        f"Saved calculation found in retrieve results")
                        else:
                            self.log_test("API Endpoint - Data Persistence", False,
                                        f"Saved calculation not found in retrieve results")
                else:
                    self.log_test("API Endpoint - Retrieve", False,
                                f"Retrieve endpoint returned non-list: {type(result)}")
            else:
                self.log_test("API Endpoint - Retrieve", False,
                            f"Retrieve endpoint failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("API Endpoint - Retrieve", False, f"Retrieve endpoint exception: {str(e)}")
    
    def test_calculation_accuracy(self):
        """Test mathematical accuracy of calculations"""
        print("\n=== Testing Calculation Accuracy ===")
        
        # Test with known values for manual verification
        test_case = {
            "agent_count": 20,
            "average_handle_time": 300,  # 5 minutes
            "monthly_call_volume": 10000,
            "cost_per_agent": 3000
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_case, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Manual calculation verification
                expected_traditional_labor = test_case["agent_count"] * test_case["cost_per_agent"]  # 20 * 3000 = 60000
                expected_traditional_tech = test_case["agent_count"] * 200  # 20 * 200 = 4000
                expected_traditional_infra = test_case["agent_count"] * 150  # 20 * 150 = 3000
                expected_traditional_total = expected_traditional_labor + expected_traditional_tech + expected_traditional_infra  # 67000
                
                # AI costs
                call_duration_min = test_case["average_handle_time"] / 60  # 5 minutes
                expected_ai_voice = test_case["monthly_call_volume"] * call_duration_min * 0.018  # 10000 * 5 * 0.018 = 900
                expected_ai_processing = test_case["monthly_call_volume"] * 0.05  # 10000 * 0.05 = 500
                expected_ai_platform = 297
                expected_ai_total = expected_ai_voice + expected_ai_processing + expected_ai_platform  # 1697
                
                expected_monthly_savings = expected_traditional_total - expected_ai_total  # 67000 - 1697 = 65303
                expected_annual_savings = expected_monthly_savings * 12  # 783636
                expected_cost_reduction = (expected_monthly_savings / expected_traditional_total) * 100  # 97.47%
                expected_roi = (expected_annual_savings / (expected_ai_total * 12)) * 100  # 3847%
                
                # Verify calculations with tolerance
                tolerance = 0.01  # 1% tolerance for floating point calculations
                
                # Traditional cost verification
                if abs(result["traditional_total_cost"] - expected_traditional_total) / expected_traditional_total < tolerance:
                    self.log_test("Calculation Accuracy - Traditional Cost", True,
                                f"Traditional cost accurate: ${result['traditional_total_cost']:,.2f}")
                else:
                    self.log_test("Calculation Accuracy - Traditional Cost", False,
                                f"Traditional cost: ${result['traditional_total_cost']:,.2f} vs expected: ${expected_traditional_total:,.2f}")
                
                # AI cost verification
                if abs(result["ai_total_cost"] - expected_ai_total) / expected_ai_total < tolerance:
                    self.log_test("Calculation Accuracy - AI Cost", True,
                                f"AI cost accurate: ${result['ai_total_cost']:,.2f}")
                else:
                    self.log_test("Calculation Accuracy - AI Cost", False,
                                f"AI cost: ${result['ai_total_cost']:,.2f} vs expected: ${expected_ai_total:,.2f}")
                
                # Savings verification
                if abs(result["monthly_savings"] - expected_monthly_savings) / expected_monthly_savings < tolerance:
                    self.log_test("Calculation Accuracy - Monthly Savings", True,
                                f"Monthly savings accurate: ${result['monthly_savings']:,.2f}")
                else:
                    self.log_test("Calculation Accuracy - Monthly Savings", False,
                                f"Monthly savings: ${result['monthly_savings']:,.2f} vs expected: ${expected_monthly_savings:,.2f}")
                
                # ROI verification
                if abs(result["roi_percentage"] - expected_roi) / expected_roi < tolerance:
                    self.log_test("Calculation Accuracy - ROI Percentage", True,
                                f"ROI accurate: {result['roi_percentage']:.1f}%")
                else:
                    self.log_test("Calculation Accuracy - ROI Percentage", False,
                                f"ROI: {result['roi_percentage']:.1f}% vs expected: {expected_roi:.1f}%")
                
                # Per-call cost verification
                expected_traditional_per_call = expected_traditional_total / test_case["monthly_call_volume"]
                expected_ai_per_call = expected_ai_total / test_case["monthly_call_volume"]
                
                if abs(result["traditional_cost_per_call"] - expected_traditional_per_call) / expected_traditional_per_call < tolerance:
                    self.log_test("Calculation Accuracy - Traditional Cost Per Call", True,
                                f"Traditional cost per call accurate: ${result['traditional_cost_per_call']:.2f}")
                else:
                    self.log_test("Calculation Accuracy - Traditional Cost Per Call", False,
                                f"Traditional cost per call: ${result['traditional_cost_per_call']:.2f} vs expected: ${expected_traditional_per_call:.2f}")
                
                if abs(result["ai_cost_per_call"] - expected_ai_per_call) / expected_ai_per_call < tolerance:
                    self.log_test("Calculation Accuracy - AI Cost Per Call", True,
                                f"AI cost per call accurate: ${result['ai_cost_per_call']:.2f}")
                else:
                    self.log_test("Calculation Accuracy - AI Cost Per Call", False,
                                f"AI cost per call: ${result['ai_cost_per_call']:.2f} vs expected: ${expected_ai_per_call:.2f}")
                
                # Volume metrics verification
                expected_automated_calls = int(test_case["monthly_call_volume"] * 0.75)  # 75% automation
                expected_human_calls = test_case["monthly_call_volume"] - expected_automated_calls
                
                if result["automated_calls"] == expected_automated_calls:
                    self.log_test("Calculation Accuracy - Automated Calls", True,
                                f"Automated calls accurate: {result['automated_calls']:,}")
                else:
                    self.log_test("Calculation Accuracy - Automated Calls", False,
                                f"Automated calls: {result['automated_calls']:,} vs expected: {expected_automated_calls:,}")
                
                if result["human_assisted_calls"] == expected_human_calls:
                    self.log_test("Calculation Accuracy - Human Assisted Calls", True,
                                f"Human assisted calls accurate: {result['human_assisted_calls']:,}")
                else:
                    self.log_test("Calculation Accuracy - Human Assisted Calls", False,
                                f"Human assisted calls: {result['human_assisted_calls']:,} vs expected: {expected_human_calls:,}")
                
            else:
                self.log_test("Calculation Accuracy - API Response", False,
                            f"API failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Calculation Accuracy - Exception", False, f"Exception: {str(e)}")
    
    def test_performance_and_caching(self):
        """Test response times and caching integration"""
        print("\n=== Testing Performance & Caching ===")
        
        test_input = {
            "agent_count": 30,
            "average_handle_time": 360,  # 6 minutes
            "monthly_call_volume": 15000,
            "cost_per_agent": 2850
        }
        
        response_times = []
        
        # Test multiple requests to check performance and caching
        for i in range(5):
            try:
                start_time = time.time()
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_input, timeout=10)
                end_time = time.time()
                
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                response_times.append(response_time)
                
                if response.status_code == 200:
                    print(f"   Request {i+1}: {response_time:.2f}ms")
                else:
                    self.log_test(f"Performance Test - Request {i+1}", False,
                                f"HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Performance Test - Request {i+1}", False, f"Exception: {str(e)}")
        
        if response_times:
            avg_response_time = statistics.mean(response_times)
            min_response_time = min(response_times)
            max_response_time = max(response_times)
            
            # Test average response time (should be < 100ms for cached responses)
            if avg_response_time < 200:  # 200ms threshold for complex calculations
                self.log_test("Performance - Average Response Time", True,
                            f"Average response time: {avg_response_time:.2f}ms")
            else:
                self.log_test("Performance - Average Response Time", False,
                            f"Average response time too slow: {avg_response_time:.2f}ms")
            
            # Test response time consistency
            if max_response_time - min_response_time < 500:  # Less than 500ms variance
                self.log_test("Performance - Response Time Consistency", True,
                            f"Response time variance: {max_response_time - min_response_time:.2f}ms")
            else:
                self.log_test("Performance - Response Time Consistency", False,
                            f"High response time variance: {max_response_time - min_response_time:.2f}ms")
            
            # Test for potential caching (second request should be faster)
            if len(response_times) >= 2 and response_times[1] <= response_times[0]:
                self.log_test("Performance - Caching Indication", True,
                            f"Potential caching detected: {response_times[0]:.2f}ms -> {response_times[1]:.2f}ms")
            else:
                self.log_test("Performance - Caching Indication", False,
                            f"No clear caching benefit detected")
    
    def test_concurrent_requests(self):
        """Test concurrent calculation requests"""
        print("\n=== Testing Concurrent Requests ===")
        
        import concurrent.futures
        import threading
        
        def make_roi_request(request_id):
            test_input = {
                "agent_count": 10 + request_id,  # Vary input slightly
                "average_handle_time": 300 + (request_id * 30),
                "monthly_call_volume": 5000 + (request_id * 1000),
                "cost_per_agent": 2800 + (request_id * 50)
            }
            
            try:
                start_time = time.time()
                response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_input, timeout=15)
                end_time = time.time()
                
                return {
                    "request_id": request_id,
                    "success": response.status_code == 200,
                    "response_time": (end_time - start_time) * 1000,
                    "status_code": response.status_code
                }
            except Exception as e:
                return {
                    "request_id": request_id,
                    "success": False,
                    "response_time": 15000,  # Timeout
                    "error": str(e)
                }
        
        # Execute 10 concurrent requests
        print("🚀 Executing 10 concurrent ROI calculation requests...")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_roi_request, i) for i in range(10)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        # Analyze results
        successful_requests = [r for r in results if r["success"]]
        failed_requests = [r for r in results if not r["success"]]
        
        success_rate = (len(successful_requests) / len(results)) * 100
        
        if success_rate >= 90:
            self.log_test("Concurrent Requests - Success Rate", True,
                        f"Success rate: {success_rate:.1f}% ({len(successful_requests)}/{len(results)})")
        else:
            self.log_test("Concurrent Requests - Success Rate", False,
                        f"Success rate: {success_rate:.1f}% ({len(successful_requests)}/{len(results)})")
        
        if successful_requests:
            response_times = [r["response_time"] for r in successful_requests]
            avg_concurrent_response_time = statistics.mean(response_times)
            
            if avg_concurrent_response_time < 1000:  # 1 second threshold for concurrent requests
                self.log_test("Concurrent Requests - Response Time", True,
                            f"Average concurrent response time: {avg_concurrent_response_time:.2f}ms")
            else:
                self.log_test("Concurrent Requests - Response Time", False,
                            f"Concurrent response time too slow: {avg_concurrent_response_time:.2f}ms")
    
    def generate_comprehensive_report(self):
        """Generate comprehensive ROI Calculator testing report"""
        print("\n" + "=" * 80)
        print("📊 ENHANCED ROI CALCULATOR API TESTING - COMPREHENSIVE REPORT")
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
        
        # Test category breakdown
        categories = {
            "Market Research Algorithm": [t for t in self.test_results if "Small Team" in t["test"] or "Mid-size" in t["test"] or "Enterprise" in t["test"]],
            "Input Validation": [t for t in self.test_results if "Edge Case" in t["test"]],
            "API Endpoints": [t for t in self.test_results if "API Endpoint" in t["test"]],
            "Calculation Accuracy": [t for t in self.test_results if "Calculation Accuracy" in t["test"]],
            "Performance": [t for t in self.test_results if "Performance" in t["test"] or "Concurrent" in t["test"]]
        }
        
        print(f"\n📊 Test Category Breakdown:")
        for category, tests in categories.items():
            if tests:
                category_passed = len([t for t in tests if t["passed"]])
                category_total = len(tests)
                category_rate = (category_passed / category_total) * 100 if category_total > 0 else 0
                print(f"   {category}: {category_passed}/{category_total} ({category_rate:.1f}%)")
        
        # Market research validation summary
        print(f"\n🧪 Market Research Algorithm Validation:")
        market_tests = [t for t in self.test_results if any(preset in t["test"] for preset in ["Small Team", "Mid-size", "Enterprise"])]
        if market_tests:
            market_passed = len([t for t in market_tests if t["passed"]])
            market_total = len(market_tests)
            print(f"   Preset Validation: {market_passed}/{market_total} tests passed")
            
            # Check if all presets were tested
            presets_tested = set()
            for test in market_tests:
                if "Small Team" in test["test"]:
                    presets_tested.add("Small Team")
                elif "Mid-size" in test["test"]:
                    presets_tested.add("Mid-size")
                elif "Enterprise" in test["test"]:
                    presets_tested.add("Enterprise")
            
            print(f"   Presets Tested: {', '.join(presets_tested)}")
        
        # Failed tests summary
        if failed_tests > 0:
            print(f"\n❌ Failed Tests Summary:")
            for test in self.test_results:
                if not test["passed"]:
                    print(f"   • {test['test']}: {test['details']}")
        
        # ROI Calculator readiness assessment
        print(f"\n🎯 ROI Calculator Readiness Assessment:")
        
        readiness_score = 0
        max_score = 0
        
        # Criteria 1: Market Research Algorithm (40 points)
        max_score += 40
        market_tests = [t for t in self.test_results if any(preset in t["test"] for preset in ["Small Team", "Mid-size", "Enterprise"])]
        if market_tests:
            market_passed = len([t for t in market_tests if t["passed"]])
            market_total = len(market_tests)
            market_score = (market_passed / market_total) * 40 if market_total > 0 else 0
            readiness_score += market_score
            
            if market_score >= 32:  # 80% of 40 points
                print(f"   ✅ Market Research Algorithm: PASS ({market_passed}/{market_total} tests)")
            else:
                print(f"   ❌ Market Research Algorithm: FAIL ({market_passed}/{market_total} tests)")
        
        # Criteria 2: API Endpoints (25 points)
        max_score += 25
        api_tests = [t for t in self.test_results if "API Endpoint" in t["test"]]
        if api_tests:
            api_passed = len([t for t in api_tests if t["passed"]])
            api_total = len(api_tests)
            api_score = (api_passed / api_total) * 25 if api_total > 0 else 0
            readiness_score += api_score
            
            if api_score >= 20:  # 80% of 25 points
                print(f"   ✅ API Endpoints: PASS ({api_passed}/{api_total} tests)")
            else:
                print(f"   ❌ API Endpoints: FAIL ({api_passed}/{api_total} tests)")
        
        # Criteria 3: Calculation Accuracy (25 points)
        max_score += 25
        calc_tests = [t for t in self.test_results if "Calculation Accuracy" in t["test"]]
        if calc_tests:
            calc_passed = len([t for t in calc_tests if t["passed"]])
            calc_total = len(calc_tests)
            calc_score = (calc_passed / calc_total) * 25 if calc_total > 0 else 0
            readiness_score += calc_score
            
            if calc_score >= 20:  # 80% of 25 points
                print(f"   ✅ Calculation Accuracy: PASS ({calc_passed}/{calc_total} tests)")
            else:
                print(f"   ❌ Calculation Accuracy: FAIL ({calc_passed}/{calc_total} tests)")
        
        # Criteria 4: Performance (10 points)
        max_score += 10
        perf_tests = [t for t in self.test_results if "Performance" in t["test"] or "Concurrent" in t["test"]]
        if perf_tests:
            perf_passed = len([t for t in perf_tests if t["passed"]])
            perf_total = len(perf_tests)
            perf_score = (perf_passed / perf_total) * 10 if perf_total > 0 else 0
            readiness_score += perf_score
            
            if perf_score >= 8:  # 80% of 10 points
                print(f"   ✅ Performance: PASS ({perf_passed}/{perf_total} tests)")
            else:
                print(f"   ❌ Performance: FAIL ({perf_passed}/{perf_total} tests)")
        
        # Final readiness score
        final_readiness = (readiness_score / max_score) * 100 if max_score > 0 else 0
        
        print(f"\n🏆 FINAL ROI CALCULATOR READINESS SCORE: {final_readiness:.1f}%")
        
        if final_readiness >= 90:
            print(f"   🎉 EXCELLENT - Enhanced ROI Calculator ready for production")
        elif final_readiness >= 80:
            print(f"   ✅ GOOD - ROI Calculator ready with minor optimizations")
        elif final_readiness >= 70:
            print(f"   ⚠️ FAIR - ROI Calculator needs improvements")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        market_tests = [t for t in self.test_results if any(preset in t["test"] for preset in ["Small Team", "Mid-size", "Enterprise"])]
        if market_tests:
            market_failed = len([t for t in market_tests if not t["passed"]])
            if market_failed > 0:
                print(f"   • Fix {market_failed} market research algorithm issues")
        
        calc_tests = [t for t in self.test_results if "Calculation Accuracy" in t["test"]]
        if calc_tests:
            calc_failed = len([t for t in calc_tests if not t["passed"]])
            if calc_failed > 0:
                print(f"   • Verify {calc_failed} calculation accuracy issues")
        
        print(f"   • Validate against real-world BPO cost data")
        print(f"   • Consider implementing preset templates for common scenarios")
        print(f"   • Add input validation for extreme edge cases")
        
        return final_readiness >= 80  # Return True if ready for production
    
    def run_comprehensive_roi_tests(self):
        """Run all comprehensive ROI Calculator tests"""
        print("🚀 Starting Enhanced ROI Calculator API Testing")
        print("=" * 80)
        print("Testing market-research-backed ROI Calculator with:")
        print("• Market Research Algorithm Validation (Small/Mid-size/Enterprise presets)")
        print("• Input Validation & Edge Cases")
        print("• API Endpoint Testing (calculate, save, retrieve)")
        print("• Mathematical Calculation Accuracy")
        print("• Performance & Caching Integration")
        print("• Concurrent Request Handling")
        print("=" * 80)
        
        # Execute all ROI Calculator tests
        try:
            # Core algorithm validation
            self.test_market_research_algorithm_validation()
            
            # Input validation and edge cases
            self.test_input_validation_edge_cases()
            
            # API endpoint testing
            self.test_api_endpoints()
            
            # Mathematical accuracy
            self.test_calculation_accuracy()
            
            # Performance testing
            self.test_performance_and_caching()
            
            # Concurrent request testing
            self.test_concurrent_requests()
            
        except Exception as e:
            print(f"❌ Critical error during ROI Calculator testing: {str(e)}")
            self.log_test("ROI Calculator Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        readiness_score = self.generate_comprehensive_report()
        
        return readiness_score  # Return True if ready for production


def main():
    """Main function to run ROI Calculator tests"""
    print("🎯 Enhanced Market-Research-Backed ROI Calculator API Testing")
    print("=" * 80)
    
    # Initialize tester
    tester = ROICalculatorTester()
    
    # Run comprehensive tests
    is_ready = tester.run_comprehensive_roi_tests()
    
    print("\n" + "=" * 80)
    if is_ready:
        print("🎉 ROI CALCULATOR TESTING COMPLETE - READY FOR PRODUCTION!")
    else:
        print("⚠️ ROI CALCULATOR TESTING COMPLETE - NEEDS IMPROVEMENTS")
    print("=" * 80)
    
    return is_ready


if __name__ == "__main__":
    main()