'use client';

/**
 * Sidebar Component
 * Collapsible sidebar with mobile optimizations, backdrop, and swipe-to-close
 */

import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useSwipe } from '@/hooks/useSwipe';
import { animation } from '@/lib/design/tokens';

// ============================================================================
// Types
// ============================================================================

export interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export interface SidebarSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}

// ============================================================================
// Main Component
// ============================================================================

export function Sidebar({ isOpen, onClose, children }: SidebarProps) {
  const isMobile = useIsMobile();
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const { swipeHandlers } = useSwipe({
    onSwipe: (direction) => {
      if (direction === 'left' && isMobile && onClose) {
        onClose();
      }
    },
    threshold: 100,
  });

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop (mobile only) */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: parseFloat(animation.duration.fast) / 1000 }}
            className="fixed inset-0 bg-base-navy/50 backdrop-blur-sm z-sticky lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 }}
            transition={{
              duration: parseFloat(animation.duration.normal) / 1000,
              ease: [0.16, 1, 0.3, 1], // cubic-bezier format for Framer Motion
            }}
            className={`
              fixed left-0 top-0 h-full w-80 bg-base-dark-slate border-r border-base-dark-border 
              shadow-elevation-5 z-sticky overflow-y-auto custom-scrollbar
              ${isMobile ? '' : 'lg:relative lg:shadow-none'}
            `}
            {...(isMobile ? swipeHandlers : {})}
          >
            {/* Mobile Header with Close Button */}
            {isMobile && onClose && (
              <div className="sticky top-0 bg-base-dark-slate border-b border-base-dark-border p-4 flex items-center justify-between z-elevated">
                <h2 className="text-h4 font-bold text-text-primary">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  <span className="sr-only">Close sidebar</span>
                </Button>
              </div>
            )}

            <div className={`p-4 space-y-4 ${isMobile ? '' : 'pt-4'}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// Sidebar Section Component
// ============================================================================

export function SidebarSection({
  title,
  defaultOpen = true,
  children,
  icon,
}: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card variant="standard" className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-base-light-gray transition-smooth touch-manipulation"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-text-secondary">{icon}</span>}
          <h3 className="text-body font-semi-bold text-text-primary">{title}</h3>
        </div>
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
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: parseFloat(animation.duration.normal) / 1000,
              ease: [0.16, 1, 0.3, 1], // cubic-bezier format for Framer Motion
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ============================================================================
// Sidebar Item Component
// ============================================================================

export interface SidebarItemProps {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  badge?: ReactNode;
}

export function SidebarItem({
  label,
  icon,
  active = false,
  onClick,
  badge,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-3 py-2.5 flex items-center justify-between rounded-medium 
        transition-smooth touch-manipulation min-h-[44px]
        ${
          active
            ? 'bg-accent-blue/10 text-accent-blue font-medium'
            : 'text-text-secondary hover:bg-base-light-gray hover:text-text-primary'
        }
      `}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-small">{icon}</span>}
        <span className="text-small">{label}</span>
      </div>
      {badge && <span>{badge}</span>}
    </button>
  );
}
