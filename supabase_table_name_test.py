#!/usr/bin/env python3
"""
Test the suggested table name from Supabase error message
"""

import requests
import json
from datetime import datetime

# Supabase configuration
SUPABASE_URL = "https://dwishuwpqyffsmgljrqy.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aXNodXdwcXlmZnNtZ2xqcnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTI3ODksImV4cCI6MjA3NDMyODc4OX0.TDVTSAjMe4RBqcgaC32E9CHY9t3HpFw8EGfJnSOZriQ"

def test_suggested_table_name():
    """Test the suggested table name from Supabase error"""
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Test the suggested table name: "Contract Sale Request"
    suggested_table = "Contract Sale Request"
    
    print(f"🧪 Testing suggested table name: '{suggested_table}'")
    
    # First, try to query the table to see if it exists
    try:
        import urllib.parse
        encoded_table_name = urllib.parse.quote(suggested_table)
        query_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}?select=*&limit=1"
        
        response = requests.get(query_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print(f"✅ SUCCESS: Table '{suggested_table}' exists and is accessible!")
            
            # Try to get the schema by querying all columns
            schema_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}?select=*&limit=0"
            schema_response = requests.get(schema_url, headers=headers, timeout=10)
            
            if schema_response.status_code == 200:
                print(f"✅ Schema accessible for table '{suggested_table}'")
                
                # Now test a minimal insert
                test_data = {
                    "full_name": "Test User",
                    "work_email": "test@example.com", 
                    "company_name": "Test Company"
                }
                
                insert_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}"
                insert_response = requests.post(insert_url, headers=headers, json=test_data, timeout=15)
                
                if insert_response.status_code in [200, 201]:
                    print(f"✅ SUCCESS: Minimal insert successful to '{suggested_table}'!")
                    print(f"   Response: {insert_response.json()}")
                    return suggested_table
                else:
                    print(f"❌ Insert failed: Status {insert_response.status_code}")
                    print(f"   Error: {insert_response.text}")
                    
                    # Try to understand what columns exist
                    try:
                        error_json = insert_response.json()
                        if "message" in error_json:
                            print(f"   Error message: {error_json['message']}")
                        if "details" in error_json:
                            print(f"   Error details: {error_json['details']}")
                    except:
                        pass
            
        else:
            print(f"❌ Table '{suggested_table}' query failed: Status {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception testing '{suggested_table}': {str(e)}")
    
    return None

def test_all_possible_table_names():
    """Test all possible table name variations"""
    
    possible_names = [
        "Contract Sale Request",
        "Contract_Sale_Request", 
        "contract_sale_request",
        "ContractSaleRequest",
        "Contact Request",
        "Contact_Request",
        "contact_request",
        "contact_requests",
        "ContactRequest",
        "demo_requests",
        "Demo Requests"
    ]
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    print(f"\n🔍 Testing all possible table name variations...")
    
    working_tables = []
    
    for table_name in possible_names:
        try:
            import urllib.parse
            encoded_table_name = urllib.parse.quote(table_name)
            query_url = f"{SUPABASE_URL}/rest/v1/{encoded_table_name}?select=*&limit=1"
            
            response = requests.get(query_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                print(f"✅ FOUND: Table '{table_name}' exists!")
                working_tables.append(table_name)
            else:
                print(f"❌ Table '{table_name}': Status {response.status_code}")
                
        except Exception as e:
            print(f"❌ Table '{table_name}': Exception {str(e)}")
    
    return working_tables

if __name__ == "__main__":
    print("🔍 SUPABASE TABLE NAME VERIFICATION TEST")
    print("=" * 50)
    
    # Test the suggested table name first
    correct_table = test_suggested_table_name()
    
    if not correct_table:
        # If suggested name doesn't work, test all possibilities
        working_tables = test_all_possible_table_names()
        
        if working_tables:
            print(f"\n🎯 FOUND WORKING TABLES:")
            for table in working_tables:
                print(f"   • {table}")
        else:
            print(f"\n❌ NO WORKING TABLES FOUND")
    else:
        print(f"\n🎯 CORRECT TABLE NAME: '{correct_table}'")