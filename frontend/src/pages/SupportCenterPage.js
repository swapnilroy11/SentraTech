import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Search, MessageCircle, Phone, Mail, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const SupportCenterPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const faqSectionRef = useRef(null);
  const faqContainerRef = useRef(null);

  // Memoized support channels for performance
  const supportChannels = useMemo(() => [
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
  ], []);

  // Updated FAQ categories with correct counts
  const faqCategories = useMemo(() => [
    { id: 'all', name: 'All Topics', count: 50 },
    { id: 'getting-started', name: 'Getting Started', count: 12 },
    { id: 'billing', name: 'Billing & Plans', count: 8 },
    { id: 'integrations', name: 'Integrations', count: 15 },
    { id: 'ai-features', name: 'AI Features', count: 9 },
    { id: 'security', name: 'Security & Privacy', count: 6 }
  ], []);

  // Comprehensive FAQ questions based on market research
  const frequentQuestions = useMemo(() => [
    // Getting Started (12 questions)
    {
      category: 'getting-started',
      question: 'How do I set up my first AI-powered chatbot?',
      answer: 'Setting up your first chatbot takes just 5 minutes. Navigate to the AI Assistant section, click "Create New Bot," and follow our guided setup wizard. You can customize responses, set up triggers, and connect to your existing systems.',
      popularity: 'Very Popular'
    },
    {
      category: 'getting-started',
      question: 'How long does implementation typically take?',
      answer: 'Most customers are up and running within 24-48 hours. Enterprise implementations with custom integrations typically take 1-2 weeks. Our Customer Success team provides white-glove onboarding support.',
      popularity: 'Very Popular'
    },
    {
      category: 'getting-started',
      question: 'Do I need technical expertise to use SentraTech?',
      answer: 'No coding required! Our platform is designed for non-technical users with drag-and-drop interfaces and pre-built templates. However, we also offer APIs for developers who want advanced customization.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'What information do I need to prepare before setup?',
      answer: 'Prepare your common customer questions, preferred tone of voice, business hours, and any existing knowledge base content. Our setup wizard will guide you through importing this information.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'Can I migrate data from my current support platform?',
      answer: 'Yes, we support data migration from 50+ platforms including Zendesk, Intercom, Freshdesk, and more. Our migration team handles the process with zero downtime.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'How do I train the AI to understand my business?',
      answer: 'Upload your existing help articles, product documentation, and FAQ content. The AI learns from your knowledge base and improves over time with customer interactions.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'What happens during the free trial period?',
      answer: 'Your 14-day free trial includes full access to all features, setup assistance, and up to 1,000 AI interactions. No credit card required to start.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'How do I add team members to my account?',
      answer: 'Go to Team Settings, click "Invite Member," enter their email and role. They will receive an invitation with setup instructions. You can set different permission levels.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'Can I customize the chatbot appearance?',
      answer: 'Absolutely! Customize colors, fonts, avatar, welcome messages, and position. Match your brand perfectly with our visual editor or CSS customization options.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'What languages does SentraTech support?',
      answer: 'We support 95+ languages with automatic translation capabilities. The AI can detect customer language and respond appropriately in their preferred language.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'How do I set up business hours and offline messages?',
      answer: 'Configure business hours in Settings > Availability. Set custom offline messages, automated responses, and escalation rules for after-hours inquiries.',
      popularity: 'Popular'
    },
    {
      category: 'getting-started',
      question: 'What support do you provide during onboarding?',
      answer: 'All customers receive onboarding support including setup calls, training sessions, best practices guide, and dedicated success manager contact for the first 30 days.',
      popularity: 'Popular'
    },

    // Billing & Plans (8 questions)
    {
      category: 'billing',
      question: 'Can I upgrade or downgrade my plan at any time?',
      answer: 'Yes, you can change your plan anytime from your account settings. Upgrades are effective immediately, while downgrades take effect at your next billing cycle. Contact support for enterprise custom plans.',
      popularity: 'Popular'
    },
    {
      category: 'billing',
      question: 'Do you offer custom pricing for enterprise customers?',
      answer: 'Yes, we offer flexible enterprise pricing based on your specific needs, volume, and integration requirements. Contact our sales team for a custom quote tailored to your organization.',
      popularity: 'Popular'
    },
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, bank transfers, and purchase orders for enterprise accounts. All transactions are secured with enterprise-grade encryption.',
      popularity: 'Popular'
    },
    {
      category: 'billing',
      question: 'Is there a setup fee or long-term contract required?',
      answer: 'No setup fees for standard plans. Monthly plans have no long-term commitment. Annual plans offer 20% savings. Enterprise contracts are flexible based on your needs.',
      popularity: 'Popular'
    },
    {
      category: 'billing',
      question: 'What happens if I exceed my plan limits?',
      answer: 'You will receive notifications at 80% and 95% usage. Overage charges apply at $0.10 per conversation above your limit, or you can upgrade your plan for better rates.',
      popularity: 'Popular'
    },
    {
      category: 'billing',
      question: 'Do you offer refunds or money-back guarantees?',
      answer: 'We offer a 30-day money-back guarantee for annual plans. Monthly subscriptions can be cancelled anytime without penalty. Enterprise customers have custom terms.',
      popularity: 'Popular'
    },
    {
      category: 'billing',
      question: 'How is usage calculated for billing purposes?',
      answer: 'Usage is based on unique conversations per month. A conversation includes all interactions with one customer within 24 hours. AI responses, human agent messages, and escalations count as one conversation.',
      popularity: 'Popular'
    },
    {
      category: 'billing',
      question: 'Can I get volume discounts for multiple brands or locations?',
      answer: 'Yes, we offer volume discounts starting at 5+ accounts. Multi-location businesses receive additional savings. Contact sales for consolidated billing and management options.',
      popularity: 'Popular'
    },

    // Integrations (15 questions)
    {
      category: 'integrations',
      question: 'Which CRM and helpdesk platforms do you integrate with?',
      answer: 'SentraTech integrates with 50+ platforms including Salesforce, HubSpot, Zendesk, Intercom, Freshworks, ServiceNow, and more. View our complete integration directory or request a custom integration.',
      popularity: 'Very Popular'
    },
    {
      category: 'integrations',
      question: 'Can I use SentraTech with my existing phone system?',
      answer: 'Absolutely! SentraTech integrates with major phone systems including Twilio, RingCentral, 8x8, and traditional PBX systems through our Voice API. Set up call routing and AI-powered call analysis.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'How do I integrate with my e-commerce platform?',
      answer: 'We provide native integrations with Shopify, WooCommerce, Magento, BigCommerce, and others. Access order history, inventory status, and customer data for personalized support.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'Can SentraTech integrate with social media channels?',
      answer: 'Yes, we support Facebook Messenger, WhatsApp Business, Twitter DMs, Instagram Direct, LinkedIn messaging, and Telegram. Manage all channels from one unified inbox.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'How do I set up Slack or Microsoft Teams integration?',
      answer: 'Install our Slack/Teams app from the marketplace, authorize permissions, and configure notification preferences. Receive alerts for escalations, new tickets, and urgent issues.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'Does SentraTech work with email providers like Gmail and Outlook?',
      answer: 'Yes, we integrate with Gmail, Outlook, Office 365, and other email providers. Automatically convert emails to tickets and track responses within our platform.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'Can I integrate with my knowledge base or documentation system?',
      answer: 'Connect with Confluence, Notion, GitBook, Zendesk Guide, and other knowledge bases. The AI automatically references your documentation to provide accurate answers.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'How do I connect my analytics tools?',
      answer: 'Integrate with Google Analytics, Mixpanel, Amplitude, and Segment to track customer support metrics alongside your business KPIs. Custom dashboard available.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'What APIs are available for custom integrations?',
      answer: 'We offer RESTful APIs, webhooks, and GraphQL endpoints for custom integrations. Access real-time data, trigger actions, and build custom workflows with comprehensive documentation.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'Can I integrate with payment processing systems?',
      answer: 'Yes, connect with Stripe, PayPal, Square, and other payment processors to handle billing inquiries, process refunds, and access transaction history directly in chat.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'How do I set up website chat widget integration?',
      answer: 'Copy our JavaScript snippet and paste it before the closing </body> tag. Customize appearance, position, and behavior through our visual editor. Works with all major website platforms.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'Does SentraTech integrate with project management tools?',
      answer: 'Integrate with Jira, Asana, Trello, Monday.com, and ClickUp to automatically create tickets, track progress, and update customers on issue resolution status.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'Can I connect SentraTech to my mobile app?',
      answer: 'Yes, use our mobile SDKs for iOS and Android to embed chat functionality. React Native and Flutter libraries available with full customization options.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'How do I integrate with my existing user authentication system?',
      answer: 'Support for SSO, SAML, OAuth, and LDAP integration. Automatically authenticate users and access their account information for personalized support experiences.',
      popularity: 'Popular'
    },
    {
      category: 'integrations',
      question: 'What data synchronization options are available?',
      answer: 'Real-time sync via webhooks, scheduled batch updates, or manual data imports. Choose the method that works best for your technical requirements and data volume.',
      popularity: 'Popular'
    },

    // AI Features (9 questions)
    {
      category: 'ai-features',
      question: 'How accurate is the AI sentiment analysis?',
      answer: 'Our AI sentiment analysis achieves 94% accuracy across multiple languages. It analyzes tone, emotion, and urgency to help prioritize customer interactions and route them to appropriate team members.',
      popularity: 'Popular'
    },
    {
      category: 'ai-features',
      question: 'Can the AI handle complex, multi-step customer issues?',
      answer: 'Yes, our AI uses advanced conversation memory and context understanding to handle complex workflows, multi-part questions, and maintain conversation context across multiple interactions.',
      popularity: 'Popular'
    },
    {
      category: 'ai-features',
      question: 'How does the AI learn and improve over time?',
      answer: 'The AI continuously learns from customer interactions, feedback, and agent corrections. Machine learning algorithms improve response accuracy and identify knowledge gaps automatically.',
      popularity: 'Popular'
    },
    {
      category: 'ai-features',
      question: 'What happens when the AI cannot answer a question?',
      answer: 'When confidence is low, the AI gracefully escalates to human agents, provides alternative resources, or asks clarifying questions. Smart escalation rules ensure customers always get help.',
      popularity: 'Popular'
    },
    {
      category: 'ai-features',
      question: 'Can I customize AI responses and personality?',
      answer: 'Absolutely! Customize tone, personality, response style, and brand voice. Create custom intents, train domain-specific responses, and set conversation flows that match your business.',
      popularity: 'Popular'
    },
    {
      category: 'ai-features',
      question: 'How does the AI understand context across different languages?',
      answer: 'Our multilingual AI maintains context across language switches, understands cultural nuances, and provides culturally appropriate responses in 95+ languages with native-level understanding.',
      popularity: 'Popular'
    },
    {
      category: 'ai-features',
      question: 'What AI analytics and insights are available?',
      answer: 'Comprehensive AI analytics including response accuracy, conversation success rates, sentiment trends, topic analysis, and performance optimization recommendations.',
      popularity: 'Popular'
    },
    {
      category: 'ai-features',
      question: 'Can the AI handle industry-specific terminology?',
      answer: 'Yes, the AI can be trained on your industry vocabulary, technical terms, product names, and company-specific language to provide accurate, contextual responses.',
      popularity: 'Popular'
    },
    {
      category: 'ai-features',
      question: 'How do I set up AI handoff rules to human agents?',
      answer: 'Configure smart escalation based on conversation complexity, customer sentiment, specific keywords, or time thresholds. Set different rules for different customer segments or issue types.',
      popularity: 'Popular'
    },

    // Security & Privacy (6 questions)  
    {
      category: 'security',
      question: 'What security certifications does SentraTech have?',
      answer: 'SentraTech is SOC 2 Type II certified, GDPR compliant, and follows ISO 27001 security standards. All data is encrypted at rest and in transit with enterprise-grade security measures.',
      popularity: 'Popular'
    },
    {
      category: 'security',
      question: 'How do you handle data privacy and GDPR compliance?',
      answer: 'We are fully GDPR, CCPA, and PIPEDA compliant. Customer data is processed lawfully, stored securely, and customers have full control over their data with right to deletion and portability.',
      popularity: 'Popular'
    },
    {
      category: 'security',
      question: 'Where is customer data stored and processed?',
      answer: 'Data is stored in secure, certified data centers with options for regional data residency in US, EU, Canada, and Australia. You can choose your preferred data location for compliance.',
      popularity: 'Popular'
    },
    {
      category: 'security',
      question: 'What access controls and user permissions are available?',
      answer: 'Role-based access control with granular permissions, single sign-on (SSO), two-factor authentication, session management, and detailed audit logs for all user activities.',
      popularity: 'Popular'
    },
    {
      category: 'security',
      question: 'How do you protect against data breaches and cyber attacks?',
      answer: 'Multi-layered security including DDoS protection, intrusion detection, regular penetration testing, vulnerability assessments, and 24/7 security monitoring by certified experts.',
      popularity: 'Popular'
    },
    {
      category: 'security',
      question: 'Can I export or delete my data at any time?',
      answer: 'Yes, you have complete data portability. Export all your data in standard formats anytime, or request complete deletion within 30 days of account closure per GDPR requirements.',
      popularity: 'Popular'
    }
  ], []);

  // Performance optimization with memoized values
  const filteredQuestions = useMemo(() => {
    return selectedCategory === 'all' 
      ? frequentQuestions 
      : frequentQuestions.filter(q => q.category === selectedCategory);
  }, [selectedCategory, frequentQuestions]);

  // Support tiers data - memoized for performance
  const supportTiers = useMemo(() => [
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
  ], []);

  // Optimized navigation handlers
  const handleBackNavigation = useCallback(() => {
    navigate('/', { replace: false });
  }, [navigate]);

  const handleCategoryChange = useCallback((categoryId) => {
    if (isTransitioning) return;
    
    // Simple, reliable approach: maintain scroll position using the FAQ section as anchor
    const faqSection = faqSectionRef.current;
    if (faqSection) {
      // Get the FAQ section's current position on screen
      const rect = faqSection.getBoundingClientRect();
      const scrollY = window.pageYOffset;
      const faqSectionY = scrollY + rect.top;
      
      // Change category immediately
      setSelectedCategory(categoryId);
      
      // After React renders, restore the FAQ section to its original position
      requestAnimationFrame(() => {
        const newScrollY = window.pageYOffset;
        const newRect = faqSection.getBoundingClientRect();
        const newFaqSectionY = newScrollY + newRect.top;
        
        // Calculate how much the FAQ section moved and compensate
        const deltaY = newFaqSectionY - faqSectionY;
        if (Math.abs(deltaY) > 2) { // Only adjust if there's a meaningful difference
          window.scrollTo(0, newScrollY - deltaY);
        }
      });
    } else {
      setSelectedCategory(categoryId);
    }
  }, [isTransitioning]);

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white scroll-smooth">
      <SEOManager 
        title="Support Center | SentraTech - Get Help & Technical Support"
        description="Access SentraTech's comprehensive support center with 24/7 live chat, documentation, tutorials, and expert technical assistance."
        keywords="SentraTech support, technical help, customer service, AI platform support, live chat"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16">
          <button
            onClick={handleBackNavigation}
            className="flex items-center text-[#00FF41] hover:text-[#00DD38] transition-colors duration-200 mb-6 focus:outline-none focus:ring-2 focus:ring-[#00FF41]/50 rounded-lg p-2 will-change-transform"
            aria-label="Back to Home"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Support Center
            </h1>
            <p className="text-lg md:text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto leading-relaxed mb-8">
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
                className="w-full bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl pl-12 pr-4 py-4 text-white placeholder-[rgb(161,161,170)] focus:border-[#00FF41]/50 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Support Channels - Optimized */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Contact Our Support Team</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Multiple ways to get help when you need it most. Our support team is standing by to assist you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div key={`channel-${index}`} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-6 md:p-8 hover:border-[#00FF41]/30 transition-all duration-300 will-change-transform">
                  <div className="text-center">
                    <div className={`w-12 h-12 md:w-16 md:h-16 ${channel.color} rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center`}>
                      <Icon size={24} className="text-white md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">{channel.title}</h3>
                    <p className="text-[rgb(218,218,218)] text-sm mb-4 leading-relaxed">
                      {channel.description}
                    </p>
                    <div className="space-y-2 mb-4 md:mb-6">
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
                      className="inline-block w-full px-4 py-3 bg-[#00FF41] text-black font-semibold rounded-xl hover:bg-[#00DD38] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00FF41]/50"
                    >
                      {channel.action}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Tiers - Optimized */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Support Tiers</h2>
            <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Our tiered support model ensures you get the right level of assistance for your needs, 
              from self-service resources to dedicated enterprise support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {supportTiers.map((tier, index) => (
              <div key={`tier-${index}`} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6 md:p-8 will-change-transform">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-[#00FF41] font-bold text-base md:text-lg">{index + 1}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2">{tier.tier}</h3>
                  <p className="text-[rgb(161,161,170)] text-sm">{tier.audience}</p>
                </div>
                
                <p className="text-[rgb(218,218,218)] text-sm mb-6 leading-relaxed">
                  {tier.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, fIndex) => (
                    <div key={`feature-${index}-${fIndex}`} className="flex items-center text-sm">
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

        {/* FAQ Section - Enhanced with Stable Layout */}
        <div ref={faqSectionRef} className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Find answers to the most common questions about SentraTech's platform, features, and services.
            </p>
          </div>
          
          {/* FAQ Categories - Simplified */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#00FF41] text-black'
                    : 'bg-[rgb(38,40,42)] text-[rgb(218,218,218)] hover:bg-[rgb(63,63,63)]'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
          
          {/* FAQ Items Container - Simplified */}
          <div ref={faqContainerRef} className="min-h-[600px]">
            <div className="space-y-4">
              {filteredQuestions.map((faq, index) => (
                <div 
                  key={`faq-${selectedCategory}-${index}`} 
                  className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-4 md:p-6 hover:border-[#00FF41]/30 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base md:text-lg font-semibold text-white pr-4 leading-tight">{faq.question}</h3>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {faq.popularity === 'Very Popular' && (
                        <span className="bg-[#00FF41]/20 text-[#00FF41] px-2 py-1 rounded text-xs font-medium">
                          Popular
                        </span>
                      )}
                      <HelpCircle size={18} className="text-[#00FF41] md:w-5 md:h-5" />
                    </div>
                  </div>
                  <p className="text-[rgb(218,218,218)] text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Support - Optimized */}
        <div className="text-center bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-600/30 rounded-2xl p-6 md:p-8">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4 md:mb-6 md:w-12 md:h-12" />
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Need Urgent Help?</h2>
          <p className="text-[rgb(161,161,170)] mb-6 max-w-2xl mx-auto text-sm md:text-base">
            For critical issues affecting your production environment or urgent security concerns, 
            contact our emergency support line immediately.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="bg-[rgb(18,18,18)] border border-red-600/30 rounded-xl p-4">
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Emergency Hotline</h3>
              <p className="text-red-400 font-bold text-lg md:text-xl mb-1">+44 7424 293 951</p>
              <p className="text-[rgb(161,161,170)] text-xs md:text-sm">Available 24/7 for critical issues</p>
            </div>
            
            <div className="bg-[rgb(18,18,18)] border border-red-600/30 rounded-xl p-4">
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Priority Email</h3>
              <p className="text-red-400 font-bold text-lg md:text-xl mb-1">urgent@sentratech.net</p>
              <p className="text-[rgb(161,161,170)] text-xs md:text-sm">15-minute response SLA</p>
            </div>
          </div>
          
          <p className="text-[rgb(161,161,170)] text-xs md:text-sm">
            Emergency support is available to all customers for critical system outages, security incidents, 
            and data loss situations. Please use regular support channels for non-urgent issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportCenterPage;