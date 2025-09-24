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

const SentraTechLanding = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [stats, setStats] = useState([]);
  const [currentLang, setCurrentLang] = useState('en');
  const heroRef = useRef(null);

  // Icon mapping
  const iconMap = {
    MessageSquare, Zap, BarChart3, Heart, Globe, Shield, 
    Phone, Brain, Network, Users, TrendingUp, Award
  };

  // Load mock data on component mount
  useEffect(() => {
    mockApi.getStats().then(setStats);
    mockApi.getChatMessages().then(setChatMessages);
  }, []);

  // Custom cursor effect
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const particles = [];
    
    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      // Create particle trail
      if (Math.random() > 0.7) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.background = '#00FF41';
        document.body.appendChild(particle);
        
        particles.push(particle);
        
        setTimeout(() => {
          particle.remove();
          particles.splice(particles.indexOf(particle), 1);
        }, 500);
      }
    };

    document.addEventListener('mousemove', moveCursor);
    
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      cursor.remove();
      particles.forEach(p => p.remove());
    };
  }, []);

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Get bot response
    const botResponse = await mockApi.sendChatMessage(chatInput);
    setChatMessages(prev => [...prev, botResponse]);
  };

  const translations = {
    en: {
      hero: {
        title: "Customer Support as a Growth Engine, Powered by AI + BI",
        subtitle: "Transform your customer service into a competitive advantage with our sub-50ms AI routing platform. Reduce costs by 40-60% while improving satisfaction.",
        cta: "Request a Demo",
        secondaryCta: "Explore Docs"
      },
      nav: {
        features: "Features",
        pricing: "Pricing", 
        about: "About",
        contact: "Contact"
      }
    },
    bn: {
      hero: {
        title: "AI + BI দ্বারা চালিত গ্রাহক সহায়তা একটি বৃদ্ধির ইঞ্জিন হিসেবে",
        subtitle: "আমাদের সাব-৫০এমএস AI রাউটিং প্ল্যাটফর্মের সাথে আপনার গ্রাহক সেবাকে প্রতিযোগিতামূলক সুবিধায় রূপান্তরিত করুন।",
        cta: "ডেমো অনুরোধ করুন",
        secondaryCta: "ডকুমেন্টেশন দেখুন"
      },
      nav: {
        features: "বৈশিষ্ট্য",
        pricing: "মূল্য",
        about: "সম্পর্কে", 
        contact: "যোগাযোগ"
      }
    }
  };

  const t = translations[currentLang];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA] overflow-x-hidden font-rajdhani">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2a2a2a]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* SentraTech Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 md:w-12 md:h-12 relative">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    {/* SentraTech Logo - Geometric Pattern */}
                    <rect width="48" height="48" rx="8" fill="#F8F9FA" />
                    <g transform="translate(6, 6)">
                      {/* Main geometric pattern - star/compass shape */}
                      <path
                        d="M18 0L24 12L36 6L24 18L36 30L24 24L18 36L12 24L0 30L12 18L0 6L12 12L18 0Z"
                        fill="#0A0A0A"
                      />
                      {/* Center accent */}
                      <circle cx="18" cy="18" r="3" fill="#00FF41" />
                    </g>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#00FF41] text-xl md:text-2xl font-bold font-rajdhani tracking-wide">
                    SENTRA
                  </span>
                  <span className="text-[#F8F9FA] text-sm md:text-lg font-semibold font-rajdhani -mt-1">
                    TECH
                  </span>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-[#e2e8f0] hover:text-[#00FF41] transition-colors font-medium">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-[#e2e8f0] hover:text-[#00FF41] transition-colors font-medium">
                {t.nav.pricing}
              </a>
              <a href="#about" className="text-[#e2e8f0] hover:text-[#00FF41] transition-colors font-medium">
                {t.nav.about}
              </a>
              <Button 
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 py-2 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                {t.hero.cta}
              </Button>
              
              {/* Language Toggle */}
              <button 
                onClick={() => setCurrentLang(currentLang === 'en' ? 'bn' : 'en')}
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
                <a href="#features" className="text-[rgb(218,218,218)] hover:text-[#DAFF01]">{t.nav.features}</a>
                <a href="#pricing" className="text-[rgb(218,218,218)] hover:text-[#DAFF01]">{t.nav.pricing}</a>
                <a href="#about" className="text-[rgb(218,218,218)] hover:text-[#DAFF01]">{t.nav.about}</a>
                <Button className="bg-[#DAFF01] text-[rgb(17,17,19)] w-full rounded-xl">
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
          {/* Rotating Galaxy Core */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 animate-galaxy">
              <svg className="w-full h-full opacity-20" viewBox="0 0 400 400">
                {/* Central Galaxy Core */}
                <circle cx="200" cy="200" r="8" fill="#00FF41" className="animate-pulse">
                  <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" />
                </circle>
                
                {/* Orbital Rings */}
                {[60, 100, 140, 180].map((radius, i) => (
                  <circle 
                    key={i}
                    cx="200" 
                    cy="200" 
                    r={radius} 
                    fill="none" 
                    stroke="#00FF41" 
                    strokeWidth="1" 
                    opacity={0.3 - i * 0.05}
                    strokeDasharray="5 10"
                  />
                ))}
                
                {/* Data Nodes */}
                {[...Array(24)].map((_, i) => {
                  const angle = (i * 15) * (Math.PI / 180);
                  const radius = 80 + (i % 3) * 40;
                  const x = 200 + Math.cos(angle) * radius;
                  const y = 200 + Math.sin(angle) * radius;
                  
                  return (
                    <g key={i}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="3" 
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
                      {i < 23 && (
                        <line
                          x1={x}
                          y1={y}
                          x2={200 + Math.cos(((i + 1) * 15) * (Math.PI / 180)) * (80 + ((i + 1) % 3) * 40)}
                          y2={200 + Math.sin(((i + 1) * 15) * (Math.PI / 180)) * (80 + ((i + 1) % 3) * 40)}
                          stroke="#00DDFF"
                          strokeWidth="1"
                          opacity="0.2"
                          className="animate-data-flow"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Shooting Stars */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-shooting-star"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 12}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: '4s'
                }}
              >
                <div className="w-1 h-16 bg-gradient-to-b from-transparent via-[#00FF41] to-transparent opacity-60 transform rotate-45"></div>
              </div>
            ))}
          </div>

          {/* Planetary Orbs - Omnichannel Coverage */}
          <div className="absolute inset-0">
            {[
              { icon: Phone, x: '15%', y: '20%', color: '#00FF41', label: 'Voice' },
              { icon: MessageSquare, x: '85%', y: '25%', color: '#00DDFF', label: 'Chat' },
              { icon: Globe, x: '20%', y: '80%', color: '#C0C0C0', label: 'Web' },
              { icon: Users, x: '80%', y: '75%', color: '#00FF41', label: 'Social' }
            ].map((planet, i) => {
              const IconComponent = planet.icon;
              return (
                <div
                  key={i}
                  className="absolute animate-planet-pulse"
                  style={{
                    left: planet.x,
                    top: planet.y,
                    animationDelay: `${i * 1.5}s`,
                    animationDuration: '6s'
                  }}
                >
                  <div className="relative">
                    {/* Planet Glow */}
                    <div 
                      className="absolute inset-0 rounded-full blur-md"
                      style={{
                        background: `radial-gradient(circle, ${planet.color}40, transparent)`,
                        width: '60px',
                        height: '60px',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                    {/* Planet Core */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center border"
                      style={{
                        background: `${planet.color}20`,
                        borderColor: planet.color
                      }}
                    >
                      <IconComponent size={16} style={{ color: planet.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matrix Digital Rain Effect */}
          <div className="absolute inset-0 opacity-5">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="digital-rain absolute text-xs"
                style={{
                  left: `${i * 7}%`,
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
              <div className="flex items-center justify-between p-4 border-b border-[rgb(63,63,63)]">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#DAFF01] rounded-full flex items-center justify-center">
                    <MessageSquare size={16} className="text-[rgb(17,17,19)]" />
                  </div>
                  <span className="font-semibold text-sm">Sentra AI</span>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="text-[rgb(161,161,170)] hover:text-white"
                >
                  <Minimize2 size={16} />
                </button>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {chatMessages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg text-sm ${
                      message.sender === 'user' 
                        ? 'bg-[#DAFF01] text-[rgb(17,17,19)]'
                        : 'bg-[rgb(38,40,42)] text-white'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t border-[rgb(63,63,63)]">
                <div className="flex space-x-2">
                  <Input 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Type your message..."
                    className="flex-1 bg-[rgb(38,40,42)] border-[rgb(63,63,63)] text-white placeholder-[rgb(161,161,170)] rounded-lg"
                  />
                  <Button 
                    onClick={handleChatSend}
                    size="sm"
                    className="bg-[#DAFF01] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)] rounded-lg"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setChatOpen(true)}
              className="w-full h-full flex items-center justify-center bg-[#DAFF01] text-[rgb(17,17,19)] rounded-2xl hover:bg-[rgb(166,190,21)] transition-all duration-200"
            >
              <MessageSquare size={24} />
            </button>
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
          transition: transform 0.1s ease;
        }
        
        .cursor-particle {
          position: fixed;
          width: 4px;
          height: 4px;
          background: #00FF41;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          animation: particleFade 0.5s ease-out forwards;
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