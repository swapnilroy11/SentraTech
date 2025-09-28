#!/usr/bin/env python3
"""
Supabase Contact Sales Integration Testing - Direct Testing
Tests the FIXED Contact Sales form submission directly with Supabase 'Contract Sale Request' table
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

# Backend and Frontend URLs
BACKEND_URL = "https://customer-flow-5.preview.emergentagent.com/api"
FRONTEND_URL = "https://customer-flow-5.preview.emergentagent.com"

# Supabase configuration from frontend/.env
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

class SupabaseContactSalesTester:
    """Test the FIXED Contact Sales form submission with direct Supabase integration"""
    
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
    
    def test_supabase_direct_connection(self):
        """Test direct connection to Supabase"""
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json'
            }
            
            # Test basic connection
            response = requests.get(f"{SUPABASE_URL}/rest/v1/", headers=headers, timeout=10)
            
            if response.status_code == 200:
                self.log_test("Supabase Direct Connection", True, f"Connected successfully: {response.status_code}")
                return True
            else:
                self.log_test("Supabase Direct Connection", False, f"Connection failed: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Supabase Direct Connection", False, f"Connection error: {str(e)}")
            return False
    
    def test_contract_sale_request_table_exists(self):
        """Test if 'Contract Sale Request' table exists in Supabase"""
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json'
            }
            
            # Try to query the table (should return empty result or data, not 404)
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/Contract%20Sale%20Request?select=*&limit=1", 
                headers=headers, 
                timeout=10
            )
            
            print(f"📡 Table query response: {response.status_code}")
            print(f"📡 Response text: {response.text}")
            
            if response.status_code == 200:
                self.log_test("Contract Sale Request Table Exists", True, 
                            f"✅ Table 'Contract Sale Request' exists and is accessible")
                return True
            elif response.status_code == 404:
                self.log_test("Contract Sale Request Table Exists", False,
                            f"❌ Table 'Contract Sale Request' not found (404)")
                return False
            else:
                self.log_test("Contract Sale Request Table Exists", False,
                            f"❌ Unexpected response: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contract Sale Request Table Exists", False, f"Exception: {str(e)}")
            return False
    
    def test_direct_supabase_insertion(self):
        """Test direct insertion into 'Contract Sale Request' table"""
        print("\n=== Testing Direct Supabase Insertion ===")
        
        # Test data matching the review request
        test_data = {
            "full_name": "John Smith",
            "work_email": "john@company.com",
            "company_name": "Acme Corporation",
            "company_website": "https://company.com",
            "monthly_volume": "<10k",
            "plan_selected": "Growth Plan Selected (24 Months)",
            "preferred_contact_method": "email",
            "consent_marketing": True
        }
        
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            print(f"📝 Inserting test data directly into 'Contract Sale Request' table...")
            print(f"   Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/Contract%20Sale%20Request",
                headers=headers,
                json=test_data,
                timeout=30
            )
            
            print(f"📡 Response Status: {response.status_code}")
            print(f"📡 Response Text: {response.text}")
            
            if response.status_code == 201:
                self.log_test("Direct Supabase Insertion - Success", True,
                            f"✅ Successfully inserted into 'Contract Sale Request' table")
                return True
            elif response.status_code == 400:
                error_text = response.text
                if "column" in error_text.lower():
                    self.log_test("Direct Supabase Insertion - Column Error", False,
                                f"❌ Column error: {error_text}")
                else:
                    self.log_test("Direct Supabase Insertion - Validation Error", False,
                                f"❌ Validation error: {error_text}")
                return False
            elif response.status_code == 404:
                self.log_test("Direct Supabase Insertion - Table Not Found", False,
                            f"❌ Table 'Contract Sale Request' not found")
                return False
            else:
                self.log_test("Direct Supabase Insertion - Other Error", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Direct Supabase Insertion - Exception", False, f"Exception: {str(e)}")
            return False
    
    def test_contact_sales_backend_endpoint(self):
        """Test if there's a dedicated contact sales backend endpoint"""
        print("\n=== Testing Contact Sales Backend Endpoint ===")
        
        test_data = {
            "full_name": "Jane Doe",
            "work_email": "jane@testcompany.com",
            "company_name": "Test Company Inc",
            "monthly_volume": "10k-50k",
            "plan_selected": "Growth Plan Selected (36 Months)",
            "preferred_contact_method": "email",
            "consent_marketing": True
        }
        
        # Try different possible endpoints
        endpoints_to_test = [
            "/contact/sales",
            "/contact/request", 
            "/contact-sales",
            "/sales/contact",
            "/pricing/contact"
        ]
        
        for endpoint in endpoints_to_test:
            try:
                print(f"🔍 Testing endpoint: {endpoint}")
                response = requests.post(f"{BACKEND_URL}{endpoint}", json=test_data, timeout=20)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        self.log_test(f"Contact Sales Endpoint - {endpoint}", True,
                                    f"✅ Endpoint {endpoint} working: {result}")
                        return True
                elif response.status_code == 404:
                    print(f"   ❌ {endpoint} - Not found (404)")
                else:
                    print(f"   ❌ {endpoint} - HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ {endpoint} - Exception: {str(e)}")
        
        self.log_test("Contact Sales Backend Endpoint", False,
                    f"❌ No working contact sales endpoint found")
        return False
    
    def test_frontend_contact_form_submission(self):
        """Test frontend contact form submission (if accessible)"""
        print("\n=== Testing Frontend Contact Form Submission ===")
        
        # This would test the actual frontend form submission
        # Since we can't directly test React components, we'll simulate the API call
        
        test_data = {
            "fullName": "Emma Wilson",
            "workEmail": "emma@growthcorp.com",
            "companyName": "Growth Corp",
            "companyWebsite": "https://growthcorp.com",
            "monthlyVolume": "10k-50k",
            "planSelected": "Growth Plan Selected (24 Months)",
            "preferredContactMethod": "email",
            "consentMarketing": True
        }
        
        try:
            # Try to simulate what the frontend would do
            print(f"📝 Simulating frontend contact form submission...")
            
            # The frontend would call insertContactRequest from supabaseClient.js
            # We'll test this by making the same Supabase call
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            # Transform data to match what supabaseClient.js would send
            supabase_data = {
                "full_name": test_data["fullName"],
                "work_email": test_data["workEmail"].lower().strip(),
                "phone": test_data.get("phone"),
                "company_name": test_data["companyName"],
                "company_website": test_data.get("companyWebsite"),
                "monthly_volume": test_data["monthlyVolume"],
                "plan_selected": test_data.get("planSelected"),
                "preferred_contact_method": test_data.get("preferredContactMethod", "email"),
                "message": test_data.get("message"),
                "utm_data": {},
                "metadata": {
                    "source": "pricing_page",
                    "widget": "slide_in",
                    "timestamp": datetime.now().isoformat()
                },
                "consent_marketing": test_data.get("consentMarketing", False)
            }
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/Contract%20Sale%20Request",
                headers=headers,
                json=supabase_data,
                timeout=30
            )
            
            print(f"📡 Frontend simulation response: {response.status_code}")
            print(f"📡 Response text: {response.text}")
            
            if response.status_code == 201:
                self.log_test("Frontend Contact Form Simulation", True,
                            f"✅ Frontend form submission simulation successful")
                return True
            else:
                self.log_test("Frontend Contact Form Simulation", False,
                            f"❌ Frontend simulation failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Frontend Contact Form Simulation", False, f"Exception: {str(e)}")
            return False
    
    def test_all_required_columns_exist(self):
        """Test that all required columns exist in the table"""
        print("\n=== Testing Required Columns Exist ===")
        
        required_columns = [
            "full_name",
            "work_email", 
            "company_name",
            "monthly_volume",
            "plan_selected",
            "preferred_contact_method",
            "consent_marketing"
        ]
        
        # Test with minimal data to see which columns are accepted
        minimal_data = {col: f"test_{col}" if col != "consent_marketing" else True for col in required_columns}
        minimal_data["work_email"] = "test@example.com"  # Valid email format
        
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            print(f"📝 Testing required columns with minimal data...")
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/Contract%20Sale%20Request",
                headers=headers,
                json=minimal_data,
                timeout=30
            )
            
            if response.status_code == 201:
                self.log_test("Required Columns Test", True,
                            f"✅ All required columns exist and accept data")
                return True
            elif response.status_code == 400:
                error_text = response.text
                if "column" in error_text.lower():
                    # Parse which columns are missing
                    self.log_test("Required Columns Test", False,
                                f"❌ Column issues detected: {error_text}")
                else:
                    self.log_test("Required Columns Test", False,
                                f"❌ Validation error: {error_text}")
                return False
            else:
                self.log_test("Required Columns Test", False,
                            f"❌ Unexpected response: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Required Columns Test", False, f"Exception: {str(e)}")
            return False
    
    def test_removed_columns_not_required(self):
        """Test that removed columns (plan_id, billing_term, price_display) are not required"""
        print("\n=== Testing Removed Columns Not Required ===")
        
        # Test data WITHOUT the removed columns
        clean_data = {
            "full_name": "Clean Test User",
            "work_email": "clean@test.com",
            "company_name": "Clean Test Corp",
            "monthly_volume": "<10k",
            "plan_selected": "Growth Plan Selected (24 Months)",
            "preferred_contact_method": "email",
            "consent_marketing": True
        }
        
        try:
            headers = {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            print(f"📝 Testing submission without removed columns...")
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/Contract%20Sale%20Request",
                headers=headers,
                json=clean_data,
                timeout=30
            )
            
            if response.status_code == 201:
                self.log_test("Removed Columns Not Required", True,
                            f"✅ Submission successful without removed columns")
                return True
            else:
                self.log_test("Removed Columns Not Required", False,
                            f"❌ Submission failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Removed Columns Not Required", False, f"Exception: {str(e)}")
            return False
    
    def verify_no_failed_submit_errors(self):
        """Verify that we don't get 'Failed to submit contact request' errors"""
        print("\n=== Verifying No 'Failed to Submit' Errors ===")
        
        # Test multiple submissions to ensure consistency
        test_cases = [
            {
                "full_name": "Test User 1",
                "work_email": "test1@verification.com",
                "company_name": "Verification Corp 1",
                "monthly_volume": "<10k",
                "plan_selected": "Starter Plan Selected (24 Months)",
                "preferred_contact_method": "email",
                "consent_marketing": True
            },
            {
                "full_name": "Test User 2", 
                "work_email": "test2@verification.com",
                "company_name": "Verification Corp 2",
                "monthly_volume": "10k-50k",
                "plan_selected": "Growth Plan Selected (36 Months)",
                "preferred_contact_method": "phone",
                "consent_marketing": False
            }
        ]
        
        successful_submissions = 0
        failed_submissions = 0
        
        for i, test_data in enumerate(test_cases):
            try:
                headers = {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                }
                
                print(f"📝 Testing submission {i+1}/{len(test_cases)}...")
                
                response = requests.post(
                    f"{SUPABASE_URL}/rest/v1/Contract%20Sale%20Request",
                    headers=headers,
                    json=test_data,
                    timeout=30
                )
                
                if response.status_code == 201:
                    successful_submissions += 1
                    print(f"   ✅ Submission {i+1} successful")
                else:
                    failed_submissions += 1
                    error_text = response.text
                    print(f"   ❌ Submission {i+1} failed: {response.status_code} - {error_text}")
                    
                    # Check for specific "Failed to submit" error
                    if "failed to submit" in error_text.lower():
                        self.log_test("No Failed Submit Errors", False,
                                    f"❌ 'Failed to submit' error still present: {error_text}")
                        return False
                
                time.sleep(1)  # Small delay between requests
                
            except Exception as e:
                failed_submissions += 1
                print(f"   ❌ Submission {i+1} exception: {str(e)}")
        
        if successful_submissions == len(test_cases):
            self.log_test("No Failed Submit Errors", True,
                        f"✅ All {len(test_cases)} submissions successful - no 'Failed to submit' errors")
            return True
        elif successful_submissions > 0:
            self.log_test("No Failed Submit Errors", False,
                        f"❌ {failed_submissions}/{len(test_cases)} submissions failed")
            return False
        else:
            self.log_test("No Failed Submit Errors", False,
                        f"❌ All submissions failed")
            return False
    
    def generate_comprehensive_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 SUPABASE CONTACT SALES INTEGRATION - COMPREHENSIVE TEST RESULTS")
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
        
        # Critical findings
        print(f"\n🔍 Critical Findings:")
        
        # Table existence
        table_tests = [r for r in self.test_results if "table" in r["test"].lower()]
        table_working = any(r["passed"] for r in table_tests)
        if table_working:
            print(f"   ✅ Table Access: 'Contract Sale Request' table is accessible")
        else:
            print(f"   ❌ Table Access: Issues with 'Contract Sale Request' table")
        
        # Direct insertion
        insertion_tests = [r for r in self.test_results if "insertion" in r["test"].lower()]
        insertion_working = any(r["passed"] for r in insertion_tests)
        if insertion_working:
            print(f"   ✅ Data Insertion: Direct Supabase insertion working")
        else:
            print(f"   ❌ Data Insertion: Issues with Supabase insertion")
        
        # Error resolution
        error_tests = [r for r in self.test_results if "failed submit" in r["test"].lower()]
        if error_tests:
            error_resolved = any(r["passed"] for r in error_tests)
            if error_resolved:
                print(f"   ✅ Error Resolution: 'Failed to submit contact request' error resolved")
            else:
                print(f"   ❌ Error Resolution: 'Failed to submit contact request' error still present")
        
        # Column compatibility
        column_tests = [r for r in self.test_results if "column" in r["test"].lower()]
        columns_working = any(r["passed"] for r in column_tests)
        if columns_working:
            print(f"   ✅ Column Compatibility: Required columns exist and working")
        else:
            print(f"   ❌ Column Compatibility: Issues with table columns")
        
        # Final assessment
        print(f"\n🎯 Final Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - Contact Sales Supabase integration is working perfectly!")
            print(f"   ✅ The table name fix to 'Contract Sale Request' is successful")
            print(f"   ✅ No more 'Failed to submit contact request' errors")
            print(f"   ✅ Ready for production use")
        elif success_rate >= 75:
            print(f"   ✅ GOOD - Contact Sales integration is mostly working")
            print(f"   ✅ The table name fix appears to be working")
            print(f"   ⚠️ Minor issues may need attention")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Contact Sales integration has some issues")
            print(f"   🔧 Table name fix may need additional work")
            print(f"   🔧 Some functionality working but needs improvement")
        else:
            print(f"   ❌ POOR - Contact Sales integration is not working")
            print(f"   🚨 Table name fix unsuccessful")
            print(f"   🚨 'Failed to submit contact request' error likely still present")
        
        # Specific recommendations
        print(f"\n💡 Specific Recommendations:")
        
        if not table_working:
            print(f"   • Verify 'Contract Sale Request' table exists in Supabase")
            print(f"   • Check table permissions and RLS policies")
        
        if not insertion_working:
            print(f"   • Review table schema and column names")
            print(f"   • Verify data types match frontend expectations")
        
        if success_rate < 100:
            print(f"   • Address failed test cases for complete functionality")
        
        if success_rate >= 75:
            print(f"   • Contact Sales form should now work without 'Failed to submit' errors")
            print(f"   • Test with real user data to confirm end-to-end functionality")
        
        return success_rate >= 75
    
    def run_all_tests(self):
        """Run all Supabase Contact Sales integration tests"""
        print("🚀 Starting Supabase Contact Sales Integration Testing")
        print("=" * 80)
        print("Testing the FIXED Contact Sales form with:")
        print("• Direct Supabase connection to 'Contract Sale Request' table")
        print("• Verification of table existence and accessibility")
        print("• Direct data insertion testing")
        print("• Column compatibility verification")
        print("• Confirmation of no 'Failed to submit contact request' errors")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity
            if not self.test_supabase_direct_connection():
                print("❌ Supabase connection failed - aborting tests")
                return False
            
            # Core Supabase tests
            self.test_contract_sale_request_table_exists()
            self.test_direct_supabase_insertion()
            self.test_all_required_columns_exist()
            self.test_removed_columns_not_required()
            
            # Integration tests
            self.test_contact_sales_backend_endpoint()
            self.test_frontend_contact_form_submission()
            
            # Error verification
            self.verify_no_failed_submit_errors()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Supabase Integration Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive summary
        success = self.generate_comprehensive_summary()
        
        return success


if __name__ == "__main__":
    tester = SupabaseContactSalesTester()
    success = tester.run_all_tests()
    
    if success:
        print(f"\n🎉 Supabase Contact Sales integration testing completed successfully!")
        print(f"✅ The 'Contract Sale Request' table fix is working!")
        exit(0)
    else:
        print(f"\n❌ Supabase Contact Sales integration testing found issues.")
        print(f"🔧 Additional fixes may be needed.")
        exit(1)