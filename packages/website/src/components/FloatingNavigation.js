import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Menu, X, Home, Zap, Users, Calculator, Star, DollarSign, Phone } from 'lucide-react';

const FloatingNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Navigation items
  const navigationItems = [
    { path: '/#home', label: 'Home', icon: Home },
    { path: '/#features', label: 'Beyond', icon: Zap },
    { path: '/#customer-journey', label: 'Customer Journey', icon: Users },
    { path: '/roi-calculator', label: 'ROI Calculator', icon: Calculator },
    { path: '/#testimonials', label: 'Testimonials', icon: Star },
    { path: '/pricing', label: 'Better', icon: DollarSign },
    { path: '/demo-request', label: 'Contact', icon: Phone }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('[data-floating-nav]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Hide on mobile screens
  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.6);
          }
        }
        
        .floating-nav-container {
          position: fixed !important;
          z-index: 999999 !important;
        }
        
        .floating-nav-btn {
          position: relative !important;
          z-index: 1000000 !important;
        }
        
        .floating-nav-menu {
          position: absolute !important;
          z-index: 999998 !important;
        }
      `}</style>

      {/* Floating Navigation Container */}
      <div 
        className="floating-nav-container"
        style={{
          position: 'fixed',
          left: '20px',
          top: '50vh',
          transform: 'translateY(-50%)',
          zIndex: 999999,
          pointerEvents: 'auto'
        }}
        data-floating-nav="container"
      >
        {/* Toggle Button - Always Visible and Floating */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-floating-nav="button"
          className={`floating-nav-btn flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'rotate-180 scale-125' : ''
          }`}
          aria-label="Quick Access Navigation Menu"
          style={{
            position: 'relative',
            zIndex: 1000000,
            width: '70px',
            height: '70px',
            background: 'rgba(0, 255, 65, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '3px solid rgba(0, 255, 65, 0.7)',
            borderRadius: '50%',
            boxShadow: '0 8px 32px rgba(0, 255, 65, 0.4), 0 0 0 1px rgba(0, 255, 65, 0.2)',
            animation: 'gentle-pulse 4s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 255, 65, 0.4)';
            e.target.style.transform = 'scale(1.15)';
            e.target.style.borderColor = 'rgba(0, 255, 65, 0.9)';
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.target.style.background = 'rgba(0, 255, 65, 0.25)';
              e.target.style.transform = 'scale(1)';
              e.target.style.borderColor = 'rgba(0, 255, 65, 0.7)';
            }
          }}
        >
          {isOpen ? (
            <X 
              size={30} 
              className="text-[#00FF41]" 
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(0,255,65,0.8))',
                fontWeight: 'bold'
              }} 
            />
          ) : (
            <Menu 
              size={30} 
              className="text-[#00FF41]" 
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(0,255,65,0.8))',
                fontWeight: 'bold'
              }} 
            />
          )}
        </button>

        {/* Navigation Menu Panel */}
        <div
          className={`floating-nav-menu transition-all duration-500 ease-out ${
            isOpen
              ? 'opacity-100 translate-x-0 pointer-events-auto scale-100'
              : 'opacity-0 -translate-x-8 pointer-events-none scale-95'
          }`}
          style={{
            position: 'absolute',
            left: '90px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 999998
          }}
          data-floating-nav="menu"
        >
          <div 
            className="rounded-3xl p-8 min-w-[280px] max-h-[80vh] overflow-y-auto"
            style={{
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(0, 255, 65, 0.4)',
              boxShadow: '0 25px 50px -12px rgba(0, 255, 65, 0.25), 0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            data-floating-nav="panel"
          >
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-[rgba(0,255,65,0.2)] text-center">
              <h3 className="text-[#00FF41] font-bold text-2xl mb-3 font-rajdhani">
                SentraTech
              </h3>
              <div className="space-y-1 text-base text-[rgb(161,161,170)]">
                <div className="text-[#00FF41] font-semibold">Beyond</div>
                <div className="text-[rgb(161,161,170)]">•</div>
                <div className="text-[#00FF41] font-semibold">Better</div>
                <div className="text-[rgb(161,161,170)]">•</div>
                <div className="text-[#00FF41] font-semibold">Boundless</div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <HashLink
                    key={item.path}
                    smooth
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 text-[rgb(218,218,218)] hover:text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] border border-transparent hover:border-[rgba(0,255,65,0.3)] group"
                    style={{
                      textDecoration: 'none'
                    }}
                  >
                    <div className="p-2 bg-[rgba(0,255,65,0.1)] rounded-xl border border-[rgba(0,255,65,0.3)] group-hover:bg-[rgba(0,255,65,0.2)] group-hover:border-[rgba(0,255,65,0.5)] transition-all duration-300">
                      <Icon size={18} className="text-[#00FF41]" />
                    </div>
                    <span className="font-medium text-base">{item.label}</span>
                  </HashLink>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[rgba(0,255,65,0.2)] text-center">
              <p className="text-[rgb(161,161,170)] text-sm">
                Quick Access Navigation
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingNavigation;