'use client';

/**
 * Select Component
 * Custom dropdown with animations and keyboard navigation
 */

import React, { SelectHTMLAttributes, ReactNode, useState, useRef, useEffect } from 'react';
import { MotionDiv } from '@/lib/animations/framerMotion';

// ============================================================================
// Types
// ============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Select({
  label,
  error,
  success,
  helperText,
  options,
  placeholder = 'Select an option...',
  className = '',
  id,
  value,
  onChange,
  disabled,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const enabledOptions = options.filter((opt) => !opt.disabled);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev < enabledOptions.length - 1 ? prev + 1 : 0;
            return next;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : enabledOptions.length - 1;
            return next;
          });
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < enabledOptions.length) {
            const option = enabledOptions[focusedIndex];
            handleOptionSelect(option.value);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, options]);

  const handleOptionSelect = (optionValue: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: optionValue },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  // Base classes - Dark Theme
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
    'cursor-pointer',
    'flex',
    'items-center',
    'justify-between',
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
  const buttonClasses = [
    ...baseClasses,
    ...stateClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Arrow icon
  const ArrowIcon = () => (
    <svg
      className={`w-5 h-5 text-text-tertiary transition-transform duration-fast ${
        isOpen ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

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

  const enabledOptions = options.filter((opt) => !opt.disabled);

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

      {/* Select Wrapper */}
      <div ref={selectRef} className="relative">
        {/* Hidden native select for form submission */}
        <select
          id={inputId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          aria-hidden="true"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Button */}
        <button
          ref={buttonRef}
          type="button"
          className={buttonClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? 'true' : 'false'}
        >
          <span className={selectedOption ? 'text-text-primary' : 'text-text-tertiary'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {success && <SuccessIcon />}
            {error && <ErrorIcon />}
            <ArrowIcon />
          </div>
        </button>

        {/* Dropdown - Dark Theme */}
        {isOpen && (
          <MotionDiv
            variant="scaleIn"
            duration={0.2}
            className="absolute z-dropdown w-full mt-2 glass-accent border border-accent-cyan/30 rounded-medium shadow-elevation-4 overflow-hidden"
          >
            <ul
              role="listbox"
              className="max-h-60 overflow-auto custom-scrollbar"
              aria-label={label}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = enabledOptions.findIndex((opt) => opt.value === option.value) === focusedIndex;
                const isDisabled = option.disabled;

                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`
                      px-4 py-2 cursor-pointer transition-smooth
                      ${isSelected ? 'bg-accent-cyan/20 text-accent-cyan font-medium' : 'text-text-primary'}
                      ${isFocused && !isSelected ? 'bg-base-charcoal-gray' : ''}
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-base-charcoal-gray'}
                    `}
                    onClick={() => !isDisabled && handleOptionSelect(option.value)}
                    onMouseEnter={() => !isDisabled && setFocusedIndex(enabledOptions.findIndex((opt) => opt.value === option.value))}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </MotionDiv>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(error || helperText) && (
        <p
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

