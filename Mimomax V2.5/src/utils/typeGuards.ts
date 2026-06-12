import { Product, CartItem, CountryCode, CurrencyCode, PaymentMethod, OrderStatus } from '../types';

export const isProduct = (obj: any): obj is Product => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.nameAr === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.brand === 'string' &&
    Array.isArray(obj.images) &&
    typeof obj.specifications === 'object' &&
    ['in_stock', 'out_of_stock', 'preorder'].includes(obj.availability)
  );
};

export const isCartItem = (obj: any): obj is CartItem => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.productId === 'string' &&
    typeof obj.productName === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.quantity === 'number' &&
    obj.quantity > 0
  );
};

const validCountryCodes: CountryCode[] = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'EG', 'JO', 'MA', 'DZ'];
const validCurrencyCodes: CurrencyCode[] = ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'EGP', 'JOD', 'MAD', 'DZD'];
const validPaymentMethods: PaymentMethod[] = ['credit_card', 'paypal', 'cash_on_delivery'];
const validOrderStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export const isValidCountryCode = (code: string): code is CountryCode => {
  return validCountryCodes.includes(code as CountryCode);
};

export const isValidCurrencyCode = (code: string): code is CurrencyCode => {
  return validCurrencyCodes.includes(code as CurrencyCode);
};

export const isValidPaymentMethod = (method: string): method is PaymentMethod => {
  return validPaymentMethods.includes(method as PaymentMethod);
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return validOrderStatuses.includes(status as OrderStatus);
};
