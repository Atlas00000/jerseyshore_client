/**
 * Lazy PrintPlacement Component
 * Lazy-loaded wrapper for the PrintPlacement component
 */

'use client';

import { lazy } from 'react';
import { LazyLoader } from '@/components/common/LazyLoader';

// Lazy load the PrintPlacement component
const PrintPlacement = lazy(() => 
  import('./PrintPlacement').then((module) => ({ default: module.PrintPlacement }))
);

/**
 * Loading fallback for PrintPlacement component
 */
function PrintPlacementLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-small text-text-secondary">Loading print tool...</p>
      </div>
    </div>
  );
}

/**
 * Lazy PrintPlacement Component
 */
export function LazyPrintPlacement() {
  return (
    <LazyLoader fallback={<PrintPlacementLoadingFallback />}>
      <PrintPlacement />
    </LazyLoader>
  );
}

