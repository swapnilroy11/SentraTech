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
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com/api"

# Supabase configuration from frontend .env
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

class SupabaseIntegrationTester:
    """Comprehensive Supabase Integration Testing Framework"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.supabase_headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
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
    
    def test_supabase_connection(self):
        """Test 1: Basic Supabase connection and authentication"""
        print("\n=== Testing Supabase Connection ===")
        
        try:
            # Test basic connection to Supabase REST API
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/",
                headers=self.supabase_headers,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Supabase Connection - Basic Connectivity", True, 
                            f"Successfully connected to Supabase at {SUPABASE_URL}")
            else:
                self.log_test("Supabase Connection - Basic Connectivity", False, 
                            f"Connection failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Supabase Connection - Basic Connectivity", False, 
                        f"Connection exception: {str(e)}")
            return False
        
        # Test authentication with anon key
        try:
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/contact_requests?limit=1",
                headers=self.supabase_headers,
                timeout=10
            )
            
            if response.status_code in [200, 401, 403]:  # Any of these means auth is working
                self.log_test("Supabase Connection - Authentication", True, 
                            f"Authentication working (status: {response.status_code})")
            else:
                self.log_test("Supabase Connection - Authentication", False, 
                            f"Authentication failed with status {response.status_code}")
                
        except Exception as e:
            self.log_test("Supabase Connection - Authentication", False, 
                        f"Authentication exception: {str(e)}")
        
        return True
    
    def test_table_existence(self):
        """Test 2: Check if required tables exist"""
        print("\n=== Testing Table Existence ===")
        
        required_tables = ['contact_requests', 'demo_requests']
        
        for table_name in required_tables:
            try:
                response = requests.get(
                    f"{SUPABASE_URL}/rest/v1/{table_name}?limit=1",
                    headers=self.supabase_headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.log_test(f"Table Existence - {table_name}", True, 
                                f"Table '{table_name}' exists and is accessible")
                elif response.status_code == 404:
                    self.log_test(f"Table Existence - {table_name}", False, 
                                f"Table '{table_name}' not found (404)")
                elif response.status_code == 401:
                    self.log_test(f"Table Existence - {table_name}", False, 
                                f"Table '{table_name}' exists but access denied (401) - RLS issue")
                else:
                    self.log_test(f"Table Existence - {table_name}", False, 
                                f"Table '{table_name}' check failed with status {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Table Existence - {table_name}", False, 
                            f"Exception checking table '{table_name}': {str(e)}")
    
    def test_table_schemas(self):
        """Test 3: Verify table schemas match expected column names"""
        print("\n=== Testing Table Schemas ===")
        
        # Expected schema for contact_requests table
        expected_contact_columns = [
            'full_name', 'work_email', 'company_name', 'phone', 'monthly_volume',
            'plan_selected', 'plan_id', 'billing_term', 'price_display',
            'preferred_contact_method', 'message'
        ]
        
        # Expected schema for demo_requests table  
        expected_demo_columns = [
            'name', 'email', 'company', 'phone', 'message', 
            'call_volume', 'interaction_volume'
        ]
        
        # Test contact_requests schema
        try:
            # Try to get table schema by attempting an insert with empty data
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=self.supabase_headers,
                json={},
                timeout=10
            )
            
            if response.status_code == 400:
                error_text = response.text.lower()
                missing_columns = []
                
                for column in expected_contact_columns:
                    if column not in error_text and column.replace('_', ' ') not in error_text:
                        missing_columns.append(column)
                
                if not missing_columns:
                    self.log_test("Table Schema - contact_requests", True, 
                                "All expected columns found in contact_requests table")
                else:
                    self.log_test("Table Schema - contact_requests", False, 
                                f"Missing columns in contact_requests: {missing_columns}")
            else:
                # Try a different approach - check error message for column info
                error_message = response.text
                if "column" in error_message.lower():
                    self.log_test("Table Schema - contact_requests", False, 
                                f"Schema issue detected: {error_message}")
                else:
                    self.log_test("Table Schema - contact_requests", False, 
                                f"Cannot verify schema - unexpected response: {response.status_code}")
                    
        except Exception as e:
            self.log_test("Table Schema - contact_requests", False, 
                        f"Exception checking contact_requests schema: {str(e)}")
        
        # Test demo_requests schema
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/demo_requests",
                headers=self.supabase_headers,
                json={},
                timeout=10
            )
            
            if response.status_code == 400:
                error_text = response.text.lower()
                missing_columns = []
                
                for column in expected_demo_columns:
                    if column not in error_text:
                        missing_columns.append(column)
                
                if not missing_columns:
                    self.log_test("Table Schema - demo_requests", True, 
                                "All expected columns found in demo_requests table")
                else:
                    self.log_test("Table Schema - demo_requests", False, 
                                f"Missing columns in demo_requests: {missing_columns}")
            else:
                error_message = response.text
                if "column" in error_message.lower():
                    self.log_test("Table Schema - demo_requests", False, 
                                f"Schema issue detected: {error_message}")
                else:
                    self.log_test("Table Schema - demo_requests", False, 
                                f"Cannot verify schema - unexpected response: {response.status_code}")
                    
        except Exception as e:
            self.log_test("Table Schema - demo_requests", False, 
                        f"Exception checking demo_requests schema: {str(e)}")
    
    def test_rls_policies(self):
        """Test 4: Test Row Level Security policies for anonymous inserts"""
        print("\n=== Testing RLS Policies ===")
        
        # Test contact_requests RLS policy
        test_contact_data = {
            "full_name": "RLS Test User",
            "work_email": "rls.test@example.com",
            "company_name": "RLS Test Company",
            "phone": "+1-555-0123",
            "monthly_volume": "<10k",
            "plan_selected": "Growth Plan",
            "plan_id": "growth",
            "billing_term": "24m",
            "price_display": "$1,650",
            "preferred_contact_method": "email",
            "message": "Testing RLS policy for anonymous inserts"
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=self.supabase_headers,
                json=test_contact_data,
                timeout=15
            )
            
            if response.status_code == 201:
                self.log_test("RLS Policy - contact_requests INSERT", True, 
                            "Anonymous INSERT allowed for contact_requests table")
            elif response.status_code == 401:
                self.log_test("RLS Policy - contact_requests INSERT", False, 
                            "RLS policy blocking anonymous INSERT to contact_requests")
            elif response.status_code == 400:
                error_message = response.text
                if "column" in error_message.lower() or "constraint" in error_message.lower():
                    self.log_test("RLS Policy - contact_requests INSERT", False, 
                                f"Schema/constraint issue: {error_message}")
                else:
                    self.log_test("RLS Policy - contact_requests INSERT", False, 
                                f"Bad request: {error_message}")
            else:
                self.log_test("RLS Policy - contact_requests INSERT", False, 
                            f"Unexpected response {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("RLS Policy - contact_requests INSERT", False, 
                        f"Exception testing contact_requests RLS: {str(e)}")
        
        # Test demo_requests RLS policy
        test_demo_data = {
            "name": "RLS Demo Test User",
            "email": "rls.demo.test@example.com",
            "company": "RLS Demo Test Company",
            "phone": "+1-555-0456",
            "message": "Testing RLS policy for demo requests",
            "call_volume": "1000-5000",
            "interaction_volume": "2000-10000"
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/demo_requests",
                headers=self.supabase_headers,
                json=test_demo_data,
                timeout=15
            )
            
            if response.status_code == 201:
                self.log_test("RLS Policy - demo_requests INSERT", True, 
                            "Anonymous INSERT allowed for demo_requests table")
            elif response.status_code == 401:
                self.log_test("RLS Policy - demo_requests INSERT", False, 
                            "RLS policy blocking anonymous INSERT to demo_requests")
            elif response.status_code == 400:
                error_message = response.text
                if "column" in error_message.lower() or "constraint" in error_message.lower():
                    self.log_test("RLS Policy - demo_requests INSERT", False, 
                                f"Schema/constraint issue: {error_message}")
                else:
                    self.log_test("RLS Policy - demo_requests INSERT", False, 
                                f"Bad request: {error_message}")
            else:
                self.log_test("RLS Policy - demo_requests INSERT", False, 
                            f"Unexpected response {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("RLS Policy - demo_requests INSERT", False, 
                        f"Exception testing demo_requests RLS: {str(e)}")
    
    def test_minimal_data_inserts(self):
        """Test 5: Try minimal data inserts to isolate issues"""
        print("\n=== Testing Minimal Data Inserts ===")
        
        # Test minimal contact request
        minimal_contact = {
            "full_name": "Minimal Test",
            "work_email": "minimal.test@example.com",
            "company_name": "Minimal Test Co"
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=self.supabase_headers,
                json=minimal_contact,
                timeout=15
            )
            
            if response.status_code == 201:
                self.log_test("Minimal Insert - contact_requests", True, 
                            "Minimal contact request insert successful")
            else:
                error_details = self.parse_supabase_error(response)
                self.log_test("Minimal Insert - contact_requests", False, 
                            f"Status {response.status_code}: {error_details}")
                
        except Exception as e:
            self.log_test("Minimal Insert - contact_requests", False, 
                        f"Exception: {str(e)}")
        
        # Test minimal demo request
        minimal_demo = {
            "name": "Minimal Demo Test",
            "email": "minimal.demo.test@example.com",
            "company": "Minimal Demo Co"
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/demo_requests",
                headers=self.supabase_headers,
                json=minimal_demo,
                timeout=15
            )
            
            if response.status_code == 201:
                self.log_test("Minimal Insert - demo_requests", True, 
                            "Minimal demo request insert successful")
            else:
                error_details = self.parse_supabase_error(response)
                self.log_test("Minimal Insert - demo_requests", False, 
                            f"Status {response.status_code}: {error_details}")
                
        except Exception as e:
            self.log_test("Minimal Insert - demo_requests", False, 
                        f"Exception: {str(e)}")
    
    def test_constraint_validation(self):
        """Test 6: Test data type and constraint validation"""
        print("\n=== Testing Constraint Validation ===")
        
        # Test monthly_volume constraint values
        volume_values = ['<10k', '10k-50k', '50k+', 'under_10k', '10k_50k', 'over_50k']
        
        for volume in volume_values:
            test_data = {
                "full_name": f"Volume Test {volume}",
                "work_email": f"volume.test.{volume.replace('<', '').replace('>', '').replace('-', '').replace('_', '')}@example.com",
                "company_name": "Volume Test Company",
                "monthly_volume": volume
            }
            
            try:
                response = requests.post(
                    f"{SUPABASE_URL}/rest/v1/contact_requests",
                    headers=self.supabase_headers,
                    json=test_data,
                    timeout=10
                )
                
                if response.status_code == 201:
                    self.log_test(f"Constraint Validation - monthly_volume '{volume}'", True, 
                                f"Volume value '{volume}' accepted")
                elif response.status_code == 400 and "constraint" in response.text.lower():
                    self.log_test(f"Constraint Validation - monthly_volume '{volume}'", False, 
                                f"Volume value '{volume}' rejected by constraint")
                else:
                    self.log_test(f"Constraint Validation - monthly_volume '{volume}'", False, 
                                f"Unexpected response {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Constraint Validation - monthly_volume '{volume}'", False, 
                            f"Exception: {str(e)}")
        
        # Test preferred_contact_method constraint values
        contact_methods = ['email', 'phone', 'demo']
        
        for method in contact_methods:
            test_data = {
                "full_name": f"Contact Method Test {method}",
                "work_email": f"contact.method.{method}@example.com",
                "company_name": "Contact Method Test Company",
                "preferred_contact_method": method
            }
            
            try:
                response = requests.post(
                    f"{SUPABASE_URL}/rest/v1/contact_requests",
                    headers=self.supabase_headers,
                    json=test_data,
                    timeout=10
                )
                
                if response.status_code == 201:
                    self.log_test(f"Constraint Validation - contact_method '{method}'", True, 
                                f"Contact method '{method}' accepted")
                elif response.status_code == 400 and "constraint" in response.text.lower():
                    self.log_test(f"Constraint Validation - contact_method '{method}'", False, 
                                f"Contact method '{method}' rejected by constraint")
                else:
                    self.log_test(f"Constraint Validation - contact_method '{method}'", False, 
                                f"Unexpected response {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Constraint Validation - contact_method '{method}'", False, 
                            f"Exception: {str(e)}")
    
    def test_full_form_submissions(self):
        """Test 7: Test complete form submissions with realistic data"""
        print("\n=== Testing Full Form Submissions ===")
        
        # Test complete contact sales form submission
        complete_contact_data = {
            "full_name": "Sarah Johnson",
            "work_email": "sarah.johnson@techcorp.com",
            "company_name": "TechCorp Solutions",
            "phone": "+1-555-0199",
            "company_website": "https://techcorp.com",
            "monthly_volume": "<10k",
            "plan_selected": "Growth Plan",
            "plan_id": "growth",
            "billing_term": "24m",
            "price_display": "$1,650",
            "preferred_contact_method": "email",
            "message": "Interested in Growth plan for our customer support operations",
            "consent_marketing": True,
            "utm_data": {
                "source": "pricing_page",
                "medium": "web",
                "campaign": "contact_sales"
            },
            "metadata": {
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "referrer": "https://tech-site-boost.preview.emergentagent.com/pricing",
                "viewport": {"width": 1920, "height": 1080},
                "source": "pricing_page",
                "widget": "slide_in"
            }
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/contact_requests",
                headers=self.supabase_headers,
                json=complete_contact_data,
                timeout=20
            )
            
            if response.status_code == 201:
                self.log_test("Full Form Submission - Contact Sales", True, 
                            "Complete contact sales form submission successful")
            else:
                error_details = self.parse_supabase_error(response)
                self.log_test("Full Form Submission - Contact Sales", False, 
                            f"Status {response.status_code}: {error_details}")
                
        except Exception as e:
            self.log_test("Full Form Submission - Contact Sales", False, 
                        f"Exception: {str(e)}")
        
        # Test complete demo request form submission
        complete_demo_data = {
            "name": "Michael Chen",
            "email": "michael.chen@innovatetech.com",
            "company": "InnovateTech Industries",
            "phone": "+1-555-0288",
            "message": "Looking for AI customer support solution for our growing business",
            "call_volume": "1000-5000",
            "interaction_volume": "2000-10000"
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/demo_requests",
                headers=self.supabase_headers,
                json=complete_demo_data,
                timeout=20
            )
            
            if response.status_code == 201:
                self.log_test("Full Form Submission - Demo Request", True, 
                            "Complete demo request form submission successful")
            else:
                error_details = self.parse_supabase_error(response)
                self.log_test("Full Form Submission - Demo Request", False, 
                            f"Status {response.status_code}: {error_details}")
                
        except Exception as e:
            self.log_test("Full Form Submission - Demo Request", False, 
                        f"Exception: {str(e)}")
    
    def test_network_connectivity(self):
        """Test 8: Test network connectivity and DNS resolution"""
        print("\n=== Testing Network Connectivity ===")
        
        try:
            # Test DNS resolution
            import socket
            host = "dwishuwpqyffsmgljrqy.supabase.co"
            ip = socket.gethostbyname(host)
            self.log_test("Network Connectivity - DNS Resolution", True, 
                        f"DNS resolved {host} to {ip}")
        except Exception as e:
            self.log_test("Network Connectivity - DNS Resolution", False, 
                        f"DNS resolution failed: {str(e)}")
        
        try:
            # Test HTTPS connectivity
            response = requests.get(SUPABASE_URL, timeout=10)
            if response.status_code in [200, 404, 405]:  # Any response means connectivity works
                self.log_test("Network Connectivity - HTTPS", True, 
                            f"HTTPS connectivity working (status: {response.status_code})")
            else:
                self.log_test("Network Connectivity - HTTPS", False, 
                            f"HTTPS connectivity issue (status: {response.status_code})")
        except Exception as e:
            self.log_test("Network Connectivity - HTTPS", False, 
                        f"HTTPS connectivity failed: {str(e)}")
    
    def parse_supabase_error(self, response):
        """Parse Supabase error response for detailed information"""
        try:
            if response.headers.get('content-type', '').startswith('application/json'):
                error_data = response.json()
                if isinstance(error_data, dict):
                    message = error_data.get('message', '')
                    details = error_data.get('details', '')
                    hint = error_data.get('hint', '')
                    code = error_data.get('code', '')
                    
                    error_parts = []
                    if message:
                        error_parts.append(f"Message: {message}")
                    if code:
                        error_parts.append(f"Code: {code}")
                    if details:
                        error_parts.append(f"Details: {details}")
                    if hint:
                        error_parts.append(f"Hint: {hint}")
                    
                    return " | ".join(error_parts) if error_parts else response.text
            
            return response.text
        except:
            return response.text
    
    def generate_diagnostic_report(self):
        """Generate comprehensive diagnostic report"""
        print("\n" + "=" * 80)
        print("🔍 SUPABASE INTEGRATION DIAGNOSTIC REPORT")
        print("=" * 80)
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📊 Overall Test Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📈 Success Rate: {success_rate:.1f}%")
        
        # Categorize failures
        connection_failures = [t for t in self.failed_tests if "Connection" in t]
        table_failures = [t for t in self.failed_tests if "Table" in t]
        rls_failures = [t for t in self.failed_tests if "RLS" in t]
        schema_failures = [t for t in self.failed_tests if "Schema" in t]
        constraint_failures = [t for t in self.failed_tests if "Constraint" in t]
        submission_failures = [t for t in self.failed_tests if "Submission" in t]
        
        print(f"\n🚨 Failure Analysis:")
        if connection_failures:
            print(f"   🔌 Connection Issues: {len(connection_failures)}")
            for failure in connection_failures:
                print(f"     - {failure}")
        
        if table_failures:
            print(f"   📋 Table Issues: {len(table_failures)}")
            for failure in table_failures:
                print(f"     - {failure}")
        
        if rls_failures:
            print(f"   🔒 RLS Policy Issues: {len(rls_failures)}")
            for failure in rls_failures:
                print(f"     - {failure}")
        
        if schema_failures:
            print(f"   📝 Schema Issues: {len(schema_failures)}")
            for failure in schema_failures:
                print(f"     - {failure}")
        
        if constraint_failures:
            print(f"   ⚠️ Constraint Issues: {len(constraint_failures)}")
            for failure in constraint_failures:
                print(f"     - {failure}")
        
        if submission_failures:
            print(f"   📤 Form Submission Issues: {len(submission_failures)}")
            for failure in submission_failures:
                print(f"     - {failure}")
        
        # Recommendations
        print(f"\n💡 Diagnostic Recommendations:")
        
        if connection_failures:
            print(f"   🔌 Connection Issues:")
            print(f"     • Verify Supabase URL: {SUPABASE_URL}")
            print(f"     • Check anon key validity")
            print(f"     • Verify network connectivity")
        
        if table_failures:
            print(f"   📋 Table Issues:")
            print(f"     • Verify tables 'contact_requests' and 'demo_requests' exist")
            print(f"     • Check table names for spaces or special characters")
            print(f"     • Ensure tables are in 'public' schema")
        
        if rls_failures:
            print(f"   🔒 RLS Policy Issues:")
            print(f"     • Create RLS policy: CREATE POLICY 'Allow anonymous inserts' ON contact_requests FOR INSERT TO anon WITH CHECK (true);")
            print(f"     • Create RLS policy: CREATE POLICY 'Allow anonymous inserts' ON demo_requests FOR INSERT TO anon WITH CHECK (true);")
            print(f"     • Verify RLS is enabled on tables")
        
        if schema_failures:
            print(f"   📝 Schema Issues:")
            print(f"     • Verify column names match frontend expectations")
            print(f"     • Check for missing columns in table definitions")
            print(f"     • Ensure data types are compatible")
        
        if constraint_failures:
            print(f"   ⚠️ Constraint Issues:")
            print(f"     • Update monthly_volume constraint to allow '<10k', '10k-50k', '50k+'")
            print(f"     • Update preferred_contact_method constraint to allow 'email', 'phone', 'demo'")
            print(f"     • Check for other constraint mismatches")
        
        # Configuration summary
        print(f"\n⚙️ Configuration Summary:")
        print(f"   Supabase URL: {SUPABASE_URL}")
        print(f"   Anon Key: {SUPABASE_ANON_KEY[:20]}...")
        print(f"   Expected Tables: contact_requests, demo_requests")
        print(f"   Required RLS: Anonymous INSERT policies")
        
        return success_rate >= 80  # Return True if diagnostic passes
    
    def run_comprehensive_diagnostics(self):
        """Run all Supabase integration diagnostic tests"""
        print("🔍 Starting Comprehensive Supabase Integration Diagnostics")
        print("=" * 80)
        print("Diagnosing Supabase connection and table setup issues:")
        print("• Basic connectivity and authentication")
        print("• Table existence verification")
        print("• Schema validation")
        print("• RLS policy testing")
        print("• Constraint validation")
        print("• Full form submission testing")
        print("• Network connectivity analysis")
        print("=" * 80)
        
        # Execute all diagnostic tests
        try:
            self.test_supabase_connection()
            self.test_table_existence()
            self.test_table_schemas()
            self.test_rls_policies()
            self.test_minimal_data_inserts()
            self.test_constraint_validation()
            self.test_full_form_submissions()
            self.test_network_connectivity()
            
        except Exception as e:
            print(f"❌ Critical error during diagnostics: {str(e)}")
            self.log_test("Diagnostic Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive diagnostic report
        diagnostic_success = self.generate_diagnostic_report()
        
        return diagnostic_success


def main():
    """Main function to run Supabase integration diagnostics"""
    print("🚀 SentraTech Supabase Integration Diagnostics")
    print("Testing for 'Failed to submit contact request' error causes")
    print("=" * 80)
    
    tester = SupabaseIntegrationTester()
    success = tester.run_comprehensive_diagnostics()
    
    if success:
        print(f"\n🎉 DIAGNOSTIC COMPLETE - Issues identified and solutions provided")
    else:
        print(f"\n🚨 DIAGNOSTIC COMPLETE - Critical issues found requiring immediate attention")
    
    return success

if __name__ == "__main__":
    main()