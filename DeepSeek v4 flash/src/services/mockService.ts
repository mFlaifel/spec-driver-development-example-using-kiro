import { mockProducts } from './mockData';
import { ProductService } from './ProductService';

export function initializeMockData(): void {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  ProductService.getProducts = async function () {
    await delay(200 + Math.random() * 300);
    return [...mockProducts];
  };

  ProductService.getProductById = async function (id: string) {
    await delay(100 + Math.random() * 200);
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw { code: 'NOT_FOUND', message: 'Product not found', messageAr: 'المنتج غير موجود' };
    }
    return { ...product };
  };
}
