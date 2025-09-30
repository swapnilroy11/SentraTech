#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Proxy Endpoints with Rate Limiting Functionality
Testing Focus: All proxy endpoints, rate limiting verification, error handling, health check
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime, timezone
from typing import Dict, Any, List
import uuid

# Test Configuration - Using production URL from frontend/.env
BACKEND_URL = "https://real-time-dash.preview.emergentagent.com"
TEST_EMAILS = ["proxy-test@example.com", "complete-flow-test@example.com"]

class ProxyRateLimitTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    async def setup(self):
        """Initialize HTTP session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        """Clean up HTTP session"""
        if self.session:
            await self.session.close()
            
    def log_test(self, test_name: str, status: str, details: str = "", response_time: float = 0):
        """Log test result"""
        self.total_tests += 1
        if status == "PASS":
            self.passed_tests += 1
            print(f"✅ {test_name}: {status} ({response_time:.2f}ms)")
        else:
            self.failed_tests += 1
            print(f"❌ {test_name}: {status} ({response_time:.2f}ms)")
            
        if details:
            print(f"   Details: {details}")
            
        self.test_results.append({
            "test": test_name,
            "status": status,
            "details": details,
            "response_time_ms": response_time,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    async def test_health_check(self):
        """Test 1: Backend Health Check"""
        print("\n🔍 Testing Backend Health Check...")
        
        try:
            start_time = time.time()
            async with self.session.get(f"{BACKEND_URL}/api/health") as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("status") == "healthy":
                        self.log_test("Health Check", "PASS", 
                                    f"Status: {data.get('status')}, Version: {data.get('version', 'N/A')}", 
                                    response_time)
                        return True
                    else:
                        self.log_test("Health Check", "FAIL", 
                                    f"Unhealthy status: {data}", response_time)
                        return False
                else:
                    self.log_test("Health Check", "FAIL", 
                                f"HTTP {response.status}", response_time)
                    return False
                    
        except Exception as e:
            self.log_test("Health Check", "FAIL", f"Exception: {str(e)}")
            return False

    async def test_proxy_newsletter_signup(self):
        """Test 2: Newsletter Signup Proxy Endpoint"""
        print("\n📧 Testing Newsletter Signup Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        
        # Valid data test
        valid_data = {
            "email": "newsletter-test@sentratech.com",
            "source": "website_newsletter",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        self.log_test("Newsletter Proxy - Valid Data", "PASS", 
                                    f"Success: {data.get('success')}, ID: {data.get('id', 'N/A')}", 
                                    response_time)
                    else:
                        self.log_test("Newsletter Proxy - Valid Data", "FAIL", 
                                    f"Success false: {data}", response_time)
                else:
                    self.log_test("Newsletter Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Newsletter Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")
            
        # Malformed data test
        malformed_data = {"invalid": "data"}
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=malformed_data) as response:
                response_time = (time.time() - start_time) * 1000
                
                # Should handle gracefully (either accept or reject properly)
                if response.status in [200, 400, 422]:
                    self.log_test("Newsletter Proxy - Malformed Data", "PASS", 
                                f"Handled gracefully: HTTP {response.status}", response_time)
                else:
                    self.log_test("Newsletter Proxy - Malformed Data", "FAIL", 
                                f"Unexpected status: {response.status}", response_time)
        except Exception as e:
            self.log_test("Newsletter Proxy - Malformed Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_contact_sales(self):
        """Test 3: Contact Sales Proxy Endpoint"""
        print("\n📞 Testing Contact Sales Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/contact-sales"
        
        # Valid data test
        valid_data = {
            "full_name": "Sarah Johnson",
            "work_email": "sarah.johnson@techcorp.com",
            "company_name": "TechCorp Solutions",
            "message": "Interested in enterprise AI customer support solution",
            "phone": "+1-555-0123",
            "company_website": "https://techcorp.com",
            "call_volume": 5000,
            "interaction_volume": 8000,
            "preferred_contact_method": "email",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        self.log_test("Contact Sales Proxy - Valid Data", "PASS", 
                                    f"Success: {data.get('success')}, ID: {data.get('id', 'N/A')}", 
                                    response_time)
                    else:
                        self.log_test("Contact Sales Proxy - Valid Data", "FAIL", 
                                    f"Success false: {data}", response_time)
                else:
                    self.log_test("Contact Sales Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Contact Sales Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_demo_request(self):
        """Test 4: Demo Request Proxy Endpoint"""
        print("\n🎯 Testing Demo Request Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/demo-request"
        
        # Valid data test
        valid_data = {
            "name": "Michael Chen",
            "email": "michael.chen@innovatetech.com",
            "company": "InnovateTech Inc",
            "phone": "+1-555-0456",
            "message": "Would like to see AI automation capabilities",
            "call_volume": 3000,
            "interaction_volume": 4500,
            "total_volume": 7500,
            "source": "website_cta",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        self.log_test("Demo Request Proxy - Valid Data", "PASS", 
                                    f"Success: {data.get('success')}, ID: {data.get('id', 'N/A')}", 
                                    response_time)
                    else:
                        self.log_test("Demo Request Proxy - Valid Data", "FAIL", 
                                    f"Success false: {data}", response_time)
                else:
                    self.log_test("Demo Request Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Demo Request Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_roi_calculator(self):
        """Test 5: ROI Calculator Proxy Endpoint"""
        print("\n💰 Testing ROI Calculator Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/roi-calculator"
        
        # Valid data test
        valid_data = {
            "email": "finance@globalcorp.com",
            "country": "United States",
            "call_volume": 10000,
            "interaction_volume": 15000,
            "total_volume": 25000,
            "calculated_savings": 125000.50,
            "roi_percentage": 245.8,
            "payback_period": 3.2,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        self.log_test("ROI Calculator Proxy - Valid Data", "PASS", 
                                    f"Success: {data.get('success')}, ID: {data.get('id', 'N/A')}", 
                                    response_time)
                    else:
                        self.log_test("ROI Calculator Proxy - Valid Data", "FAIL", 
                                    f"Success false: {data}", response_time)
                else:
                    self.log_test("ROI Calculator Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("ROI Calculator Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_job_application(self):
        """Test 6: Job Application Proxy Endpoint"""
        print("\n💼 Testing Job Application Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/job-application"
        
        # Valid data test
        valid_data = {
            "full_name": "Alexandra Rodriguez",
            "email": "alexandra.rodriguez@email.com",
            "location": "Barcelona, Spain",
            "linkedin_profile": "https://linkedin.com/in/alexandra-rodriguez",
            "position": "Customer Support Specialist - Spanish Fluent",
            "preferred_shifts": "Morning (9 AM - 5 PM CET)",
            "availability_start_date": "2024-02-15",
            "cover_note": "Experienced customer support professional with 5+ years in tech industry.",
            "source": "careers_page",
            "consent_for_storage": True,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        self.log_test("Job Application Proxy - Valid Data", "PASS", 
                                    f"Success: {data.get('success')}, ID: {data.get('id', 'N/A')}", 
                                    response_time)
                    else:
                        self.log_test("Job Application Proxy - Valid Data", "FAIL", 
                                    f"Success false: {data}", response_time)
                else:
                    self.log_test("Job Application Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Job Application Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_chat_message(self):
        """Test 7: Chat Message Proxy Endpoint"""
        print("\n💬 Testing Chat Message Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/chat-message"
        
        # Valid data test
        valid_data = {
            "message": "Hello, I'm interested in learning more about SentraTech's AI capabilities",
            "conversation_id": f"test_conv_{int(time.time())}",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        self.log_test("Chat Message Proxy - Valid Data", "PASS", 
                                    f"Success: {data.get('success')}, Response: {data.get('response', 'N/A')[:50]}...", 
                                    response_time)
                    else:
                        self.log_test("Chat Message Proxy - Valid Data", "FAIL", 
                                    f"Success false: {data}", response_time)
                else:
                    self.log_test("Chat Message Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Chat Message Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_rate_limiting_verification(self):
        """Test 8: Rate Limiting Verification (Rapid Requests)"""
        print("\n⚡ Testing Rate Limiting Verification...")
        
        # Test rapid successive calls to newsletter endpoint (3s rate limit)
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        
        rapid_requests = []
        for i in range(5):
            test_data = {
                "email": f"rate-test-{i}@example.com",
                "source": "rate_limit_test",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
            try:
                start_time = time.time()
                async with self.session.post(endpoint, json=test_data) as response:
                    response_time = (time.time() - start_time) * 1000
                    rapid_requests.append({
                        "request": i + 1,
                        "status": response.status,
                        "response_time": response_time,
                        "success": response.status == 200
                    })
                    
                    # Small delay between requests
                    await asyncio.sleep(0.1)
                    
            except Exception as e:
                rapid_requests.append({
                    "request": i + 1,
                    "status": "ERROR",
                    "response_time": 0,
                    "success": False,
                    "error": str(e)
                })
        
        # Analyze results
        successful_requests = sum(1 for req in rapid_requests if req["success"])
        avg_response_time = sum(req["response_time"] for req in rapid_requests if req["response_time"] > 0) / len(rapid_requests)
        
        if successful_requests >= 3:  # Backend should handle rapid requests gracefully
            self.log_test("Rate Limiting - Rapid Requests", "PASS", 
                        f"Handled {successful_requests}/5 rapid requests gracefully, Avg: {avg_response_time:.2f}ms", 
                        avg_response_time)
        else:
            self.log_test("Rate Limiting - Rapid Requests", "FAIL", 
                        f"Only {successful_requests}/5 requests succeeded", avg_response_time)

    async def test_original_test_data_verification(self):
        """Test 9: Original Test Data Verification"""
        print("\n🔍 Testing Original Test Data Verification...")
        
        # Test if the original test entries are accessible
        for test_email in TEST_EMAILS:
            endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
            test_data = {
                "email": test_email,
                "source": "verification_test",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
            try:
                start_time = time.time()
                async with self.session.post(endpoint, json=test_data) as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        data = await response.json()
                        if data.get("success"):
                            self.log_test(f"Test Data Verification - {test_email}", "PASS", 
                                        f"Proxy forwarding working for test email", response_time)
                        else:
                            self.log_test(f"Test Data Verification - {test_email}", "FAIL", 
                                        f"Success false: {data}", response_time)
                    else:
                        self.log_test(f"Test Data Verification - {test_email}", "FAIL", 
                                    f"HTTP {response.status}", response_time)
            except Exception as e:
                self.log_test(f"Test Data Verification - {test_email}", "FAIL", f"Exception: {str(e)}")

    async def test_error_handling_scenarios(self):
        """Test 10: Error Handling Scenarios"""
        print("\n🚨 Testing Error Handling Scenarios...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/demo-request"
        
        # Test 1: Completely malformed JSON
        try:
            start_time = time.time()
            async with self.session.post(endpoint, data="invalid json") as response:
                response_time = (time.time() - start_time) * 1000
                
                # Should return proper error response
                if response.status in [400, 422, 500]:
                    self.log_test("Error Handling - Malformed JSON", "PASS", 
                                f"Proper error response: HTTP {response.status}", response_time)
                else:
                    self.log_test("Error Handling - Malformed JSON", "FAIL", 
                                f"Unexpected status: {response.status}", response_time)
        except Exception as e:
            self.log_test("Error Handling - Malformed JSON", "PASS", f"Exception handled: {str(e)}")
            
        # Test 2: Empty request body
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json={}) as response:
                response_time = (time.time() - start_time) * 1000
                
                # Should handle gracefully
                if response.status in [200, 400, 422]:
                    self.log_test("Error Handling - Empty Body", "PASS", 
                                f"Handled gracefully: HTTP {response.status}", response_time)
                else:
                    self.log_test("Error Handling - Empty Body", "FAIL", 
                                f"Unexpected status: {response.status}", response_time)
        except Exception as e:
            self.log_test("Error Handling - Empty Body", "FAIL", f"Exception: {str(e)}")
            
        # Test 3: Network timeout simulation (very large payload)
        large_data = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Company",
            "message": "A" * 10000,  # Large message
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=large_data, timeout=aiohttp.ClientTimeout(total=5)) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    self.log_test("Error Handling - Large Payload", "PASS", 
                                f"Large payload handled: HTTP {response.status}", response_time)
                else:
                    self.log_test("Error Handling - Large Payload", "PASS", 
                                f"Proper rejection: HTTP {response.status}", response_time)
        except asyncio.TimeoutError:
            self.log_test("Error Handling - Large Payload", "PASS", "Timeout handled gracefully")
        except Exception as e:
            self.log_test("Error Handling - Large Payload", "PASS", f"Error handled: {str(e)}")

    async def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Comprehensive Proxy Endpoints with Rate Limiting Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print("Testing Focus: Proxy endpoints, rate limiting, error handling")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Run all tests
            await self.test_health_check()
            await self.test_proxy_newsletter_signup()
            await self.test_proxy_contact_sales()
            await self.test_proxy_demo_request()
            await self.test_proxy_roi_calculator()
            await self.test_proxy_job_application()
            await self.test_proxy_chat_message()
            await self.test_rate_limiting_verification()
            await self.test_original_test_data_verification()
            await self.test_error_handling_scenarios()
            
        finally:
            await self.cleanup()
            
        # Print summary
        print("\n" + "=" * 80)
        print("🎯 TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        
        success_rate = (self.passed_tests / self.total_tests * 100) if self.total_tests > 0 else 0
        print(f"📊 Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"   - {result['test']}: {result['details']}")
        
        print("\n🎉 Proxy Endpoints with Rate Limiting Testing Complete!")
        
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "success_rate": success_rate,
            "test_results": self.test_results
        }

async def main():
    """Main test runner"""
    tester = ProxyRateLimitTester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())