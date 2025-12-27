'use client';

import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { exportCanvasAsImage, exportHighResImage } from '@/lib/export/imageExport';
import { exportCanvasAsPDF } from '@/lib/export/pdfExport';
import { exportSceneAsModel } from '@/lib/export/modelExport';
import { generateDesignMetadata } from '@/lib/export/designMetadata';
import { logger } from '@/lib/logger';

type ExportFormat = 'png' | 'jpg' | 'pdf' | 'glb' | 'gltf';

interface ExportMenuProps {
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

export function ExportMenu({
  onExportStart,
  onExportComplete,
  onExportError,
}: ExportMenuProps) {
  const { gl, scene } = useThree();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (isExporting) return;

    setIsExporting(true);
    setExportFormat(format);
    onExportStart?.();

    try {
      const canvas = gl.domElement as HTMLCanvasElement;
      const metadata = generateDesignMetadata(format);
      const filename = `shirt-design-${Date.now()}`;

      switch (format) {
        case 'png':
          await exportCanvasAsImage(canvas, {
            format: 'png',
            filename,
          });
          break;

        case 'jpg':
          await exportCanvasAsImage(canvas, {
            format: 'jpg',
            filename,
            quality: 0.92,
          });
          break;

        case 'pdf':
          await exportCanvasAsPDF(canvas, {
            filename,
            title: 'Shirt Design',
            includeMetadata: true,
          });
          break;

        case 'glb':
        case 'gltf':
          await exportSceneAsModel(scene, {
            format,
            filename,
            includeMaterials: true,
            includeTextures: true,
          });
          break;
      }

      logger.info('Export completed successfully', {
        context: 'ExportMenu',
        metadata: { format, filename },
      });

      onExportComplete?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Export failed', {
        context: 'ExportMenu',
        error: err,
        metadata: { format },
      });
      onExportError?.(err);
      alert(`Failed to export: ${err.message}`);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const handleHighResExport = async (format: 'png' | 'jpg') => {
    if (isExporting) return;

    setIsExporting(true);
    setExportFormat(format);
    onExportStart?.();

    try {
      const canvas = gl.domElement as HTMLCanvasElement;
      const filename = `shirt-design-hires-${Date.now()}`;

      await exportHighResImage(canvas, {
        format,
        filename,
        scale: 4, // 4x resolution for print quality
        quality: format === 'jpg' ? 0.95 : undefined,
      });

      logger.info('High-res export completed', {
        context: 'ExportMenu',
        metadata: { format, filename },
      });

      onExportComplete?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('High-res export failed', {
        context: 'ExportMenu',
        error: err,
        metadata: { format },
      });
      onExportError?.(err);
      alert(`Failed to export: ${err.message}`);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Export Design</h3>

      {isExporting && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Exporting as {exportFormat?.toUpperCase()}...</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Image Exports */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Image Formats</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExport('png')}
              disabled={isExporting}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              PNG
            </button>
            <button
              onClick={() => handleExport('jpg')}
              disabled={isExporting}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              JPG
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleHighResExport('png')}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title="High resolution PNG (4x) for print quality"
            >
              PNG (High-Res)
            </button>
            <button
              onClick={() => handleHighResExport('jpg')}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title="High resolution JPG (4x) for print quality"
            >
              JPG (High-Res)
            </button>
          </div>
        </div>

        {/* PDF Export */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Document Format</h4>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Export as PDF
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Opens print dialog to save as PDF
          </p>
        </div>

        {/* 3D Model Exports */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">3D Model Formats</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExport('glb')}
              disabled={isExporting}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              GLB
            </button>
            <button
              onClick={() => handleExport('gltf')}
              disabled={isExporting}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              GLTF
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Export 3D model with materials and textures
          </p>
        </div>
      </div>
    </div>
  );
}

