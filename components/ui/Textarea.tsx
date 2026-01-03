'use client';

/**
 * Textarea Component
 * Multi-line text input with auto-resize option and same states as Input
 */

import React, { TextareaHTMLAttributes, ReactNode, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

// ============================================================================
// Component
// ============================================================================

export function Textarea({
  label,
  error,
  success,
  helperText,
  autoResize = false,
  minRows = 3,
  maxRows,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  // Auto-resize functionality
  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;

    const textarea = textareaRef.current;

    const resize = () => {
      textarea.style.height = 'auto';
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = lineHeight * minRows;
      const scrollHeight = textarea.scrollHeight;

      if (maxRows) {
        const maxHeight = lineHeight * maxRows;
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
      } else {
        textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
      }
    };

    resize();
    textarea.addEventListener('input', resize);
    window.addEventListener('resize', resize);

    return () => {
      textarea.removeEventListener('input', resize);
      window.removeEventListener('resize', resize);
    };
  }, [autoResize, minRows, maxRows]);

  // Add shake animation on error
  useEffect(() => {
    if (error && textareaRef.current) {
      textareaRef.current.classList.add('animate-shake');
      const timeout = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.classList.remove('animate-shake');
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // Base textarea classes - Dark Theme
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
    'resize-y',
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

  // Combine classes
  const textareaClasses = [
    ...baseClasses,
    ...stateClasses,
    !autoResize && 'min-h-[120px]',
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

      {/* Textarea Wrapper */}
      <div className="relative">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id={inputId}
          className={textareaClasses}
          rows={!autoResize ? minRows : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error || helperText
              ? `${inputId}-${error ? 'error' : 'helper'}`
              : undefined
          }
          {...props}
        />

        {/* Success/Error Icons */}
        {(success || error) && (
          <div className="absolute right-3 top-3 pointer-events-none">
            {success && <SuccessIcon />}
            {error && <ErrorIcon />}
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

