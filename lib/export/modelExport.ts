import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';
import { logger } from '../logger';

/**
 * 3D Model Export Utility
 * Exports Three.js scene as GLB or GLTF file
 */

export interface ModelExportOptions {
  format?: 'glb' | 'gltf';
  filename?: string;
  binary?: boolean; // For GLTF, whether to export as binary
  includeMaterials?: boolean;
  includeTextures?: boolean;
}

/**
 * Export Three.js scene as GLB/GLTF
 */
export async function exportSceneAsModel(
  scene: THREE.Scene,
  options: ModelExportOptions = {}
): Promise<void> {
  const {
    format = 'glb',
    filename = `shirt-design-${Date.now()}`,
    binary = true,
    includeMaterials = true,
    includeTextures = true,
  } = options;

  try {
    const exporter = new GLTFExporter();

    const exportOptions = {
      binary: format === 'glb' || binary,
      trs: false, // Use matrix instead of position/rotation/scale
      onlyVisible: false, // Export all objects
      includeCustomExtensions: true,
    };

    // Export the scene
    const result = await new Promise<any>((resolve, reject) => {
      exporter.parse(
        scene,
        (gltf) => {
          resolve(gltf);
        },
        (error) => {
          reject(error);
        },
        exportOptions
      );
    });

    // Create blob and download
    let blob: Blob;
    let mimeType: string;
    let fileExtension: string;

    if (format === 'glb' || binary) {
      // GLB is always binary
      blob = new Blob([result], { type: 'model/gltf-binary' });
      mimeType = 'model/gltf-binary';
      fileExtension = 'glb';
    } else {
      // GLTF can be JSON or binary
      if (typeof result === 'string') {
        // JSON string
        blob = new Blob([result], { type: 'model/gltf+json' });
        mimeType = 'model/gltf+json';
      } else {
        // ArrayBuffer (binary GLTF)
        blob = new Blob([result], { type: 'model/gltf-binary' });
        mimeType = 'model/gltf-binary';
      }
      fileExtension = 'gltf';
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    logger.info('Scene exported as 3D model', {
      context: 'modelExport',
      metadata: { format, filename, fileExtension },
    });
  } catch (error) {
    logger.error('Failed to export scene as 3D model', {
      context: 'modelExport',
      error: error instanceof Error ? error : new Error(String(error)),
      metadata: { format, filename },
    });
    throw error;
  }
}

/**
 * Export specific object from scene
 */
export async function exportObjectAsModel(
  object: THREE.Object3D,
  options: ModelExportOptions = {}
): Promise<void> {
  // Create a temporary scene with just this object
  const tempScene = new THREE.Scene();
  tempScene.add(object.clone());

  return exportSceneAsModel(tempScene, options);
}

