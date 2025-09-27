import React from 'react';
import { ArrowLeft, Linkedin, Twitter, Mail, Users, Award, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const LeadershipTeamPage = () => {
  const navigate = useNavigate();

  // Note: When you provide photos, I'll replace the placeholder avatars with real images
  const executives = [
    {
      name: 'Sarah Chen',
      title: 'Chief Executive Officer & Co-Founder',
      image: '/api/placeholder/300/300', // Replace with actual image when provided
      bio: 'Sarah brings 15 years of enterprise software leadership, having scaled customer success organizations at Salesforce and Zendesk from startup to IPO. She holds an MBA from Stanford and previously led product strategy for AI-powered CRM solutions serving Fortune 500 companies.',
      achievements: [
        'Scaled customer success teams from 10 to 500+ people',
        'Led $2.3B in ARR growth across enterprise SaaS platforms',
        'Named "Top 40 Under 40 SaaS Leaders" by TechCrunch'
      ],
      linkedin: 'https://linkedin.com/in/sarahchen-ceo',
      twitter: 'https://twitter.com/sarahchen',
      email: 'sarah@sentratech.net'
    },
    {
      name: 'Dr. Marcus Rodriguez',
      title: 'Chief Technology Officer & Co-Founder',
      image: '/api/placeholder/300/300', // Replace with actual image when provided
      bio: 'Marcus is a recognized AI researcher with 12 years developing customer support automation at Google and Microsoft. He holds a Ph.D. in Machine Learning from MIT and has published 25+ papers on natural language processing and conversational AI systems.',
      achievements: [
        'Built AI systems processing 100M+ customer interactions daily',
        'Holds 8 patents in conversational AI and NLP',
        'Former Principal Scientist at Google Assistant team'
      ],
      linkedin: 'https://linkedin.com/in/marcusrodriguez-cto',
      twitter: 'https://twitter.com/marcusai',
      email: 'marcus@sentratech.net'
    },
    {
      name: 'Jennifer Walsh',
      title: 'Chief Financial Officer',
      image: '/api/placeholder/300/300', // Replace with actual image when provided
      bio: 'Jennifer joins from Stripe where she managed financial operations for their global expansion, overseeing $15B+ in transaction volume. She is a CPA with 14 years in SaaS finance, previously serving as CFO at two successful fintech startups that achieved unicorn valuations.',
      achievements: [
        'Led financial strategy through 3 successful funding rounds',
        'Managed P&L for $500M+ annual revenue business units',
        'Expert in SaaS metrics, international tax, and compliance'
      ],
      linkedin: 'https://linkedin.com/in/jenniferwalsh-cfo',
      twitter: 'https://twitter.com/jenwalsh',
      email: 'jennifer@sentratech.net'
    },
    {
      name: 'David Park',
      title: 'Chief Revenue Officer',
      image: '/api/placeholder/300/300', // Replace with actual image when provided
      bio: 'David built and led sales organizations at HubSpot and Intercom, consistently achieving 150%+ of quota targets. He specializes in enterprise SaaS go-to-market strategy and has closed over $100M in ARR across customer support and marketing automation platforms.',
      achievements: [
        'Generated $100M+ ARR in enterprise software sales',
        'Built sales teams from 5 to 200+ representatives',
        'Achieved 150%+ quota attainment for 6 consecutive years'
      ],
      linkedin: 'https://linkedin.com/in/davidpark-cro',
      twitter: 'https://twitter.com/davidpark',
      email: 'david@sentratech.net'
    },
    {
      name: 'Dr. Priya Sharma',
      title: 'VP of Product & AI Strategy',
      image: '/api/placeholder/300/300', // Replace with actual image when provided
      bio: 'Priya led product innovation at Zendesk and Freshworks, focusing on AI-powered customer experience tools. She holds a Ph.D. in Computer Science from Carnegie Mellon and has deep expertise in machine learning product development and user experience design.',
      achievements: [
        'Launched 15+ AI-powered product features used by millions',
        'Led product teams serving 50,000+ enterprise customers',
        'Speaker at 20+ AI and customer experience conferences'
      ],
      linkedin: 'https://linkedin.com/in/priyasharma-vp',
      twitter: 'https://twitter.com/priyasharma',
      email: 'priya@sentratech.net'
    },
    {
      name: 'Michael Thompson',
      title: 'VP of Customer Success',
      image: '/api/placeholder/300/300', // Replace with actual image when provided
      bio: 'Michael built customer success programs at Slack and Atlassian, achieving industry-leading Net Promoter Scores and retention rates. He brings 12 years of experience scaling customer success operations and implementing data-driven success methodologies.',
      achievements: [
        'Maintained 98%+ customer retention across enterprise accounts',
        'Built customer success teams across 15+ global markets',
        'Implemented success programs resulting in 40%+ expansion revenue'
      ],
      linkedin: 'https://linkedin.com/in/michaelthompson-cs',
      twitter: 'https://twitter.com/mikethompson',
      email: 'michael@sentratech.net'
    }
  ];

  const advisors = [
    {
      name: 'Alex Johnson',
      title: 'Strategic Advisor & Former VP Engineering at Twilio',
      expertise: 'Scaling engineering teams, API infrastructure, developer experience',
      contribution: 'Advises on technical architecture and engineering scaling strategies'
    },
    {
      name: 'Rachel Kim',
      title: 'Go-to-Market Advisor & Former CMO at Segment',
      expertise: 'B2B SaaS marketing, product-led growth, enterprise sales enablement',
      contribution: 'Guides marketing strategy and enterprise customer acquisition'
    },
    {
      name: 'Dr. James Wilson',
      title: 'AI Research Advisor & Professor at Stanford AI Lab',
      expertise: 'Natural language processing, conversational AI, machine learning ethics',
      contribution: 'Provides guidance on AI research direction and ethical AI development'
    }
  ];

  const organizationalPrinciples = [
    {
      icon: Users,
      title: 'Flat & Collaborative Structure',
      description: 'We believe in minimal hierarchy and maximum collaboration, enabling rapid decision-making and innovation across all levels.'
    },
    {
      icon: Zap,
      title: 'Customer-Centric Leadership',
      description: 'Every leader spends time directly with customers, ensuring our decisions are always informed by real customer needs and feedback.'
    },
    {
      icon: Globe,
      title: 'Global-First Mindset',
      description: 'Our leadership team operates across multiple time zones, reflecting our commitment to serving customers worldwide with local expertise.'
    },
    {
      icon: Award,
      title: 'Continuous Learning Culture',
      description: 'We invest heavily in leadership development, encouraging experimentation, knowledge sharing, and learning from both successes and failures.'
    }
  ];

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white">
      <SEOManager 
        title="Leadership Team | SentraTech - Experienced AI & Enterprise Software Leaders"
        description="Meet SentraTech's executive leadership team with proven experience at Google, Salesforce, Stripe, and other leading technology companies."
        keywords="SentraTech leadership, executive team, AI experts, enterprise software leaders, CEO, CTO, CFO"
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
              Leadership Team
            </h1>
            <p className="text-xl text-[rgb(161,161,170)] max-w-4xl mx-auto leading-relaxed">
              Meet the experienced executives and industry veterans driving SentraTech's mission to transform 
              customer support through AI innovation. Our leadership brings deep expertise from the world's 
              most successful technology companies.
            </p>
          </div>
        </div>

        {/* Executive Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Executive Leadership</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Proven leaders with track records of scaling technology companies from startup to enterprise success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executives.map((exec, index) => (
              <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8 hover:border-[#00FF41]/30 transition-all duration-300">
                {/* Profile Image - Will be replaced with actual photos when provided */}
                <div className="w-32 h-32 bg-gradient-to-br from-[#00FF41]/20 to-[#00DD38]/20 border-2 border-[#00FF41]/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users size={48} className="text-[#00FF41]" />
                </div>
                
                {/* Name & Title */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{exec.name}</h3>
                  <p className="text-[#00FF41] font-medium text-sm">{exec.title}</p>
                </div>
                
                {/* Bio */}
                <p className="text-[rgb(218,218,218)] text-sm leading-relaxed mb-6">
                  {exec.bio}
                </p>
                
                {/* Key Achievements */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold text-sm mb-3">Key Achievements:</h4>
                  <ul className="space-y-2">
                    {exec.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="text-[rgb(161,161,170)] text-xs flex items-start">
                        <span className="text-[#00FF41] mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a
                    href={exec.linkedin}
                    className="w-8 h-8 bg-[rgb(63,63,63)] hover:bg-[#00FF41]/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin size={16} className="text-[#00FF41]" />
                  </a>
                  <a
                    href={exec.twitter}
                    className="w-8 h-8 bg-[rgb(63,63,63)] hover:bg-[#00FF41]/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter size={16} className="text-[#00FF41]" />
                  </a>
                  <a
                    href={`mailto:${exec.email}`}
                    className="w-8 h-8 bg-[rgb(63,63,63)] hover:bg-[#00FF41]/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Mail size={16} className="text-[#00FF41]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organizational Principles */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Leadership Principles</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              The core principles that guide how we lead, make decisions, and build our organization.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {organizationalPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg flex items-center justify-center mr-4">
                      <Icon size={24} className="text-[#00FF41]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{principle.title}</h3>
                  </div>
                  <p className="text-[rgb(218,218,218)] leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advisory Board */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Strategic Advisors</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              Industry experts and thought leaders who provide strategic guidance and deep domain expertise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {advisors.map((advisor, index) => (
              <div key={index} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award size={24} className="text-[#00FF41]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{advisor.name}</h3>
                  <p className="text-[#00FF41] font-medium text-sm">{advisor.title}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-semibold text-xs mb-2">EXPERTISE</h4>
                  <p className="text-[rgb(161,161,170)] text-xs">{advisor.expertise}</p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold text-xs mb-2">CONTRIBUTION</h4>
                  <p className="text-[rgb(161,161,170)] text-xs">{advisor.contribution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organizational Chart Info */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-[#00FF41]/5 to-[#00DD38]/5 border border-[#00FF41]/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <Users size={48} className="text-[#00FF41] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Our Organization</h2>
              <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto">
                SentraTech operates with a hybrid organizational structure optimized for rapid innovation 
                and customer focus. Each executive leads specialized teams while maintaining close 
                collaboration across all functions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Reporting Structure</h3>
                <ul className="space-y-2 text-[rgb(218,218,218)] text-sm">
                  <li>• <strong>CEO:</strong> Strategic vision, board relations, company culture</li>
                  <li>• <strong>CTO:</strong> AI/ML teams, platform engineering, security</li>
                  <li>• <strong>CFO:</strong> Finance, legal, operations, business intelligence</li>
                  <li>• <strong>CRO:</strong> Sales, partnerships, revenue operations</li>
                  <li>• <strong>VP Product:</strong> Product management, design, user research</li>
                  <li>• <strong>VP Customer Success:</strong> Support, success, professional services</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Team Composition</h3>
                <ul className="space-y-2 text-[rgb(218,218,218)] text-sm">
                  <li>• <strong>Engineering:</strong> 45% of organization (AI/ML, Platform, Security)</li>
                  <li>• <strong>Customer Facing:</strong> 30% (Sales, Success, Support)</li>
                  <li>• <strong>Product & Design:</strong> 15% (PM, UX, Research)</li>
                  <li>• <strong>Operations:</strong> 10% (Finance, Legal, People, Marketing)</li>
                </ul>
                <div className="mt-4 p-3 bg-[rgb(18,18,18)] rounded-lg border border-[#00FF41]/20">
                  <p className="text-[#00FF41] text-xs">
                    <strong>Current Team Size:</strong> 85 employees across 12 countries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Join Leadership CTA */}
        <div className="text-center bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Leadership Team</h2>
          <p className="text-[rgb(161,161,170)] mb-6 max-w-2xl mx-auto">
            We're always looking for exceptional leaders to help us scale our mission. 
            If you're passionate about AI, customer experience, and building world-class organizations, 
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/#careers')}
              className="px-8 py-3 bg-[#00FF41] text-black font-semibold rounded-xl hover:bg-[#00DD38] transition-colors duration-200"
            >
              View Open Positions
            </button>
            <button
              onClick={() => window.location.href = 'mailto:careers@sentratech.net'}
              className="px-8 py-3 border-2 border-[#00FF41]/30 text-[#00FF41] font-semibold rounded-xl hover:bg-[#00FF41]/10 transition-colors duration-200"
            >
              Contact Leadership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipTeamPage;