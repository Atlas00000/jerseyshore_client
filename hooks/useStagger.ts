'use client';

/**
 * useStagger Hook
 * Provides staggered animation delays for list items
 */

import { useMemo } from 'react';

interface UseStaggerOptions {
  delay?: number; // Delay between items in ms (default: 50)
  startDelay?: number; // Initial delay in ms (default: 0)
}

export function useStagger<T>(
  items: T[],
  options: UseStaggerOptions = {}
): Array<{ item: T; delay: number; index: number }> {
  const { delay = 50, startDelay = 0 } = options;

  return useMemo(() => {
    return items.map((item, index) => ({
      item,
      delay: startDelay + index * delay,
      index,
    }));
  }, [items, delay, startDelay]);
}

