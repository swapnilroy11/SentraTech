import React from 'react';
import { ArrowLeft, Linkedin, Twitter, Mail, Users, Award, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const LeadershipTeamPage = () => {
  const navigate = useNavigate();

  const executives = [
    {
      name: 'Swapnil Roy',
      title: 'Chief Executive Officer & Founder',
      image: '/images/team/swapnil_roy.jpg',
      bio: 'Swapnil is a visionary entrepreneur with deep expertise in AI-powered customer experience solutions. He founded SentraTech to revolutionize how businesses interact with their customers through intelligent automation while maintaining human connection. His leadership focuses on scaling innovative technology solutions for enterprise clients.',
      achievements: [
        'Founded SentraTech with vision to transform customer support industry',
        'Built strategic partnerships with leading enterprise technology companies',
        'Expertise in AI/ML product development and go-to-market strategy'
      ],
      linkedin: 'https://linkedin.com/in/swapnilroy-ceo',
      twitter: 'https://twitter.com/swapnilroy',
      email: 'swapnil@sentratech.net'
    },
    {
      name: 'Samiul Sakib',
      title: 'Chief Technology Officer',
      image: '/images/team/samiul_sakib.jpg',
      bio: 'Samiul leads SentraTech\'s technology vision and architecture, focusing on building scalable AI-powered customer support solutions. With extensive experience in machine learning, cloud infrastructure, and enterprise software development, he ensures our platform delivers exceptional performance and reliability.',
      achievements: [
        'Architected SentraTech\'s core AI platform serving enterprise clients',
        'Expert in machine learning, natural language processing, and cloud systems',
        'Led development of proprietary algorithms for customer interaction optimization'
      ],
      linkedin: 'https://linkedin.com/in/samiulsakib-cto',
      twitter: 'https://twitter.com/samiulsakib',
      email: 'samiul@sentratech.net'
    },
    {
      name: 'Arina Tasnim',
      title: 'Chief Human Resources Officer',
      image: '/images/team/arina_tasnim.jpg',
      bio: 'Arina shapes SentraTech\'s organizational culture and talent strategy, ensuring we attract, develop, and retain the best talent in AI and customer experience technology. Her focus on building inclusive, high-performance teams drives our company\'s growth and innovation capabilities.',
      achievements: [
        'Built comprehensive talent acquisition and development programs',
        'Established company culture focused on innovation and customer success',
        'Expert in scaling diverse, high-performing technology teams'
      ],
      linkedin: 'https://linkedin.com/in/arinatasnim-chro',
      twitter: 'https://twitter.com/arinatasnim',
      email: 'arina@sentratech.net'
    },
    {
      name: 'Ajmal Hossen',
      title: 'Chief Operating Officer',
      image: '/images/team/ajmal_hossen.jpg',
      bio: 'Ajmal oversees SentraTech\'s operational excellence and business strategy execution. He ensures our company operates efficiently while maintaining our commitment to delivering exceptional customer experiences. His expertise spans operations management, strategic planning, and process optimization.',
      achievements: [
        'Streamlined operations for rapid scaling and global expansion',
        'Implemented data-driven processes improving operational efficiency by 40%+',
        'Expert in business operations, strategic planning, and customer success'
      ],
      linkedin: 'https://linkedin.com/in/ajmalhossen-coo',
      twitter: 'https://twitter.com/ajmalhossen',
      email: 'ajmal@sentratech.net'
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
                {/* Profile Image */}
                <div className="w-32 h-32 mx-auto mb-6">
                  <img 
                    src={exec.image} 
                    alt={`${exec.name} - ${exec.title}`}
                    className="w-full h-full object-cover rounded-full border-2 border-[#00FF41]/30 hover:border-[#00FF41]/60 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback placeholder */}
                  <div className="w-32 h-32 bg-gradient-to-br from-[#00FF41]/20 to-[#00DD38]/20 border-2 border-[#00FF41]/30 rounded-full mx-auto flex items-center justify-center" style={{display: 'none'}}>
                    <Users size={48} className="text-[#00FF41]" />
                  </div>
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