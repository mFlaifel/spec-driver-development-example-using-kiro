import { CountryCode, CurrencyCode, ShippingOption } from './location';
import { CartItem, CartSummary } from './cart';

export interface OrderData {
  shippingAddress: Address;
  contactInfo: ContactInfo;
  shippingOption: string;
  paymentMethod: PaymentMethod;
  cartSummary: CartSummary;
}

export interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: CountryCode;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'cash_on_delivery';

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  items: CartItem[];
  shippingAddress: Address;
  contactInfo: ContactInfo;
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: CurrencyCode;
  status: OrderStatus;
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
