'use client';

/**
 * PrintManager Component
 * List/card view toggle, print item cards with previews, edit/delete actions, and layer ordering
 */

import { useState } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { PrintApplication } from '@/types/prints';
import { ComponentType } from '@/types/models';
import { PrintEditor } from './PrintEditor';
import { printLibraryStorage } from '@/lib/printLibraryStorage';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';
import { HoverScale } from '@/lib/animations/framerMotion';
import { ModalPanel, PanelHeader, PanelBody } from '@/components/ui/Panel';

type ViewMode = 'list' | 'card';

export function PrintManager() {
  const { printMap, updatePrint, removePrint, setPrintOrder, clearAllPrints, selectedComponent, setComponent } = useConfiguratorStore();
  const [editingPrint, setEditingPrint] = useState<{
    component: ComponentType;
    print: PrintApplication;
  } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('card');

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
    setComponent(component);
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
      <Card variant="standard">
        <div className="p-6 text-center">
          <svg
            className="w-12 h-12 mx-auto text-text-tertiary mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-small text-text-secondary">No prints placed yet</p>
          <p className="text-tiny text-text-tertiary mt-1">
            Upload an image or add text to get started
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-h4 font-bold text-text-primary">
          Print Management
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          />
          <Button
            variant={viewMode === 'card' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('card')}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Print Count */}
      <div className="flex items-center gap-2">
        <Badge variant="info" size="md">
          {allPrints.length}
        </Badge>
        <span className="text-small text-text-secondary">
          print{allPrints.length > 1 ? 's' : ''} placed
        </span>
      </div>

      {/* Print Editor Modal */}
      <AnimatePresence>
        {editingPrint && (
          <ModalPanel
            isOpen={!!editingPrint}
            onClose={handleCloseEditor}
            showBackdrop
          >
            <PanelHeader onClose={handleCloseEditor}>
              <h3 className="text-h4 font-bold text-text-primary">Edit Print</h3>
            </PanelHeader>
            <PanelBody>
              <PrintEditor
                print={editingPrint.print}
                onUpdate={(updated) => handleUpdate(editingPrint.component, updated)}
                onDelete={() => handleDelete(editingPrint.component, editingPrint.print.id)}
                onClose={handleCloseEditor}
              />
            </PanelBody>
          </ModalPanel>
        )}
      </AnimatePresence>

      {/* Print List/Cards */}
      <div className={viewMode === 'card' ? 'grid grid-cols-1 gap-3' : 'space-y-2'}>
        {allPrints.map(({ component, print }, index) => {
          const printsForComponent = printMap[component] || [];
          const printIndex = printsForComponent.findIndex((p) => p.id === print.id);
          const canMoveUp = printIndex > 0;
          const canMoveDown = printIndex < printsForComponent.length - 1;
          const isEditing = editingPrint?.component === component && editingPrint?.print.id === print.id;

          if (viewMode === 'card') {
            return (
              <MotionDiv
                key={`${component}-${print.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  variant={isEditing ? 'elevated' : 'standard'}
                  hover
                  className={`
                    cursor-pointer transition-smooth
                    ${isEditing ? 'border-accent-blue shadow-glow-primary' : ''}
                  `}
                  onClick={() => handleEdit(component, print)}
                >
                  <div className="flex items-start gap-4">
                    {/* Preview Thumbnail */}
                    {print.customImageUrl && (
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-medium overflow-hidden border-2 border-base-light-gray bg-base-light-gray">
                          <img
                            src={print.customImageUrl}
                            alt="Print preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Print Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="primary" size="sm">
                              {component.replace('_', ' ')}
                            </Badge>
                            {print.zoneId && (
                              <Badge variant="neutral" size="sm">
                                {print.zoneId}
                              </Badge>
                            )}
                            {print.textContent && (
                              <Badge variant="info" size="sm">
                                Text
                              </Badge>
                            )}
                            <Badge variant="secondary" size="sm">
                              Layer {print.zIndex !== undefined ? print.zIndex + 1 : index + 1}
                            </Badge>
                          </div>
                          {print.textContent && (
                            <p className="text-small font-medium text-text-primary truncate">
                              "{print.textContent}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Print Details */}
                      <div className="flex flex-wrap items-center gap-2 text-tiny text-text-secondary">
                        {!print.textContent && (
                          <>
                            <span>Scale: {(print.scale * 100).toFixed(0)}%</span>
                            <span>•</span>
                            <span>Rotation: {print.rotation.toFixed(0)}°</span>
                            <span>•</span>
                          </>
                        )}
                        <span>Opacity: {(print.opacity * 100).toFixed(0)}%</span>
                        <span>•</span>
                        <span className="capitalize">{print.blendMode || 'normal'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Layer Controls */}
                      <div className="flex flex-col gap-0.5 mr-2">
                        <HoverScale scale={1.2}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveUp(component, print.id);
                            }}
                            disabled={!canMoveUp}
                            className="p-1 text-text-tertiary hover:text-accent-blue disabled:opacity-30 disabled:cursor-not-allowed transition-smooth rounded-small"
                            title="Move up (bring forward)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                        </HoverScale>
                        <HoverScale scale={1.2}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveDown(component, print.id);
                            }}
                            disabled={!canMoveDown}
                            className="p-1 text-text-tertiary hover:text-accent-blue disabled:opacity-30 disabled:cursor-not-allowed transition-smooth rounded-small"
                            title="Move down (send backward)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </HoverScale>
                      </div>

                      {/* Save to Library */}
                      <HoverScale scale={1.1}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveToLibrary(component, print);
                          }}
                          className="p-1.5 text-accent-blue hover:bg-accent-blue/10 rounded-medium transition-smooth"
                          title="Save to library"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                        </button>
                      </HoverScale>

                      {/* Delete */}
                      <HoverScale scale={1.1}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(component, print.id);
                          }}
                          className="p-1.5 text-error hover:bg-error-bg rounded-medium transition-smooth"
                          title="Delete print"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </HoverScale>
                    </div>
                  </div>
                </Card>
              </MotionDiv>
            );
          }

          // List view
          return (
            <MotionDiv
              key={`${component}-${print.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                variant={isEditing ? 'elevated' : 'standard'}
                hover
                className={`
                  cursor-pointer transition-smooth
                  ${isEditing ? 'border-accent-blue shadow-glow-primary' : ''}
                `}
                onClick={() => handleEdit(component, print)}
              >
                <div className="flex items-center gap-4">
                  {print.customImageUrl && (
                    <div className="w-16 h-16 rounded-medium overflow-hidden border-2 border-base-light-gray bg-base-light-gray flex-shrink-0">
                      <img
                        src={print.customImageUrl}
                        alt="Print preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary" size="sm">
                        {component.replace('_', ' ')}
                      </Badge>
                      {print.zoneId && <Badge variant="neutral" size="sm">{print.zoneId}</Badge>}
                      {print.textContent && <Badge variant="info" size="sm">Text</Badge>}
                      <Badge variant="secondary" size="sm">
                        Layer {print.zIndex !== undefined ? print.zIndex + 1 : index + 1}
                      </Badge>
                    </div>
                    {print.textContent ? (
                      <p className="text-small font-medium text-text-primary truncate">
                        "{print.textContent}"
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-tiny text-text-secondary">
                        <span>Scale: {(print.scale * 100).toFixed(0)}%</span>
                        <span>•</span>
                        <span>Rotation: {print.rotation.toFixed(0)}°</span>
                        <span>•</span>
                        <span>Opacity: {(print.opacity * 100).toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="flex flex-col gap-0.5 mr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveUp(component, print.id);
                        }}
                        disabled={!canMoveUp}
                        className="p-1 text-text-tertiary hover:text-accent-blue disabled:opacity-30"
                        title="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveDown(component, print.id);
                        }}
                        disabled={!canMoveDown}
                        className="p-1 text-text-tertiary hover:text-accent-blue disabled:opacity-30"
                        title="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveToLibrary(component, print);
                      }}
                      className="p-1.5 text-accent-blue hover:bg-accent-blue/10 rounded-medium"
                      title="Save to library"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(component, print.id);
                      }}
                      className="p-1.5 text-error hover:bg-error-bg rounded-medium"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            </MotionDiv>
          );
        })}
      </div>

      {/* Clear All Button */}
      {allPrints.length > 0 && (
        <Card variant="standard" className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearAllPrints();
              setEditingPrint(null);
              logger.info('All prints cleared', {
                context: 'PrintManager',
              });
            }}
            fullWidth
            className="text-error hover:bg-error-bg"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Clear All Prints
          </Button>
        </Card>
      )}
    </div>
  );
}
