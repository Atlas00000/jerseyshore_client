'use client';

import { Scene } from '@/components/viewer/Scene';
import { ModeSelector } from '@/components/configurator/ModeSelector';
import { ComponentSelector } from '@/components/configurator/ComponentSelector';
import { MaterialLibrary } from '@/components/configurator/MaterialLibrary';
import { ColorPicker } from '@/components/configurator/ColorPicker';
import { DesignActions } from '@/components/configurator/DesignActions';
import { PrintPlacement } from '@/components/prints/PrintPlacement';
import { PrintManager } from '@/components/prints/PrintManager';
import { PrintLibrary } from '@/components/prints/PrintLibrary';
import { TextTool } from '@/components/prints/TextTool';
import { useConfiguratorStore } from '@/stores/configuratorStore';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">Shirt Configurator</h1>
        <p className="text-lg text-gray-600 mb-4">
          Real-time 3D shirt customization tool
        </p>
        <ModeSelector />
        <div className="mt-4">
          <DesignActions />
        </div>
        <div className="mt-4">
          <ComponentSelector />
        </div>
        <div className="mt-4">
          <MaterialLibrary />
        </div>
        <div className="mt-4">
          <ColorPickerWrapper />
        </div>
        <div className="mt-4">
          <PrintPlacement />
        </div>
        <div className="mt-4">
          <PrintManager />
        </div>
        <div className="mt-4">
          <TextTool />
        </div>
        <div className="mt-4">
          <PrintLibrary />
        </div>
      </div>
      <div className="flex-1">
        <Scene />
      </div>
    </main>
  );
}

// Wrapper component to use hooks
function ColorPickerWrapper() {
  const { selectedComponent, colorMap, setColor, addRecentColor } =
    useConfiguratorStore();

  if (!selectedComponent) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Select a component to choose a color.</p>
      </div>
    );
  }

  const currentColor = colorMap[selectedComponent] || '#ffffff';

  const handleColorChange = (color: string) => {
    setColor(selectedComponent, color);
    addRecentColor(color);
  };

  return <ColorPicker color={currentColor} onChange={handleColorChange} />;
}

