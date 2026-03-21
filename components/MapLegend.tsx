"use client";

import { MapPin, Info } from "lucide-react";

export default function MapLegend() {
  return (
    <div className="flex justify-end absolute bottom-4 right-4">
      <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs border border-gray-200">
        <h3 className="font-semibold text-sm mb-2.5 text-[#0f1f4b]">Légende de la carte</h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1 rounded-full">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-[12px] text-gray-700">Travaux complétés</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-[11px] text-gray-500">
            <Info className="h-3.5 w-3.5" />
            <span>Cliquez sur un marqueur pour plus d&apos;informations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
