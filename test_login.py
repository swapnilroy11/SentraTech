#!/usr/bin/env python3
"""
Simple test to verify login functionality
"""
import requests
import json

def test_backend_api():
    """Test backend authentication API"""
    url = "http://localhost:8001/api/dashboard/auth/login"
    payload = {
        "email": "admin@sentratech.net", 
        "password": "sentratech2025"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Backend API Status: {response.status_code}")
        print(f"Backend Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200 and response.json().get('success') == True
    except Exception as e:
        print(f"Backend API Error: {e}")
        return False

def test_dashboard_accessibility():
    """Test if dashboard is accessible"""
    try:
        response = requests.get("http://localhost:3001", timeout=10)
        print(f"Dashboard Status: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"Dashboard Error: {e}")
        return False

def main():
    print("🧪 Testing SentraTech Admin Dashboard Login...")
    print("=" * 50)
    
    # Test backend API
    print("\n1. Testing Backend Authentication API...")
    backend_ok = test_backend_api()
    
    # Test dashboard accessibility
    print("\n2. Testing Dashboard Accessibility...")
    dashboard_ok = test_dashboard_accessibility()
    
    # Summary
    print("\n📊 TEST SUMMARY:")
    print("=" * 50)
    print(f"✅ Backend API: {'PASS' if backend_ok else 'FAIL'}")
    print(f"✅ Dashboard UI: {'PASS' if dashboard_ok else 'FAIL'}")
    
    if backend_ok and dashboard_ok:
        print("\n🎉 SUCCESS: Login infrastructure is ready!")
        print("🔑 Demo Credentials:")
        print("   Email: admin@sentratech.net")
        print("   Password: sentratech2025")
        print("🌐 Dashboard URL: http://localhost:3001/login")
    else:
        print("\n❌ FAILED: Issues detected in login infrastructure")

if __name__ == "__main__":
    main()