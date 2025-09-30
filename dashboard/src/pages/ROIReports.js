import React, { useState, useEffect } from 'react';
import { api } from '../App';

export default function ROIReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/forms/roi-reports');
        setReports(response.data.items || []);
      } catch (error) {
        console.error('Failed to fetch ROI reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading ROI reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">ROI Reports</h1>
        <div className="text-sm text-gray-400">
          {reports.length} total reports
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No ROI reports yet.
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Call Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Savings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {reports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm text-white">{report.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{report.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{report.call_volume}</td>
                  <td className="px-6 py-4 text-sm text-green-400">
                    ${report.annual_savings ? parseInt(report.annual_savings).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(report.created_at || report.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}