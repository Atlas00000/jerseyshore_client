/**
 * Component types for shirt parts
 */
export enum ComponentType {
  BODY = 'body',
  SLEEVE_LEFT = 'sleeve_left',
  SLEEVE_RIGHT = 'sleeve_right',
  COLLAR = 'collar',
  CUFF_LEFT = 'cuff_left',
  CUFF_RIGHT = 'cuff_right',
  BUTTONS = 'buttons',
  PLACKET = 'placket',
  POCKET = 'pocket',
  HEM = 'hem',
}

/**
 * Mapping of mesh names to component types
 * This will be populated based on the actual model structure
 */
export interface ComponentMap {
  [meshName: string]: ComponentType;
}

/**
 * Shirt model configuration
 */
export interface ShirtModel {
  id: string;
  name: string;
  type: 'blank' | 'branded';
  brand?: string;
  modelUrl: string;
  thumbnailUrl?: string;
  components: ComponentMap;
  constraints?: BrandConstraints;
  lodUrls?: {
    lod0: string;
    lod1: string;
    lod2: string;
  };
}

/**
 * Brand-specific constraints (for branded models)
 */
export interface BrandConstraints {
  logoPlacement?: 'fixed' | 'removable';
  availableColors?: string[];
  materialRestrictions?: string[];
}

