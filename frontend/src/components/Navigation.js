import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Button } from './ui/button';
import { Menu, X, Search } from 'lucide-react';
import SentraTechLogo from './SentraTechLogo';
import { useLanguage } from '../contexts/LanguageContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { currentLang, toggleLanguage } = useLanguage();

  const navigationItems = [
    { name: 'Home', path: '/', label: 'Home' },
    { name: 'Features', path: '/features', label: 'Features' },
    { name: 'Case Studies', path: '/case-studies', label: 'Case Studies' },
    { name: 'Security', path: '/security', label: 'Security' },
    { name: 'ROI Calculator', path: '/roi-calculator', label: 'ROI Calculator' },
    { name: 'Pricing', path: '/pricing', label: 'Pricing' }
  ];

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <SentraTechLogo 
              width={48} 
              height={48} 
              showText={true} 
              textColor="#00FF41"
              className=""
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <HashLink
                key={item.path}
                smooth
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActivePath(item.path)
                    ? 'text-[#00FF41] bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)]'
                    : 'text-[#e2e8f0] hover:text-[#00FF41] hover:bg-[rgba(0,255,65,0.05)]'
                }`}
              >
                {item.label}
              </HashLink>
            ))}
            
            {/* Search Icon */}
            <button className="p-2 text-[#e2e8f0] hover:text-[#00FF41] transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* CTA and Language Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/demo-request">
              <Button 
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 py-2 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                Request Demo
              </Button>
            </Link>
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 bg-[#1a1a1a] rounded-lg text-sm text-[#e2e8f0] hover:text-[#00FF41] border border-[#2a2a2a]"
            >
              {currentLang === 'en' ? 'বাং' : 'ENG'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#e2e8f0] hover:text-[#00FF41] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#2a2a2a]">
            <div className="flex flex-col space-y-3 pt-4">
              {navigationItems.map((item) => (
                <HashLink
                  key={item.path}
                  smooth
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActivePath(item.path)
                      ? 'text-[#00FF41] bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)]'
                      : 'text-[#e2e8f0] hover:text-[#00FF41] hover:bg-[rgba(0,255,65,0.05)]'
                  }`}
                >
                  {item.label}
                </HashLink>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                <Link to="/demo-request" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 py-2 rounded-xl">
                    Request Demo
                  </Button>
                </Link>
                <button 
                  onClick={toggleLanguage}
                  className="px-3 py-1 bg-[#1a1a1a] rounded-lg text-sm text-[#e2e8f0] hover:text-[#00FF41] border border-[#2a2a2a]"
                >
                  {currentLang === 'en' ? 'বাং' : 'ENG'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;