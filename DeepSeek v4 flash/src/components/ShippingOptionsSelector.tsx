import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import type { Theme } from '../utils/theme';
import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CurrencyService } from '../services/CurrencyService';
import { useTranslation } from 'react-i18next';
import type { ShippingOption } from '../types';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

interface ShippingOptionsSelectorProps {
  value?: string;
  onChange?: (optionId: string) => void;
}

const Wrapper = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Legend = styled.legend`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const OptionLabel = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.emeraldGreen : theme.colors.neutral[200]};
  border-radius: 8px;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.emeraldGreen : theme.colors.neutral[400]};
  }

  ${({ $selected }) =>
    $selected &&
    css`
      box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.emeraldGreen}33`};
    `}
`;

const RadioInput = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 50%;
  flex-shrink: 0;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background-color ${({ theme }) => theme.transitions.fast};

  &:checked {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    background-color: ${({ theme }) => theme.colors.emeraldGreen};
    box-shadow: inset 0 0 0 4px ${({ theme }) => theme.colors.white};
  }
`;

const OptionContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const OptionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OptionName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const OptionNameAr = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-family: ${({ theme }) => theme.typography.fontFamily.arabic};
`;

const OptionMeta = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const Cost = styled.span<{ $free?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, $free }) =>
    $free ? theme.colors.emeraldGreen : theme.colors.darkNavy};
`;

const DeliveryDays = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

function ShippingOptionsSelector({ value, onChange }: ShippingOptionsSelectorProps) {
  const { shippingOptions } = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const handleChange = useCallback(
    (optionId: string) => {
      onChange?.(optionId);
    },
    [onChange],
  );

  return (
    <Wrapper>
      <Legend>{t('cart.shipping', 'Shipping')}</Legend>
      {shippingOptions.map((option: ShippingOption) => {
        const isSelected = value === option.id;
        const isFree = option.cost === 0;

        return (
          <OptionLabel key={option.id} $selected={isSelected}>
            <RadioInput
              type="radio"
              name="shipping-option"
              value={option.id}
              checked={isSelected}
              onChange={() => handleChange(option.id)}
            />
            <OptionContent>
              <OptionInfo>
                <OptionName>{option.name}</OptionName>
                {language === 'ar' && option.nameAr && (
                  <OptionNameAr>{option.nameAr}</OptionNameAr>
                )}
              </OptionInfo>
              <OptionMeta>
                {isFree ? (
                  <Cost $free>{t('shipping.free', 'Free')}</Cost>
                ) : (
                  <Cost>
                    {CurrencyService.formatPrice(option.cost, option.currency, language)}
                  </Cost>
                )}
                <DeliveryDays>
                  {t('shipping.estimatedDays', '{{days}} days', { days: option.estimatedDays })}
                </DeliveryDays>
              </OptionMeta>
            </OptionContent>
          </OptionLabel>
        );
      })}
    </Wrapper>
  );
}

export default ShippingOptionsSelector;
