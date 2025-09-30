import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Mail, 
  UserCheck, 
  Settings,
  PieChart,
  TrendingUp,
  Home,
  LogOut
} from 'lucide-react';
import { BrandColors, ComponentStyles } from '../../config/BrandingConfig';

const Sidebar = ({ onLogout, currentUser = 'admin@sentratech.net' }) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard Home',
      icon: Home,
      description: 'Overview & KPIs'
    },
    {
      path: '/roi-submissions',
      label: 'ROI Submissions', 
      icon: PieChart,
      description: 'ROI Calculator Data',
      badge: 'roi_count'
    },
    {
      path: '/demo-requests',
      label: 'Demo Requests',
      icon: Calendar,
      description: 'Schedule & Follow-ups',
      badge: 'demo_count'
    },
    {
      path: '/sales-leads',
      label: 'Sales Leads',
      icon: Users, 
      description: 'Contact Sales Forms',
      badge: 'sales_count'
    },
    {
      path: '/newsletter-signups',
      label: 'Newsletter Signups',
      icon: Mail,
      description: 'Email Subscribers',
      badge: 'newsletter_count'
    },
    {
      path: '/talent-acquisition', 
      label: 'Talent Acquisition',
      icon: UserCheck,
      description: 'Job Applications',
      badge: 'talent_count'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <aside 
      className="fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 shadow-xl z-40"
      style={{ width: ComponentStyles.SIDEBAR_WIDTH }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ backgroundColor: BrandColors.PRIMARY }}>
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: BrandColors.SENTRA_GREEN }}>
              SentraTech
            </h1>
            <p className="text-sm text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }
                `}
                style={{
                  backgroundColor: isActive ? BrandColors.PRIMARY : 'transparent'
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} 
                  />
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </div>
                
                {item.badge && (
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : BrandColors.ACCENT,
                      color: isActive ? 'white' : 'white'
                    }}
                  >
                    {/* Badge count will be populated by parent component */}
                    •
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <Link
            to="/settings"
            className={`
              group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
              ${location.pathname === '/settings' 
                ? 'text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }
            `}
            style={{
              backgroundColor: location.pathname === '/settings' ? BrandColors.PRIMARY : 'transparent'
            }}
          >
            <Settings className="w-5 h-5" />
            <div>
              <div className="text-sm font-medium">Settings</div>
              <div className="text-xs opacity-75">Configuration</div>
            </div>
          </Link>
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: BrandColors.ACCENT, color: 'white' }}
            >
              {currentUser.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">Admin</div>
              <div className="text-xs text-gray-400 truncate">{currentUser}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;