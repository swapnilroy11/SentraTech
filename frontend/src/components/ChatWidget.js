import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { MessageSquare, Send, X, Minimize2 } from 'lucide-react';
import axios from 'axios';

const ChatWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSessionId, setChatSessionId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Create chat session with robust connectivity testing
  const createChatSession = async () => {
    setIsConnecting(true);
    
    try {
      const { hasNetwork } = await import('../config/dashboardConfig.js');
      
      // Real connectivity test before attempting session creation
      const networkAvailable = await hasNetwork();
      if (!networkAvailable) {
        console.warn('🌐 Chat: Network probe failed - starting in offline mode');
        setChatSessionId(`offline_${Date.now()}`);
        setChatMessages([{
          id: Date.now(),
          content: "Hello! I'm Sentra AI, your intelligent customer support assistant. I can help you with pricing questions, feature details, ROI calculations, demo requests, or connect you with our sales team. What would you like to know about SentraTech? (Network unavailable - offline mode)",
          sender: 'assistant',
          timestamp: new Date()
        }]);
        setIsConnecting(false);
        setConnectionError(null);
        return;
      }

      // Try to create network session
      try {
        const response = await axios.post(`${BACKEND_URL}/api/chat/session`, {
          timestamp: new Date().toISOString()
        });
        
        if (response.data && response.data.session_id) {
          setChatSessionId(response.data.session_id);
          setChatMessages([{
            id: Date.now(),
            content: "Hello! I'm Sentra AI, your intelligent customer support assistant. I can help you with pricing questions, feature details, ROI calculations, demo requests, or connect you with our sales team. What would you like to know about SentraTech?",
            sender: 'assistant',
            timestamp: new Date()
          }]);
        } else {
          throw new Error('Invalid session response');
        }
      } catch (networkError) {
        console.warn('Network session creation failed, using offline mode:', networkError.message);
        setChatSessionId(`fallback_${Date.now()}`);
        setChatMessages([{
          id: Date.now(),
          content: "Hello! I'm Sentra AI, your intelligent customer support assistant. I can help you with pricing questions, feature details, ROI calculations, demo requests, or connect you with our sales team. What would you like to know about SentraTech? (Network unavailable, using offline mode)",
          sender: 'assistant',
          timestamp: new Date()
        }]);
      }
      
      setIsConnecting(false);
      setConnectionError(null);
    } catch (error) {
      console.error('Chat session creation error:', error);
      // Fallback to offline mode
      setChatSessionId(`error_${Date.now()}`);
      setChatMessages([{
        id: Date.now(),
        content: "Hello! I'm Sentra AI. I'm currently running in offline mode, but I can still help you with general information about SentraTech's services.",
        sender: 'assistant',
        timestamp: new Date()
      }]);
      setIsConnecting(false);
      setConnectionError(null);
    }
  };

  // Send message with robust connectivity testing
  const sendMessageREST = async (sessionId, message) => {
    try {
      const { submitChatMessageWithRateLimit } = await import('../config/dashboardConfig.js');
      
      // Check if using offline session (but don't check navigator.onLine)
      if (sessionId.startsWith('offline_') || sessionId.startsWith('fallback_') || sessionId.startsWith('error_')) {
        console.warn('Using offline chat response (offline session)');
        const { generateOfflineResponse } = await import('../config/dashboardConfig.js');
        const result = generateOfflineResponse(message);
        
        const aiMessage = {
          id: Date.now(),
          content: result.response,
          sender: 'assistant',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        setConnectionError(null);
        return;
      }

      // Try network submission
      const result = await submitChatMessage(message, sessionId);
      
      if (result.success) {
        const aiMessage = {
          id: Date.now(),
          content: result.response,
          sender: 'assistant',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        setConnectionError(null);
        
        // Update session ID if provided
        if (result.conversationId && result.conversationId !== sessionId) {
          setChatSessionId(result.conversationId);
        }
      } else {
        throw new Error(result.error || 'Chat response failed');
      }
    } catch (error) {
      console.warn('Network chat failed, using offline response:', error.message);
      
      try {
        const { generateOfflineResponse } = await import('../config/dashboardConfig.js');
        const result = generateOfflineResponse(message);
        
        const aiMessage = {
          id: Date.now(),
          content: result.response,
          sender: 'assistant',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } catch (fallbackError) {
        // Ultimate fallback
        const aiMessage = {
          id: Date.now(),
          content: "I apologize, but I'm currently experiencing technical difficulties. Please try contacting our support team directly for assistance, or visit our help documentation.",
          sender: 'assistant',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
      
      setIsTyping(false);
      setConnectionError(null);
    }
  };

  const handleChatOpen = async () => {
    setChatOpen(true);
    
    if (!chatSessionId) {
      await createChatSession();
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !chatSessionId) return;
    
    const userMessage = {
      id: Date.now(),
      content: chatInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    
    // Send via REST API
    await sendMessageREST(chatSessionId, chatInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className={`transition-all duration-300 ${chatOpen ? 'w-80 h-96' : 'w-16 h-16'}`}>
        {chatOpen ? (
          <div className="bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.3)] rounded-2xl h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#00FF41] text-black rounded-full flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Sentra AI</h4>
                  <p className="text-[rgb(161,161,170)] text-xs">
                    {isConnecting ? 'Connecting...' : 'Online • Sub-50ms response'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatOpen(false)}
                className="text-[rgb(161,161,170)] hover:text-white p-1"
              >
                <Minimize2 size={16} />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-xl text-sm ${
                      message.sender === 'user'
                        ? 'bg-[#00FF41] text-[#0A0A0A]'
                        : 'bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)]'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] p-3 rounded-xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {connectionError && (
                <div className="text-center">
                  <p className="text-red-400 text-xs">{connectionError}</p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-2 text-white text-sm placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41] transition-colors"
                  disabled={isConnecting || !chatSessionId}
                />
                <Button
                  size="sm"
                  onClick={handleChatSend}
                  disabled={!chatInput.trim() || isConnecting}
                  className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] rounded-xl px-3"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleChatOpen}
            className="w-full h-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageSquare size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;