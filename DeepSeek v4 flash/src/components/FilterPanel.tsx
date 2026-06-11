import { useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useFilters } from '../contexts/FilterContext';
import type { FilterOptions } from '../types';

interface FilterPanelProps {
  availableOptions: FilterOptions;
}

interface SectionProps {
  $open: boolean;
}

const Panel = styled.aside`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.5rem;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.emeraldGreen};
  border-radius: 999px;
  line-height: 1;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.emeraldGreen};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[800]};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
    border-radius: 0.125rem;
  }
`;

const Section = styled.div`
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const SectionHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[800]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: left;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[900]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
    border-radius: 0.125rem;
  }
`;

const Chevron = styled.span<SectionProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  transition: transform ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.neutral[500]};

  ${({ $open }) =>
    $open
      ? css`
          transform: rotate(180deg);
        `
      : css`
          transform: rotate(0deg);
        `}
`;

const SectionContent = styled.div<SectionProps>`
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.transitions.base},
    opacity ${({ theme }) => theme.transitions.base};
  max-height: ${({ $open }) => ($open ? '1000px' : '0')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} 0;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[900]};
  }
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 0.25rem;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  transition: border-color ${({ theme }) => theme.transitions.fast},
    background-color ${({ theme }) => theme.transitions.fast};

  &:checked {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    background-color: ${({ theme }) => theme.colors.emeraldGreen};
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.375rem;
    height: 0.625rem;
    border: solid ${({ theme }) => theme.colors.white};
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -60%) rotate(45deg);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const CheckboxText = styled.span`
  user-select: none;
`;

const PriceInputs = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const PriceInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: 0.375rem;
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.emeraldGreen}33;
  }
