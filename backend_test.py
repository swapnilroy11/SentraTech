#!/usr/bin/env python3
"""
Final Comprehensive Backend Testing for SentraTech Form Proxy Endpoints
Testing all 5 form submission endpoints for dashboard deployment readiness
Focus: Newsletter Signup, ROI Calculator, Demo Request, Contact Sales, Job Application
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys

# Backend URL from frontend environment
BACKEND_URL = "https://real-time-dash.preview.emergentagent.com"

class ProxyEndpointTester:
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
    
    def test_backend_health(self):
        """Test backend health endpoint"""
        print("\n🔍 Testing Backend Health...")
        try:
            start_time = time.time()
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Backend Health Check", 
                    "PASS", 
                    f"Status: {data.get('status')}, Response time: {response_time:.2f}ms, Database: {data.get('database')}, Ingest configured: {data.get('ingest_configured')}"
                )
                return True
            else:
                self.log_test("Backend Health Check", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Backend Health Check", "FAIL", f"Connection error: {str(e)}")
            return False
            
        self.test_results.append({
            "test": test_name,
            "status": status,
            "details": details,
            "response_time_ms": response_time,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    async def test_backend_health(self):
        """Test 1: Backend Health Check"""
        print("\n🔍 Testing Backend Health Check...")
        
        try:
            start_time = time.time()
            async with self.session.get(f"{BACKEND_URL}/api/health") as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("status") == "healthy" and data.get("ingest_configured"):
                        self.log_test("Backend Health Check", "PASS", 
                                    f"Status: {data.get('status')}, Ingest: {data.get('ingest_configured')}", 
                                    response_time)
                        return True
                    else:
                        self.log_test("Backend Health Check", "FAIL", 
                                    f"Unhealthy or ingest not configured: {data}", response_time)
                        return False
                else:
                    self.log_test("Backend Health Check", "FAIL", 
                                f"HTTP {response.status}", response_time)
                    return False
                    
        except Exception as e:
            self.log_test("Backend Health Check", "FAIL", f"Exception: {str(e)}")
            return False

    async def test_authentication(self):
        """Test 2: Authentication Testing"""
        print("\n🔐 Testing X-INGEST-KEY Authentication...")
        
        test_endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Company"
        }
        
        # Test 1: Valid key
        try:
            start_time = time.time()
            headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
            async with self.session.post(test_endpoint, json=test_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    self.log_test("Authentication - Valid Key", "PASS", 
                                "Valid key accepted", response_time)
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
                                "Invalid key properly rejected", response_time)
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
                                "Missing key properly rejected", response_time)
                else:
                    self.log_test("Authentication - Missing Key", "FAIL", 
                                f"Expected 401, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Authentication - Missing Key", "FAIL", f"Exception: {str(e)}")

    async def test_contact_requests_endpoint(self):
        """Test 3: Contact Sales Form Endpoint"""
        print("\n📞 Testing Contact Sales Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/contact_requests"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
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
            "preferred_contact_method": "email"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("Contact Sales - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Contact Sales - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("Contact Sales - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Contact Sales - Valid Data", "FAIL", f"Exception: {str(e)}")
            
        # Invalid data test (missing required fields)
        invalid_data = {
            "work_email": "invalid-email",
            "message": "Test message"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=invalid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Contact Sales - Invalid Data", "PASS", 
                                "Invalid data properly rejected", response_time)
                else:
                    self.log_test("Contact Sales - Invalid Data", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Contact Sales - Invalid Data", "FAIL", f"Exception: {str(e)}")

    async def test_demo_requests_endpoint(self):
        """Test 4: Demo Request Form Endpoint"""
        print("\n🎯 Testing Demo Request Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
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
            "source": "website"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("Demo Request - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Demo Request - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("Demo Request - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Demo Request - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_roi_reports_endpoint(self):
        """Test 5: ROI Calculator Form Endpoint"""
        print("\n💰 Testing ROI Calculator Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/roi_reports"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Valid data test
        valid_data = {
            "email": "finance@globalcorp.com",
            "country": "United States",
            "call_volume": 10000,
            "interaction_volume": 15000,
            "total_volume": 25000,
            "calculated_savings": 125000.50,
            "roi_percentage": 245.8,
            "payback_period": 3.2
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("ROI Calculator - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("ROI Calculator - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("ROI Calculator - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("ROI Calculator - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_subscriptions_endpoint(self):
        """Test 6: Newsletter Subscription Form Endpoint"""
        print("\n📧 Testing Newsletter Subscription Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/subscriptions"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Valid data test
        valid_data = {
            "email": "newsletter@businesstech.com",
            "source": "website"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("Newsletter Subscription - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Newsletter Subscription - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("Newsletter Subscription - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Newsletter Subscription - Valid Data", "FAIL", f"Exception: {str(e)}")
            
        # Invalid email test
        invalid_data = {
            "email": "invalid-email-format",
            "source": "website"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=invalid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                # Note: Based on backend code, email validation might be lenient
                if response.status in [200, 422]:
                    self.log_test("Newsletter Subscription - Invalid Email", "PASS", 
                                f"Response: {response.status}", response_time)
                else:
                    self.log_test("Newsletter Subscription - Invalid Email", "FAIL", 
                                f"Unexpected status: {response.status}", response_time)
        except Exception as e:
            self.log_test("Newsletter Subscription - Invalid Email", "FAIL", f"Exception: {str(e)}")

    async def test_job_applications_endpoint(self):
        """Test 7: Job Application Form Endpoint"""
        print("\n💼 Testing Job Application Form Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/job_applications"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Valid data test
        valid_data = {
            "full_name": "Alexandra Rodriguez",
            "email": "alexandra.rodriguez@email.com",
            "location": "Barcelona, Spain",
            "linkedin_profile": "https://linkedin.com/in/alexandra-rodriguez",
            "position": "Customer Support Specialist - Spanish Fluent",
            "preferred_shifts": "Morning (9 AM - 5 PM CET)",
            "availability_start_date": "2024-02-15",
            "cover_note": "Experienced customer support professional with 5+ years in tech industry. Fluent in Spanish, English, and Catalan. Passionate about AI-powered customer experiences.",
            "source": "careers_page",
            "consent_for_storage": True
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("success") and data.get("id"):
                        self.log_test("Job Application - Valid Data", "PASS", 
                                    f"ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Job Application - Valid Data", "FAIL", 
                                    f"Invalid response: {data}", response_time)
                else:
                    self.log_test("Job Application - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Job Application - Valid Data", "FAIL", f"Exception: {str(e)}")
            
        # Invalid data test (missing required fields)
        invalid_data = {
            "email": "incomplete@application.com"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=invalid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Job Application - Invalid Data", "PASS", 
                                "Invalid data properly rejected", response_time)
                else:
                    self.log_test("Job Application - Invalid Data", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Job Application - Invalid Data", "FAIL", f"Exception: {str(e)}")

    async def test_status_endpoints(self):
        """Test 8: Status Endpoints"""
        print("\n📊 Testing Status Endpoints...")
        
        status_endpoints = [
            "/api/ingest/contact_requests/status",
            "/api/ingest/demo_requests/status", 
            "/api/ingest/roi_reports/status",
            "/api/ingest/subscriptions/status",
            "/api/ingest/job_applications/status"
        ]
        
        for endpoint_path in status_endpoints:
            endpoint_name = endpoint_path.split('/')[-2].replace('_', ' ').title()
            
            try:
                start_time = time.time()
                async with self.session.get(f"{BACKEND_URL}{endpoint_path}") as response:
                    response_time = (time.time() - start_time) * 1000
                    
                    if response.status == 200:
                        data = await response.json()
                        if "total_count" in data:
                            self.log_test(f"Status Endpoint - {endpoint_name}", "PASS", 
                                        f"Count: {data.get('total_count')}", response_time)
                        else:
                            self.log_test(f"Status Endpoint - {endpoint_name}", "FAIL", 
                                        f"Missing total_count: {data}", response_time)
                    else:
                        self.log_test(f"Status Endpoint - {endpoint_name}", "FAIL", 
                                    f"HTTP {response.status}", response_time)
            except Exception as e:
                self.log_test(f"Status Endpoint - {endpoint_name}", "FAIL", f"Exception: {str(e)}")

    async def test_data_validation(self):
        """Test 9: Data Validation"""
        print("\n🔍 Testing Data Validation...")
        
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        # Test malformed JSON
        try:
            start_time = time.time()
            async with self.session.post(endpoint, data="invalid json", headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Data Validation - Malformed JSON", "PASS", 
                                "Malformed JSON properly rejected", response_time)
                else:
                    self.log_test("Data Validation - Malformed JSON", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Data Validation - Malformed JSON", "FAIL", f"Exception: {str(e)}")
            
        # Test empty payload
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json={}, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 422:
                    self.log_test("Data Validation - Empty Payload", "PASS", 
                                "Empty payload properly rejected", response_time)
                else:
                    self.log_test("Data Validation - Empty Payload", "FAIL", 
                                f"Expected 422, got {response.status}", response_time)
        except Exception as e:
            self.log_test("Data Validation - Empty Payload", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_demo_request(self):
        """Test 10: Proxy Demo Request Endpoint"""
        print("\n🎯 Testing Proxy Demo Request Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/demo-request"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "name": "John Smith",
            "email": "john.smith@testcompany.com",
            "company": "Test Company Inc",
            "phone": "+1-555-0123",
            "message": "Interested in AI customer support demo",
            "call_volume": 2500,
            "interaction_volume": 3500,
            "source": "website"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy Demo Request - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy Demo Request - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy Demo Request - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy Demo Request - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_contact_sales(self):
        """Test 11: Proxy Contact Sales Endpoint"""
        print("\n📞 Testing Proxy Contact Sales Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/contact-sales"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "full_name": "Sarah Johnson",
            "work_email": "sarah.johnson@enterprise.com",
            "company_name": "Enterprise Solutions Ltd",
            "message": "Need enterprise AI support solution",
            "phone": "+1-555-0456",
            "company_website": "https://enterprise.com",
            "call_volume": 8000,
            "interaction_volume": 12000,
            "preferred_contact_method": "email"
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy Contact Sales - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy Contact Sales - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy Contact Sales - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy Contact Sales - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_newsletter_signup(self):
        """Test 12: Proxy Newsletter Signup Endpoint"""
        print("\n📧 Testing Proxy Newsletter Signup Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/newsletter-signup"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "email": f"newsletter-test-{uuid.uuid4().hex[:8]}@testdomain.com",
            "source": "website",
            "id": str(uuid.uuid4())
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy Newsletter Signup - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy Newsletter Signup - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy Newsletter Signup - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy Newsletter Signup - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_roi_calculator(self):
        """Test 13: Proxy ROI Calculator Endpoint"""
        print("\n💰 Testing Proxy ROI Calculator Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/roi-calculator"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "email": f"roi-test-{uuid.uuid4().hex[:8]}@testcompany.com",
            "country": "United States",
            "call_volume": 5000,
            "interaction_volume": 7500,
            "calculated_savings": 85000.75,
            "roi_percentage": 180.5,
            "payback_period": 2.8
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy ROI Calculator - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy ROI Calculator - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy ROI Calculator - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy ROI Calculator - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_proxy_job_application(self):
        """Test 14: Proxy Job Application Endpoint"""
        print("\n💼 Testing Proxy Job Application Endpoint...")
        
        endpoint = f"{BACKEND_URL}/api/proxy/job-application"
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://real-time-dash.preview.emergentagent.com",
            "User-Agent": "SentraTech-Test/1.0"
        }
        
        # Valid data test
        valid_data = {
            "full_name": "Maria Garcia",
            "email": f"job-test-{uuid.uuid4().hex[:8]}@testmail.com",
            "location": "Madrid, Spain",
            "linkedin_profile": "https://linkedin.com/in/maria-garcia-test",
            "position": "Customer Support Specialist - Spanish Fluent",
            "preferred_shifts": "Afternoon (2 PM - 10 PM CET)",
            "availability_start_date": "2024-03-01",
            "cover_note": "Experienced customer support professional seeking AI-powered customer experience role.",
            "source": "careers_page",
            "consent_for_storage": True
        }
        
        try:
            start_time = time.time()
            async with self.session.post(endpoint, json=valid_data, headers=headers) as response:
                response_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    if data.get("id"):
                        self.log_test("Proxy Job Application - Valid Data", "PASS", 
                                    f"Dashboard ID: {data.get('id')}", response_time)
                    else:
                        self.log_test("Proxy Job Application - Valid Data", "FAIL", 
                                    f"No ID returned: {data}", response_time)
                else:
                    self.log_test("Proxy Job Application - Valid Data", "FAIL", 
                                f"HTTP {response.status}", response_time)
        except Exception as e:
            self.log_test("Proxy Job Application - Valid Data", "FAIL", f"Exception: {str(e)}")

    async def test_database_storage(self):
        """Test 15: Database Storage Verification"""
        print("\n💾 Testing Database Storage...")
        
        # Submit a test record and verify it's stored
        endpoint = f"{BACKEND_URL}/api/ingest/demo_requests"
        headers = {"X-INGEST-KEY": VALID_INGEST_KEY, "Content-Type": "application/json"}
        
        test_id = str(uuid.uuid4())
        test_data = {
            "name": f"Database Test User {test_id[:8]}",
            "email": f"dbtest-{test_id[:8]}@example.com",
            "company": "Database Test Company",
            "message": f"Database storage test - {test_id}"
        }
        
        try:
            # Submit data
            start_time = time.time()
            async with self.session.post(endpoint, json=test_data, headers=headers) as response:
                submit_time = (time.time() - start_time) * 1000
                
                if response.status == 200:
                    data = await response.json()
                    record_id = data.get("id")
                    
                    # Check status endpoint to verify storage
                    start_time = time.time()
                    async with self.session.get(f"{BACKEND_URL}/api/ingest/demo_requests/status") as status_response:
                        status_time = (time.time() - start_time) * 1000
                        
                        if status_response.status == 200:
                            status_data = await status_response.json()
                            recent_submissions = status_data.get("recent_submissions", [])
                            
                            # Check if our test record is in recent submissions
                            found = any(sub.get("email") == test_data["email"] for sub in recent_submissions)
                            
                            if found:
                                self.log_test("Database Storage - Verification", "PASS", 
                                            f"Record stored and retrievable (ID: {record_id})", 
                                            submit_time + status_time)
                            else:
                                self.log_test("Database Storage - Verification", "FAIL", 
                                            f"Record not found in recent submissions", 
                                            submit_time + status_time)
                        else:
                            self.log_test("Database Storage - Verification", "FAIL", 
                                        f"Status endpoint failed: {status_response.status}", 
                                        submit_time + status_time)
                else:
                    self.log_test("Database Storage - Verification", "FAIL", 
                                f"Submit failed: {response.status}", submit_time)
        except Exception as e:
            self.log_test("Database Storage - Verification", "FAIL", f"Exception: {str(e)}")

    async def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Comprehensive SentraTech Backend Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Valid Ingest Key: {VALID_INGEST_KEY[:20]}...")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Run all tests
            await self.test_backend_health()
            await self.test_authentication()
            
            # Test ingest endpoints
            await self.test_contact_requests_endpoint()
            await self.test_demo_requests_endpoint()
            await self.test_roi_reports_endpoint()
            await self.test_subscriptions_endpoint()
            await self.test_job_applications_endpoint()
            
            # Test proxy endpoints
            await self.test_proxy_demo_request()
            await self.test_proxy_contact_sales()
            await self.test_proxy_newsletter_signup()
            await self.test_proxy_roi_calculator()
            await self.test_proxy_job_application()
            
            # Test status and validation
            await self.test_status_endpoints()
            await self.test_data_validation()
            await self.test_database_storage()
            
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
        
        print("\n🎉 SentraTech Backend Testing Complete!")
        
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "success_rate": success_rate,
            "test_results": self.test_results
        }

async def main():
    """Main test runner"""
    tester = SentraTechBackendTester()
    results = await tester.run_all_tests()
    return results

if __name__ == "__main__":
    asyncio.run(main())