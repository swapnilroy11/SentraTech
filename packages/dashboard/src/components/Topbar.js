import React from 'react';

export default function Topbar() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <nav className="text-sm text-gray-400">
            <span>Dashboard</span> / <span className="text-white">Dashboard</span>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-red-400 bg-red-900/20 px-3 py-1 rounded-lg border border-red-800">
            ⚠ Request failed with status code 500
          </div>
        </div>
      </div>
    </header>
  );
}