'use client';

import { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialProperties } from '@/types/materials';
import { materialManager } from '@/lib/materialManager';

interface UseMaterialPreviewResult {
  previewUrl: string | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to generate material preview thumbnails
 * @param properties - Material properties to preview
 * @param size - Preview size (default: 256x256)
 * @returns Preview URL, loading state, and error
 */
export function useMaterialPreview(
  properties: MaterialProperties | null,
  size: number = 256
): UseMaterialPreviewResult {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!properties) {
      setPreviewUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create canvas if it doesn't exist
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = size;
      canvasRef.current.height = size;
    }

    const canvas = canvasRef.current;

    // Create renderer if it doesn't exist
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      rendererRef.current.setSize(size, size);
    }

    const renderer = rendererRef.current;

    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create material and apply to sphere
    materialManager
      .getMaterial(properties)
      .then((material) => {
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Render
        renderer.render(scene, camera);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewUrl(dataUrl);
        setIsLoading(false);

        // Cleanup
        geometry.dispose();
        scene.remove(mesh);
      })
      .catch((err) => {
        console.error('Error generating material preview:', err);
        setError(err instanceof Error ? err : new Error('Failed to generate preview'));
        setIsLoading(false);
      });
  }, [properties, size]);

  return { previewUrl, isLoading, error };
}

