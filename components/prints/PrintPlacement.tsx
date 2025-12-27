'use client';

import { useState, useEffect, useMemo } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ProcessedImage } from '@/lib/imageProcessor';
import { PrintZone, getZoneById } from '@/types/zones';
import { PrintApplication, BlendMode, PrintLibraryEntry } from '@/types/prints';
import { ComponentType } from '@/types/models';
import { FileUploader } from './FileUploader';
import { PrintZoneSelector } from './PrintZoneSelector';
import { PrintLibrary } from './PrintLibrary';
import zonesData from '@/data/zones.json';
import { PrintZoneLibrary } from '@/types/zones';
import { logger } from '@/lib/logger';

type PlacementMode = 'zone' | 'free';

export function PrintPlacement() {
  const { selectedComponent, printMap, addPrint, clearComponentPrints } = useConfiguratorStore();
  const [zones, setZones] = useState<PrintZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<ProcessedImage | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placementMode, setPlacementMode] = useState<PlacementMode>('zone');
  const [blendMode, setBlendMode] = useState<BlendMode>(BlendMode.NORMAL);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    const zoneLibrary = zonesData as PrintZoneLibrary;
    setZones(zoneLibrary.zones);
  }, []);

  // Get selected zone
  const selectedZone = useMemo(() => {
    if (!selectedZoneId) return null;
    return getZoneById(zones, selectedZoneId);
  }, [zones, selectedZoneId]);

  // Reset when component changes
  useEffect(() => {
    setSelectedZoneId(null);
    setUploadedImage(null);
    setIsPlacing(false);
  }, [selectedComponent]);

  // Reset zone selection when switching to free mode
  useEffect(() => {
    if (placementMode === 'free') {
      setSelectedZoneId(null);
    }
  }, [placementMode]);

  const handleImageUploaded = (image: ProcessedImage) => {
    setUploadedImage(image);
    logger.info('Image uploaded, ready for placement', {
      context: 'PrintPlacement',
      metadata: {
        fileName: image.file.name,
        width: image.width,
        height: image.height,
      },
    });
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    logger.info('Zone selected', {
      context: 'PrintPlacement',
      metadata: { zoneId },
    });
  };

  const handlePlacePrint = () => {
    if (!selectedComponent || !uploadedImage) {
      logger.warn('Cannot place print: missing requirements', {
        context: 'PrintPlacement',
        metadata: {
          hasComponent: !!selectedComponent,
          hasImage: !!uploadedImage,
        },
      });
      return;
    }

    // Zone mode requires a zone
    if (placementMode === 'zone' && !selectedZone) {
      logger.warn('Cannot place print: zone not selected', {
        context: 'PrintPlacement',
      });
      return;
    }

    setIsPlacing(true);

    // Determine initial position based on mode
    let initialPosition: { u: number; v: number };
    if (placementMode === 'zone' && selectedZone) {
      initialPosition = {
        x: selectedZone.defaultPosition.u,
        y: selectedZone.defaultPosition.v,
      };
    } else {
      // Free placement: start at center
      initialPosition = { x: 0.5, y: 0.5 };
    }

    // Create print application
    const printApplication: PrintApplication = {
      id: `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customImageUrl: uploadedImage.url,
      position: initialPosition,
      scale: 1.0,
      rotation: 0,
      zone: 'front', // Legacy
      zoneId: placementMode === 'zone' ? selectedZone?.id : undefined,
      opacity: 1.0,
      blendMode: blendMode,
      component: selectedComponent,
      width: uploadedImage.width,
      height: uploadedImage.height,
      zIndex: existingPrints.length, // Add on top
    };

    // Add print application (supports multiple prints)
    addPrint(selectedComponent, printApplication);

    logger.info('Print placed', {
      context: 'PrintPlacement',
      metadata: {
        mode: placementMode,
        component: selectedComponent,
        zoneId: selectedZone?.id,
        printId: printApplication.id,
      },
    });

    // Reset state
    setUploadedImage(null);
    setSelectedZoneId(null);
    setIsPlacing(false);
  };

  const handleCancel = () => {
    setUploadedImage(null);
    setSelectedZoneId(null);
    setIsPlacing(false);
  };

  const handleLoadFromLibrary = (entry: PrintLibraryEntry) => {
    if (!selectedComponent) {
      logger.warn('Cannot load print: component not selected', {
        context: 'PrintPlacement',
      });
      return;
    }

    // Create a new print application from the library entry
    // Reset position to default and update component
    const printApplication: PrintApplication = {
      ...entry.printData,
      id: `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // New ID
      component: selectedComponent, // Update to current component
      position: placementMode === 'zone' && selectedZone
        ? { x: selectedZone.defaultPosition.u, y: selectedZone.defaultPosition.v }
        : { x: 0.5, y: 0.5 }, // Default center position
      zoneId: placementMode === 'zone' ? selectedZone?.id : undefined,
      zIndex: existingPrints.length, // Add on top
    };

    addPrint(selectedComponent, printApplication);
    setShowLibrary(false);

    logger.info('Print loaded from library', {
      context: 'PrintPlacement',
      metadata: {
        libraryEntryId: entry.id,
        printId: printApplication.id,
        component: selectedComponent,
      },
    });
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Select a component to add a print.</p>
      </div>
    );
  }

  const existingPrints = printMap[selectedComponent] || [];
  const hasExistingPrints = existingPrints.length > 0;

  const handleClearPrints = () => {
    if (selectedComponent) {
      clearComponentPrints(selectedComponent);
      logger.info('Prints cleared for component', {
        context: 'PrintPlacement',
        metadata: { component: selectedComponent },
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Print Placement</h3>
        {hasExistingPrints && (
          <button
            onClick={handleClearPrints}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            title="Clear all prints from this component"
          >
            Clear All ({existingPrints.length})
          </button>
        )}
      </div>

      {hasExistingPrints && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          {existingPrints.length} print{existingPrints.length > 1 ? 's' : ''} already placed on this component. 
          You can add more prints - they will be layered on top.
        </div>
      )}

      {/* Load from Library */}
      <div className="mb-4">
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showLibrary
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showLibrary ? 'Hide Library' : 'Load from Library'}
        </button>
      </div>

      {showLibrary && (
        <div className="mb-4">
          <PrintLibrary onSelectPrint={handleLoadFromLibrary} />
        </div>
      )}

      {/* Placement Mode Toggle */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Placement Mode</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setPlacementMode('zone')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              placementMode === 'zone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Zone-Based
          </button>
          <button
            onClick={() => setPlacementMode('free')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              placementMode === 'free'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Free Placement
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {placementMode === 'zone'
            ? 'Place prints within predefined zones'
            : 'Place prints anywhere on the component'}
        </p>
      </div>

      {/* Step 1: Upload Image */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Step 1: Upload Image
        </h4>
        {!uploadedImage ? (
          <FileUploader
            onImageUploaded={handleImageUploaded}
            maxFiles={1}
            disabled={isPlacing}
          />
        ) : (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-3">
              {uploadedImage.thumbnailUrl && (
                <img
                  src={uploadedImage.thumbnailUrl}
                  alt="Uploaded"
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{uploadedImage.file.name}</p>
                <p className="text-xs text-gray-500">
                  {uploadedImage.width} × {uploadedImage.height}px
                </p>
              </div>
              <button
                onClick={() => setUploadedImage(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Select Zone (only in zone mode) */}
      {uploadedImage && placementMode === 'zone' && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Step 2: Select Placement Zone
          </h4>
          <PrintZoneSelector
            selectedComponent={selectedComponent}
            selectedZoneId={selectedZoneId}
            onZoneSelect={handleZoneSelect}
          />
        </div>
      )}

      {/* Blend Mode Selection */}
      {uploadedImage && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Blend Mode
          </h4>
          <select
            value={blendMode}
            onChange={(e) => setBlendMode(e.target.value as BlendMode)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={BlendMode.NORMAL}>Normal</option>
            <option value={BlendMode.MULTIPLY}>Multiply</option>
            <option value={BlendMode.SCREEN}>Screen</option>
            <option value={BlendMode.OVERLAY}>Overlay</option>
            <option value={BlendMode.SOFT_LIGHT}>Soft Light</option>
            <option value={BlendMode.HARD_LIGHT}>Hard Light</option>
            <option value={BlendMode.COLOR_DODGE}>Color Dodge</option>
            <option value={BlendMode.COLOR_BURN}>Color Burn</option>
            <option value={BlendMode.DARKEN}>Darken</option>
            <option value={BlendMode.LIGHTEN}>Lighten</option>
            <option value={BlendMode.DIFFERENCE}>Difference</option>
            <option value={BlendMode.EXCLUSION}>Exclusion</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            How this print blends with the material and other prints
          </p>
        </div>
      )}

      {/* Step 3: Place Print */}
      {uploadedImage && (placementMode === 'free' || selectedZone) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Step {placementMode === 'zone' ? '4' : '3'}: Place Print
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            {placementMode === 'zone' ? (
              <>
                Click on the 3D model to place your print in the <strong>{selectedZone?.name}</strong> zone.
                The print will be positioned at the default location for now.
              </>
            ) : (
              <>
                Click anywhere on the 3D model to place your print. You can adjust the position, scale, and rotation after placement.
              </>
            )}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePlacePrint}
              disabled={isPlacing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPlacing
                ? 'Placing...'
                : placementMode === 'zone'
                  ? 'Place Print at Default Position'
                  : 'Place Print at Center'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isPlacing}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

