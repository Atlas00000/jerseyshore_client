'use client';

import { OrbitControls } from '@react-three/drei';

export function CameraControls() {
  return (
    <OrbitControls
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={10}
    />
  );
}

