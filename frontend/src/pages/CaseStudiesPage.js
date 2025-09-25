import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CaseStudies from '../components/CaseStudies';
import ComponentErrorBoundary from '../components/ComponentErrorBoundary';

const CaseStudiesPage = () => {
  return (
    <ComponentErrorBoundary>
      <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA]" style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }} id="case-studies">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden" id="case-studies-hero">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h1 className="text-6xl md:text-7xl font-bold font-rajdhani mb-8 leading-tight">
              Customer <span className="text-[#00FF41]">Success Stories</span>
            </h1>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover how businesses across healthcare, telecom, and e-commerce transformed their 
              customer support operations with measurable results and lasting impact.
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              {[
                { value: '60%+', label: 'Average Cost Reduction' },
                { value: '94%', label: 'Customer Satisfaction' },
                { value: '70%', label: 'Process Automation' },
                { value: '6 weeks', label: 'Implementation Time' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[rgba(0,255,65,0.05)] border border-[rgba(0,255,65,0.2)] rounded-xl p-6"
                >
                  <div className="text-3xl font-bold text-[#00FF41] mb-2 font-rajdhani">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[rgb(161,161,170)]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Component */}
      <CaseStudies />

      {/* Success Metrics Strip */}
      <section className="py-20 bg-gradient-to-r from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-rajdhani">
              Consistent Results Across Industries
            </h2>
            <p className="text-lg text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Our AI-powered platform delivers measurable improvements regardless of industry or company size
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Healthcare Providers',
                metrics: ['60% cost reduction', '95% response time improvement', '26% satisfaction increase'],
                description: 'Streamlined patient inquiries, automated appointment booking, and intelligent symptom triage'
              },
              {
                title: 'Telecom Companies',
                metrics: ['62% cost reduction', '85% churn reduction', '93% response time improvement'],
                description: 'Automated billing queries, proactive network issue resolution, and instant service activation'
              },
              {
                title: 'E-commerce Platforms',
                metrics: ['62% cost reduction', '92% response time improvement', '55% LTV increase'],
                description: 'Order tracking automation, returns processing, and AI-powered product recommendations'
              }
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  {industry.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {industry.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#00FF41] rounded-full"></div>
                      <span className="text-[#00FF41] font-semibold">{metric}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-[rgb(161,161,170)] leading-relaxed">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              Ready to Build Your Success Story?
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] mb-8">
              Discover our enterprise-grade security measures and compliance certifications
            </p>
            <Link to="/security">
              <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
                <span>Security & Compliance</span>
                <ArrowRight size={24} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
    </ComponentErrorBoundary>
  );
};

export default CaseStudiesPage;