import styled from 'styled-components';
import ShoppingCart from './ShoppingCart';

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export default function CartPage() {
  return (
    <PageWrapper>
      <ShoppingCart />
    </PageWrapper>
  );
}
