import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { mockData } from '../data/mock';

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [hoveredCard, setHoveredCard] = useState(null);

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
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-[#DAFF01]' : 'text-[rgb(161,161,170)]'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-[rgb(38,40,42)] rounded-full border border-[rgb(63,63,63)] transition-all duration-200"
            >
              <div className={`absolute w-5 h-5 bg-[#DAFF01] rounded-full top-1 transition-all duration-200 ${
                billingPeriod === 'annual' ? 'left-8' : 'left-1'
              }`} />
            </button>
            <span className={`text-sm ${billingPeriod === 'annual' ? 'text-[#DAFF01]' : 'text-[rgb(161,161,170)]'}`}>
              Annual <Badge className="ml-1 bg-[#DAFF01] text-[rgb(17,17,19)] text-xs">Save 20%</Badge>
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
                    ? 'bg-gradient-to-br from-[#DAFF01]/10 to-[#00DDFF]/10 border-2 border-[#DAFF01] shadow-2xl shadow-[#DAFF01]/20' 
                    : 'bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] hover:border-[#DAFF01]/50'
                  }
                `}
                onMouseEnter={() => setHoveredCard(tier.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#DAFF01] text-[rgb(17,17,19)] px-4 py-2 text-sm font-semibold">
                      <Crown size={16} className="mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center p-8">
                  {/* Plan Icon */}
                  <div className={`mx-auto mb-4 p-4 w-16 h-16 rounded-2xl flex items-center justify-center
                    ${isPopular 
                      ? 'bg-[#DAFF01]/20 border border-[#DAFF01]/50' 
                      : 'bg-[rgb(38,40,42)] border border-[rgb(63,63,63)]'
                    }`}
                  >
                    {index === 0 && <Zap size={24} className={isPopular ? 'text-[#DAFF01]' : 'text-[rgb(218,218,218)]'} />}
                    {index === 1 && <Star size={24} className={isPopular ? 'text-[#DAFF01]' : 'text-[rgb(218,218,218)]'} />}
                    {index === 2 && <Crown size={24} className={isPopular ? 'text-[#DAFF01]' : 'text-[rgb(218,218,218)]'} />}
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
                          <span className="text-4xl font-bold text-[#DAFF01]">
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
                      <div className="text-4xl font-bold text-[#DAFF01]">
                        {price}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105
                      ${isPopular 
                        ? 'bg-[#DAFF01] text-[rgb(17,17,19)] hover:bg-[rgb(166,190,21)]' 
                        : 'bg-transparent border-2 border-[rgb(63,63,63)] text-white hover:border-[#DAFF01] hover:text-[#DAFF01] hover:bg-[rgba(218,255,1,0.1)]'
                      }`}
                  >
                    {tier.cta}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  {/* Features List */}
                  <div className="space-y-4">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle 
                          size={20} 
                          className={`mt-0.5 flex-shrink-0 ${
                            isPopular ? 'text-[#DAFF01]' : 'text-[#00DDFF]'
                          }`} 
                        />
                        <span className="text-[rgb(218,218,218)] text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#DAFF01]/5 to-transparent 
                  opacity-0 transition-opacity duration-300 rounded-3xl pointer-events-none
                  ${hoveredCard === tier.id ? 'opacity-100' : ''}`}
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
                <CheckCircle size={20} className="text-[#DAFF01]" />
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle size={20} className="text-[#DAFF01]" />
                <span>24/7 Technical Support</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle size={20} className="text-[#DAFF01]" />
                <span>Full API Access</span>
              </div>
            </div>
          </div>

          <p className="text-[rgb(161,161,170)] mt-8 max-w-2xl mx-auto">
            Need a custom solution? Our enterprise team can work with you to create 
            a tailored package that meets your specific requirements and scale.
          </p>
          
          <Button 
            variant="outline"
            className="mt-6 border-[rgb(63,63,63)] text-[rgb(218,218,218)] hover:border-[#DAFF01] hover:text-[#DAFF01] rounded-xl px-8"
          >
            Contact Enterprise Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;