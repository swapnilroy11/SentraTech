import React from 'react';
import { X, Download, Mail, Phone, Calendar, MapPin, FileText } from 'lucide-react';
import { BrandColors } from '../../config/BrandingConfig';

const DetailDrawer = ({ isOpen, onClose, data, title = 'Details', type = 'generic' }) => {
  if (!isOpen) return null;

  const renderFieldValue = (key, value) => {
    if (value === null || value === undefined || value === '') return '-';
    
    switch (key) {
      case 'email':
      case 'work_email':
        return (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
              {value}
            </a>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a href={`tel:${value}`} className="text-blue-600 hover:underline">
              {value}
            </a>
          </div>
        );
      case 'created_at':
      case 'timestamp':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(value).toLocaleString()}</span>
          </div>
        );
      case 'resume_url':
      case 'resume_filename':
        return (
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-400" />
            {value.startsWith('http') ? (
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View Resume
              </a>
            ) : (
              <span>{value}</span>
            )}
          </div>
        );
      case 'roi_percentage':
      case 'cost_reduction':
        return `${Number(value).toFixed(1)}%`;
      case 'monthly_savings':
      case 'annual_savings':
      case 'bpo_spending':
      case 'sentratech_spending':
        return `$${Number(value).toLocaleString()}`;
      case 'status':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(value)}`}>
            {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
          </span>
        );
      default:
        return String(value);
    }
  };

  const getStatusStyle = (status) => {
    switch (String(status).toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getFieldLabel = (key) => {
    const labels = {
      id: 'ID',
      email: 'Email',
      work_email: 'Work Email',
      full_name: 'Full Name',
      applicant_name: 'Applicant Name',
      company_name: 'Company',
      phone: 'Phone',
      country: 'Country',
      call_volume: 'Call Volume',
      interaction_volume: 'Interaction Volume',
      monthly_volume: 'Monthly Volume',
      total_volume: 'Total Volume',
      roi_percentage: 'ROI Percentage',
      monthly_savings: 'Monthly Savings',
      annual_savings: 'Annual Savings',
      bpo_spending: 'BPO Spending',
      sentratech_spending: 'SentraTech Spending',
      cost_reduction: 'Cost Reduction',
      plan_selected: 'Plan Selected',
      industry: 'Industry',
      company_size: 'Company Size',
      message: 'Message',
      notes: 'Notes',
      position_applied: 'Position Applied',
      experience_level: 'Experience Level',
      resume_url: 'Resume',
      resume_filename: 'Resume File',
      cover_letter: 'Cover Letter',
      linkedin_profile: 'LinkedIn Profile',
      expected_salary: 'Expected Salary',
      availability: 'Availability',
      source: 'Source',
      status: 'Status',
      created_at: 'Created At',
      timestamp: 'Timestamp',
      client_info: 'Client Info'
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const excludeFields = ['id', 'client_info', '__v'];
  const displayFields = Object.entries(data || {}).filter(([key]) => !excludeFields.includes(key));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Submission ID: {data?.id}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Export this specific record
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${type}-${data?.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
                title="Export Data"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Status and Key Info */}
              {data?.status && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Status
                    </span>
                    {renderFieldValue('status', data.status)}
                  </div>
                </div>
              )}
              
              {/* All Fields */}
              <div className="grid grid-cols-1 gap-4">
                {displayFields.map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 dark:border-gray-700 pb-3">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getFieldLabel(key)}
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {typeof value === 'object' && value !== null ? (
                          <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          renderFieldValue(key, value)
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Client Information */}
              {data?.client_info && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Client Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      {data.client_info.user_agent && (
                        <div>
                          <span className="font-medium">User Agent:</span>
                          <div className="text-gray-600 dark:text-gray-400 break-all">
                            {data.client_info.user_agent}
                          </div>
                        </div>
                      )}
                      {data.client_info.url && (
                        <div>
                          <span className="font-medium">URL:</span>
                          <div className="text-blue-600 hover:underline">
                            <a href={data.client_info.url} target="_blank" rel="noopener noreferrer">
                              {data.client_info.url}
                            </a>
                          </div>
                        </div>
                      )}
                      {data.client_info.referrer && (
                        <div>
                          <span className="font-medium">Referrer:</span>
                          <div className="text-gray-600 dark:text-gray-400">
                            {data.client_info.referrer}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  // Update status logic here
                  console.log('Update status for:', data?.id);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;