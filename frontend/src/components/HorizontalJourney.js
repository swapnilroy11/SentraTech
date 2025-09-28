import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, ArrowRight, Phone, Mail, MessageSquare, 
  Users, BarChart3, Target, Brain, Zap, Clock, 
  TrendingUp, CheckCircle, X, Play, Pause
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HorizontalJourney = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);
  
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // Initialize as false, detect in useEffect
  const [hasThreeJSError, setHasThreeJSError] = useState(false);
  
  // Handle modal opening/closing with body scroll lock
  const openModal = (stage) => {
    setSelectedPanel(stage);
    document.body.classList.add('modal-open');
  };
  
  const closeModal = () => {
    setSelectedPanel(null);
    document.body.classList.remove('modal-open');
  };
  
  const { t } = useLanguage();

  // Journey stages data - now using translations
  const journeyStages = [
    {
      id: 'contact',
      title: t.journey.stages.contact.title,
      subtitle: t.journey.stages.contact.subtitle,
      metric: '<5s',
      metricLabel: 'Response Time',
      description: t.journey.stages.contact.description,
      icon: MessageSquare,
      color: '#00FF41',
      automationRate: 85,
      keyFeatures: t.journey.stages.contact.features,
      channels: ['Voice', 'Chat', 'Email', 'SMS', 'Social Media']
    },
    {
      id: 'triage',
      title: t.journey.stages.triage.title,
      subtitle: t.journey.stages.triage.subtitle,
      metric: '<50ms',
      metricLabel: 'Analysis Time',
      description: t.journey.stages.triage.description,
      icon: Brain,
      color: '#00DDFF',
      automationRate: 94,
      keyFeatures: t.journey.stages.triage.features,
      channels: ['AI Engine', 'NLP Analysis', 'Sentiment Detection', 'Priority Routing']
    },
    {
      id: 'engagement',
      title: t.journey.stages.engagement.title,
      subtitle: t.journey.stages.engagement.subtitle,
      metric: '70%',
      metricLabel: 'Automation Rate',
      description: t.journey.stages.engagement.description,
      icon: Zap,
      color: '#FFD700',
      automationRate: 70,
      keyFeatures: t.journey.stages.engagement.features,
      channels: ['Chatbot', 'Live Agent', 'Knowledge Base', 'Self-Service']
    },
    {
      id: 'augmentation',
      title: t.journey.stages.augmentation.title,
      subtitle: t.journey.stages.augmentation.subtitle,
      metric: '60%',
      metricLabel: 'Productivity Gain',
      description: t.journey.stages.augmentation.description,
      icon: Users,
      color: '#FF6B6B',
      automationRate: 60,
      keyFeatures: t.journey.stages.augmentation.features,
      channels: ['Agent Dashboard', 'AI Assistant', 'CRM Integration', 'Real-time Insights']
    },
    {
      id: 'analytics',
      title: t.journey.stages.analytics.title,
      subtitle: t.journey.stages.analytics.subtitle,
      metric: '99.9%',
      metricLabel: 'Data Accuracy',
      description: t.journey.stages.analytics.description,
      icon: BarChart3,
      color: '#9D4EDD',
      automationRate: 100,
      keyFeatures: t.journey.stages.analytics.features,
      channels: ['Performance Metrics', 'Quality Scores', 'Satisfaction Tracking', 'Business Intelligence']
    },
    {
      id: 'outcome',
      title: t.journey.stages.outcome.title,
      subtitle: t.journey.stages.outcome.subtitle,
      metric: '96%',
      metricLabel: 'Customer Satisfaction',
      description: t.journey.stages.outcome.description,
      icon: CheckCircle,
      color: '#00FF41',
      automationRate: 88,
      keyFeatures: t.journey.stages.outcome.features,
      channels: ['Follow-up Automation', 'Feedback Collection', 'ML Learning', 'Process Optimization']
    }
  ];

  const { scrollXProgress } = useScroll({
    container: containerRef,
    axis: 'x'
  });

  // Scroll to panel function
  const scrollToPanel = (panelIndex) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: panelIndex * window.innerWidth,
        behavior: 'smooth'
      });
      setCurrentPanel(panelIndex);
    }
  };

  // Auto-advance functionality
  useEffect(() => {
    if (!isAutoAdvancing || isHovered || isMobile) return;
    
    const timer = setInterval(() => {
      setCurrentPanel(prev => {
        const nextPanel = (prev + 1) % journeyStages.length;
        // Actually scroll to the next panel
        if (containerRef.current) {
          containerRef.current.scrollTo({
            left: nextPanel * window.innerWidth,
            behavior: 'smooth'
          });
        }
        return nextPanel;
      });
    }, 8000);
    
    return () => clearInterval(timer);
  }, [isAutoAdvancing, isHovered, isMobile, journeyStages.length]);

  // Mobile detection
  useEffect(() => {
    const detectMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial detection after component mounts
    detectMobile();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Three.js neural network background
  useEffect(() => {
    if (isMobile || !canvasRef.current) return;
    
    // Additional WebGL checks (don't modify mobile state)
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.log('WebGL not supported, will show mobile fallback');
        setHasThreeJSError(true);
        return;
      }
    } catch (e) {
      console.log('WebGL check failed, will show mobile fallback');
      setHasThreeJSError(true);
      return;
    }

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / 400, 
        0.1, 
        1000
      );
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, 400);
      renderer.setClearColor(0x000000, 0);

    // Create neural node network
    const nodeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00FF41,
      transparent: true,
      opacity: 0.6
    });

    const nodes = [];
    const connections = [];

    // Create nodes
    for (let i = 0; i < 50; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10
      );
      scene.add(node);
      nodes.push(node);
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < 3) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position
          ]);
          const material = new THREE.LineBasicMaterial({
            color: 0x00FF41,
            transparent: true,
            opacity: 0.2
          });
          const line = new THREE.Line(geometry, material);
          scene.add(line);
          connections.push(line);
        }
      }
    }

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Animate nodes
      nodes.forEach((node, index) => {
        node.position.x += Math.sin(time + index) * 0.01;
        node.rotation.x = time + index;
        node.rotation.y = time + index * 0.5;
      });

      // Animate camera based on scroll
      camera.position.x = scrollXProgress.get() * 10 - 5;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        renderer.dispose();
      };
    } catch (error) {
      console.error('Three.js initialization failed:', error);
      setHasThreeJSError(true); // Only set Three.js error, don't force mobile
    }
  }, [isMobile, scrollXProgress]);

  // Keyboard navigation and modal escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPanel) {
        closeModal();
      } else if (!selectedPanel) {
        if (e.key === 'ArrowLeft' && currentPanel > 0) {
          scrollToPanel(currentPanel - 1);
        } else if (e.key === 'ArrowRight' && currentPanel < journeyStages.length - 1) {
          scrollToPanel(currentPanel + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPanel, journeyStages.length, selectedPanel]);
  
  // Cleanup body class and modal container on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
      const modalContainer = document.getElementById('customer-journey-modal-root');
      if (modalContainer && modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer);
      }
    };
  }, []);

  const ChannelIcon = ({ type, delay }) => {
    const icons = {
      phone: Phone,
      email: Mail,
      chat: MessageSquare,
      social: Users,
      sms: MessageSquare
    };
    
    const Icon = icons[type] || Phone;
    
    return (
      <motion.div
        className="absolute opacity-20"
        initial={{ x: -100, opacity: 0 }}
        animate={{ 
          x: window.innerWidth + 100, 
          opacity: 0.3,
          transition: { 
            duration: 20, 
            delay, 
            repeat: Infinity, 
            ease: 'linear' 
          }
        }}
        style={{
          top: `${Math.random() * 300 + 50}px`,
        }}
      >
        <Icon size={24} className="text-[#00FF41]" />
      </motion.div>
    );
  };

  if (isMobile || hasThreeJSError) {
    // Static mobile fallback
    return (
      <section className="py-20 bg-[#0A0A0A] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
              <Brain className="mr-2" size={14} />
              Customer Journey
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Intelligent Customer Experience Flow
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Six stages of AI-powered customer support optimization
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {journeyStages.map((stage, index) => (
              <Card key={stage.id} className="bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.3)] rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-[rgba(0,255,65,0.2)] rounded-xl flex items-center justify-center border border-[rgba(0,255,65,0.5)]">
                      <stage.icon size={24} style={{ color: stage.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{stage.title}</h3>
                      <p className="text-[rgb(161,161,170)]">{stage.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: stage.color }}>
                        {stage.metric}
                      </div>
                      <div className="text-xs text-[rgb(161,161,170)]">
                        {stage.metricLabel}
                      </div>
                    </div>
                  </div>
                  <p className="text-[rgb(218,218,218)] text-sm">
                    {stage.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Custom styles for smooth scrolling and modal positioning */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .customer-journey-modal-overlay {
          will-change: opacity, backdrop-filter;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 99999 !important;
          padding: 20px !important;
          box-sizing: border-box !important;
        }
        .customer-journey-modal-content {
          will-change: transform, opacity;
          position: relative !important;
          max-width: 32rem !important;
          width: 100% !important;
          max-height: 90vh !important;
          margin: 0 !important;
          flex-shrink: 0 !important;
        }
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
      {/* Three.js Neural Network Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Channel Icons Midground */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {['phone', 'email', 'chat', 'social', 'sms'].map((type, index) => (
          <ChannelIcon key={`${type}-${index}`} type={type} delay={index * 4} />
        ))}
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide h-full"
        style={{ 
          zIndex: 3,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        onScroll={(e) => {
          const scrollLeft = e.target.scrollLeft;
          const panelIndex = Math.round(scrollLeft / window.innerWidth);
          setCurrentPanel(panelIndex);
        }}
      >
        {journeyStages.map((stage, index) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-screen h-full snap-center flex items-center justify-center relative"
            style={{ minWidth: '100vw' }}
          >
            {/* Stage Content Card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
              >
                <Card 
                  className="w-[500px] h-80 bg-[#0A0A0A] border-2 border-[rgba(0,255,65,0.3)] rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                  onClick={() => openModal(stage)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${stage.title} - ${stage.subtitle}`}
                >
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${stage.color}20`,
                          border: `2px solid ${stage.color}50`
                        }}
                      >
                        <stage.icon size={32} style={{ color: stage.color }} />
                      </div>
                      <Badge 
                        className="text-sm px-3 py-1 font-medium"
                        style={{ 
                          backgroundColor: `${stage.color}20`,
                          color: stage.color,
                          border: `1px solid ${stage.color}50`
                        }}
                      >
                        Step {index + 1}
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <div 
                        className="text-4xl font-bold font-rajdhani"
                        style={{ color: stage.color }}
                      >
                        {stage.metric}
                      </div>
                      <div className="text-[rgb(161,161,170)] text-sm">
                        {stage.metricLabel}
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 mb-6">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {stage.title}
                    </h3>
                    <p className="text-[rgb(161,161,170)] text-base leading-relaxed mb-4">
                      {stage.subtitle}
                    </p>
                    
                    {/* Key Features Preview */}
                    <div className="space-y-2">
                      {stage.keyFeatures.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          <span className="text-[rgb(218,218,218)] text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-sm font-medium" style={{ color: stage.color }}>
                        {stage.automationRate}% Automated
                      </span>
                    </div>
                    <div className="text-sm text-[#00FF41] font-medium">
                      Click to explore →
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-10">
        <Button
          onClick={() => setIsAutoAdvancing(!isAutoAdvancing)}
          size="sm"
          variant="outline"
          className="border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black"
        >
          {isAutoAdvancing ? <Pause size={16} /> : <Play size={16} />}
        </Button>

        <div className="flex space-x-2">
          {journeyStages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToPanel(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPanel ? 'bg-[#00FF41] w-6' : 'bg-[rgba(0,255,65,0.3)]'
              }`}
              aria-label={`Go to panel ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => currentPanel > 0 && scrollToPanel(currentPanel - 1)}
            disabled={currentPanel === 0}
            size="sm"
            variant="outline"
            className="border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black disabled:opacity-30"
          >
            <ArrowLeft size={16} />
          </Button>
          <Button
            onClick={() => currentPanel < journeyStages.length - 1 && scrollToPanel(currentPanel + 1)}
            disabled={currentPanel === journeyStages.length - 1}
            size="sm"
            variant="outline"
            className="border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black disabled:opacity-30"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Journey Stage Details Modal - Inline Modal (No Portal) */}
      {selectedPanel && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(15px)',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          onClick={closeModal}
        >
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.15,
                ease: "easeOut"
              }}
              className="relative rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(26, 28, 30, 0.95) 0%, rgba(38, 40, 42, 0.95) 100%)`,
                border: `2px solid ${selectedPanel.color}`,
                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px ${selectedPanel.color}20, 0 0 20px ${selectedPanel.color}30`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Custom Scrollable Content */}
              <div 
                className="overflow-y-auto pr-2 max-h-full"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${selectedPanel.color}40 transparent`
                }}
              >
                {/* Custom scrollbar styles */}
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${selectedPanel.color}40;
                    border-radius: 3px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${selectedPanel.color}60;
                  }
                `}</style>

                {/* Close Button */}
                <Button
                  onClick={closeModal}
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 w-7 h-7 p-0 text-white hover:bg-white/10 z-20"
                  style={{ 
                    borderColor: selectedPanel.color + '40',
                    color: selectedPanel.color
                  }}
                >
                  <X size={14} />
                </Button>

                {/* Stage Content */}
                <div className="space-y-5 custom-scrollbar">
                  {/* Header */}
                  <div className="text-center space-y-3 pt-2">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${selectedPanel.color}20`,
                          border: `1px solid ${selectedPanel.color}40`
                        }}
                      >
                        <selectedPanel.icon size={20} style={{ color: selectedPanel.color }} />
                      </div>
                      <Badge 
                        variant="outline" 
                        style={{ 
                          borderColor: selectedPanel.color,
                          color: selectedPanel.color,
                          backgroundColor: `${selectedPanel.color}10`
                        }}
                      >
                        Stage {journeyStages.findIndex(stage => stage.id === selectedPanel.id) + 1}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{selectedPanel.title}</h3>
                    <p className="text-lg" style={{ color: selectedPanel.color }}>{selectedPanel.subtitle}</p>
                  </div>

                {/* Description */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Overview</h4>
                  <p className="text-[rgb(218,218,218)] leading-relaxed">
                    {selectedPanel.description}
                  </p>
                </div>

                {/* Process Overview */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Brain className="text-[#00FF41]" size={20} />
                    Process Overview
                  </h4>
                  <ul className="space-y-2 text-[rgb(218,218,218)]">
                    {selectedPanel.processSteps?.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-[#00FF41] mt-1 flex-shrink-0" size={16} />
                        {step}
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="text-[#00FF41] mt-1 flex-shrink-0" size={16} />
                          Intelligent routing and processing of customer interactions
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="text-[#00FF41] mt-1 flex-shrink-0" size={16} />
                          AI-powered analysis and response generation
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="text-[#00FF41] mt-1 flex-shrink-0" size={16} />
                          Real-time quality monitoring and optimization
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Key Metrics */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="text-[#00FF41]" size={20} />
                    Key Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[rgb(38,40,42)] rounded-lg p-3 border border-[rgb(63,63,63)]">
                      <div className="text-2xl font-bold text-[#00FF41]">
                        {selectedPanel.metrics?.efficiency || '95%'}
                      </div>
                      <div className="text-sm text-[rgb(161,161,170)]">Efficiency Rate</div>
                    </div>
                    <div className="bg-[rgb(38,40,42)] rounded-lg p-3 border border-[rgb(63,63,63)]">
                      <div className="text-2xl font-bold text-[#00FF41]">
                        {selectedPanel.metrics?.responseTime || '<30s'}
                      </div>
                      <div className="text-sm text-[rgb(161,161,170)]">Avg Response</div>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="text-[#00FF41]" size={20} />
                    Key Features
                  </h4>
                  <div className="grid gap-3">
                    {(selectedPanel.features || [
                      'Advanced AI Processing',
                      'Real-time Analytics', 
                      'Quality Assurance',
                      'Seamless Integration'
                    ]).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-[rgb(38,40,42)] rounded-lg border border-[rgb(63,63,63)]">
                        <div className="w-2 h-2 bg-[#00FF41] rounded-full"></div>
                        <span className="text-[rgb(218,218,218)]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Channels */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Target className="text-[#00FF41]" size={20} />
                    Integration Channels
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedPanel.channels || ['Phone', 'Email', 'Chat', 'Social']).map((channel, index) => (
                      <Badge key={index} variant="outline" className="border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/10">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default HorizontalJourney;