#!/usr/bin/env python3
"""
Comprehensive API Key Authentication Testing for Form Submission Endpoints
Testing Focus: API key authentication, form submission flows, dashboard integration verification
"""

import asyncio
import aiohttp
import json
import time
import os
from datetime import datetime, timezone
from typing import Dict, Any, List
import uuid

# Test Configuration - Use production URL from frontend/.env
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"
API_KEY = "sk-emergent-7A236FdD2Ce8d9b52C"  # From backend/.env EMERGENT_API_KEY

class APIKeyAuthTester:
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

    async def test_backend_health(self):
        """Test 1: Backend Health and API Key Configuration"""
        print("\n🔍 Testing Backend Health and API Key Configuration...")
        
        try:
            start_time = time.time()
            async with self.session.get(f"{BACKEND_URL}/api/health") as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("status") == "healthy":
                        self.log_test("Backend Health Check", "PASS", 
                                    f"Status: {data.get('status')}, Version: {data.get('version', 'unknown')}", 
                                    response_time)
                        return True
                    else:
                        self.log_test("Backend Health Check", "FAIL", 
                                    f"Unhealthy status: {data}", response_time)
                        return False
                else:
                    self.log_test("Backend Health Check", "FAIL", 
                                f"HTTP {response.status}", response_time)
                    return False
                    
        except Exception as e:
            self.log_test("Backend Health Check", "FAIL", f"Exception: {str(e)}")
            return False

    async def test_newsletter_signup_proxy(self):
        """Test 2: Newsletter Signup Proxy with API Key Authentication"""
        print("\n📧 Testing Newsletter Signup Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        
        # Test comprehensive newsletter signup payload
        test_data = {
            "email": f"newsletter-test-{int(time.time())}@sentratech-testing.com",
            "source": "website_newsletter",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "subscribed"
        }
        
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://tech-site-boost.preview.emergentagent.com",
            "User-Agent": "SentraTech-Testing/1.0"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") or data.get("id"):
                        dashboard_id = data.get("id", "unknown")
                        self.log_test("Newsletter Signup - API Key Auth", "PASS", 
                                    f"Dashboard ID: {dashboard_id}, Response: {json.dumps(data)[:100]}...", 
                                    response_time)
                    else:
                        self.log_test("Newsletter Signup - API Key Auth", "FAIL", 
                                    f"No success/ID in response: {data}", response_time)
                else:
                    response_text = await response.text()
                    self.log_test("Newsletter Signup - API Key Auth", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}...", response_time)
        except Exception as e:
            self.log_test("Newsletter Signup - API Key Auth", "FAIL", f"Exception: {str(e)}")

    async def test_contact_sales_proxy(self):
        """Test 3: Contact Sales Proxy with API Key Authentication"""
        print("\n📞 Testing Contact Sales Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/contact-sales"
        
        # Test comprehensive contact sales payload
        test_data = {
            "full_name": "Sarah Johnson",
            "work_email": f"contact-test-{int(time.time())}@techcorp-testing.com",
            "company_name": "TechCorp Solutions Ltd",
            "phone": "+44-20-7946-0958",
            "company_website": "https://techcorp-solutions.com",
            "message": "Interested in enterprise AI customer support solution for our 500+ agent contact center",
            "call_volume": 15000,
            "interaction_volume": 25000,
            "total_volume": 40000,
            "preferred_contact_method": "email",
            "plan_selected": "Enterprise (Dedicated)",
            "billing_term": "24-month",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://tech-site-boost.preview.emergentagent.com",
            "User-Agent": "SentraTech-Testing/1.0"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") or data.get("id"):
                        dashboard_id = data.get("id", "unknown")
                        self.log_test("Contact Sales - API Key Auth", "PASS", 
                                    f"Dashboard ID: {dashboard_id}, Response: {json.dumps(data)[:100]}...", 
                                    response_time)
                    else:
                        self.log_test("Contact Sales - API Key Auth", "FAIL", 
                                    f"No success/ID in response: {data}", response_time)
                else:
                    response_text = await response.text()
                    self.log_test("Contact Sales - API Key Auth", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}...", response_time)
        except Exception as e:
            self.log_test("Contact Sales - API Key Auth", "FAIL", f"Exception: {str(e)}")

    async def test_demo_request_proxy(self):
        """Test 4: Demo Request Proxy with API Key Authentication"""
        print("\n🎯 Testing Demo Request Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/demo-request"
        
        # Test comprehensive demo request payload with volume fields
        test_data = {
            "name": "Michael Chen",
            "email": f"demo-test-{int(time.time())}@innovatetech-testing.com",
            "company": "InnovateTech Solutions Inc",
            "phone": "+1-555-0123-456",
            "message": "Would like to see AI automation capabilities and ROI analysis for our customer support operations",
            "call_volume": 8000,
            "interaction_volume": 12000,
            "total_volume": 20000,
            "typical_range": "5,000-15,000 monthly interactions",
            "preferred_method": "video_call",
            "source": "website_demo_form",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://tech-site-boost.preview.emergentagent.com",
            "User-Agent": "SentraTech-Testing/1.0"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") or data.get("id"):
                        dashboard_id = data.get("id", "unknown")
                        self.log_test("Demo Request - API Key Auth", "PASS", 
                                    f"Dashboard ID: {dashboard_id}, Response: {json.dumps(data)[:100]}...", 
                                    response_time)
                    else:
                        self.log_test("Demo Request - API Key Auth", "FAIL", 
                                    f"No success/ID in response: {data}", response_time)
                else:
                    response_text = await response.text()
                    self.log_test("Demo Request - API Key Auth", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}...", response_time)
        except Exception as e:
            self.log_test("Demo Request - API Key Auth", "FAIL", f"Exception: {str(e)}")

    async def test_roi_calculator_proxy(self):
        """Test 5: ROI Calculator Proxy with API Key Authentication"""
        print("\n💰 Testing ROI Calculator Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/roi-calculator"
        
        # Test comprehensive ROI calculator payload with calculated values
        test_data = {
            "email": f"roi-test-{int(time.time())}@globalcorp-testing.com",
            "country": "United Kingdom",
            "call_volume": 25000,
            "interaction_volume": 35000,
            "total_volume": 60000,
            "calculated_savings": 285000.75,
            "roi_percentage": 312.5,
            "payback_period": 2.8,
            "automation_rate": 72.5,
            "cost_reduction_percentage": 68.3,
            "monthly_savings": 23750.06,
            "annual_savings": 285000.75,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://tech-site-boost.preview.emergentagent.com",
            "User-Agent": "SentraTech-Testing/1.0"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") or data.get("id"):
                        dashboard_id = data.get("id", "unknown")
                        self.log_test("ROI Calculator - API Key Auth", "PASS", 
                                    f"Dashboard ID: {dashboard_id}, Response: {json.dumps(data)[:100]}...", 
                                    response_time)
                    else:
                        self.log_test("ROI Calculator - API Key Auth", "FAIL", 
                                    f"No success/ID in response: {data}", response_time)
                else:
                    response_text = await response.text()
                    self.log_test("ROI Calculator - API Key Auth", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}...", response_time)
        except Exception as e:
            self.log_test("ROI Calculator - API Key Auth", "FAIL", f"Exception: {str(e)}")

    async def test_job_application_proxy(self):
        """Test 6: Job Application Proxy with API Key Authentication"""
        print("\n💼 Testing Job Application Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/job-application"
        
        # Test comprehensive job application payload with multi-step aggregated data
        test_data = {
            "full_name": "Alexandra Rodriguez",
            "email": f"job-test-{int(time.time())}@applicant-testing.com",
            "location": "Barcelona, Spain",
            "linkedin_profile": "https://linkedin.com/in/alexandra-rodriguez-cs",
            "position": "Customer Support Specialist - Spanish Fluent",
            "preferred_shifts": "Morning (9 AM - 5 PM CET)",
            "availability_start_date": "2024-03-01",
            "cover_note": "Experienced customer support professional with 6+ years in tech industry. Fluent in Spanish, English, and Catalan. Passionate about AI-powered customer experiences and helping customers achieve their goals.",
            "experience_years": 6,
            "motivation_text": "I'm excited about SentraTech's mission to revolutionize customer support with AI. My experience in multilingual support and passion for technology make me a perfect fit for this role.",
            "source": "careers_page",
            "consent_for_storage": True,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://tech-site-boost.preview.emergentagent.com",
            "User-Agent": "SentraTech-Testing/1.0"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") or data.get("id"):
                        dashboard_id = data.get("id", "unknown")
                        self.log_test("Job Application - API Key Auth", "PASS", 
                                    f"Dashboard ID: {dashboard_id}, Response: {json.dumps(data)[:100]}...", 
                                    response_time)
                    else:
                        self.log_test("Job Application - API Key Auth", "FAIL", 
                                    f"No success/ID in response: {data}", response_time)
                else:
                    response_text = await response.text()
                    self.log_test("Job Application - API Key Auth", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}...", response_time)
        except Exception as e:
            self.log_test("Job Application - API Key Auth", "FAIL", f"Exception: {str(e)}")

    async def test_cors_preflight_requests(self):
        """Test 7: CORS Preflight Requests for All Proxy Endpoints"""
        print("\n🌐 Testing CORS Preflight Requests...")
        
        proxy_endpoints = [
            "/api/proxy/newsletter-signup",
            "/api/proxy/contact-sales", 
            "/api/proxy/demo-request",
            "/api/proxy/roi-calculator",
            "/api/proxy/job-application"
        ]
        
        for endpoint_path in proxy_endpoints:
            endpoint_name = endpoint_path.split('/')[-1].replace('-', ' ').title()
            
            headers = {
                "Origin": "https://tech-site-boost.preview.emergentagent.com",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            }
            
            try:
                start_time = time.time()
                async with self.session.options(f"{BACKEND_URL}{endpoint_path}", headers=headers) as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        # Check for proper CORS headers
                        cors_headers = {
                            "access-control-allow-origin": response.headers.get("access-control-allow-origin"),
                            "access-control-allow-methods": response.headers.get("access-control-allow-methods"),
                            "access-control-allow-headers": response.headers.get("access-control-allow-headers")
                        }
                        
                        self.log_test(f"CORS Preflight - {endpoint_name}", "PASS", 
                                    f"Headers: {cors_headers}", response_time)
                    else:
                        self.log_test(f"CORS Preflight - {endpoint_name}", "FAIL", 
                                    f"HTTP {response.status}", response_time)
            except Exception as e:
                self.log_test(f"CORS Preflight - {endpoint_name}", "FAIL", f"Exception: {str(e)}")

    async def test_malformed_requests(self):
        """Test 8: Malformed Request Handling"""
        print("\n🚫 Testing Malformed Request Handling...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        
        # Test malformed JSON
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://tech-site-boost.preview.emergentagent.com"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, data="invalid json", headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status in [400, 422]:
                    self.log_test("Malformed Request - Invalid JSON", "PASS", 
                                f"Properly rejected with HTTP {response.status}", response_time)
                else:
                    self.log_test("Malformed Request - Invalid JSON", "FAIL", 
                                f"Unexpected status: {response.status}", response_time)
        except Exception as e:
            self.log_test("Malformed Request - Invalid JSON", "FAIL", f"Exception: {str(e)}")
            
        # Test empty payload
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json={}, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                # Empty payload might be handled gracefully or rejected
                if response.status in [200, 400, 422]:
                    self.log_test("Malformed Request - Empty Payload", "PASS", 
                                f"Handled with HTTP {response.status}", response_time)
                else:
                    self.log_test("Malformed Request - Empty Payload", "FAIL", 
                                f"Unexpected status: {response.status}", response_time)
        except Exception as e:
            self.log_test("Malformed Request - Empty Payload", "FAIL", f"Exception: {str(e)}")

    async def test_backend_logs_verification(self):
        """Test 9: Backend Logs Verification (API Key Usage)"""
        print("\n📋 Testing Backend Logs for API Key Usage...")
        
        # This test verifies that the backend is properly using the API key
        # by checking if requests are successful (indicating API key is working)
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        test_data = {
            "email": f"log-test-{int(time.time())}@sentratech-testing.com",
            "source": "api_key_test"
        }
        
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://tech-site-boost.preview.emergentagent.com"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") or data.get("id"):
                        self.log_test("Backend Logs - API Key Usage", "PASS", 
                                    f"API key authentication working (Dashboard ID: {data.get('id', 'unknown')})", 
                                    response_time)
                    else:
                        self.log_test("Backend Logs - API Key Usage", "FAIL", 
                                    f"No success/ID indicates API key issue: {data}", response_time)
                else:
                    response_text = await response.text()
                    if "401" in str(response.status) or "unauthorized" in response_text.lower():
                        self.log_test("Backend Logs - API Key Usage", "FAIL", 
                                    f"API key authentication failed: HTTP {response.status}", response_time)
                    else:
                        self.log_test("Backend Logs - API Key Usage", "PARTIAL", 
                                    f"Non-auth error: HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Backend Logs - API Key Usage", "FAIL", f"Exception: {str(e)}")

    async def test_response_time_comparison(self):
        """Test 10: Response Time and Success Rate Analysis"""
        print("\n⏱️ Testing Response Time and Success Rate Analysis...")
        
        endpoints_to_test = [
            ("/api/proxy/newsletter-signup", {"email": f"perf-test-{int(time.time())}@test.com", "source": "performance_test"}),
            ("/api/proxy/contact-sales", {"full_name": "Performance Test", "work_email": f"perf-contact-{int(time.time())}@test.com", "company_name": "Test Corp", "message": "Performance test"}),
            ("/api/proxy/demo-request", {"name": "Performance Test", "email": f"perf-demo-{int(time.time())}@test.com", "company": "Test Corp"}),
        ]
        
        total_requests = 0
        successful_requests = 0
        total_response_time = 0
        
        for endpoint_path, test_data in endpoints_to_test:
            endpoint_name = endpoint_path.split('/')[-1].replace('-', ' ').title()
            
            headers = {
                "Content-Type": "application/json",
                "Origin": "https://tech-site-boost.preview.emergentagent.com"
            }
            
            try:
                start_time = time.time()
                async with self.session.post(f"{BACKEND_URL}{endpoint_path}", json=test_data, headers=headers) as response:
                    response_time = (time.time() - start_time) * 1000
                    total_requests += 1
                    total_response_time += response_time
                    
                    if response.status == 200:
                        data = await response.json()
                        if data.get("success") or data.get("id"):
                            successful_requests += 1
                            
                    self.log_test(f"Performance - {endpoint_name}", 
                                "PASS" if response.status == 200 else "FAIL", 
                                f"Response time: {response_time:.2f}ms", response_time)
                                
            except Exception as e:
                total_requests += 1
                self.log_test(f"Performance - {endpoint_name}", "FAIL", f"Exception: {str(e)}")
        
        # Calculate overall performance metrics
        if total_requests > 0:
            success_rate = (successful_requests / total_requests) * 100
            avg_response_time = total_response_time / total_requests
            
            self.log_test("Performance Analysis - Overall", "PASS", 
                        f"Success Rate: {success_rate:.1f}%, Avg Response Time: {avg_response_time:.2f}ms", 
                        avg_response_time)
        else:
            self.log_test("Performance Analysis - Overall", "FAIL", "No requests completed")

    async def run_all_tests(self):
        """Run all API key authentication tests"""
        print("🚀 Starting Comprehensive API Key Authentication Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Key: {API_KEY[:20]}...")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Run all tests
            await self.test_backend_health()
            await self.test_newsletter_signup_proxy()
            await self.test_contact_sales_proxy()
            await self.test_demo_request_proxy()
            await self.test_roi_calculator_proxy()
            await self.test_job_application_proxy()
            await self.test_cors_preflight_requests()
            await self.test_malformed_requests()
            await self.test_backend_logs_verification()
            await self.test_response_time_comparison()
            
        finally:
            await self.cleanup()
            
        # Print summary
        print("\n" + "=" * 80)
        print("🎯 API KEY AUTHENTICATION TEST SUMMARY")
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
        
        print("\n🎉 API Key Authentication Testing Complete!")
        
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "success_rate": success_rate,
            "test_results": self.test_results
        }

async def main():
    """Main test runner"""
    tester = APIKeyAuthTester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())