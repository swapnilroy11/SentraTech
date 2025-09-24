import React, { createContext, useContext, useState } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');

  const t = translations[currentLang];

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'en' ? 'bn' : 'en');
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