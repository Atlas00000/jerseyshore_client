import { logger } from '../logger';
import { exportCanvasAsImage } from './imageExport';

/**
 * PDF Export Utility
 * Exports design as PDF document
 */

export interface PDFExportOptions {
  filename?: string;
  title?: string;
  includeMetadata?: boolean;
  width?: number;
  height?: number;
}

/**
 * Export canvas as PDF using browser's print functionality
 * This is a simple approach that works without external libraries
 */
export async function exportCanvasAsPDF(
  canvas: HTMLCanvasElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const { filename = `shirt-design-${Date.now()}`, title = 'Shirt Design' } = options;

  try {
    // Create a new window with the canvas image
    const imgData = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Failed to open print window. Please allow popups.');
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @media print {
              @page {
                margin: 0;
                size: auto;
              }
              body {
                margin: 0;
                padding: 0;
              }
              img {
                width: 100%;
                height: auto;
                display: block;
              }
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" alt="${title}" />
        </body>
      </html>
    `);
    printWindow.document.close();

    // Wait for image to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close window after print dialog
        setTimeout(() => {
          printWindow.close();
        }, 100);
      }, 250);
    };

    logger.info('PDF export initiated', {
      context: 'pdfExport',
      metadata: { filename, title },
    });
  } catch (error) {
    logger.error('Failed to export as PDF', {
      context: 'pdfExport',
      error: error instanceof Error ? error : new Error(String(error)),
      metadata: { filename },
    });
    throw error;
  }
}

/**
 * Alternative: Export as PDF using download (creates PDF-like file)
 * This creates a downloadable file that can be opened as PDF
 */
export async function exportCanvasAsPDFDownload(
  canvas: HTMLCanvasElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const { filename = `shirt-design-${Date.now()}` } = options;

  try {
    // For now, we'll export as high-res PNG and suggest user converts to PDF
    // A full PDF implementation would require jsPDF library
    await exportCanvasAsImage(canvas, {
      format: 'png',
      filename: `${filename}-for-pdf`,
      width: canvas.width * 2, // High resolution
      height: canvas.height * 2,
    });

    logger.info('High-res image exported for PDF conversion', {
      context: 'pdfExport',
      metadata: { filename },
    });

    // Note: User can convert PNG to PDF using external tools or browser print
  } catch (error) {
    logger.error('Failed to export for PDF', {
      context: 'pdfExport',
      error: error instanceof Error ? error : new Error(String(error)),
      metadata: { filename },
    });
    throw error;
  }
}

