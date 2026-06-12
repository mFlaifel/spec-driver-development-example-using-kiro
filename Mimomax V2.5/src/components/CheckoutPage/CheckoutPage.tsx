import styled from 'styled-components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { CheckoutForm } from '../CheckoutForm';

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background-color: ${({ theme }) => theme.colors.gray50};
`;

export const CheckoutPage = () => {
  const { items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  if (items.length === 0) {
    return null;
  }

  return (
    <PageContainer>
      <CheckoutForm />
    </PageContainer>
  );
};
