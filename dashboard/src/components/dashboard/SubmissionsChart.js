import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { BrandColors } from '../../config/BrandingConfig';

const SubmissionsChart = ({ data = [], type = 'line', loading = false }) => {
  const chartData = useMemo(() => {
    if (!data.length) {
      // Generate sample data for demo
      return Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        roi_calculator: Math.floor(Math.random() * 10) + 5,
        demo_requests: Math.floor(Math.random() * 8) + 3,
        contact_sales: Math.floor(Math.random() * 6) + 2,
        newsletter: Math.floor(Math.random() * 15) + 8,
        job_applications: Math.floor(Math.random() * 4) + 1,
        total: function() { return this.roi_calculator + this.demo_requests + this.contact_sales + this.newsletter + this.job_applications; }
      })).map(item => ({ ...item, total: item.total() }));
    }
    return data;
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Submissions Trend
        </h3>
        <div className="flex items-center space-x-2">
          <select 
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            defaultValue="30"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          {type === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="roi_calculator" 
                stroke={BrandColors.PRIMARY}
                strokeWidth={2}
                name="ROI Calculator"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="demo_requests" 
                stroke={BrandColors.ACCENT}
                strokeWidth={2}
                name="Demo Requests"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="contact_sales" 
                stroke={BrandColors.SUCCESS}
                strokeWidth={2}
                name="Contact Sales"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="newsletter" 
                stroke={BrandColors.INFO}
                strokeWidth={2}
                name="Newsletter"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="job_applications" 
                stroke={BrandColors.WARNING}
                strokeWidth={2}
                name="Job Applications"
                dot={{ r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="roi_calculator" stackId="a" fill={BrandColors.PRIMARY} name="ROI Calculator" />
              <Bar dataKey="demo_requests" stackId="a" fill={BrandColors.ACCENT} name="Demo Requests" />
              <Bar dataKey="contact_sales" stackId="a" fill={BrandColors.SUCCESS} name="Contact Sales" />
              <Bar dataKey="newsletter" stackId="a" fill={BrandColors.INFO} name="Newsletter" />
              <Bar dataKey="job_applications" stackId="a" fill={BrandColors.WARNING} name="Job Applications" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubmissionsChart;