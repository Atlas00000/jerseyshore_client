/**
 * Lazy ColorPicker Component
 * Lazy-loaded wrapper for the ColorPicker component
 */

'use client';

import { lazy } from 'react';
import { LazyLoader } from '@/components/common/LazyLoader';

// Lazy load the ColorPicker component
const ColorPicker = lazy(() => 
  import('./ColorPicker').then((module) => ({ default: module.ColorPicker }))
);

/**
 * Loading fallback for ColorPicker component
 */
function ColorPickerLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-small text-text-secondary">Loading color picker...</p>
      </div>
    </div>
  );
}

/**
 * Lazy ColorPicker Component
 */
export function LazyColorPicker({ color, onChange }: { color: string; onChange: (color: string) => void }) {
  return (
    <LazyLoader fallback={<ColorPickerLoadingFallback />}>
      <ColorPicker color={color} onChange={onChange} />
    </LazyLoader>
  );
}

