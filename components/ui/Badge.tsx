'use client';

/**
 * Badge Component
 * Color variants, sizes, and icon support
 */

import React, { HTMLAttributes, ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function Badge({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  children,
  ...props
}: BadgeProps) {
  // Base classes
  const baseClasses = [
    'inline-flex',
    'items-center',
    'font-medium',
    'rounded-medium',
    'transition-smooth',
  ];

  // Variant classes - Dark Theme with Vibrant Accents
  const variantClasses = {
    primary: [
      'bg-gradient-primary',
      'text-white',
      'shadow-elevation-1',
      'hover:shadow-elevation-2',
    ],
    secondary: [
      'bg-accent-cyan',
      'text-base-charcoal',
      'shadow-elevation-1',
      'hover:glow-cyan-hover',
    ],
    success: [
      'bg-accent-emerald',
      'text-base-charcoal',
      'shadow-elevation-1',
      'hover:glow-emerald-hover',
    ],
    warning: [
      'bg-warning',
      'text-base-charcoal',
      'shadow-elevation-1',
      'hover:glow-warning',
    ],
    error: [
      'bg-error',
      'text-white',
      'shadow-elevation-1',
      'hover:glow-error',
    ],
    info: [
      'bg-accent-cyan',
      'text-base-charcoal',
      'shadow-elevation-1',
      'hover:glow-cyan-hover',
    ],
    neutral: [
      'bg-base-dark-border',
      'text-text-secondary',
      'border',
      'border-base-dark-border',
    ],
  };

  // Size classes
  const sizeClasses = {
    sm: ['text-tiny', 'px-2', 'py-0.5', 'gap-1'],
    md: ['text-small', 'px-3', 'py-1', 'gap-1.5'],
    lg: ['text-body', 'px-4', 'py-1.5', 'gap-2'],
  };

  // Combine classes
  const classes = [
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0 flex items-center">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0 flex items-center">{icon}</span>
      )}
    </span>
  );
}

// ============================================================================
// Convenience Components
// ============================================================================

export function PrimaryBadge({
  children,
  ...props
}: Omit<BadgeProps, 'variant'>) {
  return (
    <Badge variant="primary" {...props}>
      {children}
    </Badge>
  );
}

export function SuccessBadge({
  children,
  ...props
}: Omit<BadgeProps, 'variant'>) {
  return (
    <Badge variant="success" {...props}>
      {children}
    </Badge>
  );
}

export function WarningBadge({
  children,
  ...props
}: Omit<BadgeProps, 'variant'>) {
  return (
    <Badge variant="warning" {...props}>
      {children}
    </Badge>
  );
}

export function ErrorBadge({
  children,
  ...props
}: Omit<BadgeProps, 'variant'>) {
  return (
    <Badge variant="error" {...props}>
      {children}
    </Badge>
  );
}

export function InfoBadge({
  children,
  ...props
}: Omit<BadgeProps, 'variant'>) {
  return (
    <Badge variant="info" {...props}>
      {children}
    </Badge>
  );
}

