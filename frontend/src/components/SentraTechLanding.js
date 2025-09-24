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
    <div className="min-h-screen bg-[rgb(17,17,19)] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[rgb(17,17,19)]/95 backdrop-blur-md border-b border-[rgb(63,63,63)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-1">
                    {/* Recreating the logo pattern with proper geometry */}
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 bg-[rgb(17,17,19)]"></div>
                      <div className="absolute top-0 left-0 w-3 h-3 bg-white"></div>
                      <div className="absolute top-0 right-0 w-3 h-3 bg-white"></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 bg-white"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-white"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                    </div>
                  </div>
                </div>
                <span className="text-[#DAFF01] text-2xl font-bold">SENTRA TECH</span>
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
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(17,17,19)]">
          {/* Particle Animation */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#DAFF01] rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          
          {/* 3D Polyhedron Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 opacity-10 animate-spin-slow">
              <div className="w-full h-full border border-[#DAFF01] transform rotate-45 rounded-3xl"></div>
              <div className="absolute inset-8 border border-[#00DDFF] transform -rotate-45 rounded-3xl"></div>
              <div className="absolute inset-16 border border-[rgb(192,192,192)] transform rotate-12 rounded-3xl"></div>
            </div>
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