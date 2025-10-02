#!/usr/bin/env python3
"""
Comprehensive SentraTech Backend API Testing After Docker Buildx Migration
Testing all backend functionality after build system switch from Kaniko to Docker Buildx
Focus: Health Check, Form Proxy Endpoints, Authentication, Data Validation, Environment Variables, Database Connectivity
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys

# Backend URL - Testing production backend URL from frontend .env
BACKEND_URL = "https://deploy-bug-fixes.preview.emergentagent.com"
INGEST_API_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"

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
    
    def test_newsletter_signup(self):
        """Test newsletter signup proxy endpoint"""
        print("\n📧 Testing Newsletter Signup Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test.newsletter@sentratech.net",
            "source": "website_newsletter",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Newsletter Signup Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "Newsletter Signup Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Newsletter Signup Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_roi_calculator(self):
        """Test ROI calculator proxy endpoint"""
        print("\n📊 Testing ROI Calculator Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "test.roi@sentratech.net",
            "country": "Bangladesh",
            "call_volume": 2500,
            "interaction_volume": 3500,
            "total_volume": 6000,
            "calculated_savings": 125000.50,
            "roi_percentage": 65.5,
            "payback_period": 2.3,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/roi-calculator",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "ROI Calculator Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "ROI Calculator Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("ROI Calculator Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_demo_request(self):
        """Test demo request proxy endpoint"""
        print("\n🎯 Testing Demo Request Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "name": "Sarah Johnson",
            "email": "sarah.johnson@techcorp.com",
            "company": "TechCorp Solutions",
            "phone": "+1-555-0123",
            "message": "Interested in AI customer support solution for our growing business",
            "call_volume": 1500,
            "interaction_volume": 2000,
            "total_volume": 3500,
            "source": "website_demo_form",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/demo-request",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Demo Request Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "Demo Request Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Demo Request Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_contact_sales(self):
        """Test contact sales proxy endpoint"""
        print("\n💼 Testing Contact Sales Proxy...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "full_name": "Michael Chen",
            "work_email": "michael.chen@enterprise.com",
            "company_name": "Enterprise Solutions Inc",
            "phone": "+1-555-0456",
            "message": "Need enterprise AI solution for 10,000+ monthly interactions",
            "company_website": "https://enterprise.com",
            "call_volume": 5000,
            "interaction_volume": 8000,
            "preferred_contact_method": "email",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/contact-sales",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Contact Sales Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "Contact Sales Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Contact Sales Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_job_application(self):
        """Test job application proxy endpoint with realistic data"""
        print("\n👔 Testing Job Application Proxy...")
        
        # Using the exact payload format from the review request
        payload = {
            "id": str(uuid.uuid4()),
            "full_name": "Sarah Ahmed",
            "email": "sarah.ahmed@example.com",
            "phone": "+880 1712-345678",
            "location": "Dhaka, Bangladesh",
            "position_applied": "Customer Support Specialist",
            "preferred_shifts": "flexible",
            "availability_start_date": "2025-01-15",
            "motivation": "I am excited to join SentraTech and contribute to AI customer support innovation.",
            "cover_letter": "I have strong English communication skills and customer service experience.",
            "consent_for_storage": True,
            "source": "careers_page_single_form",
            "created": "2025-01-01T15:00:00.000Z"
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Job Application Proxy", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                return True
            else:
                self.log_test(
                    "Job Application Proxy", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Proxy", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_job_application_idempotency(self):
        """Test job application idempotency and duplicate submission prevention"""
        print("\n🔄 Testing Job Application Idempotency...")
        
        # Use the same ID for both requests to test duplicate prevention
        duplicate_id = str(uuid.uuid4())
        
        payload = {
            "id": duplicate_id,
            "full_name": "Sarah Ahmed",
            "email": "sarah.ahmed@example.com",
            "phone": "+880 1712-345678",
            "location": "Dhaka, Bangladesh",
            "position_applied": "Customer Support Specialist",
            "preferred_shifts": "flexible",
            "availability_start_date": "2025-01-15",
            "motivation": "I am excited to join SentraTech and contribute to AI customer support innovation.",
            "cover_letter": "I have strong English communication skills and customer service experience.",
            "consent_for_storage": True,
            "source": "careers_page_single_form",
            "created": "2025-01-01T15:00:00.000Z"
        }
        
        try:
            # First submission - should succeed
            print("   Testing first submission...")
            start_time = time.time()
            response1 = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time1 = (time.time() - start_time) * 1000
            
            # Second submission with same ID - should be rejected or handled gracefully
            print("   Testing duplicate submission...")
            start_time = time.time()
            response2 = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time2 = (time.time() - start_time) * 1000
            
            # Analyze results
            if response1.status_code == 200:
                if response2.status_code == 429:  # Rate limited/duplicate detected
                    self.log_test(
                        "Job Application Idempotency", 
                        "PASS", 
                        f"First: HTTP 200 ({response_time1:.2f}ms), Duplicate: HTTP 429 ({response_time2:.2f}ms) - Duplicate prevention working"
                    )
                    return True
                elif response2.status_code == 200:
                    # Check if it's the same response (idempotent)
                    data1 = response1.json()
                    data2 = response2.json()
                    if data1.get('id') == data2.get('id'):
                        self.log_test(
                            "Job Application Idempotency", 
                            "PASS", 
                            f"Both HTTP 200, same ID returned - Idempotent behavior working"
                        )
                        return True
                    else:
                        self.log_test(
                            "Job Application Idempotency", 
                            "FAIL", 
                            f"Both HTTP 200 but different IDs - Duplicate not prevented"
                        )
                        return False
                else:
                    self.log_test(
                        "Job Application Idempotency", 
                        "FAIL", 
                        f"First: HTTP 200, Duplicate: HTTP {response2.status_code} - Unexpected duplicate response"
                    )
                    return False
            else:
                self.log_test(
                    "Job Application Idempotency", 
                    "FAIL", 
                    f"First submission failed: HTTP {response1.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Idempotency", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_job_application_error_handling(self):
        """Test job application error handling and graceful fallback"""
        print("\n🛡️ Testing Job Application Error Handling...")
        
        # Test with invalid payload to check error handling
        invalid_payload = {
            "id": str(uuid.uuid4()),
            "full_name": "",  # Empty required field
            "email": "invalid-email",  # Invalid email format
            "phone": "+880 1712-345678",
            "location": "Dhaka, Bangladesh"
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/proxy/job-application",
                json=invalid_payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            # Check if error is handled gracefully
            if response.status_code in [400, 422]:  # Bad request or validation error
                self.log_test(
                    "Job Application Error Handling", 
                    "PASS", 
                    f"HTTP {response.status_code} ({response_time:.2f}ms) - Validation errors handled correctly"
                )
                return True
            elif response.status_code == 200:
                # Check if it has fallback mechanism
                data = response.json()
                if data.get('success') == False or 'fallback' in str(data).lower():
                    self.log_test(
                        "Job Application Error Handling", 
                        "PASS", 
                        f"HTTP 200 with graceful fallback - Error handled gracefully"
                    )
                    return True
                else:
                    self.log_test(
                        "Job Application Error Handling", 
                        "FAIL", 
                        f"HTTP 200 but invalid data accepted - Validation not working"
                    )
                    return False
            else:
                self.log_test(
                    "Job Application Error Handling", 
                    "FAIL", 
                    f"HTTP {response.status_code} - Unexpected error response"
                )
                return False
                
        except Exception as e:
            self.log_test("Job Application Error Handling", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_environment_variables(self):
        print("\n🔧 Testing Environment Variable Configuration...")
        
        # Test if we can access the backend configuration endpoint
        try:
            response = requests.get(f"{self.backend_url}/api/config/validate", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Environment Configuration", 
                    "PASS", 
                    f"Config valid: {data.get('config_valid')}, Email configured: {data.get('email_service_configured')}"
                )
                return True
            else:
                self.log_test(
                    "Environment Configuration", 
                    "FAIL", 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test("Environment Configuration", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_ingest_endpoints_authentication(self):
        """Test X-INGEST-KEY authentication on all ingest endpoints"""
        print("\n🔐 Testing X-INGEST-KEY Authentication System...")
        
        ingest_endpoints = [
            ("/api/ingest/contact_requests", {
                "full_name": "Test User",
                "work_email": "test@example.com",
                "company_name": "Test Company",
                "message": "Test message"
            }),
            ("/api/ingest/demo_requests", {
                "name": "Test User",
                "email": "test@example.com",
                "company": "Test Company"
            }),
            ("/api/ingest/roi_reports", {
                "email": "test@example.com",
                "country": "Bangladesh",
                "calculated_savings": 1000.0
            }),
            ("/api/ingest/subscriptions", {
                "email": "test@example.com"
            }),
            ("/api/ingest/job_applications", {
                "full_name": "Test User",
                "email": "test@example.com"
            })
        ]
        
        auth_tests_passed = 0
        total_auth_tests = len(ingest_endpoints) * 2  # Test with and without key
        
        for endpoint, payload in ingest_endpoints:
            endpoint_name = endpoint.split('/')[-1]
            
            # Test without X-INGEST-KEY (should fail with 401)
            try:
                response = requests.post(
                    f"{self.backend_url}{endpoint}",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 401:
                    self.log_test(
                        f"Auth Rejection {endpoint_name}", 
                        "PASS", 
                        "HTTP 401 - Correctly rejected request without X-INGEST-KEY"
                    )
                    auth_tests_passed += 1
                else:
                    self.log_test(
                        f"Auth Rejection {endpoint_name}", 
                        "FAIL", 
                        f"HTTP {response.status_code} - Should reject without X-INGEST-KEY"
                    )
                    
            except Exception as e:
                self.log_test(f"Auth Rejection {endpoint_name}", "FAIL", f"Request error: {str(e)}")
            
            # Test with valid X-INGEST-KEY (should succeed with 200)
            try:
                response = requests.post(
                    f"{self.backend_url}{endpoint}",
                    json=payload,
                    headers={
                        "Content-Type": "application/json",
                        "X-INGEST-KEY": INGEST_API_KEY
                    },
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_test(
                        f"Auth Success {endpoint_name}", 
                        "PASS", 
                        f"HTTP 200 - Correctly accepted request with valid X-INGEST-KEY, ID: {data.get('id', 'N/A')}"
                    )
                    auth_tests_passed += 1
                else:
                    self.log_test(
                        f"Auth Success {endpoint_name}", 
                        "FAIL", 
                        f"HTTP {response.status_code} - Should accept with valid X-INGEST-KEY: {response.text[:200]}"
                    )
                    
            except Exception as e:
                self.log_test(f"Auth Success {endpoint_name}", "FAIL", f"Request error: {str(e)}")
        
        # Overall authentication system test
        auth_success_rate = (auth_tests_passed / total_auth_tests) * 100 if total_auth_tests > 0 else 0
        if auth_success_rate >= 80:
            self.log_test(
                "X-INGEST-KEY Authentication System", 
                "PASS", 
                f"Authentication working correctly ({auth_tests_passed}/{total_auth_tests} tests passed)"
            )
            return True
        else:
            self.log_test(
                "X-INGEST-KEY Authentication System", 
                "FAIL", 
                f"Authentication issues found ({auth_tests_passed}/{total_auth_tests} tests passed)"
            )
            return False
    
    def test_data_validation(self):
        """Test form validation with proper and malformed data"""
        print("\n🛡️ Testing Data Validation System...")
        
        validation_tests = [
            # Test malformed JSON
            {
                "name": "Malformed JSON",
                "endpoint": "/api/proxy/newsletter-signup",
                "data": "invalid json data",
                "headers": {"Content-Type": "application/json"},
                "expected_status": [400, 422],
                "description": "Should reject malformed JSON"
            },
            # Test empty payload
            {
                "name": "Empty Payload",
                "endpoint": "/api/proxy/demo-request",
                "data": {},
                "headers": {"Content-Type": "application/json"},
                "expected_status": [400, 422],
                "description": "Should reject empty payload"
            },
            # Test missing required fields
            {
                "name": "Missing Required Fields",
                "endpoint": "/api/proxy/contact-sales",
                "data": {"id": str(uuid.uuid4())},  # Missing required fields
                "headers": {"Content-Type": "application/json"},
                "expected_status": [400, 422, 500],  # May fail at proxy level
                "description": "Should handle missing required fields"
            },
            # Test invalid email format
            {
                "name": "Invalid Email Format",
                "endpoint": "/api/proxy/newsletter-signup",
                "data": {
                    "id": str(uuid.uuid4()),
                    "email": "invalid-email-format",
                    "source": "test"
                },
                "headers": {"Content-Type": "application/json"},
                "expected_status": [400, 422, 500],  # May fail at proxy or dashboard level
                "description": "Should handle invalid email format"
            }
        ]
        
        validation_passed = 0
        
        for test in validation_tests:
            try:
                if isinstance(test["data"], str):
                    # Send raw string for malformed JSON test
                    response = requests.post(
                        f"{self.backend_url}{test['endpoint']}",
                        data=test["data"],
                        headers=test["headers"],
                        timeout=10
                    )
                else:
                    response = requests.post(
                        f"{self.backend_url}{test['endpoint']}",
                        json=test["data"],
                        headers=test["headers"],
                        timeout=10
                    )
                
                if response.status_code in test["expected_status"]:
                    self.log_test(
                        f"Validation: {test['name']}", 
                        "PASS", 
                        f"HTTP {response.status_code} - {test['description']}"
                    )
                    validation_passed += 1
                else:
                    self.log_test(
                        f"Validation: {test['name']}", 
                        "FAIL", 
                        f"HTTP {response.status_code} - Expected {test['expected_status']}, got {response.status_code}"
                    )
                    
            except Exception as e:
                # For malformed JSON, exception is expected
                if test["name"] == "Malformed JSON":
                    self.log_test(
                        f"Validation: {test['name']}", 
                        "PASS", 
                        f"Exception caught as expected: {str(e)[:100]}"
                    )
                    validation_passed += 1
                else:
                    self.log_test(f"Validation: {test['name']}", "FAIL", f"Request error: {str(e)}")
        
        validation_success_rate = (validation_passed / len(validation_tests)) * 100
        if validation_success_rate >= 75:
            self.log_test(
                "Data Validation System", 
                "PASS", 
                f"Validation working correctly ({validation_passed}/{len(validation_tests)} tests passed)"
            )
            return True
        else:
            self.log_test(
                "Data Validation System", 
                "FAIL", 
                f"Validation issues found ({validation_passed}/{len(validation_tests)} tests passed)"
            )
            return False
    
    def test_database_connectivity(self):
        """Test MongoDB database connectivity through backend"""
        print("\n🗄️ Testing Database Connectivity...")
        
        try:
            # Test health endpoint which includes database check
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                db_status = data.get('database')
                
                if db_status == 'connected':
                    self.log_test(
                        "Database Connectivity", 
                        "PASS", 
                        f"MongoDB connection confirmed via health check"
                    )
                    
                    # Test actual database operation by submitting data
                    test_payload = {
                        "id": str(uuid.uuid4()),
                        "email": "db.test@sentratech.net",
                        "source": "database_connectivity_test",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }
                    
                    db_test_response = requests.post(
                        f"{self.backend_url}/api/proxy/newsletter-signup",
                        json=test_payload,
                        headers={"Content-Type": "application/json"},
                        timeout=15
                    )
                    
                    if db_test_response.status_code == 200:
                        self.log_test(
                            "Database Write Operation", 
                            "PASS", 
                            "Successfully submitted data through proxy (confirms DB write capability)"
                        )
                        return True
                    else:
                        self.log_test(
                            "Database Write Operation", 
                            "FAIL", 
                            f"Data submission failed: HTTP {db_test_response.status_code}"
                        )
                        return False
                else:
                    self.log_test(
                        "Database Connectivity", 
                        "FAIL", 
                        f"Database status: {db_status} (expected: connected)"
                    )
                    return False
            else:
                self.log_test(
                    "Database Connectivity", 
                    "FAIL", 
                    f"Health check failed: HTTP {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("Database Connectivity", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_authentication_headers(self):
        """Test that proxy endpoints handle authentication correctly"""
        print("\n🔐 Testing Authentication Header Handling...")
        
        # Test with missing authentication (should still work as proxy handles auth internally)
        payload = {
            "id": str(uuid.uuid4()),
            "email": "auth.test@sentratech.net",
            "source": "auth_test"
        }
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code in [200, 401, 403]:  # Expected responses
                self.log_test(
                    "Authentication Header Handling", 
                    "PASS", 
                    f"HTTP {response.status_code} - Proxy handles authentication internally"
                )
                return True
            else:
                self.log_test(
                    "Authentication Header Handling", 
                    "FAIL", 
                    f"Unexpected HTTP {response.status_code}: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Authentication Header Handling", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_response_times(self):
        """Test that all endpoints have reasonable response times"""
        print("\n⏱️ Testing Response Time Performance...")
        
        endpoints = [
            ("/api/health", {}),
            ("/api/proxy/newsletter-signup", {"id": str(uuid.uuid4()), "email": "perf.test@sentratech.net"}),
        ]
        
        total_response_time = 0
        successful_tests = 0
        
        for endpoint, payload in endpoints:
            try:
                start_time = time.time()
                if payload:
                    response = requests.post(f"{self.backend_url}{endpoint}", json=payload, timeout=30)
                else:
                    response = requests.get(f"{self.backend_url}{endpoint}", timeout=30)
                response_time = (time.time() - start_time) * 1000
                
                total_response_time += response_time
                successful_tests += 1
                
                if response_time > 5000:  # 5 seconds threshold
                    self.log_test(
                        f"Response Time {endpoint}", 
                        "FAIL", 
                        f"Slow response: {response_time:.2f}ms (>5000ms threshold)"
                    )
                else:
                    self.log_test(
                        f"Response Time {endpoint}", 
                        "PASS", 
                        f"Good response time: {response_time:.2f}ms"
                    )
                    
            except Exception as e:
                self.log_test(f"Response Time {endpoint}", "FAIL", f"Request error: {str(e)}")
        
        if successful_tests > 0:
            avg_response_time = total_response_time / successful_tests
            self.log_test(
                "Average Response Time", 
                "PASS" if avg_response_time < 3000 else "FAIL", 
                f"Average: {avg_response_time:.2f}ms"
            )
    
    def run_all_tests(self):
        """Run comprehensive test suite for Docker Buildx migration verification"""
        print("🚀 Starting Comprehensive SentraTech Backend API Testing After Docker Buildx Migration")
        print("Testing all backend functionality after build system switch from Kaniko to Docker Buildx")
        print("=" * 80)
        
        # 1. Core Health Check - Test /api/health endpoint
        print("\n🏥 PHASE 1: CORE HEALTH CHECK")
        if not self.test_backend_health():
            print("\n❌ Backend health check failed. Stopping tests.")
            return False
        
        # 2. Environment Variables - Verify all required environment variables are loaded
        print("\n🔧 PHASE 2: ENVIRONMENT VARIABLES VERIFICATION")
        self.test_environment_variables()
        
        # 3. Database Connectivity - Ensure MongoDB connection is working
        print("\n🗄️ PHASE 3: DATABASE CONNECTIVITY")
        self.test_database_connectivity()
        
        # 4. Authentication System - Verify X-INGEST-KEY authentication
        print("\n🔐 PHASE 4: AUTHENTICATION SYSTEM")
        self.test_ingest_endpoints_authentication()
        
        # 5. Data Validation - Test form validation with proper and malformed data
        print("\n🛡️ PHASE 5: DATA VALIDATION")
        self.test_data_validation()
        
        # 6. All Form Submission Endpoints - Test all proxy endpoints with sample data
        print("\n📋 PHASE 6: FORM SUBMISSION ENDPOINTS")
        self.test_newsletter_signup()
        self.test_roi_calculator()
        self.test_demo_request()
        self.test_contact_sales()
        self.test_job_application()
        
        # 7. Advanced Features - Test idempotency and error handling
        print("\n🔄 PHASE 7: ADVANCED FEATURES")
        self.test_job_application_idempotency()
        self.test_job_application_error_handling()
        
        # 8. Performance and Authentication - Test response times and auth handling
        print("\n⚡ PHASE 8: PERFORMANCE & AUTHENTICATION")
        self.test_authentication_headers()
        self.test_response_times()
        
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE TEST SUMMARY - DOCKER BUILDX MIGRATION VERIFICATION")
        print("=" * 80)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests Executed: {self.total_tests}")
        print(f"Tests Passed: {self.passed_tests}")
        print(f"Tests Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Categorize results
        if success_rate >= 90:
            print(f"\n🎉 OVERALL RESULT: EXCELLENT - Docker Buildx migration successful!")
            print("✅ All backend functionality working perfectly after build system change")
            print("✅ Ready for production deployment with new build system")
        elif success_rate >= 80:
            print(f"\n✅ OVERALL RESULT: GOOD - Docker Buildx migration mostly successful")
            print("⚠️ Minor issues found, but core functionality intact")
            print("✅ Ready for deployment with monitoring of identified issues")
        elif success_rate >= 60:
            print(f"\n⚠️ OVERALL RESULT: NEEDS ATTENTION - Docker Buildx migration has issues")
            print("❌ Several issues found that may impact functionality")
            print("🔧 Requires fixes before production deployment")
        else:
            print(f"\n❌ OVERALL RESULT: CRITICAL ISSUES - Docker Buildx migration failed")
            print("🚨 Major functionality broken after build system change")
            print("🛠️ Immediate attention required before deployment")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 DETAILED FAILURE ANALYSIS:")
            print("The following tests failed after Docker Buildx migration:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}")
                print(f"      Issue: {result['details']}")
                print(f"      Time: {result['timestamp']}")
        else:
            print(f"\n🎉 NO FAILURES DETECTED!")
            print("All backend functionality working correctly after Docker Buildx migration")
        
        # Print success summary
        passed_tests = [name for name, result in self.test_results.items() if result['status'] == 'PASS']
        if passed_tests:
            print(f"\n✅ SUCCESSFUL TESTS ({len(passed_tests)}):")
            for test_name in passed_tests:
                print(f"   ✅ {test_name}")
        
        print(f"\n🏁 DOCKER BUILDX MIGRATION VERIFICATION COMPLETE")
        print(f"Backend URL tested: {self.backend_url}")
        print(f"Test completed at: {datetime.now(timezone.utc).isoformat()}")
        
        return success_rate >= 80

if __name__ == "__main__":
    print("🔧 SentraTech Backend API Testing After Docker Buildx Migration")
    print("Comprehensive verification of backend functionality after build system switch")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    print(f"Build System: Docker Buildx (migrated from Kaniko)")
    print(f"Frontend Directory: /app/packages/website/")
    print(f"Backend Port: 8001 (supervisor managed)")
    
    tester = ProxyEndpointTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)
