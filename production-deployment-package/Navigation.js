import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import SentraTechLogo from './SentraTechLogo';

const Navigation = () => {
  const location = useLocation();

  // Simplified navigation without mobile menu functionality
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

        </div>
      </div>
    </nav>
  );
};

export default Navigation;