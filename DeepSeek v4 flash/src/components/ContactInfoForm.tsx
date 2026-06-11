import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ContactInfo, CountryCode } from '../types';
import { ValidationService } from '../services/ValidationService';
import { useLanguage } from '../contexts/LanguageContext';
import Input from './Input';

interface ContactInfoFormProps {
  defaultValues?: Partial<ContactInfo>;
  onChange?: (contact: ContactInfo) => void;
  countryCode?: string;
}

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export default function ContactInfoForm({
  defaultValues,
  onChange,
  countryCode = 'SA',
}: ContactInfoFormProps) {
  const { t } = useTranslation('forms');
  const { language } = useLanguage();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ContactInfo>({
    defaultValues: {
      email: '',
      phone: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  useEffect(() => {
    onChange?.(watchedValues);
  }, [watchedValues, onChange]);

  return (
    <FormWrapper>
      <Input
        type="email"
        label={t('forms.email')}
        placeholder={t('forms.placeholders.email')}
        error={errors.email?.message}
        fullWidth
        {...register('email', {
          validate: (value) => {
            const result = ValidationService.validateEmail(value);
            if (result.valid) return true;
            return language === 'ar' ? result.errors[0].messageAr : result.errors[0].message;
          },
        })}
      />
      <Input
        type="tel"
        label={t('forms.phone')}
        placeholder={t('forms.placeholders.phone')}
        error={errors.phone?.message}
        fullWidth
        {...register('phone', {
          validate: (value) => {
            const result = ValidationService.validatePhone(value, countryCode as CountryCode);
            if (result.valid) return true;
            return language === 'ar' ? result.errors[0].messageAr : result.errors[0].message;
          },
        })}
      />
    </FormWrapper>
  );
}

export type { ContactInfoFormProps };
