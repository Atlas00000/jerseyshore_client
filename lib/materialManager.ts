import * as THREE from 'three';
import { MaterialProperties, generateMaterialCacheKey } from '@/types/materials';
import { loadTexture, disposeTexture } from './textureLoader';

/**
 * Material cache entry
 */
interface MaterialCacheEntry {
  material: THREE.MeshStandardMaterial;
  lastUsed: number;
  referenceCount: number;
}

/**
 * Material Manager class for creating and caching Three.js materials
 */
class MaterialManager {
  private cache: Map<string, MaterialCacheEntry> = new Map();
  private readonly maxCacheSize = 50; // Maximum number of cached materials
  private readonly maxUnusedTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  private preloadQueue: MaterialProperties[] = [];
  private isPreloading = false;
  private performanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    totalLoadTime: 0,
    loadCount: 0,
  };

  /**
   * Get or create a material from properties
   * @param properties - Material properties
   * @param colorOverride - Optional color override (hex string)
   * @returns Three.js MeshStandardMaterial
   */
  async getMaterial(
    properties: MaterialProperties,
    colorOverride?: string
  ): Promise<THREE.MeshStandardMaterial> {
    const startTime = performance.now();
    
    // If color override is provided, create modified properties for cache key
    const propsForCache = colorOverride
      ? { ...properties, baseColor: colorOverride }
      : properties;
    const cacheKey = generateMaterialCacheKey(propsForCache);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      cached.lastUsed = Date.now();
      cached.referenceCount++;
      this.performanceMetrics.cacheHits++;
      return cached.material;
    }

    // Cache miss - create new material
    this.performanceMetrics.cacheMisses++;
    const material = await this.createMaterial(properties, colorOverride);

    // Track performance
    const loadTime = performance.now() - startTime;
    this.performanceMetrics.totalLoadTime += loadTime;
    this.performanceMetrics.loadCount++;

    // Add to cache
    this.cache.set(cacheKey, {
      material,
      lastUsed: Date.now(),
      referenceCount: 1,
    });

    // Cleanup old materials if cache is too large
    this.cleanupCache();

    return material;
  }

  /**
   * Preload commonly used materials
   * @param materials - Array of material properties to preload
   */
  async preloadMaterials(materials: MaterialProperties[]): Promise<void> {
    if (this.isPreloading) {
      this.preloadQueue.push(...materials);
      return;
    }

    this.isPreloading = true;
    this.preloadQueue = [...materials];

    // Preload materials in batches to avoid blocking
    const batchSize = 3;
    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, batchSize);
      await Promise.all(
        batch.map((props) =>
          this.getMaterial(props).catch((err) => {
            console.warn('Failed to preload material:', err);
          })
        )
      );
      // Small delay between batches
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    this.isPreloading = false;
  }

  /**
   * Create a Three.js material from properties
   * @param properties - Material properties
   * @param colorOverride - Optional color override (hex string)
   * @returns Promise that resolves to a MeshStandardMaterial
   */
  private async createMaterial(
    properties: MaterialProperties,
    colorOverride?: string
  ): Promise<THREE.MeshStandardMaterial> {
    const baseColor = colorOverride || properties.baseColor || '#ffffff';
    const material = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: properties.roughness ?? 0.5,
      metalness: properties.metallic ?? 0,
    });

    // Load textures
    const texturePromises: Promise<THREE.Texture | null>[] = [];

    if (properties.textures.albedo) {
      texturePromises.push(
        loadTexture(properties.textures.albedo).catch((err) => {
          console.warn('Failed to load albedo texture:', err);
          return null;
        })
      );
    } else {
      texturePromises.push(Promise.resolve(null));
    }

    if (properties.textures.normal) {
      texturePromises.push(
        loadTexture(properties.textures.normal).catch((err) => {
          console.warn('Failed to load normal texture:', err);
          return null;
        })
      );
    } else {
      texturePromises.push(Promise.resolve(null));
    }

    if (properties.textures.roughness) {
      texturePromises.push(
        loadTexture(properties.textures.roughness).catch((err) => {
          console.warn('Failed to load roughness texture:', err);
          return null;
        })
      );
    } else {
      texturePromises.push(Promise.resolve(null));
    }

    if (properties.textures.metallic) {
      texturePromises.push(
        loadTexture(properties.textures.metallic).catch((err) => {
          console.warn('Failed to load metallic texture:', err);
          return null;
        })
      );
    } else {
      texturePromises.push(Promise.resolve(null));
    }

    if (properties.textures.ao) {
      texturePromises.push(
        loadTexture(properties.textures.ao).catch((err) => {
          console.warn('Failed to load AO texture:', err);
          return null;
        })
      );
    } else {
      texturePromises.push(Promise.resolve(null));
    }

    const [albedo, normal, roughness, metallic, ao] = await Promise.all(texturePromises);

    if (albedo) {
      material.map = albedo;
    }
    if (normal) {
      material.normalMap = normal;
      material.normalMapType = THREE.TangentSpaceNormalMap;
    }
    if (roughness) {
      material.roughnessMap = roughness;
    }
    if (metallic) {
      material.metalnessMap = metallic;
    }
    if (ao) {
      material.aoMap = ao;
      material.aoMapIntensity = 1.0;
    }

    return material;
  }

  /**
   * Release a material (decrease reference count)
   * @param properties - Material properties
   */
  releaseMaterial(properties: MaterialProperties): void {
    const cacheKey = generateMaterialCacheKey(properties);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      cached.referenceCount = Math.max(0, cached.referenceCount - 1);
    }
  }

  /**
   * Dispose of a material and remove it from cache
   * @param properties - Material properties
   */
  disposeMaterial(properties: MaterialProperties): void {
    const cacheKey = generateMaterialCacheKey(properties);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      // Dispose textures
      if (cached.material.map) disposeTexture(cached.material.map);
      if (cached.material.normalMap) disposeTexture(cached.material.normalMap);
      if (cached.material.roughnessMap) disposeTexture(cached.material.roughnessMap);
      if (cached.material.metalnessMap) disposeTexture(cached.material.metalnessMap);
      if (cached.material.aoMap) disposeTexture(cached.material.aoMap);

      // Dispose material
      cached.material.dispose();

      // Remove from cache
      this.cache.delete(cacheKey);
    }
  }

  /**
   * Clean up unused materials from cache
   */
  private cleanupCache(): void {
    if (this.cache.size <= this.maxCacheSize) {
      return;
    }

    const now = Date.now();
    const toRemove: string[] = [];

    // Find materials to remove (unused for too long or no references)
    for (const [key, entry] of this.cache.entries()) {
      const unusedTime = now - entry.lastUsed;
      if (
        (entry.referenceCount === 0 && unusedTime > this.maxUnusedTime) ||
        unusedTime > this.maxUnusedTime * 2
      ) {
        toRemove.push(key);
      }
    }

    // Remove materials (oldest first if still over limit)
    if (this.cache.size - toRemove.length > this.maxCacheSize) {
      const sorted = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].lastUsed - b[1].lastUsed
      );
      const additionalToRemove = sorted
        .slice(0, this.cache.size - this.maxCacheSize)
        .map(([key]) => key);
      toRemove.push(...additionalToRemove);
    }

    // Dispose and remove
    toRemove.forEach((key) => {
      const entry = this.cache.get(key);
      if (entry) {
        if (entry.material.map) disposeTexture(entry.material.map);
        if (entry.material.normalMap) disposeTexture(entry.material.normalMap);
        if (entry.material.roughnessMap) disposeTexture(entry.material.roughnessMap);
        if (entry.material.metalnessMap) disposeTexture(entry.material.metalnessMap);
        if (entry.material.aoMap) disposeTexture(entry.material.aoMap);
        entry.material.dispose();
        this.cache.delete(key);
      }
    });
  }

  /**
   * Clear all cached materials
   */
  clearCache(): void {
    for (const entry of this.cache.values()) {
      if (entry.material.map) disposeTexture(entry.material.map);
      if (entry.material.normalMap) disposeTexture(entry.material.normalMap);
      if (entry.material.roughnessMap) disposeTexture(entry.material.roughnessMap);
      if (entry.material.metalnessMap) disposeTexture(entry.material.metalnessMap);
      if (entry.material.aoMap) disposeTexture(entry.material.aoMap);
      entry.material.dispose();
    }
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const totalRequests = this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses;
    const cacheHitRate =
      totalRequests > 0
        ? (this.performanceMetrics.cacheHits / totalRequests) * 100
        : 0;
    const avgLoadTime =
      this.performanceMetrics.loadCount > 0
        ? this.performanceMetrics.totalLoadTime / this.performanceMetrics.loadCount
        : 0;

    // Estimate memory usage (rough calculation)
    let estimatedMemory = 0;
    for (const entry of this.cache.values()) {
      // Rough estimate: material + textures
      estimatedMemory += 1024; // Base material
      if (entry.material.map) estimatedMemory += 512 * 512 * 4; // Albedo texture
      if (entry.material.normalMap) estimatedMemory += 512 * 512 * 4; // Normal texture
      if (entry.material.roughnessMap) estimatedMemory += 512 * 512 * 4; // Roughness texture
    }

    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      cacheHitRate: `${cacheHitRate.toFixed(2)}%`,
      averageLoadTime: `${avgLoadTime.toFixed(2)}ms`,
      totalRequests,
      cacheHits: this.performanceMetrics.cacheHits,
      cacheMisses: this.performanceMetrics.cacheMisses,
      estimatedMemoryMB: `${(estimatedMemory / (1024 * 1024)).toFixed(2)} MB`,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        referenceCount: entry.referenceCount,
        lastUsed: entry.lastUsed,
        age: Date.now() - entry.lastUsed,
      })),
    };
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.performanceMetrics = {
      cacheHits: 0,
      cacheMisses: 0,
      totalLoadTime: 0,
      loadCount: 0,
    };
  }
}

// Singleton instance
export const materialManager = new MaterialManager();

