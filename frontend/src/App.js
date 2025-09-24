import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SentraTechLanding from "./components/SentraTechLanding";
import FeatureShowcase from "./components/FeatureShowcase";
import CustomerJourney from "./components/CustomerJourney";
import ROICalculator from "./components/ROICalculator";
import CaseStudies from "./components/CaseStudies";
import IntegrationsShowcase from "./components/IntegrationsShowcase";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import SecurityCompliance from "./components/SecurityCompliance";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import SpaceBackground from "./components/SpaceBackground";
import FloatingNavigation from "./components/FloatingNavigation";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        {/* Space-themed WebGL Background for entire website */}
        <SpaceBackground intensity={0.8} particles={300} />
        
        {/* Floating Left Navigation */}
        <FloatingNavigation />
        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <>
                <SentraTechLanding />
                <FeatureShowcase />
                <CustomerJourney />
                <ROICalculator />
                <CaseStudies />
                <IntegrationsShowcase />
                <TestimonialsSection />
                <PricingSection />
                <SecurityCompliance />
                <CTASection />
                <Footer />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
