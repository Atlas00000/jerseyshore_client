'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ComponentType, ComponentMap } from '@/types/models';
import { logger } from '@/lib/logger';

/**
 * Hook to highlight/isolate a selected component in the 3D scene
 * Uses outline effect to visually distinguish the selected component
 * @param selectedComponent - The currently selected component type
 * @param sceneGroup - The root group containing the cloned model in the scene
 * @param componentMap - Map of mesh names to component types
 */
export function useComponentHighlight(
  selectedComponent: ComponentType | null,
  sceneGroup: THREE.Group | null,
  componentMap: ComponentMap
) {
  const previousHighlightRef = useRef<THREE.Mesh[]>([]);
  const outlineMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    // Clean up previous highlight
    previousHighlightRef.current.forEach((mesh) => {
      if (mesh.userData.originalMaterial) {
        mesh.material = mesh.userData.originalMaterial;
        delete mesh.userData.originalMaterial;
      }
      // Remove outline effect
      if (mesh.userData.outlineMesh) {
        const outlineMesh = mesh.userData.outlineMesh;
        if (outlineMesh.parent) {
          outlineMesh.parent.remove(outlineMesh);
        }
        outlineMesh.geometry.dispose();
        if (outlineMesh.material instanceof THREE.Material) {
          outlineMesh.material.dispose();
        }
        delete mesh.userData.outlineMesh;
      }
    });
    previousHighlightRef.current = [];

    // If no component selected or no scene, we're done
    if (!selectedComponent || !sceneGroup) {
      return;
    }

    // Find all meshes in the scene that belong to the selected component
    const meshes: THREE.Mesh[] = [];
    sceneGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name || `mesh_${child.uuid}`;
        const componentType = componentMap[meshName];
        if (componentType === selectedComponent) {
          meshes.push(child);
        }
      }
    });

    if (meshes.length === 0) {
      logger.warn('No meshes found for selected component', {
        context: 'useComponentHighlight',
        metadata: { selectedComponent, componentMapKeys: Object.keys(componentMap).length },
      });
      return;
    }

    logger.info('Highlighting component', {
      context: 'useComponentHighlight',
      metadata: { selectedComponent, meshCount: meshes.length },
    });

    // Create outline material if it doesn't exist
    if (!outlineMaterialRef.current) {
      outlineMaterialRef.current = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        side: THREE.BackSide,
      });
    }

    // Apply highlight to each mesh
    meshes.forEach((mesh) => {
      // Store original material
      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material;
      }

      // Create outline effect using a slightly larger version of the mesh
      const outlineGeometry = mesh.geometry.clone();
      const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterialRef.current);
      outlineMesh.scale.multiplyScalar(1.02); // Slightly larger for outline effect
      outlineMesh.position.copy(mesh.position);
      outlineMesh.rotation.copy(mesh.rotation);
      outlineMesh.scale.copy(mesh.scale);

      // Add outline mesh to the same parent
      if (mesh.parent) {
        mesh.parent.add(outlineMesh);
        mesh.userData.outlineMesh = outlineMesh;
      }

      // Also slightly brighten the original mesh
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissive.setHex(0x004466);
        mesh.material.emissiveIntensity = 0.3;
      }
    });

    previousHighlightRef.current = meshes;

    // Cleanup function
    return () => {
      meshes.forEach((mesh) => {
        if (mesh.userData.originalMaterial) {
          mesh.material = mesh.userData.originalMaterial;
          delete mesh.userData.originalMaterial;
        }
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.emissive.setHex(0x000000);
          mesh.material.emissiveIntensity = 0;
        }
        if (mesh.userData.outlineMesh) {
          const outlineMesh = mesh.userData.outlineMesh;
          if (outlineMesh.parent) {
            outlineMesh.parent.remove(outlineMesh);
          }
          outlineMesh.geometry.dispose();
          if (outlineMesh.material instanceof THREE.Material) {
            outlineMesh.material.dispose();
          }
          delete mesh.userData.outlineMesh;
        }
      });
    };
  }, [selectedComponent, sceneGroup, componentMap]);
}

