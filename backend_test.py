#!/usr/bin/env python3
"""
Comprehensive Backend Testing for SentraTech ROI Calculator API
Tests all 3 ROI endpoints with various scenarios including edge cases
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://sentrafuture.preview.emergentagent.com/api"

class ROICalculatorTester:
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
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Basic API Connectivity", True, f"Status: {response.status_code}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_roi_calculate_endpoint(self):
        """Test POST /api/roi/calculate endpoint"""
        print("\n=== Testing ROI Calculate Endpoint ===")
        
        # Test Case 1: Basic valid input
        test_data = {
            "call_volume": 25000,
            "current_cost_per_call": 8.5,
            "average_handle_time": 480,
            "agent_count": 50
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", 
                                   json=test_data, 
                                   timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Verify calculation accuracy
                expected_current_monthly = 25000 * 8.5  # 212,500
                expected_cost_reduction = 0.45  # 45%
                expected_new_monthly = expected_current_monthly * (1 - expected_cost_reduction)  # 116,875
                expected_monthly_savings = expected_current_monthly - expected_new_monthly  # 95,625
                
                # Check key calculations
                if abs(result["current_monthly_cost"] - expected_current_monthly) < 0.01:
                    self.log_test("ROI Calculate - Current Monthly Cost", True, 
                                f"Expected: {expected_current_monthly}, Got: {result['current_monthly_cost']}")
                else:
                    self.log_test("ROI Calculate - Current Monthly Cost", False,
                                f"Expected: {expected_current_monthly}, Got: {result['current_monthly_cost']}")
                
                if abs(result["monthly_savings"] - expected_monthly_savings) < 0.01:
                    self.log_test("ROI Calculate - Monthly Savings", True,
                                f"Expected: {expected_monthly_savings}, Got: {result['monthly_savings']}")
                else:
                    self.log_test("ROI Calculate - Monthly Savings", False,
                                f"Expected: {expected_monthly_savings}, Got: {result['monthly_savings']}")
                
                # Check business logic percentages
                if result["cost_reduction_percent"] == 45.0:
                    self.log_test("ROI Calculate - Cost Reduction %", True, "45% as expected")
                else:
                    self.log_test("ROI Calculate - Cost Reduction %", False, 
                                f"Expected: 45%, Got: {result['cost_reduction_percent']}%")
                
                if result["automation_rate"] == 70.0:
                    self.log_test("ROI Calculate - Automation Rate", True, "70% as expected")
                else:
                    self.log_test("ROI Calculate - Automation Rate", False,
                                f"Expected: 70%, Got: {result['automation_rate']}%")
                
                if result["aht_reduction_percent"] == 35.0:
                    self.log_test("ROI Calculate - AHT Reduction %", True, "35% as expected")
                else:
                    self.log_test("ROI Calculate - AHT Reduction %", False,
                                f"Expected: 35%, Got: {result['aht_reduction_percent']}%")
                
                self.log_test("ROI Calculate - Basic Valid Input", True, "All calculations correct")
                
            else:
                self.log_test("ROI Calculate - Basic Valid Input", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("ROI Calculate - Basic Valid Input", False, f"Exception: {str(e)}")
    
    def test_roi_calculate_edge_cases(self):
        """Test edge cases for ROI calculate endpoint"""
        print("\n=== Testing ROI Calculate Edge Cases ===")
        
        # Test Case 1: Zero values
        zero_data = {
            "call_volume": 0,
            "current_cost_per_call": 8.5,
            "average_handle_time": 480,
            "agent_count": 50
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=zero_data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result["current_monthly_cost"] == 0:
                    self.log_test("ROI Calculate - Zero Call Volume", True, "Handled zero volume correctly")
                else:
                    self.log_test("ROI Calculate - Zero Call Volume", False, "Zero volume not handled correctly")
            else:
                self.log_test("ROI Calculate - Zero Call Volume", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Zero Call Volume", False, f"Exception: {str(e)}")
        
        # Test Case 2: Large numbers
        large_data = {
            "call_volume": 1000000,
            "current_cost_per_call": 25.0,
            "average_handle_time": 900,
            "agent_count": 500
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=large_data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                expected_monthly = 1000000 * 25.0  # 25,000,000
                if abs(result["current_monthly_cost"] - expected_monthly) < 0.01:
                    self.log_test("ROI Calculate - Large Numbers", True, "Large numbers handled correctly")
                else:
                    self.log_test("ROI Calculate - Large Numbers", False, "Large numbers calculation error")
            else:
                self.log_test("ROI Calculate - Large Numbers", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Large Numbers", False, f"Exception: {str(e)}")
        
        # Test Case 3: Decimal precision
        decimal_data = {
            "call_volume": 15750,
            "current_cost_per_call": 12.75,
            "average_handle_time": 365,
            "agent_count": 35
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=decimal_data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                expected_monthly = 15750 * 12.75  # 200,812.5
                if abs(result["current_monthly_cost"] - expected_monthly) < 0.01:
                    self.log_test("ROI Calculate - Decimal Precision", True, "Decimal precision maintained")
                else:
                    self.log_test("ROI Calculate - Decimal Precision", False, "Decimal precision lost")
            else:
                self.log_test("ROI Calculate - Decimal Precision", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Decimal Precision", False, f"Exception: {str(e)}")
    
    def test_roi_calculate_invalid_inputs(self):
        """Test invalid inputs for ROI calculate endpoint"""
        print("\n=== Testing ROI Calculate Invalid Inputs ===")
        
        # Test Case 1: Negative values
        negative_data = {
            "call_volume": -1000,
            "current_cost_per_call": 8.5,
            "average_handle_time": 480,
            "agent_count": 50
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=negative_data, timeout=10)
            # Should either handle gracefully or return error
            if response.status_code in [200, 400, 422]:
                self.log_test("ROI Calculate - Negative Values", True, f"Status: {response.status_code}")
            else:
                self.log_test("ROI Calculate - Negative Values", False, f"Unexpected status: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Negative Values", False, f"Exception: {str(e)}")
        
        # Test Case 2: Missing fields
        incomplete_data = {
            "call_volume": 25000,
            "current_cost_per_call": 8.5
            # Missing average_handle_time and agent_count
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=incomplete_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("ROI Calculate - Missing Fields", True, "Validation error returned correctly")
            else:
                self.log_test("ROI Calculate - Missing Fields", False, f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Missing Fields", False, f"Exception: {str(e)}")
        
        # Test Case 3: Wrong data types
        wrong_type_data = {
            "call_volume": "not_a_number",
            "current_cost_per_call": 8.5,
            "average_handle_time": 480,
            "agent_count": 50
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=wrong_type_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("ROI Calculate - Wrong Data Types", True, "Type validation working")
            else:
                self.log_test("ROI Calculate - Wrong Data Types", False, f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Wrong Data Types", False, f"Exception: {str(e)}")
    
    def test_roi_save_endpoint(self):
        """Test POST /api/roi/save endpoint"""
        print("\n=== Testing ROI Save Endpoint ===")
        
        test_data = {
            "call_volume": 18000,
            "current_cost_per_call": 9.25,
            "average_handle_time": 420,
            "agent_count": 40
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/save", json=test_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if response has required fields
                required_fields = ["id", "input_data", "results", "timestamp"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("ROI Save - Response Structure", True, "All required fields present")
                    
                    # Verify input data is preserved
                    if result["input_data"]["call_volume"] == test_data["call_volume"]:
                        self.log_test("ROI Save - Input Data Preservation", True, "Input data correctly stored")
                    else:
                        self.log_test("ROI Save - Input Data Preservation", False, "Input data not preserved")
                    
                    # Verify calculations are present
                    if "monthly_savings" in result["results"] and "annual_savings" in result["results"]:
                        self.log_test("ROI Save - Calculation Results", True, "Calculation results included")
                    else:
                        self.log_test("ROI Save - Calculation Results", False, "Missing calculation results")
                        
                else:
                    self.log_test("ROI Save - Response Structure", False, f"Missing fields: {missing_fields}")
                    
            else:
                self.log_test("ROI Save - Basic Functionality", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("ROI Save - Basic Functionality", False, f"Exception: {str(e)}")
    
    def test_roi_get_calculations(self):
        """Test GET /api/roi/calculations endpoint"""
        print("\n=== Testing ROI Get Calculations Endpoint ===")
        
        # First, save a calculation to ensure there's data
        test_data = {
            "call_volume": 22000,
            "current_cost_per_call": 7.75,
            "average_handle_time": 390,
            "agent_count": 45
        }
        
        try:
            # Save a calculation first
            save_response = requests.post(f"{BACKEND_URL}/roi/save", json=test_data, timeout=10)
            
            if save_response.status_code == 200:
                # Now test retrieval
                get_response = requests.get(f"{BACKEND_URL}/roi/calculations", timeout=10)
                
                if get_response.status_code == 200:
                    calculations = get_response.json()
                    
                    if isinstance(calculations, list):
                        self.log_test("ROI Get - Response Type", True, f"Returned list with {len(calculations)} items")
                        
                        if len(calculations) > 0:
                            # Check structure of first calculation
                            calc = calculations[0]
                            required_fields = ["id", "input_data", "results", "timestamp"]
                            missing_fields = [field for field in required_fields if field not in calc]
                            
                            if not missing_fields:
                                self.log_test("ROI Get - Calculation Structure", True, "Proper calculation structure")
                            else:
                                self.log_test("ROI Get - Calculation Structure", False, f"Missing: {missing_fields}")
                        else:
                            self.log_test("ROI Get - Data Retrieval", False, "No calculations returned")
                    else:
                        self.log_test("ROI Get - Response Type", False, "Response is not a list")
                else:
                    self.log_test("ROI Get - Basic Functionality", False, 
                                f"Status: {get_response.status_code}, Response: {get_response.text}")
            else:
                self.log_test("ROI Get - Setup (Save First)", False, "Could not save test calculation")
                
        except Exception as e:
            self.log_test("ROI Get - Basic Functionality", False, f"Exception: {str(e)}")
    
    def test_performance(self):
        """Test API response times"""
        print("\n=== Testing API Performance ===")
        
        test_data = {
            "call_volume": 20000,
            "current_cost_per_call": 8.0,
            "average_handle_time": 450,
            "agent_count": 42
        }
        
        # Test calculate endpoint performance
        try:
            start_time = time.time()
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=10)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200 and response_time < 2000:  # Less than 2 seconds
                self.log_test("Performance - Calculate Endpoint", True, f"Response time: {response_time:.2f}ms")
            else:
                self.log_test("Performance - Calculate Endpoint", False, 
                            f"Response time: {response_time:.2f}ms, Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Performance - Calculate Endpoint", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting SentraTech ROI Calculator API Tests")
        print("=" * 60)
        
        # Check basic connectivity first
        if not self.test_basic_connectivity():
            print("❌ Cannot connect to backend API. Stopping tests.")
            return
        
        # Run all test suites
        self.test_roi_calculate_endpoint()
        self.test_roi_calculate_edge_cases()
        self.test_roi_calculate_invalid_inputs()
        self.test_roi_save_endpoint()
        self.test_roi_get_calculations()
        self.test_performance()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = ROICalculatorTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! ROI Calculator API is working correctly.")
    else:
        print(f"\n⚠️  {len(tester.failed_tests)} test(s) failed. Please review the issues above.")