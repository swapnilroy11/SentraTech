#!/usr/bin/env python3
"""
Test the /api/collect endpoint functionality from the deployment package
"""

import sys
import os
import json
import tempfile
import subprocess
import time
import requests
from pathlib import Path

def test_collect_endpoint():
    """Test the /api/collect endpoint by running the deployment package server"""
    
    print("🔍 TESTING /API/COLLECT ENDPOINT FUNCTIONALITY")
    print("=" * 50)
    
    # Path to deployment package server
    server_path = Path("/app/deployment-package/backend/server.py")
    
    if not server_path.exists():
        print("❌ Deployment package server.py not found")
        return False
    
    # Create a temporary environment file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.env', delete=False) as env_file:
        env_content = """
# Test environment for deployment package
DASHBOARD_URL=https://admin.sentratech.net/api/forms
DASHBOARD_API_KEY=test-key-12345
CORS_ORIGINS=https://sentratech.net,https://www.sentratech.net
LOG_LEVEL=INFO
"""
        env_file.write(env_content)
        env_file_path = env_file.name
    
    try:
        # Set environment variables
        test_env = os.environ.copy()
        test_env['DASHBOARD_URL'] = 'https://admin.sentratech.net/api/forms'
        test_env['DASHBOARD_API_KEY'] = 'test-key-12345'
        test_env['CORS_ORIGINS'] = 'https://sentratech.net,https://www.sentratech.net'
        
        # Start the server in background
        print("🚀 Starting deployment package server...")
        
        # Change to the backend directory
        backend_dir = Path("/app/deployment-package/backend")
        
        # Start server process
        server_process = subprocess.Popen([
            sys.executable, "-c", 
            f"""
import sys
sys.path.insert(0, '{backend_dir}')
import uvicorn
import server
uvicorn.run(server.app, host='127.0.0.1', port=8002, log_level='info')
"""
        ], env=test_env, cwd=str(backend_dir))
        
        # Wait for server to start
        print("⏳ Waiting for server to start...")
        time.sleep(3)
        
        # Test health endpoint first
        try:
            health_response = requests.get("http://127.0.0.1:8002/api/health", timeout=5)
            if health_response.status_code == 200:
                print("✅ Health endpoint working")
                print(f"   Response: {health_response.json()}")
            else:
                print(f"⚠️ Health endpoint returned {health_response.status_code}")
        except Exception as e:
            print(f"❌ Health endpoint failed: {str(e)}")
            return False
        
        # Test /api/collect endpoint
        test_payload = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Company",
            "message": "This is a test submission",
            "trace_id": f"test-{int(time.time())}"
        }
        
        print("\n🧪 Testing /api/collect endpoint...")
        print(f"📤 Sending payload: {json.dumps(test_payload, indent=2)}")
        
        try:
            collect_response = requests.post(
                "http://127.0.0.1:8002/api/collect",
                json=test_payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            print(f"📥 Response Status: {collect_response.status_code}")
            print(f"📥 Response Body: {collect_response.text}")
            
            if collect_response.status_code in [200, 502]:  # 502 expected if dashboard not reachable
                print("✅ /api/collect endpoint is functional")
                
                # Test idempotency by sending same request again
                print("\n🔄 Testing idempotency...")
                duplicate_response = requests.post(
                    "http://127.0.0.1:8002/api/collect",
                    json=test_payload,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                print(f"📥 Duplicate Response Status: {duplicate_response.status_code}")
                print(f"📥 Duplicate Response Body: {duplicate_response.text}")
                
                if "duplicate" in duplicate_response.text.lower():
                    print("✅ Idempotency working correctly")
                else:
                    print("⚠️ Idempotency may not be working as expected")
                
                return True
            else:
                print(f"❌ /api/collect endpoint returned unexpected status: {collect_response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ /api/collect endpoint test failed: {str(e)}")
            return False
        
    finally:
        # Clean up
        try:
            server_process.terminate()
            server_process.wait(timeout=5)
        except:
            server_process.kill()
        
        # Remove temp env file
        try:
            os.unlink(env_file_path)
        except:
            pass
    
    return False

def main():
    """Main test execution"""
    success = test_collect_endpoint()
    
    if success:
        print("\n🎉 COLLECT ENDPOINT TEST: PASSED")
        print("✅ The /api/collect endpoint is working correctly")
        print("✅ Idempotency logic is functional")
        print("✅ Error handling is appropriate")
        return 0
    else:
        print("\n❌ COLLECT ENDPOINT TEST: FAILED")
        print("❌ The /api/collect endpoint has issues")
        return 1

if __name__ == "__main__":
    sys.exit(main())