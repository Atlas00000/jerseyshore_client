'use client';

import { LazyScene } from '@/components/viewer/Scene.lazy';
import { AppLayout } from '@/components/layout/AppLayout';
import { PanelLayout } from '@/components/layout/PanelLayout';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import { BottomPanel } from '@/components/layout/BottomPanel';

export default function Home() {
  return (
    <AppLayout showSidebar={false}>
      {/* Panel Layout with Viewport and Control Panels */}
      <PanelLayout
        leftPanel={<LeftPanel />}
        rightPanel={<RightPanel />}
        bottomPanel={<BottomPanel />}
      >
        {/* Main Content - 3D Viewer */}
        <div className="relative w-full h-full">
          <LazyScene />
        </div>
      </PanelLayout>
    </AppLayout>
  );
}

