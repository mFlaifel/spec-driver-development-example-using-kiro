import styled, { keyframes } from 'styled-components';
import theme from '../utils/theme';

interface LoadingProps {
  variant?: 'inline' | 'overlay';
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const sizeMap: Record<string, string> = {
  small: '20px',
  medium: '32px',
  large: '48px',
};

const borderSizeMap: Record<string, string> = {
  small: '2px',
  medium: '3px',
  large: '4px',
};

const Spinner = styled.div<{ $size: string; $borderSize: string }>`
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border: ${({ $borderSize }) => $borderSize} solid ${theme.colors.neutral[200]};
  border-top-color: ${theme.colors.emeraldGreen};
  border-radius: 50%;
  animation: ${rotate} 0.6s linear infinite;
  will-change: transform;
`;

const InlineWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const OverlayWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(15, 23, 42, 0.6);
  z-index: 9999;
`;

export function Loading({ variant = 'inline', size = 'medium', label }: LoadingProps) {
  const spinnerSize = sizeMap[size];
  const borderSize = borderSizeMap[size];
  const ariaLabel = label ?? 'Loading';

  const spinner = <Spinner $size={spinnerSize} $borderSize={borderSize} aria-label={ariaLabel} role="status" />;

  if (variant === 'overlay') {
    return <OverlayWrapper>{spinner}</OverlayWrapper>;
  }

  return <InlineWrapper>{spinner}</InlineWrapper>;
}
