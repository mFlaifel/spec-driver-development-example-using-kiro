import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useFilters } from '../contexts/FilterContext';
import Input from './Input';

interface SearchBarProps {
  placeholder?: string;
}

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  pointer-events: none;
  z-index: 1;
`;

export default function SearchBar({ placeholder }: SearchBarProps) {
  const { t } = useTranslation('products');
  const { setSearchTerm } = useFilters();
  const [value, setValue] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSetSearchTerm = useCallback(
    (term: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setSearchTerm(term);
      }, 300);
    },
    [setSearchTerm],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSetSearchTerm(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setValue('');
      setSearchTerm('');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  return (
    <SearchWrapper>
      <SearchIcon aria-hidden="true">🔍</SearchIcon>
      <Input
        type="search"
        placeholder={placeholder || t('filters.search')}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label={t('filters.search')}
        style={{ paddingLeft: '2.5rem' }}
      />
    </SearchWrapper>
  );
}
