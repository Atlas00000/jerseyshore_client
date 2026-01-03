'use client';

/**
 * ResponsiveGrid Component
 * Adaptive grid layout that adjusts columns based on screen size
 */

import { ReactNode } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 'md',
  className = '',
}: ResponsiveGridProps) {
  const breakpoint = useBreakpoint();

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  // Get column count for current breakpoint
  const getCols = () => {
    if (breakpoint === '2xl' && cols['2xl']) return cols['2xl'];
    if (breakpoint === 'xl' && cols.xl) return cols.xl;
    if (breakpoint === 'lg' && cols.lg) return cols.lg;
    if (breakpoint === 'md' && cols.md) return cols.md;
    if (breakpoint === 'sm' && cols.sm) return cols.sm;
    return cols.xs || 1;
  };

  const colCount = getCols();

  return (
    <div
      className={`grid ${gapClasses[gap]} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

