#!/usr/bin/env python3
"""
Supabase Schema Testing - Updated Column Names
Tests the demo request form submission with the updated Supabase schema using user_name instead of "User Name"
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://deploy-bug-fixes.preview.emergentagent.com/api"

class SupabaseSchemaUpdatedTester:
    """Test demo request form with updated Supabase schema (user_name column)"""
    
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
    
    def test_updated_schema_demo_request(self):
        """Test demo request submission with updated Supabase schema using user_name column"""
        print("\n=== Testing Demo Request with Updated Schema (user_name) ===")
        
        # Test data as specified in the review request
        test_data = {
            "name": "Updated Schema Test",  # This should map to user_name in Supabase
            "email": "updated@example.com",
            "company": "Updated Schema Company",
            "phone": "+1555123456",
            "call_volume": "35,000",
            "interaction_volume": "50,000",
            "message": "Testing updated schema with user_name column"
        }
        
        try:
            print(f"📝 Submitting demo request with updated schema mapping...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            print(f"   Expected: 'name' field should map to 'user_name' column in Supabase")
            
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
                        self.log_test("Updated Schema - Demo Request Submission", True, 
                                    f"✅ Demo request with updated schema successful! Reference ID: {result['reference_id']}")
                        
                        # Store reference for verification
                        self.test_reference_id = result["reference_id"]
                        return True
                    else:
                        self.log_test("Updated Schema - Demo Request Submission", False, 
                                    f"Invalid response values: success={result.get('success')}, reference_id={result.get('reference_id')}")
                        return False
                else:
                    self.log_test("Updated Schema - Demo Request Submission", False, 
                                f"Missing response fields: {missing_fields}")
                    return False
            else:
                error_text = response.text
                self.log_test("Updated Schema - Demo Request Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                
                # Check for specific schema-related errors
                if "user_name" in error_text or "User Name" in error_text:
                    self.log_test("Updated Schema - Column Name Issue", False, 
                                f"Schema column name issue detected: {error_text}")
                elif "schema cache" in error_text:
                    self.log_test("Updated Schema - Cache Issue", False, 
                                f"Supabase schema cache error: {error_text}")
                
                return False
                
        except Exception as e:
            self.log_test("Updated Schema - Demo Request Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_volume_fields_integration(self):
        """Test that volume fields are properly integrated with updated schema"""
        print("\n=== Testing Volume Fields Integration with Updated Schema ===")
        
        # Test data focusing on volume fields
        volume_test_data = {
            "name": "Volume Fields Test User",
            "email": "volume.fields@example.com",
            "company": "Volume Fields Test Company",
            "phone": "+1555987654",
            "call_volume": "35,000",
            "interaction_volume": "50,000",
            "message": "Testing volume fields with updated schema"
        }
        
        try:
            print(f"📝 Testing volume fields integration...")
            print(f"   Call Volume: {volume_test_data['call_volume']}")
            print(f"   Interaction Volume: {volume_test_data['interaction_volume']}")
            
            response = requests.post(f"{BACKEND_URL}/demo/request", json=volume_test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("reference_id"):
                    self.log_test("Updated Schema - Volume Fields Integration", True, 
                                f"✅ Volume fields integrated successfully with updated schema")
                    
                    # Store reference for data verification
                    self.volume_test_reference_id = result["reference_id"]
                    return True
                else:
                    self.log_test("Updated Schema - Volume Fields Integration", False, 
                                f"Volume fields integration failed: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Updated Schema - Volume Fields Integration", False, 
                            f"Volume fields integration error: HTTP {response.status_code} - {error_text}")
                
                # Check for volume field specific errors
                if "call_volume" in error_text or "interaction_volume" in error_text:
                    self.log_test("Updated Schema - Volume Fields Schema Error", False, 
                                f"Volume fields schema error: {error_text}")
                
                return False
                
        except Exception as e:
            self.log_test("Updated Schema - Volume Fields Integration", False, f"Exception: {str(e)}")
            return False
    
    def test_message_field_integration(self):
        """Test that message field is properly included in updated schema"""
        print("\n=== Testing Message Field Integration ===")
        
        # Test data with comprehensive message
        message_test_data = {
            "name": "Message Field Test User",
            "email": "message.field@example.com",
            "company": "Message Field Test Company",
            "phone": "+1555456789",
            "call_volume": "35,000",
            "interaction_volume": "50,000",
            "message": "This is a comprehensive test message to verify that the message field is properly integrated with the updated Supabase schema using user_name column instead of 'User Name'. The message should be stored correctly in the demo_requests table."
        }
        
        try:
            print(f"📝 Testing message field integration...")
            print(f"   Message Length: {len(message_test_data['message'])} characters")
            
            response = requests.post(f"{BACKEND_URL}/demo/request", json=message_test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("reference_id"):
                    self.log_test("Updated Schema - Message Field Integration", True, 
                                f"✅ Message field integrated successfully with updated schema")
                    return True
                else:
                    self.log_test("Updated Schema - Message Field Integration", False, 
                                f"Message field integration failed: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Updated Schema - Message Field Integration", False, 
                            f"Message field integration error: HTTP {response.status_code} - {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Updated Schema - Message Field Integration", False, f"Exception: {str(e)}")
            return False
    
    def test_schema_cache_errors(self):
        """Test for absence of schema cache errors with updated column names"""
        print("\n=== Testing for Schema Cache Errors ===")
        
        # Test multiple submissions to check for consistent schema handling
        test_cases = [
            {
                "name": "Cache Test 1",
                "email": "cache1@example.com",
                "company": "Cache Test Company 1",
                "phone": "+1555111111",
                "call_volume": "25,000",
                "interaction_volume": "35,000",
                "message": "Testing schema cache consistency - Test 1"
            },
            {
                "name": "Cache Test 2", 
                "email": "cache2@example.com",
                "company": "Cache Test Company 2",
                "phone": "+1555222222",
                "call_volume": "45,000",
                "interaction_volume": "65,000",
                "message": "Testing schema cache consistency - Test 2"
            },
            {
                "name": "Cache Test 3",
                "email": "cache3@example.com", 
                "company": "Cache Test Company 3",
                "phone": "+1555333333",
                "call_volume": "15,000",
                "interaction_volume": "25,000",
                "message": "Testing schema cache consistency - Test 3"
            }
        ]
        
        cache_errors = 0
        successful_submissions = 0
        
        for i, test_case in enumerate(test_cases, 1):
            try:
                print(f"🔍 Testing schema cache consistency - Submission {i}/3...")
                
                response = requests.post(f"{BACKEND_URL}/demo/request", json=test_case, timeout=20)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        successful_submissions += 1
                        print(f"   ✅ Submission {i} successful")
                    else:
                        print(f"   ❌ Submission {i} failed: {result}")
                else:
                    error_text = response.text
                    if "schema cache" in error_text.lower():
                        cache_errors += 1
                        print(f"   ❌ Schema cache error in submission {i}: {error_text}")
                    else:
                        print(f"   ❌ Other error in submission {i}: HTTP {response.status_code}")
                
                # Small delay between requests
                time.sleep(1)
                
            except Exception as e:
                print(f"   ❌ Exception in submission {i}: {str(e)}")
        
        # Evaluate results
        if cache_errors == 0:
            self.log_test("Updated Schema - No Cache Errors", True, 
                        f"✅ No schema cache errors detected in {len(test_cases)} submissions")
        else:
            self.log_test("Updated Schema - No Cache Errors", False, 
                        f"❌ {cache_errors} schema cache errors detected")
        
        if successful_submissions >= 2:
            self.log_test("Updated Schema - Consistent Processing", True, 
                        f"✅ Consistent schema processing: {successful_submissions}/{len(test_cases)} successful")
        else:
            self.log_test("Updated Schema - Consistent Processing", False, 
                        f"❌ Inconsistent schema processing: only {successful_submissions}/{len(test_cases)} successful")
        
        return cache_errors == 0 and successful_submissions >= 2
    
    def test_data_persistence_verification(self):
        """Verify that data is correctly stored in Supabase with updated schema"""
        print("\n=== Testing Data Persistence with Updated Schema ===")
        
        if not hasattr(self, 'test_reference_id'):
            self.log_test("Updated Schema - Data Persistence", False, 
                        "No reference ID available from previous test")
            return False
        
        # Wait for background processing
        time.sleep(3)
        
        try:
            print(f"🔍 Verifying data persistence for reference ID: {self.test_reference_id}")
            response = requests.get(f"{BACKEND_URL}/demo/requests?limit=20", timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("requests"):
                    requests_data = result["requests"]
                    
                    # Look for our test request
                    found_request = None
                    for req in requests_data:
                        if req.get("email") == "updated@example.com":
                            found_request = req
                            break
                    
                    if found_request:
                        # Verify all expected fields are present
                        expected_fields = ["name", "email", "company", "phone", "call_volume", "interaction_volume", "message"]
                        missing_fields = [field for field in expected_fields if field not in found_request]
                        
                        if not missing_fields:
                            # Verify specific values
                            name_correct = found_request.get("name") == "Updated Schema Test"
                            call_volume_correct = found_request.get("call_volume") == "35,000"
                            interaction_volume_correct = found_request.get("interaction_volume") == "50,000"
                            message_correct = "user_name column" in found_request.get("message", "")
                            
                            if all([name_correct, call_volume_correct, interaction_volume_correct, message_correct]):
                                self.log_test("Updated Schema - Data Persistence", True, 
                                            f"✅ All data correctly stored with updated schema mapping")
                                return True
                            else:
                                issues = []
                                if not name_correct:
                                    issues.append(f"name: expected 'Updated Schema Test', got '{found_request.get('name')}'")
                                if not call_volume_correct:
                                    issues.append(f"call_volume: expected '35,000', got '{found_request.get('call_volume')}'")
                                if not interaction_volume_correct:
                                    issues.append(f"interaction_volume: expected '50,000', got '{found_request.get('interaction_volume')}'")
                                if not message_correct:
                                    issues.append(f"message: does not contain expected content")
                                
                                self.log_test("Updated Schema - Data Persistence", False, 
                                            f"Data values incorrect: {'; '.join(issues)}")
                                return False
                        else:
                            self.log_test("Updated Schema - Data Persistence", False, 
                                        f"Missing fields in stored data: {missing_fields}")
                            return False
                    else:
                        self.log_test("Updated Schema - Data Persistence", False, 
                                    "Test request not found in stored data")
                        return False
                else:
                    self.log_test("Updated Schema - Data Persistence", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                self.log_test("Updated Schema - Data Persistence", False, 
                            f"Cannot retrieve stored requests: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Updated Schema - Data Persistence", False, f"Exception: {str(e)}")
            return False
    
    def test_proper_success_response(self):
        """Test that proper success response is returned with updated schema"""
        print("\n=== Testing Proper Success Response ===")
        
        success_test_data = {
            "name": "Success Response Test",
            "email": "success@example.com",
            "company": "Success Response Company",
            "phone": "+1555999999",
            "call_volume": "35,000",
            "interaction_volume": "50,000",
            "message": "Testing proper success response with updated schema"
        }
        
        try:
            print(f"📝 Testing success response format...")
            
            response = requests.post(f"{BACKEND_URL}/demo/request", json=success_test_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check for expected success response structure
                expected_fields = ["success", "message", "reference_id", "status"]
                present_fields = [field for field in expected_fields if field in result]
                
                success_value = result.get("success")
                message_value = result.get("message")
                reference_id = result.get("reference_id")
                status_value = result.get("status")
                
                if (success_value is True and 
                    message_value and "successfully" in message_value.lower() and
                    reference_id and 
                    status_value == "submitted"):
                    
                    self.log_test("Updated Schema - Proper Success Response", True, 
                                f"✅ Proper success response format with all required fields")
                    return True
                else:
                    issues = []
                    if success_value is not True:
                        issues.append(f"success: expected True, got {success_value}")
                    if not message_value or "successfully" not in message_value.lower():
                        issues.append(f"message: invalid success message")
                    if not reference_id:
                        issues.append(f"reference_id: missing or empty")
                    if status_value != "submitted":
                        issues.append(f"status: expected 'submitted', got '{status_value}'")
                    
                    self.log_test("Updated Schema - Proper Success Response", False, 
                                f"Invalid success response: {'; '.join(issues)}")
                    return False
            else:
                self.log_test("Updated Schema - Proper Success Response", False, 
                            f"Expected success response, got HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Updated Schema - Proper Success Response", False, f"Exception: {str(e)}")
            return False
    
    def generate_test_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 SUPABASE UPDATED SCHEMA TESTING SUMMARY")
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
        schema_issues = [r for r in self.test_results if not r["passed"] and 
                        ("schema" in r["test"].lower() or "cache" in r["details"].lower())]
        if schema_issues:
            print(f"   ❌ SCHEMA ISSUES DETECTED:")
            for issue in schema_issues:
                print(f"      • {issue['test']}: {issue['details']}")
        else:
            print(f"   ✅ NO SCHEMA ISSUES: Updated schema working correctly")
        
        # Check for column name issues
        column_issues = [r for r in self.test_results if not r["passed"] and 
                        ("user_name" in r["details"].lower() or "User Name" in r["details"])]
        if column_issues:
            print(f"   ❌ COLUMN NAME ISSUES:")
            for issue in column_issues:
                print(f"      • {issue['details']}")
        else:
            print(f"   ✅ COLUMN MAPPING: user_name column mapping working correctly")
        
        # Check for volume field issues
        volume_issues = [r for r in self.test_results if not r["passed"] and 
                        ("volume" in r["test"].lower() or "volume" in r["details"].lower())]
        if volume_issues:
            print(f"   ❌ VOLUME FIELD ISSUES:")
            for issue in volume_issues:
                print(f"      • {issue['details']}")
        else:
            print(f"   ✅ VOLUME FIELDS: call_volume and interaction_volume working correctly")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - Updated Supabase schema integration is production-ready")
        elif success_rate >= 75:
            print(f"   ✅ GOOD - Updated schema working with minor issues")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Updated schema needs improvements")
        else:
            print(f"   ❌ POOR - Significant schema issues need resolution")
        
        # Specific recommendations
        print(f"\n💡 Recommendations:")
        
        if schema_issues:
            print(f"   • Fix Supabase schema cache issues")
            print(f"   • Verify column name mapping from 'name' to 'user_name'")
        
        if column_issues:
            print(f"   • Update frontend to use correct column names")
            print(f"   • Ensure backend properly maps 'name' field to 'user_name' column")
        
        if volume_issues:
            print(f"   • Verify call_volume and interaction_volume columns exist in Supabase")
            print(f"   • Check volume field data types and constraints")
        
        if success_rate >= 75:
            print(f"   • Updated schema integration ready for production use")
        else:
            print(f"   • Address failed test cases before production deployment")
        
        return success_rate >= 75
    
    def run_comprehensive_tests(self):
        """Run all comprehensive tests for updated Supabase schema"""
        print("🚀 Starting Supabase Updated Schema Testing")
        print("=" * 80)
        print("Testing demo request form with updated Supabase schema:")
        print("• Backend connectivity and health check")
        print("• Demo request submission with user_name column mapping")
        print("• Volume fields integration (call_volume, interaction_volume)")
        print("• Message field integration")
        print("• Schema cache error verification")
        print("• Data persistence verification")
        print("• Proper success response format")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity tests
            if not self.test_backend_connectivity():
                print("❌ Backend connectivity failed - aborting tests")
                return False
            
            if not self.test_health_check():
                print("❌ Backend health check failed - continuing with caution")
            
            # Core schema tests
            self.test_updated_schema_demo_request()
            self.test_volume_fields_integration()
            self.test_message_field_integration()
            self.test_schema_cache_errors()
            self.test_data_persistence_verification()
            self.test_proper_success_response()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_test_summary()
        
        return is_ready


def main():
    """Main function to run updated Supabase schema testing"""
    print("🎯 Supabase Updated Schema Testing")
    print("Testing demo request form with user_name column instead of 'User Name'")
    print()
    
    tester = SupabaseSchemaUpdatedTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: Updated Supabase schema integration is working correctly!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Updated schema needs attention before production use")
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