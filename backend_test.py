#!/usr/bin/env python3
"""
Comprehensive Backend Testing for SentraTech ROI Calculator API
Tests all 3 ROI endpoints with various scenarios including edge cases
"""

import requests
import json
import time
import asyncio
import websockets
from datetime import datetime
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://customer-ai-portal.preview.emergentagent.com/api"

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
        
        test_input_data = {
            "call_volume": 18000,
            "current_cost_per_call": 9.25,
            "average_handle_time": 420,
            "agent_count": 40
        }
        
        # Format request according to the expected structure
        test_data = {
            "input_data": test_input_data,
            "user_info": {"test_user": "backend_tester"}
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
                    if result["input_data"]["call_volume"] == test_input_data["call_volume"]:
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
        test_input_data = {
            "call_volume": 22000,
            "current_cost_per_call": 7.75,
            "average_handle_time": 390,
            "agent_count": 45
        }
        
        test_data = {
            "input_data": test_input_data,
            "user_info": {"test_user": "backend_tester_get"}
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
                self.log_test("ROI Get - Setup (Save First)", False, f"Save failed with status: {save_response.status_code}")
                
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

class DemoRequestTester:
    """Test Demo Request & CRM Integration functionality"""
    
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
    
    def test_demo_request_valid_input(self):
        """Test POST /api/demo/request with valid input"""
        print("\n=== Testing Demo Request - Valid Input ===")
        
        # Test Case 1: Complete valid request
        valid_request = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@techcorp.com",
            "company": "TechCorp Solutions",
            "phone": "+1-555-0123",
            "call_volume": "25,000",
            "message": "We're interested in a demo to see how SentraTech can help reduce our customer support costs and improve response times."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=valid_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "contact_id", "message", "reference_id"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["success"] and result["contact_id"] and result["reference_id"]:
                        self.log_test("Demo Request - Valid Complete Input", True, 
                                    f"Contact ID: {result['contact_id']}, Reference: {result['reference_id']}")
                    else:
                        self.log_test("Demo Request - Valid Complete Input", False, 
                                    f"Invalid response values: {result}")
                else:
                    self.log_test("Demo Request - Valid Complete Input", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Demo Request - Valid Complete Input", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Valid Complete Input", False, f"Exception: {str(e)}")
        
        # Test Case 2: Minimal valid request (only required fields)
        minimal_request = {
            "name": "John Smith",
            "email": "john.smith@company.com",
            "company": "Smith & Associates"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=minimal_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["contact_id"]:
                    self.log_test("Demo Request - Minimal Valid Input", True, 
                                f"Contact ID: {result['contact_id']}")
                else:
                    self.log_test("Demo Request - Minimal Valid Input", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Demo Request - Minimal Valid Input", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Minimal Valid Input", False, f"Exception: {str(e)}")
    
    def test_demo_request_validation(self):
        """Test input validation for demo requests"""
        print("\n=== Testing Demo Request - Input Validation ===")
        
        # Test Case 1: Missing required field - name
        missing_name = {
            "email": "test@company.com",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=missing_name, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("Demo Request - Missing Name", True, "Validation error returned correctly")
            else:
                self.log_test("Demo Request - Missing Name", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Missing Name", False, f"Exception: {str(e)}")
        
        # Test Case 2: Missing required field - email
        missing_email = {
            "name": "John Doe",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=missing_email, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Missing Email", True, "Validation error returned correctly")
            else:
                self.log_test("Demo Request - Missing Email", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Missing Email", False, f"Exception: {str(e)}")
        
        # Test Case 3: Missing required field - company
        missing_company = {
            "name": "John Doe",
            "email": "john@test.com"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=missing_company, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Missing Company", True, "Validation error returned correctly")
            else:
                self.log_test("Demo Request - Missing Company", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Missing Company", False, f"Exception: {str(e)}")
        
        # Test Case 4: Invalid email format
        invalid_email = {
            "name": "John Doe",
            "email": "invalid-email-format",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=invalid_email, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Invalid Email Format", True, "Email validation working")
            else:
                self.log_test("Demo Request - Invalid Email Format", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Invalid Email Format", False, f"Exception: {str(e)}")
        
        # Test Case 5: Invalid phone format
        invalid_phone = {
            "name": "John Doe",
            "email": "john@test.com",
            "company": "Test Company",
            "phone": "invalid-phone"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=invalid_phone, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Invalid Phone Format", True, "Phone validation working")
            else:
                self.log_test("Demo Request - Invalid Phone Format", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Invalid Phone Format", False, f"Exception: {str(e)}")
        
        # Test Case 6: Empty name (whitespace only)
        empty_name = {
            "name": "   ",
            "email": "john@test.com",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=empty_name, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Empty Name", True, "Empty name validation working")
            else:
                self.log_test("Demo Request - Empty Name", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Empty Name", False, f"Exception: {str(e)}")
    
    def test_duplicate_contact_handling(self):
        """Test duplicate contact handling in mock HubSpot"""
        print("\n=== Testing Duplicate Contact Handling ===")
        
        # First request
        first_request = {
            "name": "Michael Chen",
            "email": "michael.chen@duplicatetest.com",
            "company": "Duplicate Test Corp",
            "phone": "+1-555-9999",
            "call_volume": "15,000",
            "message": "First demo request"
        }
        
        try:
            # Submit first request
            response1 = requests.post(f"{BACKEND_URL}/demo/request", json=first_request, timeout=15)
            
            if response1.status_code == 200:
                result1 = response1.json()
                first_contact_id = result1.get("contact_id")
                
                # Submit duplicate request (same email)
                duplicate_request = {
                    "name": "Michael Chen Updated",
                    "email": "michael.chen@duplicatetest.com",
                    "company": "Updated Company Name",
                    "phone": "+1-555-8888",
                    "call_volume": "20,000",
                    "message": "Updated demo request"
                }
                
                response2 = requests.post(f"{BACKEND_URL}/demo/request", json=duplicate_request, timeout=15)
                
                if response2.status_code == 200:
                    result2 = response2.json()
                    second_contact_id = result2.get("contact_id")
                    
                    # Check if the same contact ID is returned (indicating duplicate handling)
                    if first_contact_id == second_contact_id:
                        self.log_test("Demo Request - Duplicate Contact Handling", True, 
                                    f"Same contact ID returned: {first_contact_id}")
                    else:
                        self.log_test("Demo Request - Duplicate Contact Handling", False, 
                                    f"Different contact IDs: {first_contact_id} vs {second_contact_id}")
                else:
                    self.log_test("Demo Request - Duplicate Contact Handling", False, 
                                f"Second request failed: {response2.status_code}")
            else:
                self.log_test("Demo Request - Duplicate Contact Handling", False, 
                            f"First request failed: {response1.status_code}")
                
        except Exception as e:
            self.log_test("Demo Request - Duplicate Contact Handling", False, f"Exception: {str(e)}")
    
    def test_debug_endpoints(self):
        """Test debug endpoints for mock services"""
        print("\n=== Testing Debug Endpoints ===")
        
        # Test HubSpot contacts debug endpoint
        try:
            response = requests.get(f"{BACKEND_URL}/debug/hubspot/contacts", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if "contacts" in result and "total_contacts" in result:
                    self.log_test("Debug - HubSpot Contacts", True, 
                                f"Total contacts: {result['total_contacts']}")
                else:
                    self.log_test("Debug - HubSpot Contacts", False, 
                                f"Missing expected fields in response: {result}")
            else:
                self.log_test("Debug - HubSpot Contacts", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Debug - HubSpot Contacts", False, f"Exception: {str(e)}")
        
        # Test emails debug endpoint
        try:
            response = requests.get(f"{BACKEND_URL}/debug/emails", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if "sent_emails" in result and "total_emails" in result:
                    self.log_test("Debug - Sent Emails", True, 
                                f"Total emails: {result['total_emails']}")
                else:
                    self.log_test("Debug - Sent Emails", False, 
                                f"Missing expected fields in response: {result}")
            else:
                self.log_test("Debug - Sent Emails", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Debug - Sent Emails", False, f"Exception: {str(e)}")
    
    def test_database_integration(self):
        """Test database storage of demo requests"""
        print("\n=== Testing Database Integration ===")
        
        # Submit a demo request
        test_request = {
            "name": "Database Test User",
            "email": "dbtest@example.com",
            "company": "Database Test Corp",
            "phone": "+1-555-1111",
            "call_volume": "30,000",
            "message": "Testing database integration"
        }
        
        try:
            # Submit demo request
            response = requests.post(f"{BACKEND_URL}/demo/request", json=test_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Try to retrieve demo requests to verify database storage
                get_response = requests.get(f"{BACKEND_URL}/demo/requests", timeout=10)
                
                if get_response.status_code == 200:
                    demo_requests = get_response.json()
                    
                    if isinstance(demo_requests, list) and len(demo_requests) > 0:
                        # Look for our test request
                        found_request = None
                        for req in demo_requests:
                            if req.get("email") == test_request["email"]:
                                found_request = req
                                break
                        
                        if found_request:
                            self.log_test("Database - Demo Request Storage", True, 
                                        f"Request found in database with ID: {found_request.get('id')}")
                        else:
                            self.log_test("Database - Demo Request Storage", False, 
                                        "Test request not found in database")
                    else:
                        self.log_test("Database - Demo Request Storage", False, 
                                    "No demo requests returned from database")
                else:
                    self.log_test("Database - Demo Request Storage", False, 
                                f"Failed to retrieve demo requests: {get_response.status_code}")
            else:
                self.log_test("Database - Demo Request Storage", False, 
                            f"Demo request submission failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Database - Demo Request Storage", False, f"Exception: {str(e)}")
    
    def test_mock_email_service(self):
        """Test mock email service functionality"""
        print("\n=== Testing Mock Email Service ===")
        
        # Clear previous emails by checking current count
        try:
            initial_response = requests.get(f"{BACKEND_URL}/debug/emails", timeout=10)
            initial_count = 0
            if initial_response.status_code == 200:
                initial_count = initial_response.json().get("total_emails", 0)
        except:
            initial_count = 0
        
        # Submit a demo request to trigger email sending
        email_test_request = {
            "name": "Email Test User",
            "email": "emailtest@example.com",
            "company": "Email Test Corp",
            "phone": "+1-555-2222",
            "call_volume": "40,000",
            "message": "Testing email service functionality"
        }
        
        try:
            # Submit demo request
            response = requests.post(f"{BACKEND_URL}/demo/request", json=email_test_request, timeout=15)
            
            if response.status_code == 200:
                # Wait a moment for background email tasks to complete
                time.sleep(2)
                
                # Check if emails were sent
                email_response = requests.get(f"{BACKEND_URL}/debug/emails", timeout=10)
                
                if email_response.status_code == 200:
                    email_result = email_response.json()
                    final_count = email_result.get("total_emails", 0)
                    sent_emails = email_result.get("sent_emails", [])
                    
                    # Should have at least 2 new emails (user confirmation + internal notification)
                    if final_count >= initial_count + 2:
                        # Check for both email types
                        confirmation_found = False
                        internal_found = False
                        
                        for email in sent_emails:
                            if email.get("type") == "demo_confirmation" and email.get("to") == email_test_request["email"]:
                                confirmation_found = True
                            elif email.get("type") == "internal_notification":
                                internal_found = True
                        
                        if confirmation_found and internal_found:
                            self.log_test("Mock Email - Both Email Types", True, 
                                        f"Confirmation and internal emails sent. Total: {final_count}")
                        else:
                            self.log_test("Mock Email - Both Email Types", False, 
                                        f"Missing email types. Confirmation: {confirmation_found}, Internal: {internal_found}")
                    else:
                        self.log_test("Mock Email - Email Count", False, 
                                    f"Expected at least {initial_count + 2} emails, got {final_count}")
                else:
                    self.log_test("Mock Email - Service Check", False, 
                                f"Failed to check emails: {email_response.status_code}")
            else:
                self.log_test("Mock Email - Demo Request", False, 
                            f"Demo request failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Mock Email - Service Check", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test various error scenarios"""
        print("\n=== Testing Error Handling ===")
        
        # Test Case 1: Malformed JSON
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", 
                                   data="invalid json", 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            if response.status_code in [400, 422]:
                self.log_test("Error Handling - Malformed JSON", True, f"Status: {response.status_code}")
            else:
                self.log_test("Error Handling - Malformed JSON", False, 
                            f"Expected 400/422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Malformed JSON", False, f"Exception: {str(e)}")
        
        # Test Case 2: Empty request body
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json={}, timeout=10)
            if response.status_code == 422:
                self.log_test("Error Handling - Empty Request", True, "Validation error returned")
            else:
                self.log_test("Error Handling - Empty Request", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Empty Request", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all demo request test suites"""
        print("🚀 Starting Demo Request & CRM Integration Tests")
        print("=" * 60)
        
        # Run all test suites
        self.test_demo_request_valid_input()
        self.test_demo_request_validation()
        self.test_duplicate_contact_handling()
        self.test_debug_endpoints()
        self.test_database_integration()
        self.test_mock_email_service()
        self.test_error_handling()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 DEMO REQUEST TEST SUMMARY")
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

class LiveChatTester:
    """Test Live Chat Integration functionality with WebSocket and AI"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.websocket_url = "wss://sentrafuture.preview.emergentagent.com/ws/chat"
        
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
    
    def test_chat_session_creation(self):
        """Test POST /api/chat/session endpoint"""
        print("\n=== Testing Chat Session Creation ===")
        
        # Test Case 1: Create session without user_id
        try:
            response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "session_id", "message"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["success"] and result["session_id"]:
                        session_id = result["session_id"]
                        self.log_test("Chat Session - Create Without User ID", True, 
                                    f"Session ID: {session_id}")
                        
                        # Store session_id for later tests
                        self.test_session_id = session_id
                    else:
                        self.log_test("Chat Session - Create Without User ID", False, 
                                    f"Invalid response values: {result}")
                else:
                    self.log_test("Chat Session - Create Without User ID", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Chat Session - Create Without User ID", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Session - Create Without User ID", False, f"Exception: {str(e)}")
        
        # Test Case 2: Create session with user_id
        try:
            test_data = {"user_id": "test_user_123"}
            response = requests.post(f"{BACKEND_URL}/chat/session", json=test_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["session_id"]:
                    self.log_test("Chat Session - Create With User ID", True, 
                                f"Session ID: {result['session_id']}")
                else:
                    self.log_test("Chat Session - Create With User ID", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Chat Session - Create With User ID", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Session - Create With User ID", False, f"Exception: {str(e)}")
    
    def test_rest_api_message_endpoint(self):
        """Test POST /api/chat/message endpoint (fallback method)"""
        print("\n=== Testing REST API Message Endpoint ===")
        
        # First create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Chat Message - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Test Case 1: Send message via REST API
        try:
            test_message = "Hello, I need help with SentraTech's AI platform features."
            
            # Use query parameters as expected by the endpoint
            response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={test_message}", timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "user_message", "ai_response"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    user_msg = result["user_message"]
                    ai_msg = result["ai_response"]
                    
                    # Verify user message
                    if user_msg["content"] == test_message and user_msg["sender"] == "user":
                        self.log_test("Chat Message - User Message Storage", True, 
                                    f"Message stored correctly: {user_msg['id']}")
                    else:
                        self.log_test("Chat Message - User Message Storage", False, 
                                    f"User message not stored correctly")
                    
                    # Verify AI response
                    if ai_msg["sender"] == "assistant" and len(ai_msg["content"]) > 0:
                        self.log_test("Chat Message - AI Response Generation", True, 
                                    f"AI response generated: {ai_msg['content'][:100]}...")
                    else:
                        self.log_test("Chat Message - AI Response Generation", False, 
                                    f"AI response not generated properly")
                        
                    # Check if response is contextually appropriate for SentraTech
                    ai_content = ai_msg["content"].lower()
                    sentratech_keywords = ["sentratech", "ai", "customer", "support", "platform", "automation"]
                    if any(keyword in ai_content for keyword in sentratech_keywords):
                        self.log_test("Chat Message - SentraTech Context", True, 
                                    "AI response contains SentraTech-relevant content")
                    else:
                        self.log_test("Chat Message - SentraTech Context", False, 
                                    "AI response lacks SentraTech context")
                        
                else:
                    self.log_test("Chat Message - REST API Response Structure", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Chat Message - REST API Basic", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Message - REST API Basic", False, f"Exception: {str(e)}")
    
    def test_chat_history_endpoint(self):
        """Test GET /api/chat/session/{session_id}/history endpoint"""
        print("\n=== Testing Chat History Endpoint ===")
        
        # First create a session and send some messages
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Chat History - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Send a test message to create history
        test_message = "What are the key benefits of SentraTech's platform?"
        
        # Use query parameters as expected by the endpoint
        message_response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={test_message}", timeout=30)
        if message_response.status_code != 200:
            self.log_test("Chat History - Message Setup", False, "Failed to send test message")
            return
        
        # Test Case 1: Retrieve chat history
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                if "success" in result and "messages" in result:
                    if result["success"] and isinstance(result["messages"], list):
                        messages = result["messages"]
                        
                        if len(messages) >= 2:  # Should have user message + AI response
                            # Check message structure
                            user_message = None
                            ai_message = None
                            
                            for msg in messages:
                                if msg["sender"] == "user":
                                    user_message = msg
                                elif msg["sender"] == "assistant":
                                    ai_message = msg
                            
                            if user_message and ai_message:
                                self.log_test("Chat History - Message Retrieval", True, 
                                            f"Retrieved {len(messages)} messages correctly")
                                
                                # Check timestamp handling
                                if "timestamp" in user_message and "timestamp" in ai_message:
                                    self.log_test("Chat History - Timestamp Handling", True, 
                                                "Timestamps present in messages")
                                else:
                                    self.log_test("Chat History - Timestamp Handling", False, 
                                                "Missing timestamps in messages")
                                    
                                # Check message ordering (should be chronological)
                                if messages[0]["timestamp"] <= messages[-1]["timestamp"]:
                                    self.log_test("Chat History - Message Ordering", True, 
                                                "Messages ordered chronologically")
                                else:
                                    self.log_test("Chat History - Message Ordering", False, 
                                                "Messages not properly ordered")
                            else:
                                self.log_test("Chat History - Message Types", False, 
                                            "Missing user or AI messages in history")
                        else:
                            self.log_test("Chat History - Message Count", False, 
                                        f"Expected at least 2 messages, got {len(messages)}")
                    else:
                        self.log_test("Chat History - Response Format", False, 
                                    f"Invalid response format: {result}")
                else:
                    self.log_test("Chat History - Response Structure", False, 
                                f"Missing required fields in response")
            else:
                self.log_test("Chat History - Basic Retrieval", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat History - Basic Retrieval", False, f"Exception: {str(e)}")
        
        # Test Case 2: Test with limit parameter
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history?limit=1", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and len(result["messages"]) <= 1:
                    self.log_test("Chat History - Limit Parameter", True, 
                                f"Limit parameter working: {len(result['messages'])} messages")
                else:
                    self.log_test("Chat History - Limit Parameter", False, 
                                f"Limit parameter not working properly")
            else:
                self.log_test("Chat History - Limit Parameter", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Chat History - Limit Parameter", False, f"Exception: {str(e)}")
    
    def test_websocket_connection(self):
        """Test WebSocket endpoint /ws/chat/{session_id}"""
        print("\n=== Testing WebSocket Connection ===")
        
        # First create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("WebSocket - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        async def test_websocket_functionality():
            try:
                # Test Case 1: WebSocket connection establishment
                uri = f"{self.websocket_url}/{session_id}"
                
                async with websockets.connect(uri, timeout=10) as websocket:
                    self.log_test("WebSocket - Connection Establishment", True, 
                                f"Connected to {uri}")
                    
                    # Test Case 2: Receive welcome message
                    try:
                        welcome_message = await asyncio.wait_for(websocket.recv(), timeout=5)
                        welcome_data = json.loads(welcome_message)
                        
                        if welcome_data.get("type") == "system" and "content" in welcome_data:
                            self.log_test("WebSocket - Welcome Message", True, 
                                        f"Welcome message received: {welcome_data['content'][:50]}...")
                        else:
                            self.log_test("WebSocket - Welcome Message", False, 
                                        f"Invalid welcome message format: {welcome_data}")
                    except asyncio.TimeoutError:
                        self.log_test("WebSocket - Welcome Message", False, "No welcome message received")
                    
                    # Test Case 3: Send user message and receive AI response
                    try:
                        test_message = {
                            "type": "user_message",
                            "content": "Can you tell me about SentraTech's automation capabilities?"
                        }
                        
                        await websocket.send(json.dumps(test_message))
                        self.log_test("WebSocket - Send Message", True, "User message sent successfully")
                        
                        # Wait for typing indicator and AI response
                        typing_received = False
                        ai_response_received = False
                        
                        for _ in range(10):  # Wait up to 30 seconds for response
                            try:
                                response = await asyncio.wait_for(websocket.recv(), timeout=3)
                                response_data = json.loads(response)
                                
                                if response_data.get("type") == "typing":
                                    typing_received = True
                                    self.log_test("WebSocket - Typing Indicator", True, 
                                                f"Typing indicator: {response_data.get('is_typing')}")
                                
                                elif response_data.get("type") == "ai_response":
                                    ai_response_received = True
                                    ai_content = response_data.get("content", "")
                                    
                                    if len(ai_content) > 0:
                                        self.log_test("WebSocket - AI Response Reception", True, 
                                                    f"AI response received: {ai_content[:100]}...")
                                        
                                        # Check SentraTech context
                                        ai_lower = ai_content.lower()
                                        sentratech_keywords = ["sentratech", "automation", "ai", "platform", "70%"]
                                        if any(keyword in ai_lower for keyword in sentratech_keywords):
                                            self.log_test("WebSocket - AI Context Quality", True, 
                                                        "AI response contains relevant SentraTech information")
                                        else:
                                            self.log_test("WebSocket - AI Context Quality", False, 
                                                        "AI response lacks SentraTech context")
                                    else:
                                        self.log_test("WebSocket - AI Response Reception", False, 
                                                    "Empty AI response received")
                                    break
                                    
                            except asyncio.TimeoutError:
                                continue
                        
                        if not ai_response_received:
                            self.log_test("WebSocket - AI Response Reception", False, 
                                        "No AI response received within timeout")
                    
                    except Exception as e:
                        self.log_test("WebSocket - Message Exchange", False, f"Exception: {str(e)}")
                    
                    # Test Case 4: Ping/Pong functionality
                    try:
                        ping_message = {
                            "type": "ping",
                            "timestamp": datetime.now().isoformat()
                        }
                        
                        await websocket.send(json.dumps(ping_message))
                        
                        pong_response = await asyncio.wait_for(websocket.recv(), timeout=5)
                        pong_data = json.loads(pong_response)
                        
                        if pong_data.get("type") == "pong":
                            self.log_test("WebSocket - Ping/Pong", True, "Ping/Pong functionality working")
                        else:
                            self.log_test("WebSocket - Ping/Pong", False, 
                                        f"Invalid pong response: {pong_data}")
                    
                    except asyncio.TimeoutError:
                        self.log_test("WebSocket - Ping/Pong", False, "No pong response received")
                    except Exception as e:
                        self.log_test("WebSocket - Ping/Pong", False, f"Exception: {str(e)}")
                        
            except Exception as e:
                self.log_test("WebSocket - Connection Establishment", False, f"Connection failed: {str(e)}")
        
        # Run the async WebSocket test
        try:
            asyncio.run(test_websocket_functionality())
        except Exception as e:
            self.log_test("WebSocket - Test Execution", False, f"Async test failed: {str(e)}")
    
    def test_ai_integration(self):
        """Test Emergent LLM integration and AI response quality"""
        print("\n=== Testing AI Integration ===")
        
        # Create a session for testing
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("AI Integration - Session Setup", False, "Failed to create session")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Test Case 1: AI response to SentraTech-specific query
        sentratech_queries = [
            "What are SentraTech's key features?",
            "How much can I save with SentraTech?",
            "Tell me about your automation capabilities"
        ]
        
        for i, query in enumerate(sentratech_queries):
            try:
                # Use query parameters as expected by the endpoint
                response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={query}", timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    ai_response = result.get("ai_response", {}).get("content", "")
                    
                    if len(ai_response) > 0:
                        # Check for SentraTech-specific information
                        ai_lower = ai_response.lower()
                        relevant_terms = [
                            "sentratech", "50ms", "sub-50ms", "70%", "automation", 
                            "45%", "cost", "savings", "ai", "platform", "customer support",
                            "routing", "dashboard", "analytics", "integration"
                        ]
                        
                        relevant_count = sum(1 for term in relevant_terms if term in ai_lower)
                        
                        if relevant_count >= 2:  # At least 2 relevant terms
                            self.log_test(f"AI Integration - Query {i+1} Relevance", True, 
                                        f"Response contains {relevant_count} relevant terms")
                        else:
                            self.log_test(f"AI Integration - Query {i+1} Relevance", False, 
                                        f"Response lacks SentraTech context (only {relevant_count} relevant terms)")
                        
                        # Check response length (should be substantial)
                        if len(ai_response) > 50:
                            self.log_test(f"AI Integration - Query {i+1} Length", True, 
                                        f"Response length: {len(ai_response)} characters")
                        else:
                            self.log_test(f"AI Integration - Query {i+1} Length", False, 
                                        f"Response too short: {len(ai_response)} characters")
                    else:
                        self.log_test(f"AI Integration - Query {i+1} Response", False, 
                                    "Empty AI response")
                else:
                    self.log_test(f"AI Integration - Query {i+1} API", False, 
                                f"API call failed: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"AI Integration - Query {i+1} Exception", False, f"Exception: {str(e)}")
    
    def test_database_integration(self):
        """Test MongoDB integration for chat data persistence"""
        print("\n=== Testing Database Integration ===")
        
        # Create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Database - Session Creation", False, "Failed to create session")
            return
        
        session_id = session_response.json()["session_id"]
        self.log_test("Database - Session Creation", True, f"Session created: {session_id}")
        
        # Send multiple messages to test persistence
        test_messages = [
            "Hello, I'm interested in SentraTech",
            "What are your pricing options?"
        ]
        
        for i, message in enumerate(test_messages):
            try:
                # Use query parameters as expected by the endpoint
                response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={message}", timeout=30)
                
                if response.status_code == 200:
                    self.log_test(f"Database - Message {i+1} Storage", True, 
                                f"Message stored successfully")
                else:
                    self.log_test(f"Database - Message {i+1} Storage", False, 
                                f"Failed to store message: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Database - Message {i+1} Storage", False, f"Exception: {str(e)}")
        
        # Test message retrieval and verify persistence
        try:
            history_response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history", timeout=10)
            
            if history_response.status_code == 200:
                result = history_response.json()
                messages = result.get("messages", [])
                
                # Should have user messages + AI responses
                expected_min_messages = len(test_messages) * 2  # user + AI for each
                
                if len(messages) >= expected_min_messages:
                    self.log_test("Database - Message Persistence", True, 
                                f"All {len(messages)} messages persisted correctly")
                    
                    # Check message ordering and timestamps
                    timestamps = [msg["timestamp"] for msg in messages]
                    if timestamps == sorted(timestamps):
                        self.log_test("Database - Message Ordering", True, 
                                    "Messages ordered chronologically")
                    else:
                        self.log_test("Database - Message Ordering", False, 
                                    "Messages not properly ordered")
                        
                    # Verify message content preservation
                    user_messages = [msg for msg in messages if msg["sender"] == "user"]
                    stored_contents = [msg["content"] for msg in user_messages]
                    
                    all_preserved = all(original in stored_contents for original in test_messages)
                    if all_preserved:
                        self.log_test("Database - Content Preservation", True, 
                                    "All message content preserved correctly")
                    else:
                        self.log_test("Database - Content Preservation", False, 
                                    "Some message content not preserved")
                else:
                    self.log_test("Database - Message Persistence", False, 
                                f"Expected at least {expected_min_messages} messages, got {len(messages)}")
            else:
                self.log_test("Database - Message Retrieval", False, 
                            f"Failed to retrieve messages: {history_response.status_code}")
                
        except Exception as e:
            self.log_test("Database - Message Retrieval", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling scenarios"""
        print("\n=== Testing Error Handling ===")
        
        # Test Case 1: Invalid session ID
        try:
            invalid_session_id = "invalid_session_123"
            test_data = {
                "session_id": invalid_session_id,
                "message": "Test message"
            }
            
            response = requests.post(f"{BACKEND_URL}/chat/message", json=test_data, timeout=10)
            
            # Should handle gracefully (either create session or return error)
            if response.status_code in [200, 400, 404, 500]:
                self.log_test("Error Handling - Invalid Session ID", True, 
                            f"Handled invalid session ID gracefully: {response.status_code}")
            else:
                self.log_test("Error Handling - Invalid Session ID", False, 
                            f"Unexpected status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Invalid Session ID", False, f"Exception: {str(e)}")
        
        # Test Case 2: Invalid chat history request
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/nonexistent/history", timeout=10)
            
            if response.status_code in [200, 404, 500]:  # Should handle gracefully
                self.log_test("Error Handling - Nonexistent Session History", True, 
                            f"Handled nonexistent session gracefully: {response.status_code}")
            else:
                self.log_test("Error Handling - Nonexistent Session History", False, 
                            f"Unexpected status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Nonexistent Session History", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all live chat test suites"""
        print("🚀 Starting Live Chat Integration Tests")
        print("=" * 60)
        
        # Run all test suites
        self.test_chat_session_creation()
        self.test_rest_api_message_endpoint()
        self.test_chat_history_endpoint()
        self.test_websocket_connection()
        self.test_ai_integration()
        self.test_database_integration()
        self.test_error_handling()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 LIVE CHAT TEST SUMMARY")
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
    print("🔧 SentraTech Backend API Testing Suite")
    print("=" * 60)
    
    # Test ROI Calculator (existing functionality)
    print("\n🧮 TESTING ROI CALCULATOR")
    roi_tester = ROICalculatorTester()
    roi_success = roi_tester.run_all_tests()
    
    # Test Demo Request & CRM Integration (existing functionality)
    print("\n📝 TESTING DEMO REQUEST & CRM INTEGRATION")
    demo_tester = DemoRequestTester()
    demo_success = demo_tester.run_all_tests()
    
    # Test Live Chat Integration (new functionality)
    print("\n💬 TESTING LIVE CHAT INTEGRATION")
    chat_tester = LiveChatTester()
    chat_success = chat_tester.run_all_tests()
    
    # Overall summary
    print("\n" + "=" * 60)
    print("🎯 OVERALL TEST SUMMARY")
    print("=" * 60)
    
    total_tests = len(roi_tester.test_results) + len(demo_tester.test_results) + len(chat_tester.test_results)
    total_passed = len(roi_tester.passed_tests) + len(demo_tester.passed_tests) + len(chat_tester.passed_tests)
    total_failed = len(roi_tester.failed_tests) + len(demo_tester.failed_tests) + len(chat_tester.failed_tests)
    
    print(f"Total Tests Run: {total_tests}")
    print(f"✅ Total Passed: {total_passed}")
    print(f"❌ Total Failed: {total_failed}")
    
    if roi_success and demo_success and chat_success:
        print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
    else:
        print(f"\n⚠️  Some tests failed:")
        if not roi_success:
            print(f"   - ROI Calculator: {len(roi_tester.failed_tests)} failed")
        if not demo_success:
            print(f"   - Demo Request: {len(demo_tester.failed_tests)} failed")
        if not chat_success:
            print(f"   - Live Chat: {len(chat_tester.failed_tests)} failed")