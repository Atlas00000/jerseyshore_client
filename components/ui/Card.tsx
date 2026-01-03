'use client';

/**
 * Card Component
 * Standard, Elevated, and Glass card variants with animations
 */

import React, { HTMLAttributes, ReactNode } from 'react';
import { HoverScale } from '@/lib/animations/framerMotion';

// ============================================================================
// Types
// ============================================================================

export type CardVariant = 'standard' | 'elevated' | 'glass';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  children: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ============================================================================
// Main Component
// ============================================================================

export function Card({
  variant = 'standard',
  hover = true,
  className = '',
  children,
  ...props
}: CardProps) {
  // Base classes
  const baseClasses = [
    'rounded-medium',
    'transition-smooth',
    'overflow-hidden',
  ];

  // Variant classes - Dark Theme with Vibrant Accents
  const variantClasses = {
    standard: [
      'bg-gradient-surface',
      'border',
      'border-accent-cyan/30',
      'shadow-elevation-2',
      hover && 'hover:shadow-elevation-3 hover:border-accent-cyan/50 hover:glow-cyan-hover',
    ],
    elevated: [
      'bg-base-dark-slate',
      'border',
      'border-accent-magenta/30',
      'shadow-elevation-4',
      'rounded-large',
      hover && 'hover:shadow-elevation-5 hover:border-accent-magenta/50 hover:glow-magenta-hover',
    ],
    glass: [
      'glass-accent',
      'shadow-elevation-2',
      hover && 'hover:shadow-elevation-3 hover:glow-cyan-hover',
    ],
  };

  // Combine classes
  const classes = [
    ...baseClasses,
    ...variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardContent = (
    <div className={classes} {...props}>
      {children}
    </div>
  );

  // Wrap in HoverScale for hover effect if enabled
  if (hover && variant !== 'glass') {
    return (
      <HoverScale scale={1.01}>
        {cardContent}
      </HoverScale>
    );
  }

  return cardContent;
}

// ============================================================================
// Sub-components
// ============================================================================

export function CardHeader({
  className = '',
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`px-6 py-4 border-b border-accent-cyan/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className = '',
  children,
  ...props
}: CardBodyProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-accent-cyan/20 bg-base-charcoal-gray/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Convenience Components
// ============================================================================

export function StandardCard({
  children,
  ...props
}: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="standard" {...props}>
      {children}
    </Card>
  );
}

export function ElevatedCard({
  children,
  ...props
}: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="elevated" {...props}>
      {children}
    </Card>
  );
}

export function GlassCard({
  children,
  ...props
}: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="glass" {...props}>
      {children}
    </Card>
  );
}

