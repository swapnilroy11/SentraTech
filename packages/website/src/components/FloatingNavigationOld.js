import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Menu, X, Home, Zap, Users, Calculator, FileText, DollarSign, MessageSquare, Shield, Navigation } from 'lucide-react';
import { useNavigateWithScroll } from '../hooks/useNavigateWithScroll';

const FloatingNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigateToSection = useNavigateWithScroll();

  // Navigation items with icons and routes
  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'metrics', path: '/features#real-time-metrics', icon: Zap, label: 'Real-Time Metrics' },
    { id: 'roi', path: '/roi-calculator', icon: Calculator, label: 'ROI Calculator' },
    { id: 'voice', path: '/features#multi-channel', icon: MessageSquare, label: 'Voice Agents' },
    { id: 'journey', path: '/features#customer-journey', icon: Route, label: 'Journey' },
    { id: 'cases', path: '/case-studies', icon: Users, label: 'Case Studies' },
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
    <>
      {/* Floating Navigation Button - Always Visible */}
      <div 
        className="floating-nav-container"
        style={{
          position: 'fixed',
          left: '20px',
          top: '50vh',
          transform: 'translateY(-50%)',
          zIndex: 99999,
          pointerEvents: 'auto',
          display: window.innerWidth >= 768 ? 'block' : 'none'
        }}
      >
        {/* Toggle Button - Enhanced for maximum visibility */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-floating-nav="true"
          className={`floating-nav-btn w-18 h-18 bg-[rgba(0,255,65,0.25)] backdrop-blur-2xl border-4 border-[rgba(0,255,65,0.7)] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(0,255,65,0.4)] hover:scale-125 hover:border-[rgba(0,255,65,0.9)] shadow-2xl shadow-[rgba(0,255,65,0.5)] ${
            isOpen ? 'rotate-180 bg-[rgba(0,255,65,0.35)] scale-125' : ''
          }`}
          aria-label="Quick Navigation Menu"
          style={{
            position: 'relative',
            zIndex: 100000,
            width: '72px',
            height: '72px',
            animation: 'gentle-pulse 4s ease-in-out infinite'
          }}
        >
          {isOpen ? (
            <X size={28} className="text-[#00FF41] drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,65,0.8))' }} />
          ) : (
            <Menu size={28} className="text-[#00FF41] drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,65,0.8))' }} />
          )}
        </button>

        {/* Navigation Menu Panel */}
        <div
          className={`floating-nav-menu transition-all duration-500 ${
            isOpen
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 -translate-x-8 pointer-events-none'
          }`}
          style={{
            position: 'absolute',
            left: '88px',
            top: '0',
            transform: 'translateY(-50%)',
            zIndex: 99998
          }}
        >
          <div 
            className="bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-2 border-[rgba(0,255,65,0.4)] rounded-2xl p-6 min-w-[260px] shadow-2xl shadow-[rgba(0,255,65,0.3)] max-h-[80vh] overflow-y-auto"
            data-floating-nav="true"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,255,65,0.25), 0 0 0 1px rgba(0,255,65,0.1)'
            }}
          >
          {/* Company Slogan */}
          <div className="mb-6 pb-4 border-b border-[rgba(0,255,65,0.2)]">
            <div className="text-center">
              <h3 className="text-[#00FF41] font-bold text-lg mb-3 font-rajdhani">
                SentraTech
              </h3>
              <div className="space-y-1 text-sm text-[rgb(161,161,170)]">
                <div className="text-[#00FF41] font-medium">Beyond</div>
                <div className="text-[rgb(161,161,170)]">•</div>
                <div className="text-[#00FF41] font-medium">Better</div>
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
                <HashLink
                  key={item.id}
                  smooth
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
                </HashLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default FloatingNavigation;