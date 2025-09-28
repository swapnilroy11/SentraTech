#!/usr/bin/env python3
"""
Comprehensive Form Submission Testing for ALL SentraTech Website Forms
Tests all form endpoints to identify what's broken and provide detailed error analysis
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://unified-forms.preview.emergentagent.com/api"
EXTERNAL_JOB_URL = "https://unified-forms.preview.emergentagent.com/api"

# Authentication key
INGEST_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"

class ComprehensiveFormTester:
    """Comprehensive testing for all SentraTech website forms"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.form_results = {}
        
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
    
    def test_demo_request_form(self):
        """Test Demo Request Form - /api/ingest/demo_requests"""
        print("\n=== Testing Demo Request Form ===")
        
        # Valid test data
        valid_data = {
            "user_name": "John Demo",
            "email": "john.demo@testcompany.com",
            "company": "Test Company Inc",
            "phone": "+1-555-0123",
            "call_volume": 5000,
            "interaction_volume": 8000,
            "message": "We need a demo to evaluate SentraTech for our customer support operations"
        }
        
        # Test with valid authentication
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Testing Demo Request Form with valid data...")
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=valid_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success":
                    self.log_test("Demo Request Form - Valid Submission", True, 
                                f"Demo request successful - ID: {result.get('id')}")
                    self.form_results["demo_request"] = {"status": "working", "details": result}
                else:
                    self.log_test("Demo Request Form - Valid Submission", False, 
                                f"Request failed: {result}")
                    self.form_results["demo_request"] = {"status": "failed", "details": result}
            else:
                error_text = response.text
                self.log_test("Demo Request Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                self.form_results["demo_request"] = {"status": "failed", "error": error_text}
                
        except Exception as e:
            self.log_test("Demo Request Form - Valid Submission", False, f"Exception: {str(e)}")
            self.form_results["demo_request"] = {"status": "error", "exception": str(e)}
        
        # Test authentication
        self.test_form_authentication("Demo Request", f"{BACKEND_URL}/ingest/demo_requests", valid_data)
        
        # Test validation
        self.test_form_validation("Demo Request", f"{BACKEND_URL}/ingest/demo_requests", 
                                {"email": "invalid-email", "user_name": ""})
    
    def test_contact_sales_form(self):
        """Test Contact Sales Form - /api/ingest/contact_requests"""
        print("\n=== Testing Contact Sales Form ===")
        
        # Valid test data
        valid_data = {
            "full_name": "Sarah Sales",
            "work_email": "sarah.sales@businesscorp.com",
            "company_name": "Business Corp Ltd",
            "phone": "+1-555-0456",
            "call_volume": 3000,
            "interaction_volume": 5000,
            "preferred_contact_method": "Email",
            "message": "Interested in enterprise pricing for our 200-agent contact center"
        }
        
        # Test with valid authentication
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Testing Contact Sales Form with valid data...")
            response = requests.post(f"{BACKEND_URL}/ingest/contact_requests", 
                                   json=valid_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success":
                    self.log_test("Contact Sales Form - Valid Submission", True, 
                                f"Contact request successful - ID: {result.get('id')}")
                    self.form_results["contact_sales"] = {"status": "working", "details": result}
                else:
                    self.log_test("Contact Sales Form - Valid Submission", False, 
                                f"Request failed: {result}")
                    self.form_results["contact_sales"] = {"status": "failed", "details": result}
            else:
                error_text = response.text
                self.log_test("Contact Sales Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                self.form_results["contact_sales"] = {"status": "failed", "error": error_text}
                
        except Exception as e:
            self.log_test("Contact Sales Form - Valid Submission", False, f"Exception: {str(e)}")
            self.form_results["contact_sales"] = {"status": "error", "exception": str(e)}
        
        # Test authentication
        self.test_form_authentication("Contact Sales", f"{BACKEND_URL}/ingest/contact_requests", valid_data)
        
        # Test validation
        self.test_form_validation("Contact Sales", f"{BACKEND_URL}/ingest/contact_requests", 
                                {"work_email": "invalid-email", "full_name": ""})
    
    def test_roi_calculator_form(self):
        """Test ROI Calculator Form - /api/ingest/roi_reports"""
        print("\n=== Testing ROI Calculator Form ===")
        
        # Valid test data
        valid_data = {
            "country": "Bangladesh",
            "monthly_volume": 10000,
            "bpo_spending": 15000.00,
            "sentratech_spending": 8500.00,
            "sentratech_bundles": 10.0,
            "monthly_savings": 6500.00,
            "roi": 76.47,
            "cost_reduction": 43.33,
            "contact_email": "roi.test@company.com"
        }
        
        # Test with valid authentication
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Testing ROI Calculator Form with valid data...")
            response = requests.post(f"{BACKEND_URL}/ingest/roi_reports", 
                                   json=valid_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success":
                    self.log_test("ROI Calculator Form - Valid Submission", True, 
                                f"ROI report successful - ID: {result.get('id')}")
                    self.form_results["roi_calculator"] = {"status": "working", "details": result}
                else:
                    self.log_test("ROI Calculator Form - Valid Submission", False, 
                                f"Request failed: {result}")
                    self.form_results["roi_calculator"] = {"status": "failed", "details": result}
            else:
                error_text = response.text
                self.log_test("ROI Calculator Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                self.form_results["roi_calculator"] = {"status": "failed", "error": error_text}
                
        except Exception as e:
            self.log_test("ROI Calculator Form - Valid Submission", False, f"Exception: {str(e)}")
            self.form_results["roi_calculator"] = {"status": "error", "exception": str(e)}
        
        # Test authentication
        self.test_form_authentication("ROI Calculator", f"{BACKEND_URL}/ingest/roi_reports", valid_data)
        
        # Test validation
        self.test_form_validation("ROI Calculator", f"{BACKEND_URL}/ingest/roi_reports", 
                                {"contact_email": "invalid-email", "monthly_volume": -1})
    
    def test_newsletter_subscription_form(self):
        """Test Newsletter Subscription Form - /api/ingest/subscriptions"""
        print("\n=== Testing Newsletter Subscription Form ===")
        
        # Valid test data
        valid_data = {
            "email": "newsletter.test@subscriber.com",
            "source": "website",
            "status": "subscribed"
        }
        
        # Test with valid authentication
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        try:
            print(f"📝 Testing Newsletter Subscription Form with valid data...")
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=valid_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success":
                    self.log_test("Newsletter Subscription Form - Valid Submission", True, 
                                f"Subscription successful - ID: {result.get('id')}")
                    self.form_results["newsletter"] = {"status": "working", "details": result}
                else:
                    self.log_test("Newsletter Subscription Form - Valid Submission", False, 
                                f"Request failed: {result}")
                    self.form_results["newsletter"] = {"status": "failed", "details": result}
            else:
                error_text = response.text
                self.log_test("Newsletter Subscription Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                self.form_results["newsletter"] = {"status": "failed", "error": error_text}
                
        except Exception as e:
            self.log_test("Newsletter Subscription Form - Valid Submission", False, f"Exception: {str(e)}")
            self.form_results["newsletter"] = {"status": "error", "exception": str(e)}
        
        # Test authentication
        self.test_form_authentication("Newsletter", f"{BACKEND_URL}/ingest/subscriptions", valid_data)
        
        # Test validation
        self.test_form_validation("Newsletter", f"{BACKEND_URL}/ingest/subscriptions", 
                                {"email": "invalid-email-format"})
    
    def test_job_application_form(self):
        """Test Job Application Form - External endpoint"""
        print("\n=== Testing Job Application Form (External Endpoint) ===")
        
        # Valid test data matching the schema
        valid_data = {
            "first_name": "Alex",
            "last_name": "Johnson",
            "email": "alex.johnson@jobseeker.com",
            "phone": "+1-555-0789",
            "location": "Bangladesh",
            "preferred_shifts": ["Morning", "Afternoon"],
            "availability_date": "2024-02-01",
            "experience_years": "3-5",
            "motivation_text": "I am passionate about customer service and excited to join SentraTech's innovative team",
            "cover_letter": "Dear Hiring Manager, I am writing to express my interest in the Customer Support Specialist position...",
            "work_authorization": "Authorized",
            "position_applied": "Customer Support Specialist",
            "application_source": "career_site",
            "consent_for_storage": True
        }
        
        # Test with external endpoint and authentication
        headers = {"X-INGEST-KEY": "test-ingest-key-12345"}
        
        try:
            print(f"📝 Testing Job Application Form with external endpoint...")
            response = requests.post(f"{EXTERNAL_JOB_URL}/ingest/job_applications", 
                                   json=valid_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success":
                    self.log_test("Job Application Form - Valid Submission", True, 
                                f"Job application successful - ID: {result.get('id')}")
                    self.form_results["job_application"] = {"status": "working", "details": result}
                else:
                    self.log_test("Job Application Form - Valid Submission", False, 
                                f"Request failed: {result}")
                    self.form_results["job_application"] = {"status": "failed", "details": result}
            else:
                error_text = response.text
                self.log_test("Job Application Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                self.form_results["job_application"] = {"status": "failed", "error": error_text}
                
        except Exception as e:
            self.log_test("Job Application Form - Valid Submission", False, f"Exception: {str(e)}")
            self.form_results["job_application"] = {"status": "error", "exception": str(e)}
        
        # Test authentication with external endpoint
        self.test_form_authentication("Job Application", f"{EXTERNAL_JOB_URL}/ingest/job_applications", 
                                    valid_data, external_key="test-ingest-key-12345")
        
        # Test validation
        self.test_form_validation("Job Application", f"{EXTERNAL_JOB_URL}/ingest/job_applications", 
                                {"email": "invalid-email", "first_name": "", "last_name": ""}, 
                                external_key="test-ingest-key-12345")
    
    def test_form_authentication(self, form_name: str, endpoint: str, valid_data: dict, external_key: str = None):
        """Test authentication for a form endpoint"""
        print(f"\n--- Testing {form_name} Authentication ---")
        
        # Test with valid key
        valid_key = external_key if external_key else INGEST_KEY
        headers = {"X-INGEST-KEY": valid_key}
        
        try:
            response = requests.post(endpoint, json=valid_data, headers=headers, timeout=15)
            if response.status_code in [200, 201]:
                self.log_test(f"{form_name} - Valid Authentication", True, 
                            f"Valid key accepted: HTTP {response.status_code}")
            else:
                self.log_test(f"{form_name} - Valid Authentication", False, 
                            f"Valid key rejected: HTTP {response.status_code}")
        except Exception as e:
            self.log_test(f"{form_name} - Valid Authentication", False, f"Exception: {str(e)}")
        
        # Test with invalid key
        invalid_headers = {"X-INGEST-KEY": "invalid-key-12345"}
        try:
            response = requests.post(endpoint, json=valid_data, headers=invalid_headers, timeout=15)
            if response.status_code == 401:
                self.log_test(f"{form_name} - Invalid Authentication", True, 
                            f"Invalid key correctly rejected: HTTP {response.status_code}")
            else:
                self.log_test(f"{form_name} - Invalid Authentication", False, 
                            f"Invalid key not rejected: HTTP {response.status_code}")
        except Exception as e:
            self.log_test(f"{form_name} - Invalid Authentication", False, f"Exception: {str(e)}")
        
        # Test with missing key
        try:
            response = requests.post(endpoint, json=valid_data, timeout=15)
            if response.status_code == 401:
                self.log_test(f"{form_name} - Missing Authentication", True, 
                            f"Missing key correctly rejected: HTTP {response.status_code}")
            else:
                self.log_test(f"{form_name} - Missing Authentication", False, 
                            f"Missing key not rejected: HTTP {response.status_code}")
        except Exception as e:
            self.log_test(f"{form_name} - Missing Authentication", False, f"Exception: {str(e)}")
    
    def test_form_validation(self, form_name: str, endpoint: str, invalid_data: dict, external_key: str = None):
        """Test validation for a form endpoint"""
        print(f"\n--- Testing {form_name} Validation ---")
        
        valid_key = external_key if external_key else INGEST_KEY
        headers = {"X-INGEST-KEY": valid_key}
        
        # Test with invalid data
        try:
            response = requests.post(endpoint, json=invalid_data, headers=headers, timeout=15)
            if response.status_code in [400, 422]:
                self.log_test(f"{form_name} - Data Validation", True, 
                            f"Invalid data correctly rejected: HTTP {response.status_code}")
            else:
                self.log_test(f"{form_name} - Data Validation", False, 
                            f"Invalid data not rejected: HTTP {response.status_code}")
        except Exception as e:
            self.log_test(f"{form_name} - Data Validation", False, f"Exception: {str(e)}")
        
        # Test with malformed JSON
        try:
            response = requests.post(endpoint, data="invalid-json", headers=headers, timeout=15)
            if response.status_code in [400, 422]:
                self.log_test(f"{form_name} - JSON Validation", True, 
                            f"Malformed JSON correctly rejected: HTTP {response.status_code}")
            else:
                self.log_test(f"{form_name} - JSON Validation", False, 
                            f"Malformed JSON not rejected: HTTP {response.status_code}")
        except Exception as e:
            self.log_test(f"{form_name} - JSON Validation", False, f"Exception: {str(e)}")
    
    def test_database_storage(self):
        """Test database storage by checking status endpoints"""
        print("\n=== Testing Database Storage ===")
        
        status_endpoints = [
            ("Demo Requests", f"{BACKEND_URL}/ingest/demo_requests/status"),
            ("Contact Requests", f"{BACKEND_URL}/ingest/contact_requests/status"),
            ("ROI Reports", f"{BACKEND_URL}/ingest/roi_reports/status"),
            ("Subscriptions", f"{BACKEND_URL}/ingest/subscriptions/status")
        ]
        
        for name, endpoint in status_endpoints:
            try:
                response = requests.get(endpoint, timeout=15)
                if response.status_code == 200:
                    result = response.json()
                    total_count = result.get("total_count", 0)
                    self.log_test(f"{name} - Database Storage", True, 
                                f"Status endpoint working - Total records: {total_count}")
                else:
                    self.log_test(f"{name} - Database Storage", False, 
                                f"Status endpoint failed: HTTP {response.status_code}")
            except Exception as e:
                self.log_test(f"{name} - Database Storage", False, f"Exception: {str(e)}")
    
    def test_cors_and_connectivity(self):
        """Test CORS and network connectivity issues"""
        print("\n=== Testing CORS and Connectivity ===")
        
        # Test preflight request
        try:
            response = requests.options(f"{BACKEND_URL}/ingest/demo_requests", 
                                      headers={"Origin": "https://unified-forms.preview.emergentagent.com"}, 
                                      timeout=10)
            if response.status_code in [200, 204]:
                self.log_test("CORS - Preflight Request", True, 
                            f"CORS preflight successful: HTTP {response.status_code}")
            else:
                self.log_test("CORS - Preflight Request", False, 
                            f"CORS preflight failed: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("CORS - Preflight Request", False, f"Exception: {str(e)}")
        
        # Test external endpoint connectivity
        try:
            response = requests.get(f"{EXTERNAL_JOB_URL}/health", timeout=10)
            if response.status_code == 200:
                self.log_test("External Endpoint - Connectivity", True, 
                            f"External endpoint reachable: HTTP {response.status_code}")
            else:
                self.log_test("External Endpoint - Connectivity", False, 
                            f"External endpoint issue: HTTP {response.status_code}")
        except Exception as e:
            self.log_test("External Endpoint - Connectivity", False, f"Exception: {str(e)}")
    
    def generate_comprehensive_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 100)
        print("📊 COMPREHENSIVE FORM SUBMISSION TESTING REPORT")
        print("=" * 100)
        
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
        
        # Form-by-form analysis
        print(f"\n📋 Form-by-Form Analysis:")
        
        forms = ["demo_request", "contact_sales", "roi_calculator", "newsletter", "job_application"]
        form_names = ["Demo Request", "Contact Sales", "ROI Calculator", "Newsletter", "Job Application"]
        
        for form_key, form_name in zip(forms, form_names):
            if form_key in self.form_results:
                status = self.form_results[form_key]["status"]
                if status == "working":
                    print(f"   ✅ {form_name}: WORKING")
                elif status == "failed":
                    print(f"   ❌ {form_name}: FAILED")
                    if "error" in self.form_results[form_key]:
                        print(f"      └─ Error: {self.form_results[form_key]['error'][:100]}...")
                else:
                    print(f"   ⚠️ {form_name}: ERROR")
                    if "exception" in self.form_results[form_key]:
                        print(f"      └─ Exception: {self.form_results[form_key]['exception'][:100]}...")
            else:
                print(f"   ❓ {form_name}: NOT TESTED")
        
        # Critical issues analysis
        print(f"\n🚨 Critical Issues Identified:")
        
        # Authentication issues
        auth_failures = [r for r in self.test_results if "Authentication" in r["test"] and not r["passed"]]
        if auth_failures:
            print(f"   ❌ AUTHENTICATION ISSUES:")
            for failure in auth_failures:
                print(f"      • {failure['test']}: {failure['details']}")
        
        # Validation issues
        validation_failures = [r for r in self.test_results if "Validation" in r["test"] and not r["passed"]]
        if validation_failures:
            print(f"   ❌ VALIDATION ISSUES:")
            for failure in validation_failures:
                print(f"      • {failure['test']}: {failure['details']}")
        
        # Network/connectivity issues
        network_failures = [r for r in self.test_results if ("Connectivity" in r["test"] or "CORS" in r["test"]) and not r["passed"]]
        if network_failures:
            print(f"   ❌ NETWORK/CONNECTIVITY ISSUES:")
            for failure in network_failures:
                print(f"      • {failure['test']}: {failure['details']}")
        
        # Database issues
        db_failures = [r for r in self.test_results if "Database" in r["test"] and not r["passed"]]
        if db_failures:
            print(f"   ❌ DATABASE ISSUES:")
            for failure in db_failures:
                print(f"      • {failure['test']}: {failure['details']}")
        
        # Root cause analysis
        print(f"\n🔍 Root Cause Analysis:")
        
        if success_rate < 50:
            print(f"   • CRITICAL: Multiple system failures detected")
            print(f"   • Check backend service status and configuration")
            print(f"   • Verify database connectivity and schema")
            print(f"   • Review authentication key configuration")
        elif success_rate < 75:
            print(f"   • MODERATE: Some forms have issues")
            print(f"   • Focus on failed authentication or validation tests")
            print(f"   • Check specific endpoint configurations")
        else:
            print(f"   • GOOD: Most forms are working correctly")
            print(f"   • Address remaining minor issues for full functionality")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        working_forms = [k for k, v in self.form_results.items() if v["status"] == "working"]
        failed_forms = [k for k, v in self.form_results.items() if v["status"] in ["failed", "error"]]
        
        if working_forms:
            print(f"   ✅ Working forms ({len(working_forms)}): {', '.join(working_forms)}")
        
        if failed_forms:
            print(f"   ❌ Broken forms ({len(failed_forms)}): {', '.join(failed_forms)}")
            print(f"   • Prioritize fixing these forms for production readiness")
        
        if auth_failures:
            print(f"   • Review X-INGEST-KEY configuration and validation")
        
        if validation_failures:
            print(f"   • Update form validation logic and error handling")
        
        if network_failures:
            print(f"   • Check CORS configuration and network connectivity")
        
        # Production readiness
        print(f"\n🎯 Production Readiness Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - All forms ready for production")
        elif success_rate >= 75:
            print(f"   ✅ GOOD - Most forms working, minor fixes needed")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Significant issues need resolution")
        else:
            print(f"   ❌ POOR - Major system issues require immediate attention")
        
        return success_rate >= 75
    
    def run_comprehensive_tests(self):
        """Run all comprehensive form tests"""
        print("🚀 Starting Comprehensive Form Submission Testing")
        print("=" * 100)
        print("Testing ALL SentraTech website forms:")
        print("• Demo Request Form (/api/ingest/demo_requests)")
        print("• Contact Sales Form (/api/ingest/contact_requests)")
        print("• ROI Calculator Form (/api/ingest/roi_reports)")
        print("• Newsletter Subscription (/api/ingest/subscriptions)")
        print("• Job Application Form (external endpoint)")
        print("• Authentication, validation, database storage, and connectivity")
        print("=" * 100)
        
        try:
            # Basic health check
            if not self.test_backend_health():
                print("❌ Backend health check failed - continuing with caution")
            
            # Test all forms
            self.test_demo_request_form()
            time.sleep(2)  # Brief pause between tests
            
            self.test_contact_sales_form()
            time.sleep(2)
            
            self.test_roi_calculator_form()
            time.sleep(2)
            
            self.test_newsletter_subscription_form()
            time.sleep(2)
            
            self.test_job_application_form()
            time.sleep(2)
            
            # Test supporting functionality
            self.test_database_storage()
            self.test_cors_and_connectivity()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_comprehensive_report()
        
        return is_ready


def main():
    """Main function to run comprehensive form testing"""
    print("🎯 Comprehensive Form Submission Testing for ALL SentraTech Website Forms")
    print("Identifying what's broken and providing detailed error analysis")
    print()
    
    tester = ComprehensiveFormTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: Most forms are working correctly!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Multiple forms need attention")
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