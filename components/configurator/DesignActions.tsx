'use client';

import { useEffect, useState } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { useExportStore } from '@/stores/exportStore';

export function DesignActions() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
    currentMode,
    setMode,
  } = useConfiguratorStore();
  const { requestExport, isExporting, exportError } = useExportStore();
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }
      // Cmd/Ctrl + Shift + Z for redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the design? This cannot be undone.')) {
      setMode('blank');
      // Reset will be handled by mode change
      saveToHistory();
    }
  };

  const handleExport = (format: 'png' | 'jpg' | 'pdf' | 'glb' | 'gltf', quality: 'standard' | 'high' = 'standard') => {
    requestExport(format, quality);
    setShowExportMenu(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Design Actions</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            canUndo()
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          title="Undo (Cmd/Ctrl + Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            canRedo()
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          title="Redo (Cmd/Ctrl + Shift + Z)"
        >
          ↷ Redo
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          Reset
        </button>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isExporting
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>

          {/* Export Menu Dropdown */}
          {showExportMenu && !isExporting && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
              <div className="space-y-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Image</h4>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => handleExport('png')}
                      className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      PNG
                    </button>
                    <button
                      onClick={() => handleExport('jpg')}
                      className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      JPG
                    </button>
                    <button
                      onClick={() => handleExport('png', 'high')}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      PNG (4K)
                    </button>
                    <button
                      onClick={() => handleExport('jpg', 'high')}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      JPG (4K)
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Document</h4>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    PDF
                  </button>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">3D Model</h4>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => handleExport('glb')}
                      className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      GLB
                    </button>
                    <button
                      onClick={() => handleExport('gltf')}
                      className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      GLTF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {exportError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          Export failed: {exportError.message}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Use Cmd/Ctrl + Z to undo, Cmd/Ctrl + Shift + Z to redo
      </p>
    </div>
  );
}

