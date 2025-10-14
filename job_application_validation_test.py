#!/usr/bin/env python3
"""
Job Application Backend Endpoint Validation Testing
Focus: Identify data validation issues similar to ROI calculator bundles problem
Testing comprehensive job application submission with various data types and edge cases
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys

# Backend URL - Using production backend URL from frontend .env
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"

class JobApplicationValidationTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.test_results = {}
        self.total_tests = 0
        self.passed_tests = 0
        self.validation_errors = []
        
    def log_test(self, test_name, status, details=""):
        """Log test results with detailed validation error tracking"""
        self.total_tests += 1
        if status == "PASS":
            self.passed_tests += 1
            print(f"✅ {test_name}: {status}")
        else:
            print(f"❌ {test_name}: {status}")
            if "422" in details or "validation" in details.lower():
                self.validation_errors.append({
                    "test": test_name,
                    "error": details
                })
        
        if details:
            print(f"   Details: {details}")
        
        self.test_results[test_name] = {
            "status": status,
            "details": details,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    def test_job_application_basic_submission(self):
        """Test basic job application submission with the exact payload from review request"""
        print("\n👔 Testing Job Application Basic Submission...")
        
        # Using the exact payload format from the review request
        payload = {
            "name": "John Doe",
            "email": "john.doe@gmail.com", 
            "phone": "+1234567890",
            "position": "Customer Support Specialist",
            "experience": "2-3 years",
            "location": "Remote",
            "motivation": "I am passionate about customer service...",
            "availability": "Immediately",
            "resume_url": "https://example.com/resume.pdf",
            "cover_letter": "Dear Hiring Manager...",
            "consent_data_processing": True,
            "consent_marketing": False
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Time: {response_time:.2f}ms")
            print(f"   Response Body: {response.text[:500]}...")
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Job Application Basic Submission", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            elif response.status_code == 422:
                # This is the key validation error we're looking for
                error_details = response.text
                self.log_test(
                    "Job Application Basic Submission", 
                    "FAIL", 
                    f"HTTP 422 VALIDATION ERROR - Response time: {response_time:.2f}ms, Error: {error_details}"
                )
                return False
            else:
                self.log_test(
                    "Job Application Basic Submission", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Basic Submission", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_job_application_data_type_conversions(self):
        """Test various data type scenarios that might cause validation issues"""
        print("\n🔄 Testing Job Application Data Type Conversions...")
        
        test_cases = [
            {
                "name": "Boolean Fields as Strings",
                "payload": {
                    "name": "Jane Smith",
                    "email": "jane.smith@gmail.com",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist",
                    "experience": "1-2 years",
                    "location": "New York",
                    "motivation": "I want to help customers succeed",
                    "availability": "2 weeks notice",
                    "consent_data_processing": "true",  # String instead of boolean
                    "consent_marketing": "false"        # String instead of boolean
                }
            },
            {
                "name": "Integer Fields as Strings",
                "payload": {
                    "name": "Mike Johnson",
                    "email": "mike.johnson@gmail.com",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist",
                    "experience": "3",  # Integer as string
                    "location": "California",
                    "motivation": "Customer service is my passion",
                    "availability": "Immediately",
                    "years_experience": "5",  # If this field exists
                    "consent_data_processing": True,
                    "consent_marketing": False
                }
            },
            {
                "name": "Mixed Data Types",
                "payload": {
                    "name": "Sarah Wilson",
                    "email": "sarah.wilson@gmail.com",
                    "phone": 1234567890,  # Integer instead of string
                    "position": "Customer Support Specialist",
                    "experience": 2.5,    # Float instead of string
                    "location": "Texas",
                    "motivation": "I love helping people solve problems",
                    "availability": "1 month",
                    "consent_data_processing": 1,  # Integer instead of boolean
                    "consent_marketing": 0         # Integer instead of boolean
                }
            }
        ]
        
        for test_case in test_cases:
            try:
                start_time = time.time()
                response = requests.post(
                    f"{self.backend_url}/api/proxy/job-application",
                    json=test_case["payload"],
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                response_time = (time.time() - start_time) * 1000
                
                print(f"   Testing: {test_case['name']}")
                print(f"   Response Status: {response.status_code}")
                print(f"   Response: {response.text[:300]}...")
                
                if response.status_code == 200:
                    data = response.json()
                    dashboard_id = data.get('id') or data.get('data', {}).get('id')
                    self.log_test(
                        f"Data Type Test: {test_case['name']}", 
                        "PASS", 
                        f"HTTP 200, Dashboard ID: {dashboard_id}"
                    )
                elif response.status_code == 422:
                    # Validation error - this is what we're looking for
                    self.log_test(
                        f"Data Type Test: {test_case['name']}", 
                        "FAIL", 
                        f"HTTP 422 VALIDATION ERROR: {response.text[:300]}"
                    )
                else:
                    self.log_test(
                        f"Data Type Test: {test_case['name']}", 
                        "FAIL", 
                        f"HTTP {response.status_code}: {response.text[:200]}"
                    )
                    
            except Exception as e:
                self.log_test(f"Data Type Test: {test_case['name']}", "FAIL", f"Request error: {str(e)}")
    
    def test_job_application_field_validation(self):
        """Test specific field validation issues"""
        print("\n🔍 Testing Job Application Field Validation...")
        
        validation_tests = [
            {
                "name": "Missing Required Fields",
                "payload": {
                    "name": "Test User"
                    # Missing email and other required fields
                }
            },
            {
                "name": "Invalid Email Format",
                "payload": {
                    "name": "Test User",
                    "email": "invalid-email-format",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist"
                }
            },
            {
                "name": "Invalid Phone Format",
                "payload": {
                    "name": "Test User",
                    "email": "test@example.com",
                    "phone": "invalid-phone",
                    "position": "Customer Support Specialist"
                }
            },
            {
                "name": "Empty Required Fields",
                "payload": {
                    "name": "",
                    "email": "",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist"
                }
            }
        ]
        
        for test in validation_tests:
            try:
                start_time = time.time()
                response = requests.post(
                    f"{self.backend_url}/api/proxy/job-application",
                    json=test["payload"],
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                response_time = (time.time() - start_time) * 1000
                
                print(f"   Testing: {test['name']}")
                print(f"   Response Status: {response.status_code}")
                print(f"   Response: {response.text[:300]}...")
                
                if response.status_code in [400, 422]:
                    # Expected validation error
                    self.log_test(
                        f"Field Validation: {test['name']}", 
                        "PASS", 
                        f"HTTP {response.status_code} - Validation error correctly caught"
                    )
                elif response.status_code == 200:
                    # Unexpected success - validation might be missing
                    self.log_test(
                        f"Field Validation: {test['name']}", 
                        "FAIL", 
                        f"HTTP 200 - Invalid data was accepted (validation missing)"
                    )
                else:
                    self.log_test(
                        f"Field Validation: {test['name']}", 
                        "FAIL", 
                        f"HTTP {response.status_code}: {response.text[:200]}"
                    )
                    
            except Exception as e:
                self.log_test(f"Field Validation: {test['name']}", "FAIL", f"Request error: {str(e)}")
    
    def test_job_application_file_upload_fields(self):
        """Test file upload field handling"""
        print("\n📎 Testing Job Application File Upload Fields...")
        
        file_upload_tests = [
            {
                "name": "Resume URL Field",
                "payload": {
                    "name": "File Test User",
                    "email": "filetest@example.com",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist",
                    "experience": "2 years",
                    "location": "Remote",
                    "motivation": "Test motivation",
                    "availability": "Immediately",
                    "resume_url": "https://example.com/resume.pdf",
                    "consent_data_processing": True,
                    "consent_marketing": False
                }
            },
            {
                "name": "Invalid Resume URL",
                "payload": {
                    "name": "File Test User 2",
                    "email": "filetest2@example.com",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist",
                    "experience": "2 years",
                    "location": "Remote",
                    "motivation": "Test motivation",
                    "availability": "Immediately",
                    "resume_url": "invalid-url-format",
                    "consent_data_processing": True,
                    "consent_marketing": False
                }
            },
            {
                "name": "Resume File Upload",
                "payload": {
                    "name": "File Test User 3",
                    "email": "filetest3@example.com",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist",
                    "experience": "2 years",
                    "location": "Remote",
                    "motivation": "Test motivation",
                    "availability": "Immediately",
                    "resume_file": "base64encodedfiledata...",  # Simulated file upload
                    "consent_data_processing": True,
                    "consent_marketing": False
                }
            }
        ]
        
        for test in file_upload_tests:
            try:
                start_time = time.time()
                response = requests.post(
                    f"{self.backend_url}/api/proxy/job-application",
                    json=test["payload"],
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                response_time = (time.time() - start_time) * 1000
                
                print(f"   Testing: {test['name']}")
                print(f"   Response Status: {response.status_code}")
                print(f"   Response: {response.text[:300]}...")
                
                if response.status_code == 200:
                    data = response.json()
                    dashboard_id = data.get('id') or data.get('data', {}).get('id')
                    self.log_test(
                        f"File Upload Test: {test['name']}", 
                        "PASS", 
                        f"HTTP 200, Dashboard ID: {dashboard_id}"
                    )
                elif response.status_code == 422:
                    self.log_test(
                        f"File Upload Test: {test['name']}", 
                        "FAIL", 
                        f"HTTP 422 VALIDATION ERROR: {response.text[:300]}"
                    )
                else:
                    self.log_test(
                        f"File Upload Test: {test['name']}", 
                        "FAIL", 
                        f"HTTP {response.status_code}: {response.text[:200]}"
                    )
                    
            except Exception as e:
                self.log_test(f"File Upload Test: {test['name']}", "FAIL", f"Request error: {str(e)}")
    
    def test_job_application_date_timestamp_validation(self):
        """Test date and timestamp format validation"""
        print("\n📅 Testing Job Application Date/Timestamp Validation...")
        
        date_tests = [
            {
                "name": "ISO Date Format",
                "payload": {
                    "name": "Date Test User",
                    "email": "datetest@example.com",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist",
                    "experience": "2 years",
                    "location": "Remote",
                    "motivation": "Test motivation",
                    "availability": "2025-02-01",  # ISO date format
                    "start_date": "2025-02-01T09:00:00Z",  # ISO timestamp
                    "consent_data_processing": True,
                    "consent_marketing": False
                }
            },
            {
                "name": "Invalid Date Format",
                "payload": {
                    "name": "Date Test User 2",
                    "email": "datetest2@example.com",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist",
                    "experience": "2 years",
                    "location": "Remote",
                    "motivation": "Test motivation",
                    "availability": "invalid-date-format",
                    "consent_data_processing": True,
                    "consent_marketing": False
                }
            },
            {
                "name": "Timestamp as String",
                "payload": {
                    "name": "Date Test User 3",
                    "email": "datetest3@example.com",
                    "phone": "+1234567890",
                    "position": "Customer Support Specialist",
                    "experience": "2 years",
                    "location": "Remote",
                    "motivation": "Test motivation",
                    "availability": "Immediately",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "consent_data_processing": True,
                    "consent_marketing": False
                }
            }
        ]
        
        for test in date_tests:
            try:
                start_time = time.time()
                response = requests.post(
                    f"{self.backend_url}/api/proxy/job-application",
                    json=test["payload"],
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                response_time = (time.time() - start_time) * 1000
                
                print(f"   Testing: {test['name']}")
                print(f"   Response Status: {response.status_code}")
                print(f"   Response: {response.text[:300]}...")
                
                if response.status_code == 200:
                    data = response.json()
                    dashboard_id = data.get('id') or data.get('data', {}).get('id')
                    self.log_test(
                        f"Date Validation: {test['name']}", 
                        "PASS", 
                        f"HTTP 200, Dashboard ID: {dashboard_id}"
                    )
                elif response.status_code == 422:
                    self.log_test(
                        f"Date Validation: {test['name']}", 
                        "FAIL", 
                        f"HTTP 422 VALIDATION ERROR: {response.text[:300]}"
                    )
                else:
                    self.log_test(
                        f"Date Validation: {test['name']}", 
                        "FAIL", 
                        f"HTTP {response.status_code}: {response.text[:200]}"
                    )
                    
            except Exception as e:
                self.log_test(f"Date Validation: {test['name']}", "FAIL", f"Request error: {str(e)}")
    
    def run_comprehensive_validation_tests(self):
        """Run all job application validation tests"""
        print("🔍 Starting Comprehensive Job Application Validation Testing")
        print("Focus: Identify data validation issues similar to ROI calculator bundles problem")
        print("=" * 80)
        
        # Test 1: Basic submission with exact payload from review request
        self.test_job_application_basic_submission()
        
        # Test 2: Data type conversion issues
        self.test_job_application_data_type_conversions()
        
        # Test 3: Field validation
        self.test_job_application_field_validation()
        
        # Test 4: File upload handling
        self.test_job_application_file_upload_fields()
        
        # Test 5: Date/timestamp validation
        self.test_job_application_date_timestamp_validation()
        
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("📊 JOB APPLICATION VALIDATION TEST SUMMARY")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests Executed: {self.total_tests}")
        print(f"Tests Passed: {self.passed_tests}")
        print(f"Tests Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Analyze validation errors
        if self.validation_errors:
            print(f"\n🚨 VALIDATION ERRORS FOUND ({len(self.validation_errors)}):")
            print("These are similar to the ROI calculator bundles issue:")
            for error in self.validation_errors:
                print(f"   ❌ {error['test']}")
                print(f"      Error: {error['error']}")
        else:
            print(f"\n✅ NO VALIDATION ERRORS FOUND")
            print("Job application endpoint appears to be working correctly")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 DETAILED FAILURE ANALYSIS:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}")
                print(f"      Issue: {result['details']}")
        
        print(f"\n🏁 JOB APPLICATION VALIDATION TESTING COMPLETE")
        print(f"Backend URL tested: {self.backend_url}")
        print(f"Test completed at: {datetime.now(timezone.utc).isoformat()}")
        
        return success_rate >= 80

if __name__ == "__main__":
    print("🔧 Job Application Backend Endpoint Validation Testing")
    print("Investigating data validation issues similar to ROI calculator bundles problem")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = JobApplicationValidationTester()
    success = tester.run_comprehensive_validation_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)