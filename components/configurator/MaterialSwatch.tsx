'use client';

import { useState } from 'react';
import { Material } from '@/types/materials';
import { motion, AnimatePresence } from 'framer-motion';

interface MaterialSwatchProps {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick?: () => void;
}

export function MaterialSwatch({ material, isSelected, onSelect, onDoubleClick }: MaterialSwatchProps) {
  const { properties } = material;
  const [showTooltip, setShowTooltip] = useState(false);

  // Get material color for thumbnail
  const materialColor = properties.baseColor || '#ffffff';
  
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

  // Price display
  const priceDisplay = properties.priceModifier
    ? properties.priceModifier > 0
      ? `+$${properties.priceModifier}`
      : 'Included'
    : 'Included';

  return (
    <div className="relative group">
      {/* Circular Material Thumbnail */}
      <button
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          relative w-12 h-12 rounded-full
          border-2 transition-all duration-200
          flex items-center justify-center
          overflow-hidden
          ${isSelected 
            ? 'border-accent-cyan shadow-glow-cyan scale-110 ring-2 ring-accent-cyan/50' 
            : 'border-base-dark-border hover:border-accent-cyan/50 hover:scale-105'
          }
        `}
        style={{
          backgroundColor: materialColor,
        }}
        title={properties.name}
      >
        {/* Thumbnail Image or Color */}
        {material.thumbnailUrl ? (
          <img
            src={material.thumbnailUrl}
            alt={properties.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: materialColor }}
          />
        )}

        {/* Selected Indicator Ring */}
        {isSelected && (
          <div className="absolute inset-0 rounded-full border-2 border-accent-cyan animate-pulse" />
        )}

        {/* Premium Badge (small dot) */}
        {properties.premium && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-accent-amber rounded-full border-2 border-base-charcoal" />
        )}

        {/* PBR Indicator (small dot) */}
        {hasAdvancedMaps && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-emerald rounded-full border-2 border-base-charcoal" />
        )}
      </button>

      {/* Tooltip on Hover */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 pointer-events-none"
          >
            <div className="glass-accent border border-accent-cyan/30 rounded-medium shadow-glow-cyan p-3 min-w-[180px] max-w-[220px]">
              {/* Material Name */}
              <div className="font-semibold text-small text-text-primary mb-1">
                {properties.name}
              </div>

              {/* Category */}
              <div className="text-tiny text-text-secondary capitalize mb-2">
                {properties.category}
              </div>

              {/* Properties */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {isGlossy && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-accent-cyan/20 text-accent-cyan rounded-small">
                    Glossy
                  </span>
                )}
                {isMatte && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-base-dark-border text-text-secondary rounded-small">
                    Matte
                  </span>
                )}
                {isMetallic && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-accent-amber/20 text-accent-amber rounded-small">
                    Metallic
                  </span>
                )}
                {hasAdvancedMaps && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-accent-emerald/20 text-accent-emerald rounded-small">
                    PBR
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-1 border-t border-base-dark-border">
                <span className="text-tiny text-text-tertiary">Price:</span>
                <span className="text-tiny font-medium text-accent-cyan">
                  {priceDisplay}
                </span>
              </div>

              {/* Texture Maps Info */}
              {(hasNormalMap || hasMetallicMap || hasAOMap) && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-base-dark-border">
                  <span className="text-[10px] text-text-tertiary">Maps:</span>
                  <div className="flex gap-1">
                    {hasNormalMap && (
                      <span className="text-[10px] px-1 py-0.5 bg-base-charcoal-gray text-text-secondary rounded" title="Normal Map">
                        N
                      </span>
                    )}
                    {hasMetallicMap && (
                      <span className="text-[10px] px-1 py-0.5 bg-base-charcoal-gray text-text-secondary rounded" title="Metallic Map">
                        M
                      </span>
                    )}
                    {hasAOMap && (
                      <span className="text-[10px] px-1 py-0.5 bg-base-charcoal-gray text-text-secondary rounded" title="AO Map">
                        AO
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tooltip Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent-cyan/30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
