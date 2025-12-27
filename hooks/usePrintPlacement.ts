import { useState, useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PrintApplication } from '@/types/prints';
import { PrintZone, clampPositionToZone, isPositionInZone } from '@/types/zones';
import { ComponentType } from '@/types/models';
import { logger } from '@/lib/logger';

type PlacementMode = 'zone' | 'free';

interface UsePrintPlacementOptions {
  selectedComponent: ComponentType | null;
  selectedZone: PrintZone | null;
  placementMode?: PlacementMode;
  onPlacementComplete?: (application: PrintApplication) => void;
}

interface UsePrintPlacementResult {
  isPlacing: boolean;
  startPlacement: (imageUrl: string, width: number, height: number) => void;
  cancelPlacement: () => void;
  handleModelClick: (event: any) => void;
  currentPlacement: PrintApplication | null;
}

/**
 * Hook for handling print placement on 3D model
 * Supports both zone-based and free placement modes with click-to-place functionality
 */
export function usePrintPlacement({
  selectedComponent,
  selectedZone,
  placementMode = 'zone',
  onPlacementComplete,
}: UsePrintPlacementOptions): UsePrintPlacementResult {
  const { raycaster, camera, scene } = useThree();
  const [isPlacing, setIsPlacing] = useState(false);
  const [currentPlacement, setCurrentPlacement] = useState<PrintApplication | null>(null);
  const placementDataRef = useRef<{
    imageUrl: string;
    width: number;
    height: number;
  } | null>(null);

  const startPlacement = useCallback(
    (imageUrl: string, width: number, height: number) => {
      if (!selectedComponent) {
        logger.warn('Cannot start placement: component not selected', {
          context: 'usePrintPlacement',
          metadata: { selectedComponent },
        });
        return;
      }

      // Zone mode requires a zone
      if (placementMode === 'zone' && !selectedZone) {
        logger.warn('Cannot start zone placement: zone not selected', {
          context: 'usePrintPlacement',
          metadata: { selectedComponent, hasZone: !!selectedZone },
        });
        return;
      }

      placementDataRef.current = { imageUrl, width, height };
      setIsPlacing(true);

      // Determine initial position based on mode
      let initialPosition: { u: number; v: number };
      if (placementMode === 'zone' && selectedZone) {
        initialPosition = clampPositionToZone(selectedZone.defaultPosition, selectedZone);
      } else {
        // Free placement: start at center
        initialPosition = { u: 0.5, v: 0.5 };
      }

      const placement: PrintApplication = {
        id: `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customImageUrl: imageUrl,
        position: {
          x: initialPosition.u,
          y: initialPosition.v,
        },
        scale: 1.0,
        rotation: 0,
        zone: 'front', // Legacy, using zoneId instead
        zoneId: placementMode === 'zone' ? selectedZone?.id : undefined,
        opacity: 1.0,
        component: selectedComponent,
        width,
        height,
      };

      setCurrentPlacement(placement);

      logger.info('Started print placement', {
        context: 'usePrintPlacement',
        metadata: {
          mode: placementMode,
          zoneId: selectedZone?.id,
          component: selectedComponent,
          position: initialPosition,
        },
      });
    },
    [selectedComponent, selectedZone, placementMode]
  );

  const cancelPlacement = useCallback(() => {
    setIsPlacing(false);
    setCurrentPlacement(null);
    placementDataRef.current = null;

    logger.info('Cancelled print placement', {
      context: 'usePrintPlacement',
    });
  }, []);

  const handleModelClick = useCallback(
    (event: any) => {
      if (!isPlacing || !currentPlacement || !placementDataRef.current) {
        return;
      }

      // Zone mode requires a zone
      if (placementMode === 'zone' && !selectedZone) {
        return;
      }

      event.stopPropagation();

      // Update raycaster with mouse position
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Find intersections with meshes
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length === 0) {
        logger.warn('No intersection found on model click', {
          context: 'usePrintPlacement',
        });
        return;
      }

      const intersection = intersects[0];
      const uv = intersection.uv;

      if (!uv) {
        logger.warn('No UV coordinates found at intersection', {
          context: 'usePrintPlacement',
        });
        return;
      }

      // Convert UV to position (0-1 range)
      const position = { u: uv.x, v: uv.y };

      // Handle position based on mode
      let finalPosition: { u: number; v: number };
      if (placementMode === 'zone' && selectedZone) {
        // Clamp to zone bounds
        finalPosition = clampPositionToZone(position, selectedZone);

        // Check if position is in zone
        if (!isPositionInZone(finalPosition, selectedZone)) {
          logger.warn('Click position outside zone bounds', {
            context: 'usePrintPlacement',
            metadata: { position, zoneId: selectedZone.id },
          });
          return;
        }
      } else {
        // Free placement: use position directly, clamp to valid UV range
        finalPosition = {
          u: Math.max(0, Math.min(1, position.u)),
          v: Math.max(0, Math.min(1, position.v)),
        };
      }

      // Update placement with new position
      const updatedPlacement: PrintApplication = {
        ...currentPlacement,
        position: {
          x: finalPosition.u,
          y: finalPosition.v,
        },
      };

      setCurrentPlacement(updatedPlacement);

      logger.info('Print placed at position', {
        context: 'usePrintPlacement',
        metadata: {
          mode: placementMode,
          position: finalPosition,
          zoneId: selectedZone?.id,
        },
      });

      // Complete placement
      if (onPlacementComplete) {
        onPlacementComplete(updatedPlacement);
      }

      setIsPlacing(false);
      setCurrentPlacement(null);
      placementDataRef.current = null;
    },
    [isPlacing, currentPlacement, selectedZone, placementMode, raycaster, camera, scene, onPlacementComplete]
  );

  return {
    isPlacing,
    startPlacement,
    cancelPlacement,
    handleModelClick,
    currentPlacement,
  };
}
