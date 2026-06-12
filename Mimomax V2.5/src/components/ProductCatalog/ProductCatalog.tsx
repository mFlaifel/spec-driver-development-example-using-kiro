import styled from 'styled-components';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductCatalogProps {
  products: Product[];
  isLoading?: boolean;
  onProductSelect?: (productId: string) => void;
}

const CatalogContainer = styled.div`
  width: 100%;
`;

const ResultCount = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SkeletonCard = styled.div`
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  height: 320px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const ProductCatalog = ({
  products,
  isLoading = false,
  onProductSelect,
}: ProductCatalogProps) => {
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <CatalogContainer>
        <SkeletonGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </SkeletonGrid>
      </CatalogContainer>
    );
  }

  if (products.length === 0) {
    return (
      <CatalogContainer>
        <EmptyState>
          <EmptyTitle>
            {language === 'ar' ? 'لم يتم العثور على منتجات' : 'No Products Found'}
          </EmptyTitle>
          <EmptyMessage>
            {language === 'ar'
              ? 'جرب تغيير معايير البحث أو الفلاتر'
              : 'Try adjusting your search or filter criteria'}
          </EmptyMessage>
        </EmptyState>
      </CatalogContainer>
    );
  }

  return (
    <CatalogContainer>
      <ResultCount>
        {language === 'ar'
          ? `${products.length} منتج`
          : `${products.length} products`}
      </ResultCount>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductSelect}
          />
        ))}
      </ProductGrid>
    </CatalogContainer>
  );
};
