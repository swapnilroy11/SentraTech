import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ExternalLink, 
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
  const [showCodeExample, setShowCodeExample] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Track page loading
  useEffect(() => {
    console.log('IntegrationsPage: Component mounting');
    setPageLoaded(true);
    return () => {
      console.log('IntegrationsPage: Component unmounting');
    };
  }, []);

  // Cleanup any potential memory leaks
  useEffect(() => {
    return () => {
      // Clear any timeouts, intervals, or event listeners
      setShowCodeExample(false);
    };
  }, []);

  const codeExample = `// Sample API integration - Create contact in Google Sheets backend
const createContact = async (contactData) => {
  try {
    const response = await fetch('/api/demo/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        name: contactData.name,
        email: contactData.email,
        company: contactData.company,
        phone: contactData.phone,
        message: contactData.message
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Contact created:', result.reference_id);
      // Automatically synced to Google Sheets
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Integration error:', error);
    throw error;
  }
};

// Usage example
createContact({
  name: "John Doe",
  email: "john.doe@company.com", 
  company: "Tech Corp",
  phone: "+1234567890",
  message: "Interested in SentraTech integration"
});`;

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

          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
            {[
              { name: 'HubSpot', logo: 'HS', color: '#FF7A59', status: 'Available' },
              { name: 'Salesforce', logo: 'SF', color: '#00A1E0', status: 'Available' },
              { name: 'Zendesk', logo: 'ZD', color: '#03363D', status: 'Available' },
              { name: 'Airtable', logo: 'AT', color: '#18BFFF', status: 'Available' },
              { name: 'Twilio', logo: 'TW', color: '#F22F46', status: 'Available' },
              { name: 'Tableau', logo: 'TB', color: '#E97627', status: 'Coming Soon' }
            ].map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group text-center"
              >
                <div 
                  className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-lg mb-2 group-hover:scale-110 transition-transform duration-300 ${
                    integration.status === 'Coming Soon' ? 'opacity-50' : ''
                  }`}
                  style={{ backgroundColor: integration.color }}
                >
                  {integration.logo}
                </div>
                <p className="text-sm text-[rgb(161,161,170)] group-hover:text-white transition-colors">
                  {integration.name}
                </p>
                {integration.status === 'Coming Soon' && (
                  <p className="text-xs text-yellow-500 mt-1">Coming Soon</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Code className="text-[#00FF41]" size={48} />
              <h2 className="text-4xl font-bold text-white font-rajdhani">
                API Integration Example
              </h2>
            </div>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              See how easy it is to integrate SentraTech with your backend systems
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-[rgb(17,17,19)] border border-[rgba(0,255,65,0.2)]">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-[rgb(161,161,170)] text-sm">
                        google-sheets-integration.js
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCodeExample(!showCodeExample)}
                      className="border-[rgba(0,255,65,0.3)] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)]"
                    >
                      {showCodeExample ? 'Hide Code' : 'Show Code'}
                    </Button>
                  </div>
                  
                  {showCodeExample && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <pre className="p-6 overflow-x-auto text-sm">
                        <code className="text-[#e2e8f0] whitespace-pre">
                          {codeExample}
                        </code>
                      </pre>
                    </motion.div>
                  )}
                  
                  <div className="p-6 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(0,255,65,0.02)]">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                      <div>
                        <h3 className="text-white font-semibold mb-2">
                          Try the API Integration
                        </h3>
                        <p className="text-[rgb(161,161,170)] text-sm">
                          Test our Google Sheets backend integration with live data
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          className="border-[rgba(0,255,65,0.3)] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)]"
                          onClick={() => window.open('https://codesandbox.io', '_blank')}
                        >
                          <ExternalLink size={16} className="mr-2" />
                          CodeSandbox Demo
                        </Button>
                        <Link to="/demo-request">
                          <Button className="bg-[#00FF41] text-black hover:bg-[#00e83a]">
                            <Play size={16} className="mr-2" />
                            Try Live API
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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