import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BrandColors } from '../../config/BrandingConfig';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  color = BrandColors.PRIMARY,
  loading = false 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };
  
  const getTrendColor = () => {
    if (trend === 'up') return BrandColors.SUCCESS;
    if (trend === 'down') return BrandColors.ERROR;
    return BrandColors.TEXT_MUTED_DARK;
  };

  const TrendIcon = getTrendIcon();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        {Icon && (
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: color + '20' }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        {subtitle && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </div>
        )}
      </div>

      {/* Trend */}
      {(trend && trendValue) && (
        <div className="flex items-center space-x-1">
          <TrendIcon 
            className="w-4 h-4" 
            style={{ color: getTrendColor() }}
          />
          <span 
            className="text-sm font-medium"
            style={{ color: getTrendColor() }}
          >
            {trendValue}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;