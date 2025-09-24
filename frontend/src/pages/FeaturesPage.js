import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Calculator } from 'lucide-react';
import ROICalculator from '../components/ROICalculator';
import CustomerJourney from '../components/CustomerJourney';
import ChatWidget from '../components/ChatWidget';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA]">
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
              Features & <span className="text-[#00FF41]">Customer Journey</span>
            </h1>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover how our AI-powered platform transforms customer support through intelligent automation, 
              real-time analytics, and seamless integrations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi-calculator" className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Calculator className="text-[#00FF41]" size={48} />
              <h2 className="text-5xl font-bold text-white font-rajdhani">
                ROI Calculator
              </h2>
            </div>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Calculate your potential savings and efficiency gains with our intelligent cost analysis tool. 
              See exactly how SentraTech can transform your support operations.
            </p>
          </motion.div>
          
          <ROICalculator />
        </div>
      </section>

      {/* Live Chat Demo Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <MessageSquare className="text-[#00DDFF]" size={48} />
              <h2 className="text-5xl font-bold text-white font-rajdhani">
                Live Chat AI Demo
              </h2>
            </div>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto mb-12">
              Experience our sub-50ms AI-powered responses in action. Try our intelligent chat system 
              that understands context, provides accurate answers, and seamlessly escalates to human agents when needed.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)] rounded-2xl border border-[rgba(0,255,65,0.2)] p-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Try Our AI Assistant
                </h3>
                <p className="text-[rgb(161,161,170)]">
                  Click the chat button below to start a conversation with our AI-powered support system
                </p>
              </div>

              {/* Sample Chat Interface Preview */}
              <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
                  <div className="w-8 h-8 bg-[#00FF41] rounded-full flex items-center justify-center">
                    <MessageSquare size={16} className="text-black" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">SentraTech AI</h4>
                    <p className="text-[rgb(161,161,170)] text-sm">Online • Sub-50ms response</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#00FF41] rounded-full flex-shrink-0"></div>
                    <div className="bg-[rgba(0,255,65,0.1)] rounded-lg p-3 border border-[rgba(0,255,65,0.2)]">
                      <p className="text-white text-sm">
                        Hello! I'm your AI assistant. How can I help you today? I can answer questions about 
                        pricing, features, integration setup, or connect you with our sales team.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-[rgba(255,255,255,0.1)] rounded-lg p-3 max-w-xs">
                      <p className="text-white text-sm">
                        How does your integration with Salesforce work?
                      </p>
                    </div>
                    <div className="w-6 h-6 bg-[rgba(255,255,255,0.2)] rounded-full flex-shrink-0"></div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#00FF41] rounded-full flex-shrink-0"></div>
                    <div className="bg-[rgba(0,255,65,0.1)] rounded-lg p-3 border border-[rgba(0,255,65,0.2)]">
                      <p className="text-white text-sm">
                        Great question! Our Salesforce integration syncs customer data and support interactions 
                        for a unified view. Setup takes just 15 minutes with contact sync, case management, 
                        and activity tracking. Would you like me to show you our integration demo or connect 
                        you with a specialist?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#00FF41]"
                      readOnly
                    />
                    <Button size="sm" className="bg-[#00FF41] text-black hover:bg-[#00e83a]">
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-[rgb(161,161,170)] mt-2 text-center">
                    ↗ Try the live chat widget in the bottom-right corner
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Journey Section */}
      <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <CustomerJourney />
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
              Ready to See Real Results?
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] mb-8">
              Discover how businesses like yours achieved 60%+ cost reduction while improving customer satisfaction
            </p>
            <Link to="/case-studies">
              <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
                <span>Explore Case Studies</span>
                <ArrowRight size={24} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;