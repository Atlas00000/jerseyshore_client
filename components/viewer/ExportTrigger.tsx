'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useExportStore } from '@/stores/exportStore';
import { useExport } from '@/hooks/useExport';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { logger } from '@/lib/logger';

/**
 * Component that listens to export requests and triggers exports
 * Must be placed inside Canvas component
 */
export function ExportTrigger() {
  const { exportRequest, clearExportRequest, setExporting, setExportError } = useExportStore();
  const { exportAsImage, exportAsPDF, exportAsModel } = useExport();
  const { gl } = useThree();
  const { componentMap } = useConfiguratorStore();
  const previousRequestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!exportRequest) return;

    // Avoid processing the same request twice
    if (previousRequestRef.current === exportRequest.timestamp) {
      return;
    }
    previousRequestRef.current = exportRequest.timestamp;

    const handleExport = async () => {
      setExporting(true);
      setExportError(null);

      try {
        // Verify model is loaded
        if (!componentMap || Object.keys(componentMap).length === 0) {
          throw new Error('Model is not loaded. Please wait for the model to load before exporting.');
        }

        // Verify canvas is ready
        const canvas = gl.domElement as HTMLCanvasElement;
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error('Canvas is not ready. Please wait a moment and try again.');
        }

        // Wait an extra frame to ensure everything is rendered
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const { format, quality } = exportRequest;

        switch (format) {
          case 'png':
            await exportAsImage('png', quality === 'high');
            break;
          case 'jpg':
            await exportAsImage('jpg', quality === 'high');
            break;
          case 'pdf':
            await exportAsPDF();
            break;
          case 'glb':
          case 'gltf':
            await exportAsModel(format);
            break;
        }

        logger.info('Export completed via trigger', {
          context: 'ExportTrigger',
          metadata: { format, quality, canvasSize: `${canvas.width}x${canvas.height}` },
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setExportError(err);
        logger.error('Export failed via trigger', {
          context: 'ExportTrigger',
          error: err,
          metadata: { format: exportRequest.format },
        });
      } finally {
        setExporting(false);
        clearExportRequest();
      }
    };

    handleExport();
  }, [exportRequest, exportAsImage, exportAsPDF, exportAsModel, setExporting, setExportError, clearExportRequest, gl, componentMap]);

  // This component doesn't render anything
  return null;
}

