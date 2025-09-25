import React from 'react';
import { Badge } from './ui/badge';
import { Brain } from 'lucide-react';
import CustomerJourneySimple from './CustomerJourneySimple';
import { useLanguage } from '../contexts/LanguageContext';

const CustomerJourney = () => {
  const { t } = useLanguage();
  
  return (
    <section id="journey" className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)] relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Brain className="mr-2" size={14} />
            Customer Journey
          </Badge>
          <h2 className="text-5xl font-bold text-white mb-6 font-rajdhani">
            Intelligent Customer Experience Flow
          </h2>
          <p className="text-2xl text-[#00FF41] max-w-3xl mx-auto font-medium">
            {t.journey.subtitle}
          </p>
        </div>
      </div>
      
      {/* Horizontal Parallax Journey */}
      <HorizontalJourney />
    </section>
  );
};

export default CustomerJourney;