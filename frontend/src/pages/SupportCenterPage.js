import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Search, MessageCircle, Phone, Mail, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const SupportCenterPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supportChannels = [
    {
      title: 'Live Chat Support',
      description: '24/7 instant support for technical questions and platform guidance',
      availability: 'Available 24/7',
      responseTime: 'Average: 30 seconds',
      icon: MessageCircle,
      action: 'Start Chat',
      color: 'bg-[#00FF41]',
      href: '#chat'
    },
    {
      title: 'Phone Support',
      description: 'Direct phone support for enterprise customers and urgent issues',
      availability: 'Business hours globally',
      responseTime: 'Average: 2 minutes',
      icon: Phone,
      action: 'Call Now',
      color: 'bg-blue-600',
      href: 'tel:+447424293951'
    },
    {
      title: 'Email Support',
      description: 'Detailed technical support and account assistance via email',
      availability: '24/7 ticket submission',
      responseTime: 'Average: 4 hours',
      icon: Mail,
      action: 'Send Email',
      color: 'bg-purple-600',
      href: 'mailto:info@sentratech.net'
    }
  ];

  const quickActions = [
    {
      title: 'Getting Started Guide',
      description: 'Complete setup and onboarding documentation',
      icon: Book,
      category: 'getting-started',
      href: '#getting-started'
    },
    {
      title: 'API Documentation',
      description: 'Developer guides and API reference materials',
      icon: FileText,
      category: 'technical',
      href: '#api-docs'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all features',
      icon: Video,
      category: 'tutorials',
      href: '#tutorials'
    },
    {
      title: 'System Status',
      description: 'Real-time platform status and incident reports',
      icon: Zap,
      category: 'status',
      href: '#status'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and share best practices',
      icon: Users,
      category: 'community',
      href: '#community'
    },
    {
      title: 'Training Resources',
      description: 'Certification programs and advanced training materials',
      icon: Globe,
      category: 'training',
      href: '#training'
    }
  ];

  const faqCategories = [
    { id: 'all', name: 'All Topics', count: 47 },
    { id: 'getting-started', name: 'Getting Started', count: 12 },
    { id: 'billing', name: 'Billing & Plans', count: 8 },
    { id: 'integrations', name: 'Integrations', count: 15 },
    { id: 'ai-features', name: 'AI Features', count: 9 },
    { id: 'security', name: 'Security & Privacy', count: 6 }
  ];

  const frequentQuestions = [
    {
      category: 'getting-started',
      question: 'How do I set up my first AI-powered chatbot?',
      answer: 'Setting up your first chatbot takes just 5 minutes. Navigate to the AI Assistant section, click "Create New Bot," and follow our guided setup wizard. You can customize responses, set up triggers, and connect to your existing systems.',
      popularity: 'Very Popular'
    },
    {
      category: 'billing',
      question: 'Can I upgrade or downgrade my plan at any time?',
      answer: 'Yes, you can change your plan anytime from your account settings. Upgrades are effective immediately, while downgrades take effect at your next billing cycle. Contact support for enterprise custom plans.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'Which CRM and helpdesk platforms do you integrate with?',
      answer: 'SentraTech integrates with 50+ platforms including Salesforce, HubSpot, Zendesk, Intercom, Freshworks, ServiceNow, and more. View our complete integration directory or request a custom integration.',
      popularity: 'Very Popular'
    },
    {
      category: 'ai-features',
      question: 'How accurate is the AI sentiment analysis?',
      answer: 'Our AI sentiment analysis achieves 94% accuracy across multiple languages. It analyzes tone, emotion, and urgency to help prioritize customer interactions and route them to appropriate team members.',
      popularity: 'Popular'
    },
    {
      category: 'security',
      question: 'What security certifications does SentraTech have?',
      answer: 'SentraTech is SOC 2 Type II certified, GDPR compliant, and follows ISO 27001 security standards. All data is encrypted at rest and in transit with enterprise-grade security measures.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'How long does implementation typically take?',
      answer: 'Most customers are up and running within 24-48 hours. Enterprise implementations with custom integrations typically take 1-2 weeks. Our Customer Success team provides white-glove onboarding support.',
      popularity: 'Very Popular'
    },
    {
      category: 'billing',
      question: 'Do you offer custom pricing for enterprise customers?',
      answer: 'Yes, we offer flexible enterprise pricing based on your specific needs, volume, and integration requirements. Contact our sales team for a custom quote tailored to your organization.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'Can I use SentraTech with my existing phone system?',
      answer: 'Absolutely! SentraTech integrates with major phone systems including Twilio, RingCentral, 8x8, and traditional PBX systems through our Voice API. Set up call routing and AI-powered call analysis.',
      popularity: 'Popular'
    }
  ];

  const supportTiers = [
    {
      tier: 'Tier 1: Self-Service',
      description: 'Comprehensive knowledge base, tutorials, and community support',
      features: [
        'Knowledge base with 500+ articles',
        'Video tutorial library',
        'Community forum access',
        'Email ticket submission'
      ],
      availability: '24/7',
      audience: 'All customers'
    },
    {
      tier: 'Tier 2: Standard Support',
      description: 'Live chat and email support with technical specialists',
      features: [
        'Live chat support (24/7)',
        'Email support with 4-hour SLA',
        'Phone support (business hours)',
        'Integration assistance'
      ],
      availability: '24/7 chat, business hours phone',
      audience: 'Growth & Enterprise customers'
    },
    {
      tier: 'Tier 3: Premium Support',
      description: 'Dedicated success manager and proactive support',
      features: [
        'Dedicated Customer Success Manager',
        '1-hour email response SLA',
        'Priority phone support',
        'Custom training sessions',
        'Quarterly business reviews'
      ],
      availability: 'Priority 24/7 access',
      audience: 'Enterprise customers only'
    }
  ];

  const filteredQuestions = selectedCategory === 'all' 
    ? frequentQuestions 
    : frequentQuestions.filter(q => q.category === selectedCategory);

  const filteredActions = searchQuery 
    ? quickActions.filter(action => 
        action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quickActions;

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white">
      <SEOManager 
        title="Support Center | SentraTech - Get Help & Technical Support"
        description="Access SentraTech's comprehensive support center with 24/7 live chat, documentation, tutorials, and expert technical assistance."
        keywords="SentraTech support, technical help, customer service, AI platform support, live chat"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-[#00FF41] hover:text-[#00DD38] transition-colors mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Support Center
            </h1>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto leading-relaxed mb-8">
              Get the help you need to maximize your SentraTech experience. Our support team is available 24/7 
              with comprehensive resources, expert guidance, and proactive assistance.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)]" />
              <input
                type="text"
                placeholder="Search for help articles, guides, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl pl-12 pr-4 py-4 text-white placeholder-[rgb(161,161,170)] focus:border-[#00FF41]/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Contact Our Support Team</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Multiple ways to get help when you need it most. Our support team is standing by to assist you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8 hover:border-[#00FF41]/30 transition-all duration-300">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${channel.color} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{channel.title}</h3>
                    <p className="text-[rgb(218,218,218)] text-sm mb-4 leading-relaxed">
                      {channel.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-[rgb(161,161,170)]">Availability:</span>
                        <span className="text-[#00FF41]">{channel.availability}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[rgb(161,161,170)]">Response Time:</span>
                        <span className="text-[#00FF41]">{channel.responseTime}</span>
                      </div>
                    </div>
                    <a
                      href={channel.href}
                      className="inline-block w-full px-6 py-3 bg-[#00FF41] text-black font-semibold rounded-xl hover:bg-[#00DD38] transition-colors duration-200"
                    >
                      {channel.action}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Popular Resources</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Quick access to the most commonly requested help topics and resources.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.href}
                  className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-6 hover:border-[#00FF41]/30 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#00FF41]/20">
                      <Icon size={24} className="text-[#00FF41]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                  </div>
                  <p className="text-[rgb(218,218,218)] text-sm leading-relaxed">
                    {action.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Support Tiers */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Support Tiers</h2>
            <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Our tiered support model ensures you get the right level of assistance for your needs, 
              from self-service resources to dedicated enterprise support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {supportTiers.map((tier, index) => (
              <div key={index} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-[#00FF41] font-bold text-lg">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{tier.tier}</h3>
                  <p className="text-[rgb(161,161,170)] text-sm">{tier.audience}</p>
                </div>
                
                <p className="text-[rgb(218,218,218)] text-sm mb-6 leading-relaxed">
                  {tier.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center text-sm">
                      <CheckCircle size={16} className="text-[#00FF41] mr-2 flex-shrink-0" />
                      <span className="text-[rgb(218,218,218)]">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-[rgb(18,18,18)] border border-[#00FF41]/20 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[rgb(161,161,170)] text-xs">Availability:</span>
                    <span className="text-[#00FF41] text-xs font-semibold">{tier.availability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Find answers to the most common questions about SentraTech's platform, features, and services.
            </p>
          </div>
          
          {/* FAQ Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#00FF41] text-black'
                    : 'bg-[rgb(38,40,42)] text-[rgb(218,218,218)] hover:bg-[rgb(63,63,63)]'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredQuestions.map((faq, index) => (
              <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <div className="flex items-center space-x-2">
                    {faq.popularity === 'Very Popular' && (
                      <span className="bg-[#00FF41]/20 text-[#00FF41] px-2 py-1 rounded text-xs font-medium">
                        Popular
                      </span>
                    )}
                    <HelpCircle size={20} className="text-[#00FF41] flex-shrink-0" />
                  </div>
                </div>
                <p className="text-[rgb(218,218,218)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Support */}
        <div className="text-center bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-600/30 rounded-2xl p-8">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Need Urgent Help?</h2>
          <p className="text-[rgb(161,161,170)] mb-6 max-w-2xl mx-auto">
            For critical issues affecting your production environment or urgent security concerns, 
            contact our emergency support line immediately.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[rgb(18,18,18)] border border-red-600/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Emergency Hotline</h3>
              <p className="text-red-400 font-bold text-xl mb-1">+44 7424 293 951</p>
              <p className="text-[rgb(161,161,170)] text-sm">Available 24/7 for critical issues</p>
            </div>
            
            <div className="bg-[rgb(18,18,18)] border border-red-600/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Priority Email</h3>
              <p className="text-red-400 font-bold text-xl mb-1">urgent@sentratech.net</p>
              <p className="text-[rgb(161,161,170)] text-sm">15-minute response SLA</p>
            </div>
          </div>
          
          <p className="text-[rgb(161,161,170)] text-sm">
            Emergency support is available to all customers for critical system outages, security incidents, 
            and data loss situations. Please use regular support channels for non-urgent issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportCenterPage;