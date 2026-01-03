'use client';

/**
 * CameraControls Component
 * Enhanced OrbitControls with smooth transitions and better configuration
 */

import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export function CameraControls() {
  const { camera, gl } = useThree();

  // Configure camera controls for smooth interaction
  useEffect(() => {
    // Enable smooth camera transitions
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <OrbitControls
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={10}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      panSpeed={0.8}
      target={[0, 0, 0]}
      makeDefault
    />
  );
}
