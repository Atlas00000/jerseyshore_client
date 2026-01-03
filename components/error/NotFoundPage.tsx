/**
 * 404 Not Found Page Component
 * Visually stunning and interactive 404 page with animated graphics,
 * interactive elements, and navigation helpers
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  AnimatedGradientBackground, 
  ParticleField, 
  PulsingGlowOrb,
  ElectricPulse 
} from '@/components/loading/VisualEffects';

export function NotFoundPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchText, setGlitchText] = useState('404');

  // Track mouse for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Glitch effect on 404 text
  useEffect(() => {
    const interval = setInterval(() => {
      const glitchChars = ['4', '0', '4', '?', '!', '@', '#', '$'];
      setGlitchText(
        Array.from({ length: 3 }, () => 
          glitchChars[Math.floor(Math.random() * glitchChars.length)]
        ).join('')
      );
      setTimeout(() => setGlitchText('404'), 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-max bg-base-charcoal overflow-hidden">
      {/* Background Effects */}
      <AnimatedGradientBackground />
      <ParticleField count={50} />
      
      {/* Interactive Glow Orbs following mouse */}
      <PulsingGlowOrb 
        size={300} 
        color="rgba(0, 245, 255, 0.15)"
        position={{ 
          x: `${mousePosition.x}%`, 
          y: `${mousePosition.y}%` 
        }}
      />
      <PulsingGlowOrb 
        size={250} 
        color="rgba(255, 0, 245, 0.15)"
        position={{ 
          x: `${100 - mousePosition.x}%`, 
          y: `${100 - mousePosition.y}%` 
        }}
      />

      {/* Electric Pulse Effect */}
      <ElectricPulse />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* 404 Text with Glitch Effect */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        >
          {/* Glitch Layers */}
          <div className="relative">
            {/* Main Text */}
            <motion.h1
              className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-primary leading-none"
              animate={{
                textShadow: [
                  '0 0 20px rgba(0, 245, 255, 0.5)',
                  '0 0 40px rgba(255, 0, 245, 0.5)',
                  '0 0 20px rgba(0, 245, 255, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {glitchText}
            </motion.h1>

            {/* Glitch Overlay */}
            <motion.div
              className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-accent-cyan opacity-0"
              animate={{
                x: [0, -2, 2, 0],
                opacity: [0, 0.3, 0, 0],
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              {glitchText}
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="text-center mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-h2 font-bold mb-4 text-text-primary">
            Page Not Found
          </h2>
          <p className="text-body text-text-secondary mb-2">
            The page you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-small text-text-tertiary">
            Don't worry, we'll help you find your way back.
          </p>
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Home Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/')}
              className="min-w-[200px]"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Button>
          </motion.div>

          {/* Back Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.back()}
              className="min-w-[200px]"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Navigation Cards */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { 
              label: 'Explore', 
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ), 
              action: () => router.push('/') 
            },
            { 
              label: 'Create', 
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              ), 
              action: () => router.push('/') 
            },
            { 
              label: 'Discover', 
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              ), 
              action: () => router.push('/') 
            },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="glass-accent border border-accent-cyan/30 rounded-large p-6 cursor-pointer group"
              whileHover={{ 
                scale: 1.05, 
                borderColor: 'rgba(0, 245, 255, 0.6)',
                boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={item.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <div className="text-center">
                <motion.div
                  className="flex items-center justify-center mb-3 text-accent-cyan"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: 'easeInOut',
                  }}
                >
                  {item.icon}
                </motion.div>
                <p className="text-body font-medium text-text-primary group-hover:text-accent-cyan transition-colors">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            className="w-32 h-32 border-2 border-accent-cyan rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </div>

        <div className="absolute bottom-20 right-10 opacity-20">
          <motion.div
            className="w-24 h-24 border-2 border-accent-magenta rounded-full"
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </div>
      </div>
    </div>
  );
}

