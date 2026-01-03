/**
 * Lazy MaterialLibrary Component
 * Lazy-loaded wrapper for the MaterialLibrary component
 */

'use client';

import { lazy } from 'react';
import { LazyLoader } from '@/components/common/LazyLoader';

// Lazy load the MaterialLibrary component
const MaterialLibrary = lazy(() => 
  import('./MaterialLibrary').then((module) => ({ default: module.MaterialLibrary }))
);

/**
 * Loading fallback for MaterialLibrary component
 * Custom loading state for material selection
 */
function MaterialLibraryLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-accent-cyan animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-small text-text-secondary">Loading materials...</p>
      </div>
    </div>
  );
}

/**
 * Lazy MaterialLibrary Component
 * Wraps MaterialLibrary with lazy loading and custom loading state
 */
export function LazyMaterialLibrary() {
  return (
    <LazyLoader fallback={<MaterialLibraryLoadingFallback />}>
      <MaterialLibrary />
    </LazyLoader>
  );
}

