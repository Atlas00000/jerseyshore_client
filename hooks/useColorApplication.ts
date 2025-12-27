'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { ComponentType } from '@/types/models';
import { applyColor } from '@/lib/colorApplication';

interface UseColorApplicationResult {
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to apply color to 3D model components
 * @param meshes - Array of Three.js meshes to apply color to
 * @param componentType - The component type
 * @param color - The hex color to apply (null to reset)
 * @returns Loading state and error
 */
export function useColorApplication(
  meshes: THREE.Mesh[],
  componentType: ComponentType | null,
  color: string | null
): UseColorApplicationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!componentType || !color || meshes.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Apply color to all meshes
      meshes.forEach((mesh) => {
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          applyColor(mesh.material, color, 'replace');
        } else if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              applyColor(mat, color, 'replace');
            }
          });
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Error applying color:', err);
      setError(err instanceof Error ? err : new Error('Failed to apply color'));
      setIsLoading(false);
    }
  }, [meshes, componentType, color]);

  return { isLoading, error };
}

