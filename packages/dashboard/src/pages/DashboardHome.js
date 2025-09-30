import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Mail, 
  UserCheck, 
  TrendingUp,
  Clock,
  Target,
  DollarSign
} from 'lucide-react';
import KPICard from '../components/dashboard/KPICard';
import SubmissionsChart from '../components/dashboard/SubmissionsChart';
import { BrandColors } from '../config/BrandingConfig';
import { api } from '../App';

const DashboardHome = () => {
  const [kpiData, setKpiData] = useState({
    total_submissions: { value: 0, trend: 'up', change: '+0%' },
    conversion_rates: { value: '0%', trend: 'up', change: '+0%' },
    average_roi: { value: '0%', trend: 'up', change: '+0%' },
    demo_conversion: { value: '0%', trend: 'up', change: '+0%' },
    lead_response_time: { value: '0h', trend: 'down', change: '-0%' },
    monthly_applicants: { value: 0, trend: 'up', change: '+0%' }
  });
  
  const [submissionCounts, setSubmissionCounts] = useState({
    roi_calculator: 0,
    demo_requests: 0,
    contact_sales: 0,
    newsletter: 0,
    job_applications: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // 30 seconds
    
    // Listen for refresh events
    window.addEventListener('dashboard-refresh', fetchDashboardData);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('dashboard-refresh', fetchDashboardData);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch KPI stats
      const statsResponse = await api.get('/dashboard/stats');
      if (statsResponse.data.success) {
        const stats = statsResponse.data.stats;
        
        // Calculate KPIs
        const totalSubmissions = stats.total_submissions || 0;
        const avgROI = calculateAverageROI(stats);
        const conversionRate = calculateConversionRate(stats);
        
        setKpiData({
          total_submissions: { 
            value: totalSubmissions, 
            trend: 'up', 
            change: '+12%' 
          },
          conversion_rates: { 
            value: `${conversionRate}%`, 
            trend: 'up', 
            change: '+2.3%' 
          },
          average_roi: { 
            value: `${avgROI}%`, 
            trend: 'up', 
            change: '+15.2%' 
          },
          demo_conversion: { 
            value: '23%', 
            trend: 'up', 
            change: '+5.1%' 
          },
          lead_response_time: { 
            value: '2.4h', 
            trend: 'down', 
            change: '-18%' 
          },
          monthly_applicants: { 
            value: stats.job_applications || 0, 
            trend: 'up', 
            change: '+34%' 
          }
        });
        
        setSubmissionCounts({
          roi_calculator: stats.roi_reports || 0,
          demo_requests: stats.demo_requests || 0,
          contact_sales: stats.contact_sales || 0,
          newsletter: stats.newsletter_subscribers || 0,
          job_applications: stats.job_applications || 0
        });
      }
      
      // Generate chart data (in a real app, this would come from the API)
      generateChartData();
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageROI = (stats) => {
    // This would calculate from actual ROI data
    return 45; // Sample value
  };

  const calculateConversionRate = (stats) => {
    const total = stats.total_submissions || 1;
    const demos = stats.demo_requests || 0;
    return Math.round((demos / total) * 100);
  };

  const generateChartData = () => {
    // Generate sample chart data
    const data = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      roi_calculator: Math.floor(Math.random() * 10) + 5,
      demo_requests: Math.floor(Math.random() * 8) + 3,
      contact_sales: Math.floor(Math.random() * 6) + 2,
      newsletter: Math.floor(Math.random() * 15) + 8,
      job_applications: Math.floor(Math.random() * 4) + 1,
    }));
    setChartData(data);
  };

  const kpiCards = [
    {
      title: 'Total Submissions',
      value: kpiData.total_submissions.value,
      subtitle: 'All form submissions',
      trend: kpiData.total_submissions.trend,
      trendValue: kpiData.total_submissions.change,
      icon: BarChart3,
      color: BrandColors.PRIMARY
    },
    {
      title: 'Conversion Rate',
      value: kpiData.conversion_rates.value,
      subtitle: 'Demo conversion rate',
      trend: kpiData.conversion_rates.trend,
      trendValue: kpiData.conversion_rates.change,
      icon: Target,
      color: BrandColors.SUCCESS
    },
    {
      title: 'Average ROI',
      value: kpiData.average_roi.value,
      subtitle: 'Customer ROI calculations',
      trend: kpiData.average_roi.trend,
      trendValue: kpiData.average_roi.change,
      icon: DollarSign,
      color: BrandColors.ACCENT
    },
    {
      title: 'Demo Conversion',
      value: kpiData.demo_conversion.value,
      subtitle: 'Demo to customer rate',
      trend: kpiData.demo_conversion.trend,
      trendValue: kpiData.demo_conversion.change,
      icon: Calendar,
      color: BrandColors.INFO
    },
    {
      title: 'Response Time',
      value: kpiData.lead_response_time.value,
      subtitle: 'Avg lead response time',
      trend: kpiData.lead_response_time.trend,
      trendValue: kpiData.lead_response_time.change,
      icon: Clock,
      color: BrandColors.WARNING
    },
    {
      title: 'New Applicants',
      value: kpiData.monthly_applicants.value,
      subtitle: 'This month',
      trend: kpiData.monthly_applicants.trend,
      trendValue: kpiData.monthly_applicants.change,
      icon: UserCheck,
      color: BrandColors.ACCENT
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time analytics and key performance indicators
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Live Data
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card, index) => (
          <KPICard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            trend={card.trend}
            trendValue={card.trendValue}
            icon={card.icon}
            color={card.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Trend Chart */}
        <div className="lg:col-span-2">
          <SubmissionsChart 
            data={chartData} 
            type="line"
            loading={loading}
          />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">{submissionCounts.roi_calculator}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">ROI Reports</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{submissionCounts.demo_requests}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Demo Requests</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600">{submissionCounts.contact_sales}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Sales Leads</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-orange-600">{submissionCounts.newsletter}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Newsletter</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">{submissionCounts.job_applications}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Applications</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;