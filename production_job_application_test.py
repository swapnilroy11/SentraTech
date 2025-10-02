#!/usr/bin/env python3
"""
URGENT: Correct Production Job Application Endpoint Testing
Testing the actual production URL that the frontend uses: https://sentratech.net/api/proxy
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys

# Correct production URLs based on frontend .env
PRODUCTION_API_BASE = "https://sentratech.net/api/proxy"
PRODUCTION_BACKEND_URL = "https://sentratech.net"
PREVIEW_BACKEND_URL = "https://matrix-team-update.preview.emergentagent.com"

class ProductionJobApplicationTester:
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
    
    def test_production_job_application_correct_url(self):
        """Test job application endpoint on CORRECT production URL"""
        print("\n🚨 CRITICAL TEST: Production Job Application Endpoint (CORRECT URL)")
        print(f"Testing against: {PRODUCTION_API_BASE}/job-application")
        
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
                f"{PRODUCTION_API_BASE}/job-application",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "Origin": "https://sentratech.net",
                    "Referer": "https://sentratech.net/careers/apply/customer-support-specialist",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
                timeout=60
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"🕐 Response time: {response_time:.2f}ms")
            print(f"📊 Status code: {response.status_code}")
            print(f"📄 Response headers: {dict(response.headers)}")
            print(f"📄 Response text: {response.text}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"📋 Response data: {json.dumps(data, indent=2)}")
                    
                    job_id = data.get('id') or data.get('data', {}).get('id')
                    if job_id:
                        self.log_test(
                            "Production Job Application (Correct URL)", 
                            "PASS", 
                            f"HTTP 200, Job ID: {job_id}, Response time: {response_time:.2f}ms"
                        )
                        return True, job_id
                    else:
                        self.log_test(
                            "Production Job Application (Correct URL)", 
                            "FAIL", 
                            f"HTTP 200 but no job ID returned. Response: {data}"
                        )
                        return False, None
                except json.JSONDecodeError:
                    self.log_test(
                        "Production Job Application (Correct URL)", 
                        "FAIL", 
                        f"HTTP 200 but invalid JSON response: {response.text[:500]}"
                    )
                    return False, None
            else:
                self.log_test(
                    "Production Job Application (Correct URL)", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response: {response.text[:500]}"
                )
                return False, None
                
        except requests.exceptions.Timeout:
            self.log_test("Production Job Application (Correct URL)", "FAIL", "Request timeout (60s)")
            return False, None
        except requests.exceptions.ConnectionError as e:
            self.log_test("Production Job Application (Correct URL)", "FAIL", f"Connection error: {str(e)}")
            return False, None
        except Exception as e:
            self.log_test("Production Job Application (Correct URL)", "FAIL", f"Request error: {str(e)}")
            return False, None
    
    def test_production_newsletter_correct_url(self):
        """Test newsletter endpoint on CORRECT production URL for comparison"""
        print("\n📧 COMPARISON TEST: Production Newsletter Endpoint (CORRECT URL)")
        print(f"Testing against: {PRODUCTION_API_BASE}/newsletter-signup")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test.newsletter@example.com",
            "source": "website_newsletter",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{PRODUCTION_API_BASE}/newsletter-signup",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "Origin": "https://sentratech.net",
                    "Referer": "https://sentratech.net/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"🕐 Response time: {response_time:.2f}ms")
            print(f"📊 Status code: {response.status_code}")
            print(f"📄 Response text: {response.text}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    newsletter_id = data.get('id') or data.get('data', {}).get('id')
                    self.log_test(
                        "Production Newsletter (Correct URL)", 
                        "PASS", 
                        f"HTTP 200, Newsletter ID: {newsletter_id}, Response time: {response_time:.2f}ms"
                    )
                    return True, newsletter_id
                except json.JSONDecodeError:
                    self.log_test(
                        "Production Newsletter (Correct URL)", 
                        "FAIL", 
                        f"HTTP 200 but invalid JSON response: {response.text[:500]}"
                    )
                    return False, None
            else:
                self.log_test(
                    "Production Newsletter (Correct URL)", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response: {response.text[:500]}"
                )
                return False, None
                
        except Exception as e:
            self.log_test("Production Newsletter (Correct URL)", "FAIL", f"Request error: {str(e)}")
            return False, None
    
    def test_production_health_check(self):
        """Test production health endpoint"""
        print("\n🔍 DIAGNOSTIC TEST: Production Health Check")
        print(f"Testing against: {PRODUCTION_BACKEND_URL}/api/health")
        
        try:
            start_time = time.time()
            response = requests.get(
                f"{PRODUCTION_BACKEND_URL}/api/health",
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"🕐 Response time: {response_time:.2f}ms")
            print(f"📊 Status code: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"📋 Health data: {json.dumps(data, indent=2)}")
                    self.log_test(
                        "Production Health Check", 
                        "PASS", 
                        f"HTTP 200, Status: {data.get('status')}, Response time: {response_time:.2f}ms"
                    )
                    return True
                except json.JSONDecodeError:
                    self.log_test(
                        "Production Health Check", 
                        "FAIL", 
                        f"HTTP 200 but invalid JSON response: {response.text[:200]}"
                    )
                    return False
            else:
                self.log_test(
                    "Production Health Check", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Production Health Check", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_all_production_endpoints(self):
        """Test all production endpoints to identify routing issues"""
        print("\n🔍 COMPREHENSIVE TEST: All Production Endpoints")
        
        endpoints_to_test = [
            ("job-application", "POST"),
            ("newsletter-signup", "POST"), 
            ("demo-request", "POST"),
            ("contact-sales", "POST"),
            ("roi-calculator", "POST")
        ]
        
        sample_payloads = {
            "job-application": {
                "full_name": "Test User",
                "email": "test@example.com",
                "position_applied": "Customer Support Specialist",
                "consent_for_storage": True
            },
            "newsletter-signup": {
                "id": str(uuid.uuid4()),
                "email": "test@example.com",
                "source": "website"
            },
            "demo-request": {
                "id": str(uuid.uuid4()),
                "name": "Test User",
                "email": "test@example.com",
                "company": "Test Company"
            },
            "contact-sales": {
                "id": str(uuid.uuid4()),
                "full_name": "Test User",
                "work_email": "test@example.com",
                "company_name": "Test Company"
            },
            "roi-calculator": {
                "id": str(uuid.uuid4()),
                "email": "test@example.com",
                "country": "Bangladesh"
            }
        }
        
        for endpoint, method in endpoints_to_test:
            try:
                print(f"\n📍 Testing {method} {PRODUCTION_API_BASE}/{endpoint}")
                
                payload = sample_payloads.get(endpoint, {})
                
                start_time = time.time()
                response = requests.post(
                    f"{PRODUCTION_API_BASE}/{endpoint}",
                    json=payload,
                    headers={
                        "Content-Type": "application/json",
                        "Origin": "https://sentratech.net",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                    },
                    timeout=30
                )
                response_time = (time.time() - start_time) * 1000
                
                print(f"   🕐 Response time: {response_time:.2f}ms")
                print(f"   📊 Status code: {response.status_code}")
                print(f"   📄 Response: {response.text[:200]}...")
                
                if response.status_code == 200:
                    self.log_test(f"Production {endpoint}", "PASS", f"HTTP 200, Response time: {response_time:.2f}ms")
                else:
                    self.log_test(f"Production {endpoint}", "FAIL", f"HTTP {response.status_code}, Response: {response.text[:200]}")
                    
            except Exception as e:
                print(f"   ❌ Error: {str(e)}")
                self.log_test(f"Production {endpoint}", "FAIL", f"Request error: {str(e)}")
    
    def run_comprehensive_test(self):
        """Run comprehensive production testing"""
        print("🚨 URGENT: Production Job Application Endpoint Investigation")
        print("=" * 80)
        print("ISSUE: Job applications from https://sentratech.net/careers/apply/customer-support-specialist are being LOST")
        print("TESTING: Correct production URLs based on frontend configuration")
        print(f"PRODUCTION API BASE: {PRODUCTION_API_BASE}")
        print("=" * 80)
        
        # Test production health first
        health_ok = self.test_production_health_check()
        
        # Test production job application endpoint (main focus)
        prod_success, prod_job_id = self.test_production_job_application_correct_url()
        
        # Test production newsletter for comparison
        newsletter_success, newsletter_id = self.test_production_newsletter_correct_url()
        
        # Test all production endpoints
        self.test_all_production_endpoints()
        
        # Print comprehensive analysis
        print("\n" + "=" * 80)
        print("🔍 CRITICAL ANALYSIS - JOB APPLICATION ISSUE")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Specific analysis for job application issue
        print(f"\n🎯 JOB APPLICATION ANALYSIS:")
        print(f"   Production Health Check: {'✅ WORKING' if health_ok else '❌ FAILING'}")
        print(f"   Production Job Application: {'✅ WORKING' if prod_success else '❌ FAILING'}")
        if prod_job_id:
            print(f"   Production Job ID: {prod_job_id}")
        
        print(f"   Production Newsletter: {'✅ WORKING' if newsletter_success else '❌ FAILING'}")
        if newsletter_id:
            print(f"   Production Newsletter ID: {newsletter_id}")
        
        # Root cause analysis
        print(f"\n🔍 ROOT CAUSE ANALYSIS:")
        if not prod_success:
            print("   ❌ CRITICAL: Production job application endpoint is failing")
            if not newsletter_success:
                print("   🔧 LIKELY CAUSE: General production API proxy issue")
                print("   🎯 ACTION NEEDED: Fix production API proxy configuration")
            else:
                print("   🔧 LIKELY CAUSE: Specific job application endpoint issue")
                print("   🎯 ACTION NEEDED: Fix job application proxy endpoint specifically")
        else:
            print("   ✅ ENDPOINTS WORKING: Production job application endpoint responding correctly")
            print("   🔧 LIKELY CAUSE: Frontend form submission or routing issue")
            print("   🎯 ACTION NEEDED: Check frontend job application form implementation")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 FAILED TESTS DETAILS:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}: {result['details']}")
        
        print(f"\n🚨 URGENT RECOMMENDATION:")
        if not prod_success:
            print("   1. IMMEDIATE: Production job application endpoint is not working")
            print("   2. Check production server configuration and deployment")
            print("   3. Verify API routing and proxy setup")
            print("   4. Test with browser developer tools from https://sentratech.net")
        else:
            print("   1. Production job application endpoint is working correctly")
            print("   2. Issue is likely in the frontend form submission")
            print("   3. Check job application form routing and data submission")
            print("   4. Verify form reaches the correct endpoint")
        
        return prod_success

if __name__ == "__main__":
    print("🚨 URGENT: SentraTech Production Job Application Investigation")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = ProductionJobApplicationTester()
    success = tester.run_comprehensive_test()
    
    print(f"\n🏁 Investigation completed at: {datetime.now(timezone.utc).isoformat()}")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)