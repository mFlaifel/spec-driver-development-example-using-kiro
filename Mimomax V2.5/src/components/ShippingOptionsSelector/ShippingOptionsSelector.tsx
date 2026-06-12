import styled from 'styled-components';
import { useLocation } from '../../contexts/LocationContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ShippingOptionsSelectorProps {
  selectedOptionId: string;
  onSelect: (optionId: string) => void;
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

const OptionInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
`;

const OptionPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
`;

export const ShippingOptionsSelector = ({
  selectedOptionId,
  onSelect,
}: ShippingOptionsSelectorProps) => {
  const { shippingOptions, formatPrice } = useLocation();
  const { language } = useLanguage();

  const t = (key: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      shippingMethod: { en: 'Shipping Method', ar: 'طريقة الشحن' },
      freeShipping: { en: 'Free Shipping', ar: 'شحن مجاني' },
      estimatedDelivery: { en: 'Estimated delivery', ar: 'وقت التوصيل المقدر' },
      days: { en: 'days', ar: 'أيام' },
    };
    return translations[key]?.[language as 'en' | 'ar'] || key;
  };

  return (
    <Container>
      <Title>{t('shippingMethod')}</Title>
      {shippingOptions.map((option) => (
        <OptionCard
          key={option.id}
          isSelected={selectedOptionId === option.id}
        >
          <RadioInput
            type="radio"
            name="shippingOption"
            value={option.id}
            checked={selectedOptionId === option.id}
            onChange={() => onSelect(option.id)}
          />
          <OptionDetails>
            <OptionName>{language === 'ar' ? option.nameAr : option.name}</OptionName>
            <OptionInfo>
              {t('estimatedDelivery')}: {option.estimatedDays} {t('days')}
            </OptionInfo>
          </OptionDetails>
          <OptionPrice>{formatPrice(option.cost)}</OptionPrice>
        </OptionCard>
      ))}
    </Container>
  );
};
