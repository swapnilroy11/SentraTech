import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

// Layout Components
import MainLayout from "./components/layout/MainLayout";

// Pages
import DashboardHome from "./pages/DashboardHome";
import ROISubmissions from "./pages/ROISubmissions";
import DemoRequests from "./pages/DemoRequests";
import SalesLeads from "./pages/SalesLeads";
import NewsletterSignups from "./pages/NewsletterSignups";
import TalentAcquisition from "./pages/TalentAcquisition";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

// Error Boundary and Toast
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// API Configuration - Use local backend for development
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000,
  headers: { 
    "Content-Type": "application/json",
    "X-API-Key": process.env.REACT_APP_API_KEY || 'sk-emergent-7A236FdD2Ce8d9b52C'
  },
});

// Response Interceptor for Enhanced Error Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config || {};
    const status = error?.response?.status;
    
    if (status === 401 && !original._retry) {
      // Handle authentication errors
      localStorage.removeItem('sentratech_admin_auth');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Show user-friendly error messages
    const message = error?.response?.data?.detail || 
                   error?.response?.data?.message || 
                   error?.message || 
                   'Request failed';
    
    if (status !== 401) {
      toast.error(`Error: ${message}`);
    }
    
    return Promise.reject(error);
  }
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = localStorage.getItem('sentratech_admin_auth');
      if (authData) {
        const { token, expiry, user } = JSON.parse(authData);
        
        // Check if token is still valid
        if (Date.now() < expiry) {
          setIsAuthenticated(true);
          setUser(user);
        } else {
          // Token expired, clear auth
          localStorage.removeItem('sentratech_admin_auth');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('sentratech_admin_auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      
      // Call backend authentication API
      const response = await axios.post(`${API_BASE}/dashboard/auth/login`, {
        email: credentials.email,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      if (response.data.success) {
        const authData = {
          token: 'admin_session_' + Date.now(),
          expiry: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          user: {
            email: credentials.email,
            name: 'SentraTech Admin',
            role: 'admin'
          }
        };
        
        localStorage.setItem('sentratech_admin_auth', JSON.stringify(authData));
        setIsAuthenticated(true);
        setUser(authData.user);
        
        toast.success('Successfully logged in!');
        return { success: true };
      } else {
        toast.error(response.data.error || 'Login failed');
        return { success: false, error: response.data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle different error types
      if (error.response?.status === 401) {
        toast.error('Invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Please try again.');
        return { success: false, error: 'Connection failed' };
      } else {
        toast.error('Login failed. Please try again.');
        return { success: false, error: error.message || 'Login failed' };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sentratech_admin_auth');
    setIsAuthenticated(false);
    setUser(null);
    toast.info('Logged out successfully');
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading dashboard...</p>
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <MainLayout onLogout={handleLogout}>{children}</MainLayout>;
  };

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Initializing SentraTech Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App" data-testid="root-app">
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Login Route */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Login onLogin={handleLogin} loading={isLoading} />
              } 
            />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
            <Route path="/roi-submissions" element={<ProtectedRoute><ROISubmissions /></ProtectedRoute>} />
            <Route path="/demo-requests" element={<ProtectedRoute><DemoRequests /></ProtectedRoute>} />
            <Route path="/sales-leads" element={<ProtectedRoute><SalesLeads /></ProtectedRoute>} />
            <Route path="/newsletter-signups" element={<ProtectedRoute><NewsletterSignups /></ProtectedRoute>} />
            <Route path="/talent-acquisition" element={<ProtectedRoute><TalentAcquisition /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        
        {/* Global Toast Notifications */}
        <Toaster 
          position="top-right" 
          expand={true}
          richColors 
          closeButton
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;