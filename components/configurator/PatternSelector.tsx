'use client';

import { useState, useEffect, useMemo } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ComponentType } from '@/types/models';
import { Pattern, PatternLibrary, PatternApplication } from '@/types/patterns';
import { PatternSwatch } from './PatternSwatch';
import patternsData from '@/data/patterns.json';

export function PatternSelector() {
  const { selectedComponent, patternMap, setPattern } = useConfiguratorStore();
  const [patterns, setPatterns] = useState<PatternLibrary>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [intensity, setIntensity] = useState(0.7);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  // Load patterns on mount
  useEffect(() => {
    setPatterns(patternsData.patterns as PatternLibrary);
  }, []);

  // Get current pattern application for selected component
  const currentPattern = useMemo(() => {
    if (!selectedComponent) return null;
    return patternMap[selectedComponent] || null;
  }, [selectedComponent, patternMap]);

  // Update controls when pattern changes
  useEffect(() => {
    if (currentPattern) {
      setIntensity(currentPattern.intensity);
      setScale(currentPattern.scale);
      setRotation(currentPattern.rotation);
    } else {
      // Reset to defaults
      setIntensity(0.7);
      setScale(1.0);
      setRotation(0);
    }
  }, [currentPattern]);

  // Get categories for filtering
  const categories = useMemo(() => {
    return ['all', ...new Set(patterns.map((p) => p.properties.category))];
  }, [patterns]);

  // Filter patterns by category
  const filteredPatterns = useMemo(() => {
    return selectedCategory === 'all'
      ? patterns
      : patterns.filter((p) => p.properties.category === selectedCategory);
  }, [patterns, selectedCategory]);

  const handlePatternSelect = (pattern: Pattern) => {
    if (!selectedComponent) return;

    const application: PatternApplication = {
      patternId: pattern.id,
      intensity: intensity,
      scale: scale,
      rotation: rotation,
    };
    setPattern(selectedComponent, application);
  };

  const handleRemovePattern = () => {
    if (!selectedComponent) return;
    setPattern(selectedComponent, null);
  };

  const handleControlChange = (type: 'intensity' | 'scale' | 'rotation', value: number) => {
    if (!selectedComponent || !currentPattern) return;

    const updated: PatternApplication = {
      ...currentPattern,
      [type]: value,
    };
    setPattern(selectedComponent, updated);
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Select a component to choose a pattern.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Pattern Library</h3>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Patterns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
        {filteredPatterns.map((pattern) => {
          const isSelected = currentPattern?.patternId === pattern.id;
          return (
            <PatternSwatch
              key={pattern.id}
              pattern={pattern}
              isSelected={isSelected}
              onSelect={() => handlePatternSelect(pattern)}
            />
          );
        })}
      </div>

      {filteredPatterns.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No patterns found.</p>
      )}

      {/* Pattern Controls */}
      {currentPattern && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold mb-3">Pattern Controls</h4>

          {/* Intensity Slider */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Intensity</label>
              <span className="text-sm text-gray-600">{Math.round(intensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={intensity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setIntensity(val);
                handleControlChange('intensity', val);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Scale Slider */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Scale</label>
              <span className="text-sm text-gray-600">{scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setScale(val);
                handleControlChange('scale', val);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Rotation Slider */}
          <div className="mb-3">
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
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setRotation(val);
                handleControlChange('rotation', val);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Remove Pattern Button */}
          <button
            onClick={handleRemovePattern}
            className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Remove Pattern
          </button>
        </div>
      )}
    </div>
  );
}



