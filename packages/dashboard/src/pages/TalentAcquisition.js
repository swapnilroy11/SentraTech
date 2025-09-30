import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import DetailDrawer from '../components/common/DetailDrawer';
import { TableColumns } from '../types/DataTypes';
import { api } from '../App';

const TalentAcquisition = () => {
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
      const response = await api.get('/forms/job-applications');
      if (response.data.success) {
        const transformedData = response.data.items.map(item => ({
          id: item.id || item._id,
          timestamp: item.created_at || item.timestamp,
          applicant_name: item.applicant_name || item.full_name,
          email: item.email,
          position_applied: item.position_applied || item.position,
          experience_level: item.experience_level || 'mid',
          resume_url: item.resume_url,
          status: item.status || 'new',
          ...item
        }));
        setData(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch job applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const handleExport = (filteredData) => {
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, 'job-applications.csv');
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

  const enhancedColumns = TableColumns.job_application.map(col => ({
    ...col,
    ...(col.key === 'timestamp' && { type: 'date' }),
    ...(col.key === 'email' && { type: 'email' }),
    ...(col.key === 'status' && { type: 'status' })
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <UserCheck className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Talent Acquisition</h1>
            <p className="text-gray-600 dark:text-gray-400">Job applications and candidate management</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-blue-600">{data.filter(item => item.status === 'new').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">New Applications</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-yellow-600">{data.filter(item => item.status === 'screening').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Screening</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-purple-600">{data.filter(item => item.status === 'interview').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Interview Stage</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-green-600">{data.filter(item => item.status === 'hired').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Hired</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold text-gray-600">{data.filter(item => item.status === 'rejected').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
        </div>
      </div>

      <DataTable
        data={data}
        columns={enhancedColumns}
        loading={loading}
        onView={handleView}
        onExport={handleExport}
        title="Job Applications"
        selectable={true}
      />

      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={selectedRecord}
        title="Job Application Details"
        type="job_application"
      />
    </div>
  );
};

export default TalentAcquisition;