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

const DETECTION_KEY = 'i18nextLng';

function detectLanguage(): string {
  const stored = localStorage.getItem(DETECTION_KEY);
  if (stored === 'en' || stored === 'ar') {
    return stored;
  }
  const browserLang = navigator.language?.slice(0, 2);
  if (browserLang === 'ar') {
    return 'ar';
  }
  return 'en';
}

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
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'en',
  ns: ['common', 'navigation', 'products', 'cart', 'errors', 'forms'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true,
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(DETECTION_KEY, lng);
});

export default i18n;
