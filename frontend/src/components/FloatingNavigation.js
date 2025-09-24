import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Home, 
  Sparkles, 
  Route, 
  Calculator, 
  MessageSquare, 
  DollarSign, 
  Phone,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FloatingNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { t } = useLanguage();

  const navigationItems = [
    {
      id: 'home',
      label: t.floatingNav.items.home,
      icon: Home,
      href: '#',
      offset: 0
    },
    {
      id: 'features',
      label: t.floatingNav.items.features,
      icon: Sparkles,
      href: '#features',
      offset: -100
    },
    {
      id: 'journey',
      label: t.floatingNav.items.journey,
      icon: Route,
      href: '#journey',
      offset: -100
    },
    {
      id: 'roi',
      label: t.floatingNav.items.roi,
      icon: Calculator,
      href: '#roi-calculator',
      offset: -100
    },
    {
      id: 'testimonials',
      label: t.floatingNav.items.testimonials,
      icon: MessageSquare,
      href: '#testimonials',
      offset: -100
    },
    {
      id: 'pricing',
      label: t.floatingNav.items.pricing,
      icon: DollarSign,
      href: '#pricing',
      offset: -100
    },
    {
      id: 'contact',
      label: t.floatingNav.items.contact,
      icon: Phone,
      href: '#contact',
      offset: -100
    }
  ];

  // Handle smooth scrolling
  const scrollToSection = (href, offset = 0) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    } else {
      const element = document.querySelector(href);
      if (element) {
        const elementTop = element.offsetTop + offset;
        window.scrollTo({ top: elementTop, behavior: 'smooth' });
        setActiveSection(href.replace('#', ''));
      }
    }
    setIsOpen(false);
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      // Check each section to determine which is active
      navigationItems.forEach((item) => {
        if (item.href === '#') {
          if (scrollPosition < 300) {
            setActiveSection('home');
          }
        } else {
          const element = document.querySelector(item.href);
          if (element) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              setActiveSection(item.id);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.floating-nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="floating-nav fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
      {/* Menu Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.3)] rounded-full flex items-center justify-center hover:border-[#00FF41] transition-all duration-300 backdrop-blur-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} className="text-[#00FF41]" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={20} className="text-[#00FF41]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active indicator dots */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item, index) => (
              <div
                key={item.id}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-[#00FF41] w-2' 
                    : 'bg-[rgba(255,255,255,0.3)]'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.button>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute left-20 top-0 bg-[rgb(26,28,30)]/95 backdrop-blur-md border border-[rgba(0,255,65,0.3)] rounded-2xl p-4 min-w-[220px]"
          >
            {/* Menu Header */}
            <div className="mb-4 pb-3 border-b border-[rgba(255,255,255,0.1)]">
              <h3 className="text-white font-semibold text-sm font-rajdhani">
                {t.floatingNav.title}
              </h3>
            </div>

            {/* Navigation Items */}
            <div className="space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.href, item.offset)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                      isActive 
                        ? 'bg-[rgba(0,255,65,0.1)] text-[#00FF41] border border-[rgba(0,255,65,0.3)]' 
                        : 'text-[rgb(218,218,218)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 2 }}
                  >
                    <Icon 
                      size={16} 
                      className={`${isActive ? 'text-[#00FF41]' : 'text-[rgb(161,161,170)]'} transition-colors duration-200`} 
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-[#00FF41] rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Menu Footer */}
            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.1)]">
              <div className="text-xs text-[rgb(161,161,170)] text-center">
                SentraTech Navigation
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNavigation;