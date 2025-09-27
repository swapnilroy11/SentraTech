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
      icon: "⚡",
      price: effectivePrice(basePrices.starter),
      originalPrice: basePrices.starter,
      priceNote: "per bundle (1,000 calls + 1,000 interactions)",
      subNote: "Pilot only — 3 month max",
      cta: "Start Pilot",
      ctaType: "primary",
      features: [
        "Up to 1,000 calls + 1,000 interactions per bundle",
        "Basic AI automation (60% baseline)",
        "Core analytics dashboard",
        "Email support",
        "Onboarding & integration (up to 5 hrs)"
      ],
      highlights: [
        "Fast setup in 2-3 weeks",
        "40-60% cost savings vs traditional",
        "Dedicated pilot success team"
      ],
      savings: "40-60%",
      setupTime: "2-3 weeks",
      sla: "Standard SLA",
      isPopular: false,
      popularBadge: null
    },
    {
      id: "growth",
      title: "Growth",
      subtitle: null,
      tagline: "Full omnichannel experience — optimized for scale",
      icon: "🚀",
      price: effectivePrice(basePrices.growth),
      originalPrice: basePrices.growth,
      priceNote: "per bundle (1,000 calls + 1,000 interactions)",
      subNote: "Best value for scaling businesses",
      cta: "Contact Sales",
      ctaType: "primary",
      features: [
        "Up to 1,000 calls + 1,000 interactions per bundle",
        "Full omnichannel integration",
        "Advanced analytics & BI dashboards",
        "24/7 priority support",
        "Enhanced compliance & reporting"
      ],
      highlights: [
        "Most popular for growing companies",
        "60-75% cost savings vs traditional",
        "99.9% uptime SLA guarantee"
      ],
      savings: "60-75%",
      setupTime: "3-4 weeks",
      sla: "99.9% Uptime SLA",
      isPopular: true,
      popularBadge: "Most Popular"
    },
    {
      id: "enterprise",
      title: "Enterprise",
      subtitle: "Dedicated",
      tagline: "Unlimited scale, dedicated success",
      icon: "🏢",
      price: effectivePrice(basePrices.enterprise),
      originalPrice: basePrices.enterprise,
      priceNote: "per bundle (1,000 calls + 1,000 interactions)",
      subNote: "Custom contract available",
      cta: "Contact Sales",
      ctaType: "secondary",
      features: [
        "Unlimited interactions (custom contract)",
        "Custom AI training & dedicated model endpoints",
        "Dedicated success manager & priority SRE",
        "White-label & advanced compliance (HIPAA, SOC2)",
        "SLA-backed uptime & response time"
      ],
      highlights: [
        "Enterprise-grade security & compliance",
        "70-85% cost savings vs traditional",
        "99.99% uptime with custom SLA"
      ],
      savings: "70-85%",
      setupTime: "4-6 weeks", 
      sla: "99.99% Custom SLA",
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
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-[rgba(0,255,132,0.1)] text-[#00FF84] border-[#00FF84]/30 px-4 py-2">
                <Star className="mr-2" size={16} />
                Transparent Pricing
              </Badge>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6 font-inter">
                <span className="text-white">Simple, Transparent</span>
                <br />
                <span className="text-[#00FF84]">Pricing Plans</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-10">
                Choose the perfect plan for your business. Scale your AI-powered customer support 
                with flexible pricing that grows with you.
              </p>
            </motion.div>
            
            {/* Billing Period Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center space-x-8 mb-12"
            >
              <span className={`text-lg font-semibold transition-colors ${term === '24m' ? 'text-[#00FF84]' : 'text-gray-500'}`}>
                24 Months
              </span>
              <button
                onClick={handleToggleChange}
                className="relative w-20 h-10 bg-gray-800 rounded-full border border-gray-700 transition-all duration-300 hover:border-[#00FF84]/50 focus:outline-none focus:ring-2 focus:ring-[#00FF84]/50"
                aria-pressed={term === "36m"}
                aria-label="Toggle billing term"
              >
                <div className={`absolute w-8 h-8 bg-[#00FF84] rounded-full top-1 transition-all duration-300 shadow-lg shadow-[#00FF84]/40 ${
                  term === '36m' ? 'left-11' : 'left-1'
                }`} />
              </button>
              <span className={`text-lg font-semibold transition-colors ${term === '36m' ? 'text-[#00FF84]' : 'text-gray-500'}`}>
                36 Months 
                <Badge className="ml-3 bg-[#00FF84] text-black text-sm font-bold px-3 py-1">
                  Save 10%
                </Badge>
              </span>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {plans.map((plan) => (
              <article 
                key={plan.id} 
                className={`rounded-2xl p-6 relative shadow-xl transition-all duration-300 flex flex-col ${
                  plan.accent 
                    ? "ring-2 ring-green-400 bg-gradient-to-br from-[#00FF41]/10 to-[#00DDFF]/10 shadow-2xl shadow-[#00FF41]/20" 
                    : "bg-[#0e1410] border border-[rgba(255,255,255,0.1)] hover:border-[#00FF41]/50"
                }`}
                style={{ height: '580px' }}
              >
                {/* Popular Badge */}
                {plan.ribbon && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-[#00FF41] text-[rgb(17,17,19)] px-4 py-2 text-sm font-bold whitespace-nowrap shadow-lg">
                      <Crown size={16} className="mr-2" />
                      {plan.ribbon}
                    </Badge>
                  </div>
                )}

                {/* Plan Icon & Header */}
                <div className="mb-5 flex items-center gap-3">
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-lg flex-shrink-0 font-bold"
                    style={{ 
                      backgroundColor: plan.accent ? `${MATRIX_GREEN}20` : "rgba(255,255,255,0.05)",
                      color: plan.accent ? MATRIX_GREEN : "#00DDFF"
                    }}
                  >
                    ★
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold mb-1" style={{color: plan.accent ? MATRIX_GREEN : "white"}}>
                      {plan.title}
                      {plan.subtitle && (
                        <span className="text-sm font-normal text-gray-400 ml-2">({plan.subtitle})</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-300">{plan.tagline}</p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-extrabold" style={{color: plan.accent ? MATRIX_GREEN : "white"}}>
                      ${plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400">/month</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">per bundle (1,000 calls + 1,000 interactions)</div>
                  {plan.priceSubtext && (
                    <div className="text-xs text-orange-400 font-medium">{plan.priceSubtext}</div>
                  )}
                  {term === "36m" && (
                    <div className="text-xs text-green-400 mt-1 font-semibold">
                      Was ${basePrices[plan.id].toLocaleString()} • Save 10%
                    </div>
                  )}
                </div>

                {/* Key Features */}
                <div className="mb-5">
                  <h4 className="text-base font-semibold text-white mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle 
                          size={16} 
                          className={`mt-0.5 flex-shrink-0 ${plan.accent ? 'text-[#00FF41]' : 'text-[#00DDFF]'}`} 
                        />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Highlights */}
                <div className="mb-5 flex-1">
                  <h4 className="text-base font-semibold text-white mb-3">Highlights</h4>
                  <ul className="space-y-2">
                    {plan.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-gray-500 mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Value Proposition */}
                <div className="mb-5 p-3 rounded-lg text-sm" style={{backgroundColor: plan.accent ? `${MATRIX_GREEN}10` : "rgba(255,255,255,0.03)"}}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-300">Expected Savings</span>
                    <span className="font-bold text-xs" style={{color: plan.accent ? MATRIX_GREEN : "#00DDFF"}}>
                      {plan.savings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-300">Setup Time</span>
                    <span className="font-medium text-gray-400 text-xs">{plan.setupTime}</span>
                  </div>
                </div>

                {/* CTA Button - Always at bottom */}
                <div className="mt-auto">
                  <Button
                    onClick={() => handleContact(plan)}
                    className="w-full py-3 rounded-lg font-semibold text-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg mb-2"
                    style={{ background: MATRIX_GREEN }}
                  >
                    {plan.cta}
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    By clicking you agree to our Privacy Policy. {plan.id === 'starter' && 'Pilot requires prepayment.'}
                  </div>
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