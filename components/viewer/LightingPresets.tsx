'use client';

/**
 * LightingPresets Component
 * Preset selector UI with visual previews and smooth transitions
 */

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { LIGHTING_PRESETS, LightingPreset } from '@/lib/lightingPresets';
import { Button } from '@/components/ui/Button';
import { HoverScale } from '@/lib/animations/framerMotion';

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
  const lightingIcons: Record<string, React.ReactNode> = {
    studio: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    outdoor: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    indoor: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    showroom: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    dramatic: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(LIGHTING_PRESETS).map(([key, preset]) => {
        const isActive = currentPreset === key;
        const icon = lightingIcons[key] || lightingIcons.studio;

        return (
          <HoverScale key={key} scale={1.05}>
            <Button
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPresetChange(key)}
              icon={icon}
              className={isActive ? 'shadow-elevation-1' : ''}
            >
              {preset.name}
            </Button>
          </HoverScale>
        );
      })}
    </div>
  );
}
