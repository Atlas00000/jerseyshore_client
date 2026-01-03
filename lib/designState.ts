import { ComponentType, ComponentMap } from '@/types/models';
import { PatternApplication } from '@/types/patterns';
import { PrintApplication } from '@/types/prints';

/**
 * Design state snapshot
 */
export interface DesignState {
  mode: 'blank' | 'branded';
  componentMap: ComponentMap;
  materialMap: Record<ComponentType, string | null>;
  colorMap: Record<ComponentType, string | null>;
  patternMap: Record<ComponentType, PatternApplication | null>;
  printMap: Record<ComponentType, PrintApplication[]>; // Changed to array to match store
  selectedComponent: ComponentType | null;
  timestamp: number;
}

/**
 * Serialize design state to JSON string
 * @param state - Design state object
 * @returns JSON string
 */
export function serializeDesignState(state: DesignState): string {
  try {
    return JSON.stringify(state);
  } catch (error) {
    console.error('Error serializing design state:', error);
    throw new Error('Failed to serialize design state');
  }
}

/**
 * Deserialize JSON string to design state
 * @param json - JSON string
 * @returns Design state object
 */
export function deserializeDesignState(json: string): DesignState | null {
  try {
    const parsed = JSON.parse(json);
    // Validate structure
    if (
      typeof parsed.mode === 'string' &&
      typeof parsed.componentMap === 'object' &&
      typeof parsed.materialMap === 'object' &&
      typeof parsed.colorMap === 'object' &&
      typeof parsed.patternMap === 'object' &&
      typeof parsed.printMap === 'object'
    ) {
      return parsed as DesignState;
    }
    return null;
  } catch (error) {
    console.error('Error deserializing design state:', error);
    return null;
  }
}

/**
 * Create a design state snapshot from current configurator state
 * @param state - Current configurator state
 * @returns Design state snapshot
 */
export function createDesignStateSnapshot(state: {
  currentMode: 'blank' | 'branded';
  componentMap: ComponentMap;
  materialMap: Record<ComponentType, string | null>;
  colorMap: Record<ComponentType, string | null>;
  patternMap: Record<ComponentType, PatternApplication | null>;
  printMap: Record<ComponentType, PrintApplication[]>; // Changed to array to match store
  selectedComponent: ComponentType | null;
}): DesignState {
  return {
    mode: state.currentMode,
    componentMap: { ...state.componentMap },
    materialMap: { ...state.materialMap },
    colorMap: { ...state.colorMap },
    patternMap: { ...state.patternMap },
    printMap: { ...state.printMap },
    selectedComponent: state.selectedComponent,
    timestamp: Date.now(),
  };
}

/**
 * Compare two design states for equality
 * @param state1 - First design state
 * @param state2 - Second design state
 * @returns true if states are equal
 */
export function areDesignStatesEqual(state1: DesignState, state2: DesignState): boolean {
  return (
    state1.mode === state2.mode &&
    JSON.stringify(state1.componentMap) === JSON.stringify(state2.componentMap) &&
    JSON.stringify(state1.materialMap) === JSON.stringify(state2.materialMap) &&
    JSON.stringify(state1.colorMap) === JSON.stringify(state2.colorMap) &&
    JSON.stringify(state1.patternMap) === JSON.stringify(state2.patternMap) &&
    JSON.stringify(state1.printMap) === JSON.stringify(state2.printMap) &&
    state1.selectedComponent === state2.selectedComponent
  );
}

