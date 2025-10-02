#!/usr/bin/env python3
"""
Newsletter Validation Issue Testing
Testing why newsletter form accepts invalid email addresses
"""

import requests
import json

# Backend URL
BACKEND_URL = "https://deploy-bug-fixes.preview.emergentagent.com/api"
INGEST_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"

def test_newsletter_validation():
    """Test newsletter validation with various invalid email formats"""
    print("🔍 Testing Newsletter Validation Issue")
    print("=" * 50)
    
    test_cases = [
        {
            "name": "Invalid Email Format 1",
            "data": {"email": "invalid-email-format"},
            "should_fail": True
        },
        {
            "name": "Invalid Email Format 2", 
            "data": {"email": "no-at-symbol"},
            "should_fail": True
        },
        {
            "name": "Invalid Email Format 3",
            "data": {"email": "@missing-local.com"},
            "should_fail": True
        },
        {
            "name": "Invalid Email Format 4",
            "data": {"email": "missing-domain@"},
            "should_fail": True
        },
        {
            "name": "Valid Email",
            "data": {"email": "valid@email.com"},
            "should_fail": False
        },
        {
            "name": "Empty Email",
            "data": {"email": ""},
            "should_fail": True
        },
        {
            "name": "Missing Email Field",
            "data": {"source": "website"},
            "should_fail": True
        }
    ]
    
    headers = {"X-INGEST-KEY": INGEST_KEY}
    
    for test_case in test_cases:
        try:
            print(f"\n📝 Testing: {test_case['name']}")
            print(f"   Data: {json.dumps(test_case['data'])}")
            
            response = requests.post(f"{BACKEND_URL}/ingest/subscriptions", 
                                   json=test_case['data'], headers=headers, timeout=15)
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Body: {response.text}")
            
            if test_case['should_fail']:
                if response.status_code in [400, 422]:
                    print(f"   ✅ CORRECT: Invalid data properly rejected")
                else:
                    print(f"   ❌ ISSUE: Invalid data was accepted (should be rejected)")
            else:
                if response.status_code == 200:
                    print(f"   ✅ CORRECT: Valid data accepted")
                else:
                    print(f"   ❌ ISSUE: Valid data was rejected")
                    
        except Exception as e:
            print(f"   ❌ EXCEPTION: {str(e)}")

if __name__ == "__main__":
    test_newsletter_validation()