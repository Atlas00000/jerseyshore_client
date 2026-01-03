'use client';

/**
 * useClickAnimation Hook
 * Provides click feedback animations (ripple effect, scale, etc.)
 */

import { useState, useCallback, useRef } from 'react';
import { animation } from '@/lib/design/tokens';

interface UseClickAnimationOptions {
  scale?: number; // Scale factor on click (default: 0.95)
  duration?: number; // Animation duration in ms (default: 150)
  onAnimationComplete?: () => void;
}

export function useClickAnimation(options: UseClickAnimationOptions = {}) {
  const { scale = 0.95, duration = 150, onAnimationComplete } = options;
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    setIsAnimating(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete?.();
    }, duration);
  }, [duration, onAnimationComplete]);

  return {
    isAnimating,
    clickProps: {
      onClick: handleClick,
      style: {
        transform: isAnimating ? `scale(${scale})` : 'scale(1)',
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      },
    },
  };
}

