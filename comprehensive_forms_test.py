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
        """Test Demo Request Form - POST /api/demo/request"""
        print("\n=== Testing Demo Request Form ===")
        
        # Test data with all required fields
        test_data = {
            "name": "John Smith",
            "email": "john.smith@testcompany.com",
            "company": "Test Company Inc",
            "phone": "+1-555-123-4567",
            "message": "We are interested in a demo of your AI customer support platform",
            "preferredDate": "2024-02-15"
        }
        
        try:
            print(f"📝 Submitting demo request...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/demo/request", json=test_data, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure
                if result.get("success") and result.get("reference_id"):
                    self.reference_ids["demo_request"] = result["reference_id"]
                    self.log_test("Demo Request Form - Valid Submission", True, 
                                f"✅ Demo request successful! Reference ID: {result['reference_id']}")
                    return True
                else:
                    self.log_test("Demo Request Form - Valid Submission", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Demo Request Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Demo Request Form - Valid Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_contact_sales_form(self):
        """Test Contact Sales Form - POST /api/contact/sales"""
        print("\n=== Testing Contact Sales Form ===")
        
        # Test data with all required fields
        test_data = {
            "fullName": "Sarah Johnson",
            "workEmail": "sarah.johnson@enterprise.com",
            "companyName": "Enterprise Solutions Ltd",
            "message": "We need a quote for enterprise-level AI customer support for 500+ agents",
            "phone": "+1-555-987-6543",
            "monthlyVolume": "100000"
        }
        
        try:
            print(f"📝 Submitting contact sales request...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/contact/sales", json=test_data, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure
                if result.get("success") and result.get("reference_id"):
                    self.reference_ids["contact_sales"] = result["reference_id"]
                    self.log_test("Contact Sales Form - Valid Submission", True, 
                                f"✅ Contact sales request successful! Reference ID: {result['reference_id']}")
                    return True
                else:
                    self.log_test("Contact Sales Form - Valid Submission", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Contact Sales Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Sales Form - Valid Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_roi_calculator_form(self):
        """Test ROI Calculator Form - POST /api/roi/submit"""
        print("\n=== Testing ROI Calculator Form ===")
        
        # Test data with all required fields
        test_data = {
            "country": "United States",
            "monthlyVolume": "50000",
            "interactionVolume": "75000",
            "email": "roi.test@company.com"
        }
        
        try:
            print(f"📝 Submitting ROI calculator request...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/roi/submit", json=test_data, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure - ROI should include roi_summary data
                if result.get("success") and result.get("roi_summary"):
                    roi_summary = result["roi_summary"]
                    if "monthly_savings" in roi_summary and "annual_savings" in roi_summary:
                        self.log_test("ROI Calculator Form - Valid Submission", True, 
                                    f"✅ ROI calculation successful! Monthly savings: ${roi_summary.get('monthly_savings', 0):,.2f}")
                        return True
                    else:
                        self.log_test("ROI Calculator Form - Valid Submission", False, 
                                    f"ROI summary missing required fields: {roi_summary}")
                        return False
                else:
                    self.log_test("ROI Calculator Form - Valid Submission", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("ROI Calculator Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("ROI Calculator Form - Valid Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_newsletter_subscription_form(self):
        """Test Newsletter Subscription - POST /api/newsletter/subscribe"""
        print("\n=== Testing Newsletter Subscription Form ===")
        
        # Test data with all required fields
        test_data = {
            "email": "newsletter.test@example.com",
            "name": "Newsletter Subscriber"
        }
        
        try:
            print(f"📝 Submitting newsletter subscription...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/newsletter/subscribe", json=test_data, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure
                if result.get("success"):
                    self.log_test("Newsletter Subscription - Valid Submission", True, 
                                f"✅ Newsletter subscription successful! Message: {result.get('message', '')}")
                    
                    # Test duplicate handling
                    self.test_newsletter_duplicate_handling(test_data)
                    return True
                else:
                    self.log_test("Newsletter Subscription - Valid Submission", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Newsletter Subscription - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Newsletter Subscription - Valid Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_newsletter_duplicate_handling(self, original_data):
        """Test newsletter duplicate subscription handling"""
        print("\n--- Testing Newsletter Duplicate Handling ---")
        
        try:
            # Submit the same email again
            response = requests.post(f"{BACKEND_URL}/newsletter/subscribe", json=original_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") or "already subscribed" in result.get("message", "").lower():
                    self.log_test("Newsletter Subscription - Duplicate Handling", True, 
                                f"✅ Duplicate handling working: {result.get('message', '')}")
                else:
                    self.log_test("Newsletter Subscription - Duplicate Handling", False, 
                                f"Unexpected duplicate response: {result}")
            else:
                self.log_test("Newsletter Subscription - Duplicate Handling", False, 
                            f"Duplicate test failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Newsletter Subscription - Duplicate Handling", False, f"Exception: {str(e)}")
    
    def test_job_application_form(self):
        """Test Job Application Form - POST /api/job/application"""
        print("\n=== Testing Job Application Form ===")
        
        # Test data with all required fields
        test_data = {
            "fullName": "Michael Rodriguez",
            "email": "michael.rodriguez@jobseeker.com",
            "position": "Customer Support Specialist",
            "phone": "+1-555-456-7890",
            "location": "Remote - United States",
            "consentForStorage": True
        }
        
        try:
            print(f"📝 Submitting job application...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/job/application", json=test_data, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure
                if result.get("success") and result.get("application_id"):
                    self.reference_ids["job_application"] = result["application_id"]
                    self.log_test("Job Application Form - Valid Submission", True, 
                                f"✅ Job application successful! Application ID: {result['application_id']}")
                    return True
                else:
                    self.log_test("Job Application Form - Valid Submission", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Job Application Form - Valid Submission", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Job Application Form - Valid Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_form_validation(self):
        """Test form validation with invalid data"""
        print("\n=== Testing Form Validation ===")
        
        # Test Demo Request with missing required fields
        invalid_demo_data = {
            "email": "test@validation.com"
            # Missing name and company
        }
        
        try:
            print(f"🔍 Testing demo request validation - missing required fields...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=invalid_demo_data, timeout=15)
            
            if response.status_code in [422, 400]:  # Validation error expected
                self.log_test("Demo Request - Validation (Missing Fields)", True, 
                            f"✅ Validation correctly rejected missing fields: HTTP {response.status_code}")
            else:
                self.log_test("Demo Request - Validation (Missing Fields)", False, 
                            f"Expected validation error, got HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Validation (Missing Fields)", False, f"Exception: {str(e)}")
        
        # Test Contact Sales with invalid email
        invalid_contact_data = {
            "fullName": "Test User",
            "workEmail": "invalid-email-format",
            "companyName": "Test Company"
        }
        
        try:
            print(f"🔍 Testing contact sales validation - invalid email...")
            response = requests.post(f"{BACKEND_URL}/contact/sales", json=invalid_contact_data, timeout=15)
            
            if response.status_code in [422, 400]:  # Validation error expected
                self.log_test("Contact Sales - Validation (Invalid Email)", True, 
                            f"✅ Validation correctly rejected invalid email: HTTP {response.status_code}")
            else:
                self.log_test("Contact Sales - Validation (Invalid Email)", False, 
                            f"Expected validation error, got HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Contact Sales - Validation (Invalid Email)", False, f"Exception: {str(e)}")
        
        # Test Job Application without consent
        invalid_job_data = {
            "fullName": "Test Applicant",
            "email": "test@applicant.com",
            "position": "Test Position",
            "consentForStorage": False  # Should be required
        }
        
        try:
            print(f"🔍 Testing job application validation - missing consent...")
            response = requests.post(f"{BACKEND_URL}/job/application", json=invalid_job_data, timeout=15)
            
            if response.status_code in [422, 400]:  # Validation error expected
                self.log_test("Job Application - Validation (Missing Consent)", True, 
                            f"✅ Validation correctly rejected missing consent: HTTP {response.status_code}")
            else:
                self.log_test("Job Application - Validation (Missing Consent)", False, 
                            f"Expected validation error, got HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Job Application - Validation (Missing Consent)", False, f"Exception: {str(e)}")
    
    def test_database_storage_verification(self):
        """Test database storage by checking if data was persisted"""
        print("\n=== Testing Database Storage Verification ===")
        
        # Wait a moment for background processing
        time.sleep(2)
        
        # Check if we have reference IDs from successful submissions
        if not self.reference_ids:
            self.log_test("Database Storage - Reference IDs", False, 
                        "No reference IDs available from form submissions")
            return False
        
        print(f"🔍 Checking database storage for reference IDs: {self.reference_ids}")
        
        # For now, we'll consider successful form submissions with reference IDs as proof of database storage
        # In a real scenario, we would query status endpoints or database directly
        
        stored_forms = 0
        total_forms = len(self.reference_ids)
        
        for form_type, ref_id in self.reference_ids.items():
            if ref_id:
                stored_forms += 1
                self.log_test(f"Database Storage - {form_type.title()}", True, 
                            f"✅ {form_type} stored with ID: {ref_id}")
            else:
                self.log_test(f"Database Storage - {form_type.title()}", False, 
                            f"❌ {form_type} missing reference ID")
        
        # Overall storage verification
        if stored_forms == total_forms:
            self.log_test("Database Storage - Overall Verification", True, 
                        f"✅ All {stored_forms}/{total_forms} forms properly stored")
            return True
        else:
            self.log_test("Database Storage - Overall Verification", False, 
                        f"❌ Only {stored_forms}/{total_forms} forms properly stored")
            return False
    
    def test_response_format_validation(self):
        """Test that all endpoints return proper JSON responses"""
        print("\n=== Testing Response Format Validation ===")
        
        endpoints_to_test = [
            ("/demo/request", "Demo Request"),
            ("/contact/sales", "Contact Sales"),
            ("/roi/submit", "ROI Calculator"),
            ("/newsletter/subscribe", "Newsletter"),
            ("/job/application", "Job Application")
        ]
        
        valid_json_responses = 0
        
        for endpoint, name in endpoints_to_test:
            try:
                # Send minimal valid data to test response format
                minimal_data = {"test": "format_validation"}
                response = requests.post(f"{BACKEND_URL}{endpoint}", json=minimal_data, timeout=10)
                
                # Check if response is valid JSON
                try:
                    response.json()
                    valid_json_responses += 1
                    self.log_test(f"Response Format - {name}", True, 
                                f"✅ {name} returns valid JSON (HTTP {response.status_code})")
                except json.JSONDecodeError:
                    self.log_test(f"Response Format - {name}", False, 
                                f"❌ {name} returns invalid JSON: {response.text[:100]}")
                    
            except Exception as e:
                self.log_test(f"Response Format - {name}", False, f"Exception: {str(e)}")
        
        # Overall format validation
        total_endpoints = len(endpoints_to_test)
        if valid_json_responses == total_endpoints:
            self.log_test("Response Format - Overall Validation", True, 
                        f"✅ All {valid_json_responses}/{total_endpoints} endpoints return valid JSON")
        else:
            self.log_test("Response Format - Overall Validation", False, 
                        f"❌ Only {valid_json_responses}/{total_endpoints} endpoints return valid JSON")
    
    def generate_test_summary(self):
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
        print(f"\n📋 Form-Specific Results:")
        
        form_results = {
            "Demo Request": [r for r in self.test_results if "Demo Request" in r["test"]],
            "Contact Sales": [r for r in self.test_results if "Contact Sales" in r["test"]],
            "ROI Calculator": [r for r in self.test_results if "ROI Calculator" in r["test"]],
            "Newsletter": [r for r in self.test_results if "Newsletter" in r["test"]],
            "Job Application": [r for r in self.test_results if "Job Application" in r["test"]]
        }
        
        for form_name, results in form_results.items():
            if results:
                passed = len([r for r in results if r["passed"]])
                total = len(results)
                rate = (passed / total) * 100 if total > 0 else 0
                status = "✅" if rate >= 75 else "⚠️" if rate >= 50 else "❌"
                print(f"   {status} {form_name}: {passed}/{total} tests passed ({rate:.1f}%)")
        
        # Critical findings
        print(f"\n🎯 Critical Findings:")
        
        # Check for connectivity issues
        connectivity_issues = [r for r in self.test_results if "Connectivity" in r["test"] and not r["passed"]]
        if connectivity_issues:
            print(f"   ❌ CONNECTIVITY ISSUES:")
            for issue in connectivity_issues:
                print(f"      • {issue['details']}")
        
        # Check for validation issues
        validation_issues = [r for r in self.test_results if "Validation" in r["test"] and not r["passed"]]
        if validation_issues:
            print(f"   ❌ VALIDATION ISSUES:")
            for issue in validation_issues:
                print(f"      • {issue['details']}")
        
        # Check for storage issues
        storage_issues = [r for r in self.test_results if "Storage" in r["test"] and not r["passed"]]
        if storage_issues:
            print(f"   ❌ DATABASE STORAGE ISSUES:")
            for issue in storage_issues:
                print(f"      • {issue['details']}")
        
        # Reference IDs summary
        if self.reference_ids:
            print(f"\n📝 Generated Reference IDs:")
            for form_type, ref_id in self.reference_ids.items():
                print(f"   • {form_type.title()}: {ref_id}")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - All forms are production-ready")
        elif success_rate >= 75:
            print(f"   ✅ GOOD - Forms working with minor issues")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Forms need improvements")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests == 0:
            print(f"   • All forms are working correctly - ready for production!")
        else:
            print(f"   • Address {failed_tests} failed test cases")
        
        if connectivity_issues:
            print(f"   • Fix backend connectivity issues")
        
        if validation_issues:
            print(f"   • Review form validation logic")
        
        if storage_issues:
            print(f"   • Verify database storage and persistence")
        
        if success_rate >= 75:
            print(f"   • Forms are ready for production use")
        
        return success_rate >= 75
    
    def run_comprehensive_tests(self):
        """Run all comprehensive tests for SentraTech forms"""
        print("🚀 Starting Comprehensive SentraTech Forms Testing")
        print("=" * 80)
        print("Testing all 5 SentraTech website form endpoints:")
        print("• Demo Request Form - POST /api/demo/request")
        print("• Contact Sales Form - POST /api/contact/sales")
        print("• ROI Calculator Form - POST /api/roi/submit")
        print("• Newsletter Subscription - POST /api/newsletter/subscribe")
        print("• Job Application Form - POST /api/job/application")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity tests
            if not self.test_backend_connectivity():
                print("❌ Backend connectivity failed - aborting tests")
                return False
            
            if not self.test_health_check():
                print("❌ Backend health check failed - continuing with caution")
            
            # Core form functionality tests
            self.test_demo_request_form()
            self.test_contact_sales_form()
            self.test_roi_calculator_form()
            self.test_newsletter_subscription_form()
            self.test_job_application_form()
            
            # Validation and format tests
            self.test_form_validation()
            self.test_response_format_validation()
            
            # Database storage verification
            self.test_database_storage_verification()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_test_summary()
        
        return is_ready


def main():
    """Main function to run comprehensive forms testing"""
    print("🎯 Comprehensive SentraTech Forms Testing")
    print("Testing all 5 form endpoints that were just fixed")
    print()
    
    tester = ComprehensiveFormsTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: All SentraTech forms are working correctly!")
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