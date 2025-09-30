import React, { useState, useEffect } from 'react';
import { PieChart } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import DetailDrawer from '../components/common/DetailDrawer';
import { TableColumns } from '../types/DataTypes';
import { api } from '../App';

const ROISubmissions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Listen for refresh events
    window.addEventListener('dashboard-refresh', fetchData);
    return () => window.removeEventListener('dashboard-refresh', fetchData);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/forms/roi-reports');
      if (response.data.success) {
        // Transform data to match our schema
        const transformedData = response.data.items.map(item => ({
          id: item.id || item._id,
          timestamp: item.created_at || item.timestamp,
          email: item.email,
          country: item.country,
          call_volume: item.call_volume,
          interaction_volume: item.interaction_volume,
          total_volume: item.total_volume || (item.call_volume + (item.interaction_volume || 0)),
          roi_percentage: item.roi_percentage,
          monthly_savings: item.monthly_savings,
          annual_savings: item.annual_savings,
          bpo_spending: item.bpo_spending,
          sentratech_spending: item.sentratech_spending,
          cost_reduction: item.cost_reduction,
          status: item.status || 'new',
          ...item // Include all other fields
        }));
        setData(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch ROI submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    // TODO: Implement edit functionality
    console.log('Edit record:', record);
  };

  const handleExport = (filteredData) => {
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, 'roi-submissions.csv');
  };

  const handleBulkAction = async (action, selectedIds) => {
    if (action === 'mark-contacted') {
      try {
        // TODO: Implement bulk status update API
        console.log('Marking as contacted:', selectedIds);
        // Update local state for immediate feedback
        setData(prevData => 
          prevData.map(item => 
            selectedIds.includes(item.id) 
              ? { ...item, status: 'contacted' }
              : item
          )
        );
      } catch (error) {
        console.error('Bulk action failed:', error);
      }
    }
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enhanced column configuration with proper types
  const enhancedColumns = TableColumns.roi_calculator.map(col => {
    const enhancements = {
      timestamp: { type: 'date' },
      email: { type: 'email' },
      roi_percentage: { type: 'percentage' },
      monthly_savings: { type: 'currency' },
      status: { type: 'status' }
    };
    
    return {
      ...col,
      ...enhancements[col.key]
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <PieChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ROI Submissions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Customer ROI calculations and savings projections
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Submissions
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-blue-600">
            {data.filter(item => item.roi_percentage > 40).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            High ROI (>40%)
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-green-600">
            ${Math.round(data.reduce((sum, item) => sum + (item.monthly_savings || 0), 0)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Monthly Savings
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-purple-600">
            {Math.round(data.reduce((sum, item) => sum + (item.roi_percentage || 0), 0) / (data.length || 1))}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Average ROI
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-orange-600">
            {data.filter(item => item.status === 'new').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Needs Follow-up
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={data}
        columns={enhancedColumns}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onExport={handleExport}
        onBulkAction={handleBulkAction}
        title="ROI Calculator Submissions"
        selectable={true}
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={selectedRecord}
        title="ROI Submission Details"
        type="roi_calculator"
      />
    </div>
  );
};

export default ROISubmissions;