'use client';

/**
 * Section Component
 * Reusable section wrapper with consistent spacing and entrance animations
 */

import React, { HTMLAttributes, ReactNode } from 'react';
import { FadeInContainer } from '@/components/ui/AnimatedContainer';

// ============================================================================
// Types
// ============================================================================

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  children: ReactNode;
  as?: 'section' | 'div';
  noAnimation?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function Section({
  title,
  description,
  children,
  as: Component = 'section',
  noAnimation = false,
  className = '',
  ...props
}: SectionProps) {
  const content = (
    <Component
      className={`py-8 ${className}`}
      {...props}
    >
      {/* Title and Description */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-h2 font-bold text-text-primary mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-body text-text-secondary max-w-2xl">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      {children}
    </Component>
  );

  // Wrap in animation container if animation is enabled
  if (noAnimation) {
    return content;
  }

  return (
    <FadeInContainer duration="normal" delay={0}>
      {content}
    </FadeInContainer>
  );
}

// ============================================================================
// Container Component
// ============================================================================

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: 'content' | 'full-width' | 'full';
}

export function Container({
  children,
  maxWidth = 'content',
  className = '',
  ...props
}: ContainerProps) {
  const maxWidthClasses = {
    content: 'max-w-content',
    'full-width': 'max-w-full-width',
    full: 'max-w-full',
  };

  return (
    <div
      className={`mx-auto px-6 ${maxWidthClasses[maxWidth]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

