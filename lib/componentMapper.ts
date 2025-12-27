import { ComponentType, ComponentMap } from '@/types/models';

/**
 * Component mapping for the t-shirt model
 * Based on actual mesh names from the GLB file:
 * - Numbered meshes (28, 29, 30, 31, 64, 70, 71) represent different shirt parts
 * - Pattern2D_* meshes are pattern/texture overlays (map to same components)
 * - StitchMatShape_* meshes are stitching details (can be mapped to relevant parts)
 * 
 * Note: The exact mapping may need adjustment based on visual inspection of the model.
 * This is an initial mapping based on common shirt structure.
 */
const DEFAULT_COMPONENT_MAPPING: Record<string, ComponentType> = {
  // Body variations - traditional naming
  body: ComponentType.BODY,
  shirt_body: ComponentType.BODY,
  main_body: ComponentType.BODY,
  torso: ComponentType.BODY,
  
  // Body - based on mesh IDs (likely main body parts)
  // Mesh 28, 30, 31, 64, 70 appear to be body sections
  '28_knit_fleece_terry_front_109192_0': ComponentType.BODY,
  '30_knit_fleece_terry_front_109192_0': ComponentType.BODY,
  '31_knit_fleece_terry_front_109192_0': ComponentType.BODY,
  '64_knit_fleece_terry_front_109192_0': ComponentType.BODY,
  '70_knit_fleece_terry_front_109192_0': ComponentType.BODY,

  // Left sleeve variations - traditional naming
  sleeve_left: ComponentType.SLEEVE_LEFT,
  left_sleeve: ComponentType.SLEEVE_LEFT,
  sleeve_L: ComponentType.SLEEVE_LEFT,
  'sleeve-left': ComponentType.SLEEVE_LEFT,

  // Right sleeve variations - traditional naming
  sleeve_right: ComponentType.SLEEVE_RIGHT,
  right_sleeve: ComponentType.SLEEVE_RIGHT,
  sleeve_R: ComponentType.SLEEVE_RIGHT,
  'sleeve-right': ComponentType.SLEEVE_RIGHT,
  
  // Sleeves - mesh 29 and 71 might be sleeves (Copy_1 suggests duplicate/variant)
  '29_knit_fleece_terry_copy_1_front_109203_0': ComponentType.SLEEVE_LEFT,
  '71_knit_fleece_terry_copy_1_front_109203_0': ComponentType.SLEEVE_RIGHT,

  // Collar variations
  collar: ComponentType.COLLAR,
  shirt_collar: ComponentType.COLLAR,
  neck_collar: ComponentType.COLLAR,

  // Left cuff variations
  cuff_left: ComponentType.CUFF_LEFT,
  left_cuff: ComponentType.CUFF_LEFT,
  cuff_L: ComponentType.CUFF_LEFT,
  'cuff-left': ComponentType.CUFF_LEFT,

  // Right cuff variations
  cuff_right: ComponentType.CUFF_RIGHT,
  right_cuff: ComponentType.CUFF_RIGHT,
  cuff_R: ComponentType.CUFF_RIGHT,
  'cuff-right': ComponentType.CUFF_RIGHT,

  // Buttons
  buttons: ComponentType.BUTTONS,
  button_group: ComponentType.BUTTONS,
  shirt_buttons: ComponentType.BUTTONS,

  // Placket
  placket: ComponentType.PLACKET,
  front_placket: ComponentType.PLACKET,
  button_placket: ComponentType.PLACKET,

  // Pocket
  pocket: ComponentType.POCKET,
  chest_pocket: ComponentType.POCKET,
  front_pocket: ComponentType.POCKET,

  // Hem
  hem: ComponentType.HEM,
  bottom_hem: ComponentType.HEM,
  shirt_hem: ComponentType.HEM,
};

/**
 * Map mesh names to component types
 * @param meshName - Name of the mesh from the 3D model
 * @returns ComponentType or null if not found
 */
