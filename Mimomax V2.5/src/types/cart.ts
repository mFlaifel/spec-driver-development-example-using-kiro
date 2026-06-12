import { CurrencyCode } from './location';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productNameAr: string;
  productImage: string;
  price: number;
  currency: CurrencyCode;
  quantity: number;
  availability: 'in_stock' | 'out_of_stock';
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: CurrencyCode;
  itemCount: number;
}

export interface ShoppingCart {
  id: string;
  sessionId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
