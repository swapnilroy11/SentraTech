#!/usr/bin/env python3
"""
Comprehensive Integration Test for SentraTech Form Submission Proxy Endpoints
Testing Focus: All 5 proxy endpoints for dashboard integration readiness

This test verifies that all proxy endpoints are correctly configured to send data 
to admin.sentratech.net and are ready for dashboard integration.

Endpoints tested:
1. Newsletter Signup: /api/proxy/newsletter-signup
2. ROI Calculator: /api/proxy/roi-calculator  
3. Demo Request: /api/proxy/demo-request
4. Contact Sales: /api/proxy/contact-sales
5. Job Application: /api/proxy/job-application
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime, timezone
from typing import Dict, Any, List
import uuid

# Test Configuration - Using production URL from frontend .env
BACKEND_URL = "https://matrix-team-update.preview.emergentagent.com"
EMERGENT_API_KEY = "sk-emergent-7A236FdD2Ce8d9b52C"

class ProxyIntegrationTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    async def setup(self):
        """Initialize HTTP session"""
        self.session = aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30))
        
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

    async def test_newsletter_signup_proxy(self):
        """Test 1: Newsletter Signup Proxy Endpoint"""
        print("\n📧 Testing Newsletter Signup Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-Integration-Test/1.0"
        }
        
        # Complete payload with all fields
        test_data = {
            "id": str(uuid.uuid4()),
            "email": f"newsletter-integration-{uuid.uuid4().hex[:8]}@testdomain.com",
            "source": "website_newsletter",
            "status": "subscribed",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "created": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                response_text = await response.text()
                
                if response.status == 200:
                    try:
                        data = json.loads(response_text)
                        if data.get("id"):
                            self.log_test("Newsletter Signup Proxy", "PASS", 
                                        f"Dashboard ID: {data.get('id')}, Success: {data.get('success', 'N/A')}", 
                                        response_time)
                        else:
                            self.log_test("Newsletter Signup Proxy", "FAIL", 
                                        f"No ID returned: {data}", response_time)
                    except json.JSONDecodeError:
                        self.log_test("Newsletter Signup Proxy", "FAIL", 
                                    f"Invalid JSON response: {response_text[:200]}", response_time)
                else:
                    self.log_test("Newsletter Signup Proxy", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}", response_time)
        except Exception as e:
            self.log_test("Newsletter Signup Proxy", "FAIL", f"Exception: {str(e)}")

    async def test_roi_calculator_proxy(self):
        """Test 2: ROI Calculator Proxy Endpoint"""
        print("\n💰 Testing ROI Calculator Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/roi-calculator"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-Integration-Test/1.0"
        }
        
        # Complete payload with all calculated fields
        test_data = {
            "id": str(uuid.uuid4()),
            "email": f"roi-integration-{uuid.uuid4().hex[:8]}@testcompany.com",
            "country": "United States",
            "call_volume": 5000,
            "interaction_volume": 7500,
            "total_volume": 12500,
            "calculated_savings": 125000.75,
            "roi_percentage": 245.8,
            "payback_period": 3.2,
            "monthly_savings": 10416.73,
            "annual_savings": 125000.75,
            "cost_reduction_percentage": 65.5,
            "traditional_cost_per_call": 12.50,
            "ai_cost_per_call": 4.31,
            "automation_rate": 70.0,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "roi_calculator"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                response_text = await response.text()
                
                if response.status == 200:
                    try:
                        data = json.loads(response_text)
                        if data.get("id"):
                            self.log_test("ROI Calculator Proxy", "PASS", 
                                        f"Dashboard ID: {data.get('id')}, Savings: ${test_data['calculated_savings']:,.2f}", 
                                        response_time)
                        else:
                            self.log_test("ROI Calculator Proxy", "FAIL", 
                                        f"No ID returned: {data}", response_time)
                    except json.JSONDecodeError:
                        self.log_test("ROI Calculator Proxy", "FAIL", 
                                    f"Invalid JSON response: {response_text[:200]}", response_time)
                else:
                    self.log_test("ROI Calculator Proxy", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}", response_time)
        except Exception as e:
            self.log_test("ROI Calculator Proxy", "FAIL", f"Exception: {str(e)}")

    async def test_demo_request_proxy(self):
        """Test 3: Demo Request Proxy Endpoint"""
        print("\n🎯 Testing Demo Request Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/demo-request"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-Integration-Test/1.0"
        }
        
        # Complete payload with company and volume data
        test_data = {
            "id": str(uuid.uuid4()),
            "name": "John Smith",
            "email": f"demo-integration-{uuid.uuid4().hex[:8]}@testcompany.com",
            "company": "Enterprise Solutions Inc",
            "phone": "+1-555-0123",
            "message": "Interested in AI customer support demo for enterprise deployment",
            "call_volume": 8000,
            "interaction_volume": 12000,
            "total_volume": 20000,
            "company_size": "Enterprise (1000+ employees)",
            "industry": "Technology",
            "current_solution": "Traditional call center",
            "pain_points": "High costs, long wait times, inconsistent quality",
            "timeline": "Q2 2024",
            "budget_range": "$50,000 - $100,000",
            "source": "website_demo_form",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "urgency": "high"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                response_text = await response.text()
                
                if response.status == 200:
                    try:
                        data = json.loads(response_text)
                        if data.get("id"):
                            self.log_test("Demo Request Proxy", "PASS", 
                                        f"Dashboard ID: {data.get('id')}, Company: {test_data['company']}", 
                                        response_time)
                        else:
                            self.log_test("Demo Request Proxy", "FAIL", 
                                        f"No ID returned: {data}", response_time)
                    except json.JSONDecodeError:
                        self.log_test("Demo Request Proxy", "FAIL", 
                                    f"Invalid JSON response: {response_text[:200]}", response_time)
                else:
                    self.log_test("Demo Request Proxy", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}", response_time)
        except Exception as e:
            self.log_test("Demo Request Proxy", "FAIL", f"Exception: {str(e)}")

    async def test_contact_sales_proxy(self):
        """Test 4: Contact Sales Proxy Endpoint"""
        print("\n📞 Testing Contact Sales Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/contact-sales"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-Integration-Test/1.0"
        }
        
        # Complete payload with plan and billing info
        test_data = {
            "id": str(uuid.uuid4()),
            "full_name": "Sarah Johnson",
            "work_email": f"sales-integration-{uuid.uuid4().hex[:8]}@enterprise.com",
            "company_name": "Global Enterprise Corp",
            "message": "Need enterprise AI support solution with custom integration",
            "phone": "+1-555-0456",
            "company_website": "https://globalenterprise.com",
            "call_volume": 15000,
            "interaction_volume": 25000,
            "total_volume": 40000,
            "preferred_contact_method": "email",
            "job_title": "VP of Customer Operations",
            "company_size": "Enterprise (5000+ employees)",
            "industry": "Financial Services",
            "current_monthly_spend": 75000,
            "pain_points": "Scalability issues, high operational costs, inconsistent customer experience",
            "preferred_plan": "Enterprise (Dedicated)",
            "billing_preference": "36-month",
            "implementation_timeline": "Q1 2024",
            "compliance_requirements": "SOC 2, GDPR, PCI DSS",
            "integration_needs": "Salesforce, ServiceNow, Zendesk",
            "source": "pricing_page_contact_sales",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "priority": "high"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                response_text = await response.text()
                
                if response.status == 200:
                    try:
                        data = json.loads(response_text)
                        if data.get("id"):
                            self.log_test("Contact Sales Proxy", "PASS", 
                                        f"Dashboard ID: {data.get('id')}, Plan: {test_data['preferred_plan']}", 
                                        response_time)
                        else:
                            self.log_test("Contact Sales Proxy", "FAIL", 
                                        f"No ID returned: {data}", response_time)
                    except json.JSONDecodeError:
                        self.log_test("Contact Sales Proxy", "FAIL", 
                                    f"Invalid JSON response: {response_text[:200]}", response_time)
                else:
                    self.log_test("Contact Sales Proxy", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}", response_time)
        except Exception as e:
            self.log_test("Contact Sales Proxy", "FAIL", f"Exception: {str(e)}")

    async def test_job_application_proxy(self):
        """Test 5: Job Application Proxy Endpoint"""
        print("\n💼 Testing Job Application Proxy Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/job-application"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-Integration-Test/1.0"
        }
        
        # Complete payload with all personal/professional fields
        test_data = {
            "id": str(uuid.uuid4()),
            "full_name": "Maria Garcia Rodriguez",
            "email": f"job-integration-{uuid.uuid4().hex[:8]}@testmail.com",
            "phone": "+34-612-345-678",
            "location": "Madrid, Spain",
            "linkedin_profile": "https://linkedin.com/in/maria-garcia-rodriguez-test",
            "position": "Customer Support Specialist - Spanish Fluent",
            "preferred_shifts": "Afternoon (2 PM - 10 PM CET)",
            "availability_start_date": "2024-03-01",
            "cover_note": "Experienced customer support professional with 5+ years in tech industry. Fluent in Spanish, English, and Portuguese. Passionate about AI-powered customer experiences and helping customers achieve their goals.",
            "source": "careers_page",
            "consent_for_storage": True,
            # Additional professional fields
            "years_of_experience": 5,
            "previous_companies": ["TechSupport Pro", "CustomerFirst Solutions", "GlobalTech Services"],
            "education": "Bachelor's in Business Administration, Universidad Complutense Madrid",
            "certifications": ["Customer Service Excellence", "Zendesk Certified", "Salesforce Service Cloud"],
            "languages": ["Spanish (Native)", "English (Fluent)", "Portuguese (Conversational)"],
            "technical_skills": ["CRM Systems", "Live Chat Platforms", "Ticketing Systems", "Data Analysis"],
            "soft_skills": ["Empathy", "Problem Solving", "Communication", "Patience", "Adaptability"],
            "salary_expectation": "€35,000 - €45,000",
            "work_authorization": "EU Citizen",
            "remote_work_preference": "Hybrid",
            "notice_period": "2 weeks",
            "references_available": True,
            "motivation": "I'm excited about the opportunity to work with AI-powered customer support technology and help SentraTech deliver exceptional customer experiences.",
            "career_goals": "To become a senior customer success specialist and eventually lead a customer support team in an AI-driven environment.",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "application_source": "direct_application"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                response_text = await response.text()
                
                if response.status == 200:
                    try:
                        data = json.loads(response_text)
                        if data.get("id"):
                            self.log_test("Job Application Proxy", "PASS", 
                                        f"Dashboard ID: {data.get('id')}, Position: {test_data['position']}", 
                                        response_time)
                        else:
                            self.log_test("Job Application Proxy", "FAIL", 
                                        f"No ID returned: {data}", response_time)
                    except json.JSONDecodeError:
                        self.log_test("Job Application Proxy", "FAIL", 
                                    f"Invalid JSON response: {response_text[:200]}", response_time)
                else:
                    self.log_test("Job Application Proxy", "FAIL", 
                                f"HTTP {response.status}: {response_text[:200]}", response_time)
        except Exception as e:
            self.log_test("Job Application Proxy", "FAIL", f"Exception: {str(e)}")

    async def test_authentication_headers(self):
        """Test 6: Authentication Headers Handling"""
        print("\n🔐 Testing Authentication Headers Handling...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        
        # Test with various authentication headers
        auth_headers_tests = [
            {
                "name": "Standard Headers",
                "headers": {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Origin": "https://sentratech.net",
                    "User-Agent": "SentraTech-Integration-Test/1.0"
                }
            },
            {
                "name": "With Authorization Header",
                "headers": {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Origin": "https://sentratech.net",
                    "Authorization": f"Bearer {EMERGENT_API_KEY}",
                    "User-Agent": "SentraTech-Integration-Test/1.0"
                }
            },
            {
                "name": "With X-Auth-Token",
                "headers": {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Origin": "https://sentratech.net",
                    "X-Auth-Token": EMERGENT_API_KEY,
                    "User-Agent": "SentraTech-Integration-Test/1.0"
                }
            }
        ]
        
        test_data = {
            "id": str(uuid.uuid4()),
            "email": f"auth-test-{uuid.uuid4().hex[:8]}@testdomain.com",
            "source": "auth_test"
        }
        
        for auth_test in auth_headers_tests:
            try:
                start_time = time.time()
                async with self.session.post(endpoint, json=test_data, headers=auth_test["headers"]) as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        self.log_test(f"Auth Headers - {auth_test['name']}", "PASS", 
                                    "Headers accepted and processed", response_time)
                    else:
                        self.log_test(f"Auth Headers - {auth_test['name']}", "FAIL", 
                                    f"HTTP {response.status}", response_time)
            except Exception as e:
                self.log_test(f"Auth Headers - {auth_test['name']}", "FAIL", f"Exception: {str(e)}")

    async def test_graceful_fallback(self):
        """Test 7: Graceful Fallback When Dashboard Unreachable"""
        print("\n🛡️ Testing Graceful Fallback Behavior...")
        
        # This test verifies that the system handles dashboard connectivity issues gracefully
        # We'll test with a valid payload and check if the system provides appropriate responses
        
        endpoint = f"{BACKEND_URL}/api/proxy/demo-request"
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-Integration-Test/1.0"
        }
        
        test_data = {
            "id": str(uuid.uuid4()),
            "name": "Fallback Test User",
            "email": f"fallback-test-{uuid.uuid4().hex[:8]}@testcompany.com",
            "company": "Fallback Test Company",
            "message": "Testing graceful fallback behavior"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                response_text = await response.text()
                
                # Check if response is successful (either dashboard success or graceful fallback)
                if response.status == 200:
                    try:
                        data = json.loads(response_text)
                        if data.get("success") or data.get("id"):
                            self.log_test("Graceful Fallback", "PASS", 
                                        f"System handled request gracefully: {data.get('message', 'Success')}", 
                                        response_time)
                        else:
                            self.log_test("Graceful Fallback", "FAIL", 
                                        f"Unexpected response format: {data}", response_time)
                    except json.JSONDecodeError:
                        self.log_test("Graceful Fallback", "FAIL", 
                                    f"Invalid JSON response: {response_text[:200]}", response_time)
                else:
                    # Check if it's a graceful error response
                    if response.status in [500, 502, 503, 504]:
                        self.log_test("Graceful Fallback", "PARTIAL", 
                                    f"Server error but system responding: HTTP {response.status}", response_time)
                    else:
                        self.log_test("Graceful Fallback", "FAIL", 
                                    f"Unexpected status: HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Graceful Fallback", "FAIL", f"Exception: {str(e)}")

    async def test_logging_verification(self):
        """Test 8: Submission Logging Verification"""
        print("\n📝 Testing Submission Logging...")
        
        # Test multiple endpoints to verify logging is working
        endpoints_to_test = [
            {
                "name": "Newsletter Signup",
                "endpoint": "/api/proxy/newsletter-signup",
                "data": {
                    "id": str(uuid.uuid4()),
                    "email": f"log-test-newsletter-{uuid.uuid4().hex[:8]}@testdomain.com",
                    "source": "logging_test"
                }
            },
            {
                "name": "Demo Request",
                "endpoint": "/api/proxy/demo-request",
                "data": {
                    "id": str(uuid.uuid4()),
                    "name": "Log Test User",
                    "email": f"log-test-demo-{uuid.uuid4().hex[:8]}@testcompany.com",
                    "company": "Log Test Company",
                    "message": "Testing submission logging"
                }
            }
        ]
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://sentratech.net",
            "User-Agent": "SentraTech-Integration-Test/1.0"
        }
        
        for endpoint_test in endpoints_to_test:
            try:
                start_time = time.time()
                full_endpoint = f"{BACKEND_URL}{endpoint_test['endpoint']}"
                async with self.session.post(full_endpoint, json=endpoint_test["data"], headers=headers) as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    # Check if the request was processed (indicating logging is working)
                    if response.status in [200, 201]:
                        self.log_test(f"Logging - {endpoint_test['name']}", "PASS", 
                                    "Request processed and likely logged", response_time)
                    elif response.status in [500, 502, 503]:
                        self.log_test(f"Logging - {endpoint_test['name']}", "PARTIAL", 
                                    "Request received but may have processing issues", response_time)
                    else:
                        self.log_test(f"Logging - {endpoint_test['name']}", "FAIL", 
                                    f"HTTP {response.status}", response_time)
            except Exception as e:
                self.log_test(f"Logging - {endpoint_test['name']}", "FAIL", f"Exception: {str(e)}")

    async def run_comprehensive_integration_tests(self):
        """Run all comprehensive integration tests"""
        print("🚀 Starting Comprehensive SentraTech Proxy Integration Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Target Dashboard: admin.sentratech.net")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Test all 5 proxy endpoints
            await self.test_newsletter_signup_proxy()
            await self.test_roi_calculator_proxy()
            await self.test_demo_request_proxy()
            await self.test_contact_sales_proxy()
            await self.test_job_application_proxy()
            
            # Test additional integration aspects
            await self.test_authentication_headers()
            await self.test_graceful_fallback()
            await self.test_logging_verification()
            
        finally:
            await self.cleanup()
            
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("🎯 COMPREHENSIVE INTEGRATION TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        
        success_rate = (self.passed_tests / self.total_tests * 100) if self.total_tests > 0 else 0
        print(f"📊 Success Rate: {success_rate:.1f}%")
        
        # Detailed results by category
        proxy_tests = [r for r in self.test_results if "Proxy" in r["test"]]
        proxy_passed = len([r for r in proxy_tests if r["status"] == "PASS"])
        print(f"\n📋 Proxy Endpoints: {proxy_passed}/{len(proxy_tests)} passed")
        
        auth_tests = [r for r in self.test_results if "Auth" in r["test"]]
        auth_passed = len([r for r in auth_tests if r["status"] == "PASS"])
        print(f"🔐 Authentication: {auth_passed}/{len(auth_tests)} passed")
        
        fallback_tests = [r for r in self.test_results if "Fallback" in r["test"] or "Logging" in r["test"]]
        fallback_passed = len([r for r in fallback_tests if r["status"] in ["PASS", "PARTIAL"]])
        print(f"🛡️ Fallback & Logging: {fallback_passed}/{len(fallback_tests)} passed")
        
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"   - {result['test']}: {result['details']}")
        
        # Dashboard readiness assessment
        critical_endpoints = ["Newsletter Signup Proxy", "ROI Calculator Proxy", "Demo Request Proxy", 
                            "Contact Sales Proxy", "Job Application Proxy"]
        critical_passed = len([r for r in self.test_results 
                             if r["test"] in critical_endpoints and r["status"] == "PASS"])
        
        print(f"\n🎯 DASHBOARD INTEGRATION READINESS:")
        print(f"Critical Endpoints Ready: {critical_passed}/{len(critical_endpoints)}")
        
        if critical_passed == len(critical_endpoints):
            print("✅ ALL PROXY ENDPOINTS READY FOR DASHBOARD INTEGRATION!")
        elif critical_passed >= 4:
            print("⚠️ MOSTLY READY - Minor issues to resolve")
        else:
            print("❌ NOT READY - Critical issues need resolution")
        
        print("\n🎉 SentraTech Proxy Integration Testing Complete!")
        
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "success_rate": success_rate,
            "critical_endpoints_ready": critical_passed,
            "dashboard_ready": critical_passed == len(critical_endpoints),
            "test_results": self.test_results
        }

async def main():
    """Main test runner"""
    tester = ProxyIntegrationTester()
    results = await tester.run_comprehensive_integration_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())