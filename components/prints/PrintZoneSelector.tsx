'use client';

import { useState, useEffect, useMemo } from 'react';
import { PrintZone } from '@/types/zones';
import { ComponentType } from '@/types/models';
import zonesData from '@/data/zones.json';
import { PrintZoneLibrary } from '@/types/zones';

interface PrintZoneSelectorProps {
  selectedComponent: ComponentType | null;
  selectedZoneId: string | null;
  onZoneSelect: (zoneId: string) => void;
}

export function PrintZoneSelector({
  selectedComponent,
  selectedZoneId,
  onZoneSelect,
}: PrintZoneSelectorProps) {
  const [zones, setZones] = useState<PrintZone[]>([]);

  useEffect(() => {
    const zoneLibrary = zonesData as PrintZoneLibrary;
    setZones(zoneLibrary.zones);
  }, []);

  // Filter zones for selected component
  const availableZones = useMemo(() => {
    if (!selectedComponent) return [];
    return zones.filter((zone) => zone.component === selectedComponent);
  }, [zones, selectedComponent]);

  if (!selectedComponent) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Select a component to choose a print zone.</p>
      </div>
    );
  }

  if (availableZones.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">
          No print zones available for {selectedComponent}.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Print Placement Zones</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select a zone to place your print. Click on the model to position it.
      </p>

      <div className="grid grid-cols-1 gap-2">
        {availableZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneSelect(zone.id)}
            className={`
              p-3 rounded-lg border-2 text-left transition-all
              ${
                selectedZoneId === zone.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{zone.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{zone.description}</p>
              </div>
              {selectedZoneId === zone.id && (
                <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

