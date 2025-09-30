import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import DemoRequests from "./pages/DemoRequests";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ROIReports from "./pages/ROIReports";
import Dashboard from "./pages/Dashboard";
import ContactSales from "./pages/ContactSales";
import Newsletter from "./pages/Newsletter";
import ActiveContracts from "./pages/ActiveContracts";
import Candidates from "./pages/Candidates";
import Settings from "./pages/Settings";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config || {};
    const status = error?.response?.status;
    if (status === 401 && !original._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try { await api.post("/auth/refresh"); }
        catch (_) { window.location.href = "/login"; }
        finally { isRefreshing = false; }
      }
      original._retry = true;
      return api(original);
    }
    // Non-blocking notifications for other errors
    const msg = error?.response?.data?.detail || error?.message || "Request failed";
    toast.error(String(msg));
    return Promise.reject(error);
  }
);

function AppShell({ children }) {
  return (
    <div className="min-h-screen app-bg flex bg-[color:var(--st-surface)] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 md:p-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  return <AppShell>{children}</AppShell>;
}

function HomeRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/dashboard"); }, [navigate]);
  return null;
}

function App() {
  return (
    <div className="App" data-testid="root-app">
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/demo-requests" element={<ProtectedRoute><DemoRequests /></ProtectedRoute>} />
            <Route path="/roi-reports" element={<ProtectedRoute><ROIReports /></ProtectedRoute>} />
            <Route path="/contact-sales" element={<ProtectedRoute><ContactSales /></ProtectedRoute>} />
            <Route path="/newsletter" element={<ProtectedRoute><Newsletter /></ProtectedRoute>} />
            <Route path="/active-contracts" element={<ProtectedRoute><ActiveContracts /></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </ErrorBoundary>
    </div>
  );
}

export default App;