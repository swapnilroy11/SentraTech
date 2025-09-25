import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './FloatingNavScrollable.css';

const FloatingNavScrollable = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Navigation items - exactly as specified in user requirements
  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/roi-calculator', label: 'ROI Calculator', icon: '📈' },
    { path: '/features', label: 'Features', icon: '⚡' },
    { path: '/demo-request', label: 'Demo Request', icon: '▶️' },
    { path: '/#customer-journey', label: 'Customer Journey', icon: '🛤️' }
  ];

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMenuItemClick = () => {
    setIsExpanded(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (isExpanded && !event.target.closest('#quickNav')) {
        setIsExpanded(false);
      }
    };

    // Close menu on Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isExpanded]);

  return (
    <>
      {/* Floating Navigation Component */}
      <div 
        id="quickNav" 
        className={isExpanded ? 'expanded' : ''}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60px',
          height: '60px',
          background: 'rgba(26, 31, 58, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '30px',
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
          zIndex: 9999,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <button 
          onClick={toggleMenu}
          onKeyDown={handleKeyDown}
          aria-label="Main navigation"
          aria-expanded={isExpanded}
          type="button"
        >
          <span className="hamburger-icon">☰</span>
        </button>
        
        <ul role="menu" aria-label="Quick access menu">
          {navigationItems.map((item, index) => (
            <li key={index} role="none">
              {item.path.startsWith('/#') ? (
                <HashLink
                  smooth
                  to={item.path}
                  onClick={handleMenuItemClick}
                  role="menuitem"
                  tabIndex={isExpanded ? 0 : -1}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <span className="menu-icon" role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </HashLink>
              ) : (
                <Link
                  to={item.path}
                  onClick={handleMenuItemClick}
                  role="menuitem"
                  tabIndex={isExpanded ? 0 : -1}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <span className="menu-icon" role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FloatingNavScrollable;