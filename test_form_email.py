#!/usr/bin/env python3
"""
Test form endpoint with different email formats
"""

import requests

BACKEND_URL = "https://matrix-team-update.preview.emergentagent.com/api"

def test_form_with_email(email, description):
    """Test form endpoint with specific email"""
    print(f"\nTesting {description}: {email}")
    
    form_data = {
        "name": "Test User",
        "email": email,
        "company": "Test Company"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/demo-request", data=form_data, timeout=15)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result.get('status')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

if __name__ == "__main__":
    print("🔍 Form Email Validation Test")
    print("=" * 40)
    
    # Test different email formats
    test_form_with_email("test@example.com", "Simple email")
    test_form_with_email("user.name@domain.com", "Email with dot")
    test_form_with_email("user+tag@domain.co.uk", "Email with plus and subdomain")
    test_form_with_email("invalid-email", "Invalid email")
    test_form_with_email("", "Empty email")
    
    print("\n" + "=" * 40)