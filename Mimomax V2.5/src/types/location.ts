export type CountryCode = 'SA' | 'AE' | 'KW' | 'QA' | 'BH' | 'OM' | 'EG' | 'JO' | 'MA' | 'DZ';
export type CurrencyCode = 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR' | 'EGP' | 'JOD' | 'MAD' | 'DZD';

export interface Country {
  code: CountryCode;
  name: string;
  nameAr: string;
  currency: CurrencyCode;
  shippingZone: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  nameAr: string;
  cost: number;
  currency: CurrencyCode;
  estimatedDays: number;
  countryCode: CountryCode;
}
