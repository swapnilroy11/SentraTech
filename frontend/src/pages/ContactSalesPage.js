/**
 * Contact Sales Management Page
 * Enhanced UI for viewing, filtering, sorting, and exporting contact requests
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Search, Filter, Download, Eye, Mail, Phone, Calendar,
  SortAsc, SortDesc, RefreshCw, Users, TrendingUp
} from 'lucide-react';

const ContactSalesPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [filterConfig, setFilterConfig] = useState({
    status: 'all',
    contactMethod: 'all',
    dateRange: 'all'
  });

  // Fetch contact requests
  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter and search effect
  useEffect(() => {
    let filtered = [...contacts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.work_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterConfig.status !== 'all') {
      filtered = filtered.filter(contact => contact.status === filterConfig.status);
    }

    // Contact method filter
    if (filterConfig.contactMethod !== 'all') {
      filtered = filtered.filter(contact => 
        contact.preferred_contact_method?.toLowerCase() === filterConfig.contactMethod.toLowerCase()
      );
    }

    // Date range filter
    if (filterConfig.dateRange !== 'all') {
      const now = new Date();
      let dateLimit;
      
      switch (filterConfig.dateRange) {
        case 'today':
          dateLimit = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          dateLimit = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          dateLimit = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          dateLimit = null;
      }

      if (dateLimit) {
        filtered = filtered.filter(contact => 
          new Date(contact.created_at) >= dateLimit
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, sortConfig, filterConfig]);

  const fetchContacts = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ingest/contact_requests/status`);
      
      if (response.ok) {
        const data = await response.json();
        setContacts(data.recent_requests || []);
      } else {
        console.error('Failed to fetch contact requests');
        setContacts([]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const resetFilters = () => {
    setFilterConfig({
      status: 'all',
      contactMethod: 'all',
      dateRange: 'all'
    });
    setSearchTerm('');
  };

  const exportToCSV = () => {
    const csvHeaders = [
      'Name', 'Email', 'Company', 'Phone', 'Call Volume', 'Interaction Volume', 
      'Contact Method', 'Message', 'Status', 'Created Date'
    ];

    const csvData = filteredContacts.map(contact => [
      contact.full_name || '',
      contact.work_email || '',
      contact.company_name || '',
      contact.phone || '',
      contact.call_volume || '',
      contact.interaction_volume || '',
      contact.preferred_contact_method || '',
      (contact.message || '').replace(/"/g, '""'), // Escape quotes
      contact.status || '',
      new Date(contact.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact-sales-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      contacted: { color: 'bg-green-100 text-green-800', label: 'Contacted' },
      closed: { color: 'bg-gray-100 text-gray-800', label: 'Closed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const formatVolume = (volume) => {
    if (!volume) return '-';
    return new Intl.NumberFormat().format(volume);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#00FF41] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading contact requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Contact Sales Management</h1>
          <p className="text-[rgb(161,161,170)]">
            Manage and track sales inquiries from potential customers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[rgba(26,28,30,0.8)] border-[rgba(255,255,255,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-[#00FF41]" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{contacts.length}</p>
                  <p className="text-[rgb(161,161,170)] text-sm">Total Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[rgba(26,28,30,0.8)] border-[rgba(255,255,255,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="w-8 h-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">
                    {contacts.filter(c => c.preferred_contact_method === 'Email').length}
                  </p>
                  <p className="text-[rgb(161,161,170)] text-sm">Email Preferred</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[rgba(26,28,30,0.8)] border-[rgba(255,255,255,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Phone className="w-8 h-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">
                    {contacts.filter(c => c.preferred_contact_method === 'Phone').length}
                  </p>
                  <p className="text-[rgb(161,161,170)] text-sm">Phone Preferred</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[rgba(26,28,30,0.8)] border-[rgba(255,255,255,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">
                    {contacts.filter(c => c.status === 'pending').length}
                  </p>
                  <p className="text-[rgb(161,161,170)] text-sm">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-[rgba(26,28,30,0.8)] border-[rgba(255,255,255,0.1)] mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgb(161,161,170)]" />
                  <Input
                    type="text"
                    placeholder="Name, email, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Status</label>
                <select
                  value={filterConfig.status}
                  onChange={(e) => setFilterConfig(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Contact Method Filter */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Contact Method</label>
                <select
                  value={filterConfig.contactMethod}
                  onChange={(e) => setFilterConfig(prev => ({ ...prev, contactMethod: e.target.value }))}
                  className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md text-white"
                >
                  <option value="all">All Methods</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Date Range</label>
                <select
                  value={filterConfig.dateRange}
                  onChange={(e) => setFilterConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md text-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {/* Today Quick Filter Button */}
                <Button
                  onClick={() => setFilterConfig(prev => ({ ...prev, dateRange: 'today' }))}
                  variant={filterConfig.dateRange === 'today' ? 'default' : 'outline'}
                  className={
                    filterConfig.dateRange === 'today'
                      ? "bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] px-4 py-2 shadow-md border-[#00FF41] font-medium"
                      : "border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] hover:border-[#00FF41] px-4 py-2 transition-colors"
                  }
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Today
                </Button>
                
                {/* Clear Filters Button - only show when filters are active */}
                {(searchTerm || filterConfig.status !== 'all' || filterConfig.contactMethod !== 'all' || filterConfig.dateRange !== 'all') && (
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="border-[rgba(255,255,255,0.1)] text-[rgb(161,161,170)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] px-4 py-2"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
                
                <Button
                  onClick={exportToCSV}
                  className="bg-[#00FF41] text-[#0A0A0A] hover:bg-[#00e83a] px-4 py-2"
                  disabled={filteredContacts.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={fetchContacts}
                  variant="outline"
                  className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] px-4 py-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-[rgb(161,161,170)] text-sm">
            Showing {filteredContacts.length} of {contacts.length} contact requests
          </p>
        </div>

        {/* Contact Requests Table */}
        <Card className="bg-[rgba(26,28,30,0.8)] border-[rgba(255,255,255,0.1)]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[rgba(255,255,255,0.02)]">
                  <tr>
                    {[
                      { key: 'full_name', label: 'Name' },
                      { key: 'work_email', label: 'Email' },
                      { key: 'company_name', label: 'Company' },
                      { key: 'call_volume', label: 'Call Volume' },
                      { key: 'interaction_volume', label: 'Interaction Volume' },
                      { key: 'preferred_contact_method', label: 'Contact Method' },
                      { key: 'status', label: 'Status' },
                      { key: 'created_at', label: 'Date' }
                    ].map(column => (
                      <th
                        key={column.key}
                        className="px-6 py-4 text-left text-xs font-medium text-[rgb(161,161,170)] uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {sortConfig.key === column.key && (
                            sortConfig.direction === 'desc' ? 
                              <SortDesc className="w-4 h-4" /> : 
                              <SortAsc className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-medium text-[rgb(161,161,170)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.1)]">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{contact.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[rgb(161,161,170)]">{contact.work_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{contact.company_name}</div>
                        {contact.company_website && (
                          <div className="text-xs text-[#00FF41]">{contact.company_website}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatVolume(contact.call_volume)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatVolume(contact.interaction_volume)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {contact.preferred_contact_method === 'Email' ? (
                            <Mail className="w-4 h-4 text-blue-400 mr-2" />
                          ) : (
                            <Phone className="w-4 h-4 text-green-400 mr-2" />
                          )}
                          <span className="text-sm text-white">{contact.preferred_contact_method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(contact.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[rgb(161,161,170)]">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-[rgb(161,161,170)]">
                          {new Date(contact.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#00FF41] hover:text-[#00e83a] hover:bg-[rgba(0,255,65,0.1)]"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-[rgb(161,161,170)] mx-auto mb-4" />
                  <p className="text-[rgb(161,161,170)] text-lg">No contact requests found</p>
                  <p className="text-[rgb(161,161,170)] text-sm">
                    {searchTerm || filterConfig.status !== 'all' || filterConfig.contactMethod !== 'all' || filterConfig.dateRange !== 'all'
                      ? 'Try adjusting your filters or search criteria'
                      : 'Contact requests will appear here once submitted'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactSalesPage;