import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Home, Zap, Users, Calculator, FileText, DollarSign, MessageSquare, Shield, Briefcase, Route } from 'lucide-react';
import { useNavigateWithScroll } from '../hooks/useNavigateWithScroll';

const FloatingNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Navigation items with icons and routes
  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'roi', path: '/features#roi-calculator', icon: Calculator, label: 'ROI Calculator' },
    { id: 'voice', path: '/features#multi-channel', icon: MessageSquare, label: 'Voice Agents' },
    { id: 'journey', path: '/features#customer-journey', icon: Route, label: 'Journey' },
    { id: 'cases', path: '/case-studies', icon: Users, label: 'Case Studies' },
    { id: 'integrations', path: '/integrations', icon: Briefcase, label: 'Integrations' },
    { id: 'security', path: '/security', icon: Shield, label: 'Security' },
    { id: 'pricing', path: '/pricing', icon: DollarSign, label: 'Pricing' },
    { id: 'demo', path: '/demo-request', icon: FileText, label: 'Demo' }
  ];

  const isActivePath = (path) => {
    try {
      if (path === '/' && location.pathname === '/') return true;
      if (path !== '/' && location.pathname.startsWith(path)) return true;
      return false;
    } catch (error) {
      console.error('Error checking active path:', error);
      return false;
    }
  };

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 bg-[rgba(0,255,65,0.1)] backdrop-blur-md border border-[rgba(0,255,65,0.3)] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(0,255,65,0.2)] hover:scale-110 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        {isOpen ? (
          <X size={20} className="text-[#00FF41]" />
        ) : (
          <Menu size={20} className="text-[#00FF41]" />
        )}
      </button>

      {/* Navigation Menu */}
      <div
        className={`absolute left-16 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
          isOpen
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 -translate-x-8 pointer-events-none'
        }`}
      >
        <div className="bg-[rgba(17,17,19,0.95)] backdrop-blur-md border border-[rgba(0,255,65,0.2)] rounded-2xl p-4 min-w-[200px]">
          {/* Company Slogan */}
          <div className="mb-6 pb-4 border-b border-[rgba(255,255,255,0.1)]">
            <div className="text-center">
              <h3 className="text-[#00FF41] font-bold text-sm mb-2 font-rajdhani">
                SentraTech
              </h3>
              <div className="space-y-1 text-xs text-[rgb(161,161,170)]">
                <div className="text-[#00FF41]">Beyond</div>
                <div className="text-[rgb(161,161,170)]">•</div>
                <div className="text-[#00FF41]">Better</div>
                <div className="text-[rgb(161,161,170)]">•</div>
                <div className="text-[#00FF41]">Boundless</div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 text-left ${
                    isActive
                      ? 'bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] text-[#00FF41]'
                      : 'text-[rgb(161,161,170)] hover:text-[#00FF41] hover:bg-[rgba(0,255,65,0.05)]'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-[#00FF41] rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default FloatingNavigation;