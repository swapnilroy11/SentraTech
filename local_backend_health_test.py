#!/usr/bin/env python3
"""
Local Backend Health Testing - Focus on Core Backend Functionality
Tests backend health without external dashboard dependencies
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://dashboard-bridge-2.preview.emergentagent.com/api"

class LocalBackendHealthTester:
    """Local Backend Health Testing"""
    
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
                                f"Backend responding correctly", response_time)
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
                    version = result.get("version", "unknown")
                    
                    self.log_test("Backend Health Check", True, 
                                f"Status: healthy, DB: {database_status}, Ingest: {ingest_configured}, Version: {version}, Backend RT: {backend_response_time}ms", 
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
                if result.get("status") == "success":
                    config_valid = result.get("config_valid", False)
                    email_configured = result.get("email_service_configured", False)
                    calendar_configured = result.get("calendar_service_configured", False)
                    
                    self.log_test("Dashboard Config Validation", True, 
                                f"Config status: {config_valid}, Email: {email_configured}, Calendar: {calendar_configured}", 
                                response_time)
                    return True
                else:
                    self.log_test("Dashboard Config Validation", False, 
                                f"Config validation failed: {result}", response_time)
                    return False
            else:
                self.log_test("Dashboard Config Validation", False, 
                            f"HTTP {response.status_code}: {response.text}", response_time)
                return False
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Dashboard Config Validation", False, f"Config validation error: {str(e)}", response_time)
            return False
    
    def test_ingest_endpoints_status(self):
        """Test ingest endpoints status without submitting data"""
        print("\n=== Testing Ingest Endpoints Status ===")
        
        endpoints = [
            "/ingest/demo_requests/status",
            "/ingest/contact_requests/status", 
            "/ingest/roi_reports/status",
            "/ingest/subscriptions/status"
        ]
        
        working_endpoints = 0
        
        for endpoint in endpoints:
            start_time = time.time()
            try:
                response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=10)
                response_time = (time.time() - start_time) * 1000
                
                endpoint_name = endpoint.split('/')[-2].replace('_', ' ').title()
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("status") == "success":
                        total_records = result.get("total", 0)
                        working_endpoints += 1
                        
                        self.log_test(f"{endpoint_name} Status", True, 
                                    f"Endpoint working - Total records: {total_records}", 
                                    response_time)
                    else:
                        self.log_test(f"{endpoint_name} Status", False, 
                                    f"Status endpoint failed: {result}", response_time)
                else:
                    self.log_test(f"{endpoint_name} Status", False, 
                                f"HTTP {response.status_code}: {response.text}", response_time)
                        
            except Exception as e:
                response_time = (time.time() - start_time) * 1000
                self.log_test(f"{endpoint_name} Status", False, 
                            f"Status endpoint error: {str(e)}", response_time)
        
        # Overall status endpoint health
        if working_endpoints >= 3:
            self.log_test("Ingest Status Endpoints Overall", True, 
                        f"{working_endpoints}/4 status endpoints working")
        else:
            self.log_test("Ingest Status Endpoints Overall", False, 
                        f"Only {working_endpoints}/4 status endpoints working")
    
    def test_authentication_endpoints(self):
        """Test authentication behavior without valid keys"""
        print("\n=== Testing Authentication Security ===")
        
        test_data = {
            "user_name": "Auth Test",
            "email": "auth@test.com",
            "company": "Auth Test Co",
            "message": "Testing authentication"
        }
        
        # Test without authentication key
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=test_data, timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 401:
                self.log_test("Authentication - Missing Key", True, 
                            "Correctly rejected request without authentication key", response_time)
            else:
                self.log_test("Authentication - Missing Key", False, 
                            f"Expected HTTP 401, got {response.status_code}", response_time)
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Authentication - Missing Key", False, 
                        f"Authentication test error: {str(e)}", response_time)
        
        # Test with invalid authentication key
        invalid_headers = {"X-INGEST-KEY": "invalid-key-12345"}
        
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   json=test_data, headers=invalid_headers, timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 401:
                self.log_test("Authentication - Invalid Key", True, 
                            "Correctly rejected request with invalid authentication key", response_time)
            else:
                self.log_test("Authentication - Invalid Key", False, 
                            f"Expected HTTP 401, got {response.status_code}", response_time)
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Authentication - Invalid Key", False, 
                        f"Authentication test error: {str(e)}", response_time)
    
    def test_cors_headers(self):
        """Test CORS headers are properly configured"""
        print("\n=== Testing CORS Configuration ===")
        
        start_time = time.time()
        try:
            # Test preflight request
            headers = {
                'Origin': 'https://dashboard-bridge-2.preview.emergentagent.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type,X-INGEST-KEY'
            }
            
            response = requests.options(f"{BACKEND_URL}/ingest/demo_requests", 
                                      headers=headers, timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if response.status_code in [200, 204]:
                self.log_test("CORS Configuration", True, 
                            f"CORS preflight successful - Headers: {cors_headers}", response_time)
            else:
                self.log_test("CORS Configuration", False, 
                            f"CORS preflight failed - HTTP {response.status_code}, Headers: {cors_headers}", response_time)
                
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("CORS Configuration", False, f"CORS test error: {str(e)}", response_time)
    
    def test_error_handling(self):
        """Test error handling for malformed requests"""
        print("\n=== Testing Error Handling ===")
        
        # Test malformed JSON
        start_time = time.time()
        try:
            response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                                   data="invalid json", 
                                   headers={"Content-Type": "application/json"}, 
                                   timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code in [400, 422]:
                self.log_test("Error Handling - Malformed JSON", True, 
                            f"Correctly handled malformed JSON with HTTP {response.status_code}", response_time)
            else:
                self.log_test("Error Handling - Malformed JSON", False, 
                            f"Expected HTTP 400/422, got {response.status_code}", response_time)
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Error Handling - Malformed JSON", False, 
                        f"Error handling test failed: {str(e)}", response_time)
        
        # Test non-existent endpoint
        start_time = time.time()
        try:
            response = requests.get(f"{BACKEND_URL}/nonexistent/endpoint", timeout=10)
            response_time = (time.time() - start_time) * 1000
            
            if response.status_code == 404:
                self.log_test("Error Handling - 404 Endpoint", True, 
                            "Correctly returned 404 for non-existent endpoint", response_time)
            else:
                self.log_test("Error Handling - 404 Endpoint", False, 
                            f"Expected HTTP 404, got {response.status_code}", response_time)
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            self.log_test("Error Handling - 404 Endpoint", False, 
                        f"404 test failed: {str(e)}", response_time)
    
    def test_performance_benchmarks(self):
        """Test performance benchmarks for critical endpoints"""
        print("\n=== Testing Performance Benchmarks ===")
        
        # Performance thresholds (in milliseconds)
        HEALTH_CHECK_THRESHOLD = 500
        CONFIG_VALIDATION_THRESHOLD = 500
        STATUS_ENDPOINT_THRESHOLD = 1000
        
        performance_issues = []
        
        # Check health endpoint performance
        health_performance = self.performance_metrics.get("Backend Health Check", float('inf'))
        if health_performance <= HEALTH_CHECK_THRESHOLD:
            self.log_test("Performance - Health Check", True, 
                        f"Health check within threshold: {health_performance:.2f}ms <= {HEALTH_CHECK_THRESHOLD}ms")
        else:
            performance_issues.append(f"Health Check: {health_performance:.2f}ms")
            self.log_test("Performance - Health Check", False, 
                        f"Health check too slow: {health_performance:.2f}ms > {HEALTH_CHECK_THRESHOLD}ms")
        
        # Check config validation performance
        config_performance = self.performance_metrics.get("Dashboard Config Validation", float('inf'))
        if config_performance <= CONFIG_VALIDATION_THRESHOLD:
            self.log_test("Performance - Config Validation", True, 
                        f"Config validation within threshold: {config_performance:.2f}ms <= {CONFIG_VALIDATION_THRESHOLD}ms")
        else:
            performance_issues.append(f"Config Validation: {config_performance:.2f}ms")
            self.log_test("Performance - Config Validation", False, 
                        f"Config validation too slow: {config_performance:.2f}ms > {CONFIG_VALIDATION_THRESHOLD}ms")
        
        # Check status endpoints performance
        status_endpoints = [name for name in self.performance_metrics.keys() if "Status" in name]
        slow_status_endpoints = []
        
        for endpoint in status_endpoints:
            performance = self.performance_metrics.get(endpoint, float('inf'))
            if performance > STATUS_ENDPOINT_THRESHOLD:
                slow_status_endpoints.append(f"{endpoint}: {performance:.2f}ms")
        
        if not slow_status_endpoints:
            avg_status_time = sum(self.performance_metrics.get(ep, 0) for ep in status_endpoints) / max(len(status_endpoints), 1)
            self.log_test("Performance - Status Endpoints", True, 
                        f"All status endpoints within threshold. Average: {avg_status_time:.2f}ms")
        else:
            self.log_test("Performance - Status Endpoints", False, 
                        f"Slow status endpoints: {', '.join(slow_status_endpoints)}")
    
    def generate_health_summary(self):
        """Generate comprehensive health summary"""
        print("\n" + "=" * 80)
        print("📊 LOCAL BACKEND HEALTH TEST SUMMARY")
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
        
        # Critical findings
        print(f"\n🎯 Critical Findings:")
        
        critical_failures = [r for r in self.test_results if not r["passed"] and 
                           any(keyword in r["test"] for keyword in ["Connectivity", "Health"])]
        
        if critical_failures:
            print(f"   ❌ CRITICAL ISSUES DETECTED:")
            for failure in critical_failures:
                print(f"      • {failure['test']}: {failure['details']}")
        else:
            print(f"   ✅ No critical backend issues detected")
        
        # Performance assessment
        performance_issues = [r for r in self.test_results if not r["passed"] and "Performance" in r["test"]]
        if performance_issues:
            print(f"   ⚠️ PERFORMANCE ISSUES:")
            for issue in performance_issues:
                print(f"      • {issue['details']}")
        else:
            print(f"   ✅ Backend performance within acceptable thresholds")
        
        # Security assessment
        security_issues = [r for r in self.test_results if not r["passed"] and "Authentication" in r["test"]]
        if security_issues:
            print(f"   ❌ SECURITY ISSUES:")
            for issue in security_issues:
                print(f"      • {issue['details']}")
        else:
            print(f"   ✅ Authentication security working correctly")
        
        # Production readiness assessment
        print(f"\n🎯 Backend Health Assessment:")
        
        if success_rate >= 95:
            print(f"   🎉 EXCELLENT - Backend is healthy and ready for production")
        elif success_rate >= 85:
            print(f"   ✅ GOOD - Backend is healthy with minor issues")
        elif success_rate >= 75:
            print(f"   ⚠️ FAIR - Backend has some issues but core functionality works")
        else:
            print(f"   ❌ POOR - Backend has significant issues requiring attention")
        
        return success_rate >= 85
    
    def run_local_health_tests(self):
        """Run all local backend health tests"""
        print("🚀 Starting Local Backend Health Testing")
        print("=" * 80)
        print("Testing core backend functionality without external dependencies:")
        print("• Backend connectivity and health")
        print("• Configuration validation")
        print("• Ingest endpoints status")
        print("• Authentication security")
        print("• CORS configuration")
        print("• Error handling")
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
            
            # Endpoint functionality tests
            self.test_ingest_endpoints_status()
            
            # Security and error handling tests
            self.test_authentication_endpoints()
            self.test_cors_headers()
            self.test_error_handling()
            
            # Performance analysis
            self.test_performance_benchmarks()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_healthy = self.generate_health_summary()
        
        return is_healthy


def main():
    """Main function to run local backend health testing"""
    print("🎯 Local Backend Health Testing")
    print("Testing backend core functionality and health")
    print()
    
    tester = LocalBackendHealthTester()
    
    try:
        is_healthy = tester.run_local_health_tests()
        
        if is_healthy:
            print("\n🎉 SUCCESS: Backend is healthy and performing well!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Backend needs attention")
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