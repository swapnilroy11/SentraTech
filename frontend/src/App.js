import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navigation from "./components/Navigation";
import Breadcrumbs from "./components/Breadcrumbs";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";
import SpaceBackground from "./components/SpaceBackground";
import FloatingNavigation from "./components/FloatingNavigation";
import ChatWidget from "./components/ChatWidget";

// Pages
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import SecurityPage from "./pages/SecurityPage";
import PricingPage from "./pages/PricingPage";
import DemoRequestPage from "./pages/DemoRequestPage";

// Contexts
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        {/* Space-themed WebGL Background for entire website */}
        <SpaceBackground intensity={0.8} particles={300} />
        
        <BrowserRouter>
          {/* Floating Left Navigation - moved inside BrowserRouter */}
          <FloatingNavigation />
          
          {/* Global Chat Widget */}
          <ChatWidget />
          
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
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/demo-request" element={<DemoRequestPage />} />
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