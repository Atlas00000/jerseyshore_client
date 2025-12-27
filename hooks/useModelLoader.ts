'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { getModelUrl } from '@/lib/cloudflare/r2Client';
import { logger } from '@/lib/logger';

interface UseModelLoaderResult {
  model: any;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to load GLB models from local files or Cloudflare R2
 * Note: useGLTF uses Suspense internally, so loading state is managed by Suspense
 * @param modelPath - Path to the model file (e.g., 'models/blank/blank-shirt.glb')
 *   - If R2 is configured: loads from Cloudflare R2
 *   - Otherwise: loads from Next.js public directory
 * @returns Object with model, loading state, and error
 */
export function useModelLoader(modelPath: string | null): UseModelLoaderResult {
  const hasLoggedLoading = useRef(false);
  const previousModelPath = useRef<string | null>(null);

  // Memoize modelUrl to prevent unnecessary recalculations
  const modelUrl = useMemo(() => {
    if (!modelPath) return null;
    const url = getModelUrl(modelPath);
    logger.debug('Generated model URL', {
      context: 'useModelLoader',
      metadata: { modelPath, url },
    });
    return url;
  }, [modelPath]);

  // useGLTF must be called unconditionally (React hooks rule)
  // It uses Suspense internally - throws a promise while loading
  // We always call it, but use a placeholder when no URL is available
  // The placeholder won't load anything, but satisfies the hook requirement
  const placeholderUrl = 'data:application/octet-stream;base64,';
  const gltf = useGLTF(modelUrl || placeholderUrl);

  // Log loading start only once per modelPath change
  useEffect(() => {
    if (modelPath && modelPath !== previousModelPath.current) {
      if (modelUrl) {
        logger.info('Loading model', {
          context: 'useModelLoader',
          metadata: { modelPath, modelUrl },
        });
        hasLoggedLoading.current = true;
        previousModelPath.current = modelPath;
      } else {
        logger.error('Invalid model path or R2 URL not configured', {
          context: 'useModelLoader',
          metadata: { modelPath },
        });
      }
    }
  }, [modelPath, modelUrl]);

  // Log when model successfully loads
  useEffect(() => {
    // Only consider it loaded if we have a valid URL (not placeholder) and a scene
    if (gltf?.scene && modelUrl && modelUrl !== placeholderUrl && hasLoggedLoading.current) {
      logger.info('Model loaded successfully', {
        context: 'useModelLoader',
        metadata: { 
          modelPath, 
          url: modelUrl, 
          sceneChildren: gltf.scene.children.length 
        },
      });
      hasLoggedLoading.current = false;
    }
  }, [gltf?.scene, modelPath, modelUrl]);

  // Only return model if we have a valid URL (not placeholder) and scene
  const hasValidModel = modelUrl && modelUrl !== placeholderUrl && gltf?.scene;

  return {
    model: hasValidModel ? gltf.scene : null,
    loading: false, // Loading is handled by Suspense
    error: modelPath && !modelUrl ? new Error('Invalid model path or R2 URL not configured') : null,
  };
}

