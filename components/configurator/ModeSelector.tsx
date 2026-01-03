'use client';

/**
 * ModeSelector Component
 * Modern toggle/segmented control with smooth transitions and active state animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { Card } from '@/components/ui/Card';

export function ModeSelector() {
  const { currentMode, setMode } = useConfiguratorStore();

  const modes = [
    {
      id: 'blank' as const,
      label: 'Blank Canvas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'branded' as const,
      label: 'Brand Collection',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
  ];

  return (
    <Card variant="standard" className="p-2">
      <div className="relative flex gap-2 bg-base-charcoal-gray rounded-medium p-1">
        {/* Active indicator */}
        <motion.div
          layout
          className="absolute top-1 bottom-1 bg-white rounded-small shadow-elevation-1"
          style={{
            width: `calc(50% - 4px)`,
            left: currentMode === 'blank' ? '4px' : 'calc(50% + 4px)',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />

        {/* Mode buttons */}
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              className={`
                relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-small
                font-medium text-small transition-smooth
                ${
                  isActive
                    ? 'text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary'
                }
              `}
            >
              <span className={isActive ? 'text-accent-cyan' : 'text-text-tertiary'}>
                {mode.icon}
              </span>
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
