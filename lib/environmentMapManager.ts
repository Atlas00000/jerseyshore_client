import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { getTextureUrl } from '@/lib/cloudflare/r2Client';
import { logger } from './logger';

/**
 * Environment map cache
 */
interface EnvironmentMapCache {
  texture: THREE.DataTexture;
  lastUsed: number;
}

/**
 * Environment Map Manager for HDR environment maps
 */
class EnvironmentMapManager {
  private cache: Map<string, EnvironmentMapCache> = new Map();
  private currentEnvironmentMap: THREE.DataTexture | null = null;
  private scene: THREE.Scene | null = null;

  /**
   * Set the scene to apply environment maps to
   */
  setScene(scene: THREE.Scene): void {
    this.scene = scene;
    // Apply current environment map if one is loaded
    if (this.currentEnvironmentMap && scene.environment !== this.currentEnvironmentMap) {
      scene.environment = this.currentEnvironmentMap;
    }
  }

  /**
   * Load an HDR environment map
   * @param path - Path to HDR file in R2 (e.g., 'environments/studio.hdr')
   * @returns Promise that resolves to the loaded environment map texture
   */
  async loadEnvironmentMap(path: string): Promise<THREE.DataTexture> {
    const textureUrl = getTextureUrl(path);
    
    if (!textureUrl) {
      throw new Error('Invalid environment map path or R2 URL not configured');
    }

    // Check cache
    const cached = this.cache.get(textureUrl);
    if (cached) {
      cached.lastUsed = Date.now();
      this.currentEnvironmentMap = cached.texture;
      this.applyToScene();
      return cached.texture;
    }

    // Load new environment map
    return new Promise((resolve, reject) => {
      const loader = new RGBELoader();
      loader.load(
        textureUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          
          // Cache the texture
          this.cache.set(textureUrl, {
            texture,
            lastUsed: Date.now(),
          });
          
          this.currentEnvironmentMap = texture;
          this.applyToScene();
          
          logger.info('Environment map loaded', {
            context: 'environmentMapManager',
            metadata: { path, url: textureUrl },
          });
          
          resolve(texture);
        },
        undefined,
        (error) => {
          logger.error('Failed to load environment map', {
            context: 'environmentMapManager',
            error: error instanceof Error ? error : new Error(String(error)),
            metadata: { path, url: textureUrl },
          });
          reject(error);
        }
      );
    });
  }

  /**
   * Apply current environment map to scene
   */
  private applyToScene(): void {
    if (this.scene && this.currentEnvironmentMap) {
      this.scene.environment = this.currentEnvironmentMap;
      logger.debug('Environment map applied to scene', {
        context: 'environmentMapManager',
      });
    }
  }

  /**
   * Clear current environment map
   */
  clearEnvironmentMap(): void {
    if (this.scene) {
      this.scene.environment = null;
    }
    this.currentEnvironmentMap = null;
  }

  /**
   * Dispose of all cached environment maps
   */
  dispose(): void {
    for (const entry of this.cache.values()) {
      entry.texture.dispose();
    }
    this.cache.clear();
    this.clearEnvironmentMap();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      currentMap: this.currentEnvironmentMap ? 'loaded' : 'none',
      entries: Array.from(this.cache.entries()).map(([url, entry]) => ({
        url,
        lastUsed: entry.lastUsed,
        age: Date.now() - entry.lastUsed,
      })),
    };
  }
}

// Singleton instance
export const environmentMapManager = new EnvironmentMapManager();



