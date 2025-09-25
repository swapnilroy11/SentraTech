import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Components
import Navigation from "./components/Navigation";
import Breadcrumbs from "./components/Breadcrumbs";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";
import SpaceBackground from "./components/SpaceBackground";
import FloatingNavigation from "./components/FloatingNavigation";
import ChatWidget from "./components/ChatWidget";
import Analytics from "./components/Analytics";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";
import SEOManager from "./components/SEOManager";

// Pages
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import SecurityPage from "./pages/SecurityPage";
import ROICalculatorPage from "./pages/ROICalculatorPage";
import PricingPage from "./pages/PricingPage";
import DemoRequestPage from "./pages/DemoRequestPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import NotFoundPage from "./pages/NotFoundPage";

// Contexts
import { LanguageProvider } from "./contexts/LanguageContext";

// Enterprise Utilities
import serviceWorkerRegistration from "./utils/serviceWorkerRegistration";
// import performanceMonitor from "./utils/performanceMonitoring"; // Temporarily disabled
import errorTracker from "./utils/errorTracking";

function App() {
  useEffect(() => {
    // Initialize enterprise-grade features
    initializeEnterpriseFeatures();
  }, []);

  const initializeEnterpriseFeatures = () => {
    console.log('🚀 Initializing SentraTech Enterprise Features...');
    
    try {
      // Temporarily disable service worker registration in development
      console.log('⚠️ Service Worker registration disabled in development mode');
      
      // Add breadcrumbs for error tracking
      if (errorTracker) {
        errorTracker.addBreadcrumb('app_initialized', {
          timestamp: new Date().toISOString(),
          url: window.location.href
        });
      }
      
      console.log('✅ Enterprise features initialized successfully');
    } catch (error) {
      console.warn('⚠️ Error initializing enterprise features:', error);
    }
  };

  return (
    <LanguageProvider>
      <div className="App">
        {/* Space-themed WebGL Background for entire website */}
        <SpaceBackground intensity={0.8} particles={300} />
        
        <BrowserRouter>
          {/* GA4 Analytics Tracking */}
          <Analytics />
          
          {/* Scroll to Top on Route Change */}
          <ScrollToTop />
          
          {/* Floating Left Navigation - moved inside BrowserRouter */}
          <FloatingNavigation />
          
          {/* Global Chat Widget */}
          <ChatWidget />
          
          {/* Cookie Consent Banner */}
          <CookieBanner />
          
          {/* Global Navigation */}
          <Navigation />
          
          {/* Breadcrumbs */}
          <Breadcrumbs />
          
          {/* Main Content with Page Transitions */}
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/roi-calculator" element={<ROICalculatorPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/demo-request" element={<DemoRequestPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            </Routes>
          </PageTransition>
          
          {/* Global Footer */}
          <Footer />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;