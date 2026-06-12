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
  isValid: boolean;
  errors: ValidationError[];
}

export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as ApiError).code === 'string' &&
    typeof (error as ApiError).message === 'string'
  );
};
