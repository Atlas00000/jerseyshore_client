import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ComponentType } from '@/types/models';

/**
 * Design Metadata Generator
 * Creates metadata about the current design for export
 */

export interface DesignMetadata {
  exportedAt: string;
  version: string;
  mode: 'blank' | 'branded';
  components: {
    component: ComponentType;
    material?: string;
    color?: string;
    prints?: number;
  }[];
  totalPrints: number;
  exportFormat: string;
}

/**
 * Generate metadata for current design
 */
export function generateDesignMetadata(exportFormat: string): DesignMetadata {
  const state = useConfiguratorStore.getState();
  
  const components = Object.values(ComponentType).map((component) => {
    const material = state.materialMap[component] || undefined;
    const color = state.colorMap[component] || undefined;
    const prints = state.printMap[component] || [];
    
    return {
      component,
      material,
      color,
      prints: prints.length,
    };
  });

  const totalPrints = Object.values(state.printMap).reduce(
    (sum, prints) => sum + (prints?.length || 0),
    0
  );

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    mode: state.currentMode,
    components,
    totalPrints,
    exportFormat,
  };
}

/**
 * Format metadata as text string
 */
export function formatMetadataAsText(metadata: DesignMetadata): string {
  const lines = [
    `Shirt Design Export`,
    `==================`,
    `Exported: ${new Date(metadata.exportedAt).toLocaleString()}`,
    `Format: ${metadata.exportFormat.toUpperCase()}`,
    `Mode: ${metadata.mode}`,
    ``,
    `Components:`,
  ];

  metadata.components.forEach((comp) => {
    if (comp.material || comp.color || comp.prints) {
      lines.push(`  ${comp.component}:`);
      if (comp.material) lines.push(`    Material: ${comp.material}`);
      if (comp.color) lines.push(`    Color: ${comp.color}`);
      if (comp.prints) lines.push(`    Prints: ${comp.prints}`);
    }
  });

  lines.push(``);
  lines.push(`Total Prints: ${metadata.totalPrints}`);

  return lines.join('\n');
}

/**
 * Format metadata as JSON
 */
export function formatMetadataAsJSON(metadata: DesignMetadata): string {
  return JSON.stringify(metadata, null, 2);
}

