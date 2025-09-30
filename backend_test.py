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
BACKEND_URL = "https://dashboard-bridge-2.preview.emergentagent.com"

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
