import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import PricingSection from '../components/PricingSection';
import SEOManager from '../components/SEOManager';

const PricingPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqItems = [
    {
      question: 'How long does implementation take?',
      answer: 'Implementation typically takes 2-6 weeks depending on your plan and complexity of integrations. Starter plans can be set up within 2 weeks, while Enterprise implementations with custom integrations may take 4-6 weeks. We provide dedicated support throughout the entire process.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'All plans include comprehensive support: Starter plans receive email support with 24-48 hour response times, Growth plans get 24/7 priority support via email, chat, and phone, and Enterprise customers receive dedicated success managers with guaranteed SLA response times.'
    },
    {
      question: 'What are your SLA guarantees?',
      answer: 'We guarantee 99.9% uptime across all plans. Growth plan includes 4-hour response time SLA for critical issues. Enterprise plans include custom SLA agreements with response times as low as 1 hour for P1 issues and dedicated technical account managers.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at your next billing cycle. We\'ll help ensure a smooth transition and preserve all your data and configurations.'
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Absolutely. Our Enterprise plan includes custom AI training, white-label options, dedicated infrastructure, custom integrations, and tailored SLA agreements. Contact our enterprise team to discuss your specific requirements and get a custom quote.'
    },
    {
      question: 'What integrations are included?',
      answer: 'All plans include our core integrations with CRM systems (Salesforce, HubSpot), communication tools (Slack, Teams, WhatsApp), and analytics platforms. Growth plans add advanced integrations, while Enterprise includes custom integration development.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 14-day free trial for all plans. No credit card required to start. During the trial, you\'ll have access to all features of your chosen plan with our full support team to help you get started.'
    },
    {
      question: 'How does pricing scale with usage?',
      answer: 'Our pricing is based on monthly interaction volumes. If you exceed your plan limits, we\'ll notify you and help you upgrade to the appropriate tier. There are no overage fees - we believe in transparent, predictable pricing.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA]" id="pricing">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-bold font-rajdhani mb-8 leading-tight">
              Transparent <span className="text-[#00FF41]">Pricing</span>
            </h1>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your business. Scale your customer support operations 
              with flexible pricing that grows with you.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
              {[
                { title: '14-Day Free Trial', description: 'No credit card required' },
                { title: '24 or 36 Months Contract', description: 'Flexible contract terms' },
                { title: '99.9% Uptime SLA', description: 'Guaranteed reliability' }
              ].map((prop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[rgba(0,255,65,0.05)] border border-[rgba(0,255,65,0.2)] rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-[#00FF41] mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-[rgb(161,161,170)]">
                    {prop.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Component */}
      <PricingSection />

      {/* All Plans Include Section */}
      <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              Every Plan Includes
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Core features and guarantees included across all pricing tiers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: '99.9% Uptime SLA',
                description: 'Guaranteed availability with multi-region infrastructure',
                color: '#00FF41'
              },
              {
                title: '24/7 Technical Support',
                description: 'Round-the-clock assistance from our expert team',
                color: '#00DDFF'
              },
              {
                title: 'Full API Access',
                description: 'Complete API access for custom integrations',
                color: '#FFD700'
              },
              {
                title: 'Security & Compliance',
                description: 'Enterprise-grade security with SOC2 compliance',
                color: '#9D4EDD'
              },
              {
                title: 'Real-time Analytics',
                description: 'Comprehensive dashboards and reporting tools',
                color: '#FF6B6B'
              },
              {
                title: 'Multi-language Support',
                description: 'Support for 15+ languages and localization',
                color: '#00FF99'
              },
              {
                title: 'Data Export',
                description: 'Full data portability and export capabilities',
                color: '#FFA500'
              },
              {
                title: 'Regular Updates',
                description: 'Automatic updates with new features and improvements',
                color: '#DA70D6'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Check size={32} style={{ color: feature.color }} />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-[rgb(161,161,170)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Everything you need to know about our pricing, implementation, and support
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 hover:border-[rgba(0,255,65,0.3)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {item.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className="text-[#00FF41] flex-shrink-0" size={24} />
                    ) : (
                      <ChevronDown className="text-[#00FF41] flex-shrink-0" size={24} />
                    )}
                  </div>
                </button>
                
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[rgba(0,255,65,0.05)] border border-[rgba(0,255,65,0.2)] rounded-b-xl p-6 -mt-1"
                  >
                    <p className="text-[rgb(218,218,218)] leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 bg-gradient-to-r from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              Need a Custom Solution?
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] mb-8">
              Our enterprise team can work with you to create a tailored package that meets 
              your specific requirements and scale.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300">
                Contact Enterprise Sales
              </Button>
              <Link to="/demo-request">
                <Button 
                  variant="outline"
                  className="border-[#00FF41] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] px-8 py-4 text-lg rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Schedule Demo</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;