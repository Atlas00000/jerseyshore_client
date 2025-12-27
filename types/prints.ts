/**
 * Print placement zone
 */
export type PrintZone = 'front' | 'back' | 'leftSleeve' | 'rightSleeve';

/**
 * Blend modes for print compositing
 */
export enum BlendMode {
  NORMAL = 'normal',
  MULTIPLY = 'multiply',
  SCREEN = 'screen',
  OVERLAY = 'overlay',
  SOFT_LIGHT = 'soft-light',
  HARD_LIGHT = 'hard-light',
  COLOR_DODGE = 'color-dodge',
  COLOR_BURN = 'color-burn',
  DARKEN = 'darken',
  LIGHTEN = 'lighten',
  DIFFERENCE = 'difference',
  EXCLUSION = 'exclusion',
}

/**
 * Print position (UV coordinates or world coordinates)
 */
export interface PrintPosition {
  x: number; // 0-1 for UV, or world coordinates
  y: number; // 0-1 for UV, or world coordinates
}

/**
 * Print properties
 */
export interface PrintProperties {
  imageUrl: string; // URL to the uploaded print image
  position: PrintPosition;
  scale: number; // 0.1 - 2.0
  rotation: number; // 0-360 degrees
  zone: PrintZone;
  opacity?: number; // 0-1, default 1
}

/**
 * Print library entry (pre-made designs)
 */
export interface Print {
  id: string;
  name: string;
  imageUrl: string;
  category?: string;
  thumbnailUrl?: string;
}

/**
 * Saved print library entry (user-created prints saved to library)
 */
export interface PrintLibraryEntry {
  id: string; // Unique ID for the library entry
  name: string; // User-given name
  category?: string; // Optional category for organization
  createdAt: number; // Timestamp when saved
  updatedAt: number; // Timestamp when last updated
  printData: PrintApplication; // The print application data
  thumbnailUrl?: string; // Thumbnail for preview (data URL or blob URL)
  tags?: string[]; // Optional tags for searching
}

/**
 * Print application for a component
 */
export interface PrintApplication {
  id: string; // Unique ID for this print application
  printId?: string; // For pre-made prints
  customImageUrl?: string; // For user uploads (object URL or data URL)
  textContent?: string; // For text prints
  textStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
  position: PrintPosition; // UV coordinates (0-1)
  scale: number; // 0.1 - 2.0
  rotation: number; // 0-360 degrees
  zone: PrintZone; // Legacy zone type (for backward compatibility)
  zoneId?: string; // Zone ID from zones.json
  opacity: number; // 0-1
  blendMode: BlendMode; // Blend mode for compositing
  component: string; // Component type this print is applied to
  width?: number; // Print width in pixels (for reference)
  height?: number; // Print height in pixels (for reference)
  zIndex?: number; // Layer order (higher = on top)
}



