'use client';

/**
 * useScrollAnimation Hook
 * Triggers animations when element enters viewport on scroll
 */

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number; // Intersection threshold (0-1, default: 0.1)
  rootMargin?: string; // Root margin for intersection observer (default: '0px')
  triggerOnce?: boolean; // Only trigger once (default: true)
  onEnter?: () => void;
  onExit?: () => void;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    onEnter,
    onExit,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          if (!triggerOnce || !hasTriggeredRef.current) {
            setIsVisible(true);
            onEnter?.();
            hasTriggeredRef.current = true;
          }
        } else {
          if (!triggerOnce) {
            setIsVisible(false);
            onExit?.();
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, onEnter, onExit]);

  return {
    isVisible,
    ref: elementRef as RefObject<HTMLElement>,
  };
}

