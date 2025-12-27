'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { CAMERA_PRESETS } from '@/lib/cameraPresets';
import * as THREE from 'three';

interface CameraPresetsProps {
  preset: string;
}

export function CameraPresets({ preset }: CameraPresetsProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const presetConfig = CAMERA_PRESETS[preset];
    if (!presetConfig) return;

    // Find OrbitControls in the scene
    const findControls = () => {
      // This is a simplified approach - in production, you'd use a ref or context
      // For now, we'll animate the camera directly
    };

    // Smoothly transition camera
    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(...presetConfig.position);

    const duration = 1000; // 1 second
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      camera.position.lerpVectors(startPosition, endPosition, easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [preset, camera]);

  return null;
}

// Separate UI component for preset buttons (used outside Canvas)
export function CameraPresetButtons({
  onPresetChange,
}: {
  onPresetChange?: (preset: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
        <button
          key={key}
          onClick={() => onPresetChange?.(key)}
          className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
}

