'use client';

/**
 * Button Component
 * Primary, Secondary, and Ghost button variants with animations
 */

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { HoverScale } from '@/lib/animations/framerMotion';
import { useIsMobile } from '@/hooks/useMediaQuery';

// ============================================================================
// Types
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isMobile = useIsMobile();

  // Base classes
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-medium',
    'transition-smooth',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-40',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
    'touch-manipulation', // Improve touch responsiveness
    isMobile && 'min-h-[44px]', // Minimum touch target size on mobile
  ];

  // Variant classes - Electric Accent Colors with Glow
  const variantClasses = {
    primary: [
      'bg-gradient-primary',
      'text-white',
      'shadow-elevation-2',
      'hover:shadow-elevation-3',
      'hover:glow-primary-hover',
      'focus:ring-2',
      'focus:ring-accent-cyan',
      'focus:ring-offset-2',
      'focus:ring-offset-base-charcoal',
      'active:scale-[0.98]',
      'active:glow-primary',
      'hover:scale-[1.02]',
    ],
    secondary: [
      'bg-transparent',
      'border-2',
      'border-accent-cyan',
      'text-accent-cyan',
      'hover:bg-accent-cyan',
      'hover:text-base-charcoal',
      'hover:glow-cyan-hover',
      'focus:ring-2',
      'focus:ring-accent-cyan',
      'focus:ring-offset-2',
      'focus:ring-offset-base-charcoal',
      'active:scale-[0.98]',
      'active:glow-cyan',
    ],
    ghost: [
      'bg-transparent',
      'text-text-secondary',
      'hover:bg-base-charcoal-gray',
      'hover:text-text-primary',
      'hover:border-accent-cyan/30',
      'border-2',
      'border-transparent',
      'focus:ring-2',
      'focus:ring-accent-cyan',
      'focus:ring-offset-2',
      'focus:ring-offset-base-charcoal',
      'active:scale-[0.98]',
    ],
  };

  // Size classes - enhanced for mobile touch targets
  const sizeClasses = {
    sm: isMobile
      ? ['text-small', 'px-4', 'py-2.5', 'gap-2', 'min-h-[44px]'] // Touch-friendly on mobile
      : ['text-small', 'px-3', 'py-1.5', 'gap-2'],
    md: isMobile
      ? ['text-body', 'px-5', 'py-3', 'gap-2', 'min-h-[44px]'] // Touch-friendly on mobile
      : ['text-body', 'px-4', 'py-2', 'gap-2'],
    lg: isMobile
      ? ['text-body-large', 'px-6', 'py-3.5', 'gap-3', 'min-h-[48px]'] // Larger on mobile
      : ['text-body-large', 'px-6', 'py-3', 'gap-3'],
  };

  // Combine all classes
  const classes = [
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
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
  );

  const buttonContent = (
    <>
      {loading && (
        <span className="absolute">
          <LoadingSpinner />
        </span>
      )}
      <span className={loading ? 'opacity-0' : 'inline-flex items-center gap-2'}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>
    </>
  );

  // For primary variant, wrap in HoverScale for better animation
  if (variant === 'primary' && !isDisabled) {
    return (
      <HoverScale scale={1.02} className={fullWidth ? 'w-full' : ''}>
        <button
          className={classes}
          disabled={isDisabled}
          {...props}
        >
          {buttonContent}
        </button>
      </HoverScale>
    );
  }

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {buttonContent}
    </button>
  );
}

// ============================================================================
// Convenience Components
// ============================================================================

export function PrimaryButton({
  children,
  ...props
}: Omit<ButtonProps, 'variant'>) {
  return (
    <Button variant="primary" {...props}>
      {children}
    </Button>
  );
}

export function SecondaryButton({
  children,
  ...props
}: Omit<ButtonProps, 'variant'>) {
  return (
    <Button variant="secondary" {...props}>
      {children}
    </Button>
  );
}

export function GhostButton({
  children,
  ...props
}: Omit<ButtonProps, 'variant'>) {
  return (
    <Button variant="ghost" {...props}>
      {children}
    </Button>
  );
}

