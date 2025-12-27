'use client';

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

export function Scene() {
  const { currentMode } = useConfiguratorStore();
  const [cameraPreset, setCameraPreset] = useState('front');
  const [lightingPreset, setLightingPreset] = useState('studio');
  
  // Get model path based on current mode
  // For now, using placeholder path - will be updated when model is uploaded
  const modelPath = currentMode === 'blank' 
    ? 'models/blank/blank-shirt.glb'
    : null; // Branded models will be handled later

  return (
    <div className="w-full h-screen bg-gray-100 relative">
      {/* Camera and Lighting Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <CameraPresetButtons onPresetChange={setCameraPreset} />
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <LightingPresetButtons
            currentPreset={lightingPreset}
            onPresetChange={setLightingPreset}
          />
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          preserveDrawingBuffer: true, // Required for canvas export
          alpha: true,
        }}
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

