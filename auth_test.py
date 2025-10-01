#!/usr/bin/env python3
"""
Authentication Test - Verify X-INGEST-KEY validation
"""

import requests
import json

BACKEND_URL = "https://react-rescue-4.preview.emergentagent.com/api"
VALID_KEY = "a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6"

def test_auth():
    # Valid data structure
    valid_data = {
        "user_name": "Test User",
        "email": "test@example.com",
        "company": "Test Company",
        "message": "Test message"
    }
    
    print("Testing authentication...")
    
    # Test 1: No key
    print("\n1. Testing with no X-INGEST-KEY header:")
    response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", json=valid_data)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text}")
    
    # Test 2: Invalid key
    print("\n2. Testing with invalid X-INGEST-KEY:")
    response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                           json=valid_data, 
                           headers={"X-INGEST-KEY": "invalid-key"})
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text}")
    
    # Test 3: Valid key
    print("\n3. Testing with valid X-INGEST-KEY:")
    response = requests.post(f"{BACKEND_URL}/ingest/demo_requests", 
                           json=valid_data, 
                           headers={"X-INGEST-KEY": VALID_KEY})
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Success: {result.get('status') == 'success'}")
    else:
        print(f"   Response: {response.text}")

if __name__ == "__main__":
    test_auth()