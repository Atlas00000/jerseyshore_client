'use client';

/**
 * useHover Hook
 * Manages hover state with smooth transitions and callbacks
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseHoverOptions {
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  delay?: number; // Delay before triggering hover (ms)
}

export function useHover(options: UseHoverOptions = {}) {
  const { onHoverStart, onHoverEnd, delay = 0 } = options;
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(true);
        onHoverStart?.();
      }, delay);
    } else {
      setIsHovered(true);
      onHoverStart?.();
    }
  }, [delay, onHoverStart]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(false);
    onHoverEnd?.();
  }, [onHoverEnd]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isHovered,
    hoverProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}

