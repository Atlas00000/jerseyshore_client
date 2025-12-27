/**
 * Cloudflare R2 client utilities
 * Helper functions to generate R2 public URLs for models and textures
 */

import { logger } from '@/lib/logger';

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || '';

/**
 * Get the full URL for a model file from Cloudflare R2
 * @param path - Path to the model file (e.g., 'models/blank/blank-shirt.glb')
 * @returns Full R2 URL to the model
 * @throws Error if R2_PUBLIC_URL is not configured
 */
export function getModelUrl(path: string): string {
  if (!R2_PUBLIC_URL) {
    const error = new Error('R2_PUBLIC_URL is not configured. Please set NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL in your environment variables.');
    logger.error('R2 not configured', {
      context: 'r2Client',
      error,
      metadata: { path },
    });
    throw error;
  }

  const r2Url = `${R2_PUBLIC_URL}/${path}`;
  logger.debug('Using R2 model file', {
    context: 'r2Client',
    metadata: { path, url: r2Url },
  });
  return r2Url;
}

/**
 * Get the full URL for a texture file from Cloudflare R2
 * @param path - Path to the texture file (e.g., 'materials/cotton/albedo.webp')
 * @returns Full R2 URL to the texture
 * @throws Error if R2_PUBLIC_URL is not configured
 */
export function getTextureUrl(path: string): string {
  if (!R2_PUBLIC_URL) {
    const error = new Error('R2_PUBLIC_URL is not configured. Please set NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL in your environment variables.');
    logger.error('R2 not configured', {
      context: 'r2Client',
      error,
      metadata: { path },
    });
    throw error;
  }

  const r2Url = `${R2_PUBLIC_URL}/textures/${path}`;
  logger.debug('Using R2 texture file', {
    context: 'r2Client',
    metadata: { path, url: r2Url },
  });
  return r2Url;
}

