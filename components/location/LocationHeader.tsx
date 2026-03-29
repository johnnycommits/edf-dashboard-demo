"use client";

import { WalmartLocation } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";

interface LocationHeaderProps {
  location: WalmartLocation;
  onBack: () => void;
}

export function LocationHeader({ location, onBack }: LocationHeaderProps) {
  return (
    <header className="border-b border-edf-light-gray">
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col gap-2">
          <button
            onClick={onBack}
            className="text-edf-navy hover:underline inline-flex items-center gap-1 text-sm"
            aria-label="Back to All Locations"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Locations</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-edf-dark leading-tight">
              {location.name}
            </h1>
            <Badge className="bg-blue-50 text-[#003189] border border-blue-200" aria-label="Region">
              {location.region}
            </Badge>
          </div>
          <p className="text-sm text-edf-mid-gray">
            {location.city}, {location.state} · {location.storeType} · {location.storeSizeSqFt.toLocaleString()} sq ft
          </p>
        </div>
      </div>
    </header>
  );
}

