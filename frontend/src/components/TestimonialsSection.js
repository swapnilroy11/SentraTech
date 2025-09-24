import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Star, Quote, ChevronLeft, ChevronRight, 
  TrendingUp, Users, Award, Play
} from 'lucide-react';
import { mockData } from '../data/mock';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % mockData.testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextTestimonial = () => {
    setActiveTestimonial(prev => (prev + 1) % mockData.testimonials.length);
    setIsAutoPlay(false);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(prev => (prev - 1 + mockData.testimonials.length) % mockData.testimonials.length);
    setIsAutoPlay(false);
  };

  const currentTestimonial = mockData.testimonials[activeTestimonial];

  return (
    <section className="py-20 bg-[rgb(17,17,19)]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,221,255,0.1)] text-[#00DDFF] border-[#00DDFF]/30">
            <Users className="mr-2" size={14} />
            Customer Success Stories
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">Trusted by </span>
            <span className="text-[#00FF41]">Industry Leaders</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed">
            See how our AI-powered platform is transforming customer support 
            operations across telecommunications, healthcare, and financial services.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(38,40,42)] border border-[rgba(255,255,255,0.1)] rounded-3xl overflow-hidden">
            <div className="relative p-12">
              {/* Quote Icon */}
              <div className="absolute top-8 left-8 opacity-20">
                <Quote size={80} className="text-[#DAFF01]" />
              </div>
              
              {/* Testimonial Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  {/* Company Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-[rgb(38,40,42)] rounded-2xl flex items-center justify-center border border-[rgb(63,63,63)]">
                      <span className="text-2xl font-bold text-[#DAFF01]">
                        {currentTestimonial.company.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {currentTestimonial.company}
                      </h3>
                      <Badge className="bg-[rgba(218,255,1,0.1)] text-[#DAFF01] border-[#DAFF01]/30">
                        {currentTestimonial.stats}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Star Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} className="text-[#00FF41] fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-2xl md:text-3xl text-[rgb(218,218,218)] leading-relaxed mb-8 font-light italic">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/api/placeholder/48/48" />
                    <AvatarFallback className="bg-[#DAFF01] text-[rgb(17,17,19)] font-semibold">
                      {currentTestimonial.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white font-semibold">
                      {currentTestimonial.author}
                    </div>
                    <div className="text-[rgb(161,161,170)] text-sm">
                      {currentTestimonial.position}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute bottom-8 right-8 flex items-center space-x-4">
                <Button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  size="sm"
                  variant="outline"
                  className="border-[rgb(63,63,63)] text-[rgb(218,218,218)] hover:border-[#DAFF01] hover:text-[#DAFF01] rounded-lg"
                >
                  <Play size={16} className={isAutoPlay ? 'text-[#DAFF01]' : ''} />
                </Button>
                
                <Button
                  onClick={prevTestimonial}
                  size="sm"
                  variant="outline"
                  className="border-[rgb(63,63,63)] text-[rgb(218,218,218)] hover:border-[#DAFF01] hover:text-[#DAFF01] rounded-lg"
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <Button
                  onClick={nextTestimonial}
                  size="sm"
                  variant="outline"
                  className="border-[rgb(63,63,63)] text-[rgb(218,218,218)] hover:border-[#DAFF01] hover:text-[#DAFF01] rounded-lg"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Testimonial Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {mockData.testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105
                ${index === activeTestimonial 
                  ? 'bg-gradient-to-br from-[#DAFF01]/20 to-[#00DDFF]/20 border-2 border-[#DAFF01]' 
                  : 'bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] hover:border-[#DAFF01]/50'
                } rounded-2xl`}
              onClick={() => {
                setActiveTestimonial(index);
                setIsAutoPlay(false);
              }}
            >
              <CardHeader className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[rgb(38,40,42)] rounded-xl flex items-center justify-center border border-[rgb(63,63,63)]">
                    <span className="text-sm font-bold text-[#DAFF01]">
                      {testimonial.company.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {testimonial.company}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-[#00FF41] fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-[rgb(218,218,218)] text-sm leading-relaxed line-clamp-3">
                  "{testimonial.content.slice(0, 100)}..."
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-[rgb(161,161,170)]">
                    {testimonial.author}
                  </div>
                  <Badge className="text-xs bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
                    {testimonial.stats}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-r from-[rgb(26,28,30)] to-[rgb(38,40,42)] rounded-3xl p-12 border border-[rgba(255,255,255,0.1)]">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Proven Results Across Industries
            </h3>
            <p className="text-[rgb(218,218,218)] max-w-2xl mx-auto">
              Our platform consistently delivers measurable improvements 
              in customer satisfaction and operational efficiency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-4 p-4 bg-[rgb(17,17,19)] rounded-2xl w-fit mx-auto border border-[rgb(63,63,63)]">
                <TrendingUp size={32} className="text-[#DAFF01]" />
              </div>
              <div className="text-3xl font-bold text-[#00FF41] mb-2 font-rajdhani">94%</div>
              <div className="text-[rgb(218,218,218)] text-sm">Average CSAT Improvement</div>
            </div>
            
            <div className="text-center">
              <div className="mb-4 p-4 bg-[rgb(17,17,19)] rounded-2xl w-fit mx-auto border border-[rgb(63,63,63)]">
                <Users size={32} className="text-[#00DDFF]" />
              </div>
              <div className="text-3xl font-bold text-[#00DDFF] mb-2">50M+</div>
              <div className="text-[rgb(218,218,218)] text-sm">Interactions Processed</div>
            </div>
            
            <div className="text-center">
              <div className="mb-4 p-4 bg-[rgb(17,17,19)] rounded-2xl w-fit mx-auto border border-[rgb(63,63,63)]">
                <Award size={32} className="text-[rgb(192,192,192)]" />
              </div>
              <div className="text-3xl font-bold text-[rgb(192,192,192)] mb-2">45%</div>
              <div className="text-[rgb(218,218,218)] text-sm">Average Cost Reduction</div>
            </div>
            
            <div className="text-center">
              <div className="mb-4 p-4 bg-[rgb(17,17,19)] rounded-2xl w-fit mx-auto border border-[rgb(63,63,63)]">
                <Star size={32} className="text-[#DAFF01]" />
              </div>
              <div className="text-3xl font-bold text-[#00FF41] mb-2 font-rajdhani">98%</div>
              <div className="text-[rgb(218,218,218)] text-sm">Platform Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;