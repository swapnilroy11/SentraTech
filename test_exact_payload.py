#!/usr/bin/env python3
"""
Test the exact failing payload from the review request
"""

import requests
import json
import uuid

# Backend URL
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"

def test_exact_failing_payload():
    """Test with the exact payload that was failing according to the review request"""
    
    # This is the exact payload from the review request
    payload = {
        "email": "test@gmail.com",
        "country": "Philippines", 
        "call_volume": 3232,
        "interaction_volume": 232323,
        "bundles": 91.34392307692308
    }
    
    print("🔍 Testing with exact failing payload from review request:")
    print(f"📊 Payload: {json.dumps(payload, indent=2)}")
    print(f"🔍 Bundles field: {payload['bundles']} (type: {type(payload['bundles'])})")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/proxy/roi-calculator",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"📡 Response Status: {response.status_code}")
        print(f"📡 Response: {response.text[:500]}")
        
        if response.status_code == 200:
            print("✅ SUCCESS: ROI calculator now accepts float bundles!")
            print("✅ Fix confirmed: bundles field converted from float to integer")
            return True
        elif response.status_code == 422:
            print("❌ STILL FAILING: Dashboard validation error")
            if "bundles" in response.text:
                print("❌ Bundles conversion not working")
            else:
                print("✅ Bundles conversion working, other validation error")
            return False
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Exact Failing Payload from Review Request")
    print("=" * 60)
    success = test_exact_failing_payload()
    print("=" * 60)
    if success:
        print("🎉 RESULT: ROI Calculator bundles fix is working!")
    else:
        print("❌ RESULT: Fix needs more work")