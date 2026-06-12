import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { CurrencyService } from '../services/CurrencyService';
import type { CartSummary } from '../types';

interface OrderSummaryProps {
  summary: CartSummary;
  shippingCost?: number;
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.darkNavy};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemNameAr = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-family: ${({ theme }) => theme.typography.fontFamily.arabic};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemQuantity = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};
  flex-shrink: 0;
`;

const ItemPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  flex-shrink: 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const SummaryRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  font-weight: ${({ theme, $bold }) =>
    $bold ? theme.typography.fontWeight.bold : theme.typography.fontWeight.normal};
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.darkNavy};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

function OrderSummary({ summary, shippingCost }: OrderSummaryProps) {
  const { t } = useTranslation('cart');
  const { language, direction } = useLanguage();
  const displayShipping = shippingCost ?? summary.shipping;

  return (
    <Card dir={direction}>
      <Title>{t('cart.title')}</Title>

      <ItemsList>
        {summary.items.map((item) => {
          const displayName = language === 'ar' && item.productNameAr
            ? item.productNameAr
            : item.productName;
          const secondaryName = language === 'ar' && item.productNameAr
            ? item.productName
            : item.productNameAr;

          return (
            <ItemRow key={item.id}>
              <ItemInfo>
                <ItemName>{displayName}</ItemName>
                {language === 'ar' && secondaryName && (
                  <ItemNameAr>{secondaryName}</ItemNameAr>
                )}
              </ItemInfo>
              <ItemQuantity>×{item.quantity}</ItemQuantity>
              <ItemPrice>
                {CurrencyService.formatPrice(
                  item.price * item.quantity,
                  item.currency,
                  language,
                )}
              </ItemPrice>
            </ItemRow>
          );
        })}
      </ItemsList>

      <Divider />

      <SummaryRow>
        <SummaryLabel>{t('cart.subtotal')}</SummaryLabel>
        <SummaryValue>
          {CurrencyService.formatPrice(
            summary.subtotal,
            summary.currency,
            language,
          )}
        </SummaryValue>
      </SummaryRow>

      <SummaryRow>
        <SummaryLabel>{t('cart.shipping')}</SummaryLabel>
        <SummaryValue>
          {CurrencyService.formatPrice(
            displayShipping,
            summary.currency,
            language,
          )}
        </SummaryValue>
      </SummaryRow>

      <SummaryRow>
        <SummaryLabel>{t('cart.tax')}</SummaryLabel>
        <SummaryValue>
          {CurrencyService.formatPrice(
            summary.tax,
            summary.currency,
            language,
          )}
        </SummaryValue>
      </SummaryRow>

      <Divider />

      <SummaryRow $bold>
        <SummaryLabel>{t('cart.total')}</SummaryLabel>
        <SummaryValue>
          {CurrencyService.formatPrice(
            summary.total + displayShipping - summary.shipping,
            summary.currency,
            language,
          )}
        </SummaryValue>
      </SummaryRow>
    </Card>
  );
}

export default OrderSummary;
