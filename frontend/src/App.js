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
// FloatingNavScrollable removed - not needed per user request
import Analytics from "./components/Analytics";
import ScrollToTop from "./components/ScrollToTop";
import SEOManager from "./components/SEOManager";
import ChatWidget from "./components/ChatWidget";

// Critical pages (loaded immediately)
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

// Advanced lazy-loaded pages with better chunking and preloading
const FeaturesPage = lazy(() => 
  import(/* webpackChunkName: "features" */ "./pages/FeaturesPage")
);
const CaseStudiesPage = lazy(() => 
  import(/* webpackChunkName: "case-studies" */ "./pages/CaseStudiesPage")
);
const SecurityPage = lazy(() => 
  import(/* webpackChunkName: "security" */ "./pages/SecurityPage")
);
const ROICalculatorPage = lazy(() => 
  import(/* webpackChunkName: "roi-calculator" */ "./pages/ROICalculatorPage")
);
const PricingPage = lazy(() => 
  import(/* webpackChunkName: "pricing" */ "./pages/PricingPage")
);
const DemoRequestPage = lazy(() => 
  import(/* webpackChunkName: "demo-request" */ "./pages/DemoRequestPage")
);

// Group related pages into single chunks
const LegalPages = {
  PrivacyPolicyPage: lazy(() => 
    import(/* webpackChunkName: "legal-pages" */ "./pages/PrivacyPolicyPage")
  ),
  TermsOfServicePage: lazy(() => 
    import(/* webpackChunkName: "legal-pages" */ "./pages/TermsOfServicePage")
  ),
  CookiePolicyPage: lazy(() => 
    import(/* webpackChunkName: "legal-pages" */ "./pages/CookiePolicyPage")
  )
};

const CompanyPages = {
  AboutUsPage: lazy(() => 
    import(/* webpackChunkName: "company-pages" */ "./pages/AboutUsPage")
  ),
  LeadershipTeamPage: lazy(() => 
    import(/* webpackChunkName: "company-pages" */ "./pages/LeadershipTeamPage")
  ),
  InvestorRelationsPage: lazy(() => 
    import(/* webpackChunkName: "company-pages" */ "./pages/InvestorRelationsPage")
  ),
  PitchDeckPage: lazy(() => 
    import(/* webpackChunkName: "company-pages" */ "./pages/PitchDeckPage")
  )
};

const SupportPages = {
  SupportCenterPage: lazy(() => 
    import(/* webpackChunkName: "support-pages" */ "./pages/SupportCenterPage")
  ),
  ContactSalesPage: lazy(() => 
    import(/* webpackChunkName: "support-pages" */ "./pages/ContactSalesPage")
  )
};

const CareerPages = {
  CareersPage: lazy(() => 
    import(/* webpackChunkName: "career-pages" */ "./pages/CareersPage")
  ),
  JobApplicationPage: lazy(() => 
    import(/* webpackChunkName: "career-pages" */ "./pages/JobApplicationPage")
  )
};

// Extract lazy components for easier access
const { PrivacyPolicyPage, TermsOfServicePage, CookiePolicyPage } = LegalPages;
const { AboutUsPage, LeadershipTeamPage, InvestorRelationsPage, PitchDeckPage } = CompanyPages;
const { SupportCenterPage, ContactSalesPage } = SupportPages;
const { CareersPage, JobApplicationPage } = CareerPages;

// Contexts
import { LanguageProvider } from "./contexts/LanguageContext";

// Enterprise Utilities
import serviceWorkerRegistration from "./utils/serviceWorkerRegistration";
// import performanceMonitor from "./utils/performanceMonitoring"; // Temporarily disabled
import AdvancedPerformanceMonitor from './utils/performanceMonitor';
import PredictiveResourceLoader from './utils/predictiveLoader';
import WebAssemblyPerformanceModule from './utils/wasmPerformance';
import AdvancedNetworkingModule from './utils/advancedNetworking';
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

  // Enhanced loading component with better performance
  const LoadingFallback = React.memo(() => (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div 
          className="w-16 h-16 border-4 border-[#00FF41]/20 border-t-[#00FF41] rounded-full mx-auto mb-4"
          style={{ 
            animation: 'spin 1s linear infinite',
            willChange: 'transform'
          }}
        ></div>
        <p className="text-[#00FF41] font-semibold text-lg">Loading SentraTech...</p>
        <p className="text-[rgb(161,161,170)] text-sm mt-2">Optimizing your experience</p>
      </div>
    </div>
  ));

  const initializeEnterpriseFeatures = () => {
    console.log('🚀 Initializing SentraTech Enterprise Features...');
    
    try {
      // Advanced Service Worker registration with performance monitoring
      if ('serviceWorker' in navigator) {
        // Register service worker immediately for better caching
        navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        }).then((registration) => {
          console.log('✅ Advanced Service Worker registered:', registration.scope);
          
          // Enable background sync for better offline experience
          if ('sync' in window.ServiceWorkerRegistration.prototype) {
            console.log('✅ Background Sync supported');
          }
          
          // Enable push notifications capability
          if ('PushManager' in window) {
            console.log('✅ Push messaging supported');
          }
          
          // Performance monitoring
          if ('performance' in window && 'measure' in performance) {
            performance.mark('sw-registered');
          }
          
        }).catch((error) => {
          console.warn('⚠️ Service Worker registration failed:', error);
        });
        
        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_UPDATED') {
            console.log('🔄 Cache updated, new content available');
          }
        });
      } else {
        console.log('⚠️ Service Worker not supported in this browser');
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
            {/* FloatingNavScrollable removed - not needed per user request */}
            
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