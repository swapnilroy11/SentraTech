import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Phone, Brain, Network, Users, TrendingUp, Award,
  ArrowRight, Play, Pause, RotateCcw
} from 'lucide-react';
import { mockData } from '../data/mock';

const CustomerJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const intervalRef = useRef(null);
  
  const iconMap = {
    Phone, Brain, Network, Users, TrendingUp, Award
  };

  // Auto-progress through steps
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveStep(prev => (prev + 1) % mockData.journeySteps.length);
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const resetJourney = () => {
    setActiveStep(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] via-[rgb(26,28,30)] to-[rgb(17,17,19)]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,221,255,0.1)] text-[#00DDFF] border-[#00DDFF]/30">
            Customer Journey
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">From Contact to </span>
            <span className="text-[#00FF41]">Resolution</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed mb-8">
            Experience the seamless flow of our AI-powered customer support platform. 
            Watch how every interaction is optimized for the best outcome.
          </p>
          
          {/* Journey Controls */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <Button
              onClick={togglePlayback}
              className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] rounded-xl px-6"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span className="ml-2">{isPlaying ? 'Pause' : 'Play'} Journey</span>
            </Button>
            
            <Button
              onClick={resetJourney}
              variant="outline"
              className="border-[#2a2a2a] text-[#e2e8f0] hover:border-[#00FF41] hover:text-[#00FF41] rounded-xl"
            >
              <RotateCcw size={20} />
              <span className="ml-2">Reset</span>
            </Button>
          </div>
        </div>

        {/* 3D Journey Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Container */}
          <div className="relative bg-[rgb(26,28,30)]/50 rounded-3xl p-8 border border-[rgba(255,255,255,0.1)] backdrop-blur-sm">
            {/* Progress Bar */}
            <div className="absolute top-12 left-8 right-8 h-1 bg-[rgb(63,63,63)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#DAFF01] to-[#00DDFF] transition-all duration-500 rounded-full"
                style={{ width: `${((activeStep + 1) / mockData.journeySteps.length) * 100}%` }}
              />
            </div>

            {/* Journey Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {mockData.journeySteps.map((step, index) => {
                const Icon = iconMap[step.icon];
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;
                
                return (
                  <Dialog key={step.id}>
                    <DialogTrigger asChild>
                      <Card
                        className={`cursor-pointer transition-all duration-500 transform hover:scale-105
                          ${isActive 
                            ? 'bg-gradient-to-br from-[#00FF41]/20 to-[#00DDFF]/20 border-[#00FF41] shadow-2xl shadow-[#00FF41]/20' 
                            : isCompleted
                            ? 'bg-[#2a2a2a] border-[#00DDFF]/50'
                            : 'bg-[#1a1a1a] border-[rgba(248,249,250,0.1)]'
                          } rounded-2xl hover:border-[#00FF41]`}
                        onClick={() => setSelectedModal(step)}
                      >
                        <CardHeader className="relative p-6">
                          {/* Step Number */}
                          <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${isActive || isCompleted 
                              ? 'bg-[#00FF41] text-[#0A0A0A]' 
                              : 'bg-[#2a2a2a] text-[#a1a1aa]'}`}
                          >
                            {index + 1}
                          </div>
                          
                          {/* Icon */}
                          <div className={`mb-4 p-4 rounded-2xl w-fit
                            ${isActive 
                              ? 'bg-[#DAFF01]/20 border border-[#DAFF01]/50' 
                              : isCompleted
                              ? 'bg-[#00DDFF]/20 border border-[#00DDFF]/50'
                              : 'bg-[rgb(38,40,42)] border border-[rgb(63,63,63)]'
                            }`}
                          >
                            <Icon 
                              size={28} 
                              className={`
                                ${isActive 
                                  ? 'text-[#DAFF01]' 
                                  : isCompleted 
                                  ? 'text-[#00DDFF]'
                                  : 'text-[rgb(161,161,170)]'
                                } transition-colors duration-300`} 
                            />
                          </div>
                          
                          <CardTitle className={`text-lg mb-2 transition-colors duration-300
                            ${isActive ? 'text-[#DAFF01]' : 'text-white'}`}
                          >
                            {step.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="px-6 pb-6">
                          <p className="text-[rgb(218,218,218)] text-sm leading-relaxed">
                            {step.description}
                          </p>
                          
                          {/* Interaction Hint */}
                          <div className="flex items-center justify-between mt-4">
                            <Badge 
                              variant="outline" 
                              className={`text-xs
                                ${isActive || isCompleted
                                  ? 'border-[#DAFF01]/30 text-[#DAFF01]' 
                                  : 'border-[rgb(63,63,63)] text-[rgb(161,161,170)]'
                                }`}
                            >
                              Step {index + 1}
                            </Badge>
                            
                            <ArrowRight 
                              size={16} 
                              className={`transition-all duration-300
                                ${isActive 
                                  ? 'text-[#DAFF01] transform translate-x-1' 
                                  : 'text-[rgb(161,161,170)]'
                                }`} 
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    
                    {/* Modal Content */}
                    <DialogContent className="bg-[rgb(26,28,30)] border-[rgb(63,63,63)] text-white max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-3 text-2xl">
                          <div className="p-2 bg-[#DAFF01]/20 rounded-lg border border-[#DAFF01]/50">
                            <Icon size={24} className="text-[#DAFF01]" />
                          </div>
                          <span>{step.title}</span>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <p className="text-[rgb(218,218,218)] leading-relaxed">
                          {step.description}
                        </p>
                        
                        {/* Detailed Information */}
                        <div className="bg-[rgb(38,40,42)] rounded-xl p-4 border border-[rgb(63,63,63)]">
                          <h4 className="font-semibold text-[#DAFF01] mb-2">Key Benefits:</h4>
                          <ul className="text-sm text-[rgb(218,218,218)] space-y-2">
                            <li>• Real-time processing and decision making</li>
                            <li>• Intelligent routing based on context and complexity</li>
                            <li>• Continuous learning and optimization</li>
                            <li>• Full audit trail and compliance monitoring</li>
                          </ul>
                        </div>
                        
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-[rgb(17,17,19)] rounded-lg border border-[rgb(63,63,63)]">
                            <div className="text-lg font-bold text-[#DAFF01]">&lt;50ms</div>
                            <div className="text-xs text-[rgb(161,161,170)]">Response Time</div>
                          </div>
                          <div className="text-center p-3 bg-[rgb(17,17,19)] rounded-lg border border-[rgb(63,63,63)]">
                            <div className="text-lg font-bold text-[#00DDFF]">99.9%</div>
                            <div className="text-xs text-[rgb(161,161,170)]">Accuracy Rate</div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
            
            {/* Current Step Highlight */}
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-bold text-[#00FF41] mb-2 font-rajdhani">
                Current: {mockData.journeySteps[activeStep].title}
              </h3>
              <p className="text-[rgb(218,218,218)] max-w-2xl mx-auto">
                {mockData.journeySteps[activeStep].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerJourney;