'use client';

/**
 * MaterialLibrary Component
 * Grid layout with material preview cards, search with animations, and category filters
 */

import { useState, useEffect, useMemo } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { Material, MaterialLibrary as MaterialLibraryType } from '@/types/materials';
import { MaterialSwatch } from './MaterialSwatch';
import { MaterialDetailView } from './MaterialDetailView';
import { searchMaterials, getCategories, sortMaterials } from '@/lib/materialSearch';
import materialsData from '@/data/materials.json';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';
import { HoverScale } from '@/lib/animations/framerMotion';

export function MaterialLibrary() {
  const { selectedComponent, materialMap, setMaterial } = useConfiguratorStore();
  const [materials, setMaterials] = useState<MaterialLibraryType>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  // Load materials on mount
  useEffect(() => {
    setMaterials(materialsData.materials as MaterialLibraryType);
  }, []);

  // Get categories for filtering
  const categories = useMemo(() => {
    return ['all', ...getCategories(materials)];
  }, [materials]);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let results = searchMaterials(materials, {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      searchQuery: searchQuery || undefined,
    });
    return sortMaterials(results, sortBy, 'asc');
  }, [materials, selectedCategory, searchQuery, sortBy]);

  if (!selectedComponent) {
    return (
      <Card variant="standard">
        <div className="p-4 text-center">
          <p className="text-small text-text-tertiary">
            Select a component to choose a material
          </p>
        </div>
      </Card>
    );
  }

  const currentMaterialId = materialMap[selectedComponent] || null;

  const handleMaterialSelect = (materialId: string) => {
    setMaterial(selectedComponent, materialId);
    setSelectedMaterialId(materialId);
  };

  const handleMaterialDoubleClick = (materialId: string) => {
    setSelectedMaterialId(materialId);
  };

  const sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'price', label: 'Sort by Price' },
    { value: 'category', label: 'Sort by Category' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Input
        placeholder="Search materials..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        iconPosition="left"
      />

      {/* Sort and Category Controls */}
      <div className="flex flex-col gap-3">
        {/* Sort Dropdown */}
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'category')}
          placeholder="Sort by..."
        />

        {/* Category Filters - Compact Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <HoverScale key={category} scale={1.05}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-2.5 py-1 rounded-medium text-tiny font-medium transition-smooth
                    ${
                      isActive
                        ? 'bg-accent-cyan text-base-charcoal shadow-glow-cyan'
                        : 'bg-base-charcoal-gray text-text-secondary hover:bg-base-slate hover:text-text-primary hover:border-accent-cyan/30 border border-transparent'
                    }
                  `}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              </HoverScale>
            );
          })}
        </div>
      </div>

      {/* Material Detail View */}
      <AnimatePresence>
        {selectedMaterialId && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MaterialDetailView
              materialId={selectedMaterialId}
              onClose={() => setSelectedMaterialId(null)}
            />
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Materials Grid - Compact Circular Layout */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 max-h-96 overflow-y-auto custom-scrollbar p-2">
          {filteredMaterials.map((material, index) => (
            <MotionDiv
              key={material.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              className="flex justify-center"
            >
              <MaterialSwatch
                material={material}
                isSelected={currentMaterialId === material.id}
                onSelect={() => handleMaterialSelect(material.id)}
                onDoubleClick={() => handleMaterialDoubleClick(material.id)}
              />
            </MotionDiv>
          ))}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-small text-text-secondary">No materials found</p>
            <p className="text-tiny text-text-tertiary mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        </Card>
      )}

      {/* Results Count */}
      {filteredMaterials.length > 0 && (
        <div className="flex items-center justify-between text-tiny text-text-tertiary">
          <span>
            Showing {filteredMaterials.length} of {materials.length} materials
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
