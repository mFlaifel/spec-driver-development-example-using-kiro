import { type InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 0.375rem;
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.emeraldGreen}33;
  }

  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.semantic.error};

      &:focus {
        border-color: ${theme.colors.semantic.error};
        box-shadow: 0 0 0 3px ${theme.colors.semantic.error}33;
      }
    `}
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.semantic.error};
`;

export default function Input({
  label,
  error,
  fullWidth,
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput
        id={inputId}
        $hasError={!!error}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
    </InputWrapper>
  );
}
