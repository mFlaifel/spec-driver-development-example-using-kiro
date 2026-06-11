import { z } from 'zod';
import type {
  Product,
  ProductImage,
  Specifications,
  CartItem,
  CartSummary,
  Address,
  ContactInfo,
  OrderData,
  CountryCode,
  CurrencyCode,
  PaymentMethod,
} from '../types';

const countryCodeEnum = z.enum(['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'EG', 'JO', 'MA', 'DZ']);
const currencyCodeEnum = z.enum(['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'EGP', 'JOD', 'MAD', 'DZD']);
const paymentMethodEnum = z.enum(['credit_card', 'paypal', 'cash_on_delivery']);
const availabilityEnum = z.enum(['in_stock', 'out_of_stock', 'preorder']);
const cartAvailabilityEnum = z.enum(['in_stock', 'out_of_stock']);

const productImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  altAr: z.string(),
  width: z.number(),
  height: z.number(),
  isPrimary: z.boolean(),
}) satisfies z.ZodType<ProductImage>;

const specificationsSchema = z.object({
  screenSize: z.string(),
  resolution: z.string(),
  processor: z.string(),
  ram: z.string(),
  storage: z.string(),
  battery: z.string(),
  camera: z.string(),
  weight: z.string(),
  dimensions: z.string(),
  os: z.string(),
}) satisfies z.ZodType<Specifications>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameAr: z.string(),
  description: z.string(),
  descriptionAr: z.string(),
  brand: z.string(),
  price: z.number().positive(),
  currency: currencyCodeEnum,
  images: z.array(productImageSchema),
  specifications: specificationsSchema,
  availability: availabilityEnum,
  stockQuantity: z.number().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Product>;

export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  productNameAr: z.string(),
  productImage: z.string(),
  price: z.number(),
  currency: currencyCodeEnum,
  quantity: z.number(),
  availability: cartAvailabilityEnum,
}) satisfies z.ZodType<CartItem>;

const cartSummarySchema = z.object({
  items: z.array(cartItemSchema),
  subtotal: z.number(),
  shipping: z.number(),
  tax: z.number(),
  total: z.number(),
  currency: currencyCodeEnum,
  itemCount: z.number(),
}) satisfies z.ZodType<CartSummary>;

export const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  countryCode: countryCodeEnum,
}) satisfies z.ZodType<Address>;

export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
}) satisfies z.ZodType<ContactInfo>;

export const orderDataSchema = z.object({
  shippingAddress: addressSchema,
  contactInfo: contactInfoSchema,
  shippingOption: z.string(),
  paymentMethod: paymentMethodEnum,
  cartSummary: cartSummarySchema,
}) satisfies z.ZodType<OrderData>;

export function isProduct(value: unknown): value is Product {
  return productSchema.safeParse(value).success;
}

export function isCartItem(value: unknown): value is CartItem {
  return cartItemSchema.safeParse(value).success;
}

export function isValidCountryCode(value: string): value is CountryCode {
  return countryCodeEnum.safeParse(value).success;
}

export function isValidCurrencyCode(value: string): value is CurrencyCode {
  return currencyCodeEnum.safeParse(value).success;
}

export function isPaymentMethod(value: string): value is PaymentMethod {
  return paymentMethodEnum.safeParse(value).success;
}
