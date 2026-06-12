import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../Button';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.emeraldGreen + '20'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.emeraldGreen};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const OrderNumber = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const OrderNumberValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const OrderConfirmation = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  const t = (key: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      orderConfirmed: { en: 'Order Confirmed!', ar: 'تم تأكيد الطلب!' },
      orderNumber: { en: 'Order Number', ar: 'رقم الطلب' },
      thankYou: {
        en: 'Thank you for your purchase. We will send you an email with your order details and tracking information.',
        ar: 'شكراً لك على الشراء. سنرسل لك بريداً إلكترونياً بتفاصيل طلبك ومعلومات التتبع.',
      },
      continueShopping: { en: 'Continue Shopping', ar: 'متابعة التسوق' },
      viewOrder: { en: 'View Order', ar: 'عرض الطلب' },
    };
    return translations[key]?.[language as 'en' | 'ar'] || key;
  };

  return (
    <Container>
      <SuccessIcon>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </SuccessIcon>

      <Title>{t('orderConfirmed')}</Title>

      <OrderNumber>
        {t('orderNumber')}: <OrderNumberValue>{orderNumber}</OrderNumberValue>
      </OrderNumber>

      <Message>{t('thankYou')}</Message>

      <ButtonContainer>
        <Button onClick={() => navigate('/products')}>
          {t('continueShopping')}
        </Button>
      </ButtonContainer>
    </Container>
  );
};
