import * as THREE from 'three';
import { hexToRgb } from './colorUtils';

/**
 * Apply a color tint to a material
 * @param material - Three.js material to tint
 * @param color - Hex color string (#RRGGBB)
 * @param intensity - Tint intensity (0-1, default: 0.5)
 */
export function applyColorTint(
  material: THREE.MeshStandardMaterial,
  color: string,
  intensity: number = 0.5
): void {
  const rgb = hexToRgb(color);
  const tintColor = new THREE.Color(rgb.r / 255, rgb.g / 255, rgb.b / 255);

  // If material has a map (texture), we need to blend the color
  if (material.map) {
    // Create a new material with the tinted color
    // The base color will be multiplied with the texture
    material.color.lerp(tintColor, intensity);
  } else {
    // No texture, just set the color directly
    material.color.copy(tintColor);
  }
}

/**
 * Apply color to a material, replacing or tinting based on material properties
 * @param material - Three.js material
 * @param color - Hex color string
 * @param mode - 'replace' to replace color, 'tint' to blend with existing
 */
export function applyColor(
  material: THREE.MeshStandardMaterial,
  color: string,
  mode: 'replace' | 'tint' = 'replace'
): void {
  const rgb = hexToRgb(color);
  const newColor = new THREE.Color(rgb.r / 255, rgb.g / 255, rgb.b / 255);

  if (mode === 'replace') {
    material.color.copy(newColor);
  } else {
    // Tint mode: blend with existing color
    material.color.lerp(newColor, 0.5);
  }
}

/**
 * Reset material color to original
 * @param material - Three.js material
 * @param originalColor - Original hex color string
 */
export function resetMaterialColor(
  material: THREE.MeshStandardMaterial,
  originalColor: string
): void {
  const rgb = hexToRgb(originalColor);
  material.color.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255);
}

