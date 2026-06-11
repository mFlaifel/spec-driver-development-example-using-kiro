import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import { ProductCatalog } from './ProductCatalog';
import { useLanguage } from '../contexts/LanguageContext';
import type { FilterOptions } from '../types';

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.darkNavy}, ${({ theme }) => theme.colors.neutral[800]});
  border-radius: 0.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  min-height: 200px;

  @media (max-width: 767px) {
    min-height: 160px;
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.md};
  }
`;

const Tagline = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.white};
  margin: 0;
  max-width: 600px;
  line-height: 1.3;

  @media (max-width: 767px) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: 280px 1fr;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
`;

const emptyOptions: FilterOptions = {
  brands: [],
  screenSizes: [],
  storage: [],
  ram: [],
  processors: [],
  priceRange: { min: 0, max: 10000 },
};

export default function HomePage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Hero>
        <Tagline>{t('app.tagline')}</Tagline>
      </Hero>
      <Layout>
        <Sidebar>
          <SearchBar />
          <FilterPanel availableOptions={emptyOptions} />
        </Sidebar>
        <Main>
          <ProductCatalog products={[]} loading={false} />
        </Main>
      </Layout>
    </>
  );
}
