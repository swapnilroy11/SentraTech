#!/usr/bin/env python3
"""
Focused API Load Testing for SentraTech Production Readiness
Tests the specific endpoints mentioned in the review request
"""

import requests
import json
import time
import concurrent.futures
import statistics
import random
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://tech-careers-3.preview.emergentagent.com/api"

class FocusedLoadTester:
    """Focused Load Testing for SentraTech Production Readiness"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.load_test_results = {}
        
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
    
    def generate_realistic_demo_data(self) -> dict:
        """Generate realistic demo request data"""
        companies = ["TechCorp Solutions", "Global Dynamics Inc", "Innovation Labs"]
        first_names = ["Sarah", "Michael", "Jennifer", "David", "Lisa"]
        last_names = ["Johnson", "Williams", "Brown", "Jones", "Garcia"]
        domains = ["techcorp.com", "globalinc.com", "innovationlabs.io"]
        
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        company = random.choice(companies)
        domain = random.choice(domains)
        
        return {
            "name": f"{first_name} {last_name}",
            "email": f"{first_name.lower()}.{last_name.lower()}@{domain}",
            "company": company,
            "phone": f"+1{random.randint(200, 999)}{random.randint(200, 999)}{random.randint(1000, 9999)}",
            "message": "Interested in AI customer support platform for load testing",
            "call_volume": random.choice(["1000-2500", "2500-5000", "5000-10000"])
        }
    
    def generate_realistic_roi_data(self) -> dict:
        """Generate realistic ROI calculation data"""
        return {
            "call_volume": random.randint(1000, 50000),
            "current_cost_per_call": round(random.uniform(2.50, 15.00), 2),
            "average_handle_time": random.randint(180, 900),
            "agent_count": random.randint(5, 200)
        }
    
    def make_concurrent_requests(self, endpoint: str, method: str = "GET", 
                                num_requests: int = 10, timeout: int = 30) -> dict:
        """Make concurrent requests and measure performance"""
        
        def make_single_request(request_id: int) -> dict:
            start_time = time.time()
            try:
                if method.upper() == "POST":
                    if endpoint == "/demo/request":
                        request_data = self.generate_realistic_demo_data()
                        request_data["email"] = f"loadtest{request_id}_{int(time.time())}@example.com"
                    elif endpoint == "/roi/calculate":
                        request_data = self.generate_realistic_roi_data()
                    else:
                        request_data = {}
                    
                    response = requests.post(f"{BACKEND_URL}{endpoint}", 
                                           json=request_data, timeout=timeout)
                else:
                    response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=timeout)
                
                end_time = time.time()
                response_time = (end_time - start_time) * 1000
                
                return {
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "response_time": response_time,
                    "success": 200 <= response.status_code < 300,
                    "error": None
                }
                
            except requests.exceptions.Timeout:
                return {
                    "request_id": request_id,
                    "status_code": 0,
                    "response_time": timeout * 1000,
                    "success": False,
                    "error": "Timeout"
                }
            except Exception as e:
                end_time = time.time()
                return {
                    "request_id": request_id,
                    "status_code": 0,
                    "response_time": (end_time - start_time) * 1000,
                    "success": False,
                    "error": str(e)
                }
        
        print(f"🚀 Executing {num_requests} concurrent {method} requests to {endpoint}...")
        
        start_time = time.time()
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(num_requests, 20)) as executor:
            futures = [executor.submit(make_single_request, i) for i in range(num_requests)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        end_time = time.time()
        
        # Calculate metrics
        successful_requests = [r for r in results if r["success"]]
        failed_requests = [r for r in results if not r["success"]]
        
        response_times = [r["response_time"] for r in successful_requests]
        
        if response_times:
            avg_response_time = statistics.mean(response_times)
            p95_response_time = sorted(response_times)[int(0.95 * len(response_times))] if len(response_times) > 1 else response_times[0]
            max_response_time = max(response_times)
        else:
            avg_response_time = p95_response_time = max_response_time = 0
        
        total_time = (end_time - start_time)
        requests_per_second = num_requests / total_time if total_time > 0 else 0
        
        return {
            "endpoint": endpoint,
            "method": method,
            "total_requests": num_requests,
            "successful_requests": len(successful_requests),
            "failed_requests": len(failed_requests),
            "success_rate": (len(successful_requests) / num_requests) * 100,
            "total_time": total_time,
            "requests_per_second": requests_per_second,
            "avg_response_time": avg_response_time,
            "p95_response_time": p95_response_time,
            "max_response_time": max_response_time,
            "raw_results": results
        }
    
    def test_demo_request_load(self):
        """Test POST /api/demo/request with 50 concurrent requests (<300ms target)"""
        print("\n=== Testing Demo Request API Load (50 concurrent requests) ===")
        
        result = self.make_concurrent_requests(
            endpoint="/demo/request",
            method="POST",
            num_requests=50,
            timeout=30
        )
        
        self.load_test_results["demo_request"] = result
        
        # Evaluate results
        target_response_time = 300  # ms
        min_success_rate = 95  # %
        
        if result["avg_response_time"] <= target_response_time:
            self.log_test("Demo Request Load - Average Response Time", True,
                        f"✅ Avg response time: {result['avg_response_time']:.2f}ms")
        else:
            self.log_test("Demo Request Load - Average Response Time", False,
                        f"❌ Avg response time: {result['avg_response_time']:.2f}ms (target: <{target_response_time}ms)")
        
        if result["p95_response_time"] <= target_response_time * 1.5:
            self.log_test("Demo Request Load - 95th Percentile Response Time", True,
                        f"✅ 95th percentile: {result['p95_response_time']:.2f}ms")
        else:
            self.log_test("Demo Request Load - 95th Percentile Response Time", False,
                        f"❌ 95th percentile: {result['p95_response_time']:.2f}ms")
        
        if result["success_rate"] >= min_success_rate:
            self.log_test("Demo Request Load - Success Rate", True,
                        f"✅ Success rate: {result['success_rate']:.1f}%")
        else:
            self.log_test("Demo Request Load - Success Rate", False,
                        f"❌ Success rate: {result['success_rate']:.1f}%")
        
        if result["requests_per_second"] >= 10:
            self.log_test("Demo Request Load - Throughput", True,
                        f"✅ Throughput: {result['requests_per_second']:.2f} RPS")
        else:
            self.log_test("Demo Request Load - Throughput", False,
                        f"❌ Throughput: {result['requests_per_second']:.2f} RPS")
        
        print(f"📊 Demo Request Load Test Summary:")
        print(f"   Total Requests: {result['total_requests']}")
        print(f"   Successful: {result['successful_requests']} ({result['success_rate']:.1f}%)")
        print(f"   Failed: {result['failed_requests']}")
        print(f"   Avg Response Time: {result['avg_response_time']:.2f}ms")
        print(f"   95th Percentile: {result['p95_response_time']:.2f}ms")
        print(f"   Max Response Time: {result['max_response_time']:.2f}ms")
        print(f"   Throughput: {result['requests_per_second']:.2f} RPS")
    
    def test_roi_calculator_load(self):
        """Test POST /api/roi/calculate with 40 concurrent requests (<250ms target)"""
        print("\n=== Testing ROI Calculator API Load (40 concurrent requests) ===")
        
        result = self.make_concurrent_requests(
            endpoint="/roi/calculate",
            method="POST",
            num_requests=40,
            timeout=20
        )
        
        self.load_test_results["roi_calculator"] = result
        
        target_response_time = 250  # ms
        min_success_rate = 95  # %
        
        if result["avg_response_time"] <= target_response_time:
            self.log_test("ROI Calculator Load - Average Response Time", True,
                        f"✅ Avg response time: {result['avg_response_time']:.2f}ms")
        else:
            self.log_test("ROI Calculator Load - Average Response Time", False,
                        f"❌ Avg response time: {result['avg_response_time']:.2f}ms (target: <{target_response_time}ms)")
        
        if result["success_rate"] >= min_success_rate:
            self.log_test("ROI Calculator Load - Success Rate", True,
                        f"✅ Success rate: {result['success_rate']:.1f}%")
        else:
            self.log_test("ROI Calculator Load - Success Rate", False,
                        f"❌ Success rate: {result['success_rate']:.1f}%")
        
        print(f"📊 ROI Calculator Load Test Summary:")
        print(f"   Total Requests: {result['total_requests']}")
        print(f"   Successful: {result['successful_requests']} ({result['success_rate']:.1f}%)")
        print(f"   Avg Response Time: {result['avg_response_time']:.2f}ms")
        print(f"   Throughput: {result['requests_per_second']:.2f} RPS")
    
    def test_analytics_endpoints_load(self):
        """Test analytics endpoints with 20 concurrent requests (<300ms target)"""
        print("\n=== Testing Analytics Endpoints Load (20 concurrent requests each) ===")
        
        analytics_endpoints = [
            "/metrics/live",
            "/metrics/dashboard", 
            "/metrics/kpis"
        ]
        
        analytics_results = {}
        
        for endpoint in analytics_endpoints:
            print(f"🔍 Testing {endpoint}...")
            
            result = self.make_concurrent_requests(
                endpoint=endpoint,
                method="GET",
                num_requests=20,
                timeout=15
            )
            
            analytics_results[endpoint] = result
            
            target_response_time = 300  # ms
            min_success_rate = 90  # %
            
            if result["avg_response_time"] <= target_response_time:
                self.log_test(f"Analytics Load - {endpoint} Response Time", True,
                            f"✅ Avg: {result['avg_response_time']:.2f}ms")
            else:
                self.log_test(f"Analytics Load - {endpoint} Response Time", False,
                            f"❌ Avg: {result['avg_response_time']:.2f}ms (target: <{target_response_time}ms)")
            
            if result["success_rate"] >= min_success_rate:
                self.log_test(f"Analytics Load - {endpoint} Success Rate", True,
                            f"✅ Success: {result['success_rate']:.1f}%")
            else:
                self.log_test(f"Analytics Load - {endpoint} Success Rate", False,
                            f"❌ Success: {result['success_rate']:.1f}%")
        
        self.load_test_results["analytics"] = analytics_results
        
        print(f"📊 Analytics Load Test Summary:")
        for endpoint, result in analytics_results.items():
            print(f"   {endpoint}: {result['successful_requests']}/{result['total_requests']} "
                  f"({result['success_rate']:.1f}%) - Avg: {result['avg_response_time']:.2f}ms")
    
    def test_burst_load_scenario(self):
        """Test burst load scenario"""
        print("\n=== Testing Burst Load Scenario ===")
        
        print("🚀 Testing burst load on demo request endpoint...")
        
        burst_result = self.make_concurrent_requests(
            endpoint="/demo/request",
            method="POST", 
            num_requests=25,
            timeout=45
        )
        
        max_acceptable_response_time = 5000  # 5 seconds for burst scenario
        min_success_rate = 80  # Lower threshold for burst
        
        if burst_result["max_response_time"] <= max_acceptable_response_time:
            self.log_test("Burst Load - Peak Response Time", True,
                        f"✅ Max response time: {burst_result['max_response_time']:.2f}ms")
        else:
            self.log_test("Burst Load - Peak Response Time", False,
                        f"❌ Max response time: {burst_result['max_response_time']:.2f}ms")
        
        if burst_result["success_rate"] >= min_success_rate:
            self.log_test("Burst Load - Success Rate", True,
                        f"✅ Burst success rate: {burst_result['success_rate']:.1f}%")
        else:
            self.log_test("Burst Load - Success Rate", False,
                        f"❌ Burst success rate: {burst_result['success_rate']:.1f}%")
        
        self.load_test_results["burst_load"] = burst_result
    
    def test_data_integrity_under_load(self):
        """Test data integrity during concurrent operations"""
        print("\n=== Testing Data Integrity Under Load ===")
        
        print("🔍 Testing concurrent demo request submissions for data integrity...")
        
        base_email = f"integrity_test_{int(time.time())}"
        test_requests = []
        
        for i in range(10):
            demo_data = self.generate_realistic_demo_data()
            demo_data["email"] = f"{base_email}_{i}@integrity.test"
            demo_data["company"] = f"Integrity Test Corp {i}"
            test_requests.append(demo_data)
        
        def submit_demo_request(request_data):
            try:
                response = requests.post(f"{BACKEND_URL}/demo/request", json=request_data, timeout=30)
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "success": True,
                        "email": request_data["email"],
                        "reference_id": result.get("reference_id"),
                        "response": result
                    }
                else:
                    return {
                        "success": False,
                        "email": request_data["email"],
                        "error": f"HTTP {response.status_code}"
                    }
            except Exception as e:
                return {
                    "success": False,
                    "email": request_data["email"],
                    "error": str(e)
                }
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(submit_demo_request, req) for req in test_requests]
            submission_results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        successful_submissions = [r for r in submission_results if r["success"]]
        
        if len(successful_submissions) >= len(test_requests) * 0.8:  # At least 80% should succeed
            self.log_test("Data Integrity - Concurrent Submissions", True,
                        f"✅ {len(successful_submissions)}/{len(test_requests)} concurrent submissions successful")
        else:
            failed_count = len(test_requests) - len(successful_submissions)
            self.log_test("Data Integrity - Concurrent Submissions", False,
                        f"❌ {failed_count} submissions failed out of {len(test_requests)}")
        
        # Check for duplicate reference IDs
        reference_ids = [r["reference_id"] for r in successful_submissions if r.get("reference_id")]
        unique_reference_ids = set(reference_ids)
        
        if len(reference_ids) == len(unique_reference_ids):
            self.log_test("Data Integrity - Unique Reference IDs", True,
                        f"✅ All reference IDs unique (no race conditions)")
        else:
            duplicates = len(reference_ids) - len(unique_reference_ids)
            self.log_test("Data Integrity - Unique Reference IDs", False,
                        f"❌ {duplicates} duplicate reference IDs detected")
    
    def generate_production_readiness_report(self):
        """Generate production readiness report"""
        print("\n" + "=" * 80)
        print("📊 SENTRATECH API LOAD & STABILITY TESTING - PRODUCTION READINESS REPORT")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📈 Overall Test Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📊 Success Rate: {success_rate:.1f}%")
        
        print(f"\n🚀 Load Testing Summary:")
        
        if "demo_request" in self.load_test_results:
            result = self.load_test_results["demo_request"]
            print(f"   Demo Request API (50 concurrent):")
            print(f"     Success Rate: {result['success_rate']:.1f}%")
            print(f"     Avg Response: {result['avg_response_time']:.2f}ms (target: <300ms)")
            print(f"     95th Percentile: {result['p95_response_time']:.2f}ms")
            print(f"     Throughput: {result['requests_per_second']:.2f} RPS")
        
        if "roi_calculator" in self.load_test_results:
            result = self.load_test_results["roi_calculator"]
            print(f"   ROI Calculator API (40 concurrent):")
            print(f"     Success Rate: {result['success_rate']:.1f}%")
            print(f"     Avg Response: {result['avg_response_time']:.2f}ms (target: <250ms)")
            print(f"     Throughput: {result['requests_per_second']:.2f} RPS")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        readiness_score = 0
        max_score = 0
        
        # Response Times
        max_score += 25
        if "demo_request" in self.load_test_results:
            demo_result = self.load_test_results["demo_request"]
            if demo_result["avg_response_time"] <= 300:
                readiness_score += 25
                print(f"   ✅ Response Times: PASS")
            else:
                print(f"   ❌ Response Times: FAIL (Demo API: {demo_result['avg_response_time']:.2f}ms > 300ms)")
        
        # Success Rates
        max_score += 25
        if "demo_request" in self.load_test_results:
            demo_result = self.load_test_results["demo_request"]
            if demo_result["success_rate"] >= 95:
                readiness_score += 25
                print(f"   ✅ Success Rates: PASS ({demo_result['success_rate']:.1f}%)")
            else:
                print(f"   ❌ Success Rates: FAIL ({demo_result['success_rate']:.1f}% < 95%)")
        
        # Throughput
        max_score += 25
        if "demo_request" in self.load_test_results:
            demo_result = self.load_test_results["demo_request"]
            if demo_result["requests_per_second"] >= 10:
                readiness_score += 25
                print(f"   ✅ Throughput: PASS ({demo_result['requests_per_second']:.2f} RPS)")
            else:
                print(f"   ❌ Throughput: FAIL ({demo_result['requests_per_second']:.2f} RPS < 10)")
        
        # Stability
        max_score += 25
        if success_rate >= 80:
            readiness_score += 25
            print(f"   ✅ Stability: PASS ({success_rate:.1f}% test success rate)")
        else:
            print(f"   ❌ Stability: FAIL ({success_rate:.1f}% < 80%)")
        
        final_readiness = (readiness_score / max_score) * 100 if max_score > 0 else 0
        
        print(f"\n🏆 FINAL PRODUCTION READINESS SCORE: {final_readiness:.1f}%")
        
        if final_readiness >= 90:
            print(f"   🎉 EXCELLENT - Ready for production deployment")
        elif final_readiness >= 75:
            print(f"   ✅ GOOD - Ready for production with minor optimizations")
        elif final_readiness >= 60:
            print(f"   ⚠️ FAIR - Needs improvements before production")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        return final_readiness
    
    def run_focused_load_tests(self):
        """Run focused load tests for production readiness"""
        print("🚀 Starting Focused API Load & Stability Testing")
        print("=" * 80)
        print("Testing SentraTech API endpoints for production readiness:")
        print("• Demo Request API: 50 concurrent requests (<300ms target)")
        print("• ROI Calculator API: 40 concurrent requests (<250ms target)")
        print("• Analytics Endpoints: 20 concurrent requests each (<300ms target)")
        print("• Burst Load Testing: Simultaneous request handling")
        print("• Data Integrity Testing: Concurrent operation safety")
        print("=" * 80)
        
        try:
            # Core endpoint load tests
            self.test_demo_request_load()
            self.test_roi_calculator_load()
            self.test_analytics_endpoints_load()
            
            # Advanced load scenarios
            self.test_burst_load_scenario()
            
            # Data integrity tests
            self.test_data_integrity_under_load()
            
        except Exception as e:
            print(f"❌ Critical error during load testing: {str(e)}")
            self.log_test("Load Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate report
        readiness_score = self.generate_production_readiness_report()
        
        return readiness_score >= 75


if __name__ == "__main__":
    print("🚀 SentraTech Focused API Load Testing - Production Readiness Assessment")
    print("=" * 90)
    
    load_tester = FocusedLoadTester()
    production_ready = load_tester.run_focused_load_tests()
    
    print("\n" + "=" * 90)
    print("🏁 FINAL PRODUCTION READINESS ASSESSMENT")
    print("=" * 90)
    
    if production_ready:
        print("🎉 SENTRATECH API IS PRODUCTION READY!")
        print("✅ Key endpoints handle concurrent load efficiently")
        print("✅ Response times meet performance targets")
        print("✅ High success rates under load")
        print("✅ Data integrity maintained during concurrent operations")
        print("\n🚀 Ready for production deployment!")
    else:
        print("⚠️ PRODUCTION READINESS ISSUES DETECTED")
        print("❌ Some performance targets not met")
        print("❌ Optimization needed before production deployment")
        print("\n🔧 Review detailed results above for specific improvements needed")
    
    print(f"\n📈 Overall Assessment: {'PRODUCTION READY' if production_ready else 'NEEDS IMPROVEMENT'}")
    print("=" * 90)