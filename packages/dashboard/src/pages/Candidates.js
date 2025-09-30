import React from 'react';

export default function Candidates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Talent Acquisition</h1>
        <button className="bg-green-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-green-500">
          Post Job
        </button>
      </div>

      <div className="text-center py-12 text-gray-400">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No job applications yet</h3>
        <p className="text-gray-500">Job applications will appear here when candidates apply through the careers page.</p>
      </div>
    </div>
  );
}