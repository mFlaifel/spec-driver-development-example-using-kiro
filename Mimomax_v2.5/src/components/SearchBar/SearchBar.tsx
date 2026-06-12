import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import { useLanguage } from '../../contexts/LanguageContext';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.gray600};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing['2xl']};
  padding-right: ${({ theme }) => theme.spacing['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.darkNavy};
  background-color: ${({ theme }) => theme.colors.white};
  transition: border-color ${({ theme }) => theme.transitions.fast},
              box-shadow ${({ theme }) => theme.transitions.fast};
  min-height: 44px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray300};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray600};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
  }
`;

export const SearchBar = () => {
  const { filters, setSearch } = useFilters();
  const { language } = useLanguage();
  const [localValue, setLocalValue] = useState(filters.searchTerm);

  const placeholder = language === 'ar' ? 'بحث عن أجهزة لوحية...' : 'Search tablets...';

  useEffect(() => {
    setLocalValue(filters.searchTerm);
  }, [filters.searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(localValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localValue, setSearch]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    setSearch('');
  }, [setSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        handleClear();
      }
    },
    [handleClear]
  );

  return (
    <SearchContainer role="search" aria-label={placeholder}>
      <SearchInputWrapper>
        <SearchIcon>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </SearchIcon>
        <StyledInput
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        {localValue && (
          <ClearButton onClick={handleClear} aria-label="Clear search">
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </ClearButton>
        )}
      </SearchInputWrapper>
    </SearchContainer>
  );
};
