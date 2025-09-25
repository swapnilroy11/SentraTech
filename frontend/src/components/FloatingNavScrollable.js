import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

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
      {/* Global CSS for floating navigation - exactly as specified */}
      <style jsx global>{`
        #quickNav {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          background: rgba(26, 31, 58, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 30px;
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        #quickNav.expanded {
          width: auto;
          height: auto;
          border-radius: 30px;
          padding: 10px;
          min-width: 200px;
        }

        #quickNav button {
          width: 60px;
          height: 60px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 30px;
          transition: all 0.3s ease;
          position: relative;
        }

        #quickNav:hover {
          transform: translateY(-50%) scale(1.05);
          box-shadow: 0 6px 30px rgba(0, 212, 255, 0.4);
        }

        .hamburger-icon {
          color: #00d4ff;
          font-size: 24px;
          font-weight: bold;
          transition: transform 0.3s ease;
          user-select: none;
        }

        #quickNav.expanded .hamburger-icon {
          transform: rotate(180deg);
        }

        #quickNav ul {
          display: none;
          list-style: none;
          padding: 0;
          margin: 10px 0 0 0;
        }

        #quickNav.expanded ul {
          display: block;
          animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #quickNav li {
          margin-bottom: 8px;
          border-radius: 20px;
          background: rgba(0, 212, 255, 0.08);
          border: 1px solid rgba(0, 212, 255, 0.2);
          transition: all 0.2s ease;
          min-height: 44px; /* Touch-friendly size */
        }

        #quickNav li:last-child {
          margin-bottom: 0;
        }

        #quickNav li:hover,
        #quickNav li:focus-within {
          background: rgba(0, 212, 255, 0.15);
          border-color: rgba(0, 212, 255, 0.4);
          transform: translateX(3px);
          box-shadow: 0 2px 10px rgba(0, 212, 255, 0.2);
        }

        #quickNav li a {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          text-decoration: none;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          width: 100%;
          min-height: 44px;
          border-radius: 20px;
          transition: all 0.2s ease;
        }

        #quickNav li a:hover,
        #quickNav li a:focus {
          color: #00d4ff;
          outline: 2px solid rgba(0, 212, 255, 0.3);
          outline-offset: 2px;
        }

        #quickNav .menu-icon {
          margin-right: 12px;
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design - Touch-friendly on mobile */
        @media (max-width: 480px) {
          #quickNav {
            left: 15px;
            width: 70px;
            height: 70px;
          }

          #quickNav button {
            width: 70px;
            height: 70px;
          }

          .hamburger-icon {
            font-size: 28px;
          }

          #quickNav li {
            min-height: 48px; /* Larger touch target on mobile */
          }

          #quickNav li a {
            padding: 14px 18px;
            font-size: 16px;
            min-height: 48px;
          }

          #quickNav.expanded {
            min-width: 220px;
          }
        }

        /* Ensure high contrast for accessibility */
        @media (prefers-contrast: high) {
          #quickNav {
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00d4ff;
          }
          
          #quickNav li {
            background: rgba(0, 212, 255, 0.2);
            border-color: #00d4ff;
          }
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          #quickNav,
          #quickNav *,
          @keyframes slide-down {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Floating Navigation Component */}
      <div 
        id="quickNav" 
        className={isExpanded ? 'expanded' : ''}
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

export default FloatingNavScrollable;