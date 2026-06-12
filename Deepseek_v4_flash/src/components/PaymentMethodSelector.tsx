import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { PaymentMethod } from '../types';

interface PaymentMethodSelectorProps {
  value?: PaymentMethod;
  onChange?: (method: PaymentMethod) => void;
  error?: string;
}

const PAYMENT_METHODS: { key: PaymentMethod; icon: string }[] = [
  { key: 'credit_card', icon: '💳' },
  { key: 'paypal', icon: '🅿️' },
  { key: 'cash_on_delivery', icon: '💵' },
];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily.english};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Option = styled.label<{ $selected: boolean; $error: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 2px solid
    ${({ theme, $selected, $error }) =>
      $error
        ? theme.colors.semantic.error
        : $selected
          ? theme.colors.emeraldGreen
          : theme.colors.neutral[200]};
  border-radius: 8px;
  background-color: ${({ theme, $selected }) =>
    $selected ? `${theme.colors.emeraldGreen}0D` : theme.colors.white};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};
  flex: 1;
  min-width: 180px;

  &:hover:not(:has(input:disabled)) {
    border-color: ${({ theme, $selected, $error }) =>
      $error
        ? theme.colors.semantic.error
        : $selected
          ? theme.colors.emeraldGreen
          : theme.colors.neutral[400]};
    background-color: ${({ theme, $selected }) =>
      $selected ? `${theme.colors.emeraldGreen}0D` : theme.colors.neutral[50]};
  }

  &:has(input:focus-visible) {
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.emeraldGreen}33`};
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

const Icon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
`;

const MethodLabel = styled.span<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.english};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme, $selected }) =>
    $selected ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.emeraldGreen : theme.colors.neutral[900]};
  transition:
    color ${({ theme }) => theme.transitions.fast},
    font-weight ${({ theme }) => theme.transitions.fast};
`;

const ErrorMessage = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.english};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.semantic.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export function PaymentMethodSelector({
  value,
  onChange,
  error,
}: PaymentMethodSelectorProps) {
  const { t } = useTranslation('forms');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value as PaymentMethod);
  };

  return (
    <Wrapper role="radiogroup" aria-label={t('forms.paymentMethod')}>
      <Label>{t('forms.paymentMethod')}</Label>
      <OptionsContainer>
        {PAYMENT_METHODS.map(({ key, icon }) => {
          const selected = value === key;
          return (
            <Option key={key} $selected={selected} $error={!!error}>
              <HiddenRadio
                type="radio"
                name="paymentMethod"
                value={key}
                checked={selected}
                onChange={handleChange}
                aria-label={t(`forms.${key}`)}
              />
              <Icon>{icon}</Icon>
              <MethodLabel $selected={selected}>
                {t(`forms.${key}`)}
              </MethodLabel>
            </Option>
          );
        })}
      </OptionsContainer>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </Wrapper>
  );
}

export default PaymentMethodSelector;
