import React from 'react';
import { Link } from 'react-router-dom';
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
    careers: [
      { name: 'Open Positions', href: '/careers#open-positions' },
      { name: 'Life at SentraTech', href: '/careers#company-culture' },
      { name: 'Benefits & Perks', href: '/careers#benefits-perks' },
      { name: 'Apply Now', href: '/careers#apply-now' }
    ],
    company: [
      { name: 'About Us', href: '/about-us' },
      { name: 'Leadership Team', href: '/leadership-team' },
      { name: 'Investor Relations', href: '/investor-relations' },
      { name: 'Support Center', href: '/support-center' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Terms & Conditions', href: '/terms-of-service' }
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
              {/* Careers Links */}
              <div>
                <h3 className="text-white font-semibold text-base mb-4">Join Our Team</h3>
                <ul className="space-y-2">
                  {footerLinks.careers.map((link, index) => (
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
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="text-white font-semibold text-base mb-4">Legal</h3>
                <ul className="space-y-2">
                  {footerLinks.legal.map((link, index) => (
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
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-10 border-t border-[rgba(255,255,255,0.1)]">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with SentraTech
            </h3>
            <p className="text-[rgb(218,218,218)] mb-8 max-w-2xl mx-auto leading-relaxed">
              Get the latest insights on AI-powered customer support, industry trends, 
              and platform updates delivered to your inbox.
            </p>
            
            <div className="max-w-md mx-auto mb-4">
              <NewsletterSubscribe />
            </div>
            
            <p className="text-xs text-[rgb(161,161,170)]">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-8 border-t border-[rgba(255,255,255,0.1)]">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2 p-4">
                <div className="w-10 h-10 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded-xl flex items-center justify-center mb-2">
                  <Mail size={18} className="text-[#00FF41]" />
                </div>
                <div>
                  <p className="text-[rgb(161,161,170)] text-xs font-medium uppercase tracking-wide mb-1">
                    Email Us
                  </p>
                  <a 
                    href="mailto:info@sentratech.net" 
                    className="text-[rgb(218,218,218)] hover:text-[#00FF41] transition-colors font-medium"
                  >
                    info@sentratech.net
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2 p-4">
                <div className="w-10 h-10 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded-xl flex items-center justify-center mb-2">
                  <Phone size={18} className="text-[#00FF41]" />
                </div>
                <div>
                  <p className="text-[rgb(161,161,170)] text-xs font-medium uppercase tracking-wide mb-1">
                    Call Us
                  </p>
                  <a 
                    href="tel:+447424293951" 
                    className="text-[rgb(218,218,218)] hover:text-[#00FF41] transition-colors font-medium"
                  >
                    +44 7424 293951
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2 p-4">
                <div className="w-10 h-10 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded-xl flex items-center justify-center mb-2">
                  <MapPin size={18} className="text-[#00FF41]" />
                </div>
                <div>
                  <p className="text-[rgb(161,161,170)] text-xs font-medium uppercase tracking-wide mb-1">
                    Location
                  </p>
                  <span className="text-[rgb(218,218,218)] font-medium">
                    London, UK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col items-center space-y-6">
            {/* Social Links */}
            <div className="flex flex-col items-center space-y-4">
              <p className="text-[rgb(161,161,170)] text-sm font-medium">Follow us</p>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 bg-[rgb(38,40,42)] border border-[rgb(63,63,63)] rounded-xl flex items-center justify-center text-[rgb(161,161,170)] hover:text-[#00FF41] hover:border-[#00FF41] hover:bg-[#00FF41]/10 transform hover:scale-105 transition-all duration-200"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center space-y-2">
              <p className="text-[rgb(161,161,170)] text-sm">
                © {currentYear} SentraTech. All rights reserved.
              </p>
              <p className="text-[rgb(218,218,218)] text-sm font-medium">
                Built with AI + Human Intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Chat button removed - now handled by global ChatWidget component */}
      </div>
    </footer>
  );
};

export default Footer;