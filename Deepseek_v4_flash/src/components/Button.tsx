import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Theme } from '../utils/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.emeraldGreen};
    color: ${({ theme }) => theme.colors.white};
    border: 2px solid ${({ theme }) => theme.colors.emeraldGreen};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.darkNavy};
    color: ${({ theme }) => theme.colors.white};
    border: 2px solid ${({ theme }) => theme.colors.darkNavy};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.neutral[800]};
      border-color: ${({ theme }) => theme.colors.neutral[800]};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.emeraldGreen};
    border: 2px solid ${({ theme }) => theme.colors.emeraldGreen};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.emeraldGreen};
      color: ${({ theme }) => theme.colors.white};
    }
  `,
  text: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.emeraldGreen};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.neutral[100]};
    }
  `,
};

const sizeStyles = {
  small: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  medium: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
  large: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `,
};

const StyledButton = styled.button<{
  $variant: NonNullable<ButtonProps['variant']>;
  $size: NonNullable<ButtonProps['size']>;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: 0.375rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.english};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  line-height: 1.5;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;

  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}

  ${({ $variant }) => variantStyles[$variant]}

  ${({ $size }) => sizeStyles[$size]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', loading = false, fullWidth = false, disabled, children, ...rest }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        {...rest}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        role="button"
      >
        {loading && <Spinner />}
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export { StyledButton, Button };
export default Button;
