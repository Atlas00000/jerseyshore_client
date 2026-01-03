'use client';

/**
 * FileUploader Component
 * Drag and drop zone with animations, file preview cards, progress indicators, and error handling UI
 */

import { useState, useRef, useCallback } from 'react';
import { processImageFile, ProcessedImage, revokeImageUrl } from '@/lib/imageProcessor';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner, ProgressBar } from '@/components/ui/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverScale } from '@/lib/animations/framerMotion';

interface FileUploaderProps {
  onImageUploaded: (image: ProcessedImage) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function FileUploader({ onImageUploaded, maxFiles = 1, disabled = false }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ProcessedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsProcessing(true);
      setProgress(0);
      setPreview(null);

      try {
        logger.info('Processing uploaded image', {
          context: 'FileUploader',
          metadata: { fileName: file.name, fileSize: file.size, fileType: file.type },
        });

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const processedImage = await processImageFile(file);
        setProgress(100);
        clearInterval(progressInterval);
        
        setPreview(processedImage);
        onImageUploaded(processedImage);

        logger.info('Image processed successfully', {
          context: 'FileUploader',
          metadata: {
            fileName: file.name,
            width: processedImage.width,
            height: processedImage.height,
          },
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to process image';
        setError(errorMessage);
        logger.error('Failed to process image', {
          context: 'FileUploader',
          error: err instanceof Error ? err : new Error(String(err)),
          metadata: { fileName: file.name },
        });
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    },
    [onImageUploaded]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length === 0) {
        setError('Please drop an image file (PNG, JPG, WEBP, SVG)');
        return;
      }

      if (imageFiles.length > maxFiles) {
        setError(`Please drop only ${maxFiles} file${maxFiles > 1 ? 's' : ''}`);
        return;
      }

      handleFile(imageFiles[0]);
    },
    [disabled, maxFiles, handleFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current && !isProcessing) {
      fileInputRef.current.click();
    }
  }, [disabled, isProcessing]);

  const handleRemove = useCallback(() => {
    if (preview?.url) {
      revokeImageUrl(preview.url);
    }
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [preview]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileInputChange}
        disabled={disabled || isProcessing}
        className="hidden"
      />

      <motion.div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? '#3B82F6' : disabled ? '#E2E8F0' : '#CBD5E1',
          backgroundColor: isDragging ? '#DBEAFE' : disabled ? '#F1F5F9' : '#FFFFFF',
        }}
        transition={{ duration: 0.2 }}
        className={`
          relative border-2 border-dashed rounded-large p-8 text-center
          transition-smooth cursor-pointer
          ${disabled || isProcessing ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <div className="w-full max-w-xs">
              <ProgressBar value={progress} showLabel color="primary" />
            </div>
            <p className="text-small text-text-secondary">Processing image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              transition={{ duration: 0.3, repeat: isDragging ? Infinity : 0, repeatType: 'reverse' }}
            >
              <svg
                className="w-16 h-16 text-accent-cyan"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </motion.div>
            <div>
              <p className="text-body font-medium text-text-primary mb-1">
                {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-small text-text-tertiary">
                PNG, JPG, WEBP, SVG (max 10MB)
              </p>
            </div>
            <Button variant="secondary" size="sm" disabled={disabled}>
              Select File
            </Button>
          </div>
        )}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card variant="standard" className="p-4 bg-error-bg border-error">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-error flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-small text-error">{error}</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview Card */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated" className="p-4">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-medium overflow-hidden border-2 border-base-dark-border bg-base-charcoal-gray">
                    <img
                      src={preview.url}
                      alt={preview.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-small font-medium text-text-primary truncate">
                        {preview.file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="neutral" size="sm">
                          {preview.width} × {preview.height}
                        </Badge>
                        <Badge variant="neutral" size="sm">
                          {formatFileSize(preview.file.size)}
                        </Badge>
                      </div>
                    </div>
                    <HoverScale scale={1.1}>
                      <button
                        onClick={handleRemove}
                        className="p-1.5 hover:bg-error-bg rounded-medium transition-smooth text-error"
                        aria-label="Remove file"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </HoverScale>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">
                      Ready
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
