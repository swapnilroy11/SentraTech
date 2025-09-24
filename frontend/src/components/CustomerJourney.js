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
import HorizontalJourney from './HorizontalJourney';

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

      </div>
      
      {/* Horizontal Parallax Journey */}
      <HorizontalJourney />
      
      {/* Journey Stats */}
      <div className="container mx-auto px-6 pt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00FF41] mb-2 font-rajdhani">4.2min</div>
            <div className="text-[rgb(161,161,170)] text-sm">Average Handle Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00DDFF] mb-2">96%</div>
            <div className="text-[rgb(161,161,170)] text-sm">First Call Resolution</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[rgb(192,192,192)] mb-2">70%</div>
            <div className="text-[rgb(161,161,170)] text-sm">Automation Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00FF41] mb-2 font-rajdhani">47ms</div>
            <div className="text-[rgb(161,161,170)] text-sm">AI Response Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerJourney;