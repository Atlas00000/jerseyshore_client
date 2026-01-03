/**
 * Design Tokens
 * Central source of truth for all design system values
 * Based on UI Philosophy document
 */

// ============================================================================
// Colors
// ============================================================================

export const colors = {
  // Base Colors - Dark Foundation
  base: {
    charcoal: '#0A0A0F', // Deep charcoal - Primary background (almost black with blue undertone)
    darkSlate: '#1A1A2E', // Dark slate - Elevated surfaces, panels
    charcoalGray: '#16213E', // Charcoal gray - Cards, secondary surfaces
    darkBorder: '#2A2A3E', // Dark border - Subtle borders, dividers
    lightCharcoal: '#2A2A3A', // Light charcoal - Hover states, subtle backgrounds
  },

  // Accent Colors - Vibrant Electric
  accent: {
    cyan: '#00F5FF', // Electric cyan - Primary actions, highlights
    cyanDark: '#00D9FF', // Darker cyan - Hover states, secondary actions
    magenta: '#FF00F5', // Vibrant magenta - Secondary accents, interactive
    magentaDark: '#FF0080', // Darker magenta - Pressed states
    emerald: '#00FF88', // Emerald green - Success, positive states
    emeraldDark: '#00FFB3', // Darker emerald - Hover states
    electricBlue: '#0066FF', // Electric blue - Info, links
    electricBlueDark: '#0080FF', // Darker electric blue - Hover states
  },

  // Text Colors - High Contrast
  text: {
    primary: '#FFFFFF', // Pure white - Primary text on dark
    secondary: '#B8B8C8', // Muted white - Secondary text
    tertiary: '#6B6B7E', // Subtle gray - Tertiary text, labels
    inverse: '#0A0A0F', // Dark text for light backgrounds
    accent: '#00F5FF', // Cyan text for accents
  },

  // Semantic Colors - Dark Theme Variants
  semantic: {
    success: {
      color: '#00FF88',
      bg: 'rgba(0, 255, 136, 0.15)',
      glow: 'rgba(0, 255, 136, 0.4)',
    },
    warning: {
      color: '#FFB800',
      bg: 'rgba(255, 184, 0, 0.15)',
      glow: 'rgba(255, 184, 0, 0.4)',
    },
    error: {
      color: '#FF0066',
      bg: 'rgba(255, 0, 102, 0.15)',
      glow: 'rgba(255, 0, 102, 0.4)',
    },
    info: {
      color: '#00F5FF',
      bg: 'rgba(0, 245, 255, 0.15)',
      glow: 'rgba(0, 245, 255, 0.4)',
    },
  },

  // Gradients - Vibrant & Dynamic
  gradients: {
    primary: 'linear-gradient(135deg, #00F5FF 0%, #FF00F5 100%)', // Cyan to magenta
    accent: 'linear-gradient(135deg, #00FF88 0%, #00F5FF 100%)', // Emerald to cyan
    dark: 'linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)', // Dark base gradient
    surface: 'linear-gradient(180deg, #16213E 0%, #1A1A2E 100%)', // Surface gradient
    glow: 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)', // Glow effect
    glowMagenta: 'radial-gradient(circle, rgba(255,0,245,0.3) 0%, transparent 70%)', // Magenta glow
    glowEmerald: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 70%)', // Emerald glow
  },
} as const;

// ============================================================================
// Typography
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },

  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },

  // Font Sizes (Type Scale)
  fontSize: {
    display1: '3.5rem', // 56px - Hero titles, major sections
    display2: '2.5rem', // 40px - Section headers
    h1: '2rem', // 32px - Page titles
    h2: '1.5rem', // 24px - Section titles
    h3: '1.25rem', // 20px - Subsection titles
    h4: '1.125rem', // 18px - Card titles
    bodyLarge: '1rem', // 16px - Primary body text
    body: '0.875rem', // 14px - Secondary text
    small: '0.75rem', // 12px - Captions, labels
    tiny: '0.625rem', // 10px - Micro text, badges
  },

  // Line Heights
  lineHeight: {
    tight: 1.2, // For headings
    normal: 1.5, // For body text
  },

  // Letter Spacing
  letterSpacing: {
    heading: '-0.02em', // For headings
    body: '0', // For body text
  },
} as const;

