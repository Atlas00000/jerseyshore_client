/**
 * LazyLoader Component
 * Wrapper for lazy-loaded components with Suspense and error boundary
 */

'use client';

import { Suspense, Component, ReactNode, ErrorInfo } from 'react';
import { motion } from 'framer-motion';

interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

interface LazyLoaderState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Default Loading Fallback
 * Minimal loading state for lazy components
 */
function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <p className="text-small text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Default Error Fallback
 * Error state for failed lazy component loads
 */
function DefaultErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-error text-h3 mb-2">⚠️</div>
        <p className="text-body text-text-primary mb-1">Failed to load component</p>
        {error && (
          <p className="text-small text-text-tertiary">{error.message}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Error Boundary for Lazy Components
 */
class LazyErrorBoundary extends Component<
  { children: ReactNode; errorFallback?: ReactNode },
  LazyLoaderState
> {
  constructor(props: { children: ReactNode; errorFallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): LazyLoaderState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LazyLoader Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.errorFallback || (
        <DefaultErrorFallback error={this.state.error} />
      );
    }

    return this.props.children;
  }
}

/**
 * LazyLoader Component
 * Wraps lazy-loaded components with Suspense and error boundary
 */
export function LazyLoader({
  children,
  fallback,
  errorFallback,
}: LazyLoaderProps) {
  return (
    <LazyErrorBoundary errorFallback={errorFallback}>
      <Suspense fallback={fallback || <DefaultLoadingFallback />}>
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
}

