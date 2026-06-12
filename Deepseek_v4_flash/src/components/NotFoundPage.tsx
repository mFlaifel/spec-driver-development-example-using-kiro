import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  line-height: 1.1;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  max-width: 480px;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export default function NotFoundPage() {
  const { t } = useTranslation(['errors', 'common', 'navigation']);
  const { direction } = useLanguage();

  return (
    <Container dir={direction}>
      <ErrorCode>404</ErrorCode>
      <Title>{t('errors.pageNotFound')}</Title>
      <Message>
        {direction === 'rtl'
          ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة إلى الرئيسية أو تصفح منتجاتنا.'
          : 'The page you are looking for does not exist or has been moved. You can go back home or browse our products.'}
      </Message>
      <Actions>
        <StyledLink to="/">
          <Button variant="primary">{t('buttons.goHome', { ns: 'common' })}</Button>
        </StyledLink>
        <StyledLink to="/products">
          <Button variant="outline">{t('buttons.browseProducts', { ns: 'common' })}</Button>
        </StyledLink>
      </Actions>
    </Container>
  );
}
