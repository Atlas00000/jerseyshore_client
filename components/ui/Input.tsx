'use client';

/**
 * Input Component
 * Text input with focus states, error states, success states, and animations
 */

import React, { InputHTMLAttributes, ReactNode, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

// ============================================================================
// Component
// ============================================================================

export function Input({
  label,
  error,
  success,
  helperText,
  icon,
  iconPosition = 'left',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Add shake animation on error
  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.classList.add('animate-shake');
      const timeout = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.classList.remove('animate-shake');
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // Base input classes - Dark Theme
  const baseClasses = [
    'w-full',
    'px-4',
    'py-3',
    'text-body',
    'text-text-primary',
    'bg-base-charcoal-gray',
    'border',
    'rounded-small',
    'transition-smooth',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-base-charcoal',
    'disabled:opacity-40',
    'disabled:cursor-not-allowed',
    'placeholder:text-text-tertiary',
  ];

  // State classes - Electric Focus Glow
  const stateClasses = error
    ? [
        'border-error',
        'focus:border-error',
        'focus:ring-error',
        'focus:glow-error',
      ]
    : success
    ? [
        'border-success',
        'focus:border-success',
        'focus:ring-success',
        'focus:glow-success',
      ]
    : [
        'border-base-dark-border',
        'focus:border-accent-cyan',
        'focus:ring-accent-cyan',
        'focus:glow-cyan-hover',
        'hover:border-accent-cyan/50',
      ];

  // Icon padding
  const iconPadding =
    icon && iconPosition === 'left'
      ? 'pl-10'
      : icon && iconPosition === 'right'
      ? 'pr-10'
      : '';

  // Combine classes
  const inputClasses = [
    ...baseClasses,
    ...stateClasses,
    iconPadding,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Success checkmark icon
  const SuccessIcon = () => (
    <svg
      className="w-5 h-5 text-success"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  // Error icon
  const ErrorIcon = () => (
    <svg
      className="w-5 h-5 text-error"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-small font-medium text-text-primary mb-2"
        >
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error || helperText
              ? `${inputId}-${error ? 'error' : 'helper'}`
              : undefined
          }
          {...props}
        />

        {/* Right Icon (Success/Error or Custom) */}
        {(success || error || (icon && iconPosition === 'right')) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {success && <SuccessIcon />}
            {error && <ErrorIcon />}
            {!success && !error && icon && iconPosition === 'right' && (
              <span className="text-text-tertiary">{icon}</span>
            )}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(error || helperText) && (
        <p
          id={`${inputId}-${error ? 'error' : 'helper'}`}
          className={`mt-2 text-small ${
            error ? 'text-error' : 'text-text-secondary'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

