import { createContext, useContext, useReducer, useEffect, useMemo, type ReactNode } from 'react';
import { CartItem, CartSummary, ShoppingCart } from '../types';
import { CartService } from '../services/CartService';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  addItem(product: CartItem): void;
  removeItem(itemId: string): void;
  updateQuantity(itemId: string, quantity: number): void;
  clearCart(): void;
  isInCart(productId: string): boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartState {
  items: CartItem[];
  sessionId: string;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );
      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.itemId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

function getInitialState(): CartState {
  const cart = CartService.loadCart();
  if (cart && cart.items.length > 0) {
    return { items: cart.items, sessionId: cart.sessionId };
  }
  return { items: [], sessionId: crypto.randomUUID() };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialState);

  const summary = useMemo(() => CartService.calculateCartSummary(state.items, 0), [state.items]);

  useEffect(() => {
    const cart: ShoppingCart = {
      id: state.sessionId,
      sessionId: state.sessionId,
      items: state.items,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    CartService.persistCart(cart);
  }, [state.items, state.sessionId]);

  const addItem = (product: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some((item) => item.productId === productId);
  };

  const value: CartContextType = {
    items: state.items,
    summary,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { CartProvider, useCart };
export type { CartContextType };
