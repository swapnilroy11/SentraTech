#!/usr/bin/env python3
"""
Direct Supabase Integration Test
Testing the Supabase demo_requests table directly to identify schema issues
"""

import requests
import json
import time
from datetime import datetime

# Supabase configuration from frontend/.env
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

class SupabaseDirectTester:
    """Direct Supabase Integration Tester"""
    
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
    
    def test_supabase_connection(self):
        """Test basic Supabase connection"""
        print("\n=== Testing Supabase Connection ===")
        
        try:
            headers = {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json"
            }
            
            # Test basic connection with a simple query
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/demo_requests?select=*&limit=1",
                headers=headers,
                timeout=10
            )
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                self.log_test("Supabase Connection", True, "✅ Supabase connection successful")
                return True
            else:
                error_text = response.text
                self.log_test("Supabase Connection", False, f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Supabase Connection", False, f"Connection error: {str(e)}")
            return False
    
    def test_demo_requests_table_schema(self):
        """Test demo_requests table schema"""
        print("\n=== Testing demo_requests Table Schema ===")
        
        try:
            headers = {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json"
            }
            
            # Try to get table schema by making a query with non-existent column
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/demo_requests?select=*&limit=1",
                headers=headers,
                timeout=10
            )
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   Sample data: {json.dumps(data, indent=2)}")
                
                # Check if we have any data to analyze schema
                if data and len(data) > 0:
                    columns = list(data[0].keys())
                    print(f"   Available columns: {columns}")
                    
                    # Check for expected columns
                    expected_columns = ['user_name', 'email', 'company', 'phone', 'call_volume', 'interaction_volume', 'message']
                    missing_columns = [col for col in expected_columns if col not in columns]
                    extra_columns = [col for col in columns if col not in expected_columns and col not in ['id', 'created_at']]
                    
                    if not missing_columns:
                        self.log_test("demo_requests Schema", True, f"✅ All expected columns present: {expected_columns}")
                        return True
                    else:
                        self.log_test("demo_requests Schema", False, f"Missing columns: {missing_columns}, Extra columns: {extra_columns}")
                        return False
                else:
                    self.log_test("demo_requests Schema", True, "✅ Table accessible but empty - cannot verify schema")
                    return True
            else:
                error_text = response.text
                self.log_test("demo_requests Schema", False, f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("demo_requests Schema", False, f"Schema check error: {str(e)}")
            return False
    
    def test_phase1_supabase_insertion(self):
        """Test Phase 1 data insertion directly to Supabase"""
        print("\n=== Testing Phase 1 Data Insertion to Supabase ===")
        
        # Phase 1 test data mapped to Supabase schema
        phase1_data = {
            "user_name": "Test User Phase1",
            "email": "phase1test@sentratech.demo",
            "company": "Phase1 Test Company",
            "phone": "+1-555-123-4567",
            "call_volume": "25,000",
            "interaction_volume": "40,000",
            "message": "Testing Demo Request form with proper Supabase integration and volume fields."
        }
        
        try:
            headers = {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
            
            print(f"📝 Inserting Phase 1 data directly to Supabase...")
            print(f"   Data: {json.dumps(phase1_data, indent=2)}")
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/demo_requests",
                headers=headers,
                json=phase1_data,
                timeout=20
            )
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code in [200, 201]:
                self.log_test("Phase 1 Supabase Insertion", True, "✅ Phase 1 data inserted successfully to Supabase")
                return True
            else:
                error_text = response.text
                print(f"   Response Body: {error_text}")
                
                # Analyze specific errors
                if "column" in error_text.lower() and "does not exist" in error_text.lower():
                    self.log_test("Phase 1 Supabase Insertion", False, f"❌ Column does not exist error: {error_text}")
                elif "permission" in error_text.lower() or "policy" in error_text.lower():
                    self.log_test("Phase 1 Supabase Insertion", False, f"❌ Permission/RLS policy error: {error_text}")
                elif "constraint" in error_text.lower():
                    self.log_test("Phase 1 Supabase Insertion", False, f"❌ Constraint violation: {error_text}")
                else:
                    self.log_test("Phase 1 Supabase Insertion", False, f"❌ HTTP {response.status_code}: {error_text}")
                
                return False
                
        except Exception as e:
            self.log_test("Phase 1 Supabase Insertion", False, f"Exception: {str(e)}")
            return False
    
    def test_minimal_supabase_insertion(self):
        """Test minimal data insertion to isolate issues"""
        print("\n=== Testing Minimal Data Insertion to Supabase ===")
        
        # Minimal required data
        minimal_data = {
            "user_name": "Minimal Test User",
            "email": "minimal@test.com",
            "company": "Minimal Test Company"
        }
        
        try:
            headers = {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
            
            print(f"📝 Inserting minimal data to Supabase...")
            print(f"   Data: {json.dumps(minimal_data, indent=2)}")
            
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/demo_requests",
                headers=headers,
                json=minimal_data,
                timeout=20
            )
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                self.log_test("Minimal Supabase Insertion", True, "✅ Minimal data inserted successfully")
                return True
            else:
                error_text = response.text
                self.log_test("Minimal Supabase Insertion", False, f"❌ HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Minimal Supabase Insertion", False, f"Exception: {str(e)}")
            return False
    
    def test_volume_fields_specific(self):
        """Test if volume fields are causing issues"""
        print("\n=== Testing Volume Fields Specific Issues ===")
        
        # Test without volume fields first
        data_without_volume = {
            "user_name": "No Volume Test",
            "email": "novolume@supabase.test",
            "company": "No Volume Company",
            "phone": "+1-555-123-4571",
            "message": "Testing without volume fields"
        }
        
        # Test with volume fields
        data_with_volume = {
            "user_name": "With Volume Test",
            "email": "withvolume@supabase.test",
            "company": "With Volume Company",
            "phone": "+1-555-123-4572",
            "call_volume": "25,000",
            "interaction_volume": "40,000",
            "message": "Testing with volume fields"
        }
        
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
        try:
            # Test without volume fields
            print(f"🔍 Testing WITHOUT volume fields...")
            response1 = requests.post(
                f"{SUPABASE_URL}/rest/v1/demo_requests",
                headers=headers,
                json=data_without_volume,
                timeout=20
            )
            
            without_volume_success = response1.status_code in [200, 201]
            
            # Test with volume fields
            print(f"🔍 Testing WITH volume fields...")
            response2 = requests.post(
                f"{SUPABASE_URL}/rest/v1/demo_requests",
                headers=headers,
                json=data_with_volume,
                timeout=20
            )
            
            with_volume_success = response2.status_code in [200, 201]
            
            # Analysis
            if without_volume_success and with_volume_success:
                self.log_test("Volume Fields Specific Test", True, "✅ Both with and without volume fields work")
                return True
            elif without_volume_success and not with_volume_success:
                self.log_test("Volume Fields Specific Test", False, f"❌ Volume fields cause issues: {response2.text}")
                return False
            elif not without_volume_success and with_volume_success:
                self.log_test("Volume Fields Specific Test", False, f"❌ Basic fields have issues: {response1.text}")
                return False
            else:
                self.log_test("Volume Fields Specific Test", False, f"❌ Both tests failed: Without: {response1.text}, With: {response2.text}")
                return False
                
        except Exception as e:
            self.log_test("Volume Fields Specific Test", False, f"Exception: {str(e)}")
            return False
    
    def generate_supabase_investigation_report(self):
        """Generate comprehensive Supabase investigation report"""
        print("\n" + "=" * 80)
        print("🔍 SUPABASE DIRECT INTEGRATION INVESTIGATION REPORT")
        print("=" * 80)
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📈 Investigation Results:")
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
                print(f"      └─ {result['details']}")
        
        # Root cause analysis
        print(f"\n🔍 SUPABASE INTEGRATION ANALYSIS:")
        
        # Check connection issues
        connection_test = next((r for r in self.test_results if "Supabase Connection" in r["test"]), None)
        if connection_test and not connection_test["passed"]:
            print(f"   ❌ SUPABASE CONNECTION FAILED")
            print(f"      └─ {connection_test['details']}")
        else:
            print(f"   ✅ Supabase connection working")
        
        # Check schema issues
        schema_test = next((r for r in self.test_results if "Schema" in r["test"]), None)
        if schema_test and not schema_test["passed"]:
            print(f"   ❌ SCHEMA ISSUES DETECTED")
            print(f"      └─ {schema_test['details']}")
        
        # Check insertion issues
        insertion_tests = [r for r in self.test_results if "Insertion" in r["test"] and not r["passed"]]
        if insertion_tests:
            print(f"   ❌ INSERTION ISSUES:")
            for test in insertion_tests:
                print(f"      • {test['test']}: {test['details']}")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        
        if connection_test and not connection_test["passed"]:
            print(f"   • Fix Supabase connection configuration")
            print(f"   • Verify SUPABASE_URL and SUPABASE_ANON_KEY")
        
        if schema_test and not schema_test["passed"]:
            print(f"   • Update demo_requests table schema")
            print(f"   • Ensure all required columns exist")
        
        if insertion_tests:
            print(f"   • Fix RLS policies for anonymous inserts")
            print(f"   • Verify table permissions")
            print(f"   • Check column constraints")
        
        # Frontend integration impact
        print(f"\n🎯 FRONTEND INTEGRATION IMPACT:")
        if success_rate < 75:
            print(f"   ❌ Frontend demo request form will FAIL due to Supabase issues")
            print(f"   ❌ This explains the 'Failed to submit demo request' error reported")
        else:
            print(f"   ✅ Supabase integration should work for frontend")
        
        return success_rate >= 75
    
    def run_supabase_investigation(self):
        """Run comprehensive Supabase investigation"""
        print("🔍 Starting Direct Supabase Integration Investigation")
        print("=" * 80)
        print("Testing direct Supabase integration to identify root cause of demo request failures:")
        print("• Supabase connection and authentication")
        print("• demo_requests table schema verification")
        print("• Phase 1 data insertion test")
        print("• Volume fields specific testing")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity and schema tests
            if not self.test_supabase_connection():
                print("❌ Supabase connection failed - aborting investigation")
                return False
            
            self.test_demo_requests_table_schema()
            self.test_minimal_supabase_insertion()
            self.test_phase1_supabase_insertion()
            self.test_volume_fields_specific()
            
        except Exception as e:
            print(f"❌ Critical error during investigation: {str(e)}")
            self.log_test("Investigation Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_working = self.generate_supabase_investigation_report()
        
        return is_working


def main():
    """Main function to run Supabase investigation"""
    print("🔍 Direct Supabase Integration Investigation")
    print("Testing Supabase demo_requests table directly to identify frontend integration issues")
    print()
    
    tester = SupabaseDirectTester()
    
    try:
        is_working = tester.run_supabase_investigation()
        
        if is_working:
            print("\n✅ INVESTIGATION COMPLETE: Supabase integration appears to be working")
            return True
        else:
            print("\n❌ INVESTIGATION COMPLETE: Confirmed Supabase integration issues")
            print("   This explains the frontend demo request form failures")
            return False
            
    except KeyboardInterrupt:
        print("\n⚠️ Investigation interrupted by user")
        return False
    except Exception as e:
        print(f"\n❌ Investigation failed with error: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)