import styled from 'styled-components';
import Card from './Card';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';
import { CurrencyService } from '../services/CurrencyService';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick?: (productId: string) => void;
}

const availabilityConfig = {
  in_stock: { label: { en: 'In Stock', ar: 'متوفر' }, color: 'semantic.success' },
  out_of_stock: { label: { en: 'Out of Stock', ar: 'غير متوفر' }, color: 'semantic.error' },
  preorder: { label: { en: 'Preorder', ar: 'طلب مسبق' }, color: 'semantic.warning' },
} as const;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProductName = styled.h3<{ $rtl: boolean }>`
  font-family: ${({ theme, $rtl }) =>
    $rtl ? theme.typography.fontFamily.arabic : theme.typography.fontFamily.english};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;
  line-height: 1.4;
`;

const Price = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
  margin: 0;
`;

const SpecsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Spec = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[500]};
  background: ${({ theme }) => theme.colors.neutral[100]};
  padding: 2px 8px;
  border-radius: 4px;
`;

const Badge = styled.span<{ $color: string }>`
  display: inline-block;
  align-self: flex-start;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: 2px 10px;
  border-radius: 999px;
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme, $color }) => {
    const colors: Record<string, string> = {
      'semantic.success': theme.colors.semantic.success,
      'semantic.error': theme.colors.semantic.error,
      'semantic.warning': theme.colors.semantic.warning,
    };
    return colors[$color];
  }};
  background: ${({ theme, $color }) => {
    const backgrounds: Record<string, string> = {
      'semantic.success': `${theme.colors.semantic.success}20`,
      'semantic.error': `${theme.colors.semantic.error}20`,
      'semantic.warning': `${theme.colors.semantic.warning}20`,
    };
    return backgrounds[$color];
  }};
`;

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { language, direction } = useLanguage();
  const { currency } = useLocation();
  const isRtl = direction === 'rtl';

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  const name = language === 'ar' ? product.nameAr : product.name;
  const formattedPrice = CurrencyService.formatPrice(product.price, currency, language);

  const availability = availabilityConfig[product.availability];
  const badgeLabel = language === 'ar' ? availability.label.ar : availability.label.en;

  const { screenSize, storage, ram } = product.specifications;

  const handleClick = () => {
    onClick?.(product.id);
  };

  return (
    <Card clickable onClick={handleClick} role="article" aria-label={name}>
      <ImageWrapper>
        {primaryImage && (
          <ProductImage
            src={primaryImage.url}
            alt={language === 'ar' ? primaryImage.altAr : primaryImage.alt}
            loading="lazy"
            width={primaryImage.width}
            height={primaryImage.height}
          />
        )}
      </ImageWrapper>

      <Content>
        <ProductName $rtl={isRtl}>{name}</ProductName>
        <Price>{formattedPrice}</Price>

        <SpecsList>
          <Spec>{screenSize}</Spec>
          <Spec>{storage}</Spec>
          <Spec>{ram}</Spec>
        </SpecsList>

        <Badge $color={availability.color}>{badgeLabel}</Badge>
      </Content>
    </Card>
  );
}
