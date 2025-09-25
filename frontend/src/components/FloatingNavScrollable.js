import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const FloatingNavScrollable = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Navigation items
  const navigationItems = [
    { path: '/#home', label: 'Home', icon: '🏠' },
    { path: '/#features', label: 'Beyond', icon: '⚡' },
    { path: '/#customer-journey', label: 'Journey', icon: '🛣️' },
    { path: '/roi-calculator', label: 'ROI Calc', icon: '📊' },
    { path: '/pricing', label: 'Better', icon: '💰' },
    { path: '/demo-request', label: 'Contact', icon: '📞' }
  ];

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMenuItemClick = () => {
    setIsExpanded(false);
  };

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (isExpanded && !event.target.closest('#floatNav')) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  return (
    <>
      {/* Custom CSS Styles */}
      <style jsx>{`
        #floatNav {
          position: absolute;
          left: 20px;
          top: 200px;
          width: 60px;
          height: 60px;
          background: rgba(26, 31, 58, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 30px;
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
          z-index: 999;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        #floatNav.expanded {
          width: auto;
          height: auto;
          border-radius: 25px;
          padding: 15px;
          min-width: 200px;
        }

        #floatNav button {
          width: 100%;
          height: 60px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 30px;
          transition: all 0.3s ease;
        }

        #floatNav:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 24px rgba(0, 212, 255, 0.4);
        }

        .icon {
          color: #00d4ff;
          font-size: 24px;
          font-weight: bold;
          transition: transform 0.3s ease;
        }

        #floatNav.expanded .icon {
          transform: rotate(180deg);
        }

        #floatNav ul {
          display: none;
          list-style: none;
          padding: 0;
          margin: 10px 0 0 0;
        }

        #floatNav.expanded ul {
          display: block;
          animation: slide-down 0.3s ease;
        }

        #floatNav li {
          width: 180px;
          height: 45px;
          margin-bottom: 10px;
          border-radius: 15px;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          transition: all 0.3s ease;
        }

        #floatNav li:hover {
          background: rgba(0, 212, 255, 0.2);
          border-color: rgba(0, 212, 255, 0.5);
          transform: translateX(5px);
        }

        #floatNav li a {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          text-decoration: none;
          color: #00d4ff;
          font-size: 14px;
          font-weight: 500;
          width: 100%;
          height: 100%;
          border-radius: 15px;
        }

        #floatNav li a:hover {
          color: #ffffff;
        }

        #floatNav li .menu-icon {
          margin-right: 10px;
          font-size: 16px;
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

        /* Responsive Design */
        @media (max-width: 480px) {
          #floatNav {
            width: 70px;
            height: 70px;
          }

          #floatNav button {
            height: 70px;
          }

          .icon {
            font-size: 28px;
          }

          #floatNav li {
            width: 200px;
            height: 50px;
          }

          #floatNav li a {
            padding: 15px;
            font-size: 16px;
          }
        }

        /* Hide on very small screens */
        @media (max-width: 320px) {
          #floatNav {
            display: none;
          }
        }
      `}</style>

      {/* Floating Navigation */}
      <div 
        id="floatNav" 
        className={isExpanded ? 'expanded' : ''}
        style={{
          position: 'absolute',
          left: '20px',
          top: '200px'
        }}
      >
        <button 
          onClick={toggleMenu}
          aria-label="Main navigation"
          aria-expanded={isExpanded}
        >
          <span className="icon">☰</span>
        </button>
        
        <ul role="menu">
          {navigationItems.map((item, index) => (
            <li key={index} role="none">
              {item.path.startsWith('/#') ? (
                <HashLink
                  smooth
                  to={item.path}
                  onClick={handleMenuItemClick}
                  role="menuitem"
                  tabIndex="0"
                >
                  <span className="menu-icon">{item.icon}</span>
                  {item.label}
                </HashLink>
              ) : (
                <Link
                  to={item.path}
                  onClick={handleMenuItemClick}
                  role="menuitem"
                  tabIndex="0"
                >
                  <span className="menu-icon">{item.icon}</span>
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