import styled, { css } from 'styled-components';
import type { Theme } from '../utils/theme';

interface CardProps {
  clickable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const paddingMap: Record<string, keyof Theme['spacing']> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const StyledCard = styled.div<CardProps>`
  background: ${({ theme }) => (theme as Theme).colors.white};
  border-radius: 12px;
  box-shadow: ${({ theme }) => (theme as Theme).shadows.md};
  padding: ${({ theme, padding = 'md' }) => (theme as Theme).spacing[paddingMap[padding]]};
  transition: transform ${({ theme }) => (theme as Theme).transitions.base},
    box-shadow ${({ theme }) => (theme as Theme).transitions.base};

  ${({ clickable, theme }) =>
    clickable
      ? css`
          cursor: pointer;

          &:hover {
            transform: translateY(-2px);
            box-shadow: ${(theme as Theme).shadows.lg};
          }
        `
      : ''}
`;

export type { CardProps };
export default StyledCard;
