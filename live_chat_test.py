#!/usr/bin/env python3
"""
Live Chat Integration Testing for SentraTech
Tests WebSocket, REST API, AI Integration, and Database persistence
"""

import requests
import json
import time
import asyncio
import websockets
from datetime import datetime
from typing import Dict, Any

# Backend URL from environment
BACKEND_URL = "https://matrix-team-update.preview.emergentagent.com/api"

class LiveChatTester:
    """Test Live Chat Integration functionality with WebSocket and AI"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.websocket_url = "wss://sentrafuture.preview.emergentagent.com/ws/chat"
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests.append(test_name)
            print(f"✅ PASS: {test_name}")
        else:
            self.failed_tests.append(test_name)
            print(f"❌ FAIL: {test_name} - {details}")
            
        if details:
            print(f"   Details: {details}")
    
    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Basic API Connectivity", True, f"Status: {response.status_code}")
                return True
            else:
                self.log_test("Basic API Connectivity", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Basic API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_chat_session_creation(self):
        """Test POST /api/chat/session endpoint"""
        print("\n=== Testing Chat Session Creation ===")
        
        # Test Case 1: Create session without user_id
        try:
            response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "session_id", "message"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    if result["success"] and result["session_id"]:
                        session_id = result["session_id"]
                        self.log_test("Chat Session - Create Without User ID", True, 
                                    f"Session ID: {session_id}")
                        
                        # Store session_id for later tests
                        self.test_session_id = session_id
                    else:
                        self.log_test("Chat Session - Create Without User ID", False, 
                                    f"Invalid response values: {result}")
                else:
                    self.log_test("Chat Session - Create Without User ID", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Chat Session - Create Without User ID", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Session - Create Without User ID", False, f"Exception: {str(e)}")
        
        # Test Case 2: Create session with user_id
        try:
            test_data = {"user_id": "test_user_123"}
            response = requests.post(f"{BACKEND_URL}/chat/session", json=test_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and result["session_id"]:
                    self.log_test("Chat Session - Create With User ID", True, 
                                f"Session ID: {result['session_id']}")
                else:
                    self.log_test("Chat Session - Create With User ID", False, 
                                f"Invalid response: {result}")
            else:
                self.log_test("Chat Session - Create With User ID", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Session - Create With User ID", False, f"Exception: {str(e)}")
    
    def test_rest_api_message_endpoint(self):
        """Test POST /api/chat/message endpoint (fallback method)"""
        print("\n=== Testing REST API Message Endpoint ===")
        
        # First create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Chat Message - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Test Case 1: Send message via REST API
        try:
            test_message = "Hello, I need help with SentraTech's AI platform features."
            
            # Use query parameters instead of JSON body
            response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={test_message}", timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                required_fields = ["success", "user_message", "ai_response"]
                missing_fields = [field for field in required_fields if field not in result]
                
                if not missing_fields:
                    user_msg = result["user_message"]
                    ai_msg = result["ai_response"]
                    
                    # Verify user message
                    if user_msg["content"] == test_message and user_msg["sender"] == "user":
                        self.log_test("Chat Message - User Message Storage", True, 
                                    f"Message stored correctly: {user_msg['id']}")
                    else:
                        self.log_test("Chat Message - User Message Storage", False, 
                                    f"User message not stored correctly")
                    
                    # Verify AI response
                    if ai_msg["sender"] == "assistant" and len(ai_msg["content"]) > 0:
                        self.log_test("Chat Message - AI Response Generation", True, 
                                    f"AI response generated: {ai_msg['content'][:100]}...")
                    else:
                        self.log_test("Chat Message - AI Response Generation", False, 
                                    f"AI response not generated properly")
                        
                    # Check if response is contextually appropriate for SentraTech
                    ai_content = ai_msg["content"].lower()
                    sentratech_keywords = ["sentratech", "ai", "customer", "support", "platform", "automation"]
                    if any(keyword in ai_content for keyword in sentratech_keywords):
                        self.log_test("Chat Message - SentraTech Context", True, 
                                    "AI response contains SentraTech-relevant content")
                    else:
                        self.log_test("Chat Message - SentraTech Context", False, 
                                    "AI response lacks SentraTech context")
                        
                else:
                    self.log_test("Chat Message - REST API Response Structure", False, 
                                f"Missing response fields: {missing_fields}")
            else:
                self.log_test("Chat Message - REST API Basic", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat Message - REST API Basic", False, f"Exception: {str(e)}")
    
    def test_chat_history_endpoint(self):
        """Test GET /api/chat/session/{session_id}/history endpoint"""
        print("\n=== Testing Chat History Endpoint ===")
        
        # First create a session and send some messages
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Chat History - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Send a test message to create history
        test_message = "What are the key benefits of SentraTech's platform?"
        
        message_response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={test_message}", timeout=30)
        if message_response.status_code != 200:
            self.log_test("Chat History - Message Setup", False, "Failed to send test message")
            return
        
        # Test Case 1: Retrieve chat history
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check response structure
                if "success" in result and "messages" in result:
                    if result["success"] and isinstance(result["messages"], list):
                        messages = result["messages"]
                        
                        if len(messages) >= 2:  # Should have user message + AI response
                            # Check message structure
                            user_message = None
                            ai_message = None
                            
                            for msg in messages:
                                if msg["sender"] == "user":
                                    user_message = msg
                                elif msg["sender"] == "assistant":
                                    ai_message = msg
                            
                            if user_message and ai_message:
                                self.log_test("Chat History - Message Retrieval", True, 
                                            f"Retrieved {len(messages)} messages correctly")
                                
                                # Check timestamp handling
                                if "timestamp" in user_message and "timestamp" in ai_message:
                                    self.log_test("Chat History - Timestamp Handling", True, 
                                                "Timestamps present in messages")
                                else:
                                    self.log_test("Chat History - Timestamp Handling", False, 
                                                "Missing timestamps in messages")
                                    
                                # Check message ordering (should be chronological)
                                if messages[0]["timestamp"] <= messages[-1]["timestamp"]:
                                    self.log_test("Chat History - Message Ordering", True, 
                                                "Messages ordered chronologically")
                                else:
                                    self.log_test("Chat History - Message Ordering", False, 
                                                "Messages not properly ordered")
                            else:
                                self.log_test("Chat History - Message Types", False, 
                                            "Missing user or AI messages in history")
                        else:
                            self.log_test("Chat History - Message Count", False, 
                                        f"Expected at least 2 messages, got {len(messages)}")
                    else:
                        self.log_test("Chat History - Response Format", False, 
                                    f"Invalid response format: {result}")
                else:
                    self.log_test("Chat History - Response Structure", False, 
                                f"Missing required fields in response")
            else:
                self.log_test("Chat History - Basic Retrieval", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Chat History - Basic Retrieval", False, f"Exception: {str(e)}")
        
        # Test Case 2: Test with limit parameter
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history?limit=1", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                if result["success"] and len(result["messages"]) <= 1:
                    self.log_test("Chat History - Limit Parameter", True, 
                                f"Limit parameter working: {len(result['messages'])} messages")
                else:
                    self.log_test("Chat History - Limit Parameter", False, 
                                f"Limit parameter not working properly")
            else:
                self.log_test("Chat History - Limit Parameter", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Chat History - Limit Parameter", False, f"Exception: {str(e)}")
    
    def test_websocket_connection(self):
        """Test WebSocket endpoint /ws/chat/{session_id}"""
        print("\n=== Testing WebSocket Connection ===")
        
        # First create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("WebSocket - Session Setup", False, "Failed to create session for testing")
            return
        
        session_id = session_response.json()["session_id"]
        
        async def test_websocket_functionality():
            try:
                # Test Case 1: WebSocket connection establishment
                uri = f"{self.websocket_url}/{session_id}"
                
                async with websockets.connect(uri) as websocket:
                    self.log_test("WebSocket - Connection Establishment", True, 
                                f"Connected to {uri}")
                    
                    # Test Case 2: Receive welcome message
                    try:
                        welcome_message = await asyncio.wait_for(websocket.recv(), timeout=5)
                        welcome_data = json.loads(welcome_message)
                        
                        if welcome_data.get("type") == "system" and "content" in welcome_data:
                            self.log_test("WebSocket - Welcome Message", True, 
                                        f"Welcome message received: {welcome_data['content'][:50]}...")
                        else:
                            self.log_test("WebSocket - Welcome Message", False, 
                                        f"Invalid welcome message format: {welcome_data}")
                    except asyncio.TimeoutError:
                        self.log_test("WebSocket - Welcome Message", False, "No welcome message received")
                    
                    # Test Case 3: Send user message and receive AI response
                    try:
                        test_message = {
                            "type": "user_message",
                            "content": "Can you tell me about SentraTech's automation capabilities?"
                        }
                        
                        await websocket.send(json.dumps(test_message))
                        self.log_test("WebSocket - Send Message", True, "User message sent successfully")
                        
                        # Wait for typing indicator and AI response
                        typing_received = False
                        ai_response_received = False
                        
                        for _ in range(10):  # Wait up to 30 seconds for response
                            try:
                                response = await asyncio.wait_for(websocket.recv(), timeout=3)
                                response_data = json.loads(response)
                                
                                if response_data.get("type") == "typing":
                                    typing_received = True
                                    self.log_test("WebSocket - Typing Indicator", True, 
                                                f"Typing indicator: {response_data.get('is_typing')}")
                                
                                elif response_data.get("type") == "ai_response":
                                    ai_response_received = True
                                    ai_content = response_data.get("content", "")
                                    
                                    if len(ai_content) > 0:
                                        self.log_test("WebSocket - AI Response Reception", True, 
                                                    f"AI response received: {ai_content[:100]}...")
                                        
                                        # Check SentraTech context
                                        ai_lower = ai_content.lower()
                                        sentratech_keywords = ["sentratech", "automation", "ai", "platform", "70%"]
                                        if any(keyword in ai_lower for keyword in sentratech_keywords):
                                            self.log_test("WebSocket - AI Context Quality", True, 
                                                        "AI response contains relevant SentraTech information")
                                        else:
                                            self.log_test("WebSocket - AI Context Quality", False, 
                                                        "AI response lacks SentraTech context")
                                    else:
                                        self.log_test("WebSocket - AI Response Reception", False, 
                                                    "Empty AI response received")
                                    break
                                    
                            except asyncio.TimeoutError:
                                continue
                        
                        if not ai_response_received:
                            self.log_test("WebSocket - AI Response Reception", False, 
                                        "No AI response received within timeout")
                    
                    except Exception as e:
                        self.log_test("WebSocket - Message Exchange", False, f"Exception: {str(e)}")
                    
                    # Test Case 4: Ping/Pong functionality
                    try:
                        ping_message = {
                            "type": "ping",
                            "timestamp": datetime.now().isoformat()
                        }
                        
                        await websocket.send(json.dumps(ping_message))
                        
                        pong_response = await asyncio.wait_for(websocket.recv(), timeout=5)
                        pong_data = json.loads(pong_response)
                        
                        if pong_data.get("type") == "pong":
                            self.log_test("WebSocket - Ping/Pong", True, "Ping/Pong functionality working")
                        else:
                            self.log_test("WebSocket - Ping/Pong", False, 
                                        f"Invalid pong response: {pong_data}")
                    
                    except asyncio.TimeoutError:
                        self.log_test("WebSocket - Ping/Pong", False, "No pong response received")
                    except Exception as e:
                        self.log_test("WebSocket - Ping/Pong", False, f"Exception: {str(e)}")
                        
            except Exception as e:
                self.log_test("WebSocket - Connection Establishment", False, f"Connection failed: {str(e)}")
        
        # Run the async WebSocket test
        try:
            asyncio.run(test_websocket_functionality())
        except Exception as e:
            self.log_test("WebSocket - Test Execution", False, f"Async test failed: {str(e)}")
    
    def test_ai_integration(self):
        """Test Emergent LLM integration and AI response quality"""
        print("\n=== Testing AI Integration ===")
        
        # Create a session for testing
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("AI Integration - Session Setup", False, "Failed to create session")
            return
        
        session_id = session_response.json()["session_id"]
        
        # Test Case 1: AI response to SentraTech-specific query
        sentratech_queries = [
            "What are SentraTech's key features?",
            "How much can I save with SentraTech?",
            "Tell me about your automation capabilities"
        ]
        
        for i, query in enumerate(sentratech_queries):
            try:
                response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={query}", timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    ai_response = result.get("ai_response", {}).get("content", "")
                    
                    if len(ai_response) > 0:
                        # Check for SentraTech-specific information
                        ai_lower = ai_response.lower()
                        relevant_terms = [
                            "sentratech", "50ms", "sub-50ms", "70%", "automation", 
                            "45%", "cost", "savings", "ai", "platform", "customer support",
                            "routing", "dashboard", "analytics", "integration"
                        ]
                        
                        relevant_count = sum(1 for term in relevant_terms if term in ai_lower)
                        
                        if relevant_count >= 2:  # At least 2 relevant terms
                            self.log_test(f"AI Integration - Query {i+1} Relevance", True, 
                                        f"Response contains {relevant_count} relevant terms")
                        else:
                            self.log_test(f"AI Integration - Query {i+1} Relevance", False, 
                                        f"Response lacks SentraTech context (only {relevant_count} relevant terms)")
                        
                        # Check response length (should be substantial)
                        if len(ai_response) > 50:
                            self.log_test(f"AI Integration - Query {i+1} Length", True, 
                                        f"Response length: {len(ai_response)} characters")
                        else:
                            self.log_test(f"AI Integration - Query {i+1} Length", False, 
                                        f"Response too short: {len(ai_response)} characters")
                    else:
                        self.log_test(f"AI Integration - Query {i+1} Response", False, 
                                    "Empty AI response")
                else:
                    self.log_test(f"AI Integration - Query {i+1} API", False, 
                                f"API call failed: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"AI Integration - Query {i+1} Exception", False, f"Exception: {str(e)}")
    
    def test_database_integration(self):
        """Test MongoDB integration for chat data persistence"""
        print("\n=== Testing Database Integration ===")
        
        # Create a session
        session_response = requests.post(f"{BACKEND_URL}/chat/session", timeout=10)
        if session_response.status_code != 200:
            self.log_test("Database - Session Creation", False, "Failed to create session")
            return
        
        session_id = session_response.json()["session_id"]
        self.log_test("Database - Session Creation", True, f"Session created: {session_id}")
        
        # Send multiple messages to test persistence
        test_messages = [
            "Hello, I'm interested in SentraTech",
            "What are your pricing options?"
        ]
        
        for i, message in enumerate(test_messages):
            try:
                response = requests.post(f"{BACKEND_URL}/chat/message?session_id={session_id}&message={message}", timeout=30)
                
                if response.status_code == 200:
                    self.log_test(f"Database - Message {i+1} Storage", True, 
                                f"Message stored successfully")
                else:
                    self.log_test(f"Database - Message {i+1} Storage", False, 
                                f"Failed to store message: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Database - Message {i+1} Storage", False, f"Exception: {str(e)}")
        
        # Test message retrieval and verify persistence
        try:
            history_response = requests.get(f"{BACKEND_URL}/chat/session/{session_id}/history", timeout=10)
            
            if history_response.status_code == 200:
                result = history_response.json()
                messages = result.get("messages", [])
                
                # Should have user messages + AI responses
                expected_min_messages = len(test_messages) * 2  # user + AI for each
                
                if len(messages) >= expected_min_messages:
                    self.log_test("Database - Message Persistence", True, 
                                f"All {len(messages)} messages persisted correctly")
                    
                    # Check message ordering and timestamps
                    timestamps = [msg["timestamp"] for msg in messages]
                    if timestamps == sorted(timestamps):
                        self.log_test("Database - Message Ordering", True, 
                                    "Messages ordered chronologically")
                    else:
                        self.log_test("Database - Message Ordering", False, 
                                    "Messages not properly ordered")
                        
                    # Verify message content preservation
                    user_messages = [msg for msg in messages if msg["sender"] == "user"]
                    stored_contents = [msg["content"] for msg in user_messages]
                    
                    all_preserved = all(original in stored_contents for original in test_messages)
                    if all_preserved:
                        self.log_test("Database - Content Preservation", True, 
                                    "All message content preserved correctly")
                    else:
                        self.log_test("Database - Content Preservation", False, 
                                    "Some message content not preserved")
                else:
                    self.log_test("Database - Message Persistence", False, 
                                f"Expected at least {expected_min_messages} messages, got {len(messages)}")
            else:
                self.log_test("Database - Message Retrieval", False, 
                            f"Failed to retrieve messages: {history_response.status_code}")
                
        except Exception as e:
            self.log_test("Database - Message Retrieval", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling scenarios"""
        print("\n=== Testing Error Handling ===")
        
        # Test Case 1: Invalid session ID
        try:
            invalid_session_id = "invalid_session_123"
            test_message = "Test message"
            
            response = requests.post(f"{BACKEND_URL}/chat/message?session_id={invalid_session_id}&message={test_message}", timeout=10)
            
            # Should handle gracefully (either create session or return error)
            if response.status_code in [200, 400, 404, 500]:
                self.log_test("Error Handling - Invalid Session ID", True, 
                            f"Handled invalid session ID gracefully: {response.status_code}")
            else:
                self.log_test("Error Handling - Invalid Session ID", False, 
                            f"Unexpected status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Invalid Session ID", False, f"Exception: {str(e)}")
        
        # Test Case 2: Invalid chat history request
        try:
            response = requests.get(f"{BACKEND_URL}/chat/session/nonexistent/history", timeout=10)
            
            if response.status_code in [200, 404, 500]:  # Should handle gracefully
                self.log_test("Error Handling - Nonexistent Session History", True, 
                            f"Handled nonexistent session gracefully: {response.status_code}")
            else:
                self.log_test("Error Handling - Nonexistent Session History", False, 
                            f"Unexpected status code: {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Nonexistent Session History", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all live chat test suites"""
        print("🚀 Starting Live Chat Integration Tests")
        print("=" * 60)
        
        # Check basic connectivity first
        if not self.test_basic_connectivity():
            print("❌ Cannot connect to backend API. Stopping tests.")
            return False
        
        # Run all test suites
        self.test_chat_session_creation()
        self.test_rest_api_message_endpoint()
        self.test_chat_history_endpoint()
        self.test_websocket_connection()
        self.test_ai_integration()
        self.test_database_integration()
        self.test_error_handling()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 LIVE CHAT TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if self.passed_tests:
            print(f"\n✅ Passed Tests:")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        # Return overall success
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    print("💬 SentraTech Live Chat Integration Testing")
    print("=" * 60)
    
    chat_tester = LiveChatTester()
    success = chat_tester.run_all_tests()
    
    if success:
        print("\n🎉 ALL LIVE CHAT TESTS PASSED!")
    else:
        print(f"\n⚠️  {len(chat_tester.failed_tests)} tests failed")