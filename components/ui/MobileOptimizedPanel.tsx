'use client';

/**
 * MobileOptimizedPanel Component
 * Automatically uses BottomSheet on mobile and Panel on desktop
 */

import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Panel, PanelProps } from './Panel';
import { BottomSheet } from './BottomSheet';

interface MobileOptimizedPanelProps extends Omit<PanelProps, 'children'> {
  children: ReactNode;
  bottomSheetTitle?: string;
  bottomSheetMaxHeight?: string;
}

export function MobileOptimizedPanel({
  children,
  bottomSheetTitle,
  bottomSheetMaxHeight,
  ...panelProps
}: MobileOptimizedPanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={panelProps.isOpen}
        onClose={panelProps.onClose || (() => {})}
        title={bottomSheetTitle || panelProps.title}
        maxHeight={bottomSheetMaxHeight}
        showBackdrop={true}
      >
        {children}
      </BottomSheet>
    );
  }

  return <Panel {...panelProps}>{children}</Panel>;
}

