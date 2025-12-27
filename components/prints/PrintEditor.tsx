'use client';

import { useState, useEffect } from 'react';
import { PrintApplication, BlendMode } from '@/types/prints';
import { logger } from '@/lib/logger';

interface PrintEditorProps {
  print: PrintApplication;
  onUpdate: (print: PrintApplication) => void;
  onDelete: () => void;
  onClose?: () => void;
}

export function PrintEditor({ print, onUpdate, onDelete, onClose }: PrintEditorProps) {
  const [localPrint, setLocalPrint] = useState<PrintApplication>(print);

  // Update local state when print prop changes
  useEffect(() => {
    setLocalPrint(print);
  }, [print]);

  const handleUpdate = (updates: Partial<PrintApplication>) => {
    const updated = { ...localPrint, ...updates };
    setLocalPrint(updated);
    onUpdate(updated);
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    handleUpdate({
      position: {
        ...localPrint.position,
        [axis]: clampedValue,
      },
    });
  };

  const handleScaleChange = (value: number) => {
    const clampedValue = Math.max(0.1, Math.min(2.0, value));
    handleUpdate({ scale: clampedValue });
  };

  const handleRotationChange = (value: number) => {
    const clampedValue = ((value % 360) + 360) % 360; // Normalize to 0-360
    handleUpdate({ rotation: clampedValue });
  };

  const handleOpacityChange = (value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    handleUpdate({ opacity: clampedValue });
  };

  const handleBlendModeChange = (mode: BlendMode) => {
    handleUpdate({ blendMode: mode });
  };

  const handleReset = () => {
    const reset: PrintApplication = {
      ...localPrint,
      position: { x: 0.5, y: 0.5 },
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
    };
    setLocalPrint(reset);
    onUpdate(reset);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Edit Print</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* Position Controls */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Position (UV Coordinates)</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-600">X (U)</label>
              <span className="text-sm text-gray-500">
                {localPrint.position.x.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={localPrint.position.x}
              onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-600">Y (V)</label>
              <span className="text-sm text-gray-500">
                {localPrint.position.y.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={localPrint.position.y}
              onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Scale Control */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Scale</label>
          <span className="text-sm text-gray-500">
            {(localPrint.scale * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.01"
          value={localPrint.scale}
          onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10%</span>
          <span>200%</span>
        </div>
      </div>

      {/* Rotation Control */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Rotation</label>
          <span className="text-sm text-gray-500">
            {localPrint.rotation.toFixed(0)}°
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={localPrint.rotation}
          onChange={(e) => handleRotationChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0°</span>
          <span>360°</span>
        </div>
      </div>

      {/* Opacity Control */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Opacity</label>
          <span className="text-sm text-gray-500">
            {(localPrint.opacity * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={localPrint.opacity}
          onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Blend Mode Control */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Blend Mode
        </label>
        <select
          value={localPrint.blendMode || BlendMode.NORMAL}
          onChange={(e) => handleBlendModeChange(e.target.value as BlendMode)}
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
          How the print blends with the material underneath
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Reset
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

