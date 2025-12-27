import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ComponentType, ComponentMap } from '@/types/models';
import { PatternApplication } from '@/types/patterns';
import { PrintApplication } from '@/types/prints';
import { DesignState, createDesignStateSnapshot, areDesignStatesEqual } from '@/lib/designState';

type Mode = 'blank' | 'branded';

const MAX_HISTORY_STEPS = 10;

interface ConfiguratorState {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
  componentMap: ComponentMap;
  setComponentMap: (map: ComponentMap) => void;
  selectedComponent: ComponentType | null;
  setComponent: (component: ComponentType | null) => void;
  materialMap: Record<ComponentType, string | null>; // Maps component to material ID
  setMaterial: (component: ComponentType, materialId: string | null) => void;
  colorMap: Record<ComponentType, string | null>; // Maps component to hex color
  setColor: (component: ComponentType, color: string | null) => void;
  recentColors: string[]; // Last 8 colors used
  addRecentColor: (color: string) => void;
  patternMap: Record<ComponentType, PatternApplication | null>; // Maps component to pattern application
  setPattern: (component: ComponentType, pattern: PatternApplication | null) => void;
  printMap: Record<ComponentType, PrintApplication[]>; // Maps component to array of print applications
  addPrint: (component: ComponentType, print: PrintApplication) => void;
  updatePrint: (component: ComponentType, printId: string, updates: Partial<PrintApplication>) => void;
  removePrint: (component: ComponentType, printId: string) => void;
  setPrintOrder: (component: ComponentType, printIds: string[]) => void; // Reorder prints by ID array
  clearAllPrints: () => void;
  clearComponentPrints: (component: ComponentType) => void;
  // Undo/Redo
  history: DesignState[];
  historyIndex: number;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set, get) => ({
      currentMode: 'blank',
      setMode: (mode) => {
        set({ currentMode: mode });
        get().saveToHistory();
      },
      componentMap: {},
      setComponentMap: (map) => set({ componentMap: map }),
      selectedComponent: null,
      setComponent: (component) => set({ selectedComponent: component }),
      materialMap: {} as Record<ComponentType, string | null>,
      setMaterial: (component, materialId) => {
        set((state) => ({
          materialMap: { ...state.materialMap, [component]: materialId },
        }));
        get().saveToHistory();
      },
      colorMap: {} as Record<ComponentType, string | null>,
      setColor: (component, color) => {
        set((state) => {
          const newColorMap = { ...state.colorMap, [component]: color };
          if (color) {
            // Add to recent colors
            const colors = [color, ...state.recentColors.filter((c) => c !== color)].slice(0, 8);
            return { colorMap: newColorMap, recentColors: colors };
          }
          return { colorMap: newColorMap };
        });
        get().saveToHistory();
      },
      recentColors: [],
      addRecentColor: (color) =>
        set((state) => {
          const colors = [color, ...state.recentColors.filter((c) => c !== color)].slice(0, 8);
          return { recentColors: colors };
        }),
      patternMap: {} as Record<ComponentType, PatternApplication | null>,
      setPattern: (component, pattern) => {
        set((state) => ({
          patternMap: { ...state.patternMap, [component]: pattern },
        }));
        get().saveToHistory();
      },
      printMap: {} as Record<ComponentType, PrintApplication[]>,
      addPrint: (component, print) => {
        set((state) => {
          const existingPrints = state.printMap[component] || [];
          // Assign zIndex if not provided (highest existing + 1)
          if (print.zIndex === undefined) {
            const maxZIndex = existingPrints.length > 0
              ? Math.max(...existingPrints.map(p => p.zIndex || 0))
              : 0;
            print.zIndex = maxZIndex + 1;
          }
          // Ensure blendMode is set
          if (!print.blendMode) {
            print.blendMode = BlendMode.NORMAL;
          }
          return {
            printMap: {
              ...state.printMap,
              [component]: [...existingPrints, print],
            },
          };
        });
        get().saveToHistory();
      },
      updatePrint: (component, printId, updates) => {
        set((state) => {
          const prints = state.printMap[component] || [];
          const updatedPrints = prints.map((p) =>
            p.id === printId ? { ...p, ...updates } : p
          );
          return {
            printMap: {
              ...state.printMap,
              [component]: updatedPrints,
            },
          };
        });
        get().saveToHistory();
      },
      removePrint: (component, printId) => {
        set((state) => {
          const prints = state.printMap[component] || [];
          const filteredPrints = prints.filter((p) => p.id !== printId);
          return {
            printMap: {
              ...state.printMap,
              [component]: filteredPrints,
            },
          };
        });
        get().saveToHistory();
      },
      setPrintOrder: (component, printIds) => {
        set((state) => {
          const prints = state.printMap[component] || [];
          const printMapById = new Map(prints.map((p) => [p.id, p]));
          const orderedPrints = printIds
            .map((id) => printMapById.get(id))
            .filter((p): p is PrintApplication => p !== undefined);
          // Add any prints not in the order array at the end
          const remainingPrints = prints.filter((p) => !printIds.includes(p.id));
          return {
            printMap: {
              ...state.printMap,
              [component]: [...orderedPrints, ...remainingPrints].map((p, index) => ({
                ...p,
                zIndex: index,
              })),
            },
          };
        });
        get().saveToHistory();
      },
      clearAllPrints: () => {
        set({ printMap: {} as Record<ComponentType, PrintApplication[]> });
        get().saveToHistory();
      },
      clearComponentPrints: (component) => {
        set((state) => ({
          printMap: {
            ...state.printMap,
            [component]: [],
          },
        }));
        get().saveToHistory();
      },
      // Undo/Redo
      history: [],
      historyIndex: -1,
      saveToHistory: () => {
        const state = get();
        const snapshot = createDesignStateSnapshot({
          currentMode: state.currentMode,
          componentMap: state.componentMap,
          materialMap: state.materialMap,
          colorMap: state.colorMap,
          selectedComponent: state.selectedComponent,
          patternMap: state.patternMap,
          printMap: state.printMap,
        });

        // Initialize history if empty
        if (state.history.length === 0) {
          set({ history: [snapshot], historyIndex: 0 });
          return;
        }

        // Don't save if it's the same as the current state
        if (state.historyIndex >= 0 && state.historyIndex < state.history.length) {
          const currentState = state.history[state.historyIndex];
          if (areDesignStatesEqual(snapshot, currentState)) {
            return;
          }
        }

        // Remove any history after current index (when undoing and making new changes)
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);

        // Limit history size
        if (newHistory.length > MAX_HISTORY_STEPS) {
          newHistory.shift();
          set({ history: newHistory, historyIndex: newHistory.length - 1 });
        } else {
          set({ history: newHistory, historyIndex: newHistory.length - 1 });
        }
      },
      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const previousState = state.history[state.historyIndex - 1];
          set({
            currentMode: previousState.mode,
            componentMap: previousState.componentMap,
            materialMap: previousState.materialMap,
            colorMap: previousState.colorMap,
            patternMap: previousState.patternMap,
            printMap: previousState.printMap,
            selectedComponent: previousState.selectedComponent,
            historyIndex: state.historyIndex - 1,
          });
        }
      },
      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const nextState = state.history[state.historyIndex + 1];
          set({
            currentMode: nextState.mode,
            componentMap: nextState.componentMap,
            materialMap: nextState.materialMap,
            colorMap: nextState.colorMap,
            patternMap: nextState.patternMap,
            printMap: nextState.printMap,
            selectedComponent: nextState.selectedComponent,
            historyIndex: state.historyIndex + 1,
          });
        }
      },
      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },
      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },
    }),
    {
      name: 'shirt-configurator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentMode: state.currentMode,
        materialMap: state.materialMap,
        colorMap: state.colorMap,
        recentColors: state.recentColors,
      }),
    }
  )
);

