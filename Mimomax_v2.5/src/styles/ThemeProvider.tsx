import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyles } from './GlobalStyles';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
  direction?: 'ltr' | 'rtl';
}

export const ThemeProvider = ({ children, direction = 'ltr' }: ThemeProviderProps) => {
  const themeWithDirection = { ...theme, direction };
  return (
    <StyledThemeProvider theme={themeWithDirection}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
};
