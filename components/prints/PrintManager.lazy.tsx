/**
 * Lazy PrintManager Component
 * Lazy-loaded wrapper for the PrintManager component
 */

'use client';

import { lazy } from 'react';
import { LazyLoader } from '@/components/common/LazyLoader';

// Lazy load the PrintManager component
const PrintManager = lazy(() => 
  import('./PrintManager').then((module) => ({ default: module.PrintManager }))
);

/**
 * Loading fallback for PrintManager component
 */
function PrintManagerLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-small text-text-secondary">Loading print manager...</p>
      </div>
    </div>
  );
}

/**
 * Lazy PrintManager Component
 */
export function LazyPrintManager() {
  return (
    <LazyLoader fallback={<PrintManagerLoadingFallback />}>
      <PrintManager />
    </LazyLoader>
  );
}

