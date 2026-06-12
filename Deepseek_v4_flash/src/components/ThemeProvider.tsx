import { ThemeProvider } from 'styled-components';
import type { ReactNode } from 'react';
import theme from '../utils/theme';

interface ThemeContextProviderProps {
  children: ReactNode;
}

export { ThemeProvider };

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
