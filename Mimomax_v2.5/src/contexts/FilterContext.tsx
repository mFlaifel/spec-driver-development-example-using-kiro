import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { FilterState, FilterOptions, PriceRange } from '../types';

type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_BRANDS'; payload: string[] }
  | { type: 'SET_SCREEN_SIZES'; payload: string[] }
  | { type: 'SET_STORAGE'; payload: string[] }
  | { type: 'SET_RAM'; payload: string[] }
  | { type: 'SET_PROCESSORS'; payload: string[] }
  | { type: 'SET_PRICE_RANGE'; payload: PriceRange }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_AVAILABLE_OPTIONS'; payload: FilterOptions };

interface FilterContextType {
  filters: FilterState;
  availableOptions: FilterOptions;
  setSearch: (term: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setBrands: (brands: string[]) => void;
  setScreenSizes: (sizes: string[]) => void;
  setStorage: (storage: string[]) => void;
  setRam: (ram: string[]) => void;
  setProcessors: (processors: string[]) => void;
  setPriceRange: (range: PriceRange) => void;
  clearFilters: () => void;
  setAvailableOptions: (options: FilterOptions) => void;
  activeFilterCount: number;
}

const initialFilterState: FilterState = {
  searchTerm: '',
  brands: [],
  priceRange: { min: 0, max: Infinity },
  screenSizes: [],
  storage: [],
  ram: [],
  processors: [],
};

const defaultAvailableOptions: FilterOptions = {
  brands: [],
  screenSizes: [],
  storage: [],
  ram: [],
  processors: [],
  priceRange: { min: 0, max: Infinity },
  availability: [],
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'SET_FILTERS':
      return { ...state, ...action.payload };
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    case 'SET_SCREEN_SIZES':
      return { ...state, screenSizes: action.payload };
    case 'SET_STORAGE':
      return { ...state, storage: action.payload };
    case 'SET_RAM':
      return { ...state, ram: action.payload };
    case 'SET_PROCESSORS':
      return { ...state, processors: action.payload };
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };
    case 'CLEAR_FILTERS':
      return initialFilterState;
    default:
      return state;
  }
}

function getFiltersFromUrl(): FilterState {
  if (typeof window === 'undefined') return initialFilterState;
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    searchTerm: params.get('search') || '',
    brands: params.get('brands')?.split(',').filter(Boolean) || [],
    priceRange: {
      min: Number(params.get('minPrice')) || 0,
      max: Number(params.get('maxPrice')) || Infinity,
    },
    screenSizes: params.get('screenSizes')?.split(',').filter(Boolean) || [],
    storage: params.get('storage')?.split(',').filter(Boolean) || [],
    ram: params.get('ram')?.split(',').filter(Boolean) || [],
    processors: params.get('processors')?.split(',').filter(Boolean) || [],
  };
}

function updateUrlWithFilters(filters: FilterState): void {
  if (typeof window === 'undefined') return;
  
  const params = new URLSearchParams();
  
  if (filters.searchTerm) params.set('search', filters.searchTerm);
  if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
  if (filters.priceRange.min > 0) params.set('minPrice', String(filters.priceRange.min));
  if (filters.priceRange.max < Infinity) params.set('maxPrice', String(filters.priceRange.max));
  if (filters.screenSizes.length > 0) params.set('screenSizes', filters.screenSizes.join(','));
  if (filters.storage.length > 0) params.set('storage', filters.storage.join(','));
  if (filters.ram.length > 0) params.set('ram', filters.ram.join(','));
  if (filters.processors.length > 0) params.set('processors', filters.processors.join(','));
  
  const queryString = params.toString();
  const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [filters, dispatch] = useReducer(filterReducer, undefined, getFiltersFromUrl);
  const [availableOptions, setAvailableOptionsState] = React.useState<FilterOptions>(defaultAvailableOptions);

  useEffect(() => {
    updateUrlWithFilters(filters);
  }, [filters]);

  const setSearch = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH', payload: term });
  }, []);

  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  const setBrands = useCallback((brands: string[]) => {
    dispatch({ type: 'SET_BRANDS', payload: brands });
  }, []);

  const setScreenSizes = useCallback((sizes: string[]) => {
    dispatch({ type: 'SET_SCREEN_SIZES', payload: sizes });
  }, []);

  const setStorage = useCallback((storage: string[]) => {
    dispatch({ type: 'SET_STORAGE', payload: storage });
  }, []);

  const setRam = useCallback((ram: string[]) => {
    dispatch({ type: 'SET_RAM', payload: ram });
  }, []);

  const setProcessors = useCallback((processors: string[]) => {
    dispatch({ type: 'SET_PROCESSORS', payload: processors });
  }, []);

  const setPriceRange = useCallback((range: PriceRange) => {
    dispatch({ type: 'SET_PRICE_RANGE', payload: range });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  const setAvailableOptions = useCallback((options: FilterOptions) => {
    setAvailableOptionsState(options);
  }, []);

  const activeFilterCount = [
    filters.searchTerm ? 1 : 0,
    filters.brands.length > 0 ? 1 : 0,
    filters.priceRange.min > 0 || filters.priceRange.max < Infinity ? 1 : 0,
    filters.screenSizes.length > 0 ? 1 : 0,
    filters.storage.length > 0 ? 1 : 0,
    filters.ram.length > 0 ? 1 : 0,
    filters.processors.length > 0 ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <FilterContext.Provider
      value={{
        filters,
        availableOptions,
        setSearch,
        setFilters,
        setBrands,
        setScreenSizes,
        setStorage,
        setRam,
        setProcessors,
        setPriceRange,
        clearFilters,
        setAvailableOptions,
        activeFilterCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
