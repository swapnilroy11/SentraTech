import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Activity, 
  Clock, 
  Zap, 
  Heart, 
  Target, 
  Users, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';

const LiveMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMetrics = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/api/metrics/live`);
      const data = await response.json();
      setMetrics(data);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMetrics();
    
    // Set up interval for real-time updates every 5 seconds
    const interval = setInterval(fetchMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const formatMetric = (value, type) => {
    switch (type) {
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'time':
        return `${value.toFixed(1)}ms`;
      case 'count':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  const getMetricColor = (metricName, value) => {
    const colorMap = {
      response_time_ms: value < 50 ? '#00FF41' : value < 100 ? '#FFD700' : '#FF6B6B',
      automation_rate: value > 0.7 ? '#00FF41' : value > 0.5 ? '#FFD700' : '#FF6B6B',
      customer_satisfaction: value > 0.9 ? '#00FF41' : value > 0.8 ? '#FFD700' : '#FF6B6B',
      resolution_rate: value > 0.9 ? '#00FF41' : value > 0.8 ? '#FFD700' : '#FF6B6B'
    };
    return colorMap[metricName] || '#00FF41';
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-[rgb(17,17,19)] rounded-2xl">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-[#00FF41] animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Live Metrics</h3>
        </div>
        <div className="text-[rgb(161,161,170)]">Loading real-time data...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 bg-[rgb(17,17,19)] rounded-2xl">
        <div className="text-red-400">Failed to load metrics</div>
      </div>
    );
  }

  const metricsConfig = [
    {
      key: 'active_chats',
      label: 'Active Chats',
      icon: Users,
      type: 'count',
      color: '#00DDFF'
    },
    {
      key: 'response_time_ms',
      label: 'Response Time',
      icon: Clock,
      type: 'time',
      color: getMetricColor('response_time_ms', metrics.response_time_ms)
    },
    {
      key: 'automation_rate',
      label: 'Automation Rate',
      icon: Zap,
      type: 'percentage',
      color: getMetricColor('automation_rate', metrics.automation_rate)
    },
    {
      key: 'customer_satisfaction',
      label: 'Customer Satisfaction',
      icon: Heart,
      type: 'percentage',
      color: getMetricColor('customer_satisfaction', metrics.customer_satisfaction)
    },
    {
      key: 'resolution_rate',
      label: 'Resolution Rate',
      icon: Target,
      type: 'percentage',
      color: getMetricColor('resolution_rate', metrics.resolution_rate)
    },
    {
      key: 'daily_volume',
      label: 'Daily Volume',
      icon: TrendingUp,
      type: 'count',
      color: '#9D4EDD'
    },
    {
      key: 'cost_savings',
      label: 'Cost Savings',
      icon: DollarSign,
      type: 'currency',
      color: '#00FF41'
    },
    {
      key: 'agent_utilization',
      label: 'Agent Utilization',
      icon: Activity,
      type: 'percentage',
      color: '#FFD700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-2xl font-bold text-white">Live Metrics Dashboard</h2>
          <Badge className="bg-[rgba(0,255,65,0.1)] text-[#00FF41] border-[#00FF41]/30">
            Real-time
          </Badge>
        </div>
        {lastUpdated && (
          <div className="text-sm text-[rgb(161,161,170)]">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsConfig.map((config) => {
          const IconComponent = config.icon;
          const value = metrics[config.key];
          const formattedValue = formatMetric(value, config.type);

          return (
            <Card 
              key={config.key}
              className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <IconComponent 
                      size={24} 
                      style={{ color: config.color }} 
                    />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></div>
                </div>
                
                <div className="space-y-2">
                  <div 
                    className="text-3xl font-bold font-rajdhani"
                    style={{ color: config.color }}
                  >
                    {formattedValue}
                  </div>
                  <div className="text-[rgb(161,161,170)] text-sm">
                    {config.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="bg-[rgb(26,28,30)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#00FF41] animate-pulse"></div>
            <span className="text-white font-medium">System Status: All systems operational</span>
          </div>
          <div className="text-[rgb(161,161,170)] text-sm">
            Updates every 5 seconds
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;