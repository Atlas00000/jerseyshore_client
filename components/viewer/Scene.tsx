'use client';

/**
 * Scene Component
 * Floating control panels with glass morphism effects, smooth transitions, and better positioning
 */

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CameraControls } from './CameraControls';
import { ModelLoader } from './ModelLoader';
import { LoadingSpinner } from './LoadingSpinner';
import { CameraPresets, CameraPresetButtons } from './CameraPresets';
import { LightingPresets, LightingPresetButtons } from './LightingPresets';
import { ExportTrigger } from './ExportTrigger';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MotionDiv, AnimatePresence } from '@/lib/animations/framerMotion';

export function Scene() {
  const { currentMode } = useConfiguratorStore();
  const [cameraPreset, setCameraPreset] = useState('front');
  const [lightingPreset, setLightingPreset] = useState('studio');
  const [showControls, setShowControls] = useState(true);
  
  // Get model path based on current mode
  const modelPath = currentMode === 'blank' 
    ? 'models/blank/blank-shirt.glb'
    : null; // Branded models will be handled later

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-dark overflow-hidden relative">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      {/* Floating Control Panels */}
      <AnimatePresence>
        {showControls && (
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 left-4 z-sticky space-y-3 pointer-events-none"
          >
            {/* Camera Presets Panel */}
            <Card variant="glass" className="p-3 pointer-events-auto">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-tiny font-medium text-text-primary uppercase tracking-wide">
                  Camera
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowControls(false)}
                  className="p-1 h-auto"
                  icon={
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  <span className="sr-only">Hide controls</span>
                </Button>
              </div>
              <CameraPresetButtons currentPreset={cameraPreset} onPresetChange={setCameraPreset} />
            </Card>

            {/* Lighting Presets Panel */}
            <Card variant="glass" className="p-3 pointer-events-auto">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-tiny font-medium text-text-primary uppercase tracking-wide">
                  Lighting
                </h4>
              </div>
              <LightingPresetButtons
                currentPreset={lightingPreset}
                onPresetChange={setLightingPreset}
              />
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Toggle Controls Button (when hidden) */}
      <AnimatePresence>
        {!showControls && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 left-4 z-sticky"
          >
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowControls(true)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Controls
            </Button>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: true,
        }}
        className="w-full h-full"
        onError={(error) => {
          logger.error('Canvas error', {
            context: 'Scene',
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <LightingPresets preset={lightingPreset} />
          <CameraPresets preset={cameraPreset} />
          <CameraControls />
          {modelPath && <ModelLoader modelPath={modelPath} />}
          <ExportTrigger />
        </Suspense>
      </Canvas>
    </div>
  );
}
