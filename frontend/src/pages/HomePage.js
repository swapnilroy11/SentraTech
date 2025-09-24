import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  MessageSquare, 
  Route, 
  TrendingUp, 
  BarChart3, 
  Zap,
  ArrowRight,
  Play
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: 'ROI Calculator',
      description: 'Calculate your potential savings with our intelligent cost analysis tool',
      icon: Calculator,
      preview: 'Interactive sliders showing potential 60% cost reduction',
      link: '/features#roi-calculator',
      color: '#00FF41'
    },
    {
      title: 'Multi-Channel Support',
      description: 'Seamless customer interactions across voice, chat, email, and social media',
      icon: MessageSquare,
      preview: 'Human-like voice agents with real-time conversation flow',
      link: '/features#multi-channel',
      color: '#00DDFF'
    },
    {
      title: 'Customer Journey',
      description: 'Visualize the complete customer support workflow with interactive timeline',
      icon: Route,
      preview: 'Horizontal parallax timeline with 6 automated stages',
      link: '/features#customer-journey',
      color: '#FFD700'
    }
  ];

  const benefits = [
    {
      title: '70% Automation',
      description: 'Intelligent automation handles routine inquiries while humans focus on complex issues',
      icon: Zap,
      link: '/features'
    },
    {
      title: 'Real-time Metrics',
      description: 'Comprehensive BI dashboards with 20+ KPI metrics for data-driven decisions',
      icon: BarChart3,
      link: '/features'
    },
    {
      title: 'Seamless Integrations',
      description: '50+ pre-built integrations with popular CRM, communication, and analytics tools',
      icon: TrendingUp,
      link: '/integrations'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA] pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-bold font-rajdhani mb-8 leading-tight">
              Customer Support as a <span className="text-[#00FF41]">Growth Engine</span>, Powered by AI + BI
            </h1>
            
            <p className="text-xl text-[rgb(161,161,170)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your customer service into a competitive advantage with our sub-50ms AI routing platform. 
              Reduce costs by 40-60% while improving satisfaction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
              <Link to="/features">
                <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                  <Calculator size={24} />
                  <span>Calculate ROI</span>
                </Button>
              </Link>
              
              <Link to="/demo-request">
                <Button 
                  variant="outline"
                  className="border-[#00FF41] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] px-8 py-4 text-lg rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                >
                  <Play size={24} />
                  <span>Request Your Demo</span>
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '50ms', label: 'Average Response Time' },
                { value: '70%', label: 'Automation Rate' },
                { value: '99.9%', label: 'Platform Uptime' },
                { value: '60%', label: 'Cost Reduction' }
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

      {/* Feature Cards Section */}
      <section className="py-20 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-6 font-rajdhani">
              Experience Our Core Features
            </h2>
            <p className="text-xl text-[rgb(161,161,170)] max-w-3xl mx-auto">
              Get hands-on with the tools that power next-generation customer support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,255,65,0.3)] transition-all duration-300 h-full group cursor-pointer">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: `${feature.color}20` }}
                        >
                          <Icon size={32} style={{ color: feature.color }} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-[rgb(161,161,170)] mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="bg-[rgba(0,255,65,0.05)] border border-[rgba(0,255,65,0.2)] rounded-lg p-4 mb-6">
                        <p className="text-sm text-[#00FF41] font-medium">
                          {feature.preview}
                        </p>
                      </div>

                      <Link to={feature.link}>
                        <Button 
                          variant="ghost"
                          className="w-full justify-between text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] group"
                        >
                          <span>Explore Feature</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why SentraTech Strip */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-rajdhani">
              Why Choose SentraTech?
            </h2>
            <p className="text-lg text-[rgb(161,161,170)]">
              The competitive advantages that set us apart
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="w-20 h-20 bg-[rgba(0,255,65,0.1)] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={40} className="text-[#00FF41]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00FF41] transition-colors">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-[rgb(161,161,170)] mb-6 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  <Link to={benefit.link}>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-[rgba(0,255,65,0.3)] text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] group"
                    >
                      <span>Learn More</span>
                      <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;