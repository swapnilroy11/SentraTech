#!/usr/bin/env python3
"""
Chat Functionality and AI System Testing
Tests the chat functionality and AI system with enhanced business knowledge
"""

import requests
import json
import time
import websocket
import threading
from datetime import datetime
from typing import Dict, Any, List
import uuid

# Backend URL from environment
BACKEND_URL = "https://tech-site-boost.preview.emergentagent.com/api"
WEBSOCKET_URL = "wss://ux-legal-revamp.preview.emergentagent.com/api/chat/ws"

class ChatFunctionalityTester:
    """Chat Functionality and AI System Testing"""
    
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        self.session_id = None
        self.websocket_messages = []
        self.websocket_connected = False
        
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
    
    def test_backend_connectivity(self):
        """Test basic backend connectivity"""
        print("\n=== Testing Backend Connectivity ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get("message") == "Hello World":
                    self.log_test("Backend Connectivity", True, f"Backend responding correctly: {result}")
                    return True
                else:
                    self.log_test("Backend Connectivity", False, f"Unexpected response: {result}")
                    return False
            else:
                self.log_test("Backend Connectivity", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Backend Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_health_check(self):
        """Test backend health check"""
        print("\n=== Testing Backend Health Check ===")
        
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "healthy":
                    response_time = result.get("response_time_ms", 0)
                    self.log_test("Backend Health Check", True, 
                                f"Backend healthy - Response time: {response_time}ms")
                    return True
                else:
                    self.log_test("Backend Health Check", False, f"Backend unhealthy: {result}")
                    return False
            else:
                self.log_test("Backend Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Backend Health Check", False, f"Health check error: {str(e)}")
            return False
    
    def test_chat_session_creation(self):
        """Test POST /api/chat/session endpoint to verify session creation"""
        print("\n=== Testing Chat Session Creation ===")
        
        try:
            print("📝 Creating new chat session...")
            response = requests.post(f"{BACKEND_URL}/chat/session", json={}, timeout=15)
            
            print(f"   Response Status: {response.status_code}")
            print(f"   Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check if session_id is returned
                if "session_id" in result:
                    self.session_id = result["session_id"]
                    self.log_test("Chat Session Creation", True, 
                                f"✅ Chat session created successfully! Session ID: {self.session_id}")
                    return True
                else:
                    self.log_test("Chat Session Creation", False, 
                                f"No session_id in response: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Chat Session Creation", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Chat Session Creation", False, f"Exception: {str(e)}")
            return False
    
    def test_chat_message_sending(self):
        """Test POST /api/chat/message endpoint with sample messages"""
        print("\n=== Testing Chat Message Sending ===")
        
        if not self.session_id:
            self.log_test("Chat Message Sending", False, "No session ID available from previous test")
            return False
        
        # Test message
        test_message = {
            "session_id": self.session_id,
            "content": "Hello, I'd like to know about SentraTech's pricing plans.",
            "sender": "user"
        }
        
        try:
            print(f"📝 Sending test message...")
            print(f"   Message Data: {json.dumps(test_message, indent=2)}")
            
            response = requests.post(f"{BACKEND_URL}/chat/message", json=test_message, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check response structure
                if "message_id" in result and "ai_response" in result:
                    ai_response = result.get("ai_response", "")
                    self.log_test("Chat Message Sending", True, 
                                f"✅ Message sent successfully! AI Response length: {len(ai_response)} chars")
                    
                    # Store AI response for quality testing
                    self.test_ai_response = ai_response
                    return True
                else:
                    self.log_test("Chat Message Sending", False, 
                                f"Invalid response structure: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Chat Message Sending", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Chat Message Sending", False, f"Exception: {str(e)}")
            return False
    
    def test_ai_response_quality(self):
        """Test the AI responses to verify the updated business knowledge"""
        print("\n=== Testing AI Response Quality ===")
        
        if not self.session_id:
            self.log_test("AI Response Quality", False, "No session ID available")
            return False
        
        # Test messages to verify business knowledge
        test_messages = [
            {
                "content": "What are your pricing plans?",
                "expected_keywords": ["$1,200", "$1,650", "$2,000", "Starter", "Growth", "Enterprise", "bundle"]
            },
            {
                "content": "How can I calculate ROI?",
                "expected_keywords": ["ROI Calculator", "/roi-calculator", "calculate", "savings"]
            },
            {
                "content": "Tell me about SentraTech features",
                "expected_keywords": ["AI-powered", "automation", "70%", "multi-channel", "analytics"]
            },
            {
                "content": "How do I request a demo?",
                "expected_keywords": ["demo", "/demo-request", "schedule", "personalized"]
            },
            {
                "content": "What's your contact information?",
                "expected_keywords": ["info@sentratech.net", "Contact Sales", "London"]
            }
        ]
        
        successful_responses = 0
        
        for i, test_msg in enumerate(test_messages):
            try:
                print(f"🔍 Testing AI response {i+1}/5: '{test_msg['content']}'...")
                
                message_data = {
                    "session_id": self.session_id,
                    "content": test_msg["content"],
                    "sender": "user"
                }
                
                response = requests.post(f"{BACKEND_URL}/chat/message", json=message_data, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    ai_response = result.get("ai_response", "").lower()
                    
                    # Check for expected keywords
                    found_keywords = []
                    for keyword in test_msg["expected_keywords"]:
                        if keyword.lower() in ai_response:
                            found_keywords.append(keyword)
                    
                    keyword_match_rate = len(found_keywords) / len(test_msg["expected_keywords"])
                    
                    if keyword_match_rate >= 0.5:  # At least 50% of keywords found
                        successful_responses += 1
                        self.log_test(f"AI Response Quality - Test {i+1}", True, 
                                    f"✅ Good response quality - Found {len(found_keywords)}/{len(test_msg['expected_keywords'])} keywords: {found_keywords}")
                    else:
                        self.log_test(f"AI Response Quality - Test {i+1}", False, 
                                    f"Poor response quality - Only found {len(found_keywords)}/{len(test_msg['expected_keywords'])} keywords: {found_keywords}")
                        print(f"      AI Response: {result.get('ai_response', '')[:200]}...")
                else:
                    self.log_test(f"AI Response Quality - Test {i+1}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                
                # Small delay between requests
                time.sleep(2)
                
            except Exception as e:
                self.log_test(f"AI Response Quality - Test {i+1}", False, f"Exception: {str(e)}")
        
        # Overall AI quality assessment
        quality_rate = successful_responses / len(test_messages)
        if quality_rate >= 0.8:
            self.log_test("AI Response Quality - Overall", True, 
                        f"✅ Excellent AI quality: {successful_responses}/{len(test_messages)} responses passed")
        elif quality_rate >= 0.6:
            self.log_test("AI Response Quality - Overall", True, 
                        f"✅ Good AI quality: {successful_responses}/{len(test_messages)} responses passed")
        else:
            self.log_test("AI Response Quality - Overall", False, 
                        f"Poor AI quality: only {successful_responses}/{len(test_messages)} responses passed")
        
        return quality_rate >= 0.6
    
    def test_websocket_connection(self):
        """Test the WebSocket chat functionality if available"""
        print("\n=== Testing WebSocket Connection ===")
        
        if not self.session_id:
            self.log_test("WebSocket Connection", False, "No session ID available")
            return False
        
        try:
            print(f"🔌 Attempting WebSocket connection...")
            
            def on_message(ws, message):
                print(f"   📨 WebSocket message received: {message}")
                self.websocket_messages.append(message)
            
            def on_error(ws, error):
                print(f"   ❌ WebSocket error: {error}")
            
            def on_close(ws, close_status_code, close_msg):
                print(f"   🔌 WebSocket connection closed")
                self.websocket_connected = False
            
            def on_open(ws):
                print(f"   ✅ WebSocket connection opened")
                self.websocket_connected = True
                
                # Send a test message
                test_message = {
                    "session_id": self.session_id,
                    "content": "Hello via WebSocket!",
                    "sender": "user"
                }
                ws.send(json.dumps(test_message))
            
            # Create WebSocket connection
            ws_url = f"{WEBSOCKET_URL}/{self.session_id}"
            print(f"   Connecting to: {ws_url}")
            
            ws = websocket.WebSocketApp(ws_url,
                                      on_open=on_open,
                                      on_message=on_message,
                                      on_error=on_error,
                                      on_close=on_close)
            
            # Run WebSocket in a separate thread with timeout
            ws_thread = threading.Thread(target=ws.run_forever)
            ws_thread.daemon = True
            ws_thread.start()
            
            # Wait for connection and messages
            time.sleep(5)
            
            if self.websocket_connected or len(self.websocket_messages) > 0:
                self.log_test("WebSocket Connection", True, 
                            f"✅ WebSocket working - Connected: {self.websocket_connected}, Messages: {len(self.websocket_messages)}")
                return True
            else:
                self.log_test("WebSocket Connection", False, 
                            "WebSocket connection failed or no messages received")
                return False
                
        except Exception as e:
            self.log_test("WebSocket Connection", False, f"Exception: {str(e)}")
            return False
    
    def test_message_history_retrieval(self):
        """Test chat history retrieval"""
        print("\n=== Testing Message History Retrieval ===")
        
        if not self.session_id:
            self.log_test("Message History Retrieval", False, "No session ID available")
            return False
        
        try:
            print(f"📜 Retrieving chat history for session: {self.session_id}")
            
            response = requests.get(f"{BACKEND_URL}/chat/history/{self.session_id}", timeout=15)
            
            print(f"   Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Response Body: {json.dumps(result, indent=2)}")
                
                # Check if messages are returned
                if "messages" in result:
                    messages = result["messages"]
                    message_count = len(messages)
                    
                    if message_count > 0:
                        self.log_test("Message History Retrieval", True, 
                                    f"✅ Chat history retrieved successfully! Found {message_count} messages")
                        
                        # Verify message structure
                        first_message = messages[0] if messages else {}
                        required_fields = ["id", "content", "sender", "timestamp"]
                        missing_fields = [field for field in required_fields if field not in first_message]
                        
                        if not missing_fields:
                            self.log_test("Message History Structure", True, 
                                        f"✅ Message structure is correct")
                        else:
                            self.log_test("Message History Structure", False, 
                                        f"Missing fields in message structure: {missing_fields}")
                        
                        return True
                    else:
                        self.log_test("Message History Retrieval", False, 
                                    "No messages found in history")
                        return False
                else:
                    self.log_test("Message History Retrieval", False, 
                                f"No 'messages' field in response: {result}")
                    return False
            else:
                error_text = response.text
                self.log_test("Message History Retrieval", False, 
                            f"HTTP {response.status_code}: {error_text}")
                return False
                
        except Exception as e:
            self.log_test("Message History Retrieval", False, f"Exception: {str(e)}")
            return False
    
    def test_pricing_knowledge_accuracy(self):
        """Test specific pricing knowledge accuracy"""
        print("\n=== Testing Pricing Knowledge Accuracy ===")
        
        if not self.session_id:
            self.log_test("Pricing Knowledge Accuracy", False, "No session ID available")
            return False
        
        # Test specific pricing details
        pricing_test = {
            "content": "What are the exact prices for your three plans and what's included in the per-1,000 bundle structure?",
            "expected_details": {
                "starter_price": "$1,200",
                "growth_price": "$1,650", 
                "enterprise_price": "$2,000",
                "bundle_structure": "1,000 calls + 1,000 interactions",
                "billing_terms": ["24-month", "36-month"],
                "discount": "10%"
            }
        }
        
        try:
            print(f"🔍 Testing detailed pricing knowledge...")
            
            message_data = {
                "session_id": self.session_id,
                "content": pricing_test["content"],
                "sender": "user"
            }
            
            response = requests.post(f"{BACKEND_URL}/chat/message", json=message_data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result.get("ai_response", "")
                
                # Check for specific pricing details
                found_details = []
                for detail_name, detail_value in pricing_test["expected_details"].items():
                    if isinstance(detail_value, list):
                        # Check if any of the list items are found
                        if any(item.lower() in ai_response.lower() for item in detail_value):
                            found_details.append(detail_name)
                    else:
                        if detail_value.lower() in ai_response.lower():
                            found_details.append(detail_name)
                
                accuracy_rate = len(found_details) / len(pricing_test["expected_details"])
                
                if accuracy_rate >= 0.7:  # At least 70% accuracy
                    self.log_test("Pricing Knowledge Accuracy", True, 
                                f"✅ High pricing accuracy: {len(found_details)}/{len(pricing_test['expected_details'])} details found: {found_details}")
                    return True
                else:
                    self.log_test("Pricing Knowledge Accuracy", False, 
                                f"Low pricing accuracy: only {len(found_details)}/{len(pricing_test['expected_details'])} details found: {found_details}")
                    print(f"      AI Response: {ai_response[:300]}...")
                    return False
            else:
                self.log_test("Pricing Knowledge Accuracy", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Pricing Knowledge Accuracy", False, f"Exception: {str(e)}")
            return False
    
    def generate_test_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 CHAT FUNCTIONALITY AND AI SYSTEM - TESTING SUMMARY")
        print("=" * 80)
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = len(self.passed_tests)
        failed_tests = len(self.failed_tests)
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📈 Overall Test Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed_tests}")
        print(f"   ❌ Failed: {failed_tests}")
        print(f"   📊 Success Rate: {success_rate:.1f}%")
        
        # Detailed results
        print(f"\n📋 Detailed Test Results:")
        for result in self.test_results:
            status = "✅ PASS" if result["passed"] else "❌ FAIL"
            print(f"   {status}: {result['test']}")
            if result["details"] and not result["passed"]:
                print(f"      └─ {result['details']}")
        
        # Critical findings
        print(f"\n🎯 Critical Findings:")
        
        # Check for session creation issues
        session_issues = [r for r in self.test_results if "Session Creation" in r["test"] and not r["passed"]]
        if session_issues:
            print(f"   ❌ CHAT SESSION ISSUES:")
            for issue in session_issues:
                print(f"      • {issue['details']}")
        
        # Check for AI response issues
        ai_issues = [r for r in self.test_results if "AI Response" in r["test"] and not r["passed"]]
        if ai_issues:
            print(f"   ❌ AI RESPONSE ISSUES:")
            for issue in ai_issues:
                print(f"      • {issue['details']}")
        
        # Check for WebSocket issues
        websocket_issues = [r for r in self.test_results if "WebSocket" in r["test"] and not r["passed"]]
        if websocket_issues:
            print(f"   ⚠️ WEBSOCKET ISSUES:")
            for issue in websocket_issues:
                print(f"      • {issue['details']}")
        
        # Production readiness assessment
        print(f"\n🎯 Production Readiness Assessment:")
        
        if success_rate >= 90:
            print(f"   🎉 EXCELLENT - Chat functionality is production-ready")
        elif success_rate >= 75:
            print(f"   ✅ GOOD - Chat functionality working with minor issues")
        elif success_rate >= 50:
            print(f"   ⚠️ FAIR - Chat functionality needs improvements")
        else:
            print(f"   ❌ POOR - Significant issues need resolution")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        
        if failed_tests > 0:
            print(f"   • Address {failed_tests} failed test cases")
        
        if session_issues:
            print(f"   • Fix chat session creation endpoint")
        
        if ai_issues:
            print(f"   • Review AI response quality and business knowledge integration")
        
        if websocket_issues:
            print(f"   • Consider WebSocket implementation for real-time chat (optional)")
        
        if success_rate >= 75:
            print(f"   • Chat functionality is ready for production use")
        
        return success_rate >= 75
    
    def run_comprehensive_tests(self):
        """Run all comprehensive tests for chat functionality"""
        print("🚀 Starting Chat Functionality and AI System Testing")
        print("=" * 80)
        print("Testing chat functionality and AI system with enhanced business knowledge:")
        print("• Backend connectivity and health check")
        print("• Chat session creation")
        print("• Chat message sending")
        print("• AI response quality with business knowledge")
        print("• WebSocket connection (if available)")
        print("• Message history retrieval")
        print("• Pricing knowledge accuracy")
        print("=" * 80)
        
        # Execute all tests
        try:
            # Basic connectivity tests
            if not self.test_backend_connectivity():
                print("❌ Backend connectivity failed - aborting tests")
                return False
            
            if not self.test_health_check():
                print("❌ Backend health check failed - continuing with caution")
            
            # Core chat functionality tests
            self.test_chat_session_creation()
            self.test_chat_message_sending()
            self.test_ai_response_quality()
            self.test_websocket_connection()  # Optional - may fail if not implemented
            self.test_message_history_retrieval()
            self.test_pricing_knowledge_accuracy()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
            self.log_test("Testing Framework", False, f"Critical error: {str(e)}")
        
        # Generate comprehensive report
        is_ready = self.generate_test_summary()
        
        return is_ready


def main():
    """Main function to run chat functionality testing"""
    print("🎯 Chat Functionality and AI System Testing")
    print("Testing chat functionality and AI system with enhanced business knowledge")
    print()
    
    tester = ChatFunctionalityTester()
    
    try:
        is_ready = tester.run_comprehensive_tests()
        
        if is_ready:
            print("\n🎉 SUCCESS: Chat functionality and AI system are working correctly!")
            return True
        else:
            print("\n❌ ISSUES DETECTED: Chat functionality needs attention before production use")
            return False
            
    except KeyboardInterrupt:
        print("\n⚠️ Testing interrupted by user")
        return False
    except Exception as e:
        print(f"\n❌ Testing failed with error: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)