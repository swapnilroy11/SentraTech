import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Clock,
  Shield,
  Activity,
  Mail
} from 'lucide-react';
import IntegrationsShowcase from '../components/IntegrationsShowcase';
import ComponentErrorBoundary from '../components/ComponentErrorBoundary';

const IntegrationsPage = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  // Track page loading
  useEffect(() => {
    console.log('IntegrationsPage: Component mounting');
    setPageLoaded(true);
    return () => {
      console.log('IntegrationsPage: Component unmounting');
    };
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const performanceStats = [
    { 
      icon: Zap, 
      value: '50+', 
      label: 'Integrations',
      description: 'Pre-built connectors'
    },
    { 
      icon: Clock, 
      value: '5min', 
      label: 'Average Setup',
      description: 'Quick configuration'
    },
    { 
      icon: Shield, 
      value: '99.9%', 
      label: 'Uptime',
      description: 'Reliable connections'
    },
    { 
      icon: Activity, 
      value: '24/7', 
      label: 'Monitoring',
      description: 'Always watching'
    }
  ];

  const faqItems = [
    {
      question: 'How do I add a new integration?',
      answer: 'Adding integrations is simple! Navigate to your dashboard, click "Add Integration", select your platform, and follow our step-by-step setup wizard. Most integrations can be configured in under 5 minutes.'
    },
    {
      question: 'Do you support custom API integrations?',
      answer: 'Yes! Our Enterprise plan includes custom API integration development. Our team will work with you to build tailored connectors for your specific platforms and requirements.'
    },
    {
      question: 'What happens if an integration fails?',
      answer: 'We provide 24/7 monitoring with automatic failover mechanisms. If an integration experiences issues, you\'ll receive immediate alerts and our system will attempt automatic recovery.'
    },
    {
      question: 'Can I test integrations before going live?',
      answer: 'Absolutely! All integrations include sandbox testing environments where you can safely test data flows, webhooks, and API calls before deploying to production.'
    },
    {
      question: 'How secure are the integrations?',
      answer: 'All integrations use enterprise-grade security including OAuth 2.0, API key encryption, and SOC 2 compliant data handling. Your credentials and data are always protected.'
    }
  ];

  return (
    <ComponentErrorBoundary>
      <div className="min-h-screen bg-[#0D1117] text-[#FFFFFF]" style={{ backgroundColor: '#0D1117', minHeight: '100vh' }}>
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-20 right-4 z-50 bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] rounded p-2 text-xs text-[#00FF41]">
            Integrations Page Loaded: {pageLoaded ? 'Yes' : 'No'}
          </div>
        )}

        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-7xl md:text-8xl font-bold font-rajdhani mb-8 leading-tight uppercase tracking-wider">
                SEAMLESS PLATFORM <br/>
                <span className="text-[#00FF41]">INTEGRATIONS</span>
              </h1>
              
              <p className="text-2xl text-[#C9D1D9] mb-12 max-w-3xl mx-auto leading-relaxed">
                Connect your tech stack in minutes, scale without limits.
              </p>

              {/* Primary and Secondary CTAs */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
                <Button 
                  onClick={() => document.getElementById('integrations-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#00FF41] text-[#0D1117] hover:bg-[#00e83a] font-bold px-10 py-5 text-xl rounded-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#00FF41] focus:ring-opacity-50"
                >
                  EXPLORE INTEGRATIONS
                  <ArrowRight size={24} className="ml-2" />
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  className="border-2 border-[#00FF41] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] px-10 py-5 text-xl rounded-xl font-bold transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#00FF41] focus:ring-opacity-50"
                >
                  <a href="mailto:info@sentratech.net">
                    <Mail size={24} className="mr-2" />
                    CONTACT SALES
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Performance Stats Strip */}
        <section className="py-16 bg-[#161B22] border-y border-[rgba(0,255,65,0.2)]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {performanceStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 bg-[#00FF41] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={32} className="text-[#0D1117]" />
                    </div>
                    
                    <h3 className="text-4xl font-bold text-[#FFFFFF] mb-2 font-rajdhani">
                      {stat.value}
                    </h3>
                    
                    <p className="text-lg font-semibold text-[#00FF41] mb-1">
                      {stat.label}
                    </p>
                    
                    <p className="text-sm text-[#C9D1D9]">
                      {stat.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Integration Logo Grid */}
        <section id="integrations-grid" className="py-20 bg-[#0D1117]">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#00FF41] mb-4 font-rajdhani uppercase tracking-wider">
                TRUSTED INTEGRATIONS
              </h2>
              <p className="text-[#C9D1D9] text-lg">
                Connect with the platforms your team already uses
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  name: 'HubSpot', 
                  logo: 'HS', 
                  color: '#FF7A59',
                  setupTime: '10 min',
                  adoption: '88%',
                  description: 'Sync contacts in minutes'
                },
                { 
                  name: 'Salesforce', 
                  logo: 'SF', 
                  color: '#00A1E0',
                  setupTime: '15 min',
                  adoption: '95%',
                  description: 'CRM integration made easy'
                },
                { 
                  name: 'Zendesk', 
                  logo: 'ZD', 
                  color: '#03363D',
                  setupTime: '45 min',
                  adoption: '80%',
                  description: 'Migrate tickets seamlessly'
                },
                { 
                  name: 'Airtable', 
                  logo: 'AT', 
                  color: '#18BFFF',
                  setupTime: '8 min',
                  adoption: '72%',
                  description: 'Database sync in real-time'
                },
                { 
                  name: 'Twilio', 
                  logo: 'TW', 
                  color: '#F22F46',
                  setupTime: '12 min',
                  adoption: '85%',
                  description: 'SMS & voice integration'
                },
                { 
                  name: 'Tableau', 
                  logo: 'TB', 
                  color: '#E97627',
                  setupTime: '25 min',
                  adoption: '78%',
                  description: 'Advanced analytics dashboard'
                },
                { 
                  name: 'Slack', 
                  logo: 'SL', 
                  color: '#4A154B',
                  setupTime: '5 min',
                  adoption: '92%',
                  description: 'Team communication hub'
                },
                { 
                  name: 'Microsoft', 
                  logo: 'MS', 
                  color: '#00BCF2',
                  setupTime: '20 min',
                  adoption: '89%',
                  description: 'Office 365 integration'
                }
              ].map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-[#161B22] rounded-xl p-8 h-48 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-2 hover:border-[#00FF41] hover:shadow-lg hover:shadow-[#00FF41]/20 focus-within:outline-none focus-within:ring-4 focus-within:ring-[#00FF41] focus-within:ring-opacity-50">
                    {/* Front Side */}
                    <div className="group-hover:opacity-0 transition-opacity duration-300">
                      <div 
                        className="w-20 h-20 rounded-xl flex items-center justify-center font-bold text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: integration.color }}
                      >
                        {integration.logo}
                      </div>
                      <h3 className="text-[#FFFFFF] font-semibold text-lg text-center">
                        {integration.name}
                      </h3>
                      <p className="text-[#C9D1D9] text-sm text-center mt-2">
                        {integration.description}
                      </p>
                    </div>

                    {/* Back Side - Appears on hover */}
                    <div className="absolute inset-0 bg-[#00FF41] rounded-xl p-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotateY-180">
                      <h3 className="text-[#0D1117] font-bold text-xl mb-4 text-center">
                        {integration.name}
                      </h3>
                      <div className="text-[#0D1117] text-center space-y-2">
                        <p className="font-semibold">Setup: {integration.setupTime}</p>
                        <p className="font-semibold">Adoption: {integration.adoption}</p>
                        <Link 
                          to={`/integrations/${integration.name.toLowerCase()}`}
                          className="inline-block mt-4 bg-[#0D1117] text-[#00FF41] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                        >
                          Learn More →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button
                asChild
                variant="outline"
                className="border-[#00FF41] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] px-8 py-3 rounded-xl font-semibold"
              >
                <Link to="/integrations/all">
                  See All Platforms
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        {/* FAQ Accordion */}
        <section className="py-20 bg-[#161B22]">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#00FF41] mb-4 font-rajdhani uppercase tracking-wider">
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <p className="text-[#C9D1D9] text-lg">
                Everything you need to know about our integrations
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
                    className="w-full text-left bg-[#0D1117] border border-[rgba(0,255,65,0.2)] rounded-xl p-6 hover:border-[#00FF41] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#00FF41] focus:ring-opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#00FF41] pr-4">
                        {item.question}
                      </h3>
                      {openFAQ === index ? (
                        <ChevronUp className="text-[#00FF41] flex-shrink-0" size={24} />
                      ) : (
                        <ChevronDown className="text-[#00FF41] flex-shrink-0" size={24} />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#0D1117] border-x border-b border-[rgba(0,255,65,0.2)] rounded-b-xl px-6 pb-6"
                      >
                        <div className="pt-4">
                          <p className="text-[#FFFFFF] leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Showcase Component */}
        <ComponentErrorBoundary>
          <React.Suspense fallback={
            <div className="py-20 bg-[#0D1117] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[rgba(0,255,65,0.3)] rounded-full animate-spin border-t-[#00FF41] mx-auto mb-4"></div>
                <p className="text-[#00FF41]">Loading Integrations...</p>
              </div>
            </div>
          }>
            <IntegrationsShowcase />
          </React.Suspense>
        </ComponentErrorBoundary>

        {/* CTA Section */}
        <section className="py-20 bg-[#0D1117]">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-[#FFFFFF] mb-6 font-rajdhani">
                Ready to Connect Your Stack?
              </h2>
              <p className="text-xl text-[#C9D1D9] mb-8">
                Join thousands of teams who trust SentraTech for seamless integrations
              </p>
              <Link to="/demo-request">
                <Button className="bg-[#00FF41] text-[#0D1117] hover:bg-[#00e83a] font-bold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
                  <span>Get Started Today</span>
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

export default IntegrationsPage;