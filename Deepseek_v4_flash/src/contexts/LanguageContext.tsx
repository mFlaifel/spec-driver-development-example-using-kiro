import { createContext, useContext, useState, type ReactNode } from 'react';
import i18n from 'i18next';

interface LanguageContextType {
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  changeLanguage: (lang: 'en' | 'ar') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): 'en' | 'ar' {
  const stored = localStorage.getItem('i18nextLng');
  if (stored === 'en' || stored === 'ar') return stored;
  const detected = i18n.language?.slice(0, 2);
  if (detected === 'ar') return 'ar';
  return 'en';
}

function getDirection(lang: 'en' | 'ar'): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'ar'>(getInitialLanguage);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(() => getDirection(getInitialLanguage()));

  const changeLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    setDirection(getDirection(lang));
    i18n.changeLanguage(lang);
    document.documentElement.dir = getDirection(lang);
    document.documentElement.lang = lang;
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, direction, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { LanguageProvider, useLanguage };
export type { LanguageContextType };
