import React from 'react';
import { ArrowLeft, TrendingUp, FileText, Calendar, Users, Award, Globe, Shield, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const InvestorRelationsPage = () => {
  const navigate = useNavigate();

  const keyMetrics = [
    {
      metric: 'Customer Support Cost Reduction',
      value: '70%',
      growth: 'Proven in Pilots',
      icon: TrendingUp,
      description: 'Average cost reduction achieved across pilot implementations'
    },
    {
      metric: 'AI Automation Rate',
      value: '65%+',
      growth: 'Industry Leading',
      icon: Zap,
      description: 'Ticket automation rate in production environments'
    },
    {
      metric: 'Implementation Time',
      value: '2 weeks',
      growth: 'vs 6 months',
      icon: Target,
      description: 'Time to deployment compared to traditional solutions'
    },
    {
      metric: 'Market Opportunity',
      value: '$95B',
      growth: 'Growing 15% YoY',
      icon: Globe,
      description: 'Global customer service software market size'
    }
  ];

  const fundingStatus = {
    currentStage: 'Pre-Seed',
    seeking: '$2.5M',
    timeline: 'Q1 2025',
    purpose: 'Production infrastructure & pilot customer scaling',
    useOfFunds: [
      'Production-grade AI infrastructure development - 40%',
      'Enterprise pilot customer onboarding - 25%',
      'Technical team expansion (AI/ML, DevOps) - 20%',
      'Go-to-market strategy & customer validation - 15%'
    ]
  };

  const marketOpportunity = [
    {
      title: 'Total Addressable Market (TAM)',
      value: '$95B',
      description: 'Global customer service software and AI automation market growing at 15% CAGR',
      icon: Globe
    },
    {
      title: 'Immediate Addressable Market',
      value: '$12B',
      description: 'Mid-market companies with 100+ support agents seeking AI automation',
      icon: Target
    },
    {
      title: 'Early Adoption Opportunity',
      value: '$850M',
      description: 'Companies currently evaluating AI customer support solutions',
      icon: Zap
    }
  ];

  const milestones = [
    {
      title: 'Product Development Milestone',
      date: 'November 2024',
      type: 'Technical Achievement',
      highlights: [
        'Core AI automation engine reaching 70% accuracy',
        'Integration framework supporting 15+ CRM platforms',
        'Real-time analytics dashboard completed',
        'Multi-language support for 8 languages implemented'
      ]
    },
    {
      title: 'Pilot Customer Validation',
      date: 'October 2024',
      type: 'Market Validation',
      highlights: [
        '3 enterprise pilot customers onboarded',
        '65% average ticket automation rate achieved',
        '40% reduction in response time documented',
        'Customer satisfaction scores improved by 25%'
      ]
    },
    {
      title: 'Team & Infrastructure',
      date: 'September 2024',
      type: 'Company Development',
      highlights: [
        'AI/ML team expanded to 4 engineers',
        'Production infrastructure architecture finalized',
        'Security compliance framework established',
        'Advisory board formed with industry experts'
      ]
    }
  ];

  const teamHighlights = [
    {
      name: 'Swapnil Roy',
      title: 'CEO & Co-Founder',
      company: 'SentraTech',
      expertise: 'AI Product Strategy, Enterprise Software, Team Leadership'
    },
    {
      name: 'Lead AI Engineer',
      title: 'Co-Founder & CTO',
      company: 'SentraTech',
      expertise: 'Machine Learning, NLP, Distributed Systems Architecture'
    },
    {
      name: 'Senior Full-Stack Engineer',
      title: 'Head of Engineering',
      company: 'SentraTech',
      expertise: 'Scalable Backend Systems, Frontend Architecture, DevOps'
    }
  ];

  const advisors = [
    {
      role: 'AI/ML Strategy',
      expertise: 'Former Head of AI at enterprise customer support company',
      value: 'Product roadmap & technical architecture guidance'
    },
    {
      role: 'Go-to-Market',
      expertise: 'VP Sales at leading SaaS customer support platform',
      value: 'Enterprise sales strategy & customer acquisition'
    },
    {
      role: 'Industry Expert',
      expertise: 'Former CXO at Fortune 500 company with large support operations',
      value: 'Customer validation & market requirements'
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
              Investment Opportunity
            </h1>
            <p className="text-xl text-[rgb(161,161,170)] max-w-4xl mx-auto leading-relaxed">
              SentraTech is pioneering the next generation of AI-powered customer support automation. 
              We're seeking $2.5M in pre-seed funding to scale our production infrastructure and 
              accelerate enterprise pilot customer adoption in the rapidly growing $95B customer service market.
            </p>
            <div className="mt-8 inline-flex items-center px-6 py-3 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-xl">
              <span className="text-[#00FF41] font-semibold text-lg">Pre-Seed Stage</span>
              <span className="text-white ml-3">•</span>
              <span className="text-white ml-3">Seeking $2.5M</span>
              <span className="text-white ml-3">•</span>
              <span className="text-white ml-3">Q1 2025 Timeline</span>
            </div>
          </div>
        </div>

        {/* Key Validation Metrics */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Early Validation & Market Traction</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Strong early indicators from pilot implementations demonstrate product-market fit and competitive advantages.
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

        {/* Pre-Seed Funding Strategy */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Pre-Seed Funding Strategy</h2>
            <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto">
              We're raising $2.5M to transition from validated prototype to production-ready platform, 
              focusing on infrastructure scaling and enterprise customer acquisition.
            </p>
          </div>
          
          <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00FF41] mb-2">{fundingStatus.seeking}</div>
                <div className="text-lg font-semibold text-white mb-1">{fundingStatus.currentStage}</div>
                <div className="text-[rgb(161,161,170)] text-sm">{fundingStatus.timeline}</div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Use of Funds</h3>
                <div className="space-y-2">
                  {fundingStatus.useOfFunds.map((use, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-[#00FF41] mt-1">•</span>
                      <span className="text-[rgb(218,218,218)] text-sm">{use}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-[rgb(63,63,63)] pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">18-Month Milestones with Funding</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-[#00FF41] font-semibold text-sm mb-2">Q1-Q2 2025</div>
                  <ul className="text-[rgb(218,218,218)] text-sm space-y-1">
                    <li>• Production infrastructure deployment</li>
                    <li>• 10 enterprise pilot customers</li>
                    <li>• Team expansion to 12 members</li>
                  </ul>
                </div>
                <div>
                  <div className="text-[#00FF41] font-semibold text-sm mb-2">Q3-Q4 2025</div>
                  <ul className="text-[rgb(218,218,218)] text-sm space-y-1">
                    <li>• First paying customers</li>
                    <li>• $500K ARR target</li>
                    <li>• Series A fundraising prep</li>
                  </ul>
                </div>
                <div>
                  <div className="text-[#00FF41] font-semibold text-sm mb-2">Q1 2026</div>
                  <ul className="text-[rgb(218,218,218)] text-sm space-y-1">
                    <li>• Series A funding round</li>
                    <li>• Market expansion strategy</li>
                    <li>• Advanced AI capabilities</li>
                  </ul>
                </div>
              </div>
            </div>
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

        {/* Founding Team & Advisors */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Team & Advisory Network</h2>
            <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Strong founding team with deep technical expertise and industry experience, 
              supported by strategic advisors from leading customer support and AI companies.
            </p>
          </div>
          
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Founding Team</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {teamHighlights.map((member, index) => (
                <div key={index} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users size={24} className="text-[#00FF41]" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                    <p className="text-[#00FF41] font-medium text-sm mb-1">{member.title}</p>
                    <p className="text-[rgb(218,218,218)] text-xs leading-relaxed">{member.expertise}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Strategic Advisors</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {advisors.map((advisor, index) => (
                <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Award size={20} className="text-[#00FF41]" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{advisor.role}</h4>
                    <p className="text-[rgb(161,161,170)] text-sm mb-2">{advisor.expertise}</p>
                    <p className="text-[rgb(218,218,218)] text-xs">{advisor.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Milestones */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Recent Milestones</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Key achievements demonstrating progress toward product-market fit and readiness for scaling.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 gap-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-[#00FF41] font-medium">{milestone.type}</span>
                      <span className="text-[rgb(161,161,170)]">{milestone.date}</span>
                    </div>
                  </div>
                  <FileText size={24} className="text-[#00FF41]" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {milestone.highlights.map((highlight, hIndex) => (
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
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center md:text-left">
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
              
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-white mb-4">Reporting Schedule</h3>
                <ul className="space-y-2 text-[rgb(218,218,218)] text-sm">
                  <li>• Quarterly investor updates</li>
                  <li>• Annual financial reporting</li>
                  <li>• Monthly operational metrics (board)</li>
                  <li>• Ad-hoc strategic announcements</li>
                </ul>
              </div>
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