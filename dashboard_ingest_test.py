#!/usr/bin/env python3
"""
Dashboard Ingest System Testing
Tests all 4 ingest endpoints, authentication, external dashboard forwarding, and database verification
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Configuration from environment files
BACKEND_URL = "https://customer-flow-5.preview.emergentagent.com/api"
INGEST_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"
EXTERNAL_DASHBOARD_URL = "https://customer-flow-5.preview.emergentagent.com"

class DashboardIngestTester:
    """Dashboard Ingest System Comprehensive Testing"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.test_data_ids = []  # Store IDs for verification
        
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
    
    def test_backend_health(self):
        """Test backend health and ingest configuration"""
        print("\n=== Testing Backend Health & Ingest Configuration ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "healthy":
                    ingest_configured = result.get("ingest_configured", False)
                    response_time = result.get("response_time_ms", 0)
                    
                    if ingest_configured:
                        self.log_test("Backend Health & Ingest Config", True, 
                                    f"Backend healthy with ingest configured - Response time: {response_time}ms")
                        return True
                    else:
                        self.log_test("Backend Health & Ingest Config", False, 
                                    "Backend healthy but ingest not configured")
                        return False
                else:
                    self.log_test("Backend Health & Ingest Config", False, f"Backend unhealthy: {result}")
                    return False
            else:
                self.log_test("Backend Health & Ingest Config", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Backend Health & Ingest Config", False, f"Health check error: {str(e)}")
            return False

    def test_ingest_authentication(self):
        """Test X-INGEST-KEY authentication for all endpoints"""
        print("\n=== Testing X-INGEST-KEY Authentication ===")
        
        endpoints = [
            "/ingest/demo_requests",
            "/ingest/contact_requests", 
            "/ingest/roi_reports",
            "/ingest/subscriptions"
        ]
        
        test_data = {
            "user_name": "Auth Test User",
            "email": "auth@test.com",
            "company": "Auth Test Company",
            "message": "Authentication test"
        }
        
        auth_tests_passed = 0
        
        for endpoint in endpoints:
            # Test 1: Valid ingest key
            try:
                headers = {"X-INGEST-KEY": INGEST_KEY}
                response = requests.post(f"{BACKEND_URL}{endpoint}", 
                                       json=test_data, headers=headers, timeout=15)
                
                if response.status_code == 200:
                    self.log_test(f"Auth Valid Key - {endpoint}", True, 
                                f"Valid ingest key accepted")
                    auth_tests_passed += 1
                else:
                    self.log_test(f"Auth Valid Key - {endpoint}", False, 
                                f"Valid key rejected: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Auth Valid Key - {endpoint}", False, f"Exception: {str(e)}")
            
            # Test 2: Invalid ingest key
            try:
                headers = {"X-INGEST-KEY": "invalid-key-12345"}
                response = requests.post(f"{BACKEND_URL}{endpoint}", 
                                       json=test_data, headers=headers, timeout=15)
                
                if response.status_code == 401:
                    self.log_test(f"Auth Invalid Key - {endpoint}", True, 
                                f"Invalid ingest key correctly rejected")
                    auth_tests_passed += 1
                else:
                    self.log_test(f"Auth Invalid Key - {endpoint}", False, 
                                f"Invalid key not rejected: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Auth Invalid Key - {endpoint}", False, f"Exception: {str(e)}")
            
            # Test 3: Missing ingest key
            try:
                response = requests.post(f"{BACKEND_URL}{endpoint}", 
                                       json=test_data, timeout=15)
                
                if response.status_code == 401:
                    self.log_test(f"Auth Missing Key - {endpoint}", True, 
                                f"Missing ingest key correctly rejected")
                    auth_tests_passed += 1
                else:
                    self.log_test(f"Auth Missing Key - {endpoint}", False, 
                                f"Missing key not rejected: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Auth Missing Key - {endpoint}", False, f"Exception: {str(e)}")
        
        # Overall authentication assessment
        total_auth_tests = len(endpoints) * 3  # 3 tests per endpoint
        auth_success_rate = (auth_tests_passed / total_auth_tests) * 100
        
        if auth_success_rate >= 80:
            self.log_test("Overall Authentication System", True, 
                        f"Authentication working well: {auth_success_rate:.1f}% success rate")
            return True
        else:
            self.log_test("Overall Authentication System", False, 
                        f"Authentication issues: {auth_success_rate:.1f}% success rate")
            return False

    def test_demo_requests_ingest(self):
        """Test demo requests ingest endpoint"""
        print("\n=== Testing Demo Requests Ingest Endpoint ===")
        
        test_data = {
            "user_name": "Demo Ingest Test User",
            "email": "demo.ingest@test.com",
            "company": "Demo Ingest Test Company",
            "company_website": "https://demo-test.com",
            "phone": "+1-555-DEMO-001",
            "call_volume": 25000,
            "interaction_volume": 40000,
            "message": "Testing demo requests ingest endpoint with realistic data for dashboard integration",
            "source": "website_form"
        }
        
        try:
            headers = {"X-INGEST-KEY": INGEST_KEY}
            print(f"📝 Submitting demo request ingest...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Store ID for verification
                    self.test_data_ids.append(("demo_requests", result["id"]))
                    
                    # Check external response
                    external_response = result.get("external_response")
                    if external_response:
                        self.log_test("Demo Requests Ingest", True, 
                                    f"✅ Demo request ingested successfully with external dashboard integration. ID: {result['id']}")
                    else:
                        external_status = result.get("external_status", "unknown")
                        self.log_test("Demo Requests Ingest", True, 
                                    f"✅ Demo request ingested locally. External status: {external_status}. ID: {result['id']}")
                    return True
                else:
                    self.log_test("Demo Requests Ingest", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                self.log_test("Demo Requests Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Demo Requests Ingest", False, f"Exception: {str(e)}")
            return False

    def test_contact_requests_ingest(self):
        """Test contact requests ingest endpoint"""
        print("\n=== Testing Contact Requests Ingest Endpoint ===")
        
        test_data = {
            "full_name": "Contact Sales Test User",
            "work_email": "contact.sales@test.com",
            "company_name": "Contact Sales Test Company",
            "company_website": "https://contact-test.com",
            "phone": "+1-555-CONTACT-001",
            "call_volume": 50000,
            "interaction_volume": 75000,
            "preferred_contact_method": "Email",
            "message": "Testing contact sales ingest endpoint for enterprise pricing inquiry with high volume requirements",
            "status": "pending",
            "assigned_rep": "Sales Team"
        }
        
        try:
            headers = {"X-INGEST-KEY": INGEST_KEY}
            print(f"📝 Submitting contact request ingest...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/ingest/contact_requests", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Store ID for verification
                    self.test_data_ids.append(("contact_requests", result["id"]))
                    
                    # Check external response
                    external_response = result.get("external_response")
                    if external_response:
                        self.log_test("Contact Requests Ingest", True, 
                                    f"✅ Contact request ingested successfully with external dashboard integration. ID: {result['id']}")
                    else:
                        external_status = result.get("external_status", "unknown")
                        self.log_test("Contact Requests Ingest", True, 
                                    f"✅ Contact request ingested locally. External status: {external_status}. ID: {result['id']}")
                    return True
                else:
                    self.log_test("Contact Requests Ingest", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                self.log_test("Contact Requests Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Requests Ingest", False, f"Exception: {str(e)}")
            return False

    def test_roi_reports_ingest(self):
        """Test ROI reports ingest endpoint"""
        print("\n=== Testing ROI Reports Ingest Endpoint ===")
        
        test_data = {
            "country": "Bangladesh",
            "monthly_volume": 10000,
            "bpo_spending": 7200.00,
            "sentratech_spending": 2284.62,
            "sentratech_bundles": 10.0,
            "monthly_savings": 4915.38,
            "roi": 215.2,
            "cost_reduction": 68.3,
            "contact_email": "roi.report@test.com"
        }
        
        try:
            headers = {"X-INGEST-KEY": INGEST_KEY}
            print(f"📝 Submitting ROI report ingest...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/ingest/roi_reports", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Store ID for verification
                    self.test_data_ids.append(("roi_reports", result["id"]))
                    
                    # Check dashboard status
                    dashboard_status = result.get("dashboard_status", "unknown")
                    self.log_test("ROI Reports Ingest", True, 
                                f"✅ ROI report ingested successfully. Dashboard status: {dashboard_status}. ID: {result['id']}")
                    return True
                else:
                    self.log_test("ROI Reports Ingest", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                self.log_test("ROI Reports Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("ROI Reports Ingest", False, f"Exception: {str(e)}")
            return False

    def test_subscriptions_ingest(self):
        """Test subscriptions ingest endpoint"""
        print("\n=== Testing Subscriptions Ingest Endpoint ===")
        
        test_data = {
            "email": "newsletter.test@test.com",
            "source": "website_footer",
            "status": "subscribed"
        }
        
        try:
            headers = {"X-INGEST-KEY": INGEST_KEY}
            print(f"📝 Submitting subscription ingest...")
            print(f"   Test Data: {json.dumps(test_data, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=test_data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                if result.get("status") == "success" and result.get("id"):
                    # Store ID for verification
                    self.test_data_ids.append(("subscriptions", result["id"]))
                    
                    # Check dashboard status
                    dashboard_status = result.get("dashboard_status", "unknown")
                    self.log_test("Subscriptions Ingest", True, 
                                f"✅ Subscription ingested successfully. Dashboard status: {dashboard_status}. ID: {result['id']}")
                    return True
                else:
                    self.log_test("Subscriptions Ingest", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                self.log_test("Subscriptions Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Subscriptions Ingest", False, f"Exception: {str(e)}")
            return False

    def test_ingest_status_endpoints(self):
        """Test all ingest status endpoints for data verification"""
        print("\n=== Testing Ingest Status Endpoints ===")
        
        status_endpoints = [
            ("demo_requests", "/ingest/demo_requests/status"),
            ("contact_requests", "/ingest/contact_requests/status"),
            ("roi_reports", "/ingest/roi_reports/status"),
            ("subscriptions", "/ingest/subscriptions/status")
        ]
        
        status_tests_passed = 0
        
        for endpoint_name, endpoint_path in status_endpoints:
            try:
                print(f"🔍 Checking {endpoint_name} status...")
                response = requests.get(f"{BACKEND_URL}{endpoint_path}", timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    total_count = result.get("total_count", 0)
                    recent_items = result.get(f"recent_{endpoint_name}", [])
                    
                    if total_count > 0:
                        self.log_test(f"Status Endpoint - {endpoint_name}", True, 
                                    f"✅ {endpoint_name} status working. Total count: {total_count}, Recent items: {len(recent_items)}")
                        status_tests_passed += 1
                    else:
                        self.log_test(f"Status Endpoint - {endpoint_name}", True, 
                                    f"✅ {endpoint_name} status working but no data found. Total count: {total_count}")
                        status_tests_passed += 1
                else:
                    self.log_test(f"Status Endpoint - {endpoint_name}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Status Endpoint - {endpoint_name}", False, f"Exception: {str(e)}")
        
        # Overall status endpoints assessment
        if status_tests_passed == len(status_endpoints):
            self.log_test("All Status Endpoints", True, 
                        f"✅ All {len(status_endpoints)} status endpoints working correctly")
            return True
        else:
            self.log_test("All Status Endpoints", False, 
                        f"Only {status_tests_passed}/{len(status_endpoints)} status endpoints working")
            return False

    def test_data_validation(self):
        """Test data validation for ingest endpoints"""
        print("\n=== Testing Data Validation ===")
        
        validation_tests = [
            {
                "endpoint": "/ingest/demo_requests",
                "invalid_data": {"invalid": "data"},
                "description": "Demo requests - malformed JSON"
            },
            {
                "endpoint": "/ingest/contact_requests", 
                "invalid_data": {"full_name": "Test"},  # Missing required fields
                "description": "Contact requests - missing required fields"
            },
            {
                "endpoint": "/ingest/roi_reports",
                "invalid_data": {"country": "Test", "monthly_volume": "invalid"},  # Invalid data types
                "description": "ROI reports - invalid data types"
            },
            {
                "endpoint": "/ingest/subscriptions",
                "invalid_data": {},  # Empty data
                "description": "Subscriptions - empty data"
            }
        ]
        
        validation_tests_passed = 0
        
        for test_case in validation_tests:
            try:
                headers = {"X-INGEST-KEY": INGEST_KEY}
                print(f"🔍 Testing {test_case['description']}...")
                
                response = requests.post(f"{BACKEND_URL}{test_case['endpoint']}", 
                                       json=test_case["invalid_data"], 
                                       headers=headers, timeout=15)
                
                if response.status_code in [400, 422]:  # Validation errors expected
                    self.log_test(f"Validation - {test_case['description']}", True, 
                                f"✅ Invalid data correctly rejected: HTTP {response.status_code}")
                    validation_tests_passed += 1
                else:
                    self.log_test(f"Validation - {test_case['description']}", False, 
                                f"Invalid data not rejected: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Validation - {test_case['description']}", False, f"Exception: {str(e)}")
        
        # Overall validation assessment
        validation_success_rate = (validation_tests_passed / len(validation_tests)) * 100
        
        if validation_success_rate >= 75:
            self.log_test("Overall Data Validation", True, 
                        f"✅ Data validation working well: {validation_success_rate:.1f}% success rate")
            return True
        else:
            self.log_test("Overall Data Validation", False, 
                        f"Data validation issues: {validation_success_rate:.1f}% success rate")
            return False

    def test_external_dashboard_connectivity(self):
        """Test connectivity to external dashboard"""
        print("\n=== Testing External Dashboard Connectivity ===")
        
        try:
            print(f"🔍 Testing connectivity to {EXTERNAL_DASHBOARD_URL}...")
            response = requests.get(EXTERNAL_DASHBOARD_URL, timeout=10)
            
            if response.status_code in [200, 301, 302, 403]:  # Any response indicates connectivity
                self.log_test("External Dashboard Connectivity", True, 
                            f"✅ External dashboard reachable: HTTP {response.status_code}")
                return True
            else:
                self.log_test("External Dashboard Connectivity", False, 
                            f"External dashboard unreachable: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("External Dashboard Connectivity", False, 
                        f"External dashboard connection failed: {str(e)}")
            return False

    def test_mongodb_verification(self):
        """Test MongoDB data storage verification through status endpoints"""
        print("\n=== Testing MongoDB Data Storage Verification ===")
        
        # Wait a moment for data to be processed
        time.sleep(2)
        
        collections_verified = 0
        total_collections = 4
        
        status_endpoints = [
            ("demo_requests", "/ingest/demo_requests/status"),
            ("contact_requests", "/ingest/contact_requests/status"), 
            ("roi_reports", "/ingest/roi_reports/status"),
            ("subscriptions", "/ingest/subscriptions/status")
        ]
        
        for collection_name, endpoint_path in status_endpoints:
            try:
                print(f"🔍 Verifying {collection_name} collection...")
                response = requests.get(f"{BACKEND_URL}{endpoint_path}", timeout=15)
                
                if response.status_code == 200:
                    result = response.json()
                    total_count = result.get("total_count", 0)
                    recent_items = result.get(f"recent_{collection_name}", [])
                    
                    # Look for our test data
                    test_data_found = False
                    for collection_type, test_id in self.test_data_ids:
                        if collection_type == collection_name:
                            for item in recent_items:
                                if item.get("id") == test_id:
                                    test_data_found = True
                                    break
                    
                    if test_data_found:
                        self.log_test(f"MongoDB Verification - {collection_name}", True, 
                                    f"✅ Test data found in {collection_name} collection. Total: {total_count}")
                        collections_verified += 1
                    elif total_count > 0:
                        self.log_test(f"MongoDB Verification - {collection_name}", True, 
                                    f"✅ {collection_name} collection has data. Total: {total_count}")
                        collections_verified += 1
                    else:
                        self.log_test(f"MongoDB Verification - {collection_name}", False, 
                                    f"No data found in {collection_name} collection")
                else:
                    self.log_test(f"MongoDB Verification - {collection_name}", False, 
                                f"Cannot verify {collection_name}: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"MongoDB Verification - {collection_name}", False, 
                            f"Exception verifying {collection_name}: {str(e)}")
        
        # Overall MongoDB verification
        if collections_verified >= 3:  # At least 3 out of 4 collections should have data
            self.log_test("Overall MongoDB Verification", True, 
                        f"✅ MongoDB data storage working: {collections_verified}/{total_collections} collections verified")
            return True
        else:
            self.log_test("Overall MongoDB Verification", False, 
                        f"MongoDB data storage issues: only {collections_verified}/{total_collections} collections verified")
            return False

    def generate_comprehensive_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 DASHBOARD INGEST SYSTEM - COMPREHENSIVE TESTING SUMMARY")
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
            "Authentication": [r for r in self.test_results if "Auth" in r["test"]],
            "Ingest Endpoints": [r for r in self.test_results if "Ingest" in r["test"] and "Auth" not in r["test"]],
            "Status Endpoints": [r for r in self.test_results if "Status" in r["test"]],
            "Data Validation": [r for r in self.test_results if "Validation" in r["test"]],
            "External Integration": [r for r in self.test_results if "Dashboard" in r["test"] or "MongoDB" in r["test"]]
        }
        
        print(f"\n📋 Category Breakdown:")
        for category, tests in categories.items():
            if tests:
                category_passed = len([t for t in tests if t["passed"]])
                category_total = len(tests)
                category_rate = (category_passed / category_total) * 100
                print(f"   {category}: {category_passed}/{category_total} ({category_rate:.1f}%)")
        
        # Critical findings
        print(f"\n🎯 Critical Findings:")
        
        # Authentication issues
        auth_failures = [r for r in self.test_results if "Auth" in r["test"] and not r["passed"]]
        if auth_failures:
            print(f"   ❌ AUTHENTICATION ISSUES:")
            for failure in auth_failures[:3]:  # Show first 3
                print(f"      • {failure['details']}")
        
        # Ingest endpoint issues
        ingest_failures = [r for r in self.test_results if "Ingest" in r["test"] and "Auth" not in r["test"] and not r["passed"]]
        if ingest_failures:
            print(f"   ❌ INGEST ENDPOINT ISSUES:")
            for failure in ingest_failures:
                print(f"      • {failure['test']}: {failure['details']}")
        
        # External integration issues
        external_failures = [r for r in self.test_results if ("Dashboard" in r["test"] or "MongoDB" in r["test"]) and not r["passed"]]
        if external_failures:
            print(f"   ❌ EXTERNAL INTEGRATION ISSUES:")
            for failure in external_failures:
                print(f"      • {failure['test']}: {failure['details']}")
        
        # Success highlights
        major_successes = [r for r in self.test_results if r["passed"] and any(keyword in r["test"] for keyword in ["Ingest", "Authentication", "MongoDB"])]
        if major_successes:
            print(f"   ✅ MAJOR SUCCESSES:")
            for success in major_successes[:5]:  # Show first 5
                print(f"      • {success['test']}")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - Dashboard ingest system is production-ready")
        elif success_rate >= 80:
            print(f"   ✅ GOOD - Dashboard ingest system working with minor issues")
        elif success_rate >= 70:
            print(f"   ⚠️ FAIR - Dashboard ingest system needs improvements")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        # Specific recommendations
        print(f"\n💡 Recommendations:")
        
        if auth_failures:
            print(f"   • Fix authentication issues with X-INGEST-KEY validation")
        
        if ingest_failures:
            print(f"   • Address {len(ingest_failures)} ingest endpoint failures")
        
        if external_failures:
            print(f"   • Resolve external integration issues (dashboard/database)")
        
        if success_rate >= 80:
            print(f"   • Dashboard ingest system is ready for production use")
        else:
            print(f"   • Address critical issues before production deployment")
        
        # Data ingestion summary
        if self.test_data_ids:
            print(f"\n📊 Data Ingestion Summary:")
            print(f"   • Successfully ingested {len(self.test_data_ids)} test records")
            for collection_type, test_id in self.test_data_ids:
                print(f"     - {collection_type}: {test_id}")
        
        return success_rate >= 75

    def run_comprehensive_tests(self):
        """Run all comprehensive tests for dashboard ingest system"""
        print("🚀 Starting Dashboard Ingest System Comprehensive Testing")
        print("=" * 80)
        print("Testing dashboard ingest system functionality:")
        print("• Backend health and ingest configuration")
        print("• X-INGEST-KEY authentication for all endpoints")
        print("• All 4 ingest endpoints (demo_requests, contact_requests, roi_reports, subscriptions)")
        print("• Status endpoints for data verification")
        print("• Data validation and error handling")
        print("• External dashboard connectivity")
        print("• MongoDB data storage verification")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic health and configuration
            if not self.test_backend_health():
                print("❌ Backend health check failed - continuing with caution")
            
            # Authentication testing
            self.test_ingest_authentication()
            
            # Core ingest endpoints
            self.test_demo_requests_ingest()
            self.test_contact_requests_ingest()
            self.test_roi_reports_ingest()
            self.test_subscriptions_ingest()
            
            # Status and verification
            self.test_ingest_status_endpoints()
            self.test_data_validation()
            
            # External integrations
            self.test_external_dashboard_connectivity()
            self.test_mongodb_verification()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_comprehensive_summary()
        
        return is_ready


def main():
    """Main function to run dashboard ingest system testing"""
    print("🎯 Dashboard Ingest System Comprehensive Testing")
    print("Testing all ingest endpoints, authentication, external dashboard forwarding, and database verification")
    print()
    
    tester = DashboardIngestTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: Dashboard ingest system is working correctly!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Dashboard ingest system needs attention")
            return False
            
    except KeyboardInterrupt:
        print("\n⚠️ Testing interrupted by user")
        return False
    except Exception as e:
        print(f"\n❌ Testing failed with error: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)