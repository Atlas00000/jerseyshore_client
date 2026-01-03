/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors - Vibrant Dark Theme
      colors: {
        // Base Colors (Dark Foundation)
        base: {
          charcoal: '#0A0A0F',
          'dark-slate': '#1A1A2E',
          'charcoal-gray': '#16213E',
          'dark-border': '#2A2A3E',
          'light-charcoal': '#2A2A3A',
        },
        // Accent Colors (Vibrant Electric)
        accent: {
          cyan: '#00F5FF',
          'cyan-dark': '#00D9FF',
          magenta: '#FF00F5',
          'magenta-dark': '#FF0080',
          emerald: '#00FF88',
          'emerald-dark': '#00FFB3',
          'electric-blue': '#0066FF',
          'electric-blue-dark': '#0080FF',
        },
        // Text Colors (High Contrast)
        text: {
          primary: '#FFFFFF',
          secondary: '#B8B8C8',
          tertiary: '#6B6B7E',
          inverse: '#0A0A0F',
          accent: '#00F5FF',
        },
        // Semantic Colors (Dark Theme Variants)
        success: {
          DEFAULT: '#00FF88',
          bg: 'rgba(0, 255, 136, 0.15)',
          glow: 'rgba(0, 255, 136, 0.4)',
        },
        warning: {
          DEFAULT: '#FFB800',
          bg: 'rgba(255, 184, 0, 0.15)',
          glow: 'rgba(255, 184, 0, 0.4)',
        },
        error: {
          DEFAULT: '#FF0066',
          bg: 'rgba(255, 0, 102, 0.15)',
          glow: 'rgba(255, 0, 102, 0.4)',
        },
        info: {
          DEFAULT: '#00F5FF',
          bg: 'rgba(0, 245, 255, 0.15)',
          glow: 'rgba(0, 245, 255, 0.4)',
        },
      },
      // Typography
      fontFamily: {
        primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // 56px
        'display-2': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // 40px
        h1: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // 32px
        h2: ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // 24px
        h3: ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // 20px
        h4: ['1.125rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // 18px
        'body-large': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }], // 16px
        body: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }], // 14px
        small: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }], // 12px
        tiny: ['0.625rem', { lineHeight: '1.5', letterSpacing: '0' }], // 10px
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        'semi-bold': '600',
        bold: '700',
      },
      // Spacing (8px base unit)
      spacing: {
        0: '0px',
        1: '0.25rem', // 4px
        2: '0.5rem', // 8px
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        6: '1.5rem', // 24px
        8: '2rem', // 32px
        12: '3rem', // 48px
        16: '4rem', // 64px
        24: '6rem', // 96px
      },
      // Border Radius
      borderRadius: {
        small: '0.375rem', // 6px
        medium: '0.5rem', // 8px
        large: '0.75rem', // 12px
        xlarge: '1rem', // 16px
      },
      // Box Shadows (Dark Theme & Electric Glows)
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'elevation-2': '0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'elevation-3': '0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'elevation-4': '0 10px 20px 0 rgba(0, 0, 0, 0.6), 0 4px 8px -4px rgba(0, 0, 0, 0.5)',
        'elevation-5': '0 20px 40px 0 rgba(0, 0, 0, 0.7), 0 8px 16px -8px rgba(0, 0, 0, 0.6)',
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.2)',
        'glow-magenta': '0 0 20px rgba(255, 0, 245, 0.5), 0 0 40px rgba(255, 0, 245, 0.2)',
        'glow-emerald': '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.2)',
        'glow-primary': '0 0 30px rgba(0, 245, 255, 0.4), 0 0 60px rgba(255, 0, 245, 0.2)',
        'glow-accent': '0 0 25px rgba(0, 255, 136, 0.4), 0 0 50px rgba(0, 245, 255, 0.2)',
        'glow-success': '0 0 20px rgba(0, 255, 136, 0.5)',
        'glow-warning': '0 0 20px rgba(255, 184, 0, 0.5)',
        'glow-error': '0 0 20px rgba(255, 0, 102, 0.5)',
        'glow-info': '0 0 20px rgba(0, 245, 255, 0.5)',
      },
      // Z-Index
      zIndex: {
        base: '0',
        elevated: '10',
        sticky: '20',
        dropdown: '30',
        overlay: '40',
        toast: '50',
        maximum: '100',
      },
      // Animation
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        instant: '0ms',
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '750ms',
      },
      // Gradients (Vibrant & Dynamic)
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00F5FF 0%, #FF00F5 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00FF88 0%, #00F5FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)',
        'gradient-surface': 'linear-gradient(180deg, #16213E 0%, #1A1A2E 100%)',
        'gradient-glow': 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)',
        'gradient-glow-magenta': 'radial-gradient(circle, rgba(255,0,245,0.3) 0%, transparent 70%)',
        'gradient-glow-emerald': 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 70%)',
      },
      // Container
      maxWidth: {
        'content': '1280px',
        'full-width': '1920px',
      },
    },
  },
  plugins: [],
};

