import React from 'react';
import { Button } from './ui/button';
import { 
  Linkedin, Twitter, Youtube, Github, Mail, Phone, 
  MapPin, ArrowRight, ExternalLink, MessageSquare,
  Zap, Shield, Globe
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Platform Overview', href: '#features' },
      { name: 'AI Routing Engine', href: '#' },
      { name: 'Compliance Suite', href: '#' },
      { name: 'Analytics Dashboard', href: '#' },
      { name: 'API Documentation', href: '#' },
      { name: 'Integration Hub', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Leadership Team', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Partner Program', href: '#' },
      { name: 'Investor Relations', href: '#' }
    ],
    resources: [
      { name: 'Customer Stories', href: '#' },
      { name: 'ROI Calculator', href: '#' },
      { name: 'Implementation Guide', href: '#' },
      { name: 'Best Practices', href: '#' },
      { name: 'Webinars', href: '#' },
      { name: 'Support Center', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Compliance', href: '#' },
      { name: 'Data Processing', href: '#' },
      { name: 'Cookie Policy', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="bg-[rgb(26,28,30)] border-t border-[rgba(255,255,255,0.1)] mt-20">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              {/* SentraTech Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 relative">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    {/* SentraTech Logo - Geometric Pattern */}
                    <rect width="48" height="48" rx="8" fill="#F8F9FA" />
                    <g transform="translate(6, 6)">
                      {/* Main geometric pattern - star/compass shape */}
                      <path
                        d="M18 0L24 12L36 6L24 18L36 30L24 24L18 36L12 24L0 30L12 18L0 6L12 12L18 0Z"
                        fill="#0A0A0A"
                      />
                      {/* Center accent */}
                      <circle cx="18" cy="18" r="3" fill="#00FF41" />
                    </g>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#00FF41] text-xl font-bold font-rajdhani tracking-wide">
                    SENTRA
                  </span>
                  <span className="text-[#F8F9FA] text-sm font-semibold font-rajdhani -mt-1">
                    TECH
                  </span>
                </div>
              </div>
              
              <p className="text-[rgb(218,218,218)] text-lg leading-relaxed max-w-md">
                Transforming customer support with AI-powered automation and human expertise. 
                Reduce costs by 40-60% while improving satisfaction scores.
              </p>

              {/* Key Features */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-[#DAFF01]/20 rounded-lg border border-[#DAFF01]/50">
                    <Zap size={16} className="text-[#DAFF01]" />
                  </div>
                  <span className="text-[rgb(218,218,218)] text-sm">Sub-50ms AI Routing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-[#00DDFF]/20 rounded-lg border border-[#00DDFF]/50">
                    <Shield size={16} className="text-[#00DDFF]" />
                  </div>
                  <span className="text-[rgb(218,218,218)] text-sm">Enterprise Compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-[rgb(192,192,192)]/20 rounded-lg border border-[rgb(192,192,192)]/50">
                    <Globe size={16} className="text-[rgb(192,192,192)]" />
                  </div>
                  <span className="text-[rgb(218,218,218)] text-sm">Global Scale Operations</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3 text-[rgb(218,218,218)]">
                  <Mail size={16} className="text-[#DAFF01]" />
                  <span className="text-sm">hello@sentratech.ai</span>
                </div>
                <div className="flex items-center space-x-3 text-[rgb(218,218,218)]">
                  <Phone size={16} className="text-[#00DDFF]" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-[rgb(218,218,218)]">
                  <MapPin size={16} className="text-[rgb(192,192,192)]" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Product Links */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Product</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-[rgb(218,218,218)] hover:text-[#DAFF01] transition-colors text-sm group flex items-center"
                      >
                        <span>{link.name}</span>
                        <ArrowRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-[rgb(218,218,218)] hover:text-[#DAFF01] transition-colors text-sm group flex items-center"
                      >
                        <span>{link.name}</span>
                        <ArrowRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Resources</h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-[rgb(218,218,218)] hover:text-[#DAFF01] transition-colors text-sm group flex items-center"
                      >
                        <span>{link.name}</span>
                        <ArrowRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-[rgb(218,218,218)] hover:text-[#DAFF01] transition-colors text-sm group flex items-center"
                      >
                        <span>{link.name}</span>
                        <ArrowRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-12 border-t border-[rgba(255,255,255,0.1)]">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with SentraTech
            </h3>
            <p className="text-[rgb(218,218,218)] mb-8 max-w-2xl mx-auto">
              Get the latest insights on AI-powered customer support, industry trends, 
              and platform updates delivered to your inbox.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(161,161,170)]" />
                <input 
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl text-white placeholder-[rgb(161,161,170)] focus:outline-none focus:border-[#DAFF01] focus:ring-2 focus:ring-[#DAFF01]/20 transition-all"
                />
              </div>
              <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-200 w-full md:w-auto font-rajdhani">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-[rgb(161,161,170)] text-sm">
              © {currentYear} SentraTech. All rights reserved. 
              <span className="ml-2 text-[rgb(218,218,218)]">Built with AI + Human Intelligence.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-[rgb(161,161,170)] text-sm">Follow us:</span>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl flex items-center justify-center text-[rgb(161,161,170)] hover:text-[#DAFF01] hover:border-[#DAFF01] hover:bg-[#DAFF01]/10 transform hover:scale-110 transition-all duration-200"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            className="bg-gradient-to-r from-[#DAFF01] to-[#00DDFF] text-[rgb(17,17,19)] hover:shadow-2xl hover:shadow-[#DAFF01]/30 font-semibold px-4 py-4 rounded-full transform hover:scale-110 transition-all duration-200"
            aria-label="Open live chat"
          >
            <MessageSquare size={24} />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;