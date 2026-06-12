import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { PaymentMethod } from '../../types';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | '';
  onSelect: (method: PaymentMethod) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const OptionCard = styled.label<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ isSelected, theme }) =>
    isSelected ? theme.colors.emeraldGreen : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
  }
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  accent-color: ${({ theme }) => theme.colors.emeraldGreen};
`;

const OptionIcon = styled.span`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const OptionDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const OptionName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const OptionDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
`;

export const PaymentMethodSelector = ({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) => {
  const { language } = useLanguage();

  const t = (key: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      paymentMethod: { en: 'Payment Method', ar: 'طريقة الدفع' },
      creditCard: { en: 'Credit Card', ar: 'بطاقة ائتمان' },
      creditCardDesc: { en: 'Pay securely with your credit card', ar: 'ادفع بأمان ببطاقة الائتمان الخاصة بك' },
      paypal: { en: 'PayPal', ar: 'باي بال' },
      paypalDesc: { en: 'Pay with your PayPal account', ar: 'ادفع بحساب باي بال الخاص بك' },
      cashOnDelivery: { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
      cashOnDeliveryDesc: { en: 'Pay when you receive your order', ar: 'ادفع عند استلام طلبك' },
    };
    return translations[key]?.[language as 'en' | 'ar'] || key;
  };

  const paymentMethods: { id: PaymentMethod; icon: string }[] = [
    { id: 'credit_card', icon: '💳' },
    { id: 'paypal', icon: '🅿️' },
    { id: 'cash_on_delivery', icon: '💵' },
  ];

  return (
    <Container>
      <Title>{t('paymentMethod')}</Title>
      {paymentMethods.map((method) => (
        <OptionCard
          key={method.id}
          isSelected={selectedMethod === method.id}
        >
          <RadioInput
            type="radio"
            name="paymentMethod"
            value={method.id}
            checked={selectedMethod === method.id}
            onChange={() => onSelect(method.id)}
          />
          <OptionIcon>{method.icon}</OptionIcon>
          <OptionDetails>
            <OptionName>{t(method.id === 'credit_card' ? 'creditCard' : method.id === 'cash_on_delivery' ? 'cashOnDelivery' : 'paypal')}</OptionName>
            <OptionDescription>
              {t(method.id === 'credit_card' ? 'creditCardDesc' : method.id === 'cash_on_delivery' ? 'cashOnDeliveryDesc' : 'paypalDesc')}
            </OptionDescription>
          </OptionDetails>
        </OptionCard>
      ))}
    </Container>
  );
};
