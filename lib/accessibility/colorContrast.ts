/**
 * Color Contrast Utilities
 * Validates and calculates color contrast ratios for accessibility
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance
 * Based on WCAG 2.1 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format');
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 * - Normal text: 4.5:1
 * - Large text (18pt+ or 14pt+ bold): 3:1
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standard
 * - Normal text: 7:1
 * - Large text (18pt+ or 14pt+ bold): 4.5:1
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Get WCAG compliance level
 */
export function getWCAGLevel(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): 'AAA' | 'AA' | 'Fail' {
  if (meetsWCAGAAA(foreground, background, isLargeText)) {
    return 'AAA';
  }
  if (meetsWCAGAA(foreground, background, isLargeText)) {
    return 'AA';
  }
  return 'Fail';
}

/**
 * Find accessible text color for a given background
 */
export function getAccessibleTextColor(
  background: string,
  options: { light: string; dark: string } = {
    light: '#FFFFFF',
    dark: '#000000',
  }
): string {
  const lightContrast = getContrastRatio(options.light, background);
  const darkContrast = getContrastRatio(options.dark, background);

  return lightContrast > darkContrast ? options.light : options.dark;
}

/**
 * Validate color combinations from design tokens
 */
export function validateDesignTokenContrast(): {
  pass: boolean;
  failures: Array<{ foreground: string; background: string; level: string }>;
} {
  const failures: Array<{ foreground: string; background: string; level: string }> = [];

  // Test common text/background combinations
  const combinations = [
    { foreground: '#0A1628', background: '#FFFFFF' }, // Primary text on white
    { foreground: '#64748B', background: '#FFFFFF' }, // Secondary text on white
    { foreground: '#FFFFFF', background: '#0A1628' }, // Inverse text on navy
    { foreground: '#3B82F6', background: '#FFFFFF' }, // Accent blue on white
  ];

  combinations.forEach(({ foreground, background }) => {
    const level = getWCAGLevel(foreground, background);
    if (level === 'Fail') {
      failures.push({ foreground, background, level });
    }
  });

  return {
    pass: failures.length === 0,
    failures,
  };
}

