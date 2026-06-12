import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { CountryCode } from '../../types';
import { useLocation } from '../../contexts/LocationContext';
import { useLanguage } from '../../contexts/LanguageContext';

const SelectorContainer = styled.div`
  position: relative;
`;

const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.darkNavy};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-height: 44px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 100;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  max-height: 300px;
  overflow-y: auto;
`;

const CountryOption = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: -2px;
  }
`;

const Flag = styled.span`
  font-size: 20px;
`;

const CountryName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const countries: { code: CountryCode; name: string; nameAr: string; flag: string }[] = [
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', flag: '🇴🇲' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿' },
];

export const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { country, setCountry } = useLocation();
  const { language } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCountry = countries.find((c) => c.code === country);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CountryCode) => {
    setCountry(code);
    setIsOpen(false);
  };

  return (
    <SelectorContainer ref={dropdownRef}>
      <SelectorButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label={language === 'ar' ? 'اختر الدولة' : 'Select country'}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Flag>{currentCountry?.flag}</Flag>
        <CountryName>
          {language === 'ar' ? currentCountry?.nameAr : currentCountry?.name}
        </CountryName>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </SelectorButton>
      <Dropdown isOpen={isOpen} role="listbox">
        {countries.map((c) => (
          <CountryOption
            key={c.code}
            onClick={() => handleSelect(c.code)}
            role="option"
            aria-selected={c.code === country}
          >
            <Flag>{c.flag}</Flag>
            <CountryName>{language === 'ar' ? c.nameAr : c.name}</CountryName>
          </CountryOption>
        ))}
      </Dropdown>
    </SelectorContainer>
  );
};
