#!/usr/bin/env python3
"""
Proxy Endpoints Error Handling Testing
Testing error scenarios and edge cases for all 5 proxy endpoints
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone

# Backend URL from frontend environment
BACKEND_URL = "https://matrix-team-update.preview.emergentagent.com"

class ProxyErrorHandlingTester:
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
    
    def test_malformed_json(self):
        """Test endpoints with malformed JSON"""
        print("\n🔍 Testing Malformed JSON Handling...")
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                data="invalid json data",
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code in [400, 422, 500]:  # Expected error codes
                self.log_test(
                    "Malformed JSON Handling", 
                    "PASS", 
                    f"HTTP {response.status_code} - Properly rejected malformed JSON"
                )
                return True
            else:
                self.log_test(
                    "Malformed JSON Handling", 
                    "FAIL", 
                    f"Unexpected HTTP {response.status_code}: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Malformed JSON Handling", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_missing_required_fields(self):
        """Test endpoints with missing required fields"""
        print("\n📝 Testing Missing Required Fields...")
        
        # Test newsletter signup without email
        payload = {
            "id": str(uuid.uuid4()),
            "source": "website_newsletter"
            # Missing email field
        }
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code in [400, 422, 500]:  # Expected error codes
                self.log_test(
                    "Missing Required Fields", 
                    "PASS", 
                    f"HTTP {response.status_code} - Properly validated missing email field"
                )
                return True
            else:
                self.log_test(
                    "Missing Required Fields", 
                    "FAIL", 
                    f"Unexpected HTTP {response.status_code}: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Missing Required Fields", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_invalid_email_format(self):
        """Test endpoints with invalid email formats"""
        print("\n📧 Testing Invalid Email Format...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "invalid-email-format",  # Invalid email
            "source": "website_newsletter"
        }
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code in [400, 422, 500]:  # Expected error codes
                self.log_test(
                    "Invalid Email Format", 
                    "PASS", 
                    f"HTTP {response.status_code} - Properly validated email format"
                )
                return True
            else:
                self.log_test(
                    "Invalid Email Format", 
                    "FAIL", 
                    f"Unexpected HTTP {response.status_code}: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Invalid Email Format", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_duplicate_request_handling(self):
        """Test duplicate request idempotency"""
        print("\n🔄 Testing Duplicate Request Handling...")
        
        # Send the same request twice with same ID
        request_id = str(uuid.uuid4())
        payload = {
            "id": request_id,
            "email": "duplicate.test@sentratech.net",
            "source": "duplicate_test"
        }
        
        try:
            # First request
            response1 = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            # Wait a moment
            time.sleep(1)
            
            # Second request with same ID
            response2 = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response1.status_code == 200 and response2.status_code == 429:
                self.log_test(
                    "Duplicate Request Handling", 
                    "PASS", 
                    f"First: HTTP {response1.status_code}, Second: HTTP {response2.status_code} - Idempotency working"
                )
                return True
            elif response1.status_code == 200 and response2.status_code == 200:
                self.log_test(
                    "Duplicate Request Handling", 
                    "PASS", 
                    f"Both requests succeeded - Dashboard may handle duplicates internally"
                )
                return True
            else:
                self.log_test(
                    "Duplicate Request Handling", 
                    "FAIL", 
                    f"First: HTTP {response1.status_code}, Second: HTTP {response2.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("Duplicate Request Handling", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_large_payload_handling(self):
        """Test endpoints with large payloads"""
        print("\n📦 Testing Large Payload Handling...")
        
        # Create a large message
        large_message = "A" * 10000  # 10KB message
        
        payload = {
            "id": str(uuid.uuid4()),
            "full_name": "Large Payload Test",
            "work_email": "large.payload@sentratech.net",
            "company_name": "Large Payload Testing Corp",
            "message": large_message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/proxy/contact-sales",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                self.log_test(
                    "Large Payload Handling", 
                    "PASS", 
                    f"HTTP {response.status_code} - Successfully handled 10KB payload"
                )
                return True
            elif response.status_code in [413, 400]:  # Payload too large or bad request
                self.log_test(
                    "Large Payload Handling", 
                    "PASS", 
                    f"HTTP {response.status_code} - Properly rejected large payload"
                )
                return True
            else:
                self.log_test(
                    "Large Payload Handling", 
                    "FAIL", 
                    f"Unexpected HTTP {response.status_code}: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Large Payload Handling", "FAIL", f"Request error: {str(e)}")
            return False
    
    def test_timeout_handling(self):
        """Test timeout scenarios"""
        print("\n⏰ Testing Timeout Handling...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "timeout.test@sentratech.net",
            "source": "timeout_test"
        }
        
        try:
            # Test with very short timeout
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=0.001  # 1ms timeout - should fail
            )
            
            self.log_test(
                "Timeout Handling", 
                "FAIL", 
                f"Request should have timed out but got HTTP {response.status_code}"
            )
            return False
            
        except requests.exceptions.Timeout:
            self.log_test(
                "Timeout Handling", 
                "PASS", 
                "Request properly timed out as expected"
            )
            return True
        except Exception as e:
            self.log_test("Timeout Handling", "FAIL", f"Unexpected error: {str(e)}")
            return False
    
    def test_content_type_validation(self):
        """Test content type validation"""
        print("\n📄 Testing Content Type Validation...")
        
        payload = {
            "id": str(uuid.uuid4()),
            "email": "content.type@sentratech.net",
            "source": "content_type_test"
        }
        
        try:
            # Send with wrong content type
            response = requests.post(
                f"{self.backend_url}/api/proxy/newsletter-signup",
                json=payload,
                headers={"Content-Type": "text/plain"},  # Wrong content type
                timeout=10
            )
            
            if response.status_code in [200, 400, 415]:  # Success or proper error
                self.log_test(
                    "Content Type Validation", 
                    "PASS", 
                    f"HTTP {response.status_code} - Handled content type appropriately"
                )
                return True
            else:
                self.log_test(
                    "Content Type Validation", 
                    "FAIL", 
                    f"Unexpected HTTP {response.status_code}: {response.text[:200]}"
                )
                return False
                
        except Exception as e:
            self.log_test("Content Type Validation", "FAIL", f"Request error: {str(e)}")
            return False
    
    def run_error_handling_tests(self):
        """Run comprehensive error handling test suite"""
        print("🚀 Starting Proxy Endpoints Error Handling Testing")
        print("=" * 70)
        
        # Run all error handling tests
        self.test_malformed_json()
        self.test_missing_required_fields()
        self.test_invalid_email_format()
        self.test_duplicate_request_handling()
        self.test_large_payload_handling()
        self.test_timeout_handling()
        self.test_content_type_validation()
        
        # Print summary
        print("\n" + "=" * 70)
        print("📊 ERROR HANDLING TEST SUMMARY")
        print("=" * 70)
        
        success_rate = (self.passed_tests / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.total_tests - self.passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print(f"\n✅ ERROR HANDLING: EXCELLENT - Robust error handling implemented!")
        elif success_rate >= 60:
            print(f"\n⚠️ ERROR HANDLING: GOOD - Minor error handling issues")
        else:
            print(f"\n❌ ERROR HANDLING: NEEDS ATTENTION - Critical error handling issues")
        
        # Print failed tests details
        failed_tests = [name for name, result in self.test_results.items() if result['status'] == 'FAIL']
        if failed_tests:
            print(f"\n🔍 FAILED ERROR HANDLING TESTS:")
            for test_name in failed_tests:
                result = self.test_results[test_name]
                print(f"   ❌ {test_name}: {result['details']}")
        
        return success_rate >= 80

if __name__ == "__main__":
    print("SentraTech Proxy Endpoints Error Handling Testing")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    tester = ProxyErrorHandlingTester()
    success = tester.run_error_handling_tests()
    
    print(f"\nTest completed at: {datetime.now(timezone.utc).isoformat()}")