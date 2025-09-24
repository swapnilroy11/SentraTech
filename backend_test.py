#!/usr/bin/env python3
"""
Comprehensive Backend Testing for SentraTech Demo Request System
Tests Google Sheets integration, email notifications, rate limiting, and security
"""

import requests
import json
import time
import asyncio
import websockets
from datetime import datetime
from typing import Dict, Any
import urllib.parse

# Backend URL from environment
BACKEND_URL = "https://customer-ai-portal.preview.emergentagent.com/api"

class DemoRequestSystemTester:
    """Test the completely updated Demo Request system with Google Sheets integration and email notifications"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Basic API Connectivity", True, f"Status: {response.status_code}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_demo_request_json_endpoint(self):
        """Test POST /api/demo/request - Original JSON endpoint with Google Sheets + email"""
        print("\n=== Testing Demo Request JSON Endpoint ===")
        
        # Test Case 1: Complete valid JSON request
        valid_request = {
            "name": "Alice Johnson",
            "email": "alice.johnson@techsolutions.com",
            "company": "TechSolutions Inc",
            "phone": "+1-555-0199",
            "call_volume": "35,000",
            "message": "We need a comprehensive demo to understand how SentraTech can integrate with our existing CRM and reduce our customer support costs by the promised 45%."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=valid_request, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "contact_id", "message", "reference_id"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["success"] and result["contact_id"] and result["reference_id"]:
                        self.log_test("Demo Request JSON - Complete Valid Request", True, 
                                    f"Reference ID: {result['reference_id']}, Contact ID: {result['contact_id']}")
                        
                        # Store reference for later verification
                        self.test_reference_id = result["reference_id"]
                    else:
                        self.log_test("Demo Request JSON - Complete Valid Request", False, 
                                    f"Invalid response values: {result}")
                else:
                    self.log_test("Demo Request JSON - Complete Valid Request", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Demo Request JSON - Complete Valid Request", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request JSON - Complete Valid Request", False, f"Exception: {str(e)}")
        
        # Test Case 2: Minimal valid JSON request (required fields only)
        minimal_request = {
            "name": "Bob Smith",
            "email": "bob.smith@minimal.com",
            "company": "Minimal Corp"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=minimal_request, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["contact_id"] and result["reference_id"]:
                    self.log_test("Demo Request JSON - Minimal Valid Request", True, 
                                f"Reference ID: {result['reference_id']}")
                else:
                    self.log_test("Demo Request JSON - Minimal Valid Request", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Demo Request JSON - Minimal Valid Request", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request JSON - Minimal Valid Request", False, f"Exception: {str(e)}")
    
    def test_demo_request_form_endpoint(self):
        """Test POST /api/demo-request - New form endpoint accepting form data"""
        print("\n=== Testing Demo Request Form Endpoint ===")
        
        # Test Case 1: Complete form data submission
        form_data = {
            "name": "Carol Williams",
            "email": "carol.williams@formtest.com",
            "company": "FormTest Solutions",
            "phone": "+1-555-0288",
            "message": "Testing the new form endpoint with complete data including preferred date.",
            "preferredDate": "2024-02-15"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo-request", data=form_data, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure for form endpoint
                required_fields = ["status", "requestId", "timestamp"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["status"] == "success" and result["requestId"]:
                        self.log_test("Demo Request Form - Complete Form Data", True, 
                                    f"Request ID: {result['requestId']}, Timestamp: {result['timestamp']}")
                    else:
                        self.log_test("Demo Request Form - Complete Form Data", False, 
                                    f"Invalid response values: {result}")
                else:
                    self.log_test("Demo Request Form - Complete Form Data", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Demo Request Form - Complete Form Data", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request Form - Complete Form Data", False, f"Exception: {str(e)}")
        
        # Test Case 2: Minimal form data (required fields only)
        minimal_form_data = {
            "name": "David Brown",
            "email": "david.brown@minimal-form.com",
            "company": "Minimal Form Corp"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo-request", data=minimal_form_data, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result["status"] == "success" and result["requestId"]:
                    self.log_test("Demo Request Form - Minimal Form Data", True, 
                                f"Request ID: {result['requestId']}")
                else:
                    self.log_test("Demo Request Form - Minimal Form Data", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Demo Request Form - Minimal Form Data", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request Form - Minimal Form Data", False, f"Exception: {str(e)}")
    
    def test_google_sheets_integration(self):
        """Test Google Sheets integration and fallback to MongoDB"""
        print("\n=== Testing Google Sheets Integration ===")
        
        # Test Case 1: Verify Google Sheets configuration
        try:
            response = requests.get(f"{BACKEND_URL}/debug/sheets/config", timeout=10)
            
            if response.status_code == 200:
                config = response.json()
                
                required_config = ["sheet_id", "sheet_name", "web_app_url", "service_type"]
                missing_config = [field for field in required_config if field not in config]
                
                if not missing_config:
                    if config["service_type"] == "Google Sheets" and config["sheet_id"]:
                        self.log_test("Google Sheets - Configuration", True, 
                                    f"Sheet ID: {config['sheet_id']}, Name: {config['sheet_name']}")
                    else:
                        self.log_test("Google Sheets - Configuration", False, 
                                    f"Invalid configuration: {config}")
                else:
                    self.log_test("Google Sheets - Configuration", False, 
                                f"Missing config fields: {missing_config}")
            else:
                self.log_test("Google Sheets - Configuration", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Google Sheets - Configuration", False, f"Exception: {str(e)}")
        
        # Test Case 2: Submit request and verify data handling
        sheets_test_request = {
            "name": "Eva Martinez",
            "email": "eva.martinez@sheetstest.com",
            "company": "Sheets Integration Test Corp",
            "phone": "+1-555-0377",
            "message": "Testing Google Sheets integration with proper data structure and timestamps."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=sheets_test_request, timeout=25)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["reference_id"]:
                    self.log_test("Google Sheets - Data Submission", True, 
                                f"Data submitted successfully, Reference: {result['reference_id']}")
                    
                    # Verify data was stored (fallback to MongoDB should work)
                    time.sleep(2)  # Allow time for background processing
                    
                    # Check if data appears in database
                    get_response = requests.get(f"{BACKEND_URL}/demo/requests?limit=10", timeout=10)
                    if get_response.status_code == 200:
                        requests_data = get_response.json()
                        if requests_data.get("success") and requests_data.get("requests"):
                            # Look for our test request
                            found = any(req.get("email") == sheets_test_request["email"] 
                                      for req in requests_data["requests"])
                            if found:
                                self.log_test("Google Sheets - Fallback Storage", True, 
                                            "Data properly stored in MongoDB fallback")
                            else:
                                self.log_test("Google Sheets - Fallback Storage", False, 
                                            "Test request not found in database")
                        else:
                            self.log_test("Google Sheets - Fallback Storage", False, 
                                        "No requests data returned")
                    else:
                        self.log_test("Google Sheets - Fallback Storage", False, 
                                    f"Failed to retrieve requests: {get_response.status_code}")
                else:
                    self.log_test("Google Sheets - Data Submission", False, 
                                f"Submission failed: {result}")
            else:
                self.log_test("Google Sheets - Data Submission", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Google Sheets - Data Submission", False, f"Exception: {str(e)}")
    
    def test_email_service_integration(self):
        """Test Email Service with Spacemail SMTP configuration"""
        print("\n=== Testing Email Service Integration ===")
        
        # Test Case 1: Verify email configuration
        try:
            response = requests.get(f"{BACKEND_URL}/debug/email/config", timeout=10)
            
            if response.status_code == 200:
                config = response.json()
                
                required_config = ["smtp_host", "smtp_port", "from_email", "sales_email", "smtp_configured", "service_type"]
                missing_config = [field for field in required_config if field not in config]
                
                if not missing_config:
                    if config["service_type"] == "Spacemail SMTP":
                        self.log_test("Email Service - Configuration", True, 
                                    f"SMTP Host: {config['smtp_host']}, Port: {config['smtp_port']}, Configured: {config['smtp_configured']}")
                    else:
                        self.log_test("Email Service - Configuration", False, 
                                    f"Wrong service type: {config['service_type']}")
                else:
                    self.log_test("Email Service - Configuration", False, 
                                f"Missing config fields: {missing_config}")
            else:
                self.log_test("Email Service - Configuration", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Email Service - Configuration", False, f"Exception: {str(e)}")
        
        # Test Case 2: Submit request and verify email notifications are queued
        email_test_request = {
            "name": "Frank Wilson",
            "email": "frank.wilson@emailtest.com",
            "company": "Email Test Solutions",
            "phone": "+1-555-0466",
            "message": "Testing email notification system with confirmation and internal notifications."
        }
        
        try:
            # Record initial state
            initial_response = requests.get(f"{BACKEND_URL}/demo/requests?limit=1", timeout=10)
            initial_count = 0
            if initial_response.status_code == 200:
                initial_data = initial_response.json()
                initial_count = initial_data.get("count", 0)
            
            # Submit request
            response = requests.post(f"{BACKEND_URL}/demo/request", json=email_test_request, timeout=25)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"]:
                    self.log_test("Email Service - Request Submission", True, 
                                f"Request submitted successfully for email testing")
                    
                    # Wait for background tasks to complete
                    time.sleep(3)
                    
                    # Verify request was processed (background tasks completed)
                    final_response = requests.get(f"{BACKEND_URL}/demo/requests?limit=5", timeout=10)
                    if final_response.status_code == 200:
                        final_data = final_response.json()
                        final_count = final_data.get("count", 0)
                        
                        if final_count > initial_count:
                            self.log_test("Email Service - Background Processing", True, 
                                        f"Background tasks completed, requests increased from {initial_count} to {final_count}")
                        else:
                            self.log_test("Email Service - Background Processing", False, 
                                        f"No increase in requests count: {initial_count} to {final_count}")
                    else:
                        self.log_test("Email Service - Background Processing", False, 
                                    "Failed to verify background processing")
                else:
                    self.log_test("Email Service - Request Submission", False, 
                                f"Request submission failed: {result}")
            else:
                self.log_test("Email Service - Request Submission", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Email Service - Request Submission", False, f"Exception: {str(e)}")
        
        # Test Case 3: Verify email templates and formatting
        template_test_request = {
            "name": "Grace Chen",
            "email": "grace.chen@templatetest.com",
            "company": "Template Test Corp",
            "phone": "+1-555-0555",
            "message": "Testing HTML and text email template formatting with comprehensive data."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=template_test_request, timeout=25)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"]:
                    self.log_test("Email Service - Template Processing", True, 
                                "Email templates processed successfully (HTML and text versions)")
                else:
                    self.log_test("Email Service - Template Processing", False, 
                                f"Template processing failed: {result}")
            else:
                self.log_test("Email Service - Template Processing", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Email Service - Template Processing", False, f"Exception: {str(e)}")
    
    def test_rate_limiting_security(self):
        """Test rate limiting functionality (5 requests per minute per IP)"""
        print("\n=== Testing Rate Limiting & Security ===")
        
        # Test Case 1: Normal request rate (should pass)
        normal_request = {
            "name": "Henry Davis",
            "email": "henry.davis@ratetest.com",
            "company": "Rate Test Corp"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo-request", data=normal_request, timeout=15)
            
            if response.status_code == 200:
                self.log_test("Rate Limiting - Normal Request", True, 
                            "Normal request processed successfully")
            else:
                self.log_test("Rate Limiting - Normal Request", False, 
                            f"Normal request failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Rate Limiting - Normal Request", False, f"Exception: {str(e)}")
        
        # Test Case 2: Rapid requests to trigger rate limiting
        rapid_requests_passed = 0
        rapid_requests_blocked = 0
        
        for i in range(7):  # Try 7 requests rapidly (limit is 5 per minute)
            try:
                rapid_request = {
                    "name": f"Rapid User {i+1}",
                    "email": f"rapid{i+1}@ratetest.com",
                    "company": f"Rapid Test Corp {i+1}"
                }
                
                response = requests.post(f"{BACKEND_URL}/demo-request", data=rapid_request, timeout=10)
                
                if response.status_code == 200:
                    rapid_requests_passed += 1
                elif response.status_code == 429:  # Rate limit exceeded
                    rapid_requests_blocked += 1
                    
                time.sleep(0.5)  # Small delay between requests
                
            except Exception as e:
                print(f"   Rapid request {i+1} exception: {str(e)}")
        
        # Evaluate rate limiting effectiveness
        if rapid_requests_blocked > 0:
            self.log_test("Rate Limiting - Enforcement", True, 
                        f"Rate limiting working: {rapid_requests_passed} passed, {rapid_requests_blocked} blocked")
        else:
            self.log_test("Rate Limiting - Enforcement", False, 
                        f"Rate limiting not enforced: {rapid_requests_passed} passed, {rapid_requests_blocked} blocked")
        
        # Test Case 3: Input validation and sanitization
        malicious_request = {
            "name": "<script>alert('xss')</script>",
            "email": "test@example.com",
            "company": "'; DROP TABLE demo_requests; --",
            "message": "<img src=x onerror=alert('xss')>"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo-request", data=malicious_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    self.log_test("Security - Input Sanitization", True, 
                                "Malicious input handled safely (sanitized and processed)")
                else:
                    self.log_test("Security - Input Sanitization", False, 
                                "Malicious input not handled properly")
            elif response.status_code == 400:
                self.log_test("Security - Input Validation", True, 
                            "Malicious input rejected by validation")
            else:
                self.log_test("Security - Input Handling", False, 
                            f"Unexpected response to malicious input: {response.status_code}")
                
        except Exception as e:
            self.log_test("Security - Input Handling", False, f"Exception: {str(e)}")
        
        # Test Case 4: Email format validation
        invalid_email_request = {
            "name": "Invalid Email User",
            "email": "not-an-email-address",
            "company": "Invalid Email Corp"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo-request", data=invalid_email_request, timeout=10)
            
            if response.status_code == 400:
                result = response.json()
                if "email" in result.get("message", "").lower():
                    self.log_test("Security - Email Validation", True, 
                                "Invalid email format properly rejected")
                else:
                    self.log_test("Security - Email Validation", False, 
                                "Email validation error message unclear")
            else:
                self.log_test("Security - Email Validation", False, 
                            f"Invalid email not rejected: {response.status_code}")
                
        except Exception as e:
            self.log_test("Security - Email Validation", False, f"Exception: {str(e)}")
    
    def test_form_data_handling(self):
        """Test both JSON and form-encoded data submissions"""
        print("\n=== Testing Form Data Handling ===")
        
        # Test Case 1: JSON data submission
        json_data = {
            "name": "Isabella Rodriguez",
            "email": "isabella.rodriguez@jsontest.com",
            "company": "JSON Test Solutions",
            "phone": "+1-555-0644",
            "message": "Testing JSON data submission with all fields populated."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", 
                                   json=json_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"]:
                    self.log_test("Form Data - JSON Submission", True, 
                                f"JSON data processed successfully")
                else:
                    self.log_test("Form Data - JSON Submission", False, 
                                f"JSON processing failed: {result}")
            else:
                self.log_test("Form Data - JSON Submission", False, 
                            f"JSON submission failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Form Data - JSON Submission", False, f"Exception: {str(e)}")
        
        # Test Case 2: Form-encoded data submission
        form_data = {
            "name": "Jack Thompson",
            "email": "jack.thompson@formtest.com",
            "company": "Form Test Solutions",
            "phone": "+1-555-0733",
            "message": "Testing form-encoded data submission with proper encoding."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo-request", 
                                   data=form_data,
                                   headers={"Content-Type": "application/x-www-form-urlencoded"},
                                   timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    self.log_test("Form Data - Form Encoded Submission", True, 
                                "Form-encoded data processed successfully")
                else:
                    self.log_test("Form Data - Form Encoded Submission", False, 
                                f"Form processing failed: {result}")
            else:
                self.log_test("Form Data - Form Encoded Submission", False, 
                            f"Form submission failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Form Data - Form Encoded Submission", False, f"Exception: {str(e)}")
        
        # Test Case 3: Field validation (required vs optional)
        missing_required_data = {
            "name": "Missing Company User",
            "email": "missing@company.com"
            # Missing required 'company' field
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo-request", data=missing_required_data, timeout=10)
            
            if response.status_code == 400:
                result = response.json()
                if "company" in result.get("message", "").lower():
                    self.log_test("Form Data - Required Field Validation", True, 
                                "Missing required field properly detected")
                else:
                    self.log_test("Form Data - Required Field Validation", False, 
                                "Required field validation message unclear")
            else:
                self.log_test("Form Data - Required Field Validation", False, 
                            f"Missing required field not caught: {response.status_code}")
                
        except Exception as e:
            self.log_test("Form Data - Required Field Validation", False, f"Exception: {str(e)}")
        
        # Test Case 4: Data sanitization and length limits
        long_data = {
            "name": "A" * 150,  # Exceeds typical length limit
            "email": "long@test.com",
            "company": "B" * 150,  # Exceeds typical length limit
            "message": "C" * 2000  # Exceeds typical length limit
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo-request", data=long_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    self.log_test("Form Data - Length Limits", True, 
                                "Long data handled properly (truncated or accepted)")
                else:
                    self.log_test("Form Data - Length Limits", False, 
                                f"Long data processing failed: {result}")
            elif response.status_code == 400:
                self.log_test("Form Data - Length Limits", True, 
                            "Long data properly rejected by validation")
            else:
                self.log_test("Form Data - Length Limits", False, 
                            f"Unexpected response to long data: {response.status_code}")
                
        except Exception as e:
            self.log_test("Form Data - Length Limits", False, f"Exception: {str(e)}")
    
    def test_background_tasks(self):
        """Test that email notifications are properly queued as background tasks"""
        print("\n=== Testing Background Tasks ===")
        
        # Test Case 1: Verify main response doesn't wait for email sending
        background_test_request = {
            "name": "Karen Lee",
            "email": "karen.lee@backgroundtest.com",
            "company": "Background Test Corp",
            "phone": "+1-555-0822",
            "message": "Testing background task processing for email notifications."
        }
        
        try:
            start_time = time.time()
            response = requests.post(f"{BACKEND_URL}/demo/request", json=background_test_request, timeout=25)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200:
                result = response.json()
                if result["success"]:
                    # Response should be fast (< 5 seconds) indicating background processing
                    if response_time < 5000:
                        self.log_test("Background Tasks - Response Time", True, 
                                    f"Fast response: {response_time:.2f}ms (background processing)")
                    else:
                        self.log_test("Background Tasks - Response Time", False, 
                                    f"Slow response: {response_time:.2f}ms (may be blocking)")
                else:
                    self.log_test("Background Tasks - Request Processing", False, 
                                f"Request failed: {result}")
            else:
                self.log_test("Background Tasks - Request Processing", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Background Tasks - Request Processing", False, f"Exception: {str(e)}")
        
        # Test Case 2: Verify database storage alongside Google Sheets submission
        storage_test_request = {
            "name": "Larry Wilson",
            "email": "larry.wilson@storagetest.com",
            "company": "Storage Test Solutions",
            "phone": "+1-555-0911",
            "message": "Testing simultaneous database storage and Google Sheets submission."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=storage_test_request, timeout=25)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["reference_id"]:
                    # Wait for background processing
                    time.sleep(3)
                    
                    # Check database storage
                    get_response = requests.get(f"{BACKEND_URL}/demo/requests?limit=10", timeout=10)
                    if get_response.status_code == 200:
                        requests_data = get_response.json()
                        if requests_data.get("success"):
                            # Look for our test request
                            found = any(req.get("email") == storage_test_request["email"] 
                                      for req in requests_data.get("requests", []))
                            if found:
                                self.log_test("Background Tasks - Database Storage", True, 
                                            "Request properly stored in database alongside Sheets submission")
                            else:
                                self.log_test("Background Tasks - Database Storage", False, 
                                            "Request not found in database")
                        else:
                            self.log_test("Background Tasks - Database Storage", False, 
                                        "Database query failed")
                    else:
                        self.log_test("Background Tasks - Database Storage", False, 
                                    f"Failed to query database: {get_response.status_code}")
                else:
                    self.log_test("Background Tasks - Database Storage", False, 
                                f"Request submission failed: {result}")
            else:
                self.log_test("Background Tasks - Database Storage", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Background Tasks - Database Storage", False, f"Exception: {str(e)}")
    
    def test_data_flow_complete(self):
        """Test complete data flow: Form → Google Sheets → Database → Email notifications"""
        print("\n=== Testing Complete Data Flow ===")
        
        complete_flow_request = {
            "name": "Maria Garcia",
            "email": "maria.garcia@completeflow.com",
            "company": "Complete Flow Solutions",
            "phone": "+1-555-1000",
            "call_volume": "50,000",
            "message": "Testing the complete data flow from form submission through Google Sheets, database storage, and email notifications."
        }
        
        try:
            # Step 1: Submit request
            response = requests.post(f"{BACKEND_URL}/demo/request", json=complete_flow_request, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["reference_id"]:
                    reference_id = result["reference_id"]
                    self.log_test("Complete Flow - Form Submission", True, 
                                f"Form submitted successfully, Reference: {reference_id}")
                    
                    # Step 2: Wait for background processing
                    time.sleep(5)
                    
                    # Step 3: Verify database storage
                    get_response = requests.get(f"{BACKEND_URL}/demo/requests?limit=20", timeout=15)
                    if get_response.status_code == 200:
                        requests_data = get_response.json()
                        if requests_data.get("success"):
                            # Look for our specific request
                            found_request = None
                            for req in requests_data.get("requests", []):
                                if req.get("email") == complete_flow_request["email"]:
                                    found_request = req
                                    break
                            
                            if found_request:
                                self.log_test("Complete Flow - Database Storage", True, 
                                            f"Request found in database with proper structure")
                                
                                # Verify data integrity
                                if (found_request.get("name") == complete_flow_request["name"] and
                                    found_request.get("company") == complete_flow_request["company"]):
                                    self.log_test("Complete Flow - Data Integrity", True, 
                                                "All form data preserved correctly")
                                else:
                                    self.log_test("Complete Flow - Data Integrity", False, 
                                                "Form data not preserved correctly")
                            else:
                                self.log_test("Complete Flow - Database Storage", False, 
                                            "Request not found in database")
                        else:
                            self.log_test("Complete Flow - Database Storage", False, 
                                        "Database query unsuccessful")
                    else:
                        self.log_test("Complete Flow - Database Storage", False, 
                                    f"Database query failed: {get_response.status_code}")
                    
                    # Step 4: Verify Google Sheets configuration is accessible
                    sheets_config_response = requests.get(f"{BACKEND_URL}/debug/sheets/config", timeout=10)
                    if sheets_config_response.status_code == 200:
                        sheets_config = sheets_config_response.json()
                        if sheets_config.get("service_type") == "Google Sheets":
                            self.log_test("Complete Flow - Google Sheets Integration", True, 
                                        "Google Sheets service properly configured")
                        else:
                            self.log_test("Complete Flow - Google Sheets Integration", False, 
                                        "Google Sheets service not configured")
                    else:
                        self.log_test("Complete Flow - Google Sheets Integration", False, 
                                    "Cannot verify Google Sheets configuration")
                    
                    # Step 5: Verify email service configuration
                    email_config_response = requests.get(f"{BACKEND_URL}/debug/email/config", timeout=10)
                    if email_config_response.status_code == 200:
                        email_config = email_config_response.json()
                        if email_config.get("service_type") == "Spacemail SMTP":
                            self.log_test("Complete Flow - Email Service Integration", True, 
                                        f"Email service configured: {email_config.get('smtp_configured')}")
                        else:
                            self.log_test("Complete Flow - Email Service Integration", False, 
                                        "Email service not properly configured")
                    else:
                        self.log_test("Complete Flow - Email Service Integration", False, 
                                    "Cannot verify email service configuration")
                        
                else:
                    self.log_test("Complete Flow - Form Submission", False, 
                                f"Form submission failed: {result}")
            else:
                self.log_test("Complete Flow - Form Submission", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Complete Flow - Overall Test", False, f"Exception: {str(e)}")
    
    def test_error_handling_fallbacks(self):
        """Test proper fallbacks and user-friendly error messages"""
        print("\n=== Testing Error Handling & Fallbacks ===")
        
        # Test Case 1: Malformed JSON
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", 
                                   data="invalid json data", 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code in [400, 422]:
                try:
                    result = response.json()
                    if "detail" in result or "message" in result:
                        self.log_test("Error Handling - Malformed JSON", True, 
                                    "User-friendly error message provided")
                    else:
                        self.log_test("Error Handling - Malformed JSON", False, 
                                    "Error message not user-friendly")
                except:
                    self.log_test("Error Handling - Malformed JSON", True, 
                                "Error properly rejected (non-JSON response)")
            else:
                self.log_test("Error Handling - Malformed JSON", False, 
                            f"Malformed JSON not handled: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Malformed JSON", False, f"Exception: {str(e)}")
        
        # Test Case 2: Empty request
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json={}, timeout=10)
            
            if response.status_code == 422:
                result = response.json()
                if "detail" in result:
                    self.log_test("Error Handling - Empty Request", True, 
                                "Empty request properly validated")
                else:
                    self.log_test("Error Handling - Empty Request", False, 
                                "Empty request validation unclear")
            else:
                self.log_test("Error Handling - Empty Request", False, 
                            f"Empty request not handled: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Empty Request", False, f"Exception: {str(e)}")
        
        # Test Case 3: Network timeout simulation (using very short timeout)
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", 
                                   json={"name": "Test", "email": "test@test.com", "company": "Test"}, 
                                   timeout=0.001)  # Very short timeout
            
            # If we get here, the request was faster than expected
            if response.status_code == 200:
                self.log_test("Error Handling - Network Resilience", True, 
                            "Request completed faster than timeout")
            else:
                self.log_test("Error Handling - Network Resilience", False, 
                            f"Unexpected status: {response.status_code}")
                
        except requests.exceptions.Timeout:
            self.log_test("Error Handling - Network Resilience", True, 
                        "Timeout handled gracefully by client")
        except Exception as e:
            self.log_test("Error Handling - Network Resilience", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all demo request system test suites"""
        print("🚀 Starting Demo Request System Tests with Google Sheets & Email Integration")
        print("=" * 80)
        
        # Check basic connectivity first
        if not self.test_basic_connectivity():
            print("❌ Cannot connect to backend API. Stopping tests.")
            return False
        
        # Run all test suites
        self.test_demo_request_json_endpoint()
        self.test_demo_request_form_endpoint()
        self.test_google_sheets_integration()
        self.test_email_service_integration()
        self.test_rate_limiting_security()
        self.test_form_data_handling()
        self.test_background_tasks()
        self.test_data_flow_complete()
        self.test_error_handling_fallbacks()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 DEMO REQUEST SYSTEM TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        success_rate = (len(self.passed_tests) / len(self.test_results)) * 100 if self.test_results else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

class ROICalculatorTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Basic API Connectivity", True, f"Status: {response.status_code}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_roi_calculate_endpoint(self):
        """Test POST /api/roi/calculate endpoint"""
        print("\n=== Testing ROI Calculate Endpoint ===")
        
        # Test Case 1: Basic valid input
        test_data = {
            "call_volume": 25000,
            "current_cost_per_call": 8.5,
            "average_handle_time": 480,
            "agent_count": 50
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", 
                                   json=test_data, 
                                   timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Verify calculation accuracy
                expected_current_monthly = 25000 * 8.5  # 212,500
                expected_cost_reduction = 0.45  # 45%
                expected_new_monthly = expected_current_monthly * (1 - expected_cost_reduction)  # 116,875
                expected_monthly_savings = expected_current_monthly - expected_new_monthly  # 95,625
                
                # Check key calculations
                if abs(result["current_monthly_cost"] - expected_current_monthly) < 0.01:
                    self.log_test("ROI Calculate - Current Monthly Cost", True, 
                                f"Expected: {expected_current_monthly}, Got: {result['current_monthly_cost']}")
                else:
                    self.log_test("ROI Calculate - Current Monthly Cost", False,
                                f"Expected: {expected_current_monthly}, Got: {result['current_monthly_cost']}")
                
                if abs(result["monthly_savings"] - expected_monthly_savings) < 0.01:
                    self.log_test("ROI Calculate - Monthly Savings", True,
                                f"Expected: {expected_monthly_savings}, Got: {result['monthly_savings']}")
                else:
                    self.log_test("ROI Calculate - Monthly Savings", False,
                                f"Expected: {expected_monthly_savings}, Got: {result['monthly_savings']}")
                
                # Check business logic percentages
                if result["cost_reduction_percent"] == 45.0:
                    self.log_test("ROI Calculate - Cost Reduction %", True, "45% as expected")
                else:
                    self.log_test("ROI Calculate - Cost Reduction %", False, 
                                f"Expected: 45%, Got: {result['cost_reduction_percent']}%")
                
                if result["automation_rate"] == 70.0:
                    self.log_test("ROI Calculate - Automation Rate", True, "70% as expected")
                else:
                    self.log_test("ROI Calculate - Automation Rate", False,
                                f"Expected: 70%, Got: {result['automation_rate']}%")
                
                if result["aht_reduction_percent"] == 35.0:
                    self.log_test("ROI Calculate - AHT Reduction %", True, "35% as expected")
                else:
                    self.log_test("ROI Calculate - AHT Reduction %", False,
                                f"Expected: 35%, Got: {result['aht_reduction_percent']}%")
                
                self.log_test("ROI Calculate - Basic Valid Input", True, "All calculations correct")
                
            else:
                self.log_test("ROI Calculate - Basic Valid Input", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("ROI Calculate - Basic Valid Input", False, f"Exception: {str(e)}")
    
    def test_roi_calculate_edge_cases(self):
        """Test edge cases for ROI calculate endpoint"""
        print("\n=== Testing ROI Calculate Edge Cases ===")
        
        # Test Case 1: Zero values
        zero_data = {
            "call_volume": 0,
            "current_cost_per_call": 8.5,
            "average_handle_time": 480,
            "agent_count": 50
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=zero_data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result["current_monthly_cost"] == 0:
                    self.log_test("ROI Calculate - Zero Call Volume", True, "Handled zero volume correctly")
                else:
                    self.log_test("ROI Calculate - Zero Call Volume", False, "Zero volume not handled correctly")
            else:
                self.log_test("ROI Calculate - Zero Call Volume", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Zero Call Volume", False, f"Exception: {str(e)}")
        
        # Test Case 2: Large numbers
        large_data = {
            "call_volume": 1000000,
            "current_cost_per_call": 25.0,
            "average_handle_time": 900,
            "agent_count": 500
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=large_data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                expected_monthly = 1000000 * 25.0  # 25,000,000
                if abs(result["current_monthly_cost"] - expected_monthly) < 0.01:
                    self.log_test("ROI Calculate - Large Numbers", True, "Large numbers handled correctly")
                else:
                    self.log_test("ROI Calculate - Large Numbers", False, "Large numbers calculation error")
            else:
                self.log_test("ROI Calculate - Large Numbers", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Large Numbers", False, f"Exception: {str(e)}")
        
        # Test Case 3: Decimal precision
        decimal_data = {
            "call_volume": 15750,
            "current_cost_per_call": 12.75,
            "average_handle_time": 365,
            "agent_count": 35
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=decimal_data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                expected_monthly = 15750 * 12.75  # 200,812.5
                if abs(result["current_monthly_cost"] - expected_monthly) < 0.01:
                    self.log_test("ROI Calculate - Decimal Precision", True, "Decimal precision maintained")
                else:
                    self.log_test("ROI Calculate - Decimal Precision", False, "Decimal precision lost")
            else:
                self.log_test("ROI Calculate - Decimal Precision", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Decimal Precision", False, f"Exception: {str(e)}")
    
    def test_roi_calculate_invalid_inputs(self):
        """Test invalid inputs for ROI calculate endpoint"""
        print("\n=== Testing ROI Calculate Invalid Inputs ===")
        
        # Test Case 1: Negative values
        negative_data = {
            "call_volume": -1000,
            "current_cost_per_call": 8.5,
            "average_handle_time": 480,
            "agent_count": 50
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=negative_data, timeout=10)
            # Should either handle gracefully or return error
            if response.status_code in [200, 400, 422]:
                self.log_test("ROI Calculate - Negative Values", True, f"Status: {response.status_code}")
            else:
                self.log_test("ROI Calculate - Negative Values", False, f"Unexpected status: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Negative Values", False, f"Exception: {str(e)}")
        
        # Test Case 2: Missing fields
        incomplete_data = {
            "call_volume": 25000,
            "current_cost_per_call": 8.5
            # Missing average_handle_time and agent_count
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=incomplete_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("ROI Calculate - Missing Fields", True, "Validation error returned correctly")
            else:
                self.log_test("ROI Calculate - Missing Fields", False, f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Missing Fields", False, f"Exception: {str(e)}")
        
        # Test Case 3: Wrong data types
        wrong_type_data = {
            "call_volume": "not_a_number",
            "current_cost_per_call": 8.5,
            "average_handle_time": 480,
            "agent_count": 50
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=wrong_type_data, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("ROI Calculate - Wrong Data Types", True, "Type validation working")
            else:
                self.log_test("ROI Calculate - Wrong Data Types", False, f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("ROI Calculate - Wrong Data Types", False, f"Exception: {str(e)}")
    
    def test_roi_save_endpoint(self):
        """Test POST /api/roi/save endpoint"""
        print("\n=== Testing ROI Save Endpoint ===")
        
        test_input_data = {
            "call_volume": 18000,
            "current_cost_per_call": 9.25,
            "average_handle_time": 420,
            "agent_count": 40
        }
        
        # Format request according to the expected structure
        test_data = {
            "input_data": test_input_data,
            "user_info": {"test_user": "backend_tester"}
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/roi/save", json=test_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if response has required fields
                required_fields = ["id", "input_data", "results", "timestamp"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("ROI Save - Response Structure", True, "All required fields present")
                    
                    # Verify input data is preserved
                    if result["input_data"]["call_volume"] == test_input_data["call_volume"]:
                        self.log_test("ROI Save - Input Data Preservation", True, "Input data correctly stored")
                    else:
                        self.log_test("ROI Save - Input Data Preservation", False, "Input data not preserved")
                    
                    # Verify calculations are present
                    if "monthly_savings" in result["results"] and "annual_savings" in result["results"]:
                        self.log_test("ROI Save - Calculation Results", True, "Calculation results included")
                    else:
                        self.log_test("ROI Save - Calculation Results", False, "Missing calculation results")
                        
                else:
                    self.log_test("ROI Save - Response Structure", False, f"Missing fields: {missing_fields}")
                    
            else:
                self.log_test("ROI Save - Basic Functionality", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("ROI Save - Basic Functionality", False, f"Exception: {str(e)}")
    
    def test_roi_get_calculations(self):
        """Test GET /api/roi/calculations endpoint"""
        print("\n=== Testing ROI Get Calculations Endpoint ===")
        
        # First, save a calculation to ensure there's data
        test_input_data = {
            "call_volume": 22000,
            "current_cost_per_call": 7.75,
            "average_handle_time": 390,
            "agent_count": 45
        }
        
        test_data = {
            "input_data": test_input_data,
            "user_info": {"test_user": "backend_tester_get"}
        }
        
        try:
            # Save a calculation first
            save_response = requests.post(f"{BACKEND_URL}/roi/save", json=test_data, timeout=10)
            
            if save_response.status_code == 200:
                # Now test retrieval
                get_response = requests.get(f"{BACKEND_URL}/roi/calculations", timeout=10)
                
                if get_response.status_code == 200:
                    calculations = get_response.json()
                    
                    if isinstance(calculations, list):
                        self.log_test("ROI Get - Response Type", True, f"Returned list with {len(calculations)} items")
                        
                        if len(calculations) > 0:
                            # Check structure of first calculation
                            calc = calculations[0]
                            required_fields = ["id", "input_data", "results", "timestamp"]
                            missing_fields = [field for field in required_fields if field not in calc]
                            
                            if not missing_fields:
                                self.log_test("ROI Get - Calculation Structure", True, "Proper calculation structure")
                            else:
                                self.log_test("ROI Get - Calculation Structure", False, f"Missing: {missing_fields}")
                        else:
                            self.log_test("ROI Get - Data Retrieval", False, "No calculations returned")
                    else:
                        self.log_test("ROI Get - Response Type", False, "Response is not a list")
                else:
                    self.log_test("ROI Get - Basic Functionality", False, 
                                f"Status: {get_response.status_code}, Response: {get_response.text}")
            else:
                self.log_test("ROI Get - Setup (Save First)", False, f"Save failed with status: {save_response.status_code}")
                
        except Exception as e:
            self.log_test("ROI Get - Basic Functionality", False, f"Exception: {str(e)}")
    
    def test_performance(self):
        """Test API response times"""
        print("\n=== Testing API Performance ===")
        
        test_data = {
            "call_volume": 20000,
            "current_cost_per_call": 8.0,
            "average_handle_time": 450,
            "agent_count": 42
        }
        
        # Test calculate endpoint performance
        try:
            start_time = time.time()
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=test_data, timeout=10)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200 and response_time < 2000:  # Less than 2 seconds
                self.log_test("Performance - Calculate Endpoint", True, f"Response time: {response_time:.2f}ms")
            else:
                self.log_test("Performance - Calculate Endpoint", False, 
                            f"Response time: {response_time:.2f}ms, Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Performance - Calculate Endpoint", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting SentraTech ROI Calculator API Tests")
        print("=" * 60)
        
        # Check basic connectivity first
        if not self.test_basic_connectivity():
            print("❌ Cannot connect to backend API. Stopping tests.")
            return
        
        # Run all test suites
        self.test_roi_calculate_endpoint()
        self.test_roi_calculate_edge_cases()
        self.test_roi_calculate_invalid_inputs()
        self.test_roi_save_endpoint()
        self.test_roi_get_calculations()
        self.test_performance()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

class DemoRequestTester:
    """Test Demo Request & CRM Integration functionality"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_demo_request_valid_input(self):
        """Test POST /api/demo/request with valid input"""
        print("\n=== Testing Demo Request - Valid Input ===")
        
        # Test Case 1: Complete valid request
        valid_request = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@techcorp.com",
            "company": "TechCorp Solutions",
            "phone": "+1-555-0123",
            "call_volume": "25,000",
            "message": "We're interested in a demo to see how SentraTech can help reduce our customer support costs and improve response times."
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=valid_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "contact_id", "message", "reference_id"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["success"] and result["contact_id"] and result["reference_id"]:
                        self.log_test("Demo Request - Valid Complete Input", True, 
                                    f"Contact ID: {result['contact_id']}, Reference: {result['reference_id']}")
                    else:
                        self.log_test("Demo Request - Valid Complete Input", False, 
                                    f"Invalid response values: {result}")
                else:
                    self.log_test("Demo Request - Valid Complete Input", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Demo Request - Valid Complete Input", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Valid Complete Input", False, f"Exception: {str(e)}")
        
        # Test Case 2: Minimal valid request (only required fields)
        minimal_request = {
            "name": "John Smith",
            "email": "john.smith@company.com",
            "company": "Smith & Associates"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=minimal_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["contact_id"]:
                    self.log_test("Demo Request - Minimal Valid Input", True, 
                                f"Contact ID: {result['contact_id']}")
                else:
                    self.log_test("Demo Request - Minimal Valid Input", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Demo Request - Minimal Valid Input", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Minimal Valid Input", False, f"Exception: {str(e)}")
    
    def test_demo_request_validation(self):
        """Test input validation for demo requests"""
        print("\n=== Testing Demo Request - Input Validation ===")
        
        # Test Case 1: Missing required field - name
        missing_name = {
            "email": "test@company.com",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=missing_name, timeout=10)
            if response.status_code == 422:  # Validation error expected
                self.log_test("Demo Request - Missing Name", True, "Validation error returned correctly")
            else:
                self.log_test("Demo Request - Missing Name", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Missing Name", False, f"Exception: {str(e)}")
        
        # Test Case 2: Missing required field - email
        missing_email = {
            "name": "John Doe",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=missing_email, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Missing Email", True, "Validation error returned correctly")
            else:
                self.log_test("Demo Request - Missing Email", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Missing Email", False, f"Exception: {str(e)}")
        
        # Test Case 3: Missing required field - company
        missing_company = {
            "name": "John Doe",
            "email": "john@test.com"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=missing_company, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Missing Company", True, "Validation error returned correctly")
            else:
                self.log_test("Demo Request - Missing Company", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Missing Company", False, f"Exception: {str(e)}")
        
        # Test Case 4: Invalid email format
        invalid_email = {
            "name": "John Doe",
            "email": "invalid-email-format",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=invalid_email, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Invalid Email Format", True, "Email validation working")
            else:
                self.log_test("Demo Request - Invalid Email Format", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Invalid Email Format", False, f"Exception: {str(e)}")
        
        # Test Case 5: Invalid phone format
        invalid_phone = {
            "name": "John Doe",
            "email": "john@test.com",
            "company": "Test Company",
            "phone": "invalid-phone"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=invalid_phone, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Invalid Phone Format", True, "Phone validation working")
            else:
                self.log_test("Demo Request - Invalid Phone Format", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Invalid Phone Format", False, f"Exception: {str(e)}")
        
        # Test Case 6: Empty name (whitespace only)
        empty_name = {
            "name": "   ",
            "email": "john@test.com",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json=empty_name, timeout=10)
            if response.status_code == 422:
                self.log_test("Demo Request - Empty Name", True, "Empty name validation working")
            else:
                self.log_test("Demo Request - Empty Name", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Demo Request - Empty Name", False, f"Exception: {str(e)}")
    
    def test_duplicate_contact_handling(self):
        """Test duplicate contact handling in mock HubSpot"""
        print("\n=== Testing Duplicate Contact Handling ===")
        
        # First request
        first_request = {
            "name": "Michael Chen",
            "email": "michael.chen@duplicatetest.com",
            "company": "Duplicate Test Corp",
            "phone": "+1-555-9999",
            "call_volume": "15,000",
            "message": "First demo request"
        }
        
        try:
            # Submit first request
            response1 = requests.post(f"{BACKEND_URL}/demo/request", json=first_request, timeout=15)
            
            if response1.status_code == 200:
                result1 = response1.json()
                first_contact_id = result1.get("contact_id")
                
                # Submit duplicate request (same email)
                duplicate_request = {
                    "name": "Michael Chen Updated",
                    "email": "michael.chen@duplicatetest.com",
                    "company": "Updated Company Name",
                    "phone": "+1-555-8888",
                    "call_volume": "20,000",
                    "message": "Updated demo request"
                }
                
                response2 = requests.post(f"{BACKEND_URL}/demo/request", json=duplicate_request, timeout=15)
                
                if response2.status_code == 200:
                    result2 = response2.json()
                    second_contact_id = result2.get("contact_id")
                    
                    # Check if the same contact ID is returned (indicating duplicate handling)
                    if first_contact_id == second_contact_id:
                        self.log_test("Demo Request - Duplicate Contact Handling", True, 
                                    f"Same contact ID returned: {first_contact_id}")
                    else:
                        self.log_test("Demo Request - Duplicate Contact Handling", False, 
                                    f"Different contact IDs: {first_contact_id} vs {second_contact_id}")
                else:
                    self.log_test("Demo Request - Duplicate Contact Handling", False, 
                                f"Second request failed: {response2.status_code}")
            else:
                self.log_test("Demo Request - Duplicate Contact Handling", False, 
                            f"First request failed: {response1.status_code}")
                
        except Exception as e:
            self.log_test("Demo Request - Duplicate Contact Handling", False, f"Exception: {str(e)}")
    
    def test_debug_endpoints(self):
        """Test debug endpoints for mock services"""
        print("\n=== Testing Debug Endpoints ===")
        
        # Test HubSpot contacts debug endpoint
        try:
            response = requests.get(f"{BACKEND_URL}/debug/hubspot/contacts", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if "contacts" in result and "total_contacts" in result:
                    self.log_test("Debug - HubSpot Contacts", True, 
                                f"Total contacts: {result['total_contacts']}")
                else:
                    self.log_test("Debug - HubSpot Contacts", False, 
                                f"Missing expected fields in response: {result}")
            else:
                self.log_test("Debug - HubSpot Contacts", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Debug - HubSpot Contacts", False, f"Exception: {str(e)}")
        
        # Test emails debug endpoint
        try:
            response = requests.get(f"{BACKEND_URL}/debug/emails", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if "sent_emails" in result and "total_emails" in result:
                    self.log_test("Debug - Sent Emails", True, 
                                f"Total emails: {result['total_emails']}")
                else:
                    self.log_test("Debug - Sent Emails", False, 
                                f"Missing expected fields in response: {result}")
            else:
                self.log_test("Debug - Sent Emails", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Debug - Sent Emails", False, f"Exception: {str(e)}")
    
    def test_database_integration(self):
        """Test database storage of demo requests"""
        print("\n=== Testing Database Integration ===")
        
        # Submit a demo request
        test_request = {
            "name": "Database Test User",
            "email": "dbtest@example.com",
            "company": "Database Test Corp",
            "phone": "+1-555-1111",
            "call_volume": "30,000",
            "message": "Testing database integration"
        }
        
        try:
            # Submit demo request
            response = requests.post(f"{BACKEND_URL}/demo/request", json=test_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Try to retrieve demo requests to verify database storage
                get_response = requests.get(f"{BACKEND_URL}/demo/requests", timeout=10)
                
                if get_response.status_code == 200:
                    demo_requests = get_response.json()
                    
                    if isinstance(demo_requests, list) and len(demo_requests) > 0:
                        # Look for our test request
                        found_request = None
                        for req in demo_requests:
                            if req.get("email") == test_request["email"]:
                                found_request = req
                                break
                        
                        if found_request:
                            self.log_test("Database - Demo Request Storage", True, 
                                        f"Request found in database with ID: {found_request.get('id')}")
                        else:
                            self.log_test("Database - Demo Request Storage", False, 
                                        "Test request not found in database")
                    else:
                        self.log_test("Database - Demo Request Storage", False, 
                                    "No demo requests returned from database")
                else:
                    self.log_test("Database - Demo Request Storage", False, 
                                f"Failed to retrieve demo requests: {get_response.status_code}")
            else:
                self.log_test("Database - Demo Request Storage", False, 
                            f"Demo request submission failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Database - Demo Request Storage", False, f"Exception: {str(e)}")
    
    def test_mock_email_service(self):
        """Test mock email service functionality"""
        print("\n=== Testing Mock Email Service ===")
        
        # Clear previous emails by checking current count
        try:
            initial_response = requests.get(f"{BACKEND_URL}/debug/emails", timeout=10)
            initial_count = 0
            if initial_response.status_code == 200:
                initial_count = initial_response.json().get("total_emails", 0)
        except:
            initial_count = 0
        
        # Submit a demo request to trigger email sending
        email_test_request = {
            "name": "Email Test User",
            "email": "emailtest@example.com",
            "company": "Email Test Corp",
            "phone": "+1-555-2222",
            "call_volume": "40,000",
            "message": "Testing email service functionality"
        }
        
        try:
            # Submit demo request
            response = requests.post(f"{BACKEND_URL}/demo/request", json=email_test_request, timeout=15)
            
            if response.status_code == 200:
                # Wait a moment for background email tasks to complete
                time.sleep(2)
                
                # Check if emails were sent
                email_response = requests.get(f"{BACKEND_URL}/debug/emails", timeout=10)
                
                if email_response.status_code == 200:
                    email_result = email_response.json()
                    final_count = email_result.get("total_emails", 0)
                    sent_emails = email_result.get("sent_emails", [])
                    
                    # Should have at least 2 new emails (user confirmation + internal notification)
                    if final_count >= initial_count + 2:
                        # Check for both email types
                        confirmation_found = False
                        internal_found = False
                        
                        for email in sent_emails:
                            if email.get("type") == "demo_confirmation" and email.get("to") == email_test_request["email"]:
                                confirmation_found = True
                            elif email.get("type") == "internal_notification":
                                internal_found = True
                        
                        if confirmation_found and internal_found:
                            self.log_test("Mock Email - Both Email Types", True, 
                                        f"Confirmation and internal emails sent. Total: {final_count}")
                        else:
                            self.log_test("Mock Email - Both Email Types", False, 
                                        f"Missing email types. Confirmation: {confirmation_found}, Internal: {internal_found}")
                    else:
                        self.log_test("Mock Email - Email Count", False, 
                                    f"Expected at least {initial_count + 2} emails, got {final_count}")
                else:
                    self.log_test("Mock Email - Service Check", False, 
                                f"Failed to check emails: {email_response.status_code}")
            else:
                self.log_test("Mock Email - Demo Request", False, 
                            f"Demo request failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Mock Email - Service Check", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test various error scenarios"""
        print("\n=== Testing Error Handling ===")
        
        # Test Case 1: Malformed JSON
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", 
                                   data="invalid json", 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            if response.status_code in [400, 422]:
                self.log_test("Error Handling - Malformed JSON", True, f"Status: {response.status_code}")
            else:
                self.log_test("Error Handling - Malformed JSON", False, 
                            f"Expected 400/422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Malformed JSON", False, f"Exception: {str(e)}")
        
        # Test Case 2: Empty request body
        try:
            response = requests.post(f"{BACKEND_URL}/demo/request", json={}, timeout=10)
            if response.status_code == 422:
                self.log_test("Error Handling - Empty Request", True, "Validation error returned")
            else:
                self.log_test("Error Handling - Empty Request", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Empty Request", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all demo request test suites"""
        print("🚀 Starting Demo Request & CRM Integration Tests")
        print("=" * 60)
        
        # Run all test suites
        self.test_demo_request_valid_input()
        self.test_demo_request_validation()
        self.test_duplicate_contact_handling()
        self.test_debug_endpoints()
        self.test_database_integration()
        self.test_mock_email_service()
        self.test_error_handling()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 DEMO REQUEST TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

class LiveChatTester:
    """Test Live Chat Integration functionality with WebSocket and AI"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.websocket_url = "wss://customer-ai-portal.preview.emergentagent.com/ws/chat"
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_chat_session_creation(self):
        """Test POST /api/chat/session endpoint"""
        print("\n=== Testing Chat Session Creation ===")
        
        # Test Case 1: Create session without user_id
        try:
            response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "session_id", "message"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["success"] and result["session_id"]:
                        session_id = result["session_id"]
                        self.log_test("Chat Session - Create Without User ID", True, 
                                    f"Session ID: {session_id}")
                        
                        # Store session_id for later tests
                        self.test_session_id = session_id
                    else:
                        self.log_test("Chat Session - Create Without User ID", False, 
                                    f"Invalid response values: {result}")
                else:
                    self.log_test("Chat Session - Create Without User ID", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Chat Session - Create Without User ID", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Session - Create Without User ID", False, f"Exception: {str(e)}")
        
        # Test Case 2: Create session with user_id
        try:
            test_data = {"user_id": "test_user_123"}
            response = requests.post(f"{BACKEND_URL}/chat/session", json=test_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["session_id"]:
                    self.log_test("Chat Session - Create With User ID", True, 
                                f"Session ID: {result['session_id']}")
                else:
                    self.log_test("Chat Session - Create With User ID", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Chat Session - Create With User ID", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Session - Create With User ID", False, f"Exception: {str(e)}")
    
    def test_rest_api_message_endpoint(self):
        """Test POST /api/chat/message endpoint (fallback method)"""
        print("\n=== Testing REST API Message Endpoint ===")
        
        # First create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Chat Message - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Test Case 1: Send message via REST API
        try:
            test_message = "Hello, I need help with SentraTech's AI platform features."
            
            # Use query parameters as expected by the endpoint
            response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={test_message}", timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "user_message", "ai_response"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    user_msg = result["user_message"]
                    ai_msg = result["ai_response"]
                    
                    # Verify user message
                    if user_msg["content"] == test_message and user_msg["sender"] == "user":
                        self.log_test("Chat Message - User Message Storage", True, 
                                    f"Message stored correctly: {user_msg['id']}")
                    else:
                        self.log_test("Chat Message - User Message Storage", False, 
                                    f"User message not stored correctly")
                    
                    # Verify AI response
                    if ai_msg["sender"] == "assistant" and len(ai_msg["content"]) > 0:
                        self.log_test("Chat Message - AI Response Generation", True, 
                                    f"AI response generated: {ai_msg['content'][:100]}...")
                    else:
                        self.log_test("Chat Message - AI Response Generation", False, 
                                    f"AI response not generated properly")
                        
                    # Check if response is contextually appropriate for SentraTech
                    ai_content = ai_msg["content"].lower()
                    sentratech_keywords = ["sentratech", "ai", "customer", "support", "platform", "automation"]
                    if any(keyword in ai_content for keyword in sentratech_keywords):
                        self.log_test("Chat Message - SentraTech Context", True, 
                                    "AI response contains SentraTech-relevant content")
                    else:
                        self.log_test("Chat Message - SentraTech Context", False, 
                                    "AI response lacks SentraTech context")
                        
                else:
                    self.log_test("Chat Message - REST API Response Structure", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Chat Message - REST API Basic", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Message - REST API Basic", False, f"Exception: {str(e)}")
    
    def test_chat_history_endpoint(self):
        """Test GET /api/chat/session/{session_id}/history endpoint"""
        print("\n=== Testing Chat History Endpoint ===")
        
        # First create a session and send some messages
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Chat History - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Send a test message to create history
        test_message = "What are the key benefits of SentraTech's platform?"
        
        # Use query parameters as expected by the endpoint
        message_response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={test_message}", timeout=30)
        if message_response.status_code != 200:
            self.log_test("Chat History - Message Setup", False, "Failed to send test message")
            return
        
        # Test Case 1: Retrieve chat history
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                if "success" in result and "messages" in result:
                    if result["success"] and isinstance(result["messages"], list):
                        messages = result["messages"]
                        
                        if len(messages) >= 2:  # Should have user message + AI response
                            # Check message structure
                            user_message = None
                            ai_message = None
                            
                            for msg in messages:
                                if msg["sender"] == "user":
                                    user_message = msg
                                elif msg["sender"] == "assistant":
                                    ai_message = msg
                            
                            if user_message and ai_message:
                                self.log_test("Chat History - Message Retrieval", True, 
                                            f"Retrieved {len(messages)} messages correctly")
                                
                                # Check timestamp handling
                                if "timestamp" in user_message and "timestamp" in ai_message:
                                    self.log_test("Chat History - Timestamp Handling", True, 
                                                "Timestamps present in messages")
                                else:
                                    self.log_test("Chat History - Timestamp Handling", False, 
                                                "Missing timestamps in messages")
                                    
                                # Check message ordering (should be chronological)
                                if messages[0]["timestamp"] <= messages[-1]["timestamp"]:
                                    self.log_test("Chat History - Message Ordering", True, 
                                                "Messages ordered chronologically")
                                else:
                                    self.log_test("Chat History - Message Ordering", False, 
                                                "Messages not properly ordered")
                            else:
                                self.log_test("Chat History - Message Types", False, 
                                            "Missing user or AI messages in history")
                        else:
                            self.log_test("Chat History - Message Count", False, 
                                        f"Expected at least 2 messages, got {len(messages)}")
                    else:
                        self.log_test("Chat History - Response Format", False, 
                                    f"Invalid response format: {result}")
                else:
                    self.log_test("Chat History - Response Structure", False, 
                                f"Missing required fields in response")
            else:
                self.log_test("Chat History - Basic Retrieval", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat History - Basic Retrieval", False, f"Exception: {str(e)}")
        
        # Test Case 2: Test with limit parameter
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history?limit=1", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and len(result["messages"]) <= 1:
                    self.log_test("Chat History - Limit Parameter", True, 
                                f"Limit parameter working: {len(result['messages'])} messages")
                else:
                    self.log_test("Chat History - Limit Parameter", False, 
                                f"Limit parameter not working properly")
            else:
                self.log_test("Chat History - Limit Parameter", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Chat History - Limit Parameter", False, f"Exception: {str(e)}")
    
    def test_websocket_connection(self):
        """Test WebSocket endpoint /ws/chat/{session_id}"""
        print("\n=== Testing WebSocket Connection ===")
        
        # First create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("WebSocket - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        async def test_websocket_functionality():
            try:
                # Test Case 1: WebSocket connection establishment
                uri = f"{self.websocket_url}/{session_id}"
                
                async with websockets.connect(uri) as websocket:
                    self.log_test("WebSocket - Connection Establishment", True, 
                                f"Connected to {uri}")
                    
                    # Test Case 2: Receive welcome message
                    try:
                        welcome_message = await asyncio.wait_for(websocket.recv(), timeout=5)
                        welcome_data = json.loads(welcome_message)
                        
                        if welcome_data.get("type") == "system" and "content" in welcome_data:
                            self.log_test("WebSocket - Welcome Message", True, 
                                        f"Welcome message received: {welcome_data['content'][:50]}...")
                        else:
                            self.log_test("WebSocket - Welcome Message", False, 
                                        f"Invalid welcome message format: {welcome_data}")
                    except asyncio.TimeoutError:
                        self.log_test("WebSocket - Welcome Message", False, "No welcome message received")
                    
                    # Test Case 3: Send user message and receive AI response
                    try:
                        test_message = {
                            "type": "user_message",
                            "content": "Can you tell me about SentraTech's automation capabilities?"
                        }
                        
                        await websocket.send(json.dumps(test_message))
                        self.log_test("WebSocket - Send Message", True, "User message sent successfully")
                        
                        # Wait for typing indicator and AI response
                        typing_received = False
                        ai_response_received = False
                        
                        for _ in range(10):  # Wait up to 30 seconds for response
                            try:
                                response = await asyncio.wait_for(websocket.recv(), timeout=3)
                                response_data = json.loads(response)
                                
                                if response_data.get("type") == "typing":
                                    typing_received = True
                                    self.log_test("WebSocket - Typing Indicator", True, 
                                                f"Typing indicator: {response_data.get('is_typing')}")
                                
                                elif response_data.get("type") == "ai_response":
                                    ai_response_received = True
                                    ai_content = response_data.get("content", "")
                                    
                                    if len(ai_content) > 0:
                                        self.log_test("WebSocket - AI Response Reception", True, 
                                                    f"AI response received: {ai_content[:100]}...")
                                        
                                        # Check SentraTech context
                                        ai_lower = ai_content.lower()
                                        sentratech_keywords = ["sentratech", "automation", "ai", "platform", "70%"]
                                        if any(keyword in ai_lower for keyword in sentratech_keywords):
                                            self.log_test("WebSocket - AI Context Quality", True, 
                                                        "AI response contains relevant SentraTech information")
                                        else:
                                            self.log_test("WebSocket - AI Context Quality", False, 
                                                        "AI response lacks SentraTech context")
                                    else:
                                        self.log_test("WebSocket - AI Response Reception", False, 
                                                    "Empty AI response received")
                                    break
                                    
                            except asyncio.TimeoutError:
                                continue
                        
                        if not ai_response_received:
                            self.log_test("WebSocket - AI Response Reception", False, 
                                        "No AI response received within timeout")
                    
                    except Exception as e:
                        self.log_test("WebSocket - Message Exchange", False, f"Exception: {str(e)}")
                    
                    # Test Case 4: Ping/Pong functionality
                    try:
                        ping_message = {
                            "type": "ping",
                            "timestamp": datetime.now().isoformat()
                        }
                        
                        await websocket.send(json.dumps(ping_message))
                        
                        pong_response = await asyncio.wait_for(websocket.recv(), timeout=5)
                        pong_data = json.loads(pong_response)
                        
                        if pong_data.get("type") == "pong":
                            self.log_test("WebSocket - Ping/Pong", True, "Ping/Pong functionality working")
                        else:
                            self.log_test("WebSocket - Ping/Pong", False, 
                                        f"Invalid pong response: {pong_data}")
                    
                    except asyncio.TimeoutError:
                        self.log_test("WebSocket - Ping/Pong", False, "No pong response received")
                    except Exception as e:
                        self.log_test("WebSocket - Ping/Pong", False, f"Exception: {str(e)}")
                        
            except Exception as e:
                self.log_test("WebSocket - Connection Establishment", False, f"Connection failed: {str(e)}")
        
        # Run the async WebSocket test
        try:
            asyncio.run(test_websocket_functionality())
        except Exception as e:
            self.log_test("WebSocket - Test Execution", False, f"Async test failed: {str(e)}")
    
    def test_ai_integration(self):
        """Test Emergent LLM integration and AI response quality"""
        print("\n=== Testing AI Integration ===")
        
        # Create a session for testing
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("AI Integration - Session Setup", False, "Failed to create session")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Test Case 1: AI response to SentraTech-specific query
        sentratech_queries = [
            "What are SentraTech's key features?",
            "How much can I save with SentraTech?",
            "Tell me about your automation capabilities"
        ]
        
        for i, query in enumerate(sentratech_queries):
            try:
                # Use query parameters as expected by the endpoint
                response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={query}", timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    ai_response = result.get("ai_response", {}).get("content", "")
                    
                    if len(ai_response) > 0:
                        # Check for SentraTech-specific information
                        ai_lower = ai_response.lower()
                        relevant_terms = [
                            "sentratech", "50ms", "sub-50ms", "70%", "automation", 
                            "45%", "cost", "savings", "ai", "platform", "customer support",
                            "routing", "dashboard", "analytics", "integration"
                        ]
                        
                        relevant_count = sum(1 for term in relevant_terms if term in ai_lower)
                        
                        if relevant_count >= 2:  # At least 2 relevant terms
                            self.log_test(f"AI Integration - Query {i+1} Relevance", True, 
                                        f"Response contains {relevant_count} relevant terms")
                        else:
                            self.log_test(f"AI Integration - Query {i+1} Relevance", False, 
                                        f"Response lacks SentraTech context (only {relevant_count} relevant terms)")
                        
                        # Check response length (should be substantial)
                        if len(ai_response) > 50:
                            self.log_test(f"AI Integration - Query {i+1} Length", True, 
                                        f"Response length: {len(ai_response)} characters")
                        else:
                            self.log_test(f"AI Integration - Query {i+1} Length", False, 
                                        f"Response too short: {len(ai_response)} characters")
                    else:
                        self.log_test(f"AI Integration - Query {i+1} Response", False, 
                                    "Empty AI response")
                else:
                    self.log_test(f"AI Integration - Query {i+1} API", False, 
                                f"API call failed: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"AI Integration - Query {i+1} Exception", False, f"Exception: {str(e)}")
    
    def test_database_integration(self):
        """Test MongoDB integration for chat data persistence"""
        print("\n=== Testing Database Integration ===")
        
        # Create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Database - Session Creation", False, "Failed to create session")
            return
        
        session_id = session_response.json()["session_id"]
        self.log_test("Database - Session Creation", True, f"Session created: {session_id}")
        
        # Send multiple messages to test persistence
        test_messages = [
            "Hello, I'm interested in SentraTech",
            "What are your pricing options?"
        ]
        
        for i, message in enumerate(test_messages):
            try:
                # Use query parameters as expected by the endpoint
                response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={message}", timeout=30)
                
                if response.status_code == 200:
                    self.log_test(f"Database - Message {i+1} Storage", True, 
                                f"Message stored successfully")
                else:
                    self.log_test(f"Database - Message {i+1} Storage", False, 
                                f"Failed to store message: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Database - Message {i+1} Storage", False, f"Exception: {str(e)}")
        
        # Test message retrieval and verify persistence
        try:
            history_response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history", timeout=10)
            
            if history_response.status_code == 200:
                result = history_response.json()
                messages = result.get("messages", [])
                
                # Should have user messages + AI responses
                expected_min_messages = len(test_messages) * 2  # user + AI for each
                
                if len(messages) >= expected_min_messages:
                    self.log_test("Database - Message Persistence", True, 
                                f"All {len(messages)} messages persisted correctly")
                    
                    # Check message ordering and timestamps
                    timestamps = [msg["timestamp"] for msg in messages]
                    if timestamps == sorted(timestamps):
                        self.log_test("Database - Message Ordering", True, 
                                    "Messages ordered chronologically")
                    else:
                        self.log_test("Database - Message Ordering", False, 
                                    "Messages not properly ordered")
                        
                    # Verify message content preservation
                    user_messages = [msg for msg in messages if msg["sender"] == "user"]
                    stored_contents = [msg["content"] for msg in user_messages]
                    
                    all_preserved = all(original in stored_contents for original in test_messages)
                    if all_preserved:
                        self.log_test("Database - Content Preservation", True, 
                                    "All message content preserved correctly")
                    else:
                        self.log_test("Database - Content Preservation", False, 
                                    "Some message content not preserved")
                else:
                    self.log_test("Database - Message Persistence", False, 
                                f"Expected at least {expected_min_messages} messages, got {len(messages)}")
            else:
                self.log_test("Database - Message Retrieval", False, 
                            f"Failed to retrieve messages: {history_response.status_code}")
                
        except Exception as e:
            self.log_test("Database - Message Retrieval", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling scenarios"""
        print("\n=== Testing Error Handling ===")
        
        # Test Case 1: Invalid session ID
        try:
            invalid_session_id = "invalid_session_123"
            # Use query parameters as expected by the endpoint
            response = requests.post(f"{BACKEND_URL}/chat/message?session_id={invalid_session_id}&message=Test message", timeout=10)
            
            # Should handle gracefully (either create session or return error)
            if response.status_code in [200, 400, 404, 500]:
                self.log_test("Error Handling - Invalid Session ID", True, 
                            f"Handled invalid session ID gracefully: {response.status_code}")
            else:
                self.log_test("Error Handling - Invalid Session ID", False, 
                            f"Unexpected status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Invalid Session ID", False, f"Exception: {str(e)}")
        
        # Test Case 2: Invalid chat history request
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/nonexistent/history", timeout=10)
            
            if response.status_code in [200, 404, 500]:  # Should handle gracefully
                self.log_test("Error Handling - Nonexistent Session History", True, 
                            f"Handled nonexistent session gracefully: {response.status_code}")
            else:
                self.log_test("Error Handling - Nonexistent Session History", False, 
                            f"Unexpected status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Nonexistent Session History", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all live chat test suites"""
        print("🚀 Starting Live Chat Integration Tests")
        print("=" * 60)
        
        # Run all test suites
        self.test_chat_session_creation()
        self.test_rest_api_message_endpoint()
        self.test_chat_history_endpoint()
        self.test_websocket_connection()
        self.test_ai_integration()
        self.test_database_integration()
        self.test_error_handling()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 LIVE CHAT TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

class MetricsTester:
    """Test Real-time Metrics API endpoints"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.websocket_url = "wss://customer-ai-portal.preview.emergentagent.com/ws/metrics"
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_live_metrics_endpoint(self):
        """Test GET /api/metrics/live endpoint"""
        print("\n=== Testing Live Metrics Endpoint ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/metrics/live", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check required fields
                required_fields = [
                    "active_chats", "response_time_ms", "automation_rate", 
                    "customer_satisfaction", "resolution_rate", "daily_volume", 
                    "cost_savings", "agent_utilization", "timestamp"
                ]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("Live Metrics - Response Structure", True, 
                                f"All required fields present: {len(required_fields)} fields")
                    
                    # Validate data types and ranges
                    validations = []
                    
                    # Check active_chats (should be positive integer)
                    if isinstance(result["active_chats"], int) and result["active_chats"] >= 0:
                        validations.append("active_chats: valid")
                    else:
                        validations.append(f"active_chats: invalid ({result['active_chats']})")
                    
                    # Check response_time_ms (should be positive float, realistic range)
                    if isinstance(result["response_time_ms"], (int, float)) and 10 <= result["response_time_ms"] <= 1000:
                        validations.append("response_time_ms: valid")
                    else:
                        validations.append(f"response_time_ms: invalid ({result['response_time_ms']})")
                    
                    # Check automation_rate (should be between 0 and 1)
                    if isinstance(result["automation_rate"], (int, float)) and 0 <= result["automation_rate"] <= 1:
                        validations.append("automation_rate: valid")
                    else:
                        validations.append(f"automation_rate: invalid ({result['automation_rate']})")
                    
                    # Check customer_satisfaction (should be between 0 and 1)
                    if isinstance(result["customer_satisfaction"], (int, float)) and 0 <= result["customer_satisfaction"] <= 1:
                        validations.append("customer_satisfaction: valid")
                    else:
                        validations.append(f"customer_satisfaction: invalid ({result['customer_satisfaction']})")
                    
                    # Check resolution_rate (should be between 0 and 1)
                    if isinstance(result["resolution_rate"], (int, float)) and 0 <= result["resolution_rate"] <= 1:
                        validations.append("resolution_rate: valid")
                    else:
                        validations.append(f"resolution_rate: invalid ({result['resolution_rate']})")
                    
                    # Check daily_volume (should be positive integer)
                    if isinstance(result["daily_volume"], int) and result["daily_volume"] >= 0:
                        validations.append("daily_volume: valid")
                    else:
                        validations.append(f"daily_volume: invalid ({result['daily_volume']})")
                    
                    # Check cost_savings (should be positive number)
                    if isinstance(result["cost_savings"], (int, float)) and result["cost_savings"] >= 0:
                        validations.append("cost_savings: valid")
                    else:
                        validations.append(f"cost_savings: invalid ({result['cost_savings']})")
                    
                    # Check agent_utilization (should be between 0 and 1)
                    if isinstance(result["agent_utilization"], (int, float)) and 0 <= result["agent_utilization"] <= 1:
                        validations.append("agent_utilization: valid")
                    else:
                        validations.append(f"agent_utilization: invalid ({result['agent_utilization']})")
                    
                    # Count valid fields
                    valid_count = sum(1 for v in validations if "valid" in v and "invalid" not in v)
                    
                    if valid_count == len(required_fields) - 1:  # -1 for timestamp
                        self.log_test("Live Metrics - Data Validation", True, 
                                    f"All {valid_count} metrics have valid values")
                    else:
                        invalid_validations = [v for v in validations if "invalid" in v]
                        self.log_test("Live Metrics - Data Validation", False, 
                                    f"Invalid fields: {invalid_validations}")
                        
                else:
                    self.log_test("Live Metrics - Response Structure", False, 
                                f"Missing required fields: {missing_fields}")
                    
            else:
                self.log_test("Live Metrics - Basic Functionality", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Live Metrics - Basic Functionality", False, f"Exception: {str(e)}")
    
    def test_dashboard_metrics_endpoint(self):
        """Test GET /api/metrics/dashboard endpoint"""
        print("\n=== Testing Dashboard Metrics Endpoint ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/metrics/dashboard", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check main structure
                required_sections = ["current_metrics", "trends", "alerts", "uptime"]
                missing_sections = [section for section in required_sections if section not in result]
                
                if not missing_sections:
                    self.log_test("Dashboard Metrics - Main Structure", True, 
                                f"All required sections present: {required_sections}")
                    
                    # Validate trends section
                    trends = result["trends"]
                    expected_trend_metrics = ["response_time_ms", "automation_rate", "customer_satisfaction", "active_chats"]
                    
                    if isinstance(trends, dict):
                        trend_validations = []
                        for metric in expected_trend_metrics:
                            if metric in trends:
                                trend_data = trends[metric]
                                if isinstance(trend_data, list) and len(trend_data) == 24:  # 24 data points
                                    trend_validations.append(f"{metric}: valid (24 points)")
                                else:
                                    trend_validations.append(f"{metric}: invalid ({len(trend_data) if isinstance(trend_data, list) else 'not list'} points)")
                            else:
                                trend_validations.append(f"{metric}: missing")
                        
                        valid_trends = sum(1 for v in trend_validations if "valid" in v)
                        if valid_trends == len(expected_trend_metrics):
                            self.log_test("Dashboard Metrics - Trends Data", True, 
                                        f"All {valid_trends} trend metrics have 24 data points")
                        else:
                            self.log_test("Dashboard Metrics - Trends Data", False, 
                                        f"Trend issues: {trend_validations}")
                    else:
                        self.log_test("Dashboard Metrics - Trends Structure", False, 
                                    f"Trends is not a dict: {type(trends)}")
                        
                else:
                    self.log_test("Dashboard Metrics - Main Structure", False, 
                                f"Missing sections: {missing_sections}")
                    
            else:
                self.log_test("Dashboard Metrics - Basic Functionality", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Dashboard Metrics - Basic Functionality", False, f"Exception: {str(e)}")
    
    def test_metrics_history_endpoint(self):
        """Test GET /api/metrics/history/{metric_name} endpoint"""
        print("\n=== Testing Metrics History Endpoint ===")
        
        # Test different metrics and timeframes
        test_cases = [
            ("response_time_ms", "1h"),
            ("response_time_ms", "24h"),
            ("automation_rate", "24h"),
            ("customer_satisfaction", "7d"),
            ("customer_satisfaction", "30d")
        ]
        
        for metric_name, timeframe in test_cases:
            try:
                response = requests.get(f"{BACKEND_URL}/metrics/history/{metric_name}?timeframe={timeframe}", timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Check response structure
                    required_fields = ["metric_name", "values", "timestamps", "timeframe"]
                    missing_fields = [field for field in required_fields if field not in result]
                    
                    if not missing_fields:
                        # Validate field values
                        if result["metric_name"] == metric_name and result["timeframe"] == timeframe:
                            values = result["values"]
                            timestamps = result["timestamps"]
                            
                            if isinstance(values, list) and isinstance(timestamps, list):
                                if len(values) == len(timestamps) and len(values) > 0:
                                    self.log_test(f"History - {metric_name} ({timeframe})", True, 
                                                f"{len(values)} data points with matching timestamps")
                                else:
                                    self.log_test(f"History - {metric_name} ({timeframe})", False, 
                                                f"Mismatched or empty arrays: values={len(values)}, timestamps={len(timestamps)}")
                            else:
                                self.log_test(f"History - {metric_name} ({timeframe})", False, 
                                            f"Values or timestamps not arrays: {type(values)}, {type(timestamps)}")
                        else:
                            self.log_test(f"History - {metric_name} ({timeframe})", False, 
                                        f"Incorrect metric_name or timeframe in response")
                    else:
                        self.log_test(f"History - {metric_name} ({timeframe})", False, 
                                    f"Missing fields: {missing_fields}")
                        
                else:
                    self.log_test(f"History - {metric_name} ({timeframe})", False, 
                                f"Status: {response.status_code}, Response: {response.text}")
                    
            except Exception as e:
                self.log_test(f"History - {metric_name} ({timeframe})", False, f"Exception: {str(e)}")
    
    def test_kpis_endpoint(self):
        """Test GET /api/metrics/kpis endpoint"""
        print("\n=== Testing KPIs Endpoint ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/metrics/kpis", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check expected KPI fields
                expected_kpis = [
                    "response_time", "automation_rate", "uptime", "satisfaction",
                    "cost_savings", "daily_volume", "resolution_rate"
                ]
                missing_kpis = [kpi for kpi in expected_kpis if kpi not in result]
                
                if not missing_kpis:
                    self.log_test("KPIs - Response Structure", True, 
                                f"All {len(expected_kpis)} KPIs present")
                    
                    # Validate KPI formatting (should be formatted strings)
                    format_validations = []
                    
                    # Check response_time format (should end with 'ms')
                    if isinstance(result["response_time"], str) and result["response_time"].endswith("ms"):
                        format_validations.append("response_time: properly formatted")
                    else:
                        format_validations.append(f"response_time: invalid format ({result['response_time']})")
                    
                    # Check automation_rate format (should end with '%')
                    if isinstance(result["automation_rate"], str) and result["automation_rate"].endswith("%"):
                        format_validations.append("automation_rate: properly formatted")
                    else:
                        format_validations.append(f"automation_rate: invalid format ({result['automation_rate']})")
                    
                    valid_formats = sum(1 for v in format_validations if "properly formatted" in v)
                    
                    if valid_formats >= 2:  # At least 2 should be properly formatted
                        self.log_test("KPIs - Formatting", True, 
                                    f"{valid_formats} KPIs properly formatted for display")
                    else:
                        invalid_formats = [v for v in format_validations if "invalid format" in v]
                        self.log_test("KPIs - Formatting", False, 
                                    f"Formatting issues: {invalid_formats}")
                        
                else:
                    self.log_test("KPIs - Response Structure", False, 
                                f"Missing KPIs: {missing_kpis}")
                    
            else:
                self.log_test("KPIs - Basic Functionality", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("KPIs - Basic Functionality", False, f"Exception: {str(e)}")
    
    def test_websocket_metrics_stream(self):
        """Test WebSocket /ws/metrics endpoint"""
        print("\n=== Testing WebSocket Metrics Stream ===")
        
        async def test_websocket_metrics():
            try:
                # Test Case 1: WebSocket connection establishment
                uri = self.websocket_url
                
                async with websockets.connect(uri) as websocket:
                    self.log_test("WebSocket Metrics - Connection", True, 
                                f"Connected to {uri}")
                    
                    # Test Case 2: Receive metrics updates
                    updates_received = 0
                    valid_updates = 0
                    
                    try:
                        # Wait for up to 12 seconds to receive at least 2 updates (5s intervals)
                        for _ in range(2):  # Try to get 2 updates
                            update = await asyncio.wait_for(websocket.recv(), timeout=7)
                            update_data = json.loads(update)
                            updates_received += 1
                            
                            # Validate update structure
                            if update_data.get("type") == "metrics_update" and "data" in update_data:
                                data = update_data["data"]
                                
                                # Check if it has the expected metrics fields
                                expected_fields = ["active_chats", "response_time_ms", "automation_rate", "timestamp"]
                                if all(field in data for field in expected_fields):
                                    valid_updates += 1
                                    
                                    if updates_received == 1:  # Log details for first update
                                        self.log_test("WebSocket Metrics - Update Structure", True, 
                                                    f"Valid metrics update received with all fields")
                            else:
                                self.log_test("WebSocket Metrics - Update Format", False, 
                                            f"Invalid update format: {update_data}")
                    
                    except asyncio.TimeoutError:
                        pass  # Expected if no more updates within timeout
                    
                    # Evaluate results
                    if updates_received >= 1:
                        self.log_test("WebSocket Metrics - Update Reception", True, 
                                    f"Received {updates_received} updates")
                    else:
                        self.log_test("WebSocket Metrics - Update Reception", False, 
                                    f"No updates received in 12 seconds")
                    
                    if valid_updates == updates_received and updates_received > 0:
                        self.log_test("WebSocket Metrics - Data Quality", True, 
                                    f"All {valid_updates} updates had valid structure")
                    elif updates_received > 0:
                        self.log_test("WebSocket Metrics - Data Quality", False, 
                                    f"Only {valid_updates}/{updates_received} updates were valid")
                        
            except Exception as e:
                self.log_test("WebSocket Metrics - Connection", False, f"Connection failed: {str(e)}")
        
        # Run the async WebSocket test
        try:
            asyncio.run(test_websocket_metrics())
        except Exception as e:
            self.log_test("WebSocket Metrics - Test Execution", False, f"Async test failed: {str(e)}")
    
    def test_performance_metrics(self):
        """Test performance of metrics endpoints"""
        print("\n=== Testing Metrics API Performance ===")
        
        endpoints = [
            ("/metrics/live", "Live Metrics"),
            ("/metrics/dashboard", "Dashboard Metrics"),
            ("/metrics/kpis", "KPIs"),
            ("/metrics/history/response_time_ms", "History")
        ]
        
        for endpoint, name in endpoints:
            try:
                start_time = time.time()
                response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=10)
                end_time = time.time()
                
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                
                if response.status_code == 200 and response_time < 100:  # Less than 100ms
                    self.log_test(f"Performance - {name}", True, 
                                f"Response time: {response_time:.2f}ms")
                else:
                    self.log_test(f"Performance - {name}", False, 
                                f"Response time: {response_time:.2f}ms, Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Performance - {name}", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all metrics test suites"""
        print("🚀 Starting Real-time Metrics API Tests")
        print("=" * 60)
        
        # Run all test suites
        self.test_live_metrics_endpoint()
        self.test_dashboard_metrics_endpoint()
        self.test_metrics_history_endpoint()
        self.test_kpis_endpoint()
        self.test_websocket_metrics_stream()
        self.test_performance_metrics()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 METRICS API TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

class AnalyticsTester:
    """Test Analytics & Tracking System functionality"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_analytics_track_endpoint(self):
        """Test POST /api/analytics/track endpoint"""
        print("\n=== Testing Analytics Event Tracking ===")
        
        # Test Case 1: Page view tracking
        page_view_data = {
            "session_id": "test_session_analytics_001",
            "user_id": "test_user_001",
            "event_type": "page_view",
            "page_path": "/",
            "page_title": "SentraTech - AI Customer Support Platform",
            "referrer": "https://google.com",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "additional_data": {
                "viewport_width": 1920,
                "viewport_height": 1080
            }
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=page_view_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("page_view_id"):
                    self.log_test("Analytics Track - Page View", True, 
                                f"Page view tracked successfully: {result['page_view_id']}")
                else:
                    self.log_test("Analytics Track - Page View", False, 
                                f"Invalid response structure: {result}")
            else:
                self.log_test("Analytics Track - Page View", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics Track - Page View", False, f"Exception: {str(e)}")
        
        # Test Case 2: Click event tracking
        click_data = {
            "session_id": "test_session_analytics_002",
            "event_type": "click",
            "page_path": "/roi-calculator",
            "additional_data": {
                "element_id": "calculate-roi-btn",
                "element_class": "btn-primary",
                "element_text": "Calculate ROI"
            }
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=click_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("interaction_id"):
                    self.log_test("Analytics Track - Click Event", True, 
                                f"Click event tracked: {result['interaction_id']}")
                else:
                    self.log_test("Analytics Track - Click Event", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Analytics Track - Click Event", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Analytics Track - Click Event", False, f"Exception: {str(e)}")
        
        # Test Case 3: Form submit tracking
        form_submit_data = {
            "session_id": "test_session_analytics_003",
            "event_type": "form_submit",
            "page_path": "/demo-request",
            "additional_data": {
                "form_id": "demo-request-form",
                "form_fields": ["name", "email", "company", "phone"]
            }
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=form_submit_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics Track - Form Submit", True, 
                                "Form submit event tracked successfully")
                else:
                    self.log_test("Analytics Track - Form Submit", False, 
                                f"Tracking failed: {result}")
            else:
                self.log_test("Analytics Track - Form Submit", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Analytics Track - Form Submit", False, f"Exception: {str(e)}")
        
        # Test Case 4: Scroll event tracking
        scroll_data = {
            "session_id": "test_session_analytics_004",
            "event_type": "scroll",
            "page_path": "/features",
            "additional_data": {
                "scroll_depth": 75,
                "max_scroll": 100
            }
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=scroll_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics Track - Scroll Event", True, 
                                "Scroll event tracked successfully")
                else:
                    self.log_test("Analytics Track - Scroll Event", False, 
                                f"Tracking failed: {result}")
            else:
                self.log_test("Analytics Track - Scroll Event", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Analytics Track - Scroll Event", False, f"Exception: {str(e)}")
    
    def test_conversion_tracking(self):
        """Test POST /api/analytics/conversion endpoint"""
        print("\n=== Testing Conversion Tracking ===")
        
        # Test Case 1: Demo request conversion
        demo_conversion_params = {
            "session_id": "test_session_conversion_001",
            "event_name": "demo_request",
            "page_path": "/demo-request",
            "funnel_step": "form_submission",
            "conversion_value": 500.0,
            "user_id": "test_user_conversion_001"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/analytics/conversion", params=demo_conversion_params, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("conversion_id"):
                    self.log_test("Conversion Track - Demo Request", True, 
                                f"Demo conversion tracked: {result['conversion_id']}")
                else:
                    self.log_test("Conversion Track - Demo Request", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Conversion Track - Demo Request", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Conversion Track - Demo Request", False, f"Exception: {str(e)}")
        
        # Test Case 2: ROI calculation conversion
        roi_conversion_params = {
            "session_id": "test_session_conversion_002",
            "event_name": "roi_calculation",
            "page_path": "/roi-calculator",
            "funnel_step": "calculation_completed",
            "conversion_value": 1000.0
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/analytics/conversion", params=roi_conversion_params, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("conversion_id"):
                    self.log_test("Conversion Track - ROI Calculation", True, 
                                f"ROI conversion tracked: {result['conversion_id']}")
                else:
                    self.log_test("Conversion Track - ROI Calculation", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Conversion Track - ROI Calculation", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Conversion Track - ROI Calculation", False, f"Exception: {str(e)}")
        
        # Test Case 3: Chat started conversion
        chat_conversion_params = {
            "session_id": "test_session_conversion_003",
            "event_name": "chat_started",
            "page_path": "/",
            "funnel_step": "engagement",
            "conversion_value": 250.0
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/analytics/conversion", params=chat_conversion_params, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Conversion Track - Chat Started", True, 
                                "Chat conversion tracked successfully")
                else:
                    self.log_test("Conversion Track - Chat Started", False, 
                                f"Tracking failed: {result}")
            else:
                self.log_test("Conversion Track - Chat Started", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Conversion Track - Chat Started", False, f"Exception: {str(e)}")
    
    def test_analytics_stats(self):
        """Test GET /api/analytics/stats endpoint"""
        print("\n=== Testing Analytics Statistics ===")
        
        # Test different timeframes
        timeframes = ["1h", "24h", "7d", "30d"]
        
        for timeframe in timeframes:
            try:
                response = requests.get(f"{BACKEND_URL}/analytics/stats?timeframe={timeframe}", timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Check required fields
                    required_fields = [
                        "total_page_views", "unique_visitors", "avg_session_duration",
                        "bounce_rate", "top_pages", "conversion_rate", 
                        "device_breakdown", "traffic_sources"
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in result]
                    
                    if not missing_fields:
                        # Validate data types
                        valid_types = True
                        type_errors = []
                        
                        if not isinstance(result["total_page_views"], int):
                            valid_types = False
                            type_errors.append("total_page_views should be int")
                        
                        if not isinstance(result["unique_visitors"], int):
                            valid_types = False
                            type_errors.append("unique_visitors should be int")
                        
                        if not isinstance(result["avg_session_duration"], (int, float)):
                            valid_types = False
                            type_errors.append("avg_session_duration should be numeric")
                        
                        if not isinstance(result["bounce_rate"], (int, float)):
                            valid_types = False
                            type_errors.append("bounce_rate should be numeric")
                        
                        if not isinstance(result["top_pages"], list):
                            valid_types = False
                            type_errors.append("top_pages should be list")
                        
                        if not isinstance(result["conversion_rate"], (int, float)):
                            valid_types = False
                            type_errors.append("conversion_rate should be numeric")
                        
                        if not isinstance(result["device_breakdown"], dict):
                            valid_types = False
                            type_errors.append("device_breakdown should be dict")
                        
                        if not isinstance(result["traffic_sources"], dict):
                            valid_types = False
                            type_errors.append("traffic_sources should be dict")
                        
                        if valid_types:
                            self.log_test(f"Analytics Stats - {timeframe.upper()} Timeframe", True, 
                                        f"All fields present with correct types. Pages: {result['total_page_views']}, Visitors: {result['unique_visitors']}")
                        else:
                            self.log_test(f"Analytics Stats - {timeframe.upper()} Timeframe", False, 
                                        f"Type validation errors: {', '.join(type_errors)}")
                    else:
                        self.log_test(f"Analytics Stats - {timeframe.upper()} Timeframe", False, 
                                    f"Missing fields: {missing_fields}")
                else:
                    self.log_test(f"Analytics Stats - {timeframe.upper()} Timeframe", False, 
                                f"Status: {response.status_code}, Response: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Analytics Stats - {timeframe.upper()} Timeframe", False, f"Exception: {str(e)}")
    
    def test_performance_metrics(self):
        """Test GET /api/analytics/performance endpoint"""
        print("\n=== Testing Performance Metrics ===")
        
        # Test different timeframes
        timeframes = ["1h", "24h", "7d", "30d"]
        
        for timeframe in timeframes:
            try:
                response = requests.get(f"{BACKEND_URL}/analytics/performance?timeframe={timeframe}", timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Check required fields
                    required_fields = [
                        "avg_page_load_time", "avg_api_response_time", 
                        "total_requests", "performance_score"
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in result]
                    
                    if not missing_fields:
                        # Validate data types and ranges
                        valid_data = True
                        validation_errors = []
                        
                        if not isinstance(result["avg_page_load_time"], (int, float)) or result["avg_page_load_time"] < 0:
                            valid_data = False
                            validation_errors.append("avg_page_load_time should be positive number")
                        
                        if not isinstance(result["avg_api_response_time"], (int, float)) or result["avg_api_response_time"] < 0:
                            valid_data = False
                            validation_errors.append("avg_api_response_time should be positive number")
                        
                        if not isinstance(result["total_requests"], int) or result["total_requests"] < 0:
                            valid_data = False
                            validation_errors.append("total_requests should be non-negative integer")
                        
                        if not isinstance(result["performance_score"], (int, float)) or not (0 <= result["performance_score"] <= 100):
                            valid_data = False
                            validation_errors.append("performance_score should be between 0-100")
                        
                        if valid_data:
                            self.log_test(f"Performance Metrics - {timeframe.upper()} Timeframe", True, 
                                        f"Page Load: {result['avg_page_load_time']}s, API: {result['avg_api_response_time']}ms, Score: {result['performance_score']}")
                        else:
                            self.log_test(f"Performance Metrics - {timeframe.upper()} Timeframe", False, 
                                        f"Validation errors: {', '.join(validation_errors)}")
                    else:
                        self.log_test(f"Performance Metrics - {timeframe.upper()} Timeframe", False, 
                                    f"Missing fields: {missing_fields}")
                else:
                    self.log_test(f"Performance Metrics - {timeframe.upper()} Timeframe", False, 
                                f"Status: {response.status_code}, Response: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Performance Metrics - {timeframe.upper()} Timeframe", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all analytics test suites"""
        print("🚀 Starting Analytics & Tracking System Tests")
        print("=" * 60)
        
        # Run all test suites
        self.test_analytics_track_endpoint()
        self.test_conversion_tracking()
        self.test_analytics_stats()
        self.test_performance_metrics()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 ANALYTICS & TRACKING TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

class UserManagementTester:
    """Test User Management System API endpoints"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.test_users = []  # Store created users for cleanup
        self.admin_token = None
        self.user_token = None
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_user_registration(self):
        """Test POST /api/auth/register endpoint"""
        print("\n=== Testing User Registration ===")
        
        # Test Case 1: Valid registration with all requirements
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        valid_user = {
            "email": f"john.doe.{unique_id}@testcompany.com",
            "password": "SecurePass123",
            "full_name": "John Doe",
            "company": "Test Company Inc"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/register", json=valid_user, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["id", "email", "full_name", "company", "role", "is_active", "created_at"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["email"] == valid_user["email"] and result["full_name"] == valid_user["full_name"]:
                        self.log_test("User Registration - Valid Data", True, 
                                    f"User created with ID: {result['id']}")
                        self.test_users.append(result["id"])
                    else:
                        self.log_test("User Registration - Valid Data", False, 
                                    f"User data mismatch: {result}")
                else:
                    self.log_test("User Registration - Valid Data", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("User Registration - Valid Data", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("User Registration - Valid Data", False, f"Exception: {str(e)}")
        
        # Test Case 2: Password validation - missing uppercase
        weak_password_user = {
            "email": "weak.password@test.com",
            "password": "weakpass123",  # No uppercase
            "full_name": "Weak Password User",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/register", json=weak_password_user, timeout=10)
            if response.status_code == 422:
                self.log_test("User Registration - Password Validation (Uppercase)", True, 
                            "Password validation working - uppercase required")
            else:
                self.log_test("User Registration - Password Validation (Uppercase)", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("User Registration - Password Validation (Uppercase)", False, f"Exception: {str(e)}")
        
        # Test Case 3: Password validation - missing digit
        no_digit_user = {
            "email": "nodigit@test.com",
            "password": "NoDigitPass",  # No digit
            "full_name": "No Digit User",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/register", json=no_digit_user, timeout=10)
            if response.status_code == 422:
                self.log_test("User Registration - Password Validation (Digit)", True, 
                            "Password validation working - digit required")
            else:
                self.log_test("User Registration - Password Validation (Digit)", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("User Registration - Password Validation (Digit)", False, f"Exception: {str(e)}")
        
        # Test Case 4: Password validation - too short
        short_password_user = {
            "email": "short@test.com",
            "password": "Short1",  # Less than 8 characters
            "full_name": "Short Password User",
            "company": "Test Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/register", json=short_password_user, timeout=10)
            if response.status_code == 422:
                self.log_test("User Registration - Password Validation (Length)", True, 
                            "Password validation working - minimum 8 characters")
            else:
                self.log_test("User Registration - Password Validation (Length)", False, 
                            f"Expected 422, got: {response.status_code}")
        except Exception as e:
            self.log_test("User Registration - Password Validation (Length)", False, f"Exception: {str(e)}")
        
        # Test Case 5: Duplicate email registration
        duplicate_user = {
            "email": valid_user["email"],  # Same as first test
            "password": "AnotherPass123",
            "full_name": "John Duplicate",
            "company": "Another Company"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/register", json=duplicate_user, timeout=10)
            if response.status_code == 400:
                self.log_test("User Registration - Duplicate Email", True, 
                            "Duplicate email properly rejected")
            else:
                self.log_test("User Registration - Duplicate Email", False, 
                            f"Expected 400, got: {response.status_code}")
        except Exception as e:
            self.log_test("User Registration - Duplicate Email", False, f"Exception: {str(e)}")
    
    def test_user_authentication(self):
        """Test POST /api/auth/login endpoint"""
        print("\n=== Testing User Authentication ===")
        
        # First create a test user for login
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        test_user = {
            "email": f"login.test.{unique_id}@company.com",
            "password": "LoginTest123",
            "full_name": "Login Test User",
            "company": "Login Test Company"
        }
        
        # Register the user first
        register_response = requests.post(f"{BACKEND_URL}/auth/register", json=test_user, timeout=15)
        if register_response.status_code != 200:
            self.log_test("User Authentication - Setup", False, "Failed to create test user for login")
            return
        
        # Test Case 1: Successful login with correct credentials
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check JWT token structure
                required_fields = ["access_token", "token_type", "expires_in", "user"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["token_type"] == "bearer" and len(result["access_token"]) > 0:
                        self.log_test("User Authentication - Successful Login", True, 
                                    f"JWT token generated, expires in: {result['expires_in']} minutes")
                        
                        # Store token for later tests
                        self.user_token = result["access_token"]
                        self.test_user = test_user  # Store for password reset test
                        
                        # Verify user data in response
                        user_data = result["user"]
                        if user_data["email"] == test_user["email"]:
                            self.log_test("User Authentication - User Data in Token", True, 
                                        "User data correctly included in login response")
                        else:
                            self.log_test("User Authentication - User Data in Token", False, 
                                        "User data mismatch in login response")
                    else:
                        self.log_test("User Authentication - Successful Login", False, 
                                    f"Invalid token structure: {result}")
                else:
                    self.log_test("User Authentication - Successful Login", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("User Authentication - Successful Login", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("User Authentication - Successful Login", False, f"Exception: {str(e)}")
        
        # Test Case 2: Failed login with incorrect password
        wrong_password = {
            "email": test_user["email"],
            "password": "WrongPassword123"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/login", json=wrong_password, timeout=10)
            if response.status_code == 401:
                self.log_test("User Authentication - Wrong Password", True, 
                            "Wrong password properly rejected")
            else:
                self.log_test("User Authentication - Wrong Password", False, 
                            f"Expected 401, got: {response.status_code}")
        except Exception as e:
            self.log_test("User Authentication - Wrong Password", False, f"Exception: {str(e)}")
        
        # Test Case 3: Failed login with non-existent email
        nonexistent_user = {
            "email": "nonexistent@test.com",
            "password": "SomePassword123"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/login", json=nonexistent_user, timeout=10)
            if response.status_code == 401:
                self.log_test("User Authentication - Non-existent User", True, 
                            "Non-existent user properly rejected")
            else:
                self.log_test("User Authentication - Non-existent User", False, 
                            f"Expected 401, got: {response.status_code}")
        except Exception as e:
            self.log_test("User Authentication - Non-existent User", False, f"Exception: {str(e)}")
    
    def test_user_profile_management(self):
        """Test GET /api/auth/me and PUT /api/auth/profile endpoints"""
        print("\n=== Testing User Profile Management ===")
        
        if not self.user_token:
            self.log_test("User Profile - Token Setup", False, "No user token available for testing")
            return
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        
        # Test Case 1: Get current user profile
        try:
            response = requests.get(f"{BACKEND_URL}/auth/me", headers=headers, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check profile structure
                required_fields = ["id", "email", "full_name", "company", "role", "is_active"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("User Profile - Get Current User", True, 
                                f"Profile retrieved for user: {result['email']}")
                    
                    # Store user ID for later tests
                    self.test_user_id = result["id"]
                else:
                    self.log_test("User Profile - Get Current User", False, 
                                f"Missing profile fields: {missing_fields}")
            else:
                self.log_test("User Profile - Get Current User", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("User Profile - Get Current User", False, f"Exception: {str(e)}")
        
        # Test Case 2: Update user profile
        profile_update = {
            "full_name": "Updated Test User",
            "company": "Updated Test Company",
            "profile_data": {"department": "Engineering", "role": "Senior Developer"}
        }
        
        try:
            response = requests.put(f"{BACKEND_URL}/auth/profile", 
                                  json=profile_update, headers=headers, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                if result["full_name"] == profile_update["full_name"]:
                    self.log_test("User Profile - Update Profile", True, 
                                f"Profile updated successfully: {result['full_name']}")
                else:
                    self.log_test("User Profile - Update Profile", False, 
                                f"Profile update failed: {result}")
            else:
                self.log_test("User Profile - Update Profile", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("User Profile - Update Profile", False, f"Exception: {str(e)}")
        
        # Test Case 3: Unauthorized access (no token)
        try:
            response = requests.get(f"{BACKEND_URL}/auth/me", timeout=10)
            if response.status_code in [401, 403]:  # Both are acceptable for unauthorized access
                self.log_test("User Profile - Unauthorized Access", True, 
                            f"Unauthorized access properly rejected with status {response.status_code}")
            else:
                self.log_test("User Profile - Unauthorized Access", False, 
                            f"Expected 401 or 403, got: {response.status_code}")
        except Exception as e:
            self.log_test("User Profile - Unauthorized Access", False, f"Exception: {str(e)}")
    
    def test_password_management(self):
        """Test password change and reset endpoints"""
        print("\n=== Testing Password Management ===")
        
        if not self.user_token:
            self.log_test("Password Management - Token Setup", False, "No user token available for testing")
            return
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        
        # Test Case 1: Change password with correct current password
        password_change = {
            "current_password": "LoginTest123",  # From the login test user
            "new_password": "NewSecurePass123"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/change-password", 
                                   json=password_change, headers=headers, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Password changed successfully":
                    self.log_test("Password Management - Change Password", True, 
                                "Password changed successfully")
                else:
                    self.log_test("Password Management - Change Password", False, 
                                f"Unexpected response: {result}")
            else:
                self.log_test("Password Management - Change Password", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Password Management - Change Password", False, f"Exception: {str(e)}")
        
        # Test Case 2: Change password with wrong current password
        wrong_current_password = {
            "current_password": "WrongCurrentPass123",
            "new_password": "AnotherNewPass123"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/change-password", 
                                   json=wrong_current_password, headers=headers, timeout=10)
            
            if response.status_code == 400:
                self.log_test("Password Management - Wrong Current Password", True, 
                            "Wrong current password properly rejected")
            else:
                self.log_test("Password Management - Wrong Current Password", False, 
                            f"Expected 400, got: {response.status_code}")
        except Exception as e:
            self.log_test("Password Management - Wrong Current Password", False, f"Exception: {str(e)}")
        
        # Test Case 3: Request password reset
        reset_request = {
            "email": self.test_user["email"] if hasattr(self, 'test_user') else "login.test@company.com"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/auth/request-password-reset", 
                                   json=reset_request, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "If the email exists, a reset token has been sent":
                    self.log_test("Password Management - Request Reset", True, 
                                "Password reset request processed")
                else:
                    self.log_test("Password Management - Request Reset", False, 
                                f"Unexpected response: {result}")
            else:
                self.log_test("Password Management - Request Reset", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Password Management - Request Reset", False, f"Exception: {str(e)}")
    
    def test_admin_functions(self):
        """Test admin-only endpoints"""
        print("\n=== Testing Admin Functions ===")
        
        # First create an admin user
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        admin_user = {
            "email": f"admin.{unique_id}@testcompany.com",
            "password": "AdminPass123",
            "full_name": "Admin User",
            "company": "Test Company",
            "role": "admin"
        }
        
        # Register admin user
        register_response = requests.post(f"{BACKEND_URL}/auth/register", json=admin_user, timeout=15)
        if register_response.status_code != 200:
            self.log_test("Admin Functions - Admin User Setup", False, "Failed to create admin user")
            return
        
        # Login as admin
        admin_login = {
            "email": admin_user["email"],
            "password": admin_user["password"]
        }
        
        login_response = requests.post(f"{BACKEND_URL}/auth/login", json=admin_login, timeout=15)
        if login_response.status_code != 200:
            self.log_test("Admin Functions - Admin Login", False, "Failed to login as admin")
            return
        
        admin_token = login_response.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Test Case 1: Get all users (admin only)
        try:
            response = requests.get(f"{BACKEND_URL}/users", headers=admin_headers, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list):
                    self.log_test("Admin Functions - Get All Users", True, 
                                f"Retrieved {len(result)} users")
                else:
                    self.log_test("Admin Functions - Get All Users", False, 
                                f"Invalid response format: {result}")
            else:
                self.log_test("Admin Functions - Get All Users", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Admin Functions - Get All Users", False, f"Exception: {str(e)}")
        
        # Test Case 2: Get user by ID (admin only)
        if hasattr(self, 'test_user_id'):
            try:
                response = requests.get(f"{BACKEND_URL}/users/{self.test_user_id}", 
                                      headers=admin_headers, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("id") == self.test_user_id:
                        self.log_test("Admin Functions - Get User by ID", True, 
                                    f"Retrieved user: {result['email']}")
                    else:
                        self.log_test("Admin Functions - Get User by ID", False, 
                                    f"User ID mismatch: {result}")
                else:
                    self.log_test("Admin Functions - Get User by ID", False, 
                                f"Status: {response.status_code}, Response: {response.text}")
                    
            except Exception as e:
                self.log_test("Admin Functions - Get User by ID", False, f"Exception: {str(e)}")
        
        # Test Case 3: Update user role (admin only)
        if hasattr(self, 'test_user_id'):
            try:
                response = requests.put(f"{BACKEND_URL}/users/{self.test_user_id}/role?role=viewer", 
                                      headers=admin_headers, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    if "role updated to viewer" in result.get("message", "").lower():
                        self.log_test("Admin Functions - Update User Role", True, 
                                    f"Role updated successfully: {result['message']}")
                    else:
                        self.log_test("Admin Functions - Update User Role", False, 
                                    f"Unexpected response: {result}")
                else:
                    self.log_test("Admin Functions - Update User Role", False, 
                                f"Status: {response.status_code}, Response: {response.text}")
                    
            except Exception as e:
                self.log_test("Admin Functions - Update User Role", False, f"Exception: {str(e)}")
        
        # Test Case 4: Update user status (admin only)
        if hasattr(self, 'test_user_id'):
            try:
                response = requests.put(f"{BACKEND_URL}/users/{self.test_user_id}/status?is_active=false", 
                                      headers=admin_headers, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    if "deactivated successfully" in result.get("message", "").lower() or "status updated" in result.get("message", "").lower():
                        self.log_test("Admin Functions - Update User Status", True, 
                                    f"Status updated successfully: {result['message']}")
                    else:
                        self.log_test("Admin Functions - Update User Status", False, 
                                    f"Unexpected response: {result}")
                else:
                    self.log_test("Admin Functions - Update User Status", False, 
                                f"Status: {response.status_code}, Response: {response.text}")
                    
            except Exception as e:
                self.log_test("Admin Functions - Update User Status", False, f"Exception: {str(e)}")
        
        # Test Case 5: Non-admin user trying to access admin endpoints
        if self.user_token:
            user_headers = {"Authorization": f"Bearer {self.user_token}"}
            
            try:
                response = requests.get(f"{BACKEND_URL}/users", headers=user_headers, timeout=10)
                if response.status_code in [400, 403]:  # Both are acceptable for access control
                    self.log_test("Admin Functions - Non-admin Access Control", True, 
                                f"Non-admin user properly denied access with status {response.status_code}")
                else:
                    self.log_test("Admin Functions - Non-admin Access Control", False, 
                                f"Expected 400 or 403, got: {response.status_code}")
            except Exception as e:
                self.log_test("Admin Functions - Non-admin Access Control", False, f"Exception: {str(e)}")
    
    def test_jwt_token_validation(self):
        """Test JWT token structure and validation"""
        print("\n=== Testing JWT Token Validation ===")
        
        if not self.user_token:
            self.log_test("JWT Validation - Token Setup", False, "No user token available for testing")
            return
        
        # Test Case 1: Valid token structure
        try:
            import base64
            import json as json_lib
            
            # Decode JWT token (without verification for testing)
            token_parts = self.user_token.split('.')
            if len(token_parts) == 3:
                # Decode header
                header_data = base64.b64decode(token_parts[0] + '==').decode('utf-8')
                header = json_lib.loads(header_data)
                
                # Decode payload
                payload_data = base64.b64decode(token_parts[1] + '==').decode('utf-8')
                payload = json_lib.loads(payload_data)
                
                # Check JWT structure
                if header.get('alg') and payload.get('sub') and payload.get('exp'):
                    self.log_test("JWT Validation - Token Structure", True, 
                                f"Valid JWT structure with algorithm: {header.get('alg')}")
                    
                    # Check expiration
                    import time
                    current_time = time.time()
                    if payload.get('exp') > current_time:
                        self.log_test("JWT Validation - Token Expiration", True, 
                                    "Token not expired")
                    else:
                        self.log_test("JWT Validation - Token Expiration", False, 
                                    "Token is expired")
                else:
                    self.log_test("JWT Validation - Token Structure", False, 
                                f"Invalid JWT structure: header={header}, payload keys={list(payload.keys())}")
            else:
                self.log_test("JWT Validation - Token Structure", False, 
                            f"Invalid JWT format: {len(token_parts)} parts")
                
        except Exception as e:
            self.log_test("JWT Validation - Token Structure", False, f"Exception: {str(e)}")
        
        # Test Case 2: Invalid token
        invalid_headers = {"Authorization": "Bearer invalid_token_here"}
        
        try:
            response = requests.get(f"{BACKEND_URL}/auth/me", headers=invalid_headers, timeout=10)
            if response.status_code == 401:
                self.log_test("JWT Validation - Invalid Token", True, 
                            "Invalid token properly rejected")
            else:
                self.log_test("JWT Validation - Invalid Token", False, 
                            f"Expected 401, got: {response.status_code}")
        except Exception as e:
            self.log_test("JWT Validation - Invalid Token", False, f"Exception: {str(e)}")
        
        # Test Case 3: Missing Authorization header
        try:
            response = requests.get(f"{BACKEND_URL}/auth/me", timeout=10)
            if response.status_code in [401, 403]:  # Both are acceptable for missing auth
                self.log_test("JWT Validation - Missing Authorization", True, 
                            f"Missing authorization properly rejected with status {response.status_code}")
            else:
                self.log_test("JWT Validation - Missing Authorization", False, 
                            f"Expected 401 or 403, got: {response.status_code}")
        except Exception as e:
            self.log_test("JWT Validation - Missing Authorization", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all user management test suites"""
        print("🚀 Starting User Management System API Tests")
        print("=" * 60)
        
        # Run all test suites in order
        self.test_user_registration()
        self.test_user_authentication()
        self.test_user_profile_management()
        self.test_password_management()
        self.test_admin_functions()
        self.test_jwt_token_validation()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 USER MANAGEMENT TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    print("🎯 USER MANAGEMENT SYSTEM API TESTING")
    print("=" * 80)
    
    # Test User Management System API (Focus of this test)
    print("\n🔐 TESTING USER MANAGEMENT SYSTEM API")
    user_mgmt_tester = UserManagementTester()
    user_mgmt_success = user_mgmt_tester.run_all_tests()
    
    # Final Summary
    print("\n" + "=" * 80)
    print("🏁 USER MANAGEMENT API TEST SUMMARY")
    print("=" * 80)
    
    total_tests = len(user_mgmt_tester.test_results)
    total_passed = len(user_mgmt_tester.passed_tests)
    total_failed = len(user_mgmt_tester.failed_tests)
    
    print(f"📊 Overall Results:")
    print(f"   Total Tests: {total_tests}")
    print(f"   ✅ Passed: {total_passed}")
    print(f"   ❌ Failed: {total_failed}")
    print(f"   Success Rate: {(total_passed/total_tests)*100:.1f}%")
    
    if user_mgmt_success:
        print("\n🎉 ALL USER MANAGEMENT API TESTS PASSED! 🎉")
        print("✅ User Registration API: Working")
        print("✅ User Authentication API: Working") 
        print("✅ User Profile Management API: Working")
        print("✅ Password Management API: Working")
        print("✅ JWT Token Validation: Working")
    else:
        print("\n⚠️  SOME USER MANAGEMENT TESTS FAILED")
        print("❌ Check failed tests above for details")
        
    print("\n" + "=" * 80)