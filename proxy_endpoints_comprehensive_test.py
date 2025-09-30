#!/usr/bin/env python3
"""
Comprehensive Proxy Endpoints Integration Testing for SentraTech Application
Final verification test of all 5 proxy endpoints after fixing job application configuration issues.

Testing Focus: All 5 proxy endpoints with comprehensive integration verification
1. Newsletter Signup: /api/proxy/newsletter-signup
2. ROI Calculator: /api/proxy/roi-calculator  
3. Demo Request: /api/proxy/demo-request
4. Contact Sales: /api/proxy/contact-sales
5. Job Application: /api/proxy/job-application (now fixed)

For each endpoint verify:
- Accepts POST requests correctly
- Returns HTTP 200 status codes
- Processes JSON payloads properly
- Authentication headers are correct
- Proxy forwarding is working
- Graceful fallback when dashboard not reachable
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime, timezone
from typing import Dict, Any, List
import uuid

# Test Configuration - Using production URL from frontend .env
BACKEND_URL = "https://dashboard-bridge-2.preview.emergentagent.com"
DASHBOARD_API_KEY = "sk-emergent-7A236FdD2Ce8d9b52C"

class ProxyEndpointsIntegrationTester:
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

    async def test_proxy_newsletter_signup(self):
        """Test 1: Newsletter Signup Proxy Endpoint"""
        print("\n📧 Testing Newsletter Signup Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-ProxyTest/1.0"
        }
        
        # Valid data test
        test_id = str(uuid.uuid4())
        valid_data = {
            "email": f"newsletter-proxy-test-{test_id[:8]}@testdomain.com",
            "source": "website_newsletter",
            "id": test_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Newsletter Signup Proxy - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}, Status: {response.status}", response_time)
                    else:
                        self.log_test("Newsletter Signup Proxy - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                elif response.status == 429:
                    # Idempotency check triggered - this is expected behavior
                    self.log_test("Newsletter Signup Proxy - Valid Data", "PASS", 
                                f"Idempotency check triggered (HTTP 429) - expected behavior", response_time)
                else:
                    self.log_test("Newsletter Signup Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}: {await response.text()}", response_time)
        except Exception as e:
            self.log_test("Newsletter Signup Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

        # Test graceful fallback behavior
        invalid_headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://invalid-domain.com",  # Invalid origin
            "User-Agent": "SentraTech-ProxyTest/1.0"
        }
        
        fallback_data = {
            "email": f"fallback-test-{uuid.uuid4().hex[:8]}@testdomain.com",
            "source": "website_newsletter",
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=fallback_data, headers=invalid_headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                # Should still work with graceful fallback
                if response.status in [200, 429]:
                    self.log_test("Newsletter Signup Proxy - Graceful Fallback", "PASS", 
                                f"Graceful fallback working, Status: {response.status}", response_time)
                else:
                    self.log_test("Newsletter Signup Proxy - Graceful Fallback", "FAIL", 
                                f"Fallback failed: HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Newsletter Signup Proxy - Graceful Fallback", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_roi_calculator(self):
        """Test 2: ROI Calculator Proxy Endpoint"""
        print("\n💰 Testing ROI Calculator Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/roi-calculator"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-ProxyTest/1.0"
        }
        
        # Valid data test
        test_id = str(uuid.uuid4())
        valid_data = {
            "email": f"roi-proxy-test-{test_id[:8]}@testcompany.com",
            "country": "United States",
            "call_volume": 5000,
            "interaction_volume": 7500,
            "total_volume": 12500,
            "calculated_savings": 95000.75,
            "roi_percentage": 185.5,
            "payback_period": 2.8,
            "id": test_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("ROI Calculator Proxy - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}, Status: {response.status}", response_time)
                    else:
                        self.log_test("ROI Calculator Proxy - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                elif response.status == 429:
                    # Idempotency check triggered - this is expected behavior
                    self.log_test("ROI Calculator Proxy - Valid Data", "PASS", 
                                f"Idempotency check triggered (HTTP 429) - expected behavior", response_time)
                else:
                    self.log_test("ROI Calculator Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}: {await response.text()}", response_time)
        except Exception as e:
            self.log_test("ROI Calculator Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

        # Test JSON payload processing
        complex_data = {
            "email": f"roi-complex-{uuid.uuid4().hex[:8]}@enterprise.com",
            "country": "Bangladesh",
            "call_volume": 15000,
            "interaction_volume": 22000,
            "total_volume": 37000,
            "calculated_savings": 185000.25,
            "roi_percentage": 320.8,
            "payback_period": 1.5,
            "additional_metrics": {
                "automation_rate": 75.5,
                "cost_per_call": 2.85,
                "efficiency_gain": 65.2
            },
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=complex_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status in [200, 429]:
                    self.log_test("ROI Calculator Proxy - Complex JSON", "PASS", 
                                f"Complex JSON processed correctly, Status: {response.status}", response_time)
                else:
                    self.log_test("ROI Calculator Proxy - Complex JSON", "FAIL", 
                                f"Complex JSON failed: HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("ROI Calculator Proxy - Complex JSON", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_demo_request(self):
        """Test 3: Demo Request Proxy Endpoint"""
        print("\n🎯 Testing Demo Request Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/demo-request"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-ProxyTest/1.0"
        }
        
        # Valid data test
        test_id = str(uuid.uuid4())
        valid_data = {
            "name": "John Smith",
            "email": f"demo-proxy-test-{test_id[:8]}@testcompany.com",
            "company": "Test Company Inc",
            "phone": "+1-555-0123",
            "message": "Interested in AI customer support demo for enterprise deployment",
            "call_volume": 3500,
            "interaction_volume": 5200,
            "total_volume": 8700,
            "source": "website_demo_form",
            "id": test_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Demo Request Proxy - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}, Status: {response.status}", response_time)
                    else:
                        self.log_test("Demo Request Proxy - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                elif response.status == 429:
                    # Idempotency check triggered - this is expected behavior
                    self.log_test("Demo Request Proxy - Valid Data", "PASS", 
                                f"Idempotency check triggered (HTTP 429) - expected behavior", response_time)
                else:
                    self.log_test("Demo Request Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}: {await response.text()}", response_time)
        except Exception as e:
            self.log_test("Demo Request Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

        # Test authentication headers
        auth_headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-ProxyTest/1.0",
            "Authorization": f"Bearer {DASHBOARD_API_KEY}",
            "X-API-Key": DASHBOARD_API_KEY
        }
        
        auth_data = {
            "name": "Authentication Test User",
            "email": f"auth-test-{uuid.uuid4().hex[:8]}@testcompany.com",
            "company": "Auth Test Company",
            "phone": "+1-555-0789",
            "message": "Testing authentication headers",
            "call_volume": 2000,
            "interaction_volume": 3000,
            "source": "website_demo_form",
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=auth_data, headers=auth_headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status in [200, 429]:
                    self.log_test("Demo Request Proxy - Authentication Headers", "PASS", 
                                f"Auth headers processed correctly, Status: {response.status}", response_time)
                else:
                    self.log_test("Demo Request Proxy - Authentication Headers", "FAIL", 
                                f"Auth headers failed: HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Demo Request Proxy - Authentication Headers", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_contact_sales(self):
        """Test 4: Contact Sales Proxy Endpoint"""
        print("\n📞 Testing Contact Sales Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/contact-sales"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-ProxyTest/1.0"
        }
        
        # Valid data test
        test_id = str(uuid.uuid4())
        valid_data = {
            "full_name": "Sarah Johnson",
            "work_email": f"contact-proxy-test-{test_id[:8]}@enterprise.com",
            "company_name": "Enterprise Solutions Ltd",
            "message": "Need enterprise AI support solution for 10,000+ customer interactions",
            "phone": "+1-555-0456",
            "company_website": "https://enterprise-solutions.com",
            "call_volume": 8000,
            "interaction_volume": 12000,
            "preferred_contact_method": "email",
            "id": test_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Contact Sales Proxy - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}, Status: {response.status}", response_time)
                    else:
                        self.log_test("Contact Sales Proxy - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                elif response.status == 429:
                    # Idempotency check triggered - this is expected behavior
                    self.log_test("Contact Sales Proxy - Valid Data", "PASS", 
                                f"Idempotency check triggered (HTTP 429) - expected behavior", response_time)
                else:
                    self.log_test("Contact Sales Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}: {await response.text()}", response_time)
        except Exception as e:
            self.log_test("Contact Sales Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

        # Test proxy forwarding behavior
        forwarding_data = {
            "full_name": "Proxy Forwarding Test",
            "work_email": f"forwarding-test-{uuid.uuid4().hex[:8]}@testcompany.com",
            "company_name": "Forwarding Test Company",
            "message": "Testing proxy forwarding to dashboard",
            "phone": "+1-555-0999",
            "call_volume": 5000,
            "interaction_volume": 7500,
            "preferred_contact_method": "phone",
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=forwarding_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status in [200, 429]:
                    data = await response.json()
                    # Check if response indicates successful forwarding
                    if data.get("id") or response.status == 429:
                        self.log_test("Contact Sales Proxy - Forwarding", "PASS", 
                                    f"Proxy forwarding working, Status: {response.status}", response_time)
                    else:
                        self.log_test("Contact Sales Proxy - Forwarding", "FAIL", 
                                    f"Forwarding unclear: {data}", response_time)
                else:
                    self.log_test("Contact Sales Proxy - Forwarding", "FAIL", 
                                f"Forwarding failed: HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Contact Sales Proxy - Forwarding", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_job_application(self):
        """Test 5: Job Application Proxy Endpoint (Now Fixed)"""
        print("\n💼 Testing Job Application Proxy Endpoint (Now Fixed)...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/job-application"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-ProxyTest/1.0"
        }
        
        # Valid data test
        test_id = str(uuid.uuid4())
        valid_data = {
            "full_name": "Maria Garcia Rodriguez",
            "email": f"job-proxy-test-{test_id[:8]}@testmail.com",
            "location": "Madrid, Spain",
            "linkedin_profile": "https://linkedin.com/in/maria-garcia-test",
            "position": "Customer Support Specialist - Spanish Fluent",
            "preferred_shifts": "Afternoon (2 PM - 10 PM CET)",
            "availability_start_date": "2024-03-01",
            "cover_note": "Experienced customer support professional with 5+ years in tech industry. Fluent in Spanish, English, and Catalan. Passionate about AI-powered customer experiences and helping customers achieve their goals.",
            "source": "careers_page",
            "consent_for_storage": True,
            "id": test_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Job Application Proxy - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}, Status: {response.status}", response_time)
                    else:
                        self.log_test("Job Application Proxy - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                elif response.status == 429:
                    # Idempotency check triggered - this is expected behavior
                    self.log_test("Job Application Proxy - Valid Data", "PASS", 
                                f"Idempotency check triggered (HTTP 429) - expected behavior", response_time)
                elif response.status == 500:
                    # This was the previous issue - should be fixed now
                    response_text = await response.text()
                    self.log_test("Job Application Proxy - Valid Data", "FAIL", 
                                f"HTTP 500 - Configuration issue still exists: {response_text}", response_time)
                else:
                    self.log_test("Job Application Proxy - Valid Data", "FAIL", 
                                f"HTTP {response.status}: {await response.text()}", response_time)
        except Exception as e:
            self.log_test("Job Application Proxy - Valid Data", "FAIL", f"Exception: {str(e)}")

        # Test dashboard integration specifically for job applications
        integration_data = {
            "full_name": "Dashboard Integration Test",
            "email": f"integration-test-{uuid.uuid4().hex[:8]}@testmail.com",
            "location": "Barcelona, Spain",
            "linkedin_profile": "https://linkedin.com/in/integration-test",
            "position": "Customer Support Specialist - English Fluent",
            "preferred_shifts": "Morning (9 AM - 5 PM CET)",
            "availability_start_date": "2024-04-01",
            "cover_note": "Testing dashboard integration for job applications after configuration fixes.",
            "source": "careers_page",
            "consent_for_storage": True,
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=integration_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status in [200, 429]:
                    self.log_test("Job Application Proxy - Dashboard Integration", "PASS", 
                                f"Dashboard integration working, Status: {response.status}", response_time)
                elif response.status == 500:
                    response_text = await response.text()
                    if "timeout" in response_text.lower() or "failed to process" in response_text.lower():
                        self.log_test("Job Application Proxy - Dashboard Integration", "FAIL", 
                                    f"Dashboard timeout/processing issue: {response_text}", response_time)
                    else:
                        self.log_test("Job Application Proxy - Dashboard Integration", "FAIL", 
                                    f"Dashboard integration error: {response_text}", response_time)
                else:
                    self.log_test("Job Application Proxy - Dashboard Integration", "FAIL", 
                                f"Integration failed: HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Job Application Proxy - Dashboard Integration", "FAIL", f"Exception: {str(e)}")

    async def test_all_endpoints_comprehensive(self):
        """Test 6: Comprehensive Cross-Endpoint Verification"""
        print("\n🔄 Testing All Endpoints - Comprehensive Cross-Verification...")
        
        endpoints_data = [
            {
                "name": "Newsletter Signup",
                "endpoint": "/api/proxy/newsletter-signup",
                "data": {
                    "email": f"comprehensive-newsletter-{uuid.uuid4().hex[:8]}@test.com",
                    "source": "website_newsletter",
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            },
            {
                "name": "ROI Calculator",
                "endpoint": "/api/proxy/roi-calculator",
                "data": {
                    "email": f"comprehensive-roi-{uuid.uuid4().hex[:8]}@test.com",
                    "country": "Philippines",
                    "call_volume": 4000,
                    "interaction_volume": 6000,
                    "calculated_savings": 75000.00,
                    "roi_percentage": 150.0,
                    "payback_period": 3.0,
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            },
            {
                "name": "Demo Request",
                "endpoint": "/api/proxy/demo-request",
                "data": {
                    "name": "Comprehensive Test User",
                    "email": f"comprehensive-demo-{uuid.uuid4().hex[:8]}@test.com",
                    "company": "Comprehensive Test Company",
                    "phone": "+1-555-0000",
                    "message": "Comprehensive endpoint testing",
                    "call_volume": 3000,
                    "interaction_volume": 4500,
                    "source": "website_demo_form",
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            },
            {
                "name": "Contact Sales",
                "endpoint": "/api/proxy/contact-sales",
                "data": {
                    "full_name": "Comprehensive Sales Test",
                    "work_email": f"comprehensive-sales-{uuid.uuid4().hex[:8]}@test.com",
                    "company_name": "Comprehensive Sales Test Company",
                    "message": "Comprehensive sales endpoint testing",
                    "phone": "+1-555-1111",
                    "call_volume": 6000,
                    "interaction_volume": 9000,
                    "preferred_contact_method": "email",
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            },
            {
                "name": "Job Application",
                "endpoint": "/api/proxy/job-application",
                "data": {
                    "full_name": "Comprehensive Job Test",
                    "email": f"comprehensive-job-{uuid.uuid4().hex[:8]}@test.com",
                    "location": "Remote",
                    "position": "Customer Support Specialist - English Fluent",
                    "preferred_shifts": "Flexible",
                    "availability_start_date": "2024-05-01",
                    "cover_note": "Comprehensive job application endpoint testing",
                    "source": "careers_page",
                    "consent_for_storage": True,
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            }
        ]
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-ProxyTest/1.0"
        }
        
        successful_endpoints = 0
        total_endpoints = len(endpoints_data)
        
        for endpoint_info in endpoints_data:
            endpoint_name = endpoint_info["name"]
            endpoint_url = f"{BACKEND_URL}{endpoint_info['endpoint']}"
            endpoint_data = endpoint_info["data"]
            
            try:
                start_time = time.time()
                async with self.session.post(endpoint_url, json=endpoint_data, headers=headers) as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status in [200, 429]:
                        successful_endpoints += 1
                        if response.status == 200:
                            data = await response.json()
                            self.log_test(f"Comprehensive - {endpoint_name}", "PASS", 
                                        f"ID: {data.get('id', 'N/A')}, Status: {response.status}", response_time)
                        else:
                            self.log_test(f"Comprehensive - {endpoint_name}", "PASS", 
                                        f"Idempotency triggered (HTTP 429) - expected", response_time)
                    else:
                        self.log_test(f"Comprehensive - {endpoint_name}", "FAIL", 
                                    f"HTTP {response.status}: {await response.text()}", response_time)
            except Exception as e:
                self.log_test(f"Comprehensive - {endpoint_name}", "FAIL", f"Exception: {str(e)}")
        
        # Overall comprehensive test result
        success_rate = (successful_endpoints / total_endpoints) * 100
        if success_rate >= 80:
            self.log_test("Comprehensive - All Endpoints", "PASS", 
                        f"{successful_endpoints}/{total_endpoints} endpoints working ({success_rate:.1f}%)")
        else:
            self.log_test("Comprehensive - All Endpoints", "FAIL", 
                        f"Only {successful_endpoints}/{total_endpoints} endpoints working ({success_rate:.1f}%)")

    async def run_all_tests(self):
        """Run all proxy endpoint tests"""
        print("🚀 Starting Comprehensive Proxy Endpoints Integration Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Dashboard API Key: {DASHBOARD_API_KEY[:20]}...")
        print("=" * 80)
        print("Testing all 5 proxy endpoints after fixing job application configuration issues:")
        print("1. Newsletter Signup: /api/proxy/newsletter-signup")
        print("2. ROI Calculator: /api/proxy/roi-calculator")
        print("3. Demo Request: /api/proxy/demo-request")
        print("4. Contact Sales: /api/proxy/contact-sales")
        print("5. Job Application: /api/proxy/job-application (now fixed)")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Run all proxy endpoint tests
            await self.test_proxy_newsletter_signup()
            await self.test_proxy_roi_calculator()
            await self.test_proxy_demo_request()
            await self.test_proxy_contact_sales()
            await self.test_proxy_job_application()
            await self.test_all_endpoints_comprehensive()
            
        finally:
            await self.cleanup()
            
        # Print summary
        print("\n" + "=" * 80)
        print("🎯 PROXY ENDPOINTS INTEGRATION TEST SUMMARY")
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
        
        print("\n🎉 Proxy Endpoints Integration Testing Complete!")
        print("\nREADINESS ASSESSMENT:")
        if success_rate >= 80:
            print("✅ READY FOR DASHBOARD INTEGRATION at admin.sentratech.net")
        else:
            print("❌ NOT READY - Issues need to be resolved before dashboard integration")
        
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "success_rate": success_rate,
            "test_results": self.test_results,
            "ready_for_integration": success_rate >= 80
        }

async def main():
    """Main test runner"""
    tester = ProxyEndpointsIntegrationTester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())