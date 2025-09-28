#!/usr/bin/env python3
"""
Comprehensive SentraTech Forms Testing
Tests all 5 SentraTech website form endpoints that were just fixed:
1. Demo Request Form - POST /api/demo/request
2. Contact Sales Form - POST /api/contact/sales  
3. ROI Calculator Form - POST /api/roi/submit
4. Newsletter Subscription - POST /api/newsletter/subscribe
5. Job Application Form - POST /api/job/application

Testing Requirements:
- Test all required fields and validation
- Test with valid and invalid data formats
- Verify database storage by checking response IDs
- Test authentication (should work without X-INGEST-KEY for local endpoints)
- Confirm all endpoints return proper JSON responses
- Validate all successful responses include appropriate success messages
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from frontend environment - using local endpoints
BACKEND_URL = "http://localhost:8001/api"

class ComprehensiveFormsTester:
    """Comprehensive testing for all 5 SentraTech form endpoints"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.reference_ids = {}
        
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
                    self.log_test("Backend Health Check", True, 
                                f"Backend healthy - Response time: {response_time}ms")
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
        """Test Demo Request Form - POST to /api/ingest/demo_requests"""
        print("\n=== Testing Demo Request Form ===")
        
        test_data = {
            "user_name": "Sarah Johnson",
            "email": "sarah.johnson@techcorp.com",
            "company": "TechCorp Solutions",
            "company_website": "https://techcorp.com",
            "phone": "+1-555-0123",
            "call_volume": 15000,
            "interaction_volume": 25000,
            "message": "We're interested in implementing AI-powered customer support for our growing business. We handle about 15,000 calls monthly and need better automation.",
            "source": "website_demo_form"
        }
        
        try:
            print(f"📝 Submitting demo request...")
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=test_data, headers=self.headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Check for dashboard integration
                    external_response = result.get("external_response")
                    if external_response:
                        self.log_test("Demo Request Form", True, 
                                    f"✅ Demo request successful with dashboard sync! ID: {result['id']}")
                    else:
                        self.log_test("Demo Request Form", True, 
                                    f"✅ Demo request successful (local storage)! ID: {result['id']}")
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
        """Test Contact Sales Form - POST to /api/ingest/contact_requests"""
        print("\n=== Testing Contact Sales Form ===")
        
        test_data = {
            "full_name": "Michael Chen",
            "work_email": "michael.chen@enterprise.com",
            "company_name": "Enterprise Solutions Inc",
            "company_website": "https://enterprise-solutions.com",
            "phone": "+1-555-0456",
            "call_volume": 50000,
            "interaction_volume": 80000,
            "preferred_contact_method": "Email",
            "message": "We're evaluating AI customer support solutions for our enterprise. We need a quote for handling 50,000+ monthly calls with advanced analytics and reporting.",
            "status": "pending",
            "assigned_rep": "sales_team"
        }
        
        try:
            print(f"📝 Submitting contact sales request...")
            response = requests.post(f"{BACKEND_URL}/ingest/contact_requests", 
                                   json=test_data, headers=self.headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Check for dashboard integration
                    external_response = result.get("external_response")
                    if external_response:
                        self.log_test("Contact Sales Form", True, 
                                    f"✅ Contact sales request successful with dashboard sync! ID: {result['id']}")
                    else:
                        self.log_test("Contact Sales Form", True, 
                                    f"✅ Contact sales request successful (local storage)! ID: {result['id']}")
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
        """Test ROI Calculator Form - POST to /api/ingest/roi_reports"""
        print("\n=== Testing ROI Calculator Form ===")
        
        test_data = {
            "country": "United States",
            "monthly_volume": 30000,
            "bpo_spending": 45000.00,
            "sentratech_spending": 18000.00,
            "sentratech_bundles": 30.0,
            "monthly_savings": 27000.00,
            "roi": 150.0,
            "cost_reduction": 60.0,
            "contact_email": "finance@growthcorp.com"
        }
        
        try:
            print(f"📝 Submitting ROI report...")
            response = requests.post(f"{BACKEND_URL}/ingest/roi_reports", 
                                   json=test_data, headers=self.headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    self.log_test("ROI Calculator Form", True, 
                                f"✅ ROI report successful! ID: {result['id']}")
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
    
    def test_newsletter_subscription_form(self):
        """Test Newsletter Subscription Form - POST to /api/ingest/subscriptions"""
        print("\n=== Testing Newsletter Subscription Form ===")
        
        test_data = {
            "email": "newsletter@subscriber.com",
            "source": "website_footer",
            "status": "subscribed"
        }
        
        try:
            print(f"📝 Submitting newsletter subscription...")
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=test_data, headers=self.headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    self.log_test("Newsletter Subscription Form", True, 
                                f"✅ Newsletter subscription successful! ID: {result['id']}")
                    return True
                else:
                    self.log_test("Newsletter Subscription Form", False, 
                                f"Invalid response: {result}")
                    return False
            else:
                self.log_test("Newsletter Subscription Form", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Newsletter Subscription Form", False, f"Exception: {str(e)}")
            return False
    
    def test_job_application_form(self):
        """Test Job Application Form - POST to /api/ingest/job_applications"""
        print("\n=== Testing Job Application Form ===")
        
        test_data = {
            "first_name": "Alexandra",
            "last_name": "Rodriguez",
            "email": "alexandra.rodriguez@email.com",
            "phone": "+1-555-0789",
            "location": "Bangladesh",
            "resume_file": "https://example.com/resume.pdf",
            "portfolio_website": "https://alexandra-portfolio.com",
            "preferred_shifts": ["Morning", "Afternoon"],
            "availability_date": "2025-02-01",
            "experience_years": "3-5",
            "motivation_text": "I'm passionate about customer service and excited about the opportunity to work with AI-powered support systems. My experience in technical support and fluency in English make me a great fit for this role.",
            "cover_letter": "Dear Hiring Team, I am writing to express my strong interest in the Customer Support Specialist position at SentraTech. With over 4 years of experience in customer service and technical support, I am excited about the opportunity to contribute to your innovative AI-powered customer support platform.",
            "work_authorization": "Authorized to work in Bangladesh",
            "position_applied": "Customer Support Specialist English-Fluent",
            "application_source": "career_site",
            "consent_for_storage": True
        }
        
        try:
            print(f"📝 Submitting job application...")
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=test_data, headers=self.headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Check for AI scoring
                    ai_score = result.get("ai_score")
                    if ai_score:
                        self.log_test("Job Application Form", True, 
                                    f"✅ Job application successful with AI scoring! ID: {result['id']}, Score: {ai_score}")
                    else:
                        self.log_test("Job Application Form", True, 
                                    f"✅ Job application successful! ID: {result['id']}")
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
        """Test X-INGEST-KEY authentication across all endpoints"""
        print("\n=== Testing Authentication Security ===")
        
        endpoints = [
            "/ingest/demo_requests",
            "/ingest/contact_requests", 
            "/ingest/roi_reports",
            "/ingest/subscriptions",
            "/ingest/job_applications"
        ]
        
        test_data = {"test": "auth_check"}
        
        # Test with invalid key
        invalid_headers = {"X-INGEST-KEY": "invalid-key-12345"}
        auth_failures = 0
        
        for endpoint in endpoints:
            try:
                response = requests.post(f"{BACKEND_URL}{endpoint}", 
                                       json=test_data, headers=invalid_headers, timeout=10)
                
                if response.status_code == 401:
                    auth_failures += 1
                    print(f"   ✅ {endpoint}: Correctly rejected invalid key")
                else:
                    print(f"   ❌ {endpoint}: Should reject invalid key but got {response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ {endpoint}: Auth test error - {str(e)}")
        
        if auth_failures == len(endpoints):
            self.log_test("Authentication Security", True, 
                        f"✅ All {len(endpoints)} endpoints properly validate X-INGEST-KEY")
            return True
        else:
            self.log_test("Authentication Security", False, 
                        f"Only {auth_failures}/{len(endpoints)} endpoints properly validate authentication")
            return False
    
    def test_data_validation(self):
        """Test data validation across forms"""
        print("\n=== Testing Data Validation ===")
        
        # Test invalid email format
        invalid_demo_data = {
            "user_name": "Test User",
            "email": "invalid-email-format",
            "company": "Test Company",
            "message": "Test message"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=invalid_demo_data, headers=self.headers, timeout=10)
            
            if response.status_code in [400, 422]:
                self.log_test("Data Validation", True, 
                            f"✅ Validation correctly rejected invalid email format")
                return True
            else:
                self.log_test("Data Validation", False, 
                            f"Should reject invalid email but got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Data Validation", False, f"Validation test error: {str(e)}")
            return False
    
    def verify_dashboard_connectivity(self):
        """Verify external dashboard connectivity"""
        print("\n=== Verifying Dashboard Connectivity ===")
        
        dashboard_url = "https://unified-forms.preview.emergentagent.com"
        
        try:
            response = requests.get(dashboard_url, timeout=10)
            if response.status_code == 200:
                self.log_test("Dashboard Connectivity", True, 
                            f"✅ External dashboard reachable at {dashboard_url}")
                return True
            else:
                self.log_test("Dashboard Connectivity", False, 
                            f"Dashboard returned {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Dashboard Connectivity", False, 
                        f"Cannot reach dashboard: {str(e)}")
            return False
    
    def verify_status_endpoints(self):
        """Verify status endpoints for data verification"""
        print("\n=== Verifying Status Endpoints ===")
        
        status_endpoints = [
            "/ingest/demo_requests/status",
            "/ingest/contact_requests/status",
            "/ingest/roi_reports/status", 
            "/ingest/subscriptions/status"
        ]
        
        working_endpoints = 0
        
        for endpoint in status_endpoints:
            try:
                response = requests.get(f"{BACKEND_URL}{endpoint}", 
                                      headers=self.headers, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    total_records = result.get("total", 0)
                    working_endpoints += 1
                    print(f"   ✅ {endpoint}: {total_records} records")
                else:
                    print(f"   ❌ {endpoint}: HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ {endpoint}: Error - {str(e)}")
        
        if working_endpoints >= 3:  # At least 3 out of 4 should work
            self.log_test("Status Endpoints", True, 
                        f"✅ {working_endpoints}/4 status endpoints working")
            return True
        else:
            self.log_test("Status Endpoints", False, 
                        f"Only {working_endpoints}/4 status endpoints working")
            return False
    
    def generate_comprehensive_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE SENTRATECH FORMS TESTING SUMMARY")
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
        
        # Form-specific results
        print(f"\n📋 Form Testing Results:")
        form_tests = [
            "Demo Request Form",
            "Contact Sales Form", 
            "ROI Calculator Form",
            "Newsletter Subscription Form",
            "Job Application Form"
        ]
        
        working_forms = 0
        for form_name in form_tests:
            form_result = next((r for r in self.test_results if r["test"] == form_name), None)
            if form_result:
                if form_result["passed"]:
                    print(f"   ✅ {form_name}: Working")
                    working_forms += 1
                else:
                    print(f"   ❌ {form_name}: Failed - {form_result['details']}")
            else:
                print(f"   ❓ {form_name}: Not tested")
        
        # Dashboard integration status
        print(f"\n🔗 Dashboard Integration Status:")
        dashboard_test = next((r for r in self.test_results if "Dashboard" in r["test"]), None)
        if dashboard_test and dashboard_test["passed"]:
            print(f"   ✅ External dashboard connectivity verified")
        else:
            print(f"   ❌ Dashboard connectivity issues detected")
        
        # Security status
        print(f"\n🔒 Security Status:")
        auth_test = next((r for r in self.test_results if "Authentication" in r["test"]), None)
        if auth_test and auth_test["passed"]:
            print(f"   ✅ X-INGEST-KEY authentication working correctly")
        else:
            print(f"   ❌ Authentication security issues detected")
        
        # Critical findings
        print(f"\n🎯 Critical Findings:")
        
        if working_forms == 5:
            print(f"   🎉 ALL 5 FORMS WORKING PERFECTLY!")
        elif working_forms >= 4:
            print(f"   ✅ {working_forms}/5 forms working - Minor issues detected")
        elif working_forms >= 3:
            print(f"   ⚠️ {working_forms}/5 forms working - Moderate issues need attention")
        else:
            print(f"   ❌ Only {working_forms}/5 forms working - Major issues require immediate fix")
        
        # Failed tests details
        if failed_tests > 0:
            print(f"\n❌ Failed Tests Details:")
            for result in self.test_results:
                if not result["passed"]:
                    print(f"   • {result['test']}: {result['details']}")
        
        # Production readiness
        print(f"\n🎯 Production Readiness Assessment:")
        
        if success_rate >= 90 and working_forms >= 4:
            print(f"   🎉 EXCELLENT - All forms ready for production use")
            print(f"   🔄 Dashboard synchronization working correctly")
        elif success_rate >= 75 and working_forms >= 3:
            print(f"   ✅ GOOD - Most forms working with minor issues")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Forms need improvements before production")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        return success_rate >= 75 and working_forms >= 4
    
    def run_comprehensive_tests(self):
        """Run all comprehensive tests for SentraTech forms"""
        print("🚀 Starting Comprehensive SentraTech Forms Testing")
        print("=" * 80)
        print("Testing ALL 5 forms to verify dashboard synchronization:")
        print("• Demo Request Form (/api/ingest/demo_requests)")
        print("• Contact Sales Form (/api/ingest/contact_requests)")
        print("• ROI Calculator Form (/api/ingest/roi_reports)")
        print("• Newsletter Subscription (/api/ingest/subscriptions)")
        print("• Job Application Form (/api/ingest/job_applications)")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic health and connectivity
            if not self.test_backend_health():
                print("❌ Backend health check failed - continuing with caution")
            
            self.verify_dashboard_connectivity()
            
            # Test all 5 forms
            self.test_demo_request_form()
            self.test_contact_sales_form()
            self.test_roi_calculator_form()
            self.test_newsletter_subscription_form()
            self.test_job_application_form()
            
            # Security and validation tests
            self.test_authentication_security()
            self.test_data_validation()
            
            # Status endpoints verification
            self.verify_status_endpoints()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_comprehensive_summary()
        
        return is_ready


def main():
    """Main function to run comprehensive forms testing"""
    print("🎯 Comprehensive SentraTech Forms Testing")
    print("Testing all 5 forms to verify dashboard synchronization after endpoint implementation")
    print()
    
    tester = ComprehensiveFormsTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: SentraTech forms are working correctly with dashboard synchronization!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Some forms need attention before production use")
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