import { logger } from '../logger';
import * as THREE from 'three';

/**
 * Image Export Utility
 * Captures the Three.js canvas and exports as PNG or JPG
 */

export interface ImageExportOptions {
  format?: 'png' | 'jpg';
  quality?: number; // 0-1 for JPG
  filename?: string;
  width?: number; // Override canvas width
  height?: number; // Override canvas height
  renderer?: THREE.WebGLRenderer; // Optional renderer for better capture
}

/**
 * Capture canvas and export as image
 * For WebGL canvases, we need to read pixels from the renderer
 */
export async function exportCanvasAsImage(
  canvas: HTMLCanvasElement,
  options: ImageExportOptions = {}
): Promise<void> {
  const {
    format = 'png',
    quality = 0.92,
    filename = `shirt-design-${Date.now()}`,
    width,
    height,
    renderer,
  } = options;

  try {
    // Verify canvas is valid and has content
    if (!canvas) {
      throw new Error('Canvas element is null');
    }

    const canvasWidth = width || canvas.width;
    const canvasHeight = height || canvas.height;

    if (canvasWidth === 0 || canvasHeight === 0) {
      throw new Error(`Canvas has invalid dimensions: ${canvasWidth}x${canvasHeight}`);
    }

    // Create a 2D canvas for export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    const exportCtx = exportCanvas.getContext('2d');
    
    if (!exportCtx) {
      throw new Error('Failed to create export canvas context');
    }

    // For WebGL canvases, we need to read pixels from the WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('webgl', { preserveDrawingBuffer: true });
    
    if (gl) {
      // Read pixels from WebGL context
      const pixelBuffer = new Uint8Array(canvasWidth * canvasHeight * 4);
      gl.readPixels(0, 0, canvasWidth, canvasHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuffer);
      
      // Flip vertically (WebGL has origin at bottom-left, canvas 2D has top-left)
      const flippedBuffer = new Uint8Array(pixelBuffer.length);
      for (let y = 0; y < canvasHeight; y++) {
        const srcRow = y * canvasWidth * 4;
        const dstRow = (canvasHeight - 1 - y) * canvasWidth * 4;
        flippedBuffer.set(pixelBuffer.subarray(srcRow, srcRow + canvasWidth * 4), dstRow);
      }
      
      // Create ImageData and put it on the 2D canvas
      const imageData = exportCtx.createImageData(canvasWidth, canvasHeight);
      imageData.data.set(flippedBuffer);
      exportCtx.putImageData(imageData, 0, 0);
    } else {
      // Fallback: try to draw the canvas directly (works for 2D canvases)
      exportCtx.imageSmoothingEnabled = true;
      exportCtx.imageSmoothingQuality = 'high';
      exportCtx.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);
    }

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      exportCanvas.toBlob(
        (blob) => {
          if (blob) {
            // Verify blob is not empty
            if (blob.size === 0) {
              reject(new Error('Exported blob is empty'));
              return;
            }
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        format === 'jpg' ? 'image/jpeg' : 'image/png',
        format === 'jpg' ? quality : undefined
      );
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    logger.info('Canvas exported as image', {
      context: 'imageExport',
      metadata: { format, filename, width, height },
    });
  } catch (error) {
    logger.error('Failed to export canvas as image', {
      context: 'imageExport',
      error: error instanceof Error ? error : new Error(String(error)),
      metadata: { format, filename },
    });
    throw error;
  }
}

/**
 * Get canvas from Three.js renderer
 */
export function getCanvasFromRenderer(renderer: any): HTMLCanvasElement | null {
  if (!renderer || !renderer.domElement) {
    return null;
  }
  return renderer.domElement as HTMLCanvasElement;
}

/**
 * Export with high resolution (for print quality)
 */
export async function exportHighResImage(
  canvas: HTMLCanvasElement,
  options: ImageExportOptions & { scale?: number } = {}
): Promise<void> {
  const { scale = 2, renderer, ...restOptions } = options;
  const width = canvas.width * scale;
  const height = canvas.height * scale;

  return exportCanvasAsImage(canvas, {
    ...restOptions,
    width,
    height,
    renderer,
  });
}

