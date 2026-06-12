import styled from 'styled-components';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { AddressForm } from '../AddressForm';
import { ContactInfoForm } from '../ContactInfoForm';
import { ShippingOptionsSelector } from '../ShippingOptionsSelector';
import { PaymentMethodSelector } from '../PaymentMethodSelector';
import { OrderSummary } from '../OrderSummary';
import { Button } from '../Button';
import { AddressFormData, ContactInfoFormData } from '../../utils/validations';
import { PaymentMethod } from '../../types';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr 400px;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Step = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ isActive, isCompleted, theme }) =>
    isActive || isCompleted ? theme.colors.emeraldGreen : theme.colors.gray600};
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
`;

const StepNumber = styled.span<{ isActive: boolean; isCompleted: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  background-color: ${({ isActive, isCompleted, theme }) =>
    isActive || isCompleted ? theme.colors.emeraldGreen : theme.colors.gray200};
  color: ${({ isActive, isCompleted, theme }) =>
    isActive || isCompleted ? theme.colors.white : theme.colors.gray600};
`;

const StepDivider = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray200};
`;

const StepTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme.colors.gray200};
  border-top-color: ${({ theme }) => theme.colors.emeraldGreen};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
`;

export const CheckoutForm = () => {
  const [step, setStep] = useState(1);
  const [addressData, setAddressData] = useState<AddressFormData | null>(null);
  const [contactData, setContactData] = useState<ContactInfoFormData | null>(null);
  const [shippingOption, setShippingOption] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { clearCart } = useCart();
  const { language } = useLanguage();
  const { shippingOptions } = useLocation();
  const navigate = useNavigate();

  const t = (key: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      step1: { en: 'Shipping Info', ar: 'معلومات الشحن' },
      step2: { en: 'Payment', ar: 'الدفع' },
      step3: { en: 'Review', ar: 'المراجعة' },
      continue: { en: 'Continue', ar: 'متابعة' },
      back: { en: 'Back', ar: 'رجوع' },
      placeOrder: { en: 'Place Order', ar: 'تأكيد الطلب' },
      processing: { en: 'Processing your order...', ar: 'جاري معالجة طلبك...' },
    };
    return translations[key]?.[language as 'en' | 'ar'] || key;
  };

  const handleAddressSubmit = useCallback((data: AddressFormData) => {
    setAddressData(data);
    setStep(2);
  }, []);

  const handleContactSubmit = useCallback((data: ContactInfoFormData) => {
    setContactData(data);
  }, []);

  const handleContinueToReview = useCallback(() => {
    if (!contactData) return;
    setStep(3);
  }, [contactData]);

  const handlePlaceOrder = useCallback(async () => {
    if (!addressData || !contactData || !shippingOption || !paymentMethod) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      clearCart();
      navigate('/order-confirmation');
    } catch {
      setIsSubmitting(false);
    }
  }, [addressData, contactData, shippingOption, paymentMethod, clearCart, navigate]);

  const selectedShipping = shippingOptions.find((opt) => opt.id === shippingOption);

  return (
    <CheckoutContainer>
      <FormSection>
        <StepIndicator>
          <Step isActive={step === 1} isCompleted={step > 1}>
            <StepNumber isActive={step === 1} isCompleted={step > 1}>1</StepNumber>
            <span>{t('step1')}</span>
          </Step>
          <StepDivider />
          <Step isActive={step === 2} isCompleted={step > 2}>
            <StepNumber isActive={step === 2} isCompleted={step > 2}>2</StepNumber>
            <span>{t('step2')}</span>
          </Step>
          <StepDivider />
          <Step isActive={step === 3} isCompleted={false}>
            <StepNumber isActive={step === 3} isCompleted={false}>3</StepNumber>
            <span>{t('step3')}</span>
          </Step>
        </StepIndicator>

        {step === 1 && (
          <>
            <StepTitle>{t('step1')}</StepTitle>
            <AddressForm onSubmit={handleAddressSubmit} initialData={addressData || undefined} />
            {contactData && (
              <ButtonGroup>
                <Button onClick={() => setStep(2)}>{t('continue')}</Button>
              </ButtonGroup>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <StepTitle>{t('step2')}</StepTitle>
            <ContactInfoForm onSubmit={handleContactSubmit} initialData={contactData || undefined} />
            <ShippingOptionsSelector
              selectedOptionId={shippingOption}
              onSelect={setShippingOption}
            />
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />
            <ButtonGroup>
              <Button variant="outline" onClick={() => setStep(1)}>{t('back')}</Button>
              <Button
                onClick={handleContinueToReview}
                disabled={!contactData || !shippingOption || !paymentMethod}
              >
                {t('continue')}
              </Button>
            </ButtonGroup>
          </>
        )}

        {step === 3 && (
          <>
            <StepTitle>{t('step3')}</StepTitle>
            {addressData && (
              <div>
                <p><strong>{language === 'ar' ? 'العنوان:' : 'Address:'}</strong></p>
                <p>{addressData.firstName} {addressData.lastName}</p>
                <p>{addressData.addressLine1}</p>
                {addressData.addressLine2 && <p>{addressData.addressLine2}</p>}
                <p>{addressData.city}, {addressData.postalCode}</p>
              </div>
            )}
            {contactData && (
              <div>
                <p><strong>{language === 'ar' ? 'معلومات الاتصال:' : 'Contact:'}</strong></p>
                <p>{contactData.email}</p>
                <p>{contactData.phone}</p>
              </div>
            )}
            {selectedShipping && (
              <div>
                <p><strong>{language === 'ar' ? 'الشحن:' : 'Shipping:'}</strong></p>
                <p>{language === 'ar' ? selectedShipping.nameAr : selectedShipping.name}</p>
              </div>
            )}
            <ButtonGroup>
              <Button variant="outline" onClick={() => setStep(2)}>{t('back')}</Button>
              <Button onClick={handlePlaceOrder}>{t('placeOrder')}</Button>
            </ButtonGroup>
          </>
        )}
      </FormSection>

      <OrderSummary shippingCost={selectedShipping?.cost || 0} />

      {isSubmitting && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>{t('processing')}</LoadingText>
        </LoadingOverlay>
      )}
    </CheckoutContainer>
  );
};
