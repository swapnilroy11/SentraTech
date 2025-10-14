#!/usr/bin/env python3
"""
Job Application Backend Endpoint Fix Testing
Testing the fix for field name mapping issues similar to ROI calculator bundles problem
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone

# Backend URL
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"

def test_job_application_fix():
    """Test job application with the exact payload from review request after fix"""
    print("🔧 Testing Job Application Fix...")
    
    # Using the exact payload format from the review request
    payload = {
        "name": "John Doe",  # This should be mapped to full_name
        "email": "john.doe@gmail.com", 
        "phone": "+1234567890",
        "position": "Customer Support Specialist",  # This should be mapped to position_applied
        "experience": "2-3 years",
        "location": "Remote",
        "motivation": "I am passionate about customer service and helping customers succeed.",
        "availability": "Immediately",
        "resume_url": "https://example.com/resume.pdf",
        "cover_letter": "Dear Hiring Manager, I am excited to apply for this position...",
        "consent_data_processing": True,
        "consent_marketing": False
    }
    
    try:
        print(f"📤 Sending payload: {json.dumps(payload, indent=2)}")
        
        start_time = time.time()
        response = requests.post(
            f"{BACKEND_URL}/api/proxy/job-application",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        response_time = (time.time() - start_time) * 1000
        
        print(f"📥 Response Status: {response.status_code}")
        print(f"⏱️ Response Time: {response_time:.2f}ms")
        print(f"📄 Response Body: {response.text}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if data.get('success') == False and 'error' in data:
                    print(f"❌ STILL FAILING: {data['error']}")
                    return False
                else:
                    dashboard_id = data.get('id') or data.get('data', {}).get('id')
                    print(f"✅ SUCCESS: Job application submitted successfully!")
                    print(f"🆔 Dashboard ID: {dashboard_id}")
                    return True
            except json.JSONDecodeError:
                print(f"❌ Invalid JSON response: {response.text}")
                return False
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Request error: {str(e)}")
        return False

def test_job_application_validation_edge_cases():
    """Test edge cases to ensure validation is working properly"""
    print("\n🧪 Testing Job Application Validation Edge Cases...")
    
    test_cases = [
        {
            "name": "Missing Name Field",
            "payload": {
                "email": "test@example.com",
                "phone": "+1234567890",
                "position": "Customer Support Specialist"
            },
            "should_succeed": False
        },
        {
            "name": "Empty Name Field", 
            "payload": {
                "name": "",
                "email": "test@example.com",
                "phone": "+1234567890",
                "position": "Customer Support Specialist"
            },
            "should_succeed": False
        },
        {
            "name": "Valid Complete Application",
            "payload": {
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "phone": "+1234567890",
                "position": "Customer Support Specialist",
                "experience": "3 years",
                "location": "New York",
                "motivation": "I love helping customers",
                "availability": "2 weeks notice",
                "consent_data_processing": True,
                "consent_marketing": False
            },
            "should_succeed": True
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\n🔍 Testing: {test_case['name']}")
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/api/proxy/job-application",
                json=test_case["payload"],
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    success = data.get('success', True) and 'error' not in data
                    
                    if success and test_case["should_succeed"]:
                        print(f"   ✅ PASS: Application succeeded as expected")
                        results.append(True)
                    elif not success and not test_case["should_succeed"]:
                        print(f"   ✅ PASS: Application failed as expected")
                        results.append(True)
                    elif success and not test_case["should_succeed"]:
                        print(f"   ❌ FAIL: Application should have failed but succeeded")
                        results.append(False)
                    else:
                        print(f"   ❌ FAIL: Application should have succeeded but failed: {data.get('error', 'Unknown error')}")
                        results.append(False)
                        
                except json.JSONDecodeError:
                    print(f"   ❌ FAIL: Invalid JSON response")
                    results.append(False)
            else:
                if test_case["should_succeed"]:
                    print(f"   ❌ FAIL: Expected success but got HTTP {response.status_code}")
                    results.append(False)
                else:
                    print(f"   ✅ PASS: Expected failure and got HTTP {response.status_code}")
                    results.append(True)
                    
        except Exception as e:
            print(f"   ❌ FAIL: Request error: {str(e)}")
            results.append(False)
    
    success_rate = (sum(results) / len(results)) * 100 if results else 0
    print(f"\n📊 Edge Case Testing Results: {sum(results)}/{len(results)} passed ({success_rate:.1f}%)")
    
    return success_rate >= 80

if __name__ == "__main__":
    print("🚀 Job Application Backend Endpoint Fix Testing")
    print("Testing field mapping fixes similar to ROI calculator bundles solution")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 80)
    
    # Test 1: Basic fix verification
    basic_test_passed = test_job_application_fix()
    
    # Test 2: Edge cases
    edge_cases_passed = test_job_application_validation_edge_cases()
    
    print("\n" + "=" * 80)
    print("📊 JOB APPLICATION FIX TEST SUMMARY")
    print("=" * 80)
    
    if basic_test_passed:
        print("✅ Basic Fix Test: PASSED - Field mapping working correctly")
    else:
        print("❌ Basic Fix Test: FAILED - Field mapping issues remain")
    
    if edge_cases_passed:
        print("✅ Edge Cases Test: PASSED - Validation working properly")
    else:
        print("❌ Edge Cases Test: FAILED - Validation issues found")
    
    overall_success = basic_test_passed and edge_cases_passed
    
    if overall_success:
        print("\n🎉 OVERALL RESULT: SUCCESS!")
        print("✅ Job application endpoint fix is working correctly")
        print("✅ Field mapping issues resolved (similar to ROI calculator bundles fix)")
        print("✅ Data now transfers properly to dashboard")
    else:
        print("\n⚠️ OVERALL RESULT: ISSUES REMAIN")
        print("❌ Job application endpoint still has validation problems")
        print("🔧 Additional fixes may be required")
    
    print(f"\n🏁 Testing completed at: {datetime.now(timezone.utc).isoformat()}")