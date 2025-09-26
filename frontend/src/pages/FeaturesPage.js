import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Calculator, TrendingUp, Users, Clock, Phone, Zap, BarChart3, Activity } from 'lucide-react';
import CustomerJourney from '../components/CustomerJourney';
import SEOManager from '../components/SEOManager';

const FeaturesPage = () => {
  return (
    <>
      {/* SEO Management for Features Page */}
      <SEOManager />
      
      <main role="main" aria-label="SentraTech Features - AI Customer Support Capabilities">
        <div className="min-h-screen bg-[#0A0A0A] text-[#F8F9FA]" id="features-page">
      {/* Hero Section - Balanced spacing */}
      <section className="pt-8 pb-6 relative overflow-hidden" id="features-hero">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-bold font-rajdhani mb-6 leading-tight">
              Features & <span className="text-[#00FF41]">Customer Journey</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[rgb(161,161,170)] mb-16 max-w-4xl mx-auto leading-relaxed">
              Discover how our AI-powered platform transforms customer support through intelligent automation, 
              real-time analytics, and seamless integrations.
            </p>

            {/* Performance Stats Cards - Mimicking Case Studies Page Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              {[
                { value: '47ms', label: 'AI Response Time' },
                { value: '70%', label: 'Automation Rate' },
                { value: '96%', label: 'First Call Resolution' },
                { value: '4.2min', label: 'Average Handle Time' }
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

      {/* Customer Journey Section - Better breathing room */}
      <section id="customer-journey" className="py-10 bg-gradient-to-br from-[rgb(17,17,19)] to-[rgb(26,28,30)] relative">
        <CustomerJourney />
      </section>

      {/* Multi-Channel Support Section - Better breathing room */}
      <section id="multi-channel" className="py-10 bg-[#0A0A0A] relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="w-12 h-12 bg-[#00DDFF]/20 rounded-full flex items-center justify-center border border-[#00DDFF]/50">
                <MessageSquare className="text-[#00DDFF]" size={24} />
              </div>
              <h2 className="text-4xl font-bold text-white font-rajdhani">
                Multi-Channel Support
              </h2>
            </div>
            <p className="text-lg text-[rgb(161,161,170)] max-w-3xl mx-auto mb-2">
              Deliver consistent, intelligent customer experiences across all touchpoints with human-like AI agents.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Voice Agent Demo - Enhanced design */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)] rounded-2xl border border-[rgba(0,221,255,0.3)] p-6 relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00DDFF]/5 rounded-full blur-3xl"></div>
              
              <h3 className="text-xl font-bold text-white mb-5 flex items-center relative z-10">
                <div className="w-8 h-8 bg-[#00DDFF] rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare size={16} className="text-black" />
                </div>
                Human-like Voice Agents
              </h3>
              
              <div className="space-y-3 relative z-10">
                {[
                  { icon: '🎙️', title: 'Natural Speech Processing', desc: '95%+ accuracy in understanding customer intent' },
                  { icon: '🗣️', title: 'Conversational Flow', desc: 'Dynamic conversation with context retention' },
                  { icon: '🔄', title: 'Seamless Handoffs', desc: 'Intelligent escalation when needed' },
                ].map((item, index) => (
                  <div key={index} className="bg-[#0A0A0A]/80 rounded-lg p-3 border border-[rgba(255,255,255,0.1)] backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-[#00DDFF] text-sm font-semibold">{item.title}</p>
                        <p className="text-white text-xs">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Channel Overview - Enhanced design */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)] rounded-2xl border border-[rgba(0,255,65,0.3)] p-6 relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#00FF41]/5 rounded-full blur-3xl"></div>
              
              <h3 className="text-xl font-bold text-white mb-5 relative z-10">
                Unified Channel Management
              </h3>
              
              <div className="space-y-4 relative z-10">
                {[
                  { channel: 'Voice Calls', icon: '📞', feature: 'AI-powered routing & transcription' },
                  { channel: 'Live Chat', icon: '💬', feature: 'Real-time messaging with bot handoffs' },
                  { channel: 'Email Support', icon: '✉️', feature: 'Smart categorization & auto-responses' },
                  { channel: 'Social Media', icon: '📱', feature: 'Multi-platform monitoring' },
                  { channel: 'SMS/WhatsApp', icon: '📲', feature: 'Rich messaging with media support' }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[rgba(0,255,65,0.05)] transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-xl">{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{item.channel}</h4>
                      <p className="text-[rgb(161,161,170)] text-xs">{item.feature}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real-Time Metrics Section */}
      <section id="real-time-metrics" className="py-10 bg-[#0A0A0A] relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="w-12 h-12 bg-[#00DDFF]/20 rounded-full flex items-center justify-center border border-[#00DDFF]/50">
                <BarChart3 className="text-[#00DDFF]" size={24} />
              </div>
              <h2 className="text-4xl font-bold text-white font-rajdhani">
                Real-Time Analytics
              </h2>
            </div>
            <p className="text-lg text-[rgb(161,161,170)] max-w-3xl mx-auto mb-2">
              Monitor your customer support performance with live dashboards and actionable insights.
            </p>
          </motion.div>

          {/* Live Metrics Dashboard */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                icon: Phone, 
                title: 'Active Calls', 
                value: '247', 
                change: '+12%', 
                color: 'text-[#00FF41]',
                bgColor: 'bg-[rgba(0,255,65,0.1)]',
                borderColor: 'border-[rgba(0,255,65,0.3)]'
              },
              { 
                icon: Clock, 
                title: 'Avg Wait Time', 
                value: '1.3min', 
                change: '-8%', 
                color: 'text-[#00DDFF]',
                bgColor: 'bg-[rgba(0,221,255,0.1)]',
                borderColor: 'border-[rgba(0,221,255,0.3)]'
              },
              { 
                icon: Users, 
                title: 'Agents Online', 
                value: '89/92', 
                change: '97%', 
                color: 'text-[#FFD700]',
                bgColor: 'bg-[rgba(255,215,0,0.1)]',
                borderColor: 'border-[rgba(255,215,0,0.3)]'
              },
              { 
                icon: TrendingUp, 
                title: 'Resolution Rate', 
                value: '94.2%', 
                change: '+3%', 
                color: 'text-[#00FF41]',
                bgColor: 'bg-[rgba(0,255,65,0.1)]',
                borderColor: 'border-[rgba(0,255,65,0.3)]'
              }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${metric.bgColor} ${metric.borderColor} border rounded-xl p-6 relative overflow-hidden`}
              >
                {/* Live indicator */}
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[rgb(161,161,170)]">LIVE</span>
                </div>
                
                <div className="flex items-center space-x-3 mb-3">
                  <metric.icon size={20} className={metric.color} />
                  <span className="text-sm text-[rgb(161,161,170)]">{metric.title}</span>
                </div>
                
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-bold font-rajdhani ${metric.color}`}>
                    {metric.value}
                  </span>
                  <span className={`text-sm font-medium ${
                    metric.change.startsWith('+') || metric.change.includes('%') && !metric.change.startsWith('-') 
                      ? 'text-[#00FF41]' 
                      : 'text-[#00DDFF]'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Analytics Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)] rounded-xl border border-[rgba(0,221,255,0.2)] p-6"
            >
              <div className="w-12 h-12 bg-[#00DDFF]/20 rounded-lg flex items-center justify-center mb-4">
                <Activity size={24} className="text-[#00DDFF]" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">Live Performance</h3>
              <ul className="space-y-2 text-[rgb(161,161,170)] text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00DDFF] rounded-full"></div>
                  <span>Real-time agent performance tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00DDFF] rounded-full"></div>
                  <span>Call volume and queue monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00DDFF] rounded-full"></div>
                  <span>Customer satisfaction scores</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00DDFF] rounded-full"></div>
                  <span>Response time analytics</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)] rounded-xl border border-[rgba(0,255,65,0.2)] p-6"
            >
              <div className="w-12 h-12 bg-[#00FF41]/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-[#00FF41]" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">Smart Insights</h3>
              <ul className="space-y-2 text-[rgb(161,161,170)] text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF41] rounded-full"></div>
                  <span>Predictive analytics for call volumes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF41] rounded-full"></div>
                  <span>AI-powered performance recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF41] rounded-full"></div>
                  <span>Automated alerts and notifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#00FF41] rounded-full"></div>
                  <span>Trend analysis and forecasting</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)] rounded-xl border border-[rgba(255,215,0,0.2)] p-6"
            >
              <div className="w-12 h-12 bg-[#FFD700]/20 rounded-lg flex items-center justify-center mb-4">
                <Zap size={24} className="text-[#FFD700]" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">Instant Actions</h3>
              <ul className="space-y-2 text-[rgb(161,161,170)] text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></div>
                  <span>One-click agent reallocation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></div>
                  <span>Real-time coaching suggestions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></div>
                  <span>Dynamic routing adjustments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></div>
                  <span>Emergency escalation protocols</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Live Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 bg-gradient-to-br from-[rgb(26,28,30)] to-[rgb(17,17,19)] rounded-2xl border border-[rgba(0,255,65,0.2)] p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Live Dashboard Preview</h3>
              <p className="text-[rgb(161,161,170)]">Real-time metrics updating every 30 seconds</p>
            </div>
            
            {/* Simulated Live Chart Area */}
            <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-medium">Call Volume Today</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#00FF41]">UPDATING</span>
                </div>
              </div>
              
              {/* Simulated Chart Bars */}
              <div className="flex items-end space-x-2 h-32">
                {[40, 65, 45, 80, 60, 90, 75, 85, 70, 95, 88, 92].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-[#00FF41] to-[#00DDFF] rounded-t opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              
              <div className="flex justify-between mt-2 text-xs text-[rgb(161,161,170)]">
                <span>9AM</span>
                <span>11AM</span>
                <span>1PM</span>
                <span>3PM</span>
                <span>5PM</span>
                <span>Now</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section - Better breathing room */}
      <section className="py-10 bg-[#0A0A0A] relative" id="features-cta">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Enhanced background */}
            <div className="bg-gradient-to-br from-[rgba(0,255,65,0.05)] to-[rgba(0,221,255,0.05)] rounded-3xl border border-[rgba(0,255,65,0.2)] p-8 relative overflow-hidden">
              {/* Background accents */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FF41]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00DDFF]/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-rajdhani">
                  Ready to See Real Results?
                </h2>
                <p className="text-lg text-[rgb(161,161,170)] mb-6">
                  Discover how businesses like yours achieved 60%+ cost reduction while improving customer satisfaction
                </p>
                
                {/* Stats row */}
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  {[
                    { value: '60%+', label: 'Cost Reduction' },
                    { value: '3x', label: 'Faster Resolution' },
                    { value: '95%', label: 'Satisfaction Score' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-[#00FF41] font-rajdhani">{stat.value}</div>
                      <div className="text-sm text-[rgb(161,161,170)]">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                <Link to="/case-studies">
                  <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg shadow-[#00FF41]/25">
                    <span>Explore Case Studies</span>
                    <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        </div>
      </main>
    </>
  );
};

export default FeaturesPage;