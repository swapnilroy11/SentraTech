import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { mockData } from '../data/mock';
import ContactSalesSlideIn from './ContactSalesSlideIn';

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState('24months');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isContactSalesOpen, setIsContactSalesOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleContactSales = (planName) => {
    setSelectedPlan(planName);
    setIsContactSalesOpen(true);
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            <Star className="mr-2" size={14} />
            Transparent Pricing
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-rajdhani">
            <span className="text-[#F8F9FA]">Choose Your</span>
            <br />
            <span className="text-[#00FF41]">Growth Plan</span>
          </h2>
          <p className="text-xl text-[rgb(218,218,218)] max-w-3xl mx-auto leading-relaxed mb-8">
            Scale your customer support operations with our flexible pricing tiers. 
            Start small and grow as your business expands.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-[#00FF41]' : 'text-[rgb(161,161,170)]'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-[rgb(38,40,42)] rounded-full border border-[rgb(63,63,63)] transition-all duration-200"
            >
              <div className={`absolute w-5 h-5 bg-[#00FF41] rounded-full top-1 transition-all duration-200 ${
                billingPeriod === 'annual' ? 'left-8' : 'left-1'
              }`} />
            </button>
            <span className={`text-sm ${billingPeriod === 'annual' ? 'text-[#00FF41]' : 'text-[rgb(161,161,170)]'}`}>
              Annual <Badge className="ml-1 bg-[#00FF41] text-[rgb(17,17,19)] text-xs">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockData.pricing.map((tier, index) => {
            const isPopular = tier.popular;
            const price = typeof tier.price === 'number' 
              ? billingPeriod === 'annual' ? Math.round(tier.price * 0.8) : tier.price
              : tier.price;
            
            return (
              <Card
                key={tier.id}
                className={`relative rounded-3xl transition-all duration-300 transform hover:scale-105
                  ${isPopular 
                    ? 'bg-gradient-to-br from-[#00FF41]/10 to-[#00DDFF]/10 border-2 border-[#00FF41] shadow-2xl shadow-[#00FF41]/20' 
                    : 'bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] hover:border-[#00FF41]/50'
                  }
                `}
                onMouseEnter={() => setHoveredCard(tier.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-[#00FF41] text-[rgb(17,17,19)] px-4 py-2 text-sm font-semibold">
                      <Crown size={16} className="mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center p-8">
                  {/* Plan Icon */}
                  <div className={`mx-auto mb-4 p-4 w-16 h-16 rounded-2xl flex items-center justify-center
                    ${isPopular 
                      ? 'bg-[#00FF41]/20 border border-[#00FF41]/50' 
                      : 'bg-[rgb(38,40,42)] border border-[rgb(63,63,63)]'
                    }`}
                  >
                    {index === 0 && <Zap size={24} className={isPopular ? 'text-[#00FF41]' : 'text-[rgb(218,218,218)]'} />}
                    {index === 1 && <Star size={24} className={isPopular ? 'text-[#00FF41]' : 'text-[rgb(218,218,218)]'} />}
                    {index === 2 && <Crown size={24} className={isPopular ? 'text-[#00FF41]' : 'text-[rgb(218,218,218)]'} />}
                  </div>

                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </CardTitle>
                  
                  <CardDescription className="text-[rgb(218,218,218)] mb-6">
                    {tier.description}
                  </CardDescription>

                  {/* Price */}
                  <div className="mb-6">
                    {typeof price === 'number' ? (
                      <>
                        <div className="flex items-baseline justify-center space-x-1">
                          <span className="text-4xl font-bold text-[#00FF41] font-rajdhani">
                            ${price.toLocaleString()}
                          </span>
                          <span className="text-[rgb(161,161,170)]">
                            /{tier.period}
                          </span>
                        </div>
                        {billingPeriod === 'annual' && typeof tier.price === 'number' && (
                          <div className="text-sm text-[rgb(161,161,170)] mt-1">
                            ${tier.price}/month billed monthly
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-4xl font-bold text-[#00FF41]">
                        {price}
                      </div>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    {/* Only show Contact Sales Button - Matrix Green Styling */}
                    <Button 
                      onClick={() => handleContactSales(tier.name)}
                      className="w-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-[#00FF41]/30 min-h-[48px] text-sm sm:text-base"
                      style={{
                        background: '#00FF41',
                        color: '#0A0A0A',
                        padding: '14px 24px',
                        borderRadius: '8px',
                        fontSize: 'inherit',
                        minHeight: '48px',
                        touchAction: 'manipulation'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,255,65,0.3)';
                        e.target.style.background = '#00e83a';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = '#00FF41';
                      }}
                      onMouseDown={(e) => {
                        e.target.style.background = '#00d936'; // 10% darker
                      }}
                      onMouseUp={(e) => {
                        e.target.style.background = '#00e83a';
                      }}
                    >
                      Contact Sales
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  {/* Features List */}
                  <div className="space-y-4">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle 
                          size={20} 
                          className={`mt-0.5 flex-shrink-0 ${
                            isPopular ? 'text-[#00FF41]' : 'text-[#00DDFF]'
                          }`} 
                        />
                        <span className="text-[rgb(218,218,218)] text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Hover Effect - Fixed to not interfere with Popular badge */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#00FF41]/5 to-transparent 
                  opacity-0 transition-opacity duration-300 rounded-3xl pointer-events-none
                  ${hoveredCard === tier.id && !isPopular ? 'opacity-100' : ''}`}
                />
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-[rgb(26,28,30)] rounded-2xl p-8 border border-[rgba(255,255,255,0.1)] max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[rgb(218,218,218)]">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle size={20} className="text-[#00FF41]" />
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle size={20} className="text-[#00FF41]" />
                <span>24/7 Technical Support</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle size={20} className="text-[#00FF41]" />
                <span>Full API Access</span>
              </div>
            </div>
          </div>

          <p className="text-[rgb(161,161,170)] mt-8 max-w-2xl mx-auto">
            Need a custom solution? Our enterprise team can work with you to create 
            a tailored package that meets your specific requirements and scale.
          </p>
        </div>
      </div>

      {/* Contact Sales Slide-in Panel */}
      <ContactSalesSlideIn 
        isOpen={isContactSalesOpen} 
        onClose={() => setIsContactSalesOpen(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  );
};

export default PricingSection;