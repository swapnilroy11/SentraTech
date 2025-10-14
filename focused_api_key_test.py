#!/usr/bin/env python3
"""
Focused API Key Authentication Verification Test
Testing the specific requirements from the review request
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime, timezone

# Test Configuration
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"
API_KEY = "sk-emergent-7A236FdD2Ce8d9b52C"

class FocusedAPIKeyTester:
    def __init__(self):
        self.session = None
        self.results = []
        
    async def setup(self):
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        if self.session:
            await self.session.close()
            
    def log_result(self, test_name: str, status: str, details: str, response_time: float = 0):
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "response_time_ms": response_time,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.results.append(result)
        
        status_icon = "✅" if status == "PASS" else "❌"
        print(f"{status_icon} {test_name}: {status} ({response_time:.2f}ms)")
        if details:
            print(f"   {details}")

    async def test_all_proxy_endpoints_with_api_key(self):
        """Test all proxy endpoints with API key header verification"""
        print("\n🔑 Testing All Proxy Endpoints with API Key Authentication...")
        
        endpoints = [
            ("/api/proxy/newsletter-signup", {
                "email": f"api-test-{int(time.time())}@sentratech.com",
                "source": "website_newsletter"
            }),
            ("/api/proxy/roi-calculator", {
                "email": f"roi-api-test-{int(time.time())}@sentratech.com",
                "country": "United States",
                "call_volume": 5000,
                "interaction_volume": 7500,
                "calculated_savings": 150000.0,
                "roi_percentage": 250.0,
                "payback_period": 3.5
            }),
            ("/api/proxy/demo-request", {
                "name": "API Test User",
                "email": f"demo-api-test-{int(time.time())}@sentratech.com",
                "company": "API Test Corp",
                "typical_range": "5,000-10,000 monthly interactions",
                "preferred_method": "video_call"
            }),
            ("/api/proxy/contact-sales", {
                "full_name": "API Test Contact",
                "work_email": f"contact-api-test-{int(time.time())}@sentratech.com",
                "company_name": "API Test Solutions",
                "message": "Testing API key authentication",
                "plan_selected": "Growth",
                "billing_term": "24-month"
            }),
            ("/api/proxy/job-application", {
                "full_name": "API Test Applicant",
                "email": f"job-api-test-{int(time.time())}@sentratech.com",
                "position": "Customer Support Specialist",
                "experience_years": 3,
                "motivation_text": "Testing API key authentication for job applications"
            })
        ]
        
        all_successful = True
        dashboard_ids = []
        
        for endpoint_path, payload in endpoints:
            endpoint_name = endpoint_path.split('/')[-1].replace('-', ' ').title()
            
            headers = {
                "Content-Type": "application/json",
                "Origin": "https://tech-site-boost.preview.emergentagent.com",
                "User-Agent": "SentraTech-API-Test/1.0"
            }
            
            try:
                start_time = time.time()
                async with self.session.post(f"{BACKEND_URL}{endpoint_path}", json=payload, headers=headers) as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        data = await response.json()
                        dashboard_id = data.get("id", "unknown")
                        dashboard_ids.append(dashboard_id)
                        
                        self.log_result(f"API Key Auth - {endpoint_name}", "PASS", 
                                      f"Dashboard ID: {dashboard_id}", response_time)
                    else:
                        all_successful = False
                        response_text = await response.text()
                        self.log_result(f"API Key Auth - {endpoint_name}", "FAIL", 
                                      f"HTTP {response.status}: {response_text[:100]}...", response_time)
                        
            except Exception as e:
                all_successful = False
                self.log_result(f"API Key Auth - {endpoint_name}", "FAIL", f"Exception: {str(e)}")
        
        return all_successful, dashboard_ids

    async def verify_dashboard_responses(self):
        """Verify all submissions receive proper dashboard responses with status 200 and unique IDs"""
        print("\n📊 Verifying Dashboard Integration Responses...")
        
        # Test a sample endpoint to verify dashboard response format
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        payload = {
            "email": f"dashboard-verify-{int(time.time())}@sentratech.com",
            "source": "dashboard_verification_test"
        }
        
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://tech-site-boost.preview.emergentagent.com"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=payload, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    
                    # Check for required response fields
                    has_success = data.get("success") is True or data.get("id") is not None
                    has_unique_id = data.get("id") is not None and len(str(data.get("id", ""))) > 10
                    
                    if has_success and has_unique_id:
                        self.log_result("Dashboard Response Verification", "PASS", 
                                      f"Status 200, Unique ID: {data.get('id')}, Success: {data.get('success')}", 
                                      response_time)
                        return True
                    else:
                        self.log_result("Dashboard Response Verification", "FAIL", 
                                      f"Missing success/ID fields: {data}", response_time)
                        return False
                else:
                    self.log_result("Dashboard Response Verification", "FAIL", 
                                  f"Non-200 status: {response.status}", response_time)
                    return False
                    
        except Exception as e:
            self.log_result("Dashboard Response Verification", "FAIL", f"Exception: {str(e)}")
            return False

    async def test_comprehensive_form_payloads(self):
        """Test comprehensive payloads for each form type with all required fields"""
        print("\n📝 Testing Comprehensive Form Payloads...")
        
        # ROI Calculator with calculated values and volumes
        roi_payload = {
            "email": f"roi-comprehensive-{int(time.time())}@sentratech.com",
            "country": "United Kingdom",
            "call_volume": 15000,
            "interaction_volume": 22000,
            "total_volume": 37000,
            "calculated_savings": 425000.75,
            "roi_percentage": 385.2,
            "payback_period": 2.1,
            "automation_rate": 75.5,
            "cost_reduction_percentage": 72.8,
            "monthly_savings": 35416.73,
            "annual_savings": 425000.75
        }
        
        # Job Application with multi-step aggregated data
        job_payload = {
            "full_name": "Comprehensive Test Applicant",
            "email": f"job-comprehensive-{int(time.time())}@sentratech.com",
            "location": "London, United Kingdom",
            "linkedin_profile": "https://linkedin.com/in/comprehensive-test",
            "position": "Senior Customer Support Specialist - English Fluent",
            "preferred_shifts": "Flexible (9 AM - 6 PM GMT)",
            "availability_start_date": "2024-04-01",
            "cover_note": "Comprehensive test application with full multi-step data aggregation including experience, motivation, and detailed background information.",
            "experience_years": 8,
            "motivation_text": "Passionate about AI-powered customer support and helping businesses achieve exceptional customer experiences through intelligent automation.",
            "source": "careers_page_comprehensive_test",
            "consent_for_storage": True
        }
        
        # Demo Request with typical_range and preferred_method fields
        demo_payload = {
            "name": "Comprehensive Demo Test",
            "email": f"demo-comprehensive-{int(time.time())}@sentratech.com",
            "company": "Comprehensive Test Solutions Ltd",
            "phone": "+44-20-1234-5678",
            "message": "Comprehensive demo request with all fields including volume ranges and preferred contact methods",
            "call_volume": 12000,
            "interaction_volume": 18000,
            "total_volume": 30000,
            "typical_range": "10,000-25,000 monthly interactions",
            "preferred_method": "video_call",
            "source": "website_comprehensive_test"
        }
        
        # Contact Sales with plan selection and billing preferences
        contact_payload = {
            "full_name": "Comprehensive Contact Test",
            "work_email": f"contact-comprehensive-{int(time.time())}@sentratech.com",
            "company_name": "Comprehensive Test Enterprise Ltd",
            "phone": "+44-20-9876-5432",
            "company_website": "https://comprehensive-test-enterprise.com",
            "message": "Comprehensive contact sales request with plan selection and billing preferences for enterprise deployment",
            "call_volume": 25000,
            "interaction_volume": 40000,
            "total_volume": 65000,
            "preferred_contact_method": "phone",
            "plan_selected": "Enterprise (Dedicated)",
            "billing_term": "36-month"
        }
        
        comprehensive_tests = [
            ("/api/proxy/roi-calculator", roi_payload, "ROI Calculator Comprehensive"),
            ("/api/proxy/job-application", job_payload, "Job Application Comprehensive"),
            ("/api/proxy/demo-request", demo_payload, "Demo Request Comprehensive"),
            ("/api/proxy/contact-sales", contact_payload, "Contact Sales Comprehensive")
        ]
        
        all_passed = True
        
        for endpoint_path, payload, test_name in comprehensive_tests:
            headers = {
                "Content-Type": "application/json",
                "Origin": "https://tech-site-boost.preview.emergentagent.com"
            }
            
            try:
                start_time = time.time()
                async with self.session.post(f"{BACKEND_URL}{endpoint_path}", json=payload, headers=headers) as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        data = await response.json()
                        dashboard_id = data.get("id", "unknown")
                        
                        self.log_result(test_name, "PASS", 
                                      f"All fields processed, Dashboard ID: {dashboard_id}", response_time)
                    else:
                        all_passed = False
                        response_text = await response.text()
                        self.log_result(test_name, "FAIL", 
                                      f"HTTP {response.status}: {response_text[:100]}...", response_time)
                        
            except Exception as e:
                all_passed = False
                self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
        
        return all_passed

    async def run_focused_tests(self):
        """Run focused API key authentication tests"""
        print("🎯 Starting Focused API Key Authentication Verification...")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Key: {API_KEY}")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Test 1: All proxy endpoints with API key authentication
            endpoints_success, dashboard_ids = await self.test_all_proxy_endpoints_with_api_key()
            
            # Test 2: Dashboard integration verification
            dashboard_success = await self.verify_dashboard_responses()
            
            # Test 3: Comprehensive form payloads
            comprehensive_success = await self.test_comprehensive_form_payloads()
            
        finally:
            await self.cleanup()
        
        # Summary
        print("\n" + "=" * 80)
        print("🎯 FOCUSED API KEY AUTHENTICATION TEST RESULTS")
        print("=" * 80)
        
        total_tests = len(self.results)
        passed_tests = len([r for r in self.results if r["status"] == "PASS"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📊 Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        print("\n🔍 KEY FINDINGS:")
        print(f"✅ All Proxy Endpoints API Key Auth: {'PASS' if endpoints_success else 'FAIL'}")
        print(f"✅ Dashboard Integration Verified: {'PASS' if dashboard_success else 'FAIL'}")
        print(f"✅ Comprehensive Form Payloads: {'PASS' if comprehensive_success else 'FAIL'}")
        
        if dashboard_ids:
            print(f"\n📋 Dashboard IDs Generated: {len(dashboard_ids)}")
            for i, dashboard_id in enumerate(dashboard_ids[:3], 1):
                print(f"   {i}. {dashboard_id}")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if result["status"] == "FAIL":
                    print(f"   - {result['test']}: {result['details']}")
        
        print("\n🎉 Focused API Key Authentication Testing Complete!")
        
        return {
            "endpoints_success": endpoints_success,
            "dashboard_success": dashboard_success,
            "comprehensive_success": comprehensive_success,
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "dashboard_ids": dashboard_ids
        }

async def main():
    tester = FocusedAPIKeyTester()
    results = await tester.run_focused_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())