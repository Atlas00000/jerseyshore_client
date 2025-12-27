import { create } from 'zustand';

type ExportFormat = 'png' | 'jpg' | 'pdf' | 'glb' | 'gltf';
type ExportQuality = 'standard' | 'high';

interface ExportRequest {
  format: ExportFormat;
  quality?: ExportQuality;
  timestamp: number;
}

interface ExportStore {
  exportRequest: ExportRequest | null;
  isExporting: boolean;
  exportError: Error | null;
  requestExport: (format: ExportFormat, quality?: ExportQuality) => void;
  setExporting: (isExporting: boolean) => void;
  setExportError: (error: Error | null) => void;
  clearExportRequest: () => void;
}

export const useExportStore = create<ExportStore>((set) => ({
  exportRequest: null,
  isExporting: false,
  exportError: null,
  requestExport: (format, quality = 'standard') => {
    set({
      exportRequest: {
        format,
        quality,
        timestamp: Date.now(),
      },
      exportError: null,
    });
  },
  setExporting: (isExporting) => set({ isExporting }),
  setExportError: (error) => set({ exportError: error }),
  clearExportRequest: () => set({ exportRequest: null }),
}));

