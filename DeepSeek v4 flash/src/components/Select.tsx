import styled from 'styled-components';
import type { Theme } from '../utils/theme';

interface SelectOption {
  value: string;
  label: string;
  labelAr?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label<{ $error?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.english};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $error }) =>
    $error ? theme.colors.semantic.error : theme.colors.neutral[700]};
  transition: color ${({ theme }) => theme.transitions.fast};
`;

const StyledSelect = styled.select<{ $error?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.typography.fontFamily.english};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid
    ${({ theme, $error }) =>
      $error ? theme.colors.semantic.error : theme.colors.neutral[300]};
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.sm} center;
  padding-right: ${({ theme }) => `calc(${theme.spacing.md} + 16px)`};

  &:focus {
    border-color: ${({ theme }) => theme.colors.emeraldGreen};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.emeraldGreen}33`};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, $error }) =>
      $error ? theme.colors.semantic.error : theme.colors.neutral[400]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const ErrorMessage = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.english};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.semantic.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  disabled = false,
  placeholder,
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <Wrapper>
      {label && (
        <Label htmlFor="select-input" $error={!!error}>
          {label}
        </Label>
      )}
      <StyledSelect
        id="select-input"
        role="combobox"
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={error ? 'select-error' : undefined}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        $error={!!error}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.labelAr ? `${option.label} / ${option.labelAr}` : option.label}
          </option>
        ))}
      </StyledSelect>
      {error && <ErrorMessage id="select-error">{error}</ErrorMessage>}
    </Wrapper>
  );
}

export default Select;
