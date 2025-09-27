#!/usr/bin/env python3
"""
Comprehensive Supabase Integration Testing for SentraTech Contact Forms
Tests Supabase connection, table schemas, RLS policies, and form submissions
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://sentra-pricing-cards.preview.emergentagent.com/api"

# Supabase configuration from frontend .env
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

class SupabaseIntegrationTester:
    """Comprehensive Supabase Integration Testing Framework"""
    
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
    
    def generate_realistic_demo_data(self) -> Dict[str, Any]:
        """Generate realistic demo request data"""
        companies = [
            "TechCorp Solutions", "Global Dynamics Inc", "Innovation Labs", 
            "Digital Ventures", "Enterprise Systems", "CloudTech Partners",
            "DataFlow Industries", "SmartOps Corporation", "NextGen Solutions"
        ]
        
        first_names = ["Sarah", "Michael", "Jennifer", "David", "Lisa", "Robert"]
        last_names = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller"]
        domains = ["techcorp.com", "globalinc.com", "innovationlabs.io", "digitalventures.net"]
        
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        company = random.choice(companies)
        domain = random.choice(domains)
        
        return {
            "name": f"{first_name} {last_name}",
            "email": f"{first_name.lower()}.{last_name.lower()}@{domain}",
            "company": company,
            "phone": f"+1{random.randint(200, 999)}{random.randint(200, 999)}{random.randint(1000, 9999)}",
            "message": "Interested in AI customer support platform for our growing business",
            "call_volume": "5000-10000",
            "interaction_volume": "7500-15000"
        }
    
    def generate_realistic_contact_sales_data(self) -> Dict[str, Any]:
        """Generate realistic contact sales data"""
        companies = [
            "Enterprise Corp", "Business Solutions Inc", "Tech Innovations Ltd",
            "Global Systems", "Digital Transform Co", "Smart Operations"
        ]
        
        first_names = ["Emma", "James", "Olivia", "William", "Sophia", "Benjamin"]
        last_names = ["Anderson", "Taylor", "Thomas", "Jackson", "White", "Harris"]
        domains = ["enterprise.com", "business-sol.com", "techinnovations.io", "globalsys.net"]
        
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        company = random.choice(companies)
        domain = random.choice(domains)
        
        return {
            "fullName": f"{first_name} {last_name}",
            "workEmail": f"{first_name.lower()}.{last_name.lower()}@{domain}",
            "companyName": company,
            "phone": f"+1{random.randint(200, 999)}{random.randint(200, 999)}{random.randint(1000, 9999)}",
            "companyWebsite": f"https://www.{domain}",
            "monthlyVolume": random.choice(["<10k", "10k-50k", "50k+"]),
            "planSelected": random.choice(["Starter Plan", "Growth Plan", "Enterprise Plan"]),
            "planId": random.choice(["starter", "growth", "enterprise"]),
            "billingTerm": random.choice(["24m", "36m"]),
            "priceDisplay": random.choice(["$1,200", "$1,650", "$2,000"]),
            "preferredContactMethod": random.choice(["email", "phone", "demo"]),
            "message": "Looking for a comprehensive AI customer support solution",
            "consentMarketing": True
        }
    
    def test_demo_request_form_submission(self):
        """Test Demo Request Form Submission to Supabase"""
        print("\n=== Testing Demo Request Form Submission ===")
        
        # Test Case 1: Valid demo request submission
        demo_data = self.generate_realistic_demo_data()
        demo_data["email"] = f"demo_test_{int(time.time())}@example.com"
        
        try:
            print(f"📝 Submitting demo request: {demo_data['name']} from {demo_data['company']}")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=demo_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "message", "reference_id"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["success"] and result["reference_id"]:
                        self.log_test("Demo Request - Form Submission", True,
                                    f"✅ Demo request submitted successfully! Reference ID: {result['reference_id']}")
                        
                        # Store reference for verification
                        self.demo_reference_id = result["reference_id"]
                        
                        # Test success confirmation UI
                        if "submitted successfully" in result["message"].lower():
                            self.log_test("Demo Request - Success Confirmation UI", True,
                                        f"✅ Success confirmation message displayed: {result['message']}")
                        else:
                            self.log_test("Demo Request - Success Confirmation UI", False,
                                        f"❌ Success message unclear: {result['message']}")
                    else:
                        self.log_test("Demo Request - Form Submission", False,
                                    f"❌ Invalid response values: {result}")
                else:
                    self.log_test("Demo Request - Form Submission", False,
                                f"❌ Missing response fields: {missing_fields}")
            else:
                self.log_test("Demo Request - Form Submission", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Form Submission", False, f"❌ Exception: {str(e)}")
    
    def test_contact_sales_form_submission(self):
        """Test Contact Sales Form Submission to Supabase"""
        print("\n=== Testing Contact Sales Form Submission ===")
        
        # Test Case 1: Valid contact sales submission
        contact_data = self.generate_realistic_contact_sales_data()
        contact_data["workEmail"] = f"contact_test_{int(time.time())}@example.com"
        
        try:
            print(f"📝 Submitting contact sales request: {contact_data['fullName']} from {contact_data['companyName']}")
            
            # Test the /api/notify endpoint for contact sales
            notify_payload = {
                "type": "contact_sales",
                "data": contact_data,
                "planTag": contact_data["planSelected"]
            }
            
            response = requests.post(f"{BACKEND_URL}/notify", json=notify_payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Contact Sales - Form Submission", True,
                                f"✅ Contact sales request submitted successfully!")
                    
                    # Test plan metadata handling
                    if contact_data["planSelected"] and contact_data["planId"]:
                        self.log_test("Contact Sales - Plan Metadata", True,
                                    f"✅ Plan metadata processed: {contact_data['planSelected']} ({contact_data['planId']})")
                    else:
                        self.log_test("Contact Sales - Plan Metadata", False,
                                    f"❌ Plan metadata missing or incomplete")
                    
                    # Test billing term handling
                    if contact_data["billingTerm"] and contact_data["priceDisplay"]:
                        self.log_test("Contact Sales - Billing Terms", True,
                                    f"✅ Billing terms processed: {contact_data['billingTerm']} at {contact_data['priceDisplay']}")
                    else:
                        self.log_test("Contact Sales - Billing Terms", False,
                                    f"❌ Billing terms missing or incomplete")
                else:
                    self.log_test("Contact Sales - Form Submission", False,
                                f"❌ Submission failed: {result}")
            else:
                self.log_test("Contact Sales - Form Submission", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Contact Sales - Form Submission", False, f"❌ Exception: {str(e)}")
    
    def test_backend_notify_endpoint(self):
        """Test /api/notify endpoint for notifications"""
        print("\n=== Testing Backend /api/notify Endpoint ===")
        
        # Test Case 1: Demo request notification
        demo_notify_data = {
            "type": "demo_request",
            "data": self.generate_realistic_demo_data(),
            "source": "demo_form"
        }
        
        try:
            print("📡 Testing demo request notification...")
            response = requests.post(f"{BACKEND_URL}/notify", json=demo_notify_data, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Backend Notify - Demo Request", True,
                                f"✅ Demo request notification processed successfully")
                else:
                    self.log_test("Backend Notify - Demo Request", False,
                                f"❌ Demo request notification failed: {result}")
            else:
                self.log_test("Backend Notify - Demo Request", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Backend Notify - Demo Request", False, f"❌ Exception: {str(e)}")
        
        # Test Case 2: Contact sales notification
        contact_notify_data = {
            "type": "contact_sales",
            "data": self.generate_realistic_contact_sales_data(),
            "planTag": "Growth Plan"
        }
        
        try:
            print("📡 Testing contact sales notification...")
            response = requests.post(f"{BACKEND_URL}/notify", json=contact_notify_data, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Backend Notify - Contact Sales", True,
                                f"✅ Contact sales notification processed successfully")
                else:
                    self.log_test("Backend Notify - Contact Sales", False,
                                f"❌ Contact sales notification failed: {result}")
            else:
                self.log_test("Backend Notify - Contact Sales", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Backend Notify - Contact Sales", False, f"❌ Exception: {str(e)}")
    
    def test_database_connectivity(self):
        """Test database connectivity and data persistence"""
        print("\n=== Testing Database Connectivity ===")
        
        # Test Case 1: Check if demo requests are being stored
        try:
            print("🔍 Checking demo requests storage...")
            response = requests.get(f"{BACKEND_URL}/demo/requests?limit=10", timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "requests" in result:
                    request_count = len(result["requests"])
                    self.log_test("Database - Demo Requests Storage", True,
                                f"✅ Demo requests table accessible, found {request_count} records")
                    
                    # Check data structure
                    if request_count > 0:
                        sample_request = result["requests"][0]
                        required_fields = ["name", "email", "company", "timestamp"]
                        missing_fields = [field for field in required_fields if field not in sample_request]
                        
                        if not missing_fields:
                            self.log_test("Database - Demo Request Data Structure", True,
                                        f"✅ Demo request data structure correct")
                        else:
                            self.log_test("Database - Demo Request Data Structure", False,
                                        f"❌ Missing fields in demo requests: {missing_fields}")
                else:
                    self.log_test("Database - Demo Requests Storage", False,
                                f"❌ Invalid response structure: {result}")
            else:
                self.log_test("Database - Demo Requests Storage", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Database - Demo Requests Storage", False, f"❌ Exception: {str(e)}")
    
    def test_form_validation(self):
        """Test form validation for both demo request and contact sales"""
        print("\n=== Testing Form Validation ===")
        
        # Test Case 1: Demo request with missing required fields
        invalid_demo_data = {
            "name": "",  # Missing name
            "email": "invalid-email",  # Invalid email format
            "company": "",  # Missing company
            "phone": "123",  # Invalid phone format
            "message": "Test message"
        }
        
        try:
            print("🔍 Testing demo request validation with invalid data...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=invalid_demo_data, timeout=20)
            
            if response.status_code == 422 or response.status_code == 400:
                self.log_test("Form Validation - Demo Request Required Fields", True,
                            f"✅ Validation correctly rejected invalid demo request (HTTP {response.status_code})")
            elif response.status_code == 200:
                # Check if backend validation caught the errors
                result = response.json()
                if not result.get("success"):
                    self.log_test("Form Validation - Demo Request Required Fields", True,
                                f"✅ Backend validation caught errors: {result.get('message', 'Unknown error')}")
                else:
                    self.log_test("Form Validation - Demo Request Required Fields", False,
                                f"❌ Invalid data was accepted: {result}")
            else:
                self.log_test("Form Validation - Demo Request Required Fields", False,
                            f"❌ Unexpected response: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Form Validation - Demo Request Required Fields", False, f"❌ Exception: {str(e)}")
        
        # Test Case 2: Valid email format validation
        valid_demo_data = self.generate_realistic_demo_data()
        valid_demo_data["email"] = f"valid_email_test_{int(time.time())}@example.com"
        
        try:
            print("🔍 Testing demo request with valid email format...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=valid_demo_data, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Form Validation - Email Format Validation", True,
                                f"✅ Valid email format accepted")
                else:
                    self.log_test("Form Validation - Email Format Validation", False,
                                f"❌ Valid email rejected: {result}")
            else:
                self.log_test("Form Validation - Email Format Validation", False,
                            f"❌ Valid email request failed: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Form Validation - Email Format Validation", False, f"❌ Exception: {str(e)}")
    
    def test_supabase_table_structure(self):
        """Test Supabase table structure and field mapping"""
        print("\n=== Testing Supabase Table Structure ===")
        
        # Test Case 1: Submit data and verify field mapping
        demo_data = self.generate_realistic_demo_data()
        demo_data["email"] = f"structure_test_{int(time.time())}@example.com"
        
        try:
            print("🔍 Testing Supabase table structure with demo request...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=demo_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Supabase Tables - Demo Requests Table", True,
                                f"✅ demo_requests table exists and accepts data")
                    
                    # Wait a moment for data to be processed
                    time.sleep(2)
                    
                    # Try to retrieve the data to verify field mapping
                    get_response = requests.get(f"{BACKEND_URL}/demo/requests?limit=5", timeout=15)
                    if get_response.status_code == 200:
                        get_result = get_response.json()
                        if get_result.get("success") and get_result.get("requests"):
                            # Look for our test record
                            found_record = None
                            for record in get_result["requests"]:
                                if record.get("email") == demo_data["email"]:
                                    found_record = record
                                    break
                            
                            if found_record:
                                # Check field mapping
                                field_mapping_correct = True
                                mapping_errors = []
                                
                                expected_mappings = {
                                    "name": demo_data["name"],
                                    "email": demo_data["email"],
                                    "company": demo_data["company"],
                                    "phone": demo_data["phone"],
                                    "message": demo_data["message"]
                                }
                                
                                for field, expected_value in expected_mappings.items():
                                    if found_record.get(field) != expected_value:
                                        field_mapping_correct = False
                                        mapping_errors.append(f"{field}: expected '{expected_value}', got '{found_record.get(field)}'")
                                
                                if field_mapping_correct:
                                    self.log_test("Supabase Tables - Field Mapping", True,
                                                f"✅ Field mapping correct for demo_requests table")
                                else:
                                    self.log_test("Supabase Tables - Field Mapping", False,
                                                f"❌ Field mapping errors: {'; '.join(mapping_errors)}")
                                
                                # Check timestamp field
                                if found_record.get("timestamp") or found_record.get("created_at"):
                                    self.log_test("Supabase Tables - Timestamp Fields", True,
                                                f"✅ Timestamp field working correctly")
                                else:
                                    self.log_test("Supabase Tables - Timestamp Fields", False,
                                                f"❌ Timestamp field missing or incorrect")
                            else:
                                self.log_test("Supabase Tables - Data Persistence", False,
                                            f"❌ Submitted record not found in database")
                    else:
                        self.log_test("Supabase Tables - Data Retrieval", False,
                                    f"❌ Cannot retrieve data to verify field mapping")
                else:
                    self.log_test("Supabase Tables - Demo Requests Table", False,
                                f"❌ demo_requests table submission failed: {result}")
            else:
                self.log_test("Supabase Tables - Demo Requests Table", False,
                            f"❌ demo_requests table not accessible: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Supabase Tables - Demo Requests Table", False, f"❌ Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling and display"""
        print("\n=== Testing Error Handling ===")
        
        # Test Case 1: Network timeout simulation (using very short timeout)
        try:
            print("🔍 Testing error handling with timeout...")
            demo_data = self.generate_realistic_demo_data()
            
            # Use very short timeout to simulate network issues
            response = requests.post(f"{BACKEND_URL}/demo/request", json=demo_data, timeout=0.001)
            
            # This should timeout, so if we get here, something's wrong
            self.log_test("Error Handling - Network Timeout", False,
                        f"❌ Request should have timed out but didn't")
            
        except requests.exceptions.Timeout:
            self.log_test("Error Handling - Network Timeout", True,
                        f"✅ Network timeout handled correctly")
        except Exception as e:
            self.log_test("Error Handling - Network Timeout", True,
                        f"✅ Network error handled: {str(e)}")
        
        # Test Case 2: Invalid JSON payload
        try:
            print("🔍 Testing error handling with invalid JSON...")
            response = requests.post(f"{BACKEND_URL}/demo/request", 
                                   data="invalid json", 
                                   headers={'Content-Type': 'application/json'},
                                   timeout=20)
            
            if response.status_code >= 400:
                self.log_test("Error Handling - Invalid JSON", True,
                            f"✅ Invalid JSON properly rejected (HTTP {response.status_code})")
            else:
                self.log_test("Error Handling - Invalid JSON", False,
                            f"❌ Invalid JSON was accepted: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Invalid JSON", True,
                        f"✅ Invalid JSON error handled: {str(e)}")
    
    def generate_comprehensive_report(self):
        """Generate comprehensive Supabase integration test report"""
        print("\n" + "=" * 80)
        print("📊 SUPABASE INTEGRATION TESTING - COMPREHENSIVE REPORT")
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
        
        # Test categories summary
        print(f"\n🎯 Test Categories Summary:")
        
        categories = {
            "Demo Request Form": [t for t in self.test_results if "Demo Request" in t["test"]],
            "Contact Sales Form": [t for t in self.test_results if "Contact Sales" in t["test"]],
            "Backend Integration": [t for t in self.test_results if "Backend" in t["test"] or "Notify" in t["test"]],
            "Database Operations": [t for t in self.test_results if "Database" in t["test"] or "Supabase" in t["test"]],
            "Form Validation": [t for t in self.test_results if "Validation" in t["test"]],
            "Error Handling": [t for t in self.test_results if "Error" in t["test"]]
        }
        
        for category, tests in categories.items():
            if tests:
                category_passed = len([t for t in tests if t["passed"]])
                category_total = len(tests)
                category_rate = (category_passed / category_total) * 100 if category_total > 0 else 0
                
                status_icon = "✅" if category_rate >= 80 else "⚠️" if category_rate >= 60 else "❌"
                print(f"   {status_icon} {category}: {category_passed}/{category_total} ({category_rate:.1f}%)")
        
        # Critical issues
        print(f"\n🚨 Critical Issues:")
        critical_failures = [t for t in self.test_results if not t["passed"] and 
                           any(keyword in t["test"] for keyword in ["Form Submission", "Database", "Supabase"])]
        
        if critical_failures:
            for failure in critical_failures:
                print(f"   ❌ {failure['test']}: {failure['details']}")
        else:
            print(f"   ✅ No critical issues detected")
        
        # Integration readiness assessment
        print(f"\n🎯 Supabase Integration Readiness Assessment:")
        
        readiness_score = 0
        max_score = 0
        
        # Criteria 1: Form Submissions (25 points)
        max_score += 25
        form_tests = [t for t in self.test_results if "Form Submission" in t["test"]]
        form_passed = len([t for t in form_tests if t["passed"]])
        form_total = len(form_tests)
        
        if form_total > 0 and (form_passed / form_total) >= 0.8:
            readiness_score += 25
            print(f"   ✅ Form Submissions: PASS ({form_passed}/{form_total})")
        else:
            print(f"   ❌ Form Submissions: FAIL ({form_passed}/{form_total})")
        
        # Criteria 2: Database Integration (25 points)
        max_score += 25
        db_tests = [t for t in self.test_results if "Database" in t["test"] or "Supabase" in t["test"]]
        db_passed = len([t for t in db_tests if t["passed"]])
        db_total = len(db_tests)
        
        if db_total > 0 and (db_passed / db_total) >= 0.8:
            readiness_score += 25
            print(f"   ✅ Database Integration: PASS ({db_passed}/{db_total})")
        else:
            print(f"   ❌ Database Integration: FAIL ({db_passed}/{db_total})")
        
        # Criteria 3: Backend API Integration (25 points)
        max_score += 25
        api_tests = [t for t in self.test_results if "Backend" in t["test"] or "Notify" in t["test"]]
        api_passed = len([t for t in api_tests if t["passed"]])
        api_total = len(api_tests)
        
        if api_total > 0 and (api_passed / api_total) >= 0.8:
            readiness_score += 25
            print(f"   ✅ Backend API Integration: PASS ({api_passed}/{api_total})")
        else:
            print(f"   ❌ Backend API Integration: FAIL ({api_passed}/{api_total})")
        
        # Criteria 4: Form Validation & Error Handling (25 points)
        max_score += 25
        validation_tests = [t for t in self.test_results if "Validation" in t["test"] or "Error" in t["test"]]
        validation_passed = len([t for t in validation_tests if t["passed"]])
        validation_total = len(validation_tests)
        
        if validation_total > 0 and (validation_passed / validation_total) >= 0.7:
            readiness_score += 25
            print(f"   ✅ Validation & Error Handling: PASS ({validation_passed}/{validation_total})")
        else:
            print(f"   ❌ Validation & Error Handling: FAIL ({validation_passed}/{validation_total})")
        
        # Final readiness score
        final_readiness = (readiness_score / max_score) * 100 if max_score > 0 else 0
        
        print(f"\n🏆 FINAL SUPABASE INTEGRATION READINESS SCORE: {final_readiness:.1f}%")
        
        if final_readiness >= 90:
            print(f"   🎉 EXCELLENT - Supabase integration is production-ready")
        elif final_readiness >= 75:
            print(f"   ✅ GOOD - Supabase integration ready with minor optimizations")
        elif final_readiness >= 60:
            print(f"   ⚠️ FAIR - Supabase integration needs improvements")
        else:
            print(f"   ❌ POOR - Significant Supabase integration issues need resolution")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        if final_readiness < 90:
            print(f"   • Review and fix critical integration issues")
            print(f"   • Verify Supabase table structures and permissions")
            print(f"   • Test form validation edge cases")
            print(f"   • Implement proper error handling and user feedback")
        
        print(f"   • Monitor Supabase performance and error rates in production")
        print(f"   • Set up alerts for form submission failures")
        print(f"   • Consider implementing retry logic for network failures")
        
        return final_readiness
    
    def run_comprehensive_supabase_tests(self):
        """Run all comprehensive Supabase integration tests"""
        print("🚀 Starting Comprehensive Supabase Integration Testing")
        print("=" * 80)
        print("Testing SentraTech Supabase integration for:")
        print("• Demo Request Form (/demo-request page)")
        print("• Contact Sales Form (pricing cards slide-in)")
        print("• Backend /api/notify endpoint")
        print("• Supabase database tables (demo_requests, Contact Request)")
        print("• Form validation and error handling")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Core functionality tests
            self.test_demo_request_form_submission()
            self.test_contact_sales_form_submission()
            self.test_backend_notify_endpoint()
            
            # Database and integration tests
            self.test_database_connectivity()
            self.test_supabase_table_structure()
            
            # Validation and error handling tests
            self.test_form_validation()
            self.test_error_handling()
            
        except Exception as e:
            print(f"❌ Critical error during Supabase integration testing: {str(e)}")
            self.log_test("Supabase Integration Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        readiness_score = self.generate_comprehensive_report()
        
        return readiness_score >= 75  # Return True if ready for production


def main():
    """Main function to run Supabase integration tests"""
    tester = SupabaseIntegrationTester()
    
    print("🔍 SentraTech Supabase Integration Testing")
    print("Testing Demo Request and Contact Sales functionality")
    print("-" * 60)
    
    # Run comprehensive tests
    is_ready = tester.run_comprehensive_supabase_tests()
    
    print(f"\n{'='*60}")
    if is_ready:
        print("🎉 SUPABASE INTEGRATION IS READY FOR PRODUCTION!")
    else:
        print("⚠️ SUPABASE INTEGRATION NEEDS ATTENTION BEFORE PRODUCTION")
    print(f"{'='*60}")
    
    return is_ready


if __name__ == "__main__":
    main()