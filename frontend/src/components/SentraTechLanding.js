import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MessageSquare, Zap, BarChart3, Heart, Globe, Shield, Phone, 
  Brain, Network, Users, TrendingUp, Award, Star, Menu, X,
  ArrowRight, Play, ChevronLeft, ChevronRight, CheckCircle,
  Send, Maximize2, Minimize2
} from 'lucide-react';
import { mockData, mockApi } from '../data/mock';
import SentraTechLogo from './SentraTechLogo';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const SentraTechLanding = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [stats, setStats] = useState([]);
  const { currentLang, toggleLanguage, t } = useLanguage();
  
  // Live Chat Integration State
  const [chatSessionId, setChatSessionId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [websocket, setWebsocket] = useState(null);
  
  const heroRef = useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Icon mapping
  const iconMap = {
    MessageSquare, Zap, BarChart3, Heart, Globe, Shield, 
    Phone, Brain, Network, Users, TrendingUp, Award
  };

  // Load mock data on component mount
  useEffect(() => {
    mockApi.getStats().then(setStats);
    // Remove mock chat messages loading
  }, []);

  // Enhanced custom cursor effect with synchronized particle trail
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const particles = [];
    let lastParticleTime = 0;
    const particleInterval = 50; // Create particle every 50ms for smoother trail
    
    const moveCursor = (e) => {
      const now = Date.now();
      cursor.style.left = (e.clientX - 8) + 'px'; // Center cursor
      cursor.style.top = (e.clientY - 8) + 'px';
      
      // Create synchronized particle trail at regular intervals
      if (now - lastParticleTime >= particleInterval) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.left = (e.clientX - 2) + 'px'; // Center particle
        particle.style.top = (e.clientY - 2) + 'px';
        
        // Add slight random offset for natural feel
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 6;
        particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        
        document.body.appendChild(particle);
        particles.push({
          element: particle,
          birth: now
        });
        
        lastParticleTime = now;
      }
      
      // Clean up old particles
      particles.forEach((p, index) => {
        if (now - p.birth > 800) { // Particle lifetime: 800ms
          p.element.remove();
          particles.splice(index, 1);
        }
      });
    };

    document.addEventListener('mousemove', moveCursor);
    
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      cursor.remove();
      particles.forEach(p => p.element.remove());
    };
  }, []);

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  // Live Chat Integration Functions
  const createChatSession = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      const response = await axios.post(`${BACKEND_URL}/api/chat/session`);
      
      if (response.data.success) {
        const sessionId = response.data.session_id;
        setChatSessionId(sessionId);
        
        // Try WebSocket connection first
        await connectWebSocket(sessionId);
        
        return sessionId;
      } else {
        throw new Error('Failed to create chat session');
      }
    } catch (error) {
      console.error('Error creating chat session:', error);
      setConnectionError('Failed to connect to chat service');
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWebSocket = async (sessionId) => {
    try {
      const wsUrl = `wss://${window.location.host}/ws/chat/${sessionId}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setWebsocket(ws);
        setConnectionError(null);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'system') {
          // Handle welcome message
          const systemMessage = {
            id: Date.now(),
            content: data.content,
            sender: 'assistant',
            timestamp: new Date(data.timestamp)
          };
          setChatMessages(prev => [...prev, systemMessage]);
        } else if (data.type === 'ai_response') {
          // Handle AI response
          const aiMessage = {
            id: data.id,
            content: data.content,
            sender: 'assistant',
            timestamp: new Date(data.timestamp)
          };
          setChatMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        } else if (data.type === 'typing') {
          setIsTyping(data.is_typing);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection lost. Using fallback mode.');
        setWebsocket(null);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWebsocket(null);
      };
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setConnectionError('WebSocket unavailable. Using REST API.');
    }
  };

  const sendMessageWebSocket = (message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      const messageData = {
        type: 'user_message',
        content: message
      };
      websocket.send(JSON.stringify(messageData));
      return true;
    }
    return false;
  };

  const sendMessageREST = async (sessionId, message) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/chat/message?session_id=${sessionId}&message=${encodeURIComponent(message)}`
      );
      
      if (response.data.success) {
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
    
    // Try WebSocket first, fallback to REST API
    const sentViaWebSocket = sendMessageWebSocket(chatInput);
    
    if (!sentViaWebSocket) {
      // Fallback to REST API
      await sendMessageREST(chatSessionId, chatInput);
    }
  };

  // Using translations from useLanguage hook

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA] overflow-x-hidden font-rajdhani">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2a2a2a]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* SentraTech Logo */}
              <SentraTechLogo 
                width={48} 
                height={48} 
                showText={true} 
                textColor="#00FF41"
                className=""
              />
            </div>
            
            {/* Company Slogan Display */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Slogan Display */}
              <div className="flex items-center space-x-6 text-lg font-rajdhani font-medium">
                <span className="text-[#00FF41] tracking-wider">
                  {t.nav.features}
                </span>
                <span className="text-[#e2e8f0]">•</span>
                <span className="text-[#00FF41] tracking-wider">
                  {t.nav.pricing}
                </span>
                <span className="text-[#e2e8f0]">•</span>
                <span className="text-[#00FF41] tracking-wider">
                  {t.nav.about}
                </span>
              </div>
              
              <Button 
                onClick={() => {
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 py-2 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                {t.hero.cta}
              </Button>
              
              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1 bg-[#1a1a1a] rounded-lg text-sm text-[#e2e8f0] hover:text-[#00FF41] border border-[#2a2a2a]"
              >
                {currentLang === 'en' ? 'বাং' : 'ENG'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#e2e8f0] hover:text-[#00FF41]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[rgb(63,63,63)]">
              <div className="flex flex-col space-y-4 mt-4">
                {/* Mobile Slogan Display */}
                <div className="text-center py-4">
                  <div className="flex flex-col space-y-2 text-base font-rajdhani font-medium">
                    <span className="text-[#00FF41] tracking-wider">
                      {t.nav.features}
                    </span>
                    <span className="text-[#00FF41] tracking-wider">
                      {t.nav.pricing}
                    </span>
                    <span className="text-[#00FF41] tracking-wider">
                      {t.nav.about}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    const contactSection = document.querySelector('#contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-[#00FF41] text-[#0A0A0A] w-full rounded-xl"
                >
                  {t.hero.cta}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Space-themed WebGL Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A]">
          {/* Data Network Nodes */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="w-full h-full opacity-20" viewBox="0 0 1920 1080">
              {/* Network Nodes */}
              {[...Array(40)].map((_, i) => {
                const x = (i % 8) * 240 + 120 + Math.random() * 100;
                const y = Math.floor(i / 8) * 180 + 90 + Math.random() * 100;
                
                return (
                  <g key={i}>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="2" 
                      fill="#00FF41"
                      opacity="0.6"
                    >
                      <animate 
                        attributeName="opacity" 
                        values="0.3;0.9;0.3" 
                        dur={`${2 + (i % 3)}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.1}s`}
                      />
                    </circle>
                    
                    {/* Connection Lines */}
                    {i < 39 && (i % 8) < 7 && (
                      <line
                        x1={x}
                        y1={y}
                        x2={(((i + 1) % 8) * 240) + 120 + Math.random() * 100}
                        y2={Math.floor((i + 1) / 8) * 180 + 90 + Math.random() * 100}
                        stroke="#00FF41"
                        strokeWidth="1"
                        opacity="0.2"
                        strokeDasharray="2 4"
                        className="animate-data-flow"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Realistic Shooting Stars - Reduced Density */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-shooting-star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 15}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              >
                <div 
                  className="w-0.5 h-16 opacity-70 transform rotate-45"
                  style={{
                    background: `linear-gradient(to bottom, 
                      transparent, 
                      ${i % 4 === 0 ? '#ffffff' : i % 4 === 1 ? '#f0f8ff' : i % 4 === 2 ? '#e6f3ff' : '#ddeeff'}, 
                      transparent)`,
                    filter: 'blur(0.5px)'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Realistic Twinkling Stars */}
          <div className="absolute inset-0">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  background: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#f8fafc' : '#e2e8f0',
                  opacity: 0.4 + Math.random() * 0.6,
                  animation: `twinkle ${3 + Math.random() * 6}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 4}s`,
                  filter: `blur(${Math.random() * 0.5}px)`
                }}
              />
            ))}
          </div>

          {/* Matrix Digital Rain Effect */}
          <div className="absolute inset-0 opacity-5">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="digital-rain absolute text-xs"
                style={{
                  left: `${i * 5}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 3}s`
                }}
              >
                {['01', '10', '11', '00'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#F8F9FA] to-[#e2e8f0] bg-clip-text text-transparent">
                {t.hero.title}
              </span>
            </h1>
            
            <p className="body-text text-xl md:text-2xl text-[#e2e8f0] mb-8 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat, index) => (
                <div key={stat.id} className="text-center p-4 bg-[#1a1a1a]/50 rounded-xl border border-[#2a2a2a] backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-[#00FF41] mb-1 font-rajdhani">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-[#a1a1aa] font-rajdhani">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Button 
                size="lg"
                onClick={() => {
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200 min-w-48 font-rajdhani"
              >
                <Play className="mr-2" size={20} />
                {t.hero.cta}
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-[#2a2a2a] text-[#F8F9FA] hover:border-[#00FF41] hover:text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] px-8 py-4 rounded-xl transition-all duration-200 min-w-48 font-rajdhani"
              >
                {t.hero.secondaryCta}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`bg-[rgb(26,28,30)] rounded-2xl shadow-2xl border border-[rgb(63,63,63)] transition-all duration-300 ${
          chatOpen ? 'w-80 h-96' : 'w-16 h-16'
        }`}>
          {chatOpen ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#00FF41] rounded-full flex items-center justify-center">
                    <MessageSquare size={16} className="text-[#0A0A0A]" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">SentraTech AI</div>
                    <div className="text-[#00FF41] text-xs">
                      {isConnecting ? 'Connecting...' : 
                       connectionError ? 'Offline' : 
                       isTyping ? 'Typing...' : 'Online'}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setChatOpen(false)}
                  className="text-[rgb(161,161,170)] hover:text-white"
                >
                  <Minimize2 size={16} />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {connectionError && (
                  <div className="text-center p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-xs">
                    {connectionError}
                  </div>
                )}
                
                {chatMessages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-xl text-sm ${
                      message.sender === 'user'
                        ? 'bg-[#00FF41] text-[#0A0A0A]'
                        : 'bg-[rgb(38,40,42)] text-white border border-[rgb(63,63,63)]'
                    }`}>
                      <div>{message.content || message.text}</div>
                      <div className={`text-xs mt-1 opacity-70 ${
                        message.sender === 'user' ? 'text-[#0A0A0A]' : 'text-[rgb(161,161,170)]'
                      }`}>
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[rgb(38,40,42)] text-white border border-[rgb(63,63,63)] p-3 rounded-xl text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-[#2a2a2a]">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    disabled={isConnecting}
                    className="flex-1 bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] text-sm rounded-xl"
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
              className="w-full h-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] rounded-2xl flex items-center justify-center"
            >
              <MessageSquare size={24} />
            </Button>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-cursor {
          position: fixed;
          width: 16px;
          height: 16px;
          border: 2px solid #00FF41;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.05s ease;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        }
        
        .cursor-particle {
          position: fixed;
          width: 4px;
          height: 4px;
          background: #00FF41;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          animation: particleTrail 0.8s ease-out forwards;
          box-shadow: 0 0 6px rgba(0, 255, 65, 0.8);
        }
        
        @keyframes particleFade {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SentraTechLanding;