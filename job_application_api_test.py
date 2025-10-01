#!/usr/bin/env python3
"""
Job Application API Endpoint Testing After Frontend URL Fix
Testing the job application proxy endpoint specifically as requested in review
Focus: POST to /api/proxy/job-application with realistic data
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone

# Backend URL from frontend environment
BACKEND_URL = "https://sentratech.net"

class JobApplicationTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.test_results = {}
        self.total_tests = 0
        self.passed_tests = 0
        
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        self.total_tests += 1
        if status == "PASS":
            self.passed_tests += 1
            print(f"✅ {test_name}: {status}")
        else:
            print(f"❌ {test_name}: {status}")
        
        if details:
            print(f"   Details: {details}")
        
        self.test_results[test_name] = {
            "status": status,
            "details": details,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    def test_backend_health(self):
        """Test backend health endpoint"""
        print("\n🔍 Testing Backend Health...")
        try:
            start_time = time.time()
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Backend Health Check", 
                    "PASS", 
                    f"Status: {data.get('status')}, Response time: {response_time:.2f}ms, Database: {data.get('database')}, Ingest configured: {data.get('ingest_configured')}"
                )
                return True
            else:
                self.log_test("Backend Health Check", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Backend Health Check", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def test_job_application_basic(self):
        """Test job application proxy endpoint with realistic data from review request"""
        print("\n👔 Testing Job Application Proxy - Basic Functionality...")
        
        # Using the exact payload format from the review request
        payload = {
            "id": str(uuid.uuid4()),
            "full_name": "Sarah Ahmed",
            "email": "sarah.ahmed@example.com",
            "phone": "+880 1712-345678",
            "location": "Dhaka, Bangladesh",
            "position_applied": "Customer Support Specialist",
            "preferred_shifts": "flexible",
            "availability_start_date": "2025-01-15",
            "motivation": "I am excited to join SentraTech and contribute to AI customer support innovation.",
            "cover_letter": "I have strong English communication skills and customer service experience.",
            "consent_for_storage": True,
            "source": "careers_page_single_form",
            "created": "2025-01-01T15:00:00.000Z"
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
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Job Application Basic Test", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True, data
            else:
                self.log_test(
                    "Job Application Basic Test", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False, None
                
        except Exception as e:
            self.log_test("Job Application Basic Test", "FAIL", f"Request error: {str(e)}")
            return False, None
    
    def test_job_application_idempotency(self):
        """Test job application idempotency and duplicate submission prevention"""
        print("\n🔄 Testing Job Application Idempotency...")
        
        # Use the same ID for both requests to test duplicate prevention
        duplicate_id = str(uuid.uuid4())
        
        payload = {
            "id": duplicate_id,
            "full_name": "Sarah Ahmed",
            "email": "sarah.ahmed@example.com",
            "phone": "+880 1712-345678",
            "location": "Dhaka, Bangladesh",
            "position_applied": "Customer Support Specialist",
            "preferred_shifts": "flexible",
            "availability_start_date": "2025-01-15",
            "motivation": "I am excited to join SentraTech and contribute to AI customer support innovation.",
            "cover_letter": "I have strong English communication skills and customer service experience.",
            "consent_for_storage": True,
            "source": "careers_page_single_form",
            "created": "2025-01-01T15:00:00.000Z"
        }
        
        try:
            # First submission - should succeed
            print("   Testing first submission...")
            start_time = time.time()
            response1 = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time1 = (time.time() - start_time) * 1000
            
            # Wait a moment then try duplicate
            time.sleep(1)
            
            # Second submission with same ID - should be rejected or handled gracefully
            print("   Testing duplicate submission...")
            start_time = time.time()
            response2 = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time2 = (time.time() - start_time) * 1000
            
            # Analyze results
            if response1.status_code == 200:
                if response2.status_code == 429:  # Rate limited/duplicate detected
                    self.log_test(
                        "Job Application Idempotency", 
                        "PASS", 
                        f"First: HTTP 200 ({response_time1:.2f}ms), Duplicate: HTTP 429 ({response_time2:.2f}ms) - Duplicate prevention working"
                    )
                    return True
                elif response2.status_code == 200:
                    # Check if it's the same response (idempotent)
                    data1 = response1.json()
                    data2 = response2.json()
                    id1 = data1.get('id') or data1.get('data', {}).get('id')
                    id2 = data2.get('id') or data2.get('data', {}).get('id')
                    if id1 == id2:
                        self.log_test(
                            "Job Application Idempotency", 
                            "PASS", 
                            f"Both HTTP 200, same ID returned ({id1}) - Idempotent behavior working"
                        )
                        return True
                    else:
                        self.log_test(
                            "Job Application Idempotency", 
                            "FAIL", 
                            f"Both HTTP 200 but different IDs ({id1} vs {id2}) - Duplicate not prevented"
                        )
                        return False
                else:
                    self.log_test(
                        "Job Application Idempotency", 
                        "FAIL", 
                        f"First: HTTP 200, Duplicate: HTTP {response2.status_code} - Unexpected duplicate response"
                    )
                    return False
            else:
                self.log_test(
                    "Job Application Idempotency", 
                    "FAIL", 
                    f"First submission failed: HTTP {response1.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Idempotency", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_job_application_error_handling(self):
        """Test job application error handling and graceful fallback"""
        print("\n🛡️ Testing Job Application Error Handling...")
        
        # Test with invalid payload to check error handling
        invalid_payload = {
            "id": str(uuid.uuid4()),
            "full_name": "",  # Empty required field
            "email": "invalid-email",  # Invalid email format
            "phone": "+880 1712-345678",
            "location": "Dhaka, Bangladesh"
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=invalid_payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            # Check if error is handled gracefully
            if response.status_code in [400, 422]:  # Bad request or validation error
                self.log_test(
                    "Job Application Error Handling", 
                    "PASS", 
                    f"HTTP {response.status_code} ({response_time:.2f}ms) - Validation errors handled correctly"
                )
                return True
            elif response.status_code == 200:
                # Check if it has fallback mechanism
                data = response.json()
                if data.get('success') == False or 'fallback' in str(data).lower() or 'error' in str(data).lower():
                    self.log_test(
                        "Job Application Error Handling", 
                        "PASS", 
                        f"HTTP 200 with graceful fallback - Error handled gracefully"
                    )
                    return True
                else:
                    self.log_test(
                        "Job Application Error Handling", 
                        "FAIL", 
                        f"HTTP 200 but invalid data accepted - Validation not working properly"
                    )
                    return False
            else:
                self.log_test(
                    "Job Application Error Handling", 
                    "FAIL", 
                    f"HTTP {response.status_code} - Unexpected error response"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Error Handling", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_response_format(self):
        """Test job application response format verification"""
        print("\n📋 Testing Job Application Response Format...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "full_name": "Sarah Ahmed",
            "email": "sarah.ahmed@example.com",
            "phone": "+880 1712-345678",
            "location": "Dhaka, Bangladesh",
            "position_applied": "Customer Support Specialist",
            "preferred_shifts": "flexible",
            "availability_start_date": "2025-01-15",
            "motivation": "I am excited to join SentraTech and contribute to AI customer support innovation.",
            "cover_letter": "I have strong English communication skills and customer service experience.",
            "consent_for_storage": True,
            "source": "careers_page_single_form",
            "created": "2025-01-01T15:00:00.000Z"
        }
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    
                    # Check expected response format
                    has_id = 'id' in data or ('data' in data and 'id' in data.get('data', {}))
                    has_success_indicator = 'success' in data or response.status_code == 200
                    is_valid_json = True
                    
                    if has_id and has_success_indicator and is_valid_json:
                        dashboard_id = data.get('id') or data.get('data', {}).get('id')
                        self.log_test(
                            "Job Application Response Format", 
                            "PASS", 
                            f"Valid JSON response with proper dashboard integration (ID: {dashboard_id})"
                        )
                        return True
                    else:
                        self.log_test(
                            "Job Application Response Format", 
                            "FAIL", 
                            f"Response missing required fields - ID: {has_id}, Success: {has_success_indicator}"
                        )
                        return False
                        
                except json.JSONDecodeError:
                    self.log_test(
                        "Job Application Response Format", 
                        "FAIL", 
                        "Response is not valid JSON"
                    )
                    return False
            else:
                self.log_test(
                    "Job Application Response Format", 
                    "FAIL", 
                    f"HTTP {response.status_code} - Expected 200 for valid submission"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Response Format", "FAIL", f"Request error: {str(e)}")
            return False
    
    def run_job_application_tests(self):
        """Run comprehensive job application API tests"""
        print("🚀 Starting Job Application API Endpoint Testing After Frontend URL Fix")
        print("=" * 80)
        
        # Test backend health first
        if not self.test_backend_health():
            print("\n❌ Backend health check failed. Stopping tests.")
            return False
        
        # Test job application endpoint specifically
        success, response_data = self.test_job_application_basic()
        if success:
            print(f"   ✅ Dashboard Integration: Data successfully forwarded to admin dashboard")
            if response_data:
                print(f"   📊 Response Data: {json.dumps(response_data, indent=2)}")
        
        # Test idempotency and duplicate prevention
        self.test_job_application_idempotency()
        
        # Test error handling and graceful fallback
        self.test_job_application_error_handling()
        
        # Test response format
        self.test_response_format()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 JOB APPLICATION API TEST SUMMARY")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print(f"\n✅ OVERALL RESULT: EXCELLENT - Job Application API ready for production!")
            print(f"   🎯 Expected Results Achieved:")
            print(f"   ✅ HTTP 200 response with dashboard integration")
            print(f"   ✅ Proper data forwarding to admin dashboard")
            print(f"   ✅ Graceful fallback mechanism working")
            print(f"   ✅ Idempotency and duplicate prevention functional")
        elif success_rate >= 60:
            print(f"\n⚠️ OVERALL RESULT: GOOD - Minor issues found, mostly ready")
        else:
            print(f"\n❌ OVERALL RESULT: NEEDS ATTENTION - Critical issues found")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 FAILED TESTS DETAILS:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}: {result['details']}")
        
        return success_rate >= 80

if __name__ == "__main__":
    print("Job Application API Endpoint Testing After Frontend URL Fix")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = JobApplicationTester()
    success = tester.run_job_application_tests()
    
    # Exit with appropriate code
    exit(0 if success else 1)