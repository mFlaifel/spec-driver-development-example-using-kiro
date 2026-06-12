import { CurrencyCode, CountryCode } from '../types';

const exchangeRates: Record<CurrencyCode, number> = {
  SAR: 1,
  AED: 0.97,
  KWD: 0.12,
  QAR: 0.97,
  BHD: 0.10,
  OMR: 0.10,
  EGP: 13.0,
  JOD: 0.71,
  MAD: 10.5,
  DZD: 130.0,
};

const currencySymbols: Record<CurrencyCode, string> = {
  SAR: 'ر.س',
  AED: 'د.إ',
  KWD: 'د.ك',
  QAR: 'ر.ق',
  BHD: 'د.ب',
  OMR: 'ر.ع',
  EGP: 'ج.م',
  JOD: 'د.أ',
  MAD: 'د.م.',
  DZD: 'د.ج',
};

const countryCurrencyMap: Record<CountryCode, CurrencyCode> = {
  SA: 'SAR',
  AE: 'AED',
  KW: 'KWD',
  QA: 'QAR',
  BH: 'BHD',
  OM: 'OMR',
  EG: 'EGP',
  JO: 'JOD',
  MA: 'MAD',
  DZ: 'DZD',
};

export const CurrencyService = {
  convertPrice(
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
  ): number {
    if (fromCurrency === toCurrency) return amount;
    
    const inSAR = amount / exchangeRates[fromCurrency];
    const converted = inSAR * exchangeRates[toCurrency];
    
    return Math.round(converted * 100) / 100;
  },

  formatPrice(amount: number, currency: CurrencyCode, language: string): string {
    const symbol = currencySymbols[currency];
    const formatted = amount.toLocaleString(
      language === 'ar' ? 'ar-SA' : 'en-SA',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
    
    if (language === 'ar') {
      return `${formatted} ${symbol}`;
    }
    
    return `${symbol} ${formatted}`;
  },

  getExchangeRate(fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
    if (fromCurrency === toCurrency) return 1;
    
    return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
  },

  getCurrencyForCountry(countryCode: CountryCode): CurrencyCode {
    return countryCurrencyMap[countryCode] || 'SAR';
  },

  getCurrencySymbol(currency: CurrencyCode): string {
    return currencySymbols[currency] || currency;
  },
};
