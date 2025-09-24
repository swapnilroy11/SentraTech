import React from 'react';
import { Badge } from './ui/badge';
import { Brain } from 'lucide-react';
import HorizontalJourney from './HorizontalJourney';

const CustomerJourney = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)] relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Brain className="mr-2" size={14} />
            Customer Journey
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            AI-Powered Customer Experience
          </h2>
          <p className="text-2xl text-[#00FF41] max-w-3xl mx-auto font-medium">
            From first contact to resolution - experience our intelligent workflow in action
          </p>
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