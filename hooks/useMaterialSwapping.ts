'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { ComponentType } from '@/types/models';
import { Material, MaterialLibrary } from '@/types/materials';
import { materialManager } from '@/lib/materialManager';
import materialsData from '@/data/materials.json';

interface UseMaterialSwappingResult {
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to swap materials on 3D model components
 * @param meshes - Array of Three.js meshes to apply material to
 * @param componentType - The component type
 * @param materialId - The material ID to apply (null to remove)
 * @returns Loading state and error
 */
export function useMaterialSwapping(
  meshes: THREE.Mesh[],
  componentType: ComponentType | null,
  materialId: string | null
): UseMaterialSwappingResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!componentType || !materialId || meshes.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Find material in library
    const materials = materialsData.materials as MaterialLibrary;
    const material = materials.find((m) => m.id === materialId);

    if (!material) {
      setError(new Error(`Material with ID ${materialId} not found`));
      setIsLoading(false);
      return;
    }

    // Get or create material from manager
    materialManager
      .getMaterial(material.properties)
      .then((threeMaterial) => {
        // Apply material to all meshes
        meshes.forEach((mesh) => {
          mesh.material = threeMaterial;
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error applying material:', err);
        setError(err instanceof Error ? err : new Error('Failed to apply material'));
        setIsLoading(false);
      });
  }, [meshes, componentType, materialId]);

  return { isLoading, error };
}

