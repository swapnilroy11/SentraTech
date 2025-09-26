import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Lock, FileText } from 'lucide-react';
import SecurityCompliance from '../components/SecurityCompliance';

const SecurityPage = () => {
  return (
    <main role="main" aria-label="SentraTech Security & Compliance">
      <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA]" id="security">
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
              Security & <span className="text-[#00FF41]">Compliance</span>
            </h1>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Bank-level security with comprehensive compliance certifications. Your data security 
              is our highest priority with enterprise-grade protection and transparency.
            </p>

            {/* Security Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              {[
                { value: '99.99%', label: 'Security Uptime' },
                { value: 'AES-256', label: 'Data Encryption' },
                { value: '24/7', label: 'Security Monitoring' },
                { value: 'Zero', label: 'Data Breaches' }
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

      {/* Data Flow Diagram Section */}
      <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              End-to-End Data Protection
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              See how your data flows securely through our infrastructure with encryption at every step
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.2)] rounded-2xl p-8"
            >
              {/* SVG Data Flow Diagram */}
              <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
                
                {/* Customer */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-[rgba(0,221,255,0.1)] rounded-full flex items-center justify-center mb-4 mx-auto border-2 border-[#00DDFF]">
                    <Shield size={32} className="text-[#00DDFF]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Customer Data</h3>
                  <p className="text-sm text-[rgb(161,161,170)]">Secure input via TLS 1.3</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="text-[#00FF41] transform md:rotate-0 rotate-90" size={24} />
                    <span className="text-xs text-[#00FF41] mt-1">TLS 1.3</span>
                  </div>
                </div>

                {/* SentraTech API */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-[rgba(0,255,65,0.1)] rounded-full flex items-center justify-center mb-4 mx-auto border-2 border-[#00FF41]">
                    <Lock size={32} className="text-[#00FF41]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">SentraTech API</h3>
                  <p className="text-sm text-[rgb(161,161,170)]">Processing & validation</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="text-[#00FF41] transform md:rotate-0 rotate-90" size={24} />
                    <span className="text-xs text-[#00FF41] mt-1">AES-256</span>
                  </div>
                </div>

                {/* Encrypted Database */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-[rgba(255,215,0,0.1)] rounded-full flex items-center justify-center mb-4 mx-auto border-2 border-[#FFD700]">
                    <FileText size={32} className="text-[#FFD700]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Encrypted Database</h3>
                  <p className="text-sm text-[rgb(161,161,170)]">AES-256 at rest</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <ArrowRight className="text-[#00FF41] transform md:rotate-0 rotate-90" size={24} />
                    <span className="text-xs text-[#00FF41] mt-1">Backup</span>
                  </div>
                </div>

                {/* Backup */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-[rgba(157,78,221,0.1)] rounded-full flex items-center justify-center mb-4 mx-auto border-2 border-[#9D4EDD]">
                    <Shield size={32} className="text-[#9D4EDD]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Secure Backup</h3>
                  <p className="text-sm text-[rgb(161,161,170)]">Multi-region redundancy</p>
                </div>

              </div>

              {/* Security Features */}
              <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)]">
                <h3 className="text-xl font-bold text-white text-center mb-8">Security Features</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Encryption in Transit',
                      description: 'TLS 1.3 encryption for all data transmission',
                      color: '#00DDFF'
                    },
                    {
                      title: 'Encryption at Rest', 
                      description: 'AES-256 encryption for stored data',
                      color: '#00FF41'
                    },
                    {
                      title: 'Backup & Recovery',
                      description: 'Multi-region encrypted backups with instant recovery',
                      color: '#9D4EDD'
                    }
                  ].map((feature, index) => (
                    <div key={index} className="text-center">
                      <h4 className="text-white font-semibold mb-2" style={{ color: feature.color }}>
                        {feature.title}
                      </h4>
                      <p className="text-sm text-[rgb(161,161,170)]">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Compliance Component */}
      <SecurityCompliance />

      {/* Documentation Links Section */}
      <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              Legal & Compliance Documents
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Access our comprehensive legal documentation and compliance reports
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Privacy Policy',
                description: 'Comprehensive privacy practices and data handling policies',
                icon: Shield,
                color: '#00FF41'
              },
              {
                title: 'Terms of Service',
                description: 'Service terms, conditions, and user agreements',
                icon: FileText,
                color: '#00DDFF'
              },
              {
                title: 'DPA Template',
                description: 'Data Processing Agreement template for enterprise customers',
                icon: Lock,
                color: '#FFD700'
              }
            ].map((doc, index) => {
              const Icon = doc.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl p-8 text-center hover:border-[rgba(0,255,65,0.3)] transition-all duration-300 group"
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${doc.color}20` }}
                  >
                    <Icon size={32} style={{ color: doc.color }} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {doc.title}
                  </h3>
                  
                  <p className="text-[rgb(161,161,170)] mb-6 leading-relaxed">
                    {doc.description}
                  </p>
                  
                  <Button 
                    variant="outline"
                    className="border-[rgba(0,255,65,0.3)] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)]"
                  >
                    <FileText size={16} className="mr-2" />
                    Download PDF
                  </Button>
                </motion.div>
              );
            })}
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
              Ready for Enterprise-Grade Security?
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] mb-8">
              Calculate your ROI with our secure, compliant platform that meets all enterprise requirements
            </p>
            <Link to="/roi-calculator">
              <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
                <span>Calculate Your ROI</span>
                <ArrowRight size={24} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      </div>
    </main>
  );
};

export default SecurityPage;