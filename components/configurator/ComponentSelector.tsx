'use client';

/**
 * ComponentSelector Component
 * Card-based selection with hover effects, selected state with glow, and icon support
 */

import React from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ComponentType } from '@/types/models';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HoverScale } from '@/lib/animations/framerMotion';

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

const COMPONENT_ICONS: Record<ComponentType, React.ReactNode> = {
  [ComponentType.BODY]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  [ComponentType.SLEEVE_LEFT]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [ComponentType.SLEEVE_RIGHT]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [ComponentType.COLLAR]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  ),
  [ComponentType.CUFF_LEFT]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [ComponentType.CUFF_RIGHT]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [ComponentType.BUTTONS]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  ),
  [ComponentType.PLACKET]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  [ComponentType.POCKET]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  [ComponentType.HEM]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
};

export function ComponentSelector() {
  const { componentMap, selectedComponent, setComponent } = useConfiguratorStore();

  // Get available components from the component map
  const availableComponents = Array.from(
    new Set(Object.values(componentMap))
  ) as ComponentType[];

  if (availableComponents.length === 0) {
    return (
      <Card variant="standard">
        <div className="p-4 text-center">
          <p className="text-small text-text-tertiary">
            No components available. Load a model first.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {availableComponents.map((component) => {
          const isSelected = selectedComponent === component;
          const label = COMPONENT_LABELS[component] || component;
          const icon = COMPONENT_ICONS[component];

          return (
            <HoverScale key={component} scale={1.02}>
              <button
                onClick={() => setComponent(component === selectedComponent ? null : component)}
                className={`
                  relative p-3 rounded-medium border-2 transition-smooth
                  ${
                    isSelected
                      ? 'border-accent-blue bg-accent-blue/5 shadow-glow-primary'
                      : 'border-base-light-gray bg-white hover:border-accent-cyan hover:bg-base-light-gray'
                  }
                `}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`
                    mb-2 flex items-center justify-center
                    ${isSelected ? 'text-accent-blue' : 'text-text-secondary'}
                  `}
                >
                  {icon}
                </div>

                {/* Label */}
                <p
                  className={`
                    text-tiny font-medium text-center
                    ${isSelected ? 'text-accent-blue' : 'text-text-secondary'}
                  `}
                >
                  {label}
                </p>
              </button>
            </HoverScale>
          );
        })}
      </div>

      {/* Selected component info */}
      {selectedComponent && (
        <Card variant="standard" className="p-3 bg-accent-blue/5 border-accent-blue/20">
          <div className="flex items-center gap-2">
            <div className="text-accent-blue">
              {COMPONENT_ICONS[selectedComponent]}
            </div>
            <div>
              <p className="text-small font-medium text-text-primary">
                Selected: {COMPONENT_LABELS[selectedComponent]}
              </p>
              <p className="text-tiny text-text-secondary">
                Customize this component
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
