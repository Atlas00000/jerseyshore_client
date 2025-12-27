import { PrintLibraryEntry, PrintApplication } from '@/types/prints';
import { logger } from './logger';

const STORAGE_KEY = 'shirt-configurator-print-library';
const MAX_LIBRARY_SIZE = 100; // Maximum number of saved prints

/**
 * Print Library Storage
 * Handles saving and loading prints from localStorage
 */
class PrintLibraryStorage {
  /**
   * Get all saved prints from storage
   */
  getAll(): PrintLibraryEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const entries = JSON.parse(stored) as PrintLibraryEntry[];
      // Sort by updatedAt (most recent first)
      return entries.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      logger.error('Failed to load print library', {
        context: 'printLibraryStorage',
        error: error instanceof Error ? error : new Error(String(error)),
      });
      return [];
    }
  }

  /**
   * Get a specific print by ID
   */
  getById(id: string): PrintLibraryEntry | null {
    const entries = this.getAll();
    return entries.find((entry) => entry.id === id) || null;
  }

  /**
   * Save a print to the library
   */
  save(print: PrintApplication, metadata: { name: string; category?: string; tags?: string[] }): string {
    try {
      const entries = this.getAll();

      // Generate thumbnail if possible
      let thumbnailUrl: string | undefined;
      if (print.customImageUrl) {
        thumbnailUrl = print.customImageUrl; // Use the image URL as thumbnail
      } else if (print.textContent) {
        // For text prints, we could generate a canvas thumbnail, but for now just use null
        thumbnailUrl = undefined;
      }

      const entry: PrintLibraryEntry = {
        id: `lib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: metadata.name,
        category: metadata.category,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        printData: { ...print }, // Clone the print data
        thumbnailUrl,
        tags: metadata.tags || [],
      };

      // Add to beginning of array (most recent first)
      entries.unshift(entry);

      // Limit library size
      if (entries.length > MAX_LIBRARY_SIZE) {
        entries.splice(MAX_LIBRARY_SIZE);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

      logger.info('Print saved to library', {
        context: 'printLibraryStorage',
        metadata: { entryId: entry.id, name: metadata.name },
      });

      return entry.id;
    } catch (error) {
      logger.error('Failed to save print to library', {
        context: 'printLibraryStorage',
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  }

  /**
   * Update an existing library entry
   */
  update(id: string, updates: Partial<PrintLibraryEntry>): boolean {
    try {
      const entries = this.getAll();
      const index = entries.findIndex((entry) => entry.id === id);

      if (index === -1) {
        logger.warn('Print library entry not found for update', {
          context: 'printLibraryStorage',
          metadata: { id },
        });
        return false;
      }

      entries[index] = {
        ...entries[index],
        ...updates,
        updatedAt: Date.now(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

      logger.info('Print library entry updated', {
        context: 'printLibraryStorage',
        metadata: { id },
      });

      return true;
    } catch (error) {
      logger.error('Failed to update print library entry', {
        context: 'printLibraryStorage',
        error: error instanceof Error ? error : new Error(String(error)),
      });
      return false;
    }
  }

  /**
   * Delete a print from the library
   */
  delete(id: string): boolean {
    try {
      const entries = this.getAll();
      const filtered = entries.filter((entry) => entry.id !== id);

      if (filtered.length === entries.length) {
        logger.warn('Print library entry not found for deletion', {
          context: 'printLibraryStorage',
          metadata: { id },
        });
        return false;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      logger.info('Print library entry deleted', {
        context: 'printLibraryStorage',
        metadata: { id },
      });

      return true;
    } catch (error) {
      logger.error('Failed to delete print library entry', {
        context: 'printLibraryStorage',
        error: error instanceof Error ? error : new Error(String(error)),
      });
      return false;
    }
  }

  /**
   * Search prints by name, category, or tags
   */
  search(query: string): PrintLibraryEntry[] {
    const entries = this.getAll();
    const lowerQuery = query.toLowerCase();

    return entries.filter((entry) => {
      const nameMatch = entry.name.toLowerCase().includes(lowerQuery);
      const categoryMatch = entry.category?.toLowerCase().includes(lowerQuery);
      const tagMatch = entry.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
      const textMatch = entry.printData.textContent?.toLowerCase().includes(lowerQuery);

      return nameMatch || categoryMatch || tagMatch || textMatch;
    });
  }

  /**
   * Get prints by category
   */
  getByCategory(category: string): PrintLibraryEntry[] {
    const entries = this.getAll();
    return entries.filter((entry) => entry.category === category);
  }

  /**
   * Get all unique categories
   */
  getCategories(): string[] {
    const entries = this.getAll();
    const categories = new Set<string>();
    entries.forEach((entry) => {
      if (entry.category) {
        categories.add(entry.category);
      }
    });
    return Array.from(categories).sort();
  }

  /**
   * Clear all prints from library
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      logger.info('Print library cleared', {
        context: 'printLibraryStorage',
      });
    } catch (error) {
      logger.error('Failed to clear print library', {
        context: 'printLibraryStorage',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  /**
   * Get library statistics
   */
  getStats() {
    const entries = this.getAll();
    return {
      total: entries.length,
      categories: this.getCategories().length,
      byCategory: this.getCategories().reduce((acc, cat) => {
        acc[cat] = this.getByCategory(cat).length;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

// Singleton instance
export const printLibraryStorage = new PrintLibraryStorage();

