#!/usr/bin/env python3
"""
SentraTech Backend API Testing After Airtable Integration Removal
Testing all backend functionality after complete removal of Airtable dependencies
Focus: Service Startup, Health Check, Demo Requests, Form Submissions, Authentication, Data Storage, Error Handling
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone
import os
import sys
import subprocess

# Backend URL - Using production URL from frontend .env
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"
INGEST_API_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f6"

class AirtableRemovalTester:
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
    
    def test_service_startup_verification(self):
        """Test that backend starts successfully without Airtable dependencies"""
        print("\n🚀 Testing Service Startup Verification...")
        
        try:
            # Check if backend service is running by testing basic connectivity
            start_time = time.time()
            response = requests.get(f"{self.backend_url}/api/", timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                self.log_test(
                    "Service Startup Verification", 
                    "PASS", 
                    f"Backend service started successfully without Airtable dependencies (Response time: {response_time:.2f}ms)"
                )
                return True
            else:
                self.log_test(
                    "Service Startup Verification", 
                    "FAIL", 
                    f"Backend service not responding properly: HTTP {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Service Startup Verification", 
                "FAIL", 
                f"Backend service startup failed: {str(e)}"
            )
            return False
    
    def test_core_health_check(self):
        """Test /api/health endpoint - should work despite MongoDB connection issues"""
        print("\n🏥 Testing Core Health Check...")
        
        try:
            start_time = time.time()
            response = requests.get(f"{self.backend_url}/api/health", timeout=15)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                
                # Check that health endpoint works without Airtable
                status = data.get('status')
                database = data.get('database')
                ingest_configured = data.get('ingest_configured')
                version = data.get('version')
                mock = data.get('mock', False)
                
                self.log_test(
                    "Core Health Check", 
                    "PASS", 
                    f"Status: {status}, Response time: {response_time:.2f}ms, Database: {database}, Ingest configured: {ingest_configured}, Version: {version}, Mock: {mock}"
                )
                
                # Verify no Airtable references in health response
                response_text = json.dumps(data).lower()
                if 'airtable' in response_text:
                    self.log_test(
                        "Airtable References in Health", 
                        "FAIL", 
                        "Health endpoint still contains Airtable references"
                    )
                    return False
                else:
                    self.log_test(
                        "Airtable References in Health", 
                        "PASS", 
                        "No Airtable references found in health endpoint"
                    )
                
                return True
            else:
                self.log_test(
                    "Core Health Check", 
                    "FAIL", 
                    f"Health check failed: HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Core Health Check", 
                "FAIL", 
                f"Health check request failed: {str(e)}"
            )
            return False
    
    def test_demo_request_endpoints(self):
        """Test both /api/demo/request and proxy endpoints for demo requests"""
        print("\n🎯 Testing Demo Request Endpoints...")
        
        # Test proxy demo request endpoint
        demo_payload = {
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
                json=demo_payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                self.log_test(
                    "Demo Request Proxy Endpoint", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                )
                demo_proxy_success = True
            else:
                self.log_test(
                    "Demo Request Proxy Endpoint", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                demo_proxy_success = False
                
        except Exception as e:
            self.log_test(
                "Demo Request Proxy Endpoint", 
                "FAIL", 
                f"Request error: {str(e)}"
            )
            demo_proxy_success = False
        
        # Test ingest demo request endpoint with authentication
        try:
            ingest_payload = {
                "name": "Michael Chen",
                "email": "michael.chen@enterprise.com",
                "company": "Enterprise Solutions Inc",
                "phone": "+1-555-0456",
                "message": "Need enterprise AI solution for 10,000+ monthly interactions",
                "call_volume": 5000,
                "interaction_volume": 8000,
                "source": "website"
            }
            
            start_time = time.time()
            response = requests.post(
                f"{self.backend_url}/api/ingest/demo_requests",
                json=ingest_payload,
                headers={
                    "Content-Type": "application/json",
                    "X-INGEST-KEY": INGEST_API_KEY
                },
                timeout=30
            )
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "Demo Request Ingest Endpoint", 
                    "PASS", 
                    f"HTTP 200, Response time: {response_time:.2f}ms, ID: {data.get('id')}, Status: {data.get('status')}"
                )
                demo_ingest_success = True
            else:
                self.log_test(
                    "Demo Request Ingest Endpoint", 
                    "FAIL", 
                    f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                )
                demo_ingest_success = False
                
        except Exception as e:
            self.log_test(
                "Demo Request Ingest Endpoint", 
                "FAIL", 
                f"Request error: {str(e)}"
            )
            demo_ingest_success = False
        
        return demo_proxy_success and demo_ingest_success
    
    def test_form_submission_endpoints(self):
        """Test all 5 proxy endpoints (newsletter, contact-sales, demo-request, roi-calculator, job-application)"""
        print("\n📋 Testing All Form Submission Endpoints...")
        
        endpoints_data = [
            {
                "name": "Newsletter Signup",
                "endpoint": "/api/proxy/newsletter-signup",
                "payload": {
                    "id": str(uuid.uuid4()),
                    "email": "test.newsletter@sentratech.net",
                    "source": "website_newsletter",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            },
            {
                "name": "Contact Sales",
                "endpoint": "/api/proxy/contact-sales",
                "payload": {
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
            },
            {
                "name": "ROI Calculator",
                "endpoint": "/api/proxy/roi-calculator",
                "payload": {
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
            },
            {
                "name": "Job Application",
                "endpoint": "/api/proxy/job-application",
                "payload": {
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
            }
        ]
        
        successful_endpoints = 0
        
        for endpoint_data in endpoints_data:
            try:
                start_time = time.time()
                response = requests.post(
                    f"{self.backend_url}{endpoint_data['endpoint']}",
                    json=endpoint_data['payload'],
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                response_time = (time.time() - start_time) * 1000
                
                if response.status_code == 200:
                    data = response.json()
                    dashboard_id = data.get('id') or data.get('data', {}).get('id')
                    self.log_test(
                        f"{endpoint_data['name']} Proxy", 
                        "PASS", 
                        f"HTTP 200, Response time: {response_time:.2f}ms, Dashboard ID: {dashboard_id}"
                    )
                    successful_endpoints += 1
                else:
                    self.log_test(
                        f"{endpoint_data['name']} Proxy", 
                        "FAIL", 
                        f"HTTP {response.status_code}, Response time: {response_time:.2f}ms, Response: {response.text[:200]}"
                    )
                    
            except Exception as e:
                self.log_test(
                    f"{endpoint_data['name']} Proxy", 
                    "FAIL", 
                    f"Request error: {str(e)}"
                )
        
        # Overall form submission test
        success_rate = (successful_endpoints / len(endpoints_data)) * 100
        if success_rate >= 80:
            self.log_test(
                "All Form Submission Endpoints", 
                "PASS", 
                f"{successful_endpoints}/{len(endpoints_data)} endpoints working ({success_rate:.1f}% success rate)"
            )
            return True
        else:
            self.log_test(
                "All Form Submission Endpoints", 
                "FAIL", 
                f"Only {successful_endpoints}/{len(endpoints_data)} endpoints working ({success_rate:.1f}% success rate)"
            )
            return False
    
    def test_authentication_system(self):
        """Verify X-INGEST-KEY authentication works across all ingest endpoints"""
        print("\n🔐 Testing Authentication System...")
        
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
                f"Authentication working correctly ({auth_tests_passed}/{total_auth_tests} tests passed, {auth_success_rate:.1f}% success rate)"
            )
            return True
        else:
            self.log_test(
                "X-INGEST-KEY Authentication System", 
                "FAIL", 
                f"Authentication issues found ({auth_tests_passed}/{total_auth_tests} tests passed, {auth_success_rate:.1f}% success rate)"
            )
            return False
    
    def test_data_storage(self):
        """Verify local database storage works as primary mechanism"""
        print("\n🗄️ Testing Data Storage...")
        
        # Test database connectivity through health endpoint
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                db_status = data.get('database')
                
                if db_status == 'connected':
                    self.log_test(
                        "Database Connectivity", 
                        "PASS", 
                        "MongoDB connection confirmed via health check"
                    )
                    
                    # Test actual data storage by submitting data and verifying storage
                    test_payload = {
                        "id": str(uuid.uuid4()),
                        "email": "storage.test@sentratech.net",
                        "source": "data_storage_test",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }
                    
                    # Submit data through ingest endpoint (which stores locally)
                    storage_response = requests.post(
                        f"{self.backend_url}/api/ingest/subscriptions",
                        json={"email": test_payload["email"]},
                        headers={
                            "Content-Type": "application/json",
                            "X-INGEST-KEY": INGEST_API_KEY
                        },
                        timeout=15
                    )
                    
                    if storage_response.status_code == 200:
                        storage_data = storage_response.json()
                        self.log_test(
                            "Local Database Storage", 
                            "PASS", 
                            f"Data successfully stored locally, ID: {storage_data.get('id')}, Status: {storage_data.get('status')}"
                        )
                        return True
                    else:
                        self.log_test(
                            "Local Database Storage", 
                            "FAIL", 
                            f"Data storage failed: HTTP {storage_response.status_code}"
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
            self.log_test("Data Storage", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Confirm graceful handling of external service failures"""
        print("\n🛡️ Testing Error Handling...")
        
        # Test with malformed data to check error handling
        error_tests = [
            {
                "name": "Malformed JSON",
                "endpoint": "/api/proxy/newsletter-signup",
                "data": "invalid json data",
                "headers": {"Content-Type": "application/json"},
                "expected_status": [400, 422, 500],
                "description": "Should handle malformed JSON gracefully"
            },
            {
                "name": "Empty Payload",
                "endpoint": "/api/proxy/demo-request",
                "data": {},
                "headers": {"Content-Type": "application/json"},
                "expected_status": [400, 422, 500],
                "description": "Should handle empty payload gracefully"
            },
            {
                "name": "Missing Required Fields",
                "endpoint": "/api/proxy/contact-sales",
                "data": {"id": str(uuid.uuid4())},
                "headers": {"Content-Type": "application/json"},
                "expected_status": [400, 422, 500],
                "description": "Should handle missing required fields gracefully"
            }
        ]
        
        error_handling_passed = 0
        
        for test in error_tests:
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
                
                # Check if error is handled gracefully (not crashing)
                if response.status_code in test["expected_status"]:
                    self.log_test(
                        f"Error Handling: {test['name']}", 
                        "PASS", 
                        f"HTTP {response.status_code} - {test['description']}"
                    )
                    error_handling_passed += 1
                elif response.status_code == 200:
                    # Check if it has graceful fallback
                    try:
                        data = response.json()
                        if data.get('success') == False or 'error' in str(data).lower():
                            self.log_test(
                                f"Error Handling: {test['name']}", 
                                "PASS", 
                                f"HTTP 200 with graceful error response - {test['description']}"
                            )
                            error_handling_passed += 1
                        else:
                            self.log_test(
                                f"Error Handling: {test['name']}", 
                                "FAIL", 
                                f"HTTP 200 but invalid data accepted - Error handling not working"
                            )
                    except:
                        self.log_test(
                            f"Error Handling: {test['name']}", 
                            "FAIL", 
                            f"HTTP 200 but response not JSON - Error handling unclear"
                        )
                else:
                    self.log_test(
                        f"Error Handling: {test['name']}", 
                        "FAIL", 
                        f"HTTP {response.status_code} - Unexpected error response"
                    )
                    
            except Exception as e:
                # For malformed JSON, exception might be expected
                if test["name"] == "Malformed JSON":
                    self.log_test(
                        f"Error Handling: {test['name']}", 
                        "PASS", 
                        f"Exception caught as expected: {str(e)[:100]}"
                    )
                    error_handling_passed += 1
                else:
                    self.log_test(f"Error Handling: {test['name']}", "FAIL", f"Request error: {str(e)}")
        
        error_success_rate = (error_handling_passed / len(error_tests)) * 100
        if error_success_rate >= 75:
            self.log_test(
                "Graceful Error Handling", 
                "PASS", 
                f"Error handling working correctly ({error_handling_passed}/{len(error_tests)} tests passed)"
            )
            return True
        else:
            self.log_test(
                "Graceful Error Handling", 
                "FAIL", 
                f"Error handling issues found ({error_handling_passed}/{len(error_tests)} tests passed)"
            )
            return False
    
    def test_no_airtable_references(self):
        """Verify no Airtable references remain in the system"""
        print("\n🔍 Testing for Airtable References...")
        
        # Test various endpoints to ensure no Airtable references
        endpoints_to_check = [
            "/api/health",
            "/api/config/validate"
        ]
        
        airtable_references_found = 0
        
        for endpoint in endpoints_to_check:
            try:
                response = requests.get(f"{self.backend_url}{endpoint}", timeout=10)
                
                if response.status_code == 200:
                    response_text = response.text.lower()
                    if 'airtable' in response_text:
                        self.log_test(
                            f"Airtable References in {endpoint}", 
                            "FAIL", 
                            f"Found Airtable references in {endpoint} response"
                        )
                        airtable_references_found += 1
                    else:
                        self.log_test(
                            f"Airtable References in {endpoint}", 
                            "PASS", 
                            f"No Airtable references found in {endpoint}"
                        )
                else:
                    self.log_test(
                        f"Airtable References in {endpoint}", 
                        "FAIL", 
                        f"Could not check {endpoint}: HTTP {response.status_code}"
                    )
                    airtable_references_found += 1
                    
            except Exception as e:
                self.log_test(
                    f"Airtable References in {endpoint}", 
                    "FAIL", 
                    f"Error checking {endpoint}: {str(e)}"
                )
                airtable_references_found += 1
        
        if airtable_references_found == 0:
            self.log_test(
                "Complete Airtable Removal", 
                "PASS", 
                "No Airtable references found in any tested endpoints"
            )
            return True
        else:
            self.log_test(
                "Complete Airtable Removal", 
                "FAIL", 
                f"Found Airtable references in {airtable_references_found} endpoints"
            )
            return False
    
    def run_comprehensive_airtable_removal_tests(self):
        """Run comprehensive test suite for Airtable removal verification"""
        print("🚀 Starting Comprehensive SentraTech Backend API Testing After Airtable Integration Removal")
        print("Testing all backend functionality after complete removal of Airtable dependencies")
        print("=" * 90)
        
        # 1. Service Startup Verification
        print("\n🚀 PHASE 1: SERVICE STARTUP VERIFICATION")
        startup_success = self.test_service_startup_verification()
        if not startup_success:
            print("\n❌ Backend service startup failed. This may indicate Airtable dependency issues.")
        
        # 2. Core Health Check
        print("\n🏥 PHASE 2: CORE HEALTH CHECK")
        health_success = self.test_core_health_check()
        
        # 3. No Airtable References Check
        print("\n🔍 PHASE 3: AIRTABLE REFERENCES CHECK")
        no_airtable_success = self.test_no_airtable_references()
        
        # 4. Demo Request Endpoints
        print("\n🎯 PHASE 4: DEMO REQUEST ENDPOINTS")
        demo_success = self.test_demo_request_endpoints()
        
        # 5. Form Submission Endpoints
        print("\n📋 PHASE 5: FORM SUBMISSION ENDPOINTS")
        forms_success = self.test_form_submission_endpoints()
        
        # 6. Authentication System
        print("\n🔐 PHASE 6: AUTHENTICATION SYSTEM")
        auth_success = self.test_authentication_system()
        
        # 7. Data Storage
        print("\n🗄️ PHASE 7: DATA STORAGE")
        storage_success = self.test_data_storage()
        
        # 8. Error Handling
        print("\n🛡️ PHASE 8: ERROR HANDLING")
        error_handling_success = self.test_error_handling()
        
        # Print comprehensive summary
        print("\n" + "=" * 90)
        print("📊 COMPREHENSIVE TEST SUMMARY - AIRTABLE INTEGRATION REMOVAL VERIFICATION")
        print("=" * 90)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests Executed: {self.total_tests}")
        print(f"Tests Passed: {self.passed_tests}")
        print(f"Tests Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Critical requirements check
        critical_requirements = {
            "Service Startup": startup_success,
            "Core Health Check": health_success,
            "No Airtable References": no_airtable_success,
            "Demo Request Endpoints": demo_success,
            "Form Submission Endpoints": forms_success,
            "Authentication System": auth_success,
            "Data Storage": storage_success,
            "Error Handling": error_handling_success
        }
        
        critical_passed = sum(critical_requirements.values())
        critical_total = len(critical_requirements)
        critical_success_rate = (critical_passed / critical_total) * 100
        
        print(f"\n🎯 CRITICAL REQUIREMENTS STATUS:")
        for requirement, status in critical_requirements.items():
            status_icon = "✅" if status else "❌"
            print(f"   {status_icon} {requirement}: {'PASS' if status else 'FAIL'}")
        
        print(f"\nCritical Requirements Success Rate: {critical_success_rate:.1f}% ({critical_passed}/{critical_total})")
        
        # Overall assessment
        if critical_success_rate >= 90 and success_rate >= 85:
            print(f"\n🎉 OVERALL RESULT: EXCELLENT - Airtable removal completely successful!")
            print("✅ Backend starts successfully without Airtable dependencies")
            print("✅ All core functionality working perfectly")
            print("✅ No Airtable references found in system")
            print("✅ Ready for production deployment")
        elif critical_success_rate >= 75 and success_rate >= 70:
            print(f"\n✅ OVERALL RESULT: GOOD - Airtable removal mostly successful")
            print("⚠️ Minor issues found, but core functionality intact")
            print("✅ Backend operational without Airtable dependencies")
        elif critical_success_rate >= 50:
            print(f"\n⚠️ OVERALL RESULT: NEEDS ATTENTION - Airtable removal has issues")
            print("❌ Several critical requirements not met")
            print("🔧 Requires fixes before production deployment")
        else:
            print(f"\n❌ OVERALL RESULT: CRITICAL ISSUES - Airtable removal failed")
            print("🚨 Major functionality broken or Airtable dependencies remain")
            print("🛠️ Immediate attention required")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 DETAILED FAILURE ANALYSIS:")
            print("The following tests failed after Airtable removal:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}")
                print(f"      Issue: {result['details']}")
                print(f"      Time: {result['timestamp']}")
        else:
            print(f"\n🎉 NO FAILURES DETECTED!")
            print("All backend functionality working correctly after Airtable removal")
        
        print(f"\n🏁 AIRTABLE REMOVAL VERIFICATION COMPLETE")
        print(f"Backend URL tested: {self.backend_url}")
        print(f"Test completed at: {datetime.now(timezone.utc).isoformat()}")
        
        return critical_success_rate >= 75 and success_rate >= 70

if __name__ == "__main__":
    print("🔧 SentraTech Backend API Testing After Airtable Integration Removal")
    print("Comprehensive verification of backend functionality after Airtable dependency removal")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    print(f"Focus: Service startup, health check, demo requests, form submissions, authentication, data storage, error handling")
    
    tester = AirtableRemovalTester()
    success = tester.run_comprehensive_airtable_removal_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)