'use client';

import { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { ComponentType, ComponentMap } from '@/types/models';
import { createComponentMap, getMeshesForComponent } from '@/lib/componentMapper';
import { inspectModelMeshes, suggestComponentMappings } from '@/lib/meshInspector';
import { logger } from '@/lib/logger';

interface UseComponentIsolationResult {
  componentMap: ComponentMap;
  components: Record<ComponentType, THREE.Object3D[]>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to identify and isolate components from a loaded 3D model
 * @param model - The loaded Three.js scene/group
 * @returns Component map and isolated component objects
 */
export function useComponentIsolation(
  model: THREE.Object3D | null
): UseComponentIsolationResult {
  const [componentMap, setComponentMap] = useState<ComponentMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Extract all mesh names from the model
  useEffect(() => {
    if (!model) {
      setComponentMap({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const meshNames: string[] = [];

      // Traverse the model to find all meshes
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Use the object name, or generate one if missing
          const meshName = child.name || `mesh_${child.uuid}`;
          meshNames.push(meshName);
        }
      });

      // Inspect meshes and get suggestions
      const inspection = inspectModelMeshes(model);
      const suggestions = suggestComponentMappings(meshNames);

      logger.info('Found meshes in model', {
        context: 'useComponentIsolation',
        metadata: {
          totalMeshes: meshNames.length,
          allMeshNames: meshNames, // Log ALL mesh names to see what we're working with
          suggestions, // Include mapping suggestions
        },
      });

      // Create component map from mesh names
      const map = createComponentMap(meshNames);
      setComponentMap(map);

      // Log for debugging
      logger.info('Component map created', {
        context: 'useComponentIsolation',
        metadata: {
          componentMap: map,
          mappedComponents: Object.keys(map).length,
          totalMeshes: meshNames.length,
          unmappedMeshes: meshNames.filter(name => !map[name]),
        },
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to isolate components');
      logger.error('Error isolating components', {
        context: 'useComponentIsolation',
        error,
      });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [model]);

  // Create isolated component objects
  const components = useMemo(() => {
    if (!model || !componentMap || Object.keys(componentMap).length === 0) {
      return {} as Record<ComponentType, THREE.Object3D[]>;
    }

    const isolated: Record<ComponentType, THREE.Object3D[]> = {} as Record<
      ComponentType,
      THREE.Object3D[]
    >;

    // Initialize all component types
    Object.values(ComponentType).forEach((type) => {
      isolated[type] = [];
    });

    // Find and group meshes by component type
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name || `mesh_${child.uuid}`;
        const componentType = componentMap[meshName];

        if (componentType) {
          if (!isolated[componentType]) {
            isolated[componentType] = [];
          }
          isolated[componentType].push(child);
        }
      }
    });

    return isolated;
  }, [model, componentMap]);

  return {
    componentMap,
    components,
    isLoading,
    error,
  };
}

