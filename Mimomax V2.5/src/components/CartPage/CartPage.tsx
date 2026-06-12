import styled from 'styled-components';
import { ShoppingCart } from '../ShoppingCart';

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background-color: ${({ theme }) => theme.colors.gray50};
`;

export const CartPage = () => {
  return (
    <PageContainer>
      <ShoppingCart />
    </PageContainer>
  );
};
