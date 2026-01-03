'use client';

/**
 * RightPanel Component
 * Groups Materials, Print Placement, and Print Manager sections
 */

import React from 'react';
import { PanelSection } from './ControlPanel';
import { LazyMaterialLibrary } from '@/components/configurator/MaterialLibrary.lazy';
import { LazyPrintPlacement } from '@/components/prints/PrintPlacement.lazy';
import { LazyPrintManager } from '@/components/prints/PrintManager.lazy';

// ============================================================================
// Component
// ============================================================================

export function RightPanel() {
  return (
    <>
      {/* Materials */}
      <PanelSection
        title="Materials"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        }
      >
        <LazyMaterialLibrary />
      </PanelSection>

      {/* Print Placement */}
      <PanelSection
        title="Print Placement"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      >
        <LazyPrintPlacement />
      </PanelSection>

      {/* Print Manager */}
      <PanelSection
        title="Print Manager"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
      >
        <LazyPrintManager />
      </PanelSection>
    </>
  );
}

