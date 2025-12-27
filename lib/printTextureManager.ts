import * as THREE from 'three';
import { PrintApplication, BlendMode } from '@/types/prints';
import { logger } from './logger';

/**
 * Cache for composite textures
 */
interface CompositeTextureCache {
  texture: THREE.CanvasTexture;
  lastUsed: number;
}

/**
 * Print Texture Manager
 * Handles combining base material textures with print overlays
 */
class PrintTextureManager {
  private cache: Map<string, CompositeTextureCache> = new Map();
  private readonly textureSize = 2048; // Base texture resolution

  /**
   * Create a composite texture from base texture and print applications
   */
  async createCompositeTexture(
    baseTexture: THREE.Texture | null,
    prints: PrintApplication[],
    component: string
  ): Promise<THREE.CanvasTexture> {
    // Generate cache key
    const cacheKey = this.generateCacheKey(baseTexture, prints, component);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      cached.lastUsed = Date.now();
      return cached.texture;
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.textureSize;
    canvas.height = this.textureSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw base texture if available
    if (baseTexture && baseTexture.image) {
      await this.drawTextureToCanvas(ctx, baseTexture.image, 0, 0, this.textureSize, this.textureSize);
    } else {
      // Fill with white if no base texture
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, this.textureSize, this.textureSize);
    }

    // Sort prints by zIndex (lower zIndex = drawn first, higher = on top)
    const sortedPrints = [...prints].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    // Draw print overlays with blend modes
    for (const print of sortedPrints) {
      await this.drawPrintToCanvas(ctx, print, baseTexture);
    }

    // Create Three.js texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.flipY = false;
    texture.needsUpdate = true;

    // Cache the texture
    this.cache.set(cacheKey, {
      texture,
      lastUsed: Date.now(),
    });

    logger.debug('Composite texture created', {
      context: 'printTextureManager',
      metadata: {
        component,
        printCount: prints.length,
        hasBaseTexture: !!baseTexture,
      },
    });

    return texture;
  }

  /**
   * Draw a texture image to canvas
   */
  private drawTextureToCanvas(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (image instanceof HTMLImageElement && !image.complete) {
        image.onload = () => {
          ctx.drawImage(image, x, y, width, height);
          resolve();
        };
        image.onerror = () => reject(new Error('Failed to load image'));
      } else {
        ctx.drawImage(image, x, y, width, height);
        resolve();
      }
    });
  }

  /**
   * Draw a print application to canvas with blend mode support
   */
  private async drawPrintToCanvas(
    ctx: CanvasRenderingContext2D,
    print: PrintApplication,
    baseTexture: THREE.Texture | null
  ): Promise<void> {
    // Handle text prints
    if (print.textContent) {
      await this.drawTextPrint(ctx, print);
      return;
    }

    // Handle image prints
    if (!print.customImageUrl) {
      logger.warn('Print has no image URL or text content', {
        context: 'printTextureManager',
        metadata: { printId: print.id },
      });
      return;
    }

    // Load print image
    const img = await this.loadImage(print.customImageUrl);

    // Calculate position and size in canvas coordinates
    const x = print.position.x * this.textureSize;
    const y = print.position.y * this.textureSize;

    // Calculate size based on scale
    const baseWidth = print.width || img.width;
    const baseHeight = print.height || img.height;
    const aspectRatio = baseWidth / baseHeight;

    // Scale to fit within reasonable bounds (10% to 30% of texture size)
    const maxSize = this.textureSize * 0.3;
    const scaledWidth = Math.min(baseWidth * print.scale, maxSize);
    const scaledHeight = scaledWidth / aspectRatio;

    // Create temporary canvas for blend mode compositing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.textureSize;
    tempCanvas.height = this.textureSize;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Draw print to temporary canvas
    tempCtx.save();
    tempCtx.translate(x, y);
    tempCtx.rotate((print.rotation * Math.PI) / 180);
    tempCtx.globalAlpha = print.opacity;
    tempCtx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
    tempCtx.restore();

    // Apply blend mode
    ctx.save();
    ctx.globalCompositeOperation = this.getBlendMode(print.blendMode || BlendMode.NORMAL);
    ctx.globalAlpha = print.opacity;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1.0;
  }

  /**
   * Draw text print to canvas
   */
  private async drawTextPrint(ctx: CanvasRenderingContext2D, print: PrintApplication): Promise<void> {
    if (!print.textContent) return;

    const x = print.position.x * this.textureSize;
    const y = print.position.y * this.textureSize;

    const style = print.textStyle || {};
    const fontSize = style.fontSize || 48;
    const fontFamily = style.fontFamily || 'Arial, sans-serif';
    const fontWeight = style.fontWeight || 'normal';
    const color = style.color || '#000000';
    const textAlign = style.textAlign || 'center';

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((print.rotation * Math.PI) / 180);
    ctx.scale(print.scale, print.scale);

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign as CanvasTextAlign;
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = print.opacity;

    // Apply blend mode
    ctx.globalCompositeOperation = this.getBlendMode(print.blendMode || BlendMode.NORMAL);

    ctx.fillText(print.textContent, 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Convert BlendMode enum to canvas composite operation
   */
  private getBlendMode(blendMode: BlendMode): GlobalCompositeOperation {
    const modeMap: Record<BlendMode, GlobalCompositeOperation> = {
      [BlendMode.NORMAL]: 'source-over',
      [BlendMode.MULTIPLY]: 'multiply',
      [BlendMode.SCREEN]: 'screen',
      [BlendMode.OVERLAY]: 'overlay',
      [BlendMode.SOFT_LIGHT]: 'soft-light',
      [BlendMode.HARD_LIGHT]: 'hard-light',
      [BlendMode.COLOR_DODGE]: 'color-dodge',
      [BlendMode.COLOR_BURN]: 'color-burn',
      [BlendMode.DARKEN]: 'darken',
      [BlendMode.LIGHTEN]: 'lighten',
      [BlendMode.DIFFERENCE]: 'difference',
      [BlendMode.EXCLUSION]: 'exclusion',
    };
    return modeMap[blendMode] || 'source-over';
  }

  /**
   * Load image from URL (supports object URLs and data URLs)
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  /**
   * Generate cache key for composite texture
   */
  private generateCacheKey(
    baseTexture: THREE.Texture | null,
    prints: PrintApplication[],
    component: string
  ): string {
    // Sort by zIndex for consistent cache keys
    const sortedPrints = [...prints].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const printKeys = sortedPrints
      .map((p) => `${p.id}:${p.position.x}:${p.position.y}:${p.scale}:${p.rotation}:${p.opacity}:${p.blendMode || 'normal'}:${p.zIndex || 0}:${p.textContent || ''}`)
      .join('|');
    const baseKey = baseTexture ? baseTexture.uuid : 'no-base';
    return `${component}:${baseKey}:${printKeys}`;
  }

  /**
   * Dispose of a composite texture
   */
  disposeTexture(texture: THREE.CanvasTexture): void {
    texture.dispose();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    for (const entry of this.cache.values()) {
      entry.texture.dispose();
    }
    this.cache.clear();
  }

  /**
   * Clean up old cached textures
   */
  cleanupCache(maxAge: number = 5 * 60 * 1000): void {
    const now = Date.now();
    const toRemove: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.lastUsed > maxAge) {
        toRemove.push(key);
      }
    }

    for (const key of toRemove) {
      const entry = this.cache.get(key);
      if (entry) {
        entry.texture.dispose();
      }
      this.cache.delete(key);
    }
  }
}

// Singleton instance
export const printTextureManager = new PrintTextureManager();

