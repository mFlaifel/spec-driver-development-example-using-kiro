import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.darkNavy};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => `${theme.spacing['2xl']} ${theme.spacing.md}`};
  margin-top: auto;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Section = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Brand = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[400]};
  line-height: 1.6;
`;

const LinksHeading = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const LinksList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LinkItem = styled.li`
  margin: 0;
`;

const StyledLink = styled.a`
  color: ${({ theme }) => theme.colors.neutral[400]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: color ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const Copyright = styled.p`
  margin: ${({ theme }) => theme.spacing.xl} 0 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-align: center;
  width: 100%;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[700]};
  margin: ${({ theme }) => theme.spacing.xl} 0 0;
  width: 100%;
`;

function Footer() {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <FooterWrapper dir={direction}>
      <Container>
        <Section>
          <Brand>{t('app.name')}</Brand>
          <Description>{t('app.tagline')}</Description>
        </Section>

        <Section>
          <LinksHeading>{t('nav.about')}</LinksHeading>
          <LinksList>
            <LinkItem>
              <StyledLink href="/about">{t('nav.about')}</StyledLink>
            </LinkItem>
            <LinkItem>
              <StyledLink href="/contact">{t('nav.contact')}</StyledLink>
            </LinkItem>
          </LinksList>
        </Section>

        <Section>
          <LinksHeading>{t('nav.contact')}</LinksHeading>
          <LinksList>
            <LinkItem>
              <StyledLink href="/contact">{t('nav.contact')}</StyledLink>
            </LinkItem>
          </LinksList>
        </Section>

        <Section>
          <LinksHeading>{t('footer.privacyPolicy')}</LinksHeading>
          <LinksList>
            <LinkItem>
              <StyledLink href="/privacy">{t('footer.privacyPolicy')}</StyledLink>
            </LinkItem>
            <LinkItem>
              <StyledLink href="/terms">{t('footer.termsOfService')}</StyledLink>
            </LinkItem>
          </LinksList>
        </Section>

        <Divider />

        <Copyright>{t('footer.copyright', { year })}</Copyright>
      </Container>
    </FooterWrapper>
  );
}

export default Footer;
