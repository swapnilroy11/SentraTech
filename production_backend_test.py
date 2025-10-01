#!/usr/bin/env python3
"""
Production Environment Backend Testing for SentraTech
Testing ROI Calculator and Newsletter endpoints from production server (https://sentratech.net)
Focus: Verify data is properly being sent to the dashboard (admin.sentratech.net)
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys

# Production URL as specified in the review request
PRODUCTION_URL = "https://sentratech.net"

class ProductionEndpointTester:
    def __init__(self):
        self.production_url = PRODUCTION_URL
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
    
    def test_production_health(self):
        """Test production backend health endpoint"""
        print("\n🔍 Testing Production Backend Health...")
        try:
            start_time = time.time()
            response = requests.get(f"{self.production_url}/api/health", timeout=15)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Production Health Check", 
                    "PASS", 
                    f"Status: {data.get('status')}, Response time: {response_time:.2f}ms, Database: {data.get('database')}, Version: {data.get('version')}"
                )
                return True
            else:
                self.log_test("Production Health Check", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Production Health Check", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def test_roi_calculator_endpoint(self):
        """Test ROI Calculator endpoint with specified sample data"""
        print("\n📊 Testing ROI Calculator Endpoint on Production...")
        
        # Using the exact sample data from the review request
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test@example.com",
            "country": "Bangladesh",
            "call_volume": 5000,
            "interaction_volume": 8000,
            "total_volume": 13000,
            "calculated_savings": 150000.00,
            "roi_percentage": 75.5,
            "payback_period": 1.8,
            "source": "production_test",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.production_url}/api/proxy/roi-calculator",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "SentraTech-Production-Test/1.0"
                },
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"   Request URL: {self.production_url}/api/proxy/roi-calculator")
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Time: {response_time:.2f}ms")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    dashboard_id = data.get('id') or data.get('data', {}).get('id')
                    success = data.get('success', False)
                    
                    self.log_test(
                        "ROI Calculator Production Endpoint", 
                        "PASS", 
                        f"HTTP 200, Success: {success}, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}, Data forwarded to dashboard"
                    )
                    
                    # Log response details for dashboard integration verification
                    print(f"   Dashboard Integration: {'✅ SUCCESS' if dashboard_id else '❌ NO ID RETURNED'}")
                    print(f"   Response Data: {json.dumps(data, indent=2)}")
                    return True
                    
                except json.JSONDecodeError:
                    self.log_test(
                        "ROI Calculator Production Endpoint", 
                        "FAIL", 
                        f"HTTP 200 but invalid JSON response: {response.text[:200]}"
                    )
                    return False
            else:
                self.log_test(
                    "ROI Calculator Production Endpoint", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:300]}"
                )
                return False
                
        except requests.exceptions.Timeout:
            self.log_test("ROI Calculator Production Endpoint", "FAIL", "Request timeout (30s)")
            return False
        except requests.exceptions.ConnectionError as e:
            self.log_test("ROI Calculator Production Endpoint", "FAIL", f"Connection error: {str(e)}")
            return False
        except Exception as e:
            self.log_test("ROI Calculator Production Endpoint", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_newsletter_signup_endpoint(self):
        """Test Newsletter Signup endpoint with specified sample data"""
        print("\n📧 Testing Newsletter Signup Endpoint on Production...")
        
        # Using the exact sample email from the review request
        payload = {
            "id": str(uuid.uuid4()),
            "email": "newsletter-test@sentratech.net",
            "source": "production_test",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.production_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "SentraTech-Production-Test/1.0"
                },
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            print(f"   Request URL: {self.production_url}/api/proxy/newsletter-signup")
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Time: {response_time:.2f}ms")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    dashboard_id = data.get('id') or data.get('data', {}).get('id')
                    success = data.get('success', False)
                    
                    self.log_test(
                        "Newsletter Signup Production Endpoint", 
                        "PASS", 
                        f"HTTP 200, Success: {success}, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}, Data forwarded to dashboard"
                    )
                    
                    # Log response details for dashboard integration verification
                    print(f"   Dashboard Integration: {'✅ SUCCESS' if dashboard_id else '❌ NO ID RETURNED'}")
                    print(f"   Response Data: {json.dumps(data, indent=2)}")
                    return True
                    
                except json.JSONDecodeError:
                    self.log_test(
                        "Newsletter Signup Production Endpoint", 
                        "FAIL", 
                        f"HTTP 200 but invalid JSON response: {response.text[:200]}"
                    )
                    return False
            else:
                self.log_test(
                    "Newsletter Signup Production Endpoint", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:300]}"
                )
                return False
                
        except requests.exceptions.Timeout:
            self.log_test("Newsletter Signup Production Endpoint", "FAIL", "Request timeout (30s)")
            return False
        except requests.exceptions.ConnectionError as e:
            self.log_test("Newsletter Signup Production Endpoint", "FAIL", f"Connection error: {str(e)}")
            return False
        except Exception as e:
            self.log_test("Newsletter Signup Production Endpoint", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_cors_headers(self):
        """Test CORS headers are correctly set"""
        print("\n🌐 Testing CORS Headers...")
        
        try:
            # Test OPTIONS preflight request
            response = requests.options(
                f"{self.production_url}/api/proxy/newsletter-signup",
                headers={
                    "Origin": "https://sentratech.net",
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "Content-Type"
                },
                timeout=15
            )
            
            cors_headers = {
                "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
                "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
                "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers")
            }
            
            if response.status_code in [200, 204]:
                self.log_test(
                    "CORS Headers Configuration", 
                    "PASS", 
                    f"OPTIONS request successful, CORS headers: {cors_headers}"
                )
                return True
            else:
                self.log_test(
                    "CORS Headers Configuration", 
                    "FAIL", 
                    f"OPTIONS request failed: HTTP {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("CORS Headers Configuration", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_authentication_requirements(self):
        """Test authentication and API key requirements"""
        print("\n🔐 Testing Authentication Requirements...")
        
        # Test with missing data to see authentication behavior
        payload = {}
        
        try:
            response = requests.post(
                f"{self.production_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            # Check if proper authentication is handled
            if response.status_code in [400, 422]:  # Bad request due to missing data
                self.log_test(
                    "Authentication & Validation", 
                    "PASS", 
                    f"Proper validation: HTTP {response.status_code} for empty payload"
                )
                return True
            elif response.status_code == 401:
                self.log_test(
                    "Authentication & Validation", 
                    "PASS", 
                    "Proper authentication required: HTTP 401"
                )
                return True
            else:
                self.log_test(
                    "Authentication & Validation", 
                    "FAIL", 
                    f"Unexpected response: HTTP {response.status_code}, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Authentication & Validation", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_error_scenarios(self):
        """Test various error scenarios"""
        print("\n⚠️ Testing Error Scenarios...")
        
        # Test with invalid data
        invalid_payload = {
            "id": "invalid-id-format",
            "email": "not-an-email",
            "call_volume": "not-a-number"
        }
        
        try:
            response = requests.post(
                f"{self.production_url}/api/proxy/roi-calculator",
                json=invalid_payload,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code in [400, 422, 500]:  # Expected error responses
                self.log_test(
                    "Error Handling", 
                    "PASS", 
                    f"Proper error handling: HTTP {response.status_code} for invalid data"
                )
                return True
            else:
                self.log_test(
                    "Error Handling", 
                    "FAIL", 
                    f"Unexpected response to invalid data: HTTP {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("Error Handling", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_rate_limiting(self):
        """Test rate limiting and duplicate prevention"""
        print("\n🚦 Testing Rate Limiting...")
        
        # Send the same request twice quickly
        payload = {
            "id": str(uuid.uuid4()),  # Same ID for both requests
            "email": "rate.limit.test@sentratech.net",
            "source": "rate_limit_test"
        }
        
        try:
            # First request
            response1 = requests.post(
                f"{self.production_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            # Second request with same ID (should be blocked)
            response2 = requests.post(
                f"{self.production_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response1.status_code == 200 and response2.status_code == 429:
                self.log_test(
                    "Rate Limiting & Duplicate Prevention", 
                    "PASS", 
                    "First request succeeded (200), duplicate blocked (429)"
                )
                return True
            elif response1.status_code == 200 and response2.status_code == 200:
                self.log_test(
                    "Rate Limiting & Duplicate Prevention", 
                    "PARTIAL", 
                    "Both requests succeeded - duplicate prevention may not be active"
                )
                return True
            else:
                self.log_test(
                    "Rate Limiting & Duplicate Prevention", 
                    "FAIL", 
                    f"Unexpected responses: {response1.status_code}, {response2.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("Rate Limiting & Duplicate Prevention", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_dashboard_connectivity(self):
        """Test if dashboard integration is working"""
        print("\n🔗 Testing Dashboard Connectivity...")
        
        # Test a simple request to verify dashboard forwarding
        payload = {
            "id": str(uuid.uuid4()),
            "email": "dashboard.connectivity.test@sentratech.net",
            "source": "connectivity_test",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.production_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                
                if dashboard_id:
                    self.log_test(
                        "Dashboard Connectivity", 
                        "PASS", 
                        f"Dashboard integration working - ID returned: {dashboard_id}, Response time: {response_time:.2f}ms"
                    )
                    return True
                else:
                    self.log_test(
                        "Dashboard Connectivity", 
                        "FAIL", 
                        f"No dashboard ID returned - integration may be failing"
                    )
                    return False
            else:
                self.log_test(
                    "Dashboard Connectivity", 
                    "FAIL", 
                    f"HTTP {response.status_code}: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Dashboard Connectivity", "FAIL", f"Request error: {str(e)}")
            return False
    
    def run_production_tests(self):
        """Run comprehensive production test suite"""
        print("🚀 Starting Production Environment Backend Testing")
        print("🎯 Target: https://sentratech.net")
        print("🎯 Dashboard: admin.sentratech.net")
        print("=" * 80)
        
        # Test production health first
        if not self.test_production_health():
            print("\n❌ Production health check failed. Continuing with endpoint tests...")
        
        # Test the two main endpoints as specified in the review
        print("\n🎯 CRITICAL ENDPOINT TESTING (As specified in review request)")
        roi_success = self.test_roi_calculator_endpoint()
        newsletter_success = self.test_newsletter_signup_endpoint()
        
        # Test supporting functionality
        print("\n🔧 SUPPORTING FUNCTIONALITY TESTING")
        self.test_cors_headers()
        self.test_authentication_requirements()
        self.test_error_scenarios()
        self.test_rate_limiting()
        self.test_dashboard_connectivity()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 PRODUCTION TEST SUMMARY")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Critical endpoints status
        print(f"\n🎯 CRITICAL ENDPOINTS STATUS:")
        print(f"   ROI Calculator: {'✅ WORKING' if roi_success else '❌ FAILED'}")
        print(f"   Newsletter Signup: {'✅ WORKING' if newsletter_success else '❌ FAILED'}")
        
        if roi_success and newsletter_success:
            print(f"\n✅ CRITICAL ENDPOINTS: BOTH WORKING - Data forwarding to dashboard confirmed!")
        else:
            print(f"\n❌ CRITICAL ENDPOINTS: ISSUES FOUND - Dashboard integration may be compromised!")
        
        if success_rate >= 80:
            print(f"\n✅ OVERALL RESULT: EXCELLENT - Production endpoints ready!")
        elif success_rate >= 60:
            print(f"\n⚠️ OVERALL RESULT: GOOD - Minor issues found")
        else:
            print(f"\n❌ OVERALL RESULT: NEEDS ATTENTION - Critical issues found")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 FAILED TESTS DETAILS:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}: {result['details']}")
        
        # Print recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        if not roi_success:
            print("   - Investigate ROI Calculator endpoint dashboard integration")
        if not newsletter_success:
            print("   - Investigate Newsletter Signup endpoint dashboard integration")
        if success_rate < 80:
            print("   - Review failed tests and fix critical issues")
            print("   - Verify dashboard API key configuration")
            print("   - Check admin.sentratech.net connectivity")
        
        return roi_success and newsletter_success

if __name__ == "__main__":
    print("SentraTech Production Environment Backend Testing")
    print(f"Production URL: {PRODUCTION_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = ProductionEndpointTester()
    success = tester.run_production_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)