import { allUsageRecords } from "../lib/data/gas-usage";
import { walmartLocations } from "../lib/data/walmart-locations";
import { getAllLocationsSummary } from "../lib/data/helpers";

console.log(`\n=== EDF Dashboard Data Verification ===\n`);
console.log(`Total records: ${allUsageRecords.length}`);
console.log(`Locations:     ${walmartLocations.length}`);

const thermsAll = allUsageRecords.map((r) => r.thermsUsed);
console.log(`Min therms/day: ${Math.min(...thermsAll)}`);
console.log(`Max therms/day: ${Math.max(...thermsAll)}`);

console.log(`\n--- Records per location ---`);
for (const loc of walmartLocations) {
  const count = allUsageRecords.filter((r) => r.locationId === loc.id).length;
  const locTherms = allUsageRecords
    .filter((r) => r.locationId === loc.id)
    .map((r) => r.thermsUsed);
  console.log(
    `${loc.city.padEnd(16)} ${loc.stateCode}  ${String(count).padStart(4)} records  ` +
      `min=${Math.min(...locTherms)}  max=${Math.max(...locTherms)}`
  );
}

console.log(`\n--- Location Summaries (YTD 2025) ---`);
const summaries = getAllLocationsSummary();
summaries.forEach((s) => {
  console.log(
    `${s.location.city.padEnd(16)} ${s.location.stateCode}  ` +
      `avg ${String(s.avgDailyTherms).padStart(4)} therms/day  ` +
      `YTD cost $${s.totalCostYTD.toFixed(0).padStart(8)}  ` +
      `MoM ${s.changePercent > 0 ? "+" : ""}${s.changePercent}%`
  );
});
