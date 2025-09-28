#!/usr/bin/env python3
"""
Demo Request Form Testing with New Volume Fields - Supabase Integration Testing
Tests the updated demo request form with call_volume and interaction_volume fields
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://customer-dashboard-3.preview.emergentagent.com/api"

class DemoRequestVolumeFieldsTester:
    """Demo Request Form Testing with New Volume Fields"""
    
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
    
    def test_backend_connectivity(self):
        """Test basic backend connectivity"""
        print("\n=== Testing Backend Connectivity ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Hello World":
                    self.log_test("Backend Connectivity", True, f"Backend responding correctly: {result}")
                    return True
                else:
                    self.log_test("Backend Connectivity", False, f"Unexpected response: {result}")
                    return False
            else:
                self.log_test("Backend Connectivity", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Backend Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_health_check(self):
        """Test backend health check"""
        print("\n=== Testing Backend Health Check ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "healthy":
                    response_time = result.get("response_time_ms", 0)
                    self.log_test("Backend Health Check", True, 
                                f"Backend healthy - Response time: {response_time}ms")
                    return True
                else:
                    self.log_test("Backend Health Check", False, f"Backend unhealthy: {result}")
                    return False
            else:
                self.log_test("Backend Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Backend Health Check", False, f"Health check error: {str(e)}")
            return False
    
    def test_demo_request_with_volume_fields(self):
        """Test demo request form submission with new call_volume and interaction_volume fields"""
        print("\n=== Testing Demo Request Form with Volume Fields ===")
        
        # Test data as specified in the review request
        test_data = {
            "name": "Volume Test User",
            "email": "volume@test.com", 
            "company": "Volume Test Company",
            "phone": "+1234567890",
            "call_volume": "25,000",
            "interaction_volume": "40,000",
            "message": "Testing demo request form with new volume fields for Supabase integration"
        }
        
        try:
            print(f"📝 Submitting demo request with volume fields...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/demo/request", json=test_data, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure
                required_fields = ["success", "message", "reference_id"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result.get("success") and result.get("reference_id"):
                        self.log_test("Demo Request - Volume Fields Submission", True, 
                                    f"✅ Demo request with volume fields successful! Reference ID: {result['reference_id']}")
                        
                        # Store reference for verification
                        self.test_reference_id = result["reference_id"]
                        return True
                    else:
                        self.log_test("Demo Request - Volume Fields Submission", False, 
                                    f"Invalid response values: success={result.get('success')}, reference_id={result.get('reference_id')}")
                        return False
                else:
                    self.log_test("Demo Request - Volume Fields Submission", False, 
                                f"Missing response fields: {missing_fields}")
                    return False
            else:
                error_text = response.text
                self.log_test("Demo Request - Volume Fields Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                
                # Check for specific Supabase schema errors
                if "call_volume" in error_text or "interaction_volume" in error_text:
                    self.log_test("Demo Request - Supabase Schema Issue", False, 
                                f"Supabase schema missing volume columns: {error_text}")
                
                return False
                
        except Exception as e:
            self.log_test("Demo Request - Volume Fields Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_demo_request_validation(self):
        """Test demo request form validation with volume fields"""
        print("\n=== Testing Demo Request Form Validation ===")
        
        # Test Case 1: Missing required fields
        invalid_data_1 = {
            "email": "test@validation.com",
            "call_volume": "25,000",
            "interaction_volume": "40,000"
            # Missing name and company
        }
        
        try:
            print(f"🔍 Testing validation - Missing required fields...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=invalid_data_1, timeout=15)
            
            if response.status_code == 422:  # Validation error expected
                self.log_test("Demo Request - Validation (Missing Fields)", True, 
                            f"✅ Validation correctly rejected missing fields: HTTP {response.status_code}")
            elif response.status_code == 400:
                self.log_test("Demo Request - Validation (Missing Fields)", True, 
                            f"✅ Validation correctly rejected missing fields: HTTP {response.status_code}")
            else:
                self.log_test("Demo Request - Validation (Missing Fields)", False, 
                            f"Expected validation error, got HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Validation (Missing Fields)", False, f"Exception: {str(e)}")
        
        # Test Case 2: Invalid email format
        invalid_data_2 = {
            "name": "Test User",
            "email": "invalid-email-format",
            "company": "Test Company",
            "call_volume": "25,000",
            "interaction_volume": "40,000"
        }
        
        try:
            print(f"🔍 Testing validation - Invalid email format...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=invalid_data_2, timeout=15)
            
            if response.status_code in [422, 400]:  # Validation error expected
                self.log_test("Demo Request - Validation (Invalid Email)", True, 
                            f"✅ Validation correctly rejected invalid email: HTTP {response.status_code}")
            else:
                self.log_test("Demo Request - Validation (Invalid Email)", False, 
                            f"Expected validation error, got HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Validation (Invalid Email)", False, f"Exception: {str(e)}")
    
    def test_demo_request_data_persistence(self):
        """Test if demo request data with volume fields is properly stored"""
        print("\n=== Testing Demo Request Data Persistence ===")
        
        if not hasattr(self, 'test_reference_id'):
            self.log_test("Demo Request - Data Persistence", False, 
                        "No reference ID available from previous test")
            return False
        
        # Wait a moment for background processing
        time.sleep(3)
        
        try:
            print(f"🔍 Checking data persistence for reference ID: {self.test_reference_id}")
            response = requests.get(f"{BACKEND_URL}/demo/requests?limit=20", timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("requests"):
                    requests_data = result["requests"]
                    
                    # Look for our test request
                    found_request = None
                    for req in requests_data:
                        if req.get("email") == "volume@test.com":
                            found_request = req
                            break
                    
                    if found_request:
                        # Check if volume fields are present
                        has_call_volume = "call_volume" in found_request
                        has_interaction_volume = "interaction_volume" in found_request
                        
                        if has_call_volume and has_interaction_volume:
                            call_vol = found_request.get("call_volume")
                            interaction_vol = found_request.get("interaction_volume")
                            
                            self.log_test("Demo Request - Data Persistence", True, 
                                        f"✅ Volume fields stored correctly - Call Volume: {call_vol}, Interaction Volume: {interaction_vol}")
                            return True
                        else:
                            missing_fields = []
                            if not has_call_volume:
                                missing_fields.append("call_volume")
                            if not has_interaction_volume:
                                missing_fields.append("interaction_volume")
                            
                            self.log_test("Demo Request - Data Persistence", False, 
                                        f"Volume fields missing from stored data: {missing_fields}")
                            return False
                    else:
                        self.log_test("Demo Request - Data Persistence", False, 
                                    "Test request not found in stored data")
                        return False
                else:
                    self.log_test("Demo Request - Data Persistence", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                self.log_test("Demo Request - Data Persistence", False, 
                            f"Cannot retrieve stored requests: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Demo Request - Data Persistence", False, f"Exception: {str(e)}")
            return False
    
    def test_demo_request_different_volume_formats(self):
        """Test demo request with different volume field formats"""
        print("\n=== Testing Demo Request with Different Volume Formats ===")
        
        test_cases = [
            {
                "name": "Format Test 1",
                "data": {
                    "name": "Format Test User 1",
                    "email": "format1@test.com",
                    "company": "Format Test Company 1", 
                    "phone": "+1234567891",
                    "call_volume": "10000",  # No comma
                    "interaction_volume": "15000"
                },
                "description": "Numeric format without commas"
            },
            {
                "name": "Format Test 2", 
                "data": {
                    "name": "Format Test User 2",
                    "email": "format2@test.com",
                    "company": "Format Test Company 2",
                    "phone": "+1234567892", 
                    "call_volume": "5,000-10,000",  # Range format
                    "interaction_volume": "8,000-12,000"
                },
                "description": "Range format with commas"
            },
            {
                "name": "Format Test 3",
                "data": {
                    "name": "Format Test User 3", 
                    "email": "format3@test.com",
                    "company": "Format Test Company 3",
                    "phone": "+1234567893",
                    "call_volume": "50K+",  # Abbreviated format
                    "interaction_volume": "75K+"
                },
                "description": "Abbreviated format (K+)"
            }
        ]
        
        successful_formats = 0
        
        for test_case in test_cases:
            try:
                print(f"🔍 Testing {test_case['description']}...")
                response = requests.post(f"{BACKEND_URL}/demo/request", 
                                       json=test_case["data"], timeout=20)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        successful_formats += 1
                        self.log_test(f"Demo Request - {test_case['name']}", True, 
                                    f"✅ {test_case['description']} accepted")
                    else:
                        self.log_test(f"Demo Request - {test_case['name']}", False, 
                                    f"Request failed: {result}")
                else:
                    self.log_test(f"Demo Request - {test_case['name']}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                
                # Small delay between requests
                time.sleep(1)
                
            except Exception as e:
                self.log_test(f"Demo Request - {test_case['name']}", False, f"Exception: {str(e)}")
        
        # Overall format compatibility test
        if successful_formats >= 2:  # At least 2 out of 3 formats should work
            self.log_test("Demo Request - Volume Format Compatibility", True, 
                        f"✅ Good format compatibility: {successful_formats}/3 formats accepted")
        else:
            self.log_test("Demo Request - Volume Format Compatibility", False, 
                        f"Poor format compatibility: only {successful_formats}/3 formats accepted")
    
    def test_supabase_schema_verification(self):
        """Test if Supabase demo_requests table has the required volume columns"""
        print("\n=== Testing Supabase Schema for Volume Columns ===")
        
        # This test attempts to verify the schema by submitting data and checking the error response
        schema_test_data = {
            "name": "Schema Test User",
            "email": "schema@test.com",
            "company": "Schema Test Company",
            "phone": "+1234567899",
            "call_volume": "TEST_CALL_VOLUME",
            "interaction_volume": "TEST_INTERACTION_VOLUME"
        }
        
        try:
            print(f"🔍 Testing Supabase schema for volume columns...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=schema_test_data, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Supabase Schema - Volume Columns", True, 
                                f"✅ Supabase schema supports volume columns")
                    return True
                else:
                    self.log_test("Supabase Schema - Volume Columns", False, 
                                f"Schema test failed: {result}")
                    return False
            else:
                error_text = response.text
                
                # Check for specific schema-related errors
                if "call_volume" in error_text and "schema cache" in error_text:
                    self.log_test("Supabase Schema - Volume Columns", False, 
                                f"❌ call_volume column missing from Supabase schema: {error_text}")
                    return False
                elif "interaction_volume" in error_text and "schema cache" in error_text:
                    self.log_test("Supabase Schema - Volume Columns", False, 
                                f"❌ interaction_volume column missing from Supabase schema: {error_text}")
                    return False
                else:
                    self.log_test("Supabase Schema - Volume Columns", False, 
                                f"Schema test error: HTTP {response.status_code} - {error_text}")
                    return False
                    
        except Exception as e:
            self.log_test("Supabase Schema - Volume Columns", False, f"Exception: {str(e)}")
            return False
    
    def generate_test_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 DEMO REQUEST FORM WITH VOLUME FIELDS - TESTING SUMMARY")
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
        
        # Detailed results
        print(f"\n📋 Detailed Test Results:")
        for result in self.test_results:
            status = "✅ PASS" if result["passed"] else "❌ FAIL"
            print(f"   {status}: {result['test']}")
            if result["details"] and not result["passed"]:
                print(f"      └─ {result['details']}")
        
        # Critical findings
        print(f"\n🎯 Critical Findings:")
        
        # Check for schema issues
        schema_issues = [r for r in self.test_results if "Schema" in r["test"] and not r["passed"]]
        if schema_issues:
            print(f"   ❌ SCHEMA ISSUES DETECTED:")
            for issue in schema_issues:
                print(f"      • {issue['details']}")
        
        # Check for validation issues
        validation_issues = [r for r in self.test_results if "Validation" in r["test"] and not r["passed"]]
        if validation_issues:
            print(f"   ❌ VALIDATION ISSUES:")
            for issue in validation_issues:
                print(f"      • {issue['details']}")
        
        # Check for persistence issues
        persistence_issues = [r for r in self.test_results if "Persistence" in r["test"] and not r["passed"]]
        if persistence_issues:
            print(f"   ❌ DATA PERSISTENCE ISSUES:")
            for issue in persistence_issues:
                print(f"      • {issue['details']}")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - Demo request form with volume fields is production-ready")
        elif success_rate >= 75:
            print(f"   ✅ GOOD - Demo request form working with minor issues")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Demo request form needs improvements")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        if schema_issues:
            print(f"   • Update Supabase demo_requests table schema to include call_volume and interaction_volume columns")
        
        if validation_issues:
            print(f"   • Review form validation logic for volume fields")
        
        if persistence_issues:
            print(f"   • Verify data storage and retrieval for volume fields")
        
        if success_rate >= 75:
            print(f"   • Consider the demo request form ready for production use")
        
        return success_rate >= 75
    
    def run_comprehensive_tests(self):
        """Run all comprehensive tests for demo request form with volume fields"""
        print("🚀 Starting Demo Request Form Testing with Volume Fields")
        print("=" * 80)
        print("Testing demo request form integration with new call_volume and interaction_volume fields:")
        print("• Backend connectivity and health check")
        print("• Demo request submission with volume fields")
        print("• Form validation with volume fields")
        print("• Data persistence verification")
        print("• Volume field format compatibility")
        print("• Supabase schema verification")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity tests
            if not self.test_backend_connectivity():
                print("❌ Backend connectivity failed - aborting tests")
                return False
            
            if not self.test_health_check():
                print("❌ Backend health check failed - continuing with caution")
            
            # Core functionality tests
            self.test_supabase_schema_verification()
            self.test_demo_request_with_volume_fields()
            self.test_demo_request_validation()
            self.test_demo_request_data_persistence()
            self.test_demo_request_different_volume_formats()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_test_summary()
        
        return is_ready


def main():
    """Main function to run demo request volume fields testing"""
    print("🎯 Demo Request Form Testing with New Volume Fields")
    print("Testing integration with Supabase for call_volume and interaction_volume fields")
    print()
    
    tester = DemoRequestVolumeFieldsTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: Demo request form with volume fields is working correctly!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Demo request form needs attention before production use")
            return False
            
    except KeyboardInterrupt:
        print("\n⚠️ Testing interrupted by user")
        return False
    except Exception as e:
        print(f"\n❌ Testing failed with error: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)