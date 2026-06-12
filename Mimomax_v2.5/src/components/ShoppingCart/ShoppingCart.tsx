import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { CartItem } from '../CartItem';
import { Button } from '../Button';

const CartContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const CartTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CartItems = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.gray300};
`;

const EmptyTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CartSummary = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const TotalRow = styled(SummaryRow)`
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const TotalLabel = styled(SummaryLabel)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const TotalValue = styled(SummaryValue)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const ShoppingCart = () => {
  const { items, summary, itemCount } = useCart();
  const { language } = useLanguage();
  const { formatPrice } = useLocation();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <CartContainer>
        <CartTitle>
          {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
        </CartTitle>
        <EmptyCart>
          <EmptyIcon>
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </EmptyIcon>
          <EmptyTitle>
            {language === 'ar' ? 'سلة التسوق فارغة' : 'Your Cart is Empty'}
          </EmptyTitle>
          <EmptyText>
            {language === 'ar'
              ? 'تصفح منتجاتنا وأضف العناصر إلى سلة التسوق'
              : 'Browse our products and add items to your cart'}
          </EmptyText>
          <Button onClick={() => navigate('/products')}>
            {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
          </Button>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartTitle>
        {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'} ({itemCount})
      </CartTitle>
      
      <CartItems>
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </CartItems>

      <CartSummary>
        <SummaryRow>
          <SummaryLabel>
            {language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
          </SummaryLabel>
          <SummaryValue>{formatPrice(summary.subtotal)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>
            {language === 'ar' ? 'الشحن' : 'Shipping'}
          </SummaryLabel>
          <SummaryValue>{formatPrice(summary.shipping)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>
            {language === 'ar' ? 'الضريبة (15%)' : 'Tax (15%)'}
          </SummaryLabel>
          <SummaryValue>{formatPrice(summary.tax)}</SummaryValue>
        </SummaryRow>
        <TotalRow>
          <TotalLabel>
            {language === 'ar' ? 'الإجمالي' : 'Total'}
          </TotalLabel>
          <TotalValue>{formatPrice(summary.total)}</TotalValue>
        </TotalRow>
      </CartSummary>

      <CheckoutButton onClick={() => navigate('/checkout')}>
        {language === 'ar' ? 'إتمام الشراء' : 'Proceed to Checkout'}
      </CheckoutButton>
    </CartContainer>
  );
};
