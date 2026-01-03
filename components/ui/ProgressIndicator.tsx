'use client';

/**
 * ProgressIndicator Component
 * Progress indicator with smooth animations and multiple variants
 */

import { motion } from 'framer-motion';
import { ProgressBar } from './Loading';
import { Badge } from './Badge';
import { animation } from '@/lib/design/tokens';

type ProgressVariant = 'linear' | 'circular' | 'step';

interface ProgressIndicatorProps {
  progress: number; // 0-100
  variant?: ProgressVariant;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  steps?: string[]; // For step variant
  currentStep?: number; // For step variant
}

export function ProgressIndicator({
  progress,
  variant = 'linear',
  size = 'md',
  showLabel = true,
  label,
  color = 'primary',
  steps,
  currentStep,
}: ProgressIndicatorProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  if (variant === 'circular') {
    const sizeMap = { sm: 40, md: 60, lg: 80 };
    const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
    const radius = (sizeMap[size] - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedProgress / 100) * circumference;

    const colorMap = {
      primary: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    };

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={sizeMap[size]}
          height={sizeMap[size]}
          className="transform -rotate-90"
        >
          <circle
            cx={sizeMap[size] / 2}
            cy={sizeMap[size] / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-base-light-gray"
          />
          <motion.circle
            cx={sizeMap[size] / 2}
            cy={sizeMap[size] / 2}
            r={radius}
            stroke={colorMap[color]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: parseFloat(animation.duration.normal) / 1000, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-${size === 'sm' ? 'tiny' : size === 'md' ? 'small' : 'body'} font-medium text-text-primary`}>
              {Math.round(clampedProgress)}%
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'step' && steps) {
    const currentIndex = currentStep !== undefined ? currentStep : Math.floor((clampedProgress / 100) * steps.length);
    const progressPerStep = 100 / steps.length;
    const stepProgress = ((clampedProgress % progressPerStep) / progressPerStep) * 100;

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={index} className="flex-1 flex items-center">
                <div className="flex items-center flex-1">
                  <div
                    className={`
                      flex-1 h-1 rounded-full transition-smooth
                      ${isActive ? `bg-${color}` : 'bg-base-light-gray'}
                    `}
                  />
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      transition-smooth border-2
                      ${
                        isCurrent
                          ? `bg-${color} border-${color} text-white`
                          : isActive
                          ? `bg-${color} border-${color} text-white`
                          : 'bg-base-light-gray border-base-cool-gray text-text-tertiary'
                      }
                    `}
                  >
                    {isActive ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-tiny font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div
                    className={`
                      flex-1 h-1 rounded-full transition-smooth
                      ${index < steps.length - 1 ? (isActive ? `bg-${color}` : 'bg-base-light-gray') : ''}
                    `}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {label && (
          <p className="text-small text-text-secondary text-center mt-2">
            {label}
          </p>
        )}
        {steps[currentIndex] && (
          <p className="text-small font-medium text-text-primary text-center mt-1">
            {steps[currentIndex]}
          </p>
        )}
      </div>
    );
  }

  // Linear variant (default)
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-small font-medium text-text-primary">{label}</span>
          {showLabel && (
            <Badge variant="neutral" size="sm">
              {Math.round(clampedProgress)}%
            </Badge>
          )}
        </div>
      )}
      <ProgressBar
        value={clampedProgress}
        color={color}
        size={size}
        showLabel={!label && showLabel}
      />
    </div>
  );
}

