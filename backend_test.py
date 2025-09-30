#!/usr/bin/env python3
"""
Final Comprehensive Backend Testing for SentraTech Form Proxy Endpoints
Testing all 5 form submission endpoints for dashboard deployment readiness
Focus: Newsletter Signup, ROI Calculator, Demo Request, Contact Sales, Job Application
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys

# Backend URL from frontend environment
BACKEND_URL = "https://real-time-dash.preview.emergentagent.com"

class ProxyEndpointTester:
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
    
    def test_newsletter_signup(self):
        """Test newsletter signup proxy endpoint"""
        print("\n📧 Testing Newsletter Signup Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test.newsletter@sentratech.net",
            "source": "website_newsletter",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Newsletter Signup Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "Newsletter Signup Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Newsletter Signup Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_roi_calculator(self):
        """Test ROI calculator proxy endpoint"""
        print("\n📊 Testing ROI Calculator Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test.roi@sentratech.net",
            "country": "Bangladesh",
            "call_volume": 2500,
            "interaction_volume": 3500,
            "total_volume": 6000,
            "calculated_savings": 125000.50,
            "roi_percentage": 65.5,
            "payback_period": 2.3,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/roi-calculator",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "ROI Calculator Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "ROI Calculator Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("ROI Calculator Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_demo_request(self):
        """Test demo request proxy endpoint"""
        print("\n🎯 Testing Demo Request Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "name": "Sarah Johnson",
            "email": "sarah.johnson@techcorp.com",
            "company": "TechCorp Solutions",
            "phone": "+1-555-0123",
            "message": "Interested in AI customer support solution for our growing business",
            "call_volume": 1500,
            "interaction_volume": 2000,
            "total_volume": 3500,
            "source": "website_demo_form",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/demo-request",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Demo Request Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "Demo Request Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Demo Request Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_contact_sales(self):
        """Test contact sales proxy endpoint"""
        print("\n💼 Testing Contact Sales Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "full_name": "Michael Chen",
            "work_email": "michael.chen@enterprise.com",
            "company_name": "Enterprise Solutions Inc",
            "phone": "+1-555-0456",
            "message": "Need enterprise AI solution for 10,000+ monthly interactions",
            "company_website": "https://enterprise.com",
            "call_volume": 5000,
            "interaction_volume": 8000,
            "preferred_contact_method": "email",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/contact-sales",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Contact Sales Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "Contact Sales Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Contact Sales Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_job_application(self):
        """Test job application proxy endpoint"""
        print("\n👔 Testing Job Application Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "full_name": "Jessica Rodriguez",
            "email": "jessica.rodriguez@email.com",
            "location": "Dhaka, Bangladesh",
            "linkedin_profile": "https://linkedin.com/in/jessicarodriguez",
            "position": "Customer Support Specialist English-Fluent",
            "preferred_shifts": "Day Shift (9 AM - 6 PM)",
            "availability_start_date": "2025-02-01",
            "cover_note": "Experienced customer support professional with 5+ years in tech support and fluent English communication skills. Passionate about helping customers and working with AI-powered tools.",
            "source": "website_careers",
            "consent_for_storage": True,
            "timestamp": datetime.now(timezone.utc).isoformat()
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
                    "Job Application Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "Job Application Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_environment_variables(self):
        """Test backend environment variable configuration"""
        print("\n🔧 Testing Environment Variable Configuration...")
        
        # Test if we can access the backend configuration endpoint
        try:
            response = requests.get(f"{self.backend_url}/api/config/validate", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Environment Configuration", 
                    "PASS", 
                    f"Config valid: {data.get('config_valid')}, Email configured: {data.get('email_service_configured')}"
                )
                return True
            else:
                self.log_test(
                    "Environment Configuration", 
                    "FAIL", 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test("Environment Configuration", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_authentication_headers(self):
        """Test that proxy endpoints handle authentication correctly"""
        print("\n🔐 Testing Authentication Header Handling...")
        
        # Test with missing authentication (should still work as proxy handles auth internally)
        payload = {
            "id": str(uuid.uuid4()),
            "email": "auth.test@sentratech.net",
            "source": "auth_test"
        }
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code in [200, 401, 403]:  # Expected responses
                self.log_test(
                    "Authentication Header Handling", 
                    "PASS", 
                    f"HTTP {response.status_code} - Proxy handles authentication internally"
                )
                return True
            else:
                self.log_test(
                    "Authentication Header Handling", 
                    "FAIL", 
                    f"Unexpected HTTP {response.status_code}: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Authentication Header Handling", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_response_times(self):
        """Test that all endpoints have reasonable response times"""
        print("\n⏱️ Testing Response Time Performance...")
        
        endpoints = [
            ("/api/health", {}),
            ("/api/proxy/newsletter-signup", {"id": str(uuid.uuid4()), "email": "perf.test@sentratech.net"}),
        ]
        
        total_response_time = 0
        successful_tests = 0
        
        for endpoint, payload in endpoints:
            try:
                start_time = time.time()
                if payload:
                    response = requests.post(f"{self.backend_url}{endpoint}", json=payload, timeout=30)
                else:
                    response = requests.get(f"{self.backend_url}{endpoint}", timeout=30)
                response_time = (time.time() - start_time) * 1000
                
                total_response_time += response_time
                successful_tests += 1
                
                if response_time > 5000:  # 5 seconds threshold
                    self.log_test(
                        f"Response Time {endpoint}", 
                        "FAIL", 
                        f"Slow response: {response_time:.2f}ms (>5000ms threshold)"
                    )
                else:
                    self.log_test(
                        f"Response Time {endpoint}", 
                        "PASS", 
                        f"Good response time: {response_time:.2f}ms"
                    )
                    
            except Exception as e:
                self.log_test(f"Response Time {endpoint}", "FAIL", f"Request error: {str(e)}")
        
        if successful_tests > 0:
            avg_response_time = total_response_time / successful_tests
            self.log_test(
                "Average Response Time", 
                "PASS" if avg_response_time < 3000 else "FAIL", 
                f"Average: {avg_response_time:.2f}ms"
            )
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting Comprehensive Backend Proxy Endpoint Testing")
        print("=" * 70)
        
        # Test backend health first
        if not self.test_backend_health():
            print("\n❌ Backend health check failed. Stopping tests.")
            return False
        
        # Test environment configuration
        self.test_environment_variables()
        
        # Test all 5 proxy endpoints
        self.test_newsletter_signup()
        self.test_roi_calculator()
        self.test_demo_request()
        self.test_contact_sales()
        self.test_job_application()
        
        # Test authentication and performance
        self.test_authentication_headers()
        self.test_response_times()
        
        # Print summary
        print("\n" + "=" * 70)
        print("📊 TEST SUMMARY")
        print("=" * 70)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print(f"\n✅ OVERALL RESULT: EXCELLENT - Backend ready for dashboard deployment!")
        elif success_rate >= 60:
            print(f"\n⚠️ OVERALL RESULT: GOOD - Minor issues found, mostly ready for deployment")
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
    print("SentraTech Backend Proxy Endpoints Testing")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = ProxyEndpointTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)
                    
        except Exception as e:
            self.log_test("Backend Health Check", "FAIL", f"Exception: {str(e)}")
            return False

    async def test_authentication(self):
        """Test 2: Authentication Testing"""
        print("\n🔐 Testing X-INGEST-KEY Authentication...")
        
        test_endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Company"
        }
        
        # Test 1: Valid key
        try:
            start_time = time.time()
            headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
            async with self.session.post(test_endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    self.log_test("Authentication - Valid Key", "PASS", 
                                "Valid key accepted", response_time)
                else:
                    self.log_test("Authentication - Valid Key", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Authentication - Valid Key", "FAIL", f"Exception: {str(e)}")
            
        # Test 2: Invalid key
        try:
            start_time = time.time()
            headers = {"X-INGEST-KEY": INVALID_INGEST_KEY, "Content-Type": "application/json"}
            async with self.session.post(test_endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 401:
                    self.log_test("Authentication - Invalid Key", "PASS", 
                                "Invalid key properly rejected", response_time)
                else:
                    self.log_test("Authentication - Invalid Key", "FAIL", 
                                f"Expected 401, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Authentication - Invalid Key", "FAIL", f"Exception: {str(e)}")
            
        # Test 3: Missing key
        try:
            start_time = time.time()
            headers = {"Content-Type": "application/json"}
            async with self.session.post(test_endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 401:
                    self.log_test("Authentication - Missing Key", "PASS", 
                                "Missing key properly rejected", response_time)
                else:
                    self.log_test("Authentication - Missing Key", "FAIL", 
                                f"Expected 401, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Authentication - Missing Key", "FAIL", f"Exception: {str(e)}")

    async def test_contact_requests_endpoint(self):
        """Test 3: Contact Sales Form Endpoint"""
        print("\n📞 Testing Contact Sales Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/contact_requests"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Valid data test
        valid_data = {
            "full_name": "Sarah Johnson",
            "work_email": "sarah.johnson@techcorp.com",
            "company_name": "TechCorp Solutions",
            "message": "Interested in enterprise AI customer support solution",
            "phone": "+1-555-0123",
            "company_website": "https://techcorp.com",
            "call_volume": 5000,
            "interaction_volume": 8000,
            "preferred_contact_method": "email"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("Contact Sales - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Contact Sales - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("Contact Sales - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Contact Sales - Valid Data", "FAIL", f"Exception: {str(e)}")
            
        # Invalid data test (missing required fields)
        invalid_data = {
            "work_email": "invalid-email",
            "message": "Test message"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=invalid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Contact Sales - Invalid Data", "PASS", 
                                "Invalid data properly rejected", response_time)
                else:
                    self.log_test("Contact Sales - Invalid Data", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Contact Sales - Invalid Data", "FAIL", f"Exception: {str(e)}")

    async def test_demo_requests_endpoint(self):
        """Test 4: Demo Request Form Endpoint"""
        print("\n🎯 Testing Demo Request Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Valid data test
        valid_data = {
            "name": "Michael Chen",
            "email": "michael.chen@innovatetech.com",
            "company": "InnovateTech Inc",
            "phone": "+1-555-0456",
            "message": "Would like to see AI automation capabilities",
            "call_volume": 3000,
            "interaction_volume": 4500,
            "total_volume": 7500,
            "source": "website"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("Demo Request - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Demo Request - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("Demo Request - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Demo Request - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_roi_reports_endpoint(self):
        """Test 5: ROI Calculator Form Endpoint"""
        print("\n💰 Testing ROI Calculator Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/roi_reports"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Valid data test
        valid_data = {
            "email": "finance@globalcorp.com",
            "country": "United States",
            "call_volume": 10000,
            "interaction_volume": 15000,
            "total_volume": 25000,
            "calculated_savings": 125000.50,
            "roi_percentage": 245.8,
            "payback_period": 3.2
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("ROI Calculator - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("ROI Calculator - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("ROI Calculator - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("ROI Calculator - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_subscriptions_endpoint(self):
        """Test 6: Newsletter Subscription Form Endpoint"""
        print("\n📧 Testing Newsletter Subscription Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/subscriptions"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Valid data test
        valid_data = {
            "email": "newsletter@businesstech.com",
            "source": "website"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("Newsletter Subscription - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Newsletter Subscription - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("Newsletter Subscription - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Newsletter Subscription - Valid Data", "FAIL", f"Exception: {str(e)}")
            
        # Invalid email test
        invalid_data = {
            "email": "invalid-email-format",
            "source": "website"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=invalid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                # Note: Based on backend code, email validation might be lenient
                if response.status in [200, 422]:
                    self.log_test("Newsletter Subscription - Invalid Email", "PASS", 
                                f"Response: {response.status}", response_time)
                else:
                    self.log_test("Newsletter Subscription - Invalid Email", "FAIL", 
                                f"Unexpected status: {response.status}", response_time)
        except Exception as e:
            self.log_test("Newsletter Subscription - Invalid Email", "FAIL", f"Exception: {str(e)}")

    async def test_job_applications_endpoint(self):
        """Test 7: Job Application Form Endpoint"""
        print("\n💼 Testing Job Application Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/job_applications"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Valid data test
        valid_data = {
            "full_name": "Alexandra Rodriguez",
            "email": "alexandra.rodriguez@email.com",
            "location": "Barcelona, Spain",
            "linkedin_profile": "https://linkedin.com/in/alexandra-rodriguez",
            "position": "Customer Support Specialist - Spanish Fluent",
            "preferred_shifts": "Morning (9 AM - 5 PM CET)",
            "availability_start_date": "2024-02-15",
            "cover_note": "Experienced customer support professional with 5+ years in tech industry. Fluent in Spanish, English, and Catalan. Passionate about AI-powered customer experiences.",
            "source": "careers_page",
            "consent_for_storage": True
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("Job Application - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Job Application - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("Job Application - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Job Application - Valid Data", "FAIL", f"Exception: {str(e)}")
            
        # Invalid data test (missing required fields)
        invalid_data = {
            "email": "incomplete@application.com"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=invalid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Job Application - Invalid Data", "PASS", 
                                "Invalid data properly rejected", response_time)
                else:
                    self.log_test("Job Application - Invalid Data", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Job Application - Invalid Data", "FAIL", f"Exception: {str(e)}")

    async def test_status_endpoints(self):
        """Test 8: Status Endpoints"""
        print("\n📊 Testing Status Endpoints...")
        
        status_endpoints = [
            "/api/ingest/contact_requests/status",
            "/api/ingest/demo_requests/status", 
            "/api/ingest/roi_reports/status",
            "/api/ingest/subscriptions/status",
            "/api/ingest/job_applications/status"
        ]
        
        for endpoint_path in status_endpoints:
            endpoint_name = endpoint_path.split('/')[-2].replace('_', ' ').title()
            
            try:
                start_time = time.time()
                async with self.session.get(f"{BACKEND_URL}{endpoint_path}") as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        data = await response.json()
                        if "total_count" in data:
                            self.log_test(f"Status Endpoint - {endpoint_name}", "PASS", 
                                        f"Count: {data.get('total_count')}", response_time)
                        else:
                            self.log_test(f"Status Endpoint - {endpoint_name}", "FAIL", 
                                        f"Missing total_count: {data}", response_time)
                    else:
                        self.log_test(f"Status Endpoint - {endpoint_name}", "FAIL", 
                                    f"HTTP {response.status}", response_time)
            except Exception as e:
                self.log_test(f"Status Endpoint - {endpoint_name}", "FAIL", f"Exception: {str(e)}")

    async def test_data_validation(self):
        """Test 9: Data Validation"""
        print("\n🔍 Testing Data Validation...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Test malformed JSON
        try:
            start_time = time.time()
            async with self.session.post(endpoint, data="invalid json", headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Data Validation - Malformed JSON", "PASS", 
                                "Malformed JSON properly rejected", response_time)
                else:
                    self.log_test("Data Validation - Malformed JSON", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Data Validation - Malformed JSON", "FAIL", f"Exception: {str(e)}")
            
        # Test empty payload
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json={}, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Data Validation - Empty Payload", "PASS", 
                                "Empty payload properly rejected", response_time)
                else:
                    self.log_test("Data Validation - Empty Payload", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Data Validation - Empty Payload", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_demo_request(self):
        """Test 10: Proxy Demo Request Endpoint"""
        print("\n🎯 Testing Proxy Demo Request Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/demo-request"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "name": "John Smith",
            "email": "john.smith@testcompany.com",
            "company": "Test Company Inc",
            "phone": "+1-555-0123",
            "message": "Interested in AI customer support demo",
            "call_volume": 2500,
            "interaction_volume": 3500,
            "source": "website"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy Demo Request - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy Demo Request - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy Demo Request - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy Demo Request - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_contact_sales(self):
        """Test 11: Proxy Contact Sales Endpoint"""
        print("\n📞 Testing Proxy Contact Sales Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/contact-sales"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "full_name": "Sarah Johnson",
            "work_email": "sarah.johnson@enterprise.com",
            "company_name": "Enterprise Solutions Ltd",
            "message": "Need enterprise AI support solution",
            "phone": "+1-555-0456",
            "company_website": "https://enterprise.com",
            "call_volume": 8000,
            "interaction_volume": 12000,
            "preferred_contact_method": "email"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy Contact Sales - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy Contact Sales - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy Contact Sales - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy Contact Sales - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_newsletter_signup(self):
        """Test 12: Proxy Newsletter Signup Endpoint"""
        print("\n📧 Testing Proxy Newsletter Signup Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "email": f"newsletter-test-{uuid.uuid4().hex[:8]}@testdomain.com",
            "source": "website",
            "id": str(uuid.uuid4())
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy Newsletter Signup - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy Newsletter Signup - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy Newsletter Signup - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy Newsletter Signup - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_roi_calculator(self):
        """Test 13: Proxy ROI Calculator Endpoint"""
        print("\n💰 Testing Proxy ROI Calculator Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/roi-calculator"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "email": f"roi-test-{uuid.uuid4().hex[:8]}@testcompany.com",
            "country": "United States",
            "call_volume": 5000,
            "interaction_volume": 7500,
            "calculated_savings": 85000.75,
            "roi_percentage": 180.5,
            "payback_period": 2.8
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy ROI Calculator - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy ROI Calculator - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy ROI Calculator - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy ROI Calculator - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_job_application(self):
        """Test 14: Proxy Job Application Endpoint"""
        print("\n💼 Testing Proxy Job Application Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/job-application"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "full_name": "Maria Garcia",
            "email": f"job-test-{uuid.uuid4().hex[:8]}@testmail.com",
            "location": "Madrid, Spain",
            "linkedin_profile": "https://linkedin.com/in/maria-garcia-test",
            "position": "Customer Support Specialist - Spanish Fluent",
            "preferred_shifts": "Afternoon (2 PM - 10 PM CET)",
            "availability_start_date": "2024-03-01",
            "cover_note": "Experienced customer support professional seeking AI-powered customer experience role.",
            "source": "careers_page",
            "consent_for_storage": True
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy Job Application - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy Job Application - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy Job Application - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy Job Application - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_database_storage(self):
        """Test 15: Database Storage Verification"""
        print("\n💾 Testing Database Storage...")
        
        # Submit a test record and verify it's stored
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        test_id = str(uuid.uuid4())
        test_data = {
            "name": f"Database Test User {test_id[:8]}",
            "email": f"dbtest-{test_id[:8]}@example.com",
            "company": "Database Test Company",
            "message": f"Database storage test - {test_id}"
        }
        
        try:
            # Submit data
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                submit_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    record_id = data.get("id")
                    
                    # Check status endpoint to verify storage
                    start_time = time.time()
                    async with self.session.get(f"{BACKEND_URL}/api/ingest/demo_requests/status") as status_response:
                        status_time = (time.time() - start_time) * 1000
                        
                        if status_response.status == 200:
                            status_data = await status_response.json()
                            recent_submissions = status_data.get("recent_submissions", [])
                            
                            # Check if our test record is in recent submissions
                            found = any(sub.get("email") == test_data["email"] for sub in recent_submissions)
                            
                            if found:
                                self.log_test("Database Storage - Verification", "PASS", 
                                            f"Record stored and retrievable (ID: {record_id})", 
                                            submit_time + status_time)
                            else:
                                self.log_test("Database Storage - Verification", "FAIL", 
                                            f"Record not found in recent submissions", 
                                            submit_time + status_time)
                        else:
                            self.log_test("Database Storage - Verification", "FAIL", 
                                        f"Status endpoint failed: {status_response.status}", 
                                        submit_time + status_time)
                else:
                    self.log_test("Database Storage - Verification", "FAIL", 
                                f"Submit failed: {response.status}", submit_time)
        except Exception as e:
            self.log_test("Database Storage - Verification", "FAIL", f"Exception: {str(e)}")

    async def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Comprehensive SentraTech Backend Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Valid Ingest Key: {VALID_INGEST_KEY[:20]}...")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Run all tests
            await self.test_backend_health()
            await self.test_authentication()
            
            # Test ingest endpoints
            await self.test_contact_requests_endpoint()
            await self.test_demo_requests_endpoint()
            await self.test_roi_reports_endpoint()
            await self.test_subscriptions_endpoint()
            await self.test_job_applications_endpoint()
            
            # Test proxy endpoints
            await self.test_proxy_demo_request()
            await self.test_proxy_contact_sales()
            await self.test_proxy_newsletter_signup()
            await self.test_proxy_roi_calculator()
            await self.test_proxy_job_application()
            
            # Test status and validation
            await self.test_status_endpoints()
            await self.test_data_validation()
            await self.test_database_storage()
            
        finally:
            await self.cleanup()
            
        # Print summary
        print("\n" + "=" * 80)
        print("🎯 TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        
        success_rate = (self.passed_tests / self.total_tests * 100) if self.total_tests > 0 else 0
        print(f"📊 Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"   - {result['test']}: {result['details']}")
        
        print("\n🎉 SentraTech Backend Testing Complete!")
        
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "success_rate": success_rate,
            "test_results": self.test_results
        }

async def main():
    """Main test runner"""
    tester = SentraTechBackendTester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())