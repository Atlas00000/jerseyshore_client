'use client';

/**
 * Toast Store
 * Zustand store for managing toast notifications
 */

import { create } from 'zustand';
import { Toast } from '@/components/ui/Toast';

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastIdCounter = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast_${Date.now()}_${toastIdCounter++}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Convenience functions
export const toast = {
  success: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
    useToastStore.getState().addToast({ message, type: 'success', ...options });
  },
  error: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
    useToastStore.getState().addToast({ message, type: 'error', ...options });
  },
  warning: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
    useToastStore.getState().addToast({ message, type: 'warning', ...options });
  },
  info: (message: string, options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
    useToastStore.getState().addToast({ message, type: 'info', ...options });
  },
};

