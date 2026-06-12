import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactInfoSchema, ContactInfoFormData } from '../../utils/validations';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input } from '../Input';

interface ContactInfoFormProps {
  onSubmit: (data: ContactInfoFormData) => void;
  initialData?: Partial<ContactInfoFormData>;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ContactInfoForm = ({ onSubmit, initialData }: ContactInfoFormProps) => {
  const { language } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: initialData,
  });

  const t = (key: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      contactInfo: { en: 'Contact Information', ar: 'معلومات الاتصال' },
      email: { en: 'Email Address', ar: 'البريد الإلكتروني' },
      phone: { en: 'Phone Number', ar: 'رقم الهاتف' },
    };
    return translations[key]?.[language as 'en' | 'ar'] || key;
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>{t('contactInfo')}</FormTitle>
      
      <Input
        label={t('email')}
        variant="email"
        error={errors.email?.message}
        placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
        {...register('email')}
      />

      <Input
        label={t('phone')}
        variant="tel"
        error={errors.phone?.message}
        placeholder={language === 'ar' ? '+966XXXXXXXXX' : '+966XXXXXXXXX'}
        {...register('phone')}
      />
    </Form>
  );
};
