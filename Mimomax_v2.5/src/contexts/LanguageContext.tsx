import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import i18n from 'i18next';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageState {
  language: Language;
  direction: Direction;
}

type LanguageAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_LANGUAGE' };

interface LanguageContextType extends LanguageState {
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language');
    if (stored === 'en' || stored === 'ar') return stored;
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ar') return 'ar';
  }
  return 'en';
};

const getDirection = (language: Language): Direction => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

const initialState: LanguageState = {
  language: getInitialLanguage(),
  direction: getDirection(getInitialLanguage()),
};

function languageReducer(state: LanguageState, action: LanguageAction): LanguageState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        language: action.payload,
        direction: getDirection(action.payload),
      };
    case 'TOGGLE_LANGUAGE': {
      const newLanguage = state.language === 'en' ? 'ar' : 'en';
      return {
        language: newLanguage,
        direction: getDirection(newLanguage),
      };
    }
    default:
      return state;
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  useEffect(() => {
    localStorage.setItem('language', state.language);
    i18n.changeLanguage(state.language);
    document.documentElement.dir = state.direction;
    document.documentElement.lang = state.language;
  }, [state.language, state.direction]);

  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const toggleLanguage = () => {
    dispatch({ type: 'TOGGLE_LANGUAGE' });
  };

  return (
    <LanguageContext.Provider value={{ ...state, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
