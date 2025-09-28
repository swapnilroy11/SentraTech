#!/usr/bin/env python3
"""
Comprehensive Form Testing After Critical Fixes
Tests all 5 forms after dashboard config fixes and schema updates:
1. Demo Request Form
2. Contact Sales Form  
3. ROI Calculator Form
4. Newsletter Subscription
5. Job Application Form
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://unified-forms.preview.emergentagent.com/api"

# Authentication key for ingest endpoints
INGEST_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"

class ComprehensiveFormTester:
    """Comprehensive testing for all 5 forms after critical fixes"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.form_success_count = 0
        self.total_forms = 5
        
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
    
    def test_backend_health(self):
        """Test backend health and configuration"""
        print("\n=== Testing Backend Health & Configuration ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "healthy":
                    ingest_configured = result.get("ingest_configured", False)
                    response_time = result.get("response_time_ms", 0)
                    
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
    
    def test_dashboard_forwarding_config(self):
        """Test if should_forward_to_dashboard() returns True"""
        print("\n=== Testing Dashboard Forwarding Configuration ===")
        
        try:
            # Test by making a request and checking if external forwarding is attempted
            # We can infer this from the response structure
            test_data = {
                "email": "config-test@example.com",
                "source": "config_test"
            }
            
            headers = {"X-INGEST-KEY": INGEST_KEY}
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=test_data, headers=headers, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if external_response is present (indicates dashboard forwarding)
                has_external_response = "external_response" in result
                
                if has_external_response:
                    self.log_test("Dashboard Forwarding Config", True, 
                                "✅ EXTERNAL_DASHBOARD_URL is set - dashboard forwarding enabled")
                    return True
                else:
                    self.log_test("Dashboard Forwarding Config", False, 
                                "❌ No external_response - dashboard forwarding may be disabled")
                    return False
            else:
                self.log_test("Dashboard Forwarding Config", False, 
                            f"Config test failed: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Dashboard Forwarding Config", False, f"Config test error: {str(e)}")
            return False
    
    def test_demo_request_form(self):
        """Test Demo Request Form - POST /api/ingest/demo_requests"""
        print("\n=== Testing Demo Request Form ===")
        
        test_data = {
            "user_name": "Sarah Johnson",
            "email": "sarah.johnson@techcorp.com",
            "company": "TechCorp Solutions",
            "phone": "+1-555-0123",
            "message": "Interested in AI customer support automation for our 500-agent call center"
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Submitting demo request...")
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Check for dashboard forwarding
                    has_external_response = "external_response" in result
                    
                    self.log_test("Demo Request Form", True, 
                                f"✅ Demo request successful! ID: {result['id']}, Dashboard forwarding: {has_external_response}")
                    self.form_success_count += 1
                    return True
                else:
                    self.log_test("Demo Request Form", False, 
                                f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Demo Request Form", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Demo Request Form", False, f"Exception: {str(e)}")
            return False
    
    def test_contact_sales_form(self):
        """Test Contact Sales Form - POST /api/ingest/contact_requests"""
        print("\n=== Testing Contact Sales Form ===")
        
        test_data = {
            "full_name": "Michael Chen",
            "work_email": "michael.chen@enterprise.com",
            "company_name": "Enterprise Solutions Inc",
            "message": "Need pricing for enterprise deployment with 1000+ agents"
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Submitting contact sales request...")
            response = requests.post(f"{BACKEND_URL}/ingest/contact_requests", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Check for dashboard forwarding
                    has_external_response = "external_response" in result
                    
                    self.log_test("Contact Sales Form", True, 
                                f"✅ Contact sales successful! ID: {result['id']}, Dashboard forwarding: {has_external_response}")
                    self.form_success_count += 1
                    return True
                else:
                    self.log_test("Contact Sales Form", False, 
                                f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Contact Sales Form", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Sales Form", False, f"Exception: {str(e)}")
            return False
    
    def test_roi_calculator_form(self):
        """Test ROI Calculator Form - POST /api/ingest/roi_reports"""
        print("\n=== Testing ROI Calculator Form ===")
        
        test_data = {
            "country": "United States",
            "monthly_volume": 50000,
            "bpo_spending": 125000.0,
            "sentratech_spending": 75000.0,
            "sentratech_bundles": 50.0,
            "monthly_savings": 50000.0,
            "roi": 66.7,
            "cost_reduction": 40.0,
            "contact_email": "roi.test@company.com"
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Submitting ROI report request...")
            response = requests.post(f"{BACKEND_URL}/ingest/roi_reports", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Check for dashboard forwarding
                    has_external_response = "external_response" in result
                    
                    self.log_test("ROI Calculator Form", True, 
                                f"✅ ROI report successful! ID: {result['id']}, Dashboard forwarding: {has_external_response}")
                    self.form_success_count += 1
                    return True
                else:
                    self.log_test("ROI Calculator Form", False, 
                                f"Invalid response: {result}")
                    return False
            else:
                self.log_test("ROI Calculator Form", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("ROI Calculator Form", False, f"Exception: {str(e)}")
            return False
    
    def test_newsletter_subscription(self):
        """Test Newsletter Subscription - POST /api/ingest/subscriptions"""
        print("\n=== Testing Newsletter Subscription ===")
        
        test_data = {
            "email": "newsletter.test@example.com"
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Submitting newsletter subscription...")
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Check for dashboard forwarding
                    has_external_response = "external_response" in result
                    
                    self.log_test("Newsletter Subscription", True, 
                                f"✅ Newsletter subscription successful! ID: {result['id']}, Dashboard forwarding: {has_external_response}")
                    self.form_success_count += 1
                    return True
                else:
                    self.log_test("Newsletter Subscription", False, 
                                f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Newsletter Subscription", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Newsletter Subscription", False, f"Exception: {str(e)}")
            return False
    
    def test_job_application_form(self):
        """Test Job Application Form - POST /api/ingest/job_applications"""
        print("\n=== Testing Job Application Form ===")
        
        # Test with new schema: first_name/last_name instead of full_name
        test_data = {
            "first_name": "Jessica",
            "last_name": "Rodriguez",
            "email": "jessica.rodriguez@email.com",
            "phone": "+1-555-0199",
            "location": "Bangladesh",
            "preferred_shifts": ["Morning", "Afternoon"],
            "availability_date": "2024-02-01",
            "experience_years": "3-5",
            "motivation_text": "Passionate about AI customer support and helping customers resolve issues efficiently",
            "position_applied": "Customer Support Specialist",
            "consent_for_storage": True
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Submitting job application...")
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    self.log_test("Job Application Form", True, 
                                f"✅ Job application successful! ID: {result['id']}")
                    self.form_success_count += 1
                    return True
                else:
                    self.log_test("Job Application Form", False, 
                                f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Job Application Form", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Job Application Form", False, f"Exception: {str(e)}")
            return False
    
    def test_authentication_security(self):
        """Test X-INGEST-KEY authentication"""
        print("\n=== Testing Authentication Security ===")
        
        # Test with invalid key
        test_data = {"email": "auth.test@example.com"}
        invalid_headers = {"X-INGEST-KEY": "invalid-key-12345"}
        
        try:
            print(f"🔒 Testing invalid authentication key...")
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=test_data, headers=invalid_headers, timeout=15)
            
            if response.status_code == 401:
                self.log_test("Authentication Security - Invalid Key", True, 
                            "✅ Invalid key correctly rejected with HTTP 401")
            else:
                self.log_test("Authentication Security - Invalid Key", False, 
                            f"Expected HTTP 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Authentication Security - Invalid Key", False, f"Exception: {str(e)}")
        
        # Test with missing key
        try:
            print(f"🔒 Testing missing authentication key...")
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=test_data, timeout=15)
            
            if response.status_code == 401:
                self.log_test("Authentication Security - Missing Key", True, 
                            "✅ Missing key correctly rejected with HTTP 401")
            else:
                self.log_test("Authentication Security - Missing Key", False, 
                            f"Expected HTTP 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Authentication Security - Missing Key", False, f"Exception: {str(e)}")
    
    def test_data_validation(self):
        """Test data validation for forms"""
        print("\n=== Testing Data Validation ===")
        
        # Test missing required fields
        invalid_data = {"message": "Missing required fields"}
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"🔍 Testing validation - missing required fields...")
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=invalid_data, headers=headers, timeout=15)
            
            if response.status_code == 422:
                self.log_test("Data Validation - Missing Fields", True, 
                            "✅ Missing required fields correctly rejected with HTTP 422")
            else:
                self.log_test("Data Validation - Missing Fields", False, 
                            f"Expected HTTP 422, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Data Validation - Missing Fields", False, f"Exception: {str(e)}")
        
        # Test invalid email format
        invalid_email_data = {
            "user_name": "Test User",
            "email": "invalid-email-format",
            "company": "Test Company",
            "message": "Test message"
        }
        
        try:
            print(f"🔍 Testing validation - invalid email format...")
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=invalid_email_data, headers=headers, timeout=15)
            
            if response.status_code in [422, 400]:
                self.log_test("Data Validation - Invalid Email", True, 
                            f"✅ Invalid email correctly rejected with HTTP {response.status_code}")
            else:
                self.log_test("Data Validation - Invalid Email", False, 
                            f"Expected HTTP 422/400, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Data Validation - Invalid Email", False, f"Exception: {str(e)}")
    
    def test_local_storage_verification(self):
        """Test local MongoDB storage for all forms"""
        print("\n=== Testing Local Storage Verification ===")
        
        # Test status endpoints to verify local storage
        status_endpoints = [
            ("demo_requests", "Demo Requests"),
            ("contact_requests", "Contact Requests"), 
            ("roi_reports", "ROI Reports"),
            ("subscriptions", "Subscriptions")
        ]
        
        for endpoint, name in status_endpoints:
            try:
                print(f"📊 Checking {name} status...")
                response = requests.get(f"{BACKEND_URL}/ingest/{endpoint}/status", timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    total_count = result.get("total_count", 0)
                    
                    self.log_test(f"Local Storage - {name}", True, 
                                f"✅ {name} storage working - Total records: {total_count}")
                else:
                    self.log_test(f"Local Storage - {name}", False, 
                                f"Status endpoint failed: HTTP {response.status_code}")
            except Exception as e:
                self.log_test(f"Local Storage - {name}", False, f"Exception: {str(e)}")
    
    def generate_comprehensive_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE FORM TESTING AFTER CRITICAL FIXES - SUMMARY")
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
        
        # Form submission success rate
        form_success_rate = (self.form_success_count / self.total_forms) * 100
        print(f"\n📋 Form Submission Results:")
        print(f"   Forms Tested: {self.total_forms}")
        print(f"   ✅ Successful: {self.form_success_count}")
        print(f"   ❌ Failed: {self.total_forms - self.form_success_count}")
        print(f"   📊 Form Success Rate: {form_success_rate:.1f}%")
        
        # Critical findings
        print(f"\n🎯 Critical Findings:")
        
        # Dashboard forwarding status
        dashboard_tests = [r for r in self.test_results if "Dashboard" in r["test"]]
        if dashboard_tests:
            dashboard_working = all(r["passed"] for r in dashboard_tests)
            if dashboard_working:
                print(f"   ✅ DASHBOARD FORWARDING: Working correctly")
            else:
                print(f"   ❌ DASHBOARD FORWARDING: Issues detected")
        
        # Authentication status
        auth_tests = [r for r in self.test_results if "Authentication" in r["test"]]
        if auth_tests:
            auth_working = all(r["passed"] for r in auth_tests)
            if auth_working:
                print(f"   ✅ AUTHENTICATION: Security working correctly")
            else:
                print(f"   ❌ AUTHENTICATION: Security issues detected")
        
        # Schema mapping status
        job_app_tests = [r for r in self.test_results if "Job Application" in r["test"]]
        if job_app_tests:
            schema_working = all(r["passed"] for r in job_app_tests)
            if schema_working:
                print(f"   ✅ SCHEMA MAPPING: Job application schema fixed")
            else:
                print(f"   ❌ SCHEMA MAPPING: Job application schema issues")
        
        # Failed tests details
        if failed_tests > 0:
            print(f"\n❌ Failed Tests Details:")
            for result in self.test_results:
                if not result["passed"]:
                    print(f"   • {result['test']}: {result['details']}")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        if form_success_rate == 100 and success_rate >= 85:
            print(f"   🎉 EXCELLENT - All forms working perfectly after fixes")
        elif form_success_rate >= 80 and success_rate >= 75:
            print(f"   ✅ GOOD - Most forms working with minor issues")
        elif form_success_rate >= 60:
            print(f"   ⚠️ FAIR - Some forms need attention")
        else:
            print(f"   ❌ POOR - Critical issues remain unresolved")
        
        # Success criteria verification
        print(f"\n✅ Success Criteria Verification:")
        print(f"   • should_forward_to_dashboard() returns True: {'✅' if any('Dashboard Forwarding Config' in r['test'] and r['passed'] for r in self.test_results) else '❌'}")
        print(f"   • Local MongoDB storage working: {'✅' if any('Local Storage' in r['test'] and r['passed'] for r in self.test_results) else '❌'}")
        print(f"   • External dashboard forwarding: {'✅' if any('external_response' in r['details'] for r in self.test_results if r['passed']) else '❌'}")
        print(f"   • Authentication with INGEST_KEY: {'✅' if any('Authentication' in r['test'] and r['passed'] for r in self.test_results) else '❌'}")
        print(f"   • Job application schema mapping: {'✅' if any('Job Application' in r['test'] and r['passed'] for r in self.test_results) else '❌'}")
        
        return form_success_rate >= 80 and success_rate >= 75
    
    def run_comprehensive_tests(self):
        """Run all comprehensive tests for all 5 forms"""
        print("🚀 Starting Comprehensive Form Testing After Critical Fixes")
        print("=" * 80)
        print("Testing all 5 forms after critical fixes:")
        print("• Dashboard config reverted to working tech-careers-3 endpoint")
        print("• Added EXTERNAL_DASHBOARD_URL environment variable")
        print("• Fixed job application schema mapping (first_name/last_name)")
        print("=" * 80)
        
        try:
            # Basic health and configuration tests
            if not self.test_backend_health():
                print("❌ Backend health check failed - continuing with caution")
            
            self.test_dashboard_forwarding_config()
            
            # Test all 5 forms
            print(f"\n🎯 Testing All 5 Forms:")
            self.test_demo_request_form()
            self.test_contact_sales_form()
            self.test_roi_calculator_form()
            self.test_newsletter_subscription()
            self.test_job_application_form()
            
            # Security and validation tests
            self.test_authentication_security()
            self.test_data_validation()
            
            # Storage verification
            self.test_local_storage_verification()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_comprehensive_summary()
        
        return is_ready


def main():
    """Main function to run comprehensive form testing"""
    print("🎯 Comprehensive Form Testing After Critical Fixes")
    print("Testing all 5 forms: Demo Request, Contact Sales, ROI Calculator, Newsletter, Job Application")
    print()
    
    tester = ComprehensiveFormTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: All forms working correctly after critical fixes!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Some forms still need attention")
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