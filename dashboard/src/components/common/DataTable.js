import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Check,
  X
} from 'lucide-react';
import { BrandColors } from '../../config/BrandingConfig';

const DataTable = ({ 
  data = [], 
  columns = [], 
  loading = false,
  onView,
  onEdit,
  onExport,
  onBulkAction,
  selectable = true,
  title = 'Data Table'
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Filtering and sorting logic
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Apply text filter
    if (filterText) {
      processedData = processedData.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        processedData = processedData.filter(row =>
          String(row[key]).toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return processedData;
  }, [data, filterText, sortConfig, columnFilters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) return '-';
    
    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'percentage':
        return `${Number(value).toFixed(1)}%`;
      case 'status':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(value)}`}>
            {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
          </span>
        );
      case 'email':
        return <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
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
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          
          <div className="flex items-center space-x-3">
            {selectedRows.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRows.size} selected
                </span>
                <button
                  onClick={() => onBulkAction?.('mark-contacted', Array.from(selectedRows))}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark Contacted
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg"
              title="Toggle Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onExport?.(filteredAndSortedData)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg"
              title="Export Data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Column Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {columns.filter(col => col.filterable).map((column) => (
                <div key={column.key}>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {column.label}
                  </label>
                  <input
                    type="text"
                    placeholder={`Filter ${column.label.toLowerCase()}...`}
                    value={columnFilters[column.key] || ''}
                    onChange={(e) => setColumnFilters({
                      ...columnFilters,
                      [column.key]: e.target.value
                    })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {selectable && (
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {column.key === 'actions' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView?.(row)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit?.(row)}
                          className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-900 dark:text-white">
                        {formatCellValue(row[column.key], column)}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;