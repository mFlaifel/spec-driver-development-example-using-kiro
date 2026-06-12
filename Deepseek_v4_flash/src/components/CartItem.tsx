import { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import type { Theme } from '../utils/theme';
import { CurrencyService } from '../services/CurrencyService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import type { CartItem as CartItemType } from '../types';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const Wrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    height: 200px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OutOfStockBadge = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

const Name = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NameAr = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-family: ${({ theme }) => theme.typography.fontFamily.arabic};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.emeraldGreen};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: space-between;
  }
`;

const QuantityStepper = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 6px;
  overflow: hidden;
`;

const StepperButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: ${({ theme }) => theme.colors.neutral[50]};
  color: ${({ theme }) => theme.colors.darkNavy};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.neutral[200]};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.4;
      cursor: not-allowed;
    `}
`;

const QuantityDisplay = styled.span`
  min-width: 40px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
`;

function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { language, direction } = useLanguage();
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  const isOutOfStock = item.availability === 'out_of_stock';
  const isAtMin = item.quantity <= 1;
  const maxQuantity = item.availability === 'in_stock' ? 99 : 0;

  const handleDecrement = useCallback(() => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleIncrement = useCallback(() => {
    if (item.quantity < maxQuantity) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  }, [item.id, item.quantity, maxQuantity, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    onRemove(item.id);
    setShowConfirm(false);
  }, [item.id, onRemove]);

  const displayName = language === 'ar' && item.productNameAr
    ? item.productNameAr
    : item.productName;

  return (
    <Wrapper dir={direction}>
      <ImageContainer>
        <ProductImage
          src={item.productImage}
          alt={displayName}
          loading="lazy"
        />
        {isOutOfStock && (
          <OutOfStockBadge>
            {t('cart.outOfStock', 'Out of Stock')}
          </OutOfStockBadge>
        )}
      </ImageContainer>

      <Info>
        <div>
          <Name>{item.productName}</Name>
          {language === 'ar' && item.productNameAr && (
            <NameAr>{item.productNameAr}</NameAr>
          )}
        </div>

        <Price>
          {CurrencyService.formatPrice(item.price, item.currency, language)}
        </Price>

        <Controls>
          <QuantityStepper>
            <StepperButton
              onClick={handleDecrement}
              disabled={isAtMin || isOutOfStock}
              $disabled={isAtMin || isOutOfStock}
              aria-label={t('cart.decreaseQuantity', 'Decrease quantity')}
            >
              −
            </StepperButton>
            <QuantityDisplay>{item.quantity}</QuantityDisplay>
            <StepperButton
              onClick={handleIncrement}
              disabled={item.quantity >= maxQuantity || isOutOfStock}
              $disabled={item.quantity >= maxQuantity || isOutOfStock}
              aria-label={t('cart.increaseQuantity', 'Increase quantity')}
            >
              +
            </StepperButton>
          </QuantityStepper>
        </Controls>
      </Info>

      <RightSection>
        {showConfirm ? (
          <ConfirmGroup>
            <ConfirmText>
              {t('cart.confirmRemove', 'Remove this item?')}
            </ConfirmText>
            <ConfirmActions>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowConfirm(false)}
              >
                {t('cart.cancel', 'Cancel')}
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleRemove}
              >
                {t('cart.remove', 'Remove')}
              </Button>
            </ConfirmActions>
          </ConfirmGroup>
        ) : (
          <RemoveButton
            onClick={() => setShowConfirm(true)}
            aria-label={t('cart.removeItem', 'Remove item')}
            title={t('cart.removeItem', 'Remove item')}
          >
            <TrashIcon viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </TrashIcon>
          </RemoveButton>
        )}
      </RightSection>
    </Wrapper>
  );
}

const ConfirmGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: flex-end;
  }
`;

const ConfirmText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  white-space: nowrap;
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.semantic.error};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.semantic.error};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.semantic.error};
  }
`;

const TrashIcon = styled.svg`
  flex-shrink: 0;
`;

export default CartItem;
