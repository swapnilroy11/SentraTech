import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import DetailDrawer from '../components/common/DetailDrawer';
import { TableColumns } from '../types/DataTypes';
import { api } from '../App';

const DemoRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchData();
    window.addEventListener('dashboard-refresh', fetchData);
    return () => window.removeEventListener('dashboard-refresh', fetchData);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/forms/demo-requests');
      if (response.data.success) {
        const transformedData = response.data.items.map(item => ({
          id: item.id || item._id,
          timestamp: item.created_at || item.timestamp,
          full_name: item.full_name || item.name,
          work_email: item.work_email || item.email,
          company_name: item.company_name || item.company,
          phone: item.phone,
          monthly_volume: item.monthly_volume || item.call_volume,
          preferred_demo_date: item.preferred_demo_date,
          notes: item.notes || item.message,
          status: item.status || 'new',
          ...item
        }));
        setData(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch demo requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    console.log('Edit record:', record);
  };

  const handleExport = (filteredData) => {
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, 'demo-requests.csv');
  };

  const handleBulkAction = async (action, selectedIds) => {
    if (action === 'mark-contacted') {
      try {
        console.log('Marking as contacted:', selectedIds);
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
    const csvContent = [headers.join(','), ...data.map(row => headers.map(header => row[header]).join(','))].join('\n');
    return csvContent;
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const enhancedColumns = TableColumns.demo_request.map(col => ({
    ...col,
    ...(col.key === 'timestamp' && { type: 'date' }),
    ...(col.key === 'work_email' && { type: 'email' }),
    ...(col.key === 'status' && { type: 'status' })
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Demo Requests</h1>
            <p className="text-gray-600 dark:text-gray-400">Product demonstration requests and scheduling</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-blue-600">{data.filter(item => item.status === 'new').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">New Requests</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-yellow-600">{data.filter(item => item.status === 'contacted').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Contacted</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-green-600">{data.filter(item => item.status === 'scheduled').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-purple-600">{Math.round(data.reduce((sum, item) => sum + (item.monthly_volume || 0), 0))}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
        </div>
      </div>

      <DataTable
        data={data}
        columns={enhancedColumns}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onExport={handleExport}
        onBulkAction={handleBulkAction}
        title="Demo Requests"
        selectable={true}
      />

      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={selectedRecord}
        title="Demo Request Details"
        type="demo_request"
      />
    </div>
  );
};

export default DemoRequests;