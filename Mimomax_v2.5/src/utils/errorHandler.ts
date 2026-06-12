import { isApiError } from '../types';

export class AppError extends Error {
  code: string;
  details?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export const errorHandler = {
  handleApiError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (isApiError(error)) {
      return new AppError(
        error.message,
        error.code || 'API_ERROR',
        error.details
      );
    }

    if (error instanceof Error) {
      return new AppError(
        error.message,
        'UNKNOWN_ERROR'
      );
    }

    return new AppError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR'
    );
  },

  handleValidationError(errors: { field: string; message: string; messageAr: string }[]): AppError {
    const details: Record<string, string[]> = {};
    errors.forEach((err) => {
      if (!details[err.field]) {
        details[err.field] = [];
      }
      details[err.field].push(err.message);
    });
    return new AppError(
      'Validation failed',
      'VALIDATION_ERROR',
      details
    );
  },

  getErrorMessage(error: unknown, language: 'en' | 'ar' = 'en'): string {
    const appError = errorHandler.handleApiError(error);

    if (language === 'ar') {
      const arabicMessages: Record<string, string> = {
        'API_ERROR': 'خطأ في الخادم. يرجى المحاولة مرة أخرى.',
        'VALIDATION_ERROR': 'يرجى التحقق من البيانات المدخلة.',
        'NETWORK_ERROR': 'خطأ في الاتصال بالإنترنت.',
        'TIMEOUT_ERROR': 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.',
        'UNKNOWN_ERROR': 'حدث خطأ غير متوقع.',
        'PRODUCT_NOT_FOUND': 'المنتج غير موجود.',
        'CART_EMPTY': 'سلة التسوق فارغة.',
      };
      return arabicMessages[appError.code] || appError.message;
    }

    return appError.message;
  },

  getValidationErrors(error: unknown): Record<string, string[]> {
    if (error instanceof AppError && error.details) {
      return error.details as Record<string, string[]>;
    }
    return {};
  },
};
