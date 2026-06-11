import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ValidationService } from '../services/ValidationService';
import AddressForm from './AddressForm';
import ContactInfoForm from './ContactInfoForm';
import ShippingOptionsSelector from './ShippingOptionsSelector';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import OrderSummary from './OrderSummary';
import Button from './Button';
import type { Theme } from '../utils/theme';
import type { Address, ContactInfo, PaymentMethod, ShippingOption } from '../types';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

const STEP_COUNT = 3;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const StepIndicator = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StepItem = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StepCircle = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  transition: ${({ theme }) => theme.transitions.base};
  flex-shrink: 0;

  ${({ $completed, theme }) =>
    $completed
      ? css`
          background-color: ${theme.colors.emeraldGreen};
          color: ${theme.colors.white};
        `
      : css`
          background-color: ${theme.colors.neutral[200]};
          color: ${theme.colors.neutral[600]};
        `}

  ${({ $active, theme }) =>
    $active &&
    css`
      background-color: ${theme.colors.emeraldGreen};
      color: ${theme.colors.white};
      box-shadow: 0 0 0 4px ${theme.colors.emeraldGreen}33;
    `}
`;

const StepLabel = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.darkNavy : theme.colors.neutral[500]};
  transition: ${({ theme }) => theme.transitions.base};
  white-space: nowrap;

  @media (max-width: 767px) {
    display: none;
  }
`;

const Connector = styled.div<{ $completed: boolean }>`
  width: 60px;
  height: 2px;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, $completed }) =>
    $completed ? theme.colors.emeraldGreen : theme.colors.neutral[200]};
  transition: ${({ theme }) => theme.transitions.base};

  @media (max-width: 767px) {
    width: 24px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StepContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const StepTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionLabel = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const ErrorBanner = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.semantic.error}11;
  border: 1px solid ${({ theme }) => theme.colors.semantic.error};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.semantic.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const NavButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Sidebar = styled.aside`
  position: sticky;
  top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1023px) {
    position: static;
  }
`;

function CheckoutForm() {
  const { t } = useTranslation(['common', 'forms', 'errors']);
  const { language, direction } = useLanguage();
  const { summary, clearCart } = useCart();
  const { shippingOptions, country } = useLocation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState<Address | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [shippingOption, setShippingOption] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedShippingCost = useMemo(() => {
    if (!shippingOption) return undefined;
    const option = shippingOptions.find((o: ShippingOption) => o.id === shippingOption);
    return option?.cost;
  }, [shippingOption, shippingOptions]);

  const getErrorMessage = useCallback(
    (errors: { message: string; messageAr: string }[]): string => {
      if (errors.length === 0) return '';
      return language === 'ar' ? errors[0].messageAr : errors[0].message;
    },
    [language],
  );

  const validateStep = useCallback(
    (step: number): boolean => {
      setError(null);

      if (step === 0) {
        if (!address) {
          setError(t('errors:errors.requiredField'));
          return false;
        }
        const addressResult = ValidationService.validateAddress(address);
        if (!addressResult.valid) {
          setError(getErrorMessage(addressResult.errors));
          return false;
        }
        if (!contactInfo) {
          setError(t('errors:errors.requiredField'));
          return false;
        }
        const emailResult = ValidationService.validateEmail(contactInfo.email);
        if (!emailResult.valid) {
          setError(getErrorMessage(emailResult.errors));
          return false;
        }
        const phoneResult = ValidationService.validatePhone(contactInfo.phone, address.countryCode);
        if (!phoneResult.valid) {
          setError(getErrorMessage(phoneResult.errors));
          return false;
        }
        return true;
      }

      if (step === 1) {
        if (!paymentMethod) {
          setError(t('forms:forms.paymentMethod'));
          return false;
        }
        return true;
      }

      return true;
    },
    [address, contactInfo, paymentMethod, t, getErrorMessage],
  );

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEP_COUNT - 1));
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!shippingOption) {
      setError(t('errors:errors.requiredField'));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      clearCart();
      navigate('/order-confirmation');
    } catch {
      const msg =
        language === 'ar'
          ? 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'
          : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [shippingOption, clearCart, navigate, language, t]);

  const stepLabel = (index: number): string => {
    const labels = [
      t('checkout.step.shipping', 'Shipping Information'),
      t('checkout.step.payment', 'Payment Method'),
      t('checkout.step.review', 'Review Order'),
    ];
    return labels[index];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <StepTitle>{stepLabel(0)}</StepTitle>
            <FormSection>
              <SectionLabel>
                {t('forms:forms.addressLine1')}
              </SectionLabel>
              <AddressForm
                defaultValues={address ?? undefined}
                onChange={setAddress}
              />
            </FormSection>
            <FormSection>
              <SectionLabel>
                {t('forms:forms.email')}
              </SectionLabel>
              <ContactInfoForm
                defaultValues={contactInfo ?? undefined}
                onChange={setContactInfo}
                countryCode={address?.countryCode ?? country.code}
              />
            </FormSection>
          </>
        );
      case 1:
        return (
          <>
            <StepTitle>{stepLabel(1)}</StepTitle>
            <PaymentMethodSelector
              value={paymentMethod ?? undefined}
              onChange={setPaymentMethod}
              error={error ?? undefined}
            />
          </>
        );
      case 2:
        return (
          <>
            <StepTitle>{stepLabel(2)}</StepTitle>
            <FormSection>
              <ShippingOptionsSelector
                value={shippingOption}
                onChange={setShippingOption}
              />
            </FormSection>
          </>
        );
      default:
        return null;
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEP_COUNT - 1;

  return (
    <Wrapper dir={direction}>
      <Title>{t('cart.checkout', 'Checkout')}</Title>

      <StepIndicator aria-label={t('checkout.steps', 'Checkout steps')}>
        {Array.from({ length: STEP_COUNT }, (_, i) => (
          <StepItem key={i} $active={currentStep === i} $completed={currentStep > i}>
            <StepCircle $active={currentStep === i} $completed={currentStep > i}>
              {currentStep > i ? '\u2713' : i + 1}
            </StepCircle>
            <StepLabel $active={currentStep === i}>{stepLabel(i)}</StepLabel>
            {i < STEP_COUNT - 1 && (
              <Connector $completed={currentStep > i} />
            )}
          </StepItem>
        ))}
      </StepIndicator>

      <Layout>
        <ContentArea>
          {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

          <StepContent>{renderStepContent()}</StepContent>

          <Navigation>
            <div />
            <NavButtons>
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={submitting}
                >
                  {t('buttons.back', 'Back')}
                </Button>
              )}
              {isLastStep ? (
                <Button
                  variant="primary"
                  loading={submitting}
                  onClick={handleSubmit}
                >
                  {t('buttons.placeOrder', 'Place Order')}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                >
                  {t('buttons.next', 'Next')}
                </Button>
              )}
            </NavButtons>
          </Navigation>
        </ContentArea>

        <Sidebar>
          <OrderSummary
            summary={summary}
            shippingCost={selectedShippingCost}
          />
        </Sidebar>
      </Layout>
    </Wrapper>
  );
}

export default CheckoutForm;
