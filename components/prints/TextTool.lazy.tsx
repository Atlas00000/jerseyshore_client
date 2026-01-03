/**
 * Lazy TextTool Component
 * Lazy-loaded wrapper for the TextTool component
 */

'use client';

import { lazy } from 'react';
import { LazyLoader } from '@/components/common/LazyLoader';

// Lazy load the TextTool component
const TextTool = lazy(() => 
  import('./TextTool').then((module) => ({ default: module.TextTool }))
);

/**
 * Loading fallback for TextTool component
 */
function TextToolLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-small text-text-secondary">Loading text tool...</p>
      </div>
    </div>
  );
}

/**
 * Lazy TextTool Component
 */
export function LazyTextTool() {
  return (
    <LazyLoader fallback={<TextToolLoadingFallback />}>
      <TextTool />
    </LazyLoader>
  );
}

