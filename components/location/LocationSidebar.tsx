"use client";

import type { WalmartLocation } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationSidebarProps {
  location: WalmartLocation;
}

export function LocationSidebar({ location }: LocationSidebarProps) {
  const Row = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-edf-mid-gray">{label}</span>
      <span className="text-sm font-medium text-edf-dark text-right ml-4">{value}</span>
    </div>
  );

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-sans font-semibold text-edf-dark">
          Location Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0.5">
          <Row label="Address" value={location.address} />
          <Row label="City/State" value={`${location.city}, ${location.state}`} />
          <Row label="Store Type" value={location.storeType} />
          <Row label="Region" value={location.region} />
          <Row label="Climate Zone" value={location.climateZone} />
          <Row label="Store Size" value={`${location.storeSizeSqFt.toLocaleString()} sq ft`} />
          <Row label="Store Opened" value={location.openedYear} />
        </div>
      </CardContent>
    </Card>
  );
}

