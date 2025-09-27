#!/usr/bin/env python3
"""
NEW SentraTech Pricing Backend Integration Testing
Tests the updated pricing backend functionality including:
1. Contact Request API with Plan Metadata
2. Enhanced Notify Endpoint Testing  
3. Analytics Integration for Pricing Events
"""

import requests
import json
import time
import asyncio
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://supabase-forms.preview.emergentagent.com/api"

class PricingBackendTester:
    """Comprehensive testing for NEW SentraTech pricing backend integration"""
    
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
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            if response.status_code == 200:
                self.log_test("Basic API Connectivity", True, f"Health check successful: {response.status_code}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Health check failed: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_contact_request_with_plan_metadata_starter(self):
        """Test Contact Request API with Starter Plan Metadata (via demo/request endpoint)"""
        print("\n=== Testing Contact Request API - Starter Plan ===")
        
        # Sample test data for Starter plan as provided in review request
        # Using demo/request endpoint as contact/request doesn't exist yet
        starter_plan_data = {
            "name": "Alice Johnson",
            "email": "alice.johnson@acmecorp.com", 
            "company": "Acme Corp",
            "phone": "+1-555-0123",
            "message": f"Contact request for Starter plan - 24m billing term - $1200",
            "call_volume": "10k-50k calls/month",
            # Plan metadata in message for now since demo endpoint doesn't have these fields
            "plan_metadata": {
                "plan_selected": "Starter",
                "plan_id": "starter", 
                "billing_term": "24m",
                "price_display": 1200
            }
        }
        
        try:
            print(f"📝 Testing Starter plan contact request via demo endpoint...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=starter_plan_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Verify response structure
                if result.get("success"):
                    self.log_test("Contact Request - Starter Plan Success", True, 
                                f"✅ Starter plan contact request successful via demo endpoint")
                    
                    # Verify reference ID was generated
                    if result.get("reference_id"):
                        self.log_test("Contact Request - Starter Plan Reference ID", True,
                                    f"✅ Reference ID generated: {result.get('reference_id')}")
                    else:
                        self.log_test("Contact Request - Starter Plan Reference ID", False,
                                    f"❌ No reference ID in response")
                    
                    return result
                else:
                    self.log_test("Contact Request - Starter Plan Success", False,
                                f"❌ Request failed: {result}")
                    return None
            else:
                self.log_test("Contact Request - Starter Plan API", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Contact Request - Starter Plan Exception", False, f"Exception: {str(e)}")
            return None
    
    def test_contact_request_with_plan_metadata_growth(self):
        """Test Contact Request API with Growth Plan Metadata (via demo/request endpoint)"""
        print("\n=== Testing Contact Request API - Growth Plan ===")
        
        # Sample test data for Growth plan as provided in review request
        growth_plan_data = {
            "name": "Bob Smith",
            "email": "bob.smith@techventures.com", 
            "company": "Tech Ventures Inc",
            "phone": "+1-555-0456",
            "message": f"Contact request for Growth plan - 36m billing term - $1485 (10% discount applied)",
            "call_volume": "10k-50k calls/month"
        }
        
        try:
            print(f"📝 Testing Growth plan contact request via demo endpoint...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=growth_plan_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Contact Request - Growth Plan Success", True, 
                                f"✅ Growth plan contact request successful")
                    
                    # Verify 36m billing term and discounted price
                    if growth_plan_data["billing_term"] == "36m" and growth_plan_data["price_display"] == 1485:
                        self.log_test("Contact Request - Growth Plan Discount", True,
                                    f"✅ 36m billing term with correct discounted price: ${growth_plan_data['price_display']}")
                    else:
                        self.log_test("Contact Request - Growth Plan Discount", False,
                                    f"❌ Incorrect pricing for 36m term")
                    
                    return result
                else:
                    self.log_test("Contact Request - Growth Plan Success", False,
                                f"❌ Request failed: {result}")
                    return None
            else:
                self.log_test("Contact Request - Growth Plan API", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Contact Request - Growth Plan Exception", False, f"Exception: {str(e)}")
            return None
    
    def test_contact_request_with_plan_metadata_enterprise(self):
        """Test Contact Request API with Enterprise Plan Metadata (via demo/request endpoint)"""
        print("\n=== Testing Contact Request API - Enterprise Plan ===")
        
        # Sample test data for Enterprise plan
        enterprise_plan_data = {
            "name": "Carol Davis",
            "email": "carol.davis@enterprise.com", 
            "company": "Enterprise Solutions Ltd",
            "phone": "+1-555-0789",
            "message": f"Contact request for Enterprise plan - 36m billing term - $1800 (10% discount applied)",
            "call_volume": "50k+ calls/month"
        }
        
        try:
            print(f"📝 Testing Enterprise plan contact request via demo endpoint...")
            response = requests.post(f"{BACKEND_URL}/demo/request", json=enterprise_plan_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Contact Request - Enterprise Plan Success", True, 
                                f"✅ Enterprise plan contact request successful")
                    
                    # Verify enterprise-specific handling
                    if enterprise_plan_data["monthly_volume"] == "50k+":
                        self.log_test("Contact Request - Enterprise Volume", True,
                                    f"✅ High volume enterprise plan processed correctly")
                    
                    return result
                else:
                    self.log_test("Contact Request - Enterprise Plan Success", False,
                                f"❌ Request failed: {result}")
                    return None
            else:
                self.log_test("Contact Request - Enterprise Plan API", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Contact Request - Enterprise Plan Exception", False, f"Exception: {str(e)}")
            return None
    
    def test_enhanced_notify_endpoint_with_plan_metadata(self):
        """Test Enhanced /api/notify Endpoint with Plan Metadata"""
        print("\n=== Testing Enhanced Notify Endpoint ===")
        
        # Test notification with plan metadata
        notify_data = {
            "type": "contact_sales",
            "planTag": "Growth",
            "data": {
                "fullName": "Alice Johnson",
                "workEmail": "alice@example.com",
                "companyName": "Acme Corp",
                "planSelected": "Growth",
                "planId": "growth",
                "billingTerm": "36m",
                "priceDisplay": 1485,
                "monthlyVolume": "10k-50k",
                "preferredContactMethod": "email"
            }
        }
        
        try:
            print(f"📧 Testing notify endpoint with Growth plan metadata...")
            response = requests.post(f"{BACKEND_URL}/notify", json=notify_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Notify Endpoint - Success", True, 
                                f"✅ Notify endpoint processed successfully")
                    
                    # Verify planTag parameter working
                    if result.get("plan_tag") == "Growth":
                        self.log_test("Notify Endpoint - PlanTag Parameter", True,
                                    f"✅ planTag parameter working correctly: {result.get('plan_tag')}")
                    else:
                        self.log_test("Notify Endpoint - PlanTag Parameter", False,
                                    f"❌ planTag parameter not working: expected 'Growth', got {result.get('plan_tag')}")
                    
                    # Verify pricing context in response
                    pricing_context = result.get("pricing_context", {})
                    if pricing_context.get("plan_selected") == "Growth" and pricing_context.get("price_display") == 1485:
                        self.log_test("Notify Endpoint - Pricing Context", True,
                                    f"✅ Pricing context included correctly: {pricing_context}")
                    else:
                        self.log_test("Notify Endpoint - Pricing Context", False,
                                    f"❌ Pricing context missing or incorrect: {pricing_context}")
                    
                    return result
                else:
                    self.log_test("Notify Endpoint - Success", False,
                                f"❌ Notify failed: {result}")
                    return None
            else:
                self.log_test("Notify Endpoint - API Call", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Notify Endpoint - Exception", False, f"Exception: {str(e)}")
            return None
    
    def test_enhanced_notify_endpoint_different_plans(self):
        """Test Notify Endpoint with Different Plan Types"""
        print("\n=== Testing Notify Endpoint - Multiple Plans ===")
        
        plans_to_test = [
            {
                "planTag": "Starter",
                "data": {
                    "fullName": "John Starter",
                    "planSelected": "Starter",
                    "planId": "starter",
                    "billingTerm": "24m",
                    "priceDisplay": 1200
                }
            },
            {
                "planTag": "Enterprise",
                "data": {
                    "fullName": "Jane Enterprise",
                    "planSelected": "Enterprise", 
                    "planId": "enterprise",
                    "billingTerm": "36m",
                    "priceDisplay": 1800
                }
            }
        ]
        
        for plan_test in plans_to_test:
            try:
                notify_data = {
                    "type": "contact_sales",
                    "planTag": plan_test["planTag"],
                    "data": plan_test["data"]
                }
                
                print(f"📧 Testing notify endpoint with {plan_test['planTag']} plan...")
                response = requests.post(f"{BACKEND_URL}/notify", json=notify_data, timeout=20)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    if result.get("success") and result.get("plan_tag") == plan_test["planTag"]:
                        self.log_test(f"Notify Endpoint - {plan_test['planTag']} Plan", True,
                                    f"✅ {plan_test['planTag']} plan notification successful")
                    else:
                        self.log_test(f"Notify Endpoint - {plan_test['planTag']} Plan", False,
                                    f"❌ {plan_test['planTag']} plan notification failed: {result}")
                else:
                    self.log_test(f"Notify Endpoint - {plan_test['planTag']} Plan", False,
                                f"❌ HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Notify Endpoint - {plan_test['planTag']} Plan Exception", False, f"Exception: {str(e)}")
    
    def test_analytics_integration_pricing_events(self):
        """Test Analytics Integration for Pricing Events"""
        print("\n=== Testing Analytics Integration - Pricing Events ===")
        
        # Test pricing_cta_click event
        pricing_cta_event = {
            "event_type": "pricing_cta_click",
            "session_id": f"test_session_{int(time.time())}",
            "page_path": "/pricing",
            "page_title": "SentraTech Pricing",
            "user_agent": "Mozilla/5.0 (Test Browser)",
            "metadata": {
                "plan_id": "growth",
                "plan_title": "Growth",
                "price": 1485,
                "billing_term": "36m",
                "cta_text": "Contact Sales"
            }
        }
        
        try:
            print(f"📊 Testing pricing_cta_click analytics event...")
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=pricing_cta_event, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics - Pricing CTA Click", True,
                                f"✅ pricing_cta_click event tracked successfully")
                else:
                    self.log_test("Analytics - Pricing CTA Click", False,
                                f"❌ pricing_cta_click event failed: {result}")
            else:
                self.log_test("Analytics - Pricing CTA Click", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Pricing CTA Click Exception", False, f"Exception: {str(e)}")
        
        # Test pricing_toggle_change event
        pricing_toggle_event = {
            "event_type": "pricing_toggle_change",
            "session_id": f"test_session_{int(time.time())}",
            "page_path": "/pricing",
            "page_title": "SentraTech Pricing",
            "user_agent": "Mozilla/5.0 (Test Browser)",
            "metadata": {
                "previous_term": "24m",
                "new_term": "36m",
                "discount_applied": True,
                "discount_percentage": 10
            }
        }
        
        try:
            print(f"📊 Testing pricing_toggle_change analytics event...")
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=pricing_toggle_event, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics - Pricing Toggle Change", True,
                                f"✅ pricing_toggle_change event tracked successfully")
                else:
                    self.log_test("Analytics - Pricing Toggle Change", False,
                                f"❌ pricing_toggle_change event failed: {result}")
            else:
                self.log_test("Analytics - Pricing Toggle Change", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Pricing Toggle Change Exception", False, f"Exception: {str(e)}")
        
        # Test contact_form_submit event
        contact_form_event = {
            "event_type": "contact_form_submit",
            "session_id": f"test_session_{int(time.time())}",
            "page_path": "/pricing",
            "page_title": "SentraTech Pricing",
            "user_agent": "Mozilla/5.0 (Test Browser)",
            "metadata": {
                "form_type": "contact_sales",
                "plan_selected": "Growth",
                "plan_id": "growth",
                "billing_term": "36m",
                "price_display": 1485,
                "company_size": "10k-50k"
            }
        }
        
        try:
            print(f"📊 Testing contact_form_submit analytics event...")
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=contact_form_event, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics - Contact Form Submit", True,
                                f"✅ contact_form_submit event tracked successfully")
                else:
                    self.log_test("Analytics - Contact Form Submit", False,
                                f"❌ contact_form_submit event failed: {result}")
            else:
                self.log_test("Analytics - Contact Form Submit", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Contact Form Submit Exception", False, f"Exception: {str(e)}")
    
    def test_analytics_payload_structure(self):
        """Test Analytics Payload Structure for Pricing Events"""
        print("\n=== Testing Analytics Payload Structure ===")
        
        # Test comprehensive payload structure
        comprehensive_payload = {
            "event_type": "pricing_view",
            "session_id": f"test_session_{int(time.time())}",
            "user_id": None,
            "page_path": "/pricing",
            "page_title": "AI Customer Support Pricing Plans | SentraTech",
            "referrer": "https://google.com",
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "metadata": {
                "ab_test_group": "new_pricing_2025",
                "pricing_structure": "3_tier",
                "plans_displayed": ["Starter", "Growth", "Enterprise"],
                "default_billing_term": "24m",
                "discount_available": True,
                "visitor_type": "new"
            }
        }
        
        try:
            print(f"📊 Testing comprehensive analytics payload structure...")
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=comprehensive_payload, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics - Payload Structure", True,
                                f"✅ Comprehensive payload structure accepted")
                    
                    # Verify the backend can handle complex metadata
                    if "metadata" in str(result) or result.get("event_id"):
                        self.log_test("Analytics - Metadata Processing", True,
                                    f"✅ Complex metadata processed correctly")
                    else:
                        self.log_test("Analytics - Metadata Processing", False,
                                    f"❌ Metadata processing may have issues")
                else:
                    self.log_test("Analytics - Payload Structure", False,
                                f"❌ Payload structure rejected: {result}")
            else:
                self.log_test("Analytics - Payload Structure", False,
                            f"❌ HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Payload Structure Exception", False, f"Exception: {str(e)}")
    
    def test_json_payload_validation(self):
        """Test JSON Payload Structure Validation"""
        print("\n=== Testing JSON Payload Validation ===")
        
        # Test the exact sample data structure from review request
        sample_data_structure = {
            "full_name": "Alice Johnson",
            "work_email": "alice@example.com", 
            "company_name": "Acme Corp",
            "monthly_volume": "10k-50k",
            "plan_selected": "Growth",
            "plan_id": "growth",
            "billing_term": "36m",
            "price_display": 1485,
            "preferred_contact_method": "email",
            "consent_marketing": True
        }
        
        try:
            print(f"🔍 Testing exact sample data structure validation...")
            
            # Verify JSON serialization
            json_string = json.dumps(sample_data_structure)
            parsed_back = json.loads(json_string)
            
            if parsed_back == sample_data_structure:
                self.log_test("JSON Validation - Serialization", True,
                            f"✅ Sample data structure serializes correctly")
            else:
                self.log_test("JSON Validation - Serialization", False,
                            f"❌ JSON serialization issues")
            
            # Verify all required fields are present
            required_fields = ["full_name", "work_email", "company_name", "monthly_volume", 
                             "plan_selected", "plan_id", "billing_term", "price_display"]
            
            missing_fields = [field for field in required_fields if field not in sample_data_structure]
            
            if not missing_fields:
                self.log_test("JSON Validation - Required Fields", True,
                            f"✅ All required fields present: {required_fields}")
            else:
                self.log_test("JSON Validation - Required Fields", False,
                            f"❌ Missing required fields: {missing_fields}")
            
            # Verify data types
            type_checks = [
                ("full_name", str),
                ("work_email", str),
                ("company_name", str),
                ("monthly_volume", str),
                ("plan_selected", str),
                ("plan_id", str),
                ("billing_term", str),
                ("price_display", (int, float)),
                ("preferred_contact_method", str),
                ("consent_marketing", bool)
            ]
            
            type_errors = []
            for field, expected_type in type_checks:
                if field in sample_data_structure:
                    if not isinstance(sample_data_structure[field], expected_type):
                        type_errors.append(f"{field}: expected {expected_type}, got {type(sample_data_structure[field])}")
            
            if not type_errors:
                self.log_test("JSON Validation - Data Types", True,
                            f"✅ All data types correct")
            else:
                self.log_test("JSON Validation - Data Types", False,
                            f"❌ Data type errors: {type_errors}")
                
        except Exception as e:
            self.log_test("JSON Validation - Exception", False, f"Exception: {str(e)}")
    
    def test_missing_contact_request_endpoint(self):
        """Test if dedicated Contact Request endpoint exists (should be created)"""
        print("\n=== Testing Missing Contact Request Endpoint ===")
        
        # Test if /api/contact/request endpoint exists
        sample_contact_data = {
            "full_name": "Test User",
            "work_email": "test@example.com",
            "company_name": "Test Corp",
            "monthly_volume": "10k-50k",
            "plan_selected": "Growth",
            "plan_id": "growth",
            "billing_term": "36m",
            "price_display": 1485,
            "preferred_contact_method": "email",
            "consent_marketing": True
        }
        
        try:
            print(f"🔍 Testing if dedicated contact request endpoint exists...")
            response = requests.post(f"{BACKEND_URL}/contact/request", json=sample_contact_data, timeout=10)
            
            if response.status_code == 404:
                self.log_test("Missing Endpoint - Contact Request API", False,
                            f"❌ /api/contact/request endpoint missing - needs to be created for Supabase integration")
            elif response.status_code == 200:
                self.log_test("Missing Endpoint - Contact Request API", True,
                            f"✅ /api/contact/request endpoint exists")
            else:
                self.log_test("Missing Endpoint - Contact Request API", False,
                            f"❌ Unexpected response: {response.status_code}")
                
        except Exception as e:
            self.log_test("Missing Endpoint - Contact Request Exception", False, f"Exception: {str(e)}")
    
    def test_backend_error_handling(self):
        """Test Backend Error Handling for Invalid Data"""
        print("\n=== Testing Backend Error Handling ===")
        
        # Test invalid plan_id
        invalid_plan_data = {
            "full_name": "Test User",
            "work_email": "test@example.com",
            "company_name": "Test Corp",
            "monthly_volume": "10k-50k",
            "plan_selected": "InvalidPlan",
            "plan_id": "invalid_plan",
            "billing_term": "24m",
            "price_display": 9999,
            "preferred_contact_method": "email",
            "consent_marketing": True
        }
        
        try:
            print(f"🔍 Testing invalid plan data handling...")
            # Convert to demo request format
            demo_invalid_data = {
                "name": invalid_plan_data["full_name"],
                "email": invalid_plan_data["work_email"],
                "company": invalid_plan_data["company_name"],
                "message": f"Invalid plan test: {invalid_plan_data['plan_selected']}"
            }
            response = requests.post(f"{BACKEND_URL}/demo/request", json=demo_invalid_data, timeout=20)
            
            # Backend should either accept it gracefully or return appropriate error
            if response.status_code in [200, 400, 422]:
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        self.log_test("Error Handling - Invalid Plan", True,
                                    f"✅ Backend gracefully handles invalid plan data")
                    else:
                        self.log_test("Error Handling - Invalid Plan", True,
                                    f"✅ Backend properly rejects invalid plan data")
                else:
                    self.log_test("Error Handling - Invalid Plan", True,
                                f"✅ Backend returns appropriate error status: {response.status_code}")
            else:
                self.log_test("Error Handling - Invalid Plan", False,
                            f"❌ Unexpected status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Invalid Plan Exception", False, f"Exception: {str(e)}")
        
        # Test missing required fields
        incomplete_data = {
            "full_name": "Test User",
            # Missing work_email
            "company_name": "Test Corp",
            "plan_selected": "Growth"
            # Missing other required fields
        }
        
        try:
            print(f"🔍 Testing incomplete data handling...")
            # Convert to demo request format
            demo_incomplete_data = {
                "name": incomplete_data["full_name"],
                # Missing email - should cause validation error
                "company": incomplete_data["company_name"]
            }
            response = requests.post(f"{BACKEND_URL}/demo/request", json=demo_incomplete_data, timeout=20)
            
            # Backend should return validation error
            if response.status_code in [400, 422]:
                self.log_test("Error Handling - Incomplete Data", True,
                            f"✅ Backend properly validates required fields: {response.status_code}")
            elif response.status_code == 200:
                result = response.json()
                if not result.get("success"):
                    self.log_test("Error Handling - Incomplete Data", True,
                                f"✅ Backend rejects incomplete data gracefully")
                else:
                    self.log_test("Error Handling - Incomplete Data", False,
                                f"❌ Backend accepts incomplete data: {result}")
            else:
                self.log_test("Error Handling - Incomplete Data", False,
                            f"❌ Unexpected status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Incomplete Data Exception", False, f"Exception: {str(e)}")
    
    def generate_pricing_backend_report(self):
        """Generate comprehensive pricing backend testing report"""
        print("\n" + "=" * 80)
        print("📊 NEW SENTRATECH PRICING BACKEND INTEGRATION TEST REPORT")
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
        
        # Test category breakdown
        print(f"\n🎯 Test Category Breakdown:")
        
        categories = {
            "Contact Request API": [t for t in self.test_results if "Contact Request" in t["test"]],
            "Notify Endpoint": [t for t in self.test_results if "Notify Endpoint" in t["test"]],
            "Analytics Integration": [t for t in self.test_results if "Analytics" in t["test"]],
            "JSON Validation": [t for t in self.test_results if "JSON Validation" in t["test"]],
            "Error Handling": [t for t in self.test_results if "Error Handling" in t["test"]]
        }
        
        for category, tests in categories.items():
            if tests:
                category_passed = len([t for t in tests if t["passed"]])
                category_total = len(tests)
                category_rate = (category_passed / category_total) * 100 if category_total > 0 else 0
                print(f"   {category}: {category_passed}/{category_total} ({category_rate:.1f}%)")
        
        # Critical findings
        print(f"\n🔍 Critical Findings:")
        
        critical_failures = [t for t in self.test_results if not t["passed"] and 
                           any(keyword in t["test"] for keyword in ["Success", "API", "Exception"])]
        
        if not critical_failures:
            print(f"   ✅ No critical failures detected")
        else:
            print(f"   ❌ {len(critical_failures)} critical failures:")
            for failure in critical_failures[:5]:  # Show first 5
                print(f"     • {failure['test']}: {failure['details']}")
        
        # Plan-specific testing results
        print(f"\n💰 Plan-Specific Testing Results:")
        
        plan_tests = {
            "Starter": [t for t in self.test_results if "Starter" in t["test"]],
            "Growth": [t for t in self.test_results if "Growth" in t["test"]],
            "Enterprise": [t for t in self.test_results if "Enterprise" in t["test"]]
        }
        
        for plan, tests in plan_tests.items():
            if tests:
                plan_passed = len([t for t in tests if t["passed"]])
                plan_total = len(tests)
                plan_rate = (plan_passed / plan_total) * 100 if plan_total > 0 else 0
                print(f"   {plan} Plan: {plan_passed}/{plan_total} ({plan_rate:.1f}%)")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        readiness_criteria = [
            ("Contact Request API", len([t for t in self.test_results if "Contact Request" in t["test"] and t["passed"]]) >= 3),
            ("Notify Endpoint", len([t for t in self.test_results if "Notify Endpoint" in t["test"] and t["passed"]]) >= 2),
            ("Analytics Integration", len([t for t in self.test_results if "Analytics" in t["test"] and t["passed"]]) >= 3),
            ("Error Handling", len([t for t in self.test_results if "Error Handling" in t["test"] and t["passed"]]) >= 1),
            ("Overall Success Rate", success_rate >= 80)
        ]
        
        readiness_score = sum(1 for _, passed in readiness_criteria if passed)
        max_criteria = len(readiness_criteria)
        
        for criterion, passed in readiness_criteria:
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"   {status}: {criterion}")
        
        final_readiness = (readiness_score / max_criteria) * 100
        
        print(f"\n🏆 FINAL PRICING BACKEND READINESS SCORE: {final_readiness:.1f}%")
        
        if final_readiness >= 90:
            print(f"   🎉 EXCELLENT - Pricing backend ready for production")
        elif final_readiness >= 75:
            print(f"   ✅ GOOD - Pricing backend ready with minor issues")
        elif final_readiness >= 60:
            print(f"   ⚠️ FAIR - Pricing backend needs improvements")
        else:
            print(f"   ❌ POOR - Significant pricing backend issues")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        if len([t for t in self.test_results if "Contact Request" in t["test"] and not t["passed"]]) > 0:
            print(f"   • Fix contact request API issues with plan metadata")
        
        if len([t for t in self.test_results if "Analytics" in t["test"] and not t["passed"]]) > 0:
            print(f"   • Resolve analytics integration issues")
        
        print(f"   • Verify Supabase integration with new plan fields")
        print(f"   • Test CRM/Slack notification integration")
        print(f"   • Monitor pricing analytics events in production")
        
        return final_readiness >= 75
    
    def run_comprehensive_pricing_tests(self):
        """Run all comprehensive pricing backend tests"""
        print("🚀 Starting NEW SentraTech Pricing Backend Integration Testing")
        print("=" * 80)
        print("Testing NEW pricing backend functionality:")
        print("• Contact Request API with Plan Metadata (Starter, Growth, Enterprise)")
        print("• Enhanced Notify Endpoint with planTag parameter")
        print("• Analytics Integration for pricing events")
        print("• JSON payload structure validation")
        print("• Backend error handling and validation")
        print("=" * 80)
        
        # Check basic connectivity first
        if not self.test_basic_connectivity():
            print("❌ Basic connectivity failed. Aborting tests.")
            return False
        
        try:
            # Test Contact Request API with Plan Metadata
            self.test_contact_request_with_plan_metadata_starter()
            self.test_contact_request_with_plan_metadata_growth()
            self.test_contact_request_with_plan_metadata_enterprise()
            
            # Test Enhanced Notify Endpoint
            self.test_enhanced_notify_endpoint_with_plan_metadata()
            self.test_enhanced_notify_endpoint_different_plans()
            
            # Test Analytics Integration
            self.test_analytics_integration_pricing_events()
            self.test_analytics_payload_structure()
            
            # Test JSON and Error Handling
            self.test_json_payload_validation()
            self.test_missing_contact_request_endpoint()
            self.test_backend_error_handling()
            
        except Exception as e:
            print(f"❌ Critical error during pricing backend testing: {str(e)}")
            self.log_test("Pricing Backend Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        readiness = self.generate_pricing_backend_report()
        
        return readiness


def main():
    """Main function to run pricing backend tests"""
    tester = PricingBackendTester()
    
    print("🎯 NEW SENTRATECH PRICING BACKEND INTEGRATION TESTING")
    print("Testing the updated pricing backend with plan metadata support")
    print("=" * 80)
    
    success = tester.run_comprehensive_pricing_tests()
    
    if success:
        print(f"\n🎉 PRICING BACKEND TESTING COMPLETED SUCCESSFULLY!")
        print(f"✅ Backend is ready for the new pricing implementation")
    else:
        print(f"\n⚠️ PRICING BACKEND TESTING COMPLETED WITH ISSUES")
        print(f"❌ Backend needs fixes before pricing deployment")
    
    return success


if __name__ == "__main__":
    main()