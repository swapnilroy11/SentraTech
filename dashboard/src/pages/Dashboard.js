import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
      
      <div className="text-sm text-green-400 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        Real-time: Connected
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Total Submissions" value="0" change="0%" />
        <MetricCard title="Demo Requests" value="0" change="0%" />
        <MetricCard title="ROI Reports" value="0" change="0%" />
        <MetricCard title="Contact Sales" value="0" change="0%" />
        <MetricCard title="Newsletter Subscribers" value="0" change="0%" />
        <MetricCard title="Active Contracts" value="0" change="0%" />
      </div>
    </div>
  );
}

function MetricCard({ title, value, change }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <span className="text-sm text-gray-500">{change}</span>
      </div>
      <div className="text-3xl font-bold text-green-400">{value}</div>
      <div className="text-sm text-gray-500 mt-2">vs previous 7 days</div>
    </div>
  );
}