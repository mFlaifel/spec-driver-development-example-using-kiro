import { CountryCode, ShippingOption } from '../types';

const shippingOptionsByCountry: Record<CountryCode, ShippingOption[]> = {
  SA: [
    { id: 'sa-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 15, currency: 'SAR', estimatedDays: 5, countryCode: 'SA' },
    { id: 'sa-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 30, currency: 'SAR', estimatedDays: 2, countryCode: 'SA' },
    { id: 'sa-overnight', name: 'Overnight Shipping', nameAr: 'شحن سريع جداً', cost: 50, currency: 'SAR', estimatedDays: 1, countryCode: 'SA' },
  ],
  AE: [
    { id: 'ae-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 20, currency: 'AED', estimatedDays: 5, countryCode: 'AE' },
    { id: 'ae-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 40, currency: 'AED', estimatedDays: 2, countryCode: 'AE' },
  ],
  KW: [
    { id: 'kw-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 2, currency: 'KWD', estimatedDays: 5, countryCode: 'KW' },
    { id: 'kw-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 4, currency: 'KWD', estimatedDays: 2, countryCode: 'KW' },
  ],
  QA: [
    { id: 'qa-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 20, currency: 'QAR', estimatedDays: 5, countryCode: 'QA' },
    { id: 'qa-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 40, currency: 'QAR', estimatedDays: 2, countryCode: 'QA' },
  ],
  BH: [
    { id: 'bh-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 2, currency: 'BHD', estimatedDays: 5, countryCode: 'BH' },
    { id: 'bh-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 4, currency: 'BHD', estimatedDays: 2, countryCode: 'BH' },
  ],
  OM: [
    { id: 'om-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 2, currency: 'OMR', estimatedDays: 5, countryCode: 'OM' },
    { id: 'om-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 4, currency: 'OMR', estimatedDays: 2, countryCode: 'OM' },
  ],
  EG: [
    { id: 'eg-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 50, currency: 'EGP', estimatedDays: 7, countryCode: 'EG' },
    { id: 'eg-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 100, currency: 'EGP', estimatedDays: 3, countryCode: 'EG' },
  ],
  JO: [
    { id: 'jo-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 3, currency: 'JOD', estimatedDays: 5, countryCode: 'JO' },
    { id: 'jo-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 6, currency: 'JOD', estimatedDays: 2, countryCode: 'JO' },
  ],
  MA: [
    { id: 'ma-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 30, currency: 'MAD', estimatedDays: 7, countryCode: 'MA' },
    { id: 'ma-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 60, currency: 'MAD', estimatedDays: 3, countryCode: 'MA' },
  ],
  DZ: [
    { id: 'dz-standard', name: 'Standard Shipping', nameAr: 'الشحن العادي', cost: 400, currency: 'DZD', estimatedDays: 7, countryCode: 'DZ' },
    { id: 'dz-express', name: 'Express Shipping', nameAr: 'الشحن السريع', cost: 800, currency: 'DZD', estimatedDays: 3, countryCode: 'DZ' },
  ],
};

const shippingRatesPerKg: Record<CountryCode, number> = {
  SA: 5,
  AE: 7,
  KW: 0.5,
  QA: 7,
  BH: 0.5,
  OM: 0.5,
  EG: 15,
  JO: 1,
  MA: 10,
  DZ: 100,
};

export const ShippingService = {
  getShippingOptions(countryCode: CountryCode): ShippingOption[] {
    return shippingOptionsByCountry[countryCode] || shippingOptionsByCountry.SA;
  },

  calculateShipping(
    cartWeight: number,
    countryCode: CountryCode,
    shippingOptionId: string
  ): number {
    const options = this.getShippingOptions(countryCode);
    const option = options.find((o) => o.id === shippingOptionId);
    
    if (!option) return 0;
    
    const ratePerKg = shippingRatesPerKg[countryCode] || 5;
    const additionalWeight = Math.max(0, cartWeight - 1);
    
    return option.cost + additionalWeight * ratePerKg;
  },

  estimateDelivery(countryCode: CountryCode, shippingOptionId: string): number {
    const options = this.getShippingOptions(countryCode);
    const option = options.find((o) => o.id === shippingOptionId);
    
    return option?.estimatedDays || 5;
  },

  getCountryName(countryCode: CountryCode, language: string): string {
    const countryNames: Record<CountryCode, { en: string; ar: string }> = {
      SA: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
      AE: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
      KW: { en: 'Kuwait', ar: 'الكويت' },
      QA: { en: 'Qatar', ar: 'قطر' },
      BH: { en: 'Bahrain', ar: 'البحرين' },
      OM: { en: 'Oman', ar: 'عُمان' },
      EG: { en: 'Egypt', ar: 'مصر' },
      JO: { en: 'Jordan', ar: 'الأردن' },
      MA: { en: 'Morocco', ar: 'المغرب' },
      DZ: { en: 'Algeria', ar: 'الجزائر' },
    };
    
    return countryNames[countryCode]?.[language as 'en' | 'ar'] || countryCode;
  },
};
