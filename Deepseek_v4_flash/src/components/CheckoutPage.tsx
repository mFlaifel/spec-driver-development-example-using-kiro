import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import CheckoutForm from './CheckoutForm';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export default function CheckoutPage() {
  const { t } = useTranslation('cart');
  const navigate = useNavigate();
  const { items } = useCart();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', {
        state: { message: t('cart.empty') },
        replace: true,
      });
    }
  }, [items, navigate, t]);

  if (items.length === 0) {
    return null;
  }

  return (
    <Container>
      <Title>{t('cart.checkout')}</Title>
      <CheckoutForm />
    </Container>
  );
}
