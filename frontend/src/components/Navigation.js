import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Button } from './ui/button';
import { Menu, X, Search } from 'lucide-react';
import SentraTechLogo from './SentraTechLogo';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

          {/* CTA Section */}
          <div className="hidden md:flex items-center">
            <Link to="/demo-request">
              <Button 
                className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold px-6 py-2 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle - REMOVED as requested */}
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            isMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none z-40'
          }`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Mobile Menu Panel - Enhanced with better background */}
        <div 
          id="mobile-navigation-menu"
          className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-[#0A0A0A] backdrop-blur-xl border-l-2 border-[rgba(0,255,65,0.6)] transform transition-transform duration-300 ease-in-out z-50 md:hidden shadow-2xl ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            backgroundColor: '#0A0A0A',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 50px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Mobile Menu Header - Enhanced */}
          <div className="flex items-center justify-between p-6 border-b border-[rgba(0,255,65,0.6)] bg-[#0A0A0A]"
               style={{ backgroundColor: '#0A0A0A' }}>
            <SentraTechLogo 
              width={32} 
              height={32} 
              showText={true} 
              textColor="#00FF41"
              className="" 
            />
            <button
              onClick={handleMenuClose}
              aria-label="Close navigation menu"
              className="w-10 h-10 bg-[rgba(0,255,65,0.3)] backdrop-blur-md border border-[rgba(0,255,65,0.5)] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(0,255,65,0.4)] hover:scale-110 shadow-lg"
            >
              <X size={20} className="text-[#00FF41]" />
            </button>
          </div>

          {/* Mobile Menu Items - Enhanced visibility */}
          <div className="flex flex-col p-6 bg-[#0A0A0A]" style={{ backgroundColor: '#0A0A0A' }}>
            <div className="space-y-3">
              {navigationItems.map((item) => (
                <HashLink
                  key={item.path}
                  smooth
                  to={item.path}
                  onClick={handleMenuItemClick}
                  className={`block px-6 py-4 rounded-xl transition-all duration-200 font-medium border ${
                    isActivePath(item.path)
                      ? 'text-[#00FF41] bg-[rgba(0,255,65,0.15)] border-[rgba(0,255,65,0.4)] shadow-lg shadow-[rgba(0,255,65,0.2)]'
                      : 'text-[#e2e8f0] hover:text-[#00FF41] hover:bg-[rgba(0,255,65,0.08)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,255,65,0.3)]'
                  }`}
                >
                  {item.label}
                </HashLink>
              ))}
            </div>

            {/* Mobile Menu Actions - Enhanced */}
            <div className="mt-8 pt-6 border-t border-[rgba(0,255,65,0.4)] bg-[#0A0A0A]"
                 style={{ backgroundColor: '#0A0A0A' }}>
              
              {/* Demo Request Button */}
              <Link to="/demo-request" onClick={handleMenuItemClick} className="block">
                <Button className="w-full bg-gradient-to-r from-[#00FF41] to-[#00e83a] text-[#0A0A0A] hover:from-[#00e83a] hover:to-[#00d235] font-semibold px-6 py-4 rounded-xl font-rajdhani shadow-lg shadow-[rgba(0,255,65,0.3)] transform hover:scale-105 transition-all duration-200">
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