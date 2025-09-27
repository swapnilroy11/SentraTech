import React from 'react';
import { Button } from './ui/button';
import { 
  Linkedin, Twitter, Youtube, Github, Mail, Phone, 
  MapPin, ArrowRight, ExternalLink, MessageSquare,
  Zap, Shield, Globe
} from 'lucide-react';
import SentraTechLogo from './SentraTechLogo';
import NewsletterSubscribe from './NewsletterSubscribe';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Leadership Team', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Investor Relations', href: '#' }
    ],
    support: [
      { name: 'Support Center', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms-of-service' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Compliance', href: '/security' },
      { name: 'Data Processing', href: '/privacy-policy#data-processing' }
    ]
  };

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/sentratechltd/', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="bg-[rgb(26,28,30)] border-t border-[rgba(255,255,255,0.1)] mt-20">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* SentraTech Logo */}
              <SentraTechLogo 
                width={48} 
                height={48} 
                showText={true} 
                textColor="#00FF41"
                className="mb-4"
              />
              
              <p className="text-[rgb(218,218,218)] text-base leading-relaxed max-w-md">
                Transforming customer support with AI-powered automation and human expertise. 
                Reduce costs by 40-60% while improving satisfaction scores.
              </p>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Company Links */}
              <div>
                <h3 className="text-white font-semibold text-base mb-4">Company</h3>
                <ul className="space-y-2">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-[rgb(218,218,218)] hover:text-[#00FF41] transition-colors text-sm group flex items-center"
                      >
                        <span>{link.name}</span>
                        <ArrowRight size={10} className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-[rgb(218,218,218)] hover:text-[#00FF41] transition-colors text-sm group flex items-center"
                      >
                        <span>{link.name}</span>
                        <ArrowRight size={10} className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div className="md:col-span-2">
                <h3 className="text-white font-semibold text-base mb-4">Legal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {footerLinks.legal.map((link, index) => (
                    <div key={index}>
                      <a 
                        href={link.href}
                        className="text-[rgb(218,218,218)] hover:text-[#00FF41] transition-colors text-sm group flex items-center"
                      >
                        <span>{link.name}</span>
                        <ArrowRight size={10} className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-[rgba(255,255,255,0.1)]">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-3">
              Stay Updated with SentraTech
            </h3>
            <p className="text-[rgb(218,218,218)] mb-6 max-w-xl mx-auto text-sm">
              Get the latest insights on AI-powered customer support, industry trends, 
              and platform updates delivered to your inbox.
            </p>
            
            <NewsletterSubscribe />
            
            <p className="text-xs text-[rgb(161,161,170)] mt-3">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-6 border-t border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2 text-[rgb(218,218,218)]">
              <Mail size={16} className="text-[#00FF41]" />
              <a href="mailto:info@sentratech.net" className="hover:text-[#00FF41] transition-colors text-sm">
                info@sentratech.net
              </a>
            </div>
            <div className="flex items-center space-x-2 text-[rgb(218,218,218)]">
              <Phone size={16} className="text-[#00FF41]" />
              <a href="tel:+447424293951" className="hover:text-[#00FF41] transition-colors text-sm">
                +44 7424293951
              </a>
            </div>
            <div className="flex items-center space-x-2 text-[rgb(218,218,218)]">
              <MapPin size={16} className="text-[#00FF41]" />
              <span className="text-sm">London, UK</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            {/* Copyright */}
            <div className="text-[rgb(161,161,170)] text-sm text-center md:text-left">
              © {currentYear} SentraTech. All rights reserved. 
              <span className="block md:inline md:ml-2 text-[rgb(218,218,218)]">Built with AI + Human Intelligence.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-[rgb(161,161,170)] text-sm">Follow us:</span>
              <div className="flex items-center space-x-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-lg flex items-center justify-center text-[rgb(161,161,170)] hover:text-[#00FF41] hover:border-[#00FF41] hover:bg-[#00FF41]/10 transform hover:scale-110 transition-all duration-200"
                    >
                      <Icon size={16} />
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
            className="bg-gradient-to-r from-[#00FF41] to-[#00DDFF] text-[#0A0A0A] hover:shadow-2xl hover:shadow-[#00FF41]/30 font-semibold px-4 py-4 rounded-full transform hover:scale-110 transition-all duration-200 font-rajdhani"
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