// ============================================================================
// Spacing
// ============================================================================

export const spacing = {
  0: '0px', // No spacing
  1: '0.25rem', // 4px - Tight spacing
  2: '0.5rem', // 8px - Base unit
  3: '0.75rem', // 12px - Small spacing
  4: '1rem', // 16px - Standard spacing
  6: '1.5rem', // 24px - Medium spacing
  8: '2rem', // 32px - Large spacing
  12: '3rem', // 48px - Extra large spacing
  16: '4rem', // 64px - Section spacing
  24: '6rem', // 96px - Major section spacing
} as const;

// ============================================================================
// Layout
// ============================================================================

export const layout = {
  container: {
    maxWidth: {
      content: '1280px',
      fullWidth: '1920px',
    },
    gutter: '24px', // Grid gutters
  },
  grid: {
    columns: 12,
    gutter: '24px',
  },
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export const borderRadius = {
  small: '0.375rem', // 6px - Buttons, inputs
  medium: '0.5rem', // 8px - Cards, panels
  large: '0.75rem', // 12px - Modals, containers
  xlarge: '1rem', // 16px - Hero sections
} as const;

// ============================================================================
// Shadows & Elevation
// ============================================================================

export const shadows = {
  // Elevation Levels - Dark Theme Shadows
  elevation: {
    0: 'none', // Flat
    1: '0 1px 2px 0 rgba(0, 0, 0, 0.3)', // Subtle
    2: '0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)', // Raised
    3: '0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)', // Floating
    4: '0 10px 20px 0 rgba(0, 0, 0, 0.6), 0 4px 8px -4px rgba(0, 0, 0, 0.5)', // Elevated
    5: '0 20px 40px 0 rgba(0, 0, 0, 0.7), 0 8px 16px -8px rgba(0, 0, 0, 0.6)', // Modal
  },

  // Glow Effects - Electric & Vibrant
  glow: {
    cyan: '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.2)',
    magenta: '0 0 20px rgba(255, 0, 245, 0.5), 0 0 40px rgba(255, 0, 245, 0.2)',
    emerald: '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.2)',
    primary: '0 0 30px rgba(0, 245, 255, 0.4), 0 0 60px rgba(255, 0, 245, 0.2)', // Multi-color
    accent: '0 0 25px rgba(0, 255, 136, 0.4), 0 0 50px rgba(0, 245, 255, 0.2)', // Emerald + Cyan
    success: '0 0 20px rgba(0, 255, 136, 0.5)',
    warning: '0 0 20px rgba(255, 184, 0, 0.5)',
    error: '0 0 20px rgba(255, 0, 102, 0.5)',
    info: '0 0 20px rgba(0, 245, 255, 0.5)',
  },
} as const;

// ============================================================================
// Z-Index Scale
// ============================================================================

export const zIndex = {
  base: 0,
  elevated: 10,
  sticky: 20,
  dropdown: 30,
  overlay: 40,
  toast: 50,
  maximum: 100,
} as const;

// ============================================================================
// Animation
// ============================================================================

export const animation = {
  // Timing Functions
  timing: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)', // Default for most animations
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth transitions
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful, bouncy
    linear: 'linear', // Progress bars, loading
  },

  // Durations
  duration: {
    instant: '0ms', // Immediate feedback
    fast: '150ms', // Hover states, micro-interactions
    normal: '300ms', // Standard transitions
    slow: '500ms', // Complex animations
    slower: '750ms', // Page transitions, major changes
  },
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type ColorToken = typeof colors;
export type TypographyToken = typeof typography;
export type SpacingToken = typeof spacing;
export type LayoutToken = typeof layout;
export type BorderRadiusToken = typeof borderRadius;
export type ShadowToken = typeof shadows;
export type ZIndexToken = typeof zIndex;
export type AnimationToken = typeof animation;

// ============================================================================
// All Tokens
// ============================================================================

export const tokens = {
  colors,
  typography,
  spacing,
  layout,
  borderRadius,
  shadows,
  zIndex,
  animation,
} as const;

export type DesignTokens = typeof tokens;

