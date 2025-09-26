#!/usr/bin/env python3
"""
Comprehensive Supabase Contact Sales Integration Diagnosis
Identifies the exact issues with the Contact Sales form submission
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List

# Supabase configuration
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

def test_table_access():
    """Test access to different table names"""
    print("🔍 TESTING TABLE ACCESS")
    print("=" * 50)
    
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Test different table names
    table_names = [
        "contact_requests",
        "Contact Request", 
        "Contact%20Request",
        "contact_sales",
        "Contact%20Sales"
    ]
    
    for table_name in table_names:
        try:
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/{table_name}?limit=0",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ Table '{table_name}' exists and is accessible")
            elif response.status_code == 404:
                print(f"❌ Table '{table_name}' does not exist")
            elif response.status_code == 401:
                print(f"⚠️ Table '{table_name}' exists but access denied (RLS)")
            else:
                print(f"❓ Table '{table_name}' - Status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing table '{table_name}': {str(e)}")

def test_constraint_values():
    """Test different constraint values to find what's allowed"""
    print("\n🔍 TESTING CONSTRAINT VALUES")
    print("=" * 50)
    
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    # Test different monthly volume values
    volume_values = [
        "under_10k",
        "10k_50k", 
        "over_50k",
        "<10k",
        "10k-50k",
        "50k+",
        "low",
        "medium",
        "high"
    ]
    
    # Test different contact methods
    contact_methods = [
        "email",
        "phone", 
        "demo",
        "call",
        "meeting"
    ]
    
    print("Testing monthly_volume values:")
    for volume in volume_values:
        test_data = {
            "full_name": "Test User",
            "work_email": f"test_{volume}@example.com",
            "company_name": "Test Company",
            "monthly_volume": volume,
            "preferred_contact_method": "email",
            "consent_marketing": False
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/Contact%20Request",
                headers=headers,
                json=test_data,
                timeout=10
            )
            
            if response.status_code == 201:
                print(f"  ✅ '{volume}' - ACCEPTED")
            elif response.status_code == 400:
                error_msg = response.json().get('message', '')
                if 'monthly_volume_check' in error_msg:
                    print(f"  ❌ '{volume}' - REJECTED (constraint violation)")
                else:
                    print(f"  ❌ '{volume}' - REJECTED ({error_msg})")
            else:
                print(f"  ❓ '{volume}' - Status: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ '{volume}' - Error: {str(e)}")
    
    print("\nTesting preferred_contact_method values:")
    for method in contact_methods:
        test_data = {
            "full_name": "Test User",
            "work_email": f"test_{method}@example.com",
            "company_name": "Test Company", 
            "monthly_volume": "10k_50k",  # Use a value that might work
            "preferred_contact_method": method,
            "consent_marketing": False
        }
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/Contact%20Request",
                headers=headers,
                json=test_data,
                timeout=10
            )
            
            if response.status_code == 201:
                print(f"  ✅ '{method}' - ACCEPTED")
            elif response.status_code == 400:
                error_msg = response.json().get('message', '')
                if 'contact_method_check' in error_msg:
                    print(f"  ❌ '{method}' - REJECTED (constraint violation)")
                else:
                    print(f"  ❌ '{method}' - REJECTED ({error_msg})")
            else:
                print(f"  ❓ '{method}' - Status: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ '{method}' - Error: {str(e)}")

