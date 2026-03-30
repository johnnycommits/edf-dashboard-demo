import type { DailyUsageRecord, WalmartLocation } from "./types";
import { walmartLocations } from "./walmart-locations";

// Seeded pseudo-random for reproducible data
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Monthly average temperatures (°F) by climate zone
const avgTempByClimateAndMonth: Record<string, number[]> = {
  // Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
  cold: [22, 26, 36, 50, 61, 71, 77, 75, 65, 52, 38, 26],
  moderate: [42, 46, 54, 63, 71, 80, 86, 84, 76, 64, 52, 44],
  hot: [56, 60, 68, 76, 84, 94, 100, 98, 90, 78, 65, 57],
};

// Monthly temp variation ± range
const tempVariationByClimate: Record<string, number> = {
  cold: 8,
  moderate: 6,
  hot: 5,
};

// Seasonal usage multipliers by climate zone and month
// [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
const seasonalMultiplierByClimate: Record<string, number[]> = {
  cold: [3.2, 3.0, 2.2, 1.2, 0.9, 0.75, 0.72, 0.74, 0.88, 1.15, 2.0, 3.0],
  moderate: [2.0, 1.9, 1.4, 1.05, 0.95, 1.1, 1.2, 1.15, 1.0, 0.95, 1.5, 1.85],
  hot: [1.35, 1.30, 1.1, 1.0, 1.2, 1.55, 1.75, 1.70, 1.40, 1.05, 1.0, 1.25],
};

// Per-location cost rate ($/therm), consistent across all records for that location
const locationCostRate: Record<string, number> = {};

function getCostRate(locationId: string, seed: number): number {
  if (!locationCostRate[locationId]) {
    locationCostRate[locationId] = 0.88 + seededRandom(seed) * 0.27; // 0.88–1.15
  }
  return locationCostRate[locationId];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function formatDate(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function generateRecordsForLocation(location: WalmartLocation): DailyUsageRecord[] {
  const records: DailyUsageRecord[] = [];

  // Base usage: ~6 therms per 1,000 sqFt
  const baseUsage = (location.storeSizeSqFt / 1000) * 6;

  // Stable cost rate for this location (seeded by location id length * some factor)
  const costRate = getCostRate(
    location.id,
    location.lat * location.lng + location.storeSizeSqFt
  );

  // Generate data from Apr 2025 through Mar 2026 (inclusive)
  const startYear = 2025;
  const startMonth = 4; // Apr
  const endYear = 2026;
  const endMonth = 3; // Mar

  let seedCounter = location.storeSizeSqFt + location.lat * 1000;

  for (let year = startYear; year <= endYear; year++) {
    const mStart = year === startYear ? startMonth : 1;
    const mEnd = year === endYear ? endMonth : 12;

    for (let month = mStart; month <= mEnd; month++) {
      const monthIdx = month - 1;
      const multiplier = seasonalMultiplierByClimate[location.climateZone][monthIdx];
      const avgTemp = avgTempByClimateAndMonth[location.climateZone][monthIdx];
      const tempVariation = tempVariationByClimate[location.climateZone];
      let daysInMonth = getDaysInMonth(year, month);
      // Cap the final month (Mar 2026) at 30 to simulate "today is Mar 30"
      if (year === 2026 && month === 3) {
        daysInMonth = Math.min(daysInMonth, 30);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        seedCounter += 1;

        // Daily random noise ±8%
        const noise = 0.92 + seededRandom(seedCounter) * 0.16;

        // Anomaly: Houston HVAC gas valve stuck open starting Mar 10, 2026
        const isHoustonAnomaly =
          location.id === "WM-HOU-001" &&
          year === 2026 &&
          month === 3 &&
          day >= 10;
        const anomalyMultiplier = isHoustonAnomaly ? 1.65 : 1.0;

        const thermsUsed = Math.round(baseUsage * multiplier * noise * anomalyMultiplier);

        // Daily temp variation
        const tempNoise = (seededRandom(seedCounter + 0.5) - 0.5) * 2 * tempVariation;
        const avgTempF = Math.round(avgTemp + tempNoise);

        const costUSD = parseFloat((thermsUsed * costRate).toFixed(2));

        // Occasional maintenance notes on low-usage anomaly days
        let notes: string | undefined;
        if (location.id === "WM-HOU-001" && year === 2026 && month === 3 && day === 10) {
          notes = "HVAC unit 3 — irregular cycle reported by facilities";
        } else if (location.id === "WM-HOU-001" && year === 2026 && month === 3 && day === 19) {
          notes = "Work order submitted — replacement valve on backorder";
        } else if (seededRandom(seedCounter + 0.7) > 0.98) {
          notes = "HVAC maintenance";
        } else if (seededRandom(seedCounter + 0.9) > 0.995) {
          notes = "Partial store closure";
        }

        records.push({
          date: formatDate(year, month, day),
          locationId: location.id,
          thermsUsed,
          costUSD,
          avgTempF,
          notes,
        });
      }
    }
  }

  return records;
}

function generateUsageData(): DailyUsageRecord[] {
  return walmartLocations.flatMap(generateRecordsForLocation);
}

export const allUsageRecords: DailyUsageRecord[] = generateUsageData();
