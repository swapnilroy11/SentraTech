import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', active: location.pathname === '/dashboard' },
    { path: '/demo-requests', label: 'Demo Requests', active: location.pathname === '/demo-requests' },
    { path: '/roi-reports', label: 'ROI Reports', active: location.pathname === '/roi-reports' },
    { path: '/contact-sales', label: 'Contact Sales', active: location.pathname === '/contact-sales' },
    { path: '/newsletter', label: 'Newsletter Subscribers', active: location.pathname === '/newsletter' },
    { path: '/active-contracts', label: 'Active Contracts', active: location.pathname === '/active-contracts' },
    { path: '/candidates', label: 'Talent Acquisition', active: location.pathname === '/candidates' },
    { path: '/settings', label: 'Settings', active: location.pathname === '/settings' },
  ];
  
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-green-400">SentraTech Admin</h1>
        <p className="text-sm text-gray-400 mt-1">Managing forms</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? 'bg-green-400 text-black'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}