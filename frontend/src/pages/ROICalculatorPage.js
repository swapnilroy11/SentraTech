import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, TrendingUp, DollarSign, Clock, Users, Zap, Target, CheckCircle } from 'lucide-react';
import ROICalculator from '../components/ROICalculator';

const ROICalculatorPage = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Reduce operational costs by up to 60% with AI automation',
      color: 'text-[#00FF41]',
      bgColor: 'bg-[rgba(0,255,65,0.1)]',
      borderColor: 'border-[rgba(0,255,65,0.3)]'
    },
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Faster resolution times with intelligent routing and responses',
      color: 'text-[#00DDFF]',
      bgColor: 'bg-[rgba(0,221,255,0.1)]',
      borderColor: 'border-[rgba(0,221,255,0.3)]'
    },
    {
      icon: Users,
      title: 'Agent Productivity',
      description: 'Increase agent productivity by 3x with AI assistance',
      color: 'text-[#FFD700]',
      bgColor: 'bg-[rgba(255,215,0,0.1)]',
      borderColor: 'border-[rgba(255,215,0,0.3)]'
    },
    {
      icon: Target,
      title: 'Customer Satisfaction',
      description: 'Improve customer satisfaction scores to 95%+',
      color: 'text-[#FF6B6B]',
      bgColor: 'bg-[rgba(255,107,107,0.1)]',
      borderColor: 'border-[rgba(255,107,107,0.3)]'
    }
  ];

  const statistics = [
    { value: '60%', label: 'Average Cost Reduction', icon: DollarSign },
    { value: '3x', label: 'Faster Resolution', icon: Zap },
    { value: '95%', label: 'Customer Satisfaction', icon: CheckCircle },
    { value: '24/7', label: 'AI Availability', icon: Clock }
  ];

  return (
    <main role="main" aria-label="SentraTech ROI Calculator - Calculate AI Support Savings">
      <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA]" id="roi-calculator-page">
      {/* Hero Section */}
      <section className="pt-24 pb-12 relative overflow-hidden" id="roi-hero">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-[#00FF41]/20 rounded-full flex items-center justify-center border-2 border-[#00FF41]/50">
                <Calculator className="text-[#00FF41]" size={32} />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-rajdhani leading-tight">
                ROI <span className="text-[#00FF41]">Calculator</span>
              </h1>
            </div>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover your potential savings and return on investment with SentraTech's AI-powered customer support platform. 
              Get personalized calculations based on your current operations.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="bg-[rgba(0,255,65,0.05)] border border-[rgba(0,255,65,0.2)] rounded-xl p-4"
                >
                  <stat.icon size={24} className="text-[#00FF41] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#00FF41] mb-1 font-rajdhani">{stat.value}</div>
                  <div className="text-sm text-[rgb(161,161,170)]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main ROI Calculator Section */}
      <section className="py-16 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)] relative" id="calculator">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-rajdhani">
              Calculate Your Savings
            </h2>
            <p className="text-lg text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Input your current support metrics to see projected savings, efficiency gains, and ROI with SentraTech
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ROICalculator />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#0A0A0A]" id="roi-benefits">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-rajdhani">
              Why Calculate ROI with SentraTech?
            </h2>
            <p className="text-lg text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Understand the tangible benefits and financial impact of implementing our AI-powered platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`${benefit.bgColor} ${benefit.borderColor} border rounded-xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-[rgba(0,255,65,0.1)] transition-all duration-300`}
              >
                {/* Background accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${benefit.bgColor} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4 ${benefit.borderColor} border`}>
                    <benefit.icon size={24} className={benefit.color} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-[rgb(161,161,170)] leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-16 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)]" id="implementation">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-rajdhani">
              ROI Timeline
            </h2>
            <p className="text-lg text-[rgb(161,161,170)] max-w-3xl mx-auto">
              See how quickly you can achieve return on investment with our phased implementation approach
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                phase: 'Month 1-2',
                title: 'Initial Setup & Training',
                roi: '10-15%',
                description: 'Quick wins with automated responses and basic routing',
                color: 'text-[#FFD700]'
              },
              {
                phase: 'Month 3-6',
                title: 'Full Integration',
                roi: '35-45%',
                description: 'Complete AI integration with advanced analytics and optimization',
                color: 'text-[#00DDFF]'
              },
              {
                phase: 'Month 6+',
                title: 'Maximized Efficiency',
                roi: '60-80%',
                description: 'Full platform benefits with predictive analytics and insights',
                color: 'text-[#00FF41]'
              }
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="bg-[rgba(0,255,65,0.05)] border border-[rgba(0,255,65,0.2)] rounded-xl p-6">
                  <div className="text-sm font-medium text-[rgb(161,161,170)] mb-2">{phase.phase}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{phase.title}</h3>
                  <div className={`text-3xl font-bold mb-3 font-rajdhani ${phase.color}`}>
                    {phase.roi} ROI
                  </div>
                  <p className="text-sm text-[rgb(161,161,170)]">{phase.description}</p>
                </div>
                
                {/* Timeline connector */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-8 h-px bg-gradient-to-r from-[#00FF41] to-transparent transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0A0A0A]" id="roi-cta">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Enhanced background */}
            <div className="bg-gradient-to-br from-[rgba(0,255,65,0.05)] to-[rgba(0,221,255,0.05)] rounded-3xl border border-[rgba(0,255,65,0.2)] p-8 relative overflow-hidden">
              {/* Background accents */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FF41]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00DDFF]/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
                  Ready to See Your ROI in Action?
                </h2>
                <p className="text-lg text-[rgb(161,161,170)] mb-8">
                  Get a personalized demo showing exactly how SentraTech can transform your support operations and deliver the ROI you calculated
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/demo-request">
                    <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-[#00FF41]/25">
                      <span>Schedule Demo</span>
                      <ArrowRight size={20} />
                    </Button>
                  </Link>
                  
                  <Link to="/case-studies">
                    <Button variant="outline" className="border-[#00DDFF] text-[#00DDFF] hover:bg-[#00DDFF]/10 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300">
                      View Case Studies
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </main>
  );
};

export default ROICalculatorPage;