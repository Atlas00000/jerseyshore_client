'use client';

/**
 * PrintPlacement Component
 * Modern file upload area, zone selector with visual guides, and mode toggle with smooth transitions
 */

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
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';

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

    if (placementMode === 'zone' && !selectedZone) {
      logger.warn('Cannot place print: zone not selected', {
        context: 'PrintPlacement',
      });
      return;
    }

    setIsPlacing(true);

    const existingPrints = printMap[selectedComponent] || [];

    let initialPosition: { x: number; y: number };
    if (placementMode === 'zone' && selectedZone) {
      initialPosition = {
        x: selectedZone.defaultPosition.u,
        y: selectedZone.defaultPosition.v,
      };
    } else {
      initialPosition = { x: 0.5, y: 0.5 };
    }

    const printApplication: PrintApplication = {
      id: `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customImageUrl: uploadedImage.url,
      position: initialPosition,
      scale: 1.0,
      rotation: 0,
      zone: 'front',
      zoneId: placementMode === 'zone' ? selectedZone?.id : undefined,
      opacity: 1.0,
      blendMode: blendMode,
      component: selectedComponent,
      width: uploadedImage.width,
      height: uploadedImage.height,
      zIndex: existingPrints.length,
    };

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

    const existingPrints = printMap[selectedComponent] || [];
    const printApplication: PrintApplication = {
      ...entry.printData,
      id: `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      component: selectedComponent,
      position: placementMode === 'zone' && selectedZone
        ? { x: selectedZone.defaultPosition.u, y: selectedZone.defaultPosition.v }
        : { x: 0.5, y: 0.5 },
      zoneId: placementMode === 'zone' ? selectedZone?.id : undefined,
      zIndex: existingPrints.length,
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
      <Card variant="standard">
        <div className="p-4 text-center">
          <p className="text-small text-text-tertiary">
            Select a component to add a print
          </p>
        </div>
      </Card>
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

  const blendModeOptions = [
    { value: BlendMode.NORMAL, label: 'Normal' },
    { value: BlendMode.MULTIPLY, label: 'Multiply' },
    { value: BlendMode.SCREEN, label: 'Screen' },
    { value: BlendMode.OVERLAY, label: 'Overlay' },
    { value: BlendMode.SOFT_LIGHT, label: 'Soft Light' },
    { value: BlendMode.HARD_LIGHT, label: 'Hard Light' },
    { value: BlendMode.COLOR_DODGE, label: 'Color Dodge' },
    { value: BlendMode.COLOR_BURN, label: 'Color Burn' },
    { value: BlendMode.DARKEN, label: 'Darken' },
    { value: BlendMode.LIGHTEN, label: 'Lighten' },
    { value: BlendMode.DIFFERENCE, label: 'Difference' },
    { value: BlendMode.EXCLUSION, label: 'Exclusion' },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-h4 font-bold text-text-primary">Print Placement</h3>
        {hasExistingPrints && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearPrints}
            className="text-error hover:bg-error-bg"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Existing Prints Info */}
      <AnimatePresence>
        {hasExistingPrints && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card variant="standard" className="p-3 bg-info-bg border-info">
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">
                  {existingPrints.length}
                </Badge>
                <p className="text-small text-info">
                  {existingPrints.length} print{existingPrints.length > 1 ? 's' : ''} already placed. 
                  You can add more prints - they will be layered on top.
                </p>
              </div>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Load from Library */}
      <div>
        <Button
          variant={showLibrary ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowLibrary(!showLibrary)}
          fullWidth
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        >
          {showLibrary ? 'Hide Library' : 'Load from Library'}
        </Button>
      </div>

      {/* Print Library */}
      <AnimatePresence>
        {showLibrary && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PrintLibrary onSelectPrint={handleLoadFromLibrary} />
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Placement Mode Toggle */}
      <Card variant="standard" className="p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setPlacementMode('zone')}
            className={`
              flex-1 px-4 py-2 rounded-medium text-small font-medium transition-smooth
              ${
                placementMode === 'zone'
                  ? 'bg-accent-blue text-white shadow-elevation-1'
                  : 'bg-base-light-gray text-text-secondary hover:bg-base-cool-gray hover:text-text-primary'
              }
            `}
          >
            Zone-Based
          </button>
          <button
            onClick={() => setPlacementMode('free')}
            className={`
              flex-1 px-4 py-2 rounded-medium text-small font-medium transition-smooth
              ${
                placementMode === 'free'
                  ? 'bg-accent-blue text-white shadow-elevation-1'
                  : 'bg-base-light-gray text-text-secondary hover:bg-base-cool-gray hover:text-text-primary'
              }
            `}
          >
            Free Placement
          </button>
        </div>
        <p className="text-tiny text-text-tertiary mt-2 px-2">
          {placementMode === 'zone'
            ? 'Place prints within predefined zones'
            : 'Place prints anywhere on the component'}
        </p>
      </Card>

      {/* Step 1: Upload Image */}
      <Card variant="standard" className="p-4">
        <h4 className="text-small font-semi-bold text-text-primary mb-3">
          Step 1: Upload Image
        </h4>
        {!uploadedImage ? (
          <FileUploader
            onImageUploaded={handleImageUploaded}
            maxFiles={1}
            disabled={isPlacing}
          />
        ) : (
          <div className="p-3 bg-success-bg border border-success rounded-medium">
            <div className="flex items-center gap-3">
              {uploadedImage.thumbnailUrl && (
                <img
                  src={uploadedImage.thumbnailUrl}
                  alt="Uploaded"
                  className="w-16 h-16 object-cover rounded-medium border-2 border-base-light-gray"
                />
              )}
              <div className="flex-1">
                <p className="text-small font-medium text-text-primary">{uploadedImage.file.name}</p>
                <p className="text-tiny text-text-secondary">
                  {uploadedImage.width} × {uploadedImage.height}px
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedImage(null)}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Step 2: Select Zone (only in zone mode) */}
      <AnimatePresence>
        {uploadedImage && placementMode === 'zone' && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="standard" className="p-4">
              <h4 className="text-small font-semi-bold text-text-primary mb-3">
                Step 2: Select Placement Zone
              </h4>
              <PrintZoneSelector
                selectedComponent={selectedComponent}
                selectedZoneId={selectedZoneId}
                onZoneSelect={handleZoneSelect}
              />
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Blend Mode Selection */}
      <AnimatePresence>
        {uploadedImage && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="standard" className="p-4">
              <h4 className="text-small font-semi-bold text-text-primary mb-3">
                Blend Mode
              </h4>
              <Select
                options={blendModeOptions}
                value={blendMode}
                onChange={(e) => setBlendMode(e.target.value as BlendMode)}
                placeholder="Select blend mode..."
              />
              <p className="text-tiny text-text-tertiary mt-2">
                How this print blends with the material and other prints
              </p>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Step 3: Place Print */}
      <AnimatePresence>
        {uploadedImage && (placementMode === 'free' || selectedZone) && (
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="standard" className="p-4">
              <h4 className="text-small font-semi-bold text-text-primary mb-3">
                Step {placementMode === 'zone' ? '3' : '2'}: Place Print
              </h4>
              <p className="text-small text-text-secondary mb-4">
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePlacePrint}
                  disabled={isPlacing}
                  loading={isPlacing}
                  fullWidth
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  }
                >
                  {isPlacing
                    ? 'Placing...'
                    : placementMode === 'zone'
                      ? 'Place Print at Default Position'
                      : 'Place Print at Center'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isPlacing}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
