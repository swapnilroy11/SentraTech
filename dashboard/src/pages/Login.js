import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-400">SentraTech Admin</h1>
          <p className="text-gray-400 mt-2">Sign in to access the dashboard</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
              placeholder="admin@sentratech.net"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-400 text-black py-2 px-4 rounded-lg font-medium hover:bg-green-500 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}