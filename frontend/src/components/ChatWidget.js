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

  // Create chat session
  const createChatSession = async () => {
    try {
      setIsConnecting(true);
      const response = await axios.post(`${BACKEND_URL}/api/chat/session`);
      setChatSessionId(response.data.session_id);
      
      // Add welcome message
      setChatMessages([{
        id: Date.now(),
        content: "Hello! I'm Sentra AI, your intelligent customer support assistant. I can help you with pricing questions, feature details, ROI calculations, demo requests, or connect you with our sales team. What would you like to know about SentraTech?",
        sender: 'assistant',
        timestamp: new Date()
      }]);
      
      setIsConnecting(false);
    } catch (error) {
      console.error('Failed to create chat session:', error);
      setConnectionError('Failed to start chat session');
      setIsConnecting(false);
    }
  };

  // Send message via REST API
  const sendMessageREST = async (sessionId, message) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/chat/message`,
        {},
        {
          params: {
            session_id: sessionId,
            message: message
          }
        }
      );

      if (response.data && response.data.ai_response) {
        const aiMessage = {
          id: response.data.ai_response.id,
          content: response.data.ai_response.content,
          sender: 'assistant',
          timestamp: new Date(response.data.ai_response.timestamp)
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('REST API message error:', error);
      setConnectionError('Failed to send message');
      setIsTyping(false);
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