export function mapMeshToComponent(meshName: string): ComponentType | null {
  // Normalize mesh name (lowercase, remove spaces, handle various formats)
  const normalized = meshName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');

  // Direct match
  if (DEFAULT_COMPONENT_MAPPING[normalized]) {
    return DEFAULT_COMPONENT_MAPPING[normalized];
  }

  // Handle mesh name variants (with _0, _1, _2 suffixes)
  // Remove numeric suffixes for matching
  const baseName = normalized.replace(/_\d+$/, '');
  if (DEFAULT_COMPONENT_MAPPING[baseName]) {
    return DEFAULT_COMPONENT_MAPPING[baseName];
  }

  // Handle Pattern2D meshes - map to same component as their base mesh
  // Pattern2D meshes correspond to numbered meshes and should map to the same component
  if (normalized.startsWith('pattern2d_')) {
    // Pattern2D meshes have the same structure as base meshes
    // Pattern2D_2949190_Knit_Fleece_Terry_FRONT_109192_0 corresponds to body meshes (109192)
    // Pattern2D_*_Knit_Fleece_Terry_Copy_1_FRONT_109203_0 corresponds to sleeve meshes (109203)
    
    // Check if it's a Copy_1 pattern (sleeves)
    if (normalized.includes('copy_1') && normalized.includes('109203')) {
      // Determine left vs right based on pattern ID ranges or other heuristics
      // Pattern2D_4474558 and Pattern2D_4491756 appear to be for different sleeves
      // For now, we'll use a simple heuristic: check pattern ID
      const patternIdMatch = normalized.match(/pattern2d_(\d+)_/);
      if (patternIdMatch) {
        const patternId = parseInt(patternIdMatch[1], 10);
        // Heuristic: lower IDs might be left, higher might be right
        // This can be adjusted based on actual model inspection
        if (patternId >= 4490000) {
          return ComponentType.SLEEVE_RIGHT;
        }
        return ComponentType.SLEEVE_LEFT;
      }
      // Default to left if we can't determine
      return ComponentType.SLEEVE_LEFT;
    } else if (normalized.includes('109192')) {
      // Front pattern (109192), likely body
      return ComponentType.BODY;
    }
  }

  // Handle StitchMatShape meshes - these are stitching details
  // Map them to relevant components based on context
  // For now, we'll skip them or map to body (can be refined)
  if (normalized.startsWith('stitchmatshape_')) {
    // Stitching details - could be mapped to various components
    // For MVP, we'll skip these or map to body
    // return ComponentType.BODY; // Uncomment if you want to include stitching
    return null; // Skip stitching details for now
  }

  // Partial match (e.g., "shirt_body_001" matches "body")
  for (const [key, componentType] of Object.entries(DEFAULT_COMPONENT_MAPPING)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return componentType;
    }
  }

  // Try matching by mesh number pattern (e.g., "28_", "30_", etc.)
  const numberMatch = normalized.match(/^(\d+)_/);
  if (numberMatch) {
    const meshNumber = numberMatch[1];
    // Map based on mesh number ranges (adjust based on actual model structure)
    const num = parseInt(meshNumber, 10);
    if (num === 28 || num === 30 || num === 31 || num === 64 || num === 70) {
      return ComponentType.BODY;
    }
    if (num === 29) {
      return ComponentType.SLEEVE_LEFT;
    }
    if (num === 71) {
      return ComponentType.SLEEVE_RIGHT;
    }
  }

  return null;
}

/**
 * Create a component map from an array of mesh names
 * @param meshNames - Array of mesh names from the 3D model
 * @returns ComponentMap with mapped components
 */
export function createComponentMap(meshNames: string[]): ComponentMap {
  const componentMap: ComponentMap = {};

  for (const meshName of meshNames) {
    const componentType = mapMeshToComponent(meshName);
    if (componentType) {
      componentMap[meshName] = componentType;
    }
  }

  return componentMap;
}

/**
 * Get all mesh names for a specific component type
 * @param componentMap - The component map
 * @param componentType - The component type to find
 * @returns Array of mesh names that match the component type
 */
export function getMeshesForComponent(
  componentMap: ComponentMap,
  componentType: ComponentType
): string[] {
  return Object.entries(componentMap)
    .filter(([_, type]) => type === componentType)
    .map(([meshName]) => meshName);
}

