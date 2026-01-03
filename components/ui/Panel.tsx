'use client';

/**
 * Panel Component
 * Sidebar, Floating, and Modal panel variants
 */

import React, { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';
import { ModalAnimation, AnimatePresence } from '@/lib/animations/framerMotion';
import { FocusTrap } from '@/components/accessibility/FocusTrap';

// ============================================================================
// Types
// ============================================================================

export type PanelVariant = 'sidebar' | 'floating' | 'modal';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  isOpen: boolean;
  onClose?: () => void;
  showBackdrop?: boolean;
  title?: string; // For ARIA label
  children: ReactNode;
}

export interface PanelHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose?: () => void;
}

export interface PanelBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface PanelFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ============================================================================
// Main Component
// ============================================================================

export function Panel({
  variant = 'sidebar',
  isOpen,
  onClose,
  showBackdrop = true,
  title,
  className = '',
  children,
  ...props
}: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (variant === 'modal' && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [variant, isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Variant-specific classes
  const variantClasses = {
    sidebar: [
      'fixed',
      'top-0',
      'left-0',
      'h-full',
      'w-80',
      'bg-white',
      'shadow-elevation-2',
      'border-r',
      'border-base-light-gray',
      'z-sticky',
    ],
    floating: [
      'fixed',
      'top-1/2',
      'left-1/2',
      '-translate-x-1/2',
      '-translate-y-1/2',
      'bg-white',
      'rounded-large',
      'shadow-elevation-4',
      'z-overlay',
      'glass',
    ],
    modal: [
      'fixed',
      'top-1/2',
      'left-1/2',
      '-translate-x-1/2',
      '-translate-y-1/2',
      'bg-white',
      'rounded-large',
      'shadow-elevation-5',
      'z-overlay',
      'max-w-2xl',
      'w-full',
      'max-h-[90vh]',
      'overflow-hidden',
      'flex',
      'flex-col',
    ],
  };

  const panelClasses = [
    ...variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Backdrop
  const Backdrop = () => {
    if (!showBackdrop || variant === 'sidebar') return null;

    return (
      <div
        className="fixed inset-0 bg-base-navy/50 backdrop-blur-sm z-overlay"
        onClick={onClose}
        aria-hidden="true"
        role="presentation"
      />
    );
  };

  // Panel content
  const PanelContent = () => {
    const isModal = variant === 'modal';
    const panelId = `panel-${Date.now()}`;
    const titleId = title ? `${panelId}-title` : undefined;

    return (
      <FocusTrap active={isModal && isOpen} initialFocus={panelRef}>
        <div
          ref={panelRef}
          className={panelClasses}
          role={isModal ? 'dialog' : 'region'}
          aria-modal={isModal ? true : undefined}
          aria-labelledby={titleId}
          aria-hidden={!isOpen}
          {...props}
        >
          {title && (
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
          )}
          {children}
        </div>
      </FocusTrap>
    );
  };

  // Render based on variant
  if (variant === 'modal') {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <Backdrop />
            <ModalAnimation>
              <PanelContent />
            </ModalAnimation>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (variant === 'floating') {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <Backdrop />
            <ModalAnimation>
              <PanelContent />
            </ModalAnimation>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Sidebar
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-sticky"
          onClick={(e) => {
            if (e.target === e.currentTarget && onClose) {
              onClose();
            }
          }}
        >
          <ModalAnimation>
            <PanelContent />
          </ModalAnimation>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

export function PanelHeader({
  className = '',
  children,
  onClose,
  ...props
}: PanelHeaderProps) {
  return (
    <div
      className={`px-6 py-4 border-b border-base-light-gray flex items-center justify-between ${className}`}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-base-light-gray rounded-medium transition-smooth"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-text-secondary"
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
        </button>
      )}
    </div>
  );
}

export function PanelBody({
  className = '',
  children,
  ...props
}: PanelBodyProps) {
  return (
    <div
      className={`px-6 py-4 flex-1 overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelFooter({
  className = '',
  children,
  ...props
}: PanelFooterProps) {
  return (
    <div
      className={`px-6 py-4 border-t border-base-light-gray bg-base-light-gray/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Convenience Components
// ============================================================================

export function SidebarPanel({
  children,
  ...props
}: Omit<PanelProps, 'variant'>) {
  return (
    <Panel variant="sidebar" {...props}>
      {children}
    </Panel>
  );
}

export function FloatingPanel({
  children,
  ...props
}: Omit<PanelProps, 'variant'>) {
  return (
    <Panel variant="floating" {...props}>
      {children}
    </Panel>
  );
}

export function ModalPanel({
  children,
  ...props
}: Omit<PanelProps, 'variant'>) {
  return (
    <Panel variant="modal" {...props}>
      {children}
    </Panel>
  );
}

