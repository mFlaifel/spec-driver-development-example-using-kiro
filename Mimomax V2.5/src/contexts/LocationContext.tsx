import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { CountryCode, CurrencyCode, ShippingOption } from '../types';
import { ShippingService } from '../services/shippingService';
import { CurrencyService } from '../services/currencyService';

interface LocationState {
  country: CountryCode;
  currency: CurrencyCode;
  shippingOptions: ShippingOption[];
  selectedShippingOption: ShippingOption | null;
}

type LocationAction =
  | { type: 'SET_COUNTRY'; payload: CountryCode }
  | { type: 'SET_SHIPPING_OPTIONS'; payload: ShippingOption[] }
  | { type: 'SET_SELECTED_SHIPPING'; payload: ShippingOption | null };

interface LocationContextType extends LocationState {
  setCountry: (country: CountryCode) => void;
  setSelectedShippingOption: (option: ShippingOption | null) => void;
  formatPrice: (amount: number) => string;
  convertPrice: (amount: number, fromCurrency: CurrencyCode) => number;
}

const LOCATION_STORAGE_KEY = 'mimomax_location';

function getStoredCountry(): CountryCode {
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.country) return parsed.country;
    }
  } catch {}
  return 'SA';
}

function getInitialState(): LocationState {
  const country = getStoredCountry();
  const currency = CurrencyService.getCurrencyForCountry(country);
  const shippingOptions = ShippingService.getShippingOptions(country);

  return {
    country,
    currency,
    shippingOptions,
    selectedShippingOption: shippingOptions[0] || null,
  };
}

function locationReducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case 'SET_COUNTRY': {
      const currency = CurrencyService.getCurrencyForCountry(action.payload);
      const shippingOptions = ShippingService.getShippingOptions(action.payload);
      return {
        ...state,
        country: action.payload,
        currency,
        shippingOptions,
        selectedShippingOption: shippingOptions[0] || null,
      };
    }
    case 'SET_SHIPPING_OPTIONS':
      return {
        ...state,
        shippingOptions: action.payload,
      };
    case 'SET_SELECTED_SHIPPING':
      return {
        ...state,
        selectedShippingOption: action.payload,
      };
    default:
      return state;
  }
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [state, dispatch] = useReducer(locationReducer, undefined, getInitialState);

  useEffect(() => {
    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify({ country: state.country })
    );
  }, [state.country]);

  const setCountry = useCallback((country: CountryCode) => {
    dispatch({ type: 'SET_COUNTRY', payload: country });
  }, []);

  const setSelectedShippingOption = useCallback((option: ShippingOption | null) => {
    dispatch({ type: 'SET_SELECTED_SHIPPING', payload: option });
  }, []);

  const formatPrice = useCallback(
    (amount: number) => {
      return CurrencyService.formatPrice(amount, state.currency, localStorage.getItem('language') || 'en');
    },
    [state.currency]
  );

  const convertPrice = useCallback(
    (amount: number, fromCurrency: CurrencyCode) => {
      return CurrencyService.convertPrice(amount, fromCurrency, state.currency);
    },
    [state.currency]
  );

  return (
    <LocationContext.Provider
      value={{
        ...state,
        setCountry,
        setSelectedShippingOption,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
