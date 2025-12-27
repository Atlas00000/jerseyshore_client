/**
 * Material texture maps for PBR workflow
 */
export interface MaterialTextures {
  albedo?: string; // Albedo/Diffuse map URL
  normal?: string; // Normal map URL
  roughness?: string; // Roughness map URL
  metallic?: string; // Metallic map URL (optional)
  ao?: string; // Ambient occlusion map URL (optional)
}

/**
 * Material properties
 */
export interface MaterialProperties {
  name: string;
  category: 'cotton' | 'denim' | 'linen' | 'silk' | 'polyester' | 'blend' | 'wool' | 'leather' | 'satin' | 'velvet' | 'mesh' | 'technical' | 'other';
  textures: MaterialTextures;
  baseColor?: string; // Hex color for tinting
  roughness?: number; // 0-1, default 0.5
  metallic?: number; // 0-1, default 0
  priceModifier?: number; // Additional cost in dollars
  premium?: boolean; // Premium material flag
}

/**
 * Material library entry
 */
export interface Material {
  id: string;
  properties: MaterialProperties;
  thumbnailUrl?: string; // Preview thumbnail URL
}

/**
 * Material library type
 */
export type MaterialLibrary = Material[];

/**
 * Material cache key generator
 */
export function generateMaterialCacheKey(properties: MaterialProperties): string {
  const parts = [
    properties.name,
    properties.category,
    properties.baseColor || 'default',
    properties.roughness?.toString() || '0.5',
    properties.metallic?.toString() || '0',
    properties.textures.albedo || 'no-albedo',
    properties.textures.normal || 'no-normal',
    properties.textures.roughness || 'no-roughness',
  ];
  return parts.join('|');
}

