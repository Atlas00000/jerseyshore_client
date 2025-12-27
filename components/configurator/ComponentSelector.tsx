'use client';

import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ComponentType } from '@/types/models';

const COMPONENT_LABELS: Record<ComponentType, string> = {
  [ComponentType.BODY]: 'Body',
  [ComponentType.SLEEVE_LEFT]: 'Left Sleeve',
  [ComponentType.SLEEVE_RIGHT]: 'Right Sleeve',
  [ComponentType.COLLAR]: 'Collar',
  [ComponentType.CUFF_LEFT]: 'Left Cuff',
  [ComponentType.CUFF_RIGHT]: 'Right Cuff',
  [ComponentType.BUTTONS]: 'Buttons',
  [ComponentType.PLACKET]: 'Placket',
  [ComponentType.POCKET]: 'Pocket',
  [ComponentType.HEM]: 'Hem',
};

export function ComponentSelector() {
  const { componentMap, selectedComponent, setComponent } = useConfiguratorStore();

  // Get available components from the component map
  const availableComponents = Array.from(
    new Set(Object.values(componentMap))
  ) as ComponentType[];

  if (availableComponents.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">No components available. Load a model first.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Select Component</h3>
      <div className="flex flex-wrap gap-2">
        {availableComponents.map((component) => (
          <button
            key={component}
            onClick={() => setComponent(component === selectedComponent ? null : component)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedComponent === component
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {COMPONENT_LABELS[component] || component}
          </button>
        ))}
      </div>
      {selectedComponent && (
        <p className="mt-3 text-sm text-gray-600">
          Selected: <span className="font-medium">{COMPONENT_LABELS[selectedComponent]}</span>
        </p>
      )}
    </div>
  );
}

