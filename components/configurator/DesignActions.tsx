'use client';

/**
 * DesignActions Component
 * Toolbar layout with icon buttons, tooltips, export menu with animations, and keyboard shortcuts display
 */

import { useEffect, useState, useRef } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { useExportStore } from '@/stores/exportStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';
import { Badge } from '@/components/ui/Badge';

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
  const [showShortcuts, setShowShortcuts] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

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

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the design? This cannot be undone.')) {
      setMode('blank');
      saveToHistory();
    }
  };

  const handleExport = (
    format: 'png' | 'jpg' | 'pdf' | 'glb' | 'gltf',
    quality: 'standard' | 'high' = 'standard'
  ) => {
    requestExport(format, quality);
    setShowExportMenu(false);
  };

  const exportOptions = [
    {
      category: 'Image',
      options: [
        { format: 'png' as const, label: 'PNG', quality: 'standard' as const },
        { format: 'jpg' as const, label: 'JPG', quality: 'standard' as const },
        { format: 'png' as const, label: 'PNG (4K)', quality: 'high' as const },
        { format: 'jpg' as const, label: 'JPG (4K)', quality: 'high' as const },
      ],
    },
    {
      category: 'Document',
      options: [{ format: 'pdf' as const, label: 'PDF', quality: 'standard' as const }],
    },
    {
      category: '3D Model',
      options: [
        { format: 'glb' as const, label: 'GLB', quality: 'standard' as const },
        { format: 'gltf' as const, label: 'GLTF', quality: 'standard' as const },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        {/* Undo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo()}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          }
          title="Undo (Cmd/Ctrl + Z)"
        >
          Undo
        </Button>

        {/* Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo()}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          }
          title="Redo (Cmd/Ctrl + Shift + Z)"
        >
          Redo
        </Button>

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          Reset
        </Button>

        {/* Export Menu */}
        <div className="relative" ref={exportMenuRef}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            loading={isExporting}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>

          {/* Export Menu Dropdown */}
          <AnimatePresence>
            {showExportMenu && !isExporting && (
              <MotionDiv
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-64 z-dropdown"
              >
                <Card variant="elevated" className="p-3">
                  <div className="space-y-3">
                    {exportOptions.map((category) => (
                      <div key={category.category}>
                        <h4 className="text-tiny font-medium text-text-secondary mb-2 uppercase tracking-wide">
                          {category.category}
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          {category.options.map((option) => (
                            <button
                              key={`${option.format}-${option.quality}`}
                              onClick={() => handleExport(option.format, option.quality)}
                              className="px-3 py-2 text-small bg-base-light-gray hover:bg-accent-blue hover:text-white rounded-small transition-smooth text-left"
                            >
                              {option.label}
                              {option.quality === 'high' && (
                                <Badge variant="primary" size="sm" className="ml-1">
                                  HD
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard Shortcuts Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowShortcuts(!showShortcuts)}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          }
        >
          Shortcuts
        </Button>
      </div>

      {/* Error Message */}
      {exportError && (
        <Card variant="standard" className="p-3 bg-error-bg border-error">
          <p className="text-small text-error">
            Export failed: {exportError.message}
          </p>
        </Card>
      )}

      {/* Keyboard Shortcuts Panel */}
      <AnimatePresence>
        {showShortcuts && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card variant="standard" className="p-4">
              <h4 className="text-small font-semi-bold text-text-primary mb-3">
                Keyboard Shortcuts
              </h4>
              <div className="space-y-2 text-tiny">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Undo</span>
                  <Badge variant="neutral" size="sm">Cmd/Ctrl + Z</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Redo</span>
                  <Badge variant="neutral" size="sm">Cmd/Ctrl + Shift + Z</Badge>
                </div>
              </div>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
