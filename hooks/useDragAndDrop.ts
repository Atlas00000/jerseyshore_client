'use client';

/**
 * useDragAndDrop Hook
 * Provides drag and drop functionality with visual feedback
 */

import { useState, useCallback, useRef, DragEvent } from 'react';

interface UseDragAndDropOptions {
  onDrop?: (files: File[]) => void;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  accept?: string[]; // MIME types to accept (e.g., ['image/png', 'image/jpeg'])
  multiple?: boolean;
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}) {
  const { onDrop, onDragEnter, onDragLeave, accept, multiple = false } = options;
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounterRef.current++;
      if (dragCounterRef.current === 1) {
        setIsDragging(true);
        onDragEnter?.();
      }
    },
    [onDragEnter]
  );

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsDragging(false);
        onDragLeave?.();
      }
    },
    [onDragLeave]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounterRef.current = 0;
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);

      // Filter by accepted types if specified
      const filteredFiles = accept
        ? files.filter((file) => accept.some((type) => file.type.includes(type.split('/')[1])))
        : files;

      if (filteredFiles.length > 0) {
        const filesToDrop = multiple ? filteredFiles : [filteredFiles[0]];
        onDrop?.(filesToDrop);
      }
    },
    [onDrop, accept, multiple]
  );

  return {
    isDragging,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}

