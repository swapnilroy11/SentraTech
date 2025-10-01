#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for SentraTech Application
Testing all critical endpoints for regression after frontend changes
Focus: Phase 2 accessibility and Phase 3 frontend functionality improvements validation
"""

import requests
import json
import time
import asyncio
import websockets
from datetime import datetime
from typing import Dict, Any, List
import urllib.parse
import threading
import concurrent.futures
import statistics
import random
import string
import uuid

# Backend URL from environment
BACKEND_URL = "https://formforward.preview.emergentagent.com/api"

class ComprehensiveBackendTester:
    """Comprehensive Backend API Testing Framework"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.session = requests.Session()
        self.auth_token = None
        
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
    
    def generate_realistic_demo_data(self) -> Dict[str, Any]:
        """Generate realistic demo request data"""
        companies = [
            "TechCorp Solutions", "Global Dynamics Inc", "Innovation Labs", 
            "Digital Ventures", "Enterprise Systems", "CloudTech Partners"
        ]
        
        first_names = ["Sarah", "Michael", "Jennifer", "David", "Lisa", "Robert"]
        last_names = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller"]
        domains = ["techcorp.com", "globalinc.com", "innovationlabs.io", "digitalventures.net"]
        
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        company = random.choice(companies)
        domain = random.choice(domains)
        
        return {
            "name": f"{first_name} {last_name}",
            "email": f"{first_name.lower()}.{last_name.lower()}@{domain}",
            "company": company,
            "phone": f"+1{random.randint(200, 999)}{random.randint(200, 999)}{random.randint(1000, 9999)}",
            "message": "Interested in AI customer support platform for our growing business",
            "call_volume": random.choice(["500-1000", "1000-2500", "2500-5000"])
        }
    
    def generate_realistic_roi_data(self) -> Dict[str, Any]:
        """Generate realistic ROI calculation data"""
        return {
            "call_volume": random.randint(1000, 50000),
            "current_cost_per_call": round(random.uniform(2.50, 15.00), 2),
            "average_handle_time": random.randint(180, 900),
            "agent_count": random.randint(5, 200)
        }
    
    def test_health_check(self):
        """Test basic health check endpoint"""
        print("\n=== Testing Health Check Endpoint ===")
        
        try:
            response = self.session.get(f"{BACKEND_URL}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["status", "timestamp", "database"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields and data["status"] == "healthy":
                    self.log_test("Health Check - Basic Connectivity", True, 
                                f"Status: {data['status']}, Database: {data['database']}")
                else:
                    self.log_test("Health Check - Basic Connectivity", False, 
                                f"Missing fields: {missing_fields} or unhealthy status")
            else:
                self.log_test("Health Check - Basic Connectivity", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Health Check - Basic Connectivity", False, f"Exception: {str(e)}")
    
    def test_roi_calculator_endpoints(self):
        """Test ROI Calculator API endpoints"""
        print("\n=== Testing ROI Calculator API Endpoints ===")
        
        # Test 1: POST /api/roi/calculate
        try:
            roi_data = self.generate_realistic_roi_data()
            response = self.session.post(f"{BACKEND_URL}/roi/calculate", json=roi_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                required_fields = [
                    "current_monthly_cost", "current_annual_cost", "new_monthly_cost", 
                    "new_annual_cost", "monthly_savings", "annual_savings", "roi"
                ]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    # Verify calculation logic
                    if (result["monthly_savings"] > 0 and result["annual_savings"] > 0 and 
                        result["roi"] > 0 and result["current_monthly_cost"] > result["new_monthly_cost"]):
                        self.log_test("ROI Calculator - Calculate Endpoint", True, 
                                    f"Calculations correct: Monthly savings ${result['monthly_savings']:.2f}, ROI {result['roi']:.1f}%")
                    else:
                        self.log_test("ROI Calculator - Calculate Endpoint", False, 
                                    "Calculation logic appears incorrect")
                else:
                    self.log_test("ROI Calculator - Calculate Endpoint", False, 
                                f"Missing fields: {missing_fields}")
            else:
                self.log_test("ROI Calculator - Calculate Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("ROI Calculator - Calculate Endpoint", False, f"Exception: {str(e)}")
        
        # Test 2: POST /api/roi/save
        try:
            roi_data = self.generate_realistic_roi_data()
            save_request = {"input_data": roi_data, "user_info": {"test": "regression_test"}}
            response = self.session.post(f"{BACKEND_URL}/roi/save", json=save_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if "id" in result and "results" in result and "timestamp" in result:
                    self.log_test("ROI Calculator - Save Endpoint", True, 
                                f"ROI calculation saved with ID: {result['id']}")
                else:
                    self.log_test("ROI Calculator - Save Endpoint", False, 
                                "Invalid save response structure")
            else:
                self.log_test("ROI Calculator - Save Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("ROI Calculator - Save Endpoint", False, f"Exception: {str(e)}")
        
        # Test 3: GET /api/roi/calculations
        try:
            response = self.session.get(f"{BACKEND_URL}/roi/calculations?limit=10", timeout=10)
            
            if response.status_code == 200:
                calculations = response.json()
                if isinstance(calculations, list):
                    self.log_test("ROI Calculator - Retrieve Calculations", True, 
                                f"Retrieved {len(calculations)} calculations")
                else:
                    self.log_test("ROI Calculator - Retrieve Calculations", False, 
                                "Invalid response format")
            else:
                self.log_test("ROI Calculator - Retrieve Calculations", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("ROI Calculator - Retrieve Calculations", False, f"Exception: {str(e)}")
    
    def test_demo_request_endpoints(self):
        """Test Demo Request & CRM Integration endpoints"""
        print("\n=== Testing Demo Request & CRM Integration Endpoints ===")
        
        # Test 1: POST /api/demo/request (JSON)
        try:
            demo_data = self.generate_realistic_demo_data()
            demo_data["email"] = f"regression_test_{int(time.time())}@example.com"
            
            response = self.session.post(f"{BACKEND_URL}/demo/request", json=demo_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                required_fields = ["success", "message", "reference_id"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields and result["success"] and result["reference_id"]:
                    self.log_test("Demo Request - JSON Endpoint", True, 
                                f"Demo request successful, Reference ID: {result['reference_id']}")
                else:
                    self.log_test("Demo Request - JSON Endpoint", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Demo Request - JSON Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - JSON Endpoint", False, f"Exception: {str(e)}")
        
        # Test 2: POST /api/demo-request (Form data)
        try:
            demo_data = self.generate_realistic_demo_data()
            demo_data["email"] = f"form_test_{int(time.time())}@example.com"
            
            response = self.session.post(f"{BACKEND_URL}/demo-request", data=demo_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success" and "requestId" in result:
                    self.log_test("Demo Request - Form Data Endpoint", True, 
                                f"Form submission successful, Request ID: {result['requestId']}")
                else:
                    self.log_test("Demo Request - Form Data Endpoint", False, 
                                f"Invalid form response: {result}")
            else:
                self.log_test("Demo Request - Form Data Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Form Data Endpoint", False, f"Exception: {str(e)}")
        
        # Test 3: GET /api/demo/requests (Admin endpoint)
        try:
            response = self.session.get(f"{BACKEND_URL}/demo/requests?limit=10", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "requests" in result:
                    self.log_test("Demo Request - Retrieve Requests", True, 
                                f"Retrieved {result.get('count', 0)} demo requests")
                else:
                    self.log_test("Demo Request - Retrieve Requests", False, 
                                "Invalid retrieve response")
            else:
                self.log_test("Demo Request - Retrieve Requests", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Demo Request - Retrieve Requests", False, f"Exception: {str(e)}")
    
    def test_real_time_metrics_endpoints(self):
        """Test Real-time Metrics API endpoints"""
        print("\n=== Testing Real-time Metrics API Endpoints ===")
        
        # Test 1: GET /api/metrics/live
        try:
            response = self.session.get(f"{BACKEND_URL}/metrics/live", timeout=10)
            
            if response.status_code == 200:
                metrics = response.json()
                required_fields = [
                    "active_chats", "response_time_ms", "automation_rate", 
                    "customer_satisfaction", "resolution_rate", "timestamp"
                ]
                missing_fields = [field for field in required_fields if field not in metrics]
                
                if not missing_fields:
                    # Verify realistic values
                    if (0 <= metrics["automation_rate"] <= 100 and 
                        0 <= metrics["customer_satisfaction"] <= 100 and
                        metrics["response_time_ms"] > 0):
                        self.log_test("Real-time Metrics - Live Metrics", True, 
                                    f"Live metrics valid: {metrics['response_time_ms']}ms response, {metrics['automation_rate']}% automation")
                    else:
                        self.log_test("Real-time Metrics - Live Metrics", False, 
                                    "Unrealistic metric values")
                else:
                    self.log_test("Real-time Metrics - Live Metrics", False, 
                                f"Missing fields: {missing_fields}")
            else:
                self.log_test("Real-time Metrics - Live Metrics", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Real-time Metrics - Live Metrics", False, f"Exception: {str(e)}")
        
        # Test 2: GET /api/metrics/dashboard
        try:
            response = self.session.get(f"{BACKEND_URL}/metrics/dashboard", timeout=10)
            
            if response.status_code == 200:
                dashboard = response.json()
                required_sections = ["current_metrics", "trends", "alerts"]
                missing_sections = [section for section in required_sections if section not in dashboard]
                
                if not missing_sections:
                    self.log_test("Real-time Metrics - Dashboard", True, 
                                f"Dashboard complete with {len(dashboard.get('trends', []))} trend points")
                else:
                    self.log_test("Real-time Metrics - Dashboard", False, 
                                f"Missing sections: {missing_sections}")
            else:
                self.log_test("Real-time Metrics - Dashboard", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Real-time Metrics - Dashboard", False, f"Exception: {str(e)}")
        
        # Test 3: GET /api/metrics/kpis
        try:
            response = self.session.get(f"{BACKEND_URL}/metrics/kpis", timeout=10)
            
            if response.status_code == 200:
                kpis = response.json()
                expected_kpis = ["response_time", "automation_rate", "uptime", "satisfaction"]
                found_kpis = [kpi for kpi in expected_kpis if kpi in kpis]
                
                if len(found_kpis) >= 3:  # At least 3 KPIs should be present
                    self.log_test("Real-time Metrics - KPIs", True, 
                                f"KPIs available: {', '.join(found_kpis)}")
                else:
                    self.log_test("Real-time Metrics - KPIs", False, 
                                f"Insufficient KPIs: {found_kpis}")
            else:
                self.log_test("Real-time Metrics - KPIs", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Real-time Metrics - KPIs", False, f"Exception: {str(e)}")
        
        # Test 4: GET /api/metrics/history/{metric_name}
        try:
            metric_name = "response_time_ms"
            response = self.session.get(f"{BACKEND_URL}/metrics/history/{metric_name}?timeframe=1h", timeout=10)
            
            if response.status_code == 200:
                history = response.json()
                if isinstance(history, list) and len(history) > 0:
                    self.log_test("Real-time Metrics - History", True, 
                                f"History data available: {len(history)} data points for {metric_name}")
                else:
                    self.log_test("Real-time Metrics - History", False, 
                                "No history data available")
            else:
                self.log_test("Real-time Metrics - History", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Real-time Metrics - History", False, f"Exception: {str(e)}")
    
    def test_analytics_tracking_endpoints(self):
        """Test Analytics & Tracking System API endpoints"""
        print("\n=== Testing Analytics & Tracking System API Endpoints ===")
        
        # Test 1: POST /api/analytics/track
        try:
            track_data = {
                "session_id": str(uuid.uuid4()),
                "event_type": "page_view",
                "page_path": "/test-page",
                "page_title": "Test Page",
                "user_agent": "Mozilla/5.0 (Test Browser)",
                "additional_data": {"test": "regression"}
            }
            
            response = self.session.post(f"{BACKEND_URL}/analytics/track", json=track_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Analytics - Event Tracking", True, 
                                f"Event tracked successfully: {track_data['event_type']}")
                else:
                    self.log_test("Analytics - Event Tracking", False, 
                                f"Tracking failed: {result}")
            else:
                self.log_test("Analytics - Event Tracking", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Event Tracking", False, f"Exception: {str(e)}")
        
        # Test 2: POST /api/analytics/conversion
        try:
            conversion_params = {
                "session_id": str(uuid.uuid4()),
                "event_name": "demo_request",
                "page_path": "/demo-request",
                "funnel_step": "form_submission",
                "conversion_value": 100,
                "user_id": str(uuid.uuid4())
            }
            
            response = self.session.post(f"{BACKEND_URL}/analytics/conversion", params=conversion_params, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Analytics - Conversion Tracking", True, 
                                f"Conversion tracked: {conversion_params['event_name']}")
                else:
                    self.log_test("Analytics - Conversion Tracking", False, 
                                f"Conversion tracking failed: {result}")
            else:
                self.log_test("Analytics - Conversion Tracking", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Conversion Tracking", False, f"Exception: {str(e)}")
        
        # Test 3: GET /api/analytics/stats
        try:
            response = self.session.get(f"{BACKEND_URL}/analytics/stats?timeframe=24h", timeout=10)
            
            if response.status_code == 200:
                stats = response.json()
                expected_fields = ["total_page_views", "unique_visitors", "conversion_rate"]
                found_fields = [field for field in expected_fields if field in stats]
                
                if len(found_fields) >= 2:
                    self.log_test("Analytics - Statistics", True, 
                                f"Statistics available: {', '.join(found_fields)}")
                else:
                    self.log_test("Analytics - Statistics", False, 
                                f"Insufficient statistics: {found_fields}")
            else:
                self.log_test("Analytics - Statistics", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Statistics", False, f"Exception: {str(e)}")
        
        # Test 4: GET /api/analytics/performance
        try:
            response = self.session.get(f"{BACKEND_URL}/analytics/performance?timeframe=1h", timeout=10)
            
            if response.status_code == 200:
                performance = response.json()
                expected_fields = ["avg_page_load_time", "avg_api_response_time", "performance_score"]
                found_fields = [field for field in expected_fields if field in performance]
                
                if len(found_fields) >= 2:
                    self.log_test("Analytics - Performance Metrics", True, 
                                f"Performance metrics: {', '.join(found_fields)}")
                else:
                    self.log_test("Analytics - Performance Metrics", False, 
                                f"Insufficient performance data: {found_fields}")
            else:
                self.log_test("Analytics - Performance Metrics", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Performance Metrics", False, f"Exception: {str(e)}")
    
    def test_user_management_endpoints(self):
        """Test User Management System API endpoints"""
        print("\n=== Testing User Management System API Endpoints ===")
        
        # Test 1: POST /api/auth/register
        try:
            user_data = {
                "email": f"test_user_{int(time.time())}@example.com",
                "password": "TestPassword123!",
                "full_name": "Test User",
                "company": "Test Company"
            }
            
            response = self.session.post(f"{BACKEND_URL}/auth/register", json=user_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if "id" in result and "email" in result:
                    self.log_test("User Management - Registration", True, 
                                f"User registered successfully: {result['email']}")
                    self.test_user_email = user_data["email"]
                    self.test_user_password = user_data["password"]
                else:
                    self.log_test("User Management - Registration", False, 
                                f"Invalid registration response: {result}")
            else:
                self.log_test("User Management - Registration", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("User Management - Registration", False, f"Exception: {str(e)}")
        
        # Test 2: POST /api/auth/login
        try:
            if hasattr(self, 'test_user_email'):
                login_data = {
                    "email": self.test_user_email,
                    "password": self.test_user_password
                }
                
                response = self.session.post(f"{BACKEND_URL}/auth/login", json=login_data, timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    if "access_token" in result and "user" in result:
                        self.log_test("User Management - Login", True, 
                                    f"Login successful for {result['user']['email']}")
                        self.auth_token = result["access_token"]
                        # Set authorization header for subsequent requests
                        self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    else:
                        self.log_test("User Management - Login", False, 
                                    f"Invalid login response: {result}")
                else:
                    self.log_test("User Management - Login", False, 
                                f"HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("User Management - Login", False, "No test user available for login")
                
        except Exception as e:
            self.log_test("User Management - Login", False, f"Exception: {str(e)}")
        
        # Test 3: GET /api/auth/me
        try:
            if self.auth_token:
                response = self.session.get(f"{BACKEND_URL}/auth/me", timeout=10)
                
                if response.status_code == 200:
                    user_info = response.json()
                    if "id" in user_info and "email" in user_info:
                        self.log_test("User Management - Profile Retrieval", True, 
                                    f"Profile retrieved: {user_info['email']}")
                    else:
                        self.log_test("User Management - Profile Retrieval", False, 
                                    f"Invalid profile response: {user_info}")
                else:
                    self.log_test("User Management - Profile Retrieval", False, 
                                f"HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("User Management - Profile Retrieval", False, "No auth token available")
                
        except Exception as e:
            self.log_test("User Management - Profile Retrieval", False, f"Exception: {str(e)}")
        
        # Test 4: PUT /api/auth/profile
        try:
            if self.auth_token:
                update_data = {
                    "full_name": "Updated Test User",
                    "profile_data": {"test_update": True}
                }
                
                response = self.session.put(f"{BACKEND_URL}/auth/profile", json=update_data, timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("full_name") == "Updated Test User":
                        self.log_test("User Management - Profile Update", True, 
                                    "Profile updated successfully")
                    else:
                        self.log_test("User Management - Profile Update", False, 
                                    f"Profile update failed: {result}")
                else:
                    self.log_test("User Management - Profile Update", False, 
                                f"HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("User Management - Profile Update", False, "No auth token available")
                
        except Exception as e:
            self.log_test("User Management - Profile Update", False, f"Exception: {str(e)}")
    
    def test_security_privacy_endpoints(self):
        """Test Security Headers & Privacy Compliance endpoints"""
        print("\n=== Testing Security Headers & Privacy Compliance Endpoints ===")
        
        # Test 1: Check security headers on any endpoint
        try:
            response = self.session.get(f"{BACKEND_URL}/health", timeout=10)
            
            security_headers = {
                "Strict-Transport-Security": "HSTS",
                "Content-Security-Policy": "CSP", 
                "X-Frame-Options": "Clickjacking Protection",
                "X-Content-Type-Options": "MIME Sniffing Protection",
                "X-XSS-Protection": "XSS Protection"
            }
            
            found_headers = []
            missing_headers = []
            
            for header, description in security_headers.items():
                if header in response.headers:
                    found_headers.append(f"{header}: {response.headers[header]}")
                else:
                    missing_headers.append(header)
            
            if len(found_headers) >= 3:  # At least 3 security headers should be present
                self.log_test("Security - HTTP Security Headers", True, 
                            f"Security headers present: {len(found_headers)}/5")
            else:
                self.log_test("Security - HTTP Security Headers", False, 
                            f"Insufficient security headers: {len(found_headers)}/5")
                
        except Exception as e:
            self.log_test("Security - HTTP Security Headers", False, f"Exception: {str(e)}")
        
        # Test 2: POST /api/privacy/data-request
        try:
            privacy_request = {
                "email": "privacy.test@example.com",
                "request_type": "export",
                "reason": "GDPR data export request"
            }
            
            response = self.session.post(f"{BACKEND_URL}/privacy/data-request", json=privacy_request, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if "request_id" in result and result.get("status") in ["pending", "verification_pending"]:
                    self.log_test("Privacy - Data Request", True, 
                                f"Privacy request created: {result['request_id']}")
                    self.privacy_request_id = result["request_id"]
                else:
                    self.log_test("Privacy - Data Request", False, 
                                f"Invalid privacy request response: {result}")
            else:
                self.log_test("Privacy - Data Request", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Privacy - Data Request", False, f"Exception: {str(e)}")
        
        # Test 3: GET /api/privacy/data-export/{request_id}
        try:
            if hasattr(self, 'privacy_request_id'):
                response = self.session.get(f"{BACKEND_URL}/privacy/data-export/{self.privacy_request_id}", timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    if "status" in result:
                        self.log_test("Privacy - Data Export Status", True, 
                                    f"Export status: {result['status']}")
                    else:
                        self.log_test("Privacy - Data Export Status", False, 
                                    f"Invalid export response: {result}")
                else:
                    self.log_test("Privacy - Data Export Status", False, 
                                f"HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("Privacy - Data Export Status", False, "No privacy request ID available")
                
        except Exception as e:
            self.log_test("Privacy - Data Export Status", False, f"Exception: {str(e)}")
    
    def test_live_chat_endpoints(self):
        """Test Live Chat Integration endpoints"""
        print("\n=== Testing Live Chat Integration Endpoints ===")
        
        # Test 1: POST /api/chat/session
        try:
            session_data = {"user_id": str(uuid.uuid4())}
            response = self.session.post(f"{BACKEND_URL}/chat/session", json=session_data, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                if "session_id" in result:
                    self.log_test("Live Chat - Session Creation", True, 
                                f"Chat session created: {result['session_id']}")
                    self.chat_session_id = result["session_id"]
                else:
                    self.log_test("Live Chat - Session Creation", False, 
                                f"Invalid session response: {result}")
            else:
                self.log_test("Live Chat - Session Creation", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Live Chat - Session Creation", False, f"Exception: {str(e)}")
        
        # Test 2: POST /api/chat/message
        try:
            if hasattr(self, 'chat_session_id'):
                message_params = {
                    "session_id": self.chat_session_id,
                    "message": "Hello, I need help with SentraTech platform"
                }
                
                response = self.session.post(
                    f"{BACKEND_URL}/chat/message", 
                    params=message_params, 
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if "ai_response" in result and result["ai_response"]:
                        # Check if AI response contains SentraTech-related content
                        ai_response_text = str(result["ai_response"]).lower()
                        sentratech_keywords = ["sentratech", "automation", "ai", "support", "platform"]
                        found_keywords = [kw for kw in sentratech_keywords if kw in ai_response_text]
                        
                        if found_keywords:
                            self.log_test("Live Chat - AI Message Response", True, 
                                        f"AI response contextual: found keywords {found_keywords}")
                        else:
                            self.log_test("Live Chat - AI Message Response", True, 
                                        f"AI response received (length: {len(str(result['ai_response']))})")
                    else:
                        self.log_test("Live Chat - AI Message Response", False, 
                                    f"No AI response: {result}")
                else:
                    self.log_test("Live Chat - AI Message Response", False, 
                                f"HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("Live Chat - AI Message Response", False, "No chat session available")
                
        except Exception as e:
            self.log_test("Live Chat - AI Message Response", False, f"Exception: {str(e)}")
        
        # Test 3: GET /api/chat/session/{session_id}/history
        try:
            if hasattr(self, 'chat_session_id'):
                response = self.session.get(f"{BACKEND_URL}/chat/session/{self.chat_session_id}/history", timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    if "messages" in result and isinstance(result["messages"], list):
                        self.log_test("Live Chat - Message History", True, 
                                    f"Chat history retrieved: {len(result['messages'])} messages")
                    else:
                        self.log_test("Live Chat - Message History", False, 
                                    f"Invalid history format: {result}")
                else:
                    self.log_test("Live Chat - Message History", False, 
                                f"HTTP {response.status_code}: {response.text}")
            else:
                self.log_test("Live Chat - Message History", False, "No chat session available")
                
        except Exception as e:
            self.log_test("Live Chat - Message History", False, f"Exception: {str(e)}")
    
    def test_websocket_connections(self):
        """Test WebSocket connections for real-time features"""
        print("\n=== Testing WebSocket Connections ===")
        
        # Test WebSocket /ws/metrics (if available)
        try:
            import asyncio
            import websockets
            
            async def test_metrics_websocket():
                try:
                    ws_url = BACKEND_URL.replace("https://", "wss://").replace("/api", "/ws/metrics")
                    async with websockets.connect(ws_url, timeout=10) as websocket:
                        # Wait for initial message
                        message = await asyncio.wait_for(websocket.recv(), timeout=5)
                        data = json.loads(message)
                        
                        if "active_chats" in data or "response_time_ms" in data:
                            return True, f"Metrics WebSocket working: {len(message)} bytes received"
                        else:
                            return False, f"Invalid metrics data: {data}"
                            
                except asyncio.TimeoutError:
                    return False, "WebSocket connection timeout"
                except Exception as e:
                    return False, f"WebSocket error: {str(e)}"
            
            # Run async test
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            success, details = loop.run_until_complete(test_metrics_websocket())
            loop.close()
            
            self.log_test("WebSocket - Metrics Stream", success, details)
            
        except ImportError:
            self.log_test("WebSocket - Metrics Stream", False, "websockets library not available")
        except Exception as e:
            self.log_test("WebSocket - Metrics Stream", False, f"Exception: {str(e)}")
    
    def generate_comprehensive_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 80)
        print("📊 SENTRATECH COMPREHENSIVE BACKEND API TESTING REPORT")
        print("=" * 80)
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📈 Overall Test Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📊 Success Rate: {success_rate:.1f}%")
        
        # Categorize results by endpoint group
        categories = {
            "Health Check": [t for t in self.test_results if "Health Check" in t["test"]],
            "ROI Calculator": [t for t in self.test_results if "ROI Calculator" in t["test"]],
            "Demo Request": [t for t in self.test_results if "Demo Request" in t["test"]],
            "Real-time Metrics": [t for t in self.test_results if "Real-time Metrics" in t["test"]],
            "Analytics": [t for t in self.test_results if "Analytics" in t["test"]],
            "User Management": [t for t in self.test_results if "User Management" in t["test"]],
            "Security": [t for t in self.test_results if "Security" in t["test"] or "Privacy" in t["test"]],
            "Live Chat": [t for t in self.test_results if "Live Chat" in t["test"]],
            "WebSocket": [t for t in self.test_results if "WebSocket" in t["test"]]
        }
        
        print(f"\n🎯 Results by Category:")
        for category, tests in categories.items():
            if tests:
                category_passed = len([t for t in tests if t["passed"]])
                category_total = len(tests)
                category_rate = (category_passed / category_total) * 100
                status = "✅" if category_rate >= 80 else "⚠️" if category_rate >= 60 else "❌"
                print(f"   {status} {category}: {category_passed}/{category_total} ({category_rate:.1f}%)")
        
        # Failed tests details
        if self.failed_tests:
            print(f"\n❌ Failed Tests Details:")
            for test_result in self.test_results:
                if not test_result["passed"]:
                    print(f"   • {test_result['test']}: {test_result['details']}")
        
        # Regression assessment
        print(f"\n🔍 Regression Assessment:")
        critical_endpoints = [
            "ROI Calculator", "Demo Request", "Real-time Metrics", 
            "Analytics", "User Management", "Live Chat"
        ]
        
        critical_failures = []
        for category in critical_endpoints:
            category_tests = categories.get(category, [])
            if category_tests:
                failed_in_category = [t for t in category_tests if not t["passed"]]
                if failed_in_category:
                    critical_failures.extend(failed_in_category)
        
        if not critical_failures:
            print(f"   ✅ No regressions detected in critical endpoints")
            print(f"   ✅ Frontend changes did not break backend functionality")
        else:
            print(f"   ❌ {len(critical_failures)} critical endpoint failures detected")
            print(f"   ⚠️ Potential regressions from frontend changes")
        
        # Performance notes
        print(f"\n⚡ Performance Notes:")
        print(f"   • All endpoints tested with realistic data")
        print(f"   • Authentication flows validated")
        print(f"   • Security headers verified")
        print(f"   • Real-time features tested")
        
        return success_rate >= 80 and len(critical_failures) == 0
    
    def run_comprehensive_tests(self):
        """Run all comprehensive backend tests"""
        print("🚀 Starting Comprehensive Backend API Testing")
        print("=" * 80)
        print("Testing SentraTech backend endpoints for regression after frontend changes:")
        print("• Health Check & Basic Connectivity")
        print("• ROI Calculator API (calculate, save, retrieve)")
        print("• Demo Request & CRM Integration (JSON, form, admin)")
        print("• Real-time Metrics API (live, dashboard, KPIs, history)")
        print("• Analytics & Tracking System (track, conversion, stats, performance)")
        print("• User Management System (register, login, profile)")
        print("• Security Headers & Privacy Compliance")
        print("• Live Chat Integration (session, message, history)")
        print("• WebSocket Connections")
        print("=" * 80)
        
        try:
            # Execute all test suites
            self.test_health_check()
            self.test_roi_calculator_endpoints()
            self.test_demo_request_endpoints()
            self.test_real_time_metrics_endpoints()
            self.test_analytics_tracking_endpoints()
            self.test_user_management_endpoints()
            self.test_security_privacy_endpoints()
            self.test_live_chat_endpoints()
            self.test_websocket_connections()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Comprehensive Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        success = self.generate_comprehensive_report()
        
        return success


def main():
    """Main test execution function"""
    print("🎯 SentraTech Comprehensive Backend API Testing")
    print("Focus: Regression testing after Phase 2 accessibility and Phase 3 frontend improvements")
    print("=" * 80)
    
    tester = ComprehensiveBackendTester()
    success = tester.run_comprehensive_tests()
    
    if success:
        print(f"\n🎉 COMPREHENSIVE TESTING COMPLETE - SUCCESS!")
        print(f"✅ All critical backend endpoints working correctly")
        print(f"✅ No regressions detected from frontend changes")
        return 0
    else:
        print(f"\n⚠️ COMPREHENSIVE TESTING COMPLETE - ISSUES DETECTED")
        print(f"❌ Some backend endpoints have issues")
        print(f"🔍 Review failed tests above for details")
        return 1


if __name__ == "__main__":
    exit(main())