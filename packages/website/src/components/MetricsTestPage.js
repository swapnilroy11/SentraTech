import React from 'react';
import LiveMetrics from './LiveMetrics';

const MetricsTestPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Real-time Metrics Dashboard
          </h1>
          <p className="text-xl text-[#00FF41] max-w-2xl mx-auto">
            Live performance metrics with automatic updates every 5 seconds
          </p>
        </div>
        
        <LiveMetrics />
        
        <div className="mt-12 text-center">
          <div className="bg-[rgb(26,28,30)] border border-[rgba(0,255,65,0.3)] rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">
              About This Dashboard
            </h3>
            <p className="text-[rgb(161,161,170)] text-sm leading-relaxed">
              This live metrics dashboard demonstrates real-time data updates with realistic variations. 
              All metrics are generated with SentraTech-appropriate values and update automatically 
              to simulate a production environment. The data includes response times, automation rates, 
              customer satisfaction, and operational KPIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsTestPage;