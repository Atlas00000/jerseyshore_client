import { useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { exportCanvasAsImage, exportHighResImage } from '@/lib/export/imageExport';
import { exportCanvasAsPDF } from '@/lib/export/pdfExport';
import { exportSceneAsModel } from '@/lib/export/modelExport';
import { generateDesignMetadata } from '@/lib/export/designMetadata';
import { logger } from '@/lib/logger';

type ExportFormat = 'png' | 'jpg' | 'pdf' | 'glb' | 'gltf';

interface UseExportResult {
  exportAsImage: (format: 'png' | 'jpg', highRes?: boolean) => Promise<void>;
  exportAsPDF: () => Promise<void>;
  exportAsModel: (format: 'glb' | 'gltf') => Promise<void>;
  isExporting: boolean;
}

/**
 * Hook for exporting designs from Three.js scene
 * Must be used inside Canvas component
 */
export function useExport(): UseExportResult {
  const { gl, scene, camera } = useThree();
  const isExportingRef = useRef(false);

  const exportAsImage = useCallback(
    async (format: 'png' | 'jpg', highRes = false) => {
      if (isExportingRef.current) return;

      isExportingRef.current = true;
      try {
        // Force render before capture
        gl.render(scene, camera);
        
        // Wait a frame to ensure render is complete
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const canvas = gl.domElement as HTMLCanvasElement;
        
        // Verify canvas has content
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error('Canvas is not ready for export');
        }

        const metadata = generateDesignMetadata(format);
        const filename = `shirt-design-${Date.now()}`;

        if (highRes) {
          await exportHighResImage(canvas, {
            format,
            filename,
            scale: 4,
            quality: format === 'jpg' ? 0.95 : undefined,
            renderer: gl,
          });
        } else {
          await exportCanvasAsImage(canvas, {
            format,
            filename,
            quality: format === 'jpg' ? 0.92 : undefined,
            renderer: gl,
          });
        }

        logger.info('Image export completed', {
          context: 'useExport',
          metadata: { format, highRes, filename },
        });
      } catch (error) {
        logger.error('Image export failed', {
          context: 'useExport',
          error: error instanceof Error ? error : new Error(String(error)),
          metadata: { format, highRes },
        });
        throw error;
      } finally {
        isExportingRef.current = false;
      }
    },
    [gl, scene, camera]
  );

  const exportAsPDF = useCallback(async () => {
    if (isExportingRef.current) return;

    isExportingRef.current = true;
    try {
      // Force render before capture
      gl.render(scene, camera);
      
      // Wait a frame to ensure render is complete
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const canvas = gl.domElement as HTMLCanvasElement;
      
      // Verify canvas has content
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is not ready for export');
      }

      const filename = `shirt-design-${Date.now()}`;

      await exportCanvasAsPDF(canvas, {
        filename,
        title: 'Shirt Design',
        includeMetadata: true,
      });

      logger.info('PDF export completed', {
        context: 'useExport',
        metadata: { filename },
      });
    } catch (error) {
      logger.error('PDF export failed', {
        context: 'useExport',
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    } finally {
      isExportingRef.current = false;
    }
  }, [gl, scene, camera]);

  const exportAsModel = useCallback(
    async (format: 'glb' | 'gltf') => {
      if (isExportingRef.current) return;

      isExportingRef.current = true;
      try {
        const filename = `shirt-design-${Date.now()}`;

        await exportSceneAsModel(scene, {
          format,
          filename,
          includeMaterials: true,
          includeTextures: true,
        });

        logger.info('3D model export completed', {
          context: 'useExport',
          metadata: { format, filename },
        });
      } catch (error) {
        logger.error('3D model export failed', {
          context: 'useExport',
          error: error instanceof Error ? error : new Error(String(error)),
          metadata: { format },
        });
        throw error;
      } finally {
        isExportingRef.current = false;
      }
    },
    [scene]
  );

  return {
    exportAsImage,
    exportAsPDF,
    exportAsModel,
    isExporting: isExportingRef.current,
  };
}

