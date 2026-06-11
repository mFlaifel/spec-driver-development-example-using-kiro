export type CountryCode = 'SA' | 'AE' | 'KW' | 'QA' | 'BH' | 'OM' | 'EG' | 'JO' | 'MA' | 'DZ';

export type CurrencyCode = 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR' | 'EGP' | 'JOD' | 'MAD' | 'DZD';

export type PaymentMethod = 'credit_card' | 'paypal' | 'cash_on_delivery';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

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

export interface FilterState {
  searchTerm: string;
  brands: string[];
  priceRange: PriceRange;
  screenSizes: string[];
  storage: string[];
  ram: string[];
  processors: string[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterOptions {
  brands: string[];
  screenSizes: string[];
  storage: string[];
  ram: string[];
  processors: string[];
  priceRange: PriceRange;
}

export interface Country {
  code: CountryCode;
  name: string;
  nameAr: string;
  currency: CurrencyCode;
  shippingZone: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  nameAr: string;
  cost: number;
  currency: CurrencyCode;
  estimatedDays: number;
  countryCode: CountryCode;
}

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

export interface ApiError {
  code: string;
  message: string;
  messageAr: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  messageAr: string;
  type: 'required' | 'format' | 'range' | 'custom';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
