'use client';

import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PrintZone } from '@/types/zones';
import { useConfiguratorStore } from '@/stores/configuratorStore';
import { ComponentType } from '@/types/models';
import zonesData from '@/data/zones.json';
import { PrintZoneLibrary } from '@/types/zones';

interface PrintZoneGuidesProps {
  modelGroup: THREE.Group | null;
  showGuides?: boolean;
  highlightZoneId?: string | null;
}

/**
 * Component that renders visual guides for print placement zones on the 3D model
 */
export function PrintZoneGuides({
  modelGroup,
  showGuides = true,
  highlightZoneId = null,
}: PrintZoneGuidesProps) {
  const { selectedComponent } = useConfiguratorStore();
  const zones = useMemo(() => {
    const zoneLibrary = zonesData as PrintZoneLibrary;
    return zoneLibrary.zones;
  }, []);

  // Filter zones for selected component
  const relevantZones = useMemo(() => {
    if (!selectedComponent) return [];
    return zones.filter((zone) => zone.component === selectedComponent);
  }, [zones, selectedComponent]);

  // Don't render if no zones or guides disabled
  if (!showGuides || relevantZones.length === 0 || !modelGroup) {
    return null;
  }

  return (
    <>
      {relevantZones.map((zone) => (
        <ZoneGuide
          key={zone.id}
          zone={zone}
          modelGroup={modelGroup}
          isHighlighted={highlightZoneId === zone.id}
        />
      ))}
    </>
  );
}

/**
 * Individual zone guide component
 */
function ZoneGuide({
  zone,
  modelGroup,
  isHighlighted,
}: {
  zone: PrintZone;
  modelGroup: THREE.Group;
  isHighlighted: boolean;
}) {
  // Create a plane or wireframe to visualize the zone
  // For now, we'll create a simple visualization using a plane positioned at the zone's UV bounds
  
  // This is a simplified visualization - in a full implementation,
  // you'd project the UV bounds onto the 3D model surface
  const geometry = useMemo(() => {
    const width = zone.uvBounds.maxU - zone.uvBounds.minU;
    const height = zone.uvBounds.maxV - zone.uvBounds.minV;
    return new THREE.PlaneGeometry(width * 2, height * 2);
  }, [zone.uvBounds]);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: isHighlighted ? 0x00aaff : 0x00ff00,
      transparent: true,
      opacity: isHighlighted ? 0.3 : 0.1,
      side: THREE.DoubleSide,
      wireframe: !isHighlighted,
    });
  }, [isHighlighted]);

  // Position the guide (simplified - would need proper UV to 3D mapping)
  const position = useMemo(() => {
    // Center of UV bounds
    const centerU = (zone.uvBounds.minU + zone.uvBounds.maxU) / 2;
    const centerV = (zone.uvBounds.minV + zone.uvBounds.maxV) / 2;
    
    // Get bounding box of model to position guide
    const box = new THREE.Box3().setFromObject(modelGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Approximate position based on UV coordinates
    // This is a simplified approach - proper implementation would project UV to 3D
    return [
      center.x + (centerU - 0.5) * size.x * 0.5,
      center.y + (0.5 - centerV) * size.y * 0.5,
      center.z + size.z * 0.01, // Slightly in front
    ];
  }, [zone.uvBounds, modelGroup]);

  return (
    <mesh geometry={geometry} material={material} position={position}>
      {/* Optional: Add text label */}
    </mesh>
  );
}

