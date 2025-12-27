import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { getTextureUrl } from '@/lib/cloudflare/r2Client';
import { logger } from './logger';

/**
 * Load a texture from Cloudflare R2
 * Supports: PNG, JPG, WEBP, HDR, EXR formats
 * @param path - Path to the texture file in R2 (e.g., 'materials/cotton/albedo.webp')
 * @returns Promise that resolves to a Three.js Texture or DataTexture
 */
export async function loadTexture(path: string): Promise<THREE.Texture> {
  const textureUrl = getTextureUrl(path);
  
  if (!textureUrl) {
    throw new Error('Invalid texture path or R2 URL not configured');
  }

  // Determine file type from extension
  const extension = path.toLowerCase().split('.').pop();
  
  // Handle HDR files
  if (extension === 'hdr') {
    return loadHDRTexture(textureUrl);
  }
  
  // Handle EXR files
  if (extension === 'exr') {
    return loadEXRTexture(textureUrl);
  }
  
  // Handle standard image formats (PNG, JPG, WEBP)
  return loadStandardTexture(textureUrl);
}

/**
 * Load a standard image texture (PNG, JPG, WEBP)
 */
function loadStandardTexture(textureUrl: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      textureUrl,
      (texture) => {
        // Configure texture settings
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.flipY = false; // GLB/GLTF uses bottom-left origin
        resolve(texture);
      },
      undefined,
      (error) => {
        logger.error('Failed to load texture', {
          context: 'textureLoader',
          error: error instanceof Error ? error : new Error(String(error)),
          metadata: { url: textureUrl },
        });
        reject(error);
      }
    );
  });
}

/**
 * Load an HDR texture (for environment maps or HDR textures)
 */
function loadHDRTexture(textureUrl: string): Promise<THREE.DataTexture> {
  return new Promise((resolve, reject) => {
    const loader = new RGBELoader();
    loader.load(
      textureUrl,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        logger.debug('HDR texture loaded', {
          context: 'textureLoader',
          metadata: { url: textureUrl },
        });
        resolve(texture);
      },
      undefined,
      (error) => {
        logger.error('Failed to load HDR texture', {
          context: 'textureLoader',
          error: error instanceof Error ? error : new Error(String(error)),
          metadata: { url: textureUrl },
        });
        reject(error);
      }
    );
  });
}

/**
 * Load an EXR texture (for high dynamic range textures)
 */
function loadEXRTexture(textureUrl: string): Promise<THREE.DataTexture> {
  return new Promise((resolve, reject) => {
    const loader = new EXRLoader();
    loader.load(
      textureUrl,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        logger.debug('EXR texture loaded', {
          context: 'textureLoader',
          metadata: { url: textureUrl },
        });
        resolve(texture);
      },
      undefined,
      (error) => {
        logger.error('Failed to load EXR texture', {
          context: 'textureLoader',
          error: error instanceof Error ? error : new Error(String(error)),
          metadata: { url: textureUrl },
        });
        reject(error);
      }
    );
  });
}

/**
 * Load multiple textures in parallel
 * @param paths - Array of texture paths
 * @returns Promise that resolves to an array of textures in the same order
 */
export async function loadTextures(paths: string[]): Promise<THREE.Texture[]> {
  return Promise.all(paths.map((path) => loadTexture(path)));
}

/**
 * Dispose of a texture to free memory
 * @param texture - Three.js texture to dispose
 */
export function disposeTexture(texture: THREE.Texture | null | undefined): void {
  if (texture) {
    texture.dispose();
  }
}

/**
 * Dispose of multiple textures
 * @param textures - Array of textures to dispose
 */
export function disposeTextures(textures: (THREE.Texture | null | undefined)[]): void {
  textures.forEach(disposeTexture);
}

