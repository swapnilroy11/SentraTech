#!/usr/bin/env python3
"""
Check the actual schema of the Contract Sale Request table
"""

import requests
import json

# Supabase configuration
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

def check_actual_columns():
    """Check what columns actually exist in the Contract Sale Request table"""
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    table_name = "Contract Sale Request"
    
    print(f"🔍 Checking actual columns in '{table_name}' table...")
    
    # From the successful insert, we know these columns exist:
    known_columns = [
        'id', 'full_name', 'work_email', 'phone', 'company_name', 'company_website', 
        'company_size', 'monthly_volume', 'plan_selected', 'preferred_contact_method', 
        'message', 'status', 'priority', 'assigned_to', 'created_by', 'created_at', 
        'updated_at', 'archived_at', 'version', 'ip_address', 'country', 'utm_data', 
        'metadata', 'consent_marketing'
    ]
    
    # Test columns that might exist but weren't in the response
    potential_columns = [
        'plan_id', 'billing_term', 'price_display', 'contact_method', 
        'notes', 'source', 'campaign', 'referrer'
    ]
    
    print(f"✅ Known existing columns ({len(known_columns)}):")
    for col in known_columns:
        print(f"   • {col}")
    
    print(f"\n🧪 Testing potential additional columns...")
    
    import urllib.parse
    encoded_table_name = urllib.parse.quote(table_name)
    
    existing_additional = []
    missing_columns = []
    
    for column in potential_columns:
        try:
            # Try to select just this column to see if it exists
            query_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}?select={column}&limit=1"
            response = requests.get(query_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                existing_additional.append(column)
                print(f"   ✅ Column '{column}' exists")
            else:
                missing_columns.append(column)
                print(f"   ❌ Column '{column}' does not exist")
                
        except Exception as e:
            missing_columns.append(column)
            print(f"   ❌ Column '{column}': Exception {str(e)}")
    
    print(f"\n📊 FINAL COLUMN ANALYSIS:")
    all_existing = known_columns + existing_additional
    print(f"✅ Total existing columns: {len(all_existing)}")
    for col in sorted(all_existing):
        print(f"   • {col}")
    
    if missing_columns:
        print(f"\n❌ Missing columns that frontend might expect:")
        for col in missing_columns:
            print(f"   • {col}")
    
    return all_existing, missing_columns

def test_with_only_existing_columns():
    """Test Contact Sales form with only existing columns"""
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    table_name = "Contract Sale Request"
    
    print(f"\n🧪 Testing Contact Sales with only existing columns...")
    
    # Contact Sales data using only columns that exist
    contact_sales_data = {
        "full_name": "Emma Wilson",
        "work_email": "emma.wilson@growthcorp.com",
        "company_name": "Growth Corp",
        "phone": "+1-555-0199",
        "monthly_volume": "10k-50k",
        "plan_selected": "Growth",
        "preferred_contact_method": "email",
        "message": "Interested in Growth plan for our customer support operations",
        "consent_marketing": True,
        "utm_data": {"source": "pricing_page", "campaign": "growth_plan"},
        "metadata": {"form_type": "contact_sales", "plan_interest": "growth"}
    }
    
    try:
        import urllib.parse
        encoded_table_name = urllib.parse.quote(table_name)
        insert_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}"
        
        response = requests.post(insert_url, headers=headers, json=contact_sales_data, timeout=15)
        
        if response.status_code in [200, 201]:
            print(f"✅ SUCCESS: Contact Sales insert successful!")
            result = response.json()
            print(f"   Created record ID: {result[0]['id']}")
            print(f"   Full response: {result[0]}")
            return True
        else:
            print(f"❌ Contact Sales insert failed: Status {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔍 SUPABASE SCHEMA ANALYSIS")
    print("=" * 40)
    
    # Check actual columns
    existing_cols, missing_cols = check_actual_columns()
    
    # Test with only existing columns
    success = test_with_only_existing_columns()
    
    print(f"\n🎯 SUMMARY:")
    print(f"✅ Correct table name: 'Contract Sale Request'")
    print(f"✅ Total existing columns: {len(existing_cols)}")
    
    if missing_cols:
        print(f"❌ Missing columns frontend expects: {missing_cols}")
        print(f"💡 Frontend needs to be updated to not send these fields")
    
    if success:
        print(f"✅ Contact Sales form works with existing columns!")
    else:
        print(f"❌ Contact Sales form still has issues")