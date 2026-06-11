import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CurrencyService } from '../services/CurrencyService';
import CartItem from './CartItem';
import Button from './Button';
import { isMobile, isDesktop } from '../utils/media';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const ItemCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  ${isMobile`
    grid-template-columns: 1fr;
  `}
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
`;

const SummaryRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const CheckoutButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

function ShoppingCart() {
  const { t } = useTranslation('cart');
  const { t: tc } = useTranslation();
  const navigate = useNavigate();
  const { items, summary, updateQuantity, removeItem } = useCart();
  const { shippingOptions } = useLocation();
  const { language } = useLanguage();

  const shippingCost = shippingOptions.length > 0 ? shippingOptions[0].cost : 0;
  const total = summary.subtotal + shippingCost + summary.tax;
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <Container>
        <EmptyState>
          <Title>{t('cart.title')}</Title>
          <EmptyText>{t('cart.empty')}</EmptyText>
          <Button onClick={() => navigate('/products')}>
            {tc('buttons.browseProducts')}
          </Button>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{t('cart.title')}</Title>
        <ItemCount>
          {t('cart.itemCount', { count: summary.itemCount })}
        </ItemCount>
      </Header>
      <Layout>
        <ItemsList>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={(_id: string, q: number) => updateQuantity(item.id, q)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </ItemsList>
        <SummaryCard>
          <SummaryRow>
            <SummaryLabel>{t('cart.subtotal')}</SummaryLabel>
            <SummaryValue>
              {CurrencyService.formatPrice(summary.subtotal, summary.currency, language)}
            </SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>{t('cart.shipping')}</SummaryLabel>
            <SummaryValue>
              {CurrencyService.formatPrice(shippingCost, summary.currency, language)}
            </SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>{t('cart.tax')}</SummaryLabel>
            <SummaryValue>
              {CurrencyService.formatPrice(summary.tax, summary.currency, language)}
            </SummaryValue>
          </SummaryRow>
          <Divider />
          <SummaryRow $bold>
            <SummaryLabel>{t('cart.total')}</SummaryLabel>
            <SummaryValue>
              {CurrencyService.formatPrice(total, summary.currency, language)}
            </SummaryValue>
          </SummaryRow>
          <CheckoutButton
            fullWidth
            size="large"
            onClick={() => navigate('/checkout')}
          >
            {t('cart.proceedToCheckout')}
          </CheckoutButton>
        </SummaryCard>
      </Layout>
    </Container>
  );
}

export default ShoppingCart;
