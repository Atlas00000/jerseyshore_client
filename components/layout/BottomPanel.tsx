'use client';

/**
 * BottomPanel Component
 * Groups Actions, Text Tool, and Print Library sections
 * Horizontal layout for bottom panel
 */

import React from 'react';
import { PanelSection } from './ControlPanel';
import { DesignActions } from '@/components/configurator/DesignActions';
import { LazyTextTool } from '@/components/prints/TextTool.lazy';
import { PrintLibrary } from '@/components/prints/PrintLibrary';

// ============================================================================
// Component
// ============================================================================

export function BottomPanel() {
  return (
    <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
      {/* Actions */}
      <div className="flex-shrink-0 w-64">
        <PanelSection
          title="Actions"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          }
        >
          <DesignActions />
        </PanelSection>
      </div>

      {/* Text Tool */}
      <div className="flex-shrink-0 w-64">
        <PanelSection
          title="Text Tool"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-7 4h7M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
          }
        >
          <LazyTextTool />
        </PanelSection>
      </div>

      {/* Print Library */}
      <div className="flex-shrink-0 w-64">
        <PanelSection
          title="Print Library"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        >
          <PrintLibrary />
        </PanelSection>
      </div>
    </div>
  );
}

