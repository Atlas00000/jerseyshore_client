'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useModelLoader } from '@/hooks/useModelLoader';
import { useComponentIsolation } from '@/hooks/useComponentIsolation';
import { useComponentHighlight } from '@/hooks/useComponentHighlight';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ComponentType } from '@/types/models';
import { MaterialLibrary } from '@/types/materials';
import { materialManager } from '@/lib/materialManager';
import { printTextureManager } from '@/lib/printTextureManager';
import { PrintZoneGuides } from './PrintZoneGuides';
import { logger } from '@/lib/logger';
import materialsData from '@/data/materials.json';
import * as THREE from 'three';

interface ModelLoaderProps {
  modelPath: string | null;
}

export function ModelLoader({ modelPath }: ModelLoaderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [sceneGroup, setSceneGroup] = useState<THREE.Group | null>(null);
  const { model, loading, error } = useModelLoader(modelPath);
  const { componentMap, components, isLoading: isIsolating } = useComponentIsolation(model);
  const { setComponentMap, materialMap, colorMap, selectedComponent, printMap } = useConfiguratorStore();


  // Apply component highlighting - pass the scene group and component map
  useComponentHighlight(selectedComponent, sceneGroup, componentMap);

  // Store component map in global store when it's ready
  useEffect(() => {
    if (componentMap && Object.keys(componentMap).length > 0) {
      logger.info('Component map ready, storing in global state', {
        context: 'ModelLoader',
        metadata: {
          componentCount: Object.keys(componentMap).length,
          components: Object.keys(componentMap),
        },
      });
      setComponentMap(componentMap);
    } else if (model && !isIsolating) {
      logger.warn('Model loaded but no components found', {
        context: 'ModelLoader',
        metadata: { modelPath, hasModel: !!model },
      });
    }
  }, [componentMap, setComponentMap, model, isIsolating, modelPath]);

  // Helper function to find meshes in the scene by component type
  const findMeshesInScene = useCallback((componentType: ComponentType): THREE.Mesh[] => {
    if (!sceneGroup || !componentMap) return [];
    
    const meshes: THREE.Mesh[] = [];
    sceneGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name || `mesh_${child.uuid}`;
        const mappedComponent = componentMap[meshName];
        if (mappedComponent === componentType) {
          meshes.push(child);
        }
      }
    });
    return meshes;
  }, [sceneGroup, componentMap]);

  // Apply materials to components
  useEffect(() => {
    if (!sceneGroup || !componentMap || Object.keys(componentMap).length === 0) {
      return;
    }

    const materials = materialsData.materials as MaterialLibrary;

    // Apply materials for each component type
    Object.entries(materialMap).forEach(async ([componentType, materialId]) => {
      if (materialId) {
        const meshes = findMeshesInScene(componentType as ComponentType);
        const material = materials.find((m) => m.id === materialId);
        const color = colorMap[componentType as ComponentType];

        if (material && meshes.length > 0) {
          try {
            const threeMaterial = await materialManager.getMaterial(
              material.properties,
              color || undefined
            );
            meshes.forEach((mesh) => {
              mesh.material = threeMaterial;
            });
            logger.info('Material applied successfully', {
              context: 'ModelLoader',
              metadata: { componentType, materialId, hasColor: !!color, meshCount: meshes.length },
            });
          } catch (err) {
            logger.error('Error applying material', {
              context: 'ModelLoader',
              error: err instanceof Error ? err : new Error(String(err)),
              metadata: { componentType, materialId },
            });
          }
        }
      }
    });
  }, [sceneGroup, componentMap, materialMap, colorMap]);

  // Apply colors to components (when no material is set, or update existing material color)
  useEffect(() => {
    if (!sceneGroup || !componentMap || Object.keys(componentMap).length === 0) {
      return;
    }

    Object.entries(colorMap).forEach(([componentType, color]) => {
      if (color) {
        const meshes = findMeshesInScene(componentType as ComponentType);
        const materialId = materialMap[componentType as ComponentType];

        if (meshes.length > 0) {
          meshes.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
              if (rgb) {
                // If no material is set, just update the color
                // If material is set, update the color (materialManager should handle tinting, but we can also update directly)
                mesh.material.color.setRGB(
                  parseInt(rgb[1], 16) / 255,
                  parseInt(rgb[2], 16) / 255,
                  parseInt(rgb[3], 16) / 255
                );
                logger.debug('Color applied to mesh', {
                  context: 'ModelLoader',
                  metadata: { componentType, color, meshName: mesh.name },
                });
              }
            }
          });
        }
      }
    });
  }, [sceneGroup, componentMap, colorMap, materialMap]);

  // Apply print textures to components
  useEffect(() => {
    if (!sceneGroup || !componentMap || Object.keys(componentMap).length === 0) {
      return;
    }

    // Process all components (both with and without prints)
    const allComponents = new Set([
      ...Object.keys(printMap),
      ...Object.values(componentMap),
    ]) as Set<ComponentType>;

    allComponents.forEach(async (componentType) => {
      const prints = printMap[componentType] || [];
      const meshes = findMeshesInScene(componentType);
      if (meshes.length === 0) return;

      try {
        if (prints.length > 0) {
          // Apply print textures (multiple prints per component)
          const firstMesh = meshes[0];
          let baseTexture: THREE.Texture | null = null;
          
          if (firstMesh.material instanceof THREE.MeshStandardMaterial) {
            // Store original texture if not already stored
            if (!firstMesh.userData.originalTexture) {
              firstMesh.userData.originalTexture = firstMesh.material.map;
            }
            baseTexture = firstMesh.userData.originalTexture || firstMesh.material.map;
          }

          // Create composite texture with all print overlays
          const compositeTexture = await printTextureManager.createCompositeTexture(
            baseTexture,
            prints,
            componentType
          );

          // Apply composite texture to all meshes
          meshes.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              mesh.material.map = compositeTexture;
              mesh.material.needsUpdate = true;
            }
          });

          logger.info('Print textures applied successfully', {
            context: 'ModelLoader',
            metadata: {
              componentType,
              printCount: prints.length,
              printIds: prints.map(p => p.id),
              meshCount: meshes.length,
            },
          });
        } else {
          // Remove prints - restore original texture
          meshes.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              // Restore original texture if stored
              if (mesh.userData.originalTexture) {
                mesh.material.map = mesh.userData.originalTexture;
                mesh.material.needsUpdate = true;
                delete mesh.userData.originalTexture;
              } else {
                // Clear texture if no original stored
                mesh.material.map = null;
                mesh.material.needsUpdate = true;
              }
            }
          });

          logger.info('Prints removed, texture restored', {
            context: 'ModelLoader',
            metadata: { componentType, meshCount: meshes.length },
          });
        }
      } catch (err) {
        logger.error('Error applying/removing print textures', {
          context: 'ModelLoader',
          error: err instanceof Error ? err : new Error(String(err)),
          metadata: { componentType, printCount: prints.length },
        });
      }
    });
  }, [sceneGroup, componentMap, printMap, findMeshesInScene]);

  // Auto-rotate the model (optional)
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Optional: Add subtle rotation
      // groupRef.current.rotation.y += delta * 0.1;
    }
  });

  useEffect(() => {
    if (model && groupRef.current) {
      logger.info('Adding model to scene', {
        context: 'ModelLoader',
        metadata: { modelPath, childrenCount: model.children.length },
      });

      // Clear previous model
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }

      // Clone the model to avoid mutating the original
      const clonedModel = model.clone();
      groupRef.current.add(clonedModel);

      // Update sceneGroup state so highlighting can work
      setSceneGroup(groupRef.current);

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(clonedModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim;

      clonedModel.scale.multiplyScalar(scale);
      clonedModel.position.sub(center.multiplyScalar(scale));

      logger.info('Model positioned and scaled', {
        context: 'ModelLoader',
        metadata: { scale, center: [center.x, center.y, center.z] },
      });
    } else if (!model) {
      // Clear sceneGroup when model is removed
      setSceneGroup(null);
    }
  }, [model, modelPath]);

  // Log errors
  useEffect(() => {
    if (error) {
      logger.error('Model loading failed', {
        context: 'ModelLoader',
        error,
        metadata: { modelPath },
      });
    }
  }, [error, modelPath]);

  // Log current state
  useEffect(() => {
    logger.debug('ModelLoader state', {
      context: 'ModelLoader',
      metadata: {
        loading,
        hasModel: !!model,
        isIsolating,
        hasError: !!error,
        modelPath,
        componentMapKeys: componentMap ? Object.keys(componentMap).length : 0,
      },
    });
  }, [loading, model, isIsolating, error, modelPath, componentMap]);

  // Don't render if loading, error, or no model
  if (loading || !model || isIsolating) {
    logger.debug('ModelLoader: Not rendering (loading/isolating)', {
      context: 'ModelLoader',
      metadata: { loading, hasModel: !!model, isIsolating },
    });
    return null; // Loading is handled by Suspense fallback
  }

  if (error) {
    logger.error('ModelLoader: Not rendering (error)', {
      context: 'ModelLoader',
      error,
    });
    return null;
  }

  logger.info('ModelLoader: Rendering model', {
    context: 'ModelLoader',
    metadata: { modelPath },
  });

  // Get selected zone ID from store for highlighting (get from first print if any)
  const selectedZoneId = selectedComponent && printMap[selectedComponent]?.length > 0
    ? printMap[selectedComponent][0].zoneId || null
    : null;

  return (
    <>
      <group ref={groupRef} />
      <PrintZoneGuides
        modelGroup={sceneGroup}
        showGuides={!!selectedComponent}
        highlightZoneId={selectedZoneId}
      />
    </>
  );
}

