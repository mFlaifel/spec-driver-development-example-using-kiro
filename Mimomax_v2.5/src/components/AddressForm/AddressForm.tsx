import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormData } from '../../utils/validations';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { Input } from '../Input';
import { CountryCode } from '../../types';

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CountryDisplay = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.darkNavy};
  min-height: 44px;
  display: flex;
  align-items: center;
`;

export const AddressForm = ({ onSubmit, initialData }: AddressFormProps) => {
  const { language } = useLanguage();
  const { country } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      countryCode: country,
      ...initialData,
    },
  });

  const t = (key: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      shippingAddress: { en: 'Shipping Address', ar: 'عنوان الشحن' },
      firstName: { en: 'First Name', ar: 'الاسم الأول' },
      lastName: { en: 'Last Name', ar: 'اسم العائلة' },
      addressLine1: { en: 'Address Line 1', ar: 'العنوان الأول' },
      addressLine2: { en: 'Address Line 2', ar: 'العنوان الثاني (اختياري)' },
      city: { en: 'City', ar: 'المدينة' },
      postalCode: { en: 'Postal Code', ar: 'الرمز البريدي' },
      country: { en: 'Country', ar: 'الدولة' },
    };
    return translations[key]?.[language as 'en' | 'ar'] || key;
  };

  const countryNames: Record<CountryCode, { en: string; ar: string }> = {
    SA: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    AE: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    KW: { en: 'Kuwait', ar: 'الكويت' },
    QA: { en: 'Qatar', ar: 'قطر' },
    BH: { en: 'Bahrain', ar: 'البحرين' },
    OM: { en: 'Oman', ar: 'عُمان' },
    EG: { en: 'Egypt', ar: 'مصر' },
    JO: { en: 'Jordan', ar: 'الأردن' },
    MA: { en: 'Morocco', ar: 'المغرب' },
    DZ: { en: 'Algeria', ar: 'الجزائر' },
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>{t('shippingAddress')}</FormTitle>

      <FormRow>
        <Input
          label={t('firstName')}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label={t('lastName')}
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </FormRow>

      <Input
        label={t('addressLine1')}
        error={errors.addressLine1?.message}
        {...register('addressLine1')}
      />

      <Input
        label={t('addressLine2')}
        error={errors.addressLine2?.message}
        {...register('addressLine2')}
      />

      <FormRow>
        <Input
          label={t('city')}
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label={t('postalCode')}
          error={errors.postalCode?.message}
          {...register('postalCode')}
        />
      </FormRow>

      <div>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
          {t('country')}
        </label>
        <CountryDisplay>
          {countryNames[country]?.[language as 'en' | 'ar'] || country}
        </CountryDisplay>
      </div>
    </Form>
  );
};
