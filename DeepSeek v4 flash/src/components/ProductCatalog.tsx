import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Product } from '../types';
import { ProductService } from '../services/ProductService';
import { useFilters } from '../contexts/FilterContext';
import { useLanguage } from '../contexts/LanguageContext';
import { isMobile, isTablet, isDesktop } from '../utils/media';
import ProductCard from './ProductCard';
import { Loading } from './Loading';

interface ProductCatalogProps {
  products: Product[];
  loading?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Count = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${isTablet`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${isDesktop`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const Empty = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[400]};
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  margin: 0;
`;

export function ProductCatalog({ products, loading = false }: ProductCatalogProps) {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const { language } = useLanguage();

  const filtered = useMemo(() => {
    const searched = ProductService.searchProducts(products, filters.searchTerm);
    return ProductService.filterProducts(searched, filters);
  }, [products, filters]);

  if (loading) {
    return <Loading />;
  }

  const emptyMessage = language === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found';
  const countLabel = language === 'ar'
    ? `تم العثور على ${filtered.length} منتج`
    : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;

  return (
    <Wrapper>
      <Count>{countLabel}</Count>
      {filtered.length > 0 ? (
        <Grid>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
            />
          ))}
        </Grid>
      ) : (
        <Empty>{emptyMessage}</Empty>
      )}
    </Wrapper>
  );
}
