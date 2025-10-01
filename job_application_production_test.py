#!/usr/bin/env python3
"""
URGENT: Job Application Endpoint Production Testing
Testing job application endpoint to identify why applications are being lost
Focus: /api/proxy/job-application on production (https://admin.sentratech.net)
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys

# Production URLs
PRODUCTION_BACKEND_URL = "https://admin.sentratech.net"
PREVIEW_BACKEND_URL = "https://formflow-repair.preview.emergentagent.com"

class JobApplicationTester:
    def __init__(self):
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
    
    def test_production_job_application(self):
        """Test job application endpoint on production with exact payload from prompt"""
        print("\n🚨 CRITICAL TEST: Production Job Application Endpoint")
        print("Testing against: https://admin.sentratech.net")
        
        # Exact payload from the review request
        payload = {
            "full_name": "Test User",
            "email": "test@example.com", 
            "phone": "+8801234567890",
            "location": "Dhaka, Bangladesh",
            "position_applied": "Customer Support Specialist",
            "work_authorization": "Bangladeshi Citizen",
            "motivation": "Test application via API",
            "consent_for_storage": True
        }
        
        try:
            print(f"📋 Payload: {json.dumps(payload, indent=2)}")
            
            start_time = time.time()
            response = requests.post(
                f"{PRODUCTION_BACKEND_URL}/api/proxy/job-application",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "SentraTech-JobApplication-Test/1.0"
                },
                timeout=60  # Extended timeout for production
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"🕐 Response time: {response_time:.2f}ms")
            print(f"📊 Status code: {response.status_code}")
            print(f"📄 Response headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"📋 Response data: {json.dumps(data, indent=2)}")
                    
                    job_id = data.get('id') or data.get('data', {}).get('id')
                    if job_id:
                        self.log_test(
                            "Production Job Application", 
                            "PASS", 
                            f"HTTP 200, Job ID: {job_id}, Response time: {response_time:.2f}ms"
                        )
                        return True, job_id
                    else:
                        self.log_test(
                            "Production Job Application", 
                            "FAIL", 
                            f"HTTP 200 but no job ID returned. Response: {data}"
                        )
                        return False, None
                except json.JSONDecodeError:
                    self.log_test(
                        "Production Job Application", 
                        "FAIL", 
                        f"HTTP 200 but invalid JSON response: {response.text[:500]}"
                    )
                    return False, None
            else:
                self.log_test(
                    "Production Job Application", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response: {response.text[:500]}"
                )
                return False, None
                
        except requests.exceptions.Timeout:
            self.log_test("Production Job Application", "FAIL", "Request timeout (60s)")
            return False, None
        except requests.exceptions.ConnectionError as e:
            self.log_test("Production Job Application", "FAIL", f"Connection error: {str(e)}")
            return False, None
        except Exception as e:
            self.log_test("Production Job Application", "FAIL", f"Request error: {str(e)}")
            return False, None
    
    def test_preview_job_application(self):
        """Test job application endpoint on preview environment for comparison"""
        print("\n🔍 COMPARISON TEST: Preview Job Application Endpoint")
        print("Testing against: https://formflow-repair.preview.emergentagent.com")
        
        # Same payload as production test
        payload = {
            "full_name": "Test User Preview",
            "email": "test.preview@example.com", 
            "phone": "+8801234567890",
            "location": "Dhaka, Bangladesh",
            "position_applied": "Customer Support Specialist",
            "work_authorization": "Bangladeshi Citizen",
            "motivation": "Test application via API - Preview Environment",
            "consent_for_storage": True
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{PREVIEW_BACKEND_URL}/api/proxy/job-application",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "SentraTech-JobApplication-Test/1.0"
                },
                timeout=60
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"🕐 Response time: {response_time:.2f}ms")
            print(f"📊 Status code: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"📋 Response data: {json.dumps(data, indent=2)}")
                    
                    job_id = data.get('id') or data.get('data', {}).get('id')
                    self.log_test(
                        "Preview Job Application", 
                        "PASS", 
                        f"HTTP 200, Job ID: {job_id}, Response time: {response_time:.2f}ms"
                    )
                    return True, job_id
                except json.JSONDecodeError:
                    self.log_test(
                        "Preview Job Application", 
                        "FAIL", 
                        f"HTTP 200 but invalid JSON response: {response.text[:500]}"
                    )
                    return False, None
            else:
                self.log_test(
                    "Preview Job Application", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response: {response.text[:500]}"
                )
                return False, None
                
        except Exception as e:
            self.log_test("Preview Job Application", "FAIL", f"Request error: {str(e)}")
            return False, None
    
    def test_newsletter_comparison(self):
        """Test newsletter endpoint for comparison to see if there's confusion"""
        print("\n📧 COMPARISON TEST: Newsletter Signup Endpoint")
        print("Testing to compare with job application behavior")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test.newsletter@example.com",
            "source": "website_newsletter",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Test both production and preview
        for env_name, base_url in [("Production", PRODUCTION_BACKEND_URL), ("Preview", PREVIEW_BACKEND_URL)]:
            try:
                print(f"\n📍 Testing {env_name} Newsletter: {base_url}")
                
                start_time = time.time()
                response = requests.post(
                    f"{base_url}/api/proxy/newsletter-signup",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                response_time = (time.time() - start_time) * 1000
                
                print(f"🕐 Response time: {response_time:.2f}ms")
                print(f"📊 Status code: {response.status_code}")
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        newsletter_id = data.get('id') or data.get('data', {}).get('id')
                        self.log_test(
                            f"{env_name} Newsletter Signup", 
                            "PASS", 
                            f"HTTP 200, Newsletter ID: {newsletter_id}, Response time: {response_time:.2f}ms"
                        )
                    except json.JSONDecodeError:
                        self.log_test(
                            f"{env_name} Newsletter Signup", 
                            "FAIL", 
                            f"HTTP 200 but invalid JSON response: {response.text[:200]}"
                        )
                else:
                    self.log_test(
                        f"{env_name} Newsletter Signup", 
                        "FAIL", 
                        f"HTTP {response.status_code}, Response: {response.text[:200]}"
                    )
                    
            except Exception as e:
                self.log_test(f"{env_name} Newsletter Signup", "FAIL", f"Request error: {str(e)}")
    
    def test_routing_and_proxy_issues(self):
        """Test for routing or proxy configuration issues"""
        print("\n🔍 DIAGNOSTIC TEST: Routing and Proxy Configuration")
        
        # Test if endpoints exist
        endpoints_to_test = [
            "/api/proxy/job-application",
            "/api/proxy/newsletter-signup", 
            "/api/health"
        ]
        
        for endpoint in endpoints_to_test:
            for env_name, base_url in [("Production", PRODUCTION_BACKEND_URL), ("Preview", PREVIEW_BACKEND_URL)]:
                try:
                    print(f"\n📍 Testing {env_name} {endpoint}")
                    
                    # Try OPTIONS request first (for CORS preflight)
                    options_response = requests.options(
                        f"{base_url}{endpoint}",
                        headers={"Origin": "https://sentratech.net"},
                        timeout=10
                    )
                    print(f"OPTIONS {endpoint}: {options_response.status_code}")
                    
                    # Try GET request to see if endpoint exists
                    if endpoint == "/api/health":
                        get_response = requests.get(f"{base_url}{endpoint}", timeout=10)
                        print(f"GET {endpoint}: {get_response.status_code}")
                        if get_response.status_code == 200:
                            print(f"Health data: {get_response.json()}")
                    
                except Exception as e:
                    print(f"Error testing {env_name} {endpoint}: {str(e)}")
    
    def run_comprehensive_test(self):
        """Run comprehensive job application testing"""
        print("🚨 URGENT: Job Application Endpoint Investigation")
        print("=" * 70)
        print("ISSUE: Job applications from https://sentratech.net/careers/apply/customer-support-specialist are being LOST")
        print("GOAL: Identify the exact problem with job application submissions")
        print("=" * 70)
        
        # Test production job application endpoint (main focus)
        prod_success, prod_job_id = self.test_production_job_application()
        
        # Test preview environment for comparison
        preview_success, preview_job_id = self.test_preview_job_application()
        
        # Test newsletter endpoint for comparison
        self.test_newsletter_comparison()
        
        # Test routing and proxy issues
        self.test_routing_and_proxy_issues()
        
        # Print comprehensive analysis
        print("\n" + "=" * 70)
        print("🔍 CRITICAL ANALYSIS - JOB APPLICATION ISSUE")
        print("=" * 70)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Specific analysis for job application issue
        print(f"\n🎯 JOB APPLICATION ANALYSIS:")
        print(f"   Production Job Application: {'✅ WORKING' if prod_success else '❌ FAILING'}")
        if prod_job_id:
            print(f"   Production Job ID: {prod_job_id}")
        
        print(f"   Preview Job Application: {'✅ WORKING' if preview_success else '❌ FAILING'}")
        if preview_job_id:
            print(f"   Preview Job ID: {preview_job_id}")
        
        # Root cause analysis
        print(f"\n🔍 ROOT CAUSE ANALYSIS:")
        if not prod_success and not preview_success:
            print("   ❌ CRITICAL: Both production and preview job application endpoints are failing")
            print("   🔧 LIKELY CAUSE: Backend job application proxy configuration issue")
            print("   🎯 ACTION NEEDED: Fix job application proxy endpoint implementation")
        elif not prod_success and preview_success:
            print("   ❌ PRODUCTION ISSUE: Production job application endpoint failing, preview works")
            print("   🔧 LIKELY CAUSE: Production environment configuration or routing issue")
            print("   🎯 ACTION NEEDED: Check production deployment and environment variables")
        elif prod_success and not preview_success:
            print("   ⚠️ PREVIEW ISSUE: Preview failing but production works")
            print("   🔧 LIKELY CAUSE: Preview environment configuration issue")
            print("   🎯 ACTION NEEDED: Check preview environment setup")
        else:
            print("   ✅ ENDPOINTS WORKING: Both environments responding correctly")
            print("   🔧 LIKELY CAUSE: Frontend routing or form submission issue")
            print("   🎯 ACTION NEEDED: Check frontend job application form and routing")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 FAILED TESTS DETAILS:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}: {result['details']}")
        
        print(f"\n🚨 URGENT RECOMMENDATION:")
        if not prod_success:
            print("   1. IMMEDIATE: Fix production job application endpoint")
            print("   2. Verify dashboard integration at admin.sentratech.net")
            print("   3. Check API key and authentication configuration")
            print("   4. Test job application form submission from https://sentratech.net")
        else:
            print("   1. Job application endpoint is working correctly")
            print("   2. Issue may be in frontend form submission or routing")
            print("   3. Check browser network tab when submitting applications")
            print("   4. Verify form data reaches the backend endpoint")
        
        return prod_success

if __name__ == "__main__":
    print("🚨 URGENT: SentraTech Job Application Endpoint Investigation")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = JobApplicationTester()
    success = tester.run_comprehensive_test()
    
    print(f"\n🏁 Investigation completed at: {datetime.now(timezone.utc).isoformat()}")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)