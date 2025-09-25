import React, { useState, useEffect } from 'react';
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

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Handle Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    // Cleanup on unmount or menu close
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

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

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsMenuOpen(false);
  };

  const handleOverlayClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className="fixed top-0 w-full z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2a2a2a]"
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-4"
            aria-label="SentraTech homepage"
          >
            <SentraTechLogo 
              width={48} 
              height={48} 
              showText={true} 
              textColor="#00FF41"
              className=""
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8" role="menubar">
            {navigationItems.map((item) => (
              <li key={item.path} role="none">
                <HashLink
                  smooth
                  to={item.path}
                  role="menuitem"
                  aria-current={isActivePath(item.path) ? 'page' : undefined}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:ring-offset-2 focus:ring-offset-black ${
                    isActivePath(item.path)
                      ? 'text-[#00FF41] bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)]'
                      : 'text-[#e2e8f0] hover:text-[#00FF41] hover:bg-[rgba(0,255,65,0.05)]'
                  }`}
                >
                  {item.label}
                </HashLink>
              </li>
            ))}
            
            {/* Search Icon */}
            <button className="p-2 text-[#e2e8f0] hover:text-[#00FF41] transition-colors">
              <Search size={20} />
            </button>
          </ul>

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
              onClick={handleMenuToggle}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 text-[#e2e8f0] hover:text-[#00FF41] transition-colors relative z-50"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            isMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none z-40'
          }`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Mobile Menu Panel */}
        <div 
          id="mobile-navigation-menu"
          className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-[#0A0A0A] border-l border-[#2a2a2a] transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
            <SentraTechLogo className="h-8" />
            <button
              onClick={handleMenuClose}
              aria-label="Close navigation menu"
              className="p-2 text-[#e2e8f0] hover:text-[#00FF41] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex flex-col p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <HashLink
                  key={item.path}
                  smooth
                  to={item.path}
                  onClick={handleMenuItemClick}
                  className={`block px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActivePath(item.path)
                      ? 'text-[#00FF41] bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)]'
                      : 'text-[#e2e8f0] hover:text-[#00FF41] hover:bg-[rgba(0,255,65,0.05)]'
                  }`}
                >
                  {item.label}
                </HashLink>
              ))}
            </div>

            {/* Mobile Menu Actions */}
            <div className="mt-6 pt-6 border-t border-[#2a2a2a] space-y-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="w-full px-4 py-2 bg-[#1a1a1a] rounded-xl text-sm text-[#e2e8f0] hover:text-[#00FF41] border border-[#2a2a2a] transition-colors"
              >
                {currentLang === 'en' ? 'বাং' : 'ENG'}
              </button>

              {/* Demo Request Button */}
              <Link to="/demo-request" onClick={handleMenuItemClick} className="block">
                <Button className="w-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 py-3 rounded-xl font-rajdhani">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;