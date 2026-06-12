import styled, { css } from 'styled-components';
import { InputHTMLAttributes, forwardRef } from 'react';

type InputVariant = 'text' | 'email' | 'tel' | 'number' | 'password';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: InputVariant;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, hasError }) =>
    hasError ? theme.colors.error : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.darkNavy};
  background-color: ${({ theme }) => theme.colors.white};
  transition: border-color ${({ theme }) => theme.transitions.fast},
              box-shadow ${({ theme }) => theme.transitions.fast};
  min-height: 44px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray300};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.emeraldGreen};
    box-shadow: 0 0 0 3px ${({ hasError }) =>
      hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    cursor: not-allowed;
  }

  ${({ hasError }) => hasError && css`
    background-color: rgba(239, 68, 68, 0.02);
  `}
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = 'text', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <InputWrapper>
        {label && (
          <Label htmlFor={inputId}>{label}</Label>
        )}
        <StyledInput
          ref={ref}
          id={inputId}
          type={variant}
          hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <ErrorMessage id={`${inputId}-error`} role="alert">
            {error}
          </ErrorMessage>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';
