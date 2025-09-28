#!/usr/bin/env python3
"""
Job Application Form Fix Testing
Testing with corrected schema based on error analysis
"""

import requests
import json
from datetime import datetime

# External job application endpoint
EXTERNAL_JOB_URL = "https://form-simulator.preview.emergentagent.com/api"

def test_job_application_corrected():
    """Test job application with corrected schema"""
    print("🔧 Testing Job Application Form with Corrected Schema")
    print("=" * 60)
    
    # Corrected test data based on error analysis
    # Error showed: missing "full_name" field and preferred_shifts should be string, not array
    corrected_data = {
        "full_name": "Alex Johnson",  # Changed from first_name/last_name to full_name
        "email": "alex.johnson@jobseeker.com",
        "phone": "+1-555-0789",
        "location": "Bangladesh",
        "preferred_shifts": "Morning, Afternoon",  # Changed from array to string
        "availability_date": "2024-02-01",
        "experience_years": "3-5",
        "motivation_text": "I am passionate about customer service and excited to join SentraTech's innovative team",
        "cover_letter": "Dear Hiring Manager, I am writing to express my interest in the Customer Support Specialist position...",
        "work_authorization": "Authorized",
        "position_applied": "Customer Support Specialist",
        "application_source": "career_site",
        "consent_for_storage": True
    }
    
    # Test with external endpoint and authentication
    headers = {"X-INGEST-KEY": "test-ingest-key-12345"}
    
    try:
        print(f"📝 Testing Job Application Form with corrected schema...")
        print(f"   Corrected Data: {json.dumps(corrected_data, indent=2)}")
        
        response = requests.post(f"{EXTERNAL_JOB_URL}/ingest/job_applications", 
                               json=corrected_data, headers=headers, timeout=30)
        
        print(f"   Response Status: {response.status_code}")
        print(f"   Response Body: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Job application successful!")
            print(f"   Response: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")
        return False

def test_job_application_alternative_schemas():
    """Test different possible schemas for job application"""
    print("\n🔍 Testing Alternative Job Application Schemas")
    print("=" * 60)
    
    # Test different schema variations
    schemas = [
        {
            "name": "Schema 1 - fullName field",
            "data": {
                "fullName": "Alex Johnson",
                "email": "alex.johnson@jobseeker.com",
                "phone": "+1-555-0789",
                "location": "Bangladesh",
                "preferredShifts": "Morning, Afternoon",
                "availabilityStartDate": "2024-02-01",
                "coverNote": "I am passionate about customer service",
                "source": "career_site",
                "consentForStorage": True
            }
        },
        {
            "name": "Schema 2 - name field",
            "data": {
                "name": "Alex Johnson",
                "email": "alex.johnson@jobseeker.com",
                "phone": "+1-555-0789",
                "location": "Bangladesh",
                "preferred_shifts": "Morning, Afternoon",
                "availability_date": "2024-02-01",
                "cover_letter": "I am passionate about customer service",
                "position": "Customer Support Specialist",
                "consent_for_storage": True
            }
        },
        {
            "name": "Schema 3 - minimal required fields",
            "data": {
                "full_name": "Alex Johnson",
                "email": "alex.johnson@jobseeker.com",
                "location": "Bangladesh"
            }
        }
    ]
    
    headers = {"X-INGEST-KEY": "test-ingest-key-12345"}
    
    for schema in schemas:
        try:
            print(f"\n📝 Testing {schema['name']}...")
            response = requests.post(f"{EXTERNAL_JOB_URL}/ingest/job_applications", 
                                   json=schema['data'], headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ SUCCESS: {schema['name']} works!")
                print(f"   Response: {json.dumps(result, indent=2)}")
                return True
            else:
                print(f"   ❌ FAILED: {schema['name']} - HTTP {response.status_code}")
                if response.status_code == 422:
                    error_detail = response.json()
                    print(f"   Validation errors: {json.dumps(error_detail, indent=2)}")
                
        except Exception as e:
            print(f"   ❌ EXCEPTION: {schema['name']} - {str(e)}")
    
    return False

def main():
    """Main function"""
    print("🎯 Job Application Form Schema Fix Testing")
    print("Attempting to identify correct schema for external job application endpoint")
    print()
    
    # Test corrected schema
    success1 = test_job_application_corrected()
    
    # If that fails, test alternative schemas
    if not success1:
        success2 = test_job_application_alternative_schemas()
        return success2
    
    return success1

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)