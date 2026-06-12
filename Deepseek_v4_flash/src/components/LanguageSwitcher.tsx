import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const ToggleWrapper = styled.button<{ $isRtl: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme }) => theme.colors.neutral[800]};
  border: 2px solid ${({ theme }) => theme.colors.neutral[700]};
  border-radius: 2rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  position: relative;
  min-width: 64px;
  height: 36px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const Slider = styled.span<{ $isActive: boolean; $isRtl: boolean }>`
  position: absolute;
  top: 3px;
  width: 28px;
  height: 26px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.emeraldGreen};
  transition: ${({ theme }) => theme.transitions.base};
  ${({ $isRtl, $isActive }) =>
    $isRtl
      ? $isActive
        ? 'right: 3px;'
        : 'left: 3px;'
      : $isActive
        ? 'right: 3px;'
        : 'left: 3px;'}
`;

const Label = styled.span<{ $active: boolean; $isRtl: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.english};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.white : theme.colors.neutral[500]};
  transition: ${({ theme }) => theme.transitions.fast};
  z-index: 1;
  position: relative;
  user-select: none;
`;

export default function LanguageSwitcher() {
  const { language, direction, changeLanguage } = useLanguage();
  const isRtl = direction === 'rtl';
  const isEnglish = language === 'en';

  const toggleLanguage = () => {
    changeLanguage(isEnglish ? 'ar' : 'en');
  };

  const nextLang = isEnglish ? 'Arabic' : 'English';

  return (
    <ToggleWrapper
      onClick={toggleLanguage}
      role="button"
      aria-label={`Switch to ${nextLang}. Current language: ${isEnglish ? 'English' : 'Arabic'}`}
      $isRtl={isRtl}
    >
      <Slider $isActive={!isEnglish} $isRtl={isRtl} />
      <Label $active={isEnglish} $isRtl={isRtl}>EN</Label>
      <Label $active={!isEnglish} $isRtl={isRtl}>AR</Label>
    </ToggleWrapper>
  );
}
