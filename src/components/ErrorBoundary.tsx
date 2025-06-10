"use client";

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ErrorBoundaryState, AppError } from '@/types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  private errorId: string;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.errorId = '';
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.errorId = this.generateErrorId();

    const appError: AppError = {
      code: 'COMPONENT_ERROR',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    };

    // Log error for monitoring
    this.logError(appError);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logError(error: AppError): void {
    // In a real app, send to monitoring service (Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught an error:', error);

    // Store in localStorage for debugging
    try {
      const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
      errorLog.push(error);
      // Keep only last 10 errors
      if (errorLog.length > 10) {
        errorLog.shift();
      }
      localStorage.setItem('errorLog', JSON.stringify(errorLog));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Something went wrong
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error ID for support */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Error ID:</span>
                  <Badge variant="outline" className="font-mono">
                    {this.errorId}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Please include this ID when contacting support.
                </p>
              </div>

              {/* Error details (only shown if showDetails is true) */}
              {this.props.showDetails && this.state.error && (
                <details className="bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Technical Details
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <strong className="text-sm">Error:</strong>
                      <pre className="text-xs bg-background p-2 rounded mt-1 overflow-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong className="text-sm">Stack Trace:</strong>
                        <pre className="text-xs bg-background p-2 rounded mt-1 overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Support link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Still having issues?{' '}
                  <a
                    href="mailto:support@miezeer.com"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for handling async errors in functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: string) => {
    const appError: AppError = {
      code: 'ASYNC_ERROR',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    };

    console.error('Async error:', appError);

    // In a real app, send to monitoring service
    // trackError(appError);
  };

  return { handleError };
};

// Error fallback components for specific use cases
export const LoadingErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
    <h3 className="text-lg font-semibold mb-2">Failed to load content</h3>
    <p className="text-muted-foreground mb-4">
      Something went wrong while loading this content.
    </p>
    <Button onClick={onRetry} variant="outline">
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
);

export const NetworkErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="p-3 bg-red-100 rounded-full mb-4">
      <AlertTriangle className="h-8 w-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
    <p className="text-muted-foreground mb-4">
      Please check your internet connection and try again.
    </p>
    <Button onClick={onRetry}>
      <RefreshCw className="h-4 w-4 mr-2" />
      Retry
    </Button>
  </div>
);

export default ErrorBoundary;
