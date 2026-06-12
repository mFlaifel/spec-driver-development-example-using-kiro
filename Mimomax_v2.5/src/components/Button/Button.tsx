import styled, { css } from 'styled-components';
import { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.emeraldGreen};
        color: ${({ theme }) => theme.colors.white};
        border: none;

        &:hover:not(:disabled) {
          background-color: #059669;
          transform: translateY(-1px);
          box-shadow: ${({ theme }) => theme.shadows.md};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.darkNavy};
        color: ${({ theme }) => theme.colors.white};
        border: none;

        &:hover:not(:disabled) {
          background-color: #1e293b;
          transform: translateY(-1px);
          box-shadow: ${({ theme }) => theme.shadows.md};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.darkNavy};
        border: 1px solid ${({ theme }) => theme.colors.gray300};

        &:hover:not(:disabled) {
          border-color: ${({ theme }) => theme.colors.emeraldGreen};
          color: ${({ theme }) => theme.colors.emeraldGreen};
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.darkNavy};
        border: none;
        padding-left: ${({ theme }) => theme.spacing.sm};
        padding-right: ${({ theme }) => theme.spacing.sm};

        &:hover:not(:disabled) {
          color: ${({ theme }) => theme.colors.emeraldGreen};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        min-height: 32px;
      `;
    case 'medium':
      return css`
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.typography.fontSize.base};
        min-height: 44px;
      `;
    case 'large':
      return css`
        padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
        font-size: ${({ theme }) => theme.typography.fontSize.lg};
        min-height: 52px;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  user-select: none;

  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'medium' }) => getSizeStyles(size)}

  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }

  ${({ isLoading }) => isLoading && css`
    pointer-events: none;
    position: relative;
  `}
`;

const LoadingSpinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};
