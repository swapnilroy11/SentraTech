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
      <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA]" style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-20 right-4 z-50 bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] rounded p-2 text-xs text-[#00FF41]">
            Integrations Page Loaded: {pageLoaded ? 'Yes' : 'No'}
          </div>
        )}
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
              Platform <span className="text-[#00FF41]">Integrations</span>
            </h1>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect SentraTech seamlessly with your existing tech stack. 50+ pre-built integrations 
              with popular CRM, communication, analytics, and support tools.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              {[
                { value: '50+', label: 'Available Integrations' },
                { value: '5 min', label: 'Average Setup Time' },
                { value: '99.9%', label: 'Integration Uptime' },
                { value: '24/7', label: 'API Monitoring' }
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

      {/* Logo Carousel Section */}
      <section className="py-16 bg-gradient-to-r from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4 font-rajdhani">
              Trusted Integrations
            </h2>
            <p className="text-[rgb(161,161,170)]">
              Connect with the tools your team already uses
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
            {[
              { 
                name: 'HubSpot', 
                logo: 'HS', 
                color: '#FF7A59', 
                status: 'Available',
                description: 'Sync contacts in minutes',
                setupTime: '10 min',
                adoption: '88%'
              },
              { 
                name: 'Salesforce', 
                logo: 'SF', 
                color: '#00A1E0', 
                status: 'Available',
                description: 'CRM integration made easy',
                setupTime: '15 min',
                adoption: '95%'
              },
              { 
                name: 'Zendesk', 
                logo: 'ZD', 
                color: '#03363D', 
                status: 'Available',
                description: 'Migrate tickets seamlessly',
                setupTime: '45 min',
                adoption: '80%'
              },
              { 
                name: 'Airtable', 
                logo: 'AT', 
                color: '#18BFFF', 
                status: 'Available',
                description: 'Database sync in real-time',
                setupTime: '8 min',
                adoption: '72%'
              },
              { 
                name: 'Twilio', 
                logo: 'TW', 
                color: '#F22F46', 
                status: 'Available',
                description: 'SMS & voice integration',
                setupTime: '12 min',
                adoption: '85%'
              },
              { 
                name: 'Tableau', 
                logo: 'TB', 
                color: '#E97627', 
                status: 'Coming Soon',
                description: 'Advanced analytics dashboard',
                setupTime: '30 min',
                adoption: '88%'
              }
            ].map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group text-center relative"
              >
                <div className="relative overflow-hidden rounded-xl bg-[rgba(0,0,0,0.3)] p-4 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,255,65,0.3)] transition-all duration-300">
                  <div 
                    className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-lg mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 ${
                      integration.status === 'Coming Soon' ? 'opacity-50' : ''
                    }`}
                    style={{ backgroundColor: integration.color }}
                  >
                    {integration.logo}
                  </div>
                  
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#00FF41] transition-colors mb-1">
                    {integration.name}
                  </h3>
                  
                  <p className="text-xs text-[rgb(161,161,170)] mb-3 leading-relaxed">
                    {integration.description}
                  </p>
                  
                  {/* Hover Stats */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-[rgb(161,161,170)]">Setup:</span>
                      <span className="text-[#00FF41] font-medium">{integration.setupTime}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[rgb(161,161,170)]">Adoption:</span>
                      <span className="text-[#00FF41] font-medium">{integration.adoption}</span>
                    </div>
                  </div>
                  
                  {integration.status === 'Coming Soon' && (
                    <p className="text-xs text-yellow-500 mb-2">Coming Soon</p>
                  )}
                  
                  {/* Learn More Link */}
                  <Link 
                    to={`/integrations/${integration.name.toLowerCase()}`}
                    className="inline-flex items-center text-xs text-[#00FF41] hover:text-white transition-colors opacity-0 group-hover:opacity-100 duration-300"
                  >
                    Learn More
                    <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Integrations Showcase Component */}
      <ComponentErrorBoundary>
        <React.Suspense fallback={
          <div className="py-20 bg-[#0A0A0A] flex items-center justify-center">
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
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-rajdhani">
              Enterprise Security You Can Trust
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] mb-8">
              Discover our comprehensive security measures and compliance certifications
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

export default IntegrationsPage;