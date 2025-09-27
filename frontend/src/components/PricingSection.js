import React, { useState, useMemo } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, Star, Crown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactSalesSlideIn from './ContactSalesSlideIn';

/**
 * Industry-Standard SaaS Pricing Section Component
 * Redesigned to match modern SaaS pricing best practices
 */
const PricingSection = () => {
  const MATRIX_GREEN = "#00FF84";
  const [term, setTerm] = useState("24m"); // "24m" | "36m"
  const [isContactSalesOpen, setIsContactSalesOpen] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  // Analytics event for pricing page view
  React.useEffect(() => {
    if (window && window.dataLayer) {
      window.dataLayer.push({
        event: "pricing_view",
        referrer: document.referrer,
        ab_test_group: "new_pricing_2025"
      });
    }
  }, []);

  // Base list prices (per bundle)
  const basePrices = {
    starter: 1200,
    growth: 1650,
    enterprise: 2000
  };

  const effectivePrice = (price) => (term === "36m" ? Math.round(price * 0.9) : price);

  const plans = useMemo(() => ([
    {
      id: "starter",
      title: "Starter",
      subtitle: "Pilot",
      tagline: "Perfect for fast pilots & quick ROI",
      price: effectivePrice(basePrices.starter),
      originalPrice: basePrices.starter,
      priceNote: "per bundle (1,000 calls + 1,000 interactions)",
      subNote: "Pilot only — 3 month max",
      cta: "Start Pilot",
      features: [
        "Up to 1k calls + 1k interactions",
        "Basic AI automation",
        "Core analytics",
        "Email support"
      ],
      savings: "40-60%",
      setupTime: "2-3 weeks",
      isPopular: false,
      popularBadge: null
    },
    {
      id: "growth",
      title: "Growth",
      subtitle: null,
      tagline: "Full omnichannel experience — optimized for scale",
      price: effectivePrice(basePrices.growth),
      originalPrice: basePrices.growth,
      priceNote: "per bundle (1,000 calls + 1,000 interactions)",
      subNote: "Best value for scaling businesses",
      cta: "Contact Sales",
      features: [
        "Up to 1k calls + 1k interactions",
        "Full omnichannel integration",
        "Advanced analytics & BI",
        "24/7 priority support"
      ],
      savings: "60-75%",
      setupTime: "3-4 weeks",
      isPopular: true,
      popularBadge: "Most Popular"
    },
    {
      id: "enterprise",
      title: "Enterprise",
      subtitle: "Dedicated",
      tagline: "Unlimited scale, dedicated success",
      price: effectivePrice(basePrices.enterprise),
      originalPrice: basePrices.enterprise,
      priceNote: "per bundle (1,000 calls + 1,000 interactions)",
      subNote: "Custom contract available",
      cta: "Contact Sales",
      features: [
        "Unlimited interactions",
        "Custom AI training",
        "Dedicated success manager",
        "HIPAA, SOC2 compliance"
      ],
      savings: "70-85%",
      setupTime: "4-6 weeks",
      isPopular: false,
      popularBadge: null
    }
  ]), [term]);

  function handleContact(plan) {
    // Analytics event
    if (window && window.dataLayer) {
      window.dataLayer.push({
        event: "pricing_cta_click",
        planId: plan.id,
        planTitle: plan.title,
        price: plan.price,
        billingTerm: term
      });
    }

    // Set prefill data for the slide-in
    setPrefillData({
      planSelected: plan.title,
      planId: plan.id,
      billingTerm: term,
      priceDisplay: plan.price
    });
    setIsContactSalesOpen(true);
  }

  function handleToggleChange() {
    const newTerm = term === "24m" ? "36m" : "24m";
    setTerm(newTerm);
    
    // Analytics event for toggle change
    if (window && window.dataLayer) {
      window.dataLayer.push({
        event: "pricing_toggle_change",
        term: newTerm
      });
    }
  }

  return (
    <>
      <section id="pricing" className="py-20 bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)]">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-[rgba(0,255,132,0.1)] text-[#00FF84] border-[#00FF84]/30 px-3 py-1">
              <Star className="mr-2" size={14} />
              Transparent Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              <span className="text-white">Simple, Transparent</span>
              <br />
              <span className="text-[#00FF84]">Pricing Plans</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-6">
              Choose the perfect plan for your business. Scale your AI-powered customer support 
              with flexible pricing that grows with you.
            </p>
            
            {/* Billing Period Toggle */}
            <div className="flex items-center justify-center space-x-6 mb-8">
              <span className={`text-base font-semibold transition-colors ${term === '24m' ? 'text-[#00FF84]' : 'text-gray-500'}`}>
                24 Months
              </span>
              <button
                onClick={handleToggleChange}
                className="relative w-16 h-8 bg-gray-800 rounded-full border border-gray-700 transition-all duration-300 hover:border-[#00FF84]/50 focus:outline-none focus:ring-2 focus:ring-[#00FF84]/50"
                aria-pressed={term === "36m"}
                aria-label="Toggle billing term"
              >
                <div className={`absolute w-6 h-6 bg-[#00FF84] rounded-full top-1 transition-all duration-300 shadow-lg shadow-[#00FF84]/40 ${
                  term === '36m' ? 'left-9' : 'left-1'
                }`} />
              </button>
              <span className={`text-base font-semibold transition-colors ${term === '36m' ? 'text-[#00FF84]' : 'text-gray-500'}`}>
                36 Months 
                <Badge className="ml-2 bg-[#00FF84] text-black text-xs font-bold px-2 py-1">
                  Save 10%
                </Badge>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-[1200px] mx-auto items-stretch">
            {plans.map((plan, index) => (
              <article 
                key={plan.id} 
                role="region"
                aria-labelledby={`plan-${plan.id}-title`}
                className={`relative rounded-2xl p-4 md:p-6 transition-all duration-300 bg-gradient-to-br flex flex-col justify-between ${
                  plan.isPopular
                    ? "from-[#0A0F0A] via-[#0E1410] to-[#0A0F0A] border border-[#00FF84] shadow-lg" 
                    : "from-[#0E0E0E] to-[#1A1A1A] border border-gray-800 hover:border-gray-700"
                }`}
                style={{ maxHeight: '440px', overflow: 'hidden' }}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-[#00FF84] text-black px-3 py-1 text-xs font-bold whitespace-nowrap">
                      <Crown size={14} className="mr-1" />
                      {plan.popularBadge}
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-4">
                  <h3 id={`plan-${plan.id}-title`} className="text-xl md:text-2xl font-semibold text-white mb-1">
                    {plan.title}
                    {plan.subtitle && (
                      <span className="text-sm font-normal text-gray-400 ml-2">({plan.subtitle})</span>
                    )}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center mb-1">
                    <span className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                      ${plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">/month</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-2">{plan.priceNote}</p>
                  {plan.subNote && (
                    <p className="text-[#00FF84] text-xs font-medium">{plan.subNote}</p>
                  )}
                  {term === "36m" && (
                    <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-[#00FF84]/10 rounded-full">
                      <span className="text-[#00FF84] text-xs font-semibold">
                        Was ${plan.originalPrice.toLocaleString()} • Save 10%
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="mb-4 flex-1">
                  <h4 className="text-white font-semibold text-sm mb-3">What's Included</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle 
                          size={16} 
                          className="text-[#00FF84] flex-shrink-0 mt-0.5" 
                        />
                        <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Value Metrics Chip */}
                <div className="mb-4 p-3 rounded-lg bg-gray-900/50 border border-gray-800">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <div className="text-[#00FF84] font-bold">{plan.savings}</div>
                      <div className="text-gray-400 text-xs">Cost Savings</div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-[#00FF84] font-bold">{plan.setupTime}</div>
                      <div className="text-gray-400 text-xs">Setup Time</div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div>
                  <Button
                    onClick={() => handleContact(plan)}
                    className="w-full bg-[#00FF84] hover:bg-[#00DD70] text-black rounded-lg py-2 px-6 font-semibold transition-all duration-300 transform hover:scale-105"
                    style={{ height: '44px' }}
                  >
                    {plan.cta}
                  </Button>
                  <p className="text-gray-500 text-xs text-center mt-2">
                    By clicking you agree to our Privacy Policy.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Sales Slide-in Panel */}
      <ContactSalesSlideIn 
        isOpen={isContactSalesOpen} 
        onClose={() => setIsContactSalesOpen(false)}
        prefill={prefillData}
      />
    </>
  );
};

export default PricingSection;