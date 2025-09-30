import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ComponentStyles } from '../../config/BrandingConfig';

const MainLayout = ({ children, onLogout }) => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('sentratech-admin-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('sentratech-admin-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Trigger data refresh in child components
    window.dispatchEvent(new CustomEvent('dashboard-refresh'));
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />
      
      {/* Header */}
      <Header 
        theme={theme}
        onThemeToggle={handleThemeToggle}
        notifications={notifications}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      {/* Main Content */}
      <main 
        className="pt-16 transition-all duration-200"
        style={{ 
          marginLeft: ComponentStyles.SIDEBAR_WIDTH,
          minHeight: '100vh'
        }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;