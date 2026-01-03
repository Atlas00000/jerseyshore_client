'use client';

import { useState, useEffect } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ComponentType } from '@/types/models';
import { PrintZone, PrintApplication, BlendMode } from '@/types/prints';
import { PrintUploader } from './PrintUploader';

const ZONES: { value: PrintZone; label: string }[] = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'leftSleeve', label: 'Left Sleeve' },
  { value: 'rightSleeve', label: 'Right Sleeve' },
];

export function PrintPlacement() {
  const { selectedComponent, printMap, addPrint, updatePrint, removePrint, clearComponentPrints } = useConfiguratorStore();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPrints = selectedComponent ? (printMap[selectedComponent] || []) : [];
  const currentPrint = currentPrints.length > 0 ? currentPrints[0] : null;

  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [zone, setZone] = useState<PrintZone>('front');

  const reset = () => {
    setPosition({ x: 0.5, y: 0.5 });
    setScale(1.0);
    setRotation(0);
    setZone('front');
  };

  // Update image URL and placement values when print changes
  useEffect(() => {
    if (currentPrint) {
      setImageUrl(currentPrint.customImageUrl || currentPrint.printId || null);
      if (currentPrint.position) {
        setPosition(currentPrint.position);
      }
      if (currentPrint.scale !== undefined) {
        setScale(currentPrint.scale);
      }
      if (currentPrint.rotation !== undefined) {
        setRotation(currentPrint.rotation);
      }
      if (currentPrint.zone) {
        setZone(currentPrint.zone);
      }
    } else {
      setImageUrl(null);
      reset();
    }
  }, [currentPrint]);

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    setError(null);
    if (selectedComponent) {
      const application: PrintApplication = {
        id: currentPrint?.id || `print-${Date.now()}`,
        customImageUrl: url,
        position,
        scale,
        rotation,
        zone,
        opacity: 1,
        blendMode: currentPrint?.blendMode || BlendMode.NORMAL,
        component: selectedComponent,
      };
      if (currentPrint?.id) {
        updatePrint(selectedComponent, currentPrint.id, application);
      } else {
        addPrint(selectedComponent, application);
      }
    }
  };

  const handleUploadError = (err: string) => {
    setError(err);
  };

  const handleApply = () => {
    if (!selectedComponent || !imageUrl) {
      setError('Please upload an image first');
      return;
    }

    const application: PrintApplication = {
      id: currentPrint?.id || `print-${Date.now()}`,
      customImageUrl: imageUrl,
      position,
      scale,
      rotation,
      zone,
      opacity: 1,
      blendMode: currentPrint?.blendMode || BlendMode.NORMAL,
      component: selectedComponent,
    };
    if (currentPrint?.id) {
      updatePrint(selectedComponent, currentPrint.id, application);
    } else {
      addPrint(selectedComponent, application);
    }
    setError(null);
  };

  const handleRemove = () => {
    if (selectedComponent) {
      if (currentPrint?.id) {
        removePrint(selectedComponent, currentPrint.id);
      } else {
        clearComponentPrints(selectedComponent);
      }
      setImageUrl(null);
      reset();
    }
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Select a component to place a print.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Print/Logo Placement</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-4">
        <PrintUploader onUploadComplete={handleUploadComplete} onError={handleUploadError} />
      </div>

      {/* Image Preview */}
      {imageUrl && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Preview</h4>
          <div className="relative w-full h-32 h-32 bg-white border border-gray-200 rounded overflow-hidden">
            <img
              src={imageUrl}
              alt="Print preview"
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center',
              }}
            />
          </div>
        </div>
      )}

      {/* Zone Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Placement Zone</label>
        <div className="grid grid-cols-2 gap-2">
          {ZONES.map((z) => (
            <button
              key={z.value}
              onClick={() => setZone(z.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                zone === z.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Position Controls */}
      <div className="mb-4 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">X Position</label>
            <span className="text-sm text-gray-600">{position.x.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={position.x}
            onChange={(e) => setPosition({ ...position, x: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Y Position</label>
            <span className="text-sm text-gray-600">{position.y.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={position.y}
            onChange={(e) => setPosition({ ...position, y: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Scale Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Scale</label>
          <span className="text-sm text-gray-600">{scale.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Rotation Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Rotation</label>
          <span className="text-sm text-gray-600">{rotation}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {imageUrl && (
          <>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Apply Print
            </button>
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}



