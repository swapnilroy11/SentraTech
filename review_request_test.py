#!/usr/bin/env python3
"""
Review Request Specific Test
Tests the exact scenario from the review request with the specified test data
"""

import requests
import json
import time
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://customer-flow-5.preview.emergentagent.com/api"

def test_review_request_scenario():
    """Test the exact scenario from the review request"""
    print("🎯 Testing Review Request Scenario")
    print("=" * 60)
    
    # Exact test data from review request (with valid email domain)
    test_data = {
        "name": "Updated Schema Test",  # Should map to user_name column
        "email": "updated@example.com",  # Changed from .test to .com for validation
        "company": "Updated Schema Company",
        "phone": "+1555123456",
        "call_volume": "35,000",
        "interaction_volume": "50,000",
        "message": "Testing updated schema with user_name column"
    }
    
    print("📝 Test Data (from review request):")
    print(f"   user_name: '{test_data['name']}'")
    print(f"   email: '{test_data['email']}'")
    print(f"   company: '{test_data['company']}'")
    print(f"   phone: '{test_data['phone']}'")
    print(f"   call_volume: '{test_data['call_volume']}'")
    print(f"   interaction_volume: '{test_data['interaction_volume']}'")
    print(f"   message: '{test_data['message']}'")
    print()
    
    try:
        print("🚀 Submitting demo request...")
        response = requests.post(f"{BACKEND_URL}/demo/request", json=test_data, timeout=30)
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS: Demo request submitted successfully!")
            print(f"📋 Response Details:")
            print(f"   Success: {result.get('success')}")
            print(f"   Message: {result.get('message')}")
            print(f"   Reference ID: {result.get('reference_id')}")
            print(f"   Status: {result.get('status')}")
            
            # Check integration status
            integration_status = result.get('integration_status', {})
            print(f"📊 Integration Status:")
            print(f"   Database: {'✅ Success' if integration_status.get('database', {}).get('success') else '❌ Failed'}")
            print(f"   Airtable: {'✅ Success' if integration_status.get('airtable', {}).get('success') else '❌ Failed'}")
            print(f"   Sheets: {'✅ Success' if integration_status.get('sheets', {}).get('success') else '❌ Failed'}")
            
            # Verify data persistence
            print("\n🔍 Verifying data persistence...")
            time.sleep(2)  # Wait for background processing
            
            try:
                verify_response = requests.get(f"{BACKEND_URL}/demo/requests?limit=10", timeout=15)
                if verify_response.status_code == 200:
                    verify_result = verify_response.json()
                    if verify_result.get("success") and verify_result.get("requests"):
                        # Look for our test request
                        found_request = None
                        for req in verify_result["requests"]:
                            if req.get("email") == test_data["email"]:
                                found_request = req
                                break
                        
                        if found_request:
                            print("✅ Data persistence verified!")
                            print(f"📋 Stored Data:")
                            print(f"   Name (user_name): {found_request.get('name')}")
                            print(f"   Email: {found_request.get('email')}")
                            print(f"   Company: {found_request.get('company')}")
                            print(f"   Phone: {found_request.get('phone')}")
                            print(f"   Call Volume: {found_request.get('call_volume')}")
                            print(f"   Interaction Volume: {found_request.get('interaction_volume')}")
                            print(f"   Message: {found_request.get('message')[:50]}...")
                            
                            # Verify all expected fields are present and correct
                            verification_results = []
                            verification_results.append(("user_name mapping", found_request.get('name') == test_data['name']))
                            verification_results.append(("email", found_request.get('email') == test_data['email']))
                            verification_results.append(("company", found_request.get('company') == test_data['company']))
                            verification_results.append(("phone", found_request.get('phone') == test_data['phone']))
                            verification_results.append(("call_volume", found_request.get('call_volume') == test_data['call_volume']))
                            verification_results.append(("interaction_volume", found_request.get('interaction_volume') == test_data['interaction_volume']))
                            verification_results.append(("message", test_data['message'] in found_request.get('message', '')))
                            
                            print(f"\n📊 Field Verification:")
                            all_correct = True
                            for field_name, is_correct in verification_results:
                                status = "✅" if is_correct else "❌"
                                print(f"   {status} {field_name}: {'Correct' if is_correct else 'Incorrect'}")
                                if not is_correct:
                                    all_correct = False
                            
                            if all_correct:
                                print("\n🎉 PERFECT: All fields correctly stored with updated schema!")
                                print("✅ user_name column mapping working correctly")
                                print("✅ Volume fields (call_volume, interaction_volume) working correctly")
                                print("✅ Message field working correctly")
                                print("✅ No schema cache errors detected")
                                return True
                            else:
                                print("\n⚠️ Some field verification issues detected")
                                return False
                        else:
                            print("❌ Test request not found in stored data")
                            return False
                    else:
                        print("❌ Could not retrieve stored requests for verification")
                        return False
                else:
                    print(f"❌ Verification request failed: HTTP {verify_response.status_code}")
                    return False
            except Exception as e:
                print(f"❌ Verification error: {str(e)}")
                return False
            
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")
        return False

def main():
    """Main function"""
    print("🚀 Review Request Specific Testing")
    print("Testing demo request form submission with updated Supabase schema")
    print("Expected: Successful insertion using user_name column (not 'User Name')")
    print()
    
    success = test_review_request_scenario()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 REVIEW REQUEST TEST PASSED!")
        print("✅ Demo request form works with updated Supabase schema")
        print("✅ user_name column mapping successful")
        print("✅ Volume fields properly stored")
        print("✅ Message field properly included")
        print("✅ No column name errors")
        print("✅ Proper success response")
    else:
        print("❌ REVIEW REQUEST TEST FAILED!")
        print("Issues detected with updated schema integration")
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)