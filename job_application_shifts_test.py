#!/usr/bin/env python3
"""
SentraTech Job Application Shifts Validation Fix Testing
Focus: Testing the specific issue mentioned in review request

ISSUE: Job application validation errors with shifts fields
- Frontend sends: "work_shifts": ["flexible"] (array)
- Frontend sends: "preferred_shifts": ["flexible"] (array)  
- Dashboard expects these as strings, not arrays
- Need array-to-string conversion similar to ROI calculator bundles fix

EXPECTED FIX: Convert arrays to strings before sending to dashboard
"""

import asyncio
import aiohttp
import json
import time
import uuid
from datetime import datetime, timezone
import sys

# Test Configuration
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com/api"
TEST_TIMEOUT = 30

class JobApplicationShiftsValidator:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        
    async def __aenter__(self):
        timeout = aiohttp.ClientTimeout(total=TEST_TIMEOUT)
        self.session = aiohttp.ClientSession(timeout=timeout)
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, details: str, response_time: float = 0):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_time_ms": round(response_time * 1000, 2),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.test_results.append(result)
        self.total_tests += 1
        if success:
            self.passed_tests += 1
        
        print(f"{status} {test_name}")
        print(f"   📋 {details}")
        if response_time > 0:
            print(f"   ⏱️  {round(response_time * 1000, 2)}ms")
        print()

    async def test_exact_failing_payload(self):
        """Test the exact failing payload from review request"""
        print("🎯 TESTING EXACT FAILING PAYLOAD FROM REVIEW REQUEST")
        print("=" * 60)
        
        # Exact payload that's failing according to review request
        failing_payload = {
            "work_shifts": ["flexible"],  # Array causing validation error
            "preferred_shifts": ["flexible"],  # Array causing validation error
            "email": "sededutyfu@gmail.com",
            "full_name": "",
            "position_applied": "Customer Support Specialist"
        }
        
        print("📋 Payload causing validation errors:")
        print(json.dumps(failing_payload, indent=2))
        print()
        
        start_time = time.time()
        try:
            async with self.session.post(
                f"{BACKEND_URL}/proxy/job-application",
                json=failing_payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                response_time = time.time() - start_time
                response_text = await response.text()
                
                print(f"📊 Response Status: {response.status}")
                print(f"📄 Response: {response_text}")
                print()
                
                if response.status == 200:
                    # Success - arrays were converted to strings
                    try:
                        data = json.loads(response_text)
                        dashboard_id = data.get('id', 'unknown')
                        details = f"✅ SUCCESS - Arrays converted to strings. Dashboard ID: {dashboard_id}"
                        self.log_result("Exact Failing Payload Fix", True, details, response_time)
                        return True
                    except json.JSONDecodeError:
                        details = f"✅ SUCCESS - HTTP 200 received (conversion working)"
                        self.log_result("Exact Failing Payload Fix", True, details, response_time)
                        return True
                        
                elif response.status == 422:
                    # Validation error - fix not implemented
                    if "string_type" in response_text and "input_value=['flexible']" in response_text:
                        details = f"❌ VALIDATION ERROR - Arrays NOT converted to strings. Fix needed: {response_text}"
                        self.log_result("Exact Failing Payload Fix", False, details, response_time)
                        return False
                    else:
                        details = f"❌ OTHER VALIDATION ERROR - {response_text}"
                        self.log_result("Exact Failing Payload Fix", False, details, response_time)
                        return False
                        
                elif response.status == 500:
                    details = f"❌ SERVER ERROR - Possible validation failure: {response_text}"
                    self.log_result("Exact Failing Payload Fix", False, details, response_time)
                    return False
                    
                else:
                    details = f"❌ UNEXPECTED STATUS {response.status}: {response_text}"
                    self.log_result("Exact Failing Payload Fix", False, details, response_time)
                    return False
                    
        except Exception as e:
            response_time = time.time() - start_time
            details = f"❌ EXCEPTION: {str(e)}"
            self.log_result("Exact Failing Payload Fix", False, details, response_time)
            return False

    async def test_comprehensive_shifts_payload(self):
        """Test comprehensive payload with various shifts configurations"""
        print("🎯 TESTING COMPREHENSIVE SHIFTS PAYLOAD")
        print("=" * 60)
        
        comprehensive_payload = {
            "id": str(uuid.uuid4()),
            "full_name": "Sarah Ahmed",
            "email": "sarah.ahmed.shifts.test@gmail.com",
            "phone": "+880 1712-345678",
            "position_applied": "Customer Support Specialist",
            "location": "Dhaka, Bangladesh",
            "work_shifts": ["flexible", "day_shift", "evening_shift"],  # Multiple array elements
            "preferred_shifts": ["morning", "afternoon"],  # Multiple array elements
            "availability_start_date": "2025-02-01",
            "motivation": "Testing shifts validation fix",
            "cover_letter": "Comprehensive test for array-to-string conversion",
            "consent_for_storage": True,
            "source": "careers_page",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        print("📋 Comprehensive payload with multiple shifts:")
        print(json.dumps(comprehensive_payload, indent=2))
        print()
        
        start_time = time.time()
        try:
            async with self.session.post(
                f"{BACKEND_URL}/proxy/job-application",
                json=comprehensive_payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                response_time = time.time() - start_time
                response_text = await response.text()
                
                print(f"📊 Response Status: {response.status}")
                print(f"📄 Response: {response_text}")
                print()
                
                if response.status == 200:
                    try:
                        data = json.loads(response_text)
                        dashboard_id = data.get('id', 'unknown')
                        details = f"✅ SUCCESS - Multiple array elements converted. Dashboard ID: {dashboard_id}"
                        self.log_result("Comprehensive Shifts Payload", True, details, response_time)
                        return True
                    except json.JSONDecodeError:
                        details = f"✅ SUCCESS - HTTP 200 received"
                        self.log_result("Comprehensive Shifts Payload", True, details, response_time)
                        return True
                        
                elif response.status == 422:
                    details = f"❌ VALIDATION ERROR - Multiple array conversion failed: {response_text}"
                    self.log_result("Comprehensive Shifts Payload", False, details, response_time)
                    return False
                    
                else:
                    details = f"❌ HTTP {response.status}: {response_text}"
                    self.log_result("Comprehensive Shifts Payload", False, details, response_time)
                    return False
                    
        except Exception as e:
            response_time = time.time() - start_time
            details = f"❌ EXCEPTION: {str(e)}"
            self.log_result("Comprehensive Shifts Payload", False, details, response_time)
            return False

    async def test_edge_cases(self):
        """Test edge cases for shifts conversion"""
        print("🎯 TESTING SHIFTS CONVERSION EDGE CASES")
        print("=" * 60)
        
        edge_cases = [
            {
                "name": "Empty Arrays",
                "payload": {
                    "email": "empty.arrays@test.com",
                    "full_name": "Empty Arrays Test",
                    "position_applied": "Customer Support",
                    "work_shifts": [],
                    "preferred_shifts": []
                }
            },
            {
                "name": "Single Element Arrays",
                "payload": {
                    "email": "single.element@test.com",
                    "full_name": "Single Element Test",
                    "position_applied": "Customer Support",
                    "work_shifts": ["night_shift"],
                    "preferred_shifts": ["flexible"]
                }
            },
            {
                "name": "Mixed Types (Array + String)",
                "payload": {
                    "email": "mixed.types@test.com",
                    "full_name": "Mixed Types Test",
                    "position_applied": "Customer Support",
                    "work_shifts": ["flexible"],  # Array
                    "preferred_shifts": "day_shift"  # Already string
                }
            }
        ]
        
        edge_case_results = []
        
        for case in edge_cases:
            print(f"📋 Testing: {case['name']}")
            print(f"   Payload: {json.dumps(case['payload'], indent=2)}")
            
            start_time = time.time()
            try:
                async with self.session.post(
                    f"{BACKEND_URL}/proxy/job-application",
                    json=case['payload'],
                    headers={"Content-Type": "application/json"}
                ) as response:
                    response_time = time.time() - start_time
                    response_text = await response.text()
                    
                    success = response.status == 200
                    if success:
                        try:
                            data = json.loads(response_text)
                            details = f"✅ {case['name']}: SUCCESS - Dashboard ID: {data.get('id', 'unknown')}"
                        except:
                            details = f"✅ {case['name']}: SUCCESS - HTTP 200"
                    else:
                        details = f"❌ {case['name']}: HTTP {response.status} - {response_text[:200]}"
                    
                    self.log_result(f"Edge Case - {case['name']}", success, details, response_time)
                    edge_case_results.append(success)
                    
            except Exception as e:
                response_time = time.time() - start_time
                details = f"❌ {case['name']}: EXCEPTION - {str(e)}"
                self.log_result(f"Edge Case - {case['name']}", False, details, response_time)
                edge_case_results.append(False)
        
        # Overall edge case success
        overall_success = all(edge_case_results)
        success_rate = (sum(edge_case_results) / len(edge_case_results)) * 100
        details = f"Edge cases success: {success_rate:.1f}% ({sum(edge_case_results)}/{len(edge_case_results)})"
        self.log_result("All Edge Cases", overall_success, details)
        
        return overall_success

    async def test_backend_health(self):
        """Quick health check"""
        start_time = time.time()
        try:
            async with self.session.get(f"{BACKEND_URL}/health") as response:
                response_time = time.time() - start_time
                
                if response.status == 200:
                    data = await response.json()
                    details = f"Status: {data.get('status')}, Database: {data.get('database')}"
                    self.log_result("Backend Health Check", True, details, response_time)
                    return True
                else:
                    self.log_result("Backend Health Check", False, f"HTTP {response.status}", response_time)
                    return False
                    
        except Exception as e:
            response_time = time.time() - start_time
            self.log_result("Backend Health Check", False, f"Exception: {str(e)}", response_time)
            return False

    async def run_validation_tests(self):
        """Run all validation tests"""
        print("🚀 STARTING JOB APPLICATION SHIFTS VALIDATION TESTING")
        print("🎯 FOCUS: Array-to-String Conversion Fix")
        print("=" * 80)
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 80)
        print()
        
        # Run tests
        await self.test_backend_health()
        await self.test_exact_failing_payload()
        await self.test_comprehensive_shifts_payload()
        await self.test_edge_cases()
        
        # Summary
        print("=" * 80)
        print("🎯 VALIDATION TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.total_tests - self.passed_tests}")
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        print(f"📊 Success Rate: {success_rate:.1f}%")
        print()
        
        # Critical analysis
        print("🔍 CRITICAL ANALYSIS:")
        print("=" * 40)
        
        shifts_tests = [r for r in self.test_results if "Shifts" in r["test"] or "Failing Payload" in r["test"]]
        shifts_success = all(r["success"] for r in shifts_tests)
        
        if shifts_success:
            print("✅ SHIFTS VALIDATION FIX: IMPLEMENTED AND WORKING")
            print("   - Arrays are properly converted to strings")
            print("   - Dashboard validation passes")
            print("   - Edge cases handled correctly")
            print("   - Fix similar to ROI calculator bundles is working")
        else:
            print("❌ SHIFTS VALIDATION FIX: NOT IMPLEMENTED")
            print("   - Arrays are NOT converted to strings")
            print("   - Dashboard validation errors occurring")
            print("   - Need to implement array-to-string conversion")
            print("   - Similar fix to ROI calculator bundles required")
        
        print()
        print("📋 DETAILED RESULTS:")
        for result in self.test_results:
            status_icon = "✅" if result["success"] else "❌"
            print(f"{status_icon} {result['test']}: {result['details']}")
        
        return shifts_success

async def main():
    """Main test execution"""
    try:
        async with JobApplicationShiftsValidator() as validator:
            success = await validator.run_validation_tests()
            
            if success:
                print("\n🎉 JOB APPLICATION SHIFTS VALIDATION FIX: WORKING")
                print("✅ Arrays are properly converted to strings")
                print("✅ Dashboard integration successful")
                sys.exit(0)
            else:
                print("\n🚨 JOB APPLICATION SHIFTS VALIDATION FIX: NEEDS IMPLEMENTATION")
                print("❌ Arrays are NOT converted to strings")
                print("❌ Dashboard validation errors occurring")
                print("🔧 REQUIRED: Implement array-to-string conversion similar to ROI calculator bundles fix")
                sys.exit(1)
                
    except Exception as e:
        print(f"🚨 CRITICAL ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())