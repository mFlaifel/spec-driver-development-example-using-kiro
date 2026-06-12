export interface FilterState {
  searchTerm: string;
  brands: string[];
  priceRange: PriceRange;
  screenSizes: string[];
  storage: string[];
  ram: string[];
  processors: string[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductFilter {
  search?: string;
  brand?: string[];
  priceRange?: PriceRange;
  availability?: ('in_stock' | 'out_of_stock' | 'preorder')[];
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  page?: number;
  pageSize?: number;
}

export interface FilterOptions {
  brands: string[];
  screenSizes?: string[];
  storage?: string[];
  ram?: string[];
  processors?: string[];
  priceRange: PriceRange;
  availability: ('in_stock' | 'out_of_stock' | 'preorder')[];
}
