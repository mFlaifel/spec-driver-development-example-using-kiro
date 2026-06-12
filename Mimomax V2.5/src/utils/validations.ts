import { z } from 'zod';

export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  addressLine1: z.string().min(1, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  countryCode: z.enum(['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'EG', 'JO', 'MA', 'DZ']),
});

export const contactInfoSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits').max(15),
});

export const orderDataSchema = z.object({
  shippingAddress: addressSchema,
  contactInfo: contactInfoSchema,
  shippingOption: z.string().min(1, 'Shipping option is required'),
  paymentMethod: z.enum(['credit_card', 'paypal', 'cash_on_delivery']),
});

export const emailSchema = z.string().email('Please enter a valid email address');

export const phoneSchema = z.string().min(8, 'Phone number must be at least 8 digits').max(15);

export type AddressFormData = z.infer<typeof addressSchema>;
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type OrderDataFormData = z.infer<typeof orderDataSchema>;
