import React, { useState, useEffect } from 'react';
import { api } from '../App';

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await api.get('/forms/newsletter-subscribers');
        setSubscribers(response.data.items || []);
      } catch (error) {
        console.error('Failed to fetch newsletter subscribers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading newsletter subscribers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
        <div className="text-sm text-gray-400">
          {subscribers.length} total subscribers
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No newsletter subscribers yet.
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {subscribers.map((subscriber, index) => (
                <tr key={index} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm text-white">{subscriber.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {subscriber.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{subscriber.source || 'Website'}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(subscriber.created_at || subscriber.timestamp).toLocaleDateString()}
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