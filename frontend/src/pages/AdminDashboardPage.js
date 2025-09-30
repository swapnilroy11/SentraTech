import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Settings, BarChart3, Users, Mail, FileText, Briefcase, UserCheck, ArrowLeft, ExternalLink } from 'lucide-react';

const AdminDashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [stats, setStats] = useState({
    demo_requests: 0,
    roi_reports: 0,
    contact_sales: 0,
    newsletter_subscribers: 0,
    job_applications: 0,
    total_submissions: 0
  });
  const [loading, setLoading] = useState(false);

  // Simple authentication check
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('admin_authenticated');
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
      fetchDashboardStats();
    }
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.email === 'admin@sentratech.net' && credentials.password === 'sentratech2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      fetchDashboardStats();
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setCredentials({ email: '', password: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#00FF41]">SentraTech Admin</h1>
            <p className="text-gray-400 mt-2">Sign in to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-[#00FF41] focus:outline-none"
                placeholder="admin@sentratech.net"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-[#00FF41] focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              onClick={() => window.close()}
              className="text-gray-400 hover:text-gray-300 text-sm underline bg-transparent border-0 p-0"
            >
              ← Back to Website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const dashboardItems = [
    { icon: BarChart3, label: 'Demo Requests', count: stats.demo_requests, color: 'text-blue-400' },
    { icon: FileText, label: 'ROI Reports', count: stats.roi_reports, color: 'text-green-400' },
    { icon: Users, label: 'Contact Sales', count: stats.contact_sales, color: 'text-purple-400' },
    { icon: Mail, label: 'Newsletter', count: stats.newsletter_subscribers, color: 'text-orange-400' },
    { icon: UserCheck, label: 'Job Applications', count: stats.job_applications, color: 'text-red-400' },
    { icon: Briefcase, label: 'Total Submissions', count: stats.total_submissions, color: 'text-[#00FF41]' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Settings className="text-[#00FF41]" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-[#00FF41]">SentraTech Admin</h1>
              <p className="text-sm text-gray-400">Dashboard Overview</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">admin@sentratech.net</span>
            <Button
              onClick={() => {
                const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const dashboardUrl = isDevelopment ? 'http://localhost:3001' : 'https://admin.sentratech.net';
                window.open(dashboardUrl, '_blank');
              }}
              className="bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm px-3 py-1"
              title="Open Full Dashboard"
            >
              <ExternalLink size={16} className="mr-1" />
              Full Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>
            <div className="flex items-center text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Real-time: Connected
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading dashboard data...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={item.color} size={32} />
                      <span className="text-2xl font-bold text-white">{item.count}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">{item.label}</h3>
                    <div className="text-sm text-gray-500">
                      {index === dashboardItems.length - 1 ? 'All submissions combined' : 'Recent submissions'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={() => window.open('http://localhost:3001/demo-requests', '_blank')}
              className="bg-gray-700 hover:bg-gray-600 text-left justify-start p-4 h-auto"
            >
              <BarChart3 className="mr-3" size={20} />
              <div>
                <div className="font-medium">View Demo Requests</div>
                <div className="text-sm text-gray-400">Manage incoming demo requests</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => window.open('http://localhost:3001/contact-sales', '_blank')}
              className="bg-gray-700 hover:bg-gray-600 text-left justify-start p-4 h-auto"
            >
              <Users className="mr-3" size={20} />
              <div>
                <div className="font-medium">Contact Sales</div>
                <div className="text-sm text-gray-400">Review sales inquiries</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => window.open('http://localhost:3001/newsletter', '_blank')}
              className="bg-gray-700 hover:bg-gray-600 text-left justify-start p-4 h-auto"
            >
              <Mail className="mr-3" size={20} />
              <div>
                <div className="font-medium">Newsletter Subscribers</div>
                <div className="text-sm text-gray-400">Manage email subscribers</div>
              </div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;