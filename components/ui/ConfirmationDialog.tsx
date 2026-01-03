'use client';

/**
 * ConfirmationDialog Component
 * Modal dialog with smooth animations for confirmations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { animation } from '@/lib/design/tokens';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
  loading = false,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const variantStyles = {
    danger: {
      icon: (
        <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmVariant: 'primary' as const,
      confirmClassName: 'bg-error hover:bg-error/90',
    },
    warning: {
      icon: (
        <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmVariant: 'primary' as const,
      confirmClassName: 'bg-warning hover:bg-warning/90',
    },
    info: {
      icon: (
        <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      confirmVariant: 'primary' as const,
      confirmClassName: '',
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: parseFloat(animation.duration.fast) / 1000 }}
            className="fixed inset-0 bg-base-navy/50 backdrop-blur-sm z-overlay"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-max flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: parseFloat(animation.duration.normal) / 1000 }}
              className="bg-base-white rounded-large shadow-level-5 p-6 max-w-md w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                {styles.icon}
              </div>

              {/* Title */}
              <h3 className="text-h4 font-bold text-text-primary text-center mb-2">
                {title}
              </h3>

              {/* Message */}
              <p className="text-small text-text-secondary text-center mb-6">
                {message}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={onClose}
                  disabled={loading}
                  fullWidth
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant={styles.confirmVariant}
                  size="md"
                  onClick={handleConfirm}
                  disabled={loading}
                  loading={loading}
                  fullWidth
                  className={styles.confirmClassName}
                >
                  {confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

