import styled from 'styled-components';
import type { ReactNode } from 'react';
import { ThemeContextProvider } from './ThemeProvider';
import GlobalStyles from './GlobalStyles';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartProvider } from '../contexts/CartContext';
import { LocationProvider } from '../contexts/LocationContext';
import { FilterProvider } from '../contexts/FilterContext';
import NavigationMenu from './NavigationMenu';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

interface MainLayoutProps {
  children: ReactNode;
}

const Main = styled.main`
  min-height: 100vh;
  padding-top: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
`;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeContextProvider>
      <GlobalStyles />
      <LanguageProvider>
        <CartProvider>
          <LocationProvider>
            <FilterProvider>
              <ErrorBoundary>
                <NavigationMenu />
                <Main>{children}</Main>
                <Footer />
              </ErrorBoundary>
            </FilterProvider>
          </LocationProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeContextProvider>
  );
}
