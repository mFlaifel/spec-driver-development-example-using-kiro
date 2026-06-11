import { CurrencyCode } from '../types';

interface CurrencyInfo {
  name: string;
  nameAr: string;
  symbol: string;
}

export class CurrencyService {
  static readonly currencyMap: Record<CurrencyCode, CurrencyInfo> = {
    SAR: { name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: 'ر.س' },
    AED: { name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ' },
    KWD: { name: 'Kuwaiti Dinar', nameAr: 'دينار كويتي', symbol: 'د.ك' },
    QAR: { name: 'Qatari Riyal', nameAr: 'ريال قطري', symbol: 'ر.ق' },
    BHD: { name: 'Bahraini Dinar', nameAr: 'دينار بحريني', symbol: 'د.ب' },
    OMR: { name: 'Omani Rial', nameAr: 'ريال عماني', symbol: 'ر.ع' },
    EGP: { name: 'Egyptian Pound', nameAr: 'جنيه مصري', symbol: 'ج.م' },
    JOD: { name: 'Jordanian Dinar', nameAr: 'دينار أردني', symbol: 'د.ا' },
    MAD: { name: 'Moroccan Dirham', nameAr: 'درهم مغربي', symbol: 'د.م.' },
    DZD: { name: 'Algerian Dinar', nameAr: 'دينار جزائري', symbol: 'د.ج' },
  };

  static convertPrice(amount: number, _fromCurrency: CurrencyCode, _toCurrency: CurrencyCode): number {
    return amount;
  }

  static formatPrice(amount: number, currency: CurrencyCode, language: string): string {
    const locale = language === 'ar' ? 'ar-SA' : 'en-US';
    const currencyInfo = CurrencyService.currencyMap[currency];

    if (!currencyInfo) {
      return `${amount} ${currency}`;
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
      }).format(amount);
    } catch {
      return `${amount} ${currencyInfo.symbol}`;
    }
  }

  static getExchangeRate(_fromCurrency: CurrencyCode, _toCurrency: CurrencyCode): number {
    return 1;
  }
}
