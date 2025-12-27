'use client';

import { useConfiguratorStore } from '@/stores/configuratorStore';

export function ModeSelector() {
  const { currentMode, setMode } = useConfiguratorStore();

  return (
    <div className="flex gap-4 p-4 bg-white shadow-md">
      <button
        onClick={() => setMode('blank')}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          currentMode === 'blank'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Blank Canvas
      </button>
      <button
        onClick={() => setMode('branded')}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          currentMode === 'branded'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Brand Collection
      </button>
    </div>
  );
}

