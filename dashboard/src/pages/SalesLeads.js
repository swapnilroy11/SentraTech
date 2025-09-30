import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import DetailDrawer from '../components/common/DetailDrawer';
import { TableColumns } from '../types/DataTypes';
import { api } from '../App';

const SalesLeads = () => {
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
      const response = await api.get('/forms/contact-sales');
      if (response.data.success) {
        // Transform data to match our schema
        const transformedData = response.data.items.map(item => ({
          id: item.id || item._id,
          timestamp: item.created_at || item.timestamp,
          full_name: item.full_name,
          work_email: item.work_email || item.email,
          company_name: item.company_name || item.company,
          phone: item.phone,
          industry: item.industry,
          company_size: item.company_size,
          plan_selected: item.plan_selected,
          message: item.message,
          requirements: item.requirements,
          priority: item.priority || 'medium',
          status: item.status || 'new',
          assigned_to: item.assigned_to,
          ...item // Include all other fields
        }));
        setData(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch sales leads:', error);
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
    downloadCSV(csv, 'sales-leads.csv');
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
  const enhancedColumns = TableColumns.contact_sales.map(col => {
    const enhancements = {
      timestamp: { type: 'date' },
      work_email: { type: 'email' },
      status: { type: 'status' },
      priority: { type: 'status' }
    };
    
    return {
      ...col,
      ...enhancements[col.key]
    };
  });

  const getPriorityStats = () => {
    const high = data.filter(item => item.priority === 'high').length;
    const medium = data.filter(item => item.priority === 'medium').length;
    const low = data.filter(item => item.priority === 'low').length;
    return { high, medium, low };
  };

  const getStatusStats = () => {
    const newLeads = data.filter(item => item.status === 'new').length;
    const contacted = data.filter(item => item.status === 'contacted').length;
    const processed = data.filter(item => item.status === 'processed').length;
    return { newLeads, contacted, processed };
  };

  const priorityStats = getPriorityStats();
  const statusStats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sales Leads
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Contact sales form submissions and lead management
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
              Total Leads
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-red-600">
            {priorityStats.high}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            High Priority
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-orange-600">
            {priorityStats.medium}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Medium Priority
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-green-600">
            {priorityStats.low}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Low Priority
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-blue-600">
            {statusStats.newLeads}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            New Leads
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-yellow-600">
            {statusStats.contacted}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Contacted
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-green-600">
            {statusStats.processed}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Processed
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-purple-600">
            {data.filter(item => item.plan_selected === 'Enterprise').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Enterprise Plan
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
        title="Contact Sales Submissions"
        selectable={true}
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={selectedRecord}
        title="Sales Lead Details"
        type="contact_sales"
      />
    </div>
  );
};

export default SalesLeads;