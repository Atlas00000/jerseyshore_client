/**
 * Utility functions for inspecting mesh names in a 3D model
 * Helps identify mesh naming patterns for component mapping
 */

import * as THREE from 'three';
import { logger } from './logger';

/**
 * Inspect all mesh names in a 3D model and log them for debugging
 * @param model - The Three.js scene/group to inspect
 * @returns Object with mesh information
 */
export function inspectModelMeshes(model: THREE.Object3D | null): {
  meshNames: string[];
  meshDetails: Array<{ name: string; uuid: string; type: string }>;
} {
  if (!model) {
    return { meshNames: [], meshDetails: [] };
  }

  const meshNames: string[] = [];
  const meshDetails: Array<{ name: string; uuid: string; type: string }> = [];

  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const meshName = child.name || `unnamed_${child.uuid.substring(0, 8)}`;
      meshNames.push(meshName);
      meshDetails.push({
        name: meshName,
        uuid: child.uuid,
        type: child.type,
      });
    }
  });

  // Log all mesh names for easy inspection
  logger.info('Model mesh inspection', {
    context: 'meshInspector',
    metadata: {
      totalMeshes: meshNames.length,
      meshNames: meshNames.sort(), // Sort for easier reading
      meshDetails: meshDetails,
    },
  });

  // Also log to console for easy copy-paste
  console.group('🔍 Model Mesh Inspection');
  console.log('Total meshes:', meshNames.length);
  console.log('Mesh names (sorted):', meshNames.sort());
  console.table(meshDetails);
  console.groupEnd();

  return { meshNames, meshDetails };
}

/**
 * Suggest component mappings based on mesh name patterns
 * @param meshNames - Array of mesh names from the model
 * @returns Suggested mappings
 */
export function suggestComponentMappings(meshNames: string[]): Record<string, string[]> {
  const suggestions: Record<string, string[]> = {
    body: [],
    sleeves: [],
    collar: [],
    cuffs: [],
    buttons: [],
    placket: [],
    pocket: [],
    hem: [],
    other: [],
  };

  const normalizedNames = meshNames.map((name) => name.toLowerCase());

  normalizedNames.forEach((name, index) => {
    const originalName = meshNames[index];

    if (name.includes('body') || name.includes('torso') || name.includes('main')) {
      suggestions.body.push(originalName);
    } else if (name.includes('sleeve')) {
      if (name.includes('left') || name.includes('_l') || name.includes('l_')) {
        suggestions.sleeves.push(originalName);
      } else if (name.includes('right') || name.includes('_r') || name.includes('r_')) {
        suggestions.sleeves.push(originalName);
      } else {
        suggestions.sleeves.push(originalName);
      }
    } else if (name.includes('collar')) {
      suggestions.collar.push(originalName);
    } else if (name.includes('cuff')) {
      if (name.includes('left') || name.includes('_l')) {
        suggestions.cuffs.push(originalName);
      } else if (name.includes('right') || name.includes('_r')) {
        suggestions.cuffs.push(originalName);
      } else {
        suggestions.cuffs.push(originalName);
      }
    } else if (name.includes('button')) {
      suggestions.buttons.push(originalName);
    } else if (name.includes('placket')) {
      suggestions.placket.push(originalName);
    } else if (name.includes('pocket')) {
      suggestions.pocket.push(originalName);
    } else if (name.includes('hem')) {
      suggestions.hem.push(originalName);
    } else {
      suggestions.other.push(originalName);
    }
  });

  logger.info('Component mapping suggestions', {
    context: 'meshInspector',
    metadata: { suggestions },
  });

  console.group('💡 Suggested Component Mappings');
  Object.entries(suggestions).forEach(([category, names]) => {
    if (names.length > 0) {
      console.log(`${category}:`, names);
    }
  });
  console.groupEnd();

  return suggestions;
}



