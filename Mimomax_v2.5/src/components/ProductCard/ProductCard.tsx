import styled from 'styled-components';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { Card } from '../Card';

interface ProductCardProps {
  product: Product;
  onClick?: (productId: string) => void;
}

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
`;

const ProductContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const ProductName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.3;
`;

const ProductPrice = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProductSpecs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SpecTag = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray600};
  background-color: ${({ theme }) => theme.colors.gray100};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const AvailabilityBadge = styled.span<{ availability: string }>`
  display: inline-block;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ availability, theme }) => {
    switch (availability) {
      case 'in_stock':
        return theme.colors.emeraldGreen + '20';
      case 'out_of_stock':
        return theme.colors.error + '20';
      case 'preorder':
        return theme.colors.warning + '20';
      default:
        return theme.colors.gray100;
    }
  }};
  color: ${({ availability, theme }) => {
    switch (availability) {
      case 'in_stock':
        return theme.colors.emeraldGreen;
      case 'out_of_stock':
        return theme.colors.error;
      case 'preorder':
        return theme.colors.warning;
      default:
        return theme.colors.gray600;
    }
  }};
`;

const getAvailabilityText = (availability: string, language: string): string => {
  const texts: Record<string, { en: string; ar: string }> = {
    in_stock: { en: 'In Stock', ar: 'متوفر' },
    out_of_stock: { en: 'Out of Stock', ar: 'غير متوفر' },
    preorder: { en: 'Pre-order', ar: 'طلب مسبق' },
  };
  return texts[availability]?.[language as 'en' | 'ar'] || availability;
};

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { language } = useLanguage();
  const { formatPrice } = useLocation();

  const productName = language === 'ar' ? product.nameAr : product.name;
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const imageAlt = language === 'ar' ? primaryImage?.altAr : primaryImage?.alt;

  return (
    <Card isClickable onClick={() => onClick?.(product.id)}>
      <ProductImage
        src={primaryImage?.url}
        alt={imageAlt || productName}
        loading="lazy"
        width={primaryImage?.width}
        height={primaryImage?.height}
      />
      <ProductContent>
        <ProductName>{productName}</ProductName>
        <ProductPrice>{formatPrice(product.price)}</ProductPrice>
        <ProductSpecs>
          <SpecTag>{product.specifications.screenSize}</SpecTag>
          <SpecTag>{product.specifications.storage}</SpecTag>
          <SpecTag>{product.specifications.ram}</SpecTag>
        </ProductSpecs>
        <AvailabilityBadge availability={product.availability}>
          {getAvailabilityText(product.availability, language)}
        </AvailabilityBadge>
      </ProductContent>
    </Card>
  );
};
