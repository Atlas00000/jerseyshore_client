/**
 * Loading Screen Component
 * Visually stunning and interactive loading screen with particle effects,
 * animated gradients, and progress indicators
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AnimatedGradientBackground, 
  ParticleField, 
  PulsingGlowOrb,
  ElectricPulse 
} from './VisualEffects';

interface LoadingScreenProps {
  progress?: number; // 0-100
  message?: string;
  onComplete?: () => void;
}

export function LoadingScreen({ 
  progress = 0, 
  message = 'Loading...',
  onComplete 
}: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Animate progress
  useEffect(() => {
    if (progress >= 100 && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete?.();
      }, 1000);
    }
    
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress, isComplete, onComplete]);

  return (
    <div className="fixed inset-0 z-max bg-base-charcoal overflow-hidden">
      {/* Background Effects */}
      <AnimatedGradientBackground />
      <ParticleField count={40} />
      
      {/* Glow Orbs */}
      <PulsingGlowOrb 
        size={500} 
        color="rgba(0, 245, 255, 0.2)"
        position={{ x: '20%', y: '30%' }}
      />
      <PulsingGlowOrb 
        size={400} 
        color="rgba(255, 0, 245, 0.2)"
        position={{ x: '80%', y: '70%' }}
      />
      <PulsingGlowOrb 
        size={350} 
        color="rgba(0, 255, 136, 0.15)"
        position={{ x: '50%', y: '80%' }}
      />

      {/* Electric Pulse Effect */}
      <ElectricPulse />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Animated Logo/Icon */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
        >
          <div className="relative">
            {/* Outer Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-accent-cyan"
              style={{ width: 120, height: 120, margin: '-60px' }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
            
            {/* Inner Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent-magenta"
              style={{ width: 100, height: 100, margin: '-50px' }}
              animate={{
                rotate: -360,
                scale: [1, 1.15, 1],
              }}
              transition={{
                rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            {/* Center Icon */}
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-primary relative z-10">
              <motion.svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </motion.svg>
            </div>
          </div>
        </motion.div>

        {/* Loading Message */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h1
            className="text-h1 font-bold mb-2 text-glow-cyan"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {message}
          </motion.h1>
          <motion.p
            className="text-body text-text-secondary"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          >
            Preparing your experience...
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Progress Track */}
          <div className="relative h-2 bg-base-charcoal-gray rounded-full overflow-hidden border border-base-dark-border">
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.3), transparent)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            {/* Progress Fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full shadow-glow-primary"
              style={{
                width: `${displayProgress}%`,
              }}
              transition={{
                width: { duration: 0.3, ease: 'easeOut' },
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>

          {/* Progress Percentage */}
          <motion.div
            className="text-center mt-4"
            key={Math.floor(displayProgress)}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-h3 font-bold text-accent-cyan text-glow-cyan">
              {Math.round(displayProgress)}%
            </span>
          </motion.div>
        </motion.div>

        {/* Loading Dots Animation */}
        <motion.div
          className="flex gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-accent-cyan"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Completion Animation */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-h1 font-bold text-accent-emerald text-glow-emerald"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ✓
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

