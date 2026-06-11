import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';
import { addressSchema } from '../utils/validation';
import { ShippingService } from '../services/ShippingService';
import Input from './Input';
import { Select } from './Select';
import type { Address, CountryCode } from '../types';

interface AddressFormProps {
  defaultValues?: Partial<Address>;
  onChange?: (address: Address) => void;
}

const emptyAddress: Address = {
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  countryCode: 'SA',
};

export default function AddressForm({ defaultValues, onChange }: AddressFormProps) {
  const { t } = useTranslation(['forms', 'errors']);
  const { language } = useLanguage();
  const { country, availableCountries, changeCountry } = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<Address>({
    defaultValues: {
      ...emptyAddress,
      ...defaultValues,
      countryCode: defaultValues?.countryCode || country.code,
    },
  });

  const watchedValues = watch();

  const validationResult = addressSchema.safeParse(watchedValues);

  const errors: Partial<Record<keyof Address, string>> = {};
  if (!validationResult.success) {
    for (const issue of validationResult.error.issues) {
      const field = issue.path[0] as keyof Address;
      if (field && !errors[field]) {
        errors[field] =
          language === 'ar'
            ? t('errors:errors.requiredField')
            : issue.message;
      }
    }
  }

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (validationResult.success) {
      onChangeRef.current?.(validationResult.data);
    }
  }, [validationResult.success, validationResult.data]);

  const countryOptions = availableCountries.map((c) => ({
    value: c.code,
    label: c.name,
    labelAr: c.nameAr,
  }));

  const onSubmit = (data: Address) => {
    onChangeRef.current?.(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={t('forms:forms.firstName')}
        placeholder={t('forms:forms.firstName')}
        error={errors.firstName}
        fullWidth
        {...register('firstName')}
      />
      <Input
        label={t('forms:forms.lastName')}
        placeholder={t('forms:forms.lastName')}
        error={errors.lastName}
        fullWidth
        {...register('lastName')}
      />
      <Input
        label={t('forms:forms.addressLine1')}
        placeholder={t('forms:forms.addressLine1')}
        error={errors.addressLine1}
        fullWidth
        {...register('addressLine1')}
      />
      <Input
        label={t('forms:forms.addressLine2')}
        placeholder={t('forms:forms.addressLine2')}
        error={errors.addressLine2}
        fullWidth
        {...register('addressLine2')}
      />
      <Input
        label={t('forms:forms.city')}
        placeholder={t('forms:forms.city')}
        error={errors.city}
        fullWidth
        {...register('city')}
      />
      <Input
        label={t('forms:forms.state')}
        placeholder={t('forms:forms.state')}
        error={errors.state}
        fullWidth
        {...register('state')}
      />
      <Input
        label={t('forms:forms.postalCode')}
        placeholder={t('forms:forms.postalCode')}
        error={errors.postalCode}
        fullWidth
        {...register('postalCode')}
      />
      <Select
        label={t('forms:forms.country')}
        options={countryOptions}
        value={watchedValues.countryCode}
        onChange={(value) => {
          setValue('countryCode', value as CountryCode);
          changeCountry(value as CountryCode);
        }}
        error={errors.countryCode}
      />
    </form>
  );
}
