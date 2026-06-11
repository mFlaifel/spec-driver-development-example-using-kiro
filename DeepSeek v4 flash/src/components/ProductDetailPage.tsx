import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Product, CartItem } from '../types';
import { ProductService } from '../services/ProductService';
import { CurrencyService } from '../services/CurrencyService';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';
import { useCart } from '../contexts/CartContext';
import ImageCarousel from './ImageCarousel';
import { Loading } from './Loading';
import { Button } from './Button';

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};

  a {
    color: ${({ theme }) => theme.colors.neutral[500]};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.emeraldGreen};
    }
  }

  span {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.neutral[400]};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
  align-self: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: static;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProductName = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin: 0;
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
`;

const Badge = styled.span<{ $variant: 'in_stock' | 'out_of_stock' | 'preorder' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'in_stock':
        return `
          background-color: ${theme.colors.semantic.success}20;
          color: ${theme.colors.semantic.success};
        `;
      case 'out_of_stock':
        return `
          background-color: ${theme.colors.semantic.error}20;
          color: ${theme.colors.semantic.error};
        `;
      case 'preorder':
        return `
          background-color: ${theme.colors.semantic.warning}20;
          color: ${theme.colors.semantic.warning};
        `;
    }
  }}
`;

const Dot = styled.span<{ $variant: 'in_stock' | 'out_of_stock' | 'preorder' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'in_stock':
        return `background-color: ${theme.colors.semantic.success};`;
      case 'out_of_stock':
        return `background-color: ${theme.colors.semantic.error};`;
      case 'preorder':
        return `background-color: ${theme.colors.semantic.warning};`;
    }
  }}
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[600]};
  line-height: 1.7;
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin: 0;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const SpecTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  }

  tr:last-child {
    border-bottom: none;
  }
`;

const SpecLabel = styled.td`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} 0`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[500]};
  white-space: nowrap;
  width: 140px;
`;

const SpecValue = styled.td`
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 2px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QuantityLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.375rem;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 48px;
  height: 36px;
  border: none;
  border-left: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  border-right: 2px solid ${({ theme }) => theme.colors.neutral[200]};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  outline: none;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
`;

const ShippingInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.5rem;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  line-height: 1.6;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.neutral[500]};

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    color: ${({ theme }) => theme.colors.darkNavy};
    margin: 0 0 ${({ theme }) => theme.spacing.md};
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.lg};
  }
`;

type AvailabilityLabelKey = 'labels.inStock' | 'labels.outOfStock' | 'labels.preorder';

const availabilityLabelMap: Record<string, AvailabilityLabelKey> = {
  in_stock: 'labels.inStock',
  out_of_stock: 'labels.outOfStock',
  preorder: 'labels.preorder',
};

const specDisplayLabels: Record<string, string> = {
  screenSize: 'Screen Size',
  resolution: 'Resolution',
  processor: 'Processor',
  ram: 'RAM',
  storage: 'Storage',
  battery: 'Battery',
  camera: 'Camera',
  weight: 'Weight',
  dimensions: 'Dimensions',
  os: 'Operating System',
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'products', 'navigation', 'cart', 'errors']);
  const { language } = useLanguage();
  const { country, shippingOptions } = useLocation();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setError(t('errors.productNotFound'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    ProductService.getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError(t('errors.productNotFound'));
        setLoading(false);
      });
  }, [id, t]);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  const isOutOfStock = product?.availability === 'out_of_stock';

  const handleQuantityChange = (value: number) => {
    if (!product) return;
    const clamped = Math.max(1, Math.min(value, product.stockQuantity));
    setQuantity(clamped);
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    const cartItem: CartItem = {
      id: product.id,
      productId: product.id,
      productName: product.name,
      productNameAr: product.nameAr,
      productImage: product.images.find((img) => img.isPrimary)?.url ?? product.images[0]?.url ?? '',
      price: product.price,
      currency: product.currency,
      quantity,
      availability: product.availability === 'preorder' ? 'in_stock' : product.availability,
    };

    addItem(cartItem);
  };

  if (loading) {
    return (
      <PageWrapper>
        <Loading size="large" />
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <ErrorMessage>
          <h2>{t('errors.somethingWentWrong')}</h2>
          <p>{error || t('errors.productNotFound')}</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            {t('buttons.goHome')}
          </Button>
        </ErrorMessage>
      </PageWrapper>
    );
  }

  const formattedPrice = CurrencyService.formatPrice(product.price, product.currency, language);
  const availabilityKey = availabilityLabelMap[product.availability];

  const specsEntries = Object.entries(product.specifications) as [string, string][];

  return (
    <PageWrapper>
      <Breadcrumb aria-label="Breadcrumb">
        <Link to="/">{t('nav.home')}</Link>
        <Separator aria-hidden="true">/</Separator>
        <Link to="/products">{t('nav.products')}</Link>
        <Separator aria-hidden="true">/</Separator>
        <span>{language === 'en' ? product.name : product.nameAr}</span>
      </Breadcrumb>

      <Layout>
        <ImageSection>
          <ImageCarousel images={product.images} language={language} />
        </ImageSection>

        <InfoSection>
          <ProductName>
            {language === 'en' ? product.name : product.nameAr}
          </ProductName>

          <PriceRow>
            <Price>{formattedPrice}</Price>
            <Badge $variant={product.availability}>
              <Dot $variant={product.availability} />
              {t(availabilityKey)}
            </Badge>
          </PriceRow>

          <div>
            <SectionTitle>{t('product.description')}</SectionTitle>
            <Description>
              {language === 'en' ? product.description : product.descriptionAr}
            </Description>
          </div>

          <div>
            <SectionTitle>{t('product.specifications')}</SectionTitle>
            <SpecTable>
              <tbody>
                {specsEntries.map(([key, value]) => (
                  <tr key={key}>
                    <SpecLabel>{specDisplayLabels[key] || key}</SpecLabel>
                    <SpecValue>{value}</SpecValue>
                  </tr>
                ))}
              </tbody>
            </SpecTable>
          </div>

          <ShippingInfo>
            <strong>{t('product.shippingInfo')}</strong>
            <br />
            {t('labels.shipping')}: {country.name}
            {shippingOptions.length > 0 && (
              <>
                <br />
                {t('cart.shipping')}: {CurrencyService.formatPrice(shippingOptions[0].cost, country.currency, language)}
                {' — '}
                {shippingOptions[0].estimatedDays} {t('labels.days', { defaultValue: 'days' })}
              </>
            )}
          </ShippingInfo>

          <ActionsSection>
            <QuantityRow>
              <QuantityLabel>{t('product.quantity')}</QuantityLabel>
              <QuantityControls>
                <QuantityButton
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </QuantityButton>
                <QuantityInput
                  type="number"
                  value={quantity}
                  min={1}
                  max={product.stockQuantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                  aria-label={t('product.quantity')}
                />
                <QuantityButton
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stockQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </QuantityButton>
              </QuantityControls>
            </QuantityRow>

            <Button
              variant="primary"
              size="large"
              fullWidth
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? t('product.outOfStock') : t('product.addToCart')}
            </Button>
          </ActionsSection>
        </InfoSection>
      </Layout>
    </PageWrapper>
  );
}
