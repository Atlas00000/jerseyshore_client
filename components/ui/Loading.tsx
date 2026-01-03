'use client';

/**
 * Loading Components
 * Spinner, Skeleton, and Progress bar
 */

import React, { HTMLAttributes } from 'react';

// ============================================================================
// Types
// ============================================================================

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  color?: string;
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: boolean;
  lines?: number;
}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// Spinner Component
// ============================================================================

export function Spinner({
  size = 'md',
  color = 'text-accent-cyan',
  className = '',
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`inline-block ${sizeClasses[size]} ${className}`}
      {...props}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={`animate-spin ${color}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================================================
// Skeleton Component
// ============================================================================

export function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = false,
  lines = 1,
  className = '',
  ...props
}: SkeletonProps) {
  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`animate-shimmer bg-base-charcoal-gray ${
              rounded ? 'rounded-medium' : 'rounded-small'
            }`}
            style={{
              width: index === lines - 1 ? '80%' : width,
              height,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`animate-shimmer bg-base-charcoal-gray ${
        rounded ? 'rounded-medium' : 'rounded-small'
      } ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
}

// ============================================================================
// Progress Bar Component
// ============================================================================

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = 'primary',
  size = 'md',
  className = '',
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-gradient-primary',
    success: 'bg-accent-emerald',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-small text-text-secondary">Progress</span>
          <span className="text-small font-medium text-text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-base-charcoal-gray rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${Math.round(percentage)}% complete`}
      >
        <div
          className={`${colorClasses[color]} h-full transition-all duration-slow ease-out rounded-full ${
            color === 'primary' ? 'glow-primary' : color === 'success' ? 'glow-emerald' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Loading Overlay Component
// ============================================================================

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  children: React.ReactNode;
  spinner?: boolean;
  backdrop?: boolean;
}

export function LoadingOverlay({
  isLoading,
  children,
  spinner = true,
  backdrop = true,
  className = '',
  ...props
}: LoadingOverlayProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`} {...props}>
      {children}
      {backdrop && (
        <div className="absolute inset-0 glass-accent flex items-center justify-center z-10 rounded-medium" />
      )}
      {spinner && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
}

