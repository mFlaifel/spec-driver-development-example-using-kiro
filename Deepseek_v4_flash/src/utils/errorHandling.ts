import type { ApiError } from '../types';

const DEFAULT_RETRIES = 3;
const DEFAULT_BASE_DELAY = 1000;
const DEFAULT_MAX_DELAY = 10000;

const NETWORK_ERROR_MESSAGE = 'Network error. Please check your connection.';
const NETWORK_ERROR_MESSAGE_AR = 'خطأ في الشبكة. يرجى التحقق من اتصالك.';
const UNKNOWN_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';
const UNKNOWN_ERROR_MESSAGE_AR = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';

function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (error instanceof Error && error.message === 'Failed to fetch') return true;
  if (isApiError(error) && (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR')) return true;
  return false;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'messageAr' in error
  );
}

export function normalizeError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof TypeError) {
    return {
      code: 'NETWORK_ERROR',
      message: NETWORK_ERROR_MESSAGE,
      messageAr: NETWORK_ERROR_MESSAGE_AR,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || UNKNOWN_ERROR_MESSAGE,
      messageAr: UNKNOWN_ERROR_MESSAGE_AR,
    };
  }

  if (typeof error === 'string') {
    return {
      code: 'UNKNOWN_ERROR',
      message: error,
      messageAr: UNKNOWN_ERROR_MESSAGE_AR,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: UNKNOWN_ERROR_MESSAGE,
    messageAr: UNKNOWN_ERROR_MESSAGE_AR,
  };
}

export function logError(error: ApiError): void {
  const timestamp = new Date().toISOString();
  console.error(
    `[${timestamp}] Error: ${error.code}`,
    {
      code: error.code,
      message: error.message,
      messageAr: error.messageAr,
      details: error.details ?? null,
      timestamp,
    },
  );
}

export function getErrorMessage(error: ApiError, language: string): string {
  return language === 'ar' ? error.messageAr : error.message;
}

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, error: unknown) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const maxRetries = options?.maxRetries ?? DEFAULT_RETRIES;
  const baseDelay = options?.baseDelay ?? DEFAULT_BASE_DELAY;
  const maxDelay = options?.maxDelay ?? DEFAULT_MAX_DELAY;
  const onRetry = options?.onRetry;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isNetworkError(error)) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        const jitter = Math.random() * 200;

        if (onRetry) {
          onRetry(attempt + 1, error);
        }

        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
  }

  throw lastError;
}
