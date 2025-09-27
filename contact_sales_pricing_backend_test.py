#!/usr/bin/env python3
"""
Contact Sales Integration and Supabase Functionality Backend Testing
Tests the enhanced pricing cards backend integration including:
1. Contact Sales slide-in with plan metadata
2. Supabase integration for form submissions
3. Analytics events for pricing interactions
4. Plan metadata handling (planSelected, planId, billingTerm, priceDisplay)
5. Billing term toggles (24-month vs 36-month)
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://sentra-pricing-cards.preview.emergentagent.com/api"

class ContactSalesPricingBackendTester:
    """Comprehensive backend testing for Contact Sales and Pricing functionality"""
    
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
        print("\n=== Testing Basic API Connectivity ===")
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            if response.status_code == 200:
                health_data = response.json()
                self.log_test("Basic API Connectivity", True, 
                            f"Status: {response.status_code}, Health: {health_data.get('status', 'unknown')}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_contact_sales_notify_endpoint(self):
        """Test /api/notify endpoint for contact sales notifications with plan metadata"""
        print("\n=== Testing Contact Sales Notify Endpoint ===")
        
        # Test Case 1: Starter Plan Contact Sales Notification
        starter_notification = {
            "type": "contact_sales",
            "planTag": "Starter",
            "data": {
                "fullName": "John Smith",
                "workEmail": "john.smith@techcorp.com",
                "companyName": "TechCorp Solutions",
                "monthlyVolume": "<10k",
                "preferredContactMethod": "email",
                "planSelected": "Starter Plan",
                "planId": "starter",
                "billingTerm": "24m",
                "priceDisplay": "1200",
                "utm_data": {
                    "source": "pricing_page",
                    "medium": "cta_button",
                    "campaign": "starter_plan"
                }
            }
        }
        
        try:
            print("📧 Testing Starter Plan notification...")
            response = requests.post(f"{BACKEND_URL}/notify", json=starter_notification, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Verify response structure
                if (result.get("success") and 
                    result.get("plan_tag") == "Starter" and
                    result.get("pricing_context")):
                    
                    pricing_context = result.get("pricing_context", {})
                    expected_fields = ["plan_selected", "plan_id", "billing_term", "price_display", "monthly_volume"]
                    missing_fields = [field for field in expected_fields if field not in pricing_context]
                    
                    if not missing_fields:
                        self.log_test("Notify Endpoint - Starter Plan", True,
                                    f"✅ Starter plan notification processed with pricing context: {pricing_context}")
                    else:
                        self.log_test("Notify Endpoint - Starter Plan", False,
                                    f"Missing pricing context fields: {missing_fields}")
                else:
                    self.log_test("Notify Endpoint - Starter Plan", False,
                                f"Invalid response structure: {result}")
            else:
                self.log_test("Notify Endpoint - Starter Plan", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Notify Endpoint - Starter Plan", False, f"Exception: {str(e)}")
        
        # Test Case 2: Growth Plan with 36-month billing
        growth_notification = {
            "type": "contact_sales",
            "planTag": "Growth",
            "data": {
                "fullName": "Sarah Johnson",
                "workEmail": "sarah.johnson@growthcorp.com",
                "companyName": "Growth Corp",
                "monthlyVolume": "10k-50k",
                "preferredContactMethod": "phone",
                "planSelected": "Growth Plan",
                "planId": "growth",
                "billingTerm": "36m",
                "priceDisplay": "1485",  # 10% discount applied
                "utm_data": {
                    "source": "pricing_page",
                    "medium": "cta_button",
                    "campaign": "growth_plan_36m"
                }
            }
        }
        
        try:
            print("📧 Testing Growth Plan (36-month) notification...")
            response = requests.post(f"{BACKEND_URL}/notify", json=growth_notification, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if (result.get("success") and 
                    result.get("plan_tag") == "Growth"):
                    
                    pricing_context = result.get("pricing_context", {})
                    
                    # Verify 36-month billing term and discounted price
                    if (pricing_context.get("billing_term") == "36m" and
                        pricing_context.get("price_display") == "1485"):
                        self.log_test("Notify Endpoint - Growth Plan 36m", True,
                                    f"✅ Growth plan 36-month notification with discount: {pricing_context}")
                    else:
                        self.log_test("Notify Endpoint - Growth Plan 36m", False,
                                    f"Incorrect billing/pricing: {pricing_context}")
                else:
                    self.log_test("Notify Endpoint - Growth Plan 36m", False,
                                f"Invalid response: {result}")
            else:
                self.log_test("Notify Endpoint - Growth Plan 36m", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Notify Endpoint - Growth Plan 36m", False, f"Exception: {str(e)}")
        
        # Test Case 3: Enterprise Plan Contact Sales
        enterprise_notification = {
            "type": "contact_sales",
            "planTag": "Enterprise",
            "data": {
                "fullName": "Michael Chen",
                "workEmail": "michael.chen@enterprise.com",
                "companyName": "Enterprise Solutions Inc",
                "monthlyVolume": "50k+",
                "preferredContactMethod": "demo",
                "planSelected": "Enterprise Plan",
                "planId": "enterprise",
                "billingTerm": "24m",
                "priceDisplay": "2000",
                "utm_data": {
                    "source": "pricing_page",
                    "medium": "cta_button",
                    "campaign": "enterprise_plan"
                }
            }
        }
        
        try:
            print("📧 Testing Enterprise Plan notification...")
            response = requests.post(f"{BACKEND_URL}/notify", json=enterprise_notification, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if (result.get("success") and 
                    result.get("plan_tag") == "Enterprise"):
                    
                    pricing_context = result.get("pricing_context", {})
                    
                    # Verify enterprise plan details
                    if (pricing_context.get("plan_id") == "enterprise" and
                        pricing_context.get("monthly_volume") == "50k+"):
                        self.log_test("Notify Endpoint - Enterprise Plan", True,
                                    f"✅ Enterprise plan notification processed: {pricing_context}")
                    else:
                        self.log_test("Notify Endpoint - Enterprise Plan", False,
                                    f"Incorrect enterprise details: {pricing_context}")
                else:
                    self.log_test("Notify Endpoint - Enterprise Plan", False,
                                f"Invalid response: {result}")
            else:
                self.log_test("Notify Endpoint - Enterprise Plan", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Notify Endpoint - Enterprise Plan", False, f"Exception: {str(e)}")
    
    def test_analytics_pricing_events(self):
        """Test analytics endpoints for pricing interaction events"""
        print("\n=== Testing Analytics Pricing Events ===")
        
        # Test Case 1: Pricing CTA Click Event
        pricing_cta_event = {
            "event_type": "interaction",
            "session_id": f"test_session_{int(time.time())}",
            "page_path": "/pricing",
            "page_title": "SentraTech Pricing Plans",
            "event_name": "pricing_cta_click",
            "event_data": {
                "planId": "growth",
                "planTitle": "Growth",
                "price": 1650,
                "billingTerm": "24m",
                "ctaText": "Contact Sales",
                "planPosition": 2
            },
            "user_agent": "Mozilla/5.0 (Test Browser)",
            "referrer": "https://sentratech.com/features"
        }
        
        try:
            print("📊 Testing pricing CTA click analytics...")
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=pricing_cta_event, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics - Pricing CTA Click", True,
                                f"✅ Pricing CTA click event tracked: {result.get('event_id', 'N/A')}")
                else:
                    self.log_test("Analytics - Pricing CTA Click", False,
                                f"Event tracking failed: {result}")
            else:
                self.log_test("Analytics - Pricing CTA Click", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Pricing CTA Click", False, f"Exception: {str(e)}")
        
        # Test Case 2: Pricing Toggle Change Event (24m to 36m)
        pricing_toggle_event = {
            "event_type": "interaction",
            "session_id": f"test_session_{int(time.time())}",
            "page_path": "/pricing",
            "page_title": "SentraTech Pricing Plans",
            "event_name": "pricing_toggle_change",
            "event_data": {
                "previousTerm": "24m",
                "newTerm": "36m",
                "discountApplied": "10%",
                "affectedPlans": ["starter", "growth", "enterprise"],
                "priceChanges": {
                    "starter": {"from": 1200, "to": 1080},
                    "growth": {"from": 1650, "to": 1485},
                    "enterprise": {"from": 2000, "to": 1800}
                }
            },
            "user_agent": "Mozilla/5.0 (Test Browser)",
            "referrer": "https://sentratech.com/pricing"
        }
        
        try:
            print("📊 Testing pricing toggle change analytics...")
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=pricing_toggle_event, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics - Pricing Toggle Change", True,
                                f"✅ Pricing toggle event tracked: {result.get('event_id', 'N/A')}")
                else:
                    self.log_test("Analytics - Pricing Toggle Change", False,
                                f"Event tracking failed: {result}")
            else:
                self.log_test("Analytics - Pricing Toggle Change", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Pricing Toggle Change", False, f"Exception: {str(e)}")
        
        # Test Case 3: Contact Form Submit Event
        contact_form_event = {
            "event_type": "interaction",
            "session_id": f"test_session_{int(time.time())}",
            "page_path": "/pricing",
            "page_title": "SentraTech Pricing Plans",
            "event_name": "contact_form_submit",
            "event_data": {
                "planSelected": "Growth Plan",
                "planId": "growth",
                "billingTerm": "36m",
                "priceDisplay": "1485",
                "formFields": ["fullName", "workEmail", "companyName", "monthlyVolume"],
                "contactMethod": "email",
                "formCompletionTime": 45.2  # seconds
            },
            "user_agent": "Mozilla/5.0 (Test Browser)",
            "referrer": "https://sentratech.com/pricing"
        }
        
        try:
            print("📊 Testing contact form submit analytics...")
            response = requests.post(f"{BACKEND_URL}/analytics/track", json=contact_form_event, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success"):
                    self.log_test("Analytics - Contact Form Submit", True,
                                f"✅ Contact form submit event tracked: {result.get('event_id', 'N/A')}")
                else:
                    self.log_test("Analytics - Contact Form Submit", False,
                                f"Event tracking failed: {result}")
            else:
                self.log_test("Analytics - Contact Form Submit", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics - Contact Form Submit", False, f"Exception: {str(e)}")
    
    def test_plan_metadata_validation(self):
        """Test plan metadata validation and processing"""
        print("\n=== Testing Plan Metadata Validation ===")
        
        # Test Case 1: Valid plan metadata
        valid_metadata = {
            "type": "contact_sales",
            "planTag": "Growth",
            "data": {
                "fullName": "Test User",
                "workEmail": "test@example.com",
                "companyName": "Test Company",
                "planSelected": "Growth Plan",
                "planId": "growth",
                "billingTerm": "24m",
                "priceDisplay": "1650",
                "monthlyVolume": "10k-50k"
            }
        }
        
        try:
            print("🔍 Testing valid plan metadata...")
            response = requests.post(f"{BACKEND_URL}/notify", json=valid_metadata, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("success") and result.get("pricing_context"):
                    pricing_context = result["pricing_context"]
                    
                    # Verify all required metadata fields are present
                    required_fields = ["plan_selected", "plan_id", "billing_term", "price_display", "monthly_volume"]
                    present_fields = [field for field in required_fields if pricing_context.get(field)]
                    
                    if len(present_fields) == len(required_fields):
                        self.log_test("Plan Metadata - Valid Data", True,
                                    f"✅ All metadata fields present: {present_fields}")
                    else:
                        missing = [field for field in required_fields if field not in present_fields]
                        self.log_test("Plan Metadata - Valid Data", False,
                                    f"Missing metadata fields: {missing}")
                else:
                    self.log_test("Plan Metadata - Valid Data", False,
                                f"Invalid response structure: {result}")
            else:
                self.log_test("Plan Metadata - Valid Data", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Plan Metadata - Valid Data", False, f"Exception: {str(e)}")
        
        # Test Case 2: Invalid plan data (missing required fields)
        invalid_metadata = {
            "type": "contact_sales",
            "planTag": "Invalid",
            "data": {
                "fullName": "Test User",
                "workEmail": "test@example.com",
                # Missing required fields: planSelected, planId, etc.
            }
        }
        
        try:
            print("🔍 Testing invalid plan metadata...")
            response = requests.post(f"{BACKEND_URL}/notify", json=invalid_metadata, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                # Should still process but with missing metadata
                if result.get("success"):
                    pricing_context = result.get("pricing_context", {})
                    none_values = [field for field, value in pricing_context.items() if value is None]
                    
                    if len(none_values) > 0:
                        self.log_test("Plan Metadata - Invalid Data Handling", True,
                                    f"✅ Gracefully handled missing fields: {none_values}")
                    else:
                        self.log_test("Plan Metadata - Invalid Data Handling", False,
                                    f"Should have None values for missing fields")
                else:
                    self.log_test("Plan Metadata - Invalid Data Handling", False,
                                f"Should succeed with partial data: {result}")
            else:
                self.log_test("Plan Metadata - Invalid Data Handling", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Plan Metadata - Invalid Data Handling", False, f"Exception: {str(e)}")
    
    def test_billing_term_scenarios(self):
        """Test different billing term scenarios (24m vs 36m)"""
        print("\n=== Testing Billing Term Scenarios ===")
        
        # Test Case 1: 24-month billing terms
        plans_24m = [
            {"planId": "starter", "price": "1200", "planTag": "Starter"},
            {"planId": "growth", "price": "1650", "planTag": "Growth"},
            {"planId": "enterprise", "price": "2000", "planTag": "Enterprise"}
        ]
        
        for plan in plans_24m:
            notification_24m = {
                "type": "contact_sales",
                "planTag": plan["planTag"],
                "data": {
                    "fullName": f"Test User {plan['planTag']}",
                    "workEmail": f"test.{plan['planId']}@example.com",
                    "companyName": f"{plan['planTag']} Test Company",
                    "planSelected": f"{plan['planTag']} Plan",
                    "planId": plan["planId"],
                    "billingTerm": "24m",
                    "priceDisplay": plan["price"],
                    "monthlyVolume": "<10k"
                }
            }
            
            try:
                print(f"💰 Testing {plan['planTag']} plan 24-month billing...")
                response = requests.post(f"{BACKEND_URL}/notify", json=notification_24m, timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    if result.get("success"):
                        pricing_context = result.get("pricing_context", {})
                        
                        if (pricing_context.get("billing_term") == "24m" and
                            pricing_context.get("price_display") == plan["price"]):
                            self.log_test(f"Billing Terms - {plan['planTag']} 24m", True,
                                        f"✅ 24-month billing correct: ${plan['price']}")
                        else:
                            self.log_test(f"Billing Terms - {plan['planTag']} 24m", False,
                                        f"Incorrect 24m pricing: {pricing_context}")
                    else:
                        self.log_test(f"Billing Terms - {plan['planTag']} 24m", False,
                                    f"Request failed: {result}")
                else:
                    self.log_test(f"Billing Terms - {plan['planTag']} 24m", False,
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Billing Terms - {plan['planTag']} 24m", False, f"Exception: {str(e)}")
        
        # Test Case 2: 36-month billing terms (with 10% discount)
        plans_36m = [
            {"planId": "starter", "price": "1080", "planTag": "Starter"},  # 10% off 1200
            {"planId": "growth", "price": "1485", "planTag": "Growth"},    # 10% off 1650
            {"planId": "enterprise", "price": "1800", "planTag": "Enterprise"}  # 10% off 2000
        ]
        
        for plan in plans_36m:
            notification_36m = {
                "type": "contact_sales",
                "planTag": plan["planTag"],
                "data": {
                    "fullName": f"Test User {plan['planTag']} 36m",
                    "workEmail": f"test.{plan['planId']}.36m@example.com",
                    "companyName": f"{plan['planTag']} Test Company 36m",
                    "planSelected": f"{plan['planTag']} Plan",
                    "planId": plan["planId"],
                    "billingTerm": "36m",
                    "priceDisplay": plan["price"],
                    "monthlyVolume": "10k-50k"
                }
            }
            
            try:
                print(f"💰 Testing {plan['planTag']} plan 36-month billing (10% discount)...")
                response = requests.post(f"{BACKEND_URL}/notify", json=notification_36m, timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    if result.get("success"):
                        pricing_context = result.get("pricing_context", {})
                        
                        if (pricing_context.get("billing_term") == "36m" and
                            pricing_context.get("price_display") == plan["price"]):
                            self.log_test(f"Billing Terms - {plan['planTag']} 36m", True,
                                        f"✅ 36-month billing with discount: ${plan['price']}")
                        else:
                            self.log_test(f"Billing Terms - {plan['planTag']} 36m", False,
                                        f"Incorrect 36m pricing: {pricing_context}")
                    else:
                        self.log_test(f"Billing Terms - {plan['planTag']} 36m", False,
                                    f"Request failed: {result}")
                else:
                    self.log_test(f"Billing Terms - {plan['planTag']} 36m", False,
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Billing Terms - {plan['planTag']} 36m", False, f"Exception: {str(e)}")
    
    def test_error_handling_scenarios(self):
        """Test error handling for various edge cases"""
        print("\n=== Testing Error Handling Scenarios ===")
        
        # Test Case 1: Invalid notification type
        invalid_type = {
            "type": "invalid_type",
            "data": {"test": "data"}
        }
        
        try:
            print("🚨 Testing invalid notification type...")
            response = requests.post(f"{BACKEND_URL}/notify", json=invalid_type, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if not result.get("success") and "Unknown notification type" in result.get("message", ""):
                    self.log_test("Error Handling - Invalid Type", True,
                                f"✅ Correctly rejected invalid type: {result['message']}")
                else:
                    self.log_test("Error Handling - Invalid Type", False,
                                f"Should reject invalid type: {result}")
            else:
                self.log_test("Error Handling - Invalid Type", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Error Handling - Invalid Type", False, f"Exception: {str(e)}")
        
        # Test Case 2: Malformed JSON
        try:
            print("🚨 Testing malformed JSON...")
            response = requests.post(f"{BACKEND_URL}/notify", 
                                   data="invalid json", 
                                   headers={"Content-Type": "application/json"},
                                   timeout=15)
            
            if response.status_code >= 400:
                self.log_test("Error Handling - Malformed JSON", True,
                            f"✅ Correctly rejected malformed JSON: HTTP {response.status_code}")
            else:
                self.log_test("Error Handling - Malformed JSON", False,
                            f"Should reject malformed JSON: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Malformed JSON", False, f"Exception: {str(e)}")
        
        # Test Case 3: Missing required data
        missing_data = {
            "type": "contact_sales"
            # Missing 'data' field
        }
        
        try:
            print("🚨 Testing missing required data...")
            response = requests.post(f"{BACKEND_URL}/notify", json=missing_data, timeout=15)
            
            # Should handle gracefully, not crash
            if response.status_code in [200, 400, 422]:
                self.log_test("Error Handling - Missing Data", True,
                            f"✅ Gracefully handled missing data: HTTP {response.status_code}")
            else:
                self.log_test("Error Handling - Missing Data", False,
                            f"Unexpected error handling: HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Missing Data", False, f"Exception: {str(e)}")
    
    def test_analytics_stats_endpoint(self):
        """Test analytics statistics endpoint"""
        print("\n=== Testing Analytics Statistics Endpoint ===")
        
        try:
            print("📈 Testing analytics stats retrieval...")
            response = requests.get(f"{BACKEND_URL}/analytics/stats?timeframe=24h", timeout=15)
            
            if response.status_code == 200:
                stats = response.json()
                
                # Verify stats structure
                expected_fields = ["total_page_views", "total_interactions", "unique_sessions"]
                present_fields = [field for field in expected_fields if field in stats]
                
                if len(present_fields) >= 2:  # At least 2 fields should be present
                    self.log_test("Analytics Stats - Structure", True,
                                f"✅ Analytics stats structure valid: {present_fields}")
                else:
                    self.log_test("Analytics Stats - Structure", False,
                                f"Missing analytics fields: {expected_fields}")
                
                # Verify numeric values
                numeric_fields = [field for field in present_fields if isinstance(stats.get(field), (int, float))]
                if len(numeric_fields) >= 2:
                    self.log_test("Analytics Stats - Data Types", True,
                                f"✅ Numeric data types correct: {numeric_fields}")
                else:
                    self.log_test("Analytics Stats - Data Types", False,
                                f"Non-numeric values found in stats")
                    
            else:
                self.log_test("Analytics Stats - Endpoint", False,
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Analytics Stats - Endpoint", False, f"Exception: {str(e)}")
    
    def generate_comprehensive_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 80)
        print("📊 CONTACT SALES & PRICING BACKEND INTEGRATION TEST REPORT")
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
        
        # Category breakdown
        categories = {
            "Basic Connectivity": [t for t in self.test_results if "Connectivity" in t["test"]],
            "Notify Endpoint": [t for t in self.test_results if "Notify Endpoint" in t["test"]],
            "Analytics Events": [t for t in self.test_results if "Analytics" in t["test"]],
            "Plan Metadata": [t for t in self.test_results if "Plan Metadata" in t["test"]],
            "Billing Terms": [t for t in self.test_results if "Billing Terms" in t["test"]],
            "Error Handling": [t for t in self.test_results if "Error Handling" in t["test"]]
        }
        
        print(f"\n📋 Test Category Breakdown:")
        for category, tests in categories.items():
            if tests:
                category_passed = len([t for t in tests if t["passed"]])
                category_total = len(tests)
                category_rate = (category_passed / category_total) * 100 if category_total > 0 else 0
                print(f"   {category}: {category_passed}/{category_total} ({category_rate:.1f}%)")
        
        # Critical functionality assessment
        print(f"\n🎯 Critical Functionality Assessment:")
        
        # Contact Sales Integration
        notify_tests = [t for t in self.test_results if "Notify Endpoint" in t["test"]]
        notify_passed = len([t for t in notify_tests if t["passed"]])
        if notify_passed >= len(notify_tests) * 0.8:  # 80% threshold
            print(f"   ✅ Contact Sales Integration: PASS ({notify_passed}/{len(notify_tests)})")
        else:
            print(f"   ❌ Contact Sales Integration: FAIL ({notify_passed}/{len(notify_tests)})")
        
        # Analytics Integration
        analytics_tests = [t for t in self.test_results if "Analytics" in t["test"]]
        analytics_passed = len([t for t in analytics_tests if t["passed"]])
        if analytics_passed >= len(analytics_tests) * 0.8:
            print(f"   ✅ Analytics Integration: PASS ({analytics_passed}/{len(analytics_tests)})")
        else:
            print(f"   ❌ Analytics Integration: FAIL ({analytics_passed}/{len(analytics_tests)})")
        
        # Plan Metadata Handling
        metadata_tests = [t for t in self.test_results if "Plan Metadata" in t["test"] or "Billing Terms" in t["test"]]
        metadata_passed = len([t for t in metadata_tests if t["passed"]])
        if metadata_passed >= len(metadata_tests) * 0.8:
            print(f"   ✅ Plan Metadata Handling: PASS ({metadata_passed}/{len(metadata_tests)})")
        else:
            print(f"   ❌ Plan Metadata Handling: FAIL ({metadata_passed}/{len(metadata_tests)})")
        
        # Error Handling
        error_tests = [t for t in self.test_results if "Error Handling" in t["test"]]
        error_passed = len([t for t in error_tests if t["passed"]])
        if error_passed >= len(error_tests) * 0.7:  # Lower threshold for error handling
            print(f"   ✅ Error Handling: PASS ({error_passed}/{len(error_tests)})")
        else:
            print(f"   ❌ Error Handling: FAIL ({error_passed}/{len(error_tests)})")
        
        # Production readiness score
        readiness_score = success_rate
        
        print(f"\n🏆 PRODUCTION READINESS SCORE: {readiness_score:.1f}%")
        
        if readiness_score >= 90:
            print(f"   🎉 EXCELLENT - Contact Sales & Pricing backend ready for production")
        elif readiness_score >= 80:
            print(f"   ✅ GOOD - Ready with minor issues to address")
        elif readiness_score >= 70:
            print(f"   ⚠️ FAIR - Needs improvements before production")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        # Failed tests summary
        if self.failed_tests:
            print(f"\n❌ Failed Tests Summary:")
            for test_name in self.failed_tests:
                test_result = next((t for t in self.test_results if t["test"] == test_name), None)
                if test_result:
                    print(f"   • {test_name}: {test_result['details']}")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases before production deployment")
        
        if success_rate < 90:
            print(f"   • Improve error handling and edge case coverage")
            print(f"   • Verify all plan metadata fields are properly validated")
            print(f"   • Test billing term calculations thoroughly")
        
        print(f"   • Monitor analytics events in production for proper tracking")
        print(f"   • Set up alerts for contact sales notification failures")
        print(f"   • Implement comprehensive logging for debugging")
        
        return readiness_score >= 80
    
    def run_comprehensive_tests(self):
        """Run all comprehensive backend tests"""
        print("🚀 Starting Contact Sales & Pricing Backend Integration Testing")
        print("=" * 80)
        print("Testing enhanced pricing cards backend functionality:")
        print("• Contact Sales slide-in with plan metadata")
        print("• Supabase integration for form submissions")
        print("• Analytics events for pricing interactions")
        print("• Plan metadata handling (planSelected, planId, billingTerm, priceDisplay)")
        print("• Billing term toggles (24-month vs 36-month)")
        print("• Error handling and edge cases")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity
            if not self.test_basic_connectivity():
                print("❌ Basic connectivity failed - aborting remaining tests")
                return False
            
            # Core functionality tests
            self.test_contact_sales_notify_endpoint()
            self.test_analytics_pricing_events()
            self.test_plan_metadata_validation()
            self.test_billing_term_scenarios()
            
            # Error handling and edge cases
            self.test_error_handling_scenarios()
            self.test_analytics_stats_endpoint()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Backend Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        return self.generate_comprehensive_report()


def main():
    """Main test execution"""
    tester = ContactSalesPricingBackendTester()
    success = tester.run_comprehensive_tests()
    
    if success:
        print(f"\n🎉 Contact Sales & Pricing Backend Integration: READY FOR PRODUCTION")
        return 0
    else:
        print(f"\n⚠️ Contact Sales & Pricing Backend Integration: NEEDS ATTENTION")
        return 1


if __name__ == "__main__":
    exit(main())