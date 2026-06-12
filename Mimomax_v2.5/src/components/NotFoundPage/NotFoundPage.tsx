import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const NotFoundPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>
        {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
      </Title>
      <Message>
        {language === 'ar'
          ? 'الصفحة التي تبحث عنها غير موجودة. يرجى التحقق من الرابط أو العودة إلى الرئيسية.'
          : 'The page you are looking for does not exist. Please check the URL or go back to the home page.'}
      </Message>
      <ButtonGroup>
        <Button onClick={() => navigate('/')}>
          {language === 'ar' ? 'الذهاب إلى الرئيسية' : 'Go Home'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/products')}>
          {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
        </Button>
      </ButtonGroup>
    </Container>
  );
};
