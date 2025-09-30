#!/usr/bin/env python3
"""
Comprehensive Backend Health and Performance Testing
Tests all backend API endpoints after UI enhancements to ensure no performance degradation
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://dashboard-bridge-2.preview.emergentagent.com/api"

# Test authentication key
INGEST_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"

class ComprehensiveBackendHealthTester:
    """Comprehensive Backend Health and Performance Testing"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.performance_metrics = {}
        
    def log_test(self, test_name: str, passed: bool, details: str = "", performance_ms: float = None):
        """Log test results with performance metrics"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "performance_ms": performance_ms
        }
        self.test_results.append(result)
        
        if performance_ms:
            self.performance_metrics[test_name] = performance_ms
        
        if passed:
            self.passed_tests.append(test_name)
            perf_info = f" ({performance_ms:.2f}ms)" if performance_ms else ""
            print(f"✅ PASS: {test_name}{perf_info}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details and passed:
            print(f"   Details: {details}")
    
    def test_backend_connectivity(self):
        """Test basic backend connectivity"""
        print("\n=== Testing Backend Connectivity ===")
        
        start_time = time.time()
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Hello World":
                    self.log_test("Backend Connectivity", True, 
                                f"Backend responding correctly: {result}", response_time)
                    return True
                else:
                    self.log_test("Backend Connectivity", False, 
                                f"Unexpected response: {result}", response_time)
                    return False
            else:
                self.log_test("Backend Connectivity", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Backend Connectivity", False, f"Connection error: {str(e)}", response_time)
            return False
    
    def test_health_check(self):
        """Test backend health check with detailed metrics"""
        print("\n=== Testing Backend Health Check ===")
        
        start_time = time.time()
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "healthy":
                    backend_response_time = result.get("response_time_ms", 0)
                    database_status = result.get("database", "unknown")
                    ingest_configured = result.get("ingest_configured", False)
                    
                    self.log_test("Backend Health Check", True, 
                                f"Backend healthy - DB: {database_status}, Ingest: {ingest_configured}, Backend RT: {backend_response_time}ms", 
                                response_time)
                    return True
                else:
                    self.log_test("Backend Health Check", False, f"Backend unhealthy: {result}", response_time)
                    return False
            else:
                self.log_test("Backend Health Check", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Backend Health Check", False, f"Health check error: {str(e)}", response_time)
            return False
    
    def test_config_validation(self):
        """Test dashboard configuration validation"""
        print("\n=== Testing Dashboard Configuration Validation ===")
        
        start_time = time.time()
        try:
            response = requests.get(f"{BACKEND_URL}/config/validate", timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success" and result.get("config_valid"):
                    email_configured = result.get("email_service_configured", False)
                    calendar_configured = result.get("calendar_service_configured", False)
                    
                    self.log_test("Dashboard Config Validation", True, 
                                f"Config valid - Email: {email_configured}, Calendar: {calendar_configured}", 
                                response_time)
                    return True
                else:
                    self.log_test("Dashboard Config Validation", False, 
                                f"Config invalid: {result}", response_time)
                    return False
            else:
                self.log_test("Dashboard Config Validation", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Dashboard Config Validation", False, f"Config validation error: {str(e)}", response_time)
            return False
    
    def test_demo_request_ingest(self):
        """Test demo request ingest endpoint"""
        print("\n=== Testing Demo Request Ingest Endpoint ===")
        
        test_data = {
            "user_name": "Backend Test User",
            "email": "backendtest@sentratech.net",
            "company": "Backend Test Company",
            "company_website": "https://backendtest.com",
            "phone": "+1234567890",
            "call_volume": 25000,
            "interaction_volume": 40000,
            "message": "Testing backend health after UI enhancements",
            "source": "backend_health_test"
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=test_data, headers=headers, timeout=30)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    demo_id = result.get("id")
                    external_response = result.get("external_response")
                    
                    self.log_test("Demo Request Ingest", True, 
                                f"Demo request successful - ID: {demo_id}, External sync: {bool(external_response)}", 
                                response_time)
                    return True
                else:
                    self.log_test("Demo Request Ingest", False, 
                                f"Demo request failed: {result}", response_time)
                    return False
            else:
                self.log_test("Demo Request Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Demo Request Ingest", False, f"Demo request error: {str(e)}", response_time)
            return False
    
    def test_contact_request_ingest(self):
        """Test contact request ingest endpoint"""
        print("\n=== Testing Contact Request Ingest Endpoint ===")
        
        test_data = {
            "full_name": "Backend Contact Test",
            "work_email": "contact@backendtest.com",
            "company_name": "Backend Contact Company",
            "company_website": "https://contacttest.com",
            "phone": "+1234567891",
            "call_volume": 15000,
            "interaction_volume": 25000,
            "preferred_contact_method": "Email",
            "message": "Testing contact sales backend health",
            "status": "pending",
            "assigned_rep": "Backend Tester"
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/contact_requests", 
                                   json=test_data, headers=headers, timeout=30)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    contact_id = result.get("id")
                    external_response = result.get("external_response")
                    
                    self.log_test("Contact Request Ingest", True, 
                                f"Contact request successful - ID: {contact_id}, External sync: {bool(external_response)}", 
                                response_time)
                    return True
                else:
                    self.log_test("Contact Request Ingest", False, 
                                f"Contact request failed: {result}", response_time)
                    return False
            else:
                self.log_test("Contact Request Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Contact Request Ingest", False, f"Contact request error: {str(e)}", response_time)
            return False
    
    def test_roi_report_ingest(self):
        """Test ROI report ingest endpoint"""
        print("\n=== Testing ROI Report Ingest Endpoint ===")
        
        test_data = {
            "country": "Bangladesh",
            "monthly_volume": 50000,
            "bpo_spending": 25000.00,
            "sentratech_spending": 15000.00,
            "sentratech_bundles": 50.0,
            "monthly_savings": 10000.00,
            "roi": 66.67,
            "cost_reduction": 40.0,
            "contact_email": "roi@backendtest.com"
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/roi_reports", 
                                   json=test_data, headers=headers, timeout=30)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    roi_id = result.get("id")
                    
                    self.log_test("ROI Report Ingest", True, 
                                f"ROI report successful - ID: {roi_id}", 
                                response_time)
                    return True
                else:
                    self.log_test("ROI Report Ingest", False, 
                                f"ROI report failed: {result}", response_time)
                    return False
            else:
                self.log_test("ROI Report Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("ROI Report Ingest", False, f"ROI report error: {str(e)}", response_time)
            return False
    
    def test_subscription_ingest(self):
        """Test newsletter subscription ingest endpoint"""
        print("\n=== Testing Newsletter Subscription Ingest Endpoint ===")
        
        test_data = {
            "email": "newsletter@backendtest.com",
            "source": "backend_health_test",
            "status": "subscribed"
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=test_data, headers=headers, timeout=30)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    sub_id = result.get("id")
                    
                    self.log_test("Newsletter Subscription Ingest", True, 
                                f"Newsletter subscription successful - ID: {sub_id}", 
                                response_time)
                    return True
                else:
                    self.log_test("Newsletter Subscription Ingest", False, 
                                f"Newsletter subscription failed: {result}", response_time)
                    return False
            else:
                self.log_test("Newsletter Subscription Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Newsletter Subscription Ingest", False, f"Newsletter subscription error: {str(e)}", response_time)
            return False
    
    def test_job_application_ingest(self):
        """Test job application ingest endpoint"""
        print("\n=== Testing Job Application Ingest Endpoint ===")
        
        test_data = {
            "first_name": "Backend",
            "last_name": "Tester",
            "email": "jobs@backendtest.com",
            "phone": "+1234567892",
            "location": "Bangladesh",
            "resume_file": "https://example.com/resume.pdf",
            "portfolio_website": "https://backendtester.com",
            "preferred_shifts": ["Morning", "Afternoon"],
            "availability_date": "2024-02-01",
            "experience_years": "3-5",
            "motivation_text": "Testing backend health for job applications",
            "cover_letter": "Backend health testing cover letter",
            "work_authorization": "Authorized",
            "position_applied": "Customer Support Specialist",
            "application_source": "backend_health_test",
            "consent_for_storage": True
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/job_applications", 
                                   json=test_data, headers=headers, timeout=30)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    job_id = result.get("id")
                    
                    self.log_test("Job Application Ingest", True, 
                                f"Job application successful - ID: {job_id}", 
                                response_time)
                    return True
                else:
                    self.log_test("Job Application Ingest", False, 
                                f"Job application failed: {result}", response_time)
                    return False
            else:
                self.log_test("Job Application Ingest", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Job Application Ingest", False, f"Job application error: {str(e)}", response_time)
            return False
    
    def test_authentication_security(self):
        """Test authentication security for ingest endpoints"""
        print("\n=== Testing Authentication Security ===")
        
        test_data = {
            "user_name": "Security Test",
            "email": "security@test.com",
            "company": "Security Test Co",
            "message": "Testing authentication"
        }
        
        # Test without authentication key
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=test_data, timeout=15)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 401:
                self.log_test("Authentication Security - Missing Key", True, 
                            "Correctly rejected request without authentication key", response_time)
            else:
                self.log_test("Authentication Security - Missing Key", False, 
                            f"Expected HTTP 401, got {response.status_code}", response_time)
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Authentication Security - Missing Key", False, 
                        f"Authentication test error: {str(e)}", response_time)
        
        # Test with invalid authentication key
        invalid_headers = {"X-INGEST-KEY": "invalid-key-12345"}
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=test_data, headers=invalid_headers, timeout=15)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 401:
                self.log_test("Authentication Security - Invalid Key", True, 
                            "Correctly rejected request with invalid authentication key", response_time)
            else:
                self.log_test("Authentication Security - Invalid Key", False, 
                            f"Expected HTTP 401, got {response.status_code}", response_time)
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Authentication Security - Invalid Key", False, 
                        f"Authentication test error: {str(e)}", response_time)
    
    def test_data_validation(self):
        """Test data validation for ingest endpoints"""
        print("\n=== Testing Data Validation ===")
        
        # Test missing required fields
        invalid_data = {
            "email": "validation@test.com"
            # Missing required fields like name, company
        }
        
        headers = {"X-INGEST-KEY": INGEST_KEY}
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=invalid_data, headers=headers, timeout=15)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code in [400, 422]:
                self.log_test("Data Validation - Missing Fields", True, 
                            f"Correctly rejected invalid data with HTTP {response.status_code}", response_time)
            else:
                self.log_test("Data Validation - Missing Fields", False, 
                            f"Expected HTTP 400/422, got {response.status_code}", response_time)
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Data Validation - Missing Fields", False, 
                        f"Validation test error: {str(e)}", response_time)
        
        # Test invalid email format
        invalid_email_data = {
            "user_name": "Test User",
            "email": "invalid-email-format",
            "company": "Test Company",
            "message": "Testing validation"
        }
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=invalid_email_data, headers=headers, timeout=15)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code in [400, 422]:
                self.log_test("Data Validation - Invalid Email", True, 
                            f"Correctly rejected invalid email with HTTP {response.status_code}", response_time)
            else:
                self.log_test("Data Validation - Invalid Email", False, 
                            f"Expected HTTP 400/422, got {response.status_code}", response_time)
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Data Validation - Invalid Email", False, 
                        f"Email validation test error: {str(e)}", response_time)
    
    def test_performance_benchmarks(self):
        """Test performance benchmarks for critical endpoints"""
        print("\n=== Testing Performance Benchmarks ===")
        
        # Performance thresholds (in milliseconds)
        HEALTH_CHECK_THRESHOLD = 500
        INGEST_ENDPOINT_THRESHOLD = 2000
        
        # Check health endpoint performance
        health_performance = self.performance_metrics.get("Backend Health Check", float('inf'))
        if health_performance <= HEALTH_CHECK_THRESHOLD:
            self.log_test("Performance - Health Check", True, 
                        f"Health check within threshold: {health_performance:.2f}ms <= {HEALTH_CHECK_THRESHOLD}ms")
        else:
            self.log_test("Performance - Health Check", False, 
                        f"Health check too slow: {health_performance:.2f}ms > {HEALTH_CHECK_THRESHOLD}ms")
        
        # Check ingest endpoints performance
        ingest_endpoints = [
            "Demo Request Ingest",
            "Contact Request Ingest", 
            "ROI Report Ingest",
            "Newsletter Subscription Ingest",
            "Job Application Ingest"
        ]
        
        slow_endpoints = []
        for endpoint in ingest_endpoints:
            performance = self.performance_metrics.get(endpoint, float('inf'))
            if performance > INGEST_ENDPOINT_THRESHOLD:
                slow_endpoints.append(f"{endpoint}: {performance:.2f}ms")
        
        if not slow_endpoints:
            avg_ingest_time = sum(self.performance_metrics.get(ep, 0) for ep in ingest_endpoints) / len(ingest_endpoints)
            self.log_test("Performance - Ingest Endpoints", True, 
                        f"All ingest endpoints within threshold. Average: {avg_ingest_time:.2f}ms")
        else:
            self.log_test("Performance - Ingest Endpoints", False, 
                        f"Slow ingest endpoints: {', '.join(slow_endpoints)}")
    
    def generate_comprehensive_summary(self):
        """Generate comprehensive test summary with performance analysis"""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE BACKEND HEALTH & PERFORMANCE TEST SUMMARY")
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
        
        # Performance analysis
        if self.performance_metrics:
            print(f"\n⚡ Performance Analysis:")
            avg_response_time = sum(self.performance_metrics.values()) / len(self.performance_metrics)
            fastest_endpoint = min(self.performance_metrics.items(), key=lambda x: x[1])
            slowest_endpoint = max(self.performance_metrics.items(), key=lambda x: x[1])
            
            print(f"   Average Response Time: {avg_response_time:.2f}ms")
            print(f"   Fastest Endpoint: {fastest_endpoint[0]} ({fastest_endpoint[1]:.2f}ms)")
            print(f"   Slowest Endpoint: {slowest_endpoint[0]} ({slowest_endpoint[1]:.2f}ms)")
        
        # Detailed results by category
        print(f"\n📋 Test Results by Category:")
        
        categories = {
            "Core Health": ["Backend Connectivity", "Backend Health Check", "Dashboard Config Validation"],
            "Ingest Endpoints": ["Demo Request Ingest", "Contact Request Ingest", "ROI Report Ingest", 
                               "Newsletter Subscription Ingest", "Job Application Ingest"],
            "Security": ["Authentication Security - Missing Key", "Authentication Security - Invalid Key"],
            "Validation": ["Data Validation - Missing Fields", "Data Validation - Invalid Email"],
            "Performance": ["Performance - Health Check", "Performance - Ingest Endpoints"]
        }
        
        for category, tests in categories.items():
            category_results = [r for r in self.test_results if r["test"] in tests]
            if category_results:
                passed_in_category = sum(1 for r in category_results if r["passed"])
                total_in_category = len(category_results)
                category_rate = (passed_in_category / total_in_category) * 100
                
                print(f"   {category}: {passed_in_category}/{total_in_category} ({category_rate:.1f}%)")
                
                # Show failed tests in category
                failed_in_category = [r for r in category_results if not r["passed"]]
                for failed_test in failed_in_category:
                    print(f"      ❌ {failed_test['test']}: {failed_test['details']}")
        
        # Critical findings
        print(f"\n🎯 Critical Findings:")
        
        critical_failures = [r for r in self.test_results if not r["passed"] and 
                           any(keyword in r["test"] for keyword in ["Connectivity", "Health", "Security"])]
        
        if critical_failures:
            print(f"   ❌ CRITICAL ISSUES DETECTED:")
            for failure in critical_failures:
                print(f"      • {failure['test']}: {failure['details']}")
        else:
            print(f"   ✅ No critical issues detected")
        
        # Performance issues
        performance_issues = [r for r in self.test_results if not r["passed"] and "Performance" in r["test"]]
        if performance_issues:
            print(f"   ⚠️ PERFORMANCE ISSUES:")
            for issue in performance_issues:
                print(f"      • {issue['details']}")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        if success_rate >= 95:
            print(f"   🎉 EXCELLENT - Backend is production-ready with outstanding performance")
        elif success_rate >= 85:
            print(f"   ✅ GOOD - Backend is production-ready with minor issues")
        elif success_rate >= 75:
            print(f"   ⚠️ FAIR - Backend needs improvements before production")
        else:
            print(f"   ❌ POOR - Significant issues need resolution before production")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests == 0:
            print(f"   • Backend health is excellent - no issues detected")
            print(f"   • All API endpoints are functioning correctly")
            print(f"   • Performance is within acceptable thresholds")
        else:
            if critical_failures:
                print(f"   • URGENT: Address critical connectivity/health issues immediately")
            
            if performance_issues:
                print(f"   • Optimize slow endpoints to improve response times")
            
            print(f"   • Address {failed_tests} failed test cases before production deployment")
        
        return success_rate >= 85
    
    def run_comprehensive_health_tests(self):
        """Run all comprehensive backend health and performance tests"""
        print("🚀 Starting Comprehensive Backend Health & Performance Testing")
        print("=" * 80)
        print("Testing backend health and performance after UI enhancements:")
        print("• Core connectivity and health checks")
        print("• All ingest API endpoints")
        print("• Authentication and security")
        print("• Data validation")
        print("• Performance benchmarks")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Core health tests
            if not self.test_backend_connectivity():
                print("❌ Backend connectivity failed - aborting tests")
                return False
            
            self.test_health_check()
            self.test_config_validation()
            
            # API endpoint tests
            self.test_demo_request_ingest()
            self.test_contact_request_ingest()
            self.test_roi_report_ingest()
            self.test_subscription_ingest()
            self.test_job_application_ingest()
            
            # Security and validation tests
            self.test_authentication_security()
            self.test_data_validation()
            
            # Performance analysis
            self.test_performance_benchmarks()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_healthy = self.generate_comprehensive_summary()
        
        return is_healthy


def main():
    """Main function to run comprehensive backend health testing"""
    print("🎯 Comprehensive Backend Health & Performance Testing")
    print("Testing backend health and performance after UI enhancements")
    print()
    
    tester = ComprehensiveBackendHealthTester()
    
    try:
        is_healthy = tester.run_comprehensive_health_tests()
        
        if is_healthy:
            print("\n🎉 SUCCESS: Backend is healthy and performing well after UI enhancements!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Backend needs attention before production deployment")
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