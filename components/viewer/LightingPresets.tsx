'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { LIGHTING_PRESETS, LightingPreset } from '@/lib/lightingPresets';

interface LightingPresetsProps {
  preset: string;
}

/**
 * Component to apply lighting preset to the scene
 */
export function LightingPresets({ preset }: LightingPresetsProps) {
  const { scene } = useThree();

  useEffect(() => {
    const lightingPreset = LIGHTING_PRESETS[preset];
    if (!lightingPreset) return;

    // Clear existing lights
    const lightsToRemove: any[] = [];
    scene.traverse((object: any) => {
      if (
        object instanceof THREE.AmbientLight ||
        object instanceof THREE.DirectionalLight ||
        object instanceof THREE.HemisphereLight
      ) {
        lightsToRemove.push(object);
      }
    });
    lightsToRemove.forEach((light) => scene.remove(light));

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(
      lightingPreset.ambient.color,
      lightingPreset.ambient.intensity
    );
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(
      lightingPreset.directional.color,
      lightingPreset.directional.intensity
    );
    directionalLight.position.set(...lightingPreset.directional.position);
    scene.add(directionalLight);

    // Add hemisphere light if specified
    if (lightingPreset.hemisphere) {
      const hemisphereLight = new THREE.HemisphereLight(
        lightingPreset.hemisphere.color,
        lightingPreset.hemisphere.groundColor,
        lightingPreset.hemisphere.intensity
      );
      scene.add(hemisphereLight);
    }
  }, [preset, scene]);

  return null;
}

// UI component for lighting preset buttons
export function LightingPresetButtons({
  currentPreset,
  onPresetChange,
}: {
  currentPreset: string;
  onPresetChange: (preset: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg shadow-sm">
      {Object.entries(LIGHTING_PRESETS).map(([key, preset]) => (
        <button
          key={key}
          onClick={() => onPresetChange(key)}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            currentPreset === key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
}

