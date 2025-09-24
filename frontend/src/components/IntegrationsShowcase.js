import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Database, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Shield,
  Globe,
  Smartphone,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const IntegrationsShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const integrationCategories = [
    { id: 'all', name: 'All Integrations', icon: Globe },
    { id: 'crm', name: 'CRM & Sales', icon: Users },
    { id: 'communication', name: 'Communication', icon: MessageSquare },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'support', name: 'Support Tools', icon: Shield }
  ];

  const integrations = [
    // CRM & Sales
    {
      id: 1,
      name: 'Salesforce',
      category: 'crm',
      description: 'Sync customer data and support interactions with Salesforce CRM for unified customer view.',
      logo: 'SF',
      color: '#00A1E0',
      status: 'available',
      features: ['Contact sync', 'Case management', 'Activity tracking', 'Custom fields'],
      setupTime: '15 minutes',
      popularity: 95
    },
    {
      id: 2,
      name: 'HubSpot',
      category: 'crm',
      description: 'Connect HubSpot CRM for seamless lead management and customer journey tracking.',
      logo: 'HS',
      color: '#FF7A59',
      status: 'available',
      features: ['Lead scoring', 'Deal pipeline', 'Contact properties', 'Workflow automation'],
      setupTime: '10 minutes',
      popularity: 88
    },
    {
      id: 3,
      name: 'Pipedrive',
      category: 'crm',
      description: 'Integrate sales pipeline data with customer support for complete customer context.',
      logo: 'PD',
      color: '#1A78C2',
      status: 'available',
      features: ['Pipeline sync', 'Deal tracking', 'Activity logs', 'Custom stages'],
      setupTime: '12 minutes',
      popularity: 82
    },

    // Communication
    {
      id: 4,
      name: 'Slack',
      category: 'communication',
      description: 'Get real-time alerts and manage support tickets directly from your Slack workspace.',
      logo: 'SL',
      color: '#4A154B',
      status: 'available',
      features: ['Ticket alerts', 'Channel notifications', 'Slash commands', 'Thread updates'],
      setupTime: '5 minutes',
      popularity: 92
    },
    {
      id: 5,
      name: 'Microsoft Teams',
      category: 'communication',
      description: 'Collaborate on support cases and receive notifications in Microsoft Teams.',
      logo: 'MT',
      color: '#6264A7',
      status: 'available',
      features: ['Team notifications', 'Case collaboration', 'File sharing', 'Meeting integration'],
      setupTime: '8 minutes',
      popularity: 85
    },
    {
      id: 6,
      name: 'WhatsApp Business',
      category: 'communication',
      description: 'Provide customer support through WhatsApp with automated responses and routing.',
      logo: 'WA',
      color: '#25D366',
      status: 'available',
      features: ['Message templates', 'Media support', 'Business verification', 'Analytics'],
      setupTime: '20 minutes',
      popularity: 78
    },

    // Analytics
    {
      id: 7,
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Track customer support metrics and user behavior with Google Analytics integration.',
      logo: 'GA',
      color: '#E37400',
      status: 'available',
      features: ['Event tracking', 'Conversion goals', 'Custom dimensions', 'Audience insights'],
      setupTime: '10 minutes',
      popularity: 90
    },
    {
      id: 8,
      name: 'Mixpanel',
      category: 'analytics',
      description: 'Analyze customer support funnel and track user engagement with detailed event analytics.',
      logo: 'MP',
      color: '#7856FF',
      status: 'available',
      features: ['Event analytics', 'Funnel tracking', 'Cohort analysis', 'A/B testing'],
      setupTime: '15 minutes',
      popularity: 75
    },
    {
      id: 9,
      name: 'Tableau',
      category: 'analytics',
      description: 'Create advanced dashboards and visualizations with SentraTech support data.',
      logo: 'TB',
      color: '#E97627',
      status: 'coming-soon',
      features: ['Custom dashboards', 'Data visualization', 'Real-time updates', 'Advanced analytics'],
      setupTime: '30 minutes',
      popularity: 88
    },

    // Support Tools
    {
      id: 10,
      name: 'Zendesk',
      category: 'support',
      description: 'Migrate from Zendesk or integrate existing workflows with SentraTech AI.',
      logo: 'ZD',
      color: '#03363D',
      status: 'available',
      features: ['Ticket migration', 'Agent transfer', 'Custom fields', 'SLA tracking'],
      setupTime: '45 minutes',
      popularity: 80
    },
    {
      id: 11,
      name: 'Intercom',
      category: 'support',
      description: 'Enhance Intercom conversations with AI-powered responses and routing.',
      logo: 'IC',
      color: '#338FFF',
      status: 'available',
      features: ['Conversation sync', 'Auto-responses', 'User data', 'Help center'],
      setupTime: '25 minutes',
      popularity: 77
    },
    {
      id: 12,
      name: 'Freshdesk',
      category: 'support',
      description: 'Integrate Freshdesk tickets with SentraTech AI for enhanced automation.',
      logo: 'FD',
      color: '#2E8B57',
      status: 'coming-soon',
      features: ['Ticket sync', 'Automation rules', 'Agent assistance', 'Reporting'],
      setupTime: '35 minutes',
      popularity: 73
    }
  ];

  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === activeCategory);

  const IntegrationCard = ({ integration }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden hover:border-[rgba(0,255,65,0.3)] transition-all duration-300 h-full">
        <CardContent className="p-6">
          {/* Integration Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: integration.color }}
              >
                {integration.logo}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{integration.name}</h3>
                <div className="flex items-center space-x-2">
                  {integration.status === 'available' ? (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                      <CheckCircle size={12} className="mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30 text-xs">
                      <Clock size={12} className="mr-1" />
                      Coming Soon
                    </Badge>
                  )}
                  <div className="text-xs text-[rgb(161,161,170)]">
                    {integration.popularity}% popularity
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-[rgb(161,161,170)] text-sm leading-relaxed mb-4">
            {integration.description}
          </p>

          {/* Features */}
          <div className="mb-4">
            <h4 className="text-white font-medium text-sm mb-2">Key Features:</h4>
            <div className="space-y-1">
              {integration.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF41] rounded-full"></div>
                  <span className="text-[rgb(218,218,218)] text-xs">{feature}</span>
                </div>
              ))}
              {integration.features.length > 3 && (
                <div className="text-[rgb(161,161,170)] text-xs">
                  +{integration.features.length - 3} more features
                </div>
              )}
            </div>
          </div>

          {/* Setup Time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock size={14} className="text-[#00FF41]" />
              <span className="text-sm text-[rgb(161,161,170)]">Setup: {integration.setupTime}</span>
            </div>
            <div className="text-right">
              <div 
                className="text-2xl font-bold font-rajdhani"
                style={{ color: integration.color }}
              >
                {integration.popularity}%
              </div>
              <div className="text-xs text-[rgb(161,161,170)]">Adoption</div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className={`w-full ${integration.status === 'available' 
              ? 'bg-[#00FF41] text-black hover:bg-[#00e83a]' 
              : 'bg-[rgb(42,42,42)] text-[rgb(161,161,170)] cursor-not-allowed'
            }`}
            disabled={integration.status !== 'available'}
          >
            {integration.status === 'available' ? (
              <>
                <ExternalLink size={16} className="mr-2" />
                Connect Now
              </>
            ) : (
              <>
                <Clock size={16} className="mr-2" />
                Notify Me
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <section id="integrations" className="py-20 bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)] relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-5xl font-bold text-white mb-6 font-rajdhani">
              50+ Platform Integrations
            </h2>
            <p className="text-xl text-[#00FF41] max-w-3xl mx-auto font-medium">
              Connect SentraTech with your existing tech stack seamlessly
            </p>
            <p className="text-[rgb(161,161,170)] max-w-4xl mx-auto text-lg leading-relaxed">
              Pre-built integrations with popular CRM, communication, analytics, and support tools. Set up in minutes, not months.
            </p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {integrationCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-[#00FF41] text-black'
                    : 'bg-[rgb(42,42,42)] text-[rgb(161,161,170)] hover:bg-[rgb(52,52,52)] hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
                <span className="font-medium">{category.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.2)]">
            <div className="text-3xl font-bold text-[#00FF41] mb-2">50+</div>
            <div className="text-[rgb(161,161,170)] text-sm">Available Integrations</div>
          </div>
          <div className="text-center p-6 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.2)]">
            <div className="text-3xl font-bold text-[#00FF41] mb-2">5 min</div>
            <div className="text-[rgb(161,161,170)] text-sm">Average Setup Time</div>
          </div>
          <div className="text-center p-6 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.2)]">
            <div className="text-3xl font-bold text-[#00FF41] mb-2">99.9%</div>
            <div className="text-[rgb(161,161,170)] text-sm">Integration Uptime</div>
          </div>
          <div className="text-center p-6 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.2)]">
            <div className="text-3xl font-bold text-[#00FF41] mb-2">24/7</div>
            <div className="text-[rgb(161,161,170)] text-sm">API Monitoring</div>
          </div>
        </div>

        {/* Integrations Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredIntegrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </motion.div>

        {/* Custom Integration CTA */}
        <div className="text-center">
          <div className="bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.3)] rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Zap className="text-[#00FF41]" size={24} />
              <h3 className="text-2xl font-bold text-white">Need a Custom Integration?</h3>
            </div>
            <p className="text-[rgb(161,161,170)] mb-6 leading-relaxed">
              Don't see your platform? Our API-first architecture supports custom integrations. 
              We'll work with your team to build the perfect connection.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button 
                className="bg-[#00FF41] text-black hover:bg-[#00e83a] px-6"
                onClick={() => {
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Request Custom Integration
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(0,255,65,0.3)] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)]"
              >
                <ExternalLink size={16} className="mr-2" />
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsShowcase;