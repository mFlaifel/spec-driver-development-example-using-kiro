import { useState, useCallback } from 'react';
import { errorHandler, AppError } from '../utils/errorHandler';
import { useLanguage } from '../contexts/LanguageContext';

interface UseErrorReturn {
  error: AppError | null;
  message: string;
  validationErrors: Record<string, string[]>;
  handleError: (error: unknown) => void;
  clearError: () => void;
}

export const useError = (): UseErrorReturn => {
  const [error, setError] = useState<AppError | null>(null);
  const { language } = useLanguage();

  const handleError = useCallback(
    (err: unknown) => {
      const appError = errorHandler.handleApiError(err);
      setError(appError);
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    message: error ? errorHandler.getErrorMessage(error, language) : '',
    validationErrors: error ? errorHandler.getValidationErrors(error) : {},
    handleError,
    clearError,
  };
};
