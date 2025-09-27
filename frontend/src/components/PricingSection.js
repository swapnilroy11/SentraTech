import React, { useState, useMemo } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, Star, Crown } from 'lucide-react';
import ContactSalesSlideIn from './ContactSalesSlideIn';

/**
 * New SentraTech Pricing Section Component
 * Implements the 3-tier pricing structure with 24/36 month toggle
 */
const PricingSection = () => {
  const MATRIX_GREEN = "#00FF41";
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
      priceDisplay: `$${effectivePrice(basePrices.starter).toLocaleString()} / per bundle (1,000 calls + 1,000 interactions)`,
      priceSubtext: "Pilot only — 3 month max",
      cta: "Start Pilot",
      features: [
        "Up to 1,000 calls + 1,000 interactions per bundle",
        "Basic AI automation (60% baseline)",
        "Core analytics dashboard",
        "Email support",
        "Onboarding & integration (up to 5 hrs)"
      ],
      ribbon: null,
      accent: false
    },
    {
      id: "growth",
      title: "Growth",
      subtitle: null,
      tagline: "Full omnichannel experience — optimized for scale",
      price: effectivePrice(basePrices.growth),
      priceDisplay: `$${effectivePrice(basePrices.growth).toLocaleString()} / per bundle (1,000 calls + 1,000 interactions)`,
      priceSubtext: null,
      cta: "Contact Sales",
      features: [
        "Up to 1,000 calls + 1,000 interactions per bundle",
        "Full omnichannel integration",
        "Advanced analytics & BI dashboards",
        "24/7 priority support",
        "Enhanced compliance & reporting"
      ],
      ribbon: "Most Popular",
      accent: true
    },
    {
      id: "enterprise",
      title: "Enterprise",
      subtitle: "Dedicated",
      tagline: "Unlimited scale, dedicated success",
      price: effectivePrice(basePrices.enterprise),
      priceDisplay: `$${effectivePrice(basePrices.enterprise).toLocaleString()} / per bundle (1,000 calls + 1,000 interactions)`,
      priceSubtext: null,
      cta: "Contact Sales (Enterprise)",
      features: [
        "Unlimited interactions (custom contract)",
        "Custom AI training & dedicated model endpoints",
        "Dedicated success manager & priority SRE",
        "White-label & advanced compliance (HIPAA, SOC2)",
        "SLA-backed uptime & response time"
      ],
      ribbon: null,
      accent: false
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
            
            {/* Billing Period Toggle - 24 months vs 36 months */}
            <div className="flex items-center justify-center space-x-6 mb-12">
              <span className={`text-sm font-medium ${term === '24m' ? 'text-[#00FF41]' : 'text-[rgb(161,161,170)]'}`}>
                24 Months
              </span>
              <button
                onClick={handleToggleChange}
                className="relative w-16 h-8 bg-[rgb(38,40,42)] rounded-full border border-[rgb(63,63,63)] transition-all duration-300 hover:border-[#00FF41]/50"
                aria-pressed={term === "36m"}
                title="Toggle billing term"
              >
                <div className={`absolute w-6 h-6 bg-[#00FF41] rounded-full top-1 transition-all duration-300 shadow-lg shadow-[#00FF41]/30 ${
                  term === '36m' ? 'left-9' : 'left-1'
                }`} />
              </button>
              <span className={`text-sm font-medium ${term === '36m' ? 'text-[#00FF41]' : 'text-[rgb(161,161,170)]'}`}>
                36 Months 
                <Badge className="ml-2 bg-[#00FF41] text-[rgb(17,17,19)] text-xs font-semibold px-2 py-1">
                  Save 10%
                </Badge>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {plans.map((plan) => (
              <article 
                key={plan.id} 
                className={`rounded-2xl p-6 pb-[100px] relative shadow-xl transition-all duration-300 ${
                  plan.accent 
                    ? "ring-2 ring-green-400 bg-gradient-to-br from-[#00FF41]/10 to-[#00DDFF]/10 shadow-2xl shadow-[#00FF41]/20" 
                    : "bg-[#0e1410] border border-[rgba(255,255,255,0.1)] hover:border-[#00FF41]/50"
                }`}
              >
                {/* Popular Badge */}
                {plan.ribbon && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-[#00FF41] text-[rgb(17,17,19)] px-4 py-2 text-sm font-semibold">
                      <Crown size={16} className="mr-1" />
                      {plan.ribbon}
                    </Badge>
                  </div>
                )}

                {/* Plan Icon & Header */}
                <div className="mb-6 flex items-center gap-3">
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-green-400"
                    style={{ backgroundColor: plan.accent ? `${MATRIX_GREEN}20` : "rgba(255,255,255,0.05)" }}
                  >
                    ★
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{color: plan.accent ? MATRIX_GREEN : "white"}}>
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
                  <div className="text-3xl font-extrabold mb-2" style={{color: plan.accent ? MATRIX_GREEN : "white"}}>
                    ${plan.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400 mb-1">per bundle (1,000 calls + 1,000 interactions)</div>
                  {plan.priceSubtext && (
                    <div className="text-xs text-gray-500">{plan.priceSubtext}</div>
                  )}
                  {term === "36m" && (
                    <div className="text-xs text-green-400 mt-1">
                      Was ${basePrices[plan.id].toLocaleString()} (10% savings)
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-sm text-gray-300">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle 
                        size={16} 
                        className={`mt-1 flex-shrink-0 ${plan.accent ? 'text-[#00FF41]' : 'text-[#00DDFF]'}`} 
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button - Fixed position at bottom with consistent spacing */}
                <div className="absolute bottom-6 left-6 right-6">
                  <Button
                    onClick={() => handleContact(plan)}
                    className="w-full py-3 rounded-lg font-semibold text-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    style={{ background: MATRIX_GREEN }}
                  >
                    {plan.cta}
                  </Button>
                  <div className="text-xs text-gray-500 mt-2 text-center">
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