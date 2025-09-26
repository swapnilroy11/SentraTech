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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentPanel > 0) {
        scrollToPanel(currentPanel - 1);
      } else if (e.key === 'ArrowRight' && currentPanel < journeyStages.length - 1) {
        scrollToPanel(currentPanel + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPanel, journeyStages.length]);

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
              <Card 
                className="w-[500px] h-80 bg-[#0A0A0A] border-2 border-[rgba(0,255,65,0.3)] rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedPanel(stage)}
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
      
      {/* Global Modal Overlay - Positioned outside section for proper stacking */}
      
      {/* Global Modal Overlay - Positioned outside section for proper stacking */}
      <AnimatePresence>
        {selectedPanel && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999999,
              pointerEvents: 'auto'
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              style={{ 
                zIndex: 999999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              onClick={() => setSelectedPanel(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[rgb(26,28,30)] border-2 border-[#00FF41] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                style={{ 
                  zIndex: 1000000,
                  position: 'relative'
                }}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center border"
                        style={{ 
                          backgroundColor: `${selectedPanel.color}20`,
                          borderColor: selectedPanel.color
                        }}
                      >
                        <selectedPanel.icon size={24} style={{ color: selectedPanel.color }} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedPanel.title}</h2>
                        <p className="text-[#00FF41]">{selectedPanel.subtitle}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setSelectedPanel(null)}
                      size="sm"
                      variant="ghost"
                      className="text-[rgb(161,161,170)] hover:text-white"
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Process Overview</h3>
                      <p className="text-[rgb(218,218,218)] leading-relaxed">
                        {selectedPanel.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Key Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[rgb(161,161,170)]">Performance</span>
                          <span className="text-2xl font-bold" style={{ color: selectedPanel.color }}>
                            {selectedPanel.metric}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[rgb(161,161,170)]">Automation Rate</span>
                          <span className="text-lg font-semibold text-[#00DDFF]">
                            {selectedPanel.automationRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedPanel.keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle size={16} style={{ color: selectedPanel.color }} />
                          <span className="text-[rgb(218,218,218)] text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Integration Channels</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPanel.channels.map((channel, index) => (
                        <Badge
                          key={index}
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${selectedPanel.color}20`,
                            color: selectedPanel.color,
                            border: `1px solid ${selectedPanel.color}50`
                          }}
                        >
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HorizontalJourney;