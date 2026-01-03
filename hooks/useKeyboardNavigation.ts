'use client';

/**
 * useKeyboardNavigation Hook
 * Handles keyboard shortcuts and navigation
 */

import { useEffect, useCallback } from 'react';

export type KeyboardModifier = 'ctrl' | 'shift' | 'alt' | 'meta';

export interface KeyboardShortcut {
  key: string;
  modifiers?: KeyboardModifier[];
  handler: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export function useKeyboardNavigation(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      shortcuts.forEach((shortcut) => {
        const { key, modifiers = [], handler, preventDefault = true, stopPropagation = false } = shortcut;

        // Check if the key matches
        if (event.key.toLowerCase() !== key.toLowerCase()) return;

        // Check if all modifiers are pressed
        const modifiersMatch = modifiers.every((mod) => {
          switch (mod) {
            case 'ctrl':
              return event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
            case 'shift':
              return event.shiftKey;
            case 'alt':
              return event.altKey;
            case 'meta':
              return event.metaKey;
            default:
              return false;
          }
        });

        // Check if no extra modifiers are pressed (unless specified)
        const noExtraModifiers =
          modifiers.length === 0 ||
          (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) ||
          modifiersMatch;

        if (modifiersMatch && noExtraModifiers) {
          if (preventDefault) {
            event.preventDefault();
          }
          if (stopPropagation) {
            event.stopPropagation();
          }
          handler(event);
        }
      });
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * Common keyboard shortcuts for the app
 */
export const APP_SHORTCUTS = {
  SAVE: { key: 's', modifiers: ['ctrl'] as KeyboardModifier[] },
  UNDO: { key: 'z', modifiers: ['ctrl'] as KeyboardModifier[] },
  REDO: { key: 'y', modifiers: ['ctrl'] as KeyboardModifier[] },
  RESET: { key: 'r', modifiers: ['ctrl', 'shift'] as KeyboardModifier[] },
  EXPORT: { key: 'e', modifiers: ['ctrl'] as KeyboardModifier[] },
  ESCAPE: { key: 'Escape', modifiers: [] as KeyboardModifier[] },
} as const;

