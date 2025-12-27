'use client';

import { useState, useEffect } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { Material, MaterialProperties } from '@/types/materials';
import materialsData from '@/data/materials.json';
import { MaterialLibrary } from '@/types/materials';

interface MaterialDetailViewProps {
  materialId: string | null;
  onClose?: () => void;
}

export function MaterialDetailView({ materialId, onClose }: MaterialDetailViewProps) {
  const { selectedComponent, materialMap, setMaterial, colorMap, setColor } = useConfiguratorStore();
  const [material, setMaterialState] = useState<Material | null>(null);
  const [localProperties, setLocalProperties] = useState<Partial<MaterialProperties>>({});

  // Load material data
  useEffect(() => {
    if (!materialId) {
      setMaterialState(null);
      return;
    }

    const materials = materialsData.materials as MaterialLibrary;
    const foundMaterial = materials.find((m) => m.id === materialId);
    
    if (foundMaterial) {
      setMaterialState(foundMaterial);
      setLocalProperties({
        roughness: foundMaterial.properties.roughness ?? 0.5,
        metallic: foundMaterial.properties.metallic ?? 0,
        baseColor: foundMaterial.properties.baseColor || colorMap[selectedComponent!] || '#ffffff',
      });
    }
  }, [materialId, selectedComponent, colorMap]);

  if (!material || !selectedComponent) {
    return null;
  }

  const { properties } = material;
  const hasNormalMap = !!properties.textures.normal;
  const hasMetallicMap = !!properties.textures.metallic;
  const hasAOMap = !!properties.textures.ao;

  const handleRoughnessChange = (value: number) => {
    const newProperties = { ...localProperties, roughness: value };
    setLocalProperties(newProperties);
    // Note: In a full implementation, you'd update the material with these properties
    // For now, we'll just update the visual preview
  };

  const handleMetallicChange = (value: number) => {
    const newProperties = { ...localProperties, metallic: value };
    setLocalProperties(newProperties);
  };

  const handleColorChange = (color: string) => {
    setLocalProperties({ ...localProperties, baseColor: color });
    if (selectedComponent) {
      setColor(selectedComponent, color);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      {onClose && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Material Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {!onClose && <h3 className="text-lg font-semibold mb-4">Material Details</h3>}

      {/* Material Info */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-1">{properties.name}</h4>
        <p className="text-sm text-gray-500 capitalize">{properties.category}</p>
        {properties.premium && (
          <span className="inline-block mt-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
            Premium
          </span>
        )}
      </div>

      {/* Texture Maps Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Available Texture Maps</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`p-2 rounded ${properties.textures.albedo ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
            Albedo: {properties.textures.albedo ? '✓' : '✗'}
          </div>
          <div className={`p-2 rounded ${hasNormalMap ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
            Normal: {hasNormalMap ? '✓' : '✗'}
          </div>
          <div className={`p-2 rounded ${properties.textures.roughness ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
            Roughness: {properties.textures.roughness ? '✓' : '✗'}
          </div>
          <div className={`p-2 rounded ${hasMetallicMap ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
            Metallic: {hasMetallicMap ? '✓' : '✗'}
          </div>
          {hasAOMap && (
            <div className="p-2 rounded bg-green-100 text-green-800">
              AO: ✓
            </div>
          )}
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="space-y-4">
        {/* Roughness Control */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Roughness
            </label>
            <span className="text-sm text-gray-600">
              {((localProperties.roughness ?? properties.roughness ?? 0.5) * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={localProperties.roughness ?? properties.roughness ?? 0.5}
            onChange={(e) => handleRoughnessChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Glossy</span>
            <span>Matte</span>
          </div>
        </div>

        {/* Metallic Control */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Metallic
            </label>
            <span className="text-sm text-gray-600">
              {((localProperties.metallic ?? properties.metallic ?? 0) * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={localProperties.metallic ?? properties.metallic ?? 0}
            onChange={(e) => handleMetallicChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Non-metallic</span>
            <span>Metallic</span>
          </div>
        </div>

        {/* Base Color Tint */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Base Color Tint
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={localProperties.baseColor || properties.baseColor || '#ffffff'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={localProperties.baseColor || properties.baseColor || '#ffffff'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Price Info */}
      {properties.priceModifier !== undefined && properties.priceModifier > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Price modifier: <span className="font-medium">+${properties.priceModifier}</span>
          </p>
        </div>
      )}
    </div>
  );
}



