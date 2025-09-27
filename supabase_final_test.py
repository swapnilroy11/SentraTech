#!/usr/bin/env python3
"""
Final test with correct table name and required fields
"""

import requests
import json
from datetime import datetime

# Supabase configuration
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

def test_correct_table_with_required_fields():
    """Test the correct table name with all required fields"""
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Correct table name
    table_name = "Contract Sale Request"
    
    print(f"🧪 Testing '{table_name}' with required fields...")
    
    # Test with monthly_volume field (which is required)
    test_data = {
        "full_name": "Sarah Johnson",
        "work_email": "sarah.johnson@techcorp.com",
        "company_name": "TechCorp Solutions",
        "monthly_volume": "<10k"
    }
    
    try:
        import urllib.parse
        encoded_table_name = urllib.parse.quote(table_name)
        insert_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}"
        
        response = requests.post(insert_url, headers=headers, json=test_data, timeout=15)
        
        if response.status_code in [200, 201]:
            print(f"✅ SUCCESS: Insert successful to '{table_name}'!")
            result = response.json()
            print(f"   Response: {result}")
            return True
        else:
            print(f"❌ Insert failed: Status {response.status_code}")
            print(f"   Error: {response.text}")
            
            # Try to understand what's missing
            try:
                error_json = response.json()
                if "message" in error_json:
                    print(f"   Error message: {error_json['message']}")
                if "details" in error_json:
                    print(f"   Error details: {error_json['details']}")
            except:
                pass
            
            return False
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False

def test_full_contact_sales_data():
    """Test with full Contact Sales form data"""
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    table_name = "Contract Sale Request"
    
    print(f"\n🧪 Testing '{table_name}' with full Contact Sales data...")
    
    # Full Contact Sales form data
    full_data = {
        "full_name": "Michael Chen",
        "work_email": "michael.chen@enterprise.com",
        "company_name": "Enterprise Solutions Inc",
        "phone": "+1-555-0123",
        "monthly_volume": "10k-50k",
        "plan_selected": "Growth",
        "plan_id": "growth",
        "billing_term": "24m",
        "price_display": "$1,650",
        "preferred_contact_method": "email",
        "message": "Interested in Growth plan for our customer support operations",
        "consent_marketing": True
    }
    
    try:
        import urllib.parse
        encoded_table_name = urllib.parse.quote(table_name)
        insert_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}"
        
        response = requests.post(insert_url, headers=headers, json=full_data, timeout=15)
        
        if response.status_code in [200, 201]:
            print(f"✅ SUCCESS: Full Contact Sales data insert successful!")
            result = response.json()
            print(f"   Response: {result}")
            return True
        else:
            print(f"❌ Full data insert failed: Status {response.status_code}")
            print(f"   Error: {response.text}")
            
            # Parse error details
            try:
                error_json = response.json()
                if "message" in error_json:
                    print(f"   Error message: {error_json['message']}")
                if "details" in error_json:
                    print(f"   Error details: {error_json['details']}")
                if "hint" in error_json:
                    print(f"   Hint: {error_json['hint']}")
            except:
                pass
            
            return False
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False

if __name__ == "__main__":
    print("🎯 FINAL SUPABASE CONTACT SALES TEST")
    print("=" * 40)
    print("Testing with correct table name: 'Contract Sale Request'")
    print("=" * 40)
    
    # Test with minimal required fields
    success1 = test_correct_table_with_required_fields()
    
    # Test with full Contact Sales data
    success2 = test_full_contact_sales_data()
    
    if success1 and success2:
        print(f"\n🎉 ALL TESTS PASSED!")
        print(f"✅ Correct table name: 'Contract Sale Request'")
        print(f"✅ Required field: 'monthly_volume' must be provided")
        print(f"✅ Full Contact Sales form data works correctly")
    elif success1:
        print(f"\n⚠️ PARTIAL SUCCESS")
        print(f"✅ Basic insert works with 'Contract Sale Request'")
        print(f"❌ Full Contact Sales data has issues")
    else:
        print(f"\n❌ TESTS FAILED")
        print(f"❌ Issues remain with 'Contract Sale Request' table")