import styled, { keyframes } from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';

type LoadingSize = 'small' | 'medium' | 'large';

interface LoadingProps {
  size?: LoadingSize;
  variant?: 'spinner' | 'overlay' | 'inline' | 'skeleton';
  text?: string;
  fullScreen?: boolean;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Spinner = styled.div<{ $size: LoadingSize }>`
  border: 3px solid ${({ theme }) => theme.colors.gray200};
  border-top-color: ${({ theme }) => theme.colors.emeraldGreen};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;

  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return `width: 16px; height: 16px; border-width: 2px;`;
      case 'medium':
        return `width: 24px; height: 24px;`;
      case 'large':
        return `width: 40px; height: 40px; border-width: 4px;`;
    }
  }}
`;

const Overlay = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ $fullScreen }) =>
    $fullScreen ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  ${({ $fullScreen }) =>
    $fullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  `}
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonBase = styled.div<{ $width?: string; $height?: string }>`
  background: linear-gradient(90deg,
    ${({ theme }) => theme.colors.gray200} 25%,
    ${({ theme }) => theme.colors.gray100} 50%,
    ${({ theme }) => theme.colors.gray200} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
`;

export const Loading = ({
  size = 'medium',
  variant = 'spinner',
  text,
  fullScreen,
}: LoadingProps) => {
  useLanguage();

  if (variant === 'overlay') {
    return (
      <Overlay $fullScreen={fullScreen}>
        <Spinner $size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </Overlay>
    );
  }

  return (
    <Overlay>
      <Spinner $size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </Overlay>
  );
};

export const Skeleton = ({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) => {
  return <SkeletonBase $width={width} $height={height} />;
};

export const SkeletonCard = () => {
  return (
    <div style={{ padding: '16px' }}>
      <Skeleton width="100%" height="200px" />
      <div style={{ marginTop: '12px' }}>
        <Skeleton width="80%" height="16px" />
      </div>
      <div style={{ marginTop: '8px' }}>
        <Skeleton width="60%" height="14px" />
      </div>
      <div style={{ marginTop: '8px' }}>
        <Skeleton width="40%" height="18px" />
      </div>
    </div>
  );
};

export const SkeletonProductGrid = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
