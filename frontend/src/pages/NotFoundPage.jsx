// SentraTech Custom 404 Error Page
// SEO-optimized 404 page with navigation to key sections

import React from 'react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';

const NotFoundPage = () => {
  const popularPages = [
    {
      title: "Features",
      description: "Explore our AI-powered customer support capabilities",
      path: "/features",
      icon: "🚀"
    },
    {
      title: "Pricing",
      description: "View our transparent pricing plans starting at $399/mo",
      path: "/pricing", 
      icon: "💰"
    },
    {
      title: "ROI Calculator",
      description: "Calculate potential savings with AI automation",
      path: "/roi-calculator",
      icon: "📊"
    },
    {
      title: "Request Demo",
      description: "See SentraTech in action with a personalized demo",
      path: "/demo-request",
      icon: "🎯"
    }
  ];

  return (
    <>
      <SEOManager
        customTitle="Page Not Found - SentraTech"
        customDescription="The page you're looking for doesn't exist. Explore SentraTech's AI customer support features, pricing, and request a demo."
        noIndex={true}
      />
      
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#00FF41] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 opacity-3 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* 404 Hero Section */}
            <div className="mb-16">
              <div className="text-8xl md:text-9xl font-bold text-[#00FF41] mb-8 font-mono">
                404
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Page Not Found
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                The page you're looking for seems to have vanished into the digital void. 
                Don't worry – our AI can help you find what you need.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/"
                  className="px-8 py-4 bg-[#00FF41] text-black font-semibold rounded-lg hover:bg-[#00DD38] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#00FF41]/25"
                >
                  🏠 Return Home
                </Link>
                
                <Link 
                  to="/demo-request"
                  className="px-8 py-4 border-2 border-[#00FF41] text-[#00FF41] font-semibold rounded-lg hover:bg-[#00FF41] hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  📞 Get Help
                </Link>
              </div>
            </div>
            
            {/* Popular Pages Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-white">
                Popular Destinations
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularPages.map((page, index) => (
                  <Link
                    key={index}
                    to={page.path}
                    className="group p-6 bg-gray-900/50 border border-gray-700 rounded-xl hover:border-[#00FF41] transition-all duration-300 transform hover:scale-105 hover:bg-gray-800/50"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {page.icon}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#00FF41] transition-colors duration-300">
                      {page.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {page.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Search Suggestions */}
            <div className="bg-gray-900/30 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Looking for something specific?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-lg font-semibold text-[#00FF41] mb-3">
                    🤖 AI Customer Support
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <Link to="/features" className="hover:text-[#00FF41] transition-colors">70% Automation Rate</Link></li>
                    <li>• <Link to="/features" className="hover:text-[#00FF41] transition-colors">Omnichannel Support</Link></li>
                    <li>• <Link to="/features" className="hover:text-[#00FF41] transition-colors">Real-time Analytics</Link></li>
                    <li>• <Link to="/case-studies" className="hover:text-[#00FF41] transition-colors">Success Stories</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-[#00FF41] mb-3">
                    💼 Business Solutions
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <Link to="/pricing" className="hover:text-[#00FF41] transition-colors">Pricing Plans</Link></li>
                    <li>• <Link to="/security" className="hover:text-[#00FF41] transition-colors">Enterprise Security</Link></li>
                    <li>• <Link to="/roi-calculator" className="hover:text-[#00FF41] transition-colors">Cost Savings Calculator</Link></li>
                    <li>• <Link to="/demo-request" className="hover:text-[#00FF41] transition-colors">Schedule Demo</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">
                Still can't find what you're looking for?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="mailto:info@sentratech.net"
                  className="text-[#00FF41] hover:text-[#00DD38] transition-colors font-medium"
                >
                  📧 info@sentratech.net
                </a>
                
                <span className="hidden sm:block text-gray-600">|</span>
                
                <a 
                  href="tel:+1-800-SENTRA-1"
                  className="text-[#00FF41] hover:text-[#00DD38] transition-colors font-medium"
                >
                  📞 1-800-SENTRA-1
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#00FF41] rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-[#00FF41] rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </>
  );
};

export default NotFoundPage;