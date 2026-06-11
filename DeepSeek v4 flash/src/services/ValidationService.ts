import {
  Address,
  CartItem,
  CountryCode,
  OrderData,
  ValidationError,
  ValidationResult,
} from '../types';

export class ValidationService {
  static validateEmail(email: string): ValidationResult {
    const errors: ValidationError[] = [];

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!email || !email.includes('@')) {
      errors.push({
        field: 'email',
        message: 'Email is required and must contain @ symbol',
        messageAr: 'البريد الإلكتروني مطلوب ويجب أن يحتوي على رمز @',
        type: 'required',
      });
    } else if (!emailRegex.test(email)) {
      errors.push({
        field: 'email',
        message: 'Please enter a valid email address',
        messageAr: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
        type: 'format',
      });
    }

    return { valid: errors.length === 0, errors };
  }

  static validatePhone(phone: string, countryCode: CountryCode): ValidationResult {
    const errors: ValidationError[] = [];

    const cleaned = phone.replace(/[\s-]/g, '').replace(/^\+/, '');
    const digitsOnly = cleaned.replace(/\D/g, '');

    if (digitsOnly.length < 8) {
      errors.push({
        field: 'phone',
        message: 'Phone number must be at least 8 digits',
        messageAr: 'رقم الهاتف يجب أن يتكون من 8 أرقام على الأقل',
        type: 'range',
      });
    }

    if (digitsOnly.length > 15) {
      errors.push({
        field: 'phone',
        message: 'Phone number must not exceed 15 digits',
        messageAr: 'رقم الهاتف يجب ألا يتجاوز 15 رقماً',
        type: 'range',
      });
    }

    if (cleaned !== digitsOnly) {
      errors.push({
        field: 'phone',
        message: 'Phone number must contain only digits',
        messageAr: 'رقم الهاتف يجب أن يحتوي على أرقام فقط',
        type: 'format',
      });
    }

    if (errors.length === 0) {
      if (countryCode === 'SA') {
        if (digitsOnly.length !== 10 || !digitsOnly.startsWith('05')) {
          errors.push({
            field: 'phone',
            message: 'Saudi Arabia phone numbers must start with 05 and be 10 digits',
            messageAr: 'أرقام الهاتف في السعودية يجب أن تبدأ بـ 05 وتتكون من 10 أرقام',
            type: 'format',
          });
        }
      } else if (countryCode === 'AE') {
        if (!digitsOnly.startsWith('05')) {
          errors.push({
            field: 'phone',
            message: 'UAE phone numbers must start with 05',
            messageAr: 'أرقام الهاتف في الإمارات يجب أن تبدأ بـ 05',
            type: 'format',
          });
        } else if (digitsOnly.length < 9 || digitsOnly.length > 10) {
          errors.push({
            field: 'phone',
            message: 'UAE phone numbers must be 9 or 10 digits',
            messageAr: 'أرقام الهاتف في الإمارات يجب أن تتكون من 9 أو 10 أرقام',
            type: 'range',
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  static validateAddress(address: Address): ValidationResult {
    const errors: ValidationError[] = [];

    if (!address.firstName || !address.firstName.trim()) {
      errors.push({
        field: 'firstName',
        message: 'First name is required',
        messageAr: 'الاسم الأول مطلوب',
        type: 'required',
      });
    }

    if (!address.lastName || !address.lastName.trim()) {
      errors.push({
        field: 'lastName',
        message: 'Last name is required',
        messageAr: 'اسم العائلة مطلوب',
        type: 'required',
      });
    }

    if (!address.addressLine1 || !address.addressLine1.trim()) {
      errors.push({
        field: 'addressLine1',
        message: 'Address line 1 is required',
        messageAr: 'عنوان السطر الأول مطلوب',
        type: 'required',
      });
    }

    if (!address.city || !address.city.trim()) {
      errors.push({
        field: 'city',
        message: 'City is required',
        messageAr: 'المدينة مطلوبة',
        type: 'required',
      });
    }

    if (!address.postalCode || !address.postalCode.trim()) {
      errors.push({
        field: 'postalCode',
        message: 'Postal code is required',
        messageAr: 'الرمز البريدي مطلوب',
        type: 'required',
      });
    }

    return { valid: errors.length === 0, errors };
  }

  static validateCartItem(item: CartItem): ValidationResult {
    const errors: ValidationError[] = [];

    if (item.quantity < 1) {
      errors.push({
        field: 'quantity',
        message: 'Quantity must be at least 1',
        messageAr: 'الكمية يجب أن تكون 1 على الأقل',
        type: 'range',
      });
    }

    if (item.price <= 0) {
      errors.push({
        field: 'price',
        message: 'Price must be greater than 0',
        messageAr: 'السعر يجب أن يكون أكبر من 0',
        type: 'range',
      });
    }

    return { valid: errors.length === 0, errors };
  }

  static validateOrderData(orderData: OrderData): ValidationResult {
    const errors: ValidationError[] = [];

    const addressResult = ValidationService.validateAddress(orderData.shippingAddress);
    errors.push(...addressResult.errors);

    const emailResult = ValidationService.validateEmail(orderData.contactInfo.email);
    errors.push(...emailResult.errors);

    const phoneResult = ValidationService.validatePhone(
      orderData.contactInfo.phone,
      orderData.shippingAddress.countryCode
    );
    errors.push(...phoneResult.errors);

    if (!orderData.shippingOption || !orderData.shippingOption.trim()) {
      errors.push({
        field: 'shippingOption',
        message: 'Shipping option is required',
        messageAr: 'خيار الشحن مطلوب',
        type: 'required',
      });
    }

    if (!orderData.paymentMethod) {
      errors.push({
        field: 'paymentMethod',
        message: 'Payment method is required',
        messageAr: 'طريقة الدفع مطلوبة',
        type: 'required',
      });
    }

    if (orderData.cartSummary.items.length === 0) {
      errors.push({
        field: 'items',
        message: 'Cart must contain at least one item',
        messageAr: 'يجب أن تحتوي السلة على عنصر واحد على الأقل',
        type: 'required',
      });
    }

    for (const item of orderData.cartSummary.items) {
      const itemResult = ValidationService.validateCartItem(item);
      errors.push(...itemResult.errors);
    }

    return { valid: errors.length === 0, errors };
  }
}
