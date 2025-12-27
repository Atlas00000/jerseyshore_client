'use client';

import { useState, useEffect, useMemo } from 'react';
import { PrintLibraryEntry } from '@/types/prints';
import { printLibraryStorage } from '@/lib/printLibraryStorage';
import { logger } from '@/lib/logger';

interface PrintLibraryProps {
  onSelectPrint?: (entry: PrintLibraryEntry) => void;
}

export function PrintLibrary({ onSelectPrint }: PrintLibraryProps) {
  const [entries, setEntries] = useState<PrintLibraryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    setIsLoading(true);
    try {
      const allEntries = printLibraryStorage.getAll();
      setEntries(allEntries);
    } catch (error) {
      logger.error('Failed to load print library', {
        context: 'PrintLibrary',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get categories
  const categories = useMemo(() => {
    const cats = printLibraryStorage.getCategories();
    return ['all', ...cats];
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    let results = entries;

    // Apply search
    if (searchQuery.trim()) {
      results = printLibraryStorage.search(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter((entry) => entry.category === selectedCategory);
    }

    return results;
  }, [entries, searchQuery, selectedCategory]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this print from your library?')) {
      printLibraryStorage.delete(id);
      loadEntries();
      logger.info('Print deleted from library', {
        context: 'PrintLibrary',
        metadata: { id },
      });
    }
  };

  const handleSelect = (entry: PrintLibraryEntry) => {
    if (onSelectPrint) {
      onSelectPrint(entry);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Loading print library...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Print Library</h3>
        <span className="text-sm text-gray-500">
          {entries.length} saved print{entries.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search prints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
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
      )}

      {/* Print Grid */}
      {filteredEntries.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">
            {searchQuery || selectedCategory !== 'all'
              ? 'No prints found matching your search.'
              : 'No prints saved yet. Save prints from the Print Manager to build your library.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
              onClick={() => handleSelect(entry)}
            >
              {/* Thumbnail */}
              <div className="w-full aspect-square mb-2 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                {entry.thumbnailUrl ? (
                  <img
                    src={entry.thumbnailUrl}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : entry.printData.textContent ? (
                  <div
                    className="text-center p-2"
                    style={{
                      fontFamily: entry.printData.textStyle?.fontFamily || 'Arial',
                      fontSize: `${(entry.printData.textStyle?.fontSize || 24) * 0.5}px`,
                      fontWeight: entry.printData.textStyle?.fontWeight || 'normal',
                      color: entry.printData.textStyle?.color || '#000000',
                    }}
                  >
                    {entry.printData.textContent}
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">No preview</div>
                )}
              </div>

              {/* Info */}
              <div className="text-left">
                <h4 className="font-medium text-sm text-gray-900 truncate">{entry.name}</h4>
                {entry.category && (
                  <p className="text-xs text-gray-500 mt-1">{entry.category}</p>
                )}
                {entry.printData.textContent && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    "{entry.printData.textContent}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                  title="Delete from library"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

