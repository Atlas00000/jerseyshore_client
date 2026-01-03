'use client';

/**
 * ColorPicker Component
 * Modern color picker UI with gradient preview, recent colors with animations, and material preview mode
 */

import { useState, useEffect, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { hexToRgb, rgbToHex, normalizeHex, isValidHex } from '@/lib/colorUtils';
import { RGB } from '@/lib/colorUtils';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import materialsData from '@/data/materials.json';
import { MaterialLibrary } from '@/types/materials';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';
import { HoverScale } from '@/lib/animations/framerMotion';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

/**
 * Calculate a material-tinted color preview
 */
function calculateMaterialTint(baseColor: string, materialRoughness: number = 0.5, materialMetallic: number = 0): string {
  const rgb = hexToRgb(baseColor);
  
  if (materialMetallic > 0.1) {
    const metallicFactor = materialMetallic * 0.3;
    rgb.r = Math.min(255, rgb.r + (255 - rgb.r) * metallicFactor);
    rgb.g = Math.min(255, rgb.g + (255 - rgb.g) * metallicFactor);
    rgb.b = Math.min(255, rgb.b + (255 - rgb.b) * metallicFactor);
  }
  
  if (materialRoughness > 0.7) {
    const desaturateFactor = (materialRoughness - 0.7) * 0.3;
    const gray = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
    rgb.r = rgb.r * (1 - desaturateFactor) + gray * desaturateFactor;
    rgb.g = rgb.g * (1 - desaturateFactor) + gray * desaturateFactor;
    rgb.b = rgb.b * (1 - desaturateFactor) + gray * desaturateFactor;
  }
  
  return rgbToHex(rgb);
}

// Recent colors (can be enhanced with localStorage)
const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
];

export function ColorPicker({ color, onChange, label = 'Color' }: ColorPickerProps) {
  const { selectedComponent, materialMap, recentColors } = useConfiguratorStore();
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

  const handlePresetColorClick = (presetColor: string) => {
    onChange(presetColor);
  };

  // Combine preset and recent colors
  const allRecentColors = [...(recentColors || []), ...PRESET_COLORS].slice(0, 20);

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      {currentMaterial && (
        <div className="flex gap-2">
          <Button
            variant={colorMode === 'basic' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setColorMode('basic')}
            className="flex-1"
          >
            Basic
          </Button>
          <Button
            variant={colorMode === 'material' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setColorMode('material')}
            className="flex-1"
          >
            Material Preview
          </Button>
        </div>
      )}

      {/* Color Preview Comparison */}
      {currentMaterial && (
        <Card variant="standard" className="p-4">
          <p className="text-tiny text-text-secondary mb-3">
            Preview on {currentMaterial.properties.name}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-tiny text-text-tertiary mb-2">Basic Color</p>
              <div
                className="w-full h-20 rounded-medium border-2 border-base-light-gray shadow-elevation-1 transition-smooth"
                style={{ backgroundColor: color }}
              />
            </div>
            <div>
              <p className="text-tiny text-text-tertiary mb-2">Material Tinted</p>
              <div
                className="w-full h-20 rounded-medium border-2 border-base-light-gray shadow-elevation-1 transition-smooth"
                style={{ backgroundColor: materialTintedColor }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Color Picker Wheel */}
      <Card variant="standard" className="p-4">
        <div className="flex justify-center mb-4">
          <HexColorPicker color={hexValue} onChange={handleColorPickerChange} />
        </div>

        {/* Hex Input */}
        <div className="mb-4">
          <Input
            label="Hex Color"
            value={hexValue}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            icon={
              <div
                className="w-4 h-4 rounded-small border border-base-cool-gray"
                style={{ backgroundColor: hexValue }}
              />
            }
            iconPosition="right"
          />
        </div>

        {/* RGB Sliders */}
        <div className="space-y-3">
          {(['r', 'g', 'b'] as const).map((channel) => {
            const labels = { r: 'Red', g: 'Green', b: 'Blue' };
            const colors = { r: 'accent-red', g: 'success', b: 'accent-blue' };
            return (
              <div key={channel}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-small font-medium text-text-primary">
                    {labels[channel]}
                  </label>
                  <Badge variant="neutral" size="sm">
                    {rgbValue[channel]}
                  </Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbValue[channel]}
                  onChange={(e) => handleRgbChange(channel, parseInt(e.target.value))}
                  className={`w-full h-2 bg-base-light-gray rounded-lg appearance-none cursor-pointer accent-${colors[channel]}`}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent/Preset Colors */}
      <Card variant="standard" className="p-4">
        <p className="text-small font-medium text-text-primary mb-3">Recent Colors</p>
        <div className="grid grid-cols-5 gap-2">
          <AnimatePresence>
            {allRecentColors.map((presetColor, index) => (
              <MotionDiv
                key={`${presetColor}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <HoverScale scale={1.1}>
                  <button
                    onClick={() => handlePresetColorClick(presetColor)}
                    className={`
                      w-full aspect-square rounded-medium border-2 transition-smooth
                      ${
                        color === presetColor
                          ? 'border-accent-blue shadow-glow-primary scale-110'
                          : 'border-base-light-gray hover:border-accent-cyan'
                      }
                    `}
                    style={{ backgroundColor: presetColor }}
                    title={presetColor}
                  />
                </HoverScale>
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
