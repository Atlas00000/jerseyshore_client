import * as THREE from 'three';
import { PatternProperties, PatternApplication } from '@/types/patterns';
import { loadTexture, disposeTexture } from './textureLoader';

/**
 * Pattern Manager class for applying patterns to materials
 */
class PatternManager {
  private patternCache: Map<string, THREE.Texture> = new Map();

  /**
   * Apply pattern to a material
   * @param material - Three.js material to apply pattern to
   * @param pattern - Pattern properties
   * @param application - Pattern application settings
   */
  async applyPattern(
    material: THREE.MeshStandardMaterial,
    pattern: PatternProperties,
    application: PatternApplication
  ): Promise<void> {
    try {
      // Load pattern texture
      const texture = await this.getPatternTexture(pattern.textures.diffuse || '');

      if (texture) {
        // Clone texture to avoid affecting other materials
        const patternTexture = texture.clone();

        // Apply pattern settings
        patternTexture.wrapS = THREE.RepeatWrapping;
        patternTexture.wrapT = THREE.RepeatWrapping;
        patternTexture.repeat.set(application.scale, application.scale);
        patternTexture.rotation = (application.rotation * Math.PI) / 180; // Convert to radians

        // Apply as overlay on existing map or as new map
        if (material.map) {
          // Blend pattern with existing texture
          material.map = this.blendTextures(material.map, patternTexture, application.intensity);
        } else {
          // Use pattern as base texture
          material.map = patternTexture;
          material.map.alphaTest = 0.1;
        }

        // Load normal map if available
        if (pattern.textures.normal) {
          const normalTexture = await this.getPatternTexture(pattern.textures.normal);
          if (normalTexture) {
            material.normalMap = normalTexture.clone();
            material.normalMapType = THREE.TangentSpaceNormalMap;
          }
        }
      }
    } catch (error) {
      console.error('Error applying pattern:', error);
    }
  }

  /**
   * Remove pattern from material
   * @param material - Three.js material
   */
  removePattern(material: THREE.MeshStandardMaterial): void {
    if (material.map) {
      // Restore original map if it was blended
      // For now, just remove the pattern overlay
      // In a more complex implementation, we'd track the original texture
    }
  }

  /**
   * Get or load pattern texture
   * @param texturePath - Path to pattern texture
   * @returns Three.js Texture
   */
  private async getPatternTexture(texturePath: string): Promise<THREE.Texture | null> {
    if (!texturePath) {
      return null;
    }

    // Check cache
    if (this.patternCache.has(texturePath)) {
      return this.patternCache.get(texturePath)!;
    }

    try {
      const texture = await loadTexture(texturePath);
      this.patternCache.set(texturePath, texture);
      return texture;
    } catch (error) {
      console.error('Error loading pattern texture:', error);
      return null;
    }
  }

  /**
   * Blend two textures together
   * @param baseTexture - Base texture
   * @param overlayTexture - Pattern texture to overlay
   * @param intensity - Blend intensity (0-1)
   * @returns Blended texture (simplified - returns overlay for now)
   */
  private blendTextures(
    baseTexture: THREE.Texture,
    overlayTexture: THREE.Texture,
    intensity: number
  ): THREE.Texture {
    // Simplified blending - in a full implementation, you'd use a shader or canvas
    // For now, return the overlay texture with adjusted opacity
    overlayTexture.alphaTest = 1 - intensity;
    return overlayTexture;
  }

  /**
   * Clear pattern cache
   */
  clearCache(): void {
    for (const texture of this.patternCache.values()) {
      disposeTexture(texture);
    }
    this.patternCache.clear();
  }
}

// Singleton instance
export const patternManager = new PatternManager();