`;

const PriceSeparator = styled.span`
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex-shrink: 0;
`;

export default function FilterPanel({ availableOptions }: FilterPanelProps) {
  const { t } = useTranslation();
  const {
    filters,
    setBrandFilter,
    setPriceRange,
    setScreenSizes,
    setStorage,
    setRam,
    setProcessors,
    clearFilters,
  } = useFilters();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: true,
    priceRange: true,
    screenSize: true,
    storage: true,
    ram: true,
    processor: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount =
    filters.brands.length +
    filters.screenSizes.length +
    filters.storage.length +
    filters.ram.length +
    filters.processors.length +
    (filters.priceRange.min !== 0 || filters.priceRange.max !== 10000 ? 1 : 0);

  const handleBrandToggle = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    setBrandFilter(next);
  };

  const handleScreenSizeToggle = (size: string) => {
    const next = filters.screenSizes.includes(size)
      ? filters.screenSizes.filter((s) => s !== size)
      : [...filters.screenSizes, size];
    setScreenSizes(next);
  };

  const handleStorageToggle = (value: string) => {
    const next = filters.storage.includes(value)
      ? filters.storage.filter((s) => s !== value)
      : [...filters.storage, value];
    setStorage(next);
  };

  const handleRamToggle = (value: string) => {
    const next = filters.ram.includes(value)
      ? filters.ram.filter((r) => r !== value)
      : [...filters.ram, value];
    setRam(next);
  };

  const handleProcessorToggle = (value: string) => {
    const next = filters.processors.includes(value)
      ? filters.processors.filter((p) => p !== value)
      : [...filters.processors, value];
    setProcessors(next);
  };

  const handleMinPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    setPriceRange({ ...filters.priceRange, min: value });
  };

  const handleMaxPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    setPriceRange({ ...filters.priceRange, max: value });
  };

  return (
    <Panel>
      <HeaderRow>
        <TitleGroup>
          <Title>{t('filterPanel.title', 'Filters')}</Title>
          {activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
        </TitleGroup>
        {activeFilterCount > 0 && (
          <ClearButton onClick={clearFilters} type="button">
            {t('filterPanel.clearAll', 'Clear All Filters')}
          </ClearButton>
        )}
      </HeaderRow>

      <Section>
        <SectionHeader
          type="button"
          onClick={() => toggleSection('brand')}
          aria-expanded={openSections.brand}
        >
          {t('filterPanel.brand', 'Brand')}
          <Chevron $open={openSections.brand} aria-hidden>▲</Chevron>
        </SectionHeader>
        <SectionContent $open={openSections.brand}>
          {availableOptions.brands.map((brand) => (
            <CheckboxLabel key={brand}>
              <CheckboxInput
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
              />
              <CheckboxText>{brand}</CheckboxText>
            </CheckboxLabel>
          ))}
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader
          type="button"
          onClick={() => toggleSection('priceRange')}
          aria-expanded={openSections.priceRange}
        >
          {t('filterPanel.priceRange', 'Price Range')}
          <Chevron $open={openSections.priceRange} aria-hidden>▲</Chevron>
        </SectionHeader>
        <SectionContent $open={openSections.priceRange}>
          <PriceInputs>
            <PriceInput
              type="number"
              min={0}
              placeholder={t('filterPanel.min', 'Min')}
              value={filters.priceRange.min}
              onChange={handleMinPrice}
              aria-label={t('filterPanel.minPrice', 'Minimum price')}
            />
            <PriceSeparator aria-hidden>-</PriceSeparator>
            <PriceInput
              type="number"
              min={0}
              placeholder={t('filterPanel.max', 'Max')}
              value={filters.priceRange.max}
              onChange={handleMaxPrice}
              aria-label={t('filterPanel.maxPrice', 'Maximum price')}
            />
          </PriceInputs>
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader
          type="button"
          onClick={() => toggleSection('screenSize')}
          aria-expanded={openSections.screenSize}
        >
          {t('filterPanel.screenSize', 'Screen Size')}
          <Chevron $open={openSections.screenSize} aria-hidden>▲</Chevron>
        </SectionHeader>
        <SectionContent $open={openSections.screenSize}>
          {availableOptions.screenSizes.map((size) => (
            <CheckboxLabel key={size}>
              <CheckboxInput
                type="checkbox"
                checked={filters.screenSizes.includes(size)}
                onChange={() => handleScreenSizeToggle(size)}
              />
              <CheckboxText>{size}</CheckboxText>
            </CheckboxLabel>
          ))}
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader
          type="button"
          onClick={() => toggleSection('storage')}
          aria-expanded={openSections.storage}
        >
          {t('filterPanel.storage', 'Storage')}
          <Chevron $open={openSections.storage} aria-hidden>▲</Chevron>
        </SectionHeader>
        <SectionContent $open={openSections.storage}>
          {availableOptions.storage.map((value) => (
            <CheckboxLabel key={value}>
              <CheckboxInput
                type="checkbox"
                checked={filters.storage.includes(value)}
                onChange={() => handleStorageToggle(value)}
              />
              <CheckboxText>{value}</CheckboxText>
            </CheckboxLabel>
          ))}
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader
          type="button"
          onClick={() => toggleSection('ram')}
          aria-expanded={openSections.ram}
        >
          {t('filterPanel.ram', 'RAM')}
          <Chevron $open={openSections.ram} aria-hidden>▲</Chevron>
        </SectionHeader>
        <SectionContent $open={openSections.ram}>
          {availableOptions.ram.map((value) => (
            <CheckboxLabel key={value}>
              <CheckboxInput
                type="checkbox"
                checked={filters.ram.includes(value)}
                onChange={() => handleRamToggle(value)}
              />
              <CheckboxText>{value}</CheckboxText>
            </CheckboxLabel>
          ))}
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader
          type="button"
          onClick={() => toggleSection('processor')}
          aria-expanded={openSections.processor}
        >
          {t('filterPanel.processor', 'Processor')}
          <Chevron $open={openSections.processor} aria-hidden>▲</Chevron>
        </SectionHeader>
        <SectionContent $open={openSections.processor}>
          {availableOptions.processors.map((value) => (
            <CheckboxLabel key={value}>
              <CheckboxInput
                type="checkbox"
                checked={filters.processors.includes(value)}
                onChange={() => handleProcessorToggle(value)}
              />
              <CheckboxText>{value}</CheckboxText>
            </CheckboxLabel>
          ))}
        </SectionContent>
      </Section>
    </Panel>
  );
}

export type { FilterPanelProps };
