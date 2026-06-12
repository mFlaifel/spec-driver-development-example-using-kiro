import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Country, CountryCode, CurrencyCode, ShippingOption } from '../types';
import { ShippingService } from '../services/ShippingService';

interface LocationContextType {
  country: Country;
  currency: CurrencyCode;
  shippingOptions: ShippingOption[];
  availableCountries: Country[];
  changeCountry(code: CountryCode): void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);
const STORAGE_KEY = 'location_country_code';

function getInitialCountry(): Country {
  const stored = localStorage.getItem(STORAGE_KEY) as CountryCode | null;
  if (stored) {
    try {
      return ShippingService.getCountry(stored);
    } catch {
      // stored code invalid, fall through to default
    }
  }
  return ShippingService.getCountry('SA');
}

function LocationProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country>(getInitialCountry);
  const [currency, setCurrency] = useState<CurrencyCode>(country.currency);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [availableCountries] = useState<Country[]>(ShippingService.getCountries);

  useEffect(() => {
    setCurrency(country.currency);
    setShippingOptions(ShippingService.getShippingOptions(country.code));
    localStorage.setItem(STORAGE_KEY, country.code);
  }, [country]);

  const changeCountry = (code: CountryCode) => {
    const newCountry = ShippingService.getCountry(code);
    setCountry(newCountry);
  };

  return (
    <LocationContext.Provider value={{ country, currency, shippingOptions, availableCountries, changeCountry }}>
      {children}
    </LocationContext.Provider>
  );
}

function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

export { LocationProvider, useLocation };
export type { LocationContextType };
