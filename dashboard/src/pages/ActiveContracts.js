import React from 'react';

export default function ActiveContracts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Active Contracts</h1>
        <button className="bg-green-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-green-500">
          Add Contract
        </button>
      </div>

      <div className="text-center py-12 text-gray-400">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No active contracts</h3>
        <p className="text-gray-500">Contracts will appear here once customers sign up for paid plans.</p>
      </div>
    </div>
  );
}