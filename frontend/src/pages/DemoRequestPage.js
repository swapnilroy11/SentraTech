import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Shield, Zap } from 'lucide-react';
import CTASection from '../components/CTASection';

const DemoRequestPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA]" id="demo-request">
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
              Request Your <span className="text-[#00FF41]">Demo</span>
            </h1>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-12 max-w-3xl mx-auto leading-relaxed">
              See SentraTech in action with a personalized demonstration tailored to your business needs. 
              Discover how our AI-powered platform can transform your customer support operations.
            </p>

            {/* What You'll Get */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {[
                {
                  title: '30-Minute Personalized Walkthrough',
                  description: 'Custom demo using your industry examples and use cases',
                  icon: Clock,
                  color: '#00FF41'
                },
                {
                  title: 'Custom ROI Analysis',
                  description: 'Tailored cost-benefit assessment for your organization',
                  icon: CheckCircle,
                  color: '#00DDFF'
                },
                {
                  title: 'Implementation Roadmap',
                  description: 'Step-by-step integration plan and timeline',
                  icon: Zap,
                  color: '#FFD700'
                },
                {
                  title: 'Security & Compliance Review',
                  description: 'Detailed overview of our enterprise security measures',
                  icon: Shield,
                  color: '#9D4EDD'
                }
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-[rgba(0,255,65,0.05)] border border-[rgba(0,255,65,0.2)] rounded-xl p-6 text-left"
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ backgroundColor: `${benefit.color}20` }}
                      >
                        <Icon size={24} style={{ color: benefit.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-[rgb(161,161,170)]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              What Happens Next?
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Your journey to better customer support starts here
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Schedule Your Demo',
                  description: '30-minute personalized walkthrough of SentraTech features using your industry examples',
                  duration: 'Today'
                },
                {
                  step: '2',
                  title: 'Custom ROI Analysis',
                  description: 'Tailored cost-benefit assessment showing potential savings and efficiency gains',
                  duration: '24 Hours'
                },
                {
                  step: '3',
                  title: 'Implementation Plan',
                  description: 'Step-by-step integration roadmap with timeline and resource requirements',
                  duration: '48 Hours'
                }
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl p-8 h-full">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-[#00FF41] text-black rounded-full flex items-center justify-center font-bold text-xl">
                        {process.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{process.title}</h3>
                        <p className="text-[#00FF41] text-sm font-semibold">{process.duration}</p>
                      </div>
                    </div>
                    
                    <p className="text-[rgb(161,161,170)] leading-relaxed">
                      {process.description}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#00FF41] transform -translate-y-1/2 z-10">
                      <div className="absolute right-0 top-1/2 w-0 h-0 border-l-4 border-l-[#00FF41] border-t-2 border-b-2 border-t-transparent border-b-transparent transform -translate-y-1/2"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section className="py-20 bg-[#0A0A0A]">
        <CTASection />
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '24hrs', label: 'Response Time' },
              { value: '99.9%', label: 'Platform Uptime' },
              { value: 'SOC2', label: 'Compliant' },
              { value: '30-day', label: 'Free Trial' }
            ].map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-[rgb(17,17,19)] rounded-xl border border-[rgb(63,63,63)]"
              >
                <div className="text-2xl font-bold text-[#00FF41] mb-2 font-rajdhani">
                  {indicator.value}
                </div>
                <div className="text-sm text-[rgb(161,161,170)]">
                  {indicator.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoRequestPage;