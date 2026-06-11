import { Product, FilterState, FilterOptions } from '../types';

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    throw new Error('Not implemented');
  }

  static async getProductById(id: string): Promise<Product> {
    throw new Error('Not implemented');
  }

  static searchProducts(products: Product[], term: string): Product[] {
    if (!term) {
      return products;
    }

    const searchTerm = term.toLowerCase();

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.nameAr.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.descriptionAr.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
      );
    });
  }

  static filterProducts(products: Product[], filters: FilterState): Product[] {
    return products.filter((product) => {
      if (
        filters.brands.length > 0 &&
        !filters.brands.includes(product.brand)
      ) {
        return false;
      }

      if (
        product.price < filters.priceRange.min ||
        product.price > filters.priceRange.max
      ) {
        return false;
      }

      if (
        filters.screenSizes.length > 0 &&
        !filters.screenSizes.includes(product.specifications.screenSize)
      ) {
        return false;
      }

      if (
        filters.storage.length > 0 &&
        !filters.storage.includes(product.specifications.storage)
      ) {
        return false;
      }

      if (
        filters.ram.length > 0 &&
        !filters.ram.includes(product.specifications.ram)
      ) {
        return false;
      }

      if (
        filters.processors.length > 0 &&
        !filters.processors.includes(product.specifications.processor)
      ) {
        return false;
      }

      return true;
    });
  }

  static getFilterOptions(products: Product[]): FilterOptions {
    const brands = [...new Set(products.map((p) => p.brand))].sort();
    const screenSizes = [
      ...new Set(products.map((p) => p.specifications.screenSize)),
    ].sort();
    const storage = [
      ...new Set(products.map((p) => p.specifications.storage)),
    ].sort();
    const ram = [
      ...new Set(products.map((p) => p.specifications.ram)),
    ].sort();
    const processors = [
      ...new Set(products.map((p) => p.specifications.processor)),
    ].sort();

    const prices = products.map((p) => p.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };

    return {
      brands,
      screenSizes,
      storage,
      ram,
      processors,
      priceRange,
    };
  }
}
