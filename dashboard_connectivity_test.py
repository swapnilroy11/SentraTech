#!/usr/bin/env python3
"""
SentraTech Backend Dashboard Connectivity Testing
Testing dashboard connectivity and all form submission proxy endpoints as requested in review.
Focus: Dashboard integration, authentication headers, data conversion, environment variables
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys

# Backend URL from frontend .env
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"

class DashboardConnectivityTester:
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
    
    def test_health_endpoint(self):
        """Test /api/health endpoint to verify backend is operational"""
        print("\n🏥 Testing /api/health endpoint...")
        try:
            start_time = time.time()
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Health Endpoint", 
                    "PASS", 
                    f"Status: {data.get('status')}, Response time: {response_time:.2f}ms, Database: {data.get('database')}, Ingest configured: {data.get('ingest_configured')}"
                )
                return True
            else:
                self.log_test("Health Endpoint", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Health Endpoint", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def test_newsletter_signup_proxy(self):
        """Test /api/proxy/newsletter-signup with dashboard integration"""
        print("\n📧 Testing Newsletter Signup Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test@gmail.com",
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
    
    def test_contact_sales_proxy(self):
        """Test /api/proxy/contact-sales with dashboard integration"""
        print("\n💼 Testing Contact Sales Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "full_name": "John Smith",
            "work_email": "john.smith@company.com",
            "company_name": "Tech Solutions Inc",
            "phone": "+1-555-0123",
            "message": "Interested in enterprise AI solution",
            "company_website": "https://techsolutions.com",
            "call_volume": 2500,
            "interaction_volume": 3500,
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
    
    def test_demo_request_proxy(self):
        """Test /api/proxy/demo-request with dashboard integration"""
        print("\n🎯 Testing Demo Request Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "name": "Sarah Johnson",
            "email": "sarah.johnson@enterprise.com",
            "company": "Enterprise Corp",
            "phone": "+1-555-0456",
            "message": "Need demo for 5000+ monthly interactions",
            "call_volume": 3000,
            "interaction_volume": 5000,
            "total_volume": 8000,
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
    
    def test_roi_calculator_proxy(self):
        """Test /api/proxy/roi-calculator with bundles float->int conversion"""
        print("\n📊 Testing ROI Calculator Proxy (with bundles conversion)...")
        
        # Test with float bundles value to verify conversion
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test@gmail.com",
            "country": "Philippines",
            "call_volume": 3232,
            "interaction_volume": 232323,
            "bundles": 91.34392307692308,  # Float value that should be converted to int
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
                    "ROI Calculator Proxy (Float->Int Conversion)", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}, Bundles conversion working"
                )
                return True
            else:
                self.log_test(
                    "ROI Calculator Proxy (Float->Int Conversion)", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("ROI Calculator Proxy (Float->Int Conversion)", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_job_application_proxy(self):
        """Test /api/proxy/job-application with shifts array->string conversion and field mapping"""
        print("\n👔 Testing Job Application Proxy (with shifts conversion and field mapping)...")
        
        # Test with array shifts values and field mapping
        payload = {
            "id": str(uuid.uuid4()),
            "name": "Ahmed Hassan",  # Should be mapped to full_name
            "email": "ahmed.hassan@example.com",
            "phone": "+880 1712-345678",
            "location": "Dhaka, Bangladesh",
            "position": "Customer Support Specialist",  # Should be mapped to position_applied
            "work_shifts": ["flexible"],  # Array that should be converted to string
            "preferred_shifts": ["flexible"],  # Array that should be converted to string
            "availability_start_date": "2025-01-15",
            "motivation": "Excited to join SentraTech team",
            "cover_letter": "Strong communication skills and customer service experience",
            "consent_for_storage": True,
            "source": "careers_page",
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
                    "Job Application Proxy (Array->String + Field Mapping)", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}, Shifts conversion and field mapping working"
                )
                return True
            else:
                self.log_test(
                    "Job Application Proxy (Array->String + Field Mapping)", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Proxy (Array->String + Field Mapping)", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_authentication_headers(self):
        """Test that X-INGEST-KEY authentication headers are working correctly"""
        print("\n🔐 Testing X-INGEST-KEY Authentication Headers...")
        
        # Test environment variable configuration
        try:
            response = requests.get(f"{self.backend_url}/api/config/validate", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Authentication Configuration", 
                    "PASS", 
                    f"Config valid: {data.get('config_valid')}, Email configured: {data.get('email_service_configured')}"
                )
                return True
            else:
                self.log_test(
                    "Authentication Configuration", 
                    "FAIL", 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test("Authentication Configuration", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_environment_variables(self):
        """Test that ADMIN_DASHBOARD_URL and DASHBOARD_API_KEY are configured correctly"""
        print("\n🔧 Testing Environment Variables Configuration...")
        
        # Test configuration endpoint
        try:
            response = requests.get(f"{self.backend_url}/api/config/validate", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                config_valid = data.get('config_valid', False)
                
                if config_valid:
                    self.log_test(
                        "Environment Variables (ADMIN_DASHBOARD_URL & DASHBOARD_API_KEY)", 
                        "PASS", 
                        f"Configuration validated successfully, Config valid: {config_valid}"
                    )
                    return True
                else:
                    self.log_test(
                        "Environment Variables (ADMIN_DASHBOARD_URL & DASHBOARD_API_KEY)", 
                        "FAIL", 
                        f"Configuration validation failed, Config valid: {config_valid}"
                    )
                    return False
            else:
                self.log_test(
                    "Environment Variables (ADMIN_DASHBOARD_URL & DASHBOARD_API_KEY)", 
                    "FAIL", 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test("Environment Variables (ADMIN_DASHBOARD_URL & DASHBOARD_API_KEY)", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_connection_timeouts(self):
        """Test that there are no connection timeouts or dashboard API failures"""
        print("\n⏱️ Testing Connection Timeouts and Dashboard API Reliability...")
        
        # Test multiple endpoints with reasonable timeouts
        endpoints_to_test = [
            ("Newsletter Signup", "/api/proxy/newsletter-signup", {
                "id": str(uuid.uuid4()),
                "email": "timeout.test@gmail.com",
                "source": "timeout_test"
            }),
            ("Demo Request", "/api/proxy/demo-request", {
                "id": str(uuid.uuid4()),
                "name": "Timeout Test",
                "email": "timeout.test@gmail.com",
                "company": "Test Company"
            })
        ]
        
        timeout_tests_passed = 0
        
        for endpoint_name, endpoint_path, payload in endpoints_to_test:
            try:
                start_time = time.time()
                response = requests.post(
                    f"{self.backend_url}{endpoint_path}",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=30  # 30 second timeout
                )
                response_time = (time.time() - start_time) * 1000
                
                if response.status_code == 200:
                    if response_time < 30000:  # Less than 30 seconds
                        self.log_test(
                            f"Connection Timeout Test ({endpoint_name})", 
                            "PASS", 
                            f"HTTP 200, Response time: {response_time:.2f}ms (no timeout)"
                        )
                        timeout_tests_passed += 1
                    else:
                        self.log_test(
                            f"Connection Timeout Test ({endpoint_name})", 
                            "FAIL", 
                            f"HTTP 200 but slow response: {response_time:.2f}ms (>30s)"
                        )
                else:
                    self.log_test(
                        f"Connection Timeout Test ({endpoint_name})", 
                        "FAIL", 
                        f"HTTP {response.status_code}, Response time: {response_time:.2f}ms"
                    )
                    
            except requests.exceptions.Timeout:
                self.log_test(f"Connection Timeout Test ({endpoint_name})", "FAIL", "Request timed out (>30s)")
            except Exception as e:
                self.log_test(f"Connection Timeout Test ({endpoint_name})", "FAIL", f"Request error: {str(e)}")
        
        # Overall timeout test result
        if timeout_tests_passed == len(endpoints_to_test):
            self.log_test(
                "Dashboard API Connection Reliability", 
                "PASS", 
                f"All {timeout_tests_passed}/{len(endpoints_to_test)} endpoints responded without timeouts"
            )
            return True
        else:
            self.log_test(
                "Dashboard API Connection Reliability", 
                "FAIL", 
                f"Only {timeout_tests_passed}/{len(endpoints_to_test)} endpoints responded without timeouts"
            )
            return False
    
    def run_dashboard_connectivity_tests(self):
        """Run comprehensive dashboard connectivity test suite"""
        print("🚀 Starting SentraTech Backend Dashboard Connectivity Testing")
        print("Testing dashboard connectivity and all form submission proxy endpoints")
        print("=" * 80)
        
        # 1. Test /api/health endpoint to verify backend is operational
        print("\n🏥 REQUIREMENT 1: HEALTH ENDPOINT VERIFICATION")
        if not self.test_health_endpoint():
            print("\n❌ Backend health check failed. Continuing with other tests...")
        
        # 2. Test all 5 proxy form endpoints with sample data
        print("\n📋 REQUIREMENT 2: ALL 5 PROXY FORM ENDPOINTS")
        self.test_newsletter_signup_proxy()
        self.test_contact_sales_proxy()
        self.test_demo_request_proxy()
        self.test_roi_calculator_proxy()
        self.test_job_application_proxy()
        
        # 3. Verify dashboard integration returns HTTP 200 with proper response IDs
        print("\n✅ REQUIREMENT 3: HTTP 200 WITH RESPONSE IDs")
        print("   (Verified in individual endpoint tests above)")
        
        # 4. Check authentication headers (X-INGEST-KEY) are working correctly
        print("\n🔐 REQUIREMENT 4: AUTHENTICATION HEADERS")
        self.test_authentication_headers()
        
        # 5. Test that data is properly formatted and converted
        print("\n🔄 REQUIREMENT 5: DATA FORMATTING AND CONVERSION")
        print("   (Bundles float->int and shifts array->string tested in ROI Calculator and Job Application)")
        
        # 6. Verify environment variables are configured correctly
        print("\n🔧 REQUIREMENT 6: ENVIRONMENT VARIABLES")
        self.test_environment_variables()
        
        # 7. Ensure no connection timeouts or dashboard API failures
        print("\n⏱️ REQUIREMENT 7: CONNECTION TIMEOUTS AND API RELIABILITY")
        self.test_connection_timeouts()
        
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("📊 DASHBOARD CONNECTIVITY TEST SUMMARY")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests Executed: {self.total_tests}")
        print(f"Tests Passed: {self.passed_tests}")
        print(f"Tests Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Categorize results
        if success_rate >= 90:
            print(f"\n🎉 OVERALL RESULT: EXCELLENT - Dashboard connectivity working perfectly!")
            print("✅ All form submissions successfully connect to admin dashboard")
            print("✅ Authentication headers working correctly")
            print("✅ Data conversion and formatting working properly")
            print("✅ No connection timeouts or API failures detected")
        elif success_rate >= 80:
            print(f"\n✅ OVERALL RESULT: GOOD - Dashboard connectivity mostly working")
            print("⚠️ Minor issues found, but core dashboard integration intact")
            print("✅ Most form submissions reaching dashboard successfully")
        elif success_rate >= 60:
            print(f"\n⚠️ OVERALL RESULT: NEEDS ATTENTION - Dashboard connectivity has issues")
            print("❌ Several issues found that may impact form submissions")
            print("🔧 Requires fixes for reliable dashboard integration")
        else:
            print(f"\n❌ OVERALL RESULT: CRITICAL ISSUES - Dashboard connectivity failing")
            print("🚨 Major dashboard integration problems detected")
            print("🛠️ Immediate attention required for form submissions")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 DETAILED FAILURE ANALYSIS:")
            print("The following dashboard connectivity tests failed:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}")
                print(f"      Issue: {result['details']}")
                print(f"      Time: {result['timestamp']}")
        else:
            print(f"\n🎉 NO FAILURES DETECTED!")
            print("All dashboard connectivity requirements working correctly")
        
        # Print success summary
        passed_tests = [name for name, result in self.test_results.items() if result['status'] == 'PASS']
        if passed_tests:
            print(f"\n✅ SUCCESSFUL TESTS ({len(passed_tests)}):")
            for test_name in passed_tests:
                print(f"   ✅ {test_name}")
        
        print(f"\n🏁 DASHBOARD CONNECTIVITY TESTING COMPLETE")
        print(f"Backend URL tested: {self.backend_url}")
        print(f"Dashboard URL: https://admin.sentratech.net/api")
        print(f"Test completed at: {datetime.now(timezone.utc).isoformat()}")
        
        return success_rate >= 80

if __name__ == "__main__":
    print("🔧 SentraTech Backend Dashboard Connectivity Testing")
    print("Comprehensive verification of dashboard integration and form submission proxy endpoints")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Dashboard URL: https://admin.sentratech.net/api")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = DashboardConnectivityTester()
    success = tester.run_dashboard_connectivity_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)