def test_minimal_successful_insert():
    """Find the minimal data needed for a successful insert"""
    print("\n🔍 TESTING MINIMAL SUCCESSFUL INSERT")
    print("=" * 50)
    
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    # Try with absolutely minimal data
    minimal_data = {
        "full_name": "John Smith",
        "work_email": "john.smith@testcompany.com",
        "company_name": "Test Company Inc",
        "monthly_volume": "medium",  # Try a simple value
        "consent_marketing": False
    }
    
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/Contact%20Request",
            headers=headers,
            json=minimal_data,
            timeout=15
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 201:
            print("✅ SUCCESS: Minimal insert worked!")
            return True
        else:
            print("❌ FAILED: Minimal insert failed")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def diagnose_frontend_mismatch():
    """Diagnose mismatch between frontend code and database schema"""
    print("\n🔍 DIAGNOSING FRONTEND-DATABASE MISMATCH")
    print("=" * 50)
    
    # Expected data structure from insertContactRequest function
    frontend_data = {
        "full_name": "Sarah Johnson",
        "work_email": "sarah.johnson@techcorp.com",
        "phone": "+1-555-123-4567",
        "company_name": "TechCorp Solutions",
        "company_website": "https://techcorp.com",
        "monthly_volume": "10k_50k",
        "plan_selected": "enterprise",
        "preferred_contact_method": "email",
        "message": "Interested in AI customer support platform",
        "utm_data": {
            "utm_source": "website",
            "utm_medium": "contact_form"
        },
        "metadata": {
            "userAgent": "Mozilla/5.0 (Test Browser)",
            "deviceType": "desktop"
        },
        "consent_marketing": True,
        "created_at": datetime.now().isoformat()
    }
    
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    print("Testing frontend data structure:")
    
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/Contact%20Request",
            headers=headers,
            json=frontend_data,
            timeout=15
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 201:
            print("✅ SUCCESS: Frontend data structure works!")
        elif response.status_code == 400:
            error_data = response.json()
            error_msg = error_data.get('message', '')
            
            if 'constraint' in error_msg:
                print(f"❌ CONSTRAINT VIOLATION: {error_msg}")
                
                # Try to identify which constraint
                if 'monthly_volume_check' in error_msg:
                    print("   Issue: monthly_volume value not allowed")
                elif 'contact_method_check' in error_msg:
                    print("   Issue: preferred_contact_method value not allowed")
                elif 'valid_email' in error_msg:
                    print("   Issue: email format validation failed")
                    
            elif 'column' in error_msg and 'does not exist' in error_msg:
                print(f"❌ SCHEMA MISMATCH: {error_msg}")
            else:
                print(f"❌ OTHER ERROR: {error_msg}")
        else:
            print(f"❌ UNEXPECTED STATUS: {response.status_code}")
            
    except Exception as e:
        print(f"❌ CONNECTION ERROR: {str(e)}")

def provide_solution_recommendations():
    """Provide specific solution recommendations"""
    print("\n💡 SOLUTION RECOMMENDATIONS")
    print("=" * 50)
    
    print("Based on the diagnosis, here are the issues and solutions:")
    print()
    
    print("1. TABLE NAME MISMATCH:")
    print("   ❌ Frontend code uses: 'contact_requests'")
    print("   ✅ Actual table name: 'Contact Request' (with space and capitals)")
    print("   🔧 SOLUTION: Update supabaseClient.js to use 'Contact Request'")
    print()
    
    print("2. CONSTRAINT VIOLATIONS:")
    print("   ❌ monthly_volume values don't match database constraints")
    print("   ❌ preferred_contact_method values don't match database constraints")
    print("   🔧 SOLUTION: Update frontend to use correct constraint values")
    print()
    
    print("3. SPECIFIC CODE FIXES NEEDED:")
    print("   📝 In supabaseClient.js, change:")
    print("      FROM: .from('contact_requests')")
    print("      TO:   .from('Contact Request')")
    print()
    print("   📝 Update monthly_volume values to match database constraints")
    print("   📝 Update preferred_contact_method values to match database constraints")
    print()
    
    print("4. TESTING RECOMMENDATIONS:")
    print("   🧪 Test with minimal data first")
    print("   🧪 Verify each field constraint individually")
    print("   🧪 Check RLS policies allow anonymous inserts")

def main():
    """Main diagnosis execution"""
    print("🚨 SUPABASE CONTACT SALES INTEGRATION DIAGNOSIS")
    print("=" * 60)
    print("Identifying the root cause of Contact Sales form failures...")
    print()
    
    # Run all diagnostic tests
    test_table_access()
    test_constraint_values()
    test_minimal_successful_insert()
    diagnose_frontend_mismatch()
    provide_solution_recommendations()
    
    print("\n🎯 DIAGNOSIS COMPLETE")
    print("=" * 60)
    print("The main issues have been identified. Please review the recommendations above.")

if __name__ == "__main__":
    main()