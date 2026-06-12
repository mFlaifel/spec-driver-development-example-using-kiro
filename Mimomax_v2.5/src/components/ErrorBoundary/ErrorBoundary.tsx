import { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.darkNavy};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-height: 44px;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.emeraldGreen};
    outline-offset: 2px;
  }
`;

const PrimaryButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.emeraldGreen};
  color: ${({ theme }) => theme.colors.white};
  border: none;

  &:hover {
    background-color: #059669;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.darkNavy};
  border: 1px solid ${({ theme }) => theme.colors.gray300};

  &:hover {
    border-color: ${({ theme }) => theme.colors.darkNavy};
  }
`;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something went wrong. Please try again or go back to the home page.
          </ErrorMessage>
          <ButtonGroup>
            <PrimaryButton onClick={this.handleReload}>
              Reload Page
            </PrimaryButton>
            <SecondaryButton onClick={this.handleGoHome}>
              Go Home
            </SecondaryButton>
          </ButtonGroup>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}
