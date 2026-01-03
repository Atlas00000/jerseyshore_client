'use client';

/**
 * LoadingSpinner Component
 * Modern spinner design with smooth animations and progress indicators
 */

import { Html } from '@react-three/drei';
import { Spinner } from '@/components/ui/Loading';
import { MotionDiv } from '@/lib/animations/framerMotion';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
}

export function LoadingSpinner({ message = 'Loading model...', progress }: LoadingSpinnerProps) {
  return (
    <Html center>
      <MotionDiv
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4 p-6 bg-base-white/90 backdrop-blur-md rounded-large shadow-level-4"
      >
        <Spinner size="lg" color="text-accent-blue" />
        <div className="text-center space-y-2">
          <p className="text-small font-medium text-text-primary">{message}</p>
          {progress !== undefined && (
            <div className="w-48">
              <div className="flex items-center justify-between mb-1">
                <span className="text-tiny text-text-secondary">Progress</span>
                <span className="text-tiny font-medium text-accent-blue">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-base-light-gray rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </MotionDiv>
    </Html>
  );
}
