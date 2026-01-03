'use client';

/**
 * PrintLibrary Component
 * Grid layout with cards, search and filter UI, category tags, and thumbnail previews with hover effects
 */

import { useState, useEffect, useMemo } from 'react';
import { PrintLibraryEntry } from '@/types/prints';
import { printLibraryStorage } from '@/lib/printLibraryStorage';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Loading';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';
import { HoverScale } from '@/lib/animations/framerMotion';

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

    if (searchQuery.trim()) {
      results = printLibraryStorage.search(searchQuery);
    }

    if (selectedCategory !== 'all') {
      results = results.filter((entry) => entry.category === selectedCategory);
    }

    return results;
  }, [entries, searchQuery, selectedCategory]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
      <Card variant="standard">
        <div className="p-8 text-center">
          <Spinner size="lg" />
          <p className="text-small text-text-secondary mt-4">Loading print library...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-h4 font-bold text-text-primary">Print Library</h3>
        <Badge variant="info" size="md">
          {entries.length}
        </Badge>
      </div>

      {/* Search */}
      <Input
        placeholder="Search prints..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        iconPosition="left"
      />

      {/* Category Filter */}
      {categories.length > 1 && (
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
      )}

      {/* Print Grid */}
      {filteredEntries.length === 0 ? (
        <Card variant="standard">
          <div className="p-8 text-center">
            <svg
              className="w-12 h-12 mx-auto text-text-tertiary mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-small text-text-secondary mb-1">
              {searchQuery || selectedCategory !== 'all'
                ? 'No prints found matching your search'
                : 'No prints saved yet'}
            </p>
            <p className="text-tiny text-text-tertiary">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Save prints from the Print Manager to build your library'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredEntries.map((entry, index) => (
              <MotionDiv
                key={entry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <HoverScale scale={1.05}>
                  <Card
                    variant="standard"
                    hover
                    className="cursor-pointer relative group"
                    onClick={() => handleSelect(entry)}
                  >
                    {/* Thumbnail */}
                    <div className="w-full aspect-square mb-3 rounded-medium bg-base-light-gray flex items-center justify-center overflow-hidden border-2 border-base-light-gray">
                      {entry.thumbnailUrl ? (
                        <img
                          src={entry.thumbnailUrl}
                          alt={entry.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : entry.printData.textContent ? (
                        <div
                          className="text-center p-2 w-full h-full flex items-center justify-center"
                          style={{
                            fontFamily: entry.printData.textStyle?.fontFamily || 'Arial',
                            fontSize: `${Math.min((entry.printData.textStyle?.fontSize || 24) * 0.4, 16)}px`,
                            fontWeight: entry.printData.textStyle?.fontWeight || 'normal',
                            color: entry.printData.textStyle?.color || '#000000',
                          }}
                        >
                          {entry.printData.textContent}
                        </div>
                      ) : (
                        <div className="text-text-tertiary text-tiny">No preview</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <h4 className="text-small font-medium text-text-primary truncate">
                        {entry.name}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {entry.category && (
                          <Badge variant="neutral" size="sm">
                            {entry.category}
                          </Badge>
                        )}
                        {entry.printData.textContent && (
                          <Badge variant="info" size="sm">
                            Text
                          </Badge>
                        )}
                      </div>
                      {entry.printData.textContent && (
                        <p className="text-tiny text-text-tertiary truncate">
                          "{entry.printData.textContent}"
                        </p>
                      )}
                    </div>

                    {/* Delete Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <HoverScale scale={1.1}>
                        <button
                          onClick={(e) => handleDelete(entry.id, e)}
                          className="p-1.5 bg-error text-white rounded-medium shadow-elevation-2 hover:bg-error/90 transition-smooth"
                          title="Delete from library"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </HoverScale>
                    </div>
                  </Card>
                </HoverScale>
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Results Count */}
      {filteredEntries.length > 0 && (
        <div className="flex items-center justify-between text-tiny text-text-tertiary">
          <span>
            Showing {filteredEntries.length} of {entries.length} prints
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
