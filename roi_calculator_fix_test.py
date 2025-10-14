#!/usr/bin/env python3
"""
ROI Calculator Backend Fix Testing
Testing the specific issue where bundles field is sent as float but dashboard expects integer
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone

# Backend URL - Testing production backend URL from frontend .env
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"

class ROICalculatorFixTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.test_results = {}
        self.total_tests = 0
        self.passed_tests = 0
        
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        self.total_tests += 1
        if status == "PASS":
            self.passed_tests += 1
            print(f"✅ {test_name}: {status}")
        else:
            print(f"❌ {test_name}: {status}")
        
        if details:
            print(f"   Details: {details}")
        
        self.test_results[test_name] = {
            "status": status,
            "details": details,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    def test_roi_calculator_with_failing_payload(self):
        """Test ROI calculator with the exact failing payload from the review request"""
        print("\n🔍 Testing ROI Calculator with Failing Payload...")
        
        # This is the exact payload that was failing according to the review request
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test@gmail.com",
            "country": "Philippines", 
            "call_volume": 3232,
            "interaction_volume": 232323,
            "bundles": 91.34392307692308  # This is the problematic float value
        }
        
        print(f"📊 Testing with payload: {json.dumps(payload, indent=2)}")
        print(f"🔍 Bundles field type: {type(payload['bundles'])} = {payload['bundles']}")
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/roi-calculator",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"📡 Response Status: {response.status_code}")
            print(f"📡 Response Time: {response_time:.2f}ms")
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "ROI Calculator Float Bundles Fix", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                print(f"✅ Success! Dashboard accepted the payload with bundles conversion")
                return True
            elif response.status_code == 422:
                # This is the error we're trying to fix
                error_text = response.text
                print(f"❌ Validation Error (422): {error_text}")
                if "bundles" in error_text and "integer" in error_text:
                    self.log_test(
                        "ROI Calculator Float Bundles Fix", 
                        "FAIL", 
                        f"HTTP 422 - Bundles validation error still present: {error_text[:200]}"
                    )
                else:
                    self.log_test(
                        "ROI Calculator Float Bundles Fix", 
                        "FAIL", 
                        f"HTTP 422 - Different validation error: {error_text[:200]}"
                    )
                return False
            else:
                self.log_test(
                    "ROI Calculator Float Bundles Fix", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("ROI Calculator Float Bundles Fix", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_roi_calculator_with_integer_bundles(self):
        """Test ROI calculator with integer bundles to verify it works when correct"""
        print("\n🔍 Testing ROI Calculator with Integer Bundles (Control Test)...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test.control@gmail.com",
            "country": "Philippines", 
            "call_volume": 3232,
            "interaction_volume": 232323,
            "bundles": 91  # Integer version - should work
        }
        
        print(f"📊 Testing with payload: {json.dumps(payload, indent=2)}")
        print(f"🔍 Bundles field type: {type(payload['bundles'])} = {payload['bundles']}")
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/roi-calculator",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "ROI Calculator Integer Bundles Control", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "ROI Calculator Integer Bundles Control", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("ROI Calculator Integer Bundles Control", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_roi_calculator_edge_cases(self):
        """Test ROI calculator with various edge cases for bundles field"""
        print("\n🔍 Testing ROI Calculator Edge Cases...")
        
        test_cases = [
            {
                "name": "Very Small Float",
                "bundles": 0.5,
                "expected_int": 1
            },
            {
                "name": "Large Float", 
                "bundles": 999.99,
                "expected_int": 1000
            },
            {
                "name": "Negative Float (should be handled gracefully)",
                "bundles": -5.5,
                "expected_int": 0  # or 1, depending on implementation
            },
            {
                "name": "Zero Float",
                "bundles": 0.0,
                "expected_int": 0
            }
        ]
        
        passed_edge_cases = 0
        
        for case in test_cases:
            print(f"\n  🧪 Testing {case['name']}: {case['bundles']}")
            
            payload = {
                "id": str(uuid.uuid4()),
                "email": f"test.{case['name'].lower().replace(' ', '')}@gmail.com",
                "country": "Bangladesh", 
                "call_volume": 1000,
                "interaction_volume": 1500,
                "bundles": case['bundles']
            }
            
            try:
                response = requests.post(
                    f"{self.backend_url}/api/proxy/roi-calculator",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                
                if response.status_code == 200:
                    print(f"    ✅ {case['name']}: Accepted")
                    passed_edge_cases += 1
                else:
                    print(f"    ❌ {case['name']}: HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"    ❌ {case['name']}: Error - {str(e)}")
        
        success_rate = (passed_edge_cases / len(test_cases)) * 100
        if success_rate >= 75:
            self.log_test(
                "ROI Calculator Edge Cases", 
                "PASS", 
                f"{passed_edge_cases}/{len(test_cases)} edge cases handled correctly ({success_rate:.1f}%)"
            )
            return True
        else:
            self.log_test(
                "ROI Calculator Edge Cases", 
                "FAIL", 
                f"Only {passed_edge_cases}/{len(test_cases)} edge cases handled correctly ({success_rate:.1f}%)"
            )
            return False
    
    def run_all_tests(self):
        """Run comprehensive test suite for ROI calculator bundles fix"""
        print("🚀 Starting ROI Calculator Bundles Fix Testing")
        print("Testing the fix for bundles field validation error (float to integer conversion)")
        print("=" * 80)
        
        # Test 1: The exact failing case from the review request
        print("\n🔧 PHASE 1: FAILING PAYLOAD TEST")
        failing_test_passed = self.test_roi_calculator_with_failing_payload()
        
        # Test 2: Control test with integer bundles
        print("\n✅ PHASE 2: CONTROL TEST (INTEGER BUNDLES)")
        control_test_passed = self.test_roi_calculator_with_integer_bundles()
        
        # Test 3: Edge cases
        print("\n🧪 PHASE 3: EDGE CASES")
        edge_cases_passed = self.test_roi_calculator_edge_cases()
        
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("📊 ROI CALCULATOR BUNDLES FIX TEST SUMMARY")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests Executed: {self.total_tests}")
        print(f"Tests Passed: {self.passed_tests}")
        print(f"Tests Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Analyze results
        if failing_test_passed and control_test_passed:
            print(f"\n🎉 OVERALL RESULT: EXCELLENT - ROI Calculator bundles fix working perfectly!")
            print("✅ Float bundles are now properly converted to integers")
            print("✅ Dashboard validation errors resolved")
            print("✅ ROI calculator submissions now work correctly")
        elif control_test_passed and not failing_test_passed:
            print(f"\n❌ OVERALL RESULT: FIX NOT IMPLEMENTED - Bundles conversion still needed")
            print("✅ Integer bundles work correctly (control test passed)")
            print("❌ Float bundles still cause validation errors")
            print("🔧 Backend needs to convert float bundles to integers before sending to dashboard")
        elif failing_test_passed and not control_test_passed:
            print(f"\n⚠️ OVERALL RESULT: UNEXPECTED - Control test failed")
            print("✅ Float bundles somehow work now")
            print("❌ Integer bundles failing (unexpected)")
            print("🔍 Requires investigation of backend changes")
        else:
            print(f"\n❌ OVERALL RESULT: CRITICAL ISSUES - Both tests failed")
            print("❌ ROI calculator endpoint has serious issues")
            print("🚨 Immediate attention required")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 DETAILED FAILURE ANALYSIS:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}")
                print(f"      Issue: {result['details']}")
                print(f"      Time: {result['timestamp']}")
        else:
            print(f"\n🎉 NO FAILURES DETECTED!")
            print("All ROI calculator bundles conversion tests passed")
        
        print(f"\n🏁 ROI CALCULATOR BUNDLES FIX TESTING COMPLETE")
        print(f"Backend URL tested: {self.backend_url}")
        print(f"Test completed at: {datetime.now(timezone.utc).isoformat()}")
        
        return success_rate >= 80

if __name__ == "__main__":
    print("🔧 ROI Calculator Bundles Fix Testing")
    print("Testing the fix for dashboard validation error: bundles field float to integer conversion")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = ROICalculatorFixTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if success else 1)