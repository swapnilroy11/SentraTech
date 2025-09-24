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
              <a href="#features" className="text-[rgb(218,218,218)] hover:text-[#DAFF01] transition-colors">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-[rgb(218,218,218)] hover:text-[#DAFF01] transition-colors">
                {t.nav.pricing}
              </a>
              <a href="#about" className="text-[rgb(218,218,218)] hover:text-[#DAFF01] transition-colors">
                {t.nav.about}
              </a>
              <Button 
                className="bg-[#DAFF01] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)] font-semibold px-6 py-2 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                {t.hero.cta}
              </Button>
              
              {/* Language Toggle */}
              <button 
                onClick={() => setCurrentLang(currentLang === 'en' ? 'bn' : 'en')}
                className="px-3 py-1 bg-[rgb(26,28,30)] rounded-lg text-sm text-[rgb(218,218,218)] hover:text-[#DAFF01]"
              >
                {currentLang === 'en' ? 'বাং' : 'ENG'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[rgb(218,218,218)] hover:text-[#DAFF01]"
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
        {/* AI-Powered Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(17,17,19)]">
          {/* Neural Network Animation */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              {/* Neural Network Nodes */}
              {[...Array(25)].map((_, i) => {
                const x = (i % 5) * 400 + 200 + Math.random() * 100;
                const y = Math.floor(i / 5) * 200 + 150 + Math.random() * 100;
                return (
                  <g key={i}>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="#DAFF01" 
                      className="animate-pulse"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: `${2 + Math.random()}s`
                      }}
                    />
                    {/* Connection Lines */}
                    {i < 20 && (
                      <line
                        x1={x}
                        y1={y}
                        x2={(i + 5) % 5 === 0 ? x + 400 : ((i + 5) % 5) * 400 + 200 + Math.random() * 100}
                        y2={(i + 5) % 5 === 0 ? y : Math.floor((i + 5) / 5) * 200 + 150 + Math.random() * 100}
                        stroke="#00DDFF"
                        strokeWidth="1"
                        opacity="0.3"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Data Flow Animation */}
          <div className="absolute inset-0 opacity-15">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + Math.random() * 2}s`
                }}
              >
                <div className="flex items-center space-x-2 text-[#DAFF01] text-xs opacity-50">
                  <MessageSquare size={12} />
                  <span>AI Route</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Central AI Brain Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-80 opacity-10">
              {/* Rotating AI Brain Core */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-full h-full border-2 border-[#DAFF01] rounded-full"></div>
                <div className="absolute inset-4 border border-[#00DDFF] rounded-full"></div>
                <div className="absolute inset-8 border border-[rgb(192,192,192)] rounded-full"></div>
                
                {/* AI Processing Indicators */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-[#DAFF01] rounded-full animate-pulse"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `rotate(${i * 30}deg) translateY(-140px) translateX(-50%)`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
              
              {/* Sub-50ms Indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[#DAFF01] text-sm font-bold opacity-30 animate-pulse">
                  <Zap size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Support Icons Floating */}
          <div className="absolute inset-0">
            {[
              { icon: Phone, x: '15%', y: '25%', delay: '0s' },
              { icon: MessageSquare, x: '85%', y: '35%', delay: '1s' },
              { icon: Users, x: '20%', y: '75%', delay: '2s' },
              { icon: BarChart3, x: '80%', y: '20%', delay: '3s' },
              { icon: Globe, x: '25%', y: '50%', delay: '4s' },
              { icon: Shield, x: '75%', y: '65%', delay: '5s' }
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={i}
                  className="absolute opacity-10 animate-float"
                  style={{
                    left: item.x,
                    top: item.y,
                    animationDelay: item.delay,
                    animationDuration: '6s'
                  }}
                >
                  <IconComponent size={32} className="text-[#DAFF01]" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-[rgb(218,218,218)] bg-clip-text text-transparent">
                {t.hero.title}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[rgb(218,218,218)] mb-8 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat, index) => (
                <div key={stat.id} className="text-center p-4 bg-[rgb(26,28,30)]/50 rounded-xl border border-[rgb(63,63,63)]">
                  <div className="text-2xl md:text-3xl font-bold text-[#DAFF01] mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-[rgb(161,161,170)]">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Button 
                size="lg"
                className="bg-[#DAFF01] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)] font-semibold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200 min-w-48"
              >
                <Play className="mr-2" size={20} />
                {t.hero.cta}
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-[rgb(63,63,63)] text-white hover:border-[#DAFF01] hover:text-[#DAFF01] hover:bg-[rgba(218,255,1,0.1)] px-8 py-4 rounded-xl transition-all duration-200 min-w-48"
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
          border: 2px solid #DAFF01;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.1s ease;
        }
        
        .cursor-particle {
          position: fixed;
          width: 4px;
          height: 4px;
          background: #00DDFF;
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