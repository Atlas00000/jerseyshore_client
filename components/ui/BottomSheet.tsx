'use client';

/**
 * BottomSheet Component
 * Mobile-optimized modal that slides up from bottom
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { animation } from '@/lib/design/tokens';
import { Button } from './Button';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxHeight?: string; // e.g., '90vh', '500px'
  showBackdrop?: boolean;
  snapPoints?: number[]; // Percentage heights for snap points (0-100)
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  maxHeight = '90vh',
  showBackdrop = true,
  snapPoints = [50, 90], // Default snap points at 50% and 90%
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleBodyScroll = () => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('keydown', handleEscape);
    handleBodyScroll();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50; // Minimum drag distance to trigger close
    const velocity = info.velocity.y;

    // Close if dragged down significantly or with high velocity
    if (info.offset.y > threshold || velocity > 500) {
      onClose();
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: parseFloat(animation.duration.fast) / 1000 } },
    exit: { opacity: 0, transition: { duration: parseFloat(animation.duration.fast) / 1000 } },
  };

  const sheetVariants = {
    hidden: { y: '100%', transition: { duration: parseFloat(animation.duration.normal) / 1000 } },
    visible: {
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 300,
      },
    },
    exit: {
      y: '100%',
      transition: { duration: parseFloat(animation.duration.normal) / 1000 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showBackdrop && (
            <motion.div
              className="fixed inset-0 bg-base-navy/50 backdrop-blur-sm z-overlay"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
            />
          )}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-max bg-base-white rounded-t-large shadow-level-5 max-h-[90vh] flex flex-col"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ maxHeight }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-base-cool-gray rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 pb-3 border-b border-base-light-gray">
                <h3 className="text-h4 font-bold text-text-primary">{title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

