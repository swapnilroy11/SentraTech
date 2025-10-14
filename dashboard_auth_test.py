#!/usr/bin/env python3
"""
Dashboard Authentication Endpoint Testing
Tests the /api/dashboard/auth/login endpoint with various scenarios
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime

# Backend URL from frontend environment
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"
AUTH_ENDPOINT = f"{BACKEND_URL}/api/dashboard/auth/login"

class DashboardAuthTester:
    def __init__(self):
        self.results = []
        self.total_tests = 0
        self.passed_tests = 0
        
    def log_result(self, test_name, success, details):
        """Log test result"""
        self.total_tests += 1
        if success:
            self.passed_tests += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
            
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        print()

    async def test_valid_credentials(self, session):
        """Test Case 1: Valid credentials should return HTTP 200 with success: true"""
        test_name = "Valid Credentials Test"
        try:
            payload = {
                "email": "admin@sentratech.net",
                "password": "sentratech2025"
            }
            
            async with session.post(AUTH_ENDPOINT, json=payload) as response:
                status_code = response.status
                response_data = await response.json()
                
                # Check status code
                if status_code != 200:
                    self.log_result(test_name, False, f"Expected status 200, got {status_code}")
                    return
                
                # Check response format
                if not isinstance(response_data, dict):
                    self.log_result(test_name, False, f"Response is not JSON object: {type(response_data)}")
                    return
                
                # Check success field
                if response_data.get("success") != True:
                    self.log_result(test_name, False, f"Expected success: true, got success: {response_data.get('success')}")
                    return
                
                # Check required fields
                required_fields = ["success", "message", "user"]
                missing_fields = [field for field in required_fields if field not in response_data]
                if missing_fields:
                    self.log_result(test_name, False, f"Missing required fields: {missing_fields}")
                    return
                
                # Check user object
                user = response_data.get("user", {})
                if not isinstance(user, dict):
                    self.log_result(test_name, False, f"User field is not an object: {type(user)}")
                    return
                
                if user.get("email") != "admin@sentratech.net":
                    self.log_result(test_name, False, f"User email mismatch: expected admin@sentratech.net, got {user.get('email')}")
                    return
                
                if user.get("role") != "admin":
                    self.log_result(test_name, False, f"User role mismatch: expected admin, got {user.get('role')}")
                    return
                
                self.log_result(test_name, True, f"Status: {status_code}, Response: {json.dumps(response_data, indent=2)}")
                
        except Exception as e:
            self.log_result(test_name, False, f"Exception occurred: {str(e)}")

    async def test_invalid_credentials(self, session):
        """Test Case 2: Invalid credentials should return HTTP 401 with success: false"""
        test_name = "Invalid Credentials Test"
        try:
            payload = {
                "email": "admin@sentratech.net",
                "password": "wrongpassword"
            }
            
            async with session.post(AUTH_ENDPOINT, json=payload) as response:
                status_code = response.status
                response_data = await response.json()
                
                # Check status code
                if status_code != 401:
                    self.log_result(test_name, False, f"Expected status 401, got {status_code}")
                    return
                
                # Check response format
                if not isinstance(response_data, dict):
                    self.log_result(test_name, False, f"Response is not JSON object: {type(response_data)}")
                    return
                
                # Check success field
                if response_data.get("success") != False:
                    self.log_result(test_name, False, f"Expected success: false, got success: {response_data.get('success')}")
                    return
                
                # Check error field
                if "error" not in response_data:
                    self.log_result(test_name, False, "Missing error field in response")
                    return
                
                self.log_result(test_name, True, f"Status: {status_code}, Response: {json.dumps(response_data, indent=2)}")
                
        except Exception as e:
            self.log_result(test_name, False, f"Exception occurred: {str(e)}")

    async def test_invalid_email(self, session):
        """Test Case 3: Invalid email should return HTTP 401 with success: false"""
        test_name = "Invalid Email Test"
        try:
            payload = {
                "email": "wrong@sentratech.net",
                "password": "sentratech2025"
            }
            
            async with session.post(AUTH_ENDPOINT, json=payload) as response:
                status_code = response.status
                response_data = await response.json()
                
                # Check status code
                if status_code != 401:
                    self.log_result(test_name, False, f"Expected status 401, got {status_code}")
                    return
                
                # Check success field
                if response_data.get("success") != False:
                    self.log_result(test_name, False, f"Expected success: false, got success: {response_data.get('success')}")
                    return
                
                self.log_result(test_name, True, f"Status: {status_code}, Response: {json.dumps(response_data, indent=2)}")
                
        except Exception as e:
            self.log_result(test_name, False, f"Exception occurred: {str(e)}")

    async def test_missing_email(self, session):
        """Test Case 4: Missing email should return appropriate error response"""
        test_name = "Missing Email Test"
        try:
            payload = {
                "password": "sentratech2025"
            }
            
            async with session.post(AUTH_ENDPOINT, json=payload) as response:
                status_code = response.status
                response_data = await response.json()
                
                # Should return error (401 or 400)
                if status_code not in [400, 401]:
                    self.log_result(test_name, False, f"Expected status 400 or 401, got {status_code}")
                    return
                
                # Check success field
                if response_data.get("success") != False:
                    self.log_result(test_name, False, f"Expected success: false, got success: {response_data.get('success')}")
                    return
                
                self.log_result(test_name, True, f"Status: {status_code}, Response: {json.dumps(response_data, indent=2)}")
                
        except Exception as e:
            self.log_result(test_name, False, f"Exception occurred: {str(e)}")

    async def test_missing_password(self, session):
        """Test Case 5: Missing password should return appropriate error response"""
        test_name = "Missing Password Test"
        try:
            payload = {
                "email": "admin@sentratech.net"
            }
            
            async with session.post(AUTH_ENDPOINT, json=payload) as response:
                status_code = response.status
                response_data = await response.json()
                
                # Should return error (401 or 400)
                if status_code not in [400, 401]:
                    self.log_result(test_name, False, f"Expected status 400 or 401, got {status_code}")
                    return
                
                # Check success field
                if response_data.get("success") != False:
                    self.log_result(test_name, False, f"Expected success: false, got success: {response_data.get('success')}")
                    return
                
                self.log_result(test_name, True, f"Status: {status_code}, Response: {json.dumps(response_data, indent=2)}")
                
        except Exception as e:
            self.log_result(test_name, False, f"Exception occurred: {str(e)}")

    async def test_empty_payload(self, session):
        """Test Case 6: Empty payload should return appropriate error response"""
        test_name = "Empty Payload Test"
        try:
            payload = {}
            
            async with session.post(AUTH_ENDPOINT, json=payload) as response:
                status_code = response.status
                response_data = await response.json()
                
                # Should return error (401 or 400)
                if status_code not in [400, 401]:
                    self.log_result(test_name, False, f"Expected status 400 or 401, got {status_code}")
                    return
                
                # Check success field
                if response_data.get("success") != False:
                    self.log_result(test_name, False, f"Expected success: false, got success: {response_data.get('success')}")
                    return
                
                self.log_result(test_name, True, f"Status: {status_code}, Response: {json.dumps(response_data, indent=2)}")
                
        except Exception as e:
            self.log_result(test_name, False, f"Exception occurred: {str(e)}")

    async def test_malformed_json(self, session):
        """Test Case 7: Malformed JSON should return appropriate error response"""
        test_name = "Malformed JSON Test"
        try:
            # Send malformed JSON
            async with session.post(AUTH_ENDPOINT, data="invalid json") as response:
                status_code = response.status
                
                # Should return error (400 or 422)
                if status_code not in [400, 422]:
                    self.log_result(test_name, False, f"Expected status 400 or 422, got {status_code}")
                    return
                
                self.log_result(test_name, True, f"Status: {status_code}, Correctly rejected malformed JSON")
                
        except Exception as e:
            self.log_result(test_name, False, f"Exception occurred: {str(e)}")

    async def run_all_tests(self):
        """Run all authentication tests"""
        print("🔐 DASHBOARD AUTHENTICATION ENDPOINT TESTING")
        print("=" * 60)
        print(f"Testing endpoint: {AUTH_ENDPOINT}")
        print()
        
        timeout = aiohttp.ClientTimeout(total=30)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            # Test valid credentials
            await self.test_valid_credentials(session)
            
            # Test invalid credentials
            await self.test_invalid_credentials(session)
            
            # Test invalid email
            await self.test_invalid_email(session)
            
            # Test missing fields
            await self.test_missing_email(session)
            await self.test_missing_password(session)
            await self.test_empty_payload(session)
            
            # Test malformed data
            await self.test_malformed_json(session)
        
        # Print summary
        print("=" * 60)
        print("🎯 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests)*100:.1f}%")
        print()
        
        # Print failed tests
        failed_tests = [r for r in self.results if not r["success"]]
        if failed_tests:
            print("❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['details']}")
            print()
        
        # Return success status
        return self.passed_tests == self.total_tests

async def main():
    """Main test execution"""
    tester = DashboardAuthTester()
    success = await tester.run_all_tests()
    
    if success:
        print("🎉 ALL TESTS PASSED - Dashboard authentication is working correctly!")
        sys.exit(0)
    else:
        print("🚨 SOME TESTS FAILED - Dashboard authentication has issues!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())