import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { FilterState, PriceRange } from '../types';

const initialState: FilterState = {
  searchTerm: '',
  brands: [],
  priceRange: { min: 0, max: 10000 },
  screenSizes: [],
  storage: [],
  ram: [],
  processors: [],
};

type FilterAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_BRANDS'; payload: string[] }
  | { type: 'SET_PRICE_RANGE'; payload: PriceRange }
  | { type: 'SET_SCREEN_SIZES'; payload: string[] }
  | { type: 'SET_STORAGE'; payload: string[] }
  | { type: 'SET_RAM'; payload: string[] }
  | { type: 'SET_PROCESSORS'; payload: string[] }
  | { type: 'CLEAR_FILTERS' };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_FILTERS':
      return { ...state, ...action.payload };
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };
    case 'SET_SCREEN_SIZES':
      return { ...state, screenSizes: action.payload };
    case 'SET_STORAGE':
      return { ...state, storage: action.payload };
    case 'SET_RAM':
      return { ...state, ram: action.payload };
    case 'SET_PROCESSORS':
      return { ...state, processors: action.payload };
    case 'CLEAR_FILTERS':
      return { ...initialState };
    default:
      return state;
  }
}

interface FilterContextType {
  filters: FilterState;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setBrandFilter: (brands: string[]) => void;
  setPriceRange: (range: PriceRange) => void;
  setScreenSizes: (sizes: string[]) => void;
  setStorage: (storage: string[]) => void;
  setRam: (ram: string[]) => void;
  setProcessors: (processors: string[]) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  const setSearchTerm = (term: string) => dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  const setFilters = (filters: Partial<FilterState>) => dispatch({ type: 'SET_FILTERS', payload: filters });
  const setBrandFilter = (brands: string[]) => dispatch({ type: 'SET_BRANDS', payload: brands });
  const setPriceRange = (range: PriceRange) => dispatch({ type: 'SET_PRICE_RANGE', payload: range });
  const setScreenSizes = (sizes: string[]) => dispatch({ type: 'SET_SCREEN_SIZES', payload: sizes });
  const setStorage = (storage: string[]) => dispatch({ type: 'SET_STORAGE', payload: storage });
  const setRam = (ram: string[]) => dispatch({ type: 'SET_RAM', payload: ram });
  const setProcessors = (processors: string[]) => dispatch({ type: 'SET_PROCESSORS', payload: processors });
  const clearFilters = () => dispatch({ type: 'CLEAR_FILTERS' });

  return (
    <FilterContext.Provider value={{
      filters,
      setSearchTerm,
      setFilters,
      setBrandFilter,
      setPriceRange,
      setScreenSizes,
      setStorage,
      setRam,
      setProcessors,
      clearFilters,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

function useFilters(): FilterContextType {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

export { FilterProvider, useFilters };
export type { FilterContextType };
