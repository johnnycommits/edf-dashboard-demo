import { parseISO, isWithinInterval } from "date-fns";
import type { WalmartLocation, DailyUsageRecord, LocationSummary } from "./types";
import { walmartLocations } from "./walmart-locations";
import { allUsageRecords } from "./gas-usage";

export function getLocationById(id: string): WalmartLocation {
  const location = walmartLocations.find((l) => l.id === id);
  if (!location) throw new Error(`Location not found: ${id}`);
  return location;
}

export function getUsageByDateRange(
  locationId: string,
  startDate: string,
  endDate: string
): DailyUsageRecord[] {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return allUsageRecords.filter((r) => {
    if (r.locationId !== locationId) return false;
    const date = parseISO(r.date);
    return isWithinInterval(date, { start, end });
  });
}

export function getUsageByMonth(
  locationId: string,
  year: number,
  month: number
): DailyUsageRecord[] {
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;
  return allUsageRecords.filter(
    (r) => r.locationId === locationId && r.date.startsWith(prefix)
  );
}

export function getLocationSummary(locationId: string): LocationSummary {
  const location = getLocationById(locationId);

  // 2026 YTD through Mar 30
  const ytdRecords = getUsageByDateRange(locationId, "2026-01-01", "2026-03-30");
  const allLocationRecords = allUsageRecords.filter((r) => r.locationId === locationId);

  const totalThermsYTD = ytdRecords.reduce((sum, r) => sum + r.thermsUsed, 0);
  const totalCostYTD = ytdRecords.reduce((sum, r) => sum + r.costUSD, 0);
  const avgDailyTherms = Math.round(
    allLocationRecords.reduce((sum, r) => sum + r.thermsUsed, 0) / allLocationRecords.length
  );

  const peakDay = allLocationRecords.reduce((max, r) =>
    r.thermsUsed > max.thermsUsed ? r : max
  );
  const lowestDay = allLocationRecords.reduce((min, r) =>
    r.thermsUsed < min.thermsUsed ? r : min
  );

  // Current month = Mar 2026, previous = Feb 2026
  const currentMonthRecords = getUsageByMonth(locationId, 2026, 3);
  const previousMonthRecords = getUsageByMonth(locationId, 2026, 2);

  const currentMonthUsage = currentMonthRecords.reduce((sum, r) => sum + r.thermsUsed, 0);
  const previousMonthUsage = previousMonthRecords.reduce((sum, r) => sum + r.thermsUsed, 0);
  const changePercent =
    previousMonthUsage > 0
      ? parseFloat((((currentMonthUsage - previousMonthUsage) / previousMonthUsage) * 100).toFixed(1))
      : 0;

  return {
    location,
    avgDailyTherms,
    totalThermsYTD,
    totalCostYTD: parseFloat(totalCostYTD.toFixed(2)),
    peakDay,
    lowestDay,
    currentMonthUsage,
    previousMonthUsage,
    changePercent,
  };
}

export function getAllLocationsSummary(): LocationSummary[] {
  return walmartLocations.map((l) => getLocationSummary(l.id));
}

export function compareLocations(locationIds: string[]): LocationSummary[] {
  return locationIds.map((id) => getLocationSummary(id));
}
