import { ValidationResult, ValidationError, Address, CartItem, OrderData, CountryCode } from '../types';

function createValidationError(
  field: string,
  message: string,
  messageAr: string,
  type: ValidationError['type']
): ValidationError {
  return { field, message, messageAr, type };
}

function createValidationResult(isValid: boolean, errors: ValidationError[] = []): ValidationResult {
  return { isValid, errors };
}

export const ValidationService = {
  validateEmail(email: string): ValidationResult {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!email.trim()) {
      return createValidationResult(false, [
        createValidationError('email', 'Email is required', 'البريد الإلكتروني مطلوب', 'required'),
      ]);
    }

    if (!emailRegex.test(email)) {
      return createValidationResult(false, [
        createValidationError('email', 'Please enter a valid email address', 'يرجى إدخال عنوان بريد إلكتروني صالح', 'format'),
      ]);
    }

    return createValidationResult(true);
  },

  validatePhone(phone: string, countryCode: CountryCode): ValidationResult {
    if (!phone.trim()) {
      return createValidationResult(false, [
        createValidationError('phone', 'Phone number is required', 'رقم الهاتف مطلوب', 'required'),
      ]);
    }

    const cleaned = phone.replace(/[\s\-\(\)]/g, '');

    if (!/^\+?\d{7,15}$/.test(cleaned)) {
      return createValidationResult(false, [
        createValidationError('phone', 'Please enter a valid phone number', 'يرجى إدخال رقم هاتف صالح', 'format'),
      ]);
    }

    const phoneLengthByCountry: Partial<Record<CountryCode, { min: number; max: number }>> = {
      SA: { min: 9, max: 9 },
      AE: { min: 9, max: 9 },
      KW: { min: 8, max: 8 },
      QA: { min: 8, max: 8 },
      BH: { min: 8, max: 8 },
      OM: { min: 8, max: 8 },
      EG: { min: 10, max: 10 },
      JO: { min: 9, max: 9 },
      MA: { min: 9, max: 9 },
      DZ: { min: 9, max: 9 },
    };

    const digitsOnly = cleaned.replace(/^\+?\d{1,3}/, '');
    const expectedLength = phoneLengthByCountry[countryCode];

    if (expectedLength && (digitsOnly.length < expectedLength.min || digitsOnly.length > expectedLength.max)) {
      return createValidationResult(false, [
        createValidationError(
          'phone',
          `Phone number must be ${expectedLength.min} digits for ${countryCode}`,
          `يجب أن يكون رقم الهاتف ${expectedLength.min} أرقام لـ ${countryCode}`,
          'format'
        ),
      ]);
    }

    return createValidationResult(true);
  },

  validateAddress(address: Address): ValidationResult {
    const errors: ValidationError[] = [];

    if (!address.firstName.trim()) {
      errors.push(createValidationError('firstName', 'First name is required', 'الاسم الأول مطلوب', 'required'));
    }

    if (!address.lastName.trim()) {
      errors.push(createValidationError('lastName', 'Last name is required', 'اسم العائلة مطلوب', 'required'));
    }

    if (!address.addressLine1.trim()) {
      errors.push(createValidationError('addressLine1', 'Address is required', 'العنوان مطلوب', 'required'));
    }

    if (!address.city.trim()) {
      errors.push(createValidationError('city', 'City is required', 'المدينة مطلوبة', 'required'));
    }

    if (!address.postalCode.trim()) {
      errors.push(createValidationError('postalCode', 'Postal code is required', 'الرمز البريدي مطلوب', 'required'));
    }

    return createValidationResult(errors.length === 0, errors);
  },

  validateCartItem(item: CartItem): ValidationResult {
    const errors: ValidationError[] = [];

    if (item.quantity < 1) {
      errors.push(createValidationError('quantity', 'Quantity must be at least 1', 'يجب أن تكون الكمية 1 على الأقل', 'range'));
    }

    if (item.availability === 'out_of_stock') {
      errors.push(createValidationError('availability', 'This item is out of stock', 'هذا المنتج غير متوفر', 'custom'));
    }

    return createValidationResult(errors.length === 0, errors);
  },

  validateOrderData(orderData: OrderData): ValidationResult {
    const errors: ValidationError[] = [];

    const addressResult = this.validateAddress(orderData.shippingAddress);
    if (!addressResult.isValid) {
      errors.push(...addressResult.errors);
    }

    const emailResult = this.validateEmail(orderData.contactInfo.email);
    if (!emailResult.isValid) {
      errors.push(...emailResult.errors);
    }

    const phoneResult = this.validatePhone(
      orderData.contactInfo.phone,
      orderData.shippingAddress.countryCode
    );
    if (!phoneResult.isValid) {
      errors.push(...phoneResult.errors);
    }

    if (!orderData.shippingOption) {
      errors.push(createValidationError('shippingOption', 'Shipping option is required', 'خيار الشحن مطلوب', 'required'));
    }

    if (!orderData.paymentMethod) {
      errors.push(createValidationError('paymentMethod', 'Payment method is required', 'طريقة الدفع مطلوبة', 'required'));
    }

    return createValidationResult(errors.length === 0, errors);
  },
};
