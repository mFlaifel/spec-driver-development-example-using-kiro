import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';

const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.darkNavy};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-height: 44px;
  min-width: 44px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    background-color: ${({ theme }) => theme.colors.gray50};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const LanguageLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <SwitcherButton
      onClick={toggleLanguage}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      role="button"
    >
      <LanguageLabel>{language === 'en' ? 'EN' : 'AR'}</LanguageLabel>
      <span>|</span>
      <LanguageLabel>{language === 'en' ? 'عربي' : 'EN'}</LanguageLabel>
    </SwitcherButton>
  );
};
