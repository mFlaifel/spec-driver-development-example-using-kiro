import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Button from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorTitle?: string;
  errorMessage?: string;
  reloadLabel?: string;
  goHomeLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  max-width: 480px;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container role="alert">
          <Title>{this.props.errorTitle ?? 'Something went wrong'}</Title>
          <Message>
            {this.props.errorMessage ??
              'An unexpected error occurred. Please try reloading the page.'}
          </Message>
          <Actions>
            <Button variant="primary" onClick={this.handleReload}>
              {this.props.reloadLabel ?? 'Reload Page'}
            </Button>
            <Button variant="outline" onClick={this.handleGoHome}>
              {this.props.goHomeLabel ?? 'Go Home'}
            </Button>
          </Actions>
        </Container>
      );
    }

    return this.props.children;
  }
}

function ErrorBoundaryWithTranslation({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { t } = useTranslation(['errors', 'common']);

  return (
    <ErrorBoundary
      fallback={fallback}
      errorTitle={t('errors.somethingWentWrong')}
      errorMessage={t('errors.somethingWentWrong', {
        defaultValue: 'An unexpected error occurred. Please try reloading the page.',
      })}
      reloadLabel={t('buttons.reloadPage')}
      goHomeLabel={t('buttons.goHome')}
    >
      {children}
    </ErrorBoundary>
  );
}

export { ErrorBoundary, ErrorBoundaryWithTranslation };
export default ErrorBoundaryWithTranslation;
