'use client';

/**
 * PatternSelector Component
 * Grid layout with pattern preview cards, hover effects, and selected state
 */

import { useState, useEffect, useMemo } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { Pattern, PatternLibrary, PatternApplication } from '@/types/patterns';
import { PatternSwatch } from './PatternSwatch';
import patternsData from '@/data/patterns.json';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';
import { HoverScale } from '@/lib/animations/framerMotion';

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
      <Card variant="standard">
        <div className="p-4 text-center">
          <p className="text-small text-text-tertiary">
            Select a component to choose a pattern
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <HoverScale key={category} scale={1.05}>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 py-1.5 rounded-medium text-tiny font-medium transition-smooth
                  ${
                    isActive
                      ? 'bg-accent-blue text-white shadow-elevation-1'
                      : 'bg-base-light-gray text-text-secondary hover:bg-base-cool-gray hover:text-text-primary'
                  }
                `}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            </HoverScale>
          );
        })}
      </div>

      {/* Patterns Grid */}
      {filteredPatterns.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          {filteredPatterns.map((pattern, index) => {
            const isSelected = currentPattern?.patternId === pattern.id;
            return (
              <MotionDiv
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <PatternSwatch
                  pattern={pattern}
                  isSelected={isSelected}
                  onSelect={() => handlePatternSelect(pattern)}
                />
              </MotionDiv>
            );
          })}
        </div>
      ) : (
        <Card variant="standard">
          <div className="p-6 text-center">
            <svg
              className="w-12 h-12 mx-auto text-text-tertiary mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-small text-text-secondary">No patterns found</p>
            <p className="text-tiny text-text-tertiary mt-1">
              Try selecting a different category
            </p>
          </div>
        </Card>
      )}

      {/* Pattern Controls */}
      <AnimatePresence>
        {currentPattern && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="standard" className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-small font-semi-bold text-text-primary">
                  Pattern Controls
                </h4>
                {currentPattern && (
                  <Badge variant="primary" size="sm">
                    Active
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {/* Intensity Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-small font-medium text-text-primary">
                      Intensity
                    </label>
                    <Badge variant="neutral" size="sm">
                      {Math.round(intensity * 100)}%
                    </Badge>
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
                    className="w-full h-2 bg-base-light-gray rounded-lg appearance-none cursor-pointer accent-accent-blue"
                  />
                </div>

                {/* Scale Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-small font-medium text-text-primary">
                      Scale
                    </label>
                    <Badge variant="neutral" size="sm">
                      {scale.toFixed(2)}x
                    </Badge>
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
                    className="w-full h-2 bg-base-light-gray rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                  />
                </div>

                {/* Rotation Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-small font-medium text-text-primary">
                      Rotation
                    </label>
                    <Badge variant="neutral" size="sm">
                      {rotation}°
                    </Badge>
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
                    className="w-full h-2 bg-base-light-gray rounded-lg appearance-none cursor-pointer accent-accent-indigo"
                  />
                </div>

                {/* Remove Pattern Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePattern}
                  className="w-full text-error hover:bg-error-bg"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  }
                >
                  Remove Pattern
                </Button>
              </div>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Results Count */}
      {filteredPatterns.length > 0 && (
        <div className="flex items-center justify-between text-tiny text-text-tertiary">
          <span>
            Showing {filteredPatterns.length} of {patterns.length} patterns
          </span>
          {selectedCategory !== 'all' && (
            <Badge variant="info" size="sm">
              {selectedCategory}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
