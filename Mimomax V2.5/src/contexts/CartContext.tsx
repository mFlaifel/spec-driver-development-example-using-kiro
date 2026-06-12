import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, CartSummary, CurrencyCode } from '../types';
import { CartService } from '../services/cartService';

interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: { product: Omit<CartItem, 'id' | 'quantity'>; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

interface CartContextType extends CartState {
  addItem: (product: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const calculateSummary = (items: CartItem[], _currency: CurrencyCode): CartSummary => {
  return CartService.calculateCartSummary(items, 0);
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS': {
      const items = action.payload;
      return {
        ...state,
        items,
        summary: calculateSummary(items, items[0]?.currency || 'SAR'),
      };
    }
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const newItems = CartService.addToCart(
        state.items,
        {
          id: product.productId,
          name: product.productName,
          nameAr: product.productNameAr,
          image: product.productImage,
          price: product.price,
          currency: product.currency,
          availability: product.availability,
          stockQuantity: 999,
        },
        quantity
      );
      return {
        ...state,
        items: newItems,
        summary: calculateSummary(newItems, newItems[0]?.currency || 'SAR'),
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = CartService.removeFromCart(state.items, action.payload);
      return {
        ...state,
        items: newItems,
        summary: calculateSummary(newItems, newItems[0]?.currency || 'SAR'),
      };
    }
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((i) => i.id === itemId);
      const newItems = CartService.updateQuantity(state.items, itemId, quantity, item ? 999 : 0);
      return {
        ...state,
        items: newItems,
        summary: calculateSummary(newItems, newItems[0]?.currency || 'SAR'),
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        summary: calculateSummary([], 'SAR'),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const initialState: CartState = {
  items: [],
  summary: {
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    currency: 'SAR',
    itemCount: 0,
  },
  isLoading: false,
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const loadedCart = CartService.loadCart();
    if (loadedCart) {
      dispatch({ type: 'SET_ITEMS', payload: loadedCart.items });
    }
  }, []);

  useEffect(() => {
    if (state.items.length > 0) {
      const cart = {
        id: 'cart_1',
        sessionId: CartService.generateSessionId(),
        items: state.items,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      CartService.persistCart(cart);
    }
  }, [state.items]);

  const addItem = useCallback((product: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    CartService.clearCart();
  }, []);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
