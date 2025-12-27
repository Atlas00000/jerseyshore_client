import * as THREE from 'three';

export interface CameraPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

/**
 * Camera presets for different viewing angles
 */
export const CAMERA_PRESETS: Record<string, CameraPreset> = {
  front: {
    name: 'Front',
    position: [0, 0, 5],
    target: [0, 0, 0],
  },
  back: {
    name: 'Back',
    position: [0, 0, -5],
    target: [0, 0, 0],
  },
  left: {
    name: 'Left Side',
    position: [-5, 0, 0],
    target: [0, 0, 0],
  },
  right: {
    name: 'Right Side',
    position: [5, 0, 0],
    target: [0, 0, 0],
  },
  top: {
    name: 'Top',
    position: [0, 5, 0],
    target: [0, 0, 0],
  },
  detail: {
    name: 'Detail View',
    position: [0, 1, 3],
    target: [0, 1, 0],
  },
  threeQuarter: {
    name: 'Three Quarter',
    position: [3, 2, 3],
    target: [0, 0, 0],
  },
};

/**
 * Get camera preset by name
 */
export function getCameraPreset(name: string): CameraPreset | null {
  return CAMERA_PRESETS[name] || null;
}

/**
 * Apply camera preset to Three.js camera
 */
export function applyCameraPreset(
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  preset: CameraPreset,
  controls?: { target: THREE.Vector3; update: () => void }
): void {
  camera.position.set(...preset.position);
  if (controls) {
    controls.target.set(...preset.target);
    controls.update();
  }
}



