'use client';

/**
 * PanelLayout Component
 * Manages the viewport with control panels positioned around it
 * Left, right, and bottom panels with viewport in the center
 */

import React, { ReactNode } from 'react';
import { ControlPanel } from './ControlPanel';
import { useIsMobile } from '@/hooks/useMediaQuery';

// ============================================================================
// Types
// ============================================================================

export interface PanelLayoutProps {
  children: ReactNode; // Viewport/Scene content
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  bottomPanel?: ReactNode;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  showBottomPanel?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function PanelLayout({
  children,
  leftPanel,
  rightPanel,
  bottomPanel,
  showLeftPanel = true,
  showRightPanel = true,
  showBottomPanel = true,
}: PanelLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Viewport - Centered with margins for panels */}
      <div 
        className={`
          absolute inset-0
          ${showLeftPanel && !isMobile ? 'left-[18rem]' : ''}
          ${showRightPanel && !isMobile ? 'right-[18rem]' : ''}
          ${showBottomPanel && isMobile ? 'bottom-0 pb-[50vh]' : showBottomPanel ? 'bottom-24' : ''}
          transition-all duration-300 ease-out
        `}
      >
        {children}
      </div>

      {/* Left Panel */}
      {showLeftPanel && leftPanel && (
        <ControlPanel position="left">
          {leftPanel}
        </ControlPanel>
      )}

      {/* Right Panel */}
      {showRightPanel && rightPanel && (
        <ControlPanel position="right">
          {rightPanel}
        </ControlPanel>
      )}

      {/* Bottom Panel */}
      {showBottomPanel && bottomPanel && (
        <ControlPanel 
          position="bottom" 
          maxHeight="20rem"
          showLeftPanel={showLeftPanel}
          showRightPanel={showRightPanel}
        >
          {bottomPanel}
        </ControlPanel>
      )}
    </div>
  );
}

