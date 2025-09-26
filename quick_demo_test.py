#!/usr/bin/env python3
"""
Quick test for Demo Request endpoints after fixes
"""

import requests
import json

BACKEND_URL = "https://sleek-support.preview.emergentagent.com/api"

def test_demo_request_json():
    """Test JSON endpoint"""
    print("Testing JSON endpoint...")
    
    request_data = {
        "name": "Test User",
        "email": "test@example.com",
        "company": "Test Company",
        "phone": "+1-555-0123",
        "message": "Test message"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/demo/request", json=request_data, timeout=20)
        print(f"JSON Endpoint Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result.get('success')}")
            print(f"Reference ID: {result.get('reference_id')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

def test_demo_request_form():
    """Test form endpoint"""
    print("\nTesting form endpoint...")
    
    form_data = {
        "name": "Form Test User",
        "email": "formtest@example.com", 
        "company": "Form Test Company",
        "phone": "+1-555-0456",
        "message": "Form test message"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/demo-request", data=form_data, timeout=20)
        print(f"Form Endpoint Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Status: {result.get('status')}")
            print(f"Request ID: {result.get('requestId')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

if __name__ == "__main__":
    print("🔍 Quick Demo Request Test")
    print("=" * 40)
    
    test_demo_request_json()
    test_demo_request_form()
    
    print("\n" + "=" * 40)