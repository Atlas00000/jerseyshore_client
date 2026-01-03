'use client';

/**
 * LeftPanel Component
 * Groups Design Mode, Components, and Color sections
 */

import React from 'react';
import { PanelSection } from './ControlPanel';
import { ModeSelector } from '@/components/configurator/ModeSelector';
import { ComponentSelector } from '@/components/configurator/ComponentSelector';
import { LazyColorPicker } from '@/components/configurator/ColorPicker.lazy';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { Card } from '@/components/ui/Card';

// ============================================================================
// Component
// ============================================================================

export function LeftPanel() {
  const { selectedComponent, colorMap, setColor, addRecentColor } = useConfiguratorStore();

  const handleColorChange = (color: string) => {
    if (selectedComponent) {
      setColor(selectedComponent, color);
      addRecentColor(color);
    }
  };

  const currentColor = selectedComponent ? (colorMap[selectedComponent] || '#ffffff') : null;

  return (
    <>
      {/* Design Mode */}
      <PanelSection
        title="Design Mode"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        }
      >
        <ModeSelector />
      </PanelSection>

      {/* Components */}
      <PanelSection
        title="Components"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      >
        <ComponentSelector />
      </PanelSection>

      {/* Color Picker */}
      <PanelSection
        title="Color"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        }
      >
        {!selectedComponent ? (
          <Card variant="standard">
            <div className="p-3 text-center">
              <p className="text-small text-text-tertiary">
                Select a component to choose a color
              </p>
            </div>
          </Card>
        ) : (
          <LazyColorPicker 
            color={currentColor || '#ffffff'} 
            onChange={handleColorChange} 
          />
        )}
      </PanelSection>
    </>
  );
}

