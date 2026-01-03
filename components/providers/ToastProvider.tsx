'use client';

/**
 * ToastProvider Component
 * Provides toast notifications throughout the app
 */

import { ToastContainer } from '@/components/ui/Toast';
import { useToastStore } from '@/stores/toastStore';

export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return <ToastContainer toasts={toasts} onDismiss={removeToast} />;
}

