'use client';

import { Material } from '@/types/materials';

interface MaterialSwatchProps {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick?: () => void;
}

export function MaterialSwatch({ material, isSelected, onSelect, onDoubleClick }: MaterialSwatchProps) {
  const { properties } = material;
  const priceDisplay = properties.priceModifier
    ? properties.priceModifier > 0
      ? `+$${properties.priceModifier}`
      : 'Included'
    : 'Included';

  // Check for advanced texture maps
  const hasNormalMap = !!properties.textures.normal;
  const hasMetallicMap = !!properties.textures.metallic;
  const hasAOMap = !!properties.textures.ao;
  const hasAdvancedMaps = hasNormalMap || hasMetallicMap || hasAOMap;

  // Roughness indicator (0 = glossy, 1 = matte)
  const roughness = properties.roughness ?? 0.5;
  const isGlossy = roughness < 0.3;
  const isMatte = roughness > 0.7;

  // Metallic indicator
  const metallic = properties.metallic ?? 0;
  const isMetallic = metallic > 0.1;

  return (
    <button
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      className={`p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
      title="Click to select, double-click for details"
    >
      <div className="w-full aspect-square mb-2 rounded bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {properties.thumbnailUrl ? (
          <img
            src={properties.thumbnailUrl}
            alt={properties.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: properties.baseColor || '#ffffff' }}
          />
        )}
        
        {/* Advanced maps indicator badge */}
        {hasAdvancedMaps && (
          <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
            PBR
          </div>
        )}
        
        {/* Surface type indicators */}
        <div className="absolute bottom-1 left-1 flex gap-1">
          {isGlossy && (
            <span className="bg-blue-500/80 text-white text-[10px] px-1.5 py-0.5 rounded" title="Glossy">
              ✨
            </span>
          )}
          {isMatte && (
            <span className="bg-gray-600/80 text-white text-[10px] px-1.5 py-0.5 rounded" title="Matte">
              🎨
            </span>
          )}
          {isMetallic && (
            <span className="bg-yellow-600/80 text-white text-[10px] px-1.5 py-0.5 rounded" title="Metallic">
              ⚡
            </span>
          )}
        </div>
      </div>
      
      <div className="text-left">
        <h4 className="font-medium text-sm text-gray-900">{properties.name}</h4>
        <p className="text-xs text-gray-500 capitalize">{properties.category}</p>
        
        {/* Material properties indicators */}
        <div className="flex items-center gap-1 mt-1 mb-1">
          {hasNormalMap && (
            <span className="text-[10px] text-gray-400" title="Normal Map">N</span>
          )}
          {hasMetallicMap && (
            <span className="text-[10px] text-gray-400" title="Metallic Map">M</span>
          )}
          {hasAOMap && (
            <span className="text-[10px] text-gray-400" title="AO Map">AO</span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-medium text-gray-700">{priceDisplay}</span>
          {properties.premium && (
            <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">
              Premium
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

