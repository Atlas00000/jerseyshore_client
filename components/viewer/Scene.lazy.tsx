/**
 * Lazy Scene Component
 * Lazy-loaded wrapper for the 3D Scene component
 */

'use client';

import { lazy } from 'react';
import { motion } from 'framer-motion';
import { LazyLoader } from '@/components/common/LazyLoader';

// Lazy load the Scene component
const Scene = lazy(() => import('./Scene').then((module) => ({ default: module.Scene })));

/**
 * Loading fallback for Scene component
 * Custom loading state for 3D viewer
 */
function SceneLoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Rotating 3D icon */}
          <motion.div
            className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {/* Glow effect */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-accent-cyan/30 border-t-transparent rounded-full animate-pulse" />
        </div>
        <p className="text-body text-text-secondary">Loading 3D Viewer...</p>
      </div>
    </div>
  );
}

/**
 * Lazy Scene Component
 * Wraps Scene with lazy loading and custom loading state
 */
export function LazyScene() {
  return (
    <LazyLoader fallback={<SceneLoadingFallback />}>
      <Scene />
    </LazyLoader>
  );
}

