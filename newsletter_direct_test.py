#!/usr/bin/env python3
"""
Direct Newsletter Subscription Test
Test the exact payload from review request to identify validation issues
"""

import requests
import json
import time
import uuid
from datetime import datetime, timezone

# Backend URL from frontend .env
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com"

def test_newsletter_direct():
    """Test newsletter with exact payload from review request"""
    print("📧 Testing Newsletter Subscription with Sample Email")
    print("=" * 60)
    
    # Exact payload from review request
    payload = {
        "email": "test@gmail.com"
    }
    
    print(f"📋 Payload: {json.dumps(payload, indent=2)}")
    print(f"🌐 URL: {BACKEND_URL}/api/proxy/newsletter-signup")
    
    try:
        start_time = time.time()
        response = requests.post(
            f"{BACKEND_URL}/api/proxy/newsletter-signup",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        response_time = (time.time() - start_time) * 1000
        
        print(f"\n📊 RESPONSE ANALYSIS:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response Time: {response_time:.2f}ms")
        print(f"   Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"   Response Body (JSON):")
            print(json.dumps(response_data, indent=4))
        except:
            print(f"   Response Body (Raw): {response.text}")
        
        # Analyze the response
        if response.status_code == 200:
            print(f"\n✅ SUCCESS: Newsletter subscription working correctly")
            try:
                data = response.json()
                dashboard_id = data.get('id') or data.get('data', {}).get('id')
                if dashboard_id:
                    print(f"   Dashboard ID: {dashboard_id}")
                else:
                    print(f"   No Dashboard ID found in response")
            except:
                pass
        elif response.status_code == 422:
            print(f"\n❌ VALIDATION ERROR: Similar to ROI calculator bundles issue")
            try:
                error_data = response.json()
                print(f"   Validation Details:")
                for error in error_data.get('detail', []):
                    print(f"     - Field: {error.get('loc', 'unknown')}")
                    print(f"     - Error: {error.get('msg', 'unknown')}")
                    print(f"     - Type: {error.get('type', 'unknown')}")
            except:
                pass
        elif response.status_code == 500:
            print(f"\n❌ SERVER ERROR: Internal processing issue")
        else:
            print(f"\n⚠️ UNEXPECTED RESPONSE: HTTP {response.status_code}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"\n💥 REQUEST FAILED: {str(e)}")
        return False

def test_newsletter_with_id():
    """Test newsletter with ID field to match other working endpoints"""
    print("\n📧 Testing Newsletter Subscription with ID Field")
    print("=" * 60)
    
    payload = {
        "id": str(uuid.uuid4()),
        "email": "test@gmail.com",
        "source": "website_newsletter",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    print(f"📋 Payload: {json.dumps(payload, indent=2)}")
    
    try:
        start_time = time.time()
        response = requests.post(
            f"{BACKEND_URL}/api/proxy/newsletter-signup",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        response_time = (time.time() - start_time) * 1000
        
        print(f"\n📊 RESPONSE ANALYSIS:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response Time: {response_time:.2f}ms")
        
        try:
            response_data = response.json()
            print(f"   Response Body (JSON):")
            print(json.dumps(response_data, indent=4))
        except:
            print(f"   Response Body (Raw): {response.text}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"\n💥 REQUEST FAILED: {str(e)}")
        return False

def compare_with_working_endpoint():
    """Compare with ROI calculator that was recently fixed"""
    print("\n🔄 Comparing with Working ROI Calculator Endpoint")
    print("=" * 60)
    
    # Test ROI calculator (known working after recent fix)
    roi_payload = {
        "email": "test@gmail.com",
        "country": "Philippines",
        "call_volume": 3232,
        "interaction_volume": 232323,
        "bundles": 91.34392307692308  # This was the problematic field that was fixed
    }
    
    print(f"📋 ROI Payload: {json.dumps(roi_payload, indent=2)}")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/proxy/roi-calculator",
            json=roi_payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"\n📊 ROI CALCULATOR RESPONSE:")
        print(f"   Status Code: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"   Response Body (JSON):")
            print(json.dumps(response_data, indent=4))
        except:
            print(f"   Response Body (Raw): {response.text}")
        
        if response.status_code == 200:
            print(f"   ✅ ROI Calculator working correctly (reference)")
        else:
            print(f"   ❌ ROI Calculator also has issues")
        
    except Exception as e:
        print(f"\n💥 ROI REQUEST FAILED: {str(e)}")

if __name__ == "__main__":
    print("🔍 Newsletter Subscription Direct Testing")
    print("Identifying specific validation issues preventing dashboard integration")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    # Test 1: Basic newsletter with sample email
    success1 = test_newsletter_direct()
    
    # Test 2: Newsletter with full payload
    success2 = test_newsletter_with_id()
    
    # Test 3: Compare with working endpoint
    compare_with_working_endpoint()
    
    print(f"\n🏁 TESTING COMPLETE")
    print(f"Basic Newsletter: {'✅ PASS' if success1 else '❌ FAIL'}")
    print(f"Full Newsletter: {'✅ PASS' if success2 else '❌ FAIL'}")
    
    if not success1 and not success2:
        print(f"\n🚨 CRITICAL ISSUE: Newsletter endpoint completely broken")
        print(f"   Similar to ROI calculator bundles issue that was recently fixed")
        print(f"   Requires immediate investigation and fix")
    elif success1 or success2:
        print(f"\n✅ PARTIAL SUCCESS: Newsletter endpoint working with some payloads")
    else:
        print(f"\n✅ SUCCESS: Newsletter endpoint working correctly")