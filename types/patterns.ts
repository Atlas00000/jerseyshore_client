/**
 * Pattern texture configuration
 */
export interface PatternTextures {
  diffuse?: string; // Pattern texture URL
  normal?: string; // Normal map for pattern (optional)
}

/**
 * Pattern properties
 */
export interface PatternProperties {
  name: string;
  category: 'stripes' | 'checks' | 'dots' | 'geometric' | 'abstract' | 'floral' | 'other';
  textures: PatternTextures;
  defaultIntensity?: number; // 0-1, default opacity
  defaultScale?: number; // Pattern scale/repetition
  defaultRotation?: number; // Rotation in degrees (0-360)
  priceModifier?: number; // Additional cost in dollars
}

/**
 * Pattern library entry
 */
export interface Pattern {
  id: string;
  properties: PatternProperties;
  thumbnailUrl?: string; // Preview thumbnail URL
}

/**
 * Pattern library type
 */
export type PatternLibrary = Pattern[];

/**
 * Pattern application settings for a component
 */
export interface PatternApplication {
  patternId: string;
  intensity: number; // 0-1
  scale: number;
  rotation: number; // 0-360 degrees
}

