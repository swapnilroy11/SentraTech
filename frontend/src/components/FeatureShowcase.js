import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  MessageSquare, Zap, BarChart3, Heart, Globe, Shield,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockData } from '../data/mock';

const FeatureShowcase = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { t } = useLanguage();
  
  const iconMap = {
    MessageSquare, Zap, BarChart3, Heart, Globe, Shield
  };

  return (
    <section id="features" className="py-20 bg-[rgb(17,17,19)]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Sparkles className="mr-2" size={14} />
            Core Features
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="bg-gradient-to-r from-[#F8F9FA] to-[#e2e8f0] bg-clip-text text-transparent">
              Intelligent Automation
            </span>
            <br />
            <span className="text-[#00FF41]">
              Built for Scale
            </span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform combines the best of automation and human expertise, 
            delivering unmatched performance across every customer interaction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mockData.features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            
            return (
              <Card 
                key={feature.id}
                className={`bg-[#1a1a1a] border border-[rgba(248,249,250,0.1)] rounded-2xl p-8 
                  hover:border-[#00FF41] transition-all duration-300 cursor-pointer transform hover:scale-105 hover:rotate-1
                  ${hoveredCard === feature.id ? 'shadow-2xl shadow-[#00FF41]/20' : ''}
                `}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="p-0 mb-6">
                  <div className="mb-4">
                    <div className={`p-4 rounded-2xl bg-[#1a1a1a] w-fit
                      ${hoveredCard === feature.id ? 'bg-[#00FF41]/10 border border-[#00FF41]/30' : ''}
                      transition-all duration-300`}
                    >
                      <Icon 
                        size={32} 
                        className={`${hoveredCard === feature.id ? 'text-[#00FF41]' : 'text-[#e2e8f0]'} 
                          transition-colors duration-300`} 
                      />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl text-[#F8F9FA] mb-3 font-rajdhani">
                    {feature.titleKey ? t.features.items[feature.titleKey.split('.').pop()].title : feature.title}
                  </CardTitle>
                  
                  <Badge 
                    variant="outline" 
                    className="text-[#00FF41] border-[#00FF41]/30 bg-[#00FF41]/5 w-fit font-rajdhani"
                  >
                    {feature.stats}
                  </Badge>
                </CardHeader>

                <CardContent className="p-0">
                  <CardDescription className="text-[rgb(218,218,218)] text-base leading-relaxed">
                    {feature.descriptionKey ? t.features.items[feature.descriptionKey.split('.').pop()].description : feature.description}
                  </CardDescription>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#DAFF01]/5 to-transparent 
                  opacity-0 transition-opacity duration-300 rounded-2xl pointer-events-none
                  ${hoveredCard === feature.id ? 'opacity-100' : ''}`}
                />
              </Card>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="bg-gradient-to-r from-[rgb(26,28,30)] to-[rgb(38,40,42)] rounded-3xl p-12 border border-[rgba(255,255,255,0.1)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Why Choose SentraTech?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-[#00FF41] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Sub-50ms Decision Engine</h4>
                    <p className="text-[rgb(218,218,218)]">
                      Lightning-fast routing ensures optimal customer experience with our proprietary AI algorithms.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-[#00DDFF] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Compliance-First Architecture</h4>
                    <p className="text-[rgb(218,218,218)]">
                      Built-in GDPR, HIPAA, and PCI compliance with immutable audit trails and data protection.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-[rgb(192,192,192)] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Enterprise-Grade Reliability</h4>
                    <p className="text-[rgb(218,218,218)]">
                      99.9%+ uptime SLA with multi-region deployment and automatic disaster recovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* 3D Visualization */}
              <div className="relative w-full h-80 bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] rounded-2xl p-8 border border-[rgba(255,255,255,0.1)]">
                {/* Animated Network Nodes */}
                <div className="absolute inset-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-[#00FF41] rounded-full animate-pulse"
                      style={{
                        left: `${20 + (i % 3) * 30}%`,
                        top: `${20 + Math.floor(i / 3) * 25}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: `${2 + Math.random()}s`
                      }}
                    />
                  ))}
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30">
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={i}
                        x1={`${25 + (i % 2) * 50}%`}
                        y1={`${25 + Math.floor(i / 2) * 25}%`}
                        x2={`${25 + ((i + 1) % 2) * 50}%`}
                        y2={`${25 + Math.floor((i + 1) / 2) * 25}%`}
                        stroke="#00FF41"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    ))}
                  </svg>
                </div>
                
                {/* Central Hub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#00FF41] rounded-full flex items-center justify-center animate-spin-slow">
                    <Zap size={24} className="text-[#0A0A0A]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;