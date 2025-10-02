import React, { createContext, useContext, useState } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const LanguageProvider = ({ children }) => {
  // Only English language - Bengali removed completely
  const [currentLang, setCurrentLang] = useState('en');

  const t = translations[currentLang];

  // Language toggle function removed - only English supported
  const toggleLanguage = () => {
    // No-op since we only support English now
    console.log('Language switching disabled - English only');
  };

  return (
    <LanguageContext.Provider value={{
      currentLang,
      setCurrentLang,
      toggleLanguage,
      t,
      translations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};