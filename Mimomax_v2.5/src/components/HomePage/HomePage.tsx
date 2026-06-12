import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { ProductService } from '../../services/productService';
import { useFilters } from '../../contexts/FilterContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProductCatalog } from '../ProductCatalog';
import { SearchBar } from '../SearchBar';
import { FilterPanel } from '../FilterPanel';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.darkNavy} 0%, #1e293b 100%);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.gray300};
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 280px 1fr;
  }
`;

const Sidebar = styled.aside`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: block;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filters, setAvailableOptions } = useFilters();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await ProductService.getProducts();
        setProducts(data.products);
        const options = await ProductService.getFilterOptions();
        setAvailableOptions(options);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [setAvailableOptions]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        if (
          !product.name.toLowerCase().includes(term) &&
          !product.nameAr.includes(filters.searchTerm) &&
          !product.description.toLowerCase().includes(term) &&
          !product.descriptionAr.includes(filters.searchTerm)
        ) {
          return false;
        }
      }
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      if (
        product.price < filters.priceRange.min ||
        product.price > filters.priceRange.max
      ) {
        return false;
      }
      return true;
    });
  }, [products, filters]);

  const handleProductSelect = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>
          {language === 'ar' ? 'مرحباً بكم في ميموماكس' : 'Welcome to Mimomax'}
        </HeroTitle>
        <HeroSubtitle>
          {language === 'ar'
            ? 'اكتشف أحدث الأجهزة اللوحية الفاخرة في منطقة الشرق الأوسط'
            : 'Discover the latest premium tablets in the MENA region'}
        </HeroSubtitle>
      </HeroSection>

      <SearchContainer>
        <SearchBar />
      </SearchContainer>

      <ContentLayout>
        <Sidebar>
          <FilterPanel />
        </Sidebar>
        <MainContent>
          <ProductCatalog
            products={filteredProducts}
            isLoading={isLoading}
            onProductSelect={handleProductSelect}
          />
        </MainContent>
      </ContentLayout>
    </PageContainer>
  );
};
