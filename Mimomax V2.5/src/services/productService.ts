import { Product, ProductFilter, FilterOptions } from '../types';
import { mockProducts } from '../data/mockProducts';
import { delay } from '../utils/helpers';

const simulateApi = async <T>(data: T, ms = 300): Promise<T> => {
  await delay(ms);
  return data;
};

export const ProductService = {
  async getProducts(
    filter?: ProductFilter
  ): Promise<{ products: Product[]; total: number }> {
    let filtered = [...mockProducts];

    if (filter) {
      if (filter.search) {
        const search = filter.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.nameAr.includes(filter.search!) ||
            p.description.toLowerCase().includes(search) ||
            p.descriptionAr.includes(filter.search!) ||
            p.brand.toLowerCase().includes(search)
        );
      }

      if (filter.brand && filter.brand.length > 0) {
        filtered = filtered.filter((p) => filter.brand!.includes(p.brand));
      }

      if (filter.priceRange) {
        filtered = filtered.filter(
          (p) =>
            p.price >= filter.priceRange!.min && p.price <= filter.priceRange!.max
        );
      }

      if (filter.availability && filter.availability.length > 0) {
        filtered = filtered.filter((p) =>
          filter.availability!.includes(p.availability)
        );
      }

      if (filter.sort) {
        switch (filter.sort) {
          case 'price_asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'name_asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name_desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'newest':
            filtered.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
        }
      }

      if (filter.page && filter.pageSize) {
        const start = (filter.page - 1) * filter.pageSize;
        const end = start + filter.pageSize;
        filtered = filtered.slice(start, end);
      }
    }

    return simulateApi({ products: filtered, total: filtered.length });
  },

  async getProductById(id: string): Promise<Product | null> {
    const product = mockProducts.find((p) => p.id === id) || null;
    return simulateApi(product);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const search = query.toLowerCase();
    const results = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.nameAr.includes(query) ||
        p.description.toLowerCase().includes(search) ||
        p.descriptionAr.includes(query)
    );
    return simulateApi(results);
  },

  async filterProducts(filter: ProductFilter): Promise<Product[]> {
    const { products } = await this.getProducts(filter);
    return products;
  },

  async getFilterOptions(): Promise<FilterOptions> {
    const brands = [...new Set(mockProducts.map((p) => p.brand))];
    const prices = mockProducts.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return simulateApi({
      brands,
      priceRange: { min: minPrice, max: maxPrice },
      availability: ['in_stock', 'out_of_stock', 'preorder'],
    });
  },
};
