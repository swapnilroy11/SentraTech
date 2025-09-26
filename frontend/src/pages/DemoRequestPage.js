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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
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

      {/* Demo Request Form */}
      <section className="pt-24 pb-16 bg-[#0A0A0A]">
        <CTASection />
      </section>
    </div>
  );
};

export default DemoRequestPage;