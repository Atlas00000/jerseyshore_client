/**
 * Framer Motion Wrappers
 * Pre-configured Framer Motion components with design system presets
 */

'use client';

import { motion, MotionProps, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// ============================================================================
// Animation Variants
// ============================================================================

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1], // ease-out
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const scaleBounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.68, -0.55, 0.265, 1.55], // spring
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// ============================================================================
// Motion Components
// ============================================================================

export interface MotionDivProps extends Omit<MotionProps, 'variants'> {
  children: ReactNode;
  variant?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'scaleBounce';
  duration?: number;
  delay?: number;
  className?: string;
}

export function MotionDiv({
  children,
  variant = 'fadeIn',
  duration = 0.3,
  delay = 0,
  className = '',
  ...props
}: MotionDivProps) {
  const variantMap: Record<string, Variants> = {
    fadeIn: fadeInVariants,
    slideUp: slideUpVariants,
    slideDown: slideDownVariants,
    slideLeft: slideLeftVariants,
    slideRight: slideRightVariants,
    scaleIn: scaleInVariants,
    scaleBounce: scaleBounceVariants,
  };

  const selectedVariants = variantMap[variant];

  // Override transition if duration or delay is provided
  const customVariants: Variants = {
    ...selectedVariants,
    visible: {
      ...(typeof selectedVariants.visible === 'object' ? selectedVariants.visible : {}),
      transition: {
        ...(typeof selectedVariants.visible === 'object' && selectedVariants.visible?.transition ? selectedVariants.visible.transition : {}),
        duration,
        delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Stagger Container
// ============================================================================

export interface StaggerContainerProps extends Omit<MotionProps, 'variants'> {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.05,
  className = '',
  ...props
}: StaggerContainerProps) {
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Hover Animations
// ============================================================================

export interface HoverScaleProps extends Omit<MotionProps, 'whileHover'> {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({
  children,
  scale = 1.02,
  className = '',
  ...props
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Page Transition
// ============================================================================

export interface PageTransitionProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className = '',
  ...props
}: PageTransitionProps) {
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Modal Animation
// ============================================================================

export interface ModalAnimationProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export function ModalAnimation({
  children,
  className = '',
  ...props
}: ModalAnimationProps) {
  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Export all
// ============================================================================

export {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';

export type { MotionProps, Variants, Transition } from 'framer-motion';

