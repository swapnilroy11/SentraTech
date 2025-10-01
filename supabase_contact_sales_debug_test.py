#!/usr/bin/env python3
"""
Comprehensive Supabase Contact Sales Integration Debugging Test
Specifically designed to debug the Contact Sales form submission failure
and identify the exact Supabase error causing the issue.
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, Any, List
import urllib.parse

# Backend URL from environment
BACKEND_URL = "https://formflow-repair.preview.emergentagent.com/api"

# Supabase configuration from frontend/.env
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

class SupabaseContactSalesDebugger:
    """Comprehensive Supabase Contact Sales Integration Debugger"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.supabase_errors = []
        
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
            print(f"❌ FAIL: {test_name}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_direct_supabase_connection(self):
        """Test 1: Test direct Supabase connection to 'Contact Request' table (with space)"""
        print("\n=== Test 1: Direct Supabase Connection to 'Contact Request' Table ===")
        
        # Test direct connection to Supabase REST API
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
        # Test 1a: Check if 'Contact Request' table exists (with space)
        try:
            # Try to query the table with space
            table_url = f"{SUPABASE_URL}/rest/v1/Contact%20Request?select=*&limit=1"
            response = requests.get(table_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                self.log_test("Direct Supabase - 'Contact Request' Table Access", True, 
                            f"✅ Table 'Contact Request' (with space) exists and is accessible")
                return True
            elif response.status_code == 404:
                self.log_test("Direct Supabase - 'Contact Request' Table Access", False, 
                            f"❌ Table 'Contact Request' not found (404). Error: {response.text}")
                
                # Try alternative table names
                alternative_names = ["contact_requests", "ContactRequest", "Contact_Request"]
                for alt_name in alternative_names:
                    alt_url = f"{SUPABASE_URL}/rest/v1/{alt_name}?select=*&limit=1"
                    alt_response = requests.get(alt_url, headers=headers, timeout=10)
                    if alt_response.status_code == 200:
                        self.log_test("Direct Supabase - Alternative Table Found", True, 
                                    f"✅ Found alternative table: '{alt_name}'")
                        return False
                
                return False
            else:
                self.log_test("Direct Supabase - 'Contact Request' Table Access", False, 
                            f"❌ Unexpected status: {response.status_code}. Error: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Direct Supabase - Connection Exception", False, f"❌ Exception: {str(e)}")
            return False
    
    def test_table_schema_inspection(self):
        """Test 2: Check what columns the 'Contact Request' table actually has"""
        print("\n=== Test 2: Table Schema Inspection ===")
        
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
        
        # Try to get table schema by querying with all possible columns
        expected_columns = [
            "full_name", "work_email", "company_name", "phone", "monthly_volume",
            "plan_selected", "plan_id", "billing_term", "price_display",
            "preferred_contact_method", "message", "utm_data", "metadata",
            "consent_marketing", "status", "created_at"
        ]
        
        try:
            # Test each column individually to see which ones exist
            existing_columns = []
            missing_columns = []
            
            for column in expected_columns:
                column_test_url = f"{SUPABASE_URL}/rest/v1/Contact%20Request?select={column}&limit=1"
                response = requests.get(column_test_url, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    existing_columns.append(column)
                    print(f"   ✅ Column '{column}' exists")
                else:
                    missing_columns.append(column)
                    print(f"   ❌ Column '{column}' missing or inaccessible")
            
            if len(existing_columns) > 0:
                self.log_test("Table Schema - Column Verification", True, 
                            f"✅ Found {len(existing_columns)} existing columns: {existing_columns}")
            else:
                self.log_test("Table Schema - Column Verification", False, 
                            f"❌ No columns found or table inaccessible")
            
            if len(missing_columns) > 0:
                self.log_test("Table Schema - Missing Columns", False, 
                            f"❌ Missing columns: {missing_columns}")
            
            # Try to get actual table structure using PostgREST introspection
            introspect_url = f"{SUPABASE_URL}/rest/v1/?select=*"
            introspect_response = requests.get(introspect_url, headers=headers, timeout=10)
            
            if introspect_response.status_code == 200:
                print(f"   📊 Introspection successful")
            else:
                print(f"   ⚠️ Introspection failed: {introspect_response.status_code}")
                
        except Exception as e:
            self.log_test("Table Schema - Inspection Exception", False, f"❌ Exception: {str(e)}")
    
    def test_minimal_insert_operation(self):
        """Test 3: Test minimal insert to identify column/constraint issues"""
        print("\n=== Test 3: Minimal Insert Operation Testing ===")
        
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Test 3a: Minimal data insert (just required fields)
        minimal_data = {
            "full_name": "Test User",
            "work_email": "test@example.com",
            "company_name": "Test Company"
        }
        
        try:
            print("   🧪 Testing minimal insert with basic required fields...")
            insert_url = f"{SUPABASE_URL}/rest/v1/Contact%20Request"
            response = requests.post(insert_url, headers=headers, json=minimal_data, timeout=15)
            
            if response.status_code in [200, 201]:
                self.log_test("Minimal Insert - Basic Required Fields", True, 
                            f"✅ Minimal insert successful. Response: {response.json()}")
            else:
                error_details = response.text
                self.supabase_errors.append({
                    "test": "minimal_insert",
                    "status_code": response.status_code,
                    "error": error_details
                })
                self.log_test("Minimal Insert - Basic Required Fields", False, 
                            f"❌ Status: {response.status_code}. Error: {error_details}")
                
                # Parse the error to understand the issue
                try:
                    error_json = response.json()
                    if "message" in error_json:
                        print(f"   🔍 Detailed error message: {error_json['message']}")
                    if "details" in error_json:
                        print(f"   🔍 Error details: {error_json['details']}")
                    if "hint" in error_json:
                        print(f"   💡 Hint: {error_json['hint']}")
                except:
                    print(f"   🔍 Raw error response: {error_details}")
                
        except Exception as e:
            self.log_test("Minimal Insert - Exception", False, f"❌ Exception: {str(e)}")
    
    def test_individual_field_validation(self):
        """Test 4: Test each field individually to identify problematic fields"""
        print("\n=== Test 4: Individual Field Validation ===")
        
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Test each field type individually
        field_tests = [
            {
                "name": "Full Name Only",
                "data": {"full_name": "John Doe"}
            },
            {
                "name": "Work Email Only", 
                "data": {"work_email": "john@example.com"}
            },
            {
                "name": "Company Name Only",
                "data": {"company_name": "Example Corp"}
            },
            {
                "name": "Monthly Volume Field",
                "data": {"full_name": "Test", "work_email": "test@example.com", "company_name": "Test Corp", "monthly_volume": "<10k"}
            },
            {
                "name": "Plan Selected Field",
                "data": {"full_name": "Test", "work_email": "test@example.com", "company_name": "Test Corp", "plan_selected": "Growth"}
            },
            {
                "name": "Billing Term Field",
                "data": {"full_name": "Test", "work_email": "test@example.com", "company_name": "Test Corp", "billing_term": "24m"}
            }
        ]
        
        for field_test in field_tests:
            try:
                print(f"   🧪 Testing {field_test['name']}...")
                insert_url = f"{SUPABASE_URL}/rest/v1/Contact%20Request"
                response = requests.post(insert_url, headers=headers, json=field_test['data'], timeout=15)
                
                if response.status_code in [200, 201]:
                    self.log_test(f"Field Validation - {field_test['name']}", True, 
                                f"✅ Field test successful")
                else:
                    error_details = response.text
                    self.log_test(f"Field Validation - {field_test['name']}", False, 
                                f"❌ Status: {response.status_code}. Error: {error_details}")
                    
                    # Store specific field errors
                    self.supabase_errors.append({
                        "test": f"field_validation_{field_test['name']}",
                        "status_code": response.status_code,
                        "error": error_details,
                        "data": field_test['data']
                    })
                    
            except Exception as e:
                self.log_test(f"Field Validation - {field_test['name']} Exception", False, f"❌ Exception: {str(e)}")
    
    def test_rls_policies_verification(self):
        """Test 5: Verify RLS policies allow anonymous inserts"""
        print("\n=== Test 5: RLS Policies Verification ===")
        
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Test anonymous insert capability
        rls_test_data = {
            "full_name": "RLS Test User",
            "work_email": "rls.test@example.com", 
            "company_name": "RLS Test Company",
            "monthly_volume": "<10k"
        }
        
        try:
            print("   🔐 Testing RLS policies for anonymous inserts...")
            insert_url = f"{SUPABASE_URL}/rest/v1/Contact%20Request"
            response = requests.post(insert_url, headers=headers, json=rls_test_data, timeout=15)
            
            if response.status_code in [200, 201]:
                self.log_test("RLS Policies - Anonymous Insert", True, 
                            f"✅ RLS policies allow anonymous inserts")
            elif response.status_code == 401:
                self.log_test("RLS Policies - Anonymous Insert", False, 
                            f"❌ RLS policies block anonymous inserts. Status: 401 Unauthorized")
            elif response.status_code == 403:
                self.log_test("RLS Policies - Anonymous Insert", False, 
                            f"❌ RLS policies forbid anonymous inserts. Status: 403 Forbidden")
            else:
                error_details = response.text
                self.log_test("RLS Policies - Anonymous Insert", False, 
                            f"❌ RLS policy issue. Status: {response.status_code}. Error: {error_details}")
                
                # Check if it's an RLS-related error
                if "policy" in error_details.lower() or "rls" in error_details.lower():
                    print("   🔍 This appears to be an RLS policy-related error")
                
        except Exception as e:
            self.log_test("RLS Policies - Exception", False, f"❌ Exception: {str(e)}")
    
    def test_backend_contact_sales_endpoint(self):
        """Test 6: Test backend Contact Sales endpoint integration"""
        print("\n=== Test 6: Backend Contact Sales Endpoint Integration ===")
        
        # Test the backend endpoint that should integrate with Supabase
        contact_sales_data = {
            "full_name": "Backend Test User",
            "work_email": "backend.test@example.com",
            "company_name": "Backend Test Corp",
            "phone": "+1-555-0123",
            "monthly_volume": "10k-50k",
            "plan_selected": "Growth",
            "plan_id": "growth",
            "billing_term": "24m",
            "price_display": "$1,650",
            "preferred_contact_method": "email",
            "message": "Testing backend Contact Sales integration",
            "consent_marketing": True
        }
        
        try:
            print("   🔗 Testing backend Contact Sales endpoint...")
            
            # Check if there's a specific contact sales endpoint
            endpoints_to_test = [
                "/api/contact/request",
                "/api/contact-sales",
                "/api/demo/request",  # fallback
                "/api/notify"  # notification endpoint
            ]
            
            for endpoint in endpoints_to_test:
                try:
                    print(f"   🧪 Testing endpoint: {endpoint}")
                    response = requests.post(f"{BACKEND_URL.replace('/api', '')}{endpoint}", 
                                           json=contact_sales_data, timeout=20)
                    
                    if response.status_code in [200, 201]:
                        result = response.json()
                        self.log_test(f"Backend Integration - {endpoint}", True, 
                                    f"✅ Endpoint working. Response: {result}")
                        
                        # Check if the response indicates Supabase integration
                        if "supabase" in str(result).lower():
                            print("   🔍 Response mentions Supabase integration")
                        
                        break  # Found working endpoint
                    else:
                        print(f"   ❌ {endpoint}: Status {response.status_code}")
                        
                except Exception as e:
                    print(f"   ❌ {endpoint}: Exception {str(e)}")
            else:
                self.log_test("Backend Integration - All Endpoints", False, 
                            f"❌ No working Contact Sales endpoint found")
                
        except Exception as e:
            self.log_test("Backend Integration - Exception", False, f"❌ Exception: {str(e)}")
    
    def test_constraint_validation(self):
        """Test 7: Test database constraints and data type validation"""
        print("\n=== Test 7: Database Constraints and Data Type Validation ===")
        
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Test different constraint scenarios
        constraint_tests = [
            {
                "name": "Valid Monthly Volume Values",
                "data": {"full_name": "Test", "work_email": "test1@example.com", "company_name": "Test", "monthly_volume": "<10k"},
                "should_pass": True
            },
            {
                "name": "Invalid Monthly Volume Values",
                "data": {"full_name": "Test", "work_email": "test2@example.com", "company_name": "Test", "monthly_volume": "under_10k"},
                "should_pass": False
            },
            {
                "name": "Valid Contact Method",
                "data": {"full_name": "Test", "work_email": "test3@example.com", "company_name": "Test", "preferred_contact_method": "email"},
                "should_pass": True
            },
            {
                "name": "Invalid Contact Method",
                "data": {"full_name": "Test", "work_email": "test4@example.com", "company_name": "Test", "preferred_contact_method": "invalid_method"},
                "should_pass": False
            },
            {
                "name": "Long Text Fields",
                "data": {"full_name": "A" * 1000, "work_email": "test5@example.com", "company_name": "B" * 1000},
                "should_pass": False
            }
        ]
        
        for constraint_test in constraint_tests:
            try:
                print(f"   🧪 Testing {constraint_test['name']}...")
                insert_url = f"{SUPABASE_URL}/rest/v1/Contact%20Request"
                response = requests.post(insert_url, headers=headers, json=constraint_test['data'], timeout=15)
                
                success = response.status_code in [200, 201]
                
                if success == constraint_test['should_pass']:
                    self.log_test(f"Constraint Validation - {constraint_test['name']}", True, 
                                f"✅ Constraint test behaved as expected")
                else:
                    expected = "pass" if constraint_test['should_pass'] else "fail"
                    actual = "passed" if success else "failed"
                    self.log_test(f"Constraint Validation - {constraint_test['name']}", False, 
                                f"❌ Expected to {expected}, but {actual}. Status: {response.status_code}")
                    
                    if not success:
                        error_details = response.text
                        print(f"   🔍 Error details: {error_details}")
                        
                        # Store constraint errors for analysis
                        self.supabase_errors.append({
                            "test": f"constraint_{constraint_test['name']}",
                            "status_code": response.status_code,
                            "error": error_details,
                            "data": constraint_test['data']
                        })
                        
            except Exception as e:
                self.log_test(f"Constraint Validation - {constraint_test['name']} Exception", False, f"❌ Exception: {str(e)}")
    
    def test_frontend_supabase_client_integration(self):
        """Test 8: Test frontend Supabase client integration simulation"""
        print("\n=== Test 8: Frontend Supabase Client Integration Simulation ===")
        
        # Simulate what the frontend supabaseClient.js would do
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Simulate the exact data structure the frontend would send
        frontend_data = {
            "full_name": "Frontend Test User",
            "work_email": "frontend.test@example.com",
            "company_name": "Frontend Test Corp",
            "phone": "+1-555-0199",
            "monthly_volume": "10k-50k",
            "plan_selected": "Growth",
            "plan_id": "growth", 
            "billing_term": "24m",
            "price_display": "$1,650",
            "preferred_contact_method": "email",
            "message": "Testing frontend integration simulation",
            "utm_data": {"source": "test", "medium": "debug"},
            "metadata": {"test": True, "debug": True},
            "consent_marketing": True,
            "status": "pending",
            "created_at": datetime.now().isoformat()
        }
        
        try:
            print("   🖥️ Simulating frontend Supabase client integration...")
            
            # Test the exact table name the frontend uses
            table_names_to_test = ["Contact Request", "contact_requests", "Contact_Request"]
            
            for table_name in table_names_to_test:
                try:
                    encoded_table_name = urllib.parse.quote(table_name)
                    insert_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}"
                    
                    print(f"   🧪 Testing table name: '{table_name}'")
                    response = requests.post(insert_url, headers=headers, json=frontend_data, timeout=15)
                    
                    if response.status_code in [200, 201]:
                        self.log_test(f"Frontend Integration - Table '{table_name}'", True, 
                                    f"✅ Frontend integration successful with table '{table_name}'")
                        
                        # This is the correct table name
                        print(f"   🎯 FOUND CORRECT TABLE NAME: '{table_name}'")
                        break
                    else:
                        error_details = response.text
                        print(f"   ❌ Table '{table_name}': Status {response.status_code}")
                        
                        if response.status_code == 404:
                            print(f"   🔍 Table '{table_name}' not found")
                        else:
                            print(f"   🔍 Error: {error_details}")
                            
                            # Store the error for the most likely table name
                            if table_name == "Contact Request":
                                self.supabase_errors.append({
                                    "test": "frontend_integration",
                                    "table_name": table_name,
                                    "status_code": response.status_code,
                                    "error": error_details,
                                    "data": frontend_data
                                })
                        
                except Exception as e:
                    print(f"   ❌ Table '{table_name}': Exception {str(e)}")
            else:
                self.log_test("Frontend Integration - All Table Names", False, 
                            f"❌ No valid table name found for frontend integration")
                
        except Exception as e:
            self.log_test("Frontend Integration - Exception", False, f"❌ Exception: {str(e)}")
    
    def generate_comprehensive_debug_report(self):
        """Generate comprehensive debugging report with exact solutions"""
        print("\n" + "=" * 80)
        print("🔍 SUPABASE CONTACT SALES INTEGRATION - COMPREHENSIVE DEBUG REPORT")
        print("=" * 80)
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        
        print(f"📊 Debug Test Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        
        # Supabase Error Analysis
        print(f"\n🚨 Supabase Error Analysis:")
        if self.supabase_errors:
            print(f"   Found {len(self.supabase_errors)} Supabase-specific errors:")
            
            for i, error in enumerate(self.supabase_errors, 1):
                print(f"\n   Error #{i}:")
                print(f"     Test: {error['test']}")
                print(f"     Status Code: {error['status_code']}")
                print(f"     Error Details: {error['error']}")
                if 'data' in error:
                    print(f"     Data Sent: {error['data']}")
                if 'table_name' in error:
                    print(f"     Table Name: {error['table_name']}")
        else:
            print("   ✅ No Supabase-specific errors captured")
        
        # Root Cause Analysis
        print(f"\n🎯 Root Cause Analysis:")
        
        # Analyze common error patterns
        error_patterns = {}
        for error in self.supabase_errors:
            status_code = error['status_code']
            error_text = error['error'].lower()
            
            if status_code == 404:
                error_patterns['table_not_found'] = error_patterns.get('table_not_found', 0) + 1
            elif status_code == 400:
                if 'column' in error_text:
                    error_patterns['column_mismatch'] = error_patterns.get('column_mismatch', 0) + 1
                elif 'constraint' in error_text:
                    error_patterns['constraint_violation'] = error_patterns.get('constraint_violation', 0) + 1
                else:
                    error_patterns['bad_request'] = error_patterns.get('bad_request', 0) + 1
            elif status_code == 401:
                error_patterns['authentication'] = error_patterns.get('authentication', 0) + 1
            elif status_code == 403:
                error_patterns['authorization'] = error_patterns.get('authorization', 0) + 1
            else:
                error_patterns['other'] = error_patterns.get('other', 0) + 1
        
        for pattern, count in error_patterns.items():
            print(f"   • {pattern.replace('_', ' ').title()}: {count} occurrences")
        
        # Specific Solutions
        print(f"\n💡 EXACT SOLUTIONS REQUIRED:")
        
        if error_patterns.get('table_not_found', 0) > 0:
            print(f"   🔧 TABLE NAME ISSUE:")
            print(f"      Problem: Frontend code uses incorrect table name")
            print(f"      Solution: Update supabaseClient.js to use correct table name")
            print(f"      File: /app/frontend/src/lib/supabaseClient.js")
            print(f"      Change: .from('contact_requests') → .from('Contact Request')")
        
        if error_patterns.get('column_mismatch', 0) > 0:
            print(f"   🔧 COLUMN MISMATCH ISSUE:")
            print(f"      Problem: Frontend sends data with column names that don't exist")
            print(f"      Solution: Update frontend to use correct column names")
            print(f"      Check: Verify actual column names in Supabase dashboard")
        
        if error_patterns.get('constraint_violation', 0) > 0:
            print(f"   🔧 CONSTRAINT VIOLATION ISSUE:")
            print(f"      Problem: Data values don't match database constraints")
            print(f"      Solution: Update frontend to send correct constraint values")
            print(f"      Example: monthly_volume should be '<10k', '10k-50k', '50k+' not 'under_10k'")
        
        if error_patterns.get('authorization', 0) > 0:
            print(f"   🔧 RLS POLICY ISSUE:")
            print(f"      Problem: RLS policies don't allow anonymous inserts")
            print(f"      Solution: Update RLS policy in Supabase:")
            print(f"      SQL: CREATE POLICY 'Allow anonymous contact requests' ON public.'Contact Request'")
            print(f"           AS PERMISSIVE FOR INSERT TO anon WITH CHECK (true);")
        
        # Expected vs Actual Analysis
        print(f"\n📋 Expected vs Actual Column Analysis:")
        expected_columns = [
            "full_name", "work_email", "company_name", "phone", "monthly_volume",
            "plan_selected", "plan_id", "billing_term", "price_display",
            "preferred_contact_method", "message", "utm_data", "metadata",
            "consent_marketing", "status", "created_at"
        ]
        
        print(f"   Expected Columns ({len(expected_columns)}):")
        for col in expected_columns:
            print(f"     • {col}")
        
        print(f"\n   🔍 Verification Needed:")
        print(f"     1. Log into Supabase dashboard")
        print(f"     2. Navigate to 'Contact Request' table")
        print(f"     3. Compare actual columns with expected columns above")
        print(f"     4. Update frontend code to match actual schema")
        
        # Final Recommendations
        print(f"\n🎯 IMMEDIATE ACTION ITEMS:")
        print(f"   1. ✅ Verify table name: 'Contact Request' (with space) vs 'contact_requests'")
        print(f"   2. ✅ Check column names match exactly between frontend and database")
        print(f"   3. ✅ Verify constraint values (monthly_volume, preferred_contact_method)")
        print(f"   4. ✅ Confirm RLS policies allow anonymous INSERT operations")
        print(f"   5. ✅ Test with minimal data first, then add fields incrementally")
        
        print(f"\n🔧 CODE CHANGES LIKELY NEEDED:")
        print(f"   File: /app/frontend/src/lib/supabaseClient.js")
        print(f"   Line: ~162 (insertContactRequest function)")
        print(f"   Change: .from('contact_requests') → .from('Contact Request')")
        print(f"   ")
        print(f"   File: Frontend form components")
        print(f"   Change: Update monthly_volume values to match database constraints")
        print(f"   From: 'under_10k', '10k_50k', 'over_50k'")
        print(f"   To: '<10k', '10k-50k', '50k+'")
        
        return len(self.supabase_errors) == 0
    
    def run_comprehensive_debug_tests(self):
        """Run all comprehensive Supabase debugging tests"""
        print("🔍 Starting Comprehensive Supabase Contact Sales Integration Debugging")
        print("=" * 80)
        print("Debugging the specific Supabase error causing Contact Sales form submission failure")
        print("Testing direct Supabase connection, table schema, constraints, and RLS policies")
        print("=" * 80)
        
        try:
            # Execute all debug tests in sequence
            self.test_direct_supabase_connection()
            self.test_table_schema_inspection()
            self.test_minimal_insert_operation()
            self.test_individual_field_validation()
            self.test_rls_policies_verification()
            self.test_backend_contact_sales_endpoint()
            self.test_constraint_validation()
            self.test_frontend_supabase_client_integration()
            
        except Exception as e:
            print(f"❌ Critical error during debugging: {str(e)}")
            self.log_test("Debug Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive debug report
        success = self.generate_comprehensive_debug_report()
        
        return success


def main():
    """Main function to run Supabase Contact Sales debugging"""
    debugger = SupabaseContactSalesDebugger()
    
    print("🚀 SUPABASE CONTACT SALES INTEGRATION DEBUGGER")
    print("=" * 60)
    print("Identifying the exact Supabase error causing form submission failure")
    print("=" * 60)
    
    success = debugger.run_comprehensive_debug_tests()
    
    if success:
        print("\n🎉 DEBUG COMPLETE: Issues identified and solutions provided!")
    else:
        print("\n🚨 DEBUG COMPLETE: Critical issues found - see solutions above")
    
    return success


if __name__ == "__main__":
    main()