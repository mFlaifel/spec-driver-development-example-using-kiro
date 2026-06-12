import styled, { css } from 'styled-components';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  isClickable?: boolean;
  onClick?: () => void;
}

const StyledCard = styled.div<{ isClickable?: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.base};
  overflow: hidden;
  transition: transform ${({ theme }) => theme.transitions.base},
              box-shadow ${({ theme }) => theme.transitions.base};

  ${({ isClickable }) => isClickable && css`
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }

    &:active {
      transform: translateY(-2px);
    }
  `}

  ${({ isClickable }) => !isClickable && css`
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  `}
`;

export const Card = ({ children, isClickable = false, onClick }: CardProps) => {
  return (
    <StyledCard
      isClickable={isClickable}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {children}
    </StyledCard>
  );
};
