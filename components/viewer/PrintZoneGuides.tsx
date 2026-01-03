'use client';

/**
 * PrintZoneGuides Component
 * Better visual guides with smooth animations and interactive highlights
 */

import { useMemo, useEffect, useRef } from 'react';
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
 * Individual zone guide component with enhanced visuals and animations
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
  const meshRef = useRef<THREE.Mesh>(null);
  const outlineRef = useRef<THREE.LineSegments>(null);

  // Create geometry for zone visualization
  const geometry = useMemo(() => {
    const width = zone.uvBounds.maxU - zone.uvBounds.minU;
    const height = zone.uvBounds.maxV - zone.uvBounds.minV;
    return new THREE.PlaneGeometry(width * 2, height * 2);
  }, [zone.uvBounds]);

  // Create outline geometry
  const outlineGeometry = useMemo(() => {
    const edges = new THREE.EdgesGeometry(geometry);
    return edges;
  }, [geometry]);

  // Material with smooth color transitions
  const material = useMemo(() => {
    const baseColor = isHighlighted ? 0x3B82F6 : 0x10B981; // Blue when highlighted, green otherwise
    const opacity = isHighlighted ? 0.4 : 0.15;
    
    return new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [isHighlighted]);

  // Outline material
  const outlineMaterial = useMemo(() => {
    const color = isHighlighted ? 0x3B82F6 : 0x10B981;
    return new THREE.LineBasicMaterial({
      color: color,
      linewidth: isHighlighted ? 3 : 2,
      transparent: true,
      opacity: isHighlighted ? 0.8 : 0.5,
    });
  }, [isHighlighted]);

  // Position the guide
  const position = useMemo(() => {
    const centerU = (zone.uvBounds.minU + zone.uvBounds.maxU) / 2;
    const centerV = (zone.uvBounds.minV + zone.uvBounds.maxV) / 2;
    return [centerU, centerV, 0] as [number, number, number];
    
    const box = new THREE.Box3().setFromObject(modelGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    return [
      center.x + (centerU - 0.5) * size.x * 0.5,
      center.y + (0.5 - centerV) * size.y * 0.5,
      center.z + size.z * 0.01,
    ] as [number, number, number];
  }, [zone.uvBounds, modelGroup]);

  // Animate highlight transition
  useEffect(() => {
    if (!meshRef.current || !outlineRef.current) return;

    const targetOpacity = isHighlighted ? 0.4 : 0.15;
    const targetOutlineOpacity = isHighlighted ? 0.8 : 0.5;
    const targetScale = isHighlighted ? 1.05 : 1.0;

    const startTime = Date.now();
    const duration = 300; // 300ms animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      if (meshRef.current) {
        const material = meshRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = 0.15 + (targetOpacity - 0.15) * easeProgress;
        meshRef.current.scale.setScalar(1.0 + (targetScale - 1.0) * easeProgress);
      }

      if (outlineRef.current) {
        const material = outlineRef.current.material as THREE.LineBasicMaterial;
        material.opacity = 0.5 + (targetOutlineOpacity - 0.5) * easeProgress;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isHighlighted]);

  // Pulse animation for highlighted zones
  useEffect(() => {
    if (!isHighlighted || !meshRef.current) return;

    const startTime = Date.now();
    const pulseDuration = 2000; // 2 seconds per pulse

    const pulse = () => {
      const elapsed = (Date.now() - startTime) % pulseDuration;
      const progress = (Math.sin((elapsed / pulseDuration) * Math.PI * 2) + 1) / 2;
      const scale = 1.0 + progress * 0.05; // Pulse between 1.0 and 1.05

      if (meshRef.current) {
        meshRef.current.scale.setScalar(scale);
      }

      requestAnimationFrame(pulse);
    };

    const animationId = requestAnimationFrame(pulse);
    return () => cancelAnimationFrame(animationId);
  }, [isHighlighted]);

  return (
    <group position={position}>
      {/* Main zone plane */}
      <mesh ref={meshRef} geometry={geometry} material={material} />
      
      {/* Outline */}
      <lineSegments ref={outlineRef} geometry={outlineGeometry} material={outlineMaterial} />
      
      {/* Zone label (optional - can be added with Text from drei) */}
    </group>
  );
}
