import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.darkNavy};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gray300};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.emeraldGreen};
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: ${({ theme }) => theme.spacing.xl} auto 0;
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const Footer = () => {
  const { language } = useLanguage();

  const currentYear = new Date().getFullYear();

  const companyInfo = {
    name: language === 'ar' ? 'ميموماكس' : 'Mimomax',
    description: language === 'ar'
      ? 'متجرك المفضل للأجهزة اللوحية الفاخرة في منطقة الشرق الأوسط وشمال أفريقيا'
      : 'Your premium destination for tablets in the MENA region',
  };

  const quickLinks = [
    { path: '/', label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/products', label: language === 'ar' ? 'المنتجات' : 'Products' },
    { path: '/about', label: language === 'ar' ? 'من نحن' : 'About' },
    { path: '/contact', label: language === 'ar' ? 'اتصل بنا' : 'Contact' },
  ];

  const supportLinks = [
    { path: '/privacy', label: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' },
    { path: '/terms', label: language === 'ar' ? 'شروط الخدمة' : 'Terms of Service' },
    { path: '/faq', label: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ' },
    { path: '/shipping', label: language === 'ar' ? 'الشحن والتوصيل' : 'Shipping & Delivery' },
  ];

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>{companyInfo.name}</FooterTitle>
          <FooterText>{companyInfo.description}</FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>
            {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
          </FooterTitle>
          {quickLinks.map((link) => (
            <FooterLink key={link.path} to={link.path}>
              {link.label}
            </FooterLink>
          ))}
        </FooterSection>

        <FooterSection>
          <FooterTitle>
            {language === 'ar' ? 'الدعم' : 'Support'}
          </FooterTitle>
          {supportLinks.map((link) => (
            <FooterLink key={link.path} to={link.path}>
              {link.label}
            </FooterLink>
          ))}
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {currentYear} {companyInfo.name}. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
      </Copyright>
    </FooterContainer>
  );
};
