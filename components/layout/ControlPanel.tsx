'use client';

/**
 * ControlPanel Component
 * Reusable panel wrapper for positioning control sections around the viewport
 * Supports left, right, and bottom positioning with glass morphism effects
 */

import React, { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { MotionDiv } from '@/lib/animations/framerMotion';
import { useIsMobile } from '@/hooks/useMediaQuery';

// ============================================================================
// Types
// ============================================================================

export type PanelPosition = 'left' | 'right' | 'bottom';

export interface ControlPanelProps extends HTMLAttributes<HTMLDivElement> {
  position: PanelPosition;
  children: ReactNode;
  maxHeight?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ControlPanel({
  position,
  children,
  maxHeight = 'calc(100vh - 8rem)',
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  showLeftPanel = true,
  showRightPanel = true,
}: ControlPanelProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  // Calculate bottom panel positioning to match viewport width
  const getBottomPanelClasses = () => {
    if (isMobile) return 'left-0 right-0';
    const leftOffset = showLeftPanel ? 'left-[18rem]' : 'left-4';
    const rightOffset = showRightPanel ? 'right-[18rem]' : 'right-4';
    return `${leftOffset} ${rightOffset} bottom-4 h-auto max-h-80`;
  };

  // Position-based classes
  const positionClasses = {
    left: 'left-4 top-4 bottom-4 w-72',
    right: 'right-4 top-4 bottom-4 w-72',
    bottom: getBottomPanelClasses(), // Match viewport width dynamically
  };

  // Mobile: only show bottom panel, hide side panels
  if (isMobile && position !== 'bottom') {
    return null;
  }
  
  // Border color based on position
  const borderColors = {
    left: 'border-accent-cyan/30',
    right: 'border-accent-magenta/30',
    bottom: 'border-accent-emerald/30',
  };

  // Mobile bottom panel: full width, different styling
  if (isMobile && position === 'bottom') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed left-0 right-0 bottom-0
          glass-emerald
          border-t ${borderColors[position]}
          rounded-t-large shadow-elevation-5
          overflow-hidden
          flex flex-col
          z-sticky
          transition-smooth
          ${className}
        `}
        style={{
          maxHeight: '50vh',
        }}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {children}
        </div>
      </motion.div>
    );
  }

  const baseClasses = [
    'absolute',
    positionClasses[position],
    position === 'left' ? 'glass-accent' : position === 'right' ? 'glass-magenta' : 'glass-emerald',
    'border',
    borderColors[position],
    'rounded-large shadow-elevation-5',
    'overflow-hidden',
    'flex flex-col',
    'z-sticky',
    'transition-smooth',
  ].join(' ');

  // Animation props based on position
  const animationProps = position === 'bottom'
    ? {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, x: position === 'left' ? -20 : 20 },
        animate: { opacity: 1, x: 0 },
      };

  return (
    <motion.div
      {...animationProps}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`${baseClasses} ${className}`}
      style={{
        maxHeight: position === 'bottom' ? maxHeight : undefined,
        height: position === 'bottom' ? undefined : maxHeight,
      }}
    >
      {/* Scrollable Content */}
      <div 
        className={`
          flex-1 overflow-y-auto custom-scrollbar
          ${position === 'bottom' ? 'p-4' : 'p-4'}
        `}
        style={{
          maxHeight: position === 'bottom' ? '20rem' : undefined,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Panel Section Component
// ============================================================================

export interface PanelSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function PanelSection({
  title,
  icon,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  ...props
}: PanelSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <div 
      className={`mb-4 last:mb-0 border-l-2 border-accent-cyan/30 pl-3 ${className}`}
      {...props}
    >
      {title && (
        <div 
          className={`
            flex items-center justify-between mb-3 pb-2 border-b border-accent-cyan/20
            ${collapsible ? 'cursor-pointer hover:border-accent-cyan/40' : ''}
            transition-smooth
          `}
          onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        >
          <div className="flex items-center gap-2">
            {icon && <div className="text-accent-cyan">{icon}</div>}
            <h3 className="text-small font-semibold text-text-primary uppercase tracking-wide">
              {title}
            </h3>
          </div>
          {collapsible && (
            <svg 
              className={`w-4 h-4 text-accent-cyan/60 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      )}
      <div className={isCollapsed ? 'hidden' : ''}>
        {children}
      </div>
    </div>
  );
}

