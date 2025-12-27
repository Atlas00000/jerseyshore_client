'use client';

import { useState } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { PrintApplication } from '@/types/prints';
import { ComponentType } from '@/types/models';
import { PrintEditor } from './PrintEditor';
import { printLibraryStorage } from '@/lib/printLibraryStorage';
import { logger } from '@/lib/logger';

export function PrintManager() {
  const { printMap, updatePrint, removePrint, setPrintOrder, clearAllPrints, selectedComponent, setComponent } = useConfiguratorStore();
  const [editingPrint, setEditingPrint] = useState<{
    component: ComponentType;
    print: PrintApplication;
  } | null>(null);

  // Get all prints across all components, sorted by zIndex
  const allPrints = Object.entries(printMap)
    .flatMap(([component, prints]) =>
      (prints || []).map((print) => ({
        component: component as ComponentType,
        print,
      }))
    )
    .sort((a, b) => (a.print.zIndex || 0) - (b.print.zIndex || 0));

  const handleEdit = (component: ComponentType, print: PrintApplication) => {
    setEditingPrint({ component, print });
    setComponent(component); // Select the component when editing
    logger.info('Editing print', {
      context: 'PrintManager',
      metadata: { component, printId: print.id },
    });
  };

  const handleUpdate = (component: ComponentType, updatedPrint: PrintApplication) => {
    updatePrint(component, updatedPrint.id, updatedPrint);
    logger.info('Print updated', {
      context: 'PrintManager',
      metadata: { component, printId: updatedPrint.id },
    });
  };

  const handleDelete = (component: ComponentType, printId: string) => {
    removePrint(component, printId);
    if (editingPrint?.print.id === printId) {
      setEditingPrint(null);
    }
    logger.info('Print deleted', {
      context: 'PrintManager',
      metadata: { component, printId },
    });
  };

  const handleMoveUp = (component: ComponentType, printId: string) => {
    const prints = printMap[component] || [];
    const currentIndex = prints.findIndex((p) => p.id === printId);
    if (currentIndex > 0) {
      const newOrder = [...prints];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [
        newOrder[currentIndex - 1],
        newOrder[currentIndex],
      ];
      setPrintOrder(component, newOrder.map((p) => p.id));
    }
  };

  const handleMoveDown = (component: ComponentType, printId: string) => {
    const prints = printMap[component] || [];
    const currentIndex = prints.findIndex((p) => p.id === printId);
    if (currentIndex < prints.length - 1) {
      const newOrder = [...prints];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
        newOrder[currentIndex + 1],
        newOrder[currentIndex],
      ];
      setPrintOrder(component, newOrder.map((p) => p.id));
    }
  };

  const handleCloseEditor = () => {
    setEditingPrint(null);
  };

  const handleSaveToLibrary = (component: ComponentType, print: PrintApplication) => {
    const name = prompt('Enter a name for this print:');
    if (!name || !name.trim()) {
      return;
    }

    const category = prompt('Enter a category (optional):') || undefined;
    const tagsInput = prompt('Enter tags separated by commas (optional):') || '';
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      printLibraryStorage.save(print, { name: name.trim(), category, tags });
      logger.info('Print saved to library', {
        context: 'PrintManager',
        metadata: { printId: print.id, name: name.trim() },
      });
      alert('Print saved to library!');
    } catch (error) {
      logger.error('Failed to save print to library', {
        context: 'PrintManager',
        error: error instanceof Error ? error : new Error(String(error)),
      });
      alert('Failed to save print to library.');
    }
  };

  if (allPrints.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">No prints placed yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Print Management</h3>

      {/* Print Editor */}
      {editingPrint && (
        <div className="mb-4">
          <PrintEditor
            print={editingPrint.print}
            onUpdate={(updated) => handleUpdate(editingPrint.component, updated)}
            onDelete={() => handleDelete(editingPrint.component)}
            onClose={handleCloseEditor}
          />
        </div>
      )}

      {/* Print List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Placed Prints ({allPrints.length})
        </h4>
        {allPrints.map(({ component, print }, index) => {
          const printsForComponent = printMap[component] || [];
          const printIndex = printsForComponent.findIndex((p) => p.id === print.id);
          const canMoveUp = printIndex > 0;
          const canMoveDown = printIndex < printsForComponent.length - 1;

          return (
            <div
              key={`${component}-${print.id}`}
              className={`
                p-3 rounded-lg border-2 transition-all cursor-pointer
                ${
                  editingPrint?.component === component && editingPrint?.print.id === print.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
              onClick={() => handleEdit(component, print)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {component.replace('_', ' ')}
                    </span>
                    {print.zoneId && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {print.zoneId}
                      </span>
                    )}
                    {print.textContent && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
                        Text
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      Layer {print.zIndex !== undefined ? print.zIndex + 1 : index + 1}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    {print.textContent ? (
                      <span className="font-medium">{print.textContent}</span>
                    ) : (
                      <>
                        <span>Scale: {(print.scale * 100).toFixed(0)}%</span>
                        <span>Rotation: {print.rotation.toFixed(0)}°</span>
                      </>
                    )}
                    <span>Opacity: {(print.opacity * 100).toFixed(0)}%</span>
                    <span className="capitalize">{print.blendMode || 'normal'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* Layer order controls */}
                  <div className="flex flex-col gap-0.5 mr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(component, print.id);
                      }}
                      disabled={!canMoveUp}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                      title="Move up (bring forward)"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(component, print.id);
                      }}
                      disabled={!canMoveDown}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                      title="Move down (send backward)"
                    >
                      ↓
                    </button>
                  </div>
                  {print.customImageUrl && (
                    <img
                      src={print.customImageUrl}
                      alt="Print preview"
                      className="w-12 h-12 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveToLibrary(component, print);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                    title="Save to library"
                  >
                    💾
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(component, print.id);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Delete print"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allPrints.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              clearAllPrints();
              setEditingPrint(null);
              logger.info('All prints cleared', {
                context: 'PrintManager',
              });
            }}
            className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Clear All Prints
          </button>
        </div>
      )}
    </div>
  );
}

