import React from 'react';
import { ArrowLeft, TrendingUp, FileText, Calendar, Users, Award, Globe, Shield, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const InvestorRelationsPage = () => {
  const navigate = useNavigate();

  const keyMetrics = [
    {
      metric: 'Annual Recurring Revenue (ARR)',
      value: '$25M+',
      growth: '+180% YoY',
      icon: TrendingUp,
      description: 'Strong revenue growth driven by enterprise customer expansion'
    },
    {
      metric: 'Enterprise Customers',
      value: '500+',
      growth: '+220% YoY',
      icon: Users,
      description: 'Fortune 500 and mid-market companies across 50+ countries'
    },
    {
      metric: 'Net Revenue Retention',
      value: '135%',
      growth: 'Industry Leading',
      icon: Target,
      description: 'Exceptional customer expansion and minimal churn rates'
    },
    {
      metric: 'Gross Revenue Margin',
      value: '88%',
      growth: '+5pp YoY',
      icon: Award,
      description: 'Best-in-class SaaS margins with scalable AI infrastructure'
    }
  ];

  const fundingHistory = [
    {
      round: 'Series B',
      amount: '$50M',
      date: 'Q2 2024',
      lead: 'Andreessen Horowitz',
      participants: 'Sequoia Capital, Index Ventures, existing investors',
      valuation: '$400M',
      use: 'Global expansion, AI research, enterprise sales scaling'
    },
    {
      round: 'Series A',
      amount: '$18M',
      date: 'Q1 2023',
      lead: 'Sequoia Capital',
      participants: 'Index Ventures, Bessemer Venture Partners',
      valuation: '$120M',
      use: 'Product development, team expansion, market penetration'
    },
    {
      round: 'Seed',
      amount: '$5M',
      date: 'Q3 2022',
      lead: 'Index Ventures',
      participants: 'Angel investors, founding team',
      valuation: '$25M',
      use: 'Initial product build, founding team, market validation'
    }
  ];

  const marketOpportunity = [
    {
      title: 'Total Addressable Market (TAM)',
      value: '$95B',
      description: 'Global customer service software and AI automation market',
      icon: Globe
    },
    {
      title: 'Serviceable Addressable Market (SAM)',
      value: '$28B',
      description: 'Enterprise customer support automation and AI solutions',
      icon: Target
    },
    {
      title: 'Serviceable Obtainable Market (SOM)',
      value: '$2.8B',
      description: 'Mid-market and enterprise companies with 1000+ support tickets/month',
      icon: Zap
    }
  ];

  const investorUpdates = [
    {
      title: 'Q3 2024 Investor Update',
      date: 'October 2024',
      type: 'Quarterly Report',
      highlights: [
        '40% quarter-over-quarter ARR growth',
        'Expanded to European market with 3 new offices',
        'Launched enterprise AI analytics suite',
        'Achieved SOC 2 Type II certification'
      ]
    },
    {
      title: 'Series B Funding Announcement',
      date: 'August 2024',
      type: 'Press Release',
      highlights: [
        '$50M Series B led by Andreessen Horowitz',
        'Plans for global expansion and AI research investment',
        'New board member appointment',
        'Strategic partnership with Microsoft announced'
      ]
    },
    {
      title: 'Q2 2024 Financial Results',
      date: 'July 2024',
      type: 'Quarterly Report',
      highlights: [
        'Record revenue of $8.2M in Q2',
        'Net Revenue Retention reached 135%',
        'Customer base grew to 500+ enterprises',
        'Gross margin improved to 88%'
      ]
    }
  ];

  const boardMembers = [
    {
      name: 'Sarah Chen',
      title: 'CEO & Co-Founder',
      company: 'SentraTech',
      expertise: 'Enterprise Software, Customer Success'
    },
    {
      name: 'Marc Andreessen',
      title: 'Co-Founder & General Partner',
      company: 'Andreessen Horowitz',
      expertise: 'Enterprise Software, AI/ML Investments'
    },
    {
      name: 'Roelof Botha',
      title: 'Partner',
      company: 'Sequoia Capital',
      expertise: 'SaaS Scaling, Financial Strategy'
    },
    {
      name: 'Sarah Guo',
      title: 'Partner',
      company: 'Greylock Partners',
      expertise: 'AI Technology, Product Strategy'
    },
    {
      name: 'Dr. Jennifer Thompson',
      title: 'Independent Director',
      company: 'Former CTO, Slack',
      expertise: 'Enterprise Technology, Public Company Experience'
    }
  ];

  const competitiveAdvantages = [
    {
      icon: Zap,
      title: 'AI-First Architecture',
      description: 'Proprietary AI models trained specifically for customer support with 70% automation rate'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II, GDPR compliant with enterprise-grade security infrastructure'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Multi-language support across 50+ countries with 99.9% uptime SLA'
    },
    {
      icon: Users,
      title: 'Network Effects',
      description: 'AI improves with scale - larger customer base leads to better automation accuracy'
    }
  ];

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white">
      <SEOManager 
        title="Investor Relations | SentraTech - Financial Performance & Growth Metrics"
        description="Access SentraTech's investor information, financial metrics, funding history, and growth performance for current and prospective investors."
        keywords="SentraTech investors, financial metrics, funding, ARR growth, enterprise SaaS investment"
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
              Investor Relations
            </h1>
            <p className="text-xl text-[rgb(161,161,170)] max-w-4xl mx-auto leading-relaxed">
              SentraTech is building the future of AI-powered customer support. We're backed by leading 
              venture capital firms and are experiencing rapid growth across key business metrics. 
              Learn more about our financial performance and investment opportunity.
            </p>
          </div>
        </div>

        {/* Key Business Metrics */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Key Business Metrics</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Strong financial performance driven by enterprise customer adoption and AI technology leadership.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-6 hover:border-[#00FF41]/30 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg flex items-center justify-center mr-3">
                      <Icon size={24} className="text-[#00FF41]" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-[#00FF41] font-semibold text-sm mb-2">{metric.growth}</div>
                  <div className="text-[rgb(161,161,170)] text-xs font-semibold mb-2">{metric.metric}</div>
                  <p className="text-[rgb(218,218,218)] text-xs leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Market Opportunity</h2>
            <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto">
              The AI-powered customer support market is experiencing unprecedented growth as enterprises 
              seek to reduce costs while improving customer experience quality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {marketOpportunity.map((market, index) => {
              const Icon = market.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Icon size={32} className="text-[#00FF41]" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{market.value}</div>
                  <h3 className="text-lg font-semibold text-white mb-3">{market.title}</h3>
                  <p className="text-[rgb(218,218,218)] text-sm leading-relaxed">
                    {market.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funding History */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Funding History</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Backed by tier-one venture capital firms with a proven track record of scaling enterprise software companies.
            </p>
          </div>
          
          <div className="space-y-6">
            {fundingHistory.map((round, index) => (
              <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-2xl font-bold text-[#00FF41] mb-2">{round.round}</div>
                    <div className="text-xl font-semibold text-white mb-1">{round.amount}</div>
                    <div className="text-[rgb(161,161,170)] text-sm">{round.date}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-3">
                      <span className="text-white font-semibold">Lead Investor: </span>
                      <span className="text-[rgb(218,218,218)]">{round.lead}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-white font-semibold">Participants: </span>
                      <span className="text-[rgb(218,218,218)]">{round.participants}</span>
                    </div>
                    <div>
                      <span className="text-white font-semibold">Valuation: </span>
                      <span className="text-[#00FF41] font-semibold">{round.valuation}</span>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-white font-semibold text-sm mb-2">Use of Funds:</div>
                    <p className="text-[rgb(218,218,218)] text-sm leading-relaxed">{round.use}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Advantages */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Competitive Advantages</h2>
            <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Our strategic moats and differentiation factors that drive sustainable competitive advantages in the market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {competitiveAdvantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg flex items-center justify-center mr-4">
                      <Icon size={24} className="text-[#00FF41]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{advantage.title}</h3>
                  </div>
                  <p className="text-[rgb(218,218,218)] leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Board of Directors */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Board of Directors</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Strategic guidance from experienced technology leaders and top-tier venture capital partners.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardMembers.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users size={24} className="text-[#00FF41]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-[#00FF41] font-medium text-sm mb-1">{member.title}</p>
                  <p className="text-[rgb(161,161,170)] text-xs mb-3">{member.company}</p>
                  <p className="text-[rgb(218,218,218)] text-xs">{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Investor Updates */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Recent Updates</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Stay informed with our latest financial results, strategic announcements, and business developments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 gap-6">
            {investorUpdates.map((update, index) => (
              <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{update.title}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-[#00FF41] font-medium">{update.type}</span>
                      <span className="text-[rgb(161,161,170)]">{update.date}</span>
                    </div>
                  </div>
                  <FileText size={24} className="text-[#00FF41]" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {update.highlights.map((highlight, hIndex) => (
                    <div key={hIndex} className="flex items-start space-x-2">
                      <span className="text-[#00FF41] mt-1">•</span>
                      <span className="text-[rgb(218,218,218)] text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investor Contact */}
        <div className="text-center bg-gradient-to-r from-[#00FF41]/5 to-[#00DD38]/5 border border-[#00FF41]/20 rounded-2xl p-8">
          <Calendar size={48} className="text-[#00FF41] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Investor Information</h2>
          <p className="text-[rgb(161,161,170)] mb-6 max-w-3xl mx-auto">
            For current investors, prospective investors, or financial analysts seeking additional information 
            about SentraTech's financial performance, strategy, or investment opportunities.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Investor Relations Contacts</h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-white font-medium">CEO & Co-Founder: </span>
                  <a href="mailto:sarah@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">sarah@sentratech.net</a>
                </li>
                <li>
                  <span className="text-white font-medium">CFO: </span>
                  <a href="mailto:jennifer@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">jennifer@sentratech.net</a>
                </li>
                <li>
                  <span className="text-white font-medium">Investor Relations: </span>
                  <a href="mailto:investors@sentratech.net" className="text-[#00FF41] hover:text-[#00DD38]">investors@sentratech.net</a>
                </li>
              </ul>
            </div>
            
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Reporting Schedule</h3>
              <ul className="space-y-2 text-[rgb(218,218,218)] text-sm">
                <li>• Quarterly investor updates</li>
                <li>• Annual financial reporting</li>
                <li>• Monthly operational metrics (board)</li>
                <li>• Ad-hoc strategic announcements</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = 'mailto:investors@sentratech.net'}
              className="px-8 py-3 bg-[#00FF41] text-black font-semibold rounded-xl hover:bg-[#00DD38] transition-colors duration-200"
            >
              Contact Investor Relations
            </button>
            <button
              onClick={() => navigate('/demo-request')}
              className="px-8 py-3 border-2 border-[#00FF41]/30 text-[#00FF41] font-semibold rounded-xl hover:bg-[#00FF41]/10 transition-colors duration-200"
            >
              Request Product Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorRelationsPage;