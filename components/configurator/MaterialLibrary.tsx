'use client';

import { useState, useEffect, useMemo } from 'react';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ComponentType } from '@/types/models';
import { Material, MaterialLibrary } from '@/types/materials';
import { MaterialSwatch } from './MaterialSwatch';
import { MaterialDetailView } from './MaterialDetailView';
import { searchMaterials, getCategories, sortMaterials } from '@/lib/materialSearch';
import materialsData from '@/data/materials.json';

export function MaterialLibrary() {
  const { selectedComponent, materialMap, setMaterial } = useConfiguratorStore();
  const [materials, setMaterials] = useState<MaterialLibrary>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  // Load materials on mount
  useEffect(() => {
    setMaterials(materialsData.materials as MaterialLibrary);
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
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Select a component to choose a material.</p>
      </div>
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Material Library</h3>
        {selectedMaterialId && (
          <button
            onClick={() => setSelectedMaterialId(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close Details
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sort and Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'category')}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="category">Sort by Category</option>
        </select>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 flex-1">
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
      </div>

      {/* Material Detail View */}
      {selectedMaterialId && (
        <div className="mb-4">
          <MaterialDetailView
            materialId={selectedMaterialId}
            onClose={() => setSelectedMaterialId(null)}
          />
        </div>
      )}

      {/* Materials Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredMaterials.map((material) => (
          <MaterialSwatch
            key={material.id}
            material={material}
            isSelected={currentMaterialId === material.id}
            onSelect={() => handleMaterialSelect(material.id)}
            onDoubleClick={() => handleMaterialDoubleClick(material.id)}
          />
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No materials found.</p>
      )}
    </div>
  );
}

