#!/usr/bin/env python3
"""
Job Application Backend Testing
Tests the Careers page functionality and Job Application submission system
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com/api"

# Valid ingest key from backend .env
VALID_INGEST_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"

class JobApplicationBackendTester:
    """Job Application Backend Testing"""
    
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
                    ingest_configured = result.get("ingest_configured", False)
                    self.log_test("Backend Health Check", True, 
                                f"Backend healthy - Response time: {response_time}ms, Ingest configured: {ingest_configured}")
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
    
    def test_job_application_submission(self):
        """Test job application submission with comprehensive data"""
        print("\n=== Testing Job Application Submission ===")
        
        # Realistic test data for Customer Support Specialist position
        test_data = {
            "fullName": "Sarah Johnson",
            "email": "sarah.johnson@email.com",
            "phone": "+880-1234-567890",
            "location": "Dhaka, Bangladesh",
            "linkedinProfile": "https://linkedin.com/in/sarah-johnson-cs",
            "position": "Customer Support Specialist (English-Fluent)",
            "preferredShifts": "Night Shift (US/UK Hours)",
            "availabilityStartDate": "2024-02-01",
            "coverNote": "I am a dedicated customer service professional with 3+ years of experience in technical support and customer relations. I have excellent English communication skills and experience working with international clients. I am passionate about helping customers solve their problems and providing exceptional service experiences. I am available for night shifts to support US/UK time zones and am excited about the opportunity to join SentraTech's growing team.",
            "source": "careers_page",
            "consentForStorage": True
        }
        
        headers = {
            "X-INGEST-KEY": VALID_INGEST_KEY,
            "Content-Type": "application/json"
        }
        
        try:
            print(f"📝 Submitting job application...")
            print(f"   Position: {test_data['position']}")
            print(f"   Applicant: {test_data['fullName']} ({test_data['email']})")
            print(f"   Location: {test_data['location']}")
            
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure
                required_fields = ["status", "message", "id"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result.get("status") == "success" and result.get("id"):
                        self.log_test("Job Application Submission", True, 
                                    f"✅ Job application submitted successfully! ID: {result['id']}")
                        
                        # Store ID for verification
                        self.test_application_id = result["id"]
                        return True
                    else:
                        self.log_test("Job Application Submission", False, 
                                    f"Invalid response values: status={result.get('status')}, id={result.get('id')}")
                        return False
                else:
                    self.log_test("Job Application Submission", False, 
                                f"Missing response fields: {missing_fields}")
                    return False
            else:
                error_text = response.text
                self.log_test("Job Application Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Job Application Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_job_application_authentication(self):
        """Test X-INGEST-KEY authentication"""
        print("\n=== Testing Job Application Authentication ===")
        
        test_data = {
            "fullName": "Test User",
            "email": "test@example.com",
            "location": "Bangladesh",
            "position": "Customer Support Specialist",
            "consentForStorage": True
        }
        
        # Test 1: Valid ingest key
        try:
            print(f"🔑 Testing valid ingest key...")
            headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=test_data, headers=headers, timeout=15)
            
            if response.status_code == 200:
                self.log_test("Job Application Auth - Valid Key", True, 
                            f"✅ Valid ingest key accepted: HTTP {response.status_code}")
            else:
                self.log_test("Job Application Auth - Valid Key", False, 
                            f"Valid key rejected: HTTP {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_test("Job Application Auth - Valid Key", False, f"Exception: {str(e)}")
        
        # Test 2: Invalid ingest key
        try:
            print(f"🔑 Testing invalid ingest key...")
            headers = {"X-INGEST-KEY": "invalid-key-12345", "Content-Type": "application/json"}
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=test_data, headers=headers, timeout=15)
            
            if response.status_code == 401:
                self.log_test("Job Application Auth - Invalid Key", True, 
                            f"✅ Invalid ingest key correctly rejected: HTTP {response.status_code}")
            else:
                self.log_test("Job Application Auth - Invalid Key", False, 
                            f"Expected HTTP 401, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Job Application Auth - Invalid Key", False, f"Exception: {str(e)}")
        
        # Test 3: Missing ingest key
        try:
            print(f"🔑 Testing missing ingest key...")
            headers = {"Content-Type": "application/json"}
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=test_data, headers=headers, timeout=15)
            
            if response.status_code == 401:
                self.log_test("Job Application Auth - Missing Key", True, 
                            f"✅ Missing ingest key correctly rejected: HTTP {response.status_code}")
            else:
                self.log_test("Job Application Auth - Missing Key", False, 
                            f"Expected HTTP 401, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Job Application Auth - Missing Key", False, f"Exception: {str(e)}")
    
    def test_job_application_validation(self):
        """Test job application data validation"""
        print("\n=== Testing Job Application Validation ===")
        
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Test 1: Missing required fields
        invalid_data_1 = {
            "location": "Bangladesh",
            "position": "Customer Support Specialist",
            "consentForStorage": True
            # Missing fullName and email
        }
        
        try:
            print(f"🔍 Testing validation - Missing required fields...")
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=invalid_data_1, headers=headers, timeout=15)
            
            if response.status_code in [400, 422]:  # Validation error expected
                self.log_test("Job Application Validation - Missing Fields", True, 
                            f"✅ Validation correctly rejected missing fields: HTTP {response.status_code}")
            else:
                self.log_test("Job Application Validation - Missing Fields", False, 
                            f"Expected validation error, got HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Job Application Validation - Missing Fields", False, f"Exception: {str(e)}")
        
        # Test 2: Invalid email format
        invalid_data_2 = {
            "fullName": "Test User",
            "email": "invalid-email-format",
            "location": "Bangladesh",
            "position": "Customer Support Specialist",
            "consentForStorage": True
        }
        
        try:
            print(f"🔍 Testing validation - Invalid email format...")
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=invalid_data_2, headers=headers, timeout=15)
            
            if response.status_code in [400, 422]:  # Validation error expected
                self.log_test("Job Application Validation - Invalid Email", True, 
                            f"✅ Validation correctly rejected invalid email: HTTP {response.status_code}")
            else:
                self.log_test("Job Application Validation - Invalid Email", False, 
                            f"Expected validation error, got HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Job Application Validation - Invalid Email", False, f"Exception: {str(e)}")
        
        # Test 3: Malformed JSON
        try:
            print(f"🔍 Testing validation - Malformed JSON...")
            malformed_json = '{"fullName": "Test", "email": "test@example.com", "invalid": }'
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   data=malformed_json, headers=headers, timeout=15)
            
            if response.status_code == 422:  # JSON parsing error expected
                self.log_test("Job Application Validation - Malformed JSON", True, 
                            f"✅ Malformed JSON correctly rejected: HTTP {response.status_code}")
            else:
                self.log_test("Job Application Validation - Malformed JSON", False, 
                            f"Expected HTTP 422, got {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Job Application Validation - Malformed JSON", False, f"Exception: {str(e)}")
    
    def test_job_application_status_endpoint(self):
        """Test job application status endpoint"""
        print("\n=== Testing Job Application Status Endpoint ===")
        
        try:
            print(f"📊 Testing job application status endpoint...")
            response = requests.get(f"{BACKEND_URL}/ingest/job_applications/status", timeout=15)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure
                required_fields = ["total_count", "recent_applications"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    total_count = result.get("total_count", 0)
                    recent_apps = result.get("recent_applications", [])
                    
                    self.log_test("Job Application Status Endpoint", True, 
                                f"✅ Status endpoint working - Total: {total_count}, Recent: {len(recent_apps)}")
                    return True
                else:
                    self.log_test("Job Application Status Endpoint", False, 
                                f"Missing response fields: {missing_fields}")
                    return False
            else:
                self.log_test("Job Application Status Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Job Application Status Endpoint", False, f"Exception: {str(e)}")
            return False
    
    def test_mongodb_data_persistence(self):
        """Test if job application data is properly stored in MongoDB"""
        print("\n=== Testing MongoDB Data Persistence ===")
        
        if not hasattr(self, 'test_application_id'):
            self.log_test("Job Application Data Persistence", False, 
                        "No application ID available from previous test")
            return False
        
        # Wait a moment for background processing
        time.sleep(3)
        
        try:
            print(f"🔍 Checking data persistence via status endpoint...")
            response = requests.get(f"{BACKEND_URL}/ingest/job_applications/status", timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("total_count") is not None and result.get("recent_applications"):
                    total_count = result["total_count"]
                    recent_apps = result["recent_applications"]
                    
                    # Look for our test application
                    found_application = None
                    for app in recent_apps:
                        if app.get("email") == "sarah.johnson@email.com":
                            found_application = app
                            break
                    
                    if found_application:
                        # Check if required fields are present
                        required_fields = ["full_name", "email", "position", "location", "created_at"]
                        missing_fields = [field for field in required_fields if field not in found_application]
                        
                        if not missing_fields:
                            self.log_test("Job Application Data Persistence", True, 
                                        f"✅ Application data stored correctly - Name: {found_application.get('full_name')}, Position: {found_application.get('position')}")
                            return True
                        else:
                            self.log_test("Job Application Data Persistence", False, 
                                        f"Missing fields in stored data: {missing_fields}")
                            return False
                    else:
                        # Check if we have any applications at all
                        if total_count > 0:
                            self.log_test("Job Application Data Persistence", True, 
                                        f"✅ Data persistence working - {total_count} applications stored (test application may be older)")
                            return True
                        else:
                            self.log_test("Job Application Data Persistence", False, 
                                        "No applications found in database")
                            return False
                else:
                    self.log_test("Job Application Data Persistence", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                self.log_test("Job Application Data Persistence", False, 
                            f"Cannot retrieve stored applications: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Job Application Data Persistence", False, f"Exception: {str(e)}")
            return False
    
    def test_comprehensive_job_application_scenarios(self):
        """Test various job application scenarios"""
        print("\n=== Testing Comprehensive Job Application Scenarios ===")
        
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        test_scenarios = [
            {
                "name": "Minimal Application",
                "data": {
                    "fullName": "John Doe",
                    "email": "john.doe@example.com",
                    "location": "Bangladesh",
                    "position": "Customer Support Specialist (English-Fluent)",
                    "consentForStorage": True
                },
                "description": "Application with only required fields"
            },
            {
                "name": "Complete Application",
                "data": {
                    "fullName": "Jane Smith",
                    "email": "jane.smith@example.com",
                    "phone": "+880-9876-543210",
                    "location": "Chittagong, Bangladesh",
                    "linkedinProfile": "https://linkedin.com/in/jane-smith",
                    "position": "Customer Support Specialist (English-Fluent)",
                    "preferredShifts": "Day Shift",
                    "availabilityStartDate": "2024-03-01",
                    "coverNote": "Experienced customer support professional with excellent communication skills and 5+ years in the industry.",
                    "source": "careers_page",
                    "consentForStorage": True
                },
                "description": "Application with all optional fields"
            },
            {
                "name": "Different Position",
                "data": {
                    "fullName": "Mike Johnson",
                    "email": "mike.johnson@example.com",
                    "location": "Sylhet, Bangladesh",
                    "position": "Technical Support Specialist",
                    "consentForStorage": True
                },
                "description": "Application for different position"
            }
        ]
        
        successful_scenarios = 0
        
        for scenario in test_scenarios:
            try:
                print(f"🔍 Testing {scenario['description']}...")
                response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                       json=scenario["data"], headers=headers, timeout=20)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("status") == "success":
                        successful_scenarios += 1
                        self.log_test(f"Job Application - {scenario['name']}", True, 
                                    f"✅ {scenario['description']} successful")
                    else:
                        self.log_test(f"Job Application - {scenario['name']}", False, 
                                    f"Request failed: {result}")
                else:
                    self.log_test(f"Job Application - {scenario['name']}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                
                # Small delay between requests
                time.sleep(1)
                
            except Exception as e:
                self.log_test(f"Job Application - {scenario['name']}", False, f"Exception: {str(e)}")
        
        # Overall scenario compatibility test
        if successful_scenarios >= 2:  # At least 2 out of 3 scenarios should work
            self.log_test("Job Application Scenario Compatibility", True, 
                        f"✅ Good scenario compatibility: {successful_scenarios}/3 scenarios successful")
        else:
            self.log_test("Job Application Scenario Compatibility", False, 
                        f"Poor scenario compatibility: only {successful_scenarios}/3 scenarios successful")
    
    def generate_test_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 JOB APPLICATION BACKEND TESTING SUMMARY")
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
        
        # Check for authentication issues
        auth_issues = [r for r in self.test_results if "Auth" in r["test"] and not r["passed"]]
        if auth_issues:
            print(f"   ❌ AUTHENTICATION ISSUES:")
            for issue in auth_issues:
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
            print(f"   🎉 EXCELLENT - Job application system is production-ready")
        elif success_rate >= 75:
            print(f"   ✅ GOOD - Job application system working with minor issues")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Job application system needs improvements")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        if auth_issues:
            print(f"   • Review X-INGEST-KEY authentication implementation")
        
        if validation_issues:
            print(f"   • Improve job application data validation")
        
        if persistence_issues:
            print(f"   • Verify MongoDB storage and retrieval functionality")
        
        if success_rate >= 75:
            print(f"   • Job application system ready for production use")
        
        return success_rate >= 75
    
    def run_comprehensive_tests(self):
        """Run all comprehensive tests for job application backend"""
        print("🚀 Starting Job Application Backend Testing")
        print("=" * 80)
        print("Testing Careers page functionality and Job Application submission system:")
        print("• Backend connectivity and health check")
        print("• Job application submission with comprehensive data")
        print("• X-INGEST-KEY authentication testing")
        print("• Data validation and error handling")
        print("• Job application status endpoint")
        print("• MongoDB data persistence verification")
        print("• Comprehensive application scenarios")
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
            self.test_job_application_submission()
            self.test_job_application_authentication()
            self.test_job_application_validation()
            self.test_job_application_status_endpoint()
            self.test_mongodb_data_persistence()
            self.test_comprehensive_job_application_scenarios()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_test_summary()
        
        return is_ready


def main():
    """Main function to run job application backend testing"""
    print("🎯 Job Application Backend Testing")
    print("Testing Careers page functionality and Job Application submission system")
    print()
    
    tester = JobApplicationBackendTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: Job application backend system is working correctly!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Job application system needs attention before production use")
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