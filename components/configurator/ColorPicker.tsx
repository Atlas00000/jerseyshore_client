'use client';

import { useState, useEffect, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { hexToRgb, rgbToHex, normalizeHex, isValidHex } from '@/lib/colorUtils';
import { RGB } from '@/lib/colorUtils';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import materialsData from '@/data/materials.json';
import { MaterialLibrary } from '@/types/materials';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

/**
 * Calculate a material-tinted color preview
 * This simulates how a color would look when applied to a material
 */
function calculateMaterialTint(baseColor: string, materialRoughness: number = 0.5, materialMetallic: number = 0): string {
  const rgb = hexToRgb(baseColor);
  
  // For metallic materials, add a slight metallic tint
  if (materialMetallic > 0.1) {
    const metallicFactor = materialMetallic * 0.3;
    rgb.r = Math.min(255, rgb.r + (255 - rgb.r) * metallicFactor);
    rgb.g = Math.min(255, rgb.g + (255 - rgb.g) * metallicFactor);
    rgb.b = Math.min(255, rgb.b + (255 - rgb.b) * metallicFactor);
  }
  
  // For rough materials, slightly desaturate
  if (materialRoughness > 0.7) {
    const desaturateFactor = (materialRoughness - 0.7) * 0.3;
    const gray = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
    rgb.r = rgb.r * (1 - desaturateFactor) + gray * desaturateFactor;
    rgb.g = rgb.g * (1 - desaturateFactor) + gray * desaturateFactor;
    rgb.b = rgb.b * (1 - desaturateFactor) + gray * desaturateFactor;
  }
  
  return rgbToHex(rgb);
}

export function ColorPicker({ color, onChange, label = 'Color' }: ColorPickerProps) {
  const { selectedComponent, materialMap } = useConfiguratorStore();
  const [hexValue, setHexValue] = useState(color);
  const [rgbValue, setRgbValue] = useState<RGB>(hexToRgb(color));
  const [colorMode, setColorMode] = useState<'basic' | 'material'>('basic');

  // Get current material for tinting preview
  const currentMaterial = useMemo(() => {
    if (!selectedComponent || !materialMap[selectedComponent]) return null;
    const materials = materialsData.materials as MaterialLibrary;
    return materials.find((m) => m.id === materialMap[selectedComponent]) || null;
  }, [selectedComponent, materialMap]);

  // Calculate material-tinted color
  const materialTintedColor = useMemo(() => {
    if (!currentMaterial || colorMode === 'basic') return color;
    const props = currentMaterial.properties;
    return calculateMaterialTint(
      color,
      props.roughness ?? 0.5,
      props.metallic ?? 0
    );
  }, [color, currentMaterial, colorMode]);

  useEffect(() => {
    setHexValue(color);
    setRgbValue(hexToRgb(color));
  }, [color]);

  const handleHexChange = (value: string) => {
    setHexValue(value);
    if (isValidHex(value)) {
      const normalized = normalizeHex(value);
      const rgb = hexToRgb(normalized);
      setRgbValue(rgb);
      onChange(normalized);
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValue, [channel]: Math.max(0, Math.min(255, value)) };
    setRgbValue(newRgb);
    const newHex = rgbToHex(newRgb);
    setHexValue(newHex);
    onChange(newHex);
  };

  const handleColorPickerChange = (newColor: string) => {
    setHexValue(newColor);
    setRgbValue(hexToRgb(newColor));
    onChange(newColor);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{label}</h3>
        {currentMaterial && (
          <div className="flex gap-2">
            <button
              onClick={() => setColorMode('basic')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                colorMode === 'basic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Basic
            </button>
            <button
              onClick={() => setColorMode('material')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                colorMode === 'material'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Material Preview
            </button>
          </div>
        )}
      </div>

      {/* Color Preview Comparison */}
      {currentMaterial && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Preview on {currentMaterial.properties.name}</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Basic Color</p>
              <div
                className="w-full h-16 rounded border-2 border-gray-300"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Material Tinted</p>
              <div
                className="w-full h-16 rounded border-2 border-gray-300"
                style={{ backgroundColor: materialTintedColor }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Wheel */}
      <div className="mb-4 flex justify-center">
        <HexColorPicker color={hexValue} onChange={handleColorPickerChange} />
      </div>

      {/* Hex Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Hex</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={hexValue}
            onChange={(e) => handleHexChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#000000"
          />
          <div
            className="w-10 h-10 rounded border border-gray-300"
            style={{ backgroundColor: hexValue }}
          />
        </div>
      </div>

      {/* RGB Sliders */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Red</label>
            <span className="text-sm text-gray-600">{rgbValue.r}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={rgbValue.r}
            onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Green</label>
            <span className="text-sm text-gray-600">{rgbValue.g}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={rgbValue.g}
            onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Blue</label>
            <span className="text-sm text-gray-600">{rgbValue.b}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={rgbValue.b}
            onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
}

