import React, { useState, useEffect } from 'react';
import { api } from '../App';

export default function ContactSales() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('/forms/contact-sales');
        setContacts(response.data.items || []);
      } catch (error) {
        console.error('Failed to fetch contact sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading contact sales...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contact Sales</h1>
        <div className="text-sm text-gray-400">
          {contacts.length} total contacts
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No contact sales requests yet.
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contacts.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm text-white">{contact.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{contact.work_email}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{contact.company_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{contact.plan_selected}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(contact.created_at || contact.timestamp).toLocaleDateString()}
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