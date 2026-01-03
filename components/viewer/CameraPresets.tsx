'use client';

/**
 * CameraPresets Component
 * Preset selector UI with visual previews and smooth transitions
 */

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { CAMERA_PRESETS } from '@/lib/cameraPresets';
import * as THREE from 'three';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HoverScale } from '@/lib/animations/framerMotion';

interface CameraPresetsProps {
  preset: string;
}

export function CameraPresets({ preset }: CameraPresetsProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const presetConfig = CAMERA_PRESETS[preset];
    if (!presetConfig) return;

    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(...presetConfig.position);

    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPosition, endPosition, easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [preset, camera]);

  return null;
}

// UI component for preset buttons
export function CameraPresetButtons({
  onPresetChange,
  currentPreset,
}: {
  onPresetChange?: (preset: string) => void;
  currentPreset?: string;
}) {
  const cameraIcons: Record<string, React.ReactNode> = {
    front: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    back: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ),
    left: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    ),
    right: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    ),
    top: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    detail: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    threeQuarter: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(CAMERA_PRESETS).map(([key, preset]) => {
        const isActive = currentPreset === key;
        const icon = cameraIcons[key] || cameraIcons.front;

        return (
          <HoverScale key={key} scale={1.05}>
            <Button
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPresetChange?.(key)}
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
