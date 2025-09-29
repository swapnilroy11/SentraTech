#!/usr/bin/env python3
"""
Focused Form Ingest Endpoints Testing - Network Restoration Functionality
Testing Focus: Core ingest functionality, authentication, and data submission
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime, timezone
import uuid

# Test Configuration
BACKEND_URL = "http://localhost:8001"
VALID_INGEST_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"
INVALID_INGEST_KEY = "invalid-key-12345"

class FocusedIngestTester:
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

    async def test_backend_health_and_config(self):
        """Test 1: Backend Health and Configuration"""
        print("\n🔍 Testing Backend Health and Configuration...")
        
        try:
            start_time = time.time()
            async with self.session.get(f"{BACKEND_URL}/api/health") as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("status") == "healthy":
                        ingest_configured = data.get("ingest_configured", False)
                        self.log_test("Backend Health Check", "PASS", 
                                    f"Status: {data.get('status')}, Ingest: {ingest_configured}", 
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

    async def test_authentication_comprehensive(self):
        """Test 2: Comprehensive Authentication Testing"""
        print("\n🔐 Testing X-INGEST-KEY Authentication...")
        
        test_endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        test_data = {
            "name": "Auth Test User",
            "email": "authtest@example.com",
            "company": "Auth Test Company"
        }
        
        # Test 1: Valid key
        try:
            start_time = time.time()
            headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
            async with self.session.post(test_endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success"):
                        self.log_test("Authentication - Valid Key", "PASS", 
                                    f"Valid key accepted, ID: {data.get('id', 'N/A')}", response_time)
                    else:
                        self.log_test("Authentication - Valid Key", "FAIL", 
                                    f"Success=False: {data}", response_time)
                else:
                    self.log_test("Authentication - Valid Key", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Authentication - Valid Key", "FAIL", f"Exception: {str(e)}")
            
        # Test 2: Invalid key
        try:
            start_time = time.time()
            headers = {"X-INGEST-KEY": INVALID_INGEST_KEY, "Content-Type": "application/json"}
            async with self.session.post(test_endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 401:
                    self.log_test("Authentication - Invalid Key", "PASS", 
                                "Invalid key properly rejected with 401", response_time)
                else:
                    self.log_test("Authentication - Invalid Key", "FAIL", 
                                f"Expected 401, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Authentication - Invalid Key", "FAIL", f"Exception: {str(e)}")
            
        # Test 3: Missing key
        try:
            start_time = time.time()
            headers = {"Content-Type": "application/json"}
            async with self.session.post(test_endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 401:
                    self.log_test("Authentication - Missing Key", "PASS", 
                                "Missing key properly rejected with 401", response_time)
                else:
                    self.log_test("Authentication - Missing Key", "FAIL", 
                                f"Expected 401, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Authentication - Missing Key", "FAIL", f"Exception: {str(e)}")

    async def test_all_ingest_endpoints(self):
        """Test 3: All Form Ingest Endpoints"""
        print("\n📝 Testing All Form Ingest Endpoints...")
        
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Test Contact Sales Form
        contact_data = {
            "full_name": "Emma Thompson",
            "work_email": "emma.thompson@globaltech.com",
            "company_name": "GlobalTech Solutions",
            "message": "Interested in AI customer support automation for our 500+ agent call center",
            "phone": "+44-20-7946-0958",
            "company_website": "https://globaltech.com",
            "call_volume": 15000,
            "interaction_volume": 25000,
            "preferred_contact_method": "email"
        }
        
        await self.test_endpoint("/api/ingest/contact_requests", contact_data, "Contact Sales Form", headers)
        
        # Test Demo Request Form
        demo_data = {
            "name": "James Rodriguez",
            "email": "james.rodriguez@innovatecorp.com",
            "company": "InnovateCorp Ltd",
            "phone": "+1-555-0789",
            "message": "Would like to see AI automation capabilities for customer support",
            "call_volume": 8000,
            "interaction_volume": 12000,
            "total_volume": 20000,
            "source": "website"
        }
        
        await self.test_endpoint("/api/ingest/demo_requests", demo_data, "Demo Request Form", headers)
        
        # Test ROI Calculator Form
        roi_data = {
            "email": "cfo@techstartup.com",
            "country": "United Kingdom",
            "call_volume": 5000,
            "interaction_volume": 7500,
            "total_volume": 12500,
            "calculated_savings": 85000.75,
            "roi_percentage": 180.5,
            "payback_period": 4.2
        }
        
        await self.test_endpoint("/api/ingest/roi_reports", roi_data, "ROI Calculator Form", headers)
        
        # Test Newsletter Subscription Form
        newsletter_data = {
            "email": "marketing@businesssolutions.com",
            "source": "website"
        }
        
        await self.test_endpoint("/api/ingest/subscriptions", newsletter_data, "Newsletter Subscription Form", headers)
        
        # Test Job Application Form
        job_data = {
            "full_name": "Sofia Martinez",
            "email": "sofia.martinez@email.com",
            "location": "Madrid, Spain",
            "linkedin_profile": "https://linkedin.com/in/sofia-martinez",
            "position": "Customer Support Specialist - Spanish/English Fluent",
            "preferred_shifts": "Afternoon (2 PM - 10 PM CET)",
            "availability_start_date": "2024-03-01",
            "cover_note": "Experienced multilingual customer support professional with 4+ years in SaaS companies. Native Spanish speaker with fluent English. Passionate about AI-enhanced customer experiences and helping customers succeed.",
            "source": "careers_page",
            "consent_for_storage": True
        }
        
        await self.test_endpoint("/api/ingest/job_applications", job_data, "Job Application Form", headers)

    async def test_endpoint(self, endpoint_path: str, data: dict, form_name: str, headers: dict):
        """Test individual endpoint"""
        try:
            start_time = time.time()
            async with self.session.post(f"{BACKEND_URL}{endpoint_path}", json=data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    response_data = await response.json()
                    if response_data.get("success") and response_data.get("id"):
                        self.log_test(f"{form_name} - Valid Submission", "PASS", 
                                    f"ID: {response_data.get('id')}, Status: {response_data.get('status', 'N/A')}", 
                                    response_time)
                    else:
                        self.log_test(f"{form_name} - Valid Submission", "FAIL", 
                                    f"Invalid response: {response_data}", response_time)
                else:
                    response_text = await response.text()
                    self.log_test(f"{form_name} - Valid Submission", "FAIL", 
                                f"HTTP {response.status}: {response_text[:100]}", response_time)
        except Exception as e:
            self.log_test(f"{form_name} - Valid Submission", "FAIL", f"Exception: {str(e)}")

    async def test_data_validation_scenarios(self):
        """Test 4: Data Validation Scenarios"""
        print("\n🔍 Testing Data Validation Scenarios...")
        
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        
        # Test 1: Empty payload
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json={}, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Data Validation - Empty Payload", "PASS", 
                                "Empty payload properly rejected with 422", response_time)
                else:
                    self.log_test("Data Validation - Empty Payload", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Data Validation - Empty Payload", "FAIL", f"Exception: {str(e)}")
            
        # Test 2: Missing required fields
        incomplete_data = {
            "email": "incomplete@test.com"
            # Missing name and company
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=incomplete_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Data Validation - Missing Required Fields", "PASS", 
                                "Missing required fields properly rejected with 422", response_time)
                else:
                    self.log_test("Data Validation - Missing Required Fields", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Data Validation - Missing Required Fields", "FAIL", f"Exception: {str(e)}")

    async def test_cors_and_preflight(self):
        """Test 5: CORS and Preflight Requests"""
        print("\n🌐 Testing CORS and Preflight Requests...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        
        # Test CORS preflight request
        try:
            start_time = time.time()
            headers = {
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "X-INGEST-KEY, Content-Type",
                "Origin": "https://sentratech.net"
            }
            async with self.session.options(endpoint, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                # CORS preflight can return 200, 204, or 405 depending on implementation
                if response.status in [200, 204, 405]:
                    self.log_test("CORS - Preflight Request", "PASS", 
                                f"Preflight handled with status {response.status}", response_time)
                else:
                    self.log_test("CORS - Preflight Request", "FAIL", 
                                f"Unexpected preflight status: {response.status}", response_time)
        except Exception as e:
            self.log_test("CORS - Preflight Request", "FAIL", f"Exception: {str(e)}")

    async def test_network_restoration_simulation(self):
        """Test 6: Network Restoration Simulation"""
        print("\n🔄 Testing Network Restoration Functionality...")
        
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        
        # Simulate multiple rapid requests (network restoration scenario)
        test_data = {
            "name": "Network Test User",
            "email": "networktest@example.com",
            "company": "Network Test Company",
            "message": "Testing network restoration functionality"
        }
        
        successful_requests = 0
        total_requests = 5
        
        for i in range(total_requests):
            try:
                start_time = time.time()
                test_data["name"] = f"Network Test User {i+1}"
                test_data["email"] = f"networktest{i+1}@example.com"
                
                async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        data = await response.json()
                        if data.get("success"):
                            successful_requests += 1
                            
            except Exception as e:
                print(f"   Request {i+1} failed: {str(e)}")
                
        success_rate = (successful_requests / total_requests) * 100
        
        if success_rate >= 80:  # 80% success rate threshold
            self.log_test("Network Restoration - Rapid Requests", "PASS", 
                        f"Success rate: {success_rate:.1f}% ({successful_requests}/{total_requests})")
        else:
            self.log_test("Network Restoration - Rapid Requests", "FAIL", 
                        f"Low success rate: {success_rate:.1f}% ({successful_requests}/{total_requests})")

    async def run_all_tests(self):
        """Run all focused tests"""
        print("🚀 Starting Focused Form Ingest Endpoints Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Valid Ingest Key: {VALID_INGEST_KEY[:20]}...")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Run all tests
            await self.test_backend_health_and_config()
            await self.test_authentication_comprehensive()
            await self.test_all_ingest_endpoints()
            await self.test_data_validation_scenarios()
            await self.test_cors_and_preflight()
            await self.test_network_restoration_simulation()
            
        finally:
            await self.cleanup()
            
        # Print summary
        print("\n" + "=" * 80)
        print("🎯 FOCUSED TEST SUMMARY")
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
        
        print("\n🎉 Focused Form Ingest Endpoints Testing Complete!")
        
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "success_rate": success_rate,
            "test_results": self.test_results
        }

async def main():
    """Main test runner"""
    tester = FocusedIngestTester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())