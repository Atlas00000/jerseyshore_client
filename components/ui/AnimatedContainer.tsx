'use client';

/**
 * AnimatedContainer Component
 * Wrapper component for animated content with stagger support
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useAnimation, AnimationType, AnimationDuration } from '@/lib/animations/useAnimations';

// ============================================================================
// Types
// ============================================================================

export interface AnimatedContainerProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: AnimationDuration;
  delay?: number;
  stagger?: boolean;
  staggerDelay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  onAnimationComplete?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function AnimatedContainer({
  children,
  animation = 'fadeIn',
  duration = 'normal',
  delay = 0,
  stagger = false,
  staggerDelay = 50,
  className = '',
  as: Component = 'div',
  onAnimationComplete,
}: AnimatedContainerProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [childElements, setChildElements] = useState<HTMLElement[]>([]);

  // Get animation classes
  const getAnimationClass = (anim: AnimationType): string => {
    const classes: Record<AnimationType, string> = {
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
    return classes[anim];
  };

  const getDurationClass = (dur: AnimationDuration): string => {
    const classes: Record<AnimationDuration, string> = {
      instant: 'animate-duration-instant',
      fast: 'animate-duration-fast',
      normal: 'animate-duration-normal',
      slow: 'animate-duration-slow',
      slower: 'animate-duration-slower',
    };
    return classes[dur];
  };

  // Apply stagger animations to children
  useEffect(() => {
    if (!stagger || !containerRef.current) return;

    const container = containerRef.current;
    const children = Array.from(container.children) as HTMLElement[];

    if (children.length === 0) return;

    setChildElements(children);

    // Apply animation to each child with stagger delay
    children.forEach((child, index) => {
      const animationClass = getAnimationClass(animation);
      const durationClass = getDurationClass(duration);
      const childDelay = delay + index * staggerDelay;

      child.classList.add(animationClass);
      child.classList.add(durationClass);

      if (childDelay > 0) {
        child.style.animationDelay = `${childDelay}ms`;
      }
    });

    // Calculate total animation duration for onComplete callback
    if (onAnimationComplete) {
      const durationMap: Record<AnimationDuration, number> = {
        instant: 0,
        fast: 150,
        normal: 300,
        slow: 500,
        slower: 750,
      };

      const totalDuration =
        durationMap[duration] + delay + (children.length - 1) * staggerDelay;

      if (totalDuration > 0) {
        const timeout = setTimeout(() => {
          onAnimationComplete();
        }, totalDuration);

        return () => clearTimeout(timeout);
      }
    }
  }, [
    stagger,
    animation,
    duration,
    delay,
    staggerDelay,
    onAnimationComplete,
  ]);

  // Apply animation to container if not using stagger
  useEffect(() => {
    if (stagger || !containerRef.current) return;

    const container = containerRef.current;
    const animationClass = getAnimationClass(animation);
    const durationClass = getDurationClass(duration);

    container.classList.add(animationClass);
    container.classList.add(durationClass);

    if (delay > 0) {
      container.style.animationDelay = `${delay}ms`;
    }

    // Calculate animation duration for onComplete callback
    if (onAnimationComplete) {
      const durationMap: Record<AnimationDuration, number> = {
        instant: 0,
        fast: 150,
        normal: 300,
        slow: 500,
        slower: 750,
      };

      const totalDuration = durationMap[duration] + delay;

      if (totalDuration > 0) {
        const timeout = setTimeout(() => {
          onAnimationComplete();
        }, totalDuration);

        return () => clearTimeout(timeout);
      }
    }
  }, [stagger, animation, duration, delay, onAnimationComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const animationClass = getAnimationClass(animation);
        const durationClass = getDurationClass(duration);

        container.classList.remove(animationClass);
        container.classList.remove(durationClass);
        container.style.animationDelay = '';

        // Cleanup child elements
        if (stagger) {
          const children = Array.from(container.children) as HTMLElement[];
          children.forEach((child) => {
            child.classList.remove(animationClass);
            child.classList.remove(durationClass);
            child.style.animationDelay = '';
          });
        }
      }
    };
  }, [animation, duration, stagger]);

  // Use React.createElement to avoid type conflicts with Three.js components
  return React.createElement(
    Component,
    {
      ref: containerRef as any,
      className,
      style: !stagger && delay > 0 ? { animationDelay: `${delay}ms` } : undefined,
    },
    children
  );
}

// ============================================================================
// Convenience Components
// ============================================================================

export function FadeInContainer({
  children,
  ...props
}: Omit<AnimatedContainerProps, 'animation'>) {
  return (
    <AnimatedContainer animation="fadeIn" {...props}>
      {children}
    </AnimatedContainer>
  );
}

export function SlideUpContainer({
  children,
  ...props
}: Omit<AnimatedContainerProps, 'animation'>) {
  return (
    <AnimatedContainer animation="slideUp" {...props}>
      {children}
    </AnimatedContainer>
  );
}

export function ScaleInContainer({
  children,
  ...props
}: Omit<AnimatedContainerProps, 'animation'>) {
  return (
    <AnimatedContainer animation="scaleIn" {...props}>
      {children}
    </AnimatedContainer>
  );
}

