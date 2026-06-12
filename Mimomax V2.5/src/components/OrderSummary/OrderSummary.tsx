import styled from 'styled-components';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';

interface OrderSummaryProps {
  shippingCost?: number;
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const ItemQuantity = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const ItemPrice = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
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

export const OrderSummary = ({ shippingCost = 0 }: OrderSummaryProps) => {
  const { items, summary } = useCart();
  const { language } = useLanguage();
  const { formatPrice } = useLocation();

  const t = (key: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      orderSummary: { en: 'Order Summary', ar: 'ملخص الطلب' },
      subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
      shipping: { en: 'Shipping', ar: 'الشحن' },
      tax: { en: 'Tax (15%)', ar: 'الضريبة (15%)' },
      total: { en: 'Total', ar: 'الإجمالي' },
    };
    return translations[key]?.[language as 'en' | 'ar'] || key;
  };

  const totalShipping = shippingCost || summary.shipping;

  return (
    <Container>
      <Title>{t('orderSummary')}</Title>
      
      <ItemsList>
        {items.map((item) => {
          const itemName = language === 'ar' ? item.productNameAr : item.productName;
          return (
            <ItemRow key={item.id}>
              <ItemName>{itemName}</ItemName>
              <ItemQuantity>x{item.quantity}</ItemQuantity>
              <ItemPrice>{formatPrice(item.price * item.quantity)}</ItemPrice>
            </ItemRow>
          );
        })}
      </ItemsList>

      <SummaryRow>
        <SummaryLabel>{t('subtotal')}</SummaryLabel>
        <SummaryValue>{formatPrice(summary.subtotal)}</SummaryValue>
      </SummaryRow>
      
      <SummaryRow>
        <SummaryLabel>{t('shipping')}</SummaryLabel>
        <SummaryValue>{formatPrice(totalShipping)}</SummaryValue>
      </SummaryRow>
      
      <SummaryRow>
        <SummaryLabel>{t('tax')}</SummaryLabel>
        <SummaryValue>{formatPrice(summary.tax)}</SummaryValue>
      </SummaryRow>
      
      <TotalRow>
        <TotalLabel>{t('total')}</TotalLabel>
        <TotalValue>{formatPrice(summary.subtotal + totalShipping + summary.tax)}</TotalValue>
      </TotalRow>
    </Container>
  );
};
