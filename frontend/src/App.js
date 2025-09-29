import React, { useEffect, Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Components (loaded immediately as they're used globally)
import Navigation from "./components/Navigation";
import Breadcrumbs from "./components/Breadcrumbs";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";
import SpaceBackground from "./components/SpaceBackground";
import FloatingNavScrollable from "./components/FloatingNavScrollable";
import Analytics from "./components/Analytics";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";
import SEOManager from "./components/SEOManager";
import ChatWidget from "./components/ChatWidget";

// Critical pages (loaded immediately)
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// Lazy-loaded pages for performance optimization
const FeaturesPage = lazy(() => import("./pages/FeaturesPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const ROICalculatorPage = lazy(() => import("./pages/ROICalculatorPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const DemoRequestPage = lazy(() => import("./pages/DemoRequestPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const LeadershipTeamPage = lazy(() => import("./pages/LeadershipTeamPage"));
const InvestorRelationsPage = lazy(() => import("./pages/InvestorRelationsPage"));
const PitchDeckPage = lazy(() => import("./pages/PitchDeckPage"));
const SupportCenterPage = lazy(() => import("./pages/SupportCenterPage"));
const ContactSalesPage = lazy(() => import("./pages/ContactSalesPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const JobApplicationPage = lazy(() => import("./pages/JobApplicationPage"));

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
    
    // Remove any Emergent branding badges permanently
    const removeEmergentBadges = () => {
      const emergentSelectors = [
        '#emergent-badge',
        '[id*="emergent"]',
        '[class*="emergent"]',
        'a[href*="emergent.sh"]',
        'a[href*="app.emergent"]'
      ];
      
      emergentSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (el && el.textContent && el.textContent.toLowerCase().includes('emergent')) {
              el.remove();
            }
          });
        } catch (e) {
          console.debug('Badge removal:', e.message);
        }
      });
    };
    
    // Remove immediately and set up observer for dynamic content
    removeEmergentBadges();
    
    // Set up mutation observer to catch dynamically added badges
    const observer = new MutationObserver(() => {
      removeEmergentBadges();
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  }, []);

  // Loading component for lazy-loaded pages
  const LoadingFallback = () => (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#00FF41]/20 border-t-[#00FF41] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#00FF41] font-semibold text-lg">Loading SentraTech...</p>
        <p className="text-[rgb(161,161,170)] text-sm mt-2">Optimizing your experience</p>
      </div>
    </div>
  );

  const initializeEnterpriseFeatures = () => {
    console.log('🚀 Initializing SentraTech Enterprise Features...');
    
    try {
      // Enable service worker registration for production
      if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        serviceWorkerRegistration.register({
          onSuccess: (registration) => {
            console.log('✅ Service Worker registered successfully:', registration);
          },
          onUpdate: (registration) => {
            console.log('🔄 Service Worker updated:', registration);
          },
          onOffline: () => {
            console.log('📱 App is now ready to work offline');
          },
          onError: (error) => {
            console.warn('⚠️ Service Worker registration failed:', error);
          }
        });
      } else {
        console.log('⚠️ Service Worker registration disabled in development mode');
      }
      
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
    <HelmetProvider>
      <LanguageProvider>
        <div className="App">
          {/* Space-themed WebGL Background for entire website */}
          <SpaceBackground intensity={0.8} particles={300} />
          
          <BrowserRouter>
            {/* Global SEO Management */}
            <SEOManager />
            
            {/* GA4 Analytics Tracking */}
            <Analytics />
            
            {/* Scroll to Top on Route Change */}
            <ScrollToTop />
            
            {/* Floating Left Navigation - moved inside BrowserRouter */}
            <FloatingNavScrollable />
            
            {/* Cookie Consent Banner */}
            <CookieBanner />
            
            {/* Global Navigation */}
            <Navigation />
            
            {/* Breadcrumbs */}
            <Breadcrumbs />
            
            {/* Main Content with Page Transitions and Lazy Loading */}
            <PageTransition>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Critical pages loaded immediately */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                  
                  {/* Lazy-loaded pages for performance */}
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/case-studies" element={<CaseStudiesPage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/roi-calculator" element={<ROICalculatorPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/demo-request" element={<DemoRequestPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/leadership-team" element={<LeadershipTeamPage />} />
                  <Route path="/investor-relations" element={<InvestorRelationsPage />} />
                  <Route path="/pitch-deck" element={<PitchDeckPage />} />
                  <Route path="/support-center" element={<SupportCenterPage />} />
                  <Route path="/contact-sales-management" element={<ContactSalesPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/careers/apply/:jobId" element={<JobApplicationPage />} />
                </Routes>
              </Suspense>
            </PageTransition>
            
            {/* Global Footer */}
            <Footer />
            
            {/* Global Chat Widget */}
            <ChatWidget />
          </BrowserRouter>
        </div>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;