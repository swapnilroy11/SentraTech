import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Users, Award, Globe, ArrowRight, MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SEOManager from '../components/SEOManager';
const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scrolling to anchor sections when page loads with hash
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1); // Remove the # symbol
      const element = document.getElementById(elementId);
      if (element) {
        // Add a small delay to ensure the page has fully rendered
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location.hash]);

  // Current open positions
  const openPositions = [
    {
      id: 'customer-support-specialist',
      title: 'Customer Support Specialist (English-Fluent)',
      department: 'Customer Support',
      location: 'Dhaka (Hybrid) or Remote — Bangladesh',
      type: 'Full-time',
      salary: 'Competitive',
      description: 'Handle escalations and complex inquiries while contributing to AI assistant training.',
      requirements: [
        'Fluent English (spoken & written)',
        '1–3 years customer support or BPO experience',
        'Experience with CRMs and ticketing systems',
        'Strong problem-solving skills',
        'Reliable internet and quiet workspace'
      ],
      responsibilities: [
        'Handle inbound/outbound calls and digital interactions',
        'Resolve customer queries efficiently and empathetically',
        'Use SentraTech agent tools (CRM, internal consoles)',
        'Document case notes and provide AI training feedback',
        'Achieve target KPIs (CSAT, FCR, AHT)',
        'Participate in QA and training sessions'
      ],
      benefits: [
        'Competitive salary package',
        'Work-from-home / hybrid policy',
        'Learning & development budget',
        'Performance-based bonuses',
        'Paid annual leave and sick leave',
        'Fast-track promotion opportunities'
      ]
    }
  ];

  const companyValues = [
    {
      icon: Users,
      title: 'Innovation First',
      description: 'We\'re pioneering the future of AI-powered customer support, combining cutting-edge technology with human expertise.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Our solutions help businesses worldwide deliver better customer experiences while reducing costs by 40-60%.'
    },
    {
      icon: Award,
      title: 'Excellence Driven',
      description: 'We maintain the highest standards in everything we do, from product development to customer relationships.'
    },
    {
      icon: Briefcase,
      title: 'Growth Focused',
      description: 'We invest in our team\'s professional development and provide clear paths for career advancement.'
    }
  ];

  const perks = [
    {
      icon: '🏠',
      title: 'Flexible Work',
      description: 'Hybrid and remote work options with flexible scheduling'
    },
    {
      icon: '📚',
      title: 'Learning Budget',
      description: 'Annual budget for courses, certifications, and conferences'
    },
    {
      icon: '🚀',
      title: 'Fast Growth',
      description: 'Rapid career progression in a scaling startup environment'
    },
    {
      icon: '🎯',
      title: 'Performance Bonuses',
      description: 'Reward system based on individual and team achievements'
    },
    {
      icon: '🏥',
      title: 'Health Benefits',
      description: 'Comprehensive health coverage and wellness programs'
    },
    {
      icon: '🌟',
      title: 'Startup Culture',
      description: 'Dynamic, innovative environment with direct impact on product'
    }
  ];

  const handleApplyClick = (job) => {
    // Navigate to dedicated job application page instead of modal
    navigate(`/careers/apply/${job.id}`, { 
      state: { job } 
    });
  };

  const seoData = {
    title: 'Careers at SentraTech | Join Our AI-Powered Customer Support Team',
    description: 'Join SentraTech and help transform customer support with AI automation. Open positions in Bangladesh with competitive salaries, flexible work, and growth opportunities.',
    keywords: 'SentraTech careers, jobs Bangladesh, customer support jobs, AI startup jobs, remote work Bangladesh, tech jobs Dhaka',
    ogImage: '/images/sentratech-careers-og.jpg'
  };

  return (
    <PageTransition>
      <SEOManager {...seoData} />
      
      <div className="min-h-screen bg-[rgb(8,8,8)]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Build the Future of
              <span className="block text-[#00FF41]">Customer Support</span>
            </h1>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto leading-relaxed mb-8">
              Join our innovative team and help transform how businesses interact with their customers 
              through AI-powered automation and human expertise. Shape the future of customer experience.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-[rgb(218,218,218)]">
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-[#00FF41]" />
                <span>Bangladesh • Remote & Hybrid</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-[#00FF41]" />
                <span>Growing Team • Startup Culture</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase size={18} className="text-[#00FF41]" />
                <span>Competitive Salary • Benefits</span>
              </div>
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section id="company-culture" className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Values & Culture
              </h2>
              <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
                We're building more than just a product – we're creating a culture of innovation, 
                growth, and impact in the AI revolution.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyValues.map((value, index) => (
                <div key={index} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6 text-center hover:border-[#00FF41]/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <value.icon size={28} className="text-[#00FF41]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-[rgb(161,161,170)] text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-20 px-6 bg-gradient-to-b from-transparent to-[rgb(13,13,13)]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Open Positions
              </h2>
              <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
                Join our team and be part of the AI revolution in customer support. 
                We're looking for passionate individuals to help scale our impact.
              </p>
            </div>

            <div className="space-y-6">
              {openPositions.map((job) => (
                <div 
                  key={job.id}
                  className="bg-gradient-to-r from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-8 hover:border-[#00FF41]/30 transition-all duration-300"
                >
                  <div className="space-y-6">
                    {/* Header section */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20">
                        {job.department}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {job.type}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3 leading-tight">{job.title}</h3>
                      <p className="text-[rgb(161,161,170)] mb-4 leading-relaxed">{job.description}</p>
                    </div>
                    
                    {/* Job details with proper spacing */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-[#00FF41] flex-shrink-0" />
                        <span className="text-[rgb(218,218,218)] truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-[#00FF41] flex-shrink-0" />
                        <span className="text-[rgb(218,218,218)]">{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-[#00FF41] flex-shrink-0" />
                        <span className="text-[rgb(218,218,218)] truncate">Full-time • Flexible shifts</span>
                      </div>
                    </div>
                    
                    {/* Action buttons with single apply button */}
                    <div className="flex pt-4 border-t border-[rgb(63,63,63)]">
                      <button 
                        onClick={() => handleApplyClick(job)}
                        className="w-full px-6 py-3 bg-transparent border border-[#00FF41]/30 text-[#00FF41] rounded-lg hover:bg-[#00FF41]/10 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>View Details & Apply</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {openPositions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Briefcase size={28} className="text-[#00FF41]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Open Positions</h3>
                <p className="text-[rgb(161,161,170)] mb-4">
                  We don't have any open positions right now, but we're always looking for exceptional talent.
                </p>
                <button className="px-6 py-3 bg-transparent border border-[#00FF41]/30 text-[#00FF41] rounded-lg hover:bg-[#00FF41]/10 transition-all duration-200">
                  Join Our Talent Pool
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Benefits & Perks */}
        <section id="benefits-perks" className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Benefits & Perks
              </h2>
              <p className="text-[rgb(161,161,170)] max-w-2xl mx-auto">
                We believe in taking care of our team. Enjoy competitive compensation, 
                flexible work arrangements, and opportunities for professional growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {perks.map((perk, index) => (
                <div key={index} className="bg-gradient-to-br from-[rgb(38,40,42)] to-[rgb(26,28,30)] border border-[rgb(63,63,63)] rounded-2xl p-6 hover:border-[#00FF41]/30 transition-all duration-300">
                  <div className="text-3xl mb-4">{perk.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
                  <p className="text-[rgb(161,161,170)] text-sm leading-relaxed">{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="apply-now" className="py-20 px-6 bg-gradient-to-b from-transparent to-[rgb(26,28,30)]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Join Our Team?
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] mb-8 max-w-2xl mx-auto">
              Be part of the AI revolution in customer support. Help us transform how businesses 
              connect with their customers while building your career with a innovative team.
            </p>
            
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/careers/apply/customer-support-specialist')}
                className="px-8 py-4 bg-[#00FF41] text-black font-semibold rounded-lg hover:bg-[#00e83a] transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Apply for Open Position</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>

    </PageTransition>
  );
};

export default CareersPage;