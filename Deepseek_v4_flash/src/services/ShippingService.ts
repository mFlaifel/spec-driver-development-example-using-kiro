import { Country, CountryCode, ShippingOption, CurrencyCode } from '../types';

interface ZoneRates {
  standard: { baseCost: number; minDays: number; maxDays: number };
  express: { baseCost: number; minDays: number; maxDays: number };
  premium: { baseCost: number; minDays: number; maxDays: number };
}

const countries: Country[] = [
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', currency: 'SAR', shippingZone: 'middle_east' },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', currency: 'AED', shippingZone: 'middle_east' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', currency: 'KWD', shippingZone: 'middle_east' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', currency: 'QAR', shippingZone: 'middle_east' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', currency: 'BHD', shippingZone: 'middle_east' },
  { code: 'OM', name: 'Oman', nameAr: 'عمان', currency: 'OMR', shippingZone: 'middle_east' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', currency: 'EGP', shippingZone: 'north_africa' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', currency: 'JOD', shippingZone: 'levant' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', currency: 'MAD', shippingZone: 'north_africa' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', currency: 'DZD', shippingZone: 'north_africa' },
];

const countryMap: Record<CountryCode, Country> = Object.fromEntries(
  countries.map(c => [c.code, c])
) as Record<CountryCode, Country>;

const zoneRates: Record<string, ZoneRates> = {
  middle_east: {
    standard: { baseCost: 0, minDays: 5, maxDays: 7 },
    express: { baseCost: 20, minDays: 2, maxDays: 3 },
    premium: { baseCost: 40, minDays: 1, maxDays: 1 },
  },
  north_africa: {
    standard: { baseCost: 0, minDays: 5, maxDays: 7 },
    express: { baseCost: 15, minDays: 2, maxDays: 3 },
    premium: { baseCost: 30, minDays: 1, maxDays: 1 },
  },
  levant: {
    standard: { baseCost: 0, minDays: 5, maxDays: 7 },
    express: { baseCost: 10, minDays: 2, maxDays: 3 },
    premium: { baseCost: 20, minDays: 1, maxDays: 1 },
  },
};

const WEIGHT_PER_KG_RATE_EXPRESS = 5;
const WEIGHT_PER_KG_RATE_PREMIUM = 10;

export class ShippingService {
  static getCountries(): Country[] {
    return countries;
  }

  static getCountry(code: CountryCode): Country {
    const country = countryMap[code];
    if (!country) {
      throw new Error(`Country not found: ${code}`);
    }
    return country;
  }

  static getShippingOptions(countryCode: CountryCode): ShippingOption[] {
    const country = ShippingService.getCountry(countryCode);
    const zone = zoneRates[country.shippingZone];
    const currency = country.currency;

    return [
      {
        id: 'standard',
        name: 'Standard',
        nameAr: 'قياسي',
        cost: 0,
        currency,
        estimatedDays: zone.standard.maxDays,
        countryCode,
      },
      {
        id: 'express',
        name: 'Express',
        nameAr: 'سريع',
        cost: zone.express.baseCost,
        currency,
        estimatedDays: zone.express.maxDays,
        countryCode,
      },
      {
        id: 'premium',
        name: 'Premium',
        nameAr: 'ممتاز',
        cost: zone.premium.baseCost,
        currency,
        estimatedDays: zone.premium.maxDays,
        countryCode,
      },
    ];
  }

  static calculateShipping(
    cartWeight: number,
    countryCode: CountryCode,
    shippingOptionId: string
  ): number {
    const country = ShippingService.getCountry(countryCode);
    const zone = zoneRates[country.shippingZone];

    switch (shippingOptionId) {
      case 'standard':
        return 0;
      case 'express': {
        const weightCharge = Math.max(0, cartWeight) * WEIGHT_PER_KG_RATE_EXPRESS;
        return zone.express.baseCost + weightCharge;
      }
      case 'premium': {
        const weightCharge = Math.max(0, cartWeight) * WEIGHT_PER_KG_RATE_PREMIUM;
        return zone.premium.baseCost + weightCharge;
      }
      default:
        throw new Error(`Invalid shipping option: ${shippingOptionId}`);
    }
  }

  static estimateDelivery(
    countryCode: CountryCode,
    shippingOptionId: string
  ): number {
    const country = ShippingService.getCountry(countryCode);
    const zone = zoneRates[country.shippingZone];

    switch (shippingOptionId) {
      case 'standard':
        return zone.standard.maxDays;
      case 'express':
        return zone.express.maxDays;
      case 'premium':
        return zone.premium.maxDays;
      default:
        throw new Error(`Invalid shipping option: ${shippingOptionId}`);
    }
  }
}
