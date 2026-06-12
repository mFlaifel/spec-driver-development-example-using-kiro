import styled from 'styled-components';
import { ReactNode } from 'react';
import { ThemeProvider } from '../../styles/ThemeProvider';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { CartProvider } from '../../contexts/CartContext';
import { LocationProvider } from '../../contexts/LocationContext';
import { FilterProvider } from '../../contexts/FilterContext';
import { NavigationMenu } from '../NavigationMenu';
import { Footer } from '../Footer';
import { ErrorBoundary } from '../ErrorBoundary';

interface MainLayoutProps {
  children: ReactNode;
}

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 64px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 64px);
`;

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LocationProvider>
          <CartProvider>
            <FilterProvider>
              <ErrorBoundary>
                <LayoutWrapper>
                  <NavigationMenu />
                  <MainContent id="main-content">
                    <PageContainer>{children}</PageContainer>
                  </MainContent>
                  <Footer />
                </LayoutWrapper>
              </ErrorBoundary>
            </FilterProvider>
          </CartProvider>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
