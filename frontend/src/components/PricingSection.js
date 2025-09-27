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
      features: [
        "Up to 1,000 calls + 1,000 interactions per bundle",
        "Basic AI automation (60% baseline)",
        "Core analytics dashboard",
        "Email support (24hr response)",
        "Guided onboarding (up to 5 hrs)",
        "Standard API & webhooks",
        "Standard service guarantee"
      ],
      savings: "40-60%",
      setupTime: "2-3 weeks",
      sla: "Standard Service",
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
      features: [
        "Up to 1,000 calls + 1,000 interactions per bundle",
        "Full omnichannel integration",
        "Advanced analytics & BI dashboards",
        "24/7 priority support",
        "Enhanced compliance & reporting",
        "Multi-language support (12+ languages)",
        "Dedicated success manager",
        "99.9% uptime guarantee"
      ],
      savings: "60-75%",
      setupTime: "3-4 weeks",
      sla: "99.9% Uptime",
      isPopular: true,
      popularBadge: "Most Popular"
    },
    {
      id: "enterprise",
      title: "Custom",
      subtitle: "Enterprise",
      tagline: "Best used for custom plans and enterprise solutions",
      icon: "🏢",
      price: null,
      originalPrice: null,
      priceNote: "Custom pricing based on requirements",
      subNote: "Tailored solutions for enterprise needs",
      cta: "Contact Sales",
      features: [
        "Unlimited interactions (custom contract)",
        "Custom AI training & dedicated model endpoints",
        "Dedicated success manager & priority SRE",
        "White-label & advanced compliance (HIPAA, SOC2)",
        "SLA-backed uptime & response time",
        "Dedicated model instances",
        "Custom integration development",
        "99.99% custom service guarantee"
      ],
      savings: "70-85%",
      setupTime: "4-6 weeks",
      sla: "99.99% Custom Service",
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
      <section id="pricing" className="py-12 bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)]">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-[rgba(0,255,132,0.1)] text-[#00FF84] border-[#00FF84]/30 px-4 py-2">
                <Star className="mr-2" size={16} />
                Transparent Pricing
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                <span className="text-white">Simple, Transparent</span>
                <br />
                <span className="text-[#00FF84]">Pricing Plans</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">
                Choose the perfect plan for your business. Scale your AI-powered customer support 
                with flexible pricing that grows with you.
              </p>
            </motion.div>
            
            {/* Billing Period Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center space-x-8 mb-8"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.article 
                key={plan.id} 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ 
                  y: -8,
                  boxShadow: plan.isPopular 
                    ? "0 25px 50px -12px rgba(0, 255, 132, 0.25)" 
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
                className={`relative rounded-3xl p-8 transition-all duration-300 bg-gradient-to-br flex flex-col ${
                  plan.isPopular
                    ? "from-[#0A0F0A] via-[#0E1410] to-[#0A0F0A] ring-2 ring-[#00FF84] shadow-2xl shadow-[#00FF84]/20" 
                    : "from-[#0E0E0E] to-[#1A1A1A] border border-gray-800 hover:border-gray-700"
                }`}
                style={{ minHeight: '540px' }}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-[#00FF84] text-black px-4 py-2 text-sm font-bold whitespace-nowrap shadow-lg">
                      <Crown size={16} className="mr-2" />
                      {plan.popularBadge}
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.title}
                    {plan.subtitle && (
                      <span className="text-base font-normal text-gray-400 ml-2">({plan.subtitle})</span>
                    )}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center mb-2">
                    {plan.price ? (
                      <>
                        <span className="text-4xl font-extrabold text-white">
                          ${plan.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-lg ml-2">/month</span>
                      </>
                    ) : (
                      <span className="text-4xl font-extrabold text-white">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{plan.priceNote}</p>
                  {plan.subNote && (
                    <p className="text-[#00FF84] text-sm font-medium">{plan.subNote}</p>
                  )}
                  {term === "36m" && plan.originalPrice && (
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[#00FF84]/10 rounded-full">
                      <span className="text-[#00FF84] text-sm font-semibold">
                        Was ${plan.originalPrice.toLocaleString()} • Save 10%
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-4">What's Included</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle 
                          size={18} 
                          className="text-[#00FF84] flex-shrink-0 mt-0.5" 
                        />
                        <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Spacer to maintain layout */}
                <div className="mb-6 flex-1">
                </div>

                {/* Value Metrics - Optimized */}
                <div className="mb-4 p-3 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="flex justify-between items-center text-center">
                    <div className="flex-1">
                      <div className="text-[#00FF84] text-lg font-bold">{plan.savings}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[#00FF84] text-lg font-bold">{plan.setupTime}</div>
                    </div>
                  </div>
                </div>

                {/* CTA Button - Fixed positioning at bottom */}
                <div className="mt-auto pt-4">
                  <Button
                    onClick={() => handleContact(plan)}
                    className="w-full bg-[#00FF84] hover:bg-[#00DD70] text-black rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 py-4 shadow-lg hover:shadow-[#00FF84]/25"
                  >
                    {plan.cta}
                  </Button>
                  <p className="text-gray-500 text-xs text-center mt-3">
                    By clicking you agree to our Privacy Policy.
                  </p>
                </div>
              </motion.article>
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