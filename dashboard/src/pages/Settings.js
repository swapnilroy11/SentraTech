import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">API Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Backend URL</label>
              <input
                type="text"
                value={process.env.REACT_APP_BACKEND_URL || 'https://admin.sentratech.net'}
                readOnly
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">WebSocket URL</label>
              <input
                type="text"
                value={process.env.REACT_APP_WS_URL || 'wss://admin.sentratech.net/ws'}
                readOnly
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Dashboard Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Real-time Updates</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Auto-refresh Data</span>
              <button className="w-12 h-6 bg-green-400 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Email Notifications</span>
              <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Data Export</h3>
          <div className="space-y-3">
            <button className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Export Demo Requests (CSV)
            </button>
            <button className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Export ROI Reports (CSV)
            </button>
            <button className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Export All Data (JSON)
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Account</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-300">
              Logged in as: <span className="text-white">admin@sentratech.net</span>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}