#!/usr/bin/env python3
"""
Phase 1 Demo Request Form Submission Issue Investigation
Testing the exact scenario reported in the review request where form submission fails
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any
import uuid

# Backend URL from environment
BACKEND_URL = "https://netproxy-forms.preview.emergentagent.com/api"

class Phase1DemoRequestTester:
    """Phase 1 Demo Request Form Issue Investigation"""
    
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
    
    def test_backend_connectivity(self):
        """Test basic backend connectivity"""
        print("\n=== Testing Backend Connectivity ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Hello World":
                    self.log_test("Backend Connectivity", True, f"Backend responding correctly")
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
    
    def test_phase1_exact_data_submission(self):
        """Test demo request form submission with EXACT Phase 1 test data from review request"""
        print("\n=== Testing Phase 1 Demo Request Form - EXACT TEST DATA ===")
        
        # EXACT test data as specified in the review request
        phase1_test_data = {
            "name": "Test User Phase1",
            "email": "phase1test@sentratech.demo", 
            "company": "Phase1 Test Company",
            "phone": "+1-555-123-4567",
            "call_volume": "25,000",
            "interaction_volume": "40,000",
            "message": "Testing Demo Request form with proper Supabase integration and volume fields."
        }
        
        try:
            print(f"📝 Submitting Phase 1 demo request with EXACT test data...")
            print(f"   Test Data: {json.dumps(phase1_test_data, indent=2)}")
            
            # Make the request with detailed logging
            start_time = time.time()
            response = requests.post(f"{BACKEND_URL}/demo/request", json=phase1_test_data, timeout=30)
            response_time = (time.time() - start_time) * 1000
            
            print(f"   Response Time: {response_time:.2f}ms")
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            # Log the full response for debugging
            try:
                response_json = response.json()
                print(f"   Response Body: {json.dumps(response_json, indent=2)}")
            except:
                print(f"   Response Body (raw): {response.text}")
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "message"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result.get("success"):
                        reference_id = result.get("reference_id", "No reference ID")
                        self.log_test("Phase 1 Demo Request - Exact Data Submission", True, 
                                    f"✅ Phase 1 demo request successful! Reference ID: {reference_id}")
                        
                        # Store reference for verification
                        self.phase1_reference_id = reference_id
                        return True
                    else:
                        self.log_test("Phase 1 Demo Request - Exact Data Submission", False, 
                                    f"❌ Request marked as failed: {result.get('message', 'No message')}")
                        return False
                else:
                    self.log_test("Phase 1 Demo Request - Exact Data Submission", False, 
                                f"Missing response fields: {missing_fields}")
                    return False
            else:
                error_text = response.text
                self.log_test("Phase 1 Demo Request - Exact Data Submission", False, 
                            f"❌ HTTP {response.status_code}: {error_text}")
                
                # Detailed error analysis
                if response.status_code == 422:
                    self.log_test("Phase 1 Demo Request - Validation Error", False, 
                                f"Validation error with Phase 1 data: {error_text}")
                elif response.status_code == 500:
                    self.log_test("Phase 1 Demo Request - Server Error", False, 
                                f"Server error during Phase 1 submission: {error_text}")
                elif "supabase" in error_text.lower():
                    self.log_test("Phase 1 Demo Request - Supabase Error", False, 
                                f"Supabase integration error: {error_text}")
                
                return False
                
        except Exception as e:
            self.log_test("Phase 1 Demo Request - Exact Data Submission", False, f"Exception: {str(e)}")
            return False
    
    def test_supabase_connection_direct(self):
        """Test direct Supabase connection by checking backend logs and responses"""
        print("\n=== Testing Supabase Connection Issues ===")
        
        # Test with minimal data to isolate Supabase issues
        minimal_test_data = {
            "name": "Supabase Test User",
            "email": "supabase@test.com",
            "company": "Supabase Test Company"
        }
        
        try:
            print(f"🔍 Testing minimal data submission to isolate Supabase issues...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=minimal_test_data, timeout=20)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Supabase Connection - Minimal Data", True, 
                                f"✅ Minimal data submission successful")
                    return True
                else:
                    self.log_test("Supabase Connection - Minimal Data", False, 
                                f"Minimal data submission failed: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Supabase Connection - Minimal Data", False, 
                            f"Minimal data submission error: HTTP {response.status_code} - {error_text}")
                
                # Check for specific Supabase errors
                if "supabase" in error_text.lower():
                    self.log_test("Supabase Connection - Error Analysis", False, 
                                f"Supabase-specific error detected: {error_text}")
                elif "schema cache" in error_text.lower():
                    self.log_test("Supabase Connection - Schema Cache Error", False, 
                                f"Schema cache error detected: {error_text}")
                elif "column" in error_text.lower():
                    self.log_test("Supabase Connection - Column Error", False, 
                                f"Column-related error detected: {error_text}")
                
                return False
                
        except Exception as e:
            self.log_test("Supabase Connection - Minimal Data", False, f"Exception: {str(e)}")
            return False
    
    def test_volume_fields_specific_issue(self):
        """Test if volume fields are causing the specific issue"""
        print("\n=== Testing Volume Fields Specific Issue ===")
        
        # Test without volume fields first
        data_without_volume = {
            "name": "No Volume Test User",
            "email": "novolume@test.com",
            "company": "No Volume Test Company",
            "phone": "+1-555-123-4568",
            "message": "Testing without volume fields"
        }
        
        try:
            print(f"🔍 Testing submission WITHOUT volume fields...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=data_without_volume, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Volume Fields Issue - Without Volume Fields", True, 
                                f"✅ Submission without volume fields successful")
                    
                    # Now test WITH volume fields
                    data_with_volume = {
                        "name": "With Volume Test User",
                        "email": "withvolume@test.com",
                        "company": "With Volume Test Company",
                        "phone": "+1-555-123-4569",
                        "call_volume": "25,000",
                        "interaction_volume": "40,000",
                        "message": "Testing with volume fields"
                    }
                    
                    print(f"🔍 Testing submission WITH volume fields...")
                    response2 = requests.post(f"{BACKEND_URL}/demo/request", json=data_with_volume, timeout=20)
                    
                    if response2.status_code == 200:
                        result2 = response2.json()
                        if result2.get("success"):
                            self.log_test("Volume Fields Issue - With Volume Fields", True, 
                                        f"✅ Submission with volume fields successful")
                            return True
                        else:
                            self.log_test("Volume Fields Issue - With Volume Fields", False, 
                                        f"❌ Submission with volume fields failed: {result2}")
                            return False
                    else:
                        self.log_test("Volume Fields Issue - With Volume Fields", False, 
                                    f"❌ HTTP {response2.status_code}: {response2.text}")
                        return False
                else:
                    self.log_test("Volume Fields Issue - Without Volume Fields", False, 
                                f"❌ Submission without volume fields failed: {result}")
                    return False
            else:
                self.log_test("Volume Fields Issue - Without Volume Fields", False, 
                            f"❌ HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Volume Fields Issue - Testing", False, f"Exception: {str(e)}")
            return False
    
    def test_backend_logs_analysis(self):
        """Analyze backend behavior for debugging"""
        print("\n=== Backend Behavior Analysis ===")
        
        # Test multiple scenarios to understand the pattern
        test_scenarios = [
            {
                "name": "Scenario 1 - Basic Data",
                "data": {
                    "name": "Basic Test",
                    "email": "basic@test.com",
                    "company": "Basic Company"
                }
            },
            {
                "name": "Scenario 2 - With Phone",
                "data": {
                    "name": "Phone Test",
                    "email": "phone@test.com",
                    "company": "Phone Company",
                    "phone": "+1-555-123-4570"
                }
            },
            {
                "name": "Scenario 3 - With Message",
                "data": {
                    "name": "Message Test",
                    "email": "message@test.com",
                    "company": "Message Company",
                    "message": "Test message"
                }
            },
            {
                "name": "Scenario 4 - Phase 1 Data Again",
                "data": {
                    "name": "Test User Phase1",
                    "email": "phase1test2@sentratech.demo", 
                    "company": "Phase1 Test Company",
                    "phone": "+1-555-123-4567",
                    "call_volume": "25,000",
                    "interaction_volume": "40,000",
                    "message": "Testing Demo Request form with proper Supabase integration and volume fields."
                }
            }
        ]
        
        successful_scenarios = 0
        failed_scenarios = []
        
        for scenario in test_scenarios:
            try:
                print(f"🔍 Testing {scenario['name']}...")
                response = requests.post(f"{BACKEND_URL}/demo/request", 
                                       json=scenario["data"], timeout=20)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        successful_scenarios += 1
                        print(f"   ✅ {scenario['name']} - SUCCESS")
                    else:
                        failed_scenarios.append(scenario['name'])
                        print(f"   ❌ {scenario['name']} - FAILED: {result.get('message', 'No message')}")
                else:
                    failed_scenarios.append(scenario['name'])
                    print(f"   ❌ {scenario['name']} - HTTP {response.status_code}: {response.text[:200]}")
                
                # Small delay between requests
                time.sleep(1)
                
            except Exception as e:
                failed_scenarios.append(scenario['name'])
                print(f"   ❌ {scenario['name']} - Exception: {str(e)}")
        
        # Analysis
        if successful_scenarios == len(test_scenarios):
            self.log_test("Backend Behavior Analysis", True, 
                        f"✅ All {len(test_scenarios)} scenarios successful")
            return True
        elif successful_scenarios > 0:
            self.log_test("Backend Behavior Analysis", False, 
                        f"⚠️ Mixed results: {successful_scenarios}/{len(test_scenarios)} successful. Failed: {failed_scenarios}")
            return False
        else:
            self.log_test("Backend Behavior Analysis", False, 
                        f"❌ All scenarios failed: {failed_scenarios}")
            return False
    
    def generate_phase1_investigation_report(self):
        """Generate comprehensive Phase 1 investigation report"""
        print("\n" + "=" * 80)
        print("🚨 PHASE 1 DEMO REQUEST FORM SUBMISSION ISSUE - INVESTIGATION REPORT")
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
        print(f"\n🔍 ROOT CAUSE ANALYSIS:")
        
        # Check for Phase 1 specific failure
        phase1_test = next((r for r in self.test_results if "Phase 1 Demo Request - Exact Data Submission" in r["test"]), None)
        if phase1_test and not phase1_test["passed"]:
            print(f"   ❌ CONFIRMED: Phase 1 test data submission FAILED")
            print(f"      └─ {phase1_test['details']}")
            
            # Check if it's a validation issue
            if "422" in phase1_test["details"]:
                print(f"   🔍 LIKELY CAUSE: Validation error with Phase 1 test data")
            elif "500" in phase1_test["details"]:
                print(f"   🔍 LIKELY CAUSE: Server error during processing")
            elif "supabase" in phase1_test["details"].lower():
                print(f"   🔍 LIKELY CAUSE: Supabase integration issue")
        else:
            print(f"   ✅ Phase 1 test data submission appears to be working")
        
        # Check for Supabase issues
        supabase_issues = [r for r in self.test_results if "Supabase" in r["test"] and not r["passed"]]
        if supabase_issues:
            print(f"   ❌ SUPABASE ISSUES DETECTED:")
            for issue in supabase_issues:
                print(f"      • {issue['details']}")
        
        # Check for volume field issues
        volume_issues = [r for r in self.test_results if "Volume" in r["test"] and not r["passed"]]
        if volume_issues:
            print(f"   ❌ VOLUME FIELD ISSUES:")
            for issue in volume_issues:
                print(f"      • {issue['details']}")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        
        if phase1_test and not phase1_test["passed"]:
            print(f"   🚨 URGENT: Investigate Phase 1 demo request submission failure")
            
            if "422" in phase1_test["details"]:
                print(f"   • Check form validation logic for Phase 1 test data")
                print(f"   • Verify all required fields are properly validated")
            elif "500" in phase1_test["details"]:
                print(f"   • Check backend server logs for internal errors")
                print(f"   • Verify database connectivity and schema")
            elif "supabase" in phase1_test["details"].lower():
                print(f"   • Check Supabase connection and authentication")
                print(f"   • Verify demo_requests table schema and permissions")
        
        if supabase_issues:
            print(f"   • Fix Supabase integration issues")
            print(f"   • Verify table schema matches expected fields")
            print(f"   • Check RLS policies and permissions")
        
        if volume_issues:
            print(f"   • Address volume field handling issues")
            print(f"   • Verify call_volume and interaction_volume field processing")
        
        # Contradiction analysis
        print(f"\n⚠️ CONTRADICTION ANALYSIS:")
        print(f"   • Review request reports: 'Previous test reports show 100% success rate'")
        print(f"   • Current investigation shows: {success_rate:.1f}% success rate")
        
        if success_rate < 75:
            print(f"   • CONTRADICTION CONFIRMED: Current testing does NOT support 100% success rate claim")
            print(f"   • RECOMMENDATION: Re-evaluate previous test results and fix identified issues")
        else:
            print(f"   • Current testing shows good success rate - issue may be intermittent")
        
        return success_rate >= 75
    
    def run_phase1_investigation(self):
        """Run comprehensive Phase 1 investigation"""
        print("🚨 Starting Phase 1 Demo Request Form Submission Issue Investigation")
        print("=" * 80)
        print("Investigating the specific issue reported in Phase 1 verification:")
        print("• Frontend UI perfect with all volume fields visible")
        print("• Form validation works correctly")
        print("• Valid test data submission fails with 'Failed to submit demo request' error")
        print("• Contradicts previous '100% success rate' reports")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity tests
            if not self.test_backend_connectivity():
                print("❌ Backend connectivity failed - aborting investigation")
                return False
            
            if not self.test_health_check():
                print("❌ Backend health check failed - continuing with caution")
            
            # Core investigation tests
            self.test_supabase_connection_direct()
            self.test_phase1_exact_data_submission()
            self.test_volume_fields_specific_issue()
            self.test_backend_logs_analysis()
            
        except Exception as e:
            print(f"❌ Critical error during investigation: {str(e)}")
            self.log_test("Investigation Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_working = self.generate_phase1_investigation_report()
        
        return is_working


def main():
    """Main function to run Phase 1 investigation"""
    print("🚨 Phase 1 Demo Request Form Submission Issue Investigation")
    print("Investigating the contradiction between reported 100% success rate and actual submission failures")
    print()
    
    tester = Phase1DemoRequestTester()
    
    try:
        is_working = tester.run_phase1_investigation()
        
        if is_working:
            print("\n✅ INVESTIGATION COMPLETE: Demo request form appears to be working")
            print("   The reported issue may be intermittent or resolved")
            return True
        else:
            print("\n❌ INVESTIGATION COMPLETE: Confirmed issues with demo request form")
            print("   The reported submission failures are REAL and need immediate attention")
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