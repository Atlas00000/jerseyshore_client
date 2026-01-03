/**
 * Animation Hooks
 * React hooks for programmatic animation control
 */

import { useEffect, useState, useRef, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export type AnimationType =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'scaleBounce'
  | 'glowPulse'
  | 'glowPulseAccent'
  | 'glowPulseSuccess'
  | 'shimmer'
  | 'shake'
  | 'spin'
  | 'pulse'
  | 'bounce'
  | 'checkmark';

export type AnimationDuration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';

export interface UseAnimationOptions {
  duration?: AnimationDuration;
  delay?: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

// ============================================================================
// Animation Class Mappings
// ============================================================================

const animationClasses: Record<AnimationType, string> = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  scaleBounce: 'animate-scale-bounce',
  glowPulse: 'animate-glow-pulse',
  glowPulseAccent: 'animate-glow-pulse-accent',
  glowPulseSuccess: 'animate-glow-pulse-success',
  shimmer: 'animate-shimmer',
  shake: 'animate-shake',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  checkmark: 'animate-checkmark',
};

const durationClasses: Record<AnimationDuration, string> = {
  instant: 'animate-duration-instant',
  fast: 'animate-duration-fast',
  normal: 'animate-duration-normal',
  slow: 'animate-duration-slow',
  slower: 'animate-duration-slower',
};

// ============================================================================
// useFadeIn Hook
// ============================================================================

export function useFadeIn(options: UseAnimationOptions = {}) {
  const {
    duration = 'normal',
    delay = 0,
    onComplete,
    autoStart = true,
  } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!elementRef.current) return;

    setIsAnimating(true);
    const element = elementRef.current;

    // Add animation classes
    element.classList.add('animate-fade-in');
    element.classList.add(durationClasses[duration]);

    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }

    // Calculate animation duration for onComplete callback
    const durationMap: Record<AnimationDuration, number> = {
      instant: 0,
      fast: 150,
      normal: 300,
      slow: 500,
      slower: 750,
    };

    const totalDuration = durationMap[duration] + delay;

    if (onComplete && totalDuration > 0) {
      timeoutRef.current = setTimeout(() => {
        onComplete();
      }, totalDuration);
    }
  }, [duration, delay, onComplete]);

  const stop = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.classList.remove('animate-fade-in');
      elementRef.current.classList.remove(durationClasses[duration]);
      elementRef.current.style.animationDelay = '';
    }
    setIsAnimating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [duration]);

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    ref: elementRef,
    isAnimating,
    start,
    stop,
  };
}

// ============================================================================
// useSlideUp Hook
// ============================================================================

export function useSlideUp(options: UseAnimationOptions = {}) {
  const {
    duration = 'normal',
    delay = 0,
    onComplete,
    autoStart = true,
  } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!elementRef.current) return;

    setIsAnimating(true);
    const element = elementRef.current;

    element.classList.add('animate-slide-up');
    element.classList.add(durationClasses[duration]);

    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }

    const durationMap: Record<AnimationDuration, number> = {
      instant: 0,
      fast: 150,
      normal: 300,
      slow: 500,
      slower: 750,
    };

    const totalDuration = durationMap[duration] + delay;

    if (onComplete && totalDuration > 0) {
      timeoutRef.current = setTimeout(() => {
        onComplete();
      }, totalDuration);
    }
  }, [duration, delay, onComplete]);

  const stop = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.classList.remove('animate-slide-up');
      elementRef.current.classList.remove(durationClasses[duration]);
      elementRef.current.style.animationDelay = '';
    }
    setIsAnimating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [duration]);

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    ref: elementRef,
    isAnimating,
    start,
    stop,
  };
}

// ============================================================================
// useScaleIn Hook
// ============================================================================

export function useScaleIn(options: UseAnimationOptions = {}) {
  const {
    duration = 'normal',
    delay = 0,
    onComplete,
    autoStart = true,
  } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!elementRef.current) return;

    setIsAnimating(true);
    const element = elementRef.current;

    element.classList.add('animate-scale-in');
    element.classList.add(durationClasses[duration]);

    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }

    const durationMap: Record<AnimationDuration, number> = {
      instant: 0,
      fast: 150,
      normal: 300,
      slow: 500,
      slower: 750,
    };

    const totalDuration = durationMap[duration] + delay;

    if (onComplete && totalDuration > 0) {
      timeoutRef.current = setTimeout(() => {
        onComplete();
      }, totalDuration);
    }
  }, [duration, delay, onComplete]);

  const stop = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.classList.remove('animate-scale-in');
      elementRef.current.classList.remove(durationClasses[duration]);
      elementRef.current.style.animationDelay = '';
    }
    setIsAnimating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [duration]);

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    ref: elementRef,
    isAnimating,
    start,
    stop,
  };
}

// ============================================================================
// useGlowPulse Hook
// ============================================================================

export function useGlowPulse(
  variant: 'primary' | 'accent' | 'success' = 'primary',
  options: Omit<UseAnimationOptions, 'duration'> = {}
) {
  const { delay = 0, onComplete, autoStart = true } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const animationClass =
    variant === 'primary'
      ? 'animate-glow-pulse'
      : variant === 'accent'
      ? 'animate-glow-pulse-accent'
      : 'animate-glow-pulse-success';

  const start = useCallback(() => {
    if (!elementRef.current) return;

    setIsAnimating(true);
    const element = elementRef.current;

    element.classList.add(animationClass);

    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }
  }, [animationClass, delay]);

  const stop = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.classList.remove(animationClass);
      elementRef.current.style.animationDelay = '';
    }
    setIsAnimating(false);
  }, [animationClass]);

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    ref: elementRef,
    isAnimating,
    start,
    stop,
  };
}

// ============================================================================
// useShimmer Hook
// ============================================================================

export function useShimmer(options: Omit<UseAnimationOptions, 'duration'> = {}) {
  const { delay = 0, autoStart = true } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const start = useCallback(() => {
    if (!elementRef.current) return;

    setIsAnimating(true);
    const element = elementRef.current;

    element.classList.add('animate-shimmer');

    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }
  }, [delay]);

  const stop = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.classList.remove('animate-shimmer');
      elementRef.current.style.animationDelay = '';
    }
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    ref: elementRef,
    isAnimating,
    start,
    stop,
  };
}

// ============================================================================
// Generic useAnimation Hook
// ============================================================================

export function useAnimation(
  animationType: AnimationType,
  options: UseAnimationOptions = {}
) {
  const {
    duration = 'normal',
    delay = 0,
    onComplete,
    autoStart = true,
  } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!elementRef.current) return;

    setIsAnimating(true);
    const element = elementRef.current;

    const animationClass = animationClasses[animationType];
    element.classList.add(animationClass);

    if (duration !== 'normal') {
      element.classList.add(durationClasses[duration]);
    }

    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }

    const durationMap: Record<AnimationDuration, number> = {
      instant: 0,
      fast: 150,
      normal: 300,
      slow: 500,
      slower: 750,
    };

    const totalDuration = durationMap[duration] + delay;

    if (onComplete && totalDuration > 0) {
      timeoutRef.current = setTimeout(() => {
        onComplete();
      }, totalDuration);
    }
  }, [animationType, duration, delay, onComplete]);

  const stop = useCallback(() => {
    if (elementRef.current) {
      const element = elementRef.current;
      const animationClass = animationClasses[animationType];
      element.classList.remove(animationClass);
      element.classList.remove(durationClasses[duration]);
      element.style.animationDelay = '';
    }
    setIsAnimating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [animationType, duration]);

  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    ref: elementRef,
    isAnimating,
    start,
    stop,
  };
}

