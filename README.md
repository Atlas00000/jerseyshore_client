# 🎨 Client Application

<div align="center">

**Next.js-powered 3D Shirt Configurator Frontend**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

[Architecture](#-architecture) • [Components](#-components) • [Setup](#-setup) • [Testing](#-testing) • [Performance](#-performance)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Component Structure](#-component-structure)
- [Design System](#-design-system)
- [State Management](#-state-management)
- [3D Rendering](#-3d-rendering)
- [Performance Optimizations](#-performance-optimizations)
- [Setup & Development](#-setup--development)
- [Testing](#-testing)
- [Build & Deployment](#-build--deployment)

---

## 🎯 Overview

The client application is a sophisticated Next.js-based frontend that provides a real-time 3D shirt customization experience. Built with React, Three.js, and a modern design system, it delivers stunning visuals and smooth interactions.

### Key Capabilities

- **Real-time 3D Visualization** - Interactive Three.js rendering with React Three Fiber
- **Material & Color Customization** - Extensive material library with PBR support
- **Print Management** - Image and text printing with advanced placement tools
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Performance Optimized** - Code splitting, lazy loading, and efficient rendering

---

## 🏗️ Architecture

### Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 14.2 (App Router)             │
├─────────────────────────────────────────────────────────┤
│  React 18.2  │  TypeScript 5.3  │  Tailwind CSS 3.4    │
├─────────────────────────────────────────────────────────┤
│  Three.js 0.160  │  React Three Fiber 8.15  │  Drei 9.92│
├─────────────────────────────────────────────────────────┤
│  Zustand 4.5  │  Framer Motion 12.23  │  React Colorful │
└─────────────────────────────────────────────────────────┘
```

### Application Structure

```
client/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── loading.tsx        # Loading screen
│   └── not-found.tsx      # 404 page
│
├── components/            # React components
│   ├── configurator/     # Configurator controls
│   ├── viewer/           # 3D viewer components
│   ├── prints/           # Print management
│   ├── layout/           # Layout components
│   ├── ui/               # UI primitives
│   ├── loading/          # Loading components
│   └── error/            # Error handling
│
├── lib/                  # Utilities & helpers
│   ├── design/           # Design tokens
│   ├── animations/      # Animation utilities
│   ├── export/           # Export functionality
│   └── logging/          # Logging utilities
│
├── stores/               # Zustand state stores
│   ├── configuratorStore.ts
│   ├── exportStore.ts
│   └── toastStore.ts
│
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── data/                 # Static data files
```

---

## 🧩 Component Structure

### Component Categories

#### 1. **Configurator Components** (`components/configurator/`)

Core customization controls:

- **`ModeSelector`** - Switch between blank/branded modes
- **`ComponentSelector`** - Select shirt components
- **`MaterialLibrary`** - Browse and select materials
- **`ColorPicker`** - Advanced color selection
- **`DesignActions`** - Export, save, reset actions
- **`PatternSelector`** - Apply patterns to materials

#### 2. **3D Viewer Components** (`components/viewer/`)

Three.js rendering components:

- **`Scene`** - Main 3D scene container
- **`ModelLoader`** - GLB/GLTF model loading
- **`CameraControls`** - Interactive camera controls
- **`CameraPresets`** - Predefined camera positions
- **`LightingPresets`** - Lighting configurations
- **`PrintZoneGuides`** - Visual zone indicators
- **`LoadingSpinner`** - 3D loading states

#### 3. **Print Components** (`components/prints/`)

Print management tools:

- **`PrintPlacement`** - Drag-and-drop print placement
- **`PrintManager`** - Print list and management
- **`PrintLibrary`** - Print asset library
- **`TextTool`** - Text printing with styling
- **`FileUploader`** - Image upload handling

#### 4. **Layout Components** (`components/layout/`)

Application structure:

- **`AppLayout`** - Main application wrapper
- **`PanelLayout`** - Viewport with control panels
- **`ControlPanel`** - Reusable panel container
- **`LeftPanel`** - Left control panel
- **`RightPanel`** - Right control panel
- **`BottomPanel`** - Bottom control panel
- **`Header`** - Top navigation bar

#### 5. **UI Primitives** (`components/ui/`)

Reusable UI components:

- **`Button`** - Primary, secondary, ghost variants
- **`Card`** - Standard, elevated, glass variants
- **`Input`** - Text input with validation
- **`Select`** - Dropdown selection
- **`Tooltip`** - Hover tooltips
- **`Toast`** - Notification system
- **`Loading`** - Loading states

### Lazy Loading

Heavy components are lazy-loaded for optimal performance:

```typescript
// Example: Lazy-loaded Scene component
import { LazyScene } from '@/components/viewer/Scene.lazy';

// Automatically code-split and loaded on demand
<LazyScene />
```

**Lazy-loaded components:**
- `Scene` - 3D viewer (Three.js)
- `MaterialLibrary` - Material selection
- `PrintPlacement` - Print placement tool
- `PrintManager` - Print management
- `ColorPicker` - Color selection
- `TextTool` - Text editing

---

## 🎨 Design System

### Design Tokens

Centralized design values in `lib/design/tokens.ts`:

**Colors:**
- **Base**: Charcoal, slate, dark borders
- **Accent**: Electric cyan, magenta, emerald
- **Text**: High-contrast white, muted grays
- **Semantic**: Success, warning, error, info

**Typography:**
- **Font Family**: Inter (Google Fonts)
- **Scale**: Display, heading, body, small, tiny
- **Weights**: Regular (400), Medium (500), Semi-bold (600), Bold (700)

**Spacing:**
- **Base Unit**: 4px
- **Scale**: 2, 4, 6, 8, 12, 16, 24, 32, 48, 64

**Shadows:**
- **Elevation**: 1-5 levels
- **Glow**: Cyan, magenta, emerald variants

### CSS Variables

Design tokens are exposed as CSS custom properties in `lib/design/css-variables.css`:

```css
:root {
  --color-accent-cyan: #00F5FF;
  --color-accent-magenta: #FF00F5;
  --color-accent-emerald: #00FF88;
  /* ... */
}
```

### Tailwind Integration

Custom theme extension in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      accent: {
        cyan: 'var(--color-accent-cyan)',
        magenta: 'var(--color-accent-magenta)',
        // ...
      }
    }
  }
}
```

---

## 🔄 State Management

### Zustand Stores

Lightweight, performant state management:

#### **configuratorStore**

Main application state:

```typescript
interface ConfiguratorState {
  // Mode & Selection
  currentMode: 'blank' | 'branded';
  selectedComponent: ComponentType | null;
  
  // Customization
  materialMap: Record<ComponentType, string | null>;
  colorMap: Record<ComponentType, string | null>;
  patternMap: Record<ComponentType, PatternApplication | null>;
  printMap: Record<ComponentType, PrintApplication[]>;
  
  // History
  history: DesignState[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
}
```

#### **exportStore**

Export functionality state:

```typescript
interface ExportState {
  isExporting: boolean;
  exportFormat: 'png' | 'jpg' | 'glb';
  exportQuality: number;
  // ...
}
```

#### **toastStore**

Notification system:

```typescript
interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}
```

### State Persistence

Design state is persisted to localStorage for:
- Undo/Redo history
- Recent colors
- User preferences

---

## 🎬 3D Rendering

### React Three Fiber

Declarative Three.js with React:

```typescript
<Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
  <Suspense fallback={<LoadingSpinner />}>
    <LightingPresets preset={lightingPreset} />
    <CameraPresets preset={cameraPreset} />
    <CameraControls />
    <ModelLoader modelPath={modelPath} />
  </Suspense>
</Canvas>
```

### Key Features

- **Material Swapping** - Real-time material application
- **Component Isolation** - Highlight and isolate components
- **Print Zone Visualization** - Visual guides for print placement
- **Camera Presets** - Quick camera position switching
- **Lighting Presets** - Studio, outdoor, indoor lighting

### Performance Optimizations

- **Frustum Culling** - Only render visible objects
- **LOD Support** - Level of detail for models
- **Texture Compression** - Optimized texture formats
- **Render Batching** - Efficient draw call management

---

## ⚡ Performance Optimizations

### Code Splitting

- **Route-based splitting** - Automatic with Next.js
- **Component lazy loading** - Heavy components loaded on demand
- **Dynamic imports** - Conditional component loading

### Image Optimization

- **Next.js Image** - Automatic optimization
- **WebP/AVIF** - Modern format support
- **Lazy loading** - Images loaded as needed
- **Responsive images** - srcset generation

### 3D Optimization

- **Model compression** - GLB optimization
- **Texture atlasing** - Reduced draw calls
- **Instancing** - Repeated geometry optimization
- **GPU acceleration** - Hardware-accelerated rendering

### Bundle Optimization

- **Tree shaking** - Unused code elimination
- **Minification** - Production builds
- **Compression** - Gzip/Brotli support
- **CDN caching** - Static asset caching

---

## 🚀 Setup & Development

### Prerequisites

- **Node.js** 18+
- **pnpm** 8+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Environment Variables

Create `.env.local`:

```env
# Optional: API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development Workflow

1. **Start dev server**: `pnpm dev`
2. **Open browser**: http://localhost:3000
3. **Hot reload**: Changes auto-reload
4. **Type checking**: TypeScript in watch mode
5. **Linting**: ESLint on save

### Code Structure Guidelines

- **Components**: One component per file
- **Hooks**: Custom hooks in `hooks/`
- **Utilities**: Shared utilities in `lib/`
- **Types**: Type definitions in `types/`
- **Stores**: State management in `stores/`

---

## 🧪 Testing

### Testing Strategy

We follow industry best practices:

#### **Unit Tests**

Test individual components and utilities:

```typescript
// Example: Component test
describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-primary');
  });
});
```

#### **Integration Tests**

Test component interactions:

```typescript
// Example: Integration test
describe('MaterialLibrary', () => {
  it('updates material when selected', async () => {
    const { result } = renderHook(() => useConfiguratorStore());
    // Test material selection flow
  });
});
```

#### **E2E Tests**

Test complete user workflows:

```typescript
// Example: E2E test
test('user can customize shirt', async () => {
  await page.goto('/');
  await page.click('[data-testid="material-selector"]');
  await page.click('[data-testid="material-cotton"]');
  // Verify material applied
});
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Main user flows covered

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

### Testing Best Practices

1. **Test behavior, not implementation**
2. **Use meaningful test names**
3. **Keep tests isolated**
4. **Mock external dependencies**
5. **Test edge cases**
6. **Maintain test coverage**

---

## 📦 Build & Deployment

### Production Build

```bash
# Build optimized production bundle
pnpm build

# Analyze bundle size
pnpm build:analyze
```

### Build Output

- **`.next/`** - Next.js build output
- **`public/`** - Static assets
- **Optimized bundles** - Code-split chunks
- **Static pages** - Pre-rendered pages

### Deployment

#### **Vercel** (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

#### **Docker**

```bash
# Build image
docker build -t shirt-configurator-client .

# Run container
docker run -p 3000:3000 shirt-configurator-client
```

#### **Other Platforms**

- **Netlify** - Automatic deployments
- **Railway** - Simple deployment
- **AWS Amplify** - AWS integration
- **Cloudflare Pages** - Edge deployment

---

## 🔍 Debugging

### Development Tools

- **React DevTools** - Component inspection
- **Three.js Inspector** - 3D scene debugging
- **Redux DevTools** - State inspection (Zustand)
- **Performance Profiler** - React Profiler

### Common Issues

**3D Model Not Loading:**
- Check model path in `public/models/`
- Verify GLB/GLTF format
- Check browser console for errors

**Material Not Applying:**
- Verify material ID exists in `data/materials.json`
- Check material texture paths
- Inspect Three.js material in console

**Performance Issues:**
- Use React Profiler to identify slow components
- Check Three.js render stats
- Monitor bundle size

---

## 📚 Additional Resources

- **[UI Philosophy](./docs/UI_PHILOSOPHY.md)** - Design system documentation
- **[Component Examples](./docs/components/)** - Component usage examples
- **[Main README](../README.md)** - Project overview
- **[Server README](../server/README.md)** - Backend documentation

---

<div align="center">

**Built with modern web technologies and best practices**

[Report Issues](https://github.com/your-repo/issues) • [Contribute](../CONTRIBUTING.md)

</div>

