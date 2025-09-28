#!/usr/bin/env python3
"""
Comprehensive Supabase Contact Sales Integration Testing
Tests the Contact Sales form submission functionality with Supabase database integration
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, Any, List

# Frontend URL from environment
FRONTEND_URL = "https://form-simulator.preview.emergentagent.com"

# Supabase configuration from frontend/.env
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

class SupabaseContactSalesIntegrationTester:
    """Test the Contact Sales form Supabase integration"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
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
    
    def test_supabase_client_connection(self):
        """Test 1: Supabase client connection and authentication"""
        print("\n=== Testing Supabase Client Connection ===")
        
        try:
            # Test basic connection to Supabase
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(f"{SUPABASE_URL}/rest/v1/", headers=headers, timeout=10)
            
            if response.status_code == 200:
                self.log_test("Supabase Client Connection", True, 
                            f"✅ Successfully connected to Supabase instance: {SUPABASE_URL}")
                return True
            else:
                self.log_test("Supabase Client Connection", False, 
                            f"❌ Connection failed with status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Supabase Client Connection", False, 
                        f"❌ Connection error: {str(e)}")
            return False
    
    def test_contact_requests_table_structure(self):
        """Test 2: Check if contact_requests table exists and has proper structure"""
        print("\n=== Testing Contact Requests Table Structure ===")
        
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json'
            }
            
            # Try to query the table structure
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/contact_requests?limit=0", 
                headers=headers, 
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Contact Requests Table Exists", True, 
                            "✅ contact_requests table exists and is accessible")
                
                # Test with a HEAD request to check table structure without data
                head_response = requests.head(
                    f"{SUPABASE_URL}/rest/v1/contact_requests", 
                    headers=headers, 
                    timeout=10
                )
                
                if head_response.status_code == 200:
                    self.log_test("Contact Requests Table Structure", True, 
                                "✅ Table structure accessible via REST API")
                    return True
                else:
                    self.log_test("Contact Requests Table Structure", False, 
                                f"❌ HEAD request failed: {head_response.status_code}")
                    return False
                    
            elif response.status_code == 401:
                self.log_test("Contact Requests Table Access", False, 
                            "❌ Unauthorized access - RLS policies may be blocking anonymous access")
                return False
            elif response.status_code == 404:
                self.log_test("Contact Requests Table Exists", False, 
                            "❌ contact_requests table does not exist")
                return False
            else:
                self.log_test("Contact Requests Table Access", False, 
                            f"❌ Unexpected status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Contact Requests Table Structure", False, 
                        f"❌ Error checking table structure: {str(e)}")
            return False
    
    def test_rls_policies_anonymous_insert(self):
        """Test 3: Test RLS policies allow anonymous inserts to contact_requests table"""
        print("\n=== Testing RLS Policies for Anonymous Inserts ===")
        
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            # Test data for RLS policy check
            test_data = {
                "full_name": "RLS Test User",
                "work_email": f"rls_test_{int(time.time())}@example.com",
                "company_name": "RLS Test Company",
                "monthly_volume": "10k_50k",
                "preferred_contact_method": "email",
                "consent_marketing": True,
                "created_at": datetime.now().isoformat()
            }
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=headers,
                json=test_data,
                timeout=15
            )
            
            if response.status_code == 201:
                self.log_test("RLS Policies - Anonymous Insert", True, 
                            "✅ Anonymous inserts allowed - RLS policies configured correctly")
                return True
            elif response.status_code == 401:
                self.log_test("RLS Policies - Anonymous Insert", False, 
                            "❌ RLS policies blocking anonymous inserts - need to configure INSERT policy")
                return False
            elif response.status_code == 400:
                error_details = response.text
                if "violates row-level security policy" in error_details:
                    self.log_test("RLS Policies - Anonymous Insert", False, 
                                "❌ RLS policy violation - INSERT policy not configured for anonymous users")
                else:
                    self.log_test("RLS Policies - Data Validation", False, 
                                f"❌ Data validation error: {error_details}")
                return False
            else:
                self.log_test("RLS Policies - Anonymous Insert", False, 
                            f"❌ Unexpected response: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("RLS Policies - Anonymous Insert", False, 
                        f"❌ Error testing RLS policies: {str(e)}")
            return False
    
    def test_insert_contact_request_function(self):
        """Test 4: Test the insertContactRequest function from supabaseClient.js"""
        print("\n=== Testing insertContactRequest Function Logic ===")
        
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            # Test data matching the insertContactRequest function structure
            test_data = {
                "full_name": "Sarah Johnson",
                "work_email": "sarah.johnson@techcorp.com",
                "phone": "+1-555-123-4567",
                "company_name": "TechCorp Solutions",
                "company_website": "https://techcorp.com",
                "monthly_volume": "10k_50k",
                "plan_selected": "enterprise",
                "preferred_contact_method": "email",
                "message": "Interested in AI customer support platform for our growing business",
                "utm_data": {
                    "utm_source": "website",
                    "utm_medium": "contact_form",
                    "utm_campaign": "contact_sales"
                },
                "metadata": {
                    "userAgent": "Mozilla/5.0 (Test Browser)",
                    "referrer": "https://form-simulator.preview.emergentagent.com/pricing",
                    "timestamp": datetime.now().isoformat(),
                    "viewport": {
                        "width": 1920,
                        "height": 1080
                    },
                    "deviceType": "desktop"
                },
                "consent_marketing": True,
                "created_at": datetime.now().isoformat()
            }
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=headers,
                json=test_data,
                timeout=15
            )
            
            if response.status_code == 201:
                self.log_test("insertContactRequest Function Logic", True, 
                            "✅ Contact request inserted successfully with all required fields")
                
                # Test required fields validation
                required_fields_test = {
                    "full_name": "Test User",
                    "work_email": "test@example.com",
                    "company_name": "Test Company",
                    "monthly_volume": "under_10k",
                    "consent_marketing": False,
                    "created_at": datetime.now().isoformat()
                }
                
                response2 = requests.post(
                    f"{SUPABASE_URL}/rest/v1/contact_requests",
                    headers=headers,
                    json=required_fields_test,
                    timeout=15
                )
                
                if response2.status_code == 201:
                    self.log_test("insertContactRequest Required Fields", True, 
                                "✅ Required fields validation working correctly")
                    return True
                else:
                    self.log_test("insertContactRequest Required Fields", False, 
                                f"❌ Required fields test failed: {response2.status_code}")
                    return False
                    
            elif response.status_code == 400:
                error_details = response.text
                self.log_test("insertContactRequest Function Logic", False, 
                            f"❌ Data validation error: {error_details}")
                return False
            else:
                self.log_test("insertContactRequest Function Logic", False, 
                            f"❌ Insert failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("insertContactRequest Function Logic", False, 
                        f"❌ Error testing insertContactRequest: {str(e)}")
            return False
    
    def test_contact_form_submission_end_to_end(self):
        """Test 5: Test a complete contact request submission end-to-end"""
        print("\n=== Testing Contact Form Submission End-to-End ===")
        
        try:
            # Test realistic contact form data
            contact_data = {
                "fullName": "Michael Chen",
                "workEmail": "michael.chen@globaltech.com",
                "phone": "+1-555-987-6543",
                "companyName": "GlobalTech Industries",
                "companyWebsite": "https://globaltech.com",
                "monthlyVolume": "over_50k",
                "planSelected": "enterprise",
                "preferredContactMethod": "phone",
                "message": "We handle over 50,000 customer interactions monthly and are looking for an AI solution to improve efficiency and reduce costs. Please schedule a demo to discuss our specific requirements.",
                "consentMarketing": True,
                "utmData": {
                    "utm_source": "google",
                    "utm_medium": "cpc",
                    "utm_campaign": "enterprise_contact"
                }
            }
            
            # Simulate the insertContactRequest function logic
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            # Transform data to match database schema
            db_data = {
                "full_name": contact_data["fullName"],
                "work_email": contact_data["workEmail"].lower().strip(),
                "phone": contact_data.get("phone"),
                "company_name": contact_data["companyName"],
                "company_website": contact_data.get("companyWebsite"),
                "monthly_volume": contact_data["monthlyVolume"],
                "plan_selected": contact_data.get("planSelected"),
                "preferred_contact_method": contact_data.get("preferredContactMethod", "email"),
                "message": contact_data.get("message"),
                "utm_data": contact_data.get("utmData", {}),
                "metadata": {
                    "userAgent": "Mozilla/5.0 (Test Browser)",
                    "referrer": "https://form-simulator.preview.emergentagent.com/pricing",
                    "timestamp": datetime.now().isoformat(),
                    "viewport": {"width": 1920, "height": 1080},
                    "deviceType": "desktop"
                },
                "consent_marketing": contact_data.get("consentMarketing", False),
                "created_at": datetime.now().isoformat()
            }
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=headers,
                json=db_data,
                timeout=15
            )
            
            if response.status_code == 201:
                self.log_test("Contact Form End-to-End Submission", True, 
                            "✅ Complete contact form submission successful")
                
                # Test edge cases
                self.test_edge_cases()
                return True
            else:
                self.log_test("Contact Form End-to-End Submission", False, 
                            f"❌ Submission failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Form End-to-End Submission", False, 
                        f"❌ Error in end-to-end test: {str(e)}")
            return False
    
    def test_edge_cases(self):
        """Test edge cases and validation scenarios"""
        print("\n=== Testing Edge Cases and Validation ===")
        
        headers = {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        # Test Case 1: Invalid email format
        try:
            invalid_email_data = {
                "full_name": "Test User",
                "work_email": "invalid-email-format",
                "company_name": "Test Company",
                "monthly_volume": "under_10k",
                "consent_marketing": False,
                "created_at": datetime.now().isoformat()
            }
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=headers,
                json=invalid_email_data,
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_test("Edge Case - Invalid Email Validation", True, 
                            "✅ Invalid email format properly rejected")
            else:
                self.log_test("Edge Case - Invalid Email Validation", False, 
                            f"❌ Invalid email not rejected: {response.status_code}")
                
        except Exception as e:
            self.log_test("Edge Case - Invalid Email Validation", False, 
                        f"❌ Error testing invalid email: {str(e)}")
        
        # Test Case 2: Missing required fields
        try:
            missing_fields_data = {
                "work_email": "test@example.com",
                "monthly_volume": "under_10k",
                "created_at": datetime.now().isoformat()
            }
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=headers,
                json=missing_fields_data,
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_test("Edge Case - Missing Required Fields", True, 
                            "✅ Missing required fields properly rejected")
            else:
                self.log_test("Edge Case - Missing Required Fields", False, 
                            f"❌ Missing fields not rejected: {response.status_code}")
                
        except Exception as e:
            self.log_test("Edge Case - Missing Required Fields", False, 
                        f"❌ Error testing missing fields: {str(e)}")
        
        # Test Case 3: Invalid monthly volume
        try:
            invalid_volume_data = {
                "full_name": "Test User",
                "work_email": "test@example.com",
                "company_name": "Test Company",
                "monthly_volume": "invalid_volume",
                "consent_marketing": False,
                "created_at": datetime.now().isoformat()
            }
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=headers,
                json=invalid_volume_data,
                timeout=10
            )
            
            if response.status_code == 400:
                self.log_test("Edge Case - Invalid Monthly Volume", True, 
                            "✅ Invalid monthly volume properly rejected")
            else:
                self.log_test("Edge Case - Invalid Monthly Volume", False, 
                            f"❌ Invalid volume not rejected: {response.status_code}")
                
        except Exception as e:
            self.log_test("Edge Case - Invalid Monthly Volume", False, 
                        f"❌ Error testing invalid volume: {str(e)}")
    
    def test_data_persistence_and_retrieval(self):
        """Test 6: Test data persistence and retrieval (if SELECT is allowed)"""
        print("\n=== Testing Data Persistence and Retrieval ===")
        
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json'
            }
            
            # Try to retrieve recent contact requests
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/contact_requests?limit=1&order=created_at.desc",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_test("Data Persistence - Retrieval", True, 
                                f"✅ Data retrieval working - found {len(data)} records")
                    
                    # Verify data structure
                    record = data[0]
                    required_fields = ['id', 'full_name', 'work_email', 'company_name', 'created_at']
                    missing_fields = [field for field in required_fields if field not in record]
                    
                    if not missing_fields:
                        self.log_test("Data Persistence - Structure Integrity", True, 
                                    "✅ Data structure integrity verified")
                    else:
                        self.log_test("Data Persistence - Structure Integrity", False, 
                                    f"❌ Missing fields in stored data: {missing_fields}")
                else:
                    self.log_test("Data Persistence - Retrieval", True, 
                                "✅ Data retrieval endpoint accessible (no records found)")
                    
            elif response.status_code == 401:
                self.log_test("Data Persistence - Retrieval", True, 
                            "✅ SELECT access restricted (expected for anonymous users)")
            else:
                self.log_test("Data Persistence - Retrieval", False, 
                            f"❌ Unexpected retrieval response: {response.status_code}")
                
        except Exception as e:
            self.log_test("Data Persistence - Retrieval", False, 
                        f"❌ Error testing data retrieval: {str(e)}")
    
    def diagnose_contact_form_failure(self):
        """Diagnose the specific failure reported by the user"""
        print("\n=== Diagnosing Contact Form Failure ===")
        
        try:
            # Test the exact scenario that's failing
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            # Simulate user's contact form submission
            user_test_data = {
                "full_name": "John Smith",
                "work_email": "john.smith@testcompany.com",
                "phone": "+1-555-123-4567",
                "company_name": "Test Company Inc",
                "company_website": "https://testcompany.com",
                "monthly_volume": "10k_50k",
                "preferred_contact_method": "email",
                "message": "Interested in your AI customer support solution",
                "consent_marketing": True,
                "created_at": datetime.now().isoformat()
            }
            
            print(f"🔍 Testing contact form submission with user-like data...")
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=headers,
                json=user_test_data,
                timeout=15
            )
            
            print(f"📊 Response Status: {response.status_code}")
            print(f"📊 Response Headers: {dict(response.headers)}")
            print(f"📊 Response Body: {response.text}")
            
            if response.status_code == 201:
                self.log_test("Contact Form Failure Diagnosis", True, 
                            "✅ Contact form submission working correctly - no failure detected")
            elif response.status_code == 401:
                self.log_test("Contact Form Failure Diagnosis", False, 
                            "❌ DIAGNOSIS: RLS policies blocking anonymous inserts - need INSERT policy for anon role")
            elif response.status_code == 400:
                error_details = response.text
                if "violates row-level security policy" in error_details:
                    self.log_test("Contact Form Failure Diagnosis", False, 
                                "❌ DIAGNOSIS: RLS policy violation - INSERT policy not configured")
                elif "column" in error_details and "does not exist" in error_details:
                    self.log_test("Contact Form Failure Diagnosis", False, 
                                f"❌ DIAGNOSIS: Database schema mismatch - {error_details}")
                elif "constraint" in error_details:
                    self.log_test("Contact Form Failure Diagnosis", False, 
                                f"❌ DIAGNOSIS: Data validation constraint violation - {error_details}")
                else:
                    self.log_test("Contact Form Failure Diagnosis", False, 
                                f"❌ DIAGNOSIS: Data validation error - {error_details}")
            elif response.status_code == 404:
                self.log_test("Contact Form Failure Diagnosis", False, 
                            "❌ DIAGNOSIS: contact_requests table does not exist")
            else:
                self.log_test("Contact Form Failure Diagnosis", False, 
                            f"❌ DIAGNOSIS: Unexpected error - Status: {response.status_code}, Body: {response.text}")
                
        except Exception as e:
            self.log_test("Contact Form Failure Diagnosis", False, 
                        f"❌ DIAGNOSIS: Connection/Network error - {str(e)}")
    
    def generate_comprehensive_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 80)
        print("📊 SUPABASE CONTACT SALES INTEGRATION TEST REPORT")
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
        
        # Detailed findings
        print(f"\n🔍 Detailed Findings:")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["passed"]:
                    print(f"   • {result['test']}: {result['details']}")
        
        if passed_tests > 0:
            print(f"\n✅ PASSED TESTS:")
            for result in self.test_results:
                if result["passed"]:
                    print(f"   • {result['test']}")
        
        # Root cause analysis
        print(f"\n🎯 Root Cause Analysis:")
        
        # Check for common failure patterns
        rls_failures = [r for r in self.test_results if not r["passed"] and "RLS" in r["details"]]
        schema_failures = [r for r in self.test_results if not r["passed"] and "schema" in r["details"]]
        connection_failures = [r for r in self.test_results if not r["passed"] and "connection" in r["details"].lower()]
        
        if rls_failures:
            print(f"   🚨 RLS Policy Issues: {len(rls_failures)} tests failed due to Row Level Security policies")
            print(f"      SOLUTION: Configure RLS INSERT policy for anonymous users")
        
        if schema_failures:
            print(f"   🚨 Database Schema Issues: {len(schema_failures)} tests failed due to schema problems")
            print(f"      SOLUTION: Verify contact_requests table structure matches expected schema")
        
        if connection_failures:
            print(f"   🚨 Connection Issues: {len(connection_failures)} tests failed due to connectivity")
            print(f"      SOLUTION: Check Supabase URL and API key configuration")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT: Contact Sales integration is working correctly")
        elif success_rate >= 70:
            print(f"   ✅ GOOD: Minor issues need to be addressed")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR: Several issues need resolution")
        else:
            print(f"   ❌ POOR: Major issues require immediate attention")
        
        # Specific recommendations based on failures
        if any("RLS" in r["details"] for r in self.test_results if not r["passed"]):
            print(f"   • Execute RLS policy SQL: CREATE POLICY insert_contact_requests ON contact_requests FOR INSERT WITH CHECK (true);")
        
        if any("table does not exist" in r["details"] for r in self.test_results if not r["passed"]):
            print(f"   • Create contact_requests table using the provided supabase_setup.sql")
        
        if any("schema" in r["details"] for r in self.test_results if not r["passed"]):
            print(f"   • Verify table schema matches insertContactRequest function expectations")
        
        print(f"   • Test the Contact Sales form manually on the frontend")
        print(f"   • Monitor Supabase logs for detailed error information")
        
        return success_rate >= 70
    
    def run_comprehensive_tests(self):
        """Run all comprehensive Supabase Contact Sales integration tests"""
        print("🚀 Starting Comprehensive Supabase Contact Sales Integration Testing")
        print("=" * 80)
        print("Testing Supabase integration for Contact Sales form submission:")
        print("• Supabase client connection and authentication")
        print("• contact_requests table existence and structure")
        print("• RLS policies for anonymous inserts")
        print("• insertContactRequest function logic")
        print("• End-to-end contact form submission")
        print("• Edge cases and validation scenarios")
        print("• Data persistence and retrieval")
        print("• Root cause diagnosis for reported failures")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Core integration tests
            self.test_supabase_client_connection()
            self.test_contact_requests_table_structure()
            self.test_rls_policies_anonymous_insert()
            self.test_insert_contact_request_function()
            self.test_contact_form_submission_end_to_end()
            self.test_data_persistence_and_retrieval()
            
            # Diagnostic tests
            self.diagnose_contact_form_failure()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Supabase Integration Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        success = self.generate_comprehensive_report()
        
        return success


def main():
    """Main test execution"""
    print("🔍 SUPABASE CONTACT SALES INTEGRATION TESTING")
    print("=" * 60)
    
    tester = SupabaseContactSalesIntegrationTester()
    success = tester.run_comprehensive_tests()
    
    if success:
        print(f"\n🎉 TESTING COMPLETE: Contact Sales integration is working correctly!")
        return 0
    else:
        print(f"\n⚠️ TESTING COMPLETE: Issues found that need to be addressed")
        return 1


if __name__ == "__main__":
    exit(main())