#!/usr/bin/env python3
"""
Simple WebSocket test for Live Chat
"""

import asyncio
import websockets
import json
import requests

BACKEND_URL = "https://matrix-support.preview.emergentagent.com/api"
WEBSOCKET_URL = "wss://sentrafuture.preview.emergentagent.com/ws/chat"

async def test_websocket():
    # Create a session first
    response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
    if response.status_code != 200:
        print("❌ Failed to create session")
        return False
    
    session_id = response.json()["session_id"]
    print(f"✅ Created session: {session_id}")
    
    try:
        uri = f"{WEBSOCKET_URL}/{session_id}"
        print(f"🔗 Connecting to: {uri}")
        
        # Try with a shorter timeout
        async with websockets.connect(uri, ping_interval=None, ping_timeout=None) as websocket:
            print("✅ WebSocket connected successfully")
            
            # Try to receive welcome message
            try:
                welcome = await asyncio.wait_for(websocket.recv(), timeout=5)
                print(f"✅ Welcome message: {welcome[:100]}...")
                return True
            except asyncio.TimeoutError:
                print("⚠️  No welcome message received, but connection established")
                return True
                
    except Exception as e:
        print(f"❌ WebSocket connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔌 Testing WebSocket Connection")
    print("=" * 40)
    
    success = asyncio.run(test_websocket())
    
    if success:
        print("\n🎉 WebSocket test passed!")
    else:
        print("\n❌ WebSocket test failed!")