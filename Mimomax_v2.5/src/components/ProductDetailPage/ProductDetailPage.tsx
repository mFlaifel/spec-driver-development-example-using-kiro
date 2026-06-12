import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { ProductService } from '../../services/productService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { useCart } from '../../contexts/CartContext';
import { ImageCarousel } from '../ImageCarousel';
import { Button } from '../Button';
import { Loading } from '../Loading';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Breadcrumb = styled.nav`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
`;

const BreadcrumbLink = styled.button`
  color: ${({ theme }) => theme.colors.emeraldGreen};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProductName = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const ProductPrice = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
`;

const AvailabilityBadge = styled.span<{ availability: string }>`
  display: inline-block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
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
  width: fit-content;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.6;
`;

const SpecificationsTable = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SpecsTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const SpecLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SpecValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const QuantityLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    color: ${({ theme }) => theme.colors.emeraldGreen};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  width: 48px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const CartButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const ShippingInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ShippingTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ShippingText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { formatPrice } = useLocation();
  const { addItem, items } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await ProductService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Product not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
    
    addItem({
      productId: product.id,
      productName: product.name,
      productNameAr: product.nameAr,
      productImage: primaryImage?.url || '',
      price: product.price,
      currency: product.currency,
      availability: product.availability === 'in_stock' ? 'in_stock' : 'out_of_stock',
    }, quantity);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Loading size="large" />
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <ErrorMessage>
          <ErrorTitle>
            {language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </ErrorTitle>
          <ErrorText>
            {language === 'ar'
              ? 'المنتج الذي تبحث عنه غير موجود.'
              : 'The product you are looking for does not exist.'}
          </ErrorText>
          <Button onClick={() => navigate('/')}>
            {language === 'ar' ? 'الذهاب إلى الرئيسية' : 'Go Home'}
          </Button>
        </ErrorMessage>
      </PageContainer>
    );
  }

  const productName = language === 'ar' ? product.nameAr : product.name;
  const description = language === 'ar' ? product.descriptionAr : product.description;

  const getAvailabilityText = () => {
    switch (product.availability) {
      case 'in_stock':
        return language === 'ar' ? 'متوفر' : 'In Stock';
      case 'out_of_stock':
        return language === 'ar' ? 'غير متوفر' : 'Out of Stock';
      case 'preorder':
        return language === 'ar' ? 'طلب مسبق' : 'Pre-order';
      default:
        return product.availability;
    }
  };

  const specLabels: Record<string, { en: string; ar: string }> = {
    screenSize: { en: 'Screen Size', ar: 'حجم الشاشة' },
    resolution: { en: 'Resolution', ar: 'الدقة' },
    processor: { en: 'Processor', ar: 'المعالج' },
    ram: { en: 'RAM', ar: 'الذاكرة العشوائية' },
    storage: { en: 'Storage', ar: 'التخزين' },
    battery: { en: 'Battery', ar: 'البطارية' },
    camera: { en: 'Camera', ar: 'الكاميرا' },
    weight: { en: 'Weight', ar: 'الوزن' },
    dimensions: { en: 'Dimensions', ar: 'الأبعاد' },
    os: { en: 'OS', ar: 'نظام التشغيل' },
  };

  const stockInCart = items
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PageContainer>
      <Breadcrumb>
        <BreadcrumbLink onClick={() => navigate('/')}>
          {language === 'ar' ? 'الرئيسية' : 'Home'}
        </BreadcrumbLink>
        {' > '}
        <BreadcrumbLink onClick={() => navigate('/products')}>
          {language === 'ar' ? 'المنتجات' : 'Products'}
        </BreadcrumbLink>
        {' > '}
        <span>{productName}</span>
      </Breadcrumb>

      <ProductLayout>
        <ImageCarousel images={product.images} />
        
        <ProductInfo>
          <ProductName>{productName}</ProductName>
          <ProductPrice>{formatPrice(product.price)}</ProductPrice>
          <AvailabilityBadge availability={product.availability}>
            {getAvailabilityText()}
          </AvailabilityBadge>
          <Description>{description}</Description>
          
          <SpecificationsTable>
            <SpecsTitle>
              {language === 'ar' ? 'المواصفات' : 'Specifications'}
            </SpecsTitle>
            <SpecsGrid>
              {Object.entries(product.specifications).map(([key, value]) => (
                <SpecItem key={key}>
                  <SpecLabel>
                    {specLabels[key]?.[language as 'en' | 'ar'] || key}
                  </SpecLabel>
                  <SpecValue>{value}</SpecValue>
                </SpecItem>
              ))}
            </SpecsGrid>
          </SpecificationsTable>

          <QuantitySelector>
            <QuantityLabel>
              {language === 'ar' ? 'الكمية:' : 'Quantity:'}
            </QuantityLabel>
            <QuantityButton
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </QuantityButton>
            <QuantityValue>{quantity}</QuantityValue>
            <QuantityButton
              onClick={() => setQuantity(Math.min(product.stockQuantity - stockInCart, quantity + 1))}
              disabled={quantity >= product.stockQuantity - stockInCart}
              aria-label="Increase quantity"
            >
              +
            </QuantityButton>
          </QuantitySelector>

          <CartButton
            onClick={handleAddToCart}
            disabled={product.availability !== 'in_stock' || quantity > product.stockQuantity - stockInCart}
          >
            {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
          </CartButton>

          <ShippingInfo>
            <ShippingTitle>
              {language === 'ar' ? 'معلومات الشحن' : 'Shipping Information'}
            </ShippingTitle>
            <ShippingText>
              {language === 'ar'
                ? 'شحن مجاني للطلبات فوق 500 ريال سعودي'
                : 'Free shipping on orders over 500 SAR'}
            </ShippingText>
          </ShippingInfo>
        </ProductInfo>
      </ProductLayout>
    </PageContainer>
  );
};
