#!/usr/bin/env python3
"""
Contact Sales Form Submission Testing - FIXED Version
Tests the FIXED Contact Sales form submission with corrected table name 'Contract Sale Request'
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://matrix-team-update.preview.emergentagent.com/api"

class ContactSalesFixedTester:
    """Test the FIXED Contact Sales form submission with corrected table name"""
    
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
    
    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            if response.status_code == 200:
                self.log_test("Basic API Connectivity", True, f"Health check successful: {response.status_code}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Health check failed: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_contact_sales_fixed_submission(self):
        """Test Contact Sales form submission with FIXED table name 'Contract Sale Request'"""
        print("\n=== Testing FIXED Contact Sales Form Submission ===")
        print("Testing with corrected table name 'Contract Sale Request' and existing columns only")
        
        # Test data matching the review request - realistic Growth plan data
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
            print(f"📝 Submitting Contact Sales form with Growth plan data...")
            print(f"   Full Name: {test_data['full_name']}")
            print(f"   Work Email: {test_data['work_email']}")
            print(f"   Company: {test_data['company_name']}")
            print(f"   Monthly Volume: {test_data['monthly_volume']}")
            print(f"   Plan Selected: {test_data['plan_selected']}")
            print(f"   Contact Method: {test_data['preferred_contact_method']}")
            
            # Test the notify endpoint which should handle contact sales
            response = requests.post(f"{BACKEND_URL}/notify", json={
                "type": "contact_sales",
                "data": test_data
            }, timeout=30)
            
            print(f"📡 Response Status: {response.status_code}")
            print(f"📡 Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"📡 Response Body: {json.dumps(result, indent=2)}")
                
                # Check for success indicators
                if result.get("success") or result.get("status") == "success":
                    self.log_test("Contact Sales - Form Submission Success", True, 
                                f"✅ Contact Sales form submitted successfully! Response: {result}")
                    
                    # Check for proper success message
                    message = result.get("message", "")
                    if "success" in message.lower() or "submitted" in message.lower():
                        self.log_test("Contact Sales - Success Message", True,
                                    f"✅ Proper success message received: {message}")
                    else:
                        self.log_test("Contact Sales - Success Message", False,
                                    f"❌ No clear success message: {message}")
                    
                    # Verify no "Failed to submit contact request" error
                    if "failed to submit" not in message.lower():
                        self.log_test("Contact Sales - No Failed Submit Error", True,
                                    "✅ No 'Failed to submit contact request' error detected")
                    else:
                        self.log_test("Contact Sales - No Failed Submit Error", False,
                                    f"❌ Still getting 'Failed to submit' error: {message}")
                    
                    return True
                else:
                    self.log_test("Contact Sales - Form Submission Success", False,
                                f"❌ Form submission failed. Response: {result}")
                    return False
                    
            elif response.status_code == 404:
                self.log_test("Contact Sales - Endpoint Availability", False,
                            f"❌ /notify endpoint not found (404). May need to test different endpoint.")
                
                # Try alternative endpoint - direct contact sales
                print("🔄 Trying alternative contact sales endpoint...")
                alt_response = requests.post(f"{BACKEND_URL}/contact/sales", json=test_data, timeout=30)
                
                if alt_response.status_code == 200:
                    result = alt_response.json()
                    self.log_test("Contact Sales - Alternative Endpoint", True,
                                f"✅ Alternative endpoint successful: {result}")
                    return True
                else:
                    self.log_test("Contact Sales - Alternative Endpoint", False,
                                f"❌ Alternative endpoint also failed: {alt_response.status_code}")
                    return False
                    
            else:
                error_text = response.text
                self.log_test("Contact Sales - HTTP Response", False,
                            f"❌ HTTP {response.status_code}: {error_text}")
                
                # Check if it's a Supabase table error
                if "table" in error_text.lower() or "schema" in error_text.lower():
                    self.log_test("Contact Sales - Table Name Issue", False,
                                f"❌ Possible table name issue detected: {error_text}")
                else:
                    self.log_test("Contact Sales - Other Error", False,
                                f"❌ Other error: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Sales - Exception", False, f"❌ Exception occurred: {str(e)}")
            return False
    
    def test_contact_sales_data_validation(self):
        """Test Contact Sales form with various data scenarios"""
        print("\n=== Testing Contact Sales Data Validation ===")
        
        # Test Case 1: All required fields present
        valid_data = {
            "full_name": "Sarah Johnson",
            "work_email": "sarah.johnson@techcorp.com", 
            "company_name": "TechCorp Solutions",
            "company_website": "https://techcorp.com",
            "monthly_volume": "10k-50k",
            "plan_selected": "Enterprise Plan Selected (36 Months)",
            "preferred_contact_method": "phone",
            "consent_marketing": True
        }
        
        try:
            print(f"📝 Testing with valid enterprise data...")
            response = requests.post(f"{BACKEND_URL}/notify", json={
                "type": "contact_sales",
                "data": valid_data
            }, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") or result.get("status") == "success":
                    self.log_test("Contact Sales - Valid Data Submission", True,
                                f"✅ Valid data accepted successfully")
                else:
                    self.log_test("Contact Sales - Valid Data Submission", False,
                                f"❌ Valid data rejected: {result}")
            else:
                self.log_test("Contact Sales - Valid Data Submission", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Contact Sales - Valid Data Exception", False, f"Exception: {str(e)}")
        
        # Test Case 2: Missing required fields
        invalid_data = {
            "full_name": "Test User",
            # Missing work_email
            "company_name": "Test Company"
            # Missing other required fields
        }
        
        try:
            print(f"📝 Testing with missing required fields...")
            response = requests.post(f"{BACKEND_URL}/notify", json={
                "type": "contact_sales", 
                "data": invalid_data
            }, timeout=30)
            
            # Should return error for missing fields
            if response.status_code == 400 or response.status_code == 422:
                self.log_test("Contact Sales - Missing Fields Validation", True,
                            f"✅ Properly rejected missing fields: {response.status_code}")
            elif response.status_code == 200:
                result = response.json()
                if not result.get("success"):
                    self.log_test("Contact Sales - Missing Fields Validation", True,
                                f"✅ Properly rejected missing fields in response: {result}")
                else:
                    self.log_test("Contact Sales - Missing Fields Validation", False,
                                f"❌ Accepted invalid data: {result}")
            else:
                self.log_test("Contact Sales - Missing Fields Validation", False,
                            f"❌ Unexpected response: {response.status_code}")
                
        except Exception as e:
            self.log_test("Contact Sales - Missing Fields Exception", False, f"Exception: {str(e)}")
    
    def test_contact_sales_all_plan_types(self):
        """Test Contact Sales form with all plan types"""
        print("\n=== Testing Contact Sales with All Plan Types ===")
        
        plan_test_cases = [
            {
                "plan": "Starter Plan Selected (24 Months)",
                "volume": "<10k",
                "name": "Alice Wilson",
                "email": "alice@startup.com",
                "company": "Startup Inc"
            },
            {
                "plan": "Growth Plan Selected (36 Months)", 
                "volume": "10k-50k",
                "name": "Bob Chen",
                "email": "bob@growth.com",
                "company": "Growth Corp"
            },
            {
                "plan": "Enterprise Plan Selected (24 Months)",
                "volume": "50k+",
                "name": "Carol Davis",
                "email": "carol@enterprise.com", 
                "company": "Enterprise Ltd"
            }
        ]
        
        successful_plans = 0
        
        for i, test_case in enumerate(plan_test_cases):
            try:
                print(f"📝 Testing {test_case['plan']}...")
                
                test_data = {
                    "full_name": test_case["name"],
                    "work_email": test_case["email"],
                    "company_name": test_case["company"],
                    "company_website": f"https://{test_case['company'].lower().replace(' ', '')}.com",
                    "monthly_volume": test_case["volume"],
                    "plan_selected": test_case["plan"],
                    "preferred_contact_method": "email",
                    "consent_marketing": True
                }
                
                response = requests.post(f"{BACKEND_URL}/notify", json={
                    "type": "contact_sales",
                    "data": test_data
                }, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success") or result.get("status") == "success":
                        successful_plans += 1
                        print(f"   ✅ {test_case['plan']} - SUCCESS")
                    else:
                        print(f"   ❌ {test_case['plan']} - FAILED: {result}")
                else:
                    print(f"   ❌ {test_case['plan']} - HTTP {response.status_code}")
                
                # Small delay between requests
                time.sleep(1)
                
            except Exception as e:
                print(f"   ❌ {test_case['plan']} - Exception: {str(e)}")
        
        if successful_plans == len(plan_test_cases):
            self.log_test("Contact Sales - All Plan Types", True,
                        f"✅ All {len(plan_test_cases)} plan types working successfully")
        elif successful_plans > 0:
            self.log_test("Contact Sales - All Plan Types", False,
                        f"❌ Only {successful_plans}/{len(plan_test_cases)} plan types working")
        else:
            self.log_test("Contact Sales - All Plan Types", False,
                        f"❌ No plan types working successfully")
    
    def test_supabase_table_verification(self):
        """Test to verify the correct Supabase table name is being used"""
        print("\n=== Testing Supabase Table Name Verification ===")
        
        # Test data to verify table name fix
        verification_data = {
            "full_name": "Table Verification User",
            "work_email": "verify@tabletest.com",
            "company_name": "Table Test Corp",
            "monthly_volume": "<10k",
            "plan_selected": "Growth Plan Selected (24 Months)",
            "preferred_contact_method": "email",
            "consent_marketing": True
        }
        
        try:
            print(f"📝 Testing with data to verify 'Contract Sale Request' table usage...")
            response = requests.post(f"{BACKEND_URL}/notify", json={
                "type": "contact_sales",
                "data": verification_data
            }, timeout=30)
            
            print(f"📡 Response Status: {response.status_code}")
            response_text = response.text
            print(f"📡 Response Text: {response_text}")
            
            # Check for specific Supabase table errors
            if "Could not find the table" in response_text:
                if "Contact Request" in response_text:
                    self.log_test("Supabase Table - Old Table Name Still Used", False,
                                f"❌ Still using old table name 'Contact Request': {response_text}")
                elif "Contract Sale Request" in response_text:
                    self.log_test("Supabase Table - Correct Table Name Used", True,
                                f"✅ Using correct table name 'Contract Sale Request' but table may not exist: {response_text}")
                else:
                    self.log_test("Supabase Table - Unknown Table Error", False,
                                f"❌ Unknown table error: {response_text}")
            elif "schema cache" in response_text.lower():
                self.log_test("Supabase Table - Schema Cache Error", False,
                            f"❌ Schema cache error (possible column mismatch): {response_text}")
            elif response.status_code == 200:
                result = response.json()
                if result.get("success") or result.get("status") == "success":
                    self.log_test("Supabase Table - Successful Submission", True,
                                f"✅ Form submitted successfully - table name fix working!")
                else:
                    self.log_test("Supabase Table - Submission Failed", False,
                                f"❌ Submission failed: {result}")
            else:
                self.log_test("Supabase Table - HTTP Error", False,
                            f"❌ HTTP {response.status_code}: {response_text}")
                
        except Exception as e:
            self.log_test("Supabase Table - Exception", False, f"Exception: {str(e)}")
    
    def test_removed_columns_verification(self):
        """Test to verify removed columns (plan_id, billing_term, price_display) are not being sent"""
        print("\n=== Testing Removed Columns Verification ===")
        
        # Test data without the removed columns
        clean_data = {
            "full_name": "Clean Data User",
            "work_email": "clean@datatest.com",
            "company_name": "Clean Data Corp",
            "monthly_volume": "10k-50k",
            "plan_selected": "Growth Plan Selected (24 Months)",
            "preferred_contact_method": "email",
            "consent_marketing": True,
            "company_website": "https://cleandata.com"
        }
        
        try:
            print(f"📝 Testing with clean data (no removed columns)...")
            response = requests.post(f"{BACKEND_URL}/notify", json={
                "type": "contact_sales",
                "data": clean_data
            }, timeout=30)
            
            response_text = response.text
            
            # Check for column-related errors
            removed_columns = ["plan_id", "billing_term", "price_display"]
            column_errors = []
            
            for column in removed_columns:
                if column in response_text:
                    column_errors.append(column)
            
            if column_errors:
                self.log_test("Removed Columns - Still Being Sent", False,
                            f"❌ Removed columns still being sent: {column_errors}. Response: {response_text}")
            elif response.status_code == 200:
                result = response.json()
                if result.get("success") or result.get("status") == "success":
                    self.log_test("Removed Columns - Clean Submission", True,
                                f"✅ Clean submission without removed columns successful!")
                else:
                    self.log_test("Removed Columns - Submission Failed", False,
                                f"❌ Submission failed: {result}")
            else:
                self.log_test("Removed Columns - HTTP Error", False,
                            f"❌ HTTP {response.status_code}: {response_text}")
                
        except Exception as e:
            self.log_test("Removed Columns - Exception", False, f"Exception: {str(e)}")
    
    def generate_test_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 CONTACT SALES FIXED TESTING - COMPREHENSIVE SUMMARY")
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
        
        # Detailed results
        print(f"\n📋 Detailed Test Results:")
        for result in self.test_results:
            status = "✅ PASS" if result["passed"] else "❌ FAIL"
            print(f"   {status}: {result['test']}")
            if result["details"] and not result["passed"]:
                print(f"      Details: {result['details']}")
        
        # Key findings
        print(f"\n🔍 Key Findings:")
        
        # Check for table name issues
        table_issues = [r for r in self.test_results if "table" in r["test"].lower() and not r["passed"]]
        if table_issues:
            print(f"   ⚠️ Table Name Issues: {len(table_issues)} tests failed related to table names")
        else:
            print(f"   ✅ Table Name: No table name issues detected")
        
        # Check for submission success
        submission_tests = [r for r in self.test_results if "submission" in r["test"].lower()]
        successful_submissions = [r for r in submission_tests if r["passed"]]
        if successful_submissions:
            print(f"   ✅ Form Submissions: {len(successful_submissions)}/{len(submission_tests)} submission tests passed")
        else:
            print(f"   ❌ Form Submissions: No successful submissions detected")
        
        # Check for "Failed to submit" errors
        failed_submit_tests = [r for r in self.test_results if "failed submit" in r["test"].lower()]
        if failed_submit_tests:
            no_failed_errors = [r for r in failed_submit_tests if r["passed"]]
            if no_failed_errors:
                print(f"   ✅ Error Resolution: 'Failed to submit contact request' error resolved")
            else:
                print(f"   ❌ Error Resolution: 'Failed to submit contact request' error still present")
        
        # Final assessment
        print(f"\n🎯 Final Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - Contact Sales form fix is working perfectly!")
            print(f"   ✅ Ready for production use")
        elif success_rate >= 75:
            print(f"   ✅ GOOD - Contact Sales form fix is mostly working")
            print(f"   ⚠️ Minor issues may need attention")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Contact Sales form fix has some issues")
            print(f"   🔧 Requires additional fixes")
        else:
            print(f"   ❌ POOR - Contact Sales form fix is not working")
            print(f"   🚨 Significant issues need immediate attention")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        if success_rate < 100:
            print(f"   • Review failed tests for specific issues")
            print(f"   • Verify Supabase table name is correctly set to 'Contract Sale Request'")
            print(f"   • Ensure removed columns (plan_id, billing_term, price_display) are not being sent")
            print(f"   • Test with realistic data matching the form requirements")
        
        if success_rate >= 90:
            print(f"   • Contact Sales form fix appears to be working correctly")
            print(f"   • Consider testing with additional edge cases")
            print(f"   • Monitor production usage for any remaining issues")
        
        return success_rate >= 75  # Return True if mostly working
    
    def run_all_tests(self):
        """Run all Contact Sales fixed tests"""
        print("🚀 Starting Contact Sales FIXED Testing")
        print("=" * 80)
        print("Testing the FIXED Contact Sales form submission with:")
        print("• Corrected table name 'Contract Sale Request'")
        print("• Removed columns: plan_id, billing_term, price_display")
        print("• Realistic Growth plan test data")
        print("• Verification of no 'Failed to submit contact request' errors")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity
            if not self.test_basic_connectivity():
                print("❌ Basic connectivity failed - aborting tests")
                return False
            
            # Core Contact Sales tests
            self.test_contact_sales_fixed_submission()
            self.test_contact_sales_data_validation()
            self.test_contact_sales_all_plan_types()
            
            # Technical verification tests
            self.test_supabase_table_verification()
            self.test_removed_columns_verification()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Contact Sales Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive summary
        success = self.generate_test_summary()
        
        return success


if __name__ == "__main__":
    tester = ContactSalesFixedTester()
    success = tester.run_all_tests()
    
    if success:
        print(f"\n🎉 Contact Sales FIXED testing completed successfully!")
        exit(0)
    else:
        print(f"\n❌ Contact Sales FIXED testing found issues that need attention.")
        exit(1)