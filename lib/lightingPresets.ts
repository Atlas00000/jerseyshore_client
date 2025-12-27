import * as THREE from 'three';

export interface LightingPreset {
  name: string;
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: [number, number, number];
  };
  hemisphere?: {
    color: string;
    groundColor: string;
    intensity: number;
  };
}

/**
 * Lighting presets for different scenarios
 */
export const LIGHTING_PRESETS: Record<string, LightingPreset> = {
  studio: {
    name: 'Studio',
    ambient: {
      color: '#ffffff',
      intensity: 0.6,
    },
    directional: {
      color: '#ffffff',
      intensity: 1.2,
      position: [5, 5, 5],
    },
  },
  outdoor: {
    name: 'Outdoor',
    ambient: {
      color: '#87ceeb',
      intensity: 0.8,
    },
    directional: {
      color: '#ffffff',
      intensity: 1.5,
      position: [10, 10, 5],
    },
    hemisphere: {
      color: '#87ceeb',
      groundColor: '#8b7355',
      intensity: 0.5,
    },
  },
  indoor: {
    name: 'Indoor',
    ambient: {
      color: '#fff5e6',
      intensity: 0.5,
    },
    directional: {
      color: '#fff5e6',
      intensity: 0.8,
      position: [3, 4, 3],
    },
  },
  showroom: {
    name: 'Showroom',
    ambient: {
      color: '#ffffff',
      intensity: 0.4,
    },
    directional: {
      color: '#ffffff',
      intensity: 1.0,
      position: [5, 8, 5],
    },
    hemisphere: {
      color: '#ffffff',
      groundColor: '#808080',
      intensity: 0.3,
    },
  },
  dramatic: {
    name: 'Dramatic',
    ambient: {
      color: '#ffffff',
      intensity: 0.3,
    },
    directional: {
      color: '#ffffff',
      intensity: 1.8,
      position: [8, 6, 8],
    },
  },
};

/**
 * Get lighting preset by name
 */
export function getLightingPreset(name: string): LightingPreset | null {
  return LIGHTING_PRESETS[name] || null;
}

/**
 * Apply lighting preset to Three.js scene
 */
export function applyLightingPreset(scene: THREE.Scene, preset: LightingPreset): void {
  // Clear existing lights
  const lightsToRemove: THREE.Object3D[] = [];
  scene.traverse((object) => {
    if (object instanceof THREE.AmbientLight || object instanceof THREE.DirectionalLight || object instanceof THREE.HemisphereLight) {
      lightsToRemove.push(object);
    }
  });
  lightsToRemove.forEach((light) => scene.remove(light));

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(preset.ambient.color, preset.ambient.intensity);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(
    preset.directional.color,
    preset.directional.intensity
  );
  directionalLight.position.set(...preset.directional.position);
  scene.add(directionalLight);

  // Add hemisphere light if specified
  if (preset.hemisphere) {
    const hemisphereLight = new THREE.HemisphereLight(
      preset.hemisphere.color,
      preset.hemisphere.groundColor,
      preset.hemisphere.intensity
    );
    scene.add(hemisphereLight);
  }
}



