import { Material, MaterialLibrary } from '@/types/materials';

export interface MaterialSearchFilters {
  category?: string;
  searchQuery?: string;
  premiumOnly?: boolean;
  maxPrice?: number;
}

/**
 * Search and filter materials
 * @param materials - Material library to search
 * @param filters - Search filters
 * @returns Filtered material library
 */
export function searchMaterials(
  materials: MaterialLibrary,
  filters: MaterialSearchFilters
): MaterialLibrary {
  let results = [...materials];

  // Category filter
  if (filters.category && filters.category !== 'all') {
    results = results.filter(
      (material) => material.properties.category === filters.category
    );
  }

  // Search query filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter((material) => {
      const name = material.properties.name.toLowerCase();
      const category = material.properties.category.toLowerCase();
      return name.includes(query) || category.includes(query);
    });
  }

  // Premium filter
  if (filters.premiumOnly) {
    results = results.filter((material) => material.properties.premium === true);
  }

  // Max price filter
  if (filters.maxPrice !== undefined) {
    results = results.filter(
      (material) => (material.properties.priceModifier || 0) <= filters.maxPrice!
    );
  }

  return results;
}

/**
 * Sort materials
 * @param materials - Material library to sort
 * @param sortBy - Sort field ('name', 'price', 'category')
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted material library
 */
export function sortMaterials(
  materials: MaterialLibrary,
  sortBy: 'name' | 'price' | 'category' = 'name',
  order: 'asc' | 'desc' = 'asc'
): MaterialLibrary {
  const sorted = [...materials].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.properties.name.localeCompare(b.properties.name);
        break;
      case 'price':
        const priceA = a.properties.priceModifier || 0;
        const priceB = b.properties.priceModifier || 0;
        comparison = priceA - priceB;
        break;
      case 'category':
        comparison = a.properties.category.localeCompare(b.properties.category);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Get unique categories from material library
 * @param materials - Material library
 * @returns Array of unique category names
 */
export function getCategories(materials: MaterialLibrary): string[] {
  const categories = new Set(materials.map((m) => m.properties.category));
  return Array.from(categories).sort();
}

