import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Download, RefreshCw } from 'lucide-react';
import { BrandColors } from '../config/BrandingConfig';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      realTime: true,
      digest: false
    },
    dashboard: {
      refreshInterval: 30,
      defaultView: 'dashboard',
      theme: 'dark'
    },
    export: {
      format: 'csv',
      includeMetadata: true,
      dateFormat: 'ISO'
    }
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('sentratech-dashboard-settings', JSON.stringify(settings));
    setSaving(false);
  };

  const handleExportAll = async () => {
    // Export all data
    console.log('Exporting all data...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Dashboard configuration and preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: e.target.checked }
                })}
                className="rounded border-gray-300"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Real-time Updates</span>
              <input
                type="checkbox"
                checked={settings.notifications.realTime}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, realTime: e.target.checked }
                })}
                className="rounded border-gray-300"
              />
            </label>
          </div>
        </div>

        {/* Dashboard Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dashboard</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Refresh Interval (seconds)
              </label>
              <select
                value={settings.dashboard.refreshInterval}
                onChange={(e) => setSettings({
                  ...settings,
                  dashboard: { ...settings.dashboard, refreshInterval: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Export Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Options</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Format
              </label>
              <select
                value={settings.export.format}
                onChange={(e) => setSettings({
                  ...settings,
                  export: { ...settings.export, format: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="xlsx">Excel</option>
              </select>
            </div>
            <button
              onClick={handleExportAll}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export All Data</span>
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="text-gray-900 dark:text-white">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">API Endpoint</span>
              <span className="text-gray-900 dark:text-white">{process.env.REACT_APP_BACKEND_URL || 'Default'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
              <span className="text-gray-900 dark:text-white">Just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;