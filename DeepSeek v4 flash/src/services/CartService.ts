import { CartItem, CartSummary, ShoppingCart, CurrencyCode } from '../types';

const CART_STORAGE_KEY = 'cart';
const CART_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

interface CartStorageData {
  data: ShoppingCart;
  timestamp: number;
}

export interface CartOperations {
  addToCart(productId: string, quantity: number): CartItem;
  removeFromCart(itemId: string): void;
  updateQuantity(itemId: string, quantity: number): void;
  calculateCartSummary(items: CartItem[], shipping: number): CartSummary;
  persistCart(cart: ShoppingCart): void;
  loadCart(): ShoppingCart | null;
  clearCart(): void;
}

export class CartService implements CartOperations {
  static addToCart(productId: string, quantity: number): CartItem {
    return {
      id: '',
      productId,
      productName: '',
      productNameAr: '',
      productImage: '',
      price: 0,
      currency: 'SAR' as CurrencyCode,
      quantity,
      availability: 'in_stock',
    };
  }

  static removeFromCart(_itemId: string): void {
  }

  static updateQuantity(_itemId: string, _quantity: number): void {
  }

  static calculateCartSummary(items: CartItem[], shipping: number): CartSummary {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = 0;
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const currency = items.length > 0 ? items[0].currency : 'SAR';

    return {
      items,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      itemCount,
      currency,
    };
  }

  static persistCart(cart: ShoppingCart): void {
    const storageData: CartStorageData = {
      data: cart,
      timestamp: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storageData));
  }

  static loadCart(): ShoppingCart | null {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed: CartStorageData = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > CART_EXPIRATION_MS) {
        localStorage.removeItem(CART_STORAGE_KEY);
        return null;
      }
      return parsed.data;
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }
  }

  static clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  addToCart(productId: string, quantity: number): CartItem {
    return CartService.addToCart(productId, quantity);
  }

  removeFromCart(itemId: string): void {
    CartService.removeFromCart(itemId);
  }

  updateQuantity(itemId: string, quantity: number): void {
    CartService.updateQuantity(itemId, quantity);
  }

  calculateCartSummary(items: CartItem[], shipping: number): CartSummary {
    return CartService.calculateCartSummary(items, shipping);
  }

  persistCart(cart: ShoppingCart): void {
    CartService.persistCart(cart);
  }

  loadCart(): ShoppingCart | null {
    return CartService.loadCart();
  }

  clearCart(): void {
    CartService.clearCart();
  }
}
