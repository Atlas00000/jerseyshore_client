'use client';

import { Pattern } from '@/types/patterns';

interface PatternSwatchProps {
  pattern: Pattern;
  isSelected: boolean;
  onSelect: () => void;
}

export function PatternSwatch({ pattern, isSelected, onSelect }: PatternSwatchProps) {
  const { properties } = pattern;
  const priceDisplay = properties.priceModifier
    ? properties.priceModifier > 0
      ? `+$${properties.priceModifier}`
      : 'Included'
    : 'Included';

  return (
    <button
      onClick={onSelect}
      className={`p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="w-full aspect-square mb-2 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
        {pattern.thumbnailUrl ? (
          <img
            src={pattern.thumbnailUrl}
            alt={properties.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-500 capitalize">{properties.category}</span>
          </div>
        )}
      </div>
      <div className="text-left">
        <h4 className="font-medium text-sm text-gray-900">{properties.name}</h4>
        <p className="text-xs text-gray-500 capitalize">{properties.category}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-medium text-gray-700">{priceDisplay}</span>
        </div>
      </div>
    </button>
  );
}



