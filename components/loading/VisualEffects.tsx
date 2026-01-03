/**
 * Visual Effects Components
 * Reusable animated visual effects for loading and error pages
 */

'use client';

import { motion } from 'framer-motion';

/**
 * Animated Gradient Background
 * Dynamic gradient with flowing colors
 */
export function AnimatedGradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Cyan Gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 245, 255, 0.3) 0%, transparent 50%)',
        }}
        animate={{
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Magenta Gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 80% 50%, rgba(255, 0, 245, 0.3) 0%, transparent 50%)',
        }}
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Emerald Gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 80%, rgba(0, 255, 136, 0.2) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Rotating Gradient Overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(255, 0, 245, 0.1) 100%)',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

/**
 * Floating Particles
 * Animated particles floating across the screen
 */
interface ParticleProps {
  delay?: number;
  duration?: number;
  size?: number;
  color?: string;
}

export function FloatingParticle({ 
  delay = 0, 
  duration = 10, 
  size = 4,
  color = 'rgba(0, 245, 255, 0.6)'
}: ParticleProps) {
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const endX = startX + (Math.random() - 0.5) * 50;
  const endY = startY + (Math.random() - 0.5) * 50;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      animate={{
        x: [`${endX - startX}vw`, `${(endX - startX) * 2}vw`, `${endX - startX}vw`],
        y: [`${endY - startY}vh`, `${(endY - startY) * 2}vh`, `${endY - startY}vh`],
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/**
 * Particle Field
 * Multiple floating particles
 */
export function ParticleField({ count = 30 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 8,
    size: 3 + Math.random() * 4,
    color: [
      'rgba(0, 245, 255, 0.6)', // Cyan
      'rgba(255, 0, 245, 0.6)', // Magenta
      'rgba(0, 255, 136, 0.6)', // Emerald
    ][Math.floor(Math.random() * 3)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          size={particle.size}
          color={particle.color}
        />
      ))}
    </div>
  );
}

/**
 * Pulsing Glow Orb
 * Large glowing orb with pulsing animation
 */
export function PulsingGlowOrb({ 
  size = 400, 
  color = 'rgba(0, 245, 255, 0.3)',
  position = { x: '50%', y: '50%' }
}: { 
  size?: number; 
  color?: string;
  position?: { x: string; y: string };
}) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/**
 * Animated Grid
 * Animated grid pattern with flowing lines
 */
export function AnimatedGrid() {
  return (
    <div className="absolute inset-0 opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(0, 245, 255, 0.3)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          animate={{
            x: [0, 60, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Electric Pulse
 * Electric pulse effect radiating from center
 */
export function ElectricPulse() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            borderColor: i % 2 === 0 ? 'rgba(0, 245, 255, 0.5)' : 'rgba(255, 0, 245, 0.5)',
            width: 200 + i * 100,
            height: 200 + i * 100,
          }}
          animate={{
            scale: [0.8, 1.5, 0.8],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

