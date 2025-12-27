import { ComponentType } from './models';

/**
 * UV coordinate bounds for a print zone
 */
export interface UVBounds {
  minU: number; // 0-1
  maxU: number; // 0-1
  minV: number; // 0-1
  maxV: number; // 0-1
}

/**
 * Size constraints for prints in a zone
 */
export interface SizeConstraints {
  minWidth: number; // 0-1 (relative to UV space)
  maxWidth: number; // 0-1
  minHeight: number; // 0-1
  maxHeight: number; // 0-1
  aspectRatio?: {
    min: number;
    max: number;
  };
}

/**
 * Default position within a zone
 */
export interface DefaultPosition {
  u: number; // 0-1
  v: number; // 0-1
}

/**
 * Print placement zone definition
 */
export interface PrintZone {
  id: string;
  name: string;
  description: string;
  component: ComponentType; // Which component this zone belongs to
  uvBounds: UVBounds; // UV coordinate boundaries
  sizeConstraints: SizeConstraints; // Size limits for prints
  defaultPosition: DefaultPosition; // Default placement position
  rotationLimit?: number; // Max rotation in degrees (optional)
}

/**
 * Print zone library type
 */
export interface PrintZoneLibrary {
  zones: PrintZone[];
}

/**
 * Get zone by ID
 */
export function getZoneById(zones: PrintZone[], zoneId: string): PrintZone | undefined {
  return zones.find((zone) => zone.id === zoneId);
}

/**
 * Get zones for a specific component
 */
export function getZonesForComponent(zones: PrintZone[], component: ComponentType): PrintZone[] {
  return zones.filter((zone) => zone.component === component);
}

/**
 * Check if a position is within zone bounds
 */
export function isPositionInZone(position: { u: number; v: number }, zone: PrintZone): boolean {
  const { uvBounds } = zone;
  return (
    position.u >= uvBounds.minU &&
    position.u <= uvBounds.maxU &&
    position.v >= uvBounds.minV &&
    position.v <= uvBounds.maxV
  );
}

/**
 * Clamp position to zone bounds
 */
export function clampPositionToZone(
  position: { u: number; v: number },
  zone: PrintZone
): { u: number; v: number } {
  const { uvBounds } = zone;
  return {
    u: Math.max(uvBounds.minU, Math.min(uvBounds.maxU, position.u)),
    v: Math.max(uvBounds.minV, Math.min(uvBounds.maxV, position.v)),
  };
}

