import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './en/common.json';
import enNavigation from './en/navigation.json';
import enProducts from './en/products.json';
import enCart from './en/cart.json';
import enErrors from './en/errors.json';
import enForms from './en/forms.json';

import arCommon from './ar/common.json';
import arNavigation from './ar/navigation.json';
import arProducts from './ar/products.json';
import arCart from './ar/cart.json';
import arErrors from './ar/errors.json';
import arForms from './ar/forms.json';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    products: enProducts,
    cart: enCart,
    errors: enErrors,
    forms: enForms,
  },
  ar: {
    common: arCommon,
    navigation: arNavigation,
    products: arProducts,
    cart: arCart,
    errors: arErrors,
    forms: arForms,
  },
};

const getStoredLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language');
    if (stored === 'en' || stored === 'ar') return stored;
    
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ar') return 'ar';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    ns: ['common', 'navigation', 'products', 'cart', 'errors', 'forms'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
