import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Linkedin, X, Facebook, Mail, Phone, 
  MapPin, ArrowRight, ExternalLink, MessageSquare,
  Zap, Shield, Globe, Instagram
} from 'lucide-react';
import SentraTechLogo from './SentraTechLogo';
import NewsletterSubscribe from './NewsletterSubscribe';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'ROI Calculator', href: '/roi-calculator' },
      { name: 'Security', href: '/security' },
      { name: 'Pricing', href: '/pricing' }
    ],
    solutions: [
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Demo Request', href: '/demo-request' },
      { name: 'Contact Sales', href: '/contact-sales-management' }
    ],
    legal: [
      { name: 'Support Center', href: '/support-center' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Terms & Conditions', href: '/terms-of-service' }
    ],
    company: [
      { name: 'About Us', href: '/about-us' },
      { name: 'Leadership Team', href: '/leadership-team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Investor Relations', href: '/investor-relations' }
    ]
  };

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/sentratechltd/', label: 'LinkedIn' },
    { icon: X, href: '#', label: 'X (Twitter)' },
    { icon: Facebook, href: 'https://www.facebook.com/sentratechltd', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="bg-[rgb(30,30,30)] border-t border-[rgba(255,255,255,0.1)] mt-20">
      <div className="container mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Brand + Contact Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="mb-4 -ml-2">
                <SentraTechLogo 
                  width={38} 
                  height={38} 
                  showText={true} 
                  textColor="#00FF41"
                  className="-mt-1"
                />
              </div>
              
              <p className="text-[rgb(204,204,204)] text-sm leading-relaxed">
                AI-powered customer support platform. Reduce costs by 40-60% while improving satisfaction scores.
              </p>
              
              {/* Contact Information */}
              <div className="space-y-3 pt-2">
                {/* Email */}
                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-[#00FF41]" />
                  <a href="mailto:info@sentratech.net" className="text-[rgb(204,204,204)] hover:text-[#00FF41] transition-colors text-sm">
                    info@sentratech.net
                  </a>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-[#00FF41]" />
                  <a href="tel:+447424293951" className="text-[rgb(204,204,204)] hover:text-[#00FF41] transition-colors text-sm">
                    +44 7424 293951
                  </a>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2">
                  <MapPin size={14} className="text-[#00FF41]" />
                  <span className="text-[rgb(204,204,204)] text-sm">
                    London, UK
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* Product */}
              <div>
                <h3 className="text-white font-bold text-sm mb-5 uppercase">PRODUCT</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <Link 
                        to={link.href}
                        className="text-[rgb(204,204,204)] hover:text-[#00FF41] transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <h3 className="text-white font-bold text-sm mb-5 uppercase">SOLUTIONS</h3>
                <ul className="space-y-3">
                  {footerLinks.solutions.map((link, index) => (
                    <li key={index}>
                      <Link 
                        to={link.href}
                        className="text-[rgb(204,204,204)] hover:text-[#00FF41] transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-white font-bold text-sm mb-5 uppercase">LEGAL</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link 
                        to={link.href}
                        className="text-[rgb(204,204,204)] hover:text-[#00FF41] transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-white font-bold text-sm mb-5 uppercase">COMPANY</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link 
                        to={link.href}
                        className="text-[rgb(204,204,204)] hover:text-[#00FF41] transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription Section - Centered */}
        <div className="py-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-white font-bold text-2xl mb-4">Stay Updated</h2>
            <p className="text-[rgb(204,204,204)] text-base mb-8 leading-relaxed">
              Get the latest updates on product features and industry insights.
            </p>
            <div className="flex justify-center items-center space-x-4 max-w-lg mx-auto">
              <NewsletterSubscribe />
            </div>
            <p className="text-xs text-[rgb(153,153,153)] mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <p className="text-[rgb(153,153,153)] text-sm">
              © {currentYear} SentraTech. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-8 h-8 flex items-center justify-center text-[rgb(153,153,153)] hover:text-[#00FF41] transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;