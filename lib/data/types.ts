export interface WalmartLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  storeSizeSqFt: number;
  storeType: "Supercenter" | "Neighborhood Market" | "Sam's Club";
  region: "Northeast" | "Southeast" | "Midwest" | "South" | "West";
  climateZone: "cold" | "moderate" | "hot";
  openedYear: number;
}

export interface DailyUsageRecord {
  date: string; // ISO format: "2024-01-15"
  locationId: string;
  thermsUsed: number;
  costUSD: number;
  avgTempF: number;
  notes?: string;
}

export interface LocationSummary {
  location: WalmartLocation;
  avgDailyTherms: number;
  totalThermsYTD: number;
  totalCostYTD: number;
  peakDay: DailyUsageRecord;
  lowestDay: DailyUsageRecord;
  currentMonthUsage: number;
  previousMonthUsage: number;
  changePercent: number;
}
