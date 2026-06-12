import { CurrencyCode } from './location';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  brand: string;
  price: number;
  currency: CurrencyCode;
  images: ProductImage[];
  specifications: Specifications;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  url: string;
  alt: string;
  altAr: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface Specifications {
  screenSize: string;
  resolution: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  camera: string;
  weight: string;
  dimensions: string;
  os: string;
}
