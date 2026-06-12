import { CartItem, CartSummary, ShoppingCart, CurrencyCode } from '../types';

const CART_STORAGE_KEY = 'mimomax_cart';
const CART_EXPIRATION_DAYS = 7;

export const CartService = {
  addToCart(
    existingItems: CartItem[],
    product: {
      id: string;
      name: string;
      nameAr: string;
      image: string;
      price: number;
      currency: CurrencyCode;
      availability: 'in_stock' | 'out_of_stock';
      stockQuantity: number;
    },
    quantity: number = 1
  ): CartItem[] {
    const existingItem = existingItems.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      const newQuantity = Math.min(
        existingItem.quantity + quantity,
        product.stockQuantity
      );
      return existingItems.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );
    }

    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      productNameAr: product.nameAr,
      productImage: product.image,
      price: product.price,
      currency: product.currency,
      quantity: Math.min(quantity, product.stockQuantity),
      availability: product.availability,
    };

    return [...existingItems, newItem];
  },

  removeFromCart(items: CartItem[], itemId: string): CartItem[] {
    return items.filter((item) => item.id !== itemId);
  },

  updateQuantity(
    items: CartItem[],
    itemId: string,
    quantity: number,
    maxStock: number
  ): CartItem[] {
    if (quantity < 1) return items;
    
    return items.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.min(quantity, maxStock) }
        : item
    );
  },

  calculateCartSummary(items: CartItem[], shipping: number = 0): CartSummary {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const tax = subtotal * 0.15; // 15% VAT for MENA region
    
    const total = subtotal + shipping + tax;

    return {
      items,
      subtotal,
      shipping,
      tax,
      total,
      currency: items[0]?.currency || 'SAR',
      itemCount,
    };
  },

  persistCart(cart: ShoppingCart): void {
    try {
      const data = {
        ...cart,
        expiresAt: Date.now() + CART_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist cart:', error);
    }
  },

  loadCart(): ShoppingCart | null {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
        localStorage.removeItem(CART_STORAGE_KEY);
        return null;
      }

      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch (error) {
      console.error('Failed to load cart:', error);
      return null;
    }
  },

  clearCart(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  },

  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};
