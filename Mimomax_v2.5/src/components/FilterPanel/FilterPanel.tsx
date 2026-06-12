import styled from 'styled-components';
import { useState, useCallback } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const PanelContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PanelTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const ClearButton = styled.button`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.emeraldGreen};
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const SectionContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.button<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  background: none;
  border: none;
  cursor: pointer;
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.darkNavy};
`;

const ChevronIcon = styled.span<{ isOpen: boolean }>`
  transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
  transition: transform ${({ theme }) => theme.transitions.fast};
`;

const SectionContent = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  padding-top: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.darkNavy};
  }
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.emeraldGreen};
  cursor: pointer;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RangeInput = styled.input`
  width: 100%;
  accent-color: ${({ theme }) => theme.colors.emeraldGreen};
  cursor: pointer;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray600};
`;

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SectionContainer>
      <SectionHeader
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <SectionTitle>{title}</SectionTitle>
        <ChevronIcon isOpen={isOpen}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </ChevronIcon>
      </SectionHeader>
      <SectionContent isOpen={isOpen}>{children}</SectionContent>
    </SectionContainer>
  );
};

export const FilterPanel = () => {
  const {
    filters,
    availableOptions,
    setBrands,
    setScreenSizes,
    setStorage,
    setRam,
    setProcessors,
    setPriceRange,
    clearFilters,
    activeFilterCount,
  } = useFilters();
  const { language } = useLanguage();

  const handleCheckboxChange = useCallback(
    (value: string, currentValues: string[], setter: (values: string[]) => void) => {
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      setter(newValues);
    },
    []
  );

  const handlePriceChange = useCallback(
    (type: 'min' | 'max', value: number) => {
      setPriceRange({
        ...filters.priceRange,
        [type]: value,
      });
    },
    [filters.priceRange, setPriceRange]
  );

  const t = (key: string) => {
    const translations: Record<string, { en: string; ar: string }> = {
      filters: { en: 'Filters', ar: 'الفلاتر' },
      clearAll: { en: 'Clear All', ar: 'مسح الكل' },
      brand: { en: 'Brand', ar: 'العلامة التجارية' },
      priceRange: { en: 'Price Range', ar: 'نطاق السعر' },
      screenSize: { en: 'Screen Size', ar: 'حجم الشاشة' },
      storage: { en: 'Storage', ar: 'التخزين' },
      ram: { en: 'RAM', ar: 'الذاكرة العشوائية' },
      processor: { en: 'Processor', ar: 'المعالج' },
      min: { en: 'Min', ar: 'الحد الأدنى' },
      max: { en: 'Max', ar: 'الحد الأقصى' },
    };
    return translations[key]?.[language as 'en' | 'ar'] || key;
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>
          {t('filters')}
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </PanelTitle>
        {activeFilterCount > 0 && (
          <ClearButton onClick={clearFilters}>{t('clearAll')}</ClearButton>
        )}
      </PanelHeader>

      <FilterSection title={t('brand')}>
        <CheckboxGroup>
          {availableOptions.brands.map((brand) => (
            <CheckboxLabel key={brand}>
              <CheckboxInput
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleCheckboxChange(brand, filters.brands, setBrands)}
              />
              {brand}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection title={t('priceRange')}>
        <RangeContainer>
          <RangeInput
            type="range"
            min={availableOptions.priceRange.min}
            max={availableOptions.priceRange.max}
            value={filters.priceRange.max === Infinity ? availableOptions.priceRange.max : filters.priceRange.max}
            onChange={(e) => handlePriceChange('max', Number(e.target.value))}
          />
          <RangeLabels>
            <span>{t('min')}: {filters.priceRange.min}</span>
            <span>{t('max')}: {filters.priceRange.max === Infinity ? availableOptions.priceRange.max : filters.priceRange.max}</span>
          </RangeLabels>
        </RangeContainer>
      </FilterSection>

      <FilterSection title={t('screenSize')}>
        <CheckboxGroup>
          {availableOptions.screenSizes?.map((size) => (
            <CheckboxLabel key={size}>
              <CheckboxInput
                type="checkbox"
                checked={filters.screenSizes.includes(size)}
                onChange={() => handleCheckboxChange(size, filters.screenSizes, setScreenSizes)}
              />
              {size}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection title={t('storage')}>
        <CheckboxGroup>
          {availableOptions.storage?.map((storage) => (
            <CheckboxLabel key={storage}>
              <CheckboxInput
                type="checkbox"
                checked={filters.storage.includes(storage)}
                onChange={() => handleCheckboxChange(storage, filters.storage, setStorage)}
              />
              {storage}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection title={t('ram')}>
        <CheckboxGroup>
          {availableOptions.ram?.map((ram) => (
            <CheckboxLabel key={ram}>
              <CheckboxInput
                type="checkbox"
                checked={filters.ram.includes(ram)}
                onChange={() => handleCheckboxChange(ram, filters.ram, setRam)}
              />
              {ram}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection title={t('processor')}>
        <CheckboxGroup>
          {availableOptions.processors?.map((processor) => (
            <CheckboxLabel key={processor}>
              <CheckboxInput
                type="checkbox"
                checked={filters.processors.includes(processor)}
                onChange={() => handleCheckboxChange(processor, filters.processors, setProcessors)}
              />
              {processor}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </FilterSection>
    </PanelContainer>
  );
};
