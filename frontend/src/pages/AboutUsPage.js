import React from 'react';
import { ArrowLeft, Users, Target, Zap, Shield, Globe, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const AboutUsPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Founded', value: '2024', icon: Users },
    { label: 'AI Response Time', value: '<100ms', icon: Zap },
    { label: 'Target Automation', value: '70%+', icon: Target },
    { label: 'Platform Uptime', value: '99.9%', icon: Shield }
  ];

  const values = [
    {
      icon: Users,
      title: 'Customer Obsession',
      description: 'Every decision we make starts with our customers. We relentlessly focus on delivering exceptional support experiences that exceed expectations.'
    },
    {
      icon: Zap,
      title: 'Innovation Excellence',
      description: 'We push the boundaries of AI and automation to create breakthrough solutions that transform how businesses connect with their customers.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'We maintain the highest standards of security and compliance, ensuring our customers\' data is protected at every level.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Our mission extends worldwide, helping businesses of all sizes deliver outstanding customer support across every channel and timezone.'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Company Founded',
      description: 'SentraTech was born in Bangladesh from a vision to revolutionize customer support with AI-powered automation, bridging the gap between human empathy and intelligent automation.'
    },
    {
      year: '2024',
      title: 'MVP Development',
      description: 'Built and launched our first AI customer support platform with initial beta testing, achieving promising early results in automation accuracy.'
    },
    {
      year: '2024',
      title: 'Team Expansion',
      description: 'Grew our founding team to include AI specialists, customer experience experts, and industry veterans committed to transforming support.'
    },
    {
      year: '2024',
      title: 'Market Entry',
      description: 'Officially entered the competitive AI customer support market with a focus on delivering exceptional results for forward-thinking businesses.'
    },
    {
      year: '2025',
      title: 'Scaling Vision',
      description: 'Positioned to become the next market leader in AI customer support, with plans to serve enterprises globally and establish industry benchmarks.'
    }
  ];

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white">
      <SEOManager 
        title="About SentraTech | Leading AI Customer Support Platform"
        description="Learn about SentraTech's mission to transform customer support with AI-powered automation, serving 500+ enterprise customers worldwide."
        keywords="about SentraTech, AI customer support, enterprise software, company mission, customer success"
      />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-[#00FF41] hover:text-[#00DD38] transition-colors mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </button>
          
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Transforming Customer Support with 
              <span className="text-[#00FF41]"> AI Innovation</span>
            </h1>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto leading-relaxed">
              SentraTech empowers enterprises to deliver exceptional customer experiences through 
              intelligent automation, reducing costs by 40-60% while dramatically improving satisfaction scores.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#00FF41]/10 border-2 border-[#00FF41]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-[#00FF41]" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-[rgb(161,161,170)] text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
            <Target size={32} className="text-[#00FF41] mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-[rgb(218,218,218)] leading-relaxed">
              To revolutionize customer support by making AI-powered automation accessible to every business, 
              enabling them to deliver instant, personalized, and effective customer experiences at scale. 
              We believe exceptional customer support should be a competitive advantage, not a cost center.
            </p>
          </div>
          
          <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
            <Globe size={32} className="text-[#00FF41] mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-[rgb(218,218,218)] leading-relaxed">
              To create a world where every customer interaction is meaningful, efficient, and delightful. 
              We envision a future where AI and human intelligence work seamlessly together to solve problems, 
              build relationships, and drive business growth through outstanding customer experiences.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer relationships.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8 hover:border-[#00FF41]/30 transition-colors duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg flex items-center justify-center mr-4">
                      <Icon size={24} className="text-[#00FF41]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                  </div>
                  <p className="text-[rgb(218,218,218)] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company Story */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-[rgb(161,161,170)] max-w-3xl mx-auto leading-relaxed">
              Founded in 2024 by a team of AI researchers and customer experience veterans, SentraTech emerged 
              from a simple but powerful observation: while AI technology was advancing rapidly, most businesses 
              struggled to implement effective automated customer support that actually improved their customer relationships.
              We're here to change that narrative.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">The Challenge We Solved</h3>
                <p className="text-[rgb(218,218,218)] leading-relaxed mb-6">
                  Traditional customer support systems were either too rigid (frustrating customers with 
                  endless phone trees) or too expensive (requiring massive human support teams). Existing 
                  AI solutions often felt robotic and couldn't handle the nuanced, context-sensitive nature 
                  of real customer problems.
                </p>
                <p className="text-[rgb(218,218,218)] leading-relaxed">
                  We built SentraTech to bridge this gap - creating AI that doesn't replace human empathy 
                  but amplifies it, enabling businesses to provide personalized support at scale while 
                  maintaining the human touch that customers value.
                </p>
              </div>
              <div className="bg-[rgb(18,18,18)] border border-[#00FF41]/20 rounded-xl p-6">
                <Award size={32} className="text-[#00FF41] mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Our Commitments</h4>
                <ul className="text-[rgb(218,218,218)] space-y-2 text-sm">
                  <li>• Next-Generation AI Platform in Development</li>
                  <li>• Enterprise-Grade Security Implementation</li>
                  <li>• GDPR & Data Privacy Compliance Ready</li>
                  <li>• Target: 99.9% Platform Uptime</li>
                  <li>• Global Scalability Architecture</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
              From startup to industry leader, here are the key milestones that shaped SentraTech.
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#00FF41] rounded-full flex items-center justify-center text-black font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                </div>
                <div className="bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                    <span className="text-[#00FF41] font-semibold text-sm">{milestone.year}</span>
                  </div>
                  <p className="text-[rgb(218,218,218)] leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Philosophy */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-[#00FF41]/5 to-[#00DD38]/5 border border-[#00FF41]/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <Shield size={48} className="text-[#00FF41] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Our Support Philosophy</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Tier 1: Instant Response</h3>
                <p className="text-[rgb(218,218,218)] text-sm">
                  AI-powered automation handles 70% of inquiries instantly, providing immediate solutions 
                  for common questions and routine tasks.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Tier 2: Expert Guidance</h3>
                <p className="text-[rgb(218,218,218)] text-sm">
                  Technical specialists handle integration, customization, and complex feature questions 
                  with deep product knowledge.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Tier 3: Strategic Partnership</h3>
                <p className="text-[rgb(218,218,218)] text-sm">
                  Enterprise-level support with dedicated success managers, custom solutions, 
                  and proactive optimization guidance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Customer Support?</h2>
          <p className="text-[rgb(161,161,170)] mb-6 max-w-2xl mx-auto">
            Join 500+ enterprise customers who trust SentraTech to deliver exceptional customer experiences. 
            See how we can help your business reduce costs while improving satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/demo-request')}
              className="px-8 py-3 bg-[#00FF41] text-black font-semibold rounded-xl hover:bg-[#00DD38] transition-colors duration-200"
            >
              Schedule Demo
            </button>
            <button
              onClick={() => navigate('/case-studies')}
              className="px-8 py-3 border-2 border-[#00FF41]/30 text-[#00FF41] font-semibold rounded-xl hover:bg-[#00FF41]/10 transition-colors duration-200"
            >
              View Success